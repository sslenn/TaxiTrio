import api from '../lib/axios';

export const getNotifications = (unreadOnly = false) => 
  api.get(`/notifications${unreadOnly ? '?unread=true' : ''}`);

export const getUnreadCount = () => api.get('/notifications/unread-count');

export const markRead = (id) => api.patch(`/notifications/${id}/read`);

export const markAllRead = () => api.patch('/notifications/read-all');

export const deleteNotification = (id) => api.delete(`/notifications/${id}`);

// SSE Connection Helper for Real-time Notifications
export const subscribeToNotifications = (onMessage, onError) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (!token) return null;
  
  // Use absolute URL pointing to backend API endpoint
  const backendBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  const url = `${backendBase}/notifications/stream?token=${encodeURIComponent(token)}`;
  
  const eventSource = new EventSource(url);
  
  eventSource.onmessage = (event) => {
    try {
      const notification = JSON.parse(event.data);
      onMessage(notification);
    } catch (err) {
      console.error('Failed to parse SSE notification message:', err);
    }
  };
  
  eventSource.onerror = (err) => {
    if (onError) onError(err);
  };
  
  return eventSource;
};
