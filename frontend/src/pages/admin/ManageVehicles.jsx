import { useState, useEffect } from 'react';
import { getVehicles, createVehicle, deleteVehicle } from '../../service/vehicleService';
import { getDrivers } from '../../service/adminService';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import GoldButton from '../../components/GoldButton';

const TYPES = ['sedan', 'suv', 'van', 'minibus', 'bus'];
const empty = { driver_id: '', plate_number: '', type: 'sedan', brand: '', model: '', capacity: 4 };

export default function ManageVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [form, setForm] = useState(empty);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = () => {
    Promise.all([getVehicles(), getDrivers()])
      .then(([v, d]) => { setVehicles(v.data.data); setDrivers(d.data.data); })
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try { 
      await createVehicle(form); 
      setForm(empty); 
      setShowForm(false); 
      load(); 
    } catch (err) { 
      alert(err.response?.data?.message || 'Error'); 
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this vehicle?')) return;
    try { 
      await deleteVehicle(id); 
      load(); 
    } catch (err) { 
      alert(err.response?.data?.message || 'Error'); 
    }
  };

  const filteredVehicles = vehicles.filter((v) => 
    v.plate_number?.toLowerCase().includes(search.toLowerCase()) || 
    v.type?.toLowerCase().includes(search.toLowerCase()) ||
    v.brand?.toLowerCase().includes(search.toLowerCase()) ||
    v.model?.toLowerCase().includes(search.toLowerCase()) ||
    (v.driver_name && v.driver_name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Manage Vehicles" 
        subtitle="Manage plate registrations, types, capacities, and active driver assignments"
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
              placeholder="Search vehicles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <GoldButton onClick={() => setShowForm(!showForm)} variant={showForm ? "outline" : "filled"} className="py-2 px-4">
            {showForm ? 'Cancel' : '+ Add Vehicle'}
          </GoldButton>
        </div>
      </PageHeader>

      {showForm && (
        <form onSubmit={handleCreate} className="card border border-gold/15 bg-[#121212] p-6 flex flex-col gap-4 rounded-2xl shadow-xl max-w-lg animate-in slide-in-from-top-4 duration-300">
          <h3 className="text-[#D4AF37] font-bold font-serif text-lg border-b border-neutral-900 pb-3 uppercase tracking-wider">Register New Fleet Vehicle</h3>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Assign Driver (Optional)</label>
            <select 
              className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/60 transition duration-300"
              value={form.driver_id} 
              onChange={(e) => setForm({ ...form, driver_id: e.target.value })}
            >
              <option value="" className="bg-[#121212]">No Driver Assigned</option>
              {drivers.map((d) => <option key={d.id} value={d.id} className="bg-[#121212]">{d.full_name}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Plate Number</label>
            <input 
              className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/60 transition duration-300" 
              placeholder="e.g. PP-1A-1234" 
              required
              value={form.plate_number} 
              onChange={(e) => setForm({ ...form, plate_number: e.target.value })} 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Vehicle Type</label>
            <select 
              className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none"
              value={form.type} 
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              {TYPES.map((t) => <option key={t} value={t} className="bg-[#121212]">{t.toUpperCase()}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Brand</label>
              <input 
                className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none" 
                placeholder="e.g. Lexus" 
                value={form.brand} 
                onChange={(e) => setForm({ ...form, brand: e.target.value })} 
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Model</label>
              <input 
                className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none" 
                placeholder="e.g. RX450h" 
                value={form.model} 
                onChange={(e) => setForm({ ...form, model: e.target.value })} 
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Passenger Capacity</label>
            <input 
              className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none" 
              type="number" 
              min="1" 
              placeholder="Capacity"
              value={form.capacity} 
              onChange={(e) => setForm({ ...form, capacity: +e.target.value })} 
            />
          </div>

          <GoldButton type="submit" className="w-full py-3">Save Vehicle</GoldButton>
        </form>
      )}

      {loading ? (
        <div className="flex items-center gap-2 py-12 justify-center">
          <span className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin"></span>
          <p className="text-[#A3A3A3] text-sm uppercase tracking-wider">Loading fleet vehicles...</p>
        </div>
      ) : filteredVehicles.length === 0 ? (
        <div className="card border border-gold/15 bg-[#121212] p-12 text-center rounded-2xl">
          <p className="text-[#A3A3A3] text-sm">No vehicles match your search query.</p>
        </div>
      ) : (
        <DataTable headers={['Plate No', 'Type', 'Brand / Model', 'Assigned Driver', 'Capacity', 'Actions']}>
          {filteredVehicles.map((v) => (
            <tr key={v.id} className="border-b border-[#1a1a1a] hover:bg-neutral-900/20 transition duration-150">
              <td className="px-6 py-4 text-white font-mono font-bold">{v.plate_number}</td>
              <td className="px-6 py-4 capitalize text-white">{v.type}</td>
              <td className="px-6 py-4 text-white font-serif">{v.brand} {v.model}</td>
              <td className="px-6 py-4 text-[#A3A3A3]">{v.driver_name || '—'}</td>
              <td className="px-6 py-4 text-white">{v.capacity} Pax</td>
              <td className="px-6 py-4">
                <button 
                  onClick={() => handleDelete(v.id)} 
                  className="text-xs font-bold uppercase tracking-wider text-rose-500 hover:text-rose-400 transition"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </DataTable>
      )}
    </div>
  );
}
