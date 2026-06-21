import { useNavigate } from 'react-router-dom';
import { getUser, logout } from '../utils/auth';
import { useTranslation } from '../context/LanguageContext';

export default function Navbar() {
  const navigate = useNavigate();
  const user = getUser();
  const { t } = useTranslation();

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

  return (
    <nav className="w-full py-4 px-6 md:px-12 flex items-center justify-between border-b border-gold/10 bg-[#0B0B0B]/80 backdrop-blur-md sticky top-0 z-50">
      {/* Left logo */}
      <div 
        onClick={() => navigate('/')} 
        className="text-[#D4AF37] font-bold text-2xl tracking-wider cursor-pointer font-serif transition hover:opacity-95"
      >
        TaxiTrio
      </div>

      {/* Center navigation links */}
      <div className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-widest text-[#A3A3A3]">
        <button 
          onClick={() => handleNavClick('/traveler/book/city')} 
          className="hover:text-[#D4AF37] transition duration-200 uppercase tracking-widest font-semibold bg-transparent border-none p-0 cursor-pointer text-[#A3A3A3]"
        >
          {t('cityRide')}
        </button>
        <button 
          onClick={() => handleNavClick('/traveler/book/intercity')} 
          className="hover:text-[#D4AF37] transition duration-200 uppercase tracking-widest font-semibold bg-transparent border-none p-0 cursor-pointer text-[#A3A3A3]"
        >
          {t('intercity')}
        </button>
        <button 
          onClick={() => handleNavClick('/traveler/book/package')} 
          className="hover:text-[#D4AF37] transition duration-200 uppercase tracking-widest font-semibold bg-transparent border-none p-0 cursor-pointer text-[#A3A3A3]"
        >
          {t('tours')}
        </button>
        <button 
          onClick={() => handleNavClick('/traveler/custom-trip')} 
          className="hover:text-[#D4AF37] transition duration-200 uppercase tracking-widest font-semibold bg-transparent border-none p-0 cursor-pointer text-[#A3A3A3]"
        >
          {t('customTrip')}
        </button>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-4 text-[10px] md:text-xs">
        {user ? (
          <>
            <button 
              onClick={() => navigate(user.role === 'admin' ? '/admin' : user.role === 'driver' ? '/driver' : '/traveler')}
              className="text-[#D4AF37] border border-[#D4AF37]/30 hover:border-[#D4AF37] px-4 md:px-5 py-2 rounded-full font-semibold transition duration-200 uppercase tracking-wider"
            >
              {t('dashboard')}
            </button>
            <button 
              onClick={handleLogout}
              className="text-[#A3A3A3] hover:text-red-400 font-semibold transition duration-200 uppercase tracking-wider"
            >
              {t('logout')}
            </button>
          </>
        ) : (
          <>
            <button 
              onClick={() => navigate('/login')}
              className="text-[#FFFFFF] hover:text-[#D4AF37] px-3 py-2 font-semibold transition duration-200 uppercase tracking-wider"
            >
              {t('login')}
            </button>
            <button 
              onClick={handleBookNow}
              className="bg-[#D4AF37] hover:bg-[#BFA76A] text-black px-5 md:px-6 py-2.5 rounded-full font-bold transition duration-200 shadow-lg shadow-[#D4AF37]/10 uppercase tracking-wider"
            >
              {t('bookNow')}
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
