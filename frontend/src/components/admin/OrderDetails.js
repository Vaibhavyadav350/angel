import React from 'react';
import OrderItemsList from './OrderItemsList';
import { formatPrice } from '../../utils/helpers';

function OrderDetails({
  order_status,
  shippingPrice = 0,
  totalPrice = 0,
  itemsPrice = 0,
  discountAmount = 0,
  couponCode = '',
  taxPrice = 0,
  addOns = [],
  paymentInfo = { id: '', status: '' },
  user = { name: '', email: '' },
  shippingInfo = {
    address: '',
    city: '',
    state: '',
    country: '',
    pinCode: '',
    phoneNumber: '',
  },
  orderItems = [],
  returnStatus = 'none',
  returnReason = '',
  returnRequestedAt,
}) {
  // Itemised breakdown, consistent with checkout and the invoice.
  const itemTotal = orderItems.reduce((sum, i) => sum + (i.mrp || i.price) * i.quantity, 0);
  const productDiscount = Math.max(0, itemTotal - itemsPrice);
  const gst = taxPrice || Math.round((totalPrice / 11) * 100) / 100;
  const statusClasses = {
    processing: 'bg-amber-100 text-amber-700',
    confirmed: 'bg-blue-100 text-blue-700',
    shipped: 'bg-indigo-100 text-indigo-700',
    delivered: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-red-100 text-red-700',
    returned: 'bg-gray-100 text-gray-700',
  };

  const returnStatusClasses = {
    none: 'hidden',
    requested: 'bg-orange-100 text-orange-700 border-orange-200',
    approved: 'bg-blue-100 text-blue-700 border-blue-200',
    rejected: 'bg-red-100 text-red-700 border-red-200',
    completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  };

  return (
    <div className="space-y-8 w-full">
      {/* Order Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/40 mb-2">Order Status</p>
          <span className={`inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded ${statusClasses[order_status] || 'bg-gray-100 text-gray-600'}`}>
            {order_status}
          </span>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/40 mb-2">Payment</p>
          <span className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-emerald-100 text-emerald-700 rounded">
            {paymentInfo.status}
          </span>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="bg-champagne/20 border border-bronze/10 rounded-xl p-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/40 mb-4">Cost Breakdown</p>
        <div className="space-y-2 max-w-sm">
          <div className="flex justify-between text-sm text-bronze/70">
            <span>Item Total</span><span>{formatPrice(itemTotal)}</span>
          </div>
          {productDiscount > 0 && (
            <div className="flex justify-between text-sm text-emerald-600">
              <span>Product Discount</span><span>−{formatPrice(productDiscount)}</span>
            </div>
          )}
          {discountAmount > 0 && (
            <div className="flex justify-between text-sm text-emerald-600">
              <span>Coupon{couponCode ? ` (${couponCode})` : ''}</span><span>−{formatPrice(discountAmount)}</span>
            </div>
          )}
          {addOns && addOns.length > 0 && addOns.map((a, idx) => (
            <div key={idx} className="flex justify-between text-sm text-bronze/70">
              <span>{a.name}</span><span>+{formatPrice(a.price)}</span>
            </div>
          ))}
          <div className="flex justify-between text-sm text-bronze/70">
            <span>Shipping</span><span>{formatPrice(shippingPrice)}</span>
          </div>
          <div className="flex justify-between text-base font-editorial font-black text-bronze pt-2 border-t border-bronze/10">
            <span>Order Total</span><span>{formatPrice(totalPrice)}</span>
          </div>
          <p className="text-[10px] text-bronze/40 text-right">Includes GST of {formatPrice(gst)}</p>
        </div>
      </div>

      {/* Return Information */}
      {returnStatus !== 'none' && (
        <div className="bg-champagne/20 border border-bronze/10 rounded-xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/40">Return Artifact Tracking</span>
            <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded border ${returnStatusClasses[returnStatus]}`}>
              Return {returnStatus}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-bronze/30 mb-1">Reason for Return</p>
              <p className="text-xs font-bold text-bronze">{returnReason || 'No reason provided'}</p>
            </div>
            {returnRequestedAt && (
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-bronze/30 mb-1">Requested On</p>
                <p className="text-xs font-bold text-bronze">{new Date(returnRequestedAt).toLocaleDateString()} at {new Date(returnRequestedAt).toLocaleTimeString()}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delivery Info */}
      <div className="border-t border-bronze/10 pt-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/40 mb-3">Delivery Address</p>
        <p className="text-sm text-bronze font-medium">{user.name}, {shippingInfo.phoneNumber}</p>
        <p className="text-sm text-bronze/60 mt-1">
          {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.state} - {shippingInfo.pinCode}, {shippingInfo.country}
        </p>
      </div>

      {/* Order Items */}
      <div className="border-t border-bronze/10 pt-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/40 mb-4">Order Items</p>
        <OrderItemsList orderItems={orderItems} />
      </div>
    </div>
  );
}

export default OrderDetails;
