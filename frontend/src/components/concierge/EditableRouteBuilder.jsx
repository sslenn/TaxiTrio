import { useState } from 'react';
import { MapPin, Flag, Trash2, ArrowUp, ArrowDown, Plus, Search } from 'lucide-react';

export default function EditableRouteBuilder({
  origin,
  setOrigin,
  destination,
  setDestination,
  stops,
  setStops,
  onReset
}) {
  const [newStopText, setNewStopText] = useState('');

  const handleStopChange = (index, val) => {
    const nextStops = [...stops];
    nextStops[index] = val;
    setStops(nextStops);
  };

  const handleRemoveStop = (index) => {
    const nextStops = stops.filter((_, i) => i !== index);
    setStops(nextStops);
  };

  const handleMoveStop = (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === stops.length - 1) return;

    const nextStops = [...stops];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const temp = nextStops[index];
    nextStops[index] = nextStops[targetIdx];
    nextStops[targetIdx] = temp;
    setStops(nextStops);
  };

  const handleAddStop = (e) => {
    e.preventDefault();
    if (!newStopText.trim()) return;
    setStops([...stops, newStopText.trim()]);
    setNewStopText('');
  };

  return (
    <div className="bg-[#121212] border border-gold/15 rounded-3xl p-6 shadow-xl text-left w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-900 pb-4 mb-5">
        <div>
          <span className="text-[9px] font-bold text-[#D4AF37] uppercase tracking-widest block">Interactive Planner</span>
          <h3 className="font-serif text-xl font-bold text-white mt-0.5">🛠 Edit Your Route</h3>
        </div>
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="text-[9px] uppercase tracking-wider font-bold text-neutral-400 hover:text-gold bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-lg transition duration-200 cursor-pointer"
          >
            Reset to AI Recommendation
          </button>
        )}
      </div>

      <div className="flex flex-col gap-5">
        {/* Origin Location */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Origin (Pickup Location)</label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-3.5 text-gold w-4 h-4" />
            <input
              type="text"
              className="w-full bg-[#0b0b0b] border border-gold/15 text-white rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-gold/60 transition duration-300"
              placeholder="Origin (e.g. Hotel, Phnom Penh)"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              required
            />
          </div>
        </div>

        {/* List of Stops */}
        <div className="flex flex-col gap-3 pl-3.5 border-l border-dashed border-gold/25 my-1">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider">Itinerary Stopovers</span>
            <span className="text-[9px] text-neutral-500 font-light italic">({stops.length} stopovers added)</span>
          </div>

          {stops.map((stop, index) => (
            <div key={index} className="flex items-center gap-3">
              {/* Index Indicator */}
              <span className="w-5 h-5 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-[10px] font-black text-gold shrink-0">
                {index + 1}
              </span>

              {/* Stop input */}
              <input
                type="text"
                className="flex-1 bg-[#0b0b0b] border border-gold/15 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-gold/60 transition duration-300"
                value={stop}
                onChange={(e) => handleStopChange(index, e.target.value)}
                placeholder={`Stop #${index + 1}`}
                required
              />

              {/* Controls */}
              <div className="flex items-center gap-1.5 shrink-0">
                {/* Move Up */}
                <button
                  type="button"
                  onClick={() => handleMoveStop(index, 'up')}
                  disabled={index === 0}
                  className="p-2 bg-neutral-900 border border-white/5 hover:border-gold/20 rounded-lg text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition duration-200 cursor-pointer"
                  title="Move Up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>

                {/* Move Down */}
                <button
                  type="button"
                  onClick={() => handleMoveStop(index, 'down')}
                  disabled={index === stops.length - 1}
                  className="p-2 bg-neutral-900 border border-white/5 hover:border-gold/20 rounded-lg text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition duration-200 cursor-pointer"
                  title="Move Down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => handleRemoveStop(index)}
                  className="p-2 bg-rose-950/20 border border-rose-900/30 hover:border-rose-900/50 rounded-lg text-rose-400 hover:text-rose-300 transition duration-200 cursor-pointer"
                  title="Remove Stop"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {/* Add Stop Input Row */}
          <form onSubmit={handleAddStop} className="flex gap-2 mt-1">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 text-neutral-500 w-3.5 h-3.5" />
              <input
                type="text"
                className="w-full bg-[#0b0b0b] border border-white/10 text-white rounded-xl pl-9 pr-4 py-3 text-xs focus:outline-none focus:border-gold/40 transition duration-300 font-light"
                placeholder="Search attraction or enter custom place name..."
                value={newStopText}
                onChange={(e) => setNewStopText(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="px-4 bg-[#D4AF37] hover:bg-[#BFA76A] text-black font-bold uppercase tracking-wider text-[10px] rounded-xl flex items-center gap-1 cursor-pointer shrink-0 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Stop</span>
            </button>
          </form>
        </div>

        {/* Final Destination */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Final Destination (Drop-off Location)</label>
          <div className="relative">
            <Flag className="absolute left-3.5 top-3.5 text-gold w-4 h-4" />
            <input
              type="text"
              className="w-full bg-[#0b0b0b] border border-gold/15 text-white rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-gold/60 transition duration-300"
              placeholder="Final Destination (e.g. Phnom Penh Airport)"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
}
