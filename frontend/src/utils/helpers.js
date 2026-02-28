export const formatPrice = (number) => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  }).format(number);
};

export const getUniqueValues = (data, type) => {
  let unique = data.map((item) => item[type]);

  if (type === 'colors') {
    unique = unique.flat();
  }

  unique = new Set(unique);
  return ['all', ...unique];
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


