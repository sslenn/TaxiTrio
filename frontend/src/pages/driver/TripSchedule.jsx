import { useState, useEffect } from 'react';
import { getDriverBookings } from '../../service/driverService';
import PageHeader from '../../components/PageHeader';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';

export default function TripSchedule() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    getDriverBookings()
      .then((r) => setBookings(r.data.data))
      .finally(() => setLoading(false)); 
  }, []);

  const upcoming = bookings
    .filter((b) => b.pickup_time)
    .sort((a, b) => new Date(a.pickup_time) - new Date(b.pickup_time));

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <PageHeader 
        title="Trip Schedule" 
        subtitle="Chronological list of your upcoming scheduled dispatches"
      />

      {loading ? (
        <div className="flex items-center gap-2 py-12 justify-center">
          <span className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin"></span>
          <p className="text-[#A3A3A3] text-sm uppercase tracking-wider">Loading schedules...</p>
        </div>
      ) : upcoming.length === 0 ? (
        <EmptyState 
          title="No Upcoming dispatches" 
          message="Your agenda is currently open. Vetted future bookings will show up here."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {upcoming.map((b) => (
            <div 
              key={b.id} 
              className="card border border-gold/15 bg-[#121212] p-6 rounded-2xl flex flex-col justify-between gap-4 hover:border-gold/30 transition duration-300 relative overflow-hidden"
            >
              <div className="absolute -right-24 -top-24 w-48 h-48 rounded-full bg-gold/5 blur-3xl"></div>
              
              <div className="flex justify-between items-start gap-4 flex-wrap z-10">
                <div>
                  <p className="text-gold font-bold text-base font-serif">
                    ⏱ {new Date(b.pickup_time).toLocaleString()}
                  </p>
                  <p className="text-white mt-2 font-medium text-sm">
                    Route: {b.pickup_location} <span className="text-gold/50 mx-1">→</span> {b.dropoff_location}
                  </p>
                  <p className="text-[#A3A3A3] text-xs font-light mt-1">
                    Passenger: {b.traveler_name} · {b.traveler_phone}
                  </p>
                </div>
                
                <StatusBadge status={b.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
