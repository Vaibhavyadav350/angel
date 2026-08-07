import React from 'react';
import Product from '../Product/';
import { useFilterContext } from '../../context/filter_context';

const GridView = ({ products }) => {
  // Which collection is being browsed, so each card badges itself with the
  // label that is relevant right now.
  const { filters } = useFilterContext();

  return (
    // No `layout` prop. Layout animation on the container *and* on every card,
    // wrapped in a sync AnimatePresence, meant exiting cards were still measured
    // while new ones entered — the projection could settle on a stale height and
    // leave a tall gap above the grid. It was timing-dependent, which is why it
    // only happened sometimes. A plain fade is cheaper and cannot mis-measure.
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-10 sm:gap-y-14 lg:gap-y-16">
      {products.map((product) => (
        <Product key={product.id} {...product} activeCollection={filters.collection} />
      ))}
    </div>
  );
};

export default GridView;
