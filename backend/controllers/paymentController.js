const PendingCheckout = require('../models/pendingCheckoutModel');
const StockReservation = require('../models/stockReservationModel');
const pricingService = require('../services/pricingService');
const rapid = require('eway-rapid');

const client = rapid.createClient(
  process.env.EWAY_API_KEY,
  process.env.EWAY_PASSWORD,
  process.env.EWAY_ENDPOINT || 'Sandbox'
);

const BACKEND_PUBLIC_URL = process.env.BACKEND_PUBLIC_URL || 'https://prod-api.angelfashionstudio.org';
const FRONTEND_PUBLIC_URL = process.env.FRONTEND_PUBLIC_URL || 'https://www.angelfashionstudio.org';

const paymentController = async (req, res) => {
  const { cart, shipping_fee, total_amount, shipping } = req.body;

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
  const email = req.body.email || '';
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'A valid email address is required for order confirmation' });
  }

  try {
    // Server-authoritative pricing — recompute everything (item prices, shipping,
    // coupon) from the database. The browser's totals are never trusted to charge.
    const pricing = await pricingService.computeAuthoritativeOrder(cart, {
      shippingMethod: req.body.shippingMethod,
      couponCode: req.body.couponCode,
      // Shipping is weight- and postcode-based, so the address is part of pricing.
      shippingAddress: req.body.shipping?.address || {},
      customerEmail: email,
    });

    if (typeof total_amount === 'number' && Math.abs(total_amount - pricing.sellingTotal) > 0.01) {
      console.warn(`[PRICING MISMATCH] Client items total $${total_amount} vs server $${pricing.sellingTotal} — charging the server amount.`);
    }
    console.info(`[EWAY CHECKOUT] User: ${req.body.email || 'Guest'}, Items: ${cart.length}, Charge: $${pricing.total}, Shipping: $${pricing.shipping} (${pricing.method}), Coupon: ${pricing.couponCode || 'none'}`);

    const orderItemsMeta = pricing.items.map((i) => ({ id: i.productId, q: i.qty, c: i.color, s: i.size }));

    const finalTotal = pricing.total;
    const amountInCents = Math.round(finalTotal * 100);

    // Build Options — pipe-delimited key=value with type prefix (m:/i:/s:)
    // eWAY HTML-encodes quotes so JSON breaks — use safe chars only (no &, ", ', <, >)
    // Max 254 chars per Value. Items spread across multiple entries to handle large carts.
    const metaValue = 'm:' + [
      `uid=${req.body.userId || ''}`,
      `uname=${(req.body.shipping?.name || 'Guest').substring(0, 30)}`,
      `email=${(req.body.email || '').substring(0, 50)}`,
      `disc=${pricing.couponDiscount}`,
      `coupon=${pricing.couponCode || ''}`,
      `shipFee=${pricing.shipping}`,
      `itemsP=${pricing.sellingTotal}`,
      `shipG=${pricing.shippingBreakdown?.weightGrams || 0}`,
      `shipZ=${pricing.shippingBreakdown?.zone || ''}`,
      `shipC=${pricing.shippingBreakdown?.freeCredit || 0}`,
    ].join('|');

    // Split items across multiple Options entries — each ObjectId is 24 chars, entries ~33 chars each
    // 7+ items easily exceed 254 chars if packed into one entry
    const itemEntries = orderItemsMeta.map(i => `${i.id}:${i.q}:${i.c}:${i.s}`);
    const itemChunks = [];
    let currentChunk = '';
    for (const entry of itemEntries) {
      const candidate = currentChunk ? `${currentChunk},${entry}` : entry;
      if (('i:' + candidate).length > 254) {
        if (currentChunk) itemChunks.push({ Value: `i:${currentChunk}` });
        currentChunk = entry;
      } else {
        currentChunk = candidate;
      }
    }
    if (currentChunk) itemChunks.push({ Value: `i:${currentChunk}` });

    const shippingValue = 's:' + [
      `addr=${(req.body.shipping?.address?.line1 || '').substring(0, 50)}`,
      `city=${req.body.shipping?.address?.city || ''}`,
      `state=${req.body.shipping?.address?.state || ''}`,
      `zip=${req.body.shipping?.address?.postal_code || ''}`,
      `phone=${req.body.shipping?.phone_number || ''}`,
    ].join('|');

    const options = [
      { Value: metaValue.substring(0, 254) },
      ...itemChunks,
      { Value: shippingValue.substring(0, 254) },
    ];

    const customerName = req.body.shipping?.name || 'Guest User';
    const nameParts = customerName.trim().split(' ');
    const firstName = nameParts[0] || 'Guest';
    const lastName = nameParts.slice(1).join(' ') || 'User';

    const payload = {
      RedirectUrl: `${BACKEND_PUBLIC_URL}/api/payment/callback`,
      CancelUrl: `${BACKEND_PUBLIC_URL}/api/payment/cancel`,
      TransactionType: 'Purchase',

      Customer: {
        FirstName: firstName,
        LastName: lastName,
        Email: req.body.email || '',
        Phone: req.body.shipping?.phone_number || '',
        Street1: req.body.shipping?.address?.line1 || '',
        City: req.body.shipping?.address?.city || '',
        State: req.body.shipping?.address?.state || '',
        PostalCode: req.body.shipping?.address?.postal_code || '',
        Country: 'au',
      },

      // ShippingAddress is used by eWAY for fraud scoring (Fraud Lite/Essentials/Ultimate)
      // It is NOT shown to the customer on the hosted page
      ShippingAddress: {
        ShippingMethod: 'DesignatedByCustomer',
        FirstName: firstName,
        LastName: lastName,
        Street1: req.body.shipping?.address?.line1 || '',
        City: req.body.shipping?.address?.city || '',
        State: req.body.shipping?.address?.state || '',
        Country: 'au',
        PostalCode: req.body.shipping?.address?.postal_code || '',
        Phone: req.body.shipping?.phone_number || '',
        Email: req.body.email || '',
      },

      Payment: {
        TotalAmount: amountInCents,
        CurrencyCode: 'AUD',
        InvoiceNumber: `AFS-${Date.now()}`,
        InvoiceDescription: `Angel Fashion Studio - ${cart.length} item(s)`.substring(0, 64),
      },

      Options: options,
      CustomerIP: req.ip || '',
    };

    const response = await client.createTransaction(rapid.Enum.Method.RESPONSIVE_SHARED, payload);

    const errors = response.get('Errors') || '';
    if (errors) {
      const humanErrors = errors.split(',').filter(Boolean).map(code => {
        try { return rapid.getMessage(code.trim(), 'en'); } catch { return code; }
      }).join('; ');
      console.error(`[EWAY RSP ERROR] ${humanErrors}`);
      return res.status(500).json({ success: false, message: `eWAY Error: ${humanErrors}` });
    }

    const sharedUrl = response.get('SharedPaymentUrl');
    const accessCode = response.get('AccessCode');
    if (!sharedUrl || !accessCode) {
      console.error('[EWAY RSP] No SharedPaymentUrl or AccessCode returned');
      return res.status(502).json({ success: false, message: 'Payment gateway returned no redirect URL' });
    }

    // Persist AccessCode so the reconciliation job can recover orders
    // if the customer closes the browser before eWAY fires the redirect callback
    // Hold each size/colour for 15 minutes so a second customer cannot buy the
    // same piece while this one is on the payment page. The TTL index releases
    // the hold automatically if they abandon checkout.
    const RESERVATION_MINUTES = 15;
    const expiresAt = new Date(Date.now() + RESERVATION_MINUTES * 60 * 1000);
    await StockReservation.insertMany(
      pricing.items.map((i) => ({
        product: i.productId,
        size: i.size,
        color: i.color,
        qty: i.qty,
        accessCode,
        expiresAt,
      }))
    ).catch((err) => console.warn(`[STOCK RESERVATION] Could not reserve: ${err.message}`));

    await PendingCheckout.create({ accessCode }).catch(err =>
      console.warn(`[EWAY RSP] Could not save PendingCheckout: ${err.message}`)
    );

    console.info(`[EWAY RSP] URL created. AccessCode: ${accessCode}`);
    return res.status(200).json({ success: true, url: sharedUrl });

  } catch (error) {
    console.error(`[EWAY FATAL] ${error.message}`);
    // Pricing/stock validation errors carry a status code — surface them cleanly.
    if (error.statusCode) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    console.error(error.stack);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { paymentController };
