import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';

// Fix default marker icon issue in Leaflet + Vite compilation
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function MapPicker({ onSelectPickup, onSelectDropoff, onlyPickup = false }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const pickupMarker = useRef(null);
  const dropoffMarker = useRef(null);
  const routeLayer = useRef(null);

  const [activePin, setActivePin] = useState('pickup');

  const drawRoute = async (pickupLatLng, dropoffLatLng) => {
    if (!mapInstance.current) return;
    
    if (routeLayer.current) {
      mapInstance.current.removeLayer(routeLayer.current);
      routeLayer.current = null;
    }

    try {
      const res = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${pickupLatLng.lng},${pickupLatLng.lat};${dropoffLatLng.lng},${dropoffLatLng.lat}?overview=full&geometries=geojson`
      );
      const data = await res.json();
      
      if (data.code === 'Ok' && data.routes?.length > 0) {
        const route = data.routes[0];
        
        routeLayer.current = L.geoJSON(route.geometry, {
          style: {
            color: 'var(--color-accent, #D4AF37)',
            weight: 5,
            opacity: 0.85,
            lineCap: 'round',
            lineJoin: 'round'
          }
        }).addTo(mapInstance.current);

        const bounds = routeLayer.current.getBounds();
        mapInstance.current.fitBounds(bounds, {
          padding: [50, 50]
        });
      }
    } catch (err) {
      console.error('Error drawing map route:', err);
    }
  };
  const [pickupAddr, setPickupAddr] = useState('');
  const [dropoffAddr, setDropoffAddr] = useState('');
  const [resolving, setResolving] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const defaultLat = 11.5564;
  const defaultLng = 104.9282;

  // Ref to store the latest click handler to avoid React state closure stale issue
  const handleMapClickRef = useRef(null);

  useEffect(() => {
    handleMapClickRef.current = handleMapClick;
  });

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map with a dark basemap
    mapInstance.current = L.map(mapRef.current, {
      zoomControl: false // Hide default zoom control to customize placement or style
    }).setView([defaultLat, defaultLng], 13);

    // Standard OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(mapInstance.current);

    // Add zoom control in top-right corner to keep UI neat
    L.control.zoom({ position: 'topright' }).addTo(mapInstance.current);

    mapInstance.current.on('click', async (e) => {
      const { lat, lng } = e.latlng;
      if (handleMapClickRef.current) {
        await handleMapClickRef.current(lat, lng);
      }
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  const reverseGeocode = async (lat, lng) => {
    setResolving(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
        {
          headers: {
            'User-Agent': 'TaxiTrio-App-Cambodia',
          },
        }
      );
      const data = await res.json();
      setResolving(false);
      return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } catch (err) {
      console.error('Reverse geocoding error:', err);
      setResolving(false);
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  };

  const handleMapClick = async (lat, lng) => {
    const address = await reverseGeocode(lat, lng);

    if (activePin === 'pickup' || onlyPickup) {
      setPickupAddr(address);
      onSelectPickup(address, { lat, lng });

      if (pickupMarker.current) {
        pickupMarker.current.setLatLng([lat, lng]);
      } else {
        const greenIcon = new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });

        pickupMarker.current = L.marker([lat, lng], { icon: greenIcon })
          .addTo(mapInstance.current)
          .bindPopup('Pickup Location')
          .openPopup();
      }

      if (!onlyPickup) {
        if (dropoffMarker.current) {
          const dropoffLatLng = dropoffMarker.current.getLatLng();
          drawRoute({ lat, lng }, dropoffLatLng);
        } else {
          setActivePin('dropoff');
        }
      }
    } else {
      setDropoffAddr(address);
      onSelectDropoff(address, { lat, lng });

      if (dropoffMarker.current) {
        dropoffMarker.current.setLatLng([lat, lng]);
      } else {
        const redIcon = new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });

        dropoffMarker.current = L.marker([lat, lng], { icon: redIcon })
          .addTo(mapInstance.current)
          .bindPopup('Dropoff Location')
          .openPopup();
      }

      if (pickupMarker.current) {
        const pickupLatLng = pickupMarker.current.getLatLng();
        drawRoute(pickupLatLng, { lat, lng });
      }
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=kh`,
        {
          headers: {
            'User-Agent': 'TaxiTrio-App-Cambodia',
          },
        }
      );
      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      console.error('Search query error:', err);
    } finally {
      setSearching(false);
    }
  };

  const selectSearchResult = async (result) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);

    if (mapInstance.current) {
      mapInstance.current.setView([lat, lng], 15);
    }

    await handleMapClick(lat, lng);
    setSearchQuery('');
    setSearchResults([]);
  };

  const clearPins = () => {
    if (pickupMarker.current) {
      mapInstance.current.removeLayer(pickupMarker.current);
      pickupMarker.current = null;
    }
    if (dropoffMarker.current) {
      mapInstance.current.removeLayer(dropoffMarker.current);
      dropoffMarker.current = null;
    }
    if (routeLayer.current) {
      mapInstance.current.removeLayer(routeLayer.current);
      routeLayer.current = null;
    }
    setPickupAddr('');
    setDropoffAddr('');
    onSelectPickup('');
    if (onSelectDropoff) onSelectDropoff('');
    setActivePin('pickup');
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className="flex flex-col gap-3 w-full my-2 bg-neutral-900/40 p-4 rounded-2xl border border-neutral-800/80 backdrop-blur-md relative shadow-lg">
      
      {/* Premium Header */}
      <div className="flex items-center justify-between border-b border-neutral-800/60 pb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">Map Routing Picker</span>
        </div>
        <button
          type="button"
          onClick={clearPins}
          className="text-[10px] text-red-400 font-semibold hover:text-red-300 transition duration-150 flex items-center gap-1"
        >
          <span>✕</span> Reset Map
        </button>
      </div>

      {/* Modern Search Bar */}
      <div className="relative z-20">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500 text-xs">
              🔍
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search address or area in Cambodia..."
              className="input text-xs w-full pl-8 pr-3 py-2 rounded-xl bg-neutral-950/80 border border-neutral-800 text-white placeholder-neutral-500 focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/40 transition duration-200"
            />
          </div>
          <button
            type="submit"
            disabled={searching}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-neutral-950 text-xs font-bold shadow-md shadow-amber-950/30 hover:brightness-110 active:scale-[0.97] transition disabled:opacity-50"
          >
            {searching ? '...' : 'Search'}
          </button>
        </form>

        {/* Floating search results list */}
        {searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-neutral-950/95 border border-neutral-800 rounded-xl max-h-48 overflow-y-auto flex flex-col z-50 shadow-2xl backdrop-blur-md text-left divide-y divide-neutral-900 scrollbar-thin">
            {searchResults.map((r, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => selectSearchResult(r)}
                className="text-left text-[11px] p-2.5 hover:bg-neutral-900 text-neutral-300 hover:text-white transition duration-150 flex items-center gap-1.5 w-full truncate"
              >
                <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
                <span className="truncate">{r.display_name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map Container Frame */}
      <div className="relative rounded-2xl overflow-hidden border border-neutral-800/80 shadow-2xl" style={{ transform: 'translate3d(0, 0, 0)', zIndex: 1 }}>
        <div ref={mapRef} className="h-52 w-full z-0" />
        
        {/* Resolving geocoding overlay */}
        {resolving && (
          <div className="absolute inset-0 bg-neutral-950/50 backdrop-blur-[1px] flex items-center justify-center z-10 animate-fade-in">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 shadow-md">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
              <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-widest">Pinning Location...</span>
            </div>
          </div>
        )}
      </div>

      {/* Segmented Mode Selector Control */}
      {!onlyPickup && (
        <div className="flex p-1 rounded-xl bg-neutral-950/80 border border-neutral-800/60 mt-1">
          <button
            type="button"
            onClick={() => setActivePin('pickup')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-250 flex items-center justify-center gap-1.5 ${
              activePin === 'pickup'
                ? 'bg-green-600/20 border border-green-500/30 text-green-400 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${activePin === 'pickup' ? 'bg-green-400 animate-pulse' : 'bg-neutral-600'}`} />
            1. Pickup {pickupAddr ? '✓' : ''}
          </button>
          <button
            type="button"
            onClick={() => setActivePin('dropoff')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-250 flex items-center justify-center gap-1.5 ${
              activePin === 'dropoff'
                ? 'bg-red-600/20 border border-red-500/30 text-red-400 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${activePin === 'dropoff' ? 'bg-red-400 animate-pulse' : 'bg-neutral-600'}`} />
            2. Dropoff {dropoffAddr ? '✓' : ''}
          </button>
        </div>
      )}

    </div>
  );
}
