import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/axios';
import PageHeader from '../../components/PageHeader';
import GoldButton from '../../components/GoldButton';
import { MapPin, Flag } from 'lucide-react';

export default function CustomTripRequest() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    origin: '',
    destination: '',
    travel_date: '',
    travel_time: '',
    passengers: 1,
    special_requests: '',
    telegram_contact: '',
    is_urgent_requested: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/custom-trip-requests', form);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div className="flex items-center justify-center py-16 px-4">
      <div className="card max-w-md border border-gold/15 bg-[#121212] p-8 rounded-2xl flex flex-col items-center text-center gap-5 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="text-gold font-bold font-serif text-2xl mb-1">Request Submitted</p>
          <p className="text-[#A3A3A3] text-sm leading-relaxed font-light">
            Our concierge desk will review your bespoke itinerary and reply with pricing options and driver assignments.
          </p>
        </div>
        <div className="flex flex-col gap-3 w-full">
          <a 
            href="https://t.me/taxitrio_support" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full text-center px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 bg-[#D4AF37] hover:bg-[#BFA76A] text-black border border-transparent shadow-lg shadow-gold/10 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            💬 Chat with Support
          </a>
          <GoldButton onClick={() => navigate('/traveler')} className="w-full" variant="outline">
            Back to Dashboard
          </GoldButton>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      <PageHeader 
        title="Custom Trip Request" 
        subtitle="Design your bespoke transportation itinerary across Cambodia"
      />
      
      {error && (
        <p className="text-red-400 text-sm bg-red-950/20 border border-red-900/40 p-4 rounded-xl text-center">
          {error}
        </p>
      )}

      {/* Modern Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Enhanced Interactive Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 flex flex-col gap-8">
          
          {/* Section 1: Route details */}
          <div className="bg-[#121212] border border-gold/10 p-6 md:p-8 rounded-3xl flex flex-col gap-5 shadow-lg">
            <div className="flex items-center gap-3 border-b border-neutral-900 pb-3 mb-1">
              <span className="w-6 h-6 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold text-xs font-bold font-serif">1</span>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-serif">Route Planning</h3>
            </div>

            {/* Visual Route Connector Inputs */}
            <div className="flex flex-col gap-5 relative">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Origin Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-[14px] text-gold w-4 h-4" />
                  <input 
                    className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-gold/60 transition duration-300" 
                    placeholder="E.g., BKK1, Phnom Penh" 
                    required
                    value={form.origin} 
                    onChange={(e) => setForm({ ...form, origin: e.target.value })} 
                  />
                </div>
              </div>

              {/* Dotted separator visual line */}
              <div className="hidden sm:block absolute left-6 top-[52px] w-[1px] h-9 border-l border-dashed border-gold/30"></div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Destination Location</label>
                <div className="relative">
                  <Flag className="absolute left-4 top-[14px] text-gold w-4 h-4" />
                  <input 
                    className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-gold/60 transition duration-300" 
                    placeholder="E.g., Pub Street, Siem Reap" 
                    required
                    value={form.destination} 
                    onChange={(e) => setForm({ ...form, destination: e.target.value })} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Date, Time & Group */}
          <div className="bg-[#121212] border border-gold/10 p-6 md:p-8 rounded-3xl flex flex-col gap-5 shadow-lg">
            <div className="flex items-center gap-3 border-b border-neutral-900 pb-3 mb-1">
              <span className="w-6 h-6 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold text-xs font-bold font-serif">2</span>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-serif">Schedule & Capacity</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Travel Date</label>
                <input 
                  className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/60 transition duration-300" 
                  type="date" 
                  required
                  value={form.travel_date} 
                  onChange={(e) => setForm({ ...form, travel_date: e.target.value })} 
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Travel Time</label>
                <input 
                  className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/60 transition duration-300" 
                  type="time" 
                  required
                  value={form.travel_time} 
                  onChange={(e) => setForm({ ...form, travel_time: e.target.value })} 
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Passengers</label>
                <input 
                  className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/60 transition duration-300" 
                  type="number" 
                  min="1" 
                  placeholder="Count" 
                  required
                  value={form.passengers} 
                  onChange={(e) => setForm({ ...form, passengers: parseInt(e.target.value) || 1 })} 
                />
              </div>
            </div>

            {/* Urgent Priority Request */}
            <div className="flex items-center gap-3 bg-[#0B0B0B] border border-gold/5 p-4 rounded-xl mt-2 cursor-pointer" onClick={() => setForm(f => ({ ...f, is_urgent_requested: !f.is_urgent_requested }))}>
              <input 
                type="checkbox"
                checked={form.is_urgent_requested}
                onChange={() => {}} // handled by click parent container
                className="w-4 h-4 rounded border-gold/30 text-gold focus:ring-gold bg-[#121212] cursor-pointer"
              />
              <div className="flex flex-col gap-0.5 cursor-pointer">
                <span className="text-xs font-bold text-white uppercase tracking-wide">Request Urgent Review</span>
                <span className="text-[10px] text-neutral-400"> Concierge will prioritize providing quotes under 30 minutes.</span>
              </div>
            </div>
          </div>

          {/* Section 3: Notes & Contact */}
          <div className="bg-[#121212] border border-gold/10 p-6 md:p-8 rounded-3xl flex flex-col gap-5 shadow-lg">
            <div className="flex items-center gap-3 border-b border-neutral-900 pb-3 mb-1">
              <span className="w-6 h-6 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold text-xs font-bold font-serif">3</span>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-serif">Contact & Special Requests</h3>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Telegram Username / Phone Contact</label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-gold text-xs">💬</span>
                <input 
                  className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-gold/60 transition duration-300" 
                  placeholder="E.g., @myusername or +855..." 
                  required
                  value={form.telegram_contact} 
                  onChange={(e) => setForm({ ...form, telegram_contact: e.target.value })} 
                />
              </div>
              <p className="text-[9px] text-neutral-500">Allows our coordinator to directly send your quotation contract draft.</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Special Requests (Optional)</label>
              <textarea 
                className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/60 transition duration-300" 
                placeholder="Include vehicle choices (SUV/Van), customized multi-stop points, or layover duration preferences..." 
                rows={3}
                value={form.special_requests} 
                onChange={(e) => setForm({ ...form, special_requests: e.target.value })} 
              />
            </div>
          </div>

          <GoldButton type="submit" disabled={loading} className="w-full py-4 mt-2 font-serif text-sm tracking-wide shadow-lg shadow-gold/10">
            {loading ? 'Submitting Request...' : 'Submit Bespoke Itinerary'}
          </GoldButton>
        </form>

        {/* Right Side: Live Itinerary Preview Widget */}
        <div className="lg:col-span-5 sticky top-6 flex flex-col gap-6">
          <div className="bg-[#121212] border border-gold/15 p-6 rounded-3xl shadow-xl flex flex-col gap-6">
            <h3 className="text-xs uppercase font-black text-[#BFA76A] tracking-widest pb-3 border-b border-neutral-900">
              Live Itinerary Preview
            </h3>

            {/* Custom Trip Summary details */}
            <div className="flex flex-col gap-4 py-2">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] text-neutral-500 uppercase font-bold tracking-wider">Origin Departure</span>
                <span className="text-sm font-semibold text-white font-serif">{form.origin || 'Not specified'}</span>
              </div>
              
              <div className="flex items-center pl-1">
                <span className="text-[#D4AF37] text-xs">➔</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[9px] text-neutral-500 uppercase font-bold tracking-wider">Destination Arrival</span>
                <span className="text-sm font-semibold text-white font-serif">{form.destination || 'Not specified'}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-neutral-900/60 pt-4 mt-1">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-neutral-500 uppercase font-bold tracking-wider">Travel Date</span>
                  <span className="text-xs text-white font-medium">{form.travel_date || 'TBD'}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-neutral-500 uppercase font-bold tracking-wider">Departure Time</span>
                  <span className="text-xs text-white font-medium">{form.travel_time || 'TBD'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-neutral-900/60 pt-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-neutral-500 uppercase font-bold tracking-wider">Passengers</span>
                  <span className="text-xs text-white font-medium">{form.passengers} Passenger(s)</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-neutral-500 uppercase font-bold tracking-wider">Review Priority</span>
                  <span className={`text-xs font-bold uppercase tracking-wider ${form.is_urgent_requested ? 'text-rose-400 animate-pulse' : 'text-neutral-400'}`}>
                    {form.is_urgent_requested ? '🔴 Urgent Review' : '⚪ Standard'}
                  </span>
                </div>
              </div>

              {form.telegram_contact && (
                <div className="flex flex-col gap-1 border-t border-neutral-900/60 pt-4">
                  <span className="text-[9px] text-neutral-500 uppercase font-bold tracking-wider">Telegram Coordinator Handle</span>
                  <span className="text-xs text-gold font-medium">{form.telegram_contact}</span>
                </div>
              )}
            </div>
          </div>

          {/* Premium Concierge Perks Info */}
          <div className="bg-gold/5 border border-gold/15 p-6 rounded-3xl flex flex-col gap-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gold font-serif">Bespoke Concierge Perks</h4>
            <ul className="flex flex-col gap-2.5 text-xs text-neutral-400 font-light">
              <li className="flex items-start gap-2">
                <span className="text-gold">✔</span>
                <span>Fully custom stopovers & custom routing durations.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold">✔</span>
                <span>Select your vehicle class (VIP SUV, Van, Sedan).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold">✔</span>
                <span>Vetted English-speaking professional drivers.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold">✔</span>
                <span>Complimentary cold drinks, towels, & onboard Wi-Fi.</span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
