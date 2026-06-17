import api from '../lib/axios';

export const getRoutes = () => api.get('/routes');
export const createRoute = (data) => api.post('/admin/routes', data);
export const updateRoute = (id, data) => api.patch(`/admin/routes/${id}`, data);
