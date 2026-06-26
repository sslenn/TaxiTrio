import React from 'react';
import { MapPin, Clock, Users, Map } from 'lucide-react';

export default function PackageHero({ name, description, durationDays, maxPersons, province, bannerImage }) {
  return (
    <div className="relative w-full h-[60vh] md:h-[70vh] min-h-[400px] overflow-hidden rounded-3xl border border-gold/15 shadow-2xl">
      {/* Background Banner Image */}
      <img
        src={bannerImage || '/images/tour_package.jpg'}
        alt={name}
        className="absolute inset-0 w-full h-full object-cover select-none"
      />

      {/* Dark Premium Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/75 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0B] via-[#0B0B0B]/30 to-transparent"></div>

      {/* Content Container */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 gap-6 z-10 max-w-4xl">
        <div className="flex flex-col gap-2">
          {/* Destination Badge */}
          {province && (
            <span className="self-start text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/35 px-3.5 py-1.5 rounded-full shadow-[0_0_15px_rgba(212,175,55,0.08)] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" /> {province}
            </span>
          )}
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white font-serif tracking-tight leading-tight mt-2 drop-shadow-lg">
            {name}
          </h1>
          
          <p className="text-neutral-300 text-sm md:text-base font-light leading-relaxed max-w-2xl mt-1 drop-shadow-md">
            {description}
          </p>
        </div>

        {/* Hero Metadata Info Cards */}
        <div className="flex flex-wrap gap-4 mt-2">
          {/* Duration Card */}
          <div className="bg-[#151515]/85 backdrop-blur-md border border-gold/15 px-5 py-3 rounded-2xl flex items-center gap-3">
            <Clock className="w-5 h-5 text-gold shrink-0" />
            <div className="flex flex-col">
              <span className="text-[9px] text-neutral-500 uppercase font-bold tracking-wider">Duration</span>
              <span className="text-xs font-bold text-white mt-0.5">{durationDays} Day(s)</span>
            </div>
          </div>

          {/* Group Size Card */}
          <div className="bg-[#151515]/85 backdrop-blur-md border border-gold/15 px-5 py-3 rounded-2xl flex items-center gap-3">
            <Users className="w-5 h-5 text-gold shrink-0" />
            <div className="flex flex-col">
              <span className="text-[9px] text-neutral-500 uppercase font-bold tracking-wider">Group Size</span>
              <span className="text-xs font-bold text-white mt-0.5">Up to {maxPersons} Pax</span>
            </div>
          </div>

          {/* Location Card */}
          {province && (
            <div className="bg-[#151515]/85 backdrop-blur-md border border-gold/15 px-5 py-3 rounded-2xl flex items-center gap-3">
              <Map className="w-5 h-5 text-gold shrink-0" />
              <div className="flex flex-col">
                <span className="text-[9px] text-neutral-500 uppercase font-bold tracking-wider">Location</span>
                <span className="text-xs font-bold text-white mt-0.5">{province}, Cambodia</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
