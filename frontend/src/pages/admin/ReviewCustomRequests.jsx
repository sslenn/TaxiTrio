import { useState, useEffect } from 'react';
import { getCustomRequests, approveCustomRequest, rejectCustomRequest } from '../../service/adminService';
import PageHeader from '../../components/PageHeader';
import GoldButton from '../../components/GoldButton';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';

export default function ReviewCustomRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState({});
  const [price, setPrice] = useState({});
  const [search, setSearch] = useState('');

  const load = () => getCustomRequests().then((r) => setRequests(r.data.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const approve = async (id) => {
    const quotedPrice = price[id];
    if (!quotedPrice || isNaN(quotedPrice) || parseFloat(quotedPrice) <= 0) {
      alert('You must provide a valid quoted price to approve this request.');
      return;
    }
    try { 
      await approveCustomRequest(id, { admin_note: note[id], quoted_price: quotedPrice }); 
      load(); 
    } catch (err) { 
      alert(err.response?.data?.message || 'Error'); 
    }
  };

  const reject = async (id) => {
    try { 
      await rejectCustomRequest(id, { admin_note: note[id] }); 
      load(); 
    } catch (err) { 
      alert(err.response?.data?.message || 'Error'); 
    }
  };

  const filteredRequests = requests.filter((r) => 
    r.traveler_name?.toLowerCase().includes(search.toLowerCase()) || 
    r.phone?.toLowerCase().includes(search.toLowerCase()) || 
    r.origin?.toLowerCase().includes(search.toLowerCase()) || 
    r.destination?.toLowerCase().includes(search.toLowerCase()) || 
    (r.special_requests && r.special_requests.toLowerCase().includes(search.toLowerCase())) ||
    r.status?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <PageHeader 
        title="Custom Trip Requests" 
        subtitle="Review traveler itineraries and quote bespoke pricing or reject invalid routes"
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
            placeholder="Search requests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </PageHeader>

      {loading ? (
        <div className="flex items-center gap-2 py-12 justify-center">
          <span className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin"></span>
          <p className="text-[#A3A3A3] text-sm uppercase tracking-wider">Loading requests...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <EmptyState 
          title="No Bespoke Requests" 
          message="There are currently no custom trip requests matching your query."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {filteredRequests.map((r) => (
            <div 
              key={r.id} 
              className="card border border-gold/15 bg-[#121212] p-6 rounded-2xl flex flex-col gap-5 hover:border-gold/30 transition duration-300 relative overflow-hidden"
            >
              <div className="absolute -right-24 -top-24 w-48 h-48 rounded-full bg-gold/5 blur-3xl"></div>
              
              <div className="flex justify-between items-start gap-4 flex-wrap z-10">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-white font-serif text-lg">{r.traveler_name}</p>
                    <span className="text-xs text-neutral-500 font-semibold">· {r.phone}</span>
                  </div>
                  <p className="text-gold font-bold text-sm">
                    Route: {r.origin} <span className="text-gold/50 mx-1">→</span> {r.destination}
                  </p>
                  <p className="text-[#A3A3A3] text-xs font-light">
                    Date: {r.travel_date} {r.travel_time && `at ${r.travel_time}`} · Passengers: {r.passengers} pax
                  </p>
                  {r.special_requests && (
                    <p className="text-xs italic text-neutral-500 bg-[#0B0B0B]/50 border border-neutral-900 px-3 py-2 rounded-xl mt-1 leading-relaxed">
                      "{r.special_requests}"
                    </p>
                  )}
                  {(r.telegram_contact || r.traveler_response) && (
                    <div className="text-xs text-neutral-400 mt-2 bg-emerald-950/10 p-3 rounded-xl border border-emerald-900/30 leading-relaxed">
                      <span className="font-bold text-emerald-400 block mb-1">✓ Traveler Confirmed Details:</span>
                      <p className="mb-0.5"><span className="text-neutral-500">Pickup Date/Time:</span> {r.travel_date} {r.travel_time && `at ${r.travel_time}`}</p>
                      {r.telegram_contact && (
                        <p className="mb-0.5">
                          <span className="text-neutral-500">Telegram Username:</span>{' '}
                          {(() => {
                            const clean = r.telegram_contact.trim();
                            const username = clean.startsWith('@') ? clean.substring(1) : clean;
                            const isValid = /^[a-zA-Z0-9_]{5,32}$/.test(username);
                            return isValid ? (
                              <a 
                                href={`https://t.me/${username}`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-gold hover:underline font-medium"
                              >
                                {r.telegram_contact}
                              </a>
                            ) : (
                              r.telegram_contact
                            );
                          })()}
                        </p>
                      )}
                      {r.traveler_response && <p><span className="text-neutral-500">Confirmation Notes:</span> {r.traveler_response}</p>}
                    </div>
                  )}
                </div>
                
                <StatusBadge status={r.status} />
              </div>

              {r.status === 'pending' && (
                <div className="flex gap-3 mt-2 flex-wrap items-center z-10 pt-4 border-t border-neutral-900/60">
                  <input 
                    className="bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-gold/60 w-32" 
                    placeholder="Quoted price ($)"
                    value={price[r.id] || ''} 
                    onChange={(e) => setPrice({ ...price, [r.id]: e.target.value })} 
                  />
                  <input 
                    className="bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-gold/60 flex-1 min-w-[200px]" 
                    placeholder="Admin note / message..."
                    value={note[r.id] || ''} 
                    onChange={(e) => setNote({ ...note, [r.id]: e.target.value })} 
                  />
                  <div className="flex items-center gap-3 ml-auto">
                    <GoldButton 
                      onClick={() => approve(r.id)} 
                      className="px-4 py-1.5 text-[10px]"
                    >
                      Approve
                    </GoldButton>
                    <button 
                      onClick={() => reject(r.id)} 
                      className="text-xs text-rose-500 hover:text-rose-400 font-bold uppercase tracking-wider transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
