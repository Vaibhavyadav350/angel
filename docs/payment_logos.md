# Payment method logos

The footer strip is driven by `frontend/src/components/PaymentMethods/index.js`.
A logo appears **only** once its file exists — a missing file is skipped
silently. Nothing breaks while these are being collected.

Drop the files here:

```
frontend/public/assets/payment/
```

| Method | Filename | Where to get it |
|---|---|---|
| Visa | `visa.svg` | Visa Brand Center — merchant/acceptance marks |
| Mastercard | `mastercard.svg` | Mastercard Brand Center — the "Mastercard Symbol" |
| American Express | `amex.svg` | Amex merchant marketing / brand guidelines — the Blue Box mark |
| PayPal | `paypal.svg` | PayPal Logo Center |
| Apple Pay | `apple-pay.svg` | Apple Developer — Apple Pay Marketing Resources |
| Google Pay | `google-pay.svg` | Google Pay API brand guidelines |

Search for "<brand> brand center" if a link has moved — these URLs change and the
official centre is always the correct source.

## Do not substitute

These are trademarks, not decoration. Icon packs, CDN sprite sheets, "payment
icons" npm packages and hand-redrawn copies all breach the schemes' usage terms,
and several are outdated (Mastercard's interlocking circles were redrawn in 2016,
Visa's wordmark in 2021). Take them from the owner.

**Apple Pay and Google Pay are the strict ones.** Both publish mandatory rules on
minimum size, clear space, and which mark variant may be used on a light or dark
ground. Read their guidelines before placing them — Apple in particular treats
misuse as a breach of the developer agreement.

## Only show what actually works

Confirm each one is live in **MYeWAY → Settings → Payment Methods** before adding
its file. The card entry happens on eWAY's Responsive Shared Page, so what a
shopper can actually pay with comes from the eWAY account and the acquiring
agreement — the website has no say in it.

- **Visa, Mastercard** — standard on every Australian eWAY account.
- **American Express** — requires a separate Amex merchant agreement. Amex also
  charges a higher merchant service fee; worth confirming the rate before
  enabling it.
- **PayPal** — a separate PayPal business account linked in eWAY.
- **Apple Pay / Google Pay** — enabled in MYeWAY. Apple Pay additionally requires
  **domain verification** for `angelfashionstudio.org`; without it the button
  will not appear on the hosted page even though the logo shows in the footer.

A logo in the footer for a method that fails at checkout is worse than no logo:
the shopper has already chosen the site and entered their details before finding
out.

## Sizing

The strip renders each mark at 16px high inside a white tile that grows to fit,
so the wide Apple Pay and Google Pay marks are not squashed into the same box as
the roughly 3:2 card marks. SVG is preferred. If a scheme only offers PNG, use a
2x asset and change the extension in the `METHODS` list — the filename carries
its own extension, so no other change is needed.
