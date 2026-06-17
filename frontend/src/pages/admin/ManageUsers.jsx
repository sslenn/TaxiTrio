import { useState, useEffect } from 'react';
import { getUsers, toggleUser } from '../../service/adminService';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = () => getUsers().then((r) => setUsers(r.data.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleToggle = async (id) => {
    try { 
      await toggleUser(id); 
      load(); 
    } catch (err) { 
      alert(err.response?.data?.message || 'Error'); 
    }
  };

  const filteredUsers = users.filter((u) => 
    u.full_name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.role?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Manage Users" 
        subtitle="Deactivate or activate customer accounts and driver access roles"
      >
        <div className="relative w-64 shrink-0">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-neutral-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gold/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            className="w-full bg-[#121212] border border-gold/15 text-white placeholder-neutral-500 rounded-full py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-gold/50 transition duration-300"
            placeholder="Search name, email, role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </PageHeader>

      {loading ? (
        <div className="flex items-center gap-2 py-12 justify-center">
          <span className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin"></span>
          <p className="text-[#A3A3A3] text-sm uppercase tracking-wider">Loading users...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="card border border-gold/15 bg-[#121212] p-12 text-center rounded-2xl">
          <p className="text-[#A3A3A3] text-sm">No users match your search query.</p>
        </div>
      ) : (
        <DataTable headers={['Name', 'Email', 'Role', 'Status', 'Actions']}>
          {filteredUsers.map((u) => (
            <tr key={u.id} className="border-b border-[#1a1a1a] hover:bg-neutral-900/20 transition duration-150">
              <td className="px-6 py-4 text-white font-bold">
                <div className="flex items-center gap-3">
                  {u.avatar_url ? (
                    <img src={u.avatar_url} alt="avatar" className="w-8 h-8 rounded-full object-cover border border-gold/20 shrink-0" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-neutral-900 border border-gold/20 flex items-center justify-center text-[10px] text-gold font-bold uppercase shrink-0">
                      {u.full_name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <span>{u.full_name}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-[#A3A3A3]">{u.email}</td>
              <td className="px-6 py-4">
                <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                  u.role === 'admin' 
                    ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                    : u.role === 'driver' 
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                }`}>
                  {u.role}
                </span>
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={u.is_active ? 'active' : 'inactive'} />
              </td>
              <td className="px-6 py-4">
                <button 
                  onClick={() => handleToggle(u.id)}
                  className={`text-[10px] font-bold uppercase tracking-wider transition px-3 py-1.5 rounded-xl border ${
                    u.is_active 
                      ? 'text-rose-500 border-rose-500/25 bg-rose-500/5 hover:bg-rose-500/10 hover:border-rose-500/50' 
                      : 'text-emerald-500 border-emerald-500/25 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/50'
                  }`}
                >
                  {u.is_active ? 'Deactivate' : 'Activate'}
                </button>
              </td>
            </tr>
          ))}
        </DataTable>
      )}
    </div>
  );
}
