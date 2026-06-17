import { useState, useEffect } from 'react';
import { getDrivers } from '../../service/adminService';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';

export default function ManageDrivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { 
    getDrivers()
      .then((r) => setDrivers(r.data.data))
      .finally(() => setLoading(false)); 
  }, []);

  const filteredDrivers = drivers.filter((d) => 
    d.full_name?.toLowerCase().includes(search.toLowerCase()) || 
    d.email?.toLowerCase().includes(search.toLowerCase()) ||
    d.phone?.toLowerCase().includes(search.toLowerCase()) ||
    (d.plate_number && d.plate_number.toLowerCase().includes(search.toLowerCase())) ||
    (d.brand && `${d.brand} ${d.model}`.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Manage Drivers" 
        subtitle="Vetted driver roster, vehicles assignments, and live dispatch availability states"
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
            placeholder="Search drivers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </PageHeader>

      {loading ? (
        <div className="flex items-center gap-2 py-12 justify-center">
          <span className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin"></span>
          <p className="text-[#A3A3A3] text-sm uppercase tracking-wider">Loading drivers...</p>
        </div>
      ) : filteredDrivers.length === 0 ? (
        <div className="card border border-gold/15 bg-[#121212] p-12 text-center rounded-2xl">
          <p className="text-[#A3A3A3] text-sm">No drivers match your search query.</p>
        </div>
      ) : (
        <DataTable headers={['Name', 'Email', 'Phone', 'Plate No', 'Vehicle Assigned', 'Available']}>
          {filteredDrivers.map((d) => (
            <tr key={d.id} className="border-b border-[#1a1a1a] hover:bg-neutral-900/20 transition duration-150">
              <td className="px-6 py-4 text-white font-bold">
                <div className="flex items-center gap-3">
                  {d.avatar_url ? (
                    <img src={d.avatar_url} alt="avatar" className="w-8 h-8 rounded-full object-cover border border-gold/20 shrink-0" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-neutral-900 border border-gold/20 flex items-center justify-center text-[10px] text-gold font-bold uppercase shrink-0">
                      {d.full_name?.charAt(0).toUpperCase() || 'D'}
                    </div>
                  )}
                  <span>{d.full_name}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-[#A3A3A3]">{d.email}</td>
              <td className="px-6 py-4 text-[#A3A3A3]">{d.phone}</td>
              <td className="px-6 py-4 text-white font-mono">{d.plate_number || '—'}</td>
              <td className="px-6 py-4 text-white font-serif">{d.brand ? `${d.brand} ${d.model}` : '—'}</td>
              <td className="px-6 py-4">
                <StatusBadge status={d.is_available ? 'active' : 'inactive'} />
              </td>
            </tr>
          ))}
        </DataTable>
      )}
    </div>
  );
}
