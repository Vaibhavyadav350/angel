import React, { useState, useEffect } from 'react';
import { formatPrice } from '../../utils/helpers';
import { Stars } from '.';
import { useAdminUserStore, useAdminProductStore, useAdminOrderStore } from '../../stores';

function SingleProductInfo({ product }) {
  const { admins } = useAdminUserStore();
  const { orders } = useAdminOrderStore();
  const { single_product_loading: loading } = useAdminProductStore();
  const [createdBy, setCreatedBy] = useState('');
  const [unitSold, setUnitSold] = useState(0);
  const {
    _id: id = '',
    name = '',
    description = '',
    price = 0,
    rating = 0,
    colors = [],
    sizes = [],
    company = '',
    category = '',
    stock = 0,
    numberOfReviews = 0,
    shipping = true,
    featured = false,
    admin = '',
    createdAt,
  } = product;

  useEffect(() => {
    const createdBy = admins?.find((x) => x.id === admin || x._id === admin);
    if (createdBy) {
      setCreatedBy(createdBy.name);
    } else {
      setCreatedBy('No Details');
    }

    const productOrders = (orders || []).reduce((arr, order) => {
      const item = order.orderItems?.find((x) => x.product === id || x.product?._id === id);
      if (item) { arr.push(item); }
      return arr;
    }, []);

    const total = productOrders.reduce((total, order) => {
      const { quantity } = order;
      total += quantity;
      return total;
    }, 0);

    setUnitSold(total);
    // eslint-disable-next-line
  }, [loading]);

  const rows = [
    { label: 'Name', value: name },
    { label: 'Price', value: formatPrice(price) },
    { label: 'Description', value: description },
    { label: 'Stock', value: stock },
    { label: 'Units Sold', value: unitSold },
    { label: 'Reviews', value: `${numberOfReviews} customer reviews` },
    { label: 'Company', value: company },
    { label: 'Category', value: category },
    { label: 'Shipping', value: shipping ? formatPrice(55000) : formatPrice(0) },
    { label: 'Featured', value: featured ? 'Yes' : 'No' },
    { label: 'Created By', value: createdBy },
    { label: 'Created At', value: createdAt ? `${new Date(createdAt).toDateString()}, ${new Date(createdAt).toLocaleTimeString('en-IN')}` : '' },
  ];

  return (
    <div className="w-full">
      <table className="w-full">
        <thead>
          <tr className="border-b border-bronze/10">
            <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/40">Property</th>
            <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/40">Value</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-b border-bronze/5">
              <td className="px-4 py-3 text-xs font-bold text-bronze/60 uppercase tracking-widest whitespace-nowrap">{row.label}</td>
              <td className="px-4 py-3 text-sm text-bronze">{row.value}</td>
            </tr>
          ))}
          {/* Rating Row */}
          <tr className="border-b border-bronze/5">
            <td className="px-4 py-3 text-xs font-bold text-bronze/60 uppercase tracking-widest">Rating</td>
            <td className="px-4 py-3"><Stars stars={rating} /></td>
          </tr>
          {/* Colors Row */}
          <tr className="border-b border-bronze/5">
            <td className="px-4 py-3 text-xs font-bold text-bronze/60 uppercase tracking-widest">Colors</td>
            <td className="px-4 py-3">
              <div className="flex gap-2">
                {colors.map((color, index) => (
                  <div key={index} className="w-6 h-6 rounded-full border border-bronze/20" style={{ backgroundColor: color }} />
                ))}
              </div>
            </td>
          </tr>
          {/* Sizes Row */}
          <tr className="border-b border-bronze/5">
            <td className="px-4 py-3 text-xs font-bold text-bronze/60 uppercase tracking-widest">Sizes</td>
            <td className="px-4 py-3">
              <div className="flex gap-2">
                {sizes.map((size, index) => (
                  <span key={index} className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest border border-bronze/20 text-bronze/60 rounded">
                    {size}
                  </span>
                ))}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default SingleProductInfo;
