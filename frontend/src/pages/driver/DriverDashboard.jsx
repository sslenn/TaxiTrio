import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEarnings } from '../../service/driverService';
import { getUser } from '../../utils/auth';
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';
import GoldButton from '../../components/GoldButton';

export default function DriverDashboard() {
  const navigate = useNavigate();
  const user = getUser();
  const [earnings, setEarnings] = useState(null);

  useEffect(() => { 
    getEarnings().then((r) => setEarnings(r.data.data)).catch(() => {}); 
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader 
        title={`Welcome, ${user?.full_name || 'Driver'}`} 
        subtitle="Driver Command center"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          label="Total Trips" 
          value={earnings?.total_trips ?? '0'} 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.129-1.125v-3.75c0-.621-.504-1.125-1.125-1.125H3.375M16.5 4.5h3" />
            </svg>
          }
        />
        <StatCard 
          label="Gross Earnings" 
          value={earnings ? `$${parseFloat(earnings.gross_earnings).toFixed(2)}` : '$0.00'} 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.22.11a3 3 0 003.56 0l.22-.11m-3-6.364l.22-.11a3 3 0 003.56 0l.22.11M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          }
        />
        <StatCard 
          label="Net Earnings (80%)" 
          value={earnings ? `$${parseFloat(earnings.net_earnings).toFixed(2)}` : '$0.00'} 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Action shortcuts */}
      <div className="flex flex-wrap gap-4 mt-2">
        <GoldButton onClick={() => navigate('/driver/bookings')}>
          View Assigned Bookings
        </GoldButton>
        <GoldButton onClick={() => navigate('/driver/schedule')} variant="outline">
          Trip Schedule
        </GoldButton>
      </div>
    </div>
  );
}
