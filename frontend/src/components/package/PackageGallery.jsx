import React from 'react';

export default function PackageGallery({ galleryImages }) {
  if (!galleryImages || galleryImages.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xl font-bold font-serif text-white uppercase tracking-wider relative pl-3 border-l-2 border-gold mb-2">
        Package Gallery
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {galleryImages.map((imgUrl, index) => (
          <div
            key={index}
            className="group relative h-40 md:h-48 overflow-hidden rounded-2xl border border-gold/10 hover:border-gold/40 transition duration-300 shadow-md"
          >
            <img
              src={imgUrl}
              alt={`Gallery Destination ${index + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500 select-none"
            />
            {/* Soft Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/40 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
