import React from 'react';
import { formatPrice } from '../../utils/helpers';
import { colorSwatch } from '../../utils/categoryData';

const OrderItem = ({ name, price, quantity, image, color, size, product }) => {
  return (
    <div>
      <div className='title'>
        <img src={image} alt={name} />
        <div>
          <h5 className='name'>{name}</h5>
          <p className='color'>
            color : <span style={{ background: colorSwatch(color) }}></span>
          </p>
          <p className='size'>
            size :&nbsp;<span>{size}</span>
          </p>
          <h5 className='price-small'>{formatPrice(price)}</h5>
        </div>
      </div>
      <h5 className='price'>{formatPrice(price)}</h5>
      <h5 className='quantity'>{quantity}</h5>
      <h5 className='subtotal'>{formatPrice(price * quantity)}</h5>
    </div>
  );
};

export default OrderItem;
