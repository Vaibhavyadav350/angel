import { create } from 'zustand';
import adminApi, { extractError } from '../services/adminApi';

/**
 * Admin authentication state.
 *
 * Split out from the old admin_context.js so auth concerns are separate from
 * admin-user management.
 */
const useAdminAuthStore = create((set, get) => ({
  currentAdmin: null,
  adminAuthLoading: true,

  checkAdminAuth: async () => {
    set({ adminAuthLoading: true });
    try {
      const { data } = await adminApi.post('/admin/auth');
      set({ currentAdmin: data.data, adminAuthLoading: false });
      return { success: true, data: data.data };
    } catch (error) {
      set({ currentAdmin: null, adminAuthLoading: false });
      return { success: false, message: extractError(error, 'Auth check failed') };
    }
  },

  loginAdmin: async (email, password) => {
    try {
      const { data } = await adminApi.post('/admin/login', { email, password });
      if (data.success) {
        set({ currentAdmin: data.data });
        return { success: true, data: data.data };
      }
      return { success: false, message: data.message || 'Login failed' };
    } catch (error) {
      return { success: false, message: extractError(error, 'Login failed') };
    }
  },

  logoutAdmin: async () => {
    try {
      const { data } = await adminApi.get('/admin/logout');
      set({ currentAdmin: null });
      return { success: true, message: data.message };
    } catch (error) {
      set({ currentAdmin: null });
      return { success: false, message: extractError(error, 'Logout failed') };
    }
  },

  setCurrentAdmin: (admin) => set({ currentAdmin: admin }),
}));

export default useAdminAuthStore;
