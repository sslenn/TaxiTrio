import { useState, useEffect } from 'react';
import { getMe } from '../../service/authService';
import api from '../../lib/axios';
import { setUser } from '../../utils/auth';
import PageHeader from '../../components/PageHeader';
import GoldButton from '../../components/GoldButton';

export default function Profile() {
  const [form, setForm] = useState({ full_name: '', phone: '', email: '' });
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [msg, setMsg] = useState({ text: '', ok: true });
  const [loading, setLoading] = useState(false);

  const loadProfile = () => {
    getMe().then((r) => {
      const u = r.data.data;
      setForm({ full_name: u.full_name || '', phone: u.phone || '', email: u.email || '' });
      setAvatarUrl(u.avatar_url || '');
    }).catch(() => {});
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: '', ok: true });
    
    const fd = new FormData();
    fd.append('full_name', form.full_name);
    fd.append('phone', form.phone);
    if (avatarFile) {
      fd.append('avatar', avatarFile);
    }

    try {
      const { data } = await api.patch('/profile', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUser(data.data);
      setMsg({ text: 'Profile updated successfully.', ok: true });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Update failed.', ok: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto flex flex-col gap-6">
      <PageHeader 
        title="My Profile" 
        subtitle="Manage your account profile and authentication details"
      />
      
      {msg.text && (
        <p className={`text-sm p-3.5 rounded-xl border text-center font-semibold uppercase tracking-wider ${
          msg.ok ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
        }`}>
          {msg.text}
        </p>
      )}

      <form onSubmit={handleSubmit} className="card border border-gold/15 bg-[#121212] p-6 flex flex-col items-center gap-6 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="absolute -right-24 -top-24 w-48 h-48 rounded-full bg-gold/5 blur-3xl"></div>
        
        {/* Avatar Uploader Section */}
        <div className="relative group cursor-pointer w-24 h-24 rounded-full border border-gold/25 overflow-hidden shadow-lg bg-[#0B0B0B] flex items-center justify-center">
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
          ) : avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="text-gold font-bold text-2xl font-serif">
              {form.full_name?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}

          {/* Edit Hover Overlay */}
          <label className="absolute inset-0 bg-black/75 flex items-center justify-center text-white text-[9px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer">
            Edit Photo
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>
        </div>

        <div className="w-full flex flex-col gap-4 text-left relative z-10">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Email Address (Read-only)</label>
            <input 
              className="w-full bg-[#0B0B0B] border border-neutral-900 text-[#555] cursor-not-allowed rounded-xl px-4 py-3 text-sm focus:outline-none" 
              value={form.email} 
              readOnly 
              disabled 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Full Name</label>
            <input 
              className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/60 transition duration-300" 
              placeholder="Full name" 
              required
              value={form.full_name} 
              onChange={(e) => setForm({ ...form, full_name: e.target.value })} 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Phone Number</label>
            <input 
              className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/60 transition duration-300" 
              placeholder="Phone number" 
              required
              value={form.phone} 
              onChange={(e) => setForm({ ...form, phone: e.target.value })} 
            />
          </div>
        </div>

        <GoldButton type="submit" disabled={loading} className="w-full py-3">
          {loading ? 'Saving Changes...' : 'Save Changes'}
        </GoldButton>
      </form>
    </div>
  );
}
