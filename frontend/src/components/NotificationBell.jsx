import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { getNotifications, markRead } from '../service/notificationService';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const load = async () => {
    try {
      const { data } = await getNotifications();
      setNotifications(data.data);
    } catch {}
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, []);

  // close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const unread = notifications.filter((n) => !n.is_read).length;

  const handleMarkRead = async (id) => {
    try {
      await markRead(id);
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n));
    } catch {}
  };

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="relative p-1">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-muted hover:text-white transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-gold text-black text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
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
          <div className="relative w-full max-w-md bg-card border border-[#2a2a2a] rounded-2xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-5 py-4 border-b border-[#2a2a2a] flex justify-between items-center bg-[#121212]">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-white">Notifications</span>
                {unread > 0 && (
                  <span className="bg-gold/10 text-gold text-xs font-semibold px-2 py-0.5 rounded-full border border-gold/20">
                    {unread} unread
                  </span>
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
            
            <div className="max-h-[60vh] overflow-y-auto divide-y divide-[#1e1e1e]">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-neutral-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <p className="text-muted text-sm font-medium">All caught up!</p>
                  <p className="text-neutral-500 text-xs mt-1">No notifications to display right now.</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      if (!n.is_read) handleMarkRead(n.id);
                    }}
                    className={`px-5 py-4 cursor-pointer hover:bg-neutral-900/40 transition-colors flex flex-col gap-1 ${!n.is_read ? 'bg-gold/5' : ''}`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <p className={`text-sm font-semibold leading-tight ${!n.is_read ? 'text-gold' : 'text-white'}`}>
                        {n.title}
                      </p>
                      {!n.is_read && (
                        <span className="w-2 h-2 rounded-full bg-gold shrink-0 mt-1.5 animate-pulse"></span>
                      )}
                    </div>
                    <p className="text-muted text-xs leading-relaxed">{n.message}</p>
                    <p className="text-[#555] text-[10px] mt-1">
                      {new Date(n.created_at).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
