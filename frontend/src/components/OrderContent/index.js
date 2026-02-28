import React from 'react';
import OrderItem from '../OrderItems/';
import {
  getOrderStatusColor,
  formatAddress,
  formatPrice,
} from '../../utils/helpers';

const OrderContent = ({
  paymentInfo,
  orderItems,
  totalPrice,
  orderStatus,
  user: { name },
  shippingInfo,
  shippingPrice,
}) => {
  const statusColor = getOrderStatusColor(orderStatus);
  return (
    <div className='section section-center'>
      <div className='order-info'>
        <h5 className='order-status'>
          Status: <span style={{ color: statusColor }}>{orderStatus}</span>
        </h5>
        <h5 className='payment-status'>
          Payment: <span>{paymentInfo.status}</span>
        </h5>
        <h5 className='shipping-fee'>
          Shipping: <span>{formatPrice(shippingPrice)}</span>
        </h5>
        <h5 className='order-total'>
          Order Total: <span>{formatPrice(totalPrice)}</span>
        </h5>
      </div>
      <div className='delivery-info'>
        <h5>Delivery: </h5>
        <p>
          {name}, {shippingInfo?.phoneNumber || 'N/A'}
        </p>
        <p>{formatAddress({ shippingInfo })}</p>
      </div>
      {orderItems && orderItems.length > 0 ? (
        orderItems.map((item) => {
          return <OrderItem key={item._id + item.color} {...item} />;
        })
      ) : (
        <p>No items in this order</p>
      )}
    </div>
  );
};

export default OrderContent;
