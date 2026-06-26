import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBooking } from '../../service/bookingService';
import GoldButton from '../GoldButton';
import { Clock, Users, Car } from 'lucide-react';

export default function PackageBookingCard({ packageId, price, durationDays, maxPersons, vehicle }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    pickup_location: '',
    dropoff_location: '',
    pickup_time: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleBook = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await createBooking({
        ...form,
        package_id: packageId,
        booking_type: 'package',
        total_fare: price
      });
      navigate(`/traveler/payment/${data.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#151515] border border-gold/15 p-6 rounded-3xl shadow-xl flex flex-col gap-6 sticky top-6">
      {/* Price Header */}
      <div className="flex flex-col pb-4 border-b border-neutral-900">
        <span className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest">Premium Price</span>
        <div className="flex items-baseline gap-1.5 mt-1">
          <span className="text-3xl font-black text-[#D4AF37] font-serif">${Number(price).toFixed(2)}</span>
          <span className="text-xs text-neutral-400 font-light">/ package</span>
        </div>
      </div>

      {/* Package Key Metrics */}
      <div className="flex flex-col gap-3.5 text-xs text-neutral-300 font-light">
        <div className="flex justify-between items-center border-b border-neutral-900/60 pb-2.5">
          <span className="text-neutral-500 font-bold uppercase tracking-wider text-[9px] flex items-center gap-1">
            <Clock className="w-3 h-3 text-gold" /> Duration:
          </span>
          <span className="text-white font-medium">{durationDays} Day(s)</span>
        </div>
        <div className="flex justify-between items-center border-b border-neutral-900/60 pb-2.5">
          <span className="text-neutral-500 font-bold uppercase tracking-wider text-[9px] flex items-center gap-1">
            <Users className="w-3 h-3 text-gold" /> Max Group:
          </span>
          <span className="text-white font-medium">Up to {maxPersons} Persons</span>
        </div>
        <div className="flex justify-between items-center pb-1">
          <span className="text-neutral-500 font-bold uppercase tracking-wider text-[9px] flex items-center gap-1">
            <Car className="w-3 h-3 text-gold" /> Vehicle Class:
          </span>
          <span className="text-white font-medium capitalize">{vehicle || 'Premium SUV'}</span>
        </div>
      </div>

      {error && (
        <p className="text-red-400 text-xs text-center bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl">
          {error}
        </p>
      )}

      {/* Booking Form Inputs */}
      <form onSubmit={handleBook} className="flex flex-col gap-4 border-t border-neutral-900 pt-5">
        {/* Pickup Location */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[9px] uppercase font-bold text-[#BFA76A] tracking-wider block">Pickup Location</label>
          <input
            type="text"
            required
            className="w-full bg-[#0B0B0B] border border-gold/10 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-gold/60 transition duration-300"
            placeholder="Hotel or meeting place details..."
            value={form.pickup_location}
            onChange={(e) => setForm({ ...form, pickup_location: e.target.value })}
          />
        </div>

        {/* Dropoff Location */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[9px] uppercase font-bold text-[#BFA76A] tracking-wider block">Dropoff Location</label>
          <input
            type="text"
            required
            className="w-full bg-[#0B0B0B] border border-gold/10 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-gold/60 transition duration-300"
            placeholder="Drop-off address details..."
            value={form.dropoff_location}
            onChange={(e) => setForm({ ...form, dropoff_location: e.target.value })}
          />
        </div>

        {/* Pickup Date & Time */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[9px] uppercase font-bold text-[#BFA76A] tracking-wider block">Pickup Date & Time</label>
          <input
            type="datetime-local"
            required
            className="w-full bg-[#0B0B0B] border border-gold/10 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-gold/60 transition duration-300"
            value={form.pickup_time}
            onChange={(e) => setForm({ ...form, pickup_time: e.target.value })}
          />
        </div>

        {/* Submit Button */}
        <GoldButton type="submit" disabled={loading} className="w-full py-3.5 mt-2 font-serif text-sm tracking-wide">
          {loading ? 'Processing Booking...' : 'Confirm Booking'}
        </GoldButton>
      </form>
    </div>
  );
}
