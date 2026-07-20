import { Sparkles, Trash2, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import PromptSuggestions from './PromptSuggestions';

export default function AIConversation({
  prompt,
  setPrompt,
  budget,
  setBudget,
  duration,
  setDuration,
  passengers,
  setPassengers,
  vehicle,
  setVehicle,
  onGenerate,
  onClear,
  loading,
  selectedInterests = [],
  onSelectInterest
}) {
  return (
    <div className="bg-[#121212] border border-gold/10 rounded-3xl p-6 shadow-xl flex flex-col gap-6 w-full relative">
      {/* Header with AI Avatar */}
      <div className="flex items-center justify-between border-b border-neutral-900 pb-4">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border border-gold/35 bg-gradient-to-tr from-gold/15 via-[#0b0b0b] to-gold/15 flex items-center justify-center text-xs font-black text-gold shadow-lg shadow-gold/20 pulse-glow-ring shrink-0">
              TT
            </div>
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#121212] flex items-center justify-center z-10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping" />
            </span>
          </div>
          <div className="flex flex-col text-left">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-serif flex items-center gap-1.5">
              Your AI Travel Concierge
            </h3>
            <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-light mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              <span>Online</span>
            </div>
          </div>
        </div>

        {/* Mode Pill Indicator */}
        <div className="hidden sm:block text-[9px] font-black uppercase tracking-widest text-[#D4AF37] px-2.5 py-1 rounded-md bg-[#D4AF37]/5 border border-[#D4AF37]/15">
          Primary Mode: Natural AI
        </div>
      </div>

      {/* AI Speech Bubble */}
      <div className="bg-[#0B0B0B] border border-white/5 p-5 rounded-2xl flex gap-3 text-left">
        <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-sm shrink-0 self-start">
          🤵
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs text-[#D4AF37] font-semibold font-serif uppercase tracking-wider">AI Concierge Desk</p>
          <p className="text-sm font-light text-neutral-300 leading-relaxed">
            Hello! Tell me about your ideal Cambodian trip. You don&apos;t need to know where to go. Simply describe:
          </p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-neutral-400 font-light mt-1 pl-1 list-none">
            <li className="flex items-center gap-2">
              <span className="text-gold text-[10px]">✦</span>
              <span>Your Mood or Vibe</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-gold text-[10px]">✦</span>
              <span>Interests & Activities</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-gold text-[10px]">✦</span>
              <span>Available Time</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-gold text-[10px]">✦</span>
              <span>Budget Preference</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Conversational Textarea */}
      <div className="flex flex-col gap-2 animate-in fade-in duration-300">
        <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider text-left block">
          Describe your dream trip
        </label>
        <textarea
          className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-gold/60 transition duration-300 font-light leading-relaxed placeholder-neutral-600 resize-none"
          placeholder='E.g., "I want to request a custom trip highlighting..."'
          rows={4}
          style={{ minHeight: '120px' }}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        {/* Suggestion Chips */}
        <div className="mt-2 text-left">
          <span className="text-[9px] uppercase font-bold text-neutral-500 tracking-widest block mb-1">
            Tap preferences to automatically build your itinerary request:
          </span>
          <PromptSuggestions selected={selectedInterests} onSelect={onSelectInterest} />
          
          {selectedInterests.length > 0 && (
            <div className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider mt-3 flex flex-wrap items-center gap-1.5 animate-in fade-in duration-300">
              <span>Selected Preferences:</span>
              {selectedInterests.map((interest, i) => (
                <span key={i} className="bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-0.5 rounded border border-[#D4AF37]/20 font-medium normal-case tracking-normal">
                  {interest}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Toolbar Options (Grid / Flex) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#0B0B0B] p-4 border border-white/5 rounded-2xl">
        {/* Budget */}
        <div className="flex flex-col gap-1 text-left">
          <label className="text-[9px] font-bold text-[#BFA76A] uppercase tracking-wider">Budget</label>
          <select
            className="w-full bg-[#121212] border border-gold/10 text-white rounded-lg px-2.5 py-1.5 pr-7 text-xs focus:outline-none focus:border-gold transition duration-300 font-medium appearance-none bg-no-repeat cursor-pointer"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23D4AF37' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
              backgroundSize: '10px',
              backgroundPosition: 'calc(100% - 10px) center'
            }}
          >
            <option value="Any Budget">Any Budget</option>
            <option value="$">$ (Economy)</option>
            <option value="$$">$$ (Standard)</option>
            <option value="$$$">$$$ (Luxury)</option>
          </select>
        </div>

        {/* Duration */}
        <div className="flex flex-col gap-1 text-left">
          <label className="text-[9px] font-bold text-[#BFA76A] uppercase tracking-wider">Duration</label>
          <select
            className="w-full bg-[#121212] border border-gold/10 text-white rounded-lg px-2.5 py-1.5 pr-7 text-xs focus:outline-none focus:border-gold transition duration-300 font-medium appearance-none bg-no-repeat cursor-pointer"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23D4AF37' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
              backgroundSize: '10px',
              backgroundPosition: 'calc(100% - 10px) center'
            }}
          >
            <option value="Half Day">Half Day</option>
            <option value="1 Day">1 Day</option>
            <option value="2 Days">2 Days</option>
            <option value="3 Days">3 Days</option>
            <option value="Custom">Custom</option>
          </select>
        </div>

        {/* Passengers */}
        <div className="flex flex-col gap-1 text-left">
          <label className="text-[9px] font-bold text-[#BFA76A] uppercase tracking-wider">Passengers</label>
          <input
            type="number"
            min="1"
            className="w-full bg-[#121212] border border-gold/10 text-white rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-gold transition duration-300 font-medium"
            value={passengers}
            onChange={(e) => setPassengers(Math.max(1, parseInt(e.target.value) || 1))}
          />
        </div>

        {/* Vehicle Preference */}
        <div className="flex flex-col gap-1 text-left">
          <label className="text-[9px] font-bold text-[#BFA76A] uppercase tracking-wider">Vehicle Preference</label>
          <select
            className="w-full bg-[#121212] border border-gold/10 text-white rounded-lg px-2.5 py-1.5 pr-7 text-xs focus:outline-none focus:border-gold transition duration-300 font-medium appearance-none bg-no-repeat cursor-pointer"
            value={vehicle}
            onChange={(e) => setVehicle(e.target.value)}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23D4AF37' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
              backgroundSize: '10px',
              backgroundPosition: 'calc(100% - 10px) center'
            }}
          >
            <option value="No Preference">No Preference</option>
            <option value="Luxury SUV">Luxury SUV</option>
            <option value="Van">VIP Van</option>
            <option value="Sedan">Bespoke Sedan</option>
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between border-t border-neutral-900 pt-4 mt-2">
        <button
          type="button"
          onClick={onClear}
          disabled={loading || (!prompt && budget === 'Any Budget' && duration === '1 Day' && vehicle === 'No Preference')}
          className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-[#A3A3A3] hover:text-white border border-neutral-800 hover:border-neutral-700 bg-neutral-900/40 hover:bg-neutral-900 rounded-xl transition duration-300 flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer uppercase tracking-wider"
        >
          <Trash2 className="w-3.5 h-3.5 text-rose-500" />
          <span>Clear Fields</span>
        </button>

        <motion.button
          type="button"
          onClick={onGenerate}
          disabled={loading || !prompt.trim()}
          whileHover={prompt.trim() ? { scale: 1.02 } : {}}
          whileTap={prompt.trim() ? { scale: 0.98 } : {}}
          className="w-full sm:w-auto px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 bg-[#D4AF37] hover:bg-[#BFA76A] text-black border border-transparent shadow-lg shadow-gold/15 flex items-center justify-center gap-2 disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              <span>Tailoring Journey...</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>Generate My Trip</span>
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}
