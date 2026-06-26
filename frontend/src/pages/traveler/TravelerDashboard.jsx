import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../../utils/auth';
import { getPackages } from '../../service/packageService';
import { getMyBookings } from '../../service/bookingService';
import PageHeader from '../../components/PageHeader';
import { Clock, Users } from 'lucide-react';
import StatCard from '../../components/StatCard';
import GoldButton from '../../components/GoldButton';

const actions = [
  { label: 'City Ride', to: '/traveler/book/city', desc: 'Book a ride within the city', img: '/images/city_ride.jpg' },
  { label: 'Intercity Transfer', to: '/traveler/book/intercity', desc: 'Travel between cities', img: '/images/intercity_transfer.jpg' },
  { label: 'Tour Package', to: '/traveler/book/package', desc: 'Curated travel packages', img: '/images/tour_package.jpg' },
  { label: 'Custom Trip', to: '/traveler/custom-trip', desc: 'Request a custom journey', img: '/images/custom_trip.jpg' },
];


export default function TravelerDashboard() {
  const navigate = useNavigate();
  const user = getUser();
  const [packages, setPackages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getPackages(), getMyBookings()])
      .then(([pkgsRes, bookingsRes]) => {
        setPackages(pkgsRes.data?.data?.filter((p) => p.is_active) || []);
        setBookings(bookingsRes.data?.data || []);
      })
      .catch((err) => console.error('Failed to load dashboard data:', err))
      .finally(() => setLoading(false));
  }, []);

  const totalBookings = bookings.length;
  const pendingPayment = bookings.filter((b) => b.status === 'pending_payment').length;
  const completedTrips = bookings.filter((b) => b.status === 'completed').length;
  const totalSpent = bookings
    .filter((b) => b.status === 'completed')
    .reduce((sum, b) => sum + Number(b.total_fare || 0), 0);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader 
        title={`Welcome, ${user?.full_name || 'Traveler'}`} 
        subtitle="Where would you like to go today?"
      >
        <GoldButton onClick={() => navigate('/traveler/bookings')} variant="outline">
          View My Bookings
        </GoldButton>
      </PageHeader>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Total Bookings" 
          value={totalBookings}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.129-1.125v-3.75c0-.621-.504-1.125-1.125-1.125H3.375M16.5 4.5h3" />
            </svg>
          }
        />
        <StatCard 
          label="Pending Payment" 
          value={pendingPayment}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 8.5h19M2.5 12.5h19M2.5 16.5h19" />
            </svg>
          }
        />
        <StatCard 
          label="Completed Trips" 
          value={completedTrips}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard 
          label="Total Spent" 
          value={`$${totalSpent.toFixed(2)}`}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.22.11a3 3 0 003.56 0l.22-.11m-3-6.364l.22-.11a3 3 0 003.56 0l.22.11M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          }
        />
      </div>

      {/* Booking Quick Actions */}
      <div>
        <h3 className="text-xl font-bold mb-4 text-white font-serif">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {actions.map((a) => (
            <button
              key={a.to}
              onClick={() => navigate(a.to)}
              className="card text-left bg-[#121212] border border-gold/15 rounded-2xl hover:border-gold/60 transition group cursor-pointer overflow-hidden flex flex-col gap-0"
            >
              <div className="h-28 w-full overflow-hidden relative">
                <img 
                  src={a.img} 
                  alt={a.label} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent"></div>
              </div>
              <div className="p-5 flex flex-col gap-1">
                <p className="text-gold font-bold uppercase tracking-wider text-[10px] group-hover:underline">{a.label}</p>
                <p className="text-[#A3A3A3] text-[11px] font-light leading-relaxed mt-0.5">{a.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Available Packages Section */}
      <div>
        <h3 className="text-xl font-bold mb-4 text-white font-serif">Available Tour Packages</h3>
        {loading ? (
          <div className="flex items-center gap-2 py-4">
            <span className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin"></span>
            <p className="text-[#A3A3A3] text-xs uppercase tracking-wider">Loading packages...</p>
          </div>
        ) : packages.length === 0 ? (
          <p className="text-[#A3A3A3] text-xs">No active tour packages offered right now.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.slice(0, 3).map((p) => (
              <div key={p.id} className="card border border-gold/15 bg-[#121212] p-6 rounded-2xl flex flex-col justify-between gap-5 relative group hover:border-gold/50 transition duration-300">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-gold text-base truncate pr-2">{p.name}</h4>
                    <span className="text-xs font-black text-white bg-[#0B0B0B] px-2.5 py-1 rounded-lg border border-gold/10">${Number(p.price).toFixed(2)}</span>
                  </div>
                  <p className="text-[#A3A3A3] text-xs leading-relaxed mt-1 line-clamp-3 font-light">{p.description}</p>
                </div>
                
                <div className="border-t border-neutral-900 pt-3 flex items-center justify-between text-[11px] text-neutral-400">
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-gold" /> {p.duration_days} Day(s)</span>
                  <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-gold" /> Max {p.max_persons} Persons</span>
                </div>

                <GoldButton
                  onClick={() => navigate(`/traveler/packages/${p.id}`)}
                  className="w-full text-center"
                >
                  View Details
                </GoldButton>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
