import { Heart, RotateCw, Shield, Star, DollarSign, Users, Award, Smile } from 'lucide-react';
import { motion } from 'framer-motion';

const ACTIONS = [
  { id: 'more_adventure', label: 'More Adventure', icon: '⛰️' },
  { id: 'more_nature', label: 'More Nature', icon: '🌿' },
  { id: 'cheaper', label: 'Cheaper Version', icon: '💵' },
  { id: 'luxury', label: 'Luxury Version', icon: '👑' },
  { id: 'family', label: 'Family Friendly', icon: '👨‍👩‍👧' },
  { id: 'romantic', label: 'Romantic Vibe', icon: '👩‍❤️‍👨' },
  { id: 'historical', label: 'Historical Focus', icon: '🏛️' },
  { id: 'food_tour', label: 'Food Tour', icon: '🍜' },
  { id: 'hidden_gems', label: 'Hidden Gems', icon: '💎' }
];

export default function SmartSuggestionButtons({ onAction, onBook, onRegenerate, loading }) {
  return (
    <div className="bg-[#121212] border border-gold/15 rounded-3xl p-6 shadow-xl text-left w-full flex flex-col gap-5">
      <div>
        <span className="text-[9px] font-bold text-[#D4AF37] uppercase tracking-widest block">Refine Your Trip</span>
        <h3 className="font-serif text-xl font-bold text-white mt-0.5">✨ AI Smart Actions</h3>
      </div>

      {/* Main Actions: Love It & Regenerate */}
      <div className="flex flex-col sm:flex-row gap-3.5 border-b border-neutral-900 pb-5">
        <motion.button
          type="button"
          onClick={onBook}
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-gold to-amber-500 hover:from-amber-500 hover:to-[#D4AF37] text-black border border-transparent shadow-lg shadow-gold/15 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Heart className="w-4 h-4 fill-black" />
          <span>Love It - Submit Bespoke Booking</span>
        </motion.button>

        <motion.button
          type="button"
          onClick={onRegenerate}
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest bg-neutral-900 hover:bg-neutral-850 text-[#D4AF37] border border-gold/30 hover:border-gold/60 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Regenerate</span>
        </motion.button>
      </div>

      {/* Refine Category Chips */}
      <div className="flex flex-col gap-2.5">
        <span className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">
          Alter Vibe or Requirements:
        </span>
        <div className="flex flex-wrap gap-2.5">
          {ACTIONS.map((act) => (
            <motion.button
              key={act.id}
              type="button"
              onClick={() => onAction(act.id, act.label)}
              disabled={loading}
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 text-xs rounded-xl border border-white/5 bg-neutral-950/60 hover:bg-[#D4AF37]/5 hover:border-[#D4AF37]/40 text-neutral-300 hover:text-white transition duration-300 flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
            >
              <span>{act.icon}</span>
              <span>{act.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
