import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRoutes } from '../../service/routeService';
import { createBooking } from '../../service/bookingService';
import MapPicker from '../../components/MapPicker';
import PageHeader from '../../components/PageHeader';
import GoldButton from '../../components/GoldButton';

export default function IntercityBooking() {
  const navigate = useNavigate();
  const [routes, setRoutes] = useState([]);
  const [form, setForm] = useState({ route_id: '', pickup_location: '', dropoff_location: '', pickup_time: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getRoutes().then((r) => setRoutes(r.data.data)).catch(() => {});
  }, []);

  const selectedRoute = routes.find((r) => r.id === form.route_id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await createBooking({
        ...form,
        booking_type: 'intercity',
        total_fare: selectedRoute?.base_price || 0,
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
        title="Intercity Transfer" 
        subtitle="Comfortable intercity transit across Cambodia's key cities"
      />

      {error && <p className="text-red-400 text-sm bg-red-950/20 border border-red-900/40 p-4 rounded-xl">{error}</p>}

      <div className="grid lg:grid-cols-5 gap-8 items-start">
        {/* Main Form (Col Span 3) */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <form onSubmit={handleSubmit} className="card border border-gold/15 bg-[#121212] p-6 flex flex-col gap-6 rounded-2xl shadow-xl">
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Select Transit Route</label>
              <select 
                className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/60 transition duration-300" 
                required 
                value={form.route_id}
                onChange={(e) => setForm({ ...form, route_id: e.target.value })}
              >
                <option value="">Select a city route...</option>
                {routes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.origin} → {r.destination} (${r.base_price})
                  </option>
                ))}
              </select>
            </div>

            {/* Map Picker */}
            <div className="rounded-xl overflow-hidden border border-neutral-900">
              <MapPicker
                onSelectPickup={(addr) => setForm((f) => ({ ...f, pickup_location: addr }))}
                onSelectDropoff={(addr) => setForm((f) => ({ ...f, dropoff_location: addr }))}
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
                  <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Pickup Location Details</label>
                  <input 
                    className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/60 transition duration-300" 
                    placeholder="Set via map or enter address..." 
                    required
                    value={form.pickup_location} 
                    onChange={(e) => setForm({ ...form, pickup_location: e.target.value })} 
                  />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Dropoff Location Details</label>
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

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Schedule Date & Time</label>
              <input 
                className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/60 transition duration-300" 
                type="datetime-local" 
                required
                value={form.pickup_time} 
                onChange={(e) => setForm({ ...form, pickup_time: e.target.value })} 
              />
            </div>

            <GoldButton
              type="submit"
              disabled={loading || !form.route_id}
              className="w-full py-3.5 mt-2"
            >
              {loading ? 'Booking...' : 'Confirm Intercity Booking'}
            </GoldButton>
          </form>
        </div>

        {/* Side Information Panel (Col Span 2) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="card border border-gold/15 bg-[#121212] p-6 rounded-2xl flex flex-col gap-5">
            <h3 className="font-bold text-gold uppercase tracking-wider text-xs border-b border-neutral-900 pb-3 font-serif">
              Route Details
            </h3>
            {selectedRoute ? (
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center bg-[#0B0B0B] p-4 rounded-xl border border-gold/10">
                  <span className="text-[#A3A3A3] text-xs font-semibold uppercase tracking-wider">Base Fare</span>
                  <span className="text-2xl font-black text-gold">${selectedRoute.base_price}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs bg-[#0B0B0B]/40 p-4 rounded-xl border border-neutral-900">
                  <div>
                    <p className="text-neutral-500 uppercase font-semibold text-[10px] tracking-wider">Distance</p>
                    <p className="text-white font-bold mt-1 text-base">{selectedRoute.distance_km} km</p>
                  </div>
                  <div>
                    <p className="text-neutral-500 uppercase font-semibold text-[10px] tracking-wider">Est. Duration</p>
                    <p className="text-white font-bold mt-1 text-base">{selectedRoute.duration_hrs} hours</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 border border-dashed border-neutral-800 rounded-xl">
                <p className="text-neutral-500 text-xs">Please select a transit route to view pricing & distance metrics.</p>
              </div>
            )}
            
            <div className="text-[#A3A3A3] text-xs flex flex-col gap-3 pt-2">
              <div className="flex items-start gap-2.5">
                <span className="text-gold text-sm">✔</span>
                <p className="leading-relaxed font-light">Safe inter-province travel with certified vehicles.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-gold text-sm">✔</span>
                <p className="leading-relaxed font-light">Professional drivers assigned automatically.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-gold text-sm">✔</span>
                <p className="leading-relaxed font-light">Full-coverage travel assistance support included.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
