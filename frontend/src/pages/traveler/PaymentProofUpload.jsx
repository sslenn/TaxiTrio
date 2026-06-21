import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCheckoutSession, createStripeSession } from '../../service/paymentService';
import { cancelBooking } from '../../service/bookingService';
import PageHeader from '../../components/PageHeader';
import GoldButton from '../../components/GoldButton';

export default function PaymentProofUpload() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [checkout, setCheckout] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [stripeLoading, setStripeLoading] = useState(false);

  useEffect(() => {
    getCheckoutSession(bookingId)
      .then((r) => setCheckout(r.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load checkout details'));
  }, [bookingId]);

  const handleStripePay = async () => {
    setStripeLoading(true);
    setError('');
    try {
      const { data } = await createStripeSession(bookingId);
      if (data && data.data && data.data.sessionUrl) {
        window.location.href = data.data.sessionUrl;
      } else {
        throw new Error('Failed to retrieve checkout URL');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Stripe initialization failed');
      setStripeLoading(false);
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
      setStripeLoading(false);
    } finally {
      setLoading(false);
    }
  };

  if (error && !checkout) {
    return (
      <div className="max-w-md mx-auto text-red-400 p-4 bg-red-950/20 border border-red-900/40 rounded-xl mt-12 text-center text-sm">
        {error}
      </div>
    );
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

      {/* Stripe Payment Card */}
      <div className="card border border-gold/15 bg-[#121212] p-6 flex flex-col items-center gap-6 rounded-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute -right-24 -top-24 w-48 h-48 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none"></div>
        
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 z-10">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Secure Card Checkout</span>
        </div>

        <div className="text-center z-10 my-2">
          <p className="text-[#A3A3A3] text-[10px] uppercase tracking-widest font-semibold">Amount to Pay</p>
          <p className="text-4xl font-extrabold text-gold mt-1">${parseFloat(payment.amount).toFixed(2)}</p>
        </div>

        <div className="w-full border-t border-neutral-900 my-1 pt-4 text-xs flex flex-col gap-3 text-left text-[#A3A3A3] z-10 font-light font-sans">
          <div className="flex justify-between items-center">
            <span>Trip Type:</span>
            <span className="capitalize text-white font-bold font-serif">{booking_type?.replace(/_/g, ' ')}</span>
          </div>
          <div className="flex justify-between items-start gap-4">
            <span className="shrink-0">Route:</span>
            <span className="text-white font-medium text-right max-w-[220px] line-clamp-2">{pickup_location} → {dropoff_location}</span>
          </div>
        </div>

        {/* Stripe Card Payment Option */}
        <button
          type="button"
          onClick={handleStripePay}
          disabled={stripeLoading}
          className="w-full py-4 z-10 mt-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition duration-300 shadow-md flex items-center justify-center gap-2.5 disabled:opacity-50 active:scale-[0.98]"
        >
          {stripeLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Redirecting to Stripe...
            </span>
          ) : (
            <>
              <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
              </svg>
              Pay with Card (Stripe)
            </>
          )}
        </button>

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
    </div>
  );
}
