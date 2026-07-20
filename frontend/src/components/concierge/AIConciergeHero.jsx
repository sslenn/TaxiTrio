import { Sparkles } from 'lucide-react';

export default function AIConciergeHero() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#D4AF37]/15 bg-[#121212] p-6 shadow-2xl flex flex-col gap-6 items-center text-center w-full">
      {/* Golden Blur Bubbles */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4AF37]/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Circular Glowing Luxury Avatar */}
      <div className="relative w-24 h-24 rounded-full border border-dashed border-[#D4AF37]/20 flex items-center justify-center mt-2 shrink-0">
        <div className="w-16 h-16 rounded-full border border-double border-[#D4AF37]/35 bg-gradient-to-tr from-gold/15 via-[#0b0b0b] to-gold/15 flex items-center justify-center shadow-lg shadow-gold/25 pulse-glow-ring">
          <span className="text-sm font-serif font-black text-gold tracking-widest animate-pulse">TT</span>
        </div>
      </div>

      {/* Hero Content */}
      <div className="flex flex-col gap-3 items-center">
        <div className="flex items-center gap-2 px-3 py-1.5 w-fit rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/25 text-[#D4AF37] text-[10px] font-black uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 font-bold" />
          <span>AI Travel Concierge</span>
        </div>

        <h1 className="font-serif text-lg md:text-xl font-bold text-white tracking-wide leading-tight">
          Your Personal <span className="text-[#D4AF37]">Digital Travel Consultant</span>
        </h1>

        <p className="text-neutral-400 text-xs font-light leading-relaxed max-w-xs">
          I am here to guide you. Describe your preferences or select quick interests in the form. I will recommend the best routes, attractions, and custom travel timings across Cambodia.
        </p>
      </div>
    </div>
  );
}
