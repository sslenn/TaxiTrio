import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookingById } from '../../service/bookingService';
import { submitReview } from '../../service/reviewService';
import PageHeader from '../../components/PageHeader';
import GoldButton from '../../components/GoldButton';
import StatusBadge from '../../components/StatusBadge';
import DashboardCard from '../../components/DashboardCard';

export default function BookingStatus() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [reviewed, setReviewed] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { 
    getBookingById(id)
      .then((r) => setBooking(r.data.data))
      .catch(() => navigate('/traveler/bookings')); 
  }, [id, navigate]);

  const handleReview = async (e) => {
    e.preventDefault();
    try {
      await submitReview({ booking_id: id, ...review });
      setReviewed(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Review failed');
    }
  };

  if (!booking) return (
    <div className="flex items-center gap-2 py-12 justify-center">
      <span className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin"></span>
      <p className="text-[#A3A3A3] text-sm uppercase tracking-wider">Loading trip details...</p>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <PageHeader 
        title="Booking Details" 
        subtitle={`Reference Trip ID: #${booking.id}`}
      >
        <GoldButton onClick={() => navigate('/traveler/bookings')} variant="outline">
          Back to Bookings
        </GoldButton>
      </PageHeader>

      <DashboardCard title="Trip Information">
        <div className="flex flex-col gap-4 text-sm font-light">
          <div className="flex justify-between items-center border-b border-neutral-900 pb-3">
            <span className="text-[#A3A3A3]">Trip Type:</span>
            <span className="capitalize font-bold text-white text-base font-serif">{booking.booking_type?.replace(/_/g, ' ')}</span>
          </div>
          <div className="flex justify-between items-center border-b border-neutral-900 pb-3">
            <span className="text-[#A3A3A3]">Status:</span>
            <StatusBadge status={booking.status === 'rejected' ? 'reassigning' : booking.status} />
          </div>
          <div className="flex justify-between items-start border-b border-neutral-900 pb-3 gap-4">
            <span className="text-[#A3A3A3] shrink-0">Pickup Location:</span>
            <span className="text-white font-medium text-right">{booking.pickup_location}</span>
          </div>
          <div className="flex justify-between items-start border-b border-neutral-900 pb-3 gap-4">
            <span className="text-[#A3A3A3] shrink-0">Dropoff Location:</span>
            <span className="text-white font-medium text-right">{booking.dropoff_location}</span>
          </div>
          <div className="flex justify-between items-center border-b border-neutral-900 pb-3">
            <span className="text-[#A3A3A3]">Scheduled Time:</span>
            <span className="text-white font-medium">{booking.pickup_time ? new Date(booking.pickup_time).toLocaleString() : 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center border-b border-neutral-900 pb-3">
            <span className="text-[#A3A3A3]">Booked On:</span>
            <span className="text-white font-medium">{new Date(booking.created_at || booking.createdAt || Date.now()).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-[#A3A3A3] font-bold">Total Paid/Fare:</span>
            <span className="text-xl font-black text-gold">${Number(booking.total_fare).toFixed(2)}</span>
          </div>
          
          {booking.driver && (
            <div className="mt-4 p-4 rounded-xl border border-gold/15 bg-gold/5 flex items-center justify-between gap-4">
              <div>
                <p className="text-[#BFA76A] text-[10px] uppercase font-bold tracking-widest">Assigned Driver</p>
                <p className="text-white font-bold font-serif text-lg mt-0.5">{booking.driver.full_name}</p>
              </div>
              <a 
                href={`tel:${booking.driver.phone}`} 
                className="bg-gold hover:bg-[#BFA76A] text-black font-bold uppercase tracking-wider text-xs px-4 py-2 rounded-full transition duration-300 shadow-md"
              >
                Call {booking.driver.phone}
              </a>
            </div>
          )}
        </div>
      </DashboardCard>

      {booking.payment && (
        <DashboardCard title="Transaction Details">
          <div className="flex flex-col gap-4 text-sm font-light">
            <div className="flex justify-between items-center border-b border-neutral-900 pb-3">
              <span className="text-[#A3A3A3]">Payment Method:</span>
              <span className="text-white font-medium">{booking.payment.payment_method}</span>
            </div>
            <div className="flex justify-between items-center border-b border-neutral-900 pb-3">
              <span className="text-[#A3A3A3]">Payment Status:</span>
              <StatusBadge status={booking.payment.status === 'verified' ? 'paid' : booking.payment.status === 'rejected' ? 'cancelled' : 'pending'} />
            </div>
            <div className="flex justify-between items-center border-b border-neutral-900 pb-3">
              <span className="text-[#A3A3A3]">Transaction Time:</span>
              <span className="text-white font-medium">{new Date(booking.payment.created_at || booking.payment.createdAt || Date.now()).toLocaleString()}</span>
            </div>
            {booking.payment.verified_at && (
              <div className="flex justify-between items-center">
                <span className="text-[#A3A3A3]">Verified On:</span>
                <span className="text-white font-medium">{new Date(booking.payment.verified_at).toLocaleString()}</span>
              </div>
            )}
          </div>
        </DashboardCard>
      )}

      {booking.status === 'completed' && !reviewed && (
        <DashboardCard title="Rate Your Trip">
          {error && <p className="text-red-400 text-sm mb-4 bg-red-950/20 border border-red-900/40 p-3 rounded-xl">{error}</p>}
          <form onSubmit={handleReview} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Rating</label>
              <select 
                className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/60 transition duration-300"
                value={review.rating} 
                onChange={(e) => setReview({ ...review, rating: +e.target.value })}
              >
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} Stars</option>)}
              </select>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Feedback Comments</label>
              <textarea 
                className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/60 transition duration-300" 
                placeholder="Share your booking and driver service feedback..." 
                rows={3}
                value={review.comment} 
                onChange={(e) => setReview({ ...review, comment: e.target.value })} 
              />
            </div>
            
            <GoldButton type="submit" className="w-full py-3.5 mt-2">
              Submit Review
            </GoldButton>
          </form>
        </DashboardCard>
      )}
      {reviewed && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-center text-sm font-semibold uppercase tracking-wider">
          Thank you for your review!
        </div>
      )}
    </div>
  );
}
