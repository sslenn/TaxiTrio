import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { 
  getNotifications, 
  markRead, 
  markAllRead, 
  deleteNotification, 
  subscribeToNotifications 
} from '../service/notificationService';
import { Trash2 } from 'lucide-react';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('all');
  const ref = useRef(null);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  const load = async () => {
    try {
      const { data } = await getNotifications();
      setNotifications(data.data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  useEffect(() => {
    // 1. Initial fetch
    load();

    // 2. Real-time stream subscription (SSE)
    const eventSource = subscribeToNotifications(
      (newNoti) => {
        setNotifications((prev) => {
          // De-duplicate immediately in local state
          if (prev.some((n) => n.id === newNoti.id)) return prev;
          return [newNoti, ...prev];
        });
      },
      (err) => {
        console.warn('Real-time connection closed or errored; polling will continue as fallback.');
      }
    );

    // 3. Backup polling fallback (every 30 seconds)
    const interval = setInterval(load, 30000);

    return () => {
      if (eventSource) eventSource.close();
      clearInterval(interval);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => { 
      if (
        ref.current && !ref.current.contains(e.target) &&
        (!modalRef.current || !modalRef.current.contains(e.target))
      ) {
        setOpen(false); 
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const unread = notifications.filter((n) => !n.is_read).length;

  const handleMarkRead = async (id) => {
    try {
      await markRead(id);
      setNotifications((prev) => 
        prev.map((n) => n.id === id ? { ...n, is_read: true, read_at: new Date() } : n)
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllRead();
      setNotifications((prev) => 
        prev.map((n) => ({ ...n, is_read: true, read_at: new Date() }))
      );
    } catch (err) {
      console.error("Failed to mark all notifications read:", err);
    }
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setMessage('Notification deleted successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Failed to delete notification:', err);
      setMessage('Failed to delete notification: ' + (err.response?.data?.message || err.message));
      setTimeout(() => setMessage(''), 4000);
    }
  };

  const handleNotificationClick = async (n) => {
    // 1. Mark as read if unread
    if (!n.is_read) {
      await handleMarkRead(n.id);
    }
    
    // 2. Close dropdown modal
    setOpen(false);

    // 3. Navigate using action_url or related metadata
    if (n.action_url) {
      navigate(n.action_url);
    } else {
      // Legacy parsing fallback
      const currentPath = window.location.pathname;
      const message = n.message || '';
      const title = n.title || '';
      const match = message.match(/#(\d+)/);
      const bookingId = match ? match[1] : '';

      if (currentPath.startsWith('/admin')) {
        if (title.toLowerCase().includes('payment') || title.toLowerCase().includes('paid') || message.toLowerCase().includes('payment')) {
          navigate('/admin/payments');
        } else {
          navigate('/admin/bookings');
        }
      } else if (currentPath.startsWith('/driver')) {
        navigate('/driver/bookings');
      } else if (currentPath.startsWith('/traveler')) {
        if (bookingId) {
          navigate(`/traveler/bookings/${bookingId}`);
        } else {
          navigate('/traveler/bookings');
        }
      }
    }
  };

  // Group notifications by date
  const groupNotificationsByDate = (notis) => {
    const today = [];
    const yesterday = [];
    const earlier = [];

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterdayStart = todayStart - 24 * 60 * 60 * 1000;

    notis.forEach((n) => {
      const dateVal = n.created_at || n.createdAt;
      const date = dateVal ? new Date(dateVal).getTime() : 0;
      if (date >= todayStart) {
        today.push(n);
      } else if (date >= yesterdayStart) {
        yesterday.push(n);
      } else {
        earlier.push(n);
      }
    });

    return { today, yesterday, earlier };
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter((n) => !n.is_read)
    : notifications;

  const grouped = groupNotificationsByDate(filteredNotifications);

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'Critical':
        return {
          border: 'border-l-4 border-l-red-500',
          badgeClass: 'bg-red-500/20 text-red-400 border border-red-500/30'
        };
      case 'High':
        return {
          border: 'border-l-4 border-l-amber-500',
          badgeClass: 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
        };
      case 'Low':
        return {
          border: 'border-l-4 border-l-neutral-700',
          badgeClass: 'bg-neutral-800 text-neutral-500'
        };
      default: // Normal
        return {
          border: 'border-l-4 border-l-gold/45',
          badgeClass: 'bg-gold/10 text-gold border border-gold/20'
        };
    }
  };

  const renderNotificationItem = (n) => {
    const { border, badgeClass } = getPriorityStyle(n.priority);
    return (
      <div
        key={n.id}
        className={`flex items-stretch justify-between border-b border-[#1e1e1e] noti-item-hover ${border} ${!n.is_read ? 'bg-gold/5' : ''}`}
      >
        {/* Clickable content area */}
        <div
          onClick={() => handleNotificationClick(n)}
          className="flex-1 px-5 py-4 cursor-pointer flex flex-col gap-1 min-w-0"
        >
          <div className="flex flex-wrap items-center gap-2">
            <p className={`text-sm font-semibold leading-tight ${!n.is_read ? 'text-gold' : 'text-white'}`}>
              {n.title}
            </p>
            {n.priority && n.priority !== 'Normal' && (
              <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${badgeClass}`}>
                {n.priority}
              </span>
            )}
            {!n.is_read && (
              <span className="w-2.5 h-2.5 rounded-full bg-gold shrink-0 pulse-glow-ring"></span>
            )}
          </div>
          <p className="text-muted text-xs leading-relaxed break-words">{n.message}</p>
          <p className="text-[#555] text-[10px] mt-1">
            {new Date(n.created_at || n.createdAt).toLocaleString()}
          </p>
        </div>

        {/* Action button area */}
        <div className="flex items-center px-4 shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDelete(e, n.id);
            }}
            className="text-red-500 hover:text-red-400 p-1.5 rounded hover:bg-red-500/10 transition duration-150"
            title="Delete notification"
          >
            <Trash2 className="w-4 h-4 pointer-events-none" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="relative font-sans" ref={ref}>
      <button onClick={() => setOpen(!open)} className="relative p-1 flex items-center justify-center bell-ring-hover">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-muted hover:text-white transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-gold text-black text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center pulse-glow-ring">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setOpen(false)}
          ></div>
          
          {/* Modal Content */}
          <div ref={modalRef} className="relative w-full max-w-md bg-card border border-[#2a2a2a] rounded-2xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-5 py-4 border-b border-[#2a2a2a] flex justify-between items-center bg-[#121212]">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-white">Notifications</span>
                {unread > 0 && (
                  <button 
                    onClick={handleMarkAllRead}
                    className="text-[10px] text-gold hover:text-gold/80 hover:underline uppercase tracking-wider font-bold ml-2 transition"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <button 
                onClick={() => setOpen(false)} 
                className="text-muted hover:text-white transition p-1 hover:bg-neutral-900 rounded-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Filter Chips */}
            <div className="flex gap-2 px-5 py-2.5 bg-[#161616]/60 border-b border-[#2a2a2a] transition-all">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${
                  filter === 'all' 
                    ? 'bg-gold text-black shadow-lg shadow-gold/25 scale-105' 
                    : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('unread')}
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${
                  filter === 'unread' 
                    ? 'bg-gold text-black shadow-lg shadow-gold/25 scale-105' 
                    : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'
                }`}
              >
                Unread ({unread})
              </button>
            </div>
            
            <div className="max-h-[60vh] overflow-y-auto divide-y divide-[#1e1e1e]">
              {message && (
                <div className="bg-[#121212] border-b border-[#2a2a2a] px-5 py-2.5 text-xs text-center font-medium text-gold">
                  {message}
                </div>
              )}
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-neutral-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <p className="text-muted text-sm font-medium">All caught up!</p>
                  <p className="text-neutral-500 text-xs mt-1">
                    {filter === 'unread' ? 'No unread notifications left.' : 'No notifications to display right now.'}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col">
                  {/* Today Section */}
                  {grouped.today.length > 0 && (
                    <div>
                      <div className="bg-[#161616] px-5 py-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500 border-b border-[#202020]">
                        Today
                      </div>
                      <div className="divide-y divide-[#1e1e1e]">
                        {grouped.today.map(renderNotificationItem)}
                      </div>
                    </div>
                  )}

                  {/* Yesterday Section */}
                  {grouped.yesterday.length > 0 && (
                    <div>
                      <div className="bg-[#161616] px-5 py-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500 border-b border-[#202020]">
                        Yesterday
                      </div>
                      <div className="divide-y divide-[#1e1e1e]">
                        {grouped.yesterday.map(renderNotificationItem)}
                      </div>
                    </div>
                  )}

                  {/* Earlier Section */}
                  {grouped.earlier.length > 0 && (
                    <div>
                      <div className="bg-[#161616] px-5 py-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500 border-b border-[#202020]">
                        Earlier
                      </div>
                      <div className="divide-y divide-[#1e1e1e]">
                        {grouped.earlier.map(renderNotificationItem)}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
