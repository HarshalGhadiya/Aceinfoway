import axios from 'axios';

export const api = axios.create({ baseURL: '/api' });

export async function getDashboard() {
  const { data } = await api.get('/dashboard/dashboard');
  return data;
}

export async function getTrends(params) {
  const { data } = await api.get('/dashboard/trends', { params });
  return data;
}

export async function getOrders(params) {
  const { data } = await api.get('/orders', { params });
  return data;
}

export async function getProductDetails(id) {
  const { data } = await api.get(`/products/${id}/details`);
  return data;
}

export async function getTopProducts(params) {
  const { data } = await api.get('/dashboard/top-products', { params });
  return data.data;
}

export async function getCampaigns() {
  const { data } = await api.get('/dashboard/campaigns');
  return data.data;
}

export async function getOrdersPerCustomer() {
  const { data } = await api.get('/dashboard/orders-per-customer');
  return data.data;
}
