import { useState, useEffect } from 'react';
import { getAdminPayments, verifyPayment, rejectPayment } from '../../service/paymentService';
import PageHeader from '../../components/PageHeader';
import GoldButton from '../../components/GoldButton';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';

export default function ManagePayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null); // image URL for modal
  const [search, setSearch] = useState('');

  const load = () => getAdminPayments().then((r) => setPayments(r.data.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const act = async (fn) => { 
    try { 
      await fn(); 
      load(); 
    } catch (err) { 
      alert(err.response?.data?.message || 'Error'); 
    } 
  };

  const filteredPayments = payments.filter((p) => 
    p.payment_method?.toLowerCase().includes(search.toLowerCase()) || 
    (p.traveler?.full_name || p.traveler_name || '').toLowerCase().includes(search.toLowerCase()) ||
    p.booking?.booking_type?.toLowerCase().includes(search.toLowerCase()) ||
    p.status?.toLowerCase().includes(search.toLowerCase()) ||
    String(p.amount).includes(search)
  );

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <PageHeader 
        title="Verify Payments" 
        subtitle="Review and track card transactions, digital receipts, and payment logs"
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
            placeholder="Search payments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </PageHeader>

      {/* Digital Receipt/Proof Modal */}
      {preview && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setPreview(null)}
        >
          <div className="relative max-w-md w-full bg-[#121212] border border-gold/15 p-6 rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreview(null)}
              className="absolute -top-10 right-0 text-white text-sm hover:text-gold flex items-center gap-1 font-bold uppercase tracking-wider transition"
            >
              ✕ Close
            </button>
            {typeof preview === 'string' && !preview.includes('stripe') && !preview.includes('mock') ? (
              <img src={preview} alt="Payment proof" className="w-full rounded-2xl border border-gold/20 shadow-2xl" />
            ) : (
              <div className="flex flex-col gap-4 text-center font-sans">
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">✓</div>
                <h3 className="text-xl font-bold text-white font-serif">Payment Receipt</h3>
                <p className="text-neutral-500 text-[10px] uppercase tracking-widest font-semibold">
                  {typeof preview === 'object' && preview.payment_method === 'Stripe' ? 'Stripe Card Settlement' : 'KHQR Payment Receipt'}
                </p>
                <div className="border-t border-b border-neutral-900/60 py-4 my-2 text-left text-xs flex flex-col gap-2.5 text-[#A3A3A3] font-light">
                  <div className="flex justify-between">
                    <span>Transaction Reference:</span>
                    <span className="text-white font-semibold">#{typeof preview === 'object' ? preview.id : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Customer Name:</span>
                    <span className="text-white font-semibold">{typeof preview === 'object' ? (preview.traveler?.full_name || preview.traveler_name || 'Traveler') : 'Traveler'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span className="text-white font-semibold">
                      {typeof preview === 'object' ? preview.payment_method : 'Credit Card (Stripe)'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount Transferred:</span>
                    <span className="text-gold font-bold text-sm">${typeof preview === 'object' ? preview.amount : '0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Settlement Date:</span>
                    <span className="text-white font-medium">
                      {typeof preview === 'object' ? new Date(preview.created_at || preview.createdAt || Date.now()).toLocaleString() : 'N/A'}
                    </span>
                  </div>
                </div>
                <p className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 py-2.5 rounded-xl uppercase font-bold tracking-wider">
                  Payment Confirmed & Verified
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 py-12 justify-center">
          <span className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin"></span>
          <p className="text-[#A3A3A3] text-sm uppercase tracking-wider">Loading payments...</p>
        </div>
      ) : filteredPayments.length === 0 ? (
        <EmptyState 
          title="No payments pending" 
          message="No payment transactions logged matching your search criteria."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {filteredPayments.map((p) => (
            <div 
              key={p.id} 
              className="card border border-gold/15 bg-[#121212] p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-gold/30 transition duration-300 relative overflow-hidden"
            >
              <div className="flex gap-4 items-start relative z-10 flex-1">
                {/* Proof image thumbnail / Receipt Icon */}
                <div className="shrink-0">
                  {p.payment_method === 'Stripe' || (p.proof_url && (p.proof_url.includes('stripe') || p.proof_url.includes('mock'))) ? (
                    <div 
                      className="w-16 h-16 rounded-xl border border-indigo-500/20 bg-indigo-500/5 hover:border-indigo-500 hover:bg-indigo-500/10 flex flex-col items-center justify-center text-indigo-400 text-[9px] font-bold uppercase tracking-wider cursor-pointer transition duration-300 shadow-md"
                      onClick={() => setPreview(p)}
                      title="Click to view digital receipt"
                    >
                      <svg className="w-6 h-6 mb-1 text-indigo-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18 17H6v-2h12v2zm0-4H6v-2h12v2zm0-4H6V7h12v2zM3 5v16a1 1 0 001 1h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1z"/>
                      </svg>
                      Receipt
                    </div>
                  ) : p.proof_url ? (
                    <img
                      src={p.proof_url}
                      alt="Payment proof"
                      className="w-16 h-16 object-cover rounded-xl border border-gold/10 hover:border-gold cursor-pointer transition duration-300 shadow-md"
                      onClick={() => setPreview(p.proof_url)}
                      title="Click to enlarge"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl border border-neutral-900 bg-[#0B0B0B] flex items-center justify-center text-[#555] text-[10px] font-bold uppercase tracking-wider">
                      No Slips
                    </div>
                  )}
                </div>

                {/* Payment info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-base font-serif">{p.traveler?.full_name || p.traveler_name}</p>
                  <p className="text-[#A3A3A3] text-xs font-semibold uppercase tracking-wider mt-1">
                    {p.payment_method} · <span className="text-gold font-bold">${p.amount}</span>
                  </p>
                  <p className="text-[#555] text-xs font-medium capitalize mt-1">
                    Service: {p.booking?.notes?.startsWith('[Custom Trip]') || p.booking?.notes?.includes('Custom Trip Request') || p.booking?.notes?.includes('Bespoke Custom')
                      ? 'custom trip'
                      : p.booking?.booking_type?.replace('_', ' ')}
                  </p>
                  <p className="text-[#555] text-[10px] font-medium mt-1">
                    Logged: {new Date(p.created_at || p.createdAt || Date.now()).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Status + actions */}
              <div className="flex items-center gap-4 relative z-10 shrink-0 self-end md:self-auto border-t border-neutral-900 md:border-t-0 pt-4 md:pt-0 w-full md:w-auto justify-end">
                <StatusBadge status={p.status === 'verified' ? 'paid' : p.status === 'rejected' ? 'cancelled' : 'pending'} />
                {p.status === 'pending' && (
                  <div className="flex items-center gap-3">
                    <GoldButton 
                      onClick={() => act(() => verifyPayment(p.id))} 
                      className="px-4 py-1.5 text-[10px]"
                    >
                      Verify
                    </GoldButton>
                    <button 
                      onClick={() => act(() => rejectPayment(p.id))} 
                      className="text-xs text-rose-500 hover:text-rose-400 font-bold uppercase tracking-wider transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
