import { create } from 'zustand';
import adminApi, { extractError } from '../services/adminApi';

let lastOrdersFetch = 0;
const CACHE_TTL = 60000;

/**
 * Admin order management state.
 */
const useAdminOrderStore = create((set, get) => ({
  orders: [],
  orders_loading: false,
  orders_error: false,
  single_order: {},
  single_order_loading: false,
  single_order_error: false,
  single_order_status: '',
  recent_orders: [],
  pending_orders: [],
  delivered_orders: [],
  total_revenue: 0,

  _setDerivedOrderStats: (orders) => {
    const recent_orders = [...orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 11);
    const pending_orders = orders.filter((o) => o.orderStatus === 'processing');
    const delivered_orders = orders.filter((o) => o.orderStatus === 'delivered');
    const total_revenue = orders.reduce((total, o) => total + (o.totalPrice || 0), 0);
    return { recent_orders, pending_orders, delivered_orders, total_revenue };
  },

  fetchOrders: async (params = {}, force = false) => {
    const isDefault = Object.keys(params).length === 0;
    const now = Date.now();
    if (isDefault && !force && lastOrdersFetch > 0 && now - lastOrdersFetch < CACHE_TTL) {
      return;
    }
    set({ orders_loading: true, orders_error: false });
    try {
      const { data } = await adminApi.get('/admin/orders', { params });
      const orders = data.data || [];
      if (isDefault) lastOrdersFetch = Date.now();
      set({
        orders,
        orders_loading: false,
        ...get()._setDerivedOrderStats(orders),
      });
      return { success: true, data: orders };
    } catch (error) {
      set({ orders_error: true, orders_loading: false });
      return { success: false, message: extractError(error, 'Failed to fetch orders') };
    }
  },

  fetchFilteredOrders: async (params = {}) => {
    try {
      const { data } = await adminApi.get('/admin/orders', { params });
      return { success: true, data: data.data || [] };
    } catch (error) {
      return { success: false, data: [], message: extractError(error, 'Failed to fetch orders') };
    }
  },

  fetchSingleOrder: async (id) => {
    set({ single_order_loading: true, single_order_error: false });
    try {
      const { data } = await adminApi.get(`/admin/order/${id}`);
      set({
        single_order: data.data,
        single_order_status: data.data.orderStatus,
        single_order_loading: false,
      });
      return { success: true, data: data.data };
    } catch (error) {
      set({ single_order_error: true, single_order_loading: false });
      return { success: false, message: extractError(error, 'Failed to fetch order') };
    }
  },

  updateOrderStatus: async (status, id, trackingNumber = '', carrier = 'Australia Post') => {
    try {
      const { data } = await adminApi.put(`/admin/order/${id}`, {
        status,
        trackingNumber,
        carrier,
      });
      set({ single_order_status: data.data.orderStatus });
      return { success: true, status: data.data.orderStatus };
    } catch (error) {
      return { success: false, message: extractError(error, 'Failed to update order status') };
    }
  },

  deleteOrder: async (id) => {
    try {
      const { data } = await adminApi.delete(`/admin/order/${id}`);
      set({ orders: get().orders.filter((o) => (o.id || o._id) !== id) });
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: extractError(error, 'Failed to delete order') };
    }
  },

  exportOrdersToExcel: async () => {
    try {
      const response = await adminApi.get('/admin/orders/export/excel', {
        responseType: 'blob',
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
      return { success: false, message: extractError(error, 'Export failed') };
    }
  },

  updateReturnStatus: async (status, id) => {
    try {
      const { data } = await adminApi.put(`/admin/order/${id}/return`, { status });
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: extractError(error, 'Failed to update return status') };
    }
  },

  fetchPackingSlip: async (id) => {
    try {
      const response = await adminApi.get(`/admin/order/${id}/packingslip`, {
        responseType: 'blob',
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
      return { success: false, message: extractError(error, 'Failed to generate packing slip') };
    }
  },
}));

export default useAdminOrderStore;
