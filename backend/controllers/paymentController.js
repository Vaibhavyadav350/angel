const Product = require('../models/productModel');
const rapid = require('eway-rapid');

// Initialize eWAY Rapid client
const client = rapid.createClient(
  process.env.EWAY_API_KEY,
  process.env.EWAY_PASSWORD,
  process.env.EWAY_ENDPOINT || 'https://api.sandbox.ewaypayments.com/'
);

const calculateOrderAmount = (shipping_fee, total_amount) => {
  // eWAY requires amount in smallest currency unit (Cents for AUD)
  const totalInDollars = shipping_fee + total_amount;
  return Math.round(totalInDollars * 100);
};

const paymentController = async (req, res) => {
  const { cart, shipping_fee, total_amount, shipping } = req.body;

  // Validation
  if (!cart || !Array.isArray(cart) || cart.length === 0) {
    console.error(`[EWAY CHECKOUT FAILED] Validation Error: Cart is missing or empty. User: ${req.user?.email || req.body.email || 'Guest'}`);
    return res.status(400).json({
      success: false,
      message: 'Cart is required and must not be empty',
    });
  }

  if (typeof shipping_fee !== 'number' || shipping_fee < 0) {
    return res.status(400).json({
      success: false,
      message: 'Shipping fee must be a non-negative number',
    });
  }

  if (typeof total_amount !== 'number' || total_amount <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Total amount must be a positive number',
    });
  }

  if (!shipping || typeof shipping !== 'object') {
    return res.status(400).json({
      success: false,
      message: 'Shipping information is required',
    });
  }

  try {
    console.info(`[EWAY CHECKOUT INITIATED] User: ${req.user?.email || req.body.email || 'Guest'}, Items: ${cart.length}, Total: $${total_amount}, Shipping: $${shipping_fee}`);

    const allowedShippingFees = [0, 15]; // $15 flat rate standard shipping from cart_reducer
    if (!allowedShippingFees.includes(shipping_fee)) {
      console.warn(`[EWAY CHECKOUT WARN] Client sent non-standard shipping fee: ${shipping_fee}`);
    }

    // Race Condition Check: Verify Stock BEFORE creating checkout
    const orderItemsMeta = [];
    for (const item of cart) {
      const productId = item.productId || item.id;
      if (!productId) continue;

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.name}` });
      }

      if (product.stock < item.amount) {
        return res.status(400).json({
          success: false,
          message: `Stock Error: Only ${product.stock} left for ${item.name}.`,
        });
      }

      orderItemsMeta.push({
        id: productId,
        q: item.amount,
        c: item.color || 'Standard',
        s: item.size || 'M',
      });
    }

    const FRONTEND_URL = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',')[0] : 'http://localhost:3000';
    const BACKEND_URL = `http://localhost:${process.env.PORT || 5000}`;

    // Calculate discount
    const discountAmount = Number(req.body.discountAmount) || 0;
    const discountRatio = total_amount > 0 ? discountAmount / total_amount : 0;
    const finalTotal = total_amount - discountAmount + shipping_fee;

    // Build eWAY Responsive Shared Page transaction
    const payload = {
      Customer: {
        FirstName: (req.user?.name || req.body.shipping?.name || 'Guest').split(' ')[0],
        LastName: (req.user?.name || req.body.shipping?.name || 'User').split(' ').slice(1).join(' ') || 'User',
        Email: req.user?.email || req.body.email || 'guest@example.com',
        Phone: req.body.shipping?.phone_number || '',
        Street1: req.body.shipping?.address?.line1 || '',
        City: req.body.shipping?.address?.city || '',
        State: req.body.shipping?.address?.state || '',
        PostalCode: req.body.shipping?.address?.postal_code || '',
        Country: 'au',
      },
      Payment: {
        TotalAmount: Math.round(finalTotal * 100), // Amount in cents
        CurrencyCode: process.env.EWAY_CURRENCY || 'AUD',
        InvoiceNumber: `INV-${Date.now()}`,
        InvoiceDescription: `Angel Fashion Studio Order - ${cart.length} item(s)`,
      },
      // Pack metadata into Options fields (eWAY allows Options.Value1-3, each max 255 chars)
      // We use a compact JSON strategy to stay within limits
      Options: [
        { Value: JSON.stringify({
          userId: req.user?.id || req.body.userId || '',
          userName: req.user?.name || req.body.shipping?.name || 'Guest User',
          userEmail: req.user?.email || req.body.email || 'guest@example.com',
          discountAmount: discountAmount,
          couponCode: req.body.couponCode || '',
          shippingFee: shipping_fee,
          itemsPrice: total_amount,
        })},
        { Value: JSON.stringify(orderItemsMeta) },
        { Value: JSON.stringify({
          shippingLine1: req.body.shipping?.address?.line1 || '',
          shippingCity: req.body.shipping?.address?.city || '',
          shippingState: req.body.shipping?.address?.state || '',
          shippingPostalCode: req.body.shipping?.address?.postal_code || '',
          shippingPhone: req.body.shipping?.phone_number || '',
        })},
      ],
      RedirectUrl: `${BACKEND_URL}/api/payment/callback`,
      CancelUrl: `${FRONTEND_URL}/checkout?canceled=true`,
      TransactionType: 'Purchase',
    };

    const response = await client.createTransaction(rapid.Enum.Method.RESPONSIVE_SHARED, payload);

    if (response.Errors) {
      console.error(`[EWAY CHECKOUT ERROR] eWAY returned errors: ${response.Errors}`);
      return res.status(500).json({
        success: false,
        message: `eWAY Error: ${response.Errors}`,
      });
    }

    console.info(`[EWAY CHECKOUT SUCCESS] Shared Page URL created successfully. AccessCode: ${response.AccessCode}`);

    return res.status(200).json({
      success: true,
      url: response.SharedPaymentUrl,
    });
  } catch (error) {
    console.error(`[EWAY CHECKOUT FATAL] Session creation failed for User: ${req.user?.email || req.body.email || 'Guest'}. Error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = paymentController;
