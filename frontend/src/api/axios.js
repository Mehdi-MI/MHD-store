import axios from 'axios';

/* ── Base instance ──────────────────────────────────────── */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // send HttpOnly cookies
  timeout: 15_000,
});

/* ── Request interceptor — attach Bearer token ──────────── */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mhd_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

/* ── Response interceptor — handle 401 globally ─────────── */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        const newToken = data.data.token;
        localStorage.setItem('mhd_token', newToken);
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch {
        localStorage.removeItem('mhd_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
