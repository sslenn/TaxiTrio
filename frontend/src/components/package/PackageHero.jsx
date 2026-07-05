import { motion } from 'framer-motion';
import { Calendar, Clock, Map, MapPin, Star, Users } from 'lucide-react';
import GoldButton from '../GoldButton';

const fallbackImage = '/images/gallery_angkor1.jpg';

export default function PackageHero({
  name,
  description,
  durationDays,
  maxPersons,
  province,
  destination,
  bannerImage,
  price,
  rating,
  onBookClick,
}) {
  const heroImage =
    typeof bannerImage === 'string'
      ? { src: bannerImage, alt: name }
      : bannerImage || { src: fallbackImage, alt: name };

  return (
    <section className="relative min-h-[560px] w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl md:min-h-[660px]">
      <img
        src={heroImage.src || fallbackImage}
        alt={heroImage.alt || name}
        loading="eager"
        onError={(event) => {
          event.currentTarget.src = fallbackImage;
        }}
        className="absolute inset-0 h-full w-full select-none object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/55 to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65 }}
        className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-7 p-6 md:p-10 lg:p-12"
      >
        <div className="flex max-w-4xl flex-col gap-4">
          <div className="flex flex-wrap gap-3">
            {province && (
              <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-black/55 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-gold backdrop-blur-md">
                <MapPin className="h-3.5 w-3.5" />
                {province}
              </span>
            )}
            {destination && (
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/45 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-white backdrop-blur-md">
                <Map className="h-3.5 w-3.5 text-gold" />
                {destination}
              </span>
            )}
          </div>

          <h1 className="font-serif text-4xl font-black leading-[0.95] text-white md:text-6xl lg:text-7xl">
            {name}
          </h1>

          <p className="max-w-3xl text-sm font-light leading-7 text-neutral-200 md:text-base">
            {description}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <HeroMetric icon={Star} label="Rating" value={`${Number(rating || 4.9).toFixed(1)} / 5`} />
          <HeroMetric icon={Clock} label="Duration" value={`${durationDays} ${durationDays === 1 ? 'Day' : 'Days'}`} />
          <HeroMetric icon={Calendar} label="From" value={`$${Number(price || 0).toFixed(0)}`} />
          <HeroMetric icon={Users} label="Capacity" value={`Up to ${maxPersons}`} />
          <GoldButton onClick={onBookClick} className="h-full min-h-16 w-full">
            Book Now
          </GoldButton>
        </div>
      </motion.div>
    </section>
  );
}

function HeroMetric({ icon: Icon, label, value }) {
  return (
    <div className="flex min-h-16 items-center gap-3 rounded-2xl border border-white/10 bg-black/55 px-4 py-3 backdrop-blur-md">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/25 bg-gold/10 text-gold">
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-[9px] font-black uppercase tracking-[0.22em] text-neutral-500">{label}</span>
        <span className="block truncate text-sm font-bold text-white">{value}</span>
      </span>
    </div>
  );
}
