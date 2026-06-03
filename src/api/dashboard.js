import api from './axios.js';

export function getDashboardStats() {
  return api.get('/dashboard');
}
