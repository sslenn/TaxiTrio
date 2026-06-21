import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { forgotPassword } from '../../service/authService';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request password reset. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#050505] px-4 font-sans select-none overflow-hidden relative">
      {/* Background Accent Gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gold/5 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-gold/5 blur-3xl pointer-events-none"></div>
      
      {/* Main Auth Card Container */}
      <div 
        className={`w-full max-w-[480px] border border-[#2A2A2A] hover:border-gold/20 bg-[#0b0b0b]/90 backdrop-blur-md p-8 md:p-10 rounded-3xl flex flex-col gap-6 shadow-[0_12px_40px_rgba(0,0,0,0.6)] relative overflow-hidden transition-all duration-700 ease-out transform ${
          isLoaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
        }`}
        role="main"
      >
        {/* Subtle Decorative Golden Border Glow line */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-gold/40 to-transparent"></div>

        {/* Brand Header */}
        <div className="text-center flex flex-col items-center gap-1.5 relative z-10">
          <h1 
            onClick={() => navigate('/')}
            className="text-3xl md:text-4xl font-normal text-gold font-serif tracking-widest cursor-pointer hover:text-white transition duration-300 mb-1 active:scale-[0.98]"
            title="TaxiTrio Home"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
          >
            TaxiTrio
          </h1>
          <p className="text-[#9CA3AF] text-[10px] md:text-xs font-semibold uppercase tracking-widest mt-0.5">
            Reset Your Password
          </p>
        </div>

        {error && (
          <p className="text-red-400 text-xs text-center bg-rose-500/10 border border-rose-500/20 p-3.5 rounded-xl">
            {error}
          </p>
        )}

        {success ? (
          <div className="flex flex-col gap-5 text-center relative z-10">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-white text-sm font-semibold">Check your email</p>
              <p className="text-[#9CA3AF] text-xs leading-relaxed font-light">
                If an account is associated with <span className="text-white font-medium">{email}</span>, you will receive a secure password reset link shortly.
              </p>
            </div>
            <Link 
              to="/login"
              className="mt-2 w-full text-center bg-[#D4AF37] hover:bg-[#E3C45A] text-black font-serif font-bold uppercase tracking-wider py-3.5 rounded-xl shadow-lg shadow-gold/10 hover:shadow-gold/25 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] text-xs"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10">
            <p className="text-xs text-[#9CA3AF] leading-relaxed font-light mb-1">
              Enter the email address registered with your TaxiTrio account. We will send a secure link to reset your credentials.
            </p>

            {/* Email Address Input */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">
                Email Address
              </label>
              <input 
                id="email"
                className="w-full bg-[#050505] border border-[#2A2A2A] text-white rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-300 placeholder-neutral-600 font-medium" 
                type="email" 
                placeholder="name@example.com"
                required
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                aria-required="true"
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-[#D4AF37] hover:bg-[#E3C45A] text-black font-serif font-bold uppercase tracking-wider py-4 rounded-xl shadow-lg shadow-gold/10 hover:shadow-gold/25 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed text-xs flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                  <span>Sending Link...</span>
                </>
              ) : (
                <span>SEND RESET LINK</span>
              )}
            </button>

            <Link 
              to="/login"
              className="w-full text-center text-[#9CA3AF] hover:text-white transition-colors duration-300 text-xs font-bold uppercase tracking-wider mt-1.5 py-1 hover:underline"
            >
              Back to Login
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
