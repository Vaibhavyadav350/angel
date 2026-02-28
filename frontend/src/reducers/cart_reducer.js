import {
  ADD_TO_CART,
  CLEAR_CART,
  COUNT_CART_TOTALS,
  REMOVE_CART_ITEM,
  TOGGLE_CART_ITEM_AMOUNT,
} from '../actions';

const cart_reducer = (state, action) => {
  if (action.type === ADD_TO_CART) {
    const { id, color, size, amount, product } = action.payload;
    const tempItem = state.cart.find((item) => item.id === id + color + size);
    if (tempItem) {
      const tempCart = state.cart.map((cartItem) => {
        if (cartItem.id === id + color + size) {
          let newAmount = cartItem.amount + amount;
          if (newAmount > cartItem.max) {
            newAmount = cartItem.max;
          }
          return { ...cartItem, amount: newAmount };
        } else {
          return cartItem;
        }
      });
      return { ...state, cart: tempCart };
    } else {
      const defaultImage = { url: 'https://via.placeholder.com/500x500?text=No+Image' };
      const productImage = product.images && product.images.length > 0
        ? product.images[0]
        : defaultImage;

      const discount = product.discountPercent || 0;
      const tax = product.taxPercent || 0;
      const basePrice = product.price || 0;
      const finalPrice = (basePrice * (1 - discount / 100)) * (1 + tax / 100);

      const newItem = {
        id: id + color + size,
        productId: id,
        name: product.name || 'Product',
        color,
        size,
        amount,
        image: productImage.url || defaultImage.url,
        price: finalPrice,
        basePrice,
        discountPercent: discount,
        taxPercent: tax,
        shipping: product.shipping || false,
        max: product.stock || 0,
      };
      return { ...state, cart: [...state.cart, newItem] };
    }
  }

  if (action.type === REMOVE_CART_ITEM) {
    const tempCart = state.cart.filter((item) => item.id !== action.payload);
    return { ...state, cart: tempCart };
  }

  if (action.type === CLEAR_CART) {
    return { ...state, cart: [] };
  }

  if (action.type === TOGGLE_CART_ITEM_AMOUNT) {
    const { id, value } = action.payload;
    const tempCart = state.cart.map((item) => {
      if (item.id === id) {
        //increase
        if (value === 'inc') {
          let newAmount = item.amount + 1;
          if (newAmount > item.max) {
            newAmount = item.max;
          }
          return { ...item, amount: newAmount };
        }
        //decrease
        if (value === 'dec') {
          let newAmount = item.amount - 1;
          if (newAmount < 1) {
            newAmount = 1;
          }
          return { ...item, amount: newAmount };
        }
      }
      return item;
    });
    return { ...state, cart: tempCart };
  }

  if (action.type === COUNT_CART_TOTALS) {
    const { total_items, total_amount, shipping_fee } = state.cart.reduce(
      (total, cartItem) => {
        const { price, amount, shipping } = cartItem;
        total.total_items += amount;
        total.total_amount += price * amount;
        // Shipping fee: $15 flat rate per order for Angel Archive, not per item
        if (total.total_amount > 0) {
          total.shipping_fee = 15; // $15 standard archival shipping
        }
        return total;
      },
      {
        total_items: 0,
        total_amount: 0,
        shipping_fee: 0,
      }
    );
    return { ...state, total_items, total_amount, shipping_fee };
  }

  throw new Error(`No Matching "${action.type}" - action type`);
};

export default cart_reducer;
