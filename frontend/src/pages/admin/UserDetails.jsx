import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserDetails } from '../../service/adminService';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('bookings');

  useEffect(() => {
    getUserDetails(id)
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to fetch user details');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const getAccountAge = (dateStr) => {
    if (!dateStr) return '—';
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / (24 * 3600 * 1000));
    if (days < 30) return `${days} Day${days !== 1 ? 's' : ''}`;
    const months = Math.floor(days / 30);
    return `${months} Month${months !== 1 ? 's' : ''}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-2">
        <span className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin"></span>
        <p className="text-[#A3A3A3] text-sm uppercase tracking-wider">Loading user details...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <p className="text-rose-400 font-semibold">{error || 'User not found'}</p>
        <button 
          onClick={() => navigate('/admin/users')}
          className="bg-neutral-900 border border-gold/15 text-gold hover:bg-neutral-800 text-xs px-4 py-2 rounded-full font-bold uppercase tracking-wider transition"
        >
          Back to users list
        </button>
      </div>
    );
  }

  const { profile, stats, bookings, reviews } = data;

  return (
    <div className="flex flex-col gap-6">
      {/* Back navigation and title */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/users')}
          className="bg-[#121212] border border-gold/10 hover:border-gold/30 text-gold p-2.5 rounded-full transition duration-300 shadow-md flex items-center justify-center hover:scale-105 active:scale-95 shrink-0"
          title="Back to Users"
          aria-label="Back to Users"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <PageHeader 
          title="User Account Details" 
          subtitle="Comprehensive user profiling, usage summary, and interaction records"
        />
      </div>

      {/* Profile Header Card */}
      <div className="card border border-gold/15 bg-[#121212] p-6 md:p-8 rounded-2xl flex flex-col md:flex-row gap-6 items-center md:items-start shadow-xl relative overflow-hidden">
        <div className="absolute -right-32 -top-32 w-64 h-64 rounded-full bg-gold/5 blur-3xl"></div>
        
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-neutral-950 border border-gold/20 flex items-center justify-center text-2xl text-gold font-bold uppercase shrink-0 shadow-lg">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt="profile" className="w-full h-full rounded-full object-cover" />
          ) : (
            profile.full_name?.charAt(0) || 'U'
          )}
        </div>

        {/* Profile Info Details */}
        <div className="flex-grow flex flex-col gap-3 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <h2 className="text-xl md:text-2xl font-bold text-white">{profile.full_name}</h2>
            <div className="flex gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                profile.role === 'admin' 
                  ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                  : profile.role === 'driver' 
                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              }`}>
                {profile.role}
              </span>
              <StatusBadge status={profile.is_active ? 'active' : 'inactive'} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs md:text-sm text-[#A3A3A3] mt-1">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gold">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <span>{profile.email}</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gold">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
              </svg>
              <span>{profile.phone || 'No phone number'}</span>
            </div>
            {profile.license_number && (
              <div className="flex items-center justify-center md:justify-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gold">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.03 0 1.9.693 2.166 1.638m-7.377 12.481A23.906 23.906 0 0112 18.75m7.5-3.521c-.424.01-.847.017-1.27.021m-5.074.025A24.074 24.074 0 0115 15.25c-.28 0-.56-.002-.84-.006m-2.162-.01c-.347-.004-.694-.01-1.04-.019m0 0A23.996 23.996 0 0112 12.75M12 3v15.75m0-15.75H9.75M12 18.75H9.75" />
                </svg>
                <span className="font-mono">License: {profile.license_number}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="card border border-gold/15 bg-[#121212] p-6 rounded-2xl flex flex-col gap-1.5 shadow-md relative overflow-hidden">
          <div className="absolute right-4 top-4 text-gold/10">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 20.364a10.56 10.56 0 002.275-2.275m0 0a10.56 10.56 0 00-2.275-2.275m2.275 2.275H15M20.364 8.334a10.56 10.56 0 00-2.275-2.275m0 0a10.56 10.56 0 002.275 2.275m-2.275-2.275H15M3.636 15.666a10.56 10.56 0 012.275 2.275m0 0a10.56 10.56 0 01-2.275 2.275m2.275-2.275H9M3.636 8.334a10.56 10.56 0 012.275-2.275m0 0a10.56 10.56 0 01-2.275 2.275m2.275-2.275H9" />
            </svg>
          </div>
          <span className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider">Completed Rides</span>
          <span className="text-2xl md:text-3xl text-white font-bold">{stats.total_trips || 0}</span>
        </div>

        {profile.role === 'driver' ? (
          <div className="card border border-gold/15 bg-[#121212] p-6 rounded-2xl flex flex-col gap-1.5 shadow-md relative overflow-hidden">
            <div className="absolute right-4 top-4 text-gold/10">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c.172-.375.696-.375.868 0l3.007 6.177 6.792.982c.414.06.58.567.28.857l-4.912 4.79 1.159 6.764c.07.41-.36.72-.73.529l-6.073-3.193-6.073 3.193c-.37.19-.8-.11-.73-.529l1.159-6.764-4.912-4.79c-.3-.29-.134-.797.28-.857l6.792-.982 3.007-6.177z" />
              </svg>
            </div>
            <span className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider">Average Rating</span>
            <span className="text-2xl md:text-3xl text-white font-bold">
              {stats.average_rating ? stats.average_rating.toFixed(2) : '—'}
            </span>
          </div>
        ) : (
          <div className="card border border-gold/15 bg-[#121212] p-6 rounded-2xl flex flex-col gap-1.5 shadow-md relative overflow-hidden">
            <div className="absolute right-4 top-4 text-gold/10">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.596c.616.417 1.44.417 2.056 0l.879-.596M6 9.75h12m-12 4.5h12m-6-9v13.5" />
              </svg>
            </div>
            <span className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider">Total Spent</span>
            <span className="text-2xl md:text-3xl text-white font-bold">
              ${stats.total_spent ? stats.total_spent.toFixed(2) : '0.00'}
            </span>
          </div>
        )}

        <div className="card border border-gold/15 bg-[#121212] p-6 rounded-2xl flex flex-col gap-1.5 shadow-md relative overflow-hidden">
          <div className="absolute right-4 top-4 text-gold/10">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
          </div>
          <span className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider">Account Age</span>
          <span className="text-2xl md:text-3xl text-white font-bold">{getAccountAge(profile.created_at)}</span>
        </div>
      </div>

      {/* Tabs and Content Section */}
      <div className="flex flex-col gap-4">
        {/* Tab Headers */}
        <div className="flex border-b border-[#2A2A2A] relative select-none">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-6 py-3 font-serif uppercase tracking-widest text-xs font-bold transition duration-300 relative ${
              activeTab === 'bookings' ? 'text-gold' : 'text-[#9CA3AF] hover:text-white'
            }`}
          >
            Booking History
            {activeTab === 'bookings' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-3 font-serif uppercase tracking-widest text-xs font-bold transition duration-300 relative ${
              activeTab === 'reviews' ? 'text-gold' : 'text-[#9CA3AF] hover:text-white'
            }`}
          >
            {profile.role === 'driver' ? 'Ratings & Feedback' : 'Reviews Written'}
            {activeTab === 'reviews' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold"></span>
            )}
          </button>
        </div>

        {/* Tab Contents */}
        <div className="mt-2">
          {activeTab === 'bookings' && (
            bookings.length === 0 ? (
              <div className="card border border-gold/15 bg-[#121212] p-8 text-center rounded-2xl">
                <p className="text-[#A3A3A3] text-sm">No bookings recorded for this user.</p>
              </div>
            ) : (
              <DataTable headers={['Booking ID', 'Date & Time', 'Type', 'From / To', 'Fare', 'Status']}>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-b border-[#1a1a1a] hover:bg-neutral-900/10 transition">
                    <td className="px-6 py-4 font-mono text-xs text-white">
                      {b.id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 text-[#A3A3A3] text-xs">
                      {formatDate(b.pickup_time || b.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[10px] font-bold text-white uppercase tracking-wider">
                        {b.notes?.startsWith('[Custom Trip]') || b.notes?.includes('Custom Trip Request') || b.notes?.includes('Bespoke Custom')
                          ? 'custom trip'
                          : b.booking_type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#A3A3A3] text-xs max-w-xs truncate">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-white font-medium">{b.pickup_location || '—'}</span>
                        <span className="text-[10px] text-neutral-500">to</span>
                        <span>{b.dropoff_location || '—'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white font-bold text-xs">
                      ${parseFloat(b.total_fare).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={b.status} />
                    </td>
                  </tr>
                ))}
              </DataTable>
            )
          )}

          {activeTab === 'reviews' && (
            reviews.length === 0 ? (
              <div className="card border border-gold/15 bg-[#121212] p-8 text-center rounded-2xl">
                <p className="text-[#A3A3A3] text-sm">No reviews recorded.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map((r) => {
                  const reviewer = profile.role === 'driver' ? r.traveler : r.driver;
                  return (
                    <div key={r.booking_id} className="card border border-gold/10 hover:border-gold/25 bg-[#121212] p-5 rounded-2xl flex flex-col gap-3 shadow transition">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-neutral-900 border border-gold/15 flex items-center justify-center text-[10px] text-gold font-bold uppercase shrink-0">
                          {reviewer?.full_name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-grow flex flex-col">
                          <span className="text-xs font-bold text-white">{reviewer?.full_name || 'Anonymous'}</span>
                          <span className="text-[9px] text-[#A3A3A3]">{reviewer?.email}</span>
                        </div>
                        
                        {/* Rating stars */}
                        <div className="flex gap-0.5 text-gold shrink-0">
                          {[...Array(5)].map((_, i) => (
                            <svg 
                              key={i} 
                              xmlns="http://www.w3.org/2000/svg" 
                              viewBox="0 0 20 20" 
                              fill={i < r.rating ? 'currentColor' : 'none'} 
                              stroke="currentColor" 
                              strokeWidth={1.5} 
                              className="w-3.5 h-3.5"
                            >
                              <path d="M10.868 2.784c-.304-.793-1.432-.793-1.736 0l-1.83 4.774-5.14.747c-.855.124-1.2 1.179-.583 1.78l3.72 3.625-1.077 5.121c-.179.854.722 1.51 1.488 1.107L10 15.348l4.49 2.36c.767.403 1.667-.253 1.489-1.107l-1.078-5.12 3.72-3.626c.618-.602.272-1.657-.582-1.78l-5.143-.747-1.83-4.774z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      
                      <p className="text-[#A3A3A3] text-xs leading-relaxed italic bg-black/20 p-3 rounded-xl border border-neutral-900">
                        "{r.comment || 'No written feedback provided.'}"
                      </p>
                      
                      <div className="flex justify-between items-center text-[9px] text-neutral-500 font-mono mt-1">
                        <span>Booking: {r.booking_id.substring(0, 8)}...</span>
                        <span>{formatDate(r.created_at)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
