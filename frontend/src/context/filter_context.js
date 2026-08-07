import React, { useEffect, useContext, useReducer } from 'react';
import reducer from '../reducers/filter_reducer';
import {
  LOAD_PRODUCTS,
  SET_GRIDVIEW,
  SET_LISTVIEW,
  UPDATE_SORT,
  SORT_PRODUCTS,
  UPDATE_FILTERS,
  FILTER_PRODUCTS,
  CLEAR_FILTERS,
  SET_INITIAL_FILTERS,
} from '../actions';
import { useProductsContext } from './products_context';

const initialState = {
  filtered_products: [],
  all_products: [],
  grid_view: true,
  sort: 'price-lowest',
  filters: {
    text: '',
    company: 'all',
    collection: 'all',
    category: 'all',
    subCategory: 'all',
    productType: 'all',
    fabric: 'all',
    color: 'all',
    min_price: 0,
    max_price: 0,
    price: 0,
    shipping: false,
  },
};

const FilterContext = React.createContext();

export const FilterProvider = ({ children }) => {
  const { products } = useProductsContext();
  const [state, dispatch] = useReducer(reducer, initialState);

  const setGridView = () => {
    dispatch({ type: SET_GRIDVIEW });
  };

  const setListView = () => {
    dispatch({ type: SET_LISTVIEW });
  };

  const updateSort = (e) => {
    const value = e.target.value;
    dispatch({ type: UPDATE_SORT, payload: value });
  };

  const updateFilters = (e) => {
    const { name, type } = e.currentTarget;
    let value = e.currentTarget.value;

    if (name === 'color') {
      value = e.currentTarget.dataset.color;
    } else if (name === 'price') {
      value = Number(value);
    } else if (name === 'shipping') {
      value = e.currentTarget.checked;
    } else if (type === 'button') {
      // Category / subCategory / productType / color reset buttons carry canonical values
      value = e.currentTarget.getAttribute('value') ?? value;
    }

    dispatch({ type: UPDATE_FILTERS, payload: { name, value } });
  };

  const setFilterValue = React.useCallback((name, value) => {
    dispatch({ type: UPDATE_FILTERS, payload: { name, value } });
  }, []);

  const setInitialFilters = React.useCallback((filters) => {
    dispatch({ type: SET_INITIAL_FILTERS, payload: filters });
  }, []);

  const clearFilters = React.useCallback(() => {
    dispatch({ type: CLEAR_FILTERS });
  }, []);

  useEffect(() => {
    dispatch({ type: LOAD_PRODUCTS, payload: products });
  }, [products]);

  useEffect(() => {
    dispatch({ type: FILTER_PRODUCTS });
    dispatch({ type: SORT_PRODUCTS });
  }, [products, state.sort, state.filters]);

  return (
    <FilterContext.Provider
      value={{
        ...state,
        setGridView,
        setListView,
        updateSort,
        updateFilters,
        setFilterValue,
        setInitialFilters,
        clearFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};
// make sure use
export const useFilterContext = () => {
  return useContext(FilterContext);
};
