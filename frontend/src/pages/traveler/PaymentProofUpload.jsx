import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCheckoutSession, createStripeSession, simulateKHQRPayment, initiateUnifiedPayment, getPaymentStatus } from '../../service/paymentService';
import { cancelBooking } from '../../service/bookingService';
import PageHeader from '../../components/PageHeader';
import GoldButton from '../../components/GoldButton';
import { CreditCard, QrCode, Banknote } from 'lucide-react';

export default function PaymentProofUpload() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [checkout, setCheckout] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('khqr'); // Default to KHQR for local standard

  useEffect(() => {
    getCheckoutSession(bookingId)
      .then((r) => setCheckout(r.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load checkout details'));
  }, [bookingId]);

  useEffect(() => {
    if (paymentMethod !== 'khqr' || !checkout || checkout.payment.status === 'verified') return;

    const intervalId = setInterval(async () => {
      try {
        const { data } = await getPaymentStatus(bookingId);
        if (data && data.data && data.data.status === 'verified') {
          clearInterval(intervalId);
          alert('Payment confirmed via banking network! Redirecting to your booking details...');
          navigate(`/traveler/bookings/${bookingId}`);
        }
      } catch (err) {
        console.error('Error polling payment status:', err);
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [bookingId, paymentMethod, checkout, navigate]);

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

  const handleKHQRPay = async () => {
    setLoading(true);
    setError('');
    try {
      await simulateKHQRPayment(bookingId);
      alert('Payment Simulated Successfully! Your booking status has been verified via the banking system.');
      navigate(`/traveler/bookings/${bookingId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'KHQR payment simulation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCashConfirm = async () => {
    setLoading(true);
    setError('');
    try {
      await initiateUnifiedPayment({
        method: 'cash',
        amount: parseFloat(checkout.payment.amount),
        bookingId: bookingId
      });
      alert('Cash payment confirmed! You will pay the driver upon arrival.');
      navigate(`/traveler/bookings/${bookingId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Cash payment confirmation failed');
    } finally {
      setLoading(false);
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

  const { payment, booking_type, pickup_location, dropoff_location, qrString } = checkout;

  return (
    <div className="max-w-md mx-auto flex flex-col gap-6">
      <PageHeader 
        title="Payment Checkout" 
        subtitle={`Session ID: #${payment.id}`}
      />
      
      {error && <p className="text-red-400 text-sm bg-red-950/20 border border-red-900/40 p-4 rounded-xl">{error}</p>}

      {/* Tabs to choose Payment Method */}
      <div className="flex bg-[#111111] p-1 border border-neutral-900 rounded-xl gap-1">
        <button
          onClick={() => setPaymentMethod('khqr')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition duration-300 ${
            paymentMethod === 'khqr'
              ? 'bg-[#1D1D1D] border border-gold/20 text-gold shadow-md'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          KHQR
        </button>
        <button
          onClick={() => setPaymentMethod('stripe')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition duration-300 ${
            paymentMethod === 'stripe'
              ? 'bg-[#1D1D1D] border border-gold/20 text-gold shadow-md'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          Card
        </button>
        <button
          onClick={() => setPaymentMethod('cash')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition duration-300 ${
            paymentMethod === 'cash'
              ? 'bg-[#1D1D1D] border border-gold/20 text-gold shadow-md'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Banknote className="w-3.5 h-3.5" />
          Cash
        </button>
      </div>

      <div className="card border border-gold/15 bg-[#121212] p-6 flex flex-col items-center gap-6 rounded-2xl shadow-2xl relative overflow-hidden">
        {paymentMethod === 'stripe' ? (
          <>
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
                  <CreditCard className="w-4.5 h-4.5" />
                  Pay with Card (Stripe)
                </>
              )}
            </button>
          </>
        ) : paymentMethod === 'khqr' ? (
          <>
            <div className="absolute -right-24 -top-24 w-48 h-48 rounded-full bg-gold/5 blur-3xl pointer-events-none"></div>

            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/10 border border-gold/20 z-10">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gold">KHQR Banking Network</span>
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

            {/* KHQR Presentation */}
            <div className="bg-white p-4 rounded-2xl flex flex-col items-center gap-3 z-10 shadow-lg">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrString)}`}
                alt="Cambodian KHQR Code"
                className="w-[180px] h-[180px] rounded-lg shadow-inner"
              />
              <p className="text-[10px] text-center text-neutral-600 font-light leading-relaxed max-w-[200px]">
                Scan with Bakong or any Cambodian Bank App (ABA, Acleda, Sathapana, etc.)
              </p>
            </div>

            {/* Simulate payment helper */}
            <GoldButton
              onClick={handleKHQRPay}
              disabled={loading}
              className="w-full py-3.5 mt-2 text-xs font-serif uppercase tracking-wider"
            >
              {loading ? 'Confirming payment...' : 'Simulate Bank App Payment'}
            </GoldButton>
          </>
        ) : (
          <>
            <div className="absolute -right-24 -top-24 w-48 h-48 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none"></div>

            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 z-10">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Cash on Arrival</span>
            </div>

            <div className="text-center z-10 my-2">
              <p className="text-[#A3A3A3] text-[10px] uppercase tracking-widest font-semibold">Fare Due Upon Arrival</p>
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

            <div className="bg-[#191919] border border-gold/10 p-5 rounded-2xl flex flex-col items-center gap-3.5 z-10 shadow-inner w-full text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <Banknote className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-white font-bold text-xs uppercase tracking-wide">Cash Settlement</p>
                <p className="text-[10px] text-neutral-400 font-light leading-relaxed max-w-[220px]">
                  Confirm your choice to pay the fare directly to the driver in USD or KHR upon reaching your destination.
                </p>
              </div>
            </div>

            {/* Confirm Cash */}
            <GoldButton
              onClick={handleCashConfirm}
              disabled={loading}
              className="w-full py-3.5 mt-2 text-xs font-serif uppercase tracking-wider"
            >
              {loading ? 'Confirming Cash Selection...' : 'Confirm Cash Booking'}
            </GoldButton>
          </>
        )}

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
