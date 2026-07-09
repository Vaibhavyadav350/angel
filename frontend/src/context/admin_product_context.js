import React, { useContext, useReducer } from 'react';
import axios from 'axios';
import reducer from '../reducers/admin/product_reducer';
import {
  admin_products_url,
  admin_create_product_url,
  admin_delete_review_url,
  products_url,
  single_product_url,
  admin_products_export_url,
} from '../utils/constants';
import {
  CREATE_NEW_PRODUCT,
  RESET_NEW_PRODUCT,
  GET_PRODUCTS_BEGIN,
  GET_PRODUCTS_ERROR,
  GET_PRODUCTS_SUCCESS,
  UPDATE_EXISTING_PRODUCT,
  GET_SINGLE_PRODUCT_BEGIN,
  GET_SINGLE_PRODUCT_ERROR,
  GET_SINGLE_PRODUCT_SUCCESS,
} from '../actions_admin';

// Single definition of a blank product, reused for the initial state and for
// resetting the create form after a successful save.
const initialNewProduct = {
  name: '',
  price: 500,
  stock: 10,
  description: '',
  images: [],
  colors: [],
  sizes: [],
  variants: [], // Required for E-commerce variant matrix
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

const initialState = {
  products_loading: false,
  products_error: false,
  products: [],
  new_product: initialNewProduct,
  single_product_loading: false,
  single_product_error: false,
  single_product: {},
};

const ProductContext = React.createContext();

let lastProductsFetch = 0;
const CACHE_TTL = 60000; // 60 seconds

export const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchProducts = React.useCallback(async (force = false) => {
    const now = Date.now();
    if (!force && lastProductsFetch > 0 && (now - lastProductsFetch < CACHE_TTL)) {
      return;
    }
    dispatch({ type: GET_PRODUCTS_BEGIN });
    try {
      const response = await axios.get(products_url); // Customer endpoint for reading
      const { data } = response.data;
      lastProductsFetch = Date.now();
      dispatch({ type: GET_PRODUCTS_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: GET_PRODUCTS_ERROR });
    }
  }, []);

  const fetchSingleProduct = React.useCallback(async (id) => {
    dispatch({ type: GET_SINGLE_PRODUCT_BEGIN });
    try {
      const response = await axios.get(`${single_product_url}${id}`);
      const { data } = response.data;
      dispatch({ type: GET_SINGLE_PRODUCT_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: GET_SINGLE_PRODUCT_ERROR });
    }
  }, []);

  const deleteProduct = React.useCallback(async (id) => {
    try {
      const response = await axios.delete(`${admin_products_url}${id}`);
      const { success, message } = response.data;
      return { success, message };
    } catch (error) {
      const { data } = error.response || {};
      const message = typeof data === 'string' ? data : (data?.message || 'Failed to delete product');
      return { success: false, message };
    }
  }, []);

  // Direct field setters. Components pass already-typed values (numbers, arrays,
  // booleans) so there is no fragile string-parsing here — that lived in the old
  // event handlers and silently broke multi-word colors and the collections enum.
  const setNewProductField = React.useCallback((name, value) => {
    dispatch({ type: CREATE_NEW_PRODUCT, payload: { name, value } });
  }, []);

  const setExistingProductField = React.useCallback((name, value) => {
    dispatch({ type: UPDATE_EXISTING_PRODUCT, payload: { name, value } });
  }, []);

  const resetNewProduct = React.useCallback(() => {
    dispatch({ type: RESET_NEW_PRODUCT, payload: initialNewProduct });
  }, []);

  const createNewProduct = React.useCallback(async (product) => {
    try {
      const response = await axios.post(admin_create_product_url, product);
      const { success, data } = response.data;
      // Force a refetch so the newly created product appears immediately,
      // bypassing the 60s list cache.
      fetchProducts(true);
      return { success, data };
    } catch (error) {
      const { data } = error.response || {};
      const message = typeof data === 'string' ? data : (data?.message || 'Failed to create product');
      return { success: false, message };
    }
  }, [fetchProducts]);

  const updateProduct = React.useCallback(async (id, product) => {
    try {
      const response = await axios.put(`${admin_products_url}${id}`, product);
      const { success, message } = response.data;
      return { success, message };
    } catch (error) {
      const { data } = error.response || {};
      const message = typeof data === 'string' ? data : (data?.message || 'Failed to update product');
      return { success: false, message };
    }
  }, []);

  const deleteReview = React.useCallback(async (productId, reviewId) => {
    try {
      const response = await axios.delete(`${admin_delete_review_url}${productId}`, {
        params: {
          reviewId,
        },
      });
      const { success, message } = response.data;
      fetchSingleProduct(productId);
      return { success, message };
    } catch (error) {
      const { data } = error.response || {};
      const message = typeof data === 'string' ? data : (data?.message || 'Failed to delete review');
      return { success: false, message };
    }
  }, [fetchSingleProduct]);

  const exportProductsToExcel = React.useCallback(async () => {
    try {
      const response = await axios.get(admin_products_export_url, {
        responseType: 'blob',
        withCredentials: true
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
      return { success: false, message: 'Export failed' };
    }
  }, []);

  // Removed global auto-fetch. Admin pages call fetchProducts() explicitly.
  // This prevents unauthenticated API calls on every page load including customer routes.

  return (
    <ProductContext.Provider
      value={{
        ...state,
        deleteProduct,
        setNewProductField,
        setExistingProductField,
        resetNewProduct,
        createNewProduct,
        fetchProducts,
        fetchSingleProduct,
        updateProduct,
        deleteReview,
        exportProductsToExcel,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  return useContext(ProductContext);
};
