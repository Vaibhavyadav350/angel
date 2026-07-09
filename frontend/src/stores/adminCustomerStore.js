import { create } from 'zustand';
import adminApi, { extractError } from '../services/adminApi';

/**
 * Admin customer list (user profiles).
 *
 * This replaces the old admin_user_context.js which was actually fetching
 * customer profiles, not admin users.
 */
const useAdminCustomerStore = create((set) => ({
  customers: [],
  loading: false,
  error: null,

  fetchCustomers: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await adminApi.get('/users/admin/all');
      if (data.success) {
        set({ customers: data.data, loading: false });
        return { success: true, data: data.data };
      }
      set({ error: data.message, loading: false });
      return { success: false, message: data.message };
    } catch (error) {
      const message = extractError(error, 'Failed to fetch customers');
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },
}));

export default useAdminCustomerStore;
