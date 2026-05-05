import {
  ADD_TO_CART,
  CLEAR_CART,
  COUNT_CART_TOTALS,
  REMOVE_CART_ITEM,
  TOGGLE_CART_ITEM_AMOUNT,
} from '../actions';

const cart_reducer = (state, action) => {
  if (action.type === ADD_TO_CART) {
    const { id, color, size, amount, product, expressDelivery } = action.payload;
    const tempItem = state.cart.find((item) => item.id === id + color + size);

    // Find variant stock if available
    let maxStock = product.stock || 0;
    if (product.variants && product.variants.length > 0) {
      const match = product.variants.find(v => v.size === size && v.color === color);
      if (match) maxStock = match.stock;
    }

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
        expressDelivery: expressDelivery || false,
        max: maxStock,
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
    const { total_items, total_amount } = state.cart.reduce(
      (total, cartItem) => {
        const { price, amount } = cartItem;
        total.total_items += amount;

        // Fix JavaScript floating point math errors
        total.total_amount += price * amount;
        total.total_amount = Number(total.total_amount.toFixed(2));

        return total;
      },
      {
        total_items: 0,
        total_amount: 0,
      }
    );

    let shipping_fee = 0;
    if (total_amount > 0) {
      const hasExpress = state.cart.some(item => item.expressDelivery);
      shipping_fee = 11 + (hasExpress ? 50 : 0);
    }

    return { ...state, total_items, total_amount, shipping_fee };
  }

  throw new Error(`No Matching "${action.type}" - action type`);
};

export default cart_reducer;
