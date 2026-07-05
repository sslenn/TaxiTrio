import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, toggleUser } from '../../service/adminService';
import PageHeader from '../../components/PageHeader';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Search, 
  Filter, 
  RotateCw, 
  MoreVertical, 
  ShieldAlert, 
  Mail, 
  UserPlus 
} from 'lucide-react';

export default function ManageUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [limit, setLimit] = useState(5);

  const load = () => {
    setLoading(true);
    getUsers()
      .then((r) => setUsers(r.data.data))
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

  const handleToggle = async (id) => {
    try { 
      await toggleUser(id); 
      load(); 
    } catch (err) { 
      alert(err.response?.data?.message || 'Error toggling user status'); 
    }
  };

  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  // Stats
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.is_active).length;
  const deactivatedUsers = users.filter((u) => !u.is_active).length;
  const travelerUsers = users.filter((u) => u.role === 'traveler').length;

  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      u.full_name?.toLowerCase().includes(search.toLowerCase()) || 
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.role?.toLowerCase().includes(search.toLowerCase());

    let matchesRole = true;
    if (roleFilter !== 'All') {
      matchesRole = u.role?.toLowerCase() === roleFilter.toLowerCase();
    }

    let matchesStatus = true;
    if (statusFilter !== 'All') {
      matchesStatus = statusFilter === 'Active' ? u.is_active : !u.is_active;
    }

    return matchesSearch && matchesRole && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'name') {
      return (a.full_name || '').localeCompare(b.full_name || '');
    } else if (sortBy === 'role') {
      return (a.role || '').localeCompare(b.role || '');
    }
    return 0;
  });

  return (
    <div className="flex flex-col gap-8 relative pb-10">
      
      {/* Page Header */}
      <PageHeader 
        title="Manage Users" 
        subtitle="Deactivate or activate customer accounts and driver access roles"
      >
        <div className="relative w-64 shrink-0">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-neutral-500">
            <Search className="w-4 h-4 text-gold/60" />
          </span>
          <input
            type="text"
            className="w-full bg-[#121212] border border-gold/15 text-white placeholder-neutral-500 rounded-full py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-gold/50 transition duration-300 shadow-inner"
            placeholder="Search name, email, role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </PageHeader>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="bg-[#121212]/50 border border-gold/10 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden group hover:border-gold/30 transition duration-300 flex flex-col gap-2 shadow-md">
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
          <div className="flex justify-between items-center">
            <span className="p-2 rounded-xl bg-gold/5 border border-gold/15 text-gold shrink-0">
              <Users className="w-4 h-4" />
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_8px_#D4AF37]"></span>
          </div>
          <div className="mt-1">
            <p className="text-3xl font-bold text-white tracking-tight">{totalUsers}</p>
            <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mt-0.5">Total Accounts</p>
          </div>
        </div>

        {/* Active Accounts */}
        <div className="bg-[#121212]/50 border border-gold/10 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden group hover:border-gold/30 transition duration-300 flex flex-col gap-2 shadow-md">
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
          <div className="flex justify-between items-center">
            <span className="p-2 rounded-xl bg-emerald-500/5 border border-emerald-500/15 text-emerald-400 shrink-0">
              <UserCheck className="w-4 h-4" />
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
          </div>
          <div className="mt-1">
            <p className="text-3xl font-bold text-white tracking-tight">{activeUsers}</p>
            <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mt-0.5">Active Users</p>
          </div>
        </div>

        {/* Deactivated */}
        <div className="bg-[#121212]/50 border border-gold/10 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden group hover:border-gold/30 transition duration-300 flex flex-col gap-2 shadow-md">
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
          <div className="flex justify-between items-center">
            <span className="p-2 rounded-xl bg-rose-500/5 border border-rose-500/15 text-rose-400 shrink-0">
              <UserX className="w-4 h-4" />
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shadow-[0_0_8px_#f43f5e]"></span>
          </div>
          <div className="mt-1">
            <p className="text-3xl font-bold text-white tracking-tight">{deactivatedUsers}</p>
            <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mt-0.5">Suspended</p>
          </div>
        </div>

        {/* Travelers */}
        <div className="bg-[#121212]/50 border border-gold/10 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden group hover:border-gold/30 transition duration-300 flex flex-col gap-2 shadow-md">
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
          <div className="flex justify-between items-center">
            <span className="p-2 rounded-xl bg-blue-500/5 border border-blue-500/15 text-blue-400 shrink-0">
              <UserPlus className="w-4.5 h-4.5" />
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa]"></span>
          </div>
          <div className="mt-1">
            <p className="text-3xl font-bold text-white tracking-tight">{travelerUsers}</p>
            <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mt-0.5">Travelers</p>
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
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-[#0B0B0B] border border-gold/10 text-white text-xs px-3 py-1.5 rounded-xl focus:outline-none focus:border-gold/50 cursor-pointer transition"
          >
            <option value="All">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Driver">Driver</option>
            <option value="Traveler">Traveler</option>
          </select>

          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0B0B0B] border border-gold/10 text-white text-xs px-3 py-1.5 rounded-xl focus:outline-none focus:border-gold/50 cursor-pointer transition"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#0B0B0B] border border-gold/10 text-white text-xs px-3 py-1.5 rounded-xl focus:outline-none focus:border-gold/50 cursor-pointer transition"
          >
            <option value="name">Sort by Name</option>
            <option value="role">Sort by Role</option>
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

      {/* Cards List Grid */}
      {loading ? (
        <div className="flex flex-col items-center gap-3 py-20 justify-center">
          <span className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin"></span>
          <p className="text-[#A3A3A3] text-xs uppercase tracking-widest font-semibold">Loading Roster...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="card border border-gold/10 bg-[#121212]/30 backdrop-blur-md p-16 text-center rounded-[24px]">
          <p className="text-[#A3A3A3] text-sm">No accounts found matching your query.</p>
        </div>
      ) : (
        <div className="card border border-gold/10 bg-[#121212]/30 backdrop-blur-md p-6 rounded-[24px] shadow-[0_24px_80px_rgba(0,0,0,0.6)] flex flex-col gap-4">
          
          {/* Custom Header labels aligned with the grid */}
          <div className="hidden lg:grid grid-cols-[2.5fr_1.5fr_1fr_auto] gap-6 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#BFA76A] border-b border-neutral-900 pb-4">
            <div>User Information</div>
            <div>Access Level</div>
            <div>Access State</div>
            <div className="text-right pr-4">Actions</div>
          </div>

          {/* Cards Rows */}
          <div className="flex flex-col gap-3">
            {filteredUsers.slice(0, limit).map((u, index) => (
              <div 
                key={u.id} 
                className="grid grid-cols-1 lg:grid-cols-[2.5fr_1.5fr_1fr_auto] items-center gap-6 px-6 py-4 rounded-2xl border border-gold/5 bg-[#0B0B0B]/40 hover:bg-[#121212]/50 hover:border-gold/20 transition-all duration-300 animate-in fade-in duration-300"
                style={{ animationDelay: `${index * 20}ms` }}
              >
                {/* Column 1: Info */}
                <div className="flex items-center gap-3">
                  {u.avatar_url ? (
                    <img src={u.avatar_url} alt={u.full_name} className="w-10 h-10 rounded-full object-cover border border-gold/25 shadow-md shadow-gold/5 shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-neutral-900 border border-gold/25 flex items-center justify-center text-xs text-gold font-bold uppercase shadow-md shadow-gold/5 shrink-0">
                      {u.full_name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-white font-bold text-sm tracking-wide truncate">{u.full_name}</span>
                    <span className="text-neutral-400 text-[11px] font-light flex items-center gap-1.5 truncate">
                      <Mail className="w-3 h-3 text-[#BFA76A]" /> {u.email}
                    </span>
                  </div>
                </div>

                {/* Column 2: Access Level / Role */}
                <div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    u.role === 'admin' 
                      ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                      : u.role === 'driver' 
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}>
                    {u.role}
                  </span>
                </div>

                {/* Column 3: Access State */}
                <div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    u.is_active 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      u.is_active ? 'bg-emerald-400' : 'bg-rose-400'
                    }`}></span>
                    {u.is_active ? 'Active' : 'Suspended'}
                  </span>
                </div>

                {/* Column 4: Actions Dropdown */}
                <div className="relative text-right">
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleDropdown(u.id); }} 
                    className="p-2 hover:bg-neutral-900 rounded-full text-neutral-400 hover:text-white transition duration-200 cursor-pointer"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  {openDropdownId === u.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#0A0A0A]/95 border border-gold/15 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] backdrop-blur-md z-30 py-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                      <button 
                        onClick={() => { navigate(`/admin/users/${u.id}`); setOpenDropdownId(null); }} 
                        className="w-full text-left px-4 py-2.5 text-xs text-white hover:bg-gold/10 hover:text-gold transition flex items-center gap-2 cursor-pointer"
                      >
                        <Users className="w-3.5 h-3.5" /> View Profile Details
                      </button>
                      <button 
                        onClick={() => { handleToggle(u.id); setOpenDropdownId(null); }} 
                        className="w-full text-left px-4 py-2.5 text-xs text-white hover:bg-gold/10 hover:text-gold transition flex items-center gap-2 border-t border-neutral-900 cursor-pointer"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" /> {u.is_active ? 'Suspend Account' : 'Reactivate Account'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredUsers.length > 5 && (
            <div className="flex justify-center pt-3 border-t border-neutral-900">
              <button
                onClick={() => setLimit(prev => prev === 5 ? filteredUsers.length : 5)}
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
