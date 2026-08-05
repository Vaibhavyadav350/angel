const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncError = require('../middleware/CatchAsyncErrors');
const { updateUserSpend } = require('./userController');
const { alertAdminLowStock } = require('./restockController');
const pdfService = require('../services/pdfService');
const { sendStatusUpdate, sendReturnUpdate, sendOrderConfirmation } = require('../utils/emailService');

// ============================================================================
// ORDER CREATION IS HANDLED EXCLUSIVELY BY webhookController.js
// ============================================================================
// The eWAY callback (redirect after payment) is the SINGLE source of truth
// for creating orders. This prevents:
//   1. Duplicate orders (callback + REST endpoint both firing)
//   2. Unauthorized order creation (the old /api/orders/new had no auth)
//   3. Data inconsistency (callback uses verified eWAY payment data)
// ============================================================================


// Generate PDF Invoice (Australian Tax Invoice)
exports.getOrderInvoice = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(new ErrorHandler('Order not found', 404));

  await pdfService.generateInvoice(order, res);
});

// Generate Warehouse Packing Slip (No Prices - Australian Standard)
exports.getPackingSlip = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(new ErrorHandler('Order not found', 404));

  await pdfService.generatePackingSlip(order, res);
});

// send single order
exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
  if (!req.params.id) {
    return next(new ErrorHandler('Order not found', 400));
  }
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ErrorHandler('Order not found', 404));
  }
  res.status(200).json({
    success: true,
    data: order,
  });
});

// send user orders
exports.getUserOrders = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new ErrorHandler('Order not found', 400));
  }
  const orders = await Order.find({ 'user.email': email }).sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    data: orders || [], // Return empty array instead of 404
  });
});

// send all orders (with advanced filtering)
exports.getAllOrders = catchAsyncError(async (req, res, next) => {
  const { status, minPrice, maxPrice, startDate, endDate, returnStatus } = req.query;
  let query = {};

  if (status) query.orderStatus = status;
  if (returnStatus) {
    if (returnStatus === 'exclude_returns') {
      query.returnStatus = 'none';
    } else if (returnStatus === 'all_returns') {
      query.returnStatus = { $ne: 'none' };
    } else {
      query.returnStatus = returnStatus;
    }
  }
  if (minPrice || maxPrice) {
    query.totalPrice = {};
    if (minPrice) query.totalPrice.$gte = Number(minPrice);
    if (maxPrice) query.totalPrice.$lte = Number(maxPrice);
  }
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const orders = await Order.find(query).sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    data: orders,
  });
});

// update order status
exports.updateOrderStatus = catchAsyncError(async (req, res, next) => {
  if (!req.params.id) {
    return next(new ErrorHandler('Order not found', 400));
  }
  if (!req.body.status) {
    return next(new ErrorHandler('Invalid request', 400));
  }
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ErrorHandler('Order not found', 404));
  }

  // Define valid state progression hierarchy
  const statusHierarchy = {
    'processing': 0,
    'confirmed': 1,
    'shipped': 2,
    'delivered': 3,
    'returned': 4,
    'cancelled': 4
  };

  const currentLevel = statusHierarchy[order.orderStatus];
  const requestedLevel = statusHierarchy[req.body.status];

  // Prevent backtracking or updating terminal states unless it's an admin override that makes sense 
  // (In our strict model, no backtracking is allowed via this UI).
  if (order.orderStatus === 'delivered' || order.orderStatus === 'returned' || order.orderStatus === 'cancelled') {
    return next(new ErrorHandler(`Cannot modify a ${order.orderStatus} order.`, 400));
  }

  if (requestedLevel <= currentLevel) {
    return next(new ErrorHandler(`Invalid state transition. Cannot move from ${order.orderStatus} to ${req.body.status}.`, 400));
  }

  // Stock was already decremented when the order was created (webhookController.js).
  // No need to decrement again when confirming.
  // If transitioning to cancelled, restore stock
  if (req.body.status === 'cancelled' && order.orderStatus !== 'cancelled') {
    for (let index = 0; index < order.orderItems.length; index++) {
      const item = order.orderItems[index];
      const product = await Product.findById(item.product);
      if (!product) continue;

      // Restore the specific size/colour variant, mirroring the decrement in
      // orderService. Adding to the global `stock` field alone was silently lost:
      // productController recomputes `stock` from the variants on every product
      // edit, so the restored quantity vanished the next time the product was saved.
      if (product.variants && product.variants.length > 0) {
        const variant = product.variants.find((v) => v.size === item.size && v.color === item.color);
        if (variant) {
          variant.stock = (Number(variant.stock) || 0) + item.quantity;
          product.markModified('variants');
        } else {
          console.warn(`[ORDER STOCK RESTORE] No matching variant (${item.size}/${item.color}) for ${product.name} — adjusting global only.`);
        }
        product.stock = product.variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
      } else {
        product.stock += item.quantity;
      }

      await product.save({ validateBeforeSave: false });
    }
    console.info(`[ORDER CANCELLED] Order ${order._id} cancelled. Stock restored for ${order.orderItems.length} items.`);
  }

  order.orderStatus = req.body.status;
  if (req.body.status === 'shipped') {
    order.shippingInfo.trackingNumber = req.body.trackingNumber || '';
    order.shippingInfo.carrier = req.body.carrier || 'Australia Post';
  }
  if (req.body.status === 'delivered') {
    order.deliveredAt = Date.now();
  }
  await order.save({ validateBeforeSave: false });

  console.info(`[ORDER STATUS MUTATION] Order: ${order._id} successfully transitioned to '${req.body.status}'.`);

  // Send status email — fire-and-forget so a slow/failing SMTP never delays or
  // breaks the status-change response (consistent with order confirmation).
  if (['shipped', 'delivered', 'cancelled'].includes(req.body.status)) {
    sendStatusUpdate({ name: order.user.name, email: order.user.email }, order, req.body.status === 'shipped' ? req.body.trackingNumber : null)
      .catch((emailError) => console.error(`[EMAIL FAILED] status update for order ${order._id}: ${emailError.message}`));
  }

  res.status(200).json({
    success: true,
    data: order,
  });
});

// delete order
exports.deleteOrder = catchAsyncError(async (req, res, next) => {
  if (!req.params.id) {
    return next(new ErrorHandler('Order not found', 400));
  }
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ErrorHandler('Order not found', 404));
  }

  // Restore stock for each item in the order
  // Stock is decreased when order is created, so restore it when deleted
  for (let index = 0; index < order.orderItems.length; index++) {
    const item = order.orderItems[index];
    const product = await Product.findById(item.product);
    if (product) {
      product.stock += item.quantity;
      await product.save({ validateBeforeSave: false });
    }
  }

  await Order.findByIdAndDelete(req.params.id);

  console.info(`[ORDER DELETED - ADMIN OVERRIDE] Order ${req.params.id} was force deleted and all stock amounts restored.`);

  res.status(200).json({
    success: true,
    message: 'Order deleted and stock restored',
  });
});

// Export Orders to Excel/CSV (Admin)
exports.exportOrdersExcel = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  const XLSX = require('xlsx');

  const data = orders.map(order => ({
    OrderID: order._id.toString(),
    CustomerEmail: order.user.email,
    CustomerName: order.user.name,
    Status: order.orderStatus,
    TotalPrice: order.totalPrice,
    Items: order.orderItems.map(i => `${i.name} (${i.quantity})`).join(', '),
    Date: new Date(order.createdAt).toLocaleDateString()
  }));

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=orders_archive.xlsx');
  res.send(buffer);
});

// Request Return
exports.requestReturn = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(new ErrorHandler('Order not found', 404));

  if (order.orderStatus !== 'delivered') {
    return next(new ErrorHandler('Only delivered orders can be returned', 400));
  }

  if (order.returnStatus !== 'none') {
    return next(new ErrorHandler('Return already requested for this order', 400));
  }

  order.returnStatus = 'requested';
  order.returnReason = req.body.reason;
  order.returnRequestedAt = Date.now();

  await order.save();

  console.info(`[ORDER RETURN INITIATED] Customer requested return for delivered Order ${order._id}. Reason: ${order.returnReason}`);

  res.status(200).json({
    success: true,
    message: 'Return requested successfully',
  });
});

// Update Return Status (Admin)
exports.updateReturnStatus = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(new ErrorHandler('Order not found', 404));

  const { status } = req.body;

  // Return State Machine Validation
  const returnHierarchy = { 'requested': 1, 'approved': 2, 'processing': 3, 'completed': 4, 'rejected': 4 };
  const currentReturnLevel = returnHierarchy[order.returnStatus] || 0;
  const requestedReturnLevel = returnHierarchy[status] || 0;

  if (requestedReturnLevel <= currentReturnLevel) {
    return next(new ErrorHandler(`Invalid return state transition from ${order.returnStatus} to ${status}`, 400));
  }

  if (!['approved', 'rejected', 'processing', 'completed', 'none'].includes(status)) {
    return next(new ErrorHandler('Invalid return status', 400));
  }

  order.returnStatus = status;
  if (status === 'completed') {
    order.orderStatus = 'returned'; // Special status for finalized returns
    order.returnedAt = Date.now();

    // Restore stock for each item in the order
    for (let index = 0; index < order.orderItems.length; index++) {
      const item = order.orderItems[index];
      const product = await Product.findById(item.product);
      if (!product) continue;

      // Restore the specific size/colour variant, mirroring the decrement in
      // orderService. Adding to the global `stock` field alone was silently lost:
      // productController recomputes `stock` from the variants on every product
      // edit, so the restored quantity vanished the next time the product was saved.
      if (product.variants && product.variants.length > 0) {
        const variant = product.variants.find((v) => v.size === item.size && v.color === item.color);
        if (variant) {
          variant.stock = (Number(variant.stock) || 0) + item.quantity;
          product.markModified('variants');
        } else {
          console.warn(`[ORDER STOCK RESTORE] No matching variant (${item.size}/${item.color}) for ${product.name} — adjusting global only.`);
        }
        product.stock = product.variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
      } else {
        product.stock += item.quantity;
      }

      await product.save({ validateBeforeSave: false });
    }
  }

  await order.save();

  console.info(`[RETURN STATUS MUTATION] Return Request for Order ${order._id} transitioned to '${status}'.`);

  // Fire-and-forget — don't block the response on SMTP.
  if (['approved', 'rejected', 'completed'].includes(status)) {
    sendReturnUpdate({ name: order.user.name, email: order.user.email }, order, status)
      .catch((emailError) => console.error(`[EMAIL FAILED] return update for order ${order._id}: ${emailError.message}`));
  }

  res.status(200).json({
    success: true,
    message: `Return status updated to ${status}`,
  });
});

const updateStock = async (id, quantity) => {
  const product = await Product.findById(id);
  if (product.stock < quantity) {
    return false;
  }
  product.stock -= quantity;
  await product.save({ validateBeforeSave: false });

  // Alert admin if stock falls below threshold (e.g., 5)
  if (product.stock < 5) {
    await alertAdminLowStock(product);
  }

  return true;
};
