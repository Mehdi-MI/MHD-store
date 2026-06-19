import { createSlice } from '@reduxjs/toolkit';

const loadCart = () => {
  try { return JSON.parse(localStorage.getItem('mhd_cart')) || []; }
  catch { return []; }
};
const saveCart = (items) =>
  localStorage.setItem('mhd_cart', JSON.stringify(items));

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadCart(),
  },
  reducers: {
    addToCart(state, { payload: product }) {
      const existing = state.items.find(i => i.id === product.id);
      if (existing) {
        existing.quantity += product.quantity || 1;
      } else {
        state.items.push({ ...product, quantity: product.quantity || 1 });
      }
      saveCart(state.items);
    },
    removeFromCart(state, { payload: productId }) {
      state.items = state.items.filter(i => i.id !== productId);
      saveCart(state.items);
    },
    updateQuantity(state, { payload: { productId, quantity } }) {
      const item = state.items.find(i => i.id === productId);
      if (item) {
        item.quantity = Math.max(1, quantity);
        saveCart(state.items);
      }
    },
    clearCart(state) {
      state.items = [];
      localStorage.removeItem('mhd_cart');
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

/* ── Selectors ──────────────────────────────────────────── */
export const selectCartItems    = (state) => state.cart.items;
export const selectCartCount    = (state) => state.cart.items.reduce((sum, i) => sum + i.quantity, 0);
export const selectCartTotal    = (state) => state.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
