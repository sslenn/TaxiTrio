import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBooking, estimateBookingFare } from '../../service/bookingService';
import MapPicker from '../../components/MapPicker';
import PageHeader from '../../components/PageHeader';
import GoldButton from '../../components/GoldButton';

export default function CityRideBooking() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ pickup_location: '', dropoff_location: '', pickup_time: '', notes: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Coordinates states
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropoffCoords, setDropoffCoords] = useState(null);
  const [routeDetails, setRouteDetails] = useState({ distance: 0, duration: 0, fare: 8 });
  const [calculating, setCalculating] = useState(false);

  const calculateHaversineFallback = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    const estDistance = R * c * 1.3;
    const estDuration = estDistance * 2.5;
    const calculatedFare = 1.5 + estDistance * 0.7;
    
    return {
      distance: estDistance,
      duration: estDuration,
      fare: parseFloat(Math.max(2.0, calculatedFare).toFixed(2))
    };
  };

  useEffect(() => {
    if (!pickupCoords || !dropoffCoords) return;

    const fetchRoute = async () => {
      setCalculating(true);
      setError('');
      try {
        const { data } = await estimateBookingFare({
          pickup_lat: pickupCoords.lat,
          pickup_lng: pickupCoords.lng,
          dropoff_lat: dropoffCoords.lat,
          dropoff_lng: dropoffCoords.lng,
          booking_type: 'city_ride',
          vehicle_type: 'sedan'
        });
        
        setRouteDetails({
          distance: data.data.distance_km,
          duration: data.data.duration_mins,
          fare: data.data.fare
        });
      } catch (err) {
        console.warn('Estimation API failed, using client-side haversine fallback:', err);
        const fallback = calculateHaversineFallback(
          pickupCoords.lat,
          pickupCoords.lng,
          dropoffCoords.lat,
          dropoffCoords.lng
        );
        setRouteDetails(fallback);
      } finally {
        setCalculating(false);
      }
    };

    fetchRoute();
  }, [pickupCoords, dropoffCoords]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await createBooking({
        ...form,
        booking_type: 'city_ride',
        pickup_lat: pickupCoords?.lat,
        pickup_lng: pickupCoords?.lng,
        dropoff_lat: dropoffCoords?.lat,
        dropoff_lng: dropoffCoords?.lng,
        total_fare: routeDetails.fare,
        distance_km: routeDetails.distance,
        duration_mins: routeDetails.duration
      });
      navigate(`/traveler/payment/${data.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="City Ride" 
        subtitle="Fast, reliable intra-city transportation in Cambodia"
      />

      {error && <p className="text-red-400 text-sm bg-red-950/20 border border-red-900/40 p-4 rounded-xl">{error}</p>}

      <div className="grid lg:grid-cols-5 gap-8 items-start">
        {/* Main Form (Col Span 3) */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <form onSubmit={handleSubmit} className="card border border-gold/15 bg-[#121212] p-6 flex flex-col gap-6 rounded-2xl shadow-xl">
            
            {/* Map Picker */}
            <div className="rounded-xl overflow-hidden border border-neutral-900">
              <MapPicker
                onSelectPickup={(addr, coords) => {
                  setForm((f) => ({ ...f, pickup_location: addr }));
                  setPickupCoords(coords);
                }}
                onSelectDropoff={(addr, coords) => {
                  setForm((f) => ({ ...f, dropoff_location: addr }));
                  setDropoffCoords(coords);
                }}
              />
            </div>
            
            {/* Route Pinning Inputs (Timeline Style) */}
            <div className="flex gap-4 relative">
              <div className="flex flex-col items-center py-2.5">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border border-emerald-400 flex-shrink-0 shadow-sm shadow-emerald-500/50"></span>
                <div className="w-[1.5px] flex-1 border-l-2 border-dashed border-neutral-800 my-1.5"></div>
                <span className="w-3.5 h-3.5 rounded-full bg-rose-500 border border-rose-400 flex-shrink-0 shadow-sm shadow-rose-500/50"></span>
              </div>

              <div className="flex-1 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Pickup Address</label>
                  <input 
                    className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/60 transition duration-300" 
                    placeholder="Set via map or enter address..." 
                    required
                    value={form.pickup_location} 
                    onChange={(e) => setForm({ ...form, pickup_location: e.target.value })} 
                  />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Dropoff Address</label>
                  <input 
                    className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/60 transition duration-300" 
                    placeholder="Set via map or enter address..." 
                    required
                    value={form.dropoff_location} 
                    onChange={(e) => setForm({ ...form, dropoff_location: e.target.value })} 
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Pickup Date & Time</label>
                <input 
                  className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/60 transition duration-300" 
                  type="datetime-local" 
                  required
                  value={form.pickup_time} 
                  onChange={(e) => setForm({ ...form, pickup_time: e.target.value })} 
                />
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Special Notes (Optional)</label>
                <textarea 
                  className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/60 transition duration-300" 
                  placeholder="Add ride instructions..." 
                  rows={1}
                  value={form.notes} 
                  onChange={(e) => setForm({ ...form, notes: e.target.value })} 
                />
              </div>
            </div>

            <GoldButton
              type="submit"
              disabled={loading || calculating}
              className="w-full py-3.5 mt-2"
            >
              {loading ? 'Booking...' : calculating ? 'Calculating Fare...' : 'Confirm Ride Booking'}
            </GoldButton>
          </form>
        </div>

        {/* Side Information Panel (Col Span 2) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="card border border-gold/15 bg-[#121212] p-6 rounded-2xl flex flex-col gap-5">
            <h3 className="font-bold text-gold uppercase tracking-wider text-xs border-b border-neutral-900 pb-3 font-serif">
              Ride Summary
            </h3>
            
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center bg-[#0B0B0B] p-4 rounded-xl border border-gold/10">
                <span className="text-[#A3A3A3] text-xs font-semibold uppercase tracking-wider">Estimated Fare</span>
                <span className="text-2xl font-black text-gold">
                  {calculating ? '...' : `$${routeDetails.fare.toFixed(2)}`}
                </span>
              </div>

              {routeDetails.distance > 0 && (
                <div className="grid grid-cols-2 gap-4 text-xs bg-[#0B0B0B]/40 p-4 rounded-xl border border-neutral-900 animate-fade-in">
                  <div>
                    <p className="text-neutral-500 uppercase font-semibold text-[10px] tracking-wider">Est. Distance</p>
                    <p className="text-white font-bold mt-1 text-base">{routeDetails.distance.toFixed(1)} km</p>
                  </div>
                  <div>
                    <p className="text-neutral-500 uppercase font-semibold text-[10px] tracking-wider">Est. Duration</p>
                    <p className="text-white font-bold mt-1 text-base">{Math.round(routeDetails.duration)} mins</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="text-[#A3A3A3] text-xs flex flex-col gap-3 pt-2">
              <div className="flex items-start gap-2.5">
                <span className="text-gold text-sm">✔</span>
                <p className="leading-relaxed font-light">Instant driver matching once payment is completed.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-gold text-sm">✔</span>
                <p className="leading-relaxed font-light">Premium dark map routing checks for precision locations.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-gold text-sm">✔</span>
                <p className="leading-relaxed font-light">Simulation pay allows risk-free testing of drivers accepting bookings.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
