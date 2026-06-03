import api from './axios.js';

export function getUoms() {
  return api.get('/products/uoms');
}

export function createProduct(payload) {
  return api.post('/products', payload);
}

export function getProducts(params) {
  return api.get('/products/all', { params });
}

export function getProductById(productId) {
  return api.get(`/products/${productId}`);
}

export function deleteProduct(productId) {
  return api.delete(`/products/${productId}`);
}
