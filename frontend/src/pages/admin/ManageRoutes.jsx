import { useState, useEffect } from 'react';
import { getRoutes, createRoute } from '../../service/routeService';
import PageHeader from '../../components/PageHeader';
import GoldButton from '../../components/GoldButton';
import { 
  Search, 
  Plus, 
  Filter, 
  RotateCw, 
  Compass, 
  Clock, 
  DollarSign, 
  MapPin, 
  ArrowRight, 
  Activity 
} from 'lucide-react';

const empty = { origin: '', destination: '', distance_km: '', base_price: '', duration_hrs: '' };

export default function ManageRoutes() {
  const [routes, setRoutes] = useState([]);
  const [form, setForm] = useState(empty);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [distanceFilter, setDistanceFilter] = useState('All');
  const [sortBy, setSortBy] = useState('price-asc');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getRoutes()
      .then((r) => setRoutes(r.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { 
    load(); 
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try { 
      await createRoute(form); 
      setForm(empty); 
      setShowForm(false); 
      load(); 
    } catch (err) { 
      alert(err.response?.data?.message || 'Error'); 
    }
  };

  // Stats computation
  const totalRoutes = routes.length;
  const avgPrice = routes.length ? (routes.reduce((sum, r) => sum + Number(r.base_price || 0), 0) / routes.length) : 0;
  const totalDistance = routes.reduce((sum, r) => sum + Number(r.distance_km || 0), 0);
  const avgDuration = routes.length ? (routes.reduce((sum, r) => sum + Number(r.duration_hrs || 0), 0) / routes.length) : 0;

  const filteredRoutes = routes.filter((r) => {
    const matchesSearch = 
      r.origin?.toLowerCase().includes(search.toLowerCase()) || 
      r.destination?.toLowerCase().includes(search.toLowerCase());

    let matchesDistance = true;
    if (distanceFilter !== 'All') {
      const dist = Number(r.distance_km || 0);
      if (distanceFilter === 'Short') matchesDistance = dist < 100;
      else if (distanceFilter === 'Medium') matchesDistance = dist >= 100 && dist <= 300;
      else if (distanceFilter === 'Long') matchesDistance = dist > 300;
    }

    return matchesSearch && matchesDistance;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.base_price - b.base_price;
    if (sortBy === 'price-desc') return b.base_price - a.base_price;
    if (sortBy === 'distance') return b.distance_km - a.distance_km;
    return 0;
  });

  return (
    <div className="flex flex-col gap-8 relative pb-10">
      
      {/* Page Header */}
      <PageHeader 
        title="Manage Routes" 
        subtitle="Configure inter-provincial routes, pricing rules, and distance details"
      >
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative w-64 shrink-0">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-neutral-500">
              <Search className="w-4 h-4 text-gold/60" />
            </span>
            <input
              type="text"
              className="w-full bg-[#121212] border border-gold/15 text-white placeholder-neutral-500 rounded-full py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-gold/50 transition duration-300 shadow-inner"
              placeholder="Search transit routes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <GoldButton onClick={() => setShowForm(!showForm)} variant={showForm ? "outline" : "filled"} className="py-2.5 px-5">
            {showForm ? 'Cancel' : '+ Add Route'}
          </GoldButton>
        </div>
      </PageHeader>

      {/* Analytics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Routes */}
        <div className="bg-[#121212]/50 border border-gold/10 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden group hover:border-gold/30 transition duration-300 flex flex-col gap-2 shadow-md">
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
          <div className="flex justify-between items-center">
            <span className="p-2 rounded-xl bg-gold/5 border border-gold/15 text-gold shrink-0">
              <Activity className="w-4 h-4" />
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_8px_#D4AF37]"></span>
          </div>
          <div className="mt-1">
            <p className="text-3xl font-bold text-white tracking-tight">{totalRoutes}</p>
            <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mt-0.5">Active Routes</p>
          </div>
        </div>

        {/* Avg Price */}
        <div className="bg-[#121212]/50 border border-gold/10 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden group hover:border-gold/30 transition duration-300 flex flex-col gap-2 shadow-md">
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
          <div className="flex justify-between items-center">
            <span className="p-2 rounded-xl bg-emerald-500/5 border border-emerald-500/15 text-emerald-400 shrink-0">
              <DollarSign className="w-4 h-4" />
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
          </div>
          <div className="mt-1">
            <p className="text-3xl font-bold text-white tracking-tight">${avgPrice.toFixed(2)}</p>
            <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mt-0.5">Avg Base Fare</p>
          </div>
        </div>

        {/* Total Distance */}
        <div className="bg-[#121212]/50 border border-gold/10 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden group hover:border-gold/30 transition duration-300 flex flex-col gap-2 shadow-md">
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
          <div className="flex justify-between items-center">
            <span className="p-2 rounded-xl bg-blue-500/5 border border-blue-500/15 text-blue-400 shrink-0">
              <Compass className="w-4 h-4" />
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa]"></span>
          </div>
          <div className="mt-1">
            <p className="text-3xl font-bold text-white tracking-tight">{totalDistance} km</p>
            <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mt-0.5">Route Coverage</p>
          </div>
        </div>

        {/* Avg Duration */}
        <div className="bg-[#121212]/50 border border-gold/10 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden group hover:border-gold/30 transition duration-300 flex flex-col gap-2 shadow-md">
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
          <div className="flex justify-between items-center">
            <span className="p-2 rounded-xl bg-purple-500/5 border border-purple-500/15 text-purple-400 shrink-0">
              <Clock className="w-4 h-4" />
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_#c084fc]"></span>
          </div>
          <div className="mt-1">
            <p className="text-3xl font-bold text-white tracking-tight">{avgDuration.toFixed(1)} hrs</p>
            <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mt-0.5">Avg Transit Time</p>
          </div>
        </div>
      </div>

      {/* Form (redesigned) */}
      {showForm && (
        <form onSubmit={handleCreate} className="card border border-gold/15 bg-[#121212] p-6 flex flex-col gap-6 rounded-2xl shadow-xl max-w-3xl w-full mx-auto animate-in slide-in-from-top-4 duration-300 text-left">
          <h3 className="text-[#D4AF37] font-bold font-serif text-lg border-b border-neutral-900 pb-3 uppercase tracking-wider">Configure New Transit Route</h3>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Origin City</label>
                <input 
                  className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/50 transition duration-300" 
                  placeholder="e.g. Phnom Penh" 
                  required
                  value={form.origin} 
                  onChange={(e) => setForm({ ...form, origin: e.target.value })} 
                />
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Destination City</label>
                <input 
                  className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/50 transition duration-300" 
                  placeholder="e.g. Siem Reap" 
                  required
                  value={form.destination} 
                  onChange={(e) => setForm({ ...form, destination: e.target.value })} 
                />
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Distance (km)</label>
                <input 
                  className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/50" 
                  type="number"
                  placeholder="e.g. 315" 
                  required
                  value={form.distance_km} 
                  onChange={(e) => setForm({ ...form, distance_km: e.target.value })} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Base Price ($)</label>
                  <input 
                    className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/50" 
                    type="number"
                    placeholder="e.g. 75" 
                    required
                    value={form.base_price} 
                    onChange={(e) => setForm({ ...form, base_price: e.target.value })} 
                  />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Est. Duration (hrs)</label>
                  <input 
                    className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/50" 
                    type="number"
                    placeholder="e.g. 5.5" 
                    value={form.duration_hrs} 
                    onChange={(e) => setForm({ ...form, duration_hrs: e.target.value })} 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-neutral-900 pt-4">
            <GoldButton type="button" variant="outline" onClick={() => setShowForm(false)} className="px-6 py-2">Cancel</GoldButton>
            <GoldButton type="submit" className="px-8 py-2">Save Route</GoldButton>
          </div>
        </form>
      )}

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121212]/30 border border-gold/10 rounded-2xl p-4 backdrop-blur-md shadow-md">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-[#0B0B0B] border border-gold/10 px-3 py-1.5 rounded-xl">
            <Filter className="w-3.5 h-3.5 text-gold" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Filters:</span>
          </div>
          
          <select 
            value={distanceFilter}
            onChange={(e) => setDistanceFilter(e.target.value)}
            className="bg-[#0B0B0B] border border-gold/10 text-white text-xs px-3 py-1.5 rounded-xl focus:outline-none focus:border-gold/50 cursor-pointer transition"
          >
            <option value="All">All Distances</option>
            <option value="Short">Short (&lt; 100km)</option>
            <option value="Medium">Medium (100km - 300km)</option>
            <option value="Long">Long (&gt; 300km)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#0B0B0B] border border-gold/10 text-white text-xs px-3 py-1.5 rounded-xl focus:outline-none focus:border-gold/50 cursor-pointer transition"
          >
            <option value="price-asc">Sort by Lowest Price</option>
            <option value="price-desc">Sort by Highest Price</option>
            <option value="distance">Sort by Distance</option>
          </select>

          <button 
            onClick={load}
            className="p-2 bg-[#0B0B0B] border border-gold/10 hover:border-gold/30 hover:text-gold text-neutral-400 rounded-xl transition duration-200 cursor-pointer"
            title="Refresh list"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="flex flex-col items-center gap-3 py-20 justify-center">
          <span className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin"></span>
          <p className="text-[#A3A3A3] text-xs uppercase tracking-widest font-semibold">Loading Transit Roster...</p>
        </div>
      ) : filteredRoutes.length === 0 ? (
        <div className="card border border-gold/10 bg-[#121212]/30 backdrop-blur-md p-16 text-center rounded-[24px]">
          <p className="text-[#A3A3A3] text-sm">No routes match your current filter settings.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoutes.map((r, index) => (
            <div 
              key={r.id} 
              className="card border border-gold/10 bg-[#121212]/30 backdrop-blur-md p-6 rounded-[24px] flex flex-col justify-between hover:border-gold/30 transition duration-300 relative overflow-hidden group shadow-md hover:scale-[1.01] animate-in fade-in duration-300"
              style={{ animationDelay: `${index * 20}ms` }}
            >
              <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
              <div className="absolute -right-16 -top-16 w-32 h-32 rounded-full bg-gold/5 blur-2xl pointer-events-none"></div>
              
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-1">
                  <span className="p-1.5 rounded-lg bg-gold/5 border border-gold/15 text-gold shrink-0">
                    <MapPin className="w-4 h-4" />
                  </span>
                  <div className="w-full flex items-center justify-between pl-1">
                    <span className="text-white font-bold text-sm tracking-wide">{r.origin}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gold/60 mx-2 shrink-0" />
                    <span className="text-white font-bold text-sm tracking-wide text-right">{r.destination}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-t border-neutral-900/60 pt-3 text-[11px] text-neutral-400 font-light">
                  <span className="flex items-center gap-1"><Compass className="w-3.5 h-3.5 text-gold/60" /> {r.distance_km} km</span>
                  <span className="w-1 h-1 rounded-full bg-neutral-800"></span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-gold/60" /> {r.duration_hrs} hours</span>
                </div>
              </div>

              <div className="flex justify-between items-center mt-5 pt-3 border-t border-neutral-900/60">
                <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Base Rate</span>
                <span className="text-lg font-black text-gold">${Number(r.base_price).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
