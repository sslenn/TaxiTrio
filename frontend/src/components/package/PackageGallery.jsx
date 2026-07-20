import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';

const fallbackImage = '/images/gallery_angkor1.jpg';

export default function PackageGallery({ galleryImages }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const [touchStart, setTouchStart] = useState(null);

  if (!galleryImages || galleryImages.length === 0) return null;

  const openIndex = typeof activeIndex === 'number';
  const activeImage = openIndex ? normalizeImage(galleryImages[activeIndex], activeIndex) : null;

  const showPrevious = () => {
    setActiveIndex((index) => (index === 0 ? galleryImages.length - 1 : index - 1));
  };

  const showNext = () => {
    setActiveIndex((index) => (index === galleryImages.length - 1 ? 0 : index + 1));
  };

  const handleTouchEnd = (event) => {
    if (touchStart === null) return;
    const distance = event.changedTouches[0].clientX - touchStart;
    if (Math.abs(distance) > 50) {
      if (distance > 0) showPrevious();
      else showNext();
    }
    setTouchStart(null);
  };

  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-black uppercase tracking-[0.28em] text-gold">Visual Story</span>
        <h2 className="border-l-2 border-gold pl-3 font-serif text-2xl font-bold text-white">Package Gallery</h2>
      </div>

      <div className="grid auto-rows-[160px] grid-cols-2 gap-3 md:auto-rows-[190px] md:grid-cols-4">
        {galleryImages.map((imgData, index) => {
          const galleryImage = normalizeImage(imgData, index);

          return (
          <motion.button
            type="button"
            key={`${galleryImage.src}-${index}`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.24) }}
            onClick={() => setActiveIndex(index)}
            className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-[#121212] text-left transition duration-300 hover:border-gold/45 ${
              index === 0 || index === 3 ? 'md:row-span-2' : ''
            }`}
          >
            <img
              src={galleryImage.src}
              alt={galleryImage.alt}
              loading="lazy"
              onError={(event) => {
                event.currentTarget.src = fallbackImage;
              }}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
            />
            <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white opacity-0 backdrop-blur-md transition group-hover:opacity-100">
              <Maximize2 className="h-4 w-4" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent opacity-0 transition group-hover:opacity-100" />
          </motion.button>
          );
        })}
      </div>

      {openIndex && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          onTouchStart={(event) => setTouchStart(event.touches[0].clientX)}
          onTouchEnd={handleTouchEnd}
        >
          <button
            type="button"
            onClick={() => setActiveIndex(null)}
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:border-gold hover:text-gold"
            aria-label="Close gallery"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={showPrevious}
            className="absolute left-4 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:border-gold hover:text-gold md:flex"
            aria-label="Previous gallery image"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <img
            src={activeImage.src}
            alt={activeImage.alt}
            onError={(event) => {
              event.currentTarget.src = fallbackImage;
            }}
            className="max-h-[82vh] w-full max-w-6xl rounded-2xl border border-white/10 object-contain shadow-2xl"
          />

          <button
            type="button"
            onClick={showNext}
            className="absolute right-4 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:border-gold hover:text-gold md:flex"
            aria-label="Next gallery image"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </section>
  );
}

function normalizeImage(imageData, index) {
  if (typeof imageData === 'string') {
    return { src: imageData, alt: `Tour gallery image ${index + 1}` };
  }

  return {
    src: imageData?.src || fallbackImage,
    alt: imageData?.alt || `Tour gallery image ${index + 1}`,
  };
}
