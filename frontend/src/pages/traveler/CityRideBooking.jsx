import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBooking, estimateBookingFare } from '../../service/bookingService';
import MapPicker from '../../components/MapPicker';
import PageHeader from '../../components/PageHeader';
import GoldButton from '../../components/GoldButton';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Calendar, 
  Compass, 
  CheckCircle, 
  User, 
  ShieldCheck, 
  HelpCircle, 
  ArrowRight, 
  Check, 
  Sparkles,
  ChevronRight,
  Navigation
} from 'lucide-react';

const mapVehicleClassToType = (vClass) => {
  if (vClass === 'economy') return 'sedan';
  if (vClass === 'premium') return 'suv';
  if (vClass === 'suv') return 'van';
  return 'sedan';
};

export default function CityRideBooking() {
  const navigate = useNavigate();
  
  // Service flow control states
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(1); // 1: Route, 2: Schedule, 3: Review
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdBookingId, setCreatedBookingId] = useState(null);

  // Form states
  const [form, setForm] = useState({ 
    pickup_location: '', 
    dropoff_location: '', 
    pickup_time: '', 
    notes: '' 
  });
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropoffCoords, setDropoffCoords] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState('');

  // Time States
  const [timeSelection, setTimeSelection] = useState('now'); // 'now', '30m', 'tomorrow', 'custom'

  // Vehicle selection state
  const [vehicleClass, setVehicleClass] = useState('economy'); // 'economy', 'premium', 'suv'

  // Route calculations
  const [routeDetails, setRouteDetails] = useState({ distance: 0, duration: 0, fare: 2.0 });
  const [calculating, setCalculating] = useState(false);

  // Map state tracking
  const [mapTimelineStatus, setMapTimelineStatus] = useState({
    routeFound: false,
    fareEstimated: false,
    ready: false
  });

  // Recent/quick locations selection
  const recentLocations = [
    { name: '🏠 Home', address: 'AEON Mall Phnom Penh, Sothearos Blvd, Phnom Penh', lat: 11.5492, lng: 104.9300 },
    { name: '🏢 Office', address: 'CADT Innovation Center, National Road 6A, Phnom Penh', lat: 11.6247, lng: 104.9126 },
    { name: '✈ Airport', address: 'Phnom Penh International Airport (PNH), Russian Blvd, Phnom Penh', lat: 11.5466, lng: 104.8442 }
  ];

  // Helper pricing calculation using DB config values
  const calculateVehiclePricing = (distance, duration, type) => {
    let base = 1.50;
    let perKm = 0.70;
    let perMin = 0.05;

    if (type === 'premium') {
      base = 2.50;
      perKm = 1.00;
      perMin = 0.08;
    } else if (type === 'suv') {
      base = 3.00;
      perKm = 1.20;
      perMin = 0.10;
    }

    const calculated = base + (distance * perKm) + (duration * perMin);
    return parseFloat(Math.max(2.00, calculated).toFixed(2));
  };

  const calculateHaversineFallback = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    const estDistance = R * c * 1.3;
    const estDuration = estDistance * 2.5;
    
    return {
      distance: estDistance,
      duration: estDuration,
    };
  };

  // Get current position (Use Current Location feature)
  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }
    setCalculating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setPickupCoords({ lat: latitude, lng: longitude });
        
        // Reverse geocode to get textual address
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          setForm(f => ({ ...f, pickup_location: data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }));
        } catch (err) {
          setForm(f => ({ ...f, pickup_location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }));
        }
        setCalculating(false);
      },
      () => {
        setError('Unable to fetch your current location. Please type manually.');
        setCalculating(false);
      }
    );
  };

  // Update schedule time based on preset changes
  useEffect(() => {
    const now = new Date();
    if (timeSelection === 'now') {
      setForm((f) => ({ ...f, pickup_time: now.toISOString().slice(0, 16) }));
    } else if (timeSelection === '30m') {
      const minutes30 = new Date(now.getTime() + 30 * 60000);
      setForm((f) => ({ ...f, pickup_time: minutes30.toISOString().slice(0, 16) }));
    } else if (timeSelection === 'tomorrow') {
      const tomorrow = new Date(now.setDate(now.getDate() + 1));
      tomorrow.setHours(8, 0, 0, 0); // 8:00 AM
      setForm((f) => ({ ...f, pickup_time: tomorrow.toISOString().slice(0, 16) }));
    }
  }, [timeSelection]);

  // Fetch route and distance estimates
  useEffect(() => {
    if (!pickupCoords || !dropoffCoords) {
      setMapTimelineStatus({ routeFound: false, fareEstimated: false, ready: false });
      return;
    }

    const fetchRoute = async () => {
      setCalculating(true);
      setError('');
      setMapTimelineStatus(prev => ({ ...prev, routeFound: true }));
      
      try {
        const { data } = await estimateBookingFare({
          pickup_lat: pickupCoords.lat,
          pickup_lng: pickupCoords.lng,
          dropoff_lat: dropoffCoords.lat,
          dropoff_lng: dropoffCoords.lng,
          booking_type: 'city_ride',
          vehicle_type: mapVehicleClassToType(vehicleClass)
        });
        
        const dist = data.data.distance_km;
        const dur = data.data.duration_mins;
        
        setRouteDetails({
          distance: dist,
          duration: dur,
          fare: calculateVehiclePricing(dist, dur, vehicleClass)
        });
        setMapTimelineStatus(prev => ({ ...prev, fareEstimated: true, ready: true }));
      } catch (err) {
        console.warn('Estimation API failed, using client-side fallback:', err);
        const fallback = calculateHaversineFallback(
          pickupCoords.lat,
          pickupCoords.lng,
          dropoffCoords.lat,
          dropoffCoords.lng
        );
        setRouteDetails({
          distance: fallback.distance,
          duration: fallback.duration,
          fare: calculateVehiclePricing(fallback.distance, fallback.duration, vehicleClass)
        });
        setMapTimelineStatus(prev => ({ ...prev, fareEstimated: true, ready: true }));
      } finally {
        setCalculating(false);
      }
    };

    fetchRoute();
  }, [pickupCoords, dropoffCoords]);

  // Recalculate fare when vehicle class changes
  useEffect(() => {
    if (routeDetails.distance > 0) {
      setRouteDetails(prev => ({
        ...prev,
        fare: calculateVehiclePricing(prev.distance, prev.duration, vehicleClass)
      }));
    }
  }, [vehicleClass]);

  // Submit and book ride
  const handleFinalSubmit = async () => {
    setShowConfirmModal(false);
    setLoading(true);
    setError('');

    // Simulated premium booking creation phases
    try {
      setLoadingPhase('Finding Best Route...');
      await new Promise(resolve => setTimeout(resolve, 800));

      setLoadingPhase('Calculating Fare...');
      await new Promise(resolve => setTimeout(resolve, 600));

      setLoadingPhase('Finding Available Driver...');
      await new Promise(resolve => setTimeout(resolve, 800));

      const { data } = await createBooking({
        ...form,
        booking_type: 'city_ride',
        pickup_lat: pickupCoords?.lat,
        pickup_lng: pickupCoords?.lng,
        dropoff_lat: dropoffCoords?.lat,
        dropoff_lng: dropoffCoords?.lng,
        total_fare: routeDetails.fare,
        distance_km: routeDetails.distance,
        duration_mins: routeDetails.duration,
        vehicle_type: mapVehicleClassToType(vehicleClass),
        notes: `[Vehicle: ${vehicleClass.toUpperCase()}] ${form.notes}`
      });

      setCreatedBookingId(data.data.id);
      setIsSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
      setLoadingPhase('');
    }
  };

  // Render Success Page
  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 animate-fade-in text-center">
        <div className="card-luxury p-8 flex flex-col items-center gap-6 border-gold/20">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center animate-bounce">
            <Sparkles className="h-10 w-10 text-emerald-400" />
          </div>
          
          <div>
            <h2 className="text-3xl font-serif font-black text-gold">🎉 Ride Confirmed</h2>
            <p className="text-neutral-400 text-sm mt-1">Your driver is on the way to pick you up</p>
          </div>

          <div className="w-full bg-neutral-950 p-6 rounded-xl border border-neutral-900 grid grid-cols-2 gap-6 text-left my-2">
            <div>
              <p className="text-neutral-500 text-[10px] uppercase font-bold tracking-wider">Driver Assigned</p>
              <p className="text-white font-bold text-lg mt-0.5">
                {vehicleClass === 'economy' ? 'Dara Chan' : 'Sophea Lim'}
              </p>
              <p className="text-[#BFA76A] text-xs font-semibold">
                {vehicleClass === 'economy' ? '★ 4.90 Rating' : '★ 4.95 Rating'}
              </p>
            </div>
            <div>
              <p className="text-neutral-500 text-[10px] uppercase font-bold tracking-wider">Vehicle Details</p>
              <p className="text-white font-bold text-lg mt-0.5">
                {vehicleClass === 'economy' ? 'Toyota Camry' : vehicleClass === 'premium' ? 'Toyota Fortuner' : 'Toyota Alphard'}
              </p>
              <p className="text-[#BFA76A] text-xs font-mono font-bold">
                Plate: {vehicleClass === 'economy' ? 'PP-1234A' : vehicleClass === 'premium' ? 'PP-5678B' : 'PP-9988C'}
              </p>
            </div>
            <div className="border-t border-neutral-900 pt-4 col-span-2 flex justify-between items-center text-sm">
              <span className="text-neutral-400">Estimated Arrival (ETA)</span>
              <span className="text-gold font-bold text-base">5 mins away</span>
            </div>
          </div>

          <GoldButton 
            onClick={() => navigate(`/traveler/payment/${createdBookingId}`)}
            className="w-full py-4 text-base tracking-wide flex items-center justify-center gap-2"
          >
            <span>Proceed to Driver Tracking & Payment</span>
            <ArrowRight className="h-4 w-4" />
          </GoldButton>
        </div>
      </div>
    );
  }

  // Render Service Hero Card if booking flow has not started
  if (!started) {
    return (
      <div className="max-w-3xl mx-auto py-10 px-4 animate-fade-in">
        <button
          onClick={() => navigate('/traveler')}
          className="group flex w-fit items-center gap-2 text-sm text-neutral-400 hover:text-gold mb-6 transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
          <span>Back to Home</span>
        </button>

        <div className="card-luxury p-10 border border-gold/15 bg-gradient-to-b from-[#121212] to-[#0d0d0d] flex flex-col gap-8 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 glow-spot" />
          
          <div className="flex flex-col gap-3 relative z-10">
            <span className="w-fit px-3 py-1 bg-gold/10 border border-gold/25 rounded-full text-xs text-gold font-bold uppercase tracking-wider">
              Intra-City Taxi Service
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-black text-white tracking-wide">
              🚖 City Ride
            </h1>
            <p className="text-neutral-400 text-lg leading-relaxed max-w-xl font-light">
              Fast, affordable, and professional rides within your city. Average pickup time across Cambodia is just <span className="text-white font-semibold">3-5 minutes</span>.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 border-t border-b border-neutral-900 py-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shrink-0">
                <Check className="h-4 w-4" />
              </div>
              <span className="text-xs font-semibold text-neutral-300">Live Fare Estimate</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shrink-0">
                <Check className="h-4 w-4" />
              </div>
              <span className="text-xs font-semibold text-neutral-300">Instant Booking</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shrink-0">
                <Check className="h-4 w-4" />
              </div>
              <span className="text-xs font-semibold text-neutral-300">Professional Drivers</span>
            </div>
          </div>

          <div className="relative z-10">
            <GoldButton
              onClick={() => setStarted(true)}
              className="w-full md:w-auto px-8 py-4 text-base font-bold tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
            >
              Start Booking
            </GoldButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto px-4 relative">
      
      {/* Page Navigation & Headers */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <button
          onClick={() => setStarted(false)}
          className="group flex items-center gap-2 text-sm text-neutral-400 hover:text-gold transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
          <span>Exit Ride Booking</span>
        </button>

        {/* Step Wizard Indicator */}
        <div className="flex items-center gap-3 bg-[#111] border border-neutral-900 px-4 py-2 rounded-2xl shadow-inner">
          <button 
            onClick={() => step > 1 && setStep(1)}
            className={`flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider transition-colors duration-150 ${step === 1 ? 'text-gold' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            <span>① Route</span>
          </button>
          <ChevronRight className="h-3 w-3 text-neutral-800" />
          <button 
            disabled={!pickupCoords || !dropoffCoords}
            onClick={() => step > 2 && setStep(2)}
            className={`flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider transition-colors duration-150 ${step === 2 ? 'text-gold' : 'text-neutral-500 hover:text-neutral-300 disabled:opacity-50'}`}
          >
            <span>② Schedule</span>
          </button>
          <ChevronRight className="h-3 w-3 text-neutral-800" />
          <button 
            disabled={!pickupCoords || !dropoffCoords || !form.pickup_time}
            onClick={() => setStep(3)}
            className={`flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider transition-colors duration-150 ${step === 3 ? 'text-gold' : 'text-neutral-500 hover:text-neutral-300 disabled:opacity-50'}`}
          >
            <span>③ Review</span>
          </button>
        </div>
      </div>

      <PageHeader 
        title="City Ride Booking" 
        subtitle="Route, Schedule, and Confirm your journey"
      />

      {error && (
        <div className="text-red-400 text-sm bg-red-950/20 border border-red-900/40 p-4 rounded-xl flex items-center gap-2 animate-shake">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Main Multi-Step Form Layout */}
      <div className="grid lg:grid-cols-5 gap-8 items-start mb-24">
        
        {/* Step Wizard Container (Col Span 3) */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          
          {/* STEP 1: ROUTE & VEHICLE DETAILS */}
          {step === 1 && (
            <div className="card border border-gold/15 bg-[#121212] p-6 flex flex-col gap-6 rounded-2xl shadow-xl transition-all duration-300">
              
              <div className="border-b border-neutral-900 pb-3 flex justify-between items-center">
                <h3 className="font-bold text-gold uppercase tracking-wider text-xs font-serif flex items-center gap-2">
                  <Compass className="h-4 w-4" /> 1. Ride Route Details
                </h3>
                <span className="text-[10px] text-neutral-500 font-medium">Step 1 of 3</span>
              </div>

              {/* Map View */}
              <div className="rounded-2xl overflow-hidden border border-neutral-900">
                <MapPicker
                  pickupCoords={pickupCoords}
                  dropoffCoords={dropoffCoords}
                  onSelectPickup={(addr, coords) => {
                    setForm((f) => ({ ...f, pickup_location: addr }));
                    setPickupCoords(coords);
                  }}
                  onSelectDropoff={(addr, coords) => {
                    setForm((f) => ({ ...f, dropoff_location: addr }));
                    setDropoffCoords(coords);
                  }}
                />
              </div>

              {/* Address Inputs with Icons */}
              <div className="flex flex-col gap-4">
                
                {/* Pickup Address Input */}
                <div className="flex flex-col gap-1.5 relative">
                  <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-emerald-500" /> Pickup Location
                  </label>
                  <div className="relative">
                    <input 
                      className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl pl-4 pr-32 py-3 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition duration-300" 
                      placeholder="Pin on map or select recent below..." 
                      required
                      value={form.pickup_location} 
                      onChange={(e) => setForm({ ...form, pickup_location: e.target.value })} 
                    />
                    <button
                      type="button"
                      onClick={useCurrentLocation}
                      className="absolute right-2 top-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-[10px] text-gold border border-neutral-800 font-bold transition-all flex items-center gap-1"
                    >
                      <Navigation className="h-2.5 w-2.5" /> GPS Location
                    </button>
                  </div>

                  {/* Empty State / Helpful tip */}
                  {!pickupCoords && (
                    <div className="mt-1.5 text-neutral-500 text-[11px] bg-neutral-950/40 p-2 rounded-lg border border-neutral-900 flex items-center gap-1.5">
                      <span>📍</span> Start by selecting a pickup point on the map or click GPS.
                    </div>
                  )}

                  {/* Recent Locations preset buttons */}
                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase mr-1">Quick Select:</span>
                    {recentLocations.map((loc, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setForm(f => ({ ...f, pickup_location: loc.address }));
                          setPickupCoords({ lat: loc.lat, lng: loc.lng });
                        }}
                        className="text-[11px] px-2.5 py-1 rounded-full bg-[#181818] border border-neutral-900 hover:border-gold/30 text-neutral-300 hover:text-white transition duration-200"
                      >
                        {loc.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dropoff Address Input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-rose-500" /> Destination Address
                  </label>
                  <input 
                    className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition duration-300" 
                    placeholder="Pin destination on the map..." 
                    required
                    value={form.dropoff_location} 
                    onChange={(e) => setForm({ ...form, dropoff_location: e.target.value })} 
                  />
                </div>
              </div>

              {/* Vehicle Selection Cards */}
              <div className="flex flex-col gap-2 mt-2">
                <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">
                  Select Ride Class
                </label>
                <div className="grid md:grid-cols-3 gap-4">
                  {/* Economy Card */}
                  <button
                    type="button"
                    onClick={() => setVehicleClass('economy')}
                    className={`flex flex-col text-left p-4 rounded-xl border transition-all duration-200 ${
                      vehicleClass === 'economy'
                        ? 'bg-gold/5 border-gold shadow-md shadow-gold/5'
                        : 'bg-[#0B0B0B] border-neutral-900 hover:border-neutral-800'
                    }`}
                  >
                    <div className="flex justify-between items-start w-full gap-4">
                      <div className="h-12 w-20 overflow-hidden rounded-lg bg-neutral-950 border border-neutral-900/60 flex items-center justify-center shrink-0">
                        <img src="/images/prius_car.jpg" alt="Economy" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[10px] bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded text-neutral-400 font-bold uppercase">Eco</span>
                    </div>
                    <span className="font-bold text-white text-sm mt-3">Economy</span>
                    <span className="text-neutral-500 text-[11px] mt-0.5">Toyota Camry • 2-4 Seats</span>
                    <span className="text-gold font-bold mt-2 text-base">
                      {calculating ? '...' : `$${calculateVehiclePricing(routeDetails.distance, routeDetails.duration, 'economy').toFixed(2)}`}
                    </span>
                  </button>

                  {/* Premium Card */}
                  <button
                    type="button"
                    onClick={() => setVehicleClass('premium')}
                    className={`flex flex-col text-left p-4 rounded-xl border transition-all duration-200 ${
                      vehicleClass === 'premium'
                        ? 'bg-gold/5 border-gold shadow-md shadow-gold/5'
                        : 'bg-[#0B0B0B] border-neutral-900 hover:border-neutral-800'
                    }`}
                  >
                    <div className="flex justify-between items-start w-full gap-4">
                      <div className="h-12 w-20 overflow-hidden rounded-lg bg-neutral-950 border border-neutral-900/60 flex items-center justify-center shrink-0">
                        <img src="/images/lexus_car.jpg" alt="Premium" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[10px] bg-gold/10 border border-gold/20 px-2 py-0.5 rounded text-gold font-bold uppercase">Luxury</span>
                    </div>
                    <span className="font-bold text-white text-sm mt-3">Premium</span>
                    <span className="text-neutral-500 text-[11px] mt-0.5">Toyota Fortuner • 6 Seats</span>
                    <span className="text-gold font-bold mt-2 text-base">
                      {calculating ? '...' : `$${calculateVehiclePricing(routeDetails.distance, routeDetails.duration, 'premium').toFixed(2)}`}
                    </span>
                  </button>

                  {/* SUV Card */}
                  <button
                    type="button"
                    onClick={() => setVehicleClass('suv')}
                    className={`flex flex-col text-left p-4 rounded-xl border transition-all duration-200 ${
                      vehicleClass === 'suv'
                        ? 'bg-gold/5 border-gold shadow-md shadow-gold/5'
                        : 'bg-[#0B0B0B] border-neutral-900 hover:border-neutral-800'
                    }`}
                  >
                    <div className="flex justify-between items-start w-full gap-4">
                      <div className="h-12 w-20 overflow-hidden rounded-lg bg-neutral-950 border border-neutral-900/60 flex items-center justify-center shrink-0">
                        <img src="/images/luxury_van.jpg" alt="SUV" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[10px] bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded text-neutral-400 font-bold uppercase">6 Seats</span>
                    </div>
                    <span className="font-bold text-white text-sm mt-3">SUV / Van</span>
                    <span className="text-neutral-500 text-[11px] mt-0.5">Toyota Alphard • VIP Van</span>
                    <span className="text-gold font-bold mt-2 text-base">
                      {calculating ? '...' : `$${calculateVehiclePricing(routeDetails.distance, routeDetails.duration, 'suv').toFixed(2)}`}
                    </span>
                  </button>
                </div>
              </div>

              {/* Navigation Action */}
              <GoldButton
                type="button"
                disabled={!pickupCoords || !dropoffCoords || calculating}
                onClick={() => setStep(2)}
                className="w-full py-4 text-base tracking-wide flex items-center justify-center gap-2 mt-4"
              >
                <span>Continue to Schedule</span>
                <ArrowRight className="h-4 w-4" />
              </GoldButton>
            </div>
          )}

          {/* STEP 2: RIDE SCHEDULE */}
          {step === 2 && (
            <div className="card border border-gold/15 bg-[#121212] p-6 flex flex-col gap-6 rounded-2xl shadow-xl transition-all duration-300">
              
              <div className="border-b border-neutral-900 pb-3 flex justify-between items-center">
                <h3 className="font-bold text-gold uppercase tracking-wider text-xs font-serif flex items-center gap-2">
                  <Clock className="h-4 w-4" /> 2. Ride Scheduling
                </h3>
                <span className="text-[10px] text-neutral-500 font-medium">Step 2 of 3</span>
              </div>

              {/* Quick Time Selection Toggles */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">
                  Choose Departure Time
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button
                    type="button"
                    onClick={() => setTimeSelection('now')}
                    className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all duration-200 ${
                      timeSelection === 'now'
                        ? 'bg-gold/5 border-gold text-gold'
                        : 'bg-[#0B0B0B] border-neutral-900 text-neutral-400 hover:text-white'
                    }`}
                  >
                    ○ Now
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimeSelection('30m')}
                    className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all duration-200 ${
                      timeSelection === '30m'
                        ? 'bg-gold/5 border-gold text-gold'
                        : 'bg-[#0B0B0B] border-neutral-900 text-neutral-400 hover:text-white'
                    }`}
                  >
                    ○ In 30 mins
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimeSelection('tomorrow')}
                    className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all duration-200 ${
                      timeSelection === 'tomorrow'
                        ? 'bg-gold/5 border-gold text-gold'
                        : 'bg-[#0B0B0B] border-neutral-900 text-neutral-400 hover:text-white'
                    }`}
                  >
                    ○ Tomorrow Morning
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimeSelection('custom')}
                    className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all duration-200 ${
                      timeSelection === 'custom'
                        ? 'bg-gold/5 border-gold text-gold'
                        : 'bg-[#0B0B0B] border-neutral-900 text-neutral-400 hover:text-white'
                    }`}
                  >
                    ○ Custom
                  </button>
                </div>
              </div>

              {/* Show datepicker only when custom is selected */}
              {timeSelection === 'custom' && (
                <div className="flex flex-col gap-1.5 animate-fade-in">
                  <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">
                    Choose Custom Date & Time
                  </label>
                  <input 
                    className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition duration-300" 
                    type="datetime-local" 
                    required
                    value={form.pickup_time} 
                    onChange={(e) => setForm({ ...form, pickup_time: e.target.value })} 
                  />
                </div>
              )}

              {/* Show calculated scheduled time for quick confirmation */}
              {timeSelection !== 'custom' && (
                <div className="bg-[#0B0B0B] border border-neutral-900 p-4 rounded-xl text-xs text-neutral-300 flex items-center justify-between">
                  <span className="font-semibold text-neutral-500 uppercase tracking-wide">Selected Departure</span>
                  <span className="font-bold text-white text-right">
                    {new Date(form.pickup_time).toLocaleString()}
                  </span>
                </div>
              )}

              {/* Notes */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Special Notes (Optional)</label>
                <textarea 
                  className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition duration-300" 
                  placeholder="E.g. I have 2 large luggage bags, please pick me up at entrance A." 
                  rows={3}
                  value={form.notes} 
                  onChange={(e) => setForm({ ...form, notes: e.target.value })} 
                />
              </div>

              {/* Navigation Actions */}
              <div className="grid grid-cols-3 gap-4 mt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-3.5 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white rounded-xl font-bold transition-all text-sm"
                >
                  ← Back
                </button>
                <GoldButton
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!form.pickup_time}
                  className="col-span-2 py-3.5 text-base tracking-wide flex items-center justify-center gap-2"
                >
                  <span>Review Details</span>
                  <ArrowRight className="h-4 w-4" />
                </GoldButton>
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW DETAILS */}
          {step === 3 && (
            <div className="card border border-gold/15 bg-[#121212] p-6 flex flex-col gap-6 rounded-2xl shadow-xl transition-all duration-300">
              
              <div className="border-b border-neutral-900 pb-3 flex justify-between items-center">
                <h3 className="font-bold text-gold uppercase tracking-wider text-xs font-serif flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" /> 3. Review & Confirm Booking
                </h3>
                <span className="text-[10px] text-neutral-500 font-medium">Step 3 of 3</span>
              </div>

              {/* Address Visual flow */}
              <div className="bg-[#0B0B0B] border border-neutral-900/60 p-5 rounded-2xl flex flex-col gap-4 relative">
                <h4 className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Visual Route Line</h4>
                <div className="flex gap-4">
                  <div className="flex flex-col items-center py-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border border-emerald-400 flex-shrink-0 shadow-sm shadow-emerald-500/50"></span>
                    <div className="w-[1.5px] flex-1 border-l-2 border-dashed border-neutral-800 my-1"></div>
                    <span className="w-3.5 h-3.5 rounded-full bg-rose-500 border border-rose-400 flex-shrink-0 shadow-sm shadow-rose-500/50"></span>
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-0.5 gap-4">
                    <div>
                      <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Pickup</p>
                      <p className="text-white font-medium text-xs break-words mt-0.5">{form.pickup_location}</p>
                    </div>
                    {routeDetails.distance > 0 && (
                      <div className="text-[10px] text-gold font-bold bg-gold/5 border border-gold/10 py-1 px-2.5 rounded-lg w-fit">
                        {routeDetails.distance.toFixed(1)} km distance
                      </div>
                    )}
                    <div>
                      <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Dropoff</p>
                      <p className="text-white font-medium text-xs break-words mt-0.5">{form.dropoff_location}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live search feedback list */}
              <div className="flex flex-col gap-2 bg-[#0B0B0B]/40 p-4 rounded-xl border border-neutral-900">
                <h4 className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Map Booking Timeline</h4>
                <div className="flex flex-col gap-2 mt-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-emerald-500 text-sm">✓</span>
                    <span className="text-neutral-400">Route Found</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-emerald-500 text-sm">✓</span>
                    <span className="text-neutral-400">Fare Estimated</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-gold">
                    <span className="animate-pulse">●</span>
                    <span>Ready to Book</span>
                  </div>
                </div>
              </div>

              {/* Simulated Driver arrival details */}
              <div className="bg-gold/5 border border-gold/10 p-4 rounded-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                  <User className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-[#BFA76A] uppercase font-bold tracking-wider">Driver Availability</p>
                  <p className="text-xs text-white font-bold mt-0.5">Nearest driver 1.2 km away</p>
                  <p className="text-[11px] text-neutral-400">Can arrive in approx. 5 mins</p>
                </div>
              </div>

              {/* Navigation Actions */}
              <div className="grid grid-cols-3 gap-4 mt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-3.5 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white rounded-xl font-bold transition-all text-sm"
                >
                  ← Back
                </button>
                <GoldButton
                  type="button"
                  onClick={() => setShowConfirmModal(true)}
                  className="col-span-2 py-3.5 text-base tracking-wide flex items-center justify-center gap-2"
                >
                  <span>Book Ride</span>
                  <ArrowRight className="h-4 w-4" />
                </GoldButton>
              </div>
            </div>
          )}
        </div>

        {/* Side Summary Panel (Col Span 2) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          
          {/* Rich Summary Card */}
          <div className="card border border-gold/15 bg-[#121212] p-6 rounded-2xl flex flex-col gap-5 shadow-2xl">
            <h3 className="font-bold text-gold uppercase tracking-wider text-xs border-b border-neutral-900 pb-3 font-serif flex items-center justify-between">
              <span>🚖 Ride Summary</span>
              <span className="text-[9px] bg-gold/10 px-2 py-0.5 rounded text-gold border border-gold/20 font-sans tracking-wide">
                {vehicleClass.toUpperCase()}
              </span>
            </h3>
            
            <div className="flex flex-col gap-4">
              
              {/* Giant Fare */}
              <div className="flex justify-between items-center bg-[#0B0B0B] p-5 rounded-xl border border-gold/10">
                <div>
                  <span className="text-[#A3A3A3] text-[10px] font-bold uppercase tracking-wider block">Estimated Price</span>
                  <span className="text-[11px] text-neutral-500 font-medium">Economy Class</span>
                </div>
                <span className="text-3xl font-black text-gold">
                  {calculating ? '...' : `$${routeDetails.fare.toFixed(2)}`}
                </span>
              </div>

              {/* Location points list */}
              <div className="text-xs flex flex-col gap-3 py-2 border-b border-neutral-900">
                <div className="flex items-start gap-2.5">
                  <span className="text-emerald-500 font-bold mt-0.5 shrink-0 text-sm">📍</span>
                  <div>
                    <span className="text-neutral-500 text-[10px] uppercase font-bold tracking-wider block">Pickup location</span>
                    <span className="text-white font-medium break-all">{form.pickup_location || 'Not selected'}</span>
                  </div>
                </div>
                
                <div className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold mt-0.5 shrink-0 text-sm">🏁</span>
                  <div>
                    <span className="text-neutral-500 text-[10px] uppercase font-bold tracking-wider block">Destination location</span>
                    <span className="text-white font-medium break-all">{form.dropoff_location || 'Not selected'}</span>
                  </div>
                </div>
              </div>

              {/* Ride stats */}
              {routeDetails.distance > 0 && (
                <div className="grid grid-cols-2 gap-4 text-xs bg-[#0B0B0B]/40 p-4 rounded-xl border border-neutral-900 animate-fade-in">
                  <div>
                    <p className="text-neutral-500 uppercase font-semibold text-[10px] tracking-wider flex items-center gap-1">📏 Distance</p>
                    <p className="text-white font-bold mt-1 text-base">{routeDetails.distance.toFixed(1)} km</p>
                  </div>
                  <div>
                    <p className="text-neutral-500 uppercase font-semibold text-[10px] tracking-wider flex items-center gap-1">🕒 Duration</p>
                    <p className="text-white font-bold mt-1 text-base">{Math.round(routeDetails.duration)} mins</p>
                  </div>
                </div>
              )}
            </div>

            {/* Trust Section */}
            <div className="text-[#A3A3A3] text-[11px] flex flex-col gap-2.5 pt-2 border-t border-neutral-900">
              <span className="font-bold text-neutral-500 uppercase tracking-widest text-[9px] block mb-0.5">Trust & Safety</span>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-gold" />
                <span className="leading-relaxed font-light">Professional local drivers</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-gold" />
                <span className="leading-relaxed font-light">Fixed pricing with no hidden charges</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-gold" />
                <span className="leading-relaxed font-light">24/7 dedicated traveler support</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-gold" />
                <span className="leading-relaxed font-light">Secure and safe online checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="card bg-[#121212] border border-gold/20 rounded-2xl max-w-md w-full p-6 flex flex-col gap-6 relative shadow-2xl">
            <div className="border-b border-neutral-900 pb-3">
              <h3 className="text-lg font-serif font-black text-gold">Confirm Your Booking</h3>
              <p className="text-neutral-400 text-xs mt-0.5">Review details before sending to dispatcher</p>
            </div>

            <div className="flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1">
                <span className="text-neutral-500 uppercase text-[9px] font-bold">Pickup location</span>
                <span className="text-white font-semibold break-words">{form.pickup_location}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-neutral-500 uppercase text-[9px] font-bold">Destination location</span>
                <span className="text-white font-semibold break-words">{form.dropoff_location}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-neutral-500 uppercase text-[9px] font-bold">Departure Time</span>
                  <span className="text-white font-semibold">
                    {new Date(form.pickup_time).toLocaleString()}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-neutral-500 uppercase text-[9px] font-bold">Vehicle Class</span>
                  <span className="text-gold font-semibold capitalize">{vehicleClass}</span>
                </div>
              </div>
              <div className="border-t border-neutral-900 pt-3 flex justify-between items-center text-sm bg-neutral-950 p-3 rounded-lg">
                <span className="text-neutral-400 font-bold">Total Fare</span>
                <span className="text-gold font-extrabold text-base">${routeDetails.fare.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border border-neutral-800 text-neutral-400 hover:text-white rounded-lg text-xs font-bold transition duration-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="px-4 py-2 bg-gold hover:bg-gold/90 text-black rounded-lg text-xs font-bold transition duration-200"
              >
                Book Ride
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simulated dispatch loading state */}
      {loading && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center z-50 p-4 animate-fade-in">
          <div className="flex flex-col items-center gap-4 text-center max-w-xs">
            <div className="w-12 h-12 rounded-full border-4 border-gold/10 border-t-gold animate-spin"></div>
            <div>
              <p className="text-white font-bold tracking-wide">{loadingPhase}</p>
              <p className="text-neutral-500 text-[11px] mt-1">Connecting to Phnom Penh dispatch service...</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
