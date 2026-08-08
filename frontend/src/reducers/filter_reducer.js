import {
  LOAD_PRODUCTS,
  SET_LISTVIEW,
  SET_GRIDVIEW,
  UPDATE_SORT,
  SORT_PRODUCTS,
  UPDATE_FILTERS,
  FILTER_PRODUCTS,
  CLEAR_FILTERS,
  SET_INITIAL_FILTERS,
} from '../actions';
import { unitSellingPrice } from '../utils/pricing';

// Everything price-related on this page must use the price the shopper actually
// pays, not the RRP. 33 of 58 products are discounted, so sorting, the slider
// bounds and the slider filter were all working off a number that appears on the
// card only as struck-through text.
const shownPrice = (product) => unitSellingPrice(product);

// Out of stock sinks below in stock, whatever the sort. 25 of 58 products have
// no stock; ranked purely on price they lead the grid and the only buyable piece
// ends up below the fold.
const inStock = (product) => Number(product?.stock) > 0;
const availabilityFirst = (a, b) => Number(inStock(b)) - Number(inStock(a));

const filter_reducer = (state, action) => {
  if (action.type === LOAD_PRODUCTS) {
    // Guard against an empty product list — Math.max(...[]) is -Infinity, which
    // would break the price slider and filter every product out.
    const prices = action.payload.map(shownPrice).filter((p) => typeof p === 'number' && !Number.isNaN(p));
    const maxPrice = prices.length ? Math.max(...prices) : 0;
    const minPrice = prices.length ? Math.min(...prices) : 0;

    return {
      ...state,
      all_products: [...action.payload],
      filtered_products: [...action.payload],
      filters: { ...state.filters, max_price: maxPrice, price: maxPrice, min_price: minPrice },
    };
  }

  if (action.type === SET_GRIDVIEW) {
    return { ...state, grid_view: true };
  }

  if (action.type === SET_LISTVIEW) {
    return { ...state, grid_view: false };
  }

  if (action.type === UPDATE_SORT) {
    return { ...state, sort: action.payload };
  }

  if (action.type === SORT_PRODUCTS) {
    const { sort, filtered_products } = state;
    let tempProducts = [...filtered_products];

    // low-high
    if (sort === 'price-lowest') {
      tempProducts.sort((a, b) => availabilityFirst(a, b) || shownPrice(a) - shownPrice(b));
    }
    // high-low
    if (sort === 'price-highest') {
      tempProducts.sort((a, b) => availabilityFirst(a, b) || shownPrice(b) - shownPrice(a));
    }
    // ascending
    if (sort === 'name-a') {
      tempProducts.sort((a, b) => availabilityFirst(a, b) || a.name.localeCompare(b.name));
    }
    // descending
    if (sort === 'name-z') {
      tempProducts.sort((a, b) => availabilityFirst(a, b) || b.name.localeCompare(a.name));
    }

    return { ...state, filtered_products: tempProducts };
  }

  if (action.type === UPDATE_FILTERS) {
    const { name, value } = action.payload;
    let newFilters = { ...state.filters, [name]: value };
    // Cascade reset: if category changes, reset subCategory and productType
    if (name === 'category') {
      newFilters.subCategory = 'all';
      newFilters.productType = 'all';
    }
    // If subCategory changes, reset productType
    if (name === 'subCategory') {
      newFilters.productType = 'all';
    }
    return { ...state, filters: newFilters };
  }

  if (action.type === SET_INITIAL_FILTERS) {
    const { category, subCategory, productType, collection } = action.payload;
    let newFilters = { ...state.filters };
    newFilters.category = category || 'all';
    newFilters.subCategory = subCategory || 'all';
    newFilters.productType = productType || 'all';
    newFilters.fabric = action.payload.fabric || 'all';
    newFilters.collection = collection || 'all';
    return { ...state, filters: newFilters };
  }

  if (action.type === FILTER_PRODUCTS) {
    const { all_products } = state;
    const { text, category, company, collection, color, price, shipping } = state.filters;
    let tempProducts = [...all_products];

    //text
    if (text) {
      tempProducts = tempProducts.filter((product) => {
        return product.name.toLowerCase().includes(text.toLowerCase());
      });
    }
    //category
    if (category && category.toLowerCase() !== 'all') {
      tempProducts = tempProducts.filter((product) => {
        return product.category && product.category.toLowerCase() === category.toLowerCase();
      });
    }
    //subCategory
    if (state.filters.subCategory && state.filters.subCategory.toLowerCase() !== 'all') {
      tempProducts = tempProducts.filter((product) => {
        return product.subCategory && product.subCategory.toLowerCase() === state.filters.subCategory.toLowerCase();
      });
    }
    //productType
    if (state.filters.productType && state.filters.productType.toLowerCase() !== 'all') {
      tempProducts = tempProducts.filter((product) => {
        return product.productType && product.productType.toLowerCase() === state.filters.productType.toLowerCase();
      });
    }
    //fabric — cloth / silhouette, set per product in the admin
    if (state.filters.fabric && state.filters.fabric.toLowerCase() !== 'all') {
      tempProducts = tempProducts.filter((product) => {
        return product.fabric && product.fabric.toLowerCase() === state.filters.fabric.toLowerCase();
      });
    }
    //company
    if (company && company.toLowerCase() !== 'all') {
      tempProducts = tempProducts.filter((product) => {
        return product.company && product.company.toLowerCase() === company.toLowerCase();
      });
    }
    //collection (checks product.collections array)
    if (collection && collection.toLowerCase() !== 'all') {
      tempProducts = tempProducts.filter((product) => {
        return product.collections && product.collections.some(c => c.toLowerCase() === collection.toLowerCase());
      });
    }
    //color
    if (color !== 'all') {
      tempProducts = tempProducts.filter((product) => {
        return product.colors && product.colors.find((c) => c === color);
      });
    }
    //price
    tempProducts = tempProducts.filter((product) => {
      return shownPrice(product) <= price;
    });
    //shipping
    if (shipping) {
      tempProducts = tempProducts.filter((product) => {
        return product.shipping === true;
      });
    }

    return { ...state, filtered_products: tempProducts };
  }

  if (action.type === CLEAR_FILTERS) {
    return {
      ...state,
      filters: {
        ...state.filters,
        text: '',
        company: 'all',
        collection: 'all',
        category: 'all',
        subCategory: 'all',
        productType: 'all',
        fabric: 'all',
        color: 'all',
        price: state.filters.max_price,
        shipping: false,
      },
    };
  }

  throw new Error(`No Matching "${action.type}" - action type`);
};

export default filter_reducer;
