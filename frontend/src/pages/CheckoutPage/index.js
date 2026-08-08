import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCartContext } from '../../context/cart_context';
import { useUserContext } from '../../context/user_context';
import { useOrderContext } from '../../context/order_context';
import { formatPrice } from '../../utils/helpers';
import { computeOrderSummary, shippingMethods } from '../../utils/pricing';
import { useSettingsContext } from '../../context/settings_context';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAdminCouponStore } from '../../stores';
import { domain } from '../../utils/constants';

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
  const { cart } = useCartContext();
  const { shipping, updateShipping } = useOrderContext();
  const { currentUser } = useUserContext();
  const { settings } = useSettingsContext();
  const location = useLocation();

  const [selectedState, setSelectedState] = useState(shipping.address?.state || '');
  const [deliveryMethod, setDeliveryMethod] = useState('standard');

  const { validateCoupon } = useAdminCouponStore();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState({ amount: 0, code: '', type: '' });
  const [applying, setApplying] = useState(false);

  // Single itemised breakdown for the whole page (and what we charge).
  const coupon = discount.amount > 0 ? { amount: discount.amount, type: discount.type } : null;
  const methods = shippingMethods(settings, cart);
  const summary = computeOrderSummary(cart, { method: deliveryMethod, coupon, config: settings });


  const [guestEmail, setGuestEmail] = useState('');
  const [guestEmailConfirm, setGuestEmailConfirm] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [summaryOpen, setSummaryOpen] = useState(false);

  useEffect(() => {
    document.title = 'Angel Fashion Studio | Secure Checkout';
    window.scrollTo(0, 0);

    const params = new URLSearchParams(location.search);
    if (params.get('canceled')) {
      toast.error('Payment cancelled.');
    }
  }, [location]);

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

    // Server rejects an over-weight cart anyway; stop here so the customer gets a
    // useful message instead of a payment-gateway error.
    if (summary.requiresQuote) {
      setProcessing(false);
      toast.error('This order needs a shipping quote — please contact us.', { position: 'top-center' });
      return;
    }

    const finalName = shipping.name || currentUser?.displayName;
    const finalEmail = currentUser?.email || guestEmail;
    const { phone_number, address: { line1, postal_code, city, state } } = shipping;

    if (!finalName || !phone_number || !line1 || !postal_code || !city || !state) {
      toast.error('Please fill all shipping fields completely', { position: 'top-center' });
      setProcessing(false);
      return;
    }
    if (!finalEmail) {
      toast.error('Please enter your email address for order confirmation', { position: 'top-center' });
      setProcessing(false);
      return;
    }
    if (!currentUser && guestEmail !== guestEmailConfirm) {
      toast.error('Email addresses do not match — please check and try again', { position: 'top-center' });
      setProcessing(false);
      return;
    }

    try {
      const response = await axios.post(`${domain}/api/payment/create-checkout-session`, {
        cart,
        shipping_fee: summary.delivery,
        total_amount: summary.sellingTotal,
        shippingMethod: deliveryMethod,
        shipping: {
          name: finalName || 'Guest',
          phone_number,
          address: { line1, postal_code, city, state, country: 'AU' }
        },
        discountAmount: summary.coupon,
        couponCode: discount.code,
        email: finalEmail,
        userId: currentUser?.uid,
      });

      if (response.data.success && response.data.url) {
        window.location.href = response.data.url;
      } else {
        setError(response.data.message || 'Failed to initiate payment.');
        setProcessing(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Server error initiating checkout.');
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
    );
  }

  const inputClasses = "w-full bg-transparent border-0 border-b border-chocolate/20 text-chocolate py-3 px-0 focus:ring-0 focus:border-gold transition-colors font-body text-sm placeholder:text-chocolate/30";
  const labelClasses = "text-[9px] font-bold uppercase tracking-widest text-gold block mb-2";

  return (
    <main className="pt-20 lg:pt-32 pb-32 bg-champagne font-body">
      <div className="container mx-auto max-w-7xl px-4 lg:px-24">

        {/* ── Mobile: sticky bottom pay bar ── */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 px-4 pb-6 pt-4 bg-champagne border-t border-bronze/10"
        >
          <button
            form="checkout-form"
            type="submit"
            disabled={processing || summary.requiresQuote}
            className="w-full flex items-center justify-center gap-3 py-4 bg-chocolate text-champagne font-bold text-[10px] uppercase tracking-[0.35em] rounded-2xl hover:bg-bronze transition-all shadow-xl disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[13px]">lock</span>
            <span>{processing ? 'Redirecting...' : `Pay ${formatPrice(summary.toPay)}`}</span>
          </button>
          {error && <p className="text-red-500 text-[9px] font-bold uppercase tracking-widest mt-2 text-center">{error}</p>}
        </div>

        {/* ── Mobile: collapsible order summary strip ── */}
        <div className="lg:hidden mb-6">
          <button
            type="button"
            onClick={() => setSummaryOpen((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white/50 backdrop-blur-md rounded-2xl border border-bronze/10 shadow-sm"
          >
            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-bronze/60">
              {cart.length} {cart.length === 1 ? 'item' : 'items'} · {formatPrice(summary.toPay)}
            </span>
            <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.2em] text-gold">
              {summaryOpen ? 'Hide' : 'Show'} order
              <span className="material-symbols-outlined text-[14px]" style={{ transform: summaryOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}>expand_more</span>
            </div>
          </button>

          {summaryOpen && (
            <div className="mt-2 bg-white/50 backdrop-blur-md rounded-2xl border border-bronze/10 p-4 space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3 items-center">
                  <div className="size-14 shrink-0 bg-white border border-bronze/10 overflow-hidden rounded-lg">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[10px] font-editorial font-bold text-bronze uppercase truncate">{item.name}</h4>
                    <p className="text-[8px] font-bold tracking-widest text-bronze/40 uppercase">Qty: {item.amount}</p>
                  </div>
                  <span className="text-[11px] font-editorial font-bold text-bronze shrink-0">{formatPrice(item.price * item.amount)}</span>
                </div>
              ))}
              <div className="pt-3 border-t border-bronze/10 space-y-1.5">
                <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-bronze/50">
                  <span>Subtotal</span><span>{formatPrice(summary.itemTotal)}</span>
                </div>
                <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-bronze/50">
                  <span>Delivery</span><span>{summary.delivery === 0 ? 'Free' : formatPrice(summary.delivery)}</span>
                </div>
                {summary.coupon > 0 && (
                  <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-emerald-600">
                    <span>Coupon ({discount.code})</span><span>−{formatPrice(summary.coupon)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-bronze/10">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold">Total</span>
                  <span className="text-lg font-editorial font-black text-bronze">{formatPrice(summary.toPay)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">

          {/* Left Column - Shipping Form */}
          <div className="flex-1 space-y-10 lg:space-y-16">
            <section>
              <h2 className="text-3xl lg:text-5xl font-editorial font-black text-bronze uppercase tracking-tighter mb-8 lg:mb-12">
                Delivery Details
              </h2>

              <form id="checkout-form" className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 lg:gap-y-8" onSubmit={handleSubmit}>

                {/* Email fields — shown first for guests so confirmation email is never missed */}
                {!currentUser && (
                  <>
                    <div className="col-span-2 pb-6 border-b border-bronze/10">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-gold mb-6">
                        Order Confirmation — your receipt and tracking will be sent here
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                        <div>
                          <label className={labelClasses}>Email Address</label>
                          <input
                            className={inputClasses}
                            placeholder="your@email.com"
                            type="email"
                            value={guestEmail}
                            onChange={(e) => setGuestEmail(e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label className={labelClasses}>Confirm Email</label>
                          <input
                            className={`${inputClasses} ${guestEmailConfirm && guestEmail !== guestEmailConfirm ? 'border-red-400' : ''}`}
                            placeholder="Retype your email"
                            type="email"
                            value={guestEmailConfirm}
                            onChange={(e) => setGuestEmailConfirm(e.target.value)}
                            required
                          />
                          {guestEmailConfirm && guestEmail !== guestEmailConfirm && (
                            <p className="text-red-400 text-[9px] font-bold uppercase tracking-widest mt-2">Emails do not match</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="col-span-2">
                  <label className={labelClasses}>Full Name</label>
                  <input
                    className={inputClasses}
                    placeholder="Recipient Name"
                    type="text"
                    name="name"
                    value={shipping.name || currentUser?.displayName || ''}
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

                <div className="col-span-2 pt-8 lg:pt-12 border-t border-bronze/10">
                  {summary.requiresQuote && (
                    <div className="mb-6 p-5 border border-gold/40 bg-gold/5 rounded">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-bronze mb-2">
                        This order is too large to post automatically
                      </p>
                      <p className="text-[11px] text-bronze/70 leading-relaxed">
                        Orders of this size ship in multiple parcels, so we quote the freight by hand
                        to make sure you are not overcharged. Please email{' '}
                        <a href="mailto:support@angelfashionstudio.org" className="text-gold font-bold">
                          support@angelfashionstudio.org
                        </a>{' '}
                        or call <span className="text-gold font-bold">+61 466 853 704</span> and we
                        will send you a shipping quote straight away.
                      </p>
                    </div>
                  )}
                  {/* Desktop submit — mobile uses fixed bottom bar */}
                  <button
                    type="submit"
                    disabled={processing || summary.requiresQuote}
                    className="hidden lg:flex w-full bg-chocolate text-champagne py-6 rounded-[2px] text-[11px] font-bold uppercase tracking-[0.4em] hover:bg-gold transition-all duration-500 shadow-xl disabled:opacity-50 items-center justify-center gap-4"
                  >
                    <span>
                      {summary.requiresQuote
                        ? 'Shipping Quote Required'
                        : processing
                          ? 'Redirecting to Payment...'
                          : 'Proceed to Secure Payment'}
                    </span>
                    {!processing && !summary.requiresQuote && <span className="material-symbols-outlined text-sm pt-0.5 border-[1px] rounded-full border-champagne p-1">lock</span>}
                  </button>
                  {error && (
                    <div className="hidden lg:block text-red-500 text-[10px] font-bold uppercase tracking-widest mt-4 text-center">
                      {error}
                    </div>
                  )}
                  <p className="text-center text-[9px] uppercase tracking-widest text-bronze/50 mt-4 font-bold flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[10px]">shield_check</span>
                    Card details collected securely by eWAY — never stored on our servers
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
                        const res = await validateCoupon(couponCode, summary.sellingTotal);
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

                {/* Delivery method */}
                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-bronze/40">Delivery Method</label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.values(methods).map((m) => (
                      <button
                        key={m.key}
                        type="button"
                        onClick={() => setDeliveryMethod(m.key)}
                        className={`text-left px-3 py-2 rounded border transition-all ${deliveryMethod === m.key ? 'border-gold bg-gold/5' : 'border-bronze/10 hover:border-bronze/30'}`}
                      >
                        <span className="block text-[10px] font-bold uppercase tracking-widest text-bronze">{m.label} · {formatPrice(m.fee)}</span>
                        <span className="block text-[8px] uppercase tracking-widest text-bronze/40 mt-0.5">{m.eta}</span>
                      </button>
                    ))}
                  </div>
                </div>


                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-bronze/60">
                  <span>Item Total</span>
                  <span>{formatPrice(summary.itemTotal)}</span>
                </div>
                {summary.productDiscount > 0 && (
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                    <span>Product Discount</span>
                    <span>−{formatPrice(summary.productDiscount)}</span>
                  </div>
                )}
                {summary.coupon > 0 && (
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                    <span>Coupon ({discount.code})</span>
                    <span>−{formatPrice(summary.coupon)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-bronze/60">
                  <span>Delivery ({methods[deliveryMethod]?.label || 'Standard'})</span>
                  <span>{summary.delivery === 0 ? 'Free' : formatPrice(summary.delivery)}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-bronze/10">
                  <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-gold">To Pay</span>
                  <span className="text-2xl font-editorial font-black text-bronze">
                    {formatPrice(summary.toPay)}
                  </span>
                </div>
                <p className="text-[9px] text-bronze/40 text-right">Includes GST of {formatPrice(summary.gst)}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
};

export default CheckoutPage;
