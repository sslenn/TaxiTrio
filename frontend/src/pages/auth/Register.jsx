import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../service/authService';
import GoldButton from '../../components/GoldButton';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const field = (key, placeholder, type = 'text', label) => (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">{label}</label>
      <input
        className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/60 transition duration-300"
        type={type}
        placeholder={placeholder}
        required={key !== 'phone'}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
      />
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020202] px-4 font-sans select-none py-10">
      <div className="card w-full max-w-md border border-gold/15 bg-[#121212] p-8 rounded-3xl flex flex-col gap-6 shadow-[0_0_80px_-20px_rgba(168,85,247,0.15)] relative overflow-hidden">
        <div className="absolute -right-24 -top-24 w-48 h-48 rounded-full bg-gold/5 blur-3xl"></div>
        
        <div className="text-center">
          <h1 
            onClick={() => navigate('/')}
            className="text-3xl font-bold text-gold font-serif tracking-widest cursor-pointer hover:opacity-90 transition mb-1"
          >
            TaxiTrio
          </h1>
          <p className="text-[#A3A3A3] text-xs font-semibold uppercase tracking-widest mt-1">Create your traveler account</p>
        </div>

        {error && <p className="text-red-400 text-xs text-center bg-rose-500/10 border border-rose-500/20 p-3.5 rounded-xl">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10">
          {field('full_name', 'Your full name', 'text', 'Full Name')}
          {field('email', 'name@example.com', 'email', 'Email Address')}
          {field('phone', 'Phone number', 'text', 'Phone Number (Optional)')}
          
          <div className="flex flex-col gap-1.5 w-full relative">
            <label htmlFor="password" className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Password</label>
            <div className="relative">
              <input
                id="password"
                className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl pl-4 pr-11 py-3 text-sm focus:outline-none focus:border-gold/60 transition duration-300 placeholder-neutral-600 font-medium"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition duration-200 focus:outline-none cursor-pointer p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.815 7.815L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          <GoldButton type="submit" disabled={loading} className="w-full py-3.5 mt-2">
            {loading ? 'Creating Account...' : 'Create Account'}
          </GoldButton>
        </form>

        <p className="text-[#A3A3A3] text-xs mt-2 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-gold font-bold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
