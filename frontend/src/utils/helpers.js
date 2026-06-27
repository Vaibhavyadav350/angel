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


