import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createPayment, getCheckoutSession, simulateKHQRPayment } from '../../service/paymentService';
import { cancelBooking } from '../../service/bookingService';
import PageHeader from '../../components/PageHeader';
import GoldButton from '../../components/GoldButton';
import DashboardCard from '../../components/DashboardCard';

const METHODS = ['ABA Bank', 'ACLEDA Bank', 'Wing', 'Pi Pay', 'Cash', 'Other'];

export default function PaymentProofUpload() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [checkout, setCheckout] = useState(null);
  const [method, setMethod] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [showManual, setShowManual] = useState(false);

  useEffect(() => {
    getCheckoutSession(bookingId)
      .then((r) => setCheckout(r.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load checkout details'));
  }, [bookingId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError('Please select a proof image');
    setLoading(true);
    setError('');
    const fd = new FormData();
    fd.append('booking_id', bookingId);
    fd.append('payment_method', method);
    fd.append('proof', file);
    try {
      await createPayment(fd);
      navigate('/traveler/bookings');
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSimulatePay = async () => {
    setSimulating(true);
    setError('');
    try {
      await simulateKHQRPayment(bookingId);
      navigate(`/traveler/bookings/${bookingId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Simulation failed');
    } finally {
      setSimulating(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Cancel this booking completely?')) return;
    setLoading(true);
    setError('');
    try {
      await cancelBooking(bookingId);
      navigate('/traveler/bookings');
    } catch (err) {
      setError(err.response?.data?.message || 'Cancel failed');
    } finally {
      setLoading(false);
    }
  };

  if (error && !checkout) {
    return <div className="max-w-md mx-auto text-red-400 p-4 bg-red-950/20 border border-red-900/40 rounded-xl mt-12 text-center text-sm">{error}</div>;
  }

  if (!checkout) {
    return (
      <div className="flex items-center gap-2 py-12 justify-center">
        <span className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin"></span>
        <p className="text-[#A3A3A3] text-sm uppercase tracking-wider">Loading checkout session...</p>
      </div>
    );
  }

  const { payment, booking_type, pickup_location, dropoff_location } = checkout;

  return (
    <div className="max-w-md mx-auto flex flex-col gap-6">
      <PageHeader 
        title="Payment Checkout" 
        subtitle={`Session ID: #${payment.id}`}
      />
      
      {error && <p className="text-red-400 text-sm bg-red-950/20 border border-red-900/40 p-4 rounded-xl">{error}</p>}

      {/* KHQR Checkout Card */}
      <div className="card border border-gold/15 bg-[#121212] p-6 flex flex-col items-center gap-5 rounded-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute -right-24 -top-24 w-48 h-48 rounded-full bg-red-500/5 blur-3xl"></div>
        
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 z-10">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">KHQR / Bakong Pay</span>
        </div>

        {/* Mock KHQR Box */}
        <div className="relative bg-white p-6 rounded-2xl shadow-xl border border-neutral-200 flex flex-col items-center justify-center w-60 h-60 z-10">
          <svg className="w-44 h-44 text-neutral-900" viewBox="0 0 100 100" fill="currentColor">
            <path d="M0 0h30v30H0zm10 10h10v10H10zm60-10h30v30H70zm10 10h10v10H80zM0 70h30v30H0zm10 10h10v10H10z" />
            <path d="M40 10h10v10H40zm10 20h10v10H50zm10-10h10v10H60zm-20 20h10v10H40zm20 10h10v10H60zm10-10h10v10H70zm-20 20h10v10H50zm30 0h10v10H80zm0-20h10v10H80zm-40 20h10v10H40zM35 35h30v30H35z" fill="#f43f5e" opacity="0.1" />
            <path d="M35 45h5v5h-5zm10-5h5v5h-5zm10 15h5v5h-5zm-5 5h5v5h-5zm-15-5h5v5h-5zm20-10h5v5h-5z" />
            <path d="M5 35h5v10H5zm5 15h10v5H10zm20 5h5v5h-5zM85 35h5v15h-5zm-5 20h10v5H80z" />
          </svg>
          <div className="absolute inset-0 m-auto w-11 h-11 rounded-xl bg-rose-600 flex items-center justify-center shadow-lg border-2 border-white">
            <span className="text-white text-[10px] font-black tracking-tighter">KHQR</span>
          </div>
        </div>

        <div className="text-center z-10">
          <p className="text-[#A3A3A3] text-[10px] uppercase tracking-widest font-semibold">Amount to Pay</p>
          <p className="text-3xl font-extrabold text-gold mt-1">${parseFloat(payment.amount).toFixed(2)}</p>
        </div>

        <div className="w-full border-t border-neutral-900 my-1 pt-4 text-xs flex flex-col gap-2.5 text-left text-[#A3A3A3] z-10 font-light">
          <div className="flex justify-between items-center">
            <span>Trip Type:</span>
            <span className="capitalize text-white font-bold font-serif">{booking_type?.replace(/_/g, ' ')}</span>
          </div>
          <div className="flex justify-between items-start gap-4">
            <span className="shrink-0">Route:</span>
            <span className="text-white font-medium truncate max-w-[220px]">{pickup_location} → {dropoff_location}</span>
          </div>
        </div>

        <GoldButton
          onClick={handleSimulatePay}
          disabled={simulating}
          className="w-full py-3.5 z-10 mt-1"
        >
          {simulating ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
              Verifying Simulation...
            </span>
          ) : (
            'Simulate KHQR Payment (Pay Now)'
          )}
        </GoldButton>

        <p className="text-[#A3A3A3] text-[10px] text-center flex items-center justify-center gap-2 z-10 mt-1 font-semibold uppercase tracking-wider">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
          Waiting for Bakong API confirmation...
        </p>

        <div className="w-full flex flex-col gap-2.5 mt-2 pt-4 border-t border-neutral-900 z-10">
          <button
            type="button"
            onClick={() => navigate('/traveler/bookings')}
            className="w-full py-2.5 hover:bg-neutral-900/40 text-gold border border-gold/20 hover:border-gold/40 rounded-full text-xs font-bold transition uppercase tracking-wider"
          >
            Pay Later / Back to Bookings
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="w-full py-2.5 hover:bg-rose-950/20 text-rose-500 border border-rose-950/30 rounded-full text-xs font-bold transition uppercase tracking-wider"
          >
            {loading ? 'Cancelling...' : 'Cancel Booking'}
          </button>
        </div>
      </div>

      {/* Manual Upload Section */}
      <div className="text-center">
        <button
          onClick={() => setShowManual(!showManual)}
          className="text-xs text-[#BFA76A] hover:text-gold transition underline uppercase tracking-widest font-semibold"
        >
          {showManual ? 'Hide manual options' : 'Or pay manually and upload receipt'}
        </button>

        {showManual && (
          <div className="mt-4 animate-in slide-in-from-top-4 duration-300">
            <form onSubmit={handleSubmit} className="card flex flex-col gap-5 text-left border border-gold/15 bg-[#121212] p-6 rounded-2xl shadow-xl">
              <h3 className="font-bold text-sm text-gold font-serif border-b border-neutral-900 pb-3 uppercase tracking-wider">Manual Bank Receipt Upload</h3>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Payment Provider</label>
                <select 
                  className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/60 transition duration-300" 
                  required 
                  value={method} 
                  onChange={(e) => setMethod(e.target.value)}
                >
                  <option value="">Select payment method</option>
                  {METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Upload Receipt Image</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  required 
                  className="text-white text-xs block w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border file:border-gold/20 file:text-xs file:font-semibold file:bg-transparent file:text-gold hover:file:bg-gold hover:file:text-black hover:file:border-gold file:cursor-pointer transition-all duration-300"
                  onChange={(e) => setFile(e.target.files[0])} 
                />
              </div>

              <GoldButton type="submit" disabled={loading} className="w-full py-3">
                {loading ? 'Uploading Receipt...' : 'Submit Payment Proof'}
              </GoldButton>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
