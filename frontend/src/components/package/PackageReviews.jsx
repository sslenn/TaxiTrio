import { BadgeCheck, Star } from 'lucide-react';

const fallbackImage = '/images/gallery_angkor2.jpg';

export default function PackageReviews({ rating, count, reviewsList, breakdown }) {
  const avgRating = Number(rating || 4.9);
  const reviewCount = count || 120;
  const list = reviewsList || [];
  const bars =
    breakdown || [
      { label: 'Excellent', value: 82 },
      { label: 'Very Good', value: 14 },
      { label: 'Good', value: 4 },
      { label: 'Fair', value: 0 },
      { label: 'Poor', value: 0 },
    ];

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-black uppercase tracking-[0.28em] text-gold">Guest Confidence</span>
        <h2 className="border-l-2 border-gold pl-3 font-serif text-2xl font-bold text-white">Traveler Reviews</h2>
      </div>

      <div className="grid gap-5 rounded-2xl border border-white/10 bg-[#121212] p-5 md:grid-cols-[220px_1fr] md:p-6">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-gold/20 bg-black/30 p-5 text-center">
          <span className="font-serif text-5xl font-black text-white">{avgRating.toFixed(1)}</span>
          <div className="mt-2 flex text-gold">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className={`h-4 w-4 ${index < Math.round(avgRating) ? 'fill-gold' : ''}`}
              />
            ))}
          </div>
          <span className="mt-2 text-[10px] font-black uppercase tracking-[0.22em] text-neutral-500">
            {reviewCount} verified reviews
          </span>
        </div>

        <div className="flex flex-col justify-center gap-3">
          {bars.map((item) => (
            <div key={item.label} className="grid grid-cols-[92px_1fr_38px] items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">{item.label}</span>
              <span className="h-2 overflow-hidden rounded-full bg-white/10">
                <span
                  className="block h-full rounded-full bg-gold"
                  style={{ width: `${Math.min(item.value, 100)}%` }}
                />
              </span>
              <span className="text-right text-[10px] font-bold text-neutral-500">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {list.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {list.map((review) => (
            <article
              key={`${review.name}-${review.date}`}
              className="overflow-hidden rounded-2xl border border-white/10 bg-[#121212] transition duration-300 hover:border-gold/30"
            >
              {review.photo && (
                <div className="h-44 overflow-hidden">
                  <img
                    src={review.photo}
                    alt={`${review.name} traveler photo`}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.src = fallbackImage;
                    }}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="flex flex-col gap-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      loading="lazy"
                      className="h-11 w-11 rounded-full border border-gold/25 object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-base font-bold text-white">{review.name}</h3>
                        {review.verified && <BadgeCheck className="h-4 w-4 text-gold" />}
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                        {review.country} - {review.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 text-gold">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className={`h-3.5 w-3.5 ${index < review.rating ? 'fill-gold' : ''}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm font-light leading-7 text-neutral-300">"{review.comment}"</p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="text-sm italic text-neutral-500">No reviews have been submitted for this tour package yet.</p>
      )}
    </section>
  );
}
