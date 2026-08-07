import React, { useEffect, useRef, useState } from 'react';

/**
 * Number input that behaves the way people expect.
 *
 * The admin forms bound number inputs straight to state with
 * `onChange={e => onField(name, Number(e.target.value))}`. Two problems came from
 * that, and both were reported by the store owner:
 *
 *   1. Pressing backspace could not clear the field. `Number('')` is 0, so the
 *      state went to 0 and React immediately re-rendered the input as "0".
 *   2. Typing into a field showing 0 produced "0451" instead of "451", because
 *      the leading zero could never be removed first.
 *
 * The fix is to keep the *text* locally while the field has focus and only push a
 * parsed number outwards. The value shown is re-synced from the prop whenever the
 * field is not being edited, so programmatic changes still land.
 */
const NumberField = ({
  value,
  onChange,
  placeholder = '',
  prefix,
  suffix,
  min,
  max,
  step,
  disabled = false,
  className = '',
  // Treat 0 as "nothing entered" and show the placeholder instead. Right for
  // optional fields (cost price, shipping weight); wrong for a real quantity.
  blankWhenZero = true,
  id,
}) => {
  const toText = (v) => {
    if (v === null || v === undefined || v === '') return '';
    if (blankWhenZero && Number(v) === 0) return '';
    return String(v);
  };

  const [text, setText] = useState(() => toText(value));
  const focused = useRef(false);

  // Keep in sync with the outside world, but never fight the user mid-typing.
  useEffect(() => {
    if (!focused.current) setText(toText(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleChange = (e) => {
    let raw = e.target.value;

    // Allow only digits, one dot, and a leading minus when negatives are permitted.
    const allowNegative = min === undefined || Number(min) < 0;
    raw = raw.replace(allowNegative ? /[^0-9.-]/g : /[^0-9.]/g, '');

    // "0451" -> "451", but keep "0", "0.", "0.5" intact.
    raw = raw.replace(/^(-?)0+(?=\d)/, '$1');

    setText(raw);

    if (raw === '' || raw === '-' || raw === '.') {
      onChange(0);
      return;
    }
    const n = Number(raw);
    if (Number.isFinite(n)) onChange(n);
  };

  const handleBlur = () => {
    focused.current = false;
    // Clamp once the user is done, so typing "9" on the way to "95" is not fought.
    let n = Number(text);
    if (text === '' || !Number.isFinite(n)) {
      setText(toText(value));
      return;
    }
    if (min !== undefined && n < Number(min)) n = Number(min);
    if (max !== undefined && n > Number(max)) n = Number(max);
    onChange(n);
    setText(toText(n));
  };

  const base =
    'w-full bg-champagne/50 border border-bronze/20 rounded px-3 py-2.5 text-sm text-bronze placeholder:text-bronze/30 focus:outline-none focus:border-gold transition-colors';

  return (
    <div className="relative">
      {prefix && <span className="absolute left-3 top-2.5 text-bronze/40 text-sm pointer-events-none">{prefix}</span>}
      <input
        id={id}
        // `text` rather than `number` so the browser cannot silently reject an
        // in-progress value, and so the caret never jumps while typing.
        type="text"
        inputMode="decimal"
        autoComplete="off"
        disabled={disabled}
        value={text}
        placeholder={placeholder}
        onFocus={() => { focused.current = true; }}
        onBlur={handleBlur}
        onChange={handleChange}
        className={`${base} ${prefix ? 'pl-8' : ''} ${suffix ? 'pr-10' : ''} ${disabled ? 'opacity-60 cursor-not-allowed' : ''} ${className}`}
      />
      {suffix && <span className="absolute right-3 top-2.5 text-bronze/40 text-sm pointer-events-none">{suffix}</span>}
    </div>
  );
};

export default NumberField;
