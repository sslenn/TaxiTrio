import api from '../lib/axios';

export const getNotifications = () => api.get('/notifications');
export const markRead = (id) => api.patch(`/notifications/${id}/read`);
