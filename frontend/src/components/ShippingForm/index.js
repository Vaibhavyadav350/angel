import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useOrderContext } from '../../context/order_context';
import { useCartContext } from '../../context/cart_context';
import { Country, State, City } from 'country-state-city';

// Get all countries for dynamic selection
const countries = Country.getAllCountries();

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

  // State for dynamic country/state/city selection
  const [selectedCountry, setSelectedCountry] = useState(country || '');
  const [selectedState, setSelectedState] = useState(state || '');

  // Update local state when shipping state changes
  useEffect(() => {
    if (country && country !== selectedCountry) {
      setSelectedCountry(country);
    }
    if (state && state !== selectedState) {
      setSelectedState(state);
    }
  }, [country, state, selectedCountry, selectedState]);

  const states = selectedCountry ? State.getStatesOfCountry(selectedCountry) : [];
  const cities = selectedCountry && selectedState
    ? City.getCitiesOfState(selectedCountry, selectedState)
    : [];

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
          {/* address country */}
          <div className='form-control'>
            <select
              name='country'
              className='input sort-input'
              value={selectedCountry}
              onChange={(e) => {
                const newCountry = e.target.value;
                setSelectedCountry(newCountry);
                setSelectedState(''); // Reset state when country changes
                updateShipping(e);
                // Clear state and city when country changes
                updateShipping({ target: { name: 'state', value: '' } });
                updateShipping({ target: { name: 'city', value: '' } });
              }}
            >
              <option value=''>Select Country</option>
              {countries.map((item, index) => {
                return (
                  <option key={index} value={item.isoCode}>
                    {item.name}
                  </option>
                );
              })}
            </select>
          </div>
          {/* end address country */}
          {/* address state */}
          <div className='form-control'>
            <select
              name='state'
              className='input sort-input'
              value={selectedState}
              onChange={(e) => {
                const newState = e.target.value;
                setSelectedState(newState);
                updateShipping(e);
                // Clear city when state changes
                updateShipping({ target: { name: 'city', value: '' } });
              }}
              disabled={!selectedCountry}
            >
              <option value=''>Select State</option>
              {states.map((item, index) => {
                return (
                  <option key={index} value={item.isoCode}>
                    {item.name}
                  </option>
                );
              })}
            </select>
          </div>
          {/* end address state */}
          {/* address city */}
          <div className='form-control'>
            <select
              name='city'
              className='input sort-input'
              value={city}
              onChange={updateShipping}
              disabled={!selectedState}
            >
              <option value=''>Select City</option>
              {cities.map((item, index) => {
                return (
                  <option key={index} value={item.name}>
                    {item.name}
                  </option>
                );
              })}
            </select>
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
