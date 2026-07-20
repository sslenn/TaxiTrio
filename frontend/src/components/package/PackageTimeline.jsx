import { motion } from 'framer-motion';
import { Clock, MapPin } from 'lucide-react';

const fallbackImage = '/images/gallery_angkor1.jpg';

export default function PackageTimeline({ itinerary }) {
  if (!itinerary || itinerary.length === 0) return null;

  return (
    <section className="flex flex-col gap-6">
      <SectionHeading eyebrow="Private Route" title="Itinerary Timeline" />

      <div className="relative ml-3 flex flex-col gap-5 border-l border-white/10 pl-6 md:ml-5 md:pl-8">
        {itinerary.map((item, index) => (
          (() => {
            const itemImage = normalizeImage(item.image, item.location || item.title);

            return (
          <motion.article
            key={`${item.time}-${item.location || item.title}-${index}`}
            initial={{ opacity: 0, x: -18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.24) }}
            className="group relative"
          >
            <span className="absolute -left-[34px] top-5 flex h-5 w-5 items-center justify-center rounded-full border border-gold bg-[#0A0A0A] shadow-[0_0_18px_rgba(212,175,55,0.35)] md:-left-[42px]">
              <span className="h-2 w-2 rounded-full bg-gold" />
            </span>

            <div className="grid gap-4 overflow-hidden rounded-2xl border border-white/10 bg-[#121212] p-4 transition duration-300 group-hover:border-gold/40 group-hover:shadow-[0_18px_45px_rgba(212,175,55,0.06)] md:grid-cols-[160px_1fr]">
              <div className="relative h-36 overflow-hidden rounded-xl border border-white/10 md:h-full">
                <img
                  src={itemImage.src}
                  alt={itemImage.alt}
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.src = fallbackImage;
                  }}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-3 left-3 rounded-full border border-gold/35 bg-black/55 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-gold backdrop-blur-md">
                  {item.time}
                </span>
              </div>

              <div className="flex flex-col justify-center gap-3">
                <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-gold" />
                    {item.duration || 'Flexible'}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-gold" />
                    {item.location || item.title}
                  </span>
                </div>
                <h3 className="font-serif text-xl font-bold text-white">{item.title || item.location}</h3>
                <p className="text-sm font-light leading-7 text-neutral-400">
                  {item.description || item.desc}
                </p>
              </div>
            </div>
          </motion.article>
            );
          })()
        ))}
      </div>
    </section>
  );
}

function normalizeImage(imageData, label) {
  if (typeof imageData === 'string') {
    return { src: imageData, alt: label };
  }

  return {
    src: imageData?.src || fallbackImage,
    alt: imageData?.alt || label,
  };
}

function SectionHeading({ eyebrow, title }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-black uppercase tracking-[0.28em] text-gold">{eyebrow}</span>
      <h2 className="border-l-2 border-gold pl-3 font-serif text-2xl font-bold text-white">{title}</h2>
    </div>
  );
}
