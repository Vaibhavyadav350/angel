# eWAY Rapid API — Responsive Shared Page (RSP) Node.js Integration Guide

> **Scope:** This guide covers the full RSP flow end-to-end using the official `eway-rapid` npm package. It is written with zero assumptions — every field, behavior, and edge case is documented explicitly with source references from eWAY's own API reference (v47), GitHub SDK source, and official documentation.

---

## Table of Contents

1. [Setup & Client Initialization](#1-setup--client-initialization)
2. [Full RSP Transaction Creation — Request Fields](#2-full-rsp-transaction-creation--request-fields)
3. [SharedPaymentUrl Response & Redirect Flow](#3-sharedpaymenturl-response--redirect-flow)
4. [RedirectUrl & CancelUrl — What eWAY Appends](#4-redirecturl--cancelurl--what-eway-appends)
5. [queryTransaction(AccessCode) — Full Response & Confirmation Logic](#5-querytransactionaccesscode--full-response--confirmation-logic)
6. [The Options Array — Limits, Encoding & Return Behavior](#6-the-options-array--limits-encoding--return-behavior)
7. [3DS / 3DS2 on the RSP Hosted Page](#7-3ds--3ds2-on-the-rsp-hosted-page)
8. [Idempotency — Preventing Duplicate Orders](#8-idempotency--preventing-duplicate-orders)
9. [Sandbox vs Production Endpoint Values](#9-sandbox-vs-production-endpoint-values)
10. [TransactionType Field — Purchase vs MOTO vs Recurring](#10-transactiontype-field--purchase-vs-moto-vs-recurring)
11. [Webhooks / Server-to-Server Notifications](#11-webhooks--server-to-server-notifications)
12. [Complete Working Flow — Annotated Code](#12-complete-working-flow--annotated-code)

---

## 1. Setup & Client Initialization

### Installation

```bash
npm install eway-rapid
```

### Client Creation

```js
const rapid = require('eway-rapid');

const client = rapid.createClient(
  'YOUR_API_KEY',       // 3rd-party API key from MyeWAY dashboard
  'YOUR_API_PASSWORD',  // Password generated in MyeWAY (visible only once)
  'Sandbox'             // See Section 9 for exact accepted values
);
```

**Important notes about `createClient`:**

- The first argument is your **Rapid API Key** — NOT your MyeWAY email address. Even though some older eWAY code refers to it as `username`, you must pass the API key string.
- The third argument (endpoint) is case-sensitive in the Node.js SDK. See Section 9 for exact values.
- The client uses HTTP Basic Auth internally: the API key is the username, the password is the password.

---

## 2. Full RSP Transaction Creation — Request Fields

### The SDK Call

For RSP, use `rapid.Enum.Method.RESPONSIVE_SHARED` as the method:

```js
client.createTransaction(rapid.Enum.Method.RESPONSIVE_SHARED, transactionObject)
  .then(response => { /* handle SharedPaymentUrl */ })
  .catch(err => { /* handle network/auth error */ });
```

### Complete Annotated Request Object

```js
const transactionObject = {

  // ─────────────────────────────────────────────────────────────
  // TOP-LEVEL REQUIRED FIELDS
  // ─────────────────────────────────────────────────────────────

  // REQUIRED: Where eWAY sends the browser after successful payment.
  // eWAY will append ?AccessCode=xxx to this URL.
  "RedirectUrl": "https://yourstore.com/payment/return",

  // REQUIRED for RSP: Where eWAY sends the browser if user clicks "Cancel".
  // eWAY will append ?AccessCode=xxx to CancelUrl too.
  "CancelUrl": "https://yourstore.com/cart",

  // REQUIRED: The transaction type. For customer-initiated e-commerce: "Purchase"
  // See Section 10 for all values.
  "TransactionType": "Purchase",

  // ─────────────────────────────────────────────────────────────
  // PAYMENT OBJECT — describes the money being charged
  // ─────────────────────────────────────────────────────────────
  "Payment": {
    // REQUIRED: Integer, in the smallest currency unit (cents for AUD/NZD/SGD etc.)
    // e.g., $49.95 AUD = 4995
    "TotalAmount": 4995,

    // OPTIONAL: Your own invoice number, max 50 chars, alphanumeric
    "InvoiceNumber": "INV-20240001",

    // OPTIONAL: Free-text description shown in the eWAY merchant portal, max 64 chars
    "InvoiceDescription": "Order #1234 — Widget + Shipping",

    // OPTIONAL: A secondary reference for your internal use, max 50 chars
    "InvoiceReference": "ORDER-1234",

    // OPTIONAL: ISO 4217 currency code, e.g. "AUD", "NZD", "SGD", "MYR", "HKD"
    // Defaults to your account's home currency if omitted.
    "CurrencyCode": "AUD"
  },

  // ─────────────────────────────────────────────────────────────
  // CUSTOMER OBJECT — pre-fills the eWAY hosted page fields
  // Card details are NOT included here for RSP — eWAY collects them
  // ─────────────────────────────────────────────────────────────
  "Customer": {
    // OPTIONAL: Your internal customer reference, max 50 chars
    "Reference": "CUST-5678",

    // OPTIONAL: Title. One of: Mr., Ms., Mrs., Miss, Dr., Sir., Prof.
    "Title": "Mr.",

    // OPTIONAL (but recommended): First name, max 50 chars
    "FirstName": "Jane",

    // OPTIONAL (but recommended): Last name, max 50 chars
    "LastName": "Smith",

    // OPTIONAL: Company name, max 50 chars
    "CompanyName": "Acme Corp",

    // OPTIONAL: Job description, max 50 chars
    "JobDescription": "Engineer",

    // OPTIONAL: Billing street line 1, max 50 chars
    "Street1": "Level 5",

    // OPTIONAL: Billing street line 2, max 50 chars
    "Street2": "99 Main Street",

    // OPTIONAL: City/suburb/town, max 50 chars
    "City": "Sydney",

    // OPTIONAL: State/province/county, max 50 chars
    "State": "NSW",

    // OPTIONAL: Postcode/ZIP, max 30 chars
    "PostalCode": "2000",

    // CONDITIONALLY REQUIRED: Two-letter ISO 3166 alpha-2 country code, LOWERCASE.
    // e.g., "au" for Australia, "nz" for New Zealand, "sg" for Singapore.
    // Required when Customer.Country is present alongside CustomerIP — this
    // activates eWAY's Fraud Lite detection.
    "Country": "au",

    // OPTIONAL: Customer phone, max 32 chars
    "Phone": "+61 2 9000 0000",

    // OPTIONAL: Mobile number, max 32 chars
    "Mobile": "+61 400 000 000",

    // OPTIONAL: Email address, max 50 chars
    "Email": "jane.smith@example.com",

    // OPTIONAL: Customer's website URL, must be properly formatted if present, max 512 chars
    "Url": "https://example.com",

    // OPTIONAL: Internal comments, max 255 chars
    "Comments": ""

    // NOTE: Do NOT include CardDetails here for RSP.
    // eWAY collects card data on its own hosted page.
  },

  // ─────────────────────────────────────────────────────────────
  // SHIPPING ADDRESS OBJECT — optional, used for fraud checks
  // ─────────────────────────────────────────────────────────────
  "ShippingAddress": {
    // OPTIONAL: One of the following strings:
    // "Unknown", "LowCost", "DesignatedByCustomer", "International",
    // "Military", "NextDay", "StorePickup", "TwoDayService", "ThreeDayService"
    "ShippingMethod": "NextDay",

    // OPTIONAL: Recipient first name, max 50 chars
    "FirstName": "Jane",

    // OPTIONAL: Recipient last name, max 50 chars
    "LastName": "Smith",

    // OPTIONAL: Street line 1, max 50 chars
    "Street1": "Level 5",

    // OPTIONAL: Street line 2, max 50 chars
    "Street2": "99 Main Street",

    // OPTIONAL: City, max 50 chars
    "City": "Sydney",

    // OPTIONAL: State, max 50 chars
    "State": "NSW",

    // OPTIONAL: Lowercase ISO 3166 alpha-2, max 2 chars
    "Country": "au",

    // OPTIONAL: Postcode, max 30 chars
    "PostalCode": "2000",

    // OPTIONAL: Phone, max 32 chars
    "Phone": "+61 2 9000 0000",

    // OPTIONAL: Email, max 50 chars
    "Email": "jane.smith@example.com",

    // OPTIONAL: Fax, max 32 chars
    "Fax": ""
  },

  // ─────────────────────────────────────────────────────────────
  // LINE ITEMS — optional, useful for fraud analysis and records
  // ─────────────────────────────────────────────────────────────
  "Items": [
    {
      // OPTIONAL: SKU/product code, max 12 chars
      "SKU": "WIDGET-001",

      // OPTIONAL: Description, max 26 chars
      "Description": "Blue Widget",

      // OPTIONAL: Quantity, integer
      "Quantity": 2,

      // OPTIONAL: Unit cost in cents (smallest currency unit)
      "UnitCost": 1998,

      // OPTIONAL: Tax on the line item in cents
      "Tax": 182,

      // OPTIONAL: Total for this line item in cents (UnitCost * Quantity + Tax)
      "Total": 4178
    }
  ],

  // ─────────────────────────────────────────────────────────────
  // OPTIONS — pass-through metadata (see Section 6 for full details)
  // ─────────────────────────────────────────────────────────────
  "Options": [
    { "Value": "order_id=1234" },
    { "Value": "session_token=abc123xyz" },
    { "Value": "source=mobile_app" }
  ],

  // ─────────────────────────────────────────────────────────────
  // OPTIONAL TOP-LEVEL FIELDS
  // ─────────────────────────────────────────────────────────────

  // OPTIONAL: Customer's IP address, max 50 chars.
  // When provided alongside Customer.Country, activates Fraud Lite.
  "CustomerIP": "203.0.113.42",

  // OPTIONAL: Your device/app identifier, max 50 chars
  "DeviceID": "ecommerce-web-v2",

  // CONDITIONALLY REQUIRED: Your eWAY Partner ID, max 50 chars.
  // Required if you are a registered eWAY partner. Also used to whitelist
  // your API calls for PCI DSS compliance in Direct Connection mode,
  // but for RSP this is only relevant if you are a partner.
  "PartnerID": "",

  // OPTIONAL: If true, creates/updates a Token Customer in eWAY's vault.
  // Use this if you want to save the card for future charges.
  // Default is false for RSP when not explicitly set.
  "SaveCustomer": false

};
```

---

## 3. SharedPaymentUrl Response & Redirect Flow

### What eWAY Returns

When you call `createTransaction(rapid.Enum.Method.RESPONSIVE_SHARED, ...)`, eWAY responds with a JSON object. The Node.js SDK wraps it in a response object. The key fields are:

```js
client.createTransaction(rapid.Enum.Method.RESPONSIVE_SHARED, transactionObject)
  .then(response => {
    // Check for API-level errors first
    const errors = response.get('Errors');
    if (errors) {
      // Comma-separated error codes, e.g. "V6011,V6012"
      const msgs = errors.split(',').map(code => rapid.getMessage(code, 'en'));
      console.error('eWAY API errors:', msgs);
      return;
    }

    // The URL you redirect the customer's browser to
    const sharedPaymentUrl = response.get('SharedPaymentUrl');
    // Example value:
    // "https://secure-au.sandbox.ewaypayments.com/sharedpage/sharedpayment?AccessCode=44DD7Uk..."

    // The AccessCode — eWAY's token for this transaction session.
    // Store this in your database against the pending order.
    const accessCode = response.get('AccessCode');

    // Customer data echoed back (for TokenPayment method: includes masked card)
    const customer = response.get('Customer');

    // Payment details echoed back
    const payment = response.get('Payment');

    // Redirect the customer to the eWAY-hosted payment page
    res.redirect(sharedPaymentUrl);
  });
```

### What the SharedPaymentUrl Looks Like

```
https://secure-au.sandbox.ewaypayments.com/sharedpage/sharedpayment?AccessCode=44DD7UkA7zOC8h...
```

For production it is:
```
https://secure-au.ewaypayments.com/sharedpage/sharedpayment?AccessCode=...
```

The `AccessCode` is a long opaque token (typically 80–100 chars) that links everything together. **Store it in your database alongside your pending order record before redirecting the customer.**

### What Happens on the eWAY Hosted Page

- eWAY renders a mobile-responsive payment form styled with eWAY's branding (customizable via MyeWAY Settings → Shared Page).
- The customer enters their card number, expiry, and CVN directly on eWAY's domain — your systems never see this data.
- eWAY handles 3DS/3DS2 inline on this page (see Section 7).
- After the customer clicks Pay (or Cancel), eWAY redirects the browser to your `RedirectUrl` or `CancelUrl`.

---

## 4. RedirectUrl & CancelUrl — What eWAY Appends

### After Successful Payment (or Attempted Payment)

eWAY redirects the customer's browser to your `RedirectUrl` and appends:

```
https://yourstore.com/payment/return?AccessCode=44DD7UkA7zOC8h...
```

**Only `?AccessCode=xxx` is appended.** eWAY does NOT include the transaction result, amount, status, or any payment details in the redirect URL. This is by design — the result is intentionally not in the URL to prevent tampering.

### After Customer Clicks Cancel

eWAY redirects to your `CancelUrl` with the same pattern:

```
https://yourstore.com/cart?AccessCode=44DD7UkA7zOC8h...
```

**Important:** The cancel redirect also includes an `AccessCode`. When you query that AccessCode, `TransactionStatus` will be `false` and `TransactionID` will be `0` (no transaction was processed). You still must call `queryTransaction` to confirm — do not trust the URL alone.

### Your Callback Route

```js
// Express.js example
app.get('/payment/return', async (req, res) => {
  const accessCode = req.query.AccessCode;

  if (!accessCode) {
    return res.status(400).send('Missing AccessCode');
  }

  // Validate the AccessCode is one you actually issued
  // (look it up in your database)
  const order = await db.orders.findByAccessCode(accessCode);
  if (!order) {
    return res.status(400).send('Unknown AccessCode');
  }

  // Now query eWAY for the real result
  // See Section 5 for full queryTransaction details
  const result = await client.queryTransaction(accessCode);
  // ... process result
});
```

---

## 5. queryTransaction(AccessCode) — Full Response & Confirmation Logic

### The SDK Call

```js
client.queryTransaction(accessCode)
  .then(response => {
    // response.get('Transactions') returns an array
    // For an AccessCode query, it always contains exactly one element
    const transactions = response.get('Transactions');

    if (!transactions || transactions.length === 0) {
      // This can happen if the AccessCode is invalid or expired
      console.error('No transaction found for AccessCode');
      return;
    }

    const txn = transactions[0];
    // txn is a plain object with all the fields below
  });
```

### Complete Response Object Shape

```js
{
  // ─── Transaction Outcome ───────────────────────────────────────
  "TransactionStatus": true,       // boolean. TRUE = approved. FALSE = declined/cancelled/error.
                                   // THIS IS THE PRIMARY SUCCESS FLAG.

  "TransactionID": 30508437,       // integer. eWAY's unique transaction ID.
                                   // Will be 0 if no transaction was processed (e.g., user cancelled).

  "AuthorisationCode": "843121",   // string. The bank's authorisation code for approved transactions.
                                   // Empty string for declined/cancelled transactions.

  "ResponseCode": "00",            // string. Two-character bank response code.
                                   // "00" = Approved/successful.
                                   // See eWAY Response Codes list for all values.
                                   // Common codes: "00"=Approved, "05"=Do Not Honour,
                                   // "51"=Insufficient Funds, "54"=Expired Card

  "ResponseMessage": "A2000",      // string. eWAY's internal response message code.
                                   // "A2000" indicates transaction approved.
                                   // These are eWAY-specific codes, not bank codes.

  "TransactionType": "Purchase",   // string. Echoes back the TransactionType from the request.

  // ─── Fraud Scoring (Beagle) ────────────────────────────────────
  "BeagleScore": null,             // string or null. Fraud score (0.01–100.00) as a string.
                                   // Only present if Beagle Free/Plus is enabled.
                                   // null if not applicable.

  // ─── AVS / CVN Verification Results ───────────────────────────
  "Verification": {
    "CVN": 0,        // integer. CVN match result:
                     // 0=Not checked, 1=Match, 2=No match, 3=Not provided,
                     // 4=Not processed, 5=Unknown
    "Address": 0,    // Address verification result (same codes as CVN)
    "Email": 0,      // Email verification result
    "Mobile": 0,     // Mobile verification result
    "Phone": 0       // Phone verification result
  },

  // ─── Customer Data ─────────────────────────────────────────────
  "Customer": {
    "CardDetails": {
      "CardType": "VI",              // string. Card type: VI=Visa, MC=Mastercard,
                                     // AX=Amex, DC=Diners, JC=JCB
      "Number": "444433XXXXXX1111",  // string. Masked card number (never full PAN)
      "Name": "Jane Smith",          // string. Cardholder name as entered
      "ExpiryMonth": "12",           // string. Two-digit expiry month
      "ExpiryYear": "25",            // string. Two-digit expiry year
      "StartMonth": null,            // string or null. UK Maestro only
      "StartYear": null,             // string or null. UK Maestro only
      "IssueNumber": null            // string or null. UK Maestro only
    },
    "TokenCustomerID": null,     // long or null. If SaveCustomer was true, eWAY's vault token ID.
    "Reference": "CUST-5678",
    "Title": "Mr.",
    "FirstName": "Jane",
    "LastName": "Smith",
    "CompanyName": "Acme Corp",
    "JobDescription": "Engineer",
    "Street1": "Level 5",
    "Street2": "99 Main Street",
    "City": "Sydney",
    "State": "NSW",
    "PostalCode": "2000",
    "Country": "au",
    "Email": "jane.smith@example.com",
    "Phone": "+61 2 9000 0000",
    "Mobile": "+61 400 000 000",
    "Comments": "",
    "Fax": "",
    "Url": "https://example.com"
  },

  // ─── Payment Data ──────────────────────────────────────────────
  "Payment": {
    "TotalAmount": 4995,
    "InvoiceNumber": "INV-20240001",
    "InvoiceDescription": "Order #1234 — Widget + Shipping",
    "InvoiceReference": "ORDER-1234",
    "CurrencyCode": "AUD"
  },

  // ─── Options (echoed back — see Section 6) ────────────────────
  "Options": [
    { "Value": "order_id=1234" },
    { "Value": "session_token=abc123xyz" },
    { "Value": "source=mobile_app" }
  ],

  // ─── Extended Fields (Rapid API v40+) ─────────────────────────
  "TransactionDateTime": "2024-01-15T14:23:45+11:00",  // ISO 8601 datetime string
  "FraudAction": null,      // string or null. Action taken by fraud rules if triggered.
  "TransactionCaptured": true,  // boolean. Whether funds were captured (vs. auth-only)
  "CurrencyCode": "AUD",
  "Source": "RSP",          // string. How payment was initiated
  "MaxRefund": 4995,        // integer. Maximum refundable amount in cents
  "OriginalTransactionId": null  // long or null. Set for refunds/voids
}
```

### Definitive Success Check

```js
client.queryTransaction(accessCode)
  .then(response => {
    const errors = response.get('Errors');
    if (errors) {
      // API-level error (not a declined transaction — something went wrong with the query)
      const msgs = errors.split(',').map(code => rapid.getMessage(code, 'en'));
      throw new Error('queryTransaction API error: ' + msgs.join(', '));
    }

    const transactions = response.get('Transactions');
    if (!transactions || transactions.length === 0) {
      throw new Error('No transaction data returned');
    }

    const txn = transactions[0];

    // ─── THE CORRECT SUCCESS CHECK ───────────────────────────────
    // You need BOTH of these conditions:
    //   1. TransactionStatus === true  (bank approved the transaction)
    //   2. ResponseCode === '00'       (standard bank approval code)
    //
    // Do NOT rely on TransactionStatus alone — in rare edge cases
    // (partial approval, fraud hold) it may be true with a non-00 code.
    // Do NOT rely on ResponseCode alone — check both.
    // ─────────────────────────────────────────────────────────────

    const isSuccess = txn.TransactionStatus === true && txn.ResponseCode === '00';
    const transactionId = txn.TransactionID;
    const authCode = txn.AuthorisationCode;

    if (isSuccess) {
      console.log(`Payment approved. eWAY TxnID: ${transactionId}, AuthCode: ${authCode}`);
      // Mark order as paid in your database
    } else {
      // Payment was declined, failed, or user cancelled
      const responseCode = txn.ResponseCode;
      const responseMsg = txn.ResponseMessage;
      console.log(`Payment not successful. Code: ${responseCode}, Msg: ${responseMsg}`);
    }
  });
```

---

## 6. The Options Array — Limits, Encoding & Return Behavior

### What Options Are

`Options` is an array of pass-through values you send in the initial `createTransaction` request. eWAY stores them against the transaction and returns them verbatim in the `queryTransaction` response. They are **never shown to the customer** on the hosted payment page.

### Hard Limits (from official eWAY Rapid 3.0 documentation)

| Constraint | Value |
|---|---|
| Maximum number of Option entries | **99** |
| Maximum characters per `Value` string | **254** (characters beyond 254 are silently truncated) |
| `Value` field data type | string |

> **Source:** eWAY Rapid 3.0 Transparent Redirect API official documentation states: "Up to 99 options can be defined" and "Value — max 254 chars. Additional characters are truncated at 254."

### Are Options Returned in queryTransaction?

**Yes.** The `Options` array you pass in the request is echoed back in the `queryTransaction` response under `Transactions[0].Options`. Each element has the shape `{ "Value": "your-value" }`.

### The JSON-Breaking Problem and Why You Must Use Pipe-Delimited Values

**The core problem:** Each `Value` can only be 254 characters. If you try to store a JSON string like `{"orderId":1234,"items":[{"sku":"ABC","qty":2}],"total":4995}` inside a single `Value`, you will encounter two real-world issues:

1. **Truncation at 254 chars:** If your JSON is longer, it is silently cut off, making it invalid JSON that will throw on `JSON.parse()`.
2. **HTML encoding by eWAY:** eWAY HTML-encodes certain characters in `Value` fields when they pass through the hosted page flow. Specifically, `"` (double-quotes) become `&quot;`, `<` becomes `&lt;`, `>` becomes `&gt;`, and `&` becomes `&amp;`. JSON uses double-quotes extensively, so a value like `{"key":"val"}` comes back as `{&quot;key&quot;:&quot;val&quot;}`, which is not valid JSON.

**The correct pattern — pipe-delimited key=value strings:**

```js
// ✅ CORRECT — pipe-delimited, HTML-encoding-safe
"Options": [
  { "Value": "orderId=1234|sessionToken=abc123|source=web" },
  { "Value": "itemCount=3|shippingMethod=NextDay" }
]

// ❌ WRONG — JSON inside a Value breaks due to quote encoding
"Options": [
  { "Value": JSON.stringify({ orderId: 1234, token: "abc" }) }
  // Comes back as: {"orderId":1234,"token":&quot;abc&quot;} — invalid JSON
]
```

**Parsing pipe-delimited values on return:**

```js
// When you get Options back from queryTransaction:
const optionsRaw = txn.Options; // [{ Value: "orderId=1234|sessionToken=abc123|source=web" }]

function parseOptionValue(valueStr) {
  // Split by pipe, then by '='
  return valueStr.split('|').reduce((acc, pair) => {
    const idx = pair.indexOf('=');
    if (idx > -1) {
      acc[pair.slice(0, idx)] = pair.slice(idx + 1);
    }
    return acc;
  }, {});
}

const parsed = parseOptionValue(optionsRaw[0].Value);
// { orderId: '1234', sessionToken: 'abc123', source: 'web' }
```

**Best practice for your use case:** Store only your internal order ID or session ID in Options (so you can look up your full order in your own database on the callback), not the full cart. Your database is the source of truth.

```js
"Options": [
  { "Value": `orderId=${yourInternalOrderId}` }
]
```

---

## 7. 3DS / 3DS2 on the RSP Hosted Page

### Short Answer: Fully Automatic — Your Code Does Nothing

The RSP integration provides built-in 3D Secure (both 3DS1 and 3DS2) **at the hosted page level**. From eWAY's official documentation:

> "The Responsive Shared Page [...] provides built in support for 3D Secure and Digital Wallets without additional integration of those methods."

### What This Means in Practice

- eWAY's hosted page (`secure-au.ewaypayments.com`) handles all 3DS interactions.
- If the card issuer requires 3DS authentication, eWAY presents the challenge UI (OTP, biometric prompt, etc.) directly on the hosted page.
- The customer completes the 3DS challenge on eWAY's domain.
- After authentication, eWAY processes the payment and redirects to your `RedirectUrl`.
- Your code never needs to send a `ThreeDSecureAuth` object or any 3DS parameters in the RSP request. (The `ThreeDSecureAuth` object is only for Direct Connection when you handle 3DS yourself.)

### What This Means for PCI Scope

The RSP method with 3DS2 support means:
- Your site operates at SAQ A level (the lowest PCI scope).
- No card data, no 3DS challenge data, and no cryptographic authentication tokens ever pass through your server.

### 3DS2 vs 3DS1

eWAY handles the version negotiation automatically. It will attempt 3DS2 (EMV 3DS) first, and fall back to 3DS1 if the issuer does not support it. You cannot control this from your code.

---

## 8. Idempotency — Preventing Duplicate Orders

eWAY does **not** provide a native idempotency key mechanism for RSP (unlike some other gateways). You must implement idempotency yourself. Here is the correct approach:

### Why Duplicates Can Happen

1. The customer's browser hits your `RedirectUrl` callback, your server processes the payment and marks the order paid, but the browser never receives the response (network drop) — the customer refreshes, hitting the callback a second time.
2. A retry logic bug in your code calls `queryTransaction` twice simultaneously.
3. A bot or automated test hits your callback URL multiple times.

### The State Machine Pattern

The definitive solution is to use a **database-level state machine on your order** with an atomic compare-and-swap:

```js
// ─── Step 1: When creating the RSP transaction ──────────────────

// Create a pending order in your DB BEFORE redirecting to eWAY.
// Store the AccessCode against the order.
const order = await db.orders.create({
  id: generateOrderId(),
  status: 'PENDING_PAYMENT',      // Initial state
  accessCode: null,               // Will be set after eWAY responds
  ewayTransactionId: null,
  totalCents: 4995,
  // ... other order fields
});

// After eWAY gives you the AccessCode:
const response = await client.createTransaction(rapid.Enum.Method.RESPONSIVE_SHARED, txnObj);
const accessCode = response.get('SharedPaymentUrl') ? response.get('AccessCode') : null;

if (!accessCode) {
  throw new Error('Failed to get AccessCode from eWAY');
}

// Store the AccessCode — this is your lookup key on the callback
await db.orders.update(order.id, { accessCode });

// Redirect customer to eWAY
res.redirect(response.get('SharedPaymentUrl'));


// ─── Step 2: In your callback handler ──────────────────────────

app.get('/payment/return', async (req, res) => {
  const accessCode = req.query.AccessCode;

  // Look up the order by AccessCode
  const order = await db.orders.findOne({ where: { accessCode } });

  if (!order) {
    return res.status(400).send('Invalid callback');
  }

  // ─── IDEMPOTENCY GUARD ────────────────────────────────────────
  // Atomic update: only transition from PENDING_PAYMENT to PROCESSING.
  // If the order is already PROCESSING or PAID or FAILED,
  // this update will affect 0 rows, and we handle that.
  const updated = await db.orders.atomicStatusUpdate({
    id: order.id,
    fromStatus: 'PENDING_PAYMENT',   // Only update if still in this state
    toStatus: 'PROCESSING'           // Lock it while we query eWAY
  });

  if (updated === 0) {
    // Another request already processed (or is processing) this order.
    // Redirect to appropriate page based on current order status.
    const currentOrder = await db.orders.findById(order.id);
    if (currentOrder.status === 'PAID') {
      return res.redirect('/order/success?id=' + order.id);
    } else {
      return res.redirect('/order/status?id=' + order.id);
    }
  }
  // ─────────────────────────────────────────────────────────────

  try {
    // Now query eWAY (only one request will reach this point per order)
    const result = await client.queryTransaction(accessCode);
    const txn = result.get('Transactions')?.[0];

    if (txn && txn.TransactionStatus === true && txn.ResponseCode === '00') {
      await db.orders.update(order.id, {
        status: 'PAID',
        ewayTransactionId: txn.TransactionID,
        authCode: txn.AuthorisationCode,
        paidAt: new Date()
      });
      return res.redirect('/order/success?id=' + order.id);
    } else {
      await db.orders.update(order.id, {
        status: 'PAYMENT_FAILED',
        ewayResponseCode: txn?.ResponseCode,
        ewayResponseMessage: txn?.ResponseMessage
      });
      return res.redirect('/order/failed?id=' + order.id);
    }
  } catch (err) {
    // Query failed — reset to PENDING_PAYMENT so it can be retried
    await db.orders.update(order.id, { status: 'PENDING_PAYMENT' });
    throw err;
  }
});
```

### Additional Protection: Deduplicate on eWAY TransactionID

Even with the above pattern, always store the eWAY `TransactionID` in your database with a **unique constraint**. This provides a second line of defense:

```sql
ALTER TABLE orders ADD CONSTRAINT uq_eway_transaction_id UNIQUE (eway_transaction_id);
```

If you somehow process the same eWAY TransactionID twice, the insert/update will fail with a constraint violation rather than silently creating a duplicate.

---

## 9. Sandbox vs Production Endpoint Values

### Accepted Values for `rapid.createClient(key, password, ENDPOINT)`

The Node.js `eway-rapid` SDK accepts the following string values (case-insensitive, but these are the documented forms):

| Mode | Accepted Values | What it does |
|---|---|---|
| Sandbox | `'Sandbox'`, `'sandbox'` | Points to `api.sandbox.ewaypayments.com` |
| Production | `'Production'`, `'production'` | Points to `api.ewaypayments.com` |

```js
// Sandbox
const client = rapid.createClient(apiKey, apiPassword, 'Sandbox');

// Production
const client = rapid.createClient(apiKey, apiPassword, 'Production');
```

### Direct REST Endpoint URLs (for raw HTTP calls, not SDK)

| Environment | RSP Create AccessCode | Query Result |
|---|---|---|
| Sandbox | `https://api.sandbox.ewaypayments.com/AccessCodesShared` | `https://api.sandbox.ewaypayments.com/AccessCode/{AccessCode}` |
| Production | `https://api.ewaypayments.com/AccessCodesShared` | `https://api.ewaypayments.com/AccessCode/{AccessCode}` |

### SharedPaymentUrl Hostname

| Environment | Hosted Page URL prefix |
|---|---|
| Sandbox | `https://secure-au.sandbox.ewaypayments.com/sharedpage/sharedpayment?AccessCode=...` |
| Production | `https://secure-au.ewaypayments.com/sharedpage/sharedpayment?AccessCode=...` |

### Sandbox Test Card Numbers

| Card Network | Number | Expiry | CVN |
|---|---|---|---|
| Visa | `4444333322221111` | Any future | Any 3 digits |
| Mastercard | `5105105105105100` | Any future | Any 3 digits |
| Mastercard (2-series) | `2223000048400011` | Any future | Any 3 digits |
| Amex | `378282246310005` | Any future | Any 4 digits |
| Diners | `38520000023237` | Any future | Any 3 digits |

All test cards pass a Luhn check but are declined on the live gateway. Use them only in sandbox.

---

## 10. TransactionType Field — Purchase vs MOTO vs Recurring

The `TransactionType` field is a required string on every transaction request. It tells the bank (not just eWAY) what kind of transaction is being processed, which affects the bank's fraud rules, CVN requirements, and liability shift.

### `"Purchase"` (Use This for RSP)

```
"TransactionType": "Purchase"
```

- **Definition:** A standard eCommerce transaction where the cardholder is present and initiating the payment.
- **CVN:** Required (collected by eWAY on the hosted page).
- **3DS:** Fully supported and auto-triggered as needed.
- **Liability shift:** 3DS-authenticated Purchase transactions have chargeback liability shifted to the card issuer.
- **Use for RSP:** YES — this is the correct value for your use case. Your customer is sitting at their browser, actively choosing to pay.

### `"MOTO"` (Mail Order / Telephone Order)

```
"TransactionType": "MOTO"
```

- **Definition:** Used when a merchant processes a payment **on behalf of a customer** who is not physically present and initiating the transaction themselves — e.g., the merchant's staff takes a card number over the phone or via email.
- **CVN:** May still be required depending on your bank agreement, but MOTO transactions typically do not have 3DS because the cardholder is not at a browser.
- **3DS:** Not applicable for MOTO.
- **Use for RSP:** NO. MOTO conflicts with the RSP model. The customer IS present on the RSP hosted page, so using MOTO for a customer-initiated RSP transaction is incorrect and may be declined or flagged by the bank.

### `"Recurring"` (Automated Billing)

```
"TransactionType": "Recurring"
```

- **Definition:** Used for automated, merchant-initiated repeat charges against a stored token (e.g., subscriptions, installments).
- **CVN:** NOT required (by design — you don't have the CVN for a stored card). Note from eWAY: "the bank usually requires you to have already processed a fully authorised transaction with CVN for that credit card" before charging it as Recurring.
- **3DS:** Not applicable for merchant-initiated Recurring charges.
- **Use for RSP:** NO for the initial charge. For a subscription flow, use `"Purchase"` with `"SaveCustomer": true` for the first RSP payment (which captures the card token), then use `"Recurring"` with Direct Connection + `TokenCustomerID` for all subsequent automated charges.

---

## 11. Webhooks / Server-to-Server Notifications

### Does eWAY have Webhooks?

**No.** As of the current eWAY Rapid API (v47), eWAY does **not** provide a webhook or server-to-server (IPN) notification system for RSP payment events in the way that Stripe, PayPal, or Braintree do.

There is **no HTTP POST** sent by eWAY to a URL you configure when a payment completes. The only notification mechanism eWAY provides is the **browser redirect** to your `RedirectUrl` or `CancelUrl`.

### What This Means for Your Integration

This is a critical architectural point:

1. **You cannot rely on eWAY to proactively tell your server a payment happened.** You must handle it in the `RedirectUrl` callback.
2. **If the customer closes the browser before being redirected,** your server will not know the payment was made. The browser redirect never fires.

### Recommended Pattern to Handle Browser-Close Scenarios

Because the browser redirect can be missed, implement a reconciliation job:

```js
// Background job — runs every 5–15 minutes
// Finds orders stuck in PENDING_PAYMENT for more than N minutes
async function reconcilePendingPayments() {
  const staleOrders = await db.orders.findAll({
    where: {
      status: 'PENDING_PAYMENT',
      createdAt: { $lt: new Date(Date.now() - 15 * 60 * 1000) }, // > 15 min old
      accessCode: { $ne: null }
    }
  });

  for (const order of staleOrders) {
    try {
      const result = await client.queryTransaction(order.accessCode);
      const txn = result.get('Transactions')?.[0];

      if (!txn) continue; // AccessCode may have expired

      if (txn.TransactionStatus === true && txn.ResponseCode === '00') {
        // Payment succeeded but browser never redirected back
        await db.orders.update(order.id, {
          status: 'PAID',
          ewayTransactionId: txn.TransactionID,
          authCode: txn.AuthorisationCode
        });
        // Send confirmation email, fulfill order, etc.
      } else if (txn.TransactionID > 0 && !txn.TransactionStatus) {
        // A transaction was attempted and declined
        await db.orders.update(order.id, { status: 'PAYMENT_FAILED' });
      }
      // If TransactionID === 0, the customer hasn't attempted payment yet
      // Leave as PENDING_PAYMENT for now

    } catch (err) {
      console.error(`Reconciliation error for order ${order.id}:`, err);
    }
  }
}
```

### AccessCode Expiry

eWAY AccessCodes expire after a period of inactivity (typically 3–24 hours; the exact value is not publicly documented in the API reference). After expiry, `queryTransaction` will return no transaction data. Design your reconciliation job to mark very old PENDING orders as expired after a reasonable window (e.g., 24 hours).

---

## 12. Complete Working Flow — Annotated Code

Below is a complete, production-ready Express.js implementation covering all steps.

```js
// ─── Dependencies ───────────────────────────────────────────────
const express = require('express');
const rapid = require('eway-rapid');
const db = require('./db'); // Your database abstraction layer

const app = express();
app.use(express.json());

// ─── eWAY Client ────────────────────────────────────────────────
// Use environment variables — never hardcode credentials.
const client = rapid.createClient(
  process.env.EWAY_API_KEY,
  process.env.EWAY_API_PASSWORD,
  process.env.NODE_ENV === 'production' ? 'Production' : 'Sandbox'
);

// ────────────────────────────────────────────────────────────────
// STEP 1: Create a pending order and get the RSP URL from eWAY
// Called by your frontend when the customer clicks "Proceed to Payment"
// ────────────────────────────────────────────────────────────────
app.post('/api/checkout', async (req, res) => {
  const {
    customerName, email, phone,
    shippingAddress,
    cart
  } = req.body;

  // 1a. Calculate totals from your cart (in cents)
  const totalCents = cart.items.reduce((sum, item) => sum + item.unitCents * item.qty, 0);

  // 1b. Create a pending order in YOUR database first
  const order = await db.orders.create({
    status: 'PENDING_PAYMENT',
    totalCents,
    customerEmail: email,
    // ... store all cart data, customer data, etc.
  });

  // 1c. Split customerName into first/last
  const [firstName, ...lastParts] = customerName.trim().split(' ');
  const lastName = lastParts.join(' ') || '';

  // 1d. Build the eWAY transaction request
  const transactionRequest = {
    "RedirectUrl": `${process.env.BASE_URL}/payment/return`,
    "CancelUrl":   `${process.env.BASE_URL}/payment/cancel`,
    "TransactionType": "Purchase",

    "Payment": {
      "TotalAmount": totalCents,
      "InvoiceNumber": `INV-${order.id}`,
      "InvoiceDescription": `Order ${order.id}`,
      "InvoiceReference": String(order.id),
      "CurrencyCode": "AUD"
    },

    "Customer": {
      "FirstName": firstName,
      "LastName": lastName,
      "Email": email,
      "Phone": phone,
      "Country": shippingAddress.country.toLowerCase(),
      "Street1": shippingAddress.street1,
      "Street2": shippingAddress.street2 || "",
      "City": shippingAddress.city,
      "State": shippingAddress.state,
      "PostalCode": shippingAddress.postcode
    },

    "ShippingAddress": {
      "ShippingMethod": "DesignatedByCustomer",
      "FirstName": firstName,
      "LastName": lastName,
      "Street1": shippingAddress.street1,
      "Street2": shippingAddress.street2 || "",
      "City": shippingAddress.city,
      "State": shippingAddress.state,
      "Country": shippingAddress.country.toLowerCase(),
      "PostalCode": shippingAddress.postcode,
      "Phone": phone
    },

    // Line items (optional but good for records)
    "Items": cart.items.map(item => ({
      "SKU": String(item.sku).slice(0, 12),
      "Description": String(item.name).slice(0, 26),
      "Quantity": item.qty,
      "UnitCost": item.unitCents,
      "Tax": 0,
      "Total": item.unitCents * item.qty
    })),

    // Options: store only your order ID (pipe-delimited, no JSON)
    // This lets you look up the order in your DB on the callback.
    "Options": [
      { "Value": `orderId=${order.id}` }
    ],

    "CustomerIP": req.ip,
    "DeviceID": "ecommerce-web"
  };

  // 1e. Call eWAY
  let ewayResponse;
  try {
    ewayResponse = await client.createTransaction(
      rapid.Enum.Method.RESPONSIVE_SHARED,
      transactionRequest
    );
  } catch (err) {
    console.error('eWAY network error:', err);
    await db.orders.update(order.id, { status: 'PAYMENT_ERROR' });
    return res.status(502).json({ error: 'Payment gateway unavailable' });
  }

  // 1f. Check for API-level errors
  const apiErrors = ewayResponse.get('Errors');
  if (apiErrors) {
    const errorMessages = apiErrors.split(',').map(code => rapid.getMessage(code, 'en'));
    console.error('eWAY API errors:', errorMessages);
    await db.orders.update(order.id, { status: 'PAYMENT_ERROR' });
    return res.status(400).json({ error: 'Payment setup failed', details: errorMessages });
  }

  const sharedPaymentUrl = ewayResponse.get('SharedPaymentUrl');
  const accessCode = ewayResponse.get('AccessCode');

  if (!sharedPaymentUrl || !accessCode) {
    console.error('eWAY returned no SharedPaymentUrl or AccessCode');
    return res.status(502).json({ error: 'Invalid gateway response' });
  }

  // 1g. Store the AccessCode against the order
  await db.orders.update(order.id, { accessCode, status: 'AWAITING_PAYMENT' });

  // 1h. Return the redirect URL to the frontend
  // (Frontend will navigate user to this URL)
  return res.json({ redirectUrl: sharedPaymentUrl });
});


// ────────────────────────────────────────────────────────────────
// STEP 2: Handle the browser redirect back from eWAY (success path)
// eWAY redirects here with ?AccessCode=xxx appended
// ────────────────────────────────────────────────────────────────
app.get('/payment/return', async (req, res) => {
  const accessCode = req.query.AccessCode;

  if (!accessCode) {
    return res.redirect('/checkout?error=missing_access_code');
  }

  // 2a. Look up the order by AccessCode
  const order = await db.orders.findOne({ where: { accessCode } });
  if (!order) {
    console.error(`Unknown AccessCode: ${accessCode}`);
    return res.redirect('/checkout?error=invalid_session');
  }

  // 2b. Idempotency guard — atomic status transition
  const locked = await db.orders.atomicStatusUpdate({
    id: order.id,
    fromStatus: 'AWAITING_PAYMENT',
    toStatus: 'PROCESSING'
  });

  if (locked === 0) {
    // Already being processed or already processed
    const currentOrder = await db.orders.findById(order.id);
    if (currentOrder.status === 'PAID') {
      return res.redirect(`/order/success?id=${order.id}`);
    }
    return res.redirect(`/order/status?id=${order.id}`);
  }

  // 2c. Query eWAY for the actual result
  let result;
  try {
    result = await client.queryTransaction(accessCode);
  } catch (err) {
    console.error('queryTransaction failed:', err);
    await db.orders.update(order.id, { status: 'AWAITING_PAYMENT' }); // rollback lock
    return res.redirect(`/order/error?id=${order.id}`);
  }

  const apiErrors = result.get('Errors');
  if (apiErrors) {
    console.error('queryTransaction API errors:', apiErrors);
    await db.orders.update(order.id, { status: 'AWAITING_PAYMENT' });
    return res.redirect(`/order/error?id=${order.id}`);
  }

  const transactions = result.get('Transactions');
  if (!transactions || transactions.length === 0) {
    await db.orders.update(order.id, { status: 'AWAITING_PAYMENT' });
    return res.redirect(`/order/error?id=${order.id}`);
  }

  const txn = transactions[0];

  // 2d. THE DEFINITIVE SUCCESS CHECK
  if (txn.TransactionStatus === true && txn.ResponseCode === '00') {
    await db.orders.update(order.id, {
      status: 'PAID',
      ewayTransactionId: txn.TransactionID,
      ewayAuthCode: txn.AuthorisationCode,
      ewayResponseCode: txn.ResponseCode,
      cardType: txn.Customer?.CardDetails?.CardType,
      maskedCard: txn.Customer?.CardDetails?.Number,
      paidAt: new Date()
    });

    // Trigger fulfillment, send confirmation email, etc.
    await fulfillOrder(order.id);

    return res.redirect(`/order/success?id=${order.id}`);

  } else {
    await db.orders.update(order.id, {
      status: 'PAYMENT_FAILED',
      ewayTransactionId: txn.TransactionID,
      ewayResponseCode: txn.ResponseCode,
      ewayResponseMessage: txn.ResponseMessage
    });

    return res.redirect(`/order/failed?id=${order.id}&code=${txn.ResponseCode}`);
  }
});


// ────────────────────────────────────────────────────────────────
// STEP 3: Handle the cancel redirect from eWAY
// Customer clicked "Cancel" on the eWAY hosted page
// ────────────────────────────────────────────────────────────────
app.get('/payment/cancel', async (req, res) => {
  const accessCode = req.query.AccessCode;
  // accessCode is still provided by eWAY on cancel

  if (accessCode) {
    // Optional: query to confirm no payment was processed, then
    // mark the order as cancelled so it won't linger as AWAITING_PAYMENT
    try {
      const result = await client.queryTransaction(accessCode);
      const transactions = result.get('Transactions');
      const txn = transactions?.[0];

      if (txn && txn.TransactionID === 0) {
        // Confirmed: no payment was attempted. Mark order cancelled.
        await db.orders.update(
          { where: { accessCode } },
          { status: 'CANCELLED' }
        );
      }
    } catch (err) {
      // Non-critical — the order will be cleaned up by reconciliation
      console.warn('Cancel query failed:', err.message);
    }
  }

  // Redirect customer back to cart
  return res.redirect('/cart');
});
```

---

## Summary Reference Card

| Topic | Key Fact |
|---|---|
| SDK method for RSP | `rapid.Enum.Method.RESPONSIVE_SHARED` |
| Endpoint string (Sandbox) | `'Sandbox'` or `'sandbox'` |
| Endpoint string (Production) | `'Production'` or `'production'` |
| Amount format | Integer cents (e.g. $9.99 = `999`) |
| Country field format | Lowercase ISO 3166 alpha-2 (e.g. `"au"`) |
| Success check | `TransactionStatus === true` AND `ResponseCode === '00'` |
| Options max count | 99 per transaction |
| Options max chars per Value | 254 (truncated silently beyond that) |
| Options encoding issue | Use pipe-delimited strings, not JSON (quotes get HTML-encoded) |
| Options returned in query? | Yes, verbatim in `Transactions[0].Options` |
| 3DS handling | Fully automatic on eWAY's page, no code needed from you |
| Webhooks | eWAY does NOT provide server-to-server payment webhooks |
| Idempotency | Implement with DB state machine + unique constraint on eWAY TransactionID |
| Browser-close risk | Implement a background reconciliation job using `queryTransaction` |
| TransactionType for RSP | `"Purchase"` (never `"MOTO"` or `"Recurring"` for customer-initiated RSP) |
| AccessCode expiry | Not publicly documented; treat as expired after ~24 hours |
