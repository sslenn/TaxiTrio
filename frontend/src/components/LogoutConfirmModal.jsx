import { useEffect } from 'react';
import { useTranslation } from '../context/LanguageContext';

export default function LogoutConfirmModal({ isOpen, onClose, onConfirm }) {
  const { t } = useTranslation();

  // Handle Escape key to close the modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-[#050505]/75 backdrop-blur-md transition-opacity duration-300 animate-fade-in"
      />

      {/* Modal card */}
      <div className="relative w-full max-w-md bg-[#121212]/95 border border-gold/20 rounded-2xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-lg z-10 overflow-hidden transform scale-95 opacity-0 animate-scale-up border-b-[3px] border-b-gold">
        
        {/* Glow effect in background */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col items-center text-center">
          {/* Warning Signout Icon Container with Pulsing Border */}
          <div className="relative mb-5 flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 text-red-500">
            <span className="absolute inset-0 rounded-full bg-red-500/10 animate-ping opacity-75" />
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth="2" 
              stroke="currentColor" 
              className="w-8 h-8 relative z-10"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
            </svg>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-2 tracking-wide font-serif">
            {t('logoutConfirmTitle')}
          </h3>

          {/* Description */}
          <p className="text-sm text-[#A3A3A3] mb-6 leading-relaxed px-2">
            {t('logoutConfirmMessage')}
          </p>

          {/* Action buttons */}
          <div className="flex items-center gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 px-5 py-3 rounded-xl border border-neutral-800 text-[#A3A3A3] hover:text-white hover:border-neutral-600 hover:bg-neutral-900/40 transition-all duration-300 tracking-wider text-xs uppercase font-semibold active:scale-[0.98]"
            >
              {t('cancelBtn')}
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white font-bold hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:from-red-500 hover:to-red-400 active:scale-[0.98] transition-all duration-300 tracking-wider text-xs uppercase"
            >
              {t('logout')}
            </button>
          </div>
        </div>

        {/* CSS Animations style tag to keep it self-contained */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes scaleUp {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          .animate-fade-in {
            animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .animate-scale-up {
            animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }
        `}} />
      </div>
    </div>
  );
}
