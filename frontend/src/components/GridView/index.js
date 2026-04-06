import React from 'react';
import Product from '../Product/';
import { motion, AnimatePresence } from 'framer-motion';

const GridView = ({ products }) => {
  return (
    <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-20">
      <AnimatePresence>
        {products.map((product) => (
          <Product key={product.id} {...product} />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default GridView;
