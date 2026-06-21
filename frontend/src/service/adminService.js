import api from '../lib/axios';

export const getUsers = () => api.get('/admin/users');
export const toggleUser = (id) => api.patch(`/admin/users/${id}/toggle`);
export const getDrivers = () => api.get('/admin/drivers');
export const getCustomRequests = () => api.get('/admin/custom-trip-requests');
export const approveCustomRequest = (id, data) => api.patch(`/admin/custom-trip-requests/${id}/approve`, data);
export const rejectCustomRequest = (id, data) => api.patch(`/admin/custom-trip-requests/${id}/reject`, data);
export const getReports = () => api.get('/admin/reports');
export const createDriver = (data) => api.post('/admin/drivers', data);
export const getUserDetails = (id) => api.get(`/admin/users/${id}/details`);
