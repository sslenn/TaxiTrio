import { Link, useNavigate } from 'react-router-dom';
import GoldButton from '../GoldButton';

export default function TourPublicHeader() {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#0A0A0A]/90 px-4 py-3 backdrop-blur-md md:px-5">
      <Link to="/" className="font-serif text-xl font-bold tracking-wider text-gold">
        TaxiTrio
      </Link>
      <nav className="flex items-center gap-2">
        <Link
          to="/tours"
          className="hidden rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 transition hover:text-white sm:inline-flex"
        >
          Tours
        </Link>
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 transition hover:text-white"
        >
          Sign In
        </button>
        <GoldButton onClick={() => navigate('/register')} className="px-4 py-2">
          Register
        </GoldButton>
      </nav>
    </header>
  );
}
