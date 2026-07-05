import { Clock, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GeneratedTimeline({ itinerary }) {
  if (!itinerary || itinerary.length === 0) return null;

  return (
    <div className="bg-[#121212] border border-gold/10 rounded-3xl p-6 md:p-8 shadow-xl text-left w-full relative">
      <div className="flex flex-col gap-1 border-b border-neutral-900 pb-4 mb-6">
        <span className="text-[9px] font-black uppercase tracking-[0.28em] text-gold">Custom Routing</span>
        <h2 className="font-serif text-2xl font-bold text-white">✨ Generated Itinerary Timeline</h2>
      </div>

      <div className="relative ml-3 flex flex-col gap-6 border-l border-gold/20 pl-6 md:ml-5 md:pl-8">
        {itinerary.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.25) }}
            className="group relative"
          >
            {/* Glowing vertical point */}
            <span className="absolute -left-[35px] top-4 flex h-4.5 w-4.5 items-center justify-center rounded-full border border-gold bg-[#0A0A0A] shadow-[0_0_12px_rgba(212,175,55,0.4)] md:-left-[43px]">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            </span>

            {/* Stop Card */}
            <div className="grid gap-6 overflow-hidden rounded-2xl border border-white/5 bg-[#0b0b0b]/60 p-6 transition duration-300 hover:border-gold/30 hover:shadow-lg sm:grid-cols-[180px_1fr]">
              {/* Left col: Image & Time badge */}
              <div className="relative h-40 sm:h-32 overflow-hidden rounded-xl border border-white/5 min-w-[180px] shrink-0">
                <img
                  src={item.image || '/images/gallery_angkor1.jpg'}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = '/images/gallery_angkor1.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <span className="absolute bottom-3 left-3 rounded-md border border-gold/35 bg-black/85 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-gold backdrop-blur-md">
                  {item.time}
                </span>
              </div>

              {/* Right col: Details */}
              <div className="flex flex-col justify-center gap-2.5">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-gold" />
                    Duration: {item.duration || 'Flexible'}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-gold" />
                    Location: {item.location || item.title}
                  </span>
                </div>
                <h3 className="font-serif text-lg md:text-xl font-bold text-white group-hover:text-gold transition-colors duration-200">
                  {item.title}
                </h3>
                <p className="text-sm font-light leading-relaxed text-neutral-400">
                  {item.description || item.desc}
                </p>
              </div>
            </div>

            {/* Connecting arrow indicator between cards */}
            {index < itinerary.length - 1 && (
              <div className="absolute left-[50%] transform -translate-x-[50%] -bottom-5 w-fit h-4 text-[#D4AF37]/45 text-[10px] hidden">
                ↓
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
