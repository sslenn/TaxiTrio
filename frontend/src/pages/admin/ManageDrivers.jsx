import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDrivers, createDriver, toggleUser } from '../../service/adminService';
import PageHeader from '../../components/PageHeader';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Car, 
  Search, 
  Plus, 
  Filter, 
  RotateCw, 
  MoreVertical, 
  ShieldAlert, 
  Mail, 
  Phone, 
  FileText,
  X
} from 'lucide-react';

export default function ManageDrivers() {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [vehicleFilter, setVehicleFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [limit, setLimit] = useState(5);

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', license_number: '' });
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');

  const loadDrivers = () => {
    setLoading(true);
    getDrivers()
      .then((r) => setDrivers(r.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { 
    loadDrivers();
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

  const handleToggleStatus = async (id) => {
    try {
      await toggleUser(id);
      loadDrivers();
    } catch (err) {
      alert(err.response?.data?.message || 'Error toggling driver status');
    }
  };

  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  // Stats computation
  const totalDrivers = drivers.length;
  const activeDrivers = drivers.filter((d) => d.status === 'active').length;
  const pendingApproval = drivers.filter((d) => d.status === 'pending_activation' || d.status === 'pending').length;
  const assignedVehicles = drivers.filter((d) => d.brand || d.plate_number).length;

  const filteredDrivers = drivers.filter((d) => {
    // Search query
    const matchesSearch = 
      d.full_name?.toLowerCase().includes(search.toLowerCase()) || 
      d.email?.toLowerCase().includes(search.toLowerCase()) ||
      d.phone?.toLowerCase().includes(search.toLowerCase()) ||
      d.license_number?.toLowerCase().includes(search.toLowerCase()) ||
      (d.plate_number && d.plate_number.toLowerCase().includes(search.toLowerCase())) ||
      (d.brand && `${d.brand} ${d.model}`.toLowerCase().includes(search.toLowerCase()));

    // Status Filter
    let matchesStatus = true;
    if (statusFilter !== 'All') {
      if (statusFilter === 'Active') matchesStatus = d.status === 'active';
      else if (statusFilter === 'Pending') matchesStatus = d.status === 'pending_activation' || d.status === 'pending';
      else if (statusFilter === 'Suspended') matchesStatus = d.status === 'suspended' || d.status === 'inactive';
    }

    // Vehicle Filter
    let matchesVehicle = true;
    if (vehicleFilter !== 'All') {
      if (vehicleFilter === 'Assigned') matchesVehicle = !!(d.brand || d.plate_number);
      else if (vehicleFilter === 'Unassigned') matchesVehicle = !(d.brand || d.plate_number);
    }

    return matchesSearch && matchesStatus && matchesVehicle;
  }).sort((a, b) => {
    if (sortBy === 'name') {
      return (a.full_name || '').localeCompare(b.full_name || '');
    } else if (sortBy === 'status') {
      return (a.status || '').localeCompare(b.status || '');
    }
    return 0;
  });

  const handleCreateDriver = async (e) => {
    e.preventDefault();
    setModalError('');
    setModalSuccess('');

    // Client-side validation
    if (!form.name.trim()) {
      setModalError('Name is required');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      setModalError('Please enter a valid email address');
      return;
    }
    const phoneRegex = /^\+?[0-9\s\-()]{8,20}$/;
    if (!phoneRegex.test(form.phone.trim())) {
      setModalError('Please enter a valid phone number (min 8 digits)');
      return;
    }
    if (!form.license_number.trim()) {
      setModalError('License number is required');
      return;
    }

    setModalLoading(true);
    try {
      await createDriver({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        license_number: form.license_number.trim()
      });
      setModalSuccess(`Driver created successfully! Activation link sent to ${form.email}.`);
      
      // Reload driver list
      loadDrivers();

      setTimeout(() => {
        setShowModal(false);
      }, 3000);
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to create driver account.');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 relative pb-10">
      
      {/* Premium Header */}
      <PageHeader 
        title="Manage Drivers" 
        subtitle="Vetted drivers, vehicle assignments, dispatch availability"
      >
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative w-64 shrink-0">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-neutral-500">
              <Search className="w-4 h-4 text-gold/60" />
            </span>
            <input
              type="text"
              className="w-full bg-[#121212] border border-gold/15 text-white placeholder-neutral-500 rounded-full py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-gold/50 transition duration-300 shadow-inner"
              placeholder="Search drivers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={() => {
              setModalError('');
              setModalSuccess('');
              setForm({ name: '', email: '', phone: '', license_number: '' });
              setShowModal(true);
            }}
            className="bg-[#D4AF37] hover:bg-[#E3C45A] text-black font-sans font-bold text-xs tracking-wider uppercase px-5 py-2.5 rounded-full shadow-lg shadow-gold/10 hover:shadow-gold/25 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-black" strokeWidth={3} />
            Add Driver
          </button>
        </div>
      </PageHeader>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Drivers */}
        <div className="bg-[#121212]/50 border border-gold/10 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden group hover:border-gold/30 transition duration-300 flex flex-col gap-2 shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
          <div className="flex justify-between items-center">
            <span className="p-2 rounded-xl bg-gold/5 border border-gold/15 text-gold shrink-0">
              <Users className="w-4 h-4" />
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_8px_#D4AF37]"></span>
          </div>
          <div className="mt-1">
            <p className="text-3xl font-bold text-white tracking-tight">{totalDrivers}</p>
            <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mt-0.5">Total Drivers</p>
          </div>
        </div>

        {/* Active Drivers */}
        <div className="bg-[#121212]/50 border border-gold/10 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden group hover:border-gold/30 transition duration-300 flex flex-col gap-2 shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
          <div className="flex justify-between items-center">
            <span className="p-2 rounded-xl bg-emerald-500/5 border border-emerald-500/15 text-emerald-400 shrink-0">
              <UserCheck className="w-4 h-4" />
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
          </div>
          <div className="mt-1">
            <p className="text-3xl font-bold text-white tracking-tight">{activeDrivers}</p>
            <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mt-0.5">Active Dispatch</p>
          </div>
        </div>

        {/* Pending Approval */}
        <div className="bg-[#121212]/50 border border-gold/10 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden group hover:border-gold/30 transition duration-300 flex flex-col gap-2 shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
          <div className="flex justify-between items-center">
            <span className="p-2 rounded-xl bg-amber-500/5 border border-amber-500/15 text-amber-400 shrink-0">
              <UserX className="w-4 h-4" />
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]"></span>
          </div>
          <div className="mt-1">
            <p className="text-3xl font-bold text-white tracking-tight">{pendingApproval}</p>
            <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mt-0.5">Pending Approval</p>
          </div>
        </div>

        {/* Assigned Vehicles */}
        <div className="bg-[#121212]/50 border border-gold/10 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden group hover:border-gold/30 transition duration-300 flex flex-col gap-2 shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
          <div className="flex justify-between items-center">
            <span className="p-2 rounded-xl bg-blue-500/5 border border-blue-500/15 text-blue-400 shrink-0">
              <Car className="w-4 h-4" />
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa]"></span>
          </div>
          <div className="mt-1">
            <p className="text-3xl font-bold text-white tracking-tight">{assignedVehicles}</p>
            <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mt-0.5">Assigned Fleet</p>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121212]/30 border border-gold/10 rounded-2xl p-4 backdrop-blur-md shadow-md">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-[#0B0B0B] border border-gold/10 px-3 py-1.5 rounded-xl">
            <Filter className="w-3.5 h-3.5 text-gold" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Filters:</span>
          </div>
          
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0B0B0B] border border-gold/10 text-white text-xs px-3 py-1.5 rounded-xl focus:outline-none focus:border-gold/50 cursor-pointer transition"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Suspended">Suspended</option>
          </select>

          <select 
            value={vehicleFilter}
            onChange={(e) => setVehicleFilter(e.target.value)}
            className="bg-[#0B0B0B] border border-gold/10 text-white text-xs px-3 py-1.5 rounded-xl focus:outline-none focus:border-gold/50 cursor-pointer transition"
          >
            <option value="All">All Fleet States</option>
            <option value="Assigned">Assigned Fleet</option>
            <option value="Unassigned">Unassigned Drivers</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#0B0B0B] border border-gold/10 text-white text-xs px-3 py-1.5 rounded-xl focus:outline-none focus:border-gold/50 cursor-pointer transition"
          >
            <option value="name">Sort by Name</option>
            <option value="status">Sort by Status</option>
          </select>

          <button 
            onClick={loadDrivers}
            className="p-2 bg-[#0B0B0B] border border-gold/10 hover:border-gold/30 hover:text-gold text-neutral-400 rounded-xl transition duration-200 cursor-pointer"
            title="Refresh list"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Spacious Custom Data Grid Row Layout */}
      {loading ? (
        <div className="flex flex-col items-center gap-3 py-20 justify-center">
          <span className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin"></span>
          <p className="text-[#A3A3A3] text-xs uppercase tracking-widest font-semibold">Loading Fleet Roster...</p>
        </div>
      ) : filteredDrivers.length === 0 ? (
        <div className="card border border-gold/10 bg-[#121212]/30 backdrop-blur-md p-16 text-center rounded-[24px]">
          <p className="text-[#A3A3A3] text-sm">No drivers match your current filter settings.</p>
        </div>
      ) : (
        <div className="card border border-gold/10 bg-[#121212]/30 backdrop-blur-md p-6 rounded-[24px] shadow-[0_24px_80px_rgba(0,0,0,0.6)] flex flex-col gap-4">
          
          {/* Custom Header labels aligned with the grid */}
          <div className="hidden lg:grid grid-cols-[2fr_1.5fr_1.5fr_1fr_auto] gap-6 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#BFA76A] border-b border-neutral-900 pb-4">
            <div>Driver Information</div>
            <div>Contact Details</div>
            <div>Vehicle Fleet</div>
            <div>Availability</div>
            <div className="text-right pr-4">Actions</div>
          </div>

          {/* Cards Rows */}
          <div className="flex flex-col gap-3">
            {filteredDrivers.slice(0, limit).map((d, index) => (
              <div 
                key={d.id} 
                className="grid grid-cols-1 lg:grid-cols-[2fr_1.5fr_1.5fr_1fr_auto] items-center gap-6 px-6 py-4 rounded-2xl border border-gold/5 bg-[#0B0B0B]/40 hover:bg-[#121212]/50 hover:border-gold/20 transition-all duration-300 animate-in fade-in duration-300"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                {/* Column 1: Info */}
                <div className="flex items-center gap-3">
                  {d.avatar_url ? (
                    <img src={d.avatar_url} alt={d.full_name} className="w-10 h-10 rounded-full object-cover border border-gold/25 shadow-md shadow-gold/5 shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-neutral-900 border border-gold/25 flex items-center justify-center text-xs text-gold font-bold uppercase shadow-md shadow-gold/5 shrink-0">
                      {d.full_name?.charAt(0).toUpperCase() || 'D'}
                    </div>
                  )}
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-white font-bold text-sm tracking-wide truncate">{d.full_name}</span>
                    <span className="text-neutral-400 text-[11px] font-light flex items-center gap-1.5 truncate">
                      <Mail className="w-3 h-3 text-[#BFA76A]" /> {d.email}
                    </span>
                  </div>
                </div>

                {/* Column 2: Contact Info */}
                <div className="flex flex-col gap-1 text-xs text-neutral-300">
                  <span className="flex items-center gap-1.5 font-light">
                    <Phone className="w-3.5 h-3.5 text-gold/60 shrink-0" /> {d.phone || <span className="inline-flex px-2 py-0.5 rounded bg-neutral-950/60 border border-neutral-900 text-[10px] text-neutral-500 uppercase font-bold tracking-wide">Not Provided</span>}
                  </span>
                  <span className="flex items-center gap-1.5 font-mono text-[10px] text-neutral-400">
                    <FileText className="w-3.5 h-3.5 text-[#BFA76A] shrink-0" /> {d.license_number || <span className="inline-flex px-2 py-0.5 rounded bg-neutral-950/60 border border-neutral-900 text-[10px] text-neutral-500 uppercase font-bold tracking-wide">Not Provided</span>}
                  </span>
                </div>

                {/* Column 3: Vehicle Assigned */}
                <div>
                  {d.brand ? (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 bg-gold/5 border border-gold/15 rounded-full px-3 py-1 w-fit">
                        <Car className="w-3.5 h-3.5 text-gold shrink-0" />
                        <span className="text-xs text-white font-medium">{d.brand} {d.model}</span>
                      </div>
                      <span className="text-[10px] font-mono text-neutral-400 pl-6">{d.plate_number}</span>
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-neutral-900/60 border border-neutral-800 text-neutral-500">
                      Unassigned
                    </span>
                  )}
                </div>

                {/* Column 4: Status */}
                <div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    d.status === 'active' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : (d.status === 'pending_activation' || d.status === 'pending')
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      d.status === 'active' 
                        ? 'bg-emerald-400' 
                        : (d.status === 'pending_activation' || d.status === 'pending')
                        ? 'bg-amber-400'
                        : 'bg-rose-400'
                    }`}></span>
                    {d.status === 'active' ? 'Active' : (d.status === 'pending_activation' || d.status === 'pending') ? 'Pending' : 'Suspended'}
                  </span>
                </div>

                {/* Column 5: Menu Dropdown */}
                <div className="relative text-right">
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleDropdown(d.id); }} 
                    className="p-2 hover:bg-neutral-900 rounded-full text-neutral-400 hover:text-white transition duration-200 cursor-pointer"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  {openDropdownId === d.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#0A0A0A]/95 border border-gold/15 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] backdrop-blur-md z-30 py-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                      <button 
                        onClick={() => { navigate(`/admin/users/${d.id}`); setOpenDropdownId(null); }} 
                        className="w-full text-left px-4 py-2.5 text-xs text-white hover:bg-gold/10 hover:text-gold transition flex items-center gap-2 cursor-pointer"
                      >
                        <Users className="w-3.5 h-3.5" /> View Full Profile
                      </button>
                      <button 
                        onClick={() => { handleToggleStatus(d.id); setOpenDropdownId(null); }} 
                        className="w-full text-left px-4 py-2.5 text-xs text-white hover:bg-gold/10 hover:text-gold transition flex items-center gap-2 border-t border-neutral-900 cursor-pointer"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" /> Toggle Availability
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredDrivers.length > 5 && (
            <div className="flex justify-center pt-3 border-t border-neutral-900">
              <button
                onClick={() => setLimit(prev => prev === 5 ? filteredDrivers.length : 5)}
                className="px-5 py-2 border border-gold/20 hover:border-gold/50 bg-gold/5 hover:bg-gold/10 text-gold text-xs uppercase font-bold tracking-wider rounded-xl transition duration-200 cursor-pointer"
              >
                {limit === 5 ? 'See More' : 'See Less'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add Driver Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-[480px] border border-[#2A2A2A] hover:border-gold/20 bg-[#0b0b0b]/95 p-8 rounded-3xl flex flex-col gap-5 shadow-[0_12px_40px_rgba(0,0,0,0.8)] relative overflow-hidden">
            {/* Subtle Decorative Golden Border Glow line */}
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-gold/40 to-transparent"></div>

            <div className="flex justify-between items-center select-none">
              <h2 className="text-xl font-serif text-gold tracking-widest uppercase">Register Driver</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-[#9CA3AF] hover:text-white transition duration-200 p-1 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <p className="text-red-400 text-xs text-center bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl animate-in fade-in">
                {modalError}
              </p>
            )}

            {modalSuccess && (
              <div className="flex flex-col gap-3 text-center py-4 select-none animate-in fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                  </svg>
                </div>
                <p className="text-white text-sm font-semibold">Registration Successful</p>
                <p className="text-[#9CA3AF] text-xs leading-relaxed font-light px-2">
                  {modalSuccess}
                </p>
              </div>
            )}

            {!modalSuccess && (
              <form onSubmit={handleCreateDriver} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="modal-name" className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider">Driver Name</label>
                  <input
                    id="modal-name"
                    type="text"
                    required
                    className="w-full bg-[#050505] border border-gold/15 text-white rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all duration-350"
                    placeholder="Enter full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="modal-email" className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider">Email Address</label>
                  <input
                    id="modal-email"
                    type="email"
                    required
                    className="w-full bg-[#050505] border border-gold/15 text-white rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all duration-350"
                    placeholder="driver@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="modal-phone" className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider">Phone Number</label>
                  <input
                    id="modal-phone"
                    type="tel"
                    required
                    className="w-full bg-[#050505] border border-gold/15 text-white rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all duration-350"
                    placeholder="+85512345678"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="modal-license" className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider">Driver License Number</label>
                  <input
                    id="modal-license"
                    type="text"
                    required
                    className="w-full bg-[#050505] border border-gold/15 text-white rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all duration-350"
                    placeholder="e.g. DL-98765"
                    value={form.license_number}
                    onChange={(e) => setForm({ ...form, license_number: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={modalLoading}
                  className="w-full bg-[#D4AF37] hover:bg-[#E3C45A] text-black font-bold uppercase tracking-wider py-3.5 rounded-xl shadow-lg hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all text-xs mt-3 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {modalLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                      <span>Creating Profile...</span>
                    </>
                  ) : (
                    <span>Register and Send Invite</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
