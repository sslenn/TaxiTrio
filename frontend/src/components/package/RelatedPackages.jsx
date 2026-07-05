import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Clock, MapPin, Users } from 'lucide-react';

const fallbackImage = '/images/gallery_angkor1.jpg';

export default function RelatedPackages({ title = 'Similar Tours', tours = [] }) {
  const navigate = useNavigate();

  if (!tours.length) return null;

  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-black uppercase tracking-[0.28em] text-gold">Recommended</span>
        <h2 className="border-l-2 border-gold pl-3 font-serif text-2xl font-bold text-white">{title}</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {tours.map((tour) => (
          (() => {
            const cardImage = tour.cardImage || { src: tour.image, alt: `${tour.destination}, ${tour.province}` };

            return (
          <article
            key={tour.id}
            onClick={() => navigate(tour.routePath)}
            className="group cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#121212] transition duration-300 hover:-translate-y-1 hover:border-gold/45 hover:shadow-[0_18px_48px_rgba(212,175,55,0.08)]"
          >
            <div className="relative h-40 overflow-hidden">
              <img
                src={cardImage.src}
                alt={cardImage.alt}
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.src = fallbackImage;
                }}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
              <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/55 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-md">
                <MapPin className="h-3.5 w-3.5 text-gold" />
                {tour.province}
              </span>
            </div>
            <div className="flex flex-col gap-4 p-4">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-serif text-lg font-bold leading-tight text-white">{tour.destination}</h3>
                  <span className="shrink-0 text-sm font-black text-gold">${tour.price}</span>
                </div>
                <p className="mt-2 line-clamp-2 text-xs font-light leading-5 text-neutral-400">
                  {tour.shortDescription}
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-3 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-gold" />
                  {tour.suggestedDuration}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-gold" />
                  {tour.maxPersons}
                </span>
                <ArrowUpRight className="h-4 w-4 text-gold" />
              </div>
            </div>
          </article>
            );
          })()
        ))}
      </div>
    </section>
  );
}
