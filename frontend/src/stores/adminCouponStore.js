import { create } from 'zustand';
import { toast } from 'react-toastify';
import adminApi, { extractError } from '../services/adminApi';

/**
 * Admin coupon / promotion management.
 *
 * Note: this store is also consumed by the customer checkout page for coupon
 * validation, so action signatures must remain stable.
 */
const useAdminCouponStore = create((set, get) => ({
  coupons: [],
  coupons_loading: false,

  fetchCoupons: async () => {
    set({ coupons_loading: true });
    try {
      const { data } = await adminApi.get('/coupon');
      set({ coupons: data.data, coupons_loading: false });
      return { success: true, data: data.data };
    } catch (error) {
      set({ coupons_loading: false });
      return { success: false, message: extractError(error, 'Failed to fetch coupons') };
    }
  },

  createCoupon: async (couponData) => {
    try {
      const { data } = await adminApi.post('/coupon', couponData);
      get().fetchCoupons();
      toast.success('Coupon created');
      return { success: true, data: data.data };
    } catch (error) {
      toast.error(extractError(error, 'Failed to create coupon'));
      return { success: false };
    }
  },

  deleteCoupon: async (id) => {
    try {
      await adminApi.delete(`/coupon/${id}`);
      get().fetchCoupons();
      toast.success('Coupon deleted');
      return { success: true };
    } catch (error) {
      toast.error(extractError(error, 'Failed to delete coupon'));
      return { success: false };
    }
  },

  validateCoupon: async (code, cartTotal) => {
    try {
      const { data } = await adminApi.post('/coupon/validate', { code, cartTotal });
      return { success: true, data: data.data };
    } catch (error) {
      return { success: false, message: extractError(error, 'Invalid coupon') };
    }
  },
}));

export default useAdminCouponStore;
