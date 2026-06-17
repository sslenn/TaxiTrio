import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPackages } from '../../service/packageService';
import PageHeader from '../../components/PageHeader';
import GoldButton from '../../components/GoldButton';

export default function PackageBooking() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    getPackages()
      .then((r) => {
        setPackages(r.data.data);
      })
      .catch((err) => {
        console.error('Failed to load packages:', err);
        setError('Failed to load tour packages. Please try again later.');
      })
      .finally(() => setLoading(false));
  }, []);

  const getPackageImage = (name = '') => {
    const key = name.toLowerCase();
    if (key.includes('angkor')) return '/images/tour_package.jpg';
    if (key.includes('kampot')) return '/images/intercity_transfer.jpg';
    if (key.includes('kep')) return '/images/city_ride.jpg';
    if (key.includes('phnom penh') || key.includes('heritage')) return '/images/custom_trip.jpg';
    return '/images/tour_package.jpg';
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <PageHeader 
        title="Tour Packages" 
        subtitle="Explore curated routes and historical attractions across Cambodia"
      />

      {error && (
        <p className="text-red-400 text-sm bg-red-950/20 border border-red-900/40 p-4 rounded-xl text-center">
          {error}
        </p>
      )}

      {loading ? (
        <div className="flex flex-col items-center gap-3 py-16 justify-center">
          <span className="w-8 h-8 border-3 border-gold border-t-transparent rounded-full animate-spin"></span>
          <p className="text-[#A3A3A3] text-xs uppercase tracking-wider">Loading packages...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {packages.map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`/traveler/packages/${p.id}`)}
              className="card border border-gold/15 bg-[#121212] rounded-2xl flex flex-col justify-between hover:border-gold/40 transition duration-300 relative overflow-hidden group gap-0 cursor-pointer shadow-lg hover:shadow-gold/5"
            >
              {/* Image Section */}
              <div className="h-48 w-full overflow-hidden relative">
                <img 
                  src={getPackageImage(p.name)} 
                  alt={p.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent"></div>
              </div>

              {/* Package Content */}
              <div className="p-6 md:p-8 flex flex-col gap-6 flex-1 justify-between relative z-10">
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-xl font-bold text-gold font-serif">{p.name}</h3>
                    <span className="text-white font-bold text-lg font-serif shrink-0">${p.price}</span>
                  </div>
                  <p className="text-[#A3A3A3] text-xs md:text-sm leading-relaxed font-light line-clamp-3">
                    {p.description}
                  </p>
                </div>

                <div className="flex flex-col gap-4 border-t border-neutral-900/60 pt-4">
                  {/* Meta stats */}
                  <div className="flex justify-between items-center text-[10px] text-neutral-400 uppercase tracking-widest font-semibold">
                    <span>⏱ {p.duration_days} day(s)</span>
                    <span>👥 up to {p.max_persons} persons</span>
                  </div>

                  <GoldButton 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/traveler/packages/${p.id}`);
                    }} 
                    className="w-full"
                  >
                    View Details & Book
                  </GoldButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
