import { create } from 'zustand';
import adminApi, { extractError } from '../services/adminApi';
import { ensureHttps } from '../utils/helpers';

const initialNewProduct = {
  name: '',
  price: 500,
  stock: 10,
  description: '',
  images: [],
  colors: [],
  sizes: [],
  variants: [],
  category: '',
  subCategory: '',
  productType: '',
  collections: [],
  company: '',
  shipping: true,
  featured: false,
  discountPercent: 0,
  badgeText: '',
  leadTimeDays: '',
  composition: '',
  careInstructions: '',
};

let lastProductsFetch = 0;
const CACHE_TTL = 60000;

const normalizeProductImages = (product) => {
  if (!product) return product;
  return {
    ...product,
    image: ensureHttps(product.image),
    images: Array.isArray(product.images)
      ? product.images.map((img) =>
          typeof img === 'string'
            ? ensureHttps(img)
            : { ...img, url: ensureHttps(img.url), src: ensureHttps(img.src) }
        )
      : product.images,
  };
};

const normalizeProducts = (products) =>
  Array.isArray(products) ? products.map(normalizeProductImages) : products;

/**
 * Admin product catalog state.
 */
const useAdminProductStore = create((set, get) => ({
  products: [],
  productsLoading: false,
  productsError: false,
  new_product: { ...initialNewProduct },
  single_product: {},
  single_product_loading: false,
  single_product_error: false,

  fetchProducts: async (force = false) => {
    const now = Date.now();
    if (!force && lastProductsFetch > 0 && now - lastProductsFetch < CACHE_TTL) {
      return;
    }
    set({ productsLoading: true, productsError: false });
    try {
      const { data } = await adminApi.get('/products');
      lastProductsFetch = Date.now();
      set({ products: normalizeProducts(data.data), productsLoading: false });
      return { success: true, data: data.data };
    } catch (error) {
      set({ productsError: true, productsLoading: false });
      return { success: false, message: extractError(error, 'Failed to fetch products') };
    }
  },

  fetchSingleProduct: async (id) => {
    set({ single_product_loading: true, single_product_error: false });
    try {
      const { data } = await adminApi.get(`/products/${id}`);
      set({ single_product: normalizeProductImages(data.data), single_product_loading: false });
      return { success: true, data: data.data };
    } catch (error) {
      console.error('[Admin] fetchSingleProduct failed:', error?.response?.status, error?.response?.data || error?.message);
      set({ single_product_error: true, single_product_loading: false });
      return { success: false, message: extractError(error, 'Failed to fetch product') };
    }
  },

  deleteProduct: async (id) => {
    try {
      const { data } = await adminApi.delete(`/admin/product/${id}`);
      set({ products: get().products.filter((p) => (p.id || p._id) !== id) });
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: extractError(error, 'Failed to delete product') };
    }
  },

  setNewProductField: (name, value) => {
    set({ new_product: { ...get().new_product, [name]: value } });
  },

  setExistingProductField: (name, value) => {
    set({ single_product: { ...get().single_product, [name]: value } });
  },

  resetNewProduct: () => set({ new_product: { ...initialNewProduct } }),

  createNewProduct: async (product) => {
    try {
      const { data } = await adminApi.post('/admin/product/new', product);
      get().fetchProducts(true);
      return { success: true, data: data.data };
    } catch (error) {
      return { success: false, message: extractError(error, 'Failed to create product') };
    }
  },

  updateProduct: async (id, product) => {
    try {
      const { data } = await adminApi.put(`/admin/product/${id}`, product);
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: extractError(error, 'Failed to update product') };
    }
  },

  deleteReview: async (productId, reviewId) => {
    try {
      const { data } = await adminApi.delete(`/admin/product/review/${productId}`, {
        params: { reviewId },
      });
      get().fetchSingleProduct(productId);
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: extractError(error, 'Failed to delete review') };
    }
  },

  exportProductsToExcel: async () => {
    try {
      const response = await adminApi.get('/admin/product/export/excel', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'inventory_archive.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      return { success: true };
    } catch (error) {
      return { success: false, message: extractError(error, 'Export failed') };
    }
  },
}));

export default useAdminProductStore;
