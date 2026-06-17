import { useState, useEffect } from 'react';
import { getAdminBookings } from '../../service/bookingService';
import PageHeader from '../../components/PageHeader';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = () => {
    getAdminBookings()
      .then((b) => setBookings(b.data.data))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const filteredBookings = bookings.filter((b) => 
    b.booking_type?.toLowerCase().includes(search.toLowerCase()) || 
    b.traveler_name?.toLowerCase().includes(search.toLowerCase()) ||
    b.traveler_phone?.toLowerCase().includes(search.toLowerCase()) ||
    b.pickup_location?.toLowerCase().includes(search.toLowerCase()) ||
    b.dropoff_location?.toLowerCase().includes(search.toLowerCase()) ||
    (b.driver_name && b.driver_name.toLowerCase().includes(search.toLowerCase())) ||
    b.status?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <PageHeader 
        title="Manage Bookings" 
        subtitle="Review, audit, and track passenger booking statuses across all service classes"
      >
        <div className="relative w-64 shrink-0">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-neutral-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gold/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            className="w-full bg-[#121212] border border-gold/15 text-white placeholder-neutral-500 rounded-full py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-gold/50 transition duration-300"
            placeholder="Search passengers, drivers, routes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </PageHeader>

      {loading ? (
        <div className="flex items-center gap-2 py-12 justify-center">
          <span className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin"></span>
          <p className="text-[#A3A3A3] text-sm uppercase tracking-wider">Loading system bookings...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <EmptyState 
          title="No bookings found" 
          message="No passenger bookings match your search query."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {filteredBookings.map((b) => (
            <div 
              key={b.id} 
              className="card border border-gold/15 bg-[#121212] p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-gold/30 transition duration-300 relative overflow-hidden"
            >
              <div className="absolute -right-24 -top-24 w-48 h-48 rounded-full bg-gold/5 blur-3xl"></div>
              
              <div className="flex flex-col gap-2 relative z-10">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gold text-lg font-serif capitalize">
                    {b.booking_type?.replace('_', ' ')}
                  </span>
                  <StatusBadge status={b.status === 'rejected' ? 'reassigning' : b.status} />
                </div>
                
                <p className="text-white text-sm font-semibold">
                  Passenger: {b.traveler_name} <span className="text-neutral-500 font-normal">· {b.traveler_phone}</span>
                </p>
                
                <p className="text-[#A3A3A3] text-xs font-light">
                  Route: {b.pickup_location} <span className="text-gold/50 mx-1">→</span> {b.dropoff_location}
                </p>

                {b.driver_name && (
                  <p className="text-xs text-white/95 mt-1 font-medium bg-gold/5 border border-gold/10 px-3 py-1 rounded-lg self-start">
                    Assigned Driver: <span className="text-gold font-bold">{b.driver_name}</span>
                  </p>
                )}
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 border-t border-neutral-900 sm:border-t-0 pt-4 sm:pt-0 z-10 shrink-0 self-end sm:self-auto w-full sm:w-auto">
                <span className="text-xl font-black text-white">${b.total_fare}</span>
                <p className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">
                  Booked: {new Date(b.created_at || b.createdAt || Date.now()).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
