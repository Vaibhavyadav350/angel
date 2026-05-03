# eWAY Payment Integration — Fix Plan

## Bugs Found (Reference Doc vs Our Code)

### Frontend (`CheckoutPage/index.js`)
- [x] ~~Wrong encryption function (`window.eWAY.encrypt` → `eCrypt.encryptValue`)~~
- [x] ~~Missing `/* global eCrypt */` ESLint declaration~~
- [ ] **ExpiryYear sends 4-digit `"2030"` — eWAY requires 2-digit `"30"`**
- [ ] **CardDetails.Name not sent — it is REQUIRED by eWAY**
- [ ] Expiry year dropdown generates 4-digit values, needs to send last 2 digits

### Backend (`paymentController.js`)
- [x] ~~Missing `createOrderFromTransaction` import~~
- [ ] **SDK response: uses `response.Errors` directly — must use `response.get('Errors')`**
- [ ] **SDK response: uses `response.TransactionStatus` — must use `response.get('TransactionStatus')`**
- [ ] **Options array can exceed 3 items** — eWAY max is 3, chunking can produce 5+
- [ ] **`EWAY_ENDPOINT` is a URL** — SDK expects `"Sandbox"` or `"Production"` string
- [ ] Errors field not human-readable — should use `rapid.getMessage()` to translate V6xxx codes
- [ ] `RedirectUrl` and `CancelUrl` in payload shouldn't be sent for DIRECT method

### Backend (`.env`)
- [ ] **`EWAY_ENDPOINT` = `https://api.sandbox.ewaypayments.com/`** → should be `Sandbox`

---

## Implementation Steps

### Step 1: Fix `.env` — EWAY_ENDPOINT format
- [ ] Change `EWAY_ENDPOINT=https://api.sandbox.ewaypayments.com/` → `EWAY_ENDPOINT=Sandbox`

### Step 2: Fix `paymentController.js` — SDK response + Options + CardDetails.Name
- [ ] Use `response.get()` instead of direct property access
- [ ] Add `Name` field to CardDetails from request shipping name
- [ ] Simplify Options to max 3 items (compress metadata)  
- [ ] Use `rapid.getMessage()` for human-readable error messages
- [ ] Remove `RedirectUrl`/`CancelUrl` from DIRECT payload
- [ ] Convert ExpiryYear to 2-digit on backend (safety net)

### Step 3: Fix `CheckoutPage/index.js` — ExpiryYear + nameOnCard
- [ ] Send `nameOnCard` field to backend alongside encrypted card
- [ ] Convert 4-digit expiry year to 2-digit before sending
- [ ] Add "Name on Card" input field to the payment form

### Step 4: Verify & Test
- [ ] Restart backend — confirm no errors
- [ ] Browser E2E test with "Elite Anarkali Ensemble"
- [ ] Confirm `[EWAY DIRECT SUCCESS]` in backend logs
