import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/products', { params });
      return data.data;
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
export default productSlice.reducer;