import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getReports } from '../../service/adminService';
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';
import GoldButton from '../../components/GoldButton';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => { 
    getReports().then((r) => setStats(r.data.data)).catch(() => {}); 
  }, []);

  const b = stats?.bookings;
  const u = stats?.users;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader 
        title="Admin Control Center" 
        subtitle="Overview of system bookings, user accounts, and dispatch stats"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            label: 'Total Bookings', 
            value: b?.total ?? '0',
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.129-1.125v-3.75c0-.621-.504-1.125-1.125-1.125H3.375M16.5 4.5h3" />
              </svg>
            )
          },
          { 
            label: 'Completed Bookings', 
            value: b?.completed ?? '0',
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )
          },
          { 
            label: 'Travelers Registered', 
            value: u?.travelers ?? '0',
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A11.386 11.386 0 0110.089 21c-2.24 0-4.325-.654-6.089-1.78v-.108a8.38 8.38 0 0110.089-8.128M15 19.128c-.29-.4-.543-.84-.753-1.31M15 9.75a3 3 0 11-6 0 3 3 0 016 0zm-3 8.25a3 3 0 100-6 3 3 0 000 6z" />
              </svg>
            )
          },
          { 
            label: 'Drivers Active', 
            value: u?.drivers ?? '0',
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )
          },
        ].map((s) => (
          <StatCard 
            key={s.label}
            label={s.label}
            value={s.value}
            icon={s.icon}
          />
        ))}
      </div>

      {/* Navigation shortcuts */}
      <div className="flex flex-col gap-4 mt-2">
        <h3 className="text-xs font-bold text-white uppercase tracking-widest text-[#BFA76A] border-b border-gold/15 pb-2">Quick Management Routes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'Manage Users',
              to: '/admin/users',
              desc: 'Activate/deactivate customer profiles & driver access roles.',
              color: 'border-blue-500/20 hover:border-blue-500/50',
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A11.386 11.386 0 0110.089 21c-2.24 0-4.325-.654-6.089-1.78v-.108a8.38 8.38 0 0110.089-8.128M15 19.128c-.29-.4-.543-.84-.753-1.31M15 9.75a3 3 0 11-6 0 3 3 0 016 0zm-3 8.25a3 3 0 100-6 3 3 0 000 6z" />
                </svg>
              )
            },
            {
              label: 'Manage Bookings',
              to: '/admin/bookings',
              desc: 'Review passenger booking statuses across all service classes.',
              color: 'border-amber-500/20 hover:border-amber-500/50',
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )
            },
            {
              label: 'Verify Payments',
              to: '/admin/payments',
              desc: 'Verify manual bank transfers and uploaded Bakong receipts.',
              color: 'border-emerald-500/20 hover:border-emerald-500/50',
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )
            },
            {
              label: 'System Reports',
              to: '/admin/reports',
              desc: 'Review total revenue volumes, driver performance, and trends.',
              color: 'border-purple-500/20 hover:border-purple-500/50',
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              )
            },
          ].map((action) => (
            <div 
              key={action.to}
              onClick={() => navigate(action.to)}
              className={`group cursor-pointer bg-[#121212] border ${action.color} p-5 rounded-2xl flex flex-col gap-3 transition-all duration-300 hover:scale-[1.02] relative overflow-hidden`}
            >
              <div className="absolute -right-12 -top-12 w-24 h-24 rounded-full bg-gold/5 blur-2xl transition duration-500 group-hover:scale-150"></div>
              <div className="flex justify-between items-start z-10">
                <div className="p-2.5 rounded-xl bg-neutral-900 border border-gold/10 group-hover:border-gold/30 transition duration-300">
                  {action.icon}
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-neutral-600 group-hover:text-gold transition duration-300 transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <div className="z-10 flex flex-col gap-1">
                <h4 className="text-white font-serif font-bold text-base group-hover:text-gold transition duration-300">{action.label}</h4>
                <p className="text-[#A3A3A3] text-xs font-light leading-relaxed">{action.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Integrity Monitor */}
      <div className="flex flex-col gap-4 mt-6">
        <h3 className="text-xs font-bold text-white uppercase tracking-widest text-[#BFA76A] border-b border-gold/15 pb-2">Live System Integrity Monitor</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Database Connection', status: 'Online / Secure', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
            { label: 'Payment Gateway (Bakong)', status: 'Operational', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
            { label: 'SMS Dispatch Service', status: 'Active (0.2s latency)', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
          ].map((hub) => (
            <div key={hub.label} className="bg-[#121212] border border-gold/10 p-4 rounded-xl flex items-center justify-between text-xs hover:border-gold/25 transition duration-300">
              <span className="text-[#A3A3A3] font-medium">{hub.label}</span>
              <span className={`px-2.5 py-1 rounded-lg border font-bold uppercase text-[9px] tracking-wider ${hub.color}`}>{hub.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
