import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

export const getTodos    = (params) => api.get('/todos', { params });
export const createTodo  = (data)   => api.post('/todos', data);
export const updateTodo  = (id, data) => api.put(`/todos/${id}`, data);
export const toggleTodo  = (id)     => api.patch(`/todos/${id}/toggle`);
export const deleteTodo  = (id)     => api.delete(`/todos/${id}`);
export const clearDone   = ()       => api.delete('/todos/completed/all');

export default api;
