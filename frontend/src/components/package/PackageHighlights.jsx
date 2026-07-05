import { Camera, Compass, Landmark, Leaf, Mountain, Sparkles, Waves } from 'lucide-react';

const iconMap = {
  unesco: Landmark,
  scenic: Mountain,
  culture: Compass,
  photography: Camera,
  nature: Leaf,
  adventure: Sparkles,
  beach: Waves,
};

const getIcon = (label) => {
  const key = label.toLowerCase();
  if (key.includes('unesco') || key.includes('temple') || key.includes('ancient')) return iconMap.unesco;
  if (key.includes('view') || key.includes('mountain') || key.includes('cliff')) return iconMap.scenic;
  if (key.includes('culture') || key.includes('village') || key.includes('market')) return iconMap.culture;
  if (key.includes('photo') || key.includes('sunrise')) return iconMap.photography;
  if (key.includes('nature') || key.includes('forest') || key.includes('eco')) return iconMap.nature;
  if (key.includes('beach') || key.includes('island')) return iconMap.beach;
  return iconMap.adventure;
};

export default function PackageHighlights({ highlights = [] }) {
  if (!highlights.length) return null;

  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-black uppercase tracking-[0.28em] text-gold">Tour Highlights</span>
        <h2 className="border-l-2 border-gold pl-3 font-serif text-2xl font-bold text-white">Signature Moments</h2>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {highlights.map((highlight) => {
          const Icon = getIcon(highlight);
          return (
            <div
              key={highlight}
              className="rounded-2xl border border-white/10 bg-[#121212] p-4 transition duration-300 hover:border-gold/35 hover:bg-[#151515]"
            >
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-gold/25 bg-gold/10 text-gold">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="font-serif text-lg font-bold text-white">{highlight}</h3>
            </div>
          );
        })}
      </div>
    </section>
  );
}
