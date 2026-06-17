import api from '../lib/axios';

export const getVehicles = () => api.get('/admin/vehicles');
export const getPublicVehicles = () => api.get('/vehicles');
export const createVehicle = (data) => api.post('/admin/vehicles', data);
export const updateVehicle = (id, data) => api.patch(`/admin/vehicles/${id}`, data);
export const deleteVehicle = (id) => api.delete(`/admin/vehicles/${id}`);
