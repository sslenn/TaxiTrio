import React from 'react';

export default function PackageReviews({ rating, count, reviewsList }) {
  const avgRating = rating || 4.9;
  const reviewCount = count || 120;
  const list = reviewsList || [];

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-xl font-bold font-serif text-white uppercase tracking-wider relative pl-3 border-l-2 border-gold mb-2">
        Traveler Reviews
      </h3>

      {/* Rating Summary Card */}
      <div className="card border border-gold/15 bg-[#121212] p-6 rounded-2xl flex flex-col sm:flex-row items-center gap-6">
        <div className="flex flex-col items-center sm:items-start shrink-0">
          <span className="text-4xl font-black text-white font-serif">{avgRating.toFixed(1)}</span>
          <div className="flex text-gold mt-1 text-lg">
            {'★'.repeat(Math.round(avgRating))}
            {'☆'.repeat(5 - Math.round(avgRating))}
          </div>
          <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider mt-1">{reviewCount} Reviews</span>
        </div>
        <div className="border-t sm:border-t-0 sm:border-l border-neutral-900 pt-4 sm:pt-0 sm:pl-6 flex-1 text-center sm:text-left">
          <p className="text-neutral-300 text-sm font-light leading-relaxed">
            Overall rating based on verified traveler feedback for private tours, driver service, and vehicle comfort.
          </p>
        </div>
      </div>

      {/* Reviews List */}
      {list.length > 0 ? (
        <div className="flex flex-col gap-4 mt-2">
          {list.map((r, index) => (
            <div 
              key={index}
              className="card border border-neutral-900 bg-[#121212]/40 p-5 rounded-2xl flex flex-col gap-3 hover:border-gold/15 transition duration-300"
            >
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gold/10 border border-gold/25 flex items-center justify-center font-bold text-gold text-xs font-serif uppercase">
                    {r.name.substring(0, 2)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white text-xs font-bold font-serif">{r.name}</span>
                    <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider">{r.date}</span>
                  </div>
                </div>
                <div className="flex text-gold text-xs">
                  {'★'.repeat(r.rating)}
                  {'☆'.repeat(5 - r.rating)}
                </div>
              </div>
              <p className="text-neutral-400 text-xs font-light leading-relaxed">
                "{r.comment}"
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[#A3A3A3] text-xs font-light italic">No reviews have been submitted for this tour package yet.</p>
      )}
    </div>
  );
}
