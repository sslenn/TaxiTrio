import { useState, useEffect } from 'react';
import { getRoutes, createRoute } from '../../service/routeService';
import PageHeader from '../../components/PageHeader';
import GoldButton from '../../components/GoldButton';

const empty = { origin: '', destination: '', distance_km: '', base_price: '', duration_hrs: '' };

export default function ManageRoutes() {
  const [routes, setRoutes] = useState([]);
  const [form, setForm] = useState(empty);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');

  const load = () => getRoutes().then((r) => setRoutes(r.data.data));
  useEffect(() => { load(); }, []);

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

  const filteredRoutes = routes.filter((r) => 
    r.origin?.toLowerCase().includes(search.toLowerCase()) || 
    r.destination?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Manage Routes" 
        subtitle="Configure inter-provincial routes, pricing rules, and distance details"
      >
        <div className="flex items-center gap-3">
          <div className="relative w-48 shrink-0">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neutral-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-gold/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              className="w-full bg-[#121212] border border-gold/15 text-white placeholder-neutral-500 rounded-full py-2 pl-9 pr-3 text-[11px] focus:outline-none focus:border-gold/50 transition duration-300"
              placeholder="Search routes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <GoldButton onClick={() => setShowForm(!showForm)} variant={showForm ? "outline" : "filled"} className="py-2 px-4">
            {showForm ? 'Cancel' : '+ Add Route'}
          </GoldButton>
        </div>
      </PageHeader>

      {showForm && (
        <form onSubmit={handleCreate} className="card border border-gold/15 bg-[#121212] p-6 flex flex-col gap-4 rounded-2xl shadow-xl max-w-lg animate-in slide-in-from-top-4 duration-300">
          <h3 className="text-[#D4AF37] font-bold font-serif text-lg border-b border-neutral-900 pb-3 uppercase tracking-wider">Configure New Transit Route</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Origin City</label>
              <input 
                className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/60 transition duration-300" 
                placeholder="e.g. Phnom Penh" 
                required
                value={form.origin} 
                onChange={(e) => setForm({ ...form, origin: e.target.value })} 
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Destination City</label>
              <input 
                className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/60 transition duration-300" 
                placeholder="e.g. Siem Reap" 
                required
                value={form.destination} 
                onChange={(e) => setForm({ ...form, destination: e.target.value })} 
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Distance (km)</label>
            <input 
              className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none" 
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
                className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none" 
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
                className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none" 
                type="number"
                placeholder="e.g. 5.5" 
                value={form.duration_hrs} 
                onChange={(e) => setForm({ ...form, duration_hrs: e.target.value })} 
              />
            </div>
          </div>

          <GoldButton type="submit" className="w-full py-3">Save Route</GoldButton>
        </form>
      )}

      {filteredRoutes.length === 0 ? (
        <div className="card border border-gold/15 bg-[#121212] p-12 text-center rounded-2xl">
          <p className="text-[#A3A3A3] text-sm">No transit routes found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoutes.map((r) => (
            <div 
              key={r.id} 
              className="card border border-gold/15 bg-[#121212] p-6 rounded-2xl flex justify-between items-center hover:border-gold/45 transition duration-300 relative overflow-hidden group"
            >
              <div className="absolute -right-16 -top-16 w-32 h-32 rounded-full bg-gold/5 blur-2xl"></div>
              <div className="z-10">
                <p className="font-bold text-white font-serif text-lg">{r.origin} <span className="text-gold/60 mx-1">→</span> {r.destination}</p>
                <p className="text-[#A3A3A3] text-xs font-light mt-1.5">{r.distance_km} km · {r.duration_hrs} hours duration</p>
              </div>
              <p className="text-xl font-black text-gold z-10 shrink-0">${r.base_price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
