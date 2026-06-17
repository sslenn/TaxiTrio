import api from '../lib/axios';

export const submitReview = (data) => api.post('/reviews', data);
