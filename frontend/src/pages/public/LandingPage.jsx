import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPackages } from '../../service/packageService';
import { getPublicVehicles } from '../../service/vehicleService';
import { getUser } from '../../utils/auth';

const VEHICLE_ICONS = {
  sedan: '🚗',
  suv: '🚙',
  van: '🚐',
  minibus: '🚌',
  bus: '🚎',
};

export default function LandingPage() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getUser();

  useEffect(() => {
    Promise.all([getPackages(), getPublicVehicles()])
      .then(([pkgsRes, vehsRes]) => {
        setPackages(pkgsRes.data.data.filter((p) => p.is_active));
        setVehicles(vehsRes.data.data.filter((v) => v.is_available));
      })
      .catch((err) => console.error('Failed to load public landing data:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleBookAction = (targetPath) => {
    if (user && user.role === 'traveler') {
      navigate(`/traveler${targetPath}`);
    } else {
      // Redirect to login if not authenticated or not traveler
      navigate(`/login?redirect=${encodeURIComponent(`/traveler${targetPath}`)}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-muted">
        <div className="flex flex-col items-center gap-3">
          <span className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin"></span>
          <p className="text-xs uppercase tracking-widest">Loading TaxiTrio Cambodia...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Navigation Header */}
      <header className="bg-card/80 border-b border-neutral-900 sticky top-0 z-50 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <span className="text-gold font-bold text-xl tracking-wider cursor-pointer" onClick={() => navigate('/')}>
          TaxiTrio
        </span>
        <div className="flex items-center gap-6 text-sm">
          <a href="#fleet" className="text-muted hover:text-white transition">Our Fleet</a>
          <a href="#packages" className="text-muted hover:text-white transition">Tours</a>
          {user ? (
            <button
              onClick={() => navigate(user.role === 'admin' ? '/admin' : user.role === 'driver' ? '/driver' : '/traveler')}
              className="btn-gold text-xs px-4 py-1.5"
            >
              Go to Dashboard
            </button>
          ) : (
            <button onClick={() => navigate('/login')} className="text-gold border border-gold/30 hover:border-gold px-4 py-1.5 rounded-lg text-xs font-semibold transition">
              Login / Sign Up
            </button>
          )}
        </div>
      </header>

      {/* Hero Banner */}
      <section className="relative py-20 px-6 text-center max-w-4xl mx-auto flex flex-col items-center gap-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[10px] uppercase font-bold tracking-widest text-gold">
          ✨ Premium Ride & Travel Platform
        </div>
        <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent leading-tight">
          Seamless Transportation Across Cambodia
        </h1>
        <p className="text-muted text-sm md:text-base max-w-xl">
          Book reliable local city rides, inter-province transfers, or customized travel packages with fully vetted professional drivers.
        </p>
        <div className="flex gap-3 justify-center mt-2">
          <button onClick={() => handleBookAction('/book/city')} className="btn-gold py-3 px-6 font-bold rounded-xl shadow-lg shadow-gold/10 hover:scale-[1.02] active:scale-[0.98] transition">
            Book City Ride
          </button>
          <button onClick={() => handleBookAction('/book/intercity')} className="border border-neutral-800 hover:border-neutral-700 bg-neutral-900/40 py-3 px-6 text-sm font-semibold rounded-xl transition">
            Intercity Transfer
          </button>
        </div>
      </section>

      {/* Fleet Showcase Section */}
      <section id="fleet" className="py-16 px-6 max-w-6xl mx-auto border-t border-neutral-900">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">Our Available Fleet</h2>
          <p className="text-muted text-xs mt-1">Select from our vetted vehicle listings ready for dispatch</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.length === 0 ? (
            <p className="text-muted text-center col-span-full py-8 text-xs">No active vehicles available at this moment.</p>
          ) : (
            vehicles.map((v) => (
              <div key={v.id} className="card border border-neutral-900 bg-neutral-900/30 p-5 rounded-2xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-neutral-900 flex items-center justify-center text-3xl border border-neutral-850">
                    {VEHICLE_ICONS[v.type?.toLowerCase()] || '🚗'}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm capitalize">{v.brand} {v.model}</h3>
                    <p className="text-neutral-500 text-[10px] uppercase font-bold tracking-wider mt-0.5">{v.type}</p>
                    <p className="text-muted text-xs mt-1">Capacity: <span className="text-white font-semibold">{v.capacity} persons</span></p>
                  </div>
                </div>
                <button
                  onClick={() => handleBookAction('/book/city')}
                  className="px-3.5 py-1.5 bg-neutral-850 hover:bg-gold hover:text-black rounded-xl text-xs font-semibold text-neutral-300 transition-all duration-200"
                >
                  Book
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Tour Packages Section */}
      <section id="packages" className="py-16 px-6 max-w-6xl mx-auto border-t border-neutral-900">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">Tour Packages</h2>
          <p className="text-muted text-xs mt-1">Preset multi-day travel packages with custom itineraries</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.length === 0 ? (
            <p className="text-muted text-center col-span-full py-8 text-xs">No active tour packages offered right now.</p>
          ) : (
            packages.map((p) => (
              <div key={p.id} className="card border border-neutral-900 bg-neutral-905 p-6 rounded-2xl flex flex-col justify-between gap-5 relative group hover:border-gold/30 transition duration-200">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gold text-lg truncate pr-2">{p.name}</h3>
                    <span className="text-sm font-black text-white bg-neutral-900 px-2.5 py-1 rounded-lg border border-neutral-800">${p.price}</span>
                  </div>
                  <p className="text-muted text-xs leading-relaxed mt-1 line-clamp-3">{p.description}</p>
                </div>
                
                <div className="border-t border-neutral-900/60 pt-3 flex items-center justify-between text-xs text-neutral-400">
                  <span className="flex items-center gap-1">⏱ {p.duration_days} Day(s)</span>
                  <span className="flex items-center gap-1">👥 Max {p.max_persons} Persons</span>
                </div>

                <button
                  onClick={() => handleBookAction('/book/package')}
                  className="btn-gold w-full py-2.5 rounded-xl font-bold text-xs mt-2"
                >
                  Book Tour Package
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-neutral-900 py-8 text-center text-neutral-600 text-xs">
        <p>© 2026 TaxiTrio Cambodia. All rights reserved.</p>
      </footer>
    </div>
  );
}
