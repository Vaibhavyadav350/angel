import React, { useEffect, useContext, useReducer } from 'react';
import reducer from '../reducers/order_reducer';
import {
  UPDATE_SHIPPING_DETAILS,
  GET_ORDERS_BEGIN,
  GET_ORDERS_SUCCESS,
  GET_ORDERS_ERROR,
  GET_SINGLE_ORDER_BEGIN,
  GET_SINGLE_ORDER_SUCCESS,
  GET_SINGLE_ORDER_ERROR,
} from '../actions';
import { useUserContext } from './user_context';
import { useCartContext } from './cart_context';
import { toast } from 'react-toastify';
import axios from 'axios';
import { get_order_url, create_order_url, domain } from '../utils/constants';

const initialState = {
  orders_loading: false,
  orders_error: false,
  orders: [],
  single_order_loading: false,
  single_order_error: false,
  single_order: {},
  shipping: {
    name: '',
    address: {
      line1: '',
      postal_code: '',
      city: '',
      state: '',
      country: 'IN',
    },
  },
};

const OrderContext = React.createContext();

export const OrderProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { currentUser } = useUserContext();
  const { cart, total_amount, shipping_fee } = useCartContext();
  const fetchOrders = React.useCallback(async (url = get_order_url) => {
    if (!currentUser?.email) return;
    dispatch({ type: GET_ORDERS_BEGIN });
    try {
      const response = await axios.post(url, {
        email: currentUser.email,
      });
      const orders = response.data;
      dispatch({ type: GET_ORDERS_SUCCESS, payload: orders.data });
    } catch (error) {
      dispatch({ type: GET_ORDERS_ERROR });
    }
  }, [currentUser]);

  const fetchSingleOrder = React.useCallback(async (id) => {
    dispatch({ type: GET_SINGLE_ORDER_BEGIN });
    try {
      const response = await axios.get(`${domain}/api/orders/${id}`);
      dispatch({ type: GET_SINGLE_ORDER_SUCCESS, payload: response.data.data });
    } catch (error) {
      dispatch({ type: GET_SINGLE_ORDER_ERROR });
    }
  }, []);

  const placeOrder = React.useCallback(async (paymentIntentId) => {
    const shippingInfo = {
      address: state.shipping.address.line1,
      city: state.shipping.address.city,
      state: state.shipping.address.state,
      country: state.shipping.address.country,
      pinCode: state.shipping.address.postal_code, // Keep as String
      phoneNumber: state.shipping.phone_number, // Keep as String
    };
    const orderItems = cart.map((item) => {
      return {
        name: item.name,
        price: item.price,
        quantity: item.amount,
        image: item.image,
        color: item.color,
        size: item.size,
        product: item.productId || item.id, // Use stored productId
      };
    });
    const paymentInfo = {
      id: paymentIntentId || 'dummy_id_12345', // Use actual payment intent ID
      status: 'paid',
    };
    const body = {
      name: state.shipping.name,
      email: currentUser.email,
      userId: currentUser.uid, // Add userId
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice: total_amount,
      taxPrice: 0, // Add explicit taxPrice
      shippingPrice: shipping_fee,
      totalPrice: total_amount + shipping_fee,
    };
    try {
      await axios.post(create_order_url, body);
      toast.success('Order placed');
    } catch (error) {
      toast.error(error.message);
    }
  }, [state.shipping, cart, currentUser, total_amount, shipping_fee]);

  const requestReturn = React.useCallback(async (orderId, reason) => {
    try {
      const response = await axios.put(`${domain}/api/orders/${orderId}/return`, { reason });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchOrders();
        return { success: true };
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to request return');
      return { success: false };
    }
  }, [fetchOrders]);

  const updateShipping = React.useCallback((e) => {
    const name = e.target.name;
    const value = e.target.value;
    dispatch({ type: UPDATE_SHIPPING_DETAILS, payload: { name, value } });
  }, []);

  useEffect(() => {
    fetchOrders(get_order_url);
    // eslint-disable-next-line
  }, [currentUser, fetchOrders]);

  return (
    <OrderContext.Provider value={{ ...state, updateShipping, placeOrder, fetchOrders, fetchSingleOrder, requestReturn }}>
      {children}
    </OrderContext.Provider>
  );
};
// make sure use
export const useOrderContext = () => {
  return useContext(OrderContext);
};
