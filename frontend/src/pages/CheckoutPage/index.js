import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCartContext } from '../../context/cart_context';
import { useUserContext } from '../../context/user_context';
import { useOrderContext } from '../../context/order_context';
import { formatPrice } from '../../utils/helpers';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCouponContext } from '../../context/admin_coupon_context';
import { domain } from '../../utils/constants';

// Strict minimal Australian state mapping
const AU_STATES = [
  { code: 'NSW', name: 'New South Wales' },
  { code: 'VIC', name: 'Victoria' },
  { code: 'QLD', name: 'Queensland' },
  { code: 'WA', name: 'Western Australia' },
  { code: 'SA', name: 'South Australia' },
  { code: 'TAS', name: 'Tasmania' },
  { code: 'ACT', name: 'Australian Capital Territory' },
  { code: 'NT', name: 'Northern Territory' }
];

const CheckoutPage = () => {
  const { cart, total_amount, shipping_fee } = useCartContext();
  const { shipping, updateShipping } = useOrderContext();
  const { currentUser } = useUserContext();
  const location = useLocation();

  // Country State City
  const [selectedState, setSelectedState] = useState(shipping.address?.state || '');

  // Coupons
  const { validateCoupon } = useCouponContext();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState({ amount: 0, code: '', type: '' });
  const [applying, setApplying] = useState(false);

  // States
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = 'Angel Fashion Studio | Secure Checkout';
    window.scrollTo(0, 0);

    // Ensure strictly AU context in context state if not present
    if (!shipping.address?.country || shipping.address.country !== 'AU') {
      updateShipping({ target: { name: 'country', value: 'AU' } });
    }

    // Handle return from eWAY (Cancel only, success goes to /orders)
    const params = new URLSearchParams(location.search);
    if (params.get('canceled')) {
      toast.error('Payment cancelled.');
    }
  }, [location, shipping.address, updateShipping]);

  useEffect(() => {
    if (shipping.address?.state && shipping.address.state !== selectedState) {
      setSelectedState(shipping.address.state);
    }
  }, [shipping.address, selectedState]);

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    updateShipping(e);
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setProcessing(true);
    setError(null);

    const { name, phone_number, address: { line1, postal_code, city, state } } = shipping;
    if (!name || !phone_number || !line1 || !postal_code || !city || !state) {
      toast.error('Please fill all shipping fields completely', { position: 'top-center' });
      setProcessing(false);
      return;
    }

    try {
      const rawDiscount = discount.type === 'PERCENTAGE' ? (total_amount * discount.amount / 100) : discount.amount;
      const finalDiscount = Number(rawDiscount.toFixed(2));

      const response = await axios.post(`${domain}/api/payment/create-checkout-session`, {
        cart,
        shipping_fee,
        total_amount,
        shipping: {
          name,
          address: { line1, postal_code, city, state, country: 'AU' }
        },
        discountAmount: finalDiscount,
        couponCode: discount.code,
        email: currentUser?.email,
        userId: currentUser?.uid
      });

      if (response.data.success && response.data.url) {
        window.location.href = response.data.url; // Redirect to eWAY Shared Payment Page
      } else {
        setError('Failed to initiate secure checkout session.');
        setProcessing(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error initiating checkout.');
      setProcessing(false);
    }
  };

  if (!cart.length) {
    return (
      <main className="pt-32 pb-24 px-6 lg:px-24 min-h-screen bg-champagne font-body flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-editorial font-bold text-bronze uppercase">Your Cart is Empty</h2>
          <Link to="/products" className="inline-block text-[11px] bg-chocolate text-champagne px-8 py-4 font-bold uppercase tracking-widest hover:bg-gold transition-colors shadow-xl">
            Return to Collection
          </Link>
        </div>
      </main>
    )
  }

  const inputClasses = "w-full bg-transparent border-0 border-b border-chocolate/20 text-chocolate py-3 px-0 focus:ring-0 focus:border-gold transition-colors font-body text-sm placeholder:text-chocolate/30";
  const labelClasses = "text-[9px] font-bold uppercase tracking-widest text-gold block mb-2";

  return (
    <main className="pt-32 pb-24 px-6 lg:px-24 min-h-screen bg-champagne font-body">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-20">

          {/* Left Column - Forms */}
          <div className="flex-1 space-y-16">
            <section>
              <h2 className="text-4xl lg:text-5xl font-editorial font-black text-bronze uppercase tracking-tighter mb-12">
                Fulfillment Details
              </h2>

              <form className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8" onSubmit={handleSubmit}>
                <div className="col-span-2">
                  <label className={labelClasses}>Full Name</label>
                  <input
                    className={inputClasses}
                    placeholder="Recipient Name"
                    type="text"
                    name="name"
                    value={shipping.name || ''}
                    onChange={updateShipping}
                    required
                  />
                </div>

                <div>
                  <label className={labelClasses}>Phone Number</label>
                  <input
                    className={inputClasses}
                    placeholder="+61..."
                    type="tel"
                    name="phone_number"
                    value={shipping.phone_number || ''}
                    onChange={updateShipping}
                    required
                  />
                </div>

                <div className="hidden">
                  <input type="hidden" name="country" value="AU" />
                </div>

                <div>
                  <label className={labelClasses}>State / Territory</label>
                  <select className={inputClasses} name="state" value={selectedState} onChange={handleStateChange} required>
                    <option value="">Select State</option>
                    {AU_STATES.map((s) => <option key={s.code} value={s.code}>{s.name} ({s.code})</option>)}
                  </select>
                </div>

                <div>
                  <label className={labelClasses}>City / Suburb</label>
                  <input
                    className={inputClasses}
                    type="text"
                    placeholder="e.g. Sydney, Melbourne"
                    name="city"
                    value={shipping.address?.city || ''}
                    onChange={updateShipping}
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className={labelClasses}>Street Address</label>
                  <input
                    className={inputClasses}
                    placeholder="Flat / Building / Street"
                    type="text"
                    name="line1"
                    value={shipping.address?.line1 || ''}
                    onChange={updateShipping}
                    required
                  />
                </div>

                <div>
                  <label className={labelClasses}>Postal Code</label>
                  <input
                    className={inputClasses}
                    placeholder="ZIP / PIN"
                    type="text"
                    name="postal_code"
                    value={shipping.address?.postal_code || ''}
                    onChange={updateShipping}
                    required
                  />
                </div>

                <div className="col-span-2 pt-8">
                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-chocolate text-champagne py-6 rounded-[2px] text-[11px] font-bold uppercase tracking-[0.4em] hover:bg-gold transition-all duration-500 shadow-xl disabled:opacity-50 group flex items-center justify-center gap-4"
                  >
                    <span>{processing ? 'Connecting securely to eWAY...' : 'Proceed to Secure Payment'}</span>
                    {!processing && <span className="material-symbols-outlined text-sm pt-0.5 group-hover:translate-x-1 border-[1px] rounded-full border-champagne p-1 transition-all">lock</span>}
                  </button>
                  {error && (
                    <div className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-4 text-center">
                      {error}
                    </div>
                  )}
                  <p className="text-center text-[9px] uppercase tracking-widest text-bronze/50 mt-4 font-bold flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[10px]">shield_check</span>
                    100% Secure Checkout powered by eWAY
                  </p>
                </div>
              </form>
            </section>
          </div>

          {/* Right Column - Order Summary */}
          <div className="w-full lg:w-[400px]">
            <div className="sticky top-32 bg-white/40 backdrop-blur-md border border-bronze/10 rounded-[2px] p-8 space-y-8">
              <h3 className="text-xl font-editorial font-bold text-bronze uppercase border-b border-bronze/10 pb-4">
                In Your Box
              </h3>
              <div className="space-y-6 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="size-20 shrink-0 bg-white border border-bronze/10">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-editorial font-bold text-bronze uppercase">{item.name}</h4>
                      <p className="text-[9px] font-bold tracking-widest text-bronze/50 uppercase mt-1">Qty: {item.amount} | Size: {item.size}</p>
                      <p className="text-sm font-editorial text-bronze mt-2">{formatPrice(item.price * item.amount)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-bronze/10 space-y-4">
                {/* Coupon Input */}
                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-bronze/40">Promo Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="flex-1 bg-white border border-bronze/10 px-3 py-2 text-xs font-bold text-bronze uppercase outline-none focus:border-gold transition-all"
                      placeholder="SUMMER20"
                      disabled={discount.amount > 0 || processing}
                    />
                    <button
                      type="button"
                      onClick={async () => {
                        if (!couponCode) return;
                        setApplying(true);
                        const res = await validateCoupon(couponCode, total_amount);
                        if (res.success) {
                          setDiscount({ amount: res.data.amount, code: res.data.code, type: res.data.discountType });
                          toast.success('Coupon Applied!');
                        } else {
                          toast.error(res.message);
                        }
                        setApplying(false);
                      }}
                      disabled={applying || discount.amount > 0 || processing}
                      className="bg-bronze text-white px-4 py-2 text-[9px] font-bold uppercase tracking-widest hover:bg-gold transition-all disabled:opacity-50"
                    >
                      {applying ? '...' : (discount.amount > 0 ? 'Applied' : 'Apply')}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-bronze/60">
                  <span>Subtotal</span>
                  <span>{formatPrice(total_amount)}</span>
                </div>
                {discount.amount > 0 && (
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-red-500">
                    <span>Discount ({discount.code})</span>
                    <span>-{discount.type === 'PERCENTAGE' ? `${discount.amount}%` : formatPrice(discount.amount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-bronze/60">
                  <span>Shipping</span>
                  <span>{shipping_fee === 0 ? 'Free' : formatPrice(shipping_fee)}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-bronze/10">
                  <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-gold">Total</span>
                  <span className="text-2xl font-editorial font-black text-bronze">
                    {formatPrice(
                      (discount.type === 'PERCENTAGE'
                        ? (total_amount * (1 - discount.amount / 100))
                        : (total_amount - discount.amount))
                      + shipping_fee
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
};

export default CheckoutPage;
