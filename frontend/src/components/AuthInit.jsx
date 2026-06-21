import { useEffect, useState } from 'react';
import api from '../lib/axios';
import { setToken, getUser, logout } from '../utils/auth';

export default function AuthInit({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const user = getUser();
      if (user) {
        try {
          // Attempt to refresh the access token on load
          const response = await api.post('/auth/refresh');
          const { accessToken } = response.data.data;
          setToken(accessToken);
        } catch (err) {
          console.error('Failed to initialize session:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#050505] text-gold select-none font-sans">
        <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-serif text-lg tracking-widest animate-pulse">TAXI TRIO</p>
        <p className="text-[#9CA3AF] text-xs mt-2">Restoring secure session...</p>
      </div>
    );
  }

  return children;
}
