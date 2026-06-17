import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function RelatedPackages({ currentId, allPackages }) {
  const navigate = useNavigate();

  // Filter out the current package and get up to 3 similar packages
  const related = (allPackages || [])
    .filter((p) => p.id !== currentId && p.is_active)
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <div className="flex flex-col gap-6 mt-8">
      <h3 className="text-xl font-bold font-serif text-white uppercase tracking-wider relative pl-3 border-l-2 border-gold mb-2">
        Similar Packages
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {related.map((p) => (
          <div 
            key={p.id}
            onClick={() => navigate(`/traveler/packages/${p.id}`)}
            className="card border border-gold/15 bg-[#121212] p-5 rounded-2xl flex flex-col justify-between gap-5 relative group hover:border-gold/50 hover:shadow-[0_0_20px_rgba(212,175,55,0.03)] cursor-pointer transition duration-300"
          >
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-gold text-sm truncate pr-2 font-serif group-hover:underline">
                  {p.name}
                </h4>
                <span className="text-xs font-black text-white bg-[#0B0B0B] px-2.5 py-1 rounded-lg border border-gold/10">
                  ${Number(p.price).toFixed(2)}
                </span>
              </div>
              <p className="text-[#A3A3A3] text-xs leading-relaxed mt-1 line-clamp-2 font-light">
                {p.description}
              </p>
            </div>
            
            <div className="border-t border-neutral-900 pt-3 flex items-center justify-between text-[10px] text-neutral-400">
              <span>⏱ {p.duration_days} Day(s)</span>
              <span>👥 Max {p.max_persons} Persons</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
