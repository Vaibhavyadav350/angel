import React from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';

const AmountButtons = ({ increase, decrease, amount, max }) => {
  return (
    <div className='amount-btn'>
      <button type='button' className='amount-btn' onClick={decrease} disabled={amount <= 1}>
        <FaMinus />
      </button>
      <h2 className='amount'>{amount}</h2>
      <button type='button' className='amount-btn' onClick={increase} disabled={amount >= max}>
        <FaPlus />
      </button>
    </div>
  );
};

export default AmountButtons;
