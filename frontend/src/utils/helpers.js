/**
 * Force a URL to HTTPS. Cloudinary and some legacy uploads stored images as
 * http://, which causes mixed-content warnings on the HTTPS storefront.
 */
export const ensureHttps = (url) => {
  if (!url || typeof url !== 'string') return url;
  return url.replace(/^http:\/\//i, 'https://');
};

export const formatPrice = (number) => {
  // Always show cents so the storefront matches invoices/admin (e.g. $206.18,
  // not $206). Money is AUD, GST-inclusive.
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
  }).format(Number(number) || 0);
};

export const getUniqueValues = (data, type) => {
  let unique = data.map((item) => item[type]).flat(Infinity).filter(Boolean);
  return ['all', ...new Set(unique)];
};

export const checkObjectProperties = (object) => {
  const isEmpty = Object.values(object).every((x) => x === null || x === '');
  return isEmpty;
};

export const formatAddress = (data) => {
  const {
    shippingInfo: { address, city, state, country, pinCode },
  } = data;
  return `${address}, ${city}, ${state} - ${pinCode}, ${country}`;
};

export const getOrderStatusColor = (status) => {
  if (status === 'processing' || status === 'pending') {
    return 'orange';
  }
  if (status === 'confirmed') {
    return 'blue';
  }
  if (status === 'rejected' || status === 'cancelled') {
    return 'red';
  }
  if (status === 'delivered') {
    return 'green';
  }
  if (status === 'shipped') {
    return 'blue';
  }
  return 'gray';
};



/**
 * Shorten a label for a table cell, appending an ellipsis only when it was
 * actually cut. Tolerates null/undefined — admin tables render records whose
 * fields can legitimately be missing (e.g. an order item whose product was
 * deleted), and a bare `value.substring()` there throws and blanks the page.
 */
export const truncate = (value, max = 25) => {
  const text = String(value ?? '').trim();
  if (!text) return '—';
  return text.length > max ? `${text.slice(0, max)}…` : text;
};

/**
 * Build a CSV string with proper escaping.
 *
 * The Inventory export previously did `row.join(',')`, which silently corrupted
 * the file for any product whose name contains a comma — and most of them do
 * ("Wine Floral Embroidered Anarkali Suit Set, Size L"). Values containing a
 * comma, quote or newline must be wrapped in quotes with inner quotes doubled.
 */
export const toCsv = (headers, rows) => {
  const cell = (v) => {
    const s = v === null || v === undefined ? '' : String(v);
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [headers, ...rows].map((r) => r.map(cell).join(',')).join('\r\n');
};

/** Trigger a browser download for generated text, cleaning up the object URL. */
export const downloadTextFile = (filename, text, mime = 'text/csv;charset=utf-8;') => {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
