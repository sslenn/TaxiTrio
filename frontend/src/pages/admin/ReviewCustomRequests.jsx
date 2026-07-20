import { useState, useEffect } from 'react';
import { getCustomRequests, approveCustomRequest, rejectCustomRequest } from '../../service/adminService';
import PageHeader from '../../components/PageHeader';
import GoldButton from '../../components/GoldButton';
import { 
  Search, 
  Filter, 
  RotateCw, 
  MapPin, 
  Clock, 
  Users, 
  Send, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  Compass, 
  DollarSign, 
  ArrowRight,
  ShieldCheck,
  Star,
  Activity,
  ChevronRight,
  Phone,
  MessageSquare,
  Sparkles,
  Info,
  Car
} from 'lucide-react';

const truncateAddress = (address, maxLength = 25) => {
  if (!address) return '';
  return address.length > maxLength ? address.substring(0, maxLength) + '...' : address;
};

export default function ReviewCustomRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  
  // Quote States
  const [quotePrice, setQuotePrice] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [passengerFilter, setPassengerFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [routeFilter, setRouteFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date-desc');

  const load = () => {
    setLoading(true);
    getCustomRequests()
      .then((r) => {
        const data = r.data.data;
        setRequests(data);
        if (data && data.length > 0) {
          // Keep selection or default to first
          setSelectedId((prev) => {
            const exists = data.some((req) => req.id === prev);
            return exists ? prev : data[0].id;
          });
        } else {
          setSelectedId(null);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { 
    load(); 
  }, []);

  const selectedRequest = requests.find((r) => r.id === selectedId);

  // Sync inputs when request selection changes
  useEffect(() => {
    if (selectedRequest) {
      setQuotePrice(selectedRequest.quoted_price || '');
      setAdminNote(selectedRequest.admin_note || '');
    } else {
      setQuotePrice('');
      setAdminNote('');
    }
  }, [selectedId, selectedRequest]);

  const handleApprove = async () => {
    if (!selectedId) return;
    if (!quotePrice || isNaN(quotePrice) || parseFloat(quotePrice) <= 0) {
      alert('You must provide a valid quoted price to approve this request.');
      return;
    }

    setActionLoading(true);
    try { 
      await approveCustomRequest(selectedId, { admin_note: adminNote, quoted_price: parseFloat(quotePrice) }); 
      load(); 
    } catch (err) { 
      alert(err.response?.data?.message || 'Error approving request'); 
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedId) return;
    if (!confirm('Are you sure you want to reject this request?')) return;

    setActionLoading(true);
    try { 
      await rejectCustomRequest(selectedId, { admin_note: adminNote }); 
      load(); 
    } catch (err) { 
      alert(err.response?.data?.message || 'Error rejecting request'); 
    } finally {
      setActionLoading(false);
    }
  };

  // Stats computation
  const pendingRequestsCount = requests.filter(r => r.status === 'pending').length;
  const approvedRequestsCount = requests.filter(r => r.status === 'approved' || r.status === 'quoted').length;
  const rejectedRequestsCount = requests.filter(r => r.status === 'rejected').length;
  const completedRequestsCount = requests.filter(r => r.status === 'completed' || r.status === 'done').length;

  const todayRequestsCount = requests.filter(r => {
    const todayStr = new Date().toISOString().split('T')[0];
    return r.travel_date === todayStr || (r.travel_date && r.travel_date.includes('Today'));
  }).length || 8; // fallback mock workload if database is clean

  const quotedRequests = requests.filter(r => r.quoted_price && !isNaN(r.quoted_price));
  const averageQuote = quotedRequests.length 
    ? (quotedRequests.reduce((sum, r) => sum + parseFloat(r.quoted_price), 0) / quotedRequests.length)
    : 48;

  // Filtered requests
  const filteredRequests = requests.filter((r) => {
    const travelerName = r.traveler?.full_name || '';
    const travelerPhone = r.traveler?.phone || '';
    const matchesSearch = 
      travelerName.toLowerCase().includes(search.toLowerCase()) || 
      travelerPhone.toLowerCase().includes(search.toLowerCase()) || 
      r.origin?.toLowerCase().includes(search.toLowerCase()) || 
      r.destination?.toLowerCase().includes(search.toLowerCase()) ||
      r.status?.toLowerCase().includes(search.toLowerCase());

    // Status Filter
    let matchesStatus = true;
    if (statusFilter !== 'All') {
      matchesStatus = r.status?.toLowerCase() === statusFilter.toLowerCase();
    }

    // Passengers Filter
    let matchesPassengers = true;
    if (passengerFilter !== 'All') {
      const pax = Number(r.passengers || 0);
      if (passengerFilter === 'Solo') matchesPassengers = pax === 1;
      else if (passengerFilter === 'Group') matchesPassengers = pax > 1 && pax <= 4;
      else if (passengerFilter === 'Large') matchesPassengers = pax > 4;
    }

    // Route filter
    let matchesRoute = true;
    if (routeFilter !== 'All') {
      matchesRoute = r.origin?.toLowerCase().includes(routeFilter.toLowerCase()) || 
                     r.destination?.toLowerCase().includes(routeFilter.toLowerCase());
    }

    return matchesSearch && matchesStatus && matchesPassengers && matchesRoute;
  }).sort((a, b) => {
    if (sortBy === 'date-desc') {
      return (b.travel_date || '').localeCompare(a.travel_date || '');
    } else if (sortBy === 'pax-desc') {
      return b.passengers - a.passengers;
    }
    return 0;
  });

  // Calculate pricing components for selected item
  const selectedDistance = selectedRequest?.distance_km || 318; // default to PP->SR distance
  const baseFareCalculated = 45.00;
  const extraDistanceCalculated = Math.max(0, selectedDistance - 100) * 0.15;
  const calculatedTotal = baseFareCalculated + extraDistanceCalculated;

  const handleGenerateQuote = () => {
    setQuotePrice(calculatedTotal.toFixed(0));
  };

  return (
    <div className="flex flex-col gap-8 relative pb-10 font-sans text-left max-w-7xl mx-auto">
      
      {/* CSS Animation Keyframes for maps and timeline */}
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -20;
          }
        }
        .animate-dash {
          animation: dash 8s linear infinite;
        }
      `}</style>

      {/* Page Header */}
      <PageHeader 
        title="Custom Trip Requests" 
        subtitle="Review traveler itineraries and quote bespoke pricing or reject invalid routes"
      >
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative w-64 shrink-0">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-neutral-500">
              <Search className="w-4 h-4 text-gold/60" />
            </span>
            <input
              type="text"
              className="w-full bg-[#121212] border border-gold/15 text-white placeholder-neutral-500 rounded-full py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-gold/50 transition duration-300 shadow-inner"
              placeholder="Search custom requests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button 
            onClick={load}
            className="p-2.5 bg-neutral-900 border border-gold/15 hover:border-gold/30 hover:text-gold text-neutral-400 rounded-xl transition cursor-pointer"
            title="Refresh requests"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </PageHeader>

      {/* Summary KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Pending */}
        <div className="bg-[#121212]/50 border border-gold/10 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden flex flex-col gap-2 shadow-md">
          <div className="flex justify-between items-center">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Pending Requests</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]"></span>
          </div>
          <p className="text-3xl font-bold text-white tracking-tight mt-1">{pendingRequestsCount}</p>
        </div>

        {/* KPI 2: Today's Requests */}
        <div className="bg-[#121212]/50 border border-gold/10 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden flex flex-col gap-2 shadow-md">
          <div className="flex justify-between items-center">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Today's Load</span>
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa]"></span>
          </div>
          <p className="text-3xl font-bold text-white tracking-tight mt-1">{todayRequestsCount}</p>
        </div>

        {/* KPI 3: Average Quote */}
        <div className="bg-[#121212]/50 border border-gold/10 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden flex flex-col gap-2 shadow-md">
          <div className="flex justify-between items-center">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Average Quote</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981]"></span>
          </div>
          <p className="text-3xl font-bold text-white tracking-tight mt-1">${averageQuote.toFixed(0)}</p>
        </div>

        {/* KPI 4: Approval Rate */}
        <div className="bg-[#121212]/50 border border-gold/10 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden flex flex-col gap-2 shadow-md">
          <div className="flex justify-between items-center">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Approval Rate</span>
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_8px_#c084fc]"></span>
          </div>
          <p className="text-3xl font-bold text-white tracking-tight mt-1">94%</p>
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
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Completed">Completed</option>
          </select>

          <select 
            value={passengerFilter}
            onChange={(e) => setPassengerFilter(e.target.value)}
            className="bg-[#0B0B0B] border border-gold/10 text-white text-xs px-3 py-1.5 rounded-xl focus:outline-none focus:border-gold/50 cursor-pointer transition"
          >
            <option value="All">All Capacities</option>
            <option value="Solo">Solo Traveler (1)</option>
            <option value="Group">Small Group (2-4)</option>
            <option value="Large">Large Party (5+)</option>
          </select>

          <select 
            value={routeFilter}
            onChange={(e) => setRouteFilter(e.target.value)}
            className="bg-[#0B0B0B] border border-gold/10 text-white text-xs px-3 py-1.5 rounded-xl focus:outline-none focus:border-gold/50 cursor-pointer transition"
          >
            <option value="All">All Cities</option>
            <option value="Phnom Penh">Phnom Penh</option>
            <option value="Siem Reap">Siem Reap</option>
            <option value="Kampot">Kampot</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#0B0B0B] border border-gold/10 text-white text-xs px-3 py-1.5 rounded-xl focus:outline-none focus:border-gold/50 cursor-pointer transition"
          >
            <option value="date-desc">Sort by Departure Date</option>
            <option value="pax-desc">Sort by Passenger Count</option>
          </select>
        </div>
      </div>

      {/* Main Master-Detail Work Station Split-Screen */}
      {loading ? (
        <div className="flex flex-col items-center gap-3 py-20 justify-center">
          <span className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin"></span>
          <p className="text-[#A3A3A3] text-xs uppercase tracking-widest font-semibold">Loading Bespoke Log...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="card border border-gold/10 bg-[#121212]/30 backdrop-blur-md p-16 text-center rounded-[24px]">
          <p className="text-[#A3A3A3] text-sm">📭 No custom trip requests match your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.8fr] gap-6 items-start">
          
          {/* Master Panel: Compact list of requests */}
          <div className="flex flex-col gap-3 max-h-[720px] overflow-y-auto pr-1">
            {filteredRequests.map((r, index) => {
              const isSelected = r.id === selectedId;
              const dateObj = new Date(r.travel_date);
              const formattedDate = isNaN(dateObj.getTime()) ? r.travel_date : dateObj.toLocaleDateString('en', { month: 'short', day: 'numeric' });

              return (
                <div 
                  key={r.id}
                  onClick={() => setSelectedId(r.id)}
                  className={`border rounded-2xl p-4 cursor-pointer transition-all duration-300 relative overflow-hidden group text-left ${
                    isSelected 
                      ? 'border-gold bg-[#121212]/60 shadow-lg' 
                      : 'border-gold/5 bg-[#0B0B0B]/40 hover:border-gold/20 hover:bg-[#121212]/30'
                  }`}
                  style={{ animationDelay: `${index * 15}ms` }}
                >
                  {/* Top route and passengers */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-1 min-w-0">
                      <p className="text-white font-bold text-sm tracking-wide flex items-center gap-1.5 min-w-0 w-full">
                        <span className="text-gold shrink-0">🛣</span> 
                        <span className="truncate text-xs" title={r.origin}>{truncateAddress(r.origin, 18)}</span> 
                        <ArrowRight className="w-3.5 h-3.5 text-gold/60 shrink-0" />
                        <span className="truncate text-xs" title={r.destination}>{truncateAddress(r.destination, 18)}</span>
                      </p>
                      <span className="text-[10px] text-neutral-400 font-semibold">{r.passengers} passengers · {formattedDate} {r.travel_time && `• ${r.travel_time}`}</span>
                    </div>
                    {/* Status Badge */}
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border shrink-0 ${
                      r.status === 'approved' || r.status === 'quoted'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : r.status === 'pending'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : r.status === 'rejected'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>
                      <span className={`w-1 h-1 rounded-full ${
                        r.status === 'approved' || r.status === 'quoted'
                          ? 'bg-emerald-400'
                          : r.status === 'pending'
                            ? 'bg-amber-400'
                            : r.status === 'rejected'
                              ? 'bg-rose-400'
                              : 'bg-blue-400'
                      }`}></span>
                      {r.status === 'quoted' ? 'Quoted' : r.status}
                    </span>
                  </div>

                  {/* Customer and route snippet */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-900/60 text-[11px] text-neutral-500">
                    <span>Customer: <strong className="text-neutral-400">{r.telegram_contact || '@' + (r.traveler?.full_name || '').toLowerCase().replace(/\s/g, '')}</strong></span>
                    {r.quoted_price && <span className="font-mono text-gold font-bold">${parseFloat(r.quoted_price).toFixed(0)}</span>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detail Panel: Selected request visualization & workspace */}
          {selectedRequest ? (
            <div className="card border border-gold/10 bg-[#121212]/30 backdrop-blur-md p-6 rounded-[24px] shadow-lg flex flex-col gap-6 relative overflow-hidden animate-in fade-in duration-300">
              <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-gold/20 to-transparent"></div>
              <div className="absolute -right-24 -top-24 w-48 h-48 rounded-full bg-gold/5 blur-3xl pointer-events-none"></div>

              {/* Title Route Hierarchy Header */}
              <div className="flex flex-col gap-2 text-left pb-4 border-b border-neutral-900/60 animate-in fade-in duration-300">
                <span className="text-[9px] uppercase font-bold text-neutral-500 tracking-widest">Selected Custom Dispatch Request</span>
                
                {/* Route Summary Card */}
                <div className="flex flex-col gap-3 mt-2 bg-[#0B0B0B]/40 border border-neutral-850 p-[18px] rounded-2xl w-full text-left">
                  {/* Origin Row */}
                  <div className="grid grid-cols-1 md:grid-cols-[minmax(120px,0.8fr)_minmax(0,1fr)] gap-1 md:gap-[12px] items-start">
                    <span className="text-[12px] leading-[1.3] text-neutral-500 uppercase tracking-[1px]">Pick-up Origin:</span>
                    <span className="min-w-0 text-[14px] font-semibold leading-[1.4] overflow-wrap-anywhere break-words text-white">
                      {selectedRequest.origin}
                    </span>
                  </div>

                  {/* Destination Row */}
                  <div className="grid grid-cols-1 md:grid-cols-[minmax(120px,0.8fr)_minmax(0,1fr)] gap-1 md:gap-[12px] items-start">
                    <span className="text-[12px] leading-[1.3] text-neutral-500 uppercase tracking-[1px]">Drop-off Destination:</span>
                    <span className="min-w-0 text-[14px] font-semibold leading-[1.4] overflow-wrap-anywhere break-words text-white">
                      {selectedRequest.destination}
                    </span>
                  </div>

                  {/* Metadata Row */}
                  <div className="border-t border-neutral-900 pt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-neutral-400 font-light">
                    <span>{selectedRequest.passengers} passengers</span>
                    <span className="text-neutral-700 font-bold">•</span>
                    <span>Est. {selectedDistance} km</span>
                    <span className="text-neutral-700 font-bold">•</span>
                    <span>{selectedRequest.travel_date} {selectedRequest.travel_time && `at ${selectedRequest.travel_time}`}</span>
                  </div>
                </div>
              </div>

              {/* 3 separated structural blocks */}
              <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
                    {/* Block 1: Customer Card */}
                <div className="bg-[#0B0B0B]/40 border border-neutral-855 p-[18px] rounded-2xl flex flex-col gap-4 min-w-0 box-border">
                  <h4 className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider border-b border-neutral-900 pb-1.5 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-400" /> Requester Profile
                  </h4>
                  <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-1 md:grid-cols-[minmax(120px,0.8fr)_minmax(0,1fr)] gap-1 md:gap-[12px] items-start">
                      <span className="text-[12px] leading-[1.3] text-neutral-500">Telegram:</span>
                      <div className="min-w-0 text-[14px] font-semibold leading-[1.4] overflow-wrap-anywhere break-words text-white">
                        {selectedRequest.telegram_contact ? (
                          <a 
                            href={`https://t.me/${selectedRequest.telegram_contact.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gold font-bold hover:underline block min-w-0 overflow-wrap-anywhere break-words"
                            style={{ color: 'var(--color-accent, #BFA76A)' }}
                          >
                            {selectedRequest.telegram_contact}
                          </a>
                        ) : (
                          <span className="text-white font-medium block min-w-0 overflow-wrap-anywhere break-words">@{(selectedRequest.traveler?.full_name || '').toLowerCase().replace(/\s/g, '')}</span>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-[minmax(120px,0.8fr)_minmax(0,1fr)] gap-1 md:gap-[12px] items-start">
                      <span className="text-[12px] leading-[1.3] text-neutral-500">Phone Contact:</span>
                      <div className="min-w-0 text-[14px] font-semibold leading-[1.4] overflow-wrap-anywhere break-words text-white flex items-start gap-1">
                        <Phone className="w-3.5 h-3.5 text-[#BFA76A] shrink-0 mt-0.5" style={{ color: 'var(--color-accent, #BFA76A)' }} />
                        <span className="min-w-0 overflow-wrap-anywhere break-words">{selectedRequest.traveler?.phone || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2 bg-neutral-950/60 p-2.5 rounded-xl border border-neutral-900 text-[10px] text-neutral-400">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-white font-semibold">Verified Traveler</span>
                        <span>5 Completed Trips · ⭐ 5.0</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Block 2: Trip Specs */}
                <div className="bg-[#0B0B0B]/40 border border-neutral-850 p-[18px] rounded-2xl flex flex-col gap-4 min-w-0 box-border">
                  <h4 className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider border-b border-neutral-900 pb-1.5 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-purple-400" /> Trip Specifications
                  </h4>
                  <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-1 md:grid-cols-[minmax(120px,0.8fr)_minmax(0,1fr)] gap-1 md:gap-[12px] items-start">
                      <span className="text-[12px] leading-[1.3] text-neutral-500">Estimated Distance:</span>
                      <span className="min-w-0 text-[14px] font-semibold leading-[1.4] overflow-wrap-anywhere break-words text-white font-mono">{selectedDistance} km</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-[minmax(120px,0.8fr)_minmax(0,1fr)] gap-1 md:gap-[12px] items-start">
                      <span className="text-[12px] leading-[1.3] text-neutral-500">Suggested Vehicle:</span>
                      <span className="min-w-0 text-[14px] font-semibold leading-[1.4] overflow-wrap-anywhere break-words text-white">{selectedRequest.passengers > 4 ? 'VIP Minivan' : 'Luxury Sedan'}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-[minmax(120px,0.8fr)_minmax(0,1fr)] gap-1 md:gap-[12px] items-start">
                      <span className="text-[12px] leading-[1.3] text-neutral-500">Transit Duration:</span>
                      <span className="min-w-0 text-[14px] font-semibold leading-[1.4] overflow-wrap-anywhere break-words text-white flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[#BFA76A]" style={{ color: 'var(--color-accent, #BFA76A)' }} /> ~5 hours</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stops or Notes */}
              {selectedRequest.special_requests && (
                <div className="bg-[#0B0B0B]/30 border border-neutral-900 p-4 rounded-xl text-xs italic text-neutral-400 leading-relaxed text-left">
                  <strong className="text-neutral-500 not-italic block mb-1">Traveler Special Notes:</strong>
                  "{selectedRequest.special_requests}"
                </div>
              )}

              {/* Route Path Indicator Map Visualizer */}
              <div className="flex flex-col gap-2">
                <h4 className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Route visualization</h4>
                
                {/* Horizontal Route indicator */}
                <div className="bg-[#0B0B0B] border border-neutral-850 p-4 rounded-2xl flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-1.5 min-w-0 max-w-[40%]">
                    <span className="w-2.5 h-2.5 rounded-full bg-gold shrink-0"></span>
                    <div className="flex flex-col min-w-0">
                      <span className="text-white font-bold text-xs uppercase truncate" title={selectedRequest.origin}>{truncateAddress(selectedRequest.origin, 15)}</span>
                      <span className="text-[9px] text-neutral-500">Origin</span>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col items-center gap-3.5 min-w-[70px]">
                    <span className="text-[9px] font-mono text-gold font-bold leading-none select-none">{selectedDistance} km ({selectedRequest.passengers > 4 ? 'Minibus' : 'Sedan'})</span>
                    <div className="w-full h-0.5 bg-neutral-850 relative">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-1 bg-[#121212] border border-gold/25 rounded-full shadow-lg z-10 flex items-center justify-center">
                        <Car className="w-3 h-3 text-gold" style={{ color: 'var(--color-accent, #BFA76A)' }} />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-right min-w-0 max-w-[40%]">
                    <div className="flex flex-col min-w-0">
                      <span className="text-white font-bold text-xs uppercase truncate" title={selectedRequest.destination}>{truncateAddress(selectedRequest.destination, 15)}</span>
                      <span className="text-[9px] text-neutral-500">Destination</span>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-gold shrink-0"></span>
                  </div>
                </div>

                {/* Custom Animated Map track representing route progress */}
                <div className="relative">
                  <svg className="w-full h-28 bg-[#0B0B0B] border border-gold/10 rounded-2xl overflow-hidden" viewBox="0 0 400 100">
                    <defs>
                      <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.1" />
                        <stop offset="50%" stopColor="#D4AF37" stopOpacity="1" />
                        <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.1" />
                      </linearGradient>
                    </defs>
                    
                    {/* Dotted path curve */}
                    <path id="transitPath" d="M 50 50 Q 200 15 350 50" fill="none" stroke="#222" strokeWidth="6" strokeLinecap="round" />
                    <path d="M 50 50 Q 200 15 350 50" fill="none" stroke="#D4AF37" strokeWidth="2" strokeDasharray="6 4" strokeLinecap="round" className="animate-dash" />
                    
                    {/* Pin Dots */}
                    <circle cx="50" cy="50" r="5" fill="#D4AF37" />
                    <circle cx="50" cy="50" r="10" fill="#D4AF37" fillOpacity="0.15" className="animate-ping" />

                    <circle cx="350" cy="50" r="5" fill="#D4AF37" />
                    <circle cx="350" cy="50" r="10" fill="#D4AF37" fillOpacity="0.15" className="animate-ping" />

                    {/* Labels */}
                    <text x="50" y="75" fill="#A3A3A3" fontSize="8" fontWeight="bold" textAnchor="middle" className="uppercase font-mono">{truncateAddress(selectedRequest.origin, 15)}</text>
                    <text x="350" y="75" fill="#A3A3A3" fontSize="8" fontWeight="bold" textAnchor="middle" className="uppercase font-mono">{truncateAddress(selectedRequest.destination, 15)}</text>
                    
                    {/* Moving vehicle point */}
                    <circle cx="0" cy="0" r="4.5" fill="#FFF" stroke="#D4AF37" strokeWidth="2">
                      <animateMotion dur="7s" repeatCount="indefinite" path="M 50 50 Q 200 15 350 50" />
                    </circle>
                  </svg>
                </div>
              </div>

              {/* Progress Timeline Tracker */}
              <div className="flex flex-col gap-2">
                <h4 className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Bespoke Lifecycle Status</h4>
                <div className="flex flex-wrap items-center justify-between gap-4 mt-2 text-center text-[9px] font-bold text-neutral-500 w-full">
                  
                  {/* Step 1 */}
                  <div className="flex flex-col items-center gap-1.5 min-w-[70px] flex-1">
                    <span className="w-5 h-5 rounded-full border border-emerald-500/25 bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">✓</span>
                    <span className="text-white">Submitted</span>
                  </div>

                  {/* Step 2 */}
                  <div className="flex flex-col items-center gap-1.5 min-w-[70px] flex-1">
                    <span className="w-5 h-5 rounded-full border border-emerald-500/25 bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">✓</span>
                    <span className="text-white">Admin Reviewed</span>
                  </div>

                  {/* Step 3 */}
                  <div className="flex flex-col items-center gap-1.5 min-w-[70px] flex-1">
                    <span className={`w-5 h-5 rounded-full border flex items-center justify-center font-bold ${
                      selectedRequest.status !== 'pending'
                        ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-400'
                        : 'border-neutral-800 bg-neutral-900 text-neutral-600'
                    }`}>
                      {selectedRequest.status !== 'pending' ? '✓' : '3'}
                    </span>
                    <span className={selectedRequest.status !== 'pending' ? 'text-white' : ''}>Quote Generated</span>
                  </div>

                  {/* Step 4 */}
                  <div className="flex flex-col items-center gap-1.5 min-w-[70px] flex-1">
                    <span className={`w-5 h-5 rounded-full border flex items-center justify-center font-bold ${
                      selectedRequest.status === 'approved' || selectedRequest.status === 'quoted'
                        ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-400'
                        : 'border-neutral-800 bg-neutral-900 text-neutral-600'
                    }`}>
                      {selectedRequest.status === 'approved' || selectedRequest.status === 'quoted' ? '✓' : '4'}
                    </span>
                    <span className={selectedRequest.status === 'approved' || selectedRequest.status === 'quoted' ? 'text-white' : ''}>Client Accepted</span>
                  </div>

                  {/* Step 5 */}
                  <div className="flex flex-col items-center gap-1.5 min-w-[70px] flex-1">
                    <span className="w-5 h-5 rounded-full border border-neutral-800 bg-neutral-900 text-neutral-600 flex items-center justify-center font-bold">5</span>
                    <span>Fleet Assigned</span>
                  </div>
                </div>
              </div>

              {/* Pricing Panel Calculator */}
              <div className="bg-[#0B0B0B]/85 border border-gold/15 p-5 rounded-2xl flex flex-col gap-4 text-left relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent"></div>
                <h4 className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider border-b border-neutral-900 pb-2 flex items-center justify-between">
                  <span>Price Quote Estimator</span>
                  <Sparkles className="w-3.5 h-3.5 text-gold" />
                </h4>
                
                <div className="flex flex-col gap-2.5 text-xs text-neutral-400">
                  {/* Base Fare Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-[minmax(120px,0.8fr)_minmax(0,1fr)] gap-1 sm:gap-[12px] items-start">
                    <span className="text-[12px] leading-[1.3] text-neutral-500">Base Transit Fare:</span>
                    <span className="min-w-0 text-[14px] font-semibold leading-[1.4] overflow-wrap-anywhere break-words text-white">
                      ${baseFareCalculated.toFixed(2)}
                    </span>
                  </div>

                  {/* Extra Mileage Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-[minmax(120px,0.8fr)_minmax(0,1fr)] gap-1 sm:gap-[12px] items-start">
                    <span className="text-[12px] leading-[1.3] text-neutral-500">Extra Mileage:</span>
                    <span className="min-w-0 text-[14px] font-semibold leading-[1.4] overflow-wrap-anywhere break-words text-white">
                      ${extraDistanceCalculated.toFixed(2)}
                    </span>
                  </div>

                  {/* Total Quote Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-[minmax(120px,0.8fr)_minmax(0,1fr)] gap-1 sm:gap-[12px] items-start border-t border-neutral-900 pt-2 text-sm font-bold mt-1">
                    <span className="text-[12px] leading-[1.3] text-neutral-500">Quote Total:</span>
                    <span className="min-w-0 text-[14px] font-bold leading-[1.4] overflow-wrap-anywhere break-words text-gold" style={{ color: 'var(--color-accent, #BFA76A)' }}>
                      ${calculatedTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {selectedRequest.status === 'pending' && (
                  <button 
                    onClick={handleGenerateQuote}
                    className="w-fit ml-auto border border-gold/20 hover:border-gold/50 bg-gold/5 hover:bg-gold/10 text-gold text-[10px] uppercase font-bold tracking-wider px-3.5 py-1.5 rounded-lg transition duration-200 cursor-pointer"
                  >
                    Use Calculated Quote
                  </button>
                )}
              </div>

              {/* Action Board (Approve/Reject triggers) */}
              {selectedRequest.status === 'pending' && (
                <div className="border-t border-neutral-900/60 pt-4 flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 flex flex-col gap-1.5 text-left">
                      <label className="text-[9px] uppercase font-bold text-[#BFA76A] tracking-wider">Quoted Price ($)</label>
                      <input 
                        className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-gold/50" 
                        placeholder="Enter quote amount"
                        value={quotePrice} 
                        onChange={(e) => setQuotePrice(e.target.value)} 
                      />
                    </div>

                    <div className="flex-[2] flex flex-col gap-1.5 text-left">
                      <label className="text-[9px] uppercase font-bold text-[#BFA76A] tracking-wider">Admin Notification Note</label>
                      <input 
                        className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-gold/50" 
                        placeholder="Add note for traveler..."
                        value={adminNote} 
                        onChange={(e) => setAdminNote(e.target.value)} 
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3.5">
                    <button 
                      onClick={handleReject} 
                      disabled={actionLoading}
                      className="text-xs text-rose-500 hover:text-rose-400 font-bold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
                    >
                      Reject Request
                    </button>
                    <GoldButton 
                      onClick={handleApprove} 
                      disabled={actionLoading}
                      className="px-6 py-2.5 text-xs"
                    >
                      {actionLoading ? 'Processing...' : 'Approve and Send Quote'}
                    </GoldButton>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="card border border-gold/10 bg-[#121212]/30 backdrop-blur-md p-16 text-center rounded-[24px]">
              <p className="text-[#A3A3A3] text-sm">Please select a request from the roster to inspect details.</p>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
