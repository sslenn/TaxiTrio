import { Hotel, MapPin, Navigation, Route } from 'lucide-react';

export default function PackageMap({ tour }) {
  if (!tour?.coordinates) return null;

  const { lat, lng } = tour.coordinates;
  const mapUrl = `https://www.google.com/maps?q=${lat},${lng}&z=10&output=embed`;

  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-black uppercase tracking-[0.28em] text-gold">Route Context</span>
        <h2 className="border-l-2 border-gold pl-3 font-serif text-2xl font-bold text-white">Interactive Map</h2>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#121212]">
        <div className="h-[360px] w-full">
          <iframe
            title={`${tour.destination} map`}
            src={mapUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full w-full grayscale-[0.25] invert-0"
          />
        </div>

        <div className="grid gap-4 border-t border-white/10 p-5 md:grid-cols-3">
          <MapInfo icon={MapPin} label="Destination Marker" value={`${tour.destination}, ${tour.province}`} />
          <MapInfo icon={Hotel} label="Hotel Pickup Area" value={tour.pickupArea} />
          <MapInfo icon={Route} label="Route Style" value="Private door-to-door touring route" />
        </div>

        <div className="border-t border-white/10 p-5">
          <div className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-gold">
            <Navigation className="h-4 w-4" />
            Nearby Attractions
          </div>
          <div className="flex flex-wrap gap-2">
            {(tour.nearbyAttractions || []).map((attraction) => (
              <span
                key={attraction}
                className="rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-xs text-neutral-300"
              >
                {attraction}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MapInfo({ icon: Icon, label, value }) {
  return (
    <div className="flex gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/25 bg-gold/10 text-gold">
        <Icon className="h-4 w-4" />
      </span>
      <span>
        <span className="block text-[9px] font-black uppercase tracking-[0.22em] text-neutral-500">{label}</span>
        <span className="text-sm font-light leading-6 text-neutral-200">{value}</span>
      </span>
    </div>
  );
}
