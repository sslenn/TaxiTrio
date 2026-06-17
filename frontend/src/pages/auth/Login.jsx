import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { login } from '../../service/authService';
import { setToken, setUser } from '../../utils/auth';
import GoldButton from '../../components/GoldButton';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect');
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await login(form);
      setToken(data.data.token);
      setUser(data.data.user);
      const role = data.data.user.role;
      if (role === 'traveler' && redirectPath) {
        navigate(redirectPath);
      } else {
        navigate(role === 'admin' ? '/admin' : role === 'driver' ? '/driver' : '/traveler');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020202] px-4 font-sans select-none">
      <div className="card w-full max-w-md border border-gold/15 bg-[#121212] p-8 rounded-3xl flex flex-col gap-6 shadow-[0_0_80px_-20px_rgba(168,85,247,0.15)] relative overflow-hidden">
        <div className="absolute -right-24 -top-24 w-48 h-48 rounded-full bg-gold/5 blur-3xl"></div>
        
        <div className="text-center">
          <h1 
            onClick={() => navigate('/')}
            className="text-3xl font-bold text-gold font-serif tracking-widest cursor-pointer hover:opacity-90 transition mb-1"
          >
            TaxiTrio
          </h1>
          <p className="text-[#A3A3A3] text-xs font-semibold uppercase tracking-widest mt-1">Sign in to your account</p>
        </div>

        {error && <p className="text-red-400 text-xs text-center bg-rose-500/10 border border-rose-500/20 p-3.5 rounded-xl">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Email Address</label>
            <input 
              className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-gold/60 transition duration-300" 
              type="email" 
              placeholder="name@example.com"
              required
              value={form.email} 
              onChange={(e) => setForm({ ...form, email: e.target.value })} 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Password</label>
            <input 
              className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-gold/60 transition duration-300" 
              type="password" 
              placeholder="••••••••"
              required
              value={form.password} 
              onChange={(e) => setForm({ ...form, password: e.target.value })} 
            />
          </div>

          <GoldButton type="submit" disabled={loading} className="w-full py-3.5 mt-2">
            {loading ? 'Signing in...' : 'Sign In'}
          </GoldButton>
        </form>

        <p className="text-[#A3A3A3] text-xs mt-2 text-center">
          No account?{' '}
          <Link to="/register" className="text-gold font-bold hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
