import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

/* ── Async thunks ───────────────────────────────────────── */
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      return data.data; // { user, token }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/register', payload);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

export const fetchMe = createAsyncThunk(
  'auth/me',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/auth/me');
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

/* ── Slice ──────────────────────────────────────────────── */
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:    null,
    token:   localStorage.getItem('mhd_token') || null,
    loading: false,
    error:   null,
  },
  reducers: {
    setCredentials(state, { payload }) {
      state.user  = payload.user;
      state.token = payload.token;
      localStorage.setItem('mhd_token', payload.token);
    },
    clearAuth(state) {
      state.user  = null;
      state.token = null;
      localStorage.removeItem('mhd_token');
    },
  },
  extraReducers: (builder) => {
    const pending  = (state) => { state.loading = true;  state.error = null; };
    const rejected = (state, { payload }) => { state.loading = false; state.error = payload; };

    builder
      .addCase(loginUser.pending,    pending)
      .addCase(loginUser.fulfilled,  (state, { payload }) => {
        state.loading = false;
        state.user    = payload.user;
        state.token   = payload.token;
        localStorage.setItem('mhd_token', payload.token);
      })
      .addCase(loginUser.rejected,   rejected)

      .addCase(registerUser.pending,   pending)
      .addCase(registerUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user    = payload.user;
        state.token   = payload.token;
        localStorage.setItem('mhd_token', payload.token);
      })
      .addCase(registerUser.rejected,  rejected)

      .addCase(fetchMe.pending,    pending)
      .addCase(fetchMe.fulfilled,  (state, { payload }) => { state.loading = false; state.user = payload; })
      .addCase(fetchMe.rejected,   (state) => { state.loading = false; state.user = null; state.token = null; })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user  = null;
        state.token = null;
        localStorage.removeItem('mhd_token');
      });
  },
});

export const { setCredentials, clearAuth } = authSlice.actions;
export default authSlice.reducer;

/* ── Selectors ──────────────────────────────────────────── */
export const selectCurrentUser  = (state) => state.auth.user;
export const selectToken        = (state) => state.auth.token;
export const selectAuthLoading  = (state) => state.auth.loading;
export const selectAuthError    = (state) => state.auth.error;
export const selectIsAuth       = (state) => !!state.auth.token;
export const selectRole         = (state) => state.auth.user?.role;
