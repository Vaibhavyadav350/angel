import { create } from 'zustand';
import adminApi, { extractError } from '../services/adminApi';

let lastCategoriesFetch = 0;
const CACHE_TTL = 60000;

/**
 * Admin category / sub-category management.
 */
const useAdminCategoryStore = create((set, get) => ({
  categories: [],
  loading: false,
  error: false,

  getCategories: async (force = false) => {
    const now = Date.now();
    if (!force && lastCategoriesFetch > 0 && now - lastCategoriesFetch < CACHE_TTL) {
      return;
    }
    set({ loading: true, error: false });
    try {
      const { data } = await adminApi.get('/categories');
      lastCategoriesFetch = Date.now();
      set({ categories: data.data, loading: false });
      return { success: true, data: data.data };
    } catch (error) {
      set({ error: true, loading: false });
      return { success: false, message: extractError(error, 'Failed to fetch categories') };
    }
  },

  createCategory: async (data) => {
    set({ loading: true, error: false });
    try {
      const payload = { ...data, slug: data.name.toLowerCase().replace(/\s+/g, '-') };
      const { data: resData } = await adminApi.post('/categories', payload);
      set({ categories: [...get().categories, resData.data], loading: false });
      return { success: true, data: resData.data };
    } catch (error) {
      set({ error: true, loading: false });
      return { success: false, message: extractError(error, 'Failed to create category') };
    }
  },

  updateCategory: async (id, data) => {
    set({ loading: true, error: false });
    try {
      const { data: resData } = await adminApi.put(`/categories/${id}`, data);
      set({
        categories: get().categories.map((c) => (c._id === id ? resData.data : c)),
        loading: false,
      });
      return { success: true, data: resData.data };
    } catch (error) {
      set({ error: true, loading: false });
      return { success: false, message: extractError(error, 'Failed to update category') };
    }
  },

  deleteCategory: async (id) => {
    set({ loading: true, error: false });
    try {
      await adminApi.delete(`/categories/${id}`);
      set({ categories: get().categories.filter((c) => c._id !== id), loading: false });
      return { success: true };
    } catch (error) {
      set({ error: true, loading: false });
      return { success: false, message: extractError(error, 'Failed to delete category') };
    }
  },

  addSubcategory: async (categoryId, name) => {
    const category = get().categories.find((c) => c._id === categoryId);
    if (!category) return { success: false, message: 'Category not found' };
    const subcategory = { name, slug: name.toLowerCase().replace(/\s+/g, '-') };
    const updatedSubcategories = [...(category.subcategories || []), subcategory];
    return get().updateCategory(categoryId, { subcategories: updatedSubcategories });
  },

  deleteSubcategory: async (categoryId, subcategoryId) => {
    const category = get().categories.find((c) => c._id === categoryId);
    if (!category) return { success: false, message: 'Category not found' };
    const updatedSubcategories = (category.subcategories || []).filter((s) => s._id !== subcategoryId);
    return get().updateCategory(categoryId, { subcategories: updatedSubcategories });
  },
}));

export default useAdminCategoryStore;
