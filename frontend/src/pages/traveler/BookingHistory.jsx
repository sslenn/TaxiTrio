import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyBookings, getMyCustomRequests, confirmCustomRequest, markRequestUrgent, cancelBooking } from '../../service/bookingService';
import PageHeader from '../../components/PageHeader';
import StatusBadge from '../../components/StatusBadge';
import GoldButton from '../../components/GoldButton';
import EmptyState from '../../components/EmptyState';
import MapPicker from '../../components/MapPicker';

export default function BookingHistory() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [customRequests, setCustomRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmFormState, setConfirmFormState] = useState({});
  const [editingCustom, setEditingCustom] = useState({});

  const load = () => {
    setLoading(true);
    Promise.all([getMyBookings(), getMyCustomRequests()])
      .then(([bookingsRes, customRes]) => {
        setBookings(bookingsRes.data.data);
        setCustomRequests(customRes.data.data);
      })
      .catch((err) => console.error('Failed to load history:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const getFormState = (id, req) => {
    if (!confirmFormState[id]) {
      return {
        origin: req.origin || '',
        destination: req.destination || '',
        travel_date: req.travel_date || '',
        travel_time: req.travel_time || '',
        telegram: req.telegram_contact || '',
        notes: req.traveler_response || ''
      };
    }
    return confirmFormState[id];
  };

  const updateFormState = (id, field, value) => {
    setConfirmFormState((prev) => ({
      ...prev,
      [id]: {
        ...getFormState(id, customRequests.find((r) => r.id === id)),
        [field]: value
      }
    }));
  };

  const handleSelectPickup = (id, address) => {
    updateFormState(id, 'origin', address);
  };

  const handleSelectDropoff = (id, address) => {
    updateFormState(id, 'destination', address);
  };

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    try { 
      await cancelBooking(id); 
      load(); 
    } catch (err) { 
      alert(err.response?.data?.message || 'Cancel failed'); 
    }
  };

  const handleConfirm = async (id) => {
    const fState = getFormState(id, customRequests.find((r) => r.id === id));
    if (!fState.telegram) {
      alert('Please enter your Telegram handle.');
      return;
    }
    if (!fState.origin || !fState.destination) {
      alert('Please provide pickup and dropoff locations.');
      return;
    }
    if (!fState.travel_date) {
      alert('Please select a travel date.');
      return;
    }
    if (!fState.travel_time) {
      alert('Please select a travel time.');
      return;
    }
    try {
      const res = await confirmCustomRequest(id, {
        telegram_contact: fState.telegram,
        traveler_response: fState.notes,
        origin: fState.origin,
        destination: fState.destination,
        travel_date: fState.travel_date,
        travel_time: fState.travel_time
      });
      const bookingId = res.data?.data?.bookingId;
      const sessionUrl = res.data?.data?.sessionUrl;
      if (bookingId) {
        alert('Details saved! Redirecting to payment options...');
        navigate(`/traveler/payment/${bookingId}`);
      } else if (sessionUrl) {
        alert('Details saved! Redirecting to Stripe checkout to complete payment...');
        window.location.href = sessionUrl;
      } else {
        alert('Details saved successfully!');
        setEditingCustom((prev) => ({ ...prev, [id]: false }));
        load();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Confirmation failed');
    }
  };

  const handleUrgent = async (id) => {
    try {
      await markRequestUrgent(id);
      alert('Urgent assistance request sent! The administrator has been notified immediately via high-priority Telegram alert and system dashboard notification.');
    } catch (err) {
      alert(err.response?.data?.message || 'Support request failed');
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <PageHeader 
        title="My Bookings" 
        subtitle="Manage and track your active and past Cambodian travels"
      />

      {/* Tabs */}
      <div className="flex border-b border-neutral-900/60 gap-6">
        <button 
          onClick={() => setActiveTab('bookings')}
          className={`pb-3 text-xs font-bold uppercase tracking-widest transition-all duration-300 relative ${
            activeTab === 'bookings' ? 'text-gold' : 'text-neutral-500 hover:text-white'
          }`}
        >
          Standard Trips
          {activeTab === 'bookings' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gold rounded-full"></span>}
        </button>
        <button 
          onClick={() => setActiveTab('custom')}
          className={`pb-3 text-xs font-bold uppercase tracking-widest transition-all duration-300 relative ${
            activeTab === 'custom' ? 'text-gold' : 'text-neutral-500 hover:text-white'
          }`}
        >
          Custom Journeys
          {activeTab === 'custom' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gold rounded-full"></span>}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 py-12 justify-center">
          <span className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin"></span>
          <p className="text-[#A3A3A3] text-sm uppercase tracking-wider">Loading history...</p>
        </div>
      ) : activeTab === 'bookings' ? (
        bookings.length === 0 ? (
          <EmptyState 
            title="No bookings yet" 
            message="You haven't requested any trips yet. Ready to experience premium Cambodian transit?"
            action={
              <GoldButton onClick={() => navigate('/traveler/services')}>
                Book Your First Ride
              </GoldButton>
            }
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
                        : b.booking_type.replace('_', ' ')}
                    </span>
                    <StatusBadge status={b.status === 'rejected' ? 'reassigning' : b.status} />
                  </div>
                  <p className="text-[#A3A3A3] text-sm font-light mt-0.5">
                    {b.pickup_location} <span className="text-gold/50 mx-1.5">→</span> {b.dropoff_location}
                  </p>
                  {b.pickup_time && (
                    <p className="text-[#555] text-xs font-semibold">
                      Scheduled: {new Date(b.pickup_time).toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4 relative z-10 shrink-0 self-end md:self-auto border-t border-neutral-900 md:border-t-0 pt-4 md:pt-0 w-full md:w-auto justify-between md:justify-end">
                  <span className="text-xl font-black text-white">${Number(b.total_fare).toFixed(2)}</span>
                  <div className="flex items-center gap-3">
                    <GoldButton 
                      onClick={() => navigate(`/traveler/bookings/${b.id}`)} 
                      variant="outline"
                      className="px-4 py-1.5"
                    >
                      Details
                    </GoldButton>
                    
                    {b.status === 'pending_payment' && (
                      <GoldButton 
                        onClick={() => navigate(`/traveler/payment/${b.id}`)} 
                        className="px-4 py-1.5"
                      >
                        Pay
                      </GoldButton>
                    )}
                    
                    {b.status === 'pending_payment' && (
                      <button 
                        onClick={() => handleCancel(b.id)} 
                        className="text-xs text-rose-500 hover:text-rose-400 font-bold uppercase tracking-wider transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        customRequests.length === 0 ? (
          <EmptyState 
            title="No custom requests yet" 
            message="Design a custom trip route suited to your plans, and our admin will review it."
            action={
              <GoldButton onClick={() => navigate('/traveler/custom-trip')}>
                Request Custom Journey
              </GoldButton>
            }
          />
        ) : (
          <div className="flex flex-col gap-4">
            {customRequests.map((r) => (
              <div 
                key={r.id} 
                className="card border border-gold/15 bg-[#121212] p-6 rounded-2xl flex flex-col md:flex-row md:items-start justify-between gap-6 hover:border-gold/30 transition duration-300 relative overflow-hidden"
              >
                <div className="flex flex-col gap-2 relative z-10 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gold text-lg font-serif">Bespoke Request</span>
                    <StatusBadge status={r.status} />
                  </div>
                  <p className="text-[#A3A3A3] text-sm font-light mt-0.5">
                    {r.origin} <span className="text-gold/50 mx-1.5">→</span> {r.destination}
                  </p>
                  <p className="text-[#555] text-xs font-semibold">
                    Date: {r.travel_date} {r.travel_time && `at ${r.travel_time}`} · Passengers: {r.passengers} pax
                  </p>
                  {r.special_requests && (
                    <p className="text-xs italic text-neutral-500 bg-[#0B0B0B]/40 border border-neutral-900 px-3 py-2 rounded-xl mt-1 leading-relaxed max-w-lg">
                      "{r.special_requests}"
                    </p>
                  )}
                  {r.admin_note && (
                    <div className="text-xs text-neutral-400 mt-2 bg-neutral-950/40 p-3 rounded-xl border border-neutral-900 leading-relaxed max-w-lg">
                      <span className="font-bold text-gold/80 block mb-0.5">Admin Response:</span>
                      {r.admin_note}
                    </div>
                  )}

                  {/* Confirmed traveler details display */}
                  {r.status === 'approved' && r.traveler_response && !editingCustom[r.id] && (
                    <div className="text-xs text-neutral-400 mt-2 bg-emerald-950/10 p-3 rounded-xl border border-emerald-900/30 leading-relaxed max-w-lg relative z-10">
                      <span className="font-bold text-emerald-400 block mb-1">✓ Confirmed Details:</span>
                      <p className="mb-0.5"><span className="text-neutral-500">Pickup Address:</span> {r.origin}</p>
                      <p className="mb-0.5"><span className="text-neutral-500">Dropoff Address:</span> {r.destination}</p>
                      <p className="mb-0.5"><span className="text-neutral-500">Pickup Date/Time:</span> {r.travel_date} {r.travel_time && `at ${r.travel_time}`}</p>
                      {r.telegram_contact && <p className="mb-0.5"><span className="text-neutral-500">Telegram Username:</span> {r.telegram_contact}</p>}
                      {r.traveler_response && <p className="mb-2"><span className="text-neutral-500">Confirmation Notes:</span> {r.traveler_response}</p>}
                      <button 
                        onClick={() => setEditingCustom((prev) => ({ ...prev, [r.id]: true }))}
                        className="text-[10px] text-gold hover:underline font-bold uppercase tracking-wider transition-colors"
                      >
                        ✏️ Modify Details / Pickup Address
                      </button>
                    </div>
                  )}
                  {/* Confirmation form for approved requests */}
                  {r.status === 'approved' && (!r.traveler_response || editingCustom[r.id]) && (() => {
                    const fState = getFormState(r.id, r);
                    return (
                      <div className="mt-4 border-t border-neutral-900/60 pt-4 flex flex-col gap-4 max-w-2xl z-10 w-full">
                        <p className="text-xs font-bold text-gold uppercase tracking-wider mb-1">Confirm Details with Admin</p>
                        
                        {/* Side-by-side or stacked Cards for Pickup and Dropoff */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                          
                          {/* Pickup Card */}
                          <div className="bg-[#0B0B0B]/80 border border-neutral-900 p-4 rounded-xl flex flex-col gap-2 relative overflow-hidden">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                              <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">Pickup Details</span>
                            </div>
                            <label className="text-[9px] uppercase font-bold text-[#BFA76A] tracking-wider block">Pickup Address</label>
                            <input 
                              className="bg-[#0B0B0B]/80 border border-gold/5 text-neutral-400 rounded-lg px-3 py-2 text-xs focus:outline-none cursor-not-allowed w-full font-light"
                              placeholder="🔒 Select on the map below"
                              value={fState.origin}
                              readOnly
                              required
                            />
                          </div>

                          {/* Dropoff Card */}
                          <div className="bg-[#0B0B0B]/80 border border-neutral-900 p-4 rounded-xl flex flex-col gap-2 relative overflow-hidden">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                              <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">Dropoff Details</span>
                            </div>
                            <label className="text-[9px] uppercase font-bold text-[#BFA76A] tracking-wider block">Dropoff Address</label>
                            <input 
                              className="bg-[#121212] border border-gold/10 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-gold/60 w-full"
                              placeholder="Type manually or select via map below"
                              value={fState.destination}
                              onChange={(e) => updateFormState(r.id, 'destination', e.target.value)}
                              required
                            />
                          </div>

                        </div>

                        {/* Interactive Map Picker inside Confirmation Form */}
                        <div className="bg-[#0B0B0B]/40 border border-neutral-900/60 p-3 rounded-xl">
                          <p className="text-[9px] uppercase font-bold text-[#BFA76A] tracking-wider block mb-2 px-1">Interactive Map Routing</p>
                          <MapPicker 
                            onSelectPickup={(address) => handleSelectPickup(r.id, address)} 
                            onlyPickup={true}
                          />
                        </div>

                        {/* Travel Date and Contact Card */}
                        <div className="bg-[#0B0B0B]/80 border border-neutral-900 p-4 rounded-xl flex flex-col gap-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">Confirm Date</label>
                              <input 
                                type="date"
                                className="bg-[#121212] border border-gold/10 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-gold/60 w-full"
                                value={fState.travel_date}
                                onChange={(e) => updateFormState(r.id, 'travel_date', e.target.value)}
                                required
                              />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">Confirm Time</label>
                              <input 
                                type="time"
                                className="bg-[#121212] border border-gold/10 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-gold/60 w-full"
                                value={fState.travel_time || ''}
                                onChange={(e) => updateFormState(r.id, 'travel_time', e.target.value)}
                                required
                              />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">Telegram Username</label>
                              <input 
                                className="bg-[#121212] border border-gold/10 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-gold/60 w-full"
                                placeholder="e.g. @username"
                                value={fState.telegram}
                                onChange={(e) => updateFormState(r.id, 'telegram', e.target.value)}
                                required
                              />
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">Special Pickup/Dropoff Notes</label>
                            <textarea 
                              className="bg-[#121212] border border-gold/10 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-gold/60 w-full"
                              placeholder="Any specific hotel names, flight numbers, or door details..."
                              value={fState.notes}
                              onChange={(e) => updateFormState(r.id, 'notes', e.target.value)}
                              rows={2}
                            />
                          </div>
                        </div>

                        <GoldButton 
                          onClick={() => handleConfirm(r.id)} 
                          className="px-5 py-2.5 self-start text-xs shadow-md mt-1 flex items-center gap-1.5"
                        >
                          💳 Confirm details & Pay
                        </GoldButton>
                      </div>
                    );
                  })()}

                  {/* Urgent Support Actions */}
                  <div className="mt-4 pt-4 border-t border-neutral-900/60 flex items-center gap-3 flex-wrap">
                    <button 
                      onClick={() => handleUrgent(r.id)}
                      className="px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 border border-rose-500/30 text-rose-500 hover:bg-rose-500 hover:text-white"
                    >
                      🚨 Request Urgent Callback
                    </button>
                    <a 
                      href="https://t.me/taxitrio_support" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 border border-gold/30 text-gold hover:bg-gold hover:text-black flex items-center gap-1.5"
                    >
                      💬 Chat with Support
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 relative z-10 shrink-0 self-end md:self-auto border-t border-neutral-900 md:border-t-0 pt-4 md:pt-0 w-full md:w-auto justify-between md:justify-end">
                  {r.status === 'approved' ? (
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Quoted Price</span>
                      <span className="text-xl font-black text-emerald-400 font-serif">${Number(r.quoted_price).toFixed(2)}</span>
                    </div>
                  ) : r.status === 'rejected' ? (
                    <span className="text-xs text-rose-500 font-bold uppercase tracking-wider">Rejected</span>
                  ) : (
                    <span className="text-xs text-neutral-500 italic uppercase tracking-wider">Pending Price Review</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
