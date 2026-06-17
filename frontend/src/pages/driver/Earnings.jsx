import { useState, useEffect } from 'react';
import { getEarnings } from '../../service/driverService';
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';

export default function Earnings() {
  const [data, setData] = useState(null);

  useEffect(() => { 
    getEarnings().then((r) => setData(r.data.data)).catch(() => {}); 
  }, []);

  const fmt = (v) => `$${parseFloat(v || 0).toFixed(2)}`;

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <PageHeader 
        title="My Earnings" 
        subtitle="Review your completed trips and payouts summary"
      />

      {!data ? (
        <div className="flex items-center gap-2 py-12 justify-center">
          <span className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin"></span>
          <p className="text-[#A3A3A3] text-sm uppercase tracking-wider">Loading earnings...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { 
              label: 'Completed Trips', 
              value: data.total_trips,
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )
            },
            { 
              label: 'Gross Earnings (100%)', 
              value: fmt(data.gross_earnings),
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.22.11a3 3 0 003.56 0l.22-.11m-3-6.364l.22-.11a3 3 0 003.56 0l.22.11M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              )
            },
            { 
              label: 'Net Earnings (80%)', 
              value: fmt(data.net_earnings),
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
      )}
    </div>
  );
}
