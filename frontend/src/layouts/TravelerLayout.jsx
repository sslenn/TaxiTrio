import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { logout, getUser } from '../utils/auth';
import NotificationBell from '../components/NotificationBell';
import { useTranslation } from '../context/LanguageContext';

const links = [
  { to: '/traveler', labelKey: 'dashboard', end: true },
  { to: '/traveler/services', labelKey: 'services' },
  { to: '/traveler/bookings', labelKey: 'bookings' },
  { to: '/traveler/custom-trip', labelKey: 'customTrip' },
  { to: '/traveler/profile', labelKey: 'profile' },
];

export default function TravelerLayout() {
  const navigate = useNavigate();
  const user = getUser();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0B0B] text-white">
      <nav className="bg-[#0B0B0B] border-b border-gold/10 px-6 py-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
        <span 
          onClick={() => navigate('/')}
          className="text-gold font-bold text-xl tracking-wider font-serif cursor-pointer hover:opacity-90 transition"
        >
          TaxiTrio
        </span>
        <div className="flex gap-2 md:gap-4 items-center text-xs">
          <div className="hidden md:flex gap-1 items-center">
            {links.map((l) => (
              <NavLink
                key={l.to} to={l.to} end={l.end}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full font-medium transition duration-200 uppercase tracking-wider ${
                    isActive ? 'bg-gold text-black font-semibold' : 'text-[#A3A3A3] hover:text-white'
                  }`
                }
              >{t(l.labelKey)}</NavLink>
            ))}
          </div>
          
          <div className="flex items-center gap-4 border-l border-neutral-800 pl-4">
            <NotificationBell />
            <div className="flex items-center gap-2">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="avatar" className="w-8 h-8 rounded-full object-cover border border-gold/20" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-neutral-900 border border-gold/20 flex items-center justify-center text-[10px] text-gold font-bold uppercase">
                  {user?.full_name?.charAt(0) || 'U'}
                </div>
              )}
              <span className="text-[#A3A3A3] font-medium hidden sm:inline">{user?.full_name}</span>
            </div>
            <button 
              onClick={() => { logout(); navigate('/login'); }} 
              className="text-[#A3A3A3] hover:text-red-400 font-semibold transition uppercase tracking-wider text-[10px] ml-1"
            >
              {t('logout')}
            </button>
          </div>
        </div>
      </nav>
      
      {/* Mobile nav for smaller screens */}
      <div className="md:hidden flex justify-around bg-[#0E0E0E] border-b border-gold/10 px-4 py-2.5 text-[10px] uppercase tracking-widest text-[#A3A3A3]">
        {links.map((l) => (
          <NavLink
            key={l.to} to={l.to} end={l.end}
            className={({ isActive }) =>
              isActive ? 'text-gold font-bold' : 'hover:text-white'
            }
          >{t(l.labelKey)}</NavLink>
        ))}
      </div>

      <main className="flex-1 p-6 md:p-8 max-w-6xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
}
