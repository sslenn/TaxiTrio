import { useState, useEffect } from 'react';
import { getDriverBookings, acceptBooking, rejectBooking, updateTripStatus } from '../../service/driverService';
import PageHeader from '../../components/PageHeader';
import StatusBadge from '../../components/StatusBadge';
import GoldButton from '../../components/GoldButton';
import EmptyState from '../../components/EmptyState';

const NEXT_STATUS = {
  accepted: 'en_route',
  en_route: 'arrived',
  arrived: 'in_progress',
  in_progress: 'completed',
};

export default function AssignedBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => getDriverBookings().then((r) => setBookings(r.data.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const act = async (fn) => { 
    try { 
      await fn(); 
      load(); 
    } catch (err) { 
      alert(err.response?.data?.message || 'Error'); 
    } 
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <PageHeader 
        title="Assigned Bookings" 
        subtitle="Manage active passenger requests and update live journey progress"
      />

      {loading ? (
        <div className="flex items-center gap-2 py-12 justify-center">
          <span className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin"></span>
          <p className="text-[#A3A3A3] text-sm uppercase tracking-wider">Loading assignments...</p>
        </div>
      ) : bookings.length === 0 ? (
        <EmptyState 
          title="No Active Assignments" 
          message="You are fully caught up. Vetted bookings assigned to you will show up here."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {bookings.map((b) => (
            <div 
              key={b.id} 
              className="card border border-gold/15 bg-[#121212] p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-gold/30 transition duration-300 relative overflow-hidden"
            >
              <div className="flex flex-col gap-2 relative z-10">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gold text-lg font-serif capitalize">
                    {b.notes?.startsWith('[Custom Trip]') || b.notes?.includes('Custom Trip Request') || b.notes?.includes('Bespoke Custom')
                      ? 'custom trip'
                      : b.booking_type?.replace('_', ' ')}
                  </span>
                  <StatusBadge status={b.status} />
                </div>
                
                <p className="text-white font-medium text-sm">
                  Passenger: {b.traveler_name} <span className="text-neutral-500 font-normal">· {b.traveler_phone}</span>
                </p>
                
                <p className="text-[#A3A3A3] text-xs font-light">
                  Route: {b.pickup_location} <span className="text-gold/50 mx-1">→</span> {b.dropoff_location}
                </p>
              </div>

              <div className="flex items-center gap-4 relative z-10 shrink-0 self-end md:self-auto border-t border-neutral-900 md:border-t-0 pt-4 md:pt-0 w-full md:w-auto justify-end">
                {b.status === 'driver_assigned' && (
                  <div className="flex items-center gap-3">
                    <GoldButton 
                      onClick={() => act(() => acceptBooking(b.id))}
                      className="px-4 py-1.5 text-[10px]"
                    >
                      Accept
                    </GoldButton>
                    <button 
                      onClick={() => act(() => rejectBooking(b.id))} 
                      className="text-xs text-rose-500 hover:text-rose-450 uppercase font-bold tracking-wider transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                )}
                
                {NEXT_STATUS[b.status] && (
                  <GoldButton 
                    onClick={() => act(() => updateTripStatus(b.id, NEXT_STATUS[b.status]))}
                    className="px-4 py-2"
                  >
                    → {NEXT_STATUS[b.status].replace(/_/g, ' ')}
                  </GoldButton>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
