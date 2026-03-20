import axios from 'axios';

// Uses REACT_APP_API_URL env var in production (set in Vercel),
// falls back to localhost for local development
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const API = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Products API ──────────────────────────────────────────
export const fetchProducts = () => API.get('/products');
export const fetchProduct  = (id) => API.get(`/products/${id}`);
export const createProduct = (data) => API.post('/products', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

export default API;
