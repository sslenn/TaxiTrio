import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/axios';
import PageHeader from '../../components/PageHeader';
import GoldButton from '../../components/GoldButton';
import { MapPin, Flag, Plus, Trash2, Sparkles, Sliders, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Import concierge components
import AIConciergeHero from '../../components/concierge/AIConciergeHero';
import AIConversation from '../../components/concierge/AIConversation';
import AIThinking from '../../components/concierge/AIThinking';
import TripRecommendation from '../../components/concierge/TripRecommendation';
import GeneratedTimeline from '../../components/concierge/GeneratedTimeline';
import EditableRouteBuilder from '../../components/concierge/EditableRouteBuilder';
import TripSummary from '../../components/concierge/TripSummary';
import SmartSuggestionButtons from '../../components/concierge/SmartSuggestionButtons';

// Import concierge database
import { CONCIERGE_DESTINATIONS } from '../../data/conciergeData';

export default function CustomTripRequest() {
  const navigate = useNavigate();

  // Tab state: 'ai' (primary AI concierge) or 'manual' (fallback route planner)
  const [activeTab, setActiveTab] = useState('ai');

  // Unified Form State
  const [form, setForm] = useState({
    origin: '',
    destination: '',
    stops: [],
    travel_date: '',
    travel_time: '08:00',
    passengers: 1,
    special_requests: '',
    telegram_contact: '',
    is_urgent_requested: false,
    vehicle: 'No Preference'
  });

  // AI-Specific States
  const [prompt, setPrompt] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [budgetSelect, setBudgetSelect] = useState('Any Budget');
  const [durationSelect, setDurationSelect] = useState('1 Day');
  const [passengersSelect, setPassengersSelect] = useState(1);
  const [vehicleSelect, setVehicleSelect] = useState('No Preference');

  const [isThinking, setIsThinking] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [timeline, setTimeline] = useState([]);

  // Submission States
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync passengers count from selector to form
  useEffect(() => {
    setForm(f => ({ ...f, passengers: passengersSelect }));
  }, [passengersSelect]);

  // Synchronize generated timeline instantly when stops, origin, destination or recommendation changes
  useEffect(() => {
    if (hasGenerated && recommendation) {
      const computedTimeline = generateItineraryTimeline(
        form.origin,
        form.stops,
        form.destination,
        form.travel_time,
        recommendation
      );
      setTimeline(computedTimeline);
    }
  }, [form.stops, form.origin, form.destination, form.travel_time, hasGenerated, recommendation]);

  // Detector for province selection based on prompt keywords
  const detectProvinceFromPrompt = (text = '') => {
    const t = text.toLowerCase();
    if (t.includes('peaceful') || t.includes('stressed') || t.includes('pepper') || t.includes('river') || t.includes('bokor') || t.includes('kampot') || t.includes('quiet') || t.includes('relax')) {
      return 'kampot';
    }
    if (t.includes('history') || t.includes('khmer') || t.includes('angkor') || t.includes('temple') || t.includes('siem reap') || t.includes('culture') || t.includes('photography') || t.includes('photo')) {
      return 'siem-reap';
    }
    if (t.includes('beach') || t.includes('island') || t.includes('seafood') || t.includes('sihanoukville') || t.includes('koh rong') || t.includes('coast') || t.includes('romantic') || t.includes('anniversary')) {
      return 'sihanoukville';
    }
    if (t.includes('foodie') || t.includes('phnom penh') || t.includes('royal palace') || t.includes('city') || t.includes('capital') || t.includes('museum') || t.includes('shopping') || t.includes('food')) {
      return 'phnom-penh';
    }
    if (t.includes('waterfall') || t.includes('wildlife') || t.includes('elephant') || t.includes('nature') || t.includes('trekking') || t.includes('cold') || t.includes('mondulkiri') || t.includes('adventure')) {
      return 'mondulkiri';
    }
    return 'kampot'; // default fallback
  };

  // Generate timeline entries sequentially
  const generateItineraryTimeline = (originLoc, stopsList, destLoc, startTime, activeRec) => {
    const list = [];
    let currentHour = 8;
    let currentMinute = 0;
    
    if (startTime) {
      const parts = startTime.split(':');
      if (parts.length === 2) {
        currentHour = parseInt(parts[0]) || 8;
        currentMinute = parseInt(parts[1]) || 0;
      }
    }

    const formatTime = (h, m) => {
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    };

    // 1. Hotel Pickup
    list.push({
      time: formatTime(currentHour, currentMinute),
      title: 'Hotel Pickup',
      location: originLoc || 'Your Pickup Point',
      duration: '15 mins',
      description: 'Meet your professional chauffeur at your lobby. Refreshing bottled water and cold towels provided.',
      image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=600&q=80'
    });

    currentHour += 1; // Transit time to first stop

    // 2. Midpoints
    stopsList.forEach((stopName, idx) => {
      const dbAttr = activeRec?.attractions?.find(a => a.title.toLowerCase() === stopName.toLowerCase()) || 
                     activeRec?.attractions?.[idx] || {
                       title: stopName,
                       category: 'Sightseeing',
                       stay: '1.5 hrs',
                       time: 'Transit',
                       image: '/images/gallery_angkor1.jpg',
                       description: 'Bespoke stopover point tailored to your route preferences.'
                     };

      list.push({
        time: formatTime(currentHour, currentMinute),
        title: stopName,
        location: stopName,
        duration: dbAttr.stay || '1.5 hrs',
        description: dbAttr.description || 'Enjoy a bespoke sightseeing stopover on your private route.',
        image: dbAttr.image || '/images/gallery_angkor1.jpg'
      });

      currentHour += 2; // Incremental travel & sightseeing time
      if (currentHour >= 24) currentHour -= 24;
    });

    // 3. Lunch Slot (Inserted in the middle if there are 3+ stops)
    if (stopsList.length >= 3) {
      const midIdx = Math.floor(stopsList.length / 2) + 1;
      const lunchTime = formatTime((currentHour - 3) < 0 ? 12 : currentHour - 3, currentMinute);
      list.splice(midIdx, 0, {
        time: lunchTime,
        title: activeRec?.restaurant?.name || 'Local Luncheon',
        location: activeRec?.restaurant?.name || 'Curated Restaurant',
        duration: '1 hr',
        description: activeRec?.restaurant?.reason || 'Enjoy premium local cuisine selected by your concierge.',
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80'
      });
    }

    // 4. Return Hotel
    list.push({
      time: formatTime(currentHour, currentMinute),
      title: 'Return Hotel / Drop-off',
      location: destLoc || 'Your Drop-off Point',
      duration: 'Flexible',
      description: 'Chauffeur drops you off safely at your final destination. End of bespoke trip request service.',
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80'
    });

    return list;
  };

  // Click Suggestion Chip & Auto-update prompt
  const handleSelectInterest = (interestText) => {
    setSelectedInterests((prev) => {
      const exists = prev.includes(interestText);
      const next = exists 
        ? prev.filter((item) => item !== interestText) 
        : [...prev, interestText];
      
      if (next.length > 0) {
        setPrompt(`I want to request a custom trip highlighting: ${next.join(', ')}.`);
      } else {
        setPrompt('');
      }
      return next;
    });
  };

  // Generate My Trip Action
  const handleGenerateTrip = () => {
    if (!prompt.trim()) return;
    setIsThinking(true);
    setHasGenerated(false);
  };

  // Completed AI processing
  const handleThinkingComplete = () => {
    const selectedKey = detectProvinceFromPrompt(prompt);
    const dbRec = CONCIERGE_DESTINATIONS[selectedKey];

    // Populate recommendation & form state
    setRecommendation(dbRec);
    
    // Set travel date to tomorrow if empty
    let nextDate = form.travel_date;
    if (!nextDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      nextDate = tomorrow.toISOString().split('T')[0];
    }

    setForm({
      origin: 'Phnom Penh Hotel',
      destination: `${dbRec.province} City Center`,
      stops: dbRec.attractions.map(a => a.title),
      travel_date: nextDate,
      travel_time: '08:00',
      passengers: passengersSelect,
      special_requests: `AI curated route based on preference: "${prompt}"`,
      telegram_contact: form.telegram_contact,
      is_urgent_requested: form.is_urgent_requested,
      vehicle: vehicleSelect !== 'No Preference' ? vehicleSelect : dbRec.vehicle
    });

    setIsThinking(false);
    setHasGenerated(true);
  };

  // Clear fields
  const handleClear = () => {
    setPrompt('');
    setSelectedInterests([]);
    setBudgetSelect('Any Budget');
    setDurationSelect('1 Day');
    setVehicleSelect('No Preference');
    setRecommendation(null);
    setHasGenerated(false);
    setForm({
      origin: '',
      destination: '',
      stops: [],
      travel_date: '',
      travel_time: '08:00',
      passengers: 1,
      special_requests: '',
      telegram_contact: '',
      is_urgent_requested: false,
      vehicle: 'No Preference'
    });
  };

  // Handle Smart Suggestions (Refine Buttons)
  const handleSmartAction = (actionId, label) => {
    setIsThinking(true);
    setHasGenerated(false);

    setTimeout(() => {
      setRecommendation(prev => {
        if (!prev) return prev;
        
        let nextBudget = prev.budget;
        let nextVehicle = prev.vehicle;
        let nextReason = prev.reason;
        let nextStops = [...form.stops];

        if (actionId === 'cheaper') {
          nextBudget = Math.round(dbRecommendInfo().budget * 0.7);
          nextVehicle = 'Sedan';
          nextReason = `Economy optimization applied: Selected standard Sedan class transport and focused on cost-effective regional destinations.`;
        } else if (actionId === 'luxury') {
          nextBudget = Math.round(dbRecommendInfo().budget * 1.7);
          nextVehicle = 'Luxury SUV';
          nextReason = `VIP Luxury refinement: Upgraded vehicle class to premium SUV and added exclusive, high-end private dining.`;
        } else if (actionId === 'more_adventure') {
          nextReason = `Adventure optimization: Rearranged route to prioritize rugged terrain, caves, and scenic lookout treks.`;
        } else if (actionId === 'more_nature') {
          nextReason = `Eco-friendly focus: Emphasized green pepper fields, national parks, and local wildlife experiences.`;
        } else if (actionId === 'romantic') {
          nextReason = `Romantic overlay: Configured sunset cruises, boutique cafe visits, and candlelit spots suitable for couples.`;
        } else if (actionId === 'family') {
          nextReason = `Family-friendly refinement: Selected stops with easy walking paths, child-friendly activities, and dining options.`;
        } else if (actionId === 'historical') {
          nextReason = `Historical emphasis: Focused itinerary entirely on Angkorian temples, national landmarks, and ancient sites.`;
        } else if (actionId === 'food_tour') {
          nextReason = `Foodie exploration: Added pepper tasting, local salt field dining, and specialty evening night market guides.`;
        } else if (actionId === 'hidden_gems') {
          nextReason = `Off-the-beaten-path focus: Selected lesser-known scenic reservoirs and local village experiences to avoid tourists.`;
        }

        // Update form state
        setForm(f => ({
          ...f,
          vehicle: nextVehicle
        }));

        return {
          ...prev,
          budget: nextBudget,
          vehicle: nextVehicle,
          reason: nextReason
        };
      });

      setIsThinking(false);
      setHasGenerated(true);
    }, 1200);
  };

  // Get active db info to calculate budget percentages
  const dbRecommendInfo = () => {
    const key = detectProvinceFromPrompt(prompt);
    return CONCIERGE_DESTINATIONS[key];
  };

  // Submit Itinerary to Backend API
  const handleSubmitBooking = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    setLoading(true);
    setError('');

    // Field Validations
    if (!form.origin.trim() || !form.destination.trim()) {
      setError('Please provide both an Origin Location and a Final Destination.');
      setLoading(false);
      return;
    }
    if (!form.telegram_contact.trim()) {
      setError('A Telegram Username or Phone Contact is required so our coordinator can contact you.');
      setLoading(false);
      return;
    }

    try {
      const stopsToSubmit = form.stops.filter((s) => s.trim() !== '');
      await api.post('/custom-trip-requests', {
        ...form,
        stops: stopsToSubmit
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit booking request. Please check fields.');
    } finally {
      setLoading(false);
    }
  };

  // Manual route planners array actions
  const handleStopChange = (index, value) => {
    const updatedStops = [...form.stops];
    updatedStops[index] = value;
    setForm({ ...form, stops: updatedStops });
  };

  const handleRemoveStop = (index) => {
    const updatedStops = form.stops.filter((_, i) => i !== index);
    setForm({ ...form, stops: updatedStops });
  };

  const handleAddStop = () => {
    setForm({ ...form, stops: [...form.stops, ''] });
  };

  // Reset to original AI recommendations
  const handleResetToAI = () => {
    const key = detectProvinceFromPrompt(prompt);
    const dbRec = CONCIERGE_DESTINATIONS[key];
    setForm(f => ({
      ...f,
      origin: 'Phnom Penh Hotel',
      destination: `${dbRec.province} City Center`,
      stops: dbRec.attractions.map(a => a.title)
    }));
  };

  // Success view
  if (success) return (
    <div className="fixed inset-0 z-[99999] bg-[#0b0b0b]/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md border border-gold/15 bg-[#121212] p-8 rounded-3xl flex flex-col items-center text-center gap-6 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="text-gold font-bold font-serif text-2xl mb-1" style={{ color: 'var(--color-accent, #BFA76A)' }}>Request Submitted</p>
          <p className="text-[#A3A3A3] text-sm leading-relaxed font-light">
            Our concierge desk will review your bespoke itinerary and reply with pricing options and driver assignments.
          </p>
        </div>
        <div className="flex flex-col gap-3 w-full">
          <a 
            href="https://t.me/taxitrio_support" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full text-center px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 text-black border border-transparent shadow-lg shadow-gold/15 flex items-center justify-center gap-1.5 cursor-pointer"
            style={{ backgroundColor: 'var(--color-accent, #BFA76A)' }}
          >
            💬 Chat with Support
          </a>
          <GoldButton onClick={() => navigate('/traveler')} className="w-full py-3" variant="outline">
            Back to Dashboard
          </GoldButton>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-16">
      {/* Back to Home Button */}
      <button
        onClick={() => navigate('/traveler')}
        className="group flex w-fit items-center gap-2 text-sm text-neutral-400 hover:text-gold transition-colors duration-200"
      >
        <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
        <span>Back to Home</span>
      </button>

      <PageHeader 
        title="Custom Trip Request" 
        subtitle="Design your bespoke transportation itinerary across Cambodia"
      />

      {/* Workflow Guidance Card */}
      {activeTab === 'ai' && (
        <div className="bg-[#121212] border border-gold/10 p-5 rounded-2xl flex flex-col md:flex-row md:items-center gap-6 justify-between text-left shadow-lg animate-in fade-in duration-300">
          <div className="flex-1">
            <h4 className="text-xs font-bold text-gold uppercase tracking-wider font-serif mb-1">✨ How It Works</h4>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              Experience our premium digital travel consultant service. Follow these simple steps to request your itinerary:
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 shrink-0 text-[10px] font-sans">
            <div className="flex items-center gap-2 bg-[#0b0b0b] px-3 py-2 rounded-xl border border-white/5 shadow-sm">
              <span className="w-5 h-5 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold font-serif text-[10px] shrink-0">1</span>
              <span className="text-neutral-300 font-medium truncate">Describe Trip</span>
            </div>
            <div className="flex items-center gap-2 bg-[#0b0b0b] px-3 py-2 rounded-xl border border-white/5 shadow-sm">
              <span className="w-5 h-5 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold font-serif text-[10px] shrink-0">2</span>
              <span className="text-neutral-300 font-medium truncate">AI Builds Itin</span>
            </div>
            <div className="flex items-center gap-2 bg-[#0b0b0b] px-3 py-2 rounded-xl border border-white/5 shadow-sm">
              <span className="w-5 h-5 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold font-serif text-[10px] shrink-0">3</span>
              <span className="text-neutral-300 font-medium truncate">Review Recs</span>
            </div>
            <div className="flex items-center gap-2 bg-[#0b0b0b] px-3 py-2 rounded-xl border border-white/5 shadow-sm">
              <span className="w-5 h-5 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold font-serif text-[10px] shrink-0">4</span>
              <span className="text-neutral-300 font-medium truncate">Book Securely</span>
            </div>
          </div>
        </div>
      )}

      {error && (
        <p className="text-red-400 text-sm bg-red-950/20 border border-red-900/40 p-4 rounded-xl text-center z-20">
          {error}
        </p>
      )}

      {/* Premium Tab Bar Control */}
      <div className="flex justify-center border-b border-neutral-900 pb-1">
        <div className="flex bg-[#121212] border border-gold/10 p-1.5 rounded-2xl gap-2">
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'ai'
                ? 'bg-gold text-black shadow-lg shadow-gold/15'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Travel Concierge</span>
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'manual'
                ? 'bg-gold text-black shadow-lg shadow-gold/15'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Manual Route Planner</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'ai' ? (
          /* ==================================================================
             AI CONCIERGE EXPERIENCE
             ================================================================== */
          <motion.div
            key="ai-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-8"
          >
            {/* Split layout: left side inputs/form, right side dynamic panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
              
              {/* Left Column: Form Inputs & Refinements */}
              <div className="lg:col-span-8 flex flex-col gap-8">
                <AIConversation
                  prompt={prompt}
                  setPrompt={setPrompt}
                  budget={budgetSelect}
                  setBudget={setBudgetSelect}
                  duration={durationSelect}
                  setDuration={setDurationSelect}
                  passengers={passengersSelect}
                  setPassengers={setPassengersSelect}
                  vehicle={vehicleSelect}
                  setVehicle={setVehicleSelect}
                  onGenerate={handleGenerateTrip}
                  onClear={handleClear}
                  loading={isThinking}
                  selectedInterests={selectedInterests}
                  onSelectInterest={handleSelectInterest}
                />

                {hasGenerated && recommendation && (
                  <>
                    <EditableRouteBuilder
                      origin={form.origin}
                      setOrigin={(val) => setForm({ ...form, origin: val })}
                      destination={form.destination}
                      setDestination={(val) => setForm({ ...form, destination: val })}
                      stops={form.stops}
                      setStops={(val) => setForm({ ...form, stops: val })}
                      onReset={handleResetToAI}
                    />

                    {/* Booking Coordination */}
                    <div className="bg-[#121212] border border-gold/10 p-6 md:p-8 rounded-3xl flex flex-col gap-5 shadow-lg text-left">
                      <div className="flex items-center gap-3 border-b border-neutral-900 pb-3 mb-1">
                        <span className="w-6 h-6 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold text-xs font-bold font-serif">📝</span>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-serif">Booking Coordination</h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Travel Date</label>
                          <input 
                            className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/60 transition duration-300" 
                            type="date" 
                            required
                            value={form.travel_date} 
                            onChange={(e) => setForm({ ...form, travel_date: e.target.value })} 
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Travel Time</label>
                          <input 
                            className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/60 transition duration-300" 
                            type="time" 
                            required
                            value={form.travel_time} 
                            onChange={(e) => setForm({ ...form, travel_time: e.target.value })} 
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Passengers</label>
                          <input 
                            className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/60 transition duration-300" 
                            type="number" 
                            min="1" 
                            required
                            value={form.passengers} 
                            onChange={(e) => setForm({ ...form, passengers: parseInt(e.target.value) || 1 })} 
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Telegram Username / Phone Contact</label>
                        <input 
                          className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/60 transition duration-300" 
                          placeholder="E.g., @myusername or +855..." 
                          required
                          value={form.telegram_contact} 
                          onChange={(e) => setForm({ ...form, telegram_contact: e.target.value })} 
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Special Requests (Optional)</label>
                        <textarea 
                          className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/60 transition duration-300" 
                          placeholder="Any extra stops, layover times or specific luggage notes..." 
                          rows={3}
                          value={form.special_requests} 
                          onChange={(e) => setForm({ ...form, special_requests: e.target.value })} 
                        />
                      </div>

                      {/* Urgent Check */}
                      <div 
                        className="flex items-center gap-3 bg-[#0B0B0B] border border-gold/5 p-4 rounded-xl cursor-pointer" 
                        onClick={() => setForm(f => ({ ...f, is_urgent_requested: !f.is_urgent_requested }))}
                      >
                        <input 
                          type="checkbox"
                          checked={form.is_urgent_requested}
                          onChange={() => {}}
                          className="w-4 h-4 rounded border-gold/30 text-gold focus:ring-gold bg-[#121212]"
                        />
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-bold text-white uppercase tracking-wide">Request Urgent Review</span>
                          <span className="text-[10px] text-neutral-400">Concierge will prioritize quotes under 30 minutes.</span>
                        </div>
                      </div>
                    </div>

                    <SmartSuggestionButtons
                      onAction={handleSmartAction}
                      onBook={handleSubmitBooking}
                      onRegenerate={handleGenerateTrip}
                      loading={loading || isThinking}
                    />
                  </>
                )}
              </div>

              {/* Right Column: Evolving AI Concierge Panel */}
              <div className="lg:col-span-4 sticky top-6 self-start flex flex-col gap-6 w-full">
                {!hasGenerated && !isThinking && (
                  /* State 1: Welcome Panel */
                  <AIConciergeHero />
                )}

                {isThinking && (
                  /* State 2: Planning Panel */
                  <AIThinking onComplete={handleThinkingComplete} />
                )}

                {hasGenerated && recommendation && (
                  /* State 3: Generated Itinerary Status Card */
                  <div className="bg-[#121212] border border-[#2a2a2a] p-5 rounded-2xl flex flex-col gap-3 text-left">
                    <h4 className="text-xs font-black uppercase text-gold tracking-widest pb-2 border-b border-neutral-900 flex items-center justify-between">
                      <span>✨ Concierge Ready</span>
                      <span className="text-emerald-500 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20 text-[9px]">
                        ✓ Active
                      </span>
                    </h4>
                    <p className="text-xs text-neutral-400 font-light leading-relaxed">
                      Your custom itinerary is ready below. You can refine the route or inputs on the left.
                    </p>
                    <button
                      onClick={handleClear}
                      className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-850 text-neutral-400 hover:text-white border border-neutral-850 hover:border-neutral-700 text-[10px] font-black tracking-widest uppercase rounded-xl cursor-pointer transition active:scale-[0.98]"
                    >
                      Start New AI Plan
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* If generated, render full-width results dashboard below the form/input section */}
            {hasGenerated && recommendation && (
              <div className="border-t border-neutral-900 pt-10 flex flex-col gap-8 text-left max-w-full">
                <div className="flex flex-col gap-1 border-b border-neutral-900 pb-4 mb-2">
                  <span className="text-xs font-black uppercase tracking-[0.25em] text-gold font-serif">✨ Personalized Dashboard</span>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-white tracking-wide">
                    Your Generated Journey
                  </h2>
                </div>

                {/* A. Journey Summary card (Full Width) */}
                <TripSummary
                  duration={durationSelect}
                  drivingTime={recommendation.drivingTime}
                  stopsCount={form.stops.length}
                  budget={recommendation.budget}
                  distance={recommendation.distance}
                  vehicle={form.vehicle}
                  bestSeason={recommendation.bestTime}
                  travelStyle={recommendation.tags ? recommendation.tags.join(' & ') : 'Nature & Photography'}
                />

                {/* B. Destination Recommendation (Province details & suggested attractions) */}
                <TripRecommendation recommendation={recommendation} />

                {/* C. Generated Itinerary Timeline */}
                <GeneratedTimeline itinerary={timeline} />

                {/* D. Continue Booking Button */}
                <div className="flex justify-center pt-4">
                  <button
                    onClick={handleSubmitBooking}
                    disabled={loading}
                    className="w-full max-w-md py-4 bg-gold hover:bg-gold/90 text-black text-xs font-black tracking-widest uppercase rounded-full cursor-pointer shadow-lg shadow-gold/15 transition active:scale-[0.98] disabled:opacity-50"
                  >
                    {loading ? 'Submitting Booking Request...' : 'Confirm & Proceed to Booking'}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          /* ==================================================================
             MANUAL PLANNERS FALLBACK
             ================================================================== */
          <motion.div
            key="manual-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Left Side: Standard Form */}
            <form onSubmit={handleSubmitBooking} className="lg:col-span-7 flex flex-col gap-8 text-left">
              {/* Section 1: Route details */}
              <div className="bg-[#121212] border border-gold/10 p-6 md:p-8 rounded-3xl flex flex-col gap-5 shadow-lg">
                <div className="flex items-center gap-3 border-b border-neutral-900 pb-3 mb-1">
                  <span className="w-6 h-6 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold text-xs font-bold font-serif">1</span>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-serif">Route Planning</h3>
                </div>

                <div className="flex flex-col gap-5 relative">
                  {/* Origin */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Origin Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-[14px] text-gold w-4 h-4" />
                      <input 
                        className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-gold/60 transition duration-300" 
                        placeholder="E.g., Hotel, Phnom Penh" 
                        required
                        value={form.origin} 
                        onChange={(e) => setForm({ ...form, origin: e.target.value })} 
                      />
                    </div>
                  </div>

                  {/* Midstops */}
                  <div className="flex flex-col gap-4 pl-4 border-l border-dashed border-gold/25 my-1">
                    <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Stops / Places to Visit</label>
                    
                    {form.stops.map((stop, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="relative flex-1">
                          <span className="absolute left-4 top-3 text-gold/60 text-xs">📍</span>
                          <input 
                            className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-gold/60 transition duration-300" 
                            placeholder={`Place/Stop #${index + 1}`} 
                            required
                            value={stop} 
                            onChange={(e) => handleStopChange(index, e.target.value)} 
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveStop(index)}
                          className="px-3 py-2.5 bg-rose-950/20 hover:bg-rose-950/40 border border-rose-900/30 hover:border-rose-900/50 text-rose-400 hover:text-rose-300 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={handleAddStop}
                      className="py-2 px-4 w-fit bg-neutral-900/60 hover:bg-neutral-900 text-[#A3A3A3] hover:text-white border border-neutral-800 hover:border-neutral-700 rounded-xl text-[10px] font-bold transition flex items-center gap-1.5 tracking-wider uppercase cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-gold" />
                      <span>Add another place</span>
                    </button>
                  </div>

                  {/* Destination */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Final Destination</label>
                    <div className="relative">
                      <Flag className="absolute left-4 top-[14px] text-gold w-4 h-4" />
                      <input 
                        className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-gold/60 transition duration-300" 
                        placeholder="E.g., Airport / Hotel" 
                        required
                        value={form.destination} 
                        onChange={(e) => setForm({ ...form, destination: e.target.value })} 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Date, Time & Group */}
              <div className="bg-[#121212] border border-gold/10 p-6 md:p-8 rounded-3xl flex flex-col gap-5 shadow-lg">
                <div className="flex items-center gap-3 border-b border-neutral-900 pb-3 mb-1">
                  <span className="w-6 h-6 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold text-xs font-bold font-serif">2</span>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-serif">Schedule & Capacity</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Travel Date</label>
                    <input 
                      className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/60 transition duration-300" 
                      type="date" 
                      required
                      value={form.travel_date} 
                      onChange={(e) => setForm({ ...form, travel_date: e.target.value })} 
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Travel Time</label>
                    <input 
                      className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/60 transition duration-300" 
                      type="time" 
                      required
                      value={form.travel_time} 
                      onChange={(e) => setForm({ ...form, travel_time: e.target.value })} 
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Passengers</label>
                    <input 
                      className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/60 transition duration-300" 
                      type="number" 
                      min="1" 
                      required
                      value={form.passengers} 
                      onChange={(e) => setForm({ ...form, passengers: parseInt(e.target.value) || 1 })} 
                    />
                  </div>
                </div>

                {/* Vehicle Choice */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Vehicle Preference</label>
                  <select
                    className="w-full bg-[#0b0b0b] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/60 transition duration-300"
                    value={form.vehicle}
                    onChange={(e) => setForm({ ...form, vehicle: e.target.value })}
                  >
                    <option value="No Preference">No Preference</option>
                    <option value="Luxury SUV">Luxury SUV</option>
                    <option value="Van">VIP Van</option>
                    <option value="Sedan">Bespoke Sedan</option>
                  </select>
                </div>

                {/* Urgent Request */}
                <div 
                  className="flex items-center gap-3 bg-[#0B0B0B] border border-gold/5 p-4 rounded-xl cursor-pointer" 
                  onClick={() => setForm(f => ({ ...f, is_urgent_requested: !f.is_urgent_requested }))}
                >
                  <input 
                    type="checkbox"
                    checked={form.is_urgent_requested}
                    onChange={() => {}}
                    className="w-4 h-4 rounded border-gold/30 text-gold focus:ring-gold bg-[#121212]"
                  />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-white uppercase tracking-wide">Request Urgent Review</span>
                    <span className="text-[10px] text-neutral-400">Quotes returned in under 30 mins.</span>
                  </div>
                </div>
              </div>

              {/* Section 3: Notes & Contact */}
              <div className="bg-[#121212] border border-gold/10 p-6 md:p-8 rounded-3xl flex flex-col gap-5 shadow-lg">
                <div className="flex items-center gap-3 border-b border-neutral-900 pb-3 mb-1">
                  <span className="w-6 h-6 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold text-xs font-bold font-serif">3</span>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-serif">Contact & Special Requests</h3>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Telegram Username / Phone Contact</label>
                  <input 
                    className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/60 transition duration-300" 
                    placeholder="E.g., @myusername or +855..." 
                    required
                    value={form.telegram_contact} 
                    onChange={(e) => setForm({ ...form, telegram_contact: e.target.value })} 
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Special Requests (Optional)</label>
                  <textarea 
                    className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/60 transition duration-300" 
                    placeholder="Include custom timing, dietary preferences, driver needs..." 
                    rows={3}
                    value={form.special_requests} 
                    onChange={(e) => setForm({ ...form, special_requests: e.target.value })} 
                  />
                </div>
              </div>

              <GoldButton type="submit" disabled={loading} className="w-full py-4 mt-2 font-serif text-sm tracking-wide shadow-lg shadow-gold/10">
                {loading ? 'Submitting Request...' : 'Submit Bespoke Itinerary'}
              </GoldButton>
            </form>

            {/* Right Side: Live Summary Fallback */}
            <div className="lg:col-span-5 sticky top-6 self-start flex flex-col gap-6 w-full">
              <TripSummary
                duration="Flexible"
                drivingTime="Calculated on receipt"
                stopsCount={form.stops.filter(s => s.trim() !== '').length}
                budget={form.vehicle === 'Luxury SUV' ? 120 : 75}
                distance={form.stops.length * 15 + 30}
                vehicle={form.vehicle}
                bestSeason="All Year"
                isSidebar={true}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
