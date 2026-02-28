import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import reducer from '../reducers/products_reducer';
import { products_url as url, domain } from '../utils/constants';
import {
  SIDEBAR_OPEN,
  SIDEBAR_CLOSE,
  GET_PRODUCTS_BEGIN,
  GET_PRODUCTS_SUCCESS,
  GET_PRODUCTS_ERROR,
  GET_SINGLE_PRODUCT_BEGIN,
  GET_SINGLE_PRODUCT_SUCCESS,
  GET_SINGLE_PRODUCT_ERROR,
  GET_SINGLE_PRODUCT_REVIEWS_BEGIN,
  GET_SINGLE_PRODUCT_REVIEWS_ERROR,
  GET_SINGLE_PRODUCT_REVIEWS_SUCCESS,
} from '../actions';
import { useUserContext } from './user_context';

const initialState = {
  isSidebarOpen: false,
  products_loading: false,
  products_error: false,
  products: [],
  featured_products: [],
  single_product_loading: false,
  single_product_error: false,
  single_product: {},
  single_product_reviews_loading: false,
  single_product_reviews_error: false,
};

const ProductsContext = React.createContext();

export const ProductsProvider = ({ children }) => {
  const { currentUser } = useUserContext();
  const [state, dispatch] = useReducer(reducer, initialState);

  const openSidebar = () => {
    dispatch({ type: SIDEBAR_OPEN });
  };

  const closeSidebar = () => {
    dispatch({ type: SIDEBAR_CLOSE });
  };

  const fetchProducts = async (url) => {
    dispatch({ type: GET_PRODUCTS_BEGIN });
    try {
      const response = await axios.get(url);
      const products = response.data;
      dispatch({ type: GET_PRODUCTS_SUCCESS, payload: products.data });
    } catch (error) {
      dispatch({ type: GET_PRODUCTS_ERROR });
    }
  };

  const fetchSingleProduct = async (url) => {
    dispatch({ type: GET_SINGLE_PRODUCT_BEGIN });
    try {
      const response = await axios.get(url);
      const singleProduct = response.data;
      if (singleProduct.success && singleProduct.data) {
        dispatch({
          type: GET_SINGLE_PRODUCT_SUCCESS,
          payload: singleProduct.data,
        });
      } else {
        dispatch({ type: GET_SINGLE_PRODUCT_ERROR });
      }
    } catch (error) {
      dispatch({ type: GET_SINGLE_PRODUCT_ERROR });
    }
  };

  const getProductReviews = async (id) => {
    dispatch({ type: GET_SINGLE_PRODUCT_REVIEWS_BEGIN });
    try {
      const response = await axios.get(`${url}/reviews/${id}`);
      const reviews = response.data;
      dispatch({
        type: GET_SINGLE_PRODUCT_REVIEWS_SUCCESS,
        payload: reviews.data,
      });
    } catch (error) {
      dispatch({ type: GET_SINGLE_PRODUCT_REVIEWS_ERROR });
    }
  };

  const reviewProduct = async (id, stars, comment) => {
    if (currentUser) {
      const body = {
        name: currentUser.displayName || 'User',
        email: currentUser.email,
        rating: stars,
        comment: comment,
        productId: id,
      };
      try {
        const response = await axios.post(`${url}/reviews`, body); // Remove trailing slash
        getProductReviews(id);
        const { success, message } = response.data;
        return { success, message };
      } catch (error) {
        const { success, message } = error.response?.data || {};
        return { success, message };
      }
    }
  };

  useEffect(() => {
    fetchProducts(url);
  }, []);

  return (
    <ProductsContext.Provider
      value={{
        ...state,
        openSidebar,
        closeSidebar,
        fetchSingleProduct,
        reviewProduct,
        getProductReviews,
        subscribeToRestock: async (productId, email) => {
          try {
            const response = await axios.post(`${domain}/api/restock/subscribe`, { productId, email });
            return response.data;
          } catch (error) {
            return error.response?.data || { success: false, message: 'Subscription failed' };
          }
        },
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};
// make sure use
export const useProductsContext = () => {
  return useContext(ProductsContext);
};
