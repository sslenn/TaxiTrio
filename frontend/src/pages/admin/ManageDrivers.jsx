import { useState, useEffect } from 'react';
import { getDrivers, createDriver } from '../../service/adminService';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';

export default function ManageDrivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

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

  const filteredDrivers = drivers.filter((d) => 
    d.full_name?.toLowerCase().includes(search.toLowerCase()) || 
    d.email?.toLowerCase().includes(search.toLowerCase()) ||
    d.phone?.toLowerCase().includes(search.toLowerCase()) ||
    (d.plate_number && d.plate_number.toLowerCase().includes(search.toLowerCase())) ||
    (d.brand && `${d.brand} ${d.model}`.toLowerCase().includes(search.toLowerCase()))
  );

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
      getDrivers().then((r) => setDrivers(r.data.data));

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
    <div className="flex flex-col gap-6 relative">
      <PageHeader 
        title="Manage Drivers" 
        subtitle="Vetted driver roster, vehicles assignments, and live dispatch availability states"
      >
        <div className="flex items-center gap-3 shrink-0">
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
          <button
            onClick={() => {
              setModalError('');
              setModalSuccess('');
              setForm({ name: '', email: '', phone: '', license_number: '' });
              setShowModal(true);
            }}
            className="bg-[#D4AF37] hover:bg-[#E3C45A] text-black font-sans font-bold text-xs tracking-wider uppercase px-4 py-2.5 rounded-full shadow-lg shadow-gold/10 hover:shadow-gold/25 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] flex items-center gap-1.5 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Driver
          </button>
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
        <DataTable headers={['Name', 'Email', 'Phone', 'License No', 'Plate No', 'Vehicle Assigned', 'Status']}>
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
              <td className="px-6 py-4 text-[#A3A3A3] font-mono">{d.license_number || '—'}</td>
              <td className="px-6 py-4 text-white font-mono">{d.plate_number || '—'}</td>
              <td className="px-6 py-4 text-white font-serif">{d.brand ? `${d.brand} ${d.model}` : '—'}</td>
              <td className="px-6 py-4">
                <StatusBadge status={d.status === 'active' ? 'active' : d.status === 'pending_activation' ? 'pending' : 'inactive'} />
              </td>
            </tr>
          ))}
        </DataTable>
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
                className="text-[#9CA3AF] hover:text-white transition duration-200 p-1"
                aria-label="Close modal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {modalError && (
              <p className="text-red-400 text-xs text-center bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl">
                {modalError}
              </p>
            )}

            {modalSuccess && (
              <div className="flex flex-col gap-3 text-center py-4 select-none">
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
                    className="w-full bg-[#050505] border border-[#2A2A2A] text-white rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/15 transition-all"
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
                    className="w-full bg-[#050505] border border-[#2A2A2A] text-white rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/15 transition-all"
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
                    className="w-full bg-[#050505] border border-[#2A2A2A] text-white rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/15 transition-all"
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
                    className="w-full bg-[#050505] border border-[#2A2A2A] text-white rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/15 transition-all"
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
