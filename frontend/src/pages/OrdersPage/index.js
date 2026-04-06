import { getOrderStatusColor, formatPrice } from '../../utils/helpers';
import { ReturnModal, Loading, Error } from '../../components';
import React, { useEffect, useState } from 'react';
import { useOrderContext } from '../../context/order_context';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { useCartContext } from '../../context/cart_context';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const OrdersPage = () => {
  const {
    orders,
    orders_loading: loading,
    orders_error: error,
  } = useOrderContext();

  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isSuccessOrder, setIsSuccessOrder] = useState(false);

  const openReturnModal = (id) => {
    setSelectedOrderId(id);
    setIsReturnModalOpen(true);
  };

  const location = useLocation();
  const history = useHistory();
  const { clearCart } = useCartContext();

  useEffect(() => {
    document.title = 'Angel Fashion Studio | Orders';

    // Check if coming back from a successful Stripe checkout
    const params = new URLSearchParams(location.search);
    if (params.get('success') === 'true') {
      setIsSuccessOrder(true);
      clearCart();
      // Remove query param to prevent multiple toasts on refresh using React Router v5's history
      history.replace(location.pathname);

      // Auto-hide the canvas after setting a lasting impression
      setTimeout(() => {
        setIsSuccessOrder(false);
      }, 7000);
    }
  }, [location, clearCart, history]);

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
      <AnimatePresence>
        {isSuccessOrder && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-chocolate flex flex-col items-center justify-center p-8 overflow-hidden"
          >
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold/20 via-chocolate to-chocolate pointer-events-none"></div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="relative z-10 text-center space-y-8 max-w-2xl"
            >
              <span className="material-symbols-outlined text-gold text-7xl mb-4 block animate-bounce" style={{ animationDuration: '4s' }}>workspace_premium</span>
              <h2 className="text-5xl lg:text-7xl font-editorial font-black text-champagne uppercase leading-[0.9] tracking-tighter">
                The Archive<br />Awaits
              </h2>
              <div className="h-px w-24 bg-gold/30 mx-auto"></div>
              <p className="text-xl font-editorial text-champagne/80 italic leading-snug">
                Your exceptional order has been secured. Our master artisans are now preparing your pieces for their journey.
              </p>

              <button
                onClick={() => setIsSuccessOrder(false)}
                className="mt-12 px-12 py-5 border border-gold text-gold text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-gold hover:text-chocolate transition-all duration-700"
              >
                Enter Your Vault
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
  const { _id, createdAt, totalPrice, orderStatus, orderItems, returnStatus } = order;
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
            {orderStatus === 'delivered' && (!returnStatus || returnStatus === 'none') && (
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
