import { create } from 'zustand';
import adminApi, { extractError } from '../services/adminApi';

let lastBannersFetch = 0;
const CACHE_TTL = 60000;

/**
 * Admin banner management.
 */
const useAdminBannerStore = create((set, get) => ({
  banners: [],
  loading: false,
  error: false,

  getBanners: async (force = false) => {
    const now = Date.now();
    if (!force && lastBannersFetch > 0 && now - lastBannersFetch < CACHE_TTL) {
      return;
    }
    set({ loading: true, error: false });
    try {
      const { data } = await adminApi.get('/banners');
      lastBannersFetch = Date.now();
      set({ banners: data.data, loading: false });
      return { success: true, data: data.data };
    } catch (error) {
      set({ error: true, loading: false });
      return { success: false, message: extractError(error, 'Failed to fetch banners') };
    }
  },

  createBanner: async (data) => {
    set({ loading: true, error: false });
    try {
      const { data: resData } = await adminApi.post('/banners', data);
      set({ banners: [...get().banners, resData.data], loading: false });
      return { success: true, data: resData.data };
    } catch (error) {
      set({ error: true, loading: false });
      return { success: false, message: extractError(error, 'Failed to create banner') };
    }
  },

  updateBanner: async (id, data) => {
    set({ loading: true, error: false });
    try {
      const { data: resData } = await adminApi.put(`/banners/${id}`, data);
      set({
        banners: get().banners.map((b) => (b._id === id ? resData.data : b)),
        loading: false,
      });
      return { success: true, data: resData.data };
    } catch (error) {
      set({ error: true, loading: false });
      return { success: false, message: extractError(error, 'Failed to update banner') };
    }
  },

  deleteBanner: async (id) => {
    set({ loading: true, error: false });
    try {
      await adminApi.delete(`/banners/${id}`);
      set({ banners: get().banners.filter((b) => b._id !== id), loading: false });
      return { success: true };
    } catch (error) {
      set({ error: true, loading: false });
      return { success: false, message: extractError(error, 'Failed to delete banner') };
    }
  },

  toggleBannerStatus: async (id) => {
    const banner = get().banners.find((b) => b._id === id);
    if (banner) {
      return get().updateBanner(id, { isActive: !banner.isActive });
    }
    return { success: false, message: 'Banner not found' };
  },
}));

export default useAdminBannerStore;
