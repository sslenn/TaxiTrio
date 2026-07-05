import { Star, Utensils } from 'lucide-react';

export default function RestaurantRecommendation({ restaurant }) {
  if (!restaurant) return null;
  const { name, rating, reason, image } = restaurant;

  return (
    <div className="bg-[#0b0b0b] border border-gold/15 rounded-2xl p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center text-left">
      <div className="w-16 h-16 rounded-xl bg-gold/10 border border-gold/25 flex items-center justify-center text-gold shrink-0 self-center">
        <Utensils className="w-8 h-8" />
      </div>

      <div className="flex-grow flex flex-col gap-1.5 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase font-bold text-neutral-500 tracking-widest">Recommended Restaurant</span>
            <h4 className="font-serif text-lg font-bold text-white mt-0.5">{name}</h4>
          </div>
          
          {/* Rating */}
          <div className="flex items-center gap-0.5 mt-0.5 sm:mt-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(rating) ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-neutral-700'
                }`}
              />
            ))}
          </div>
        </div>

        <p className="text-xs text-neutral-400 font-light leading-relaxed">
          <strong className="text-gold/90 font-medium">Why go here:</strong> {reason}
        </p>
      </div>
    </div>
  );
}
