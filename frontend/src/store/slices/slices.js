import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

/* ════════════════════════════════════════════════════════════
   PRODUCT SLICE
════════════════════════════════════════════════════════════ */
export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/products', { params });
      return data.data; // { products, total, page, pages }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/products/${id}`);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const productSlice = createSlice({
  name: 'products',
  initialState: {
    items:    [],
    selected: null,
    total:    0,
    page:     1,
    pages:    1,
    loading:  false,
    error:    null,
    filters: { category: '', search: '', sort: 'newest', minPrice: '', maxPrice: '' },
  },
  reducers: {
    setFilters(state, { payload }) { state.filters = { ...state.filters, ...payload }; },
    resetFilters(state) { state.filters = { category: '', search: '', sort: 'newest', minPrice: '', maxPrice: '' }; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending,    (state) => { state.loading = true;  state.error = null; })
      .addCase(fetchProducts.fulfilled,  (state, { payload }) => {
        state.loading = false;
        state.items   = payload.products;
        state.total   = payload.total;
        state.page    = payload.page;
        state.pages   = payload.pages;
      })
      .addCase(fetchProducts.rejected,   (state, { payload }) => { state.loading = false; state.error = payload; })
      .addCase(fetchProductById.pending,   (state) => { state.loading = true;  state.selected = null; })
      .addCase(fetchProductById.fulfilled, (state, { payload }) => { state.loading = false; state.selected = payload; })
      .addCase(fetchProductById.rejected,  (state, { payload }) => { state.loading = false; state.error = payload; });
  },
});
export const { setFilters, resetFilters } = productSlice.actions;

/* ════════════════════════════════════════════════════════════
   WISHLIST SLICE
════════════════════════════════════════════════════════════ */
const loadWishlist = () => {
  try { return JSON.parse(localStorage.getItem('mhd_wishlist')) || []; }
  catch { return []; }
};

export const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { items: loadWishlist() },
  reducers: {
    toggleWishlist(state, { payload: product }) {
      const idx = state.items.findIndex(i => i.id === product.id);
      if (idx >= 0) state.items.splice(idx, 1);
      else          state.items.push(product);
      localStorage.setItem('mhd_wishlist', JSON.stringify(state.items));
    },
    clearWishlist(state) {
      state.items = [];
      localStorage.removeItem('mhd_wishlist');
    },
  },
});
export const { toggleWishlist, clearWishlist } = wishlistSlice.actions;

/* ════════════════════════════════════════════════════════════
   ORDER SLICE
════════════════════════════════════════════════════════════ */
export const createOrder = createAsyncThunk(
  'orders/create',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/orders', payload);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMine',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/orders/me');
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    items:    [],
    selected: null,
    loading:  false,
    error:    null,
  },
  reducers: {
    setSelectedOrder(state, { payload }) { state.selected = payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending,    (state) => { state.loading = true;  state.error = null; })
      .addCase(createOrder.fulfilled,  (state, { payload }) => { state.loading = false; state.selected = payload; })
      .addCase(createOrder.rejected,   (state, { payload }) => { state.loading = false; state.error = payload; })
      .addCase(fetchMyOrders.pending,   (state) => { state.loading = true; })
      .addCase(fetchMyOrders.fulfilled, (state, { payload }) => { state.loading = false; state.items = payload; })
      .addCase(fetchMyOrders.rejected,  (state, { payload }) => { state.loading = false; state.error = payload; });
  },
});
export const { setSelectedOrder } = orderSlice.actions;

/* ── Default exports consumed by store.js ───────────────── */
export default {
  productReducer:  productSlice.reducer,
  wishlistReducer: wishlistSlice.reducer,
  orderReducer:    orderSlice.reducer,
};
