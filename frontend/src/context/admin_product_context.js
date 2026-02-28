import React, { useContext, useEffect, useReducer } from 'react';
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
  GET_PRODUCTS_BEGIN,
  GET_PRODUCTS_ERROR,
  GET_PRODUCTS_SUCCESS,
  UPDATE_EXISTING_PRODUCT,
  GET_SINGLE_PRODUCT_BEGIN,
  GET_SINGLE_PRODUCT_ERROR,
  GET_SINGLE_PRODUCT_SUCCESS,
} from '../actions_admin';

const initialState = {
  products_loading: false,
  products_error: false,
  products: [],
  new_product: {
    name: '',
    price: 500,
    stock: 10,
    description: '',
    images: [],
    colors: [],
    sizes: [],
    category: '',
    subCategory: '',
    productType: '',
    collections: [],
    company: '',
    shipping: true,
    featured: false,
    discountPercent: 20,
    taxPercent: 10,
  },
  single_product_loading: false,
  single_product_error: false,
  single_product: {},
};

const ProductContext = React.createContext();

export const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchProducts = React.useCallback(async () => {
    dispatch({ type: GET_PRODUCTS_BEGIN });
    try {
      const response = await axios.get(products_url); // Customer endpoint for reading
      const { data } = response.data;
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
      const { message } = error.response?.data || {};
      return { success: false, message: message || 'Failed to delete product' };
    }
  }, []);

  const updateNewProductDetails = React.useCallback((e) => {
    const name = e.target.name;
    let value = e.target.value;
    if (name === 'price' || name === 'stock' || name === 'discountPercent' || name === 'taxPercent') {
      value = Number(value);
    }
    if (name === 'colors' || name === 'sizes') {
      value = value.replace(/\s+/g, '');
      if (value === '') {
        value = [];
      } else if (value.indexOf(',') > -1) {
        value = value.split(',');
      } else {
        value = value.split();
      }
    }
    if (name === 'shipping' || name === 'featured') {
      value = e.target.checked;
    }
    dispatch({ type: CREATE_NEW_PRODUCT, payload: { name, value } });
  }, []);

  const updateExistingProductDetails = React.useCallback((e) => {
    const name = e.target.name;
    let value = e.target.value;
    if (name === 'price' || name === 'stock' || name === 'discountPercent' || name === 'taxPercent') {
      value = Number(value);
    }
    if (name === 'colors' || name === 'sizes') {
      value = value.replace(/\s+/g, '');
      if (value === '') {
        value = [];
      } else if (value.indexOf(',') > -1) {
        value = value.split(',');
      } else {
        value = value.split();
      }
    }
    if (name === 'shipping' || name === 'featured') {
      value = e.target.checked;
    }
    dispatch({ type: UPDATE_EXISTING_PRODUCT, payload: { name, value } });
  }, []);

  const createNewProduct = React.useCallback(async (product) => {
    try {
      const response = await axios.post(admin_create_product_url, product);
      const { success, data } = response.data;
      fetchProducts();
      return { success, data };
    } catch (error) {
      const { message } = error.response?.data || {};
      return { success: false, message: message || 'Failed to create product' };
    }
  }, [fetchProducts]);

  const updateProduct = React.useCallback(async (id, product) => {
    try {
      const response = await axios.put(`${admin_products_url}${id}`, product);
      const { success, message } = response.data;
      return { success, message };
    } catch (error) {
      const { message } = error.response?.data || {};
      return { success: false, message: message || 'Failed to update product' };
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
      const { message } = error.response?.data || {};
      return { success: false, message: message || 'Failed to delete review' };
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

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <ProductContext.Provider
      value={{
        ...state,
        deleteProduct,
        updateNewProductDetails,
        updateExistingProductDetails,
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
