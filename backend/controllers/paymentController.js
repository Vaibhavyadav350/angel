const Product = require('../models/productModel');
const rapid = require('eway-rapid');
const { createOrderFromTransaction } = require('../services/orderService');

// Initialize eWAY Rapid client — endpoint must be 'Sandbox' or 'Production' (NOT a URL)
const client = rapid.createClient(
  process.env.EWAY_API_KEY,
  process.env.EWAY_PASSWORD,
  process.env.EWAY_ENDPOINT || 'Sandbox'
);

const paymentController = async (req, res) => {
  const { cart, shipping_fee, total_amount, shipping, eway_encrypted_card } = req.body;

  // --- Validation ---
  if (!cart || !Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ success: false, message: 'Cart is required and must not be empty' });
  }
  if (typeof shipping_fee !== 'number' || shipping_fee < 0) {
    return res.status(400).json({ success: false, message: 'Shipping fee must be a non-negative number' });
  }
  if (typeof total_amount !== 'number' || total_amount <= 0) {
    return res.status(400).json({ success: false, message: 'Total amount must be a positive number' });
  }
  if (!shipping || typeof shipping !== 'object') {
    return res.status(400).json({ success: false, message: 'Shipping information is required' });
  }

  try {
    console.info(`[EWAY CHECKOUT] User: ${req.body.email || 'Guest'}, Items: ${cart.length}, Total: $${total_amount}, Shipping: $${shipping_fee}`);

    // --- Stock Check ---
    const orderItemsMeta = [];
    for (const item of cart) {
      const productId = item.productId || item.id;
      if (!productId) continue;
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.name}` });
      }
      if (product.stock < item.amount) {
        return res.status(400).json({ success: false, message: `Stock Error: Only ${product.stock} left for ${item.name}.` });
      }
      orderItemsMeta.push({ id: productId, q: item.amount, c: item.color || 'Standard', s: item.size || 'M' });
    }

    const FRONTEND_URL = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',')[0] : 'http://localhost:3000';
    const BACKEND_URL = `http://localhost:${process.env.PORT || 5000}`;

    // --- Calculate Amounts ---
    const discountAmount = Number(req.body.discountAmount) || 0;
    const finalTotal = total_amount - discountAmount + shipping_fee;
    const amountInCents = Math.round(finalTotal * 100); // eWAY requires CENTS

    // --- Build Metadata (max 3 Options, each max 255 chars) ---
    // eWAY HTML-encodes Options values, so JSON is NOT allowed. Use pipe-delimited format.
    const metaOption = [
      `uid=${req.body.userId || ''}`,
      `uname=${(req.body.shipping?.name || 'Guest').substring(0, 30)}`,
      `email=${(req.body.email || '').substring(0, 50)}`,
      `disc=${discountAmount}`,
      `coupon=${req.body.couponCode || ''}`,
      `shipFee=${shipping_fee}`,
      `itemsP=${total_amount}`,
    ].join('|');

    // Compact items: id:qty:color:size for each item, comma-separated
    const itemsOption = orderItemsMeta.map(i => `${i.id}:${i.q}:${i.c}:${i.s}`).join(',');

    const shippingOption = [
      `addr=${(req.body.shipping?.address?.line1 || '').substring(0, 50)}`,
      `city=${req.body.shipping?.address?.city || ''}`,
      `state=${req.body.shipping?.address?.state || ''}`,
      `zip=${req.body.shipping?.address?.postal_code || ''}`,
      `phone=${req.body.shipping?.phone_number || ''}`,
    ].join('|');

    // eWAY allows max 3 Options, each max 255 chars
    const options = [
      { Value: metaOption.substring(0, 255) },
      { Value: itemsOption.substring(0, 255) },
      { Value: shippingOption.substring(0, 255) },
    ];

    // --- Customer Info ---
    const customerName = req.body.shipping?.name || 'Guest User';
    const nameParts = customerName.split(' ');
    const firstName = nameParts[0] || 'Guest';
    const lastName = nameParts.slice(1).join(' ') || 'User';

    const payload = {
      Customer: {
        FirstName: firstName,
        LastName: lastName,
        Email: req.body.email || 'guest@example.com',
        Phone: req.body.shipping?.phone_number || '',
        Street1: req.body.shipping?.address?.line1 || '',
        City: req.body.shipping?.address?.city || '',
        State: req.body.shipping?.address?.state || '',
        PostalCode: req.body.shipping?.address?.postal_code || '',
        Country: 'au', // lowercase ISO 3166-1 alpha-2
      },
      Payment: {
        TotalAmount: amountInCents,
        CurrencyCode: 'AUD',
        InvoiceNumber: `INV-${Date.now()}`.substring(0, 12),
        InvoiceDescription: `Angel Fashion Studio - ${cart.length} item(s)`.substring(0, 64),
      },
      Options: options,
      TransactionType: 'MOTO',
    };

    // =============================================
    // DIRECT CONNECTION (with CSE-encrypted card)
    // =============================================
    if (eway_encrypted_card) {
      // ExpiryYear: eWAY requires 2-digit "YY" — convert from "2030" → "30"
      let expiryYear = String(eway_encrypted_card.expiryYear || '');
      if (expiryYear.length === 4) {
        expiryYear = expiryYear.slice(-2); // "2030" → "30"
      }

      // CardDetails.Name is REQUIRED by eWAY
      payload.Customer.CardDetails = {
        Name: eway_encrypted_card.nameOnCard || customerName,
        Number: eway_encrypted_card.number,      // CSE ciphertext
        ExpiryMonth: String(eway_encrypted_card.expiryMonth || '').padStart(2, '0'),
        ExpiryYear: expiryYear,
        CVN: eway_encrypted_card.cvn,            // CSE ciphertext
      };

      // DIRECT method doesn't need RedirectUrl/CancelUrl
      console.info(`[EWAY DIRECT] Sending transaction. Amount: ${amountInCents} cents, Card Name: ${payload.Customer.CardDetails.Name}`);

      const response = await client.createTransaction(rapid.Enum.Method.DIRECT, payload);

      // SDK response uses .get() method
      const txnStatus = response.get('TransactionStatus');
      const txnId = response.get('TransactionID');
      const errors = response.get('Errors') || '';
      const responseMsg = response.get('ResponseMessage') || '';
      const responseCode = response.get('ResponseCode') || '';

      console.info(`[EWAY DIRECT RESPONSE] Status: ${txnStatus}, ID: ${txnId}, Code: ${responseCode}, Msg: ${responseMsg}, Errors: ${errors}`);

      if (errors) {
        // Translate V6xxx codes to human-readable messages
        const humanErrors = errors.split(',').filter(Boolean).map(code => {
          try { return rapid.getMessage(code.trim(), 'en'); } catch { return code; }
        }).join('; ');
        console.error(`[EWAY DIRECT ERROR] ${humanErrors}`);
        return res.status(400).json({ success: false, message: `Payment Error: ${humanErrors}` });
      }

      if (txnStatus) {
        console.info(`[EWAY DIRECT SUCCESS] Transaction ${txnId} approved. ResponseCode: ${responseCode}`);

        // Fulfill order
        try {
          await createOrderFromTransaction({
            TransactionID: txnId,
            TotalAmount: amountInCents,
            Options: options,
          });
        } catch (orderErr) {
          console.error(`[ORDER FULFILLMENT ERROR] ${orderErr.message}`);
          // Payment succeeded even if fulfillment fails — don't lose the transaction
        }

        return res.status(200).json({
          success: true,
          transactionId: txnId,
        });
      } else {
        // Declined
        const declineMsg = responseMsg || responseCode || 'Unknown reason';
        console.warn(`[EWAY DIRECT DECLINED] ${declineMsg}`);
        return res.status(400).json({ success: false, message: `Payment Declined: ${declineMsg}` });
      }
    }

    // =============================================
    // RESPONSIVE SHARED PAGE (fallback — no card data)
    // =============================================
    payload.RedirectUrl = `${BACKEND_URL}/api/payment/callback`;
    payload.CancelUrl = `${FRONTEND_URL}/checkout?canceled=true`;

    const response = await client.createTransaction(rapid.Enum.Method.RESPONSIVE_SHARED, payload);

    const errors = response.get('Errors') || '';
    if (errors) {
      const humanErrors = errors.split(',').filter(Boolean).map(code => {
        try { return rapid.getMessage(code.trim(), 'en'); } catch { return code; }
      }).join('; ');
      console.error(`[EWAY SHARED ERROR] ${humanErrors}`);
      return res.status(500).json({ success: false, message: `eWAY Error: ${humanErrors}` });
    }

    const sharedUrl = response.get('SharedPaymentUrl');
    console.info(`[EWAY SHARED SUCCESS] URL created. AccessCode: ${response.get('AccessCode')}`);

    return res.status(200).json({ success: true, url: sharedUrl });

  } catch (error) {
    console.error(`[EWAY FATAL] ${error.message}`);
    console.error(error.stack);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = paymentController;
