import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { logout, getUser } from '../utils/auth';
import NotificationBell from '../components/NotificationBell';
import { useTranslation } from '../context/LanguageContext';

const links = [
  { to: '/driver', labelKey: 'dashboard', end: true },
  { to: '/driver/bookings', labelKey: 'bookings' },
  { to: '/driver/schedule', labelKey: 'schedule' },
  { to: '/driver/earnings', labelKey: 'earnings' },
  { to: '/driver/history', labelKey: 'history' },
  { to: '/driver/profile', labelKey: 'profile' },
];

export default function DriverLayout() {
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
              {user?.full_name?.charAt(0) || 'D'}
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
        className={`w-64 bg-[#0E0E0E] border-r border-gold/10 flex flex-col p-6 gap-3 shrink-0 fixed inset-y-0 left-0 z-50 transition-transform duration-300 transform lg:translate-x-0 lg:relative lg:z-10 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div 
          onClick={() => { navigate('/'); setMobileMenuOpen(false); }}
          className="text-gold font-bold text-2xl mb-8 tracking-wider font-serif cursor-pointer hover:opacity-90 transition lg:block hidden"
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

        <div className="flex flex-col gap-1.5">
          {links.map((l) => (
            <NavLink
              key={l.to} to={l.to} end={l.end}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                  isActive ? 'bg-gold text-black font-bold shadow-md shadow-gold/25' : 'text-[#A3A3A3] hover:text-white hover:bg-neutral-900/40'
                }`
              }
            >{t(l.labelKey)}</NavLink>
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-4 border-t border-neutral-900 pt-5">
          <div className="flex items-center gap-3">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="avatar" className="w-10 h-10 rounded-full object-cover border border-gold/20" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-neutral-900 border border-gold/20 flex items-center justify-center text-xs text-gold font-bold uppercase">
                {user?.full_name?.charAt(0) || 'D'}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs text-white font-bold truncate">{user?.full_name}</p>
              <button 
                onClick={() => { logout(); navigate('/login'); }} 
                className="text-[10px] text-[#A3A3A3] hover:text-red-400 font-semibold transition mt-0.5 block uppercase tracking-wider"
              >
                {t('logout')}
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
