import { getOrderStatusColor, formatPrice } from '../../utils/helpers';
import { ReturnModal, Loading, Error } from '../../components';
import React, { useEffect, useState } from 'react';
import { useOrderContext } from '../../context/order_context';
import { Link, useLocation } from 'react-router-dom';
import { useCartContext } from '../../context/cart_context';
import { toast } from 'react-toastify';

const OrdersPage = () => {
  const {
    orders,
    orders_loading: loading,
    orders_error: error,
  } = useOrderContext();

  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const openReturnModal = (id) => {
    setSelectedOrderId(id);
    setIsReturnModalOpen(true);
  };

  const location = useLocation();
  const { clearCart } = useCartContext();

  useEffect(() => {
    document.title = 'Angel Fashion Studio | Orders';

    // Check if coming back from a successful Stripe checkout
    const params = new URLSearchParams(location.search);
    if (params.get('success') === 'true') {
      toast.success('Payment successful! Your exquisite archive order has been placed. It may take a few moments to appear.', { position: 'top-center', autoClose: 5000 });
      clearCart();
      // Remove query param to prevent multiple toasts on refresh
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location, clearCart]);

  if (loading) return <Loading />;
  if (error) return <Error />;

  if (orders.length < 1) {
    return (
      <main className="bg-champagne font-body min-h-screen flex items-center justify-center">
        <div className="text-center space-y-8 py-32 px-8">
          <span className="text-gold text-[10px] font-bold uppercase tracking-[0.6em] block">
            Archive Orders
          </span>
          <h2 className="text-5xl lg:text-7xl font-editorial font-black text-bronze tracking-tighter uppercase leading-none">
            No orders<br />yet
          </h2>
          <div className="h-px w-12 bg-gold mx-auto" />
          <Link
            to="/products"
            className="inline-flex items-center gap-4 px-10 py-5 bg-bronze text-champagne font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-chocolate transition-all duration-500"
          >
            Start Shopping
            <span className="material-symbols-outlined text-sm">east</span>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-champagne font-body min-h-screen">
      <section className="pt-40 pb-12 px-8 lg:px-24">
        <div className="container mx-auto max-w-7xl">
          <span className="text-gold text-[10px] font-bold uppercase tracking-[0.6em] block mb-6">
            Member Archive
          </span>
          <h1 className="text-5xl lg:text-8xl font-editorial font-black text-bronze uppercase tracking-tighter leading-none mb-12">
            Your<br />Orders
          </h1>
          <div className="h-px w-full bg-bronze/10 mb-20" />
        </div>
      </section>

      <section className="pb-32 px-8 lg:px-24">
        <div className="container mx-auto max-w-7xl">
          <div className="space-y-8">
            {orders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                openReturnModal={openReturnModal}
              />
            ))}
          </div>

          <div className="mt-32 text-center">
            <Link
              to="/products"
              className="inline-flex items-center gap-6 px-12 py-6 border border-bronze/10 text-bronze font-bold uppercase tracking-[0.3em] text-[10px] hover:border-gold hover:text-gold hover:bg-white transition-all duration-700 shadow-xl shadow-bronze/5"
            >
              Explore Full Archive
              <span className="material-symbols-outlined text-sm">east</span>
            </Link>
          </div>
        </div>
      </section>
      {isReturnModalOpen && (
        <ReturnModal
          orderId={selectedOrderId}
          onClose={() => setIsReturnModalOpen(false)}
        />
      )}
    </main>
  );
};

const OrderCard = ({ order, openReturnModal }) => {
  const { _id, createdAt, totalPrice, orderStatus, orderItems } = order;
  const statusColor = getOrderStatusColor(orderStatus);

  return (
    <div className="bg-white border border-bronze/5 rounded-[40px] overflow-hidden shadow-2xl shadow-bronze/5 group hover:border-gold/20 transition-all duration-700">
      <div className="p-8 lg:p-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-bronze/30 block">Order Reference</span>
            <h3 className="text-lg font-bold text-bronze tracking-wide">#{_id.slice(-8).toUpperCase()}</h3>
            <p className="text-[9px] font-bold uppercase tracking-widest text-bronze/40 italic">
              Placed on {new Date(createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

          <div className="flex items-center gap-12">
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-widest text-bronze/30 block mb-1">Total Value</span>
              <span className="text-2xl font-editorial font-bold text-bronze">{formatPrice(totalPrice)}</span>
            </div>
            <div className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${statusColor === 'orange' ? 'border-orange-200 bg-orange-50 text-orange-600' : statusColor === 'blue' ? 'border-blue-200 bg-blue-50 text-blue-600' : statusColor === 'green' ? 'border-green-200 bg-green-50 text-green-600' : 'border-red-200 bg-red-50 text-red-600'}`}>
              {orderStatus}
            </div>
          </div>
        </div>

        {/* Content Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {orderItems.slice(0, 3).map((item, idx) => (
              <div key={idx} className="relative group/img flex-shrink-0">
                <div className="size-20 lg:size-24 rounded-2xl overflow-hidden border border-bronze/10">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                {idx === 2 && orderItems.length > 3 && (
                  <div className="absolute inset-0 bg-bronze/60 backdrop-blur-[2px] rounded-2xl flex items-center justify-center text-champagne text-xs font-bold">
                    +{orderItems.length - 3}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-4">
            <Link
              to={`/orders/${_id}`}
              className="px-8 py-4 border border-bronze/10 text-bronze text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-champagne transition-all"
            >
              Order Details
            </Link>
            {orderStatus === 'delivered' && (
              <button
                onClick={() => openReturnModal(_id)}
                className="px-8 py-4 bg-bronze text-champagne text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-gold transition-all shadow-xl shadow-bronze/10"
              >
                Return Request
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
