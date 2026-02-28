import React from 'react';
import Product from '../Product/';

const GridView = ({ products }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-20">
      {products.map((product) => (
        <Product key={product.id} {...product} />
      ))}
    </div>
  );
};

export default GridView;
