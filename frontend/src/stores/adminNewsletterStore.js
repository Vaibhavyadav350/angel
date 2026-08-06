import { create } from 'zustand';
import adminApi, { extractError } from '../services/adminApi';

/**
 * Admin newsletter subscriber management.
 */
const useAdminNewsletterStore = create((set, get) => ({
  subscribers: [],
  subscribers_loading: false,
  subscribers_error: false,

  fetchSubscribers: async () => {
    set({ subscribers_loading: true, subscribers_error: false });
    try {
      const { data } = await adminApi.get('/newsletter');
      if (data.success) {
        set({ subscribers: data.data || [], subscribers_loading: false });
        return { success: true, data: data.data };
      }
      set({ subscribers_error: true, subscribers_loading: false });
      return { success: false, message: data.message };
    } catch (error) {
      set({ subscribers_error: true, subscribers_loading: false });
      return { success: false, message: extractError(error, 'Failed to fetch subscribers') };
    }
  },

  deleteSubscriber: async (id) => {
    try {
      const { data } = await adminApi.delete(`/newsletter/${id}`);
      if (data.success) {
        get().fetchSubscribers();
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message };
    } catch (error) {
      return { success: false, message: extractError(error, 'Failed to delete subscriber') };
    }
  },
}));

export default useAdminNewsletterStore;
