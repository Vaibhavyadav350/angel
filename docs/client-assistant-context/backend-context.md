# Angel Fashion Studio — How the Store Actually Works

Plain-language business rules, so an assistant can tell the difference between
"that's already how it works" and "that would genuinely need to change".
No code, no technical implementation detail — just the rules.

## Money

- All prices are in AUD and already include GST (Australian sales tax) — GST
  is not added on top at checkout, it's shown separately on the invoice as
  "included in the price shown".
- A product can have its own discount percentage (set per product in admin).
  Coupons apply on top of that, at checkout, not per product.
- The price shown anywhere on the site (product card, cart, invoice) is
  always the same number, calculated the same way — there is deliberately only
  one place in the system that decides "what does this cost", so it can't
  show one price on the card and charge a different one at checkout.

## Shipping

- Shipping is calculated by the **total weight of the cart**, not a flat fee
  per item and not per product. There are weight bands (e.g. up to 500g, up to
  2kg, etc.), each with a Standard and an Express price.
- Orders over a threshold (currently $200) get free Standard shipping — this
  credits the customer the *normal* Standard rate, not whatever the cheapest
  band happens to be.
- Most products are **made to order**, not held ready-stocked — so most
  products carry a lead time (days before dispatch) shown to the customer.
  A small number of products are genuinely ready-to-ship.

## Stock

- Stock is tracked per exact size + colour combination for clothing (e.g.
  "Red, size M" and "Red, size L" are counted separately), except Jewellery,
  which has no sizes and is tracked as one number per product.
- Stock only goes down when a payment actually succeeds — not when something
  is merely added to a cart. Cancelling or returning an order puts the stock
  back.
- If a customer starts checkout but abandons it, the stock they were
  considering is held briefly (a short reservation) and then automatically
  released if they don't complete payment — so items can't be "locked up"
  indefinitely by an abandoned cart.

## Payment

- Payments go through **eWAY**, an Australian payment gateway — the customer
  enters their card on eWAY's own secure page, never on this site directly.
- Accepted methods depend on what's switched on in the eWAY account itself,
  not on anything the website controls.
- When a payment succeeds, the order is created automatically, stock is
  deducted, the customer gets an emailed invoice, and the store owner also
  gets an email notification of the new order.

## Email

- Sent via a transactional email service (ZeptoMail), not a personal inbox.
- Customers receive: a welcome email on signup, an order confirmation with
  invoice attached, a shipping/status update (with tracking number once
  available), and a return/refund status update.
- The store owner receives an email for every new order, with the customer's
  details, what they bought, and the delivery address — this is a genuine
  order alert, not just a copy of the customer's email.

## Accounts

- Customers can sign up/log in (via email or Google) to track orders and
  save a wishlist.
- Admin panel logins are completely separate from customer accounts, and
  have their own two access levels (see the admin reference).

## What this means for triaging a request

- "A product shows the wrong price / shipping seems wrong" → almost always a
  data issue (check the product's price/discount, or the cart's total
  weight) rather than the underlying pricing logic being broken — but still
  worth reporting exactly what was seen (product, cart contents, amount
  shown) rather than "shipping is wrong".
- "Can we accept [a payment method]" → depends on the eWAY account settings,
  not something to build in the website.
- "A customer says they didn't get an email" → check spam first; if it's
  systematic (nobody is getting emails), that's a real bug to report
  urgently, since it affects every order.
