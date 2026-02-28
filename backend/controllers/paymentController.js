const Product = require('../models/productModel');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const calculateOrderAmount = (shipping_fee, total_amount) => {
  // Stripe requires amount in smallest currency unit (Cents for AUD)
  // Convert dollars to cents and round to avoid floating point issues
  const totalInDollars = shipping_fee + total_amount;
  return Math.round(totalInDollars * 100);
};

const paymentController = async (req, res) => {
  const { cart, shipping_fee, total_amount, shipping } = req.body;

  // Validation
  if (!cart || !Array.isArray(cart) || cart.length === 0) {
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
    const allowedShippingFees = [0, 100, 200];
    if (!allowedShippingFees.includes(shipping_fee)) {
      console.warn(`Warning: Client sent non-standard shipping fee: ${shipping_fee}`);
    }

    // 2. Race Condition Check: Verify Stock BEFORE creating checkout
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
        name: item.name,
        price: item.price,
        quantity: item.amount,
        image: item.image,
        color: item.color || 'Standard',
        size: item.size || 'M',
        product: productId
      });
    }

    const FRONTEND_URL = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',')[0] : 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: req.user?.email || req.body.email || undefined,
      line_items: cart.map(item => {
        return {
          price_data: {
            currency: process.env.STRIPE_CURRENCY || 'aud',
            product_data: {
              name: item.name,
              images: [item.image],
            },
            // Note: Our discount is calculated inside line items on the frontend already
            // so we send the raw price here, but in cents
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.amount,
        }
      }),
      shipping_options: shipping_fee > 0 ? [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: Math.round(shipping_fee * 100), currency: process.env.STRIPE_CURRENCY || 'aud' },
            display_name: 'Standard Shipping',
          }
        }
      ] : [],
      shipping_address_collection: {
        allowed_countries: ['AU', 'US', 'GB', 'IN'], // adjust as needed via config
      },
      metadata: {
        userId: req.user?.id || req.body.userId || '',
        userName: req.user?.name || req.body.shipping?.name || 'Guest User',
        userEmail: req.user?.email || req.body.email || 'guest@example.com',
        discountAmount: req.body.discountAmount || 0,
        couponCode: req.body.couponCode || '',
        shippingFee: shipping_fee,
        itemsPrice: total_amount,
        taxPrice: 0,
        orderItems: JSON.stringify(orderItemsMeta) // Packing array to string
      },
      success_url: `${FRONTEND_URL}/orders?success=true`,
      cancel_url: `${FRONTEND_URL}/checkout?canceled=true`,
    });

    return res.status(200).json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = paymentController;
