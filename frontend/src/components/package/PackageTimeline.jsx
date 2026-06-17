import React from 'react';

export default function PackageTimeline({ itinerary }) {
  if (!itinerary || itinerary.length === 0) return null;

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-xl font-bold font-serif text-white uppercase tracking-wider relative pl-3 border-l-2 border-gold mb-2">
        Itinerary Timeline
      </h3>

      <div className="relative border-l border-neutral-800 ml-4 pl-6 md:pl-8 flex flex-col gap-8">
        {itinerary.map((item, index) => (
          <div key={index} className="relative group">
            {/* Timeline Dot */}
            <span className="absolute -left-[31px] md:-left-[39px] top-1.5 w-4.5 h-4.5 rounded-full bg-[#0B0B0B] border-2 border-gold flex items-center justify-center shadow-[0_0_10px_rgba(212,175,55,0.4)] group-hover:scale-110 transition duration-300">
              <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
            </span>

            {/* Timeline Card */}
            <div className="card border border-gold/10 bg-[#121212] p-5 rounded-2xl flex flex-col md:flex-row md:items-start gap-4 hover:border-gold/30 transition duration-300 relative overflow-hidden">
              <div className="absolute -right-16 -top-16 w-32 h-32 rounded-full bg-gold/5 blur-2xl group-hover:bg-gold/10 transition duration-300"></div>

              {/* Time Indicator */}
              <div className="text-[#D4AF37] font-serif font-black tracking-widest text-sm uppercase shrink-0 min-w-[90px] border-b border-neutral-900 md:border-b-0 md:border-r md:border-neutral-900 pb-2 md:pb-0 md:pr-4">
                🕒 {item.time}
              </div>

              {/* Event Content */}
              <div className="flex flex-col gap-1 flex-1">
                <h4 className="font-bold text-white font-serif text-base tracking-wide">
                  {item.title}
                </h4>
                <p className="text-neutral-400 text-xs font-light leading-relaxed mt-0.5">
                  {item.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
