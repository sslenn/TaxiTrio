import { useState, useEffect } from 'react';
import { getVehicles, createVehicle, deleteVehicle } from '../../service/vehicleService';
import { getDrivers } from '../../service/adminService';
import PageHeader from '../../components/PageHeader';
import GoldButton from '../../components/GoldButton';
import { 
  Car, 
  Users, 
  Search, 
  Plus, 
  Filter, 
  RotateCw, 
  MoreVertical, 
  Trash2, 
  ShieldCheck, 
  UserCheck 
} from 'lucide-react';

const TYPES = ['sedan', 'suv', 'van', 'minibus', 'bus'];
const empty = { driver_id: '', plate_number: '', type: 'sedan', brand: '', model: '', capacity: 4 };

export default function ManageVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [form, setForm] = useState(empty);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [driverFilter, setDriverFilter] = useState('All');
  const [sortBy, setSortBy] = useState('brand');
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [limit, setLimit] = useState(5);

  const load = () => {
    setLoading(true);
    Promise.all([getVehicles(), getDrivers()])
      .then(([v, d]) => { 
        setVehicles(v.data.data); 
        setDrivers(d.data.data); 
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { 
    load(); 
  }, []);

  useEffect(() => {
    const handleOutsideClick = () => {
      setOpenDropdownId(null);
    };
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

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
    if (!confirm('Are you sure you want to retire this vehicle from active fleet dispatch?')) return;
    try { 
      await deleteVehicle(id); 
      load(); 
    } catch (err) { 
      alert(err.response?.data?.message || 'Error'); 
    }
  };

  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  // Stats computation
  const totalFleet = vehicles.length;
  const assignedFleet = vehicles.filter((v) => v.driver_id).length;
  const unassignedFleet = vehicles.filter((v) => !v.driver_id).length;
  const totalCapacity = vehicles.reduce((sum, v) => sum + Number(v.capacity || 0), 0);

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch = 
      v.plate_number?.toLowerCase().includes(search.toLowerCase()) || 
      v.type?.toLowerCase().includes(search.toLowerCase()) ||
      v.brand?.toLowerCase().includes(search.toLowerCase()) ||
      v.model?.toLowerCase().includes(search.toLowerCase()) ||
      (v.driver_name && v.driver_name.toLowerCase().includes(search.toLowerCase()));

    let matchesType = true;
    if (typeFilter !== 'All') {
      matchesType = v.type?.toLowerCase() === typeFilter.toLowerCase();
    }

    let matchesDriver = true;
    if (driverFilter !== 'All') {
      matchesDriver = driverFilter === 'Assigned' ? !!v.driver_id : !v.driver_id;
    }

    return matchesSearch && matchesType && matchesDriver;
  }).sort((a, b) => {
    if (sortBy === 'brand') {
      return (a.brand || '').localeCompare(b.brand || '');
    } else if (sortBy === 'capacity') {
      return b.capacity - a.capacity;
    }
    return 0;
  });

  return (
    <div className="flex flex-col gap-8 relative pb-10">
      
      {/* Premium Header */}
      <PageHeader 
        title="Manage Vehicles" 
        subtitle="Manage plate registrations, types, capacities, and active driver assignments"
      >
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative w-64 shrink-0">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-neutral-500">
              <Search className="w-4 h-4 text-gold/60" />
            </span>
            <input
              type="text"
              className="w-full bg-[#121212] border border-gold/15 text-white placeholder-neutral-500 rounded-full py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-gold/50 transition duration-300 shadow-inner"
              placeholder="Search fleet..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <GoldButton onClick={() => setShowForm(!showForm)} variant={showForm ? "outline" : "filled"} className="py-2.5 px-5">
            {showForm ? 'Cancel' : '+ Add Vehicle'}
          </GoldButton>
        </div>
      </PageHeader>

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Fleet Size */}
        <div className="bg-[#121212]/50 border border-gold/10 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden group hover:border-gold/30 transition duration-300 flex flex-col gap-2 shadow-md">
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
          <div className="flex justify-between items-center">
            <span className="p-2 rounded-xl bg-gold/5 border border-gold/15 text-gold shrink-0">
              <Car className="w-4 h-4" />
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_8px_#D4AF37]"></span>
          </div>
          <div className="mt-1">
            <p className="text-3xl font-bold text-white tracking-tight">{totalFleet}</p>
            <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mt-0.5">Fleet Size</p>
          </div>
        </div>

        {/* Assigned */}
        <div className="bg-[#121212]/50 border border-gold/10 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden group hover:border-gold/30 transition duration-300 flex flex-col gap-2 shadow-md">
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
          <div className="flex justify-between items-center">
            <span className="p-2 rounded-xl bg-emerald-500/5 border border-emerald-500/15 text-emerald-400 shrink-0">
              <UserCheck className="w-4 h-4" />
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
          </div>
          <div className="mt-1">
            <p className="text-3xl font-bold text-white tracking-tight">{assignedFleet}</p>
            <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mt-0.5">Active Dispatch</p>
          </div>
        </div>

        {/* Unassigned */}
        <div className="bg-[#121212]/50 border border-gold/10 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden group hover:border-gold/30 transition duration-300 flex flex-col gap-2 shadow-md">
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
          <div className="flex justify-between items-center">
            <span className="p-2 rounded-xl bg-rose-500/5 border border-rose-500/15 text-rose-400 shrink-0">
              <Car className="w-4 h-4 text-rose-400" />
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shadow-[0_0_8px_#f43f5e]"></span>
          </div>
          <div className="mt-1">
            <p className="text-3xl font-bold text-white tracking-tight">{unassignedFleet}</p>
            <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mt-0.5">Idle Fleet</p>
          </div>
        </div>

        {/* Total Pax Capacity */}
        <div className="bg-[#121212]/50 border border-gold/10 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden group hover:border-gold/30 transition duration-300 flex flex-col gap-2 shadow-md">
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
          <div className="flex justify-between items-center">
            <span className="p-2 rounded-xl bg-blue-500/5 border border-blue-500/15 text-blue-400 shrink-0">
              <Users className="w-4 h-4" />
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa]"></span>
          </div>
          <div className="mt-1">
            <p className="text-3xl font-bold text-white tracking-tight">{totalCapacity} Pax</p>
            <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mt-0.5">Total Capacity</p>
          </div>
        </div>
      </div>

      {/* Form (redesigned) */}
      {showForm && (
        <form onSubmit={handleCreate} className="card border border-gold/15 bg-[#121212] p-6 flex flex-col gap-6 rounded-2xl shadow-xl max-w-3xl w-full mx-auto animate-in slide-in-from-top-4 duration-300 text-left">
          <h3 className="text-[#D4AF37] font-bold font-serif text-lg border-b border-neutral-900 pb-3 uppercase tracking-wider">Register New Fleet Vehicle</h3>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Assign Driver (Optional)</label>
                <select 
                  className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/50 transition duration-300"
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
                  className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/50 transition duration-300" 
                  placeholder="e.g. PP-1A-1234" 
                  required
                  value={form.plate_number} 
                  onChange={(e) => setForm({ ...form, plate_number: e.target.value })} 
                />
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Brand</label>
                  <input 
                    className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/50" 
                    placeholder="e.g. Lexus" 
                    value={form.brand} 
                    onChange={(e) => setForm({ ...form, brand: e.target.value })} 
                  />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Model</label>
                  <input 
                    className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/50" 
                    placeholder="e.g. RX450h" 
                    value={form.model} 
                    onChange={(e) => setForm({ ...form, model: e.target.value })} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Vehicle Type</label>
                  <select 
                    className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/50"
                    value={form.type} 
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  >
                    {TYPES.map((t) => <option key={t} value={t} className="bg-[#121212]">{t.toUpperCase()}</option>)}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Passenger Capacity</label>
                  <input 
                    className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/50" 
                    type="number" 
                    min="1" 
                    placeholder="Capacity"
                    value={form.capacity} 
                    onChange={(e) => setForm({ ...form, capacity: +e.target.value })} 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-neutral-900 pt-4">
            <GoldButton type="button" variant="outline" onClick={() => setShowForm(false)} className="px-6 py-2">Cancel</GoldButton>
            <GoldButton type="submit" className="px-8 py-2">Save Vehicle</GoldButton>
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
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-[#0B0B0B] border border-gold/10 text-white text-xs px-3 py-1.5 rounded-xl focus:outline-none focus:border-gold/50 cursor-pointer transition"
          >
            <option value="All">All Types</option>
            {TYPES.map((t) => <option key={t} value={t}>{t.toUpperCase()}</option>)}
          </select>

          <select 
            value={driverFilter}
            onChange={(e) => setDriverFilter(e.target.value)}
            className="bg-[#0B0B0B] border border-gold/10 text-white text-xs px-3 py-1.5 rounded-xl focus:outline-none focus:border-gold/50 cursor-pointer transition"
          >
            <option value="All">All Statuses</option>
            <option value="Assigned">Assigned Only</option>
            <option value="Unassigned">Unassigned Only</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#0B0B0B] border border-gold/10 text-white text-xs px-3 py-1.5 rounded-xl focus:outline-none focus:border-gold/50 cursor-pointer transition"
          >
            <option value="brand">Sort by Brand</option>
            <option value="capacity">Sort by Capacity</option>
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

      {/* Grid Roster */}
      {loading ? (
        <div className="flex flex-col items-center gap-3 py-20 justify-center">
          <span className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin"></span>
          <p className="text-[#A3A3A3] text-xs uppercase tracking-widest font-semibold">Loading Active Fleet...</p>
        </div>
      ) : filteredVehicles.length === 0 ? (
        <div className="card border border-gold/10 bg-[#121212]/30 backdrop-blur-md p-16 text-center rounded-[24px]">
          <p className="text-[#A3A3A3] text-sm">No vehicles match your current filter settings.</p>
        </div>
      ) : (
        <div className="card border border-gold/10 bg-[#121212]/30 backdrop-blur-md p-6 rounded-[24px] shadow-[0_24px_80px_rgba(0,0,0,0.6)] flex flex-col gap-4">
          
          {/* Custom Header labels aligned with the grid */}
          <div className="hidden lg:grid grid-cols-[2fr_1.2fr_1.8fr_1fr_auto] gap-6 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#BFA76A] border-b border-neutral-900 pb-4">
            <div>Vehicle Details</div>
            <div>Plate Registration</div>
            <div>Assigned Chauffeur</div>
            <div>Pax Capacity</div>
            <div className="text-right pr-4">Actions</div>
          </div>

          {/* Cards Rows */}
          <div className="flex flex-col gap-3">
            {filteredVehicles.slice(0, limit).map((v, index) => (
              <div 
                key={v.id} 
                className="grid grid-cols-1 lg:grid-cols-[2fr_1.2fr_1.8fr_1fr_auto] items-center gap-6 px-6 py-4 rounded-2xl border border-gold/5 bg-[#0B0B0B]/40 hover:bg-[#121212]/50 hover:border-gold/20 transition-all duration-300 animate-in fade-in duration-300"
                style={{ animationDelay: `${index * 20}ms` }}
              >
                {/* Column 1: Info */}
                <div className="flex items-center gap-3">
                  <span className="p-2.5 rounded-xl bg-gold/5 border border-gold/15 text-gold shrink-0">
                    <Car className="w-4.5 h-4.5" />
                  </span>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-white font-bold text-sm tracking-wide truncate">{v.brand} {v.model}</span>
                    <span className="text-neutral-400 text-[10px] uppercase font-bold tracking-wider">{v.type}</span>
                  </div>
                </div>

                {/* Column 2: Plate Registration */}
                <div>
                  <span className="font-mono text-xs text-gold border border-gold/20 bg-gold/5 rounded-lg px-2.5 py-1">
                    {v.plate_number}
                  </span>
                </div>

                {/* Column 3: Assigned Chauffeur */}
                <div>
                  {v.driver_name ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-gold/5 border border-gold/15 text-white font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_8px_#D4AF37]"></span>
                      {v.driver_name}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-neutral-900/60 border border-neutral-800 text-neutral-500">
                      Unassigned
                    </span>
                  )}
                </div>

                {/* Column 4: Pax Capacity */}
                <div>
                  <span className="text-xs text-white font-light font-mono bg-[#0B0B0B] border border-neutral-850 px-2.5 py-1 rounded-lg">
                    {v.capacity} Pax
                  </span>
                </div>

                {/* Column 5: Menu Dropdown */}
                <div className="relative text-right">
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleDropdown(v.id); }} 
                    className="p-2 hover:bg-neutral-900 rounded-full text-neutral-400 hover:text-white transition duration-200 cursor-pointer"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  {openDropdownId === v.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#0A0A0A]/95 border border-gold/15 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] backdrop-blur-md z-30 py-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                      <button 
                        onClick={() => { handleDelete(v.id); setOpenDropdownId(null); }} 
                        className="w-full text-left px-4 py-2.5 text-xs text-rose-400 hover:bg-rose-500/10 transition flex items-center gap-2 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-400" /> Retire Vehicle
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredVehicles.length > 5 && (
            <div className="flex justify-center pt-3 border-t border-neutral-900">
              <button
                onClick={() => setLimit(prev => prev === 5 ? filteredVehicles.length : 5)}
                className="px-5 py-2 border border-gold/20 hover:border-gold/50 bg-gold/5 hover:bg-gold/10 text-gold text-xs uppercase font-bold tracking-wider rounded-xl transition duration-200 cursor-pointer"
              >
                {limit === 5 ? 'See More' : 'See Less'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
