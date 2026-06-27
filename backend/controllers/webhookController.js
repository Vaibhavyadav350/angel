const rapid = require('eway-rapid');
const { createOrderFromTransaction } = require('../services/orderService');
const PendingCheckout = require('../models/pendingCheckoutModel');

const client = rapid.createClient(
  process.env.EWAY_API_KEY,
  process.env.EWAY_PASSWORD,
  process.env.EWAY_ENDPOINT || 'Sandbox'
);

// In-memory dedup lock — prevents double-fulfillment if browser fires callback twice
const processingCallbacks = new Set();

const ewayCallbackController = async (req, res) => {
    const accessCode = req.query.AccessCode;
    const FRONTEND_URL = process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',')[0]
        : 'http://localhost:3000';

    if (!accessCode) {
        console.error('[EWAY CALLBACK FATAL] No AccessCode received in callback.');
        return res.redirect(`${FRONTEND_URL}/checkout?canceled=true`);
    }

    try {
        const result = await client.queryTransaction(accessCode);

        const transactions = result.get('Transactions');
        if (!transactions || transactions.length === 0) {
            console.error('[EWAY CALLBACK FATAL] No transaction data returned from eWAY query.');
            return res.redirect(`${FRONTEND_URL}/checkout?canceled=true`);
        }

        const transaction = transactions[0];
        const transactionId = String(transaction.TransactionID);
        const txnStatus = transaction.TransactionStatus;
        const responseCode = transaction.ResponseCode;

        // Both conditions required per eWAY guide: TransactionStatus AND ResponseCode === '00'
        if (txnStatus !== true || responseCode !== '00') {
            console.error(`[EWAY CALLBACK FAILED] Payment declined. Status: ${txnStatus}, ResponseCode: ${responseCode}`);
            return res.redirect(`${FRONTEND_URL}/checkout?canceled=true`);
        }

        if (processingCallbacks.has(transactionId)) {
            console.warn(`[EWAY CALLBACK] Duplicate callback for TransactionID ${transactionId} — ignoring.`);
            return res.redirect(`${FRONTEND_URL}/orders?success=true`);
        }
        processingCallbacks.add(transactionId);
        // Remove lock after 10 minutes — gives enough window to catch retries
        setTimeout(() => processingCallbacks.delete(transactionId), 10 * 60 * 1000);

        await createOrderFromTransaction(transaction);

        // Mark as completed so reconciliation job skips it
        PendingCheckout.findOneAndUpdate(
          { accessCode },
          { status: 'completed' }
        ).catch(() => {});

        return res.redirect(`${FRONTEND_URL}/orders?success=true`);
    } catch (error) {
        console.error(`[EWAY CALLBACK FATAL] Error: ${error.message}`);
        return res.redirect(`${FRONTEND_URL}/checkout?canceled=true`);
    }
};

module.exports = ewayCallbackController;
