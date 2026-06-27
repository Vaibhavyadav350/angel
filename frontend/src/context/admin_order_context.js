import React, { useContext, useReducer, useCallback } from 'react';
import axios from 'axios';
import reducer from '../reducers/admin/order_reducer';

import {
  admin_orders_url,
  admin_order_url,
  admin_single_order_url,
  admin_orders_export_url,
} from '../utils/constants';
import {
  GET_ORDERS_BEGIN,
  GET_ORDERS_ERROR,
  GET_ORDERS_SUCCESS,
  GET_SINGLE_ORDER_BEGIN,
  GET_SINGLE_ORDER_ERROR,
  GET_SINGLE_ORDER_SUCCESS,
  UPDATE_ORDER_STATUS,
} from '../actions_admin';

// Configure axios to send cookies for admin requests
axios.defaults.withCredentials = true;

const initialState = {
  orders_loading: false,
  orders_error: false,
  orders: [],
  single_order_loading: false,
  single_order_error: false,
  single_order: {},
  single_order_status: '',
  recent_orders: [],
  pending_orders: [],
  delivered_orders: [],
  total_revenue: 0,
};

const OrderContext = React.createContext();

let lastOrdersFetch = 0;
const CACHE_TTL = 60000; // 60 seconds

export const OrderProvider = ({ children }) => {
  // currentUser not needed directly here
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchOrders = useCallback(async (params = {}, force = false) => {
    const isDefault = Object.keys(params).length === 0;
    const now = Date.now();
    if (isDefault && !force && lastOrdersFetch > 0 && (now - lastOrdersFetch < CACHE_TTL)) {
      return;
    }
    dispatch({ type: GET_ORDERS_BEGIN });
    try {
      const response = await axios.get(admin_orders_url, {
        params,
        withCredentials: true,
      });
      if (response.data.success) {
        const { data } = response.data;
        if (isDefault) lastOrdersFetch = Date.now();
        dispatch({ type: GET_ORDERS_SUCCESS, payload: data || [] });
      } else {
        dispatch({ type: GET_ORDERS_ERROR });
      }
    } catch (error) {
      dispatch({ type: GET_ORDERS_ERROR });
    }
  }, []);

  const fetchFilteredOrders = async (params = {}) => {
    try {
      const response = await axios.get(admin_orders_url, {
        params,
        withCredentials: true,
      });
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, data: [] };
    } catch (error) {
      return { success: false, data: [] };
    }
  };

  const fetchSingleOrder = async (id) => {
    dispatch({ type: GET_SINGLE_ORDER_BEGIN });
    try {
      const response = await axios.get(`${admin_single_order_url}${id}`, {
        withCredentials: true,
      });
      if (response.data && response.data.success) {
        const { data } = response.data;
        dispatch({ type: GET_SINGLE_ORDER_SUCCESS, payload: data });
      } else {
        dispatch({ type: GET_SINGLE_ORDER_ERROR });
      }
    } catch (error) {
      dispatch({ type: GET_SINGLE_ORDER_ERROR });
    }
  };

  const updateOrderStatus = async (status, id, trackingNumber = '', carrier = 'Australia Post') => {
    try {
      const response = await axios.put(`${admin_order_url}${id}`, {
        status,
        trackingNumber,
        carrier,
      }, {
        withCredentials: true,
      });
      const { success, data } = response.data;
      dispatch({ type: UPDATE_ORDER_STATUS, payload: data.orderStatus });
      return { success, status: data.orderStatus };
    } catch (error) {
      const { message } = error.response?.data || {};
      return { success: false, message: message || 'Failed to update order status' };
    }
  };

  const deleteOrder = async (id) => {
    try {
      const response = await axios.delete(`${admin_order_url}${id}`, {
        withCredentials: true,
      });
      const { success, message } = response.data;
      return { success, message };
    } catch (error) {
      const { message } = error.response?.data || {};
      return { success: false, message: message || 'Failed to delete order' };
    }
  };

  const exportOrdersToExcel = async () => {
    try {
      const response = await axios.get(admin_orders_export_url, {
        responseType: 'blob',
        withCredentials: true
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'orders_archive.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Export failed' };
    }
  };

  const updateReturnStatus = async (status, id) => {
    try {
      const { data } = await axios.put(`${admin_order_url}${id}/return`, { status }, { withCredentials: true });
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to update return status' };
    }
  };

  const fetchPackingSlip = async (id) => {
    try {
      const response = await axios.get(`${admin_order_url}${id}/packingslip`, {
        responseType: 'blob',
        withCredentials: true,
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `packingslip_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Failed to generate packing slip' };
    }
  };

  // Removed filter-unaware fetchOrders default hook. Pages explicitly fetch parameters now.

  return (
    <OrderContext.Provider
      value={{
        ...state,
        fetchOrders,
        fetchFilteredOrders,
        fetchSingleOrder,
        updateOrderStatus,
        deleteOrder,
        exportOrdersToExcel,
        updateReturnStatus,
        fetchPackingSlip,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrderContext = () => {
  return useContext(OrderContext);
};
