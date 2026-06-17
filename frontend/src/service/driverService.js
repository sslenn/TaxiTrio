import api from '../lib/axios';

export const getDriverBookings = () => api.get('/driver/bookings');
export const acceptBooking = (id) => api.patch(`/driver/bookings/${id}/accept`);
export const rejectBooking = (id) => api.patch(`/driver/bookings/${id}/reject`);
export const updateTripStatus = (id, status) => api.patch(`/driver/bookings/${id}/status`, { status });
export const getEarnings = () => api.get('/driver/earnings');
export const getTripHistory = () => api.get('/driver/trip-history');
