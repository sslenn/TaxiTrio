import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../service/authService';
import GoldButton from '../../components/GoldButton';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
          {field('password', '••••••••', 'password', 'Password')}
          
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
