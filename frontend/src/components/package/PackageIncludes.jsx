import React from 'react';

export default function PackageIncludes({ includedItems, excludedItems }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* What's Included */}
      {includedItems && includedItems.length > 0 && (
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-bold font-serif text-white uppercase tracking-wider relative pl-3 border-l-2 border-emerald-500 mb-2">
            What's Included
          </h3>
          <div className="flex flex-col gap-3">
            {includedItems.map((item, index) => (
              <div 
                key={index} 
                className="bg-emerald-950/10 border border-emerald-900/20 p-4 rounded-xl flex items-center gap-3"
              >
                <span className="text-emerald-500 font-bold text-lg select-none">✓</span>
                <span className="text-neutral-300 text-sm font-light">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* What's Not Included */}
      {excludedItems && excludedItems.length > 0 && (
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-bold font-serif text-white uppercase tracking-wider relative pl-3 border-l-2 border-rose-500 mb-2">
            What's Not Included
          </h3>
          <div className="flex flex-col gap-3">
            {excludedItems.map((item, index) => (
              <div 
                key={index} 
                className="bg-rose-950/10 border border-rose-900/20 p-4 rounded-xl flex items-center gap-3"
              >
                <span className="text-rose-500 font-bold text-lg select-none">✗</span>
                <span className="text-neutral-300 text-sm font-light">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
