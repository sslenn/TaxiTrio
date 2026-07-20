import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Car, CreditCard, ShieldCheck, Users } from 'lucide-react';
import { createBooking } from '../../service/bookingService';
import { getUser } from '../../utils/auth';
import GoldButton from '../GoldButton';

const isUuid = (value) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value || '');

export default function PackageBookingCard({
  packageId,
  tour,
  price,
  durationDays,
  maxPersons,
  vehicle,
}) {
  const navigate = useNavigate();
  const user = getUser();
  const isRestrictedRole = user?.role === 'admin' || user?.role === 'driver';
  
  const [form, setForm] = useState({
    travel_date: '',
    pickup_time: '08:00',
    travelers: 2,
    vehicle_type: 'suv',
    pickup_location: '',
    special_requests: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const numericPrice = Number(price || tour?.price || 0);
  const totalPrice = numericPrice;

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleBook = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const pickupDateTime = form.travel_date
      ? `${form.travel_date}T${form.pickup_time || '08:00'}:00`
      : '';

    const payload = {
      pickup_location: form.pickup_location,
      dropoff_location: tour ? `${tour.destination}, ${tour.province}` : 'Tour destination',
      pickup_time: pickupDateTime,
      booking_type: 'package',
      vehicle_type: form.vehicle_type,
      total_fare: totalPrice,
      notes: [
        tour ? `Tour: ${tour.title}` : null,
        `Travelers: ${form.travelers}`,
        form.special_requests ? `Special requests: ${form.special_requests}` : null,
      ]
        .filter(Boolean)
        .join('\n'),
    };

    if (isUuid(packageId)) {
      payload.package_id = packageId;
    }

    try {
      const { data } = await createBooking(payload);
      navigate(`/traveler/payment/${data.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please sign in as a traveler and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside
      id="booking-card"
      className="sticky top-24 self-start flex flex-col gap-6 rounded-2xl border border-gold/20 bg-[#121212] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.38)]"
    >
      <div className="border-b border-white/10 pb-5">
        <span className="text-[10px] font-black uppercase tracking-[0.28em] text-gold">Private Tour From</span>
        <div className="mt-2 flex items-end gap-2">
          <span className="font-serif text-4xl font-black text-white">${totalPrice.toFixed(0)}</span>
          <span className="pb-1 text-xs font-light text-neutral-500">per package</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Metric icon={Calendar} label={`${durationDays || tour?.durationDays}D`} />
        <Metric icon={Users} label={`Max ${maxPersons || tour?.maxPersons}`} />
        <Metric icon={Car} label={vehicle || tour?.vehicle || 'SUV'} />
      </div>

      {error && (
        <p className="rounded-2xl border border-rose-500/20 bg-rose-950/10 p-3 text-center text-xs text-rose-300">
          {error}
        </p>
      )}

      {isRestrictedRole ? (
        <div className="rounded-2xl border border-gold/15 bg-black/40 p-6 flex flex-col items-center text-center gap-4 animate-in fade-in duration-300">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/25 bg-gold/10 text-gold">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="text-gold font-bold uppercase tracking-wider text-xs font-serif">Administrative Mode</h4>
            <p className="text-[#A3A3A3] text-[11px] leading-relaxed font-light">
              Booking permissions are restricted to traveler accounts. As an active <strong>{user?.role}</strong>, you can configure and view this package but booking operations are disabled.
            </p>
          </div>
          <div className="w-full border-t border-white/5 pt-3">
            <p className="text-neutral-500 text-[10px] uppercase tracking-widest font-semibold">
              Logged in as: {user?.full_name || user?.email}
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleBook} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Travel Date">
              <input
                type="date"
                required
                className="input-premium text-sm"
                value={form.travel_date}
                onChange={(event) => handleChange('travel_date', event.target.value)}
              />
            </Field>
            <Field label="Pickup Time">
              <input
                type="time"
                required
                className="input-premium text-sm"
                value={form.pickup_time}
                onChange={(event) => handleChange('pickup_time', event.target.value)}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Travelers">
              <input
                type="number"
                min="1"
                max={maxPersons || tour?.maxPersons || 8}
                required
                className="input-premium text-sm"
                value={form.travelers}
                onChange={(event) => handleChange('travelers', event.target.value)}
              />
            </Field>
            <Field label="Vehicle Type">
              <select
                className="input-premium text-sm"
                value={form.vehicle_type}
                onChange={(event) => handleChange('vehicle_type', event.target.value)}
              >
                <option value="sedan">Executive Sedan</option>
                <option value="suv">Luxury SUV</option>
                <option value="van">Family Van</option>
              </select>
            </Field>
          </div>

          <Field label="Hotel Pickup Location">
            <input
              type="text"
              required
              className="input-premium text-sm"
              placeholder={tour?.pickupArea || 'Hotel, villa, or meeting point'}
              value={form.pickup_location}
              onChange={(event) => handleChange('pickup_location', event.target.value)}
            />
          </Field>

          <Field label="Special Requests">
            <textarea
              rows="3"
              className="input-premium resize-none text-sm"
              placeholder="Child seat, language preference, dietary notes..."
              value={form.special_requests}
              onChange={(event) => handleChange('special_requests', event.target.value)}
            />
          </Field>

          <GoldButton type="submit" disabled={loading} className="w-full py-4">
            {loading ? 'Processing...' : 'Book Now'}
          </GoldButton>
        </form>
      )}

      <div className="grid gap-3 border-t border-white/10 pt-5 text-xs text-neutral-300">
        <TrustItem icon={ShieldCheck} text="Instant confirmation" />
        <TrustItem icon={CreditCard} text="Secure payment" />
        <TrustItem icon={Calendar} text="Free cancellation policy" />
      </div>
    </aside>
  );
}

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[9px] font-black uppercase tracking-[0.22em] text-[#BFA76A]">{label}</span>
      {children}
    </label>
  );
}

function Metric({ icon: Icon, label }) {
  return (
    <div className="flex min-h-20 flex-col items-center justify-center gap-2 rounded-2xl border border-white/10 bg-black/30 px-2 text-center">
      <Icon className="h-4 w-4 text-gold" />
      <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-300">{label}</span>
    </div>
  );
}

function TrustItem({ icon: Icon, text }) {
  return (
    <span className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-gold" />
      {text}
    </span>
  );
}
