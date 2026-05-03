const rapid = require('eway-rapid');
const { createOrderFromTransaction } = require('../services/orderService');

// Initialize eWAY Rapid client — endpoint must be 'Sandbox' or 'Production'
const client = rapid.createClient(
  process.env.EWAY_API_KEY,
  process.env.EWAY_PASSWORD,
  process.env.EWAY_ENDPOINT || 'Sandbox'
);

// In-memory lock to prevent race conditions
const processingCallbacks = new Set();

const ewayCallbackController = async (req, res) => {
    const accessCode = req.query.AccessCode;
    const FRONTEND_URL = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',')[0] : 'http://localhost:3000';

    if (!accessCode) {
        console.error('[EWAY CALLBACK FATAL] No AccessCode received in callback.');
        return res.redirect(`${FRONTEND_URL}/checkout?canceled=true`);
    }

    try {
        const result = await client.queryTransaction(accessCode);

        // SDK uses .get() method for responses
        const transactions = result.get('Transactions');
        if (!transactions || transactions.length === 0) {
            console.error('[EWAY CALLBACK FATAL] No transaction data returned from eWAY query.');
            return res.redirect(`${FRONTEND_URL}/checkout?canceled=true`);
        }

        const transaction = transactions[0];
        const transactionId = String(transaction.TransactionID);
        const txnStatus = transaction.TransactionStatus;
        const responseCode = transaction.ResponseCode;

        if (!txnStatus || responseCode !== '00') {
            console.error(`[EWAY CALLBACK FAILED] Payment declined. ResponseCode: ${responseCode}`);
            return res.redirect(`${FRONTEND_URL}/checkout?canceled=true`);
        }

        if (processingCallbacks.has(transactionId)) {
            return res.redirect(`${FRONTEND_URL}/orders?success=true`);
        }
        processingCallbacks.add(transactionId);

        // Fulfill order
        await createOrderFromTransaction(transaction);

        return res.redirect(`${FRONTEND_URL}/orders?success=true`);
    } catch (error) {
        console.error(`[EWAY CALLBACK FATAL] Error: ${error.message}`);
        return res.redirect(`${FRONTEND_URL}/checkout?canceled=true`);
    } finally {
        if (accessCode) {
            setTimeout(() => processingCallbacks.delete(accessCode), 10 * 60 * 1000);
        }
    }
};

module.exports = ewayCallbackController;
