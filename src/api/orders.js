import api from './axios.js';

export function customerSuggestions(search) {
  return api.get('/orders/customer-suggestions', { params: { search } });
}

export function productSuggestions(search) {
  return api.get('/orders/product-suggestions', { params: { search } });
}

export function createOrder(payload) {
  return api.post('/orders/create', payload);
}

export function getOrders(params) {
  return api.get('/orders/all', { params });
}

export function getOrderById(id) {
  return api.get(`/orders/${id}`);
}

export function updateOrderStatus(orderId, payload) {
  return api.put(`/orders/${orderId}/status`, payload);
}
