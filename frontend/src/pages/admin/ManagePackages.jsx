import { useState, useEffect } from 'react';
import { getPackages, createPackage } from '../../service/packageService';
import PageHeader from '../../components/PageHeader';
import GoldButton from '../../components/GoldButton';

const empty = { name: '', description: '', price: '', duration_days: 1, max_persons: 4 };

export default function ManagePackages() {
  const [packages, setPackages] = useState([]);
  const [form, setForm] = useState(empty);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');

  const load = () => getPackages().then((r) => setPackages(r.data.data));
  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try { 
      await createPackage(form); 
      setForm(empty); 
      setShowForm(false); 
      load(); 
    } catch (err) { 
      alert(err.response?.data?.message || 'Error'); 
    }
  };

  const filteredPackages = packages.filter((p) => 
    p.name?.toLowerCase().includes(search.toLowerCase()) || 
    p.description?.toLowerCase().includes(search.toLowerCase())
  );

  const getPackageImage = (name = '') => {
    const key = name.toLowerCase();
    if (key.includes('angkor')) return '/images/tour_package.jpg';
    if (key.includes('kampot')) return '/images/intercity_transfer.jpg';
    if (key.includes('kep')) return '/images/city_ride.jpg';
    if (key.includes('phnom penh') || key.includes('heritage')) return '/images/custom_trip.jpg';
    return '/images/tour_package.jpg';
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Manage Packages" 
        subtitle="Manage tourist packages, set durations, passenger capacities, and pricing models"
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
              placeholder="Search packages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <GoldButton onClick={() => setShowForm(!showForm)} variant={showForm ? "outline" : "filled"} className="py-2 px-4">
            {showForm ? 'Cancel' : '+ Add Package'}
          </GoldButton>
        </div>
      </PageHeader>

      {showForm && (
        <form onSubmit={handleCreate} className="card border border-gold/15 bg-[#121212] p-6 flex flex-col gap-4 rounded-2xl shadow-xl max-w-lg animate-in slide-in-from-top-4 duration-300">
          <h3 className="text-[#D4AF37] font-bold font-serif text-lg border-b border-neutral-900 pb-3 uppercase tracking-wider">Configure New Tour Package</h3>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Package Name</label>
            <input 
              className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none" 
              placeholder="e.g. Angkor Wat Explorer" 
              required
              value={form.name} 
              onChange={(e) => setForm({ ...form, name: e.target.value })} 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Description Details</label>
            <textarea 
              className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none" 
              placeholder="Provide a detailed itinerary summary..." 
              rows={2}
              value={form.description} 
              onChange={(e) => setForm({ ...form, description: e.target.value })} 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Price ($)</label>
            <input 
              className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none" 
              type="number"
              placeholder="e.g. 150" 
              required
              value={form.price} 
              onChange={(e) => setForm({ ...form, price: e.target.value })} 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Duration (days)</label>
              <input 
                className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none" 
                type="number"
                min="1"
                placeholder="Duration" 
                required
                value={form.duration_days} 
                onChange={(e) => setForm({ ...form, duration_days: +e.target.value })} 
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Max Passengers</label>
              <input 
                className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none" 
                type="number"
                min="1"
                placeholder="Max persons" 
                required
                value={form.max_persons} 
                onChange={(e) => setForm({ ...form, max_persons: +e.target.value })} 
              />
            </div>
          </div>

          <GoldButton type="submit" className="w-full py-3">Save Package</GoldButton>
        </form>
      )}

      {filteredPackages.length === 0 ? (
        <div className="card border border-gold/15 bg-[#121212] p-12 text-center rounded-2xl">
          <p className="text-[#A3A3A3] text-sm">No packages found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {filteredPackages.map((p) => (
            <div 
              key={p.id} 
              className="card border border-gold/15 bg-[#121212] rounded-2xl flex flex-col justify-between hover:border-gold/45 transition duration-300 relative overflow-hidden group gap-0 shadow-lg"
            >
              {/* Cover Image Section */}
              <div className="h-48 w-full overflow-hidden relative">
                <img 
                  src={getPackageImage(p.name)} 
                  alt={p.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent"></div>
              </div>

              {/* Card Details Body */}
              <div className="p-6 flex flex-col gap-5 flex-1 justify-between relative z-10">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-lg font-bold text-gold font-serif">{p.name}</h3>
                    <span className="text-white font-bold font-serif shrink-0">${p.price}</span>
                  </div>
                  <p className="text-[#A3A3A3] text-xs leading-relaxed font-light line-clamp-3">
                    {p.description}
                  </p>
                </div>

                <div className="border-t border-neutral-900/60 pt-3 flex justify-between items-center text-[10px] text-neutral-400 uppercase tracking-widest font-semibold">
                  <span>⏱ {p.duration_days} day(s)</span>
                  <span>👥 up to {p.max_persons} persons</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
