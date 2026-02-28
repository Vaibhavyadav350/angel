import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useOrderContext } from '../../context/order_context';
import { useCartContext } from '../../context/cart_context';
const AU_STATES = [
  { code: 'NSW', name: 'New South Wales' },
  { code: 'VIC', name: 'Victoria' },
  { code: 'QLD', name: 'Queensland' },
  { code: 'WA', name: 'Western Australia' },
  { code: 'SA', name: 'South Australia' },
  { code: 'TAS', name: 'Tasmania' },
  { code: 'ACT', name: 'Australian Capital Territory' },
  { code: 'NT', name: 'Northern Territory' }
];

// Validation functions
const validatePhone = (phone, countryCode) => {
  const validations = {
    'IN': /^\d{10}$/,
    'AU': /^0[2-478](?:[ -]?[0-9]){8}$/,
    'US': /^\+?1?[2-9]\d{2}[2-9]\d{2}\d{4}$/,
    'GB': /^(\+44|0)[1-9]\d{8,9}$/,
    'CA': /^(\+1)?[2-9]\d{2}[2-9]\d{2}\d{4}$/,
  };
  return validations[countryCode]?.test(phone) || /^\+?[\d\s-]{7,15}$/.test(phone);
};

const validateZipCode = (postalCode, countryCode) => {
  const validations = {
    'IN': /^[1-9][0-9]{5}$/,
    'AU': /^\d{4}$/,
    'US': /^\d{5}(-\d{4})?$/,
    'GB': /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i,
    'CA': /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i,
  };
  return validations[countryCode]?.test(postalCode) || /^[\w\s-]{3,10}$/.test(postalCode);
};

function ShippingForm({ confirmShipping }) {
  const {
    shipping: {
      name,
      phone_number,
      address: { line1, postal_code, city, state, country },
    },
    updateShipping,
  } = useOrderContext();
  const { cart } = useCartContext();

  // Ensure strictly AU context in context state if not present
  useEffect(() => {
    if (!country || country !== 'AU') {
      updateShipping({ target: { name: 'country', value: 'AU' } });
    }
  }, [country, updateShipping]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name) {
      return toast.error('Enter your Name');
    }
    if (!phone_number || !validatePhone(phone_number, country)) {
      return toast.error('Enter a valid phone number');
    }
    if (!line1) {
      return toast.error('Enter your Address');
    }
    if (!postal_code) {
      return toast.error('Enter your Postal Code');
    }
    if (!validateZipCode(postal_code, country)) {
      return toast.error('Enter a valid postal code');
    }
    if (!city) {
      return toast.error('Enter your City');
    }
    if (!state) {
      return toast.error('Enter your State');
    }
    if (!country) {
      return toast.error('Enter your Country');
    }
    return confirmShipping();
  };

  if (cart.length < 1) {
    return (
      <div className='page'>
        <div className='empty'>
          <h2>Your cart is empty</h2>
          <Link to='/products' className='btn'>
            fill it
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='page-100'>
      <div>
        <div className='title'>
          <h2>Shipping</h2>
        </div>
        <form onSubmit={handleSubmit}>
          {/* name */}
          <div className='form-control'>
            <input
              type='text'
              name='name'
              className='input'
              placeholder='Full name'
              value={name}
              onChange={updateShipping}
            />
          </div>
          {/* end name */}
          {/* phone */}
          <div className='form-control'>
            <input
              type='number'
              name='phone_number'
              className='input'
              placeholder='Phone number'
              value={phone_number}
              onChange={updateShipping}
            />
          </div>
          {/* end phone */}
          {/* address line 1 */}
          <div className='form-control'>
            <input
              type='text'
              name='line1'
              className='input'
              placeholder='Address'
              value={line1}
              onChange={updateShipping}
            />
          </div>
          {/* end address line 1 */}
          {/* address postal code */}
          <div className='form-control'>
            <input
              type='number'
              name='postal_code'
              className='input'
              placeholder='Zip Code'
              value={postal_code}
              onChange={updateShipping}
            />
          </div>
          {/* end address postal code */}
          {/* Hidden country input */}
          <div className='hidden'>
            <input type='hidden' name='country' value='AU' />
          </div>
          {/* address state */}
          <div className='form-control'>
            <select
              name='state'
              className='input sort-input'
              value={state || ''}
              onChange={(e) => {
                updateShipping(e);
              }}
              required
            >
              <option value=''>Select State / Territory</option>
              {AU_STATES.map((item, index) => {
                return (
                  <option key={index} value={item.code}>
                    {item.name} ({item.code})
                  </option>
                );
              })}
            </select>
          </div>
          {/* end address state */}
          {/* address city */}
          <div className='form-control'>
            <input
              type='text'
              name='city'
              className='input'
              placeholder='City / Suburb'
              value={city || ''}
              onChange={updateShipping}
              required
            />
          </div>
          {/* end address city */}
          <button type='submit' className='btn shipping-btn'>
            confirm
          </button>
        </form>
      </div>
    </div>
  );
}

export default ShippingForm;
