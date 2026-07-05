import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIThinking({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Increment progress bar smoothly to 100% over 3.5s
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) {
          return prev + 1;
        }
        clearInterval(progressInterval);
        return 100;
      });
    }, 35);

    return () => {
      clearInterval(progressInterval);
    };
  }, []);

  // When progress reaches 100%, invoke onComplete callback
  useEffect(() => {
    if (progress === 100) {
      const delay = setTimeout(() => {
        onComplete();
      }, 500); // slight delay for visual satisfaction
      return () => clearTimeout(delay);
    }
  }, [progress, onComplete]);

  // Determine status of each step based on progress
  const getStepStatus = (stepProgressThreshold) => {
    return progress >= stepProgressThreshold ? (
      <span className="text-emerald-500 font-bold">✓</span>
    ) : (
      <span className="text-gold animate-pulse">⏳</span>
    );
  };

  // Generate ASCII progress bar
  const getAsciiProgressBar = () => {
    const totalBlocks = 10;
    const filledBlocks = Math.floor(progress / 10);
    const emptyBlocks = totalBlocks - filledBlocks;
    const bar = '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);
    return `${bar} ${progress}%`;
  };

  return (
    <div className="bg-[#121212] border border-gold/15 rounded-3xl p-8 shadow-2xl flex flex-col gap-6 text-left relative overflow-hidden min-h-[360px]">
      {/* Decorative pulse blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gold/5 rounded-full blur-3xl animate-pulse pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-3 border-b border-neutral-900 pb-4">
        <div className="w-10 h-10 rounded-full border border-gold/25 bg-[#0b0b0b] flex items-center justify-center text-sm shadow-md animate-pulse shrink-0">
          ✨
        </div>
        <div className="flex flex-col">
          <h3 className="text-xs uppercase font-black text-[#BFA76A] tracking-widest">
            AI Travel Concierge
          </h3>
          <span className="text-[10px] text-neutral-500 font-light">Planning your journey...</span>
        </div>
      </div>

      {/* Dynamic checklist */}
      <div className="flex flex-col gap-3.5 my-2 z-10">
        <div className="flex items-center gap-2.5 text-xs text-neutral-300 font-medium">
          <span className="w-5 flex justify-center text-[13px] shrink-0">{getStepStatus(25)}</span>
          <span className={progress >= 25 ? "text-neutral-400 font-light" : "text-white"}>Understanding your preferences</span>
        </div>
        <div className="flex items-center gap-2.5 text-xs text-neutral-300 font-medium">
          <span className="w-5 flex justify-center text-[13px] shrink-0">{getStepStatus(50)}</span>
          <span className={progress >= 50 ? "text-neutral-400 font-light" : "text-white"}>Finding attractions</span>
        </div>
        <div className="flex items-center gap-2.5 text-xs text-neutral-300 font-medium">
          <span className="w-5 flex justify-center text-[13px] shrink-0">{getStepStatus(75)}</span>
          <span className={progress >= 75 ? "text-neutral-400 font-light" : "text-white"}>Optimizing travel route</span>
        </div>
        <div className="flex items-center gap-2.5 text-xs text-neutral-300 font-medium">
          <span className="w-5 flex justify-center text-[13px] shrink-0">{getStepStatus(95)}</span>
          <span className={progress >= 95 ? "text-neutral-400 font-light" : "text-white"}>Recommending restaurants</span>
        </div>
      </div>

      {/* ASCII Progress Loader */}
      <div className="mt-auto border-t border-neutral-900 pt-4 flex flex-col gap-2 z-10">
        <div className="font-mono text-xs text-[#D4AF37] font-semibold tracking-wider text-center bg-[#0b0b0b] border border-white/5 py-3 rounded-xl select-none">
          {getAsciiProgressBar()}
        </div>
        <p className="text-[10px] text-neutral-500 text-center font-medium uppercase tracking-widest">
          Creating your personalized itinerary...
        </p>
      </div>
    </div>
  );
}
