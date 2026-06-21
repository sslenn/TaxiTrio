import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { resetPassword } from '../../service/authService';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    if (!token || !email) {
      setError('Invalid or incomplete password reset link.');
    }
  }, [token, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await resetPassword({ email, token, new_password: password });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. The link may have expired.');
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
            Create New Password
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
              <p className="text-white text-sm font-semibold">Password Reset Successful</p>
              <p className="text-[#9CA3AF] text-xs leading-relaxed font-light">
                Your credentials have been securely updated. You can now sign in using your new password.
              </p>
            </div>
            <Link 
              to="/login"
              className="mt-2 w-full text-center bg-[#D4AF37] hover:bg-[#E3C45A] text-black font-serif font-bold uppercase tracking-wider py-3.5 rounded-xl shadow-lg shadow-gold/10 hover:shadow-gold/25 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] text-xs"
            >
              Go to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10">
            <p className="text-xs text-[#9CA3AF] leading-relaxed font-light mb-1">
              Set a strong, secure password for <span className="text-white font-medium">{email}</span>. Minimum 6 characters.
            </p>

            {/* Password Input */}
            <div className="flex flex-col gap-1.5 relative">
              <label htmlFor="new-password" className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">
                New Password
              </label>
              <div className="relative">
                <input 
                  id="new-password"
                  className="w-full bg-[#050505] border border-[#2A2A2A] text-white rounded-xl pl-4 pr-11 py-3.5 text-sm focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-300 placeholder-neutral-600 font-medium" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  required
                  disabled={!token || !email}
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  aria-required="true"
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

            {/* Confirm Password Input */}
            <div className="flex flex-col gap-1.5 relative">
              <label htmlFor="confirm-password" className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">
                Confirm Password
              </label>
              <div className="relative">
                <input 
                  id="confirm-password"
                  className="w-full bg-[#050505] border border-[#2A2A2A] text-white rounded-xl pl-4 pr-11 py-3.5 text-sm focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-300 placeholder-neutral-600 font-medium" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  required
                  disabled={!token || !email}
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  aria-required="true"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading || !token || !email} 
              className="w-full bg-[#D4AF37] hover:bg-[#E3C45A] text-black font-serif font-bold uppercase tracking-wider py-4 rounded-xl shadow-lg shadow-gold/10 hover:shadow-gold/25 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed text-xs flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                  <span>Updating Password...</span>
                </>
              ) : (
                <span>SAVE NEW PASSWORD</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
