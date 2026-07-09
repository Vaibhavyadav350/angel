import { create } from 'zustand';
import adminApi, { extractError } from '../services/adminApi';

let lastCollectionsFetch = 0;
const CACHE_TTL = 60000;

/**
 * Admin featured-collections management.
 */
const useAdminCollectionStore = create((set, get) => ({
  collections: [],
  loading: false,
  error: false,

  getCollections: async (force = false) => {
    const now = Date.now();
    if (!force && lastCollectionsFetch > 0 && now - lastCollectionsFetch < CACHE_TTL) {
      return;
    }
    set({ loading: true, error: false });
    try {
      const { data } = await adminApi.get('/featured-collections');
      lastCollectionsFetch = Date.now();
      set({ collections: data.data, loading: false });
      return { success: true, data: data.data };
    } catch (error) {
      set({ error: true, loading: false });
      return { success: false, message: extractError(error, 'Failed to fetch collections') };
    }
  },

  createCollection: async (data) => {
    set({ loading: true, error: false });
    try {
      const { data: resData } = await adminApi.post('/featured-collections', data);
      set({ collections: [...get().collections, resData.data], loading: false });
      return { success: true, data: resData.data };
    } catch (error) {
      set({ error: true, loading: false });
      return { success: false, message: extractError(error, 'Failed to create collection') };
    }
  },

  updateCollection: async (id, data) => {
    set({ loading: true, error: false });
    try {
      const { data: resData } = await adminApi.put(`/featured-collections/${id}`, data);
      set({
        collections: get().collections.map((c) => (c._id === id ? resData.data : c)),
        loading: false,
      });
      return { success: true, data: resData.data };
    } catch (error) {
      set({ error: true, loading: false });
      return { success: false, message: extractError(error, 'Failed to update collection') };
    }
  },

  deleteCollection: async (id) => {
    set({ loading: true, error: false });
    try {
      await adminApi.delete(`/featured-collections/${id}`);
      set({ collections: get().collections.filter((c) => c._id !== id), loading: false });
      return { success: true };
    } catch (error) {
      set({ error: true, loading: false });
      return { success: false, message: extractError(error, 'Failed to delete collection') };
    }
  },

  toggleVisibility: async (id) => {
    const col = get().collections.find((c) => c._id === id);
    if (col) {
      return get().updateCollection(id, { isVisible: !col.isVisible });
    }
    return { success: false, message: 'Collection not found' };
  },
}));

export default useAdminCollectionStore;
