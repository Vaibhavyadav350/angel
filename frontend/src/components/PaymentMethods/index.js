import React, { useState } from 'react';

/**
 * Accepted payment methods.
 *
 * Checkout runs on eWAY's Responsive Shared Page, so the methods that actually
 * work are the ones enabled on the studio's eWAY account and acquiring
 * agreement — not anything this codebase decides.
 *
 * Only advertise what is genuinely enabled. A shopper who picks the site because
 * it shows an Amex logo and then cannot pay is worse off than one who never saw
 * the logo, and under Australian Consumer Law an accepted-payment claim is a
 * representation like any other.
 *
 * That is enforced here by construction rather than by discipline: a logo only
 * appears once its file exists in `public/assets/payment/`. A missing file is
 * skipped silently, so the strip can never show a method that has not been
 * deliberately added, and never renders a broken image either.
 *
 * Logos are trademarked brand assets and are NOT bundled with this repo. Each
 * must be downloaded from its owner's brand centre — see docs/payment_logos.md
 * for sources, exact filenames and the sizing rules the schemes impose.
 */
const METHODS = [
  { file: 'visa.svg', label: 'Visa' },
  { file: 'mastercard.svg', label: 'Mastercard' },
  { file: 'amex.svg', label: 'American Express' },
  { file: 'paypal.svg', label: 'PayPal' },
  { file: 'apple-pay.svg', label: 'Apple Pay' },
  { file: 'google-pay.svg', label: 'Google Pay' },
];

const PaymentMethods = ({ className = '' }) => {
  const [missing, setMissing] = useState({});
  const available = METHODS.filter((m) => !missing[m.file]);

  return (
    <div className={`flex flex-wrap items-center gap-x-5 gap-y-3 ${className}`}>
      <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/30">
        Secure payments by eWAY
      </span>

      {available.length > 0 && (
        <ul className="flex flex-wrap items-center gap-2">
          {available.map((m) => (
            /* A white tile per mark. Visa and Mastercard are roughly 3:2, while
               the Apple Pay and Google Pay marks are much wider — so the tile
               grows with its logo instead of forcing everything into one box and
               squashing the wide ones. Every scheme's guidelines require clear
               space around the mark; the padding here provides it. */
            <li
              key={m.file}
              className="h-7 min-w-[44px] rounded bg-white/90 flex items-center justify-center px-2"
            >
              <img
                src={`/assets/payment/${m.file}`}
                alt={m.label}
                loading="lazy"
                decoding="async"
                className="max-h-4 w-auto object-contain"
                onError={() => setMissing((prev) => ({ ...prev, [m.file]: true }))}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PaymentMethods;
