import { motion } from 'framer-motion';
import { ArrowUpRight, Clock, MapPin, Sparkles, Users } from 'lucide-react';
import GoldButton from '../GoldButton';

const fallbackImage = '/images/gallery_angkor1.jpg';

export default function TourCard({ tour, onSelect, index = 0, buttonText }) {
  const cardImage = tour.cardImage || { src: tour.image, alt: `${tour.destination}, ${tour.province}` };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.035, 0.35) }}
      onClick={() => onSelect(tour)}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#121212] shadow-[0_18px_55px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:border-gold/60 hover:shadow-[0_22px_70px_rgba(212,175,55,0.10)]"
    >
      <div className="relative h-56 w-full overflow-hidden">
        <img
          src={cardImage.src}
          alt={cardImage.alt}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = fallbackImage;
          }}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/25 to-transparent" />
        <div className="absolute left-4 top-4 rounded-full border border-gold/40 bg-black/60 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-gold backdrop-blur-md">
          {tour.category}
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/55 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white backdrop-blur-md">
            <MapPin className="h-3.5 w-3.5 text-gold" />
            {tour.province}
          </span>
          <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-black text-gold backdrop-blur-md">
            ${tour.price}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-5 p-5 md:p-6">
        <div className="flex flex-col gap-2">
          <h3 className="font-serif text-2xl font-bold leading-tight text-white">
            {tour.destination}
          </h3>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gold/80">
            {tour.title}
          </p>
          <p className="line-clamp-3 text-sm font-light leading-relaxed text-neutral-400">
            {tour.shortDescription}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-[11px] uppercase tracking-widest text-neutral-400">
          <span className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/25 px-3 py-2">
            <Clock className="h-4 w-4 text-gold" />
            {tour.suggestedDuration}
          </span>
          <span className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/25 px-3 py-2">
            <Users className="h-4 w-4 text-gold" />
            Up to {tour.maxPersons}
          </span>
        </div>

        <div className="mt-auto flex flex-wrap gap-2">
          {tour.categories.slice(0, 3).map((category) => (
            <span
              key={category}
              className="inline-flex items-center gap-1 rounded-full border border-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-300"
            >
              <Sparkles className="h-3 w-3 text-gold" />
              {category}
            </span>
          ))}
        </div>

        <GoldButton
          onClick={(event) => {
            event.stopPropagation();
            onSelect(tour);
          }}
          className="mt-1 w-full justify-center"
        >
          <span className="inline-flex items-center justify-center gap-2">
            {buttonText || "View Details & Book"}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </GoldButton>
      </div>
    </motion.article>
  );
}
