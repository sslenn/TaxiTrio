import { useState, useEffect } from 'react';
import { getTripHistory } from '../../service/driverService';
import PageHeader from '../../components/PageHeader';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';

export default function TripHistory() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    getTripHistory()
      .then((r) => setTrips(r.data.data))
      .finally(() => setLoading(false)); 
  }, []);

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <PageHeader 
        title="Trip History" 
        subtitle="Review your completed dispatches and passengers history log"
      />

      {loading ? (
        <div className="flex items-center gap-2 py-12 justify-center">
          <span className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin"></span>
          <p className="text-[#A3A3A3] text-sm uppercase tracking-wider">Loading history...</p>
        </div>
      ) : trips.length === 0 ? (
        <EmptyState 
          title="No Past Trips" 
          message="Your trip ledger is currently empty."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {trips.map((t) => (
            <div 
              key={t.id} 
              className="card border border-gold/15 bg-[#121212] p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-gold/30 transition duration-300 relative overflow-hidden"
            >
              <div className="flex flex-col gap-2 relative z-10">
                <span className="font-bold text-gold text-lg font-serif capitalize">
                  {t.booking_type?.replace('_', ' ')}
                </span>
                
                <p className="text-white font-medium text-sm">
                  Passenger: {t.traveler_name}
                </p>
                
                <p className="text-[#A3A3A3] text-xs font-light">
                  Route: {t.pickup_location} <span className="text-gold/50 mx-1">→</span> {t.dropoff_location}
                </p>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 border-t border-neutral-900 sm:border-t-0 pt-4 sm:pt-0 z-10 shrink-0 self-end sm:self-auto w-full sm:w-auto">
                <span className="text-xl font-black text-white">${t.total_fare}</span>
                <StatusBadge status={t.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
