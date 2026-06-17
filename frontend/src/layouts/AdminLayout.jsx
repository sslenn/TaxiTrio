import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { logout, getUser } from '../utils/auth';
import NotificationBell from '../components/NotificationBell';
import { useTranslation } from '../context/LanguageContext';

const links = [
  { 
    to: '/admin', 
    labelKey: 'dashboard', 
    end: true,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
      </svg>
    )
  },
  { 
    to: '/admin/users', 
    labelKey: 'users',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  },
  { 
    to: '/admin/drivers', 
    labelKey: 'drivers',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  { 
    to: '/admin/vehicles', 
    labelKey: 'vehicles',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 17a2 2 0 11-4 0 2 2 0 014 0zM18 17a2 2 0 11-4 0 2 2 0 014 0zM18 12H6m14-4.5h-2.58a1 1 0 00-.7-.29l-1.42-1.42a1 1 0 00-.7-.29H9.4a1 1 0 00-.7.29L7.28 7.21a1 1 0 00-.7.29H4v4.5h16V7.5z" />
      </svg>
    )
  },
  { 
    to: '/admin/routes', 
    labelKey: 'routes',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    )
  },
  { 
    to: '/admin/packages', 
    labelKey: 'packages',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    )
  },
  { 
    to: '/admin/bookings', 
    labelKey: 'bookings',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
  { 
    to: '/admin/payments', 
    labelKey: 'payments',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    )
  },
  { 
    to: '/admin/custom-requests', 
    labelKey: 'customTrip',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    )
  },
  { 
    to: '/admin/reports', 
    labelKey: 'reports',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const user = getUser();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#0B0B0B] text-white">
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-[#0E0E0E] border-b border-gold/10 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-[#A3A3A3] hover:text-white focus:outline-none"
            aria-label="Toggle Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          <span onClick={() => navigate('/')} className="text-gold font-bold text-xl tracking-wider font-serif cursor-pointer">
            TaxiTrio
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <NotificationBell />
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt="avatar" className="w-8 h-8 rounded-full object-cover border border-gold/20" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-neutral-900 border border-gold/20 flex items-center justify-center text-[10px] text-gold font-bold uppercase">
              {user?.full_name?.charAt(0) || 'A'}
            </div>
          )}
        </div>
      </header>

      {/* Backdrop for Mobile Menu */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
        />
      )}

      {/* Sidebar Navigation */}
      <aside 
        className={`w-64 bg-[#0E0E0E] border-r border-gold/10 flex flex-col p-6 gap-2 shrink-0 fixed inset-y-0 left-0 z-50 transition-transform duration-300 transform lg:translate-x-0 lg:relative lg:z-10 overflow-y-auto ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div 
          onClick={() => { navigate('/'); setMobileMenuOpen(false); }}
          className="text-gold font-bold text-2xl mb-6 tracking-wider font-serif cursor-pointer hover:opacity-90 transition lg:block hidden"
        >
          TaxiTrio
        </div>

        {/* Mobile Header inside drawer */}
        <div className="lg:hidden flex items-center justify-between border-b border-neutral-900 pb-4 mb-4">
          <span className="text-gold font-bold text-lg font-serif">Menu</span>
          <button onClick={() => setMobileMenuOpen(false)} className="text-[#A3A3A3] hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex flex-col gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to} to={l.to} end={l.end}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `px-3.5 py-2.5 rounded-xl text-[11px] font-semibold uppercase tracking-wider transition-all duration-200 flex items-center gap-3 ${
                  isActive ? 'bg-gold text-black font-bold shadow-md shadow-gold/25' : 'text-[#A3A3A3] hover:text-white hover:bg-neutral-900/40'
                }`
              }
            >
              {l.icon}
              <span>{t(l.labelKey)}</span>
            </NavLink>
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-4 border-t border-neutral-900 pt-5 shrink-0">
          <div className="flex items-center gap-3">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="avatar" className="w-9 h-9 rounded-full object-cover border border-gold/20" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-neutral-900 border border-gold/20 flex items-center justify-center text-[10px] text-gold font-bold uppercase">
                {user?.full_name?.charAt(0) || 'A'}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs text-white font-bold truncate">{user?.full_name}</p>
              <button 
                onClick={() => { logout(); navigate('/login'); }} 
                className="text-[10px] text-[#A3A3A3] hover:text-red-400 font-semibold transition mt-0.5 block uppercase tracking-wider"
              >
                Logout
              </button>
            </div>
          </div>
          <div className="lg:flex hidden justify-between items-center text-xs text-[#A3A3A3] border-t border-neutral-900/60 pt-3">
            <span className="uppercase tracking-widest font-semibold text-[10px]">Alerts</span>
            <NotificationBell />
          </div>
        </div>
      </aside>

      {/* Main content viewport */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full max-w-7xl mx-auto"><Outlet /></main>
    </div>
  );
}
