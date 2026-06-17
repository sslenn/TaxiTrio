import { useState, useEffect } from 'react';
import { getReports } from '../../service/adminService';
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';
import DataTable from '../../components/DataTable';

export default function Reports() {
  const [data, setData] = useState(null);

  useEffect(() => { 
    getReports().then((r) => setData(r.data.data)).catch(() => {}); 
  }, []);

  if (!data) return (
    <div className="flex items-center gap-2 py-12 justify-center">
      <span className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin"></span>
      <p className="text-[#A3A3A3] text-sm uppercase tracking-wider">Loading system reports...</p>
    </div>
  );

  const { bookings, users, monthly_revenue, top_drivers } = data;

  return (
    <div className="flex flex-col gap-10 max-w-5xl mx-auto">
      <PageHeader 
        title="Reports & Statistics" 
        subtitle="Analytical insights into revenue, fleet volumes, and driver rankings"
      />

      {/* Booking Overview */}
      <div className="flex flex-col gap-4">
        <h3 className="text-base font-bold text-white uppercase tracking-widest text-[11px] border-b border-neutral-900 pb-2">Booking Volume Overview</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            ['Total Bookings', bookings.total],
            ['Completed Trips', bookings.completed],
            ['Cancelled Trips', bookings.cancelled],
            ['Pending Payment', bookings.pending_payment],
          ].map(([label, val]) => (
            <StatCard 
              key={label}
              label={label}
              value={val}
            />
          ))}
        </div>
      </div>

      {/* Users and Driver Roster counts */}
      <div className="flex flex-col gap-4">
        <h3 className="text-base font-bold text-white uppercase tracking-widest text-[11px] border-b border-neutral-900 pb-2">User Registry Volumes</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
          <StatCard 
            label="Registered Travelers"
            value={users.travelers}
          />
          <StatCard 
            label="Active Drivers"
            value={users.drivers}
          />
        </div>
      </div>

      {/* Monthly Revenue */}
      <div className="flex flex-col gap-4">
        <h3 className="text-base font-bold text-white uppercase tracking-widest text-[11px] border-b border-neutral-900 pb-2">Monthly Revenue ledger</h3>
        <DataTable headers={['Reporting Month', 'Total Gross Revenue']}>
          {monthly_revenue.map((m) => (
            <tr key={m.month} className="border-b border-[#1a1a1a] hover:bg-neutral-900/10 transition duration-150">
              <td className="px-6 py-4 text-white font-bold">{new Date(m.month).toLocaleDateString('en', { year: 'numeric', month: 'long' })}</td>
              <td className="px-6 py-4 text-right text-gold font-bold">${parseFloat(m.total_revenue || 0).toFixed(2)}</td>
            </tr>
          ))}
        </DataTable>
      </div>

      {/* Top Drivers */}
      <div className="flex flex-col gap-4">
        <h3 className="text-base font-bold text-white uppercase tracking-widest text-[11px] border-b border-neutral-900 pb-2">Top Performing Drivers</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {top_drivers.map((d, i) => (
            <div 
              key={d.id} 
              className="card border border-gold/15 bg-[#121212] p-5 rounded-2xl flex justify-between items-center hover:border-gold/30 transition duration-200 relative overflow-hidden"
            >
              <div className="absolute -right-12 -top-12 w-24 h-24 rounded-full bg-gold/5 blur-xl"></div>
              <div className="z-10">
                <p className="text-white font-bold font-serif text-base">
                  <span className="text-[#BFA76A] mr-1.5 font-sans font-bold">#{i + 1}</span>
                  {d.full_name}
                </p>
                <p className="text-neutral-500 text-[10px] mt-1 font-semibold uppercase tracking-wider">{d.reviews} Trip Reviews</p>
              </div>
              <p className="text-gold font-black z-10 shrink-0 text-sm">⭐ {d.avg_rating}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
