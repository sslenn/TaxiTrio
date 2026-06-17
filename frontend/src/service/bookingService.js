import api from '../lib/axios';

export const createBooking = (data) => api.post('/bookings', data);
export const estimateBookingFare = (data) => api.post('/bookings/estimate', data);
export const getMyBookings = () => api.get('/bookings/my-bookings');
export const getMyCustomRequests = () => api.get('/custom-trip-requests/my-requests');
export const confirmCustomRequest = (id, data) => api.patch(`/custom-trip-requests/${id}/confirm`, data);
export const markRequestUrgent = (id) => api.post(`/custom-trip-requests/${id}/urgent`);
export const getBookingById = (id) => api.get(`/bookings/${id}`);
export const cancelBooking = (id) => api.patch(`/bookings/${id}/cancel`);

export const getAdminBookings = () => api.get('/admin/bookings');
export const assignDriver = (id, data) => api.patch(`/admin/bookings/${id}/assign-driver`, data);
