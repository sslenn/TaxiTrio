import api from '../lib/axios';

export const getPackages = () => api.get('/packages');
export const getPackageById = (id) => api.get(`/packages/${id}`);
export const createPackage = (data) => api.post('/admin/packages', data);
export const updatePackage = (id, data) => api.patch(`/admin/packages/${id}`, data);
