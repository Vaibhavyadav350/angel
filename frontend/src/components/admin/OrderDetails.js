import React from 'react';
import OrderItemsList from './OrderItemsList';
import { formatPrice } from '../../utils/helpers';

function OrderDetails({
  order_status,
  shippingPrice,
  totalPrice,
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
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/40 mb-2">Shipping</p>
          <p className="text-sm font-bold text-gold">{formatPrice(shippingPrice)}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/40 mb-2">Order Total</p>
          <p className="text-lg font-editorial font-black text-bronze">{formatPrice(totalPrice)}</p>
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
