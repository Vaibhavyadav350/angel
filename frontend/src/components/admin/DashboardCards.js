import React from 'react';
import { useOrderContext } from '../../context/admin_order_context';
import { useProductContext } from '../../context/admin_product_context';
import { useNewsletterContext } from '../../context/newsletter_context';
import { useAdminUserContext } from '../../context/admin_user_context';
import { FaShoppingCart, FaDollarSign, FaBox, FaMailBulk, FaCrown, FaExclamationTriangle } from 'react-icons/fa';
import { MdSchedule, MdLocalShipping } from 'react-icons/md';
import { formatPrice } from '../../utils/helpers';

function DashboardCards() {
  const { orders, pending_orders, delivered_orders, total_revenue } =
    useOrderContext();
  const { products } = useProductContext();
  const { subscribers } = useNewsletterContext();
  const { customers } = useAdminUserContext();

  const lowStockCount = products ? products.filter(p => p.stock < 5).length : 0;
  const vipCount = customers ? customers.filter(c => c.isVIP).length : 0;

  const cardList = [
    {
      title: 'Total Orders',
      value: orders.length,
      icon: FaShoppingCart,
      accent: 'bg-bronze',
    },
    {
      title: 'Pending Orders',
      value: pending_orders.length,
      icon: MdSchedule,
      accent: 'bg-amber-600',
    },
    {
      title: 'Delivered',
      value: delivered_orders.length,
      icon: MdLocalShipping,
      accent: 'bg-emerald-700',
    },
    {
      title: 'Total Revenue',
      value: formatPrice(total_revenue),
      icon: FaDollarSign,
      accent: 'bg-gold',
    },
    {
      title: 'Products',
      value: products ? products.length : 0,
      icon: FaBox,
      accent: 'bg-bronze/70',
    },
    {
      title: 'Subscribers',
      value: subscribers ? subscribers.length : 0,
      icon: FaMailBulk,
      accent: 'bg-bronze/50',
    },
    {
      title: 'Low Stock',
      value: lowStockCount,
      icon: FaExclamationTriangle,
      accent: lowStockCount > 0 ? 'bg-red-600' : 'bg-bronze/30',
    },
    {
      title: 'VIP Elite',
      value: vipCount,
      icon: FaCrown,
      accent: 'bg-gold',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
      {cardList.map((card, index) => {
        const { title, value, icon: Icon, accent } = card;
        return (
          <div
            key={index}
            className="bg-white border border-bronze/10 rounded-lg p-6 flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-bronze/5 group cursor-default relative overflow-hidden"
          >
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 blur-xl ${accent} group-hover:scale-150 transition-transform duration-700`} />
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className={`w-8 h-8 rounded flex items-center justify-center ${accent} shadow-inner`}>
                <Icon className="text-white text-xs" />
              </div>
            </div>
            <div className="relative z-10">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-bronze/50 mb-1">
                {title}
              </p>
              <p className="text-3xl font-editorial font-black text-bronze leading-none tracking-tight">
                {value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default DashboardCards;
