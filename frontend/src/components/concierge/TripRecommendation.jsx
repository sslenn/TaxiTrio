import { Sparkles, Calendar, DollarSign, Route, Clock, Car } from 'lucide-react';
import DestinationCard from './DestinationCard';
import RestaurantRecommendation from './RestaurantRecommendation';

export default function TripRecommendation({ recommendation }) {
  if (!recommendation) return null;

  const {
    province,
    confidence,
    reason,
    tags,
    bestTime,
    budget,
    distance,
    drivingTime,
    vehicle,
    image,
    attractions,
    restaurant
  } = recommendation;

  return (
    <div className="bg-[#121212] border border-gold/10 rounded-3xl p-5 md:p-6 shadow-xl flex flex-col gap-6 text-left w-full relative overflow-hidden box-sizing-border-box">
      {/* Header with Confidence Score */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-neutral-900 pb-4 flex-wrap">
        <div className="flex flex-col gap-1 text-left min-w-0">
          <div className="flex items-center gap-2 text-[#D4AF37] text-[10px] font-black uppercase tracking-wider font-serif">
            <Sparkles className="w-3.5 h-3.5 font-bold" />
            <span>AI Destination Fit</span>
          </div>
          <h2 className="font-serif text-xl md:text-2xl font-bold text-white leading-tight">
            Your Personalized Journey
          </h2>
        </div>

        {/* Confidence Score Pill */}
        <div className="flex items-center gap-2.5 bg-gold/5 border border-gold/25 px-3.5 py-1.5 rounded-2xl shrink-0 self-start">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <svg className="w-8 h-8 transform -rotate-90">
              <circle
                cx="16"
                cy="16"
                r="13"
                className="stroke-neutral-800"
                strokeWidth="2"
                fill="transparent"
              />
              <circle
                cx="16"
                cy="16"
                r="13"
                className="stroke-[#D4AF37]"
                strokeWidth="2"
                fill="transparent"
                strokeDasharray="81.68"
                strokeDashoffset={81.68 - (81.68 * confidence) / 100}
              />
            </svg>
            <span className="absolute text-[8.5px] font-black text-white">{confidence}%</span>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[7px] uppercase tracking-widest text-neutral-500 font-bold leading-none mb-0.5">Match Quality</span>
            <span className="text-[10px] font-semibold text-white leading-tight">Highly Recommended</span>
          </div>
        </div>
      </div>

      {/* Rationale & Tags */}
      <div className="flex flex-col gap-4">
        <p className="text-xs font-light text-neutral-300 leading-relaxed italic bg-[#0b0b0b] border border-white/5 p-4 rounded-xl max-w-full box-sizing-border-box">
          💡 {reason}
        </p>

        {/* Recommendation chips */}
        <div className="flex flex-wrap gap-2 max-w-full">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="px-2.5 py-1 bg-neutral-900 border border-neutral-800 text-neutral-400 rounded-full text-[9px] font-bold uppercase tracking-wider whitespace-nowrap"
            >
              ✦ {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Recommended Province Details (Split Layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-stretch border-t border-neutral-900 pt-5">
        
        {/* Province Hero Card */}
        <div className="sm:col-span-5 relative rounded-2xl overflow-hidden border border-white/10 group min-h-[150px]">
          <img
            src={image}
            alt={province}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 absolute inset-0"
            onError={(e) => {
              e.target.src = '/images/custom_trip.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />
          
          <div className="absolute bottom-4 left-4 right-4 text-left flex flex-col gap-0.5 z-10">
            <span className="text-[8px] uppercase font-bold text-[#D4AF37] tracking-widest leading-none">Recommended Province</span>
            <h3 className="font-serif text-lg font-bold text-white tracking-wide leading-tight">{province}</h3>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="sm:col-span-7 grid grid-cols-2 gap-3">
          {/* Best Season */}
          <div className="bg-[#0b0b0b] border border-white/5 rounded-xl p-3 flex flex-col justify-center text-left min-w-0 overflow-wrap-anywhere word-break-all">
            <div className="flex items-center gap-1.5 text-neutral-500 mb-1">
              <Calendar className="w-3.5 h-3.5 text-gold shrink-0" />
              <span className="text-[8px] uppercase font-bold tracking-wider">Best Season</span>
            </div>
            <span className="text-xs font-semibold text-white truncate">{bestTime}</span>
          </div>

          {/* Budget */}
          <div className="bg-[#0b0b0b] border border-white/5 rounded-xl p-3 flex flex-col justify-center text-left min-w-0 overflow-wrap-anywhere word-break-all">
            <div className="flex items-center gap-1.5 text-neutral-500 mb-1">
              <DollarSign className="w-3.5 h-3.5 text-gold shrink-0" />
              <span className="text-[8px] uppercase font-bold tracking-wider">Est. Budget</span>
            </div>
            <span className="text-xs font-semibold text-white truncate">${budget}</span>
          </div>

          {/* Distance */}
          <div className="bg-[#0b0b0b] border border-white/5 rounded-xl p-3 flex flex-col justify-center text-left min-w-0 overflow-wrap-anywhere word-break-all">
            <div className="flex items-center gap-1.5 text-neutral-500 mb-1">
              <Route className="w-3.5 h-3.5 text-gold shrink-0" />
              <span className="text-[8px] uppercase font-bold tracking-wider">Est. Distance</span>
            </div>
            <span className="text-xs font-semibold text-white truncate">{distance} km</span>
          </div>

          {/* Driving Time */}
          <div className="bg-[#0b0b0b] border border-white/5 rounded-xl p-3 flex flex-col justify-center text-left min-w-0 overflow-wrap-anywhere word-break-all">
            <div className="flex items-center gap-1.5 text-neutral-500 mb-1">
              <Clock className="w-3.5 h-3.5 text-gold shrink-0" />
              <span className="text-[8px] uppercase font-bold tracking-wider">Driving Time</span>
            </div>
            <span className="text-xs font-semibold text-white truncate">{drivingTime}</span>
          </div>

          {/* Vehicle */}
          <div className="bg-[#0b0b0b] border border-white/5 rounded-xl p-3 col-span-2 flex items-center justify-between text-left min-w-0 overflow-wrap-anywhere word-break-all">
            <div className="flex items-center gap-2 min-w-0">
              <Car className="w-3.5 h-3.5 text-gold shrink-0" />
              <div className="flex flex-col text-left truncate leading-tight">
                <span className="text-[8px] uppercase font-bold text-neutral-500 tracking-wider">Recommended Ride</span>
                <span className="text-xs font-semibold text-white mt-0.5 truncate">{vehicle}</span>
              </div>
            </div>
            <span className="text-[8px] bg-gold/10 text-[#D4AF37] border border-gold/25 font-black uppercase tracking-widest px-2.5 py-0.5 rounded shrink-0">
              Selected
            </span>
          </div>
        </div>
      </div>

      {/* Suggested Attractions */}
      <div className="flex flex-col gap-4 border-t border-neutral-900 pt-5">
        <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
          <span>📍 Suggested Attractions</span>
          <span className="text-xs font-light text-neutral-400 font-sans">({attractions.length} spots curated)</span>
        </h3>
        
        <div className="grid grid-cols-1 gap-4">
          {attractions.map((attraction, i) => (
            <DestinationCard key={i} attraction={attraction} index={i} />
          ))}
        </div>
      </div>

      {/* Suggested Restaurant */}
      <div className="flex flex-col gap-4 border-t border-neutral-900 pt-5">
        <RestaurantRecommendation restaurant={restaurant} />
      </div>
    </div>
  );
}
