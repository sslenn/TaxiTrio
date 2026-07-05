import { motion } from 'framer-motion';

const SUGGESTIONS = [
  { text: 'Nature & Wildlife', icon: '🌿' },
  { text: 'Khmer History', icon: '🏛' },
  { text: 'Romantic Getaway', icon: '❤️' },
  { text: 'Foodie Exploration', icon: '🍜' },
  { text: 'Photography Tour', icon: '📷' },
  { text: 'Waterfalls & Scenic', icon: '🏞' },
  { text: 'Beach Escape', icon: '🏝' },
  { text: 'Hidden Gems', icon: '💎' },
  { text: 'One-Day Getaway', icon: '✈️' }
];

export default function PromptSuggestions({ selected = [], onSelect }) {
  return (
    <div className="flex flex-wrap gap-2.5 mt-2">
      {SUGGESTIONS.map((s, idx) => {
        const isSelected = selected.includes(s.text);
        return (
          <motion.button
            key={idx}
            type="button"
            onClick={() => onSelect(s.text)}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`px-4 py-2 text-xs rounded-full border transition-all duration-300 flex items-center gap-1.5 shadow-md backdrop-blur-sm cursor-pointer ${
              isSelected 
                ? 'bg-gold/15 border-[#D4AF37] text-white font-semibold shadow-lg shadow-[#D4AF37]/10' 
                : 'border-[#D4AF37]/15 bg-neutral-900/40 text-neutral-300 hover:bg-[#D4AF37]/5 hover:border-[#D4AF37] hover:text-white'
            }`}
          >
            <span>{isSelected ? '✓' : s.icon}</span>
            <span>{s.text}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
