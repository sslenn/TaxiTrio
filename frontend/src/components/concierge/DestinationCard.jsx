import { Clock, MapPin, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DestinationCard({ attraction, index }) {
  const { title, category, stay, time, image, description } = attraction;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="bg-[#0b0b0b] border border-white/5 hover:border-gold/30 rounded-2xl overflow-hidden transition-all duration-300 group shadow-md hover:shadow-gold/5 flex flex-col h-full"
    >
      {/* Image container with scale effect */}
      <div className="relative h-44 overflow-hidden border-b border-white/5">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src = '/images/gallery_angkor1.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-transparent to-transparent pointer-events-none" />
        
        {/* Category tag */}
        <span className="absolute top-3 left-3 bg-black/65 border border-gold/35 text-gold text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-sm">
          {category}
        </span>
      </div>

      {/* Content body */}
      <div className="p-4 flex flex-col gap-2 flex-grow text-left">
        <h4 className="font-serif text-lg font-bold text-white group-hover:text-gold transition-colors duration-300">
          {title}
        </h4>
        <p className="text-xs text-neutral-400 font-light leading-relaxed flex-grow">
          {description}
        </p>
      </div>

      {/* Info footer */}
      <div className="px-4 py-3 bg-neutral-900/40 border-t border-white/5 grid grid-cols-2 gap-2 text-[10px] text-neutral-400 font-bold uppercase tracking-wider text-left">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-gold" />
          <span>Stay: {stay}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-gold" />
          <span className="truncate">{time}</span>
        </div>
      </div>
    </motion.div>
  );
}
