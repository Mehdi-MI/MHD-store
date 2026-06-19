/**
 * services/index.js
 * Centralised API service functions.
 * Import what you need: import { productService } from '@/services';
 */

import api from '../api/axios';

/* ─── Auth ───────────────────────────────────────────────── */
export const authService = {
  login:    (creds)   => api.post('/auth/login',    creds),
  register: (payload) => api.post('/auth/register', payload),
  logout:   ()        => api.post('/auth/logout'),
  me:       ()        => api.get('/auth/me'),
  refresh:  ()        => api.post('/auth/refresh'),
};

/* ─── Products ───────────────────────────────────────────── */
export const productService = {
  getAll:    (params)  => api.get('/products',             { params }),
  getById:   (id)      => api.get(`/products/${id}`),
  getByCategory: (slug, params) => api.get(`/products/category/${slug}`, { params }),
  create:    (payload) => api.post('/products',            payload),
  update:    (id, payload) => api.put(`/products/${id}`,  payload),
  delete:    (id)      => api.delete(`/products/${id}`),
  getReviews:(id)      => api.get(`/products/${id}/reviews`),
};

/* ─── Categories ─────────────────────────────────────────── */
export const categoryService = {
  getAll:    ()            => api.get('/categories'),
  getById:   (id)          => api.get(`/categories/${id}`),
  create:    (payload)     => api.post('/categories',        payload),
  update:    (id, payload) => api.put(`/categories/${id}`,   payload),
  delete:    (id)          => api.delete(`/categories/${id}`),
};

/* ─── Cart ───────────────────────────────────────────────── */
export const cartService = {
  get:    ()                         => api.get('/cart'),
  add:    (productId, quantity = 1)  => api.post('/cart/add',        { productId, quantity }),
  update: (itemId,   quantity)       => api.put(`/cart/update/${itemId}`, { quantity }),
  remove: (itemId)                   => api.delete(`/cart/remove/${itemId}`),
};

/* ─── Orders ─────────────────────────────────────────────── */
export const orderService = {
  create:       (payload) => api.post('/orders',               payload),
  getMyOrders:  ()        => api.get('/orders/me'),
  getById:      (id)      => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

/* ─── Payments ───────────────────────────────────────────── */
export const paymentService = {
  createIntent: (orderId) => api.post('/payments/create-intent', { orderId }),
  getById:      (id)      => api.get(`/payments/${id}`),
};

/* ─── Reviews ────────────────────────────────────────────── */
export const reviewService = {
  create: (payload)     => api.post('/reviews',          payload),
  update: (id, payload) => api.put(`/reviews/${id}`,    payload),
  delete: (id)          => api.delete(`/reviews/${id}`),
};

/* ─── Sellers ────────────────────────────────────────────── */
export const sellerService = {
  getAll:       ()        => api.get('/sellers'),
  getById:      (id)      => api.get(`/sellers/${id}`),
  register:     (payload) => api.post('/sellers/register', payload),
  getMyProducts:()        => api.get('/sellers/me/products'),
};

/* ─── Admin ──────────────────────────────────────────────── */
export const adminService = {
  getUsers:   (params) => api.get('/admin/users',    { params }),
  deleteUser: (id)     => api.delete(`/admin/users/${id}`),
  getOrders:  (params) => api.get('/admin/orders',   { params }),
  getProducts:(params) => api.get('/admin/products', { params }),
  getSellers: (params) => api.get('/admin/sellers',  { params }),
};
