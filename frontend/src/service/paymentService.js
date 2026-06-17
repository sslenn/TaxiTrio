import api from '../lib/axios';

export const createPayment = (formData) =>
  api.post('/payments', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

export const getAdminPayments = () => api.get('/admin/payments');
export const verifyPayment = (id) => api.patch(`/admin/payments/${id}/verify`);
export const rejectPayment = (id) => api.patch(`/admin/payments/${id}/reject`);

export const getCheckoutSession = (bookingId) => api.get(`/payments/checkout/${bookingId}`);
export const simulateKHQRPayment = (bookingId) => api.post(`/payments/${bookingId}/simulate-khqr-pay`);
