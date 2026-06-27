const rapid = require('eway-rapid');
const PendingCheckout = require('../models/pendingCheckoutModel');
const { createOrderFromTransaction } = require('./orderService');

const client = rapid.createClient(
  process.env.EWAY_API_KEY,
  process.env.EWAY_PASSWORD,
  process.env.EWAY_ENDPOINT || 'Sandbox'
);

// How long to wait before treating a pending checkout as stale (15 minutes)
const STALE_AFTER_MS = 15 * 60 * 1000;

// How old a pending checkout must be before we consider it expired and give up (~24h)
const EXPIRE_AFTER_MS = 24 * 60 * 60 * 1000;

async function reconcilePendingPayments() {
  const now = Date.now();
  const staleThreshold = new Date(now - STALE_AFTER_MS);
  const expireThreshold = new Date(now - EXPIRE_AFTER_MS);

  let staleCheckouts;
  try {
    staleCheckouts = await PendingCheckout.find({
      status: 'pending',
      createdAt: { $lt: staleThreshold },
    });
  } catch (err) {
    console.error(`[RECONCILE] DB query failed: ${err.message}`);
    return;
  }

  if (!staleCheckouts.length) return;

  console.info(`[RECONCILE] Found ${staleCheckouts.length} stale pending checkout(s) to check.`);

  for (const checkout of staleCheckouts) {
    try {
      // If over 24h old, AccessCode has likely expired — mark and skip
      if (checkout.createdAt < expireThreshold) {
        await PendingCheckout.findByIdAndUpdate(checkout._id, { status: 'expired' });
        console.warn(`[RECONCILE] AccessCode expired (>24h): ${checkout.accessCode}`);
        continue;
      }

      const result = await client.queryTransaction(checkout.accessCode);
      const transactions = result.get('Transactions');

      if (!transactions || transactions.length === 0) {
        // No transaction data — payment was never attempted or AccessCode expired
        console.info(`[RECONCILE] No transaction for AccessCode ${checkout.accessCode} — skipping.`);
        continue;
      }

      const txn = transactions[0];

      if (txn.TransactionStatus === true && txn.ResponseCode === '00') {
        console.info(`[RECONCILE] Payment confirmed for AccessCode ${checkout.accessCode}, TxnID: ${txn.TransactionID}. Creating order.`);
        await createOrderFromTransaction(txn);
        await PendingCheckout.findByIdAndUpdate(checkout._id, { status: 'completed' });
        console.info(`[RECONCILE] Order created for TxnID ${txn.TransactionID}.`);
      } else if (txn.TransactionID > 0 && txn.TransactionStatus === false) {
        // Payment was attempted and declined
        await PendingCheckout.findByIdAndUpdate(checkout._id, { status: 'failed' });
        console.info(`[RECONCILE] Payment declined for AccessCode ${checkout.accessCode}, Code: ${txn.ResponseCode}.`);
      }
      // TransactionID === 0 means user never reached the payment page — leave as pending

    } catch (err) {
      console.error(`[RECONCILE] Error processing AccessCode ${checkout.accessCode}: ${err.message}`);
    }
  }
}

// Run every 15 minutes
function startReconciliationJob() {
  const INTERVAL_MS = 15 * 60 * 1000;
  console.info('[RECONCILE] Reconciliation job started. Interval: 15 minutes.');

  // Run once on startup (after a short delay to let DB connect)
  setTimeout(reconcilePendingPayments, 60 * 1000);

  setInterval(reconcilePendingPayments, INTERVAL_MS);
}

module.exports = { startReconciliationJob };
