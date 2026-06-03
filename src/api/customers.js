import api from './axios.js';

export function createCustomer(payload) {
  return api.post('/customers/create', payload);
}

export function getCustomers(params) {
  return api.get('/customers/all', { params });
}

export function getCustomerById(id) {
  return api.get(`/customers/${id}`);
}
