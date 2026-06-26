import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getUser, logout } from '../utils/auth';
import { useTranslation } from '../context/LanguageContext';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleBookNow = () => {
    if (user && user.role === 'traveler') {
      navigate('/traveler/services');
    } else {
      navigate('/login?redirect=%2Ftraveler%2Fservices');
    }
  };

  const handleNavClick = (targetPath) => {
    if (user) {
      if (user.role === 'traveler') {
        navigate(targetPath);
      } else {
        navigate(user.role === 'admin' ? '/admin' : '/driver');
      }
    } else {
      navigate(`/login?redirect=${encodeURIComponent(targetPath)}`);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-350 ${
      scrolled 
        ? 'py-3 px-6 md:px-12 bg-[#050505]/95 shadow-[0_10px_40px_rgba(0,0,0,0.85)] border-b border-gold/25' 
        : 'py-5 px-6 md:px-12 bg-[#050505]/85 border-b border-gold/10'
    } backdrop-blur-md flex items-center justify-between`}>
      
      {/* Left logo */}
      <div 
        onClick={() => navigate('/')} 
        className="text-[#D4AF37] font-bold text-2xl tracking-wider cursor-pointer font-serif transition-all duration-300 hover:text-white hover:scale-[1.02] active:scale-[0.98]"
      >
        TaxiTrio
      </div>

      {/* Center navigation links */}
      <div className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-widest text-[#A3A3A3]">
        {[
          { path: '/traveler/book/city', label: t('cityRide') },
          { path: '/traveler/book/intercity', label: t('intercity') },
          { path: '/traveler/book/package', label: t('tours') },
          { path: '/traveler/custom-trip', label: t('customTrip') }
        ].map((item) => (
          <button 
            key={item.path}
            onClick={() => handleNavClick(item.path)} 
            className={`hover:text-[#D4AF37] transition-all duration-300 uppercase tracking-widest font-semibold bg-transparent border-none p-0 cursor-pointer relative pb-1 ${
              isActive(item.path) ? 'text-[#D4AF37]' : 'text-[#A3A3A3]'
            }`}
          >
            {item.label}
            {isActive(item.path) && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D4AF37] rounded-full shadow-[0_0_8px_#D4AF37] animate-fade-in" />
            )}
          </button>
        ))}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-4 text-[10px] md:text-xs">
        {user ? (
          <>
            <button 
              onClick={() => navigate(user.role === 'admin' ? '/admin' : user.role === 'driver' ? '/driver' : '/traveler')}
              className="text-[#D4AF37] border border-[#D4AF37]/30 hover:border-[#D4AF37] hover:bg-gold/5 px-4 md:px-5 py-2 rounded-full font-semibold transition-all duration-300 uppercase tracking-wider hover:scale-[1.03] active:scale-[0.97]"
            >
              {t('dashboard')}
            </button>
            <button 
              onClick={handleLogout}
              className="text-[#A3A3A3] hover:text-red-400 font-semibold transition-all duration-200 uppercase tracking-wider"
            >
              {t('logout')}
            </button>
          </>
        ) : (
          <>
            <button 
              onClick={() => navigate('/login')}
              className="text-[#FFFFFF] hover:text-[#D4AF37] px-3 py-2 font-semibold transition-all duration-200 uppercase tracking-wider"
            >
              {t('login')}
            </button>
            <button 
              onClick={handleBookNow}
              className="bg-[#D4AF37] hover:bg-[#BFA76A] hover:shadow-[#D4AF37]/20 text-black px-5 md:px-6 py-2.5 rounded-full font-bold transition-all duration-300 shadow-lg shadow-[#D4AF37]/10 uppercase tracking-wider hover:scale-[1.03] active:scale-[0.97]"
            >
              {t('bookNow')}
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
