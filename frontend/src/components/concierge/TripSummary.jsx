import { 
  Clock, 
  MapPin, 
  Star, 
  DollarSign, 
  Car, 
  Leaf, 
  Award, 
  Footprints, 
  Users, 
  Calendar, 
  ShieldCheck, 
  Check 
} from 'lucide-react';

export default function TripSummary({
  duration,
  drivingTime,
  stopsCount,
  budget,
  distance,
  vehicle,
  difficulty = 'Easy',
  walkingDistance = '1.8 km',
  crowdLevel = 'Medium',
  bestSeason = 'Nov – Feb',
  travelStyle = 'Nature & Wildlife',
  isSidebar = false
}) {
  const stopsText = stopsCount === 1 ? '1 Stop' : `${stopsCount || 8} Stops`;
  const attractionsCount = stopsCount ? Math.round(stopsCount * 1.5) : 12;
  const attractionsText = attractionsCount === 1 ? '1 Attraction' : `${attractionsCount} Attractions`;

  return (
    <div className="bg-[#121212] border border-[#2a2a2a] p-6 md:p-8 rounded-3xl shadow-2xl flex flex-col gap-7 w-full text-left font-sans">
      
      {/* 1. Primary: Journey Ready Header */}
      <div className="flex items-center justify-between border-b border-neutral-900 pb-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] uppercase font-black tracking-widest text-neutral-500 leading-none">Plan Dashboard</span>
          <h3 className="font-serif text-xl font-bold text-white tracking-wide">Journey Ready</h3>
        </div>
        <span className="text-emerald-500 font-bold flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/25 text-xs">
          <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
          <span>Ready</span>
        </span>
      </div>

      {/* 2. Secondary: Journey Metrics (Grid) */}
      <div className="flex flex-col gap-4 text-left">
        <span className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-[0.2em] block" style={{ color: 'var(--color-accent, #BFA76A)' }}>
          Journey Metrics
        </span>
        
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          
          {/* Metric Item: Estimated Duration */}
          <div className="bg-[#0b0b0b] border border-white/5 p-5 rounded-2xl flex flex-col justify-center min-h-[90px] min-w-0 transition hover:border-[#BFA76A]/20">
            <span className="text-[11px] text-neutral-500 uppercase font-black tracking-[0.1em] mb-1.5 leading-none block">
              Estimated Duration
            </span>
            <div className="flex items-center gap-2 min-w-0">
              <Clock className="w-4.5 h-4.5 text-[#BFA76A] shrink-0" style={{ color: 'var(--color-accent, #BFA76A)' }} />
              <span className="text-base font-semibold text-white whitespace-normal break-words leading-relaxed">
                {duration || '3 Days'}
              </span>
            </div>
          </div>

          {/* Metric Item: Destination Stops */}
          <div className="bg-[#0b0b0b] border border-white/5 p-5 rounded-2xl flex flex-col justify-center min-h-[90px] min-w-0 transition hover:border-[#BFA76A]/20">
            <span className="text-[11px] text-neutral-500 uppercase font-black tracking-[0.1em] mb-1.5 leading-none block">
              Destination Stops
            </span>
            <div className="flex items-center gap-2 min-w-0">
              <MapPin className="w-4.5 h-4.5 text-[#BFA76A] shrink-0" style={{ color: 'var(--color-accent, #BFA76A)' }} />
              <span className="text-base font-semibold text-white whitespace-normal break-words leading-relaxed">
                {stopsText}
              </span>
            </div>
          </div>

          {/* Metric Item: Recommended Attractions */}
          <div className="bg-[#0b0b0b] border border-white/5 p-5 rounded-2xl flex flex-col justify-center min-h-[90px] min-w-0 transition hover:border-[#BFA76A]/20">
            <span className="text-[11px] text-neutral-500 uppercase font-black tracking-[0.1em] mb-1.5 leading-none block">
              Recommended Attractions
            </span>
            <div className="flex items-center gap-2 min-w-0">
              <Star className="w-4.5 h-4.5 text-[#BFA76A] shrink-0" style={{ color: 'var(--color-accent, #BFA76A)' }} />
              <span className="text-base font-semibold text-white whitespace-normal break-words leading-relaxed">
                {attractionsText}
              </span>
            </div>
          </div>

          {/* Metric Item: Estimated Budget */}
          <div className="bg-[#0b0b0b] border border-white/5 p-5 rounded-2xl flex flex-col justify-center min-h-[90px] min-w-0 transition hover:border-[#BFA76A]/20">
            <span className="text-[11px] text-neutral-500 uppercase font-black tracking-[0.1em] mb-1.5 leading-none block">
              Estimated Budget
            </span>
            <div className="flex items-center gap-1.5 min-w-0">
              <DollarSign className="w-4.5 h-4.5 text-[#BFA76A] shrink-0" style={{ color: 'var(--color-accent, #BFA76A)' }} />
              <span className="text-base font-bold text-white whitespace-normal break-words leading-relaxed">
                ${budget || 180}
              </span>
            </div>
          </div>

          {/* Metric Item: Vehicle Preference */}
          <div className="bg-[#0b0b0b] border border-white/5 p-5 rounded-2xl flex flex-col justify-center min-h-[90px] min-w-0 transition hover:border-[#BFA76A]/20">
            <span className="text-[11px] text-neutral-500 uppercase font-black tracking-[0.1em] mb-1.5 leading-none block">
              Vehicle Preference
            </span>
            <div className="flex items-center gap-2 min-w-0">
              <Car className="w-4.5 h-4.5 text-[#BFA76A] shrink-0" style={{ color: 'var(--color-accent, #BFA76A)' }} />
              <span className="text-base font-semibold text-white whitespace-normal break-words leading-relaxed">
                {vehicle || 'Luxury SUV'}
              </span>
            </div>
          </div>

          {/* Metric Item: Travel Style */}
          <div className="bg-[#0b0b0b] border border-white/5 p-5 rounded-2xl flex flex-col justify-center min-h-[90px] min-w-0 transition hover:border-[#BFA76A]/20">
            <span className="text-[11px] text-neutral-500 uppercase font-black tracking-[0.1em] mb-1.5 leading-none block">
              Travel Style
            </span>
            <div className="flex items-center gap-2 min-w-0">
              <Leaf className="w-4.5 h-4.5 text-[#BFA76A] shrink-0" style={{ color: 'var(--color-accent, #BFA76A)' }} />
              <span className="text-base font-semibold text-white whitespace-normal break-words leading-relaxed">
                {travelStyle || 'Nature & Wildlife'}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Third: Concierge Metrics */}
      <div className="flex flex-col gap-4 text-left border-t border-neutral-950 pt-5">
        <span className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-[0.2em] block" style={{ color: 'var(--color-accent, #BFA76A)' }}>
          Bespoke Concierge Metrics
        </span>
        
        <div className={`grid grid-cols-1 gap-4 ${isSidebar ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-4'}`}>
          
          {/* Difficulty */}
          <div className="bg-[#0b0b0b] border border-white/5 p-4 rounded-xl flex items-center gap-3 min-w-0">
            <Award className="w-5 h-5 text-[#BFA76A] shrink-0" style={{ color: 'var(--color-accent, #BFA76A)' }} />
            <div className="flex flex-col text-left leading-tight min-w-0">
              <span className="text-[9px] uppercase font-bold text-neutral-500 tracking-wider">Difficulty</span>
              <span className="text-[11.5px] font-semibold text-white mt-0.5 whitespace-normal break-words">{difficulty}</span>
            </div>
          </div>

          {/* Walking Distance */}
          <div className="bg-[#0b0b0b] border border-white/5 p-4 rounded-xl flex items-center gap-3 min-w-0">
            <Footprints className="w-5 h-5 text-[#BFA76A] shrink-0" style={{ color: 'var(--color-accent, #BFA76A)' }} />
            <div className="flex flex-col text-left leading-tight min-w-0">
              <span className="text-[9px] uppercase font-bold text-neutral-500 tracking-wider">Walking Dist</span>
              <span className="text-[11.5px] font-semibold text-white mt-0.5 whitespace-normal break-words">{walkingDistance}</span>
            </div>
          </div>

          {/* Crowd Level */}
          <div className="bg-[#0b0b0b] border border-white/5 p-4 rounded-xl flex items-center gap-3 min-w-0">
            <Users className="w-5 h-5 text-[#BFA76A] shrink-0" style={{ color: 'var(--color-accent, #BFA76A)' }} />
            <div className="flex flex-col text-left leading-tight min-w-0">
              <span className="text-[9px] uppercase font-bold text-neutral-500 tracking-wider">Crowd Level</span>
              <span className="text-[11.5px] font-semibold text-white mt-0.5 whitespace-normal break-words">{crowdLevel}</span>
            </div>
          </div>

          {/* Best Season */}
          <div className="bg-[#0b0b0b] border border-white/5 p-4 rounded-xl flex items-center gap-3 min-w-0">
            <Calendar className="w-5 h-5 text-[#BFA76A] shrink-0" style={{ color: 'var(--color-accent, #BFA76A)' }} />
            <div className="flex flex-col text-left leading-tight min-w-0">
              <span className="text-[9px] uppercase font-bold text-neutral-500 tracking-wider">Best Season</span>
              <span className="text-[11.5px] font-semibold text-white mt-0.5 whitespace-normal break-words">{bestSeason}</span>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Fourth: Guarantee Card */}
      <div className="bg-gold/5 border border-gold/15 p-5 rounded-2xl flex items-start gap-4 text-left border-l-[5px]" style={{ borderColor: 'var(--color-accent-light-rgb, rgba(191,167,106,0.15))', borderLeftColor: 'var(--color-accent, #BFA76A)' }}>
        <ShieldCheck className="w-7 h-7 text-[#BFA76A] shrink-0 mt-0.5" style={{ color: 'var(--color-accent, #BFA76A)' }} />
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-[10px] font-black uppercase text-[#BFA76A] tracking-wider leading-none" style={{ color: 'var(--color-accent, #BFA76A)' }}>
            Concierge Guarantee
          </span>
          <p className="text-[12px] text-neutral-300 font-light leading-relaxed max-w-[65ch] overflow-wrap-anywhere">
            Your itinerary has been optimized using route intelligence and premium fare estimates. Chauffeur support is guaranteed 24/7 throughout your travel package.
          </p>
        </div>
      </div>

      {/* 5. Fifth: Perks List */}
      <div className="bg-[#0b0b0b] border border-white/5 p-5 rounded-2xl flex flex-col gap-3.5 text-left">
        <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-[0.2em] block">
          Bespoke Concierge Perks
        </span>
        
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 text-xs text-neutral-300 leading-none">
            <span className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center shrink-0">
              <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
            </span>
            <span className="font-light">Fully customized routing & stops allocation</span>
          </div>

          <div className="flex items-center gap-3 text-xs text-neutral-300 leading-none">
            <span className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center shrink-0">
              <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
            </span>
            <span className="font-light">Premium vehicle recommendations matching passenger count</span>
          </div>

          <div className="flex items-center gap-3 text-xs text-neutral-300 leading-none">
            <span className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center shrink-0">
              <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
            </span>
            <span className="font-light">Professional, vetted, English-speaking private chauffeurs</span>
          </div>
        </div>
      </div>

    </div>
  );
}
