import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../context/LanguageContext';

const hexToRgb = (hex) => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const fullHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '212, 175, 55';
};

const hexToRgbObj = (hex) => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const fullHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

const getLuminance = (r, g, b) => {
  return (r * 299 + g * 587 + b * 114) / 1000;
};

const getContrastColor = (hex) => {
  const rgb = hexToRgbObj(hex);
  if (!rgb) return hex;
  const yiq = getLuminance(rgb.r, rgb.g, rgb.b);
  if (yiq > 140) {
    // Darken it dynamically for readability on white backgrounds
    const factor = 0.55;
    const r = Math.round(rgb.r * factor);
    const g = Math.round(rgb.g * factor);
    const b = Math.round(rgb.b * factor);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }
  return hex;
};

export default function ThemeToggle() {
  const { locale, changeLocale, t } = useTranslation();
  const [isLight, setIsLight] = useState(false);
  const [accent, setAccent] = useState('#D4AF37');
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    // Theme Mode
    const savedTheme = localStorage.getItem('taxi-trio-theme');
    if (savedTheme === 'light') {
      setIsLight(true);
      document.body.classList.add('light-theme');
    } else {
      setIsLight(false);
      document.body.classList.remove('light-theme');
    }

    // Accent Color
    const savedAccent = localStorage.getItem('taxi-trio-accent') || '#D4AF37';
    setAccent(savedAccent);
    
    const rgb = hexToRgb(savedAccent);
    const lightHex = getContrastColor(savedAccent);
    const lightRgb = hexToRgb(lightHex);

    document.documentElement.style.setProperty('--color-accent', savedAccent);
    document.documentElement.style.setProperty('--color-accent-rgb', rgb);
    document.documentElement.style.setProperty('--color-accent-light', lightHex);
    document.documentElement.style.setProperty('--color-accent-light-rgb', lightRgb);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggleTheme = () => {
    if (isLight) {
      document.body.classList.remove('light-theme');
      localStorage.setItem('taxi-trio-theme', 'dark');
      setIsLight(false);
    } else {
      document.body.classList.add('light-theme');
      localStorage.setItem('taxi-trio-theme', 'light');
      setIsLight(true);
    }
  };

  const updateAccentColor = (newHex) => {
    const defaultGold = '#D4AF37';
    const isClickingActive = accent.toLowerCase() === newHex.toLowerCase();

    // Revert to Gold if clicking the active color (and it's not already Gold)
    const targetHex = (isClickingActive && newHex.toLowerCase() !== defaultGold.toLowerCase())
      ? defaultGold
      : newHex;

    setAccent(targetHex);
    const rgb = hexToRgb(targetHex);
    const lightHex = getContrastColor(targetHex);
    const lightRgb = hexToRgb(lightHex);

    document.documentElement.style.setProperty('--color-accent', targetHex);
    document.documentElement.style.setProperty('--color-accent-rgb', rgb);
    document.documentElement.style.setProperty('--color-accent-light', lightHex);
    document.documentElement.style.setProperty('--color-accent-light-rgb', lightRgb);

    localStorage.setItem('taxi-trio-accent', targetHex);
  };

  const presets = [
    { name: 'Gold', hex: '#D4AF37', label: 'Gold' },
    { name: 'Blue', hex: '#3B82F6', label: 'Blue' },
    { name: 'Emerald', hex: '#10B981', label: 'Emerald' },
    { name: 'Purple', hex: '#8B5CF6', label: 'Purple' },
    { name: 'Crimson', hex: '#EF4444', label: 'Crimson' }
  ];

  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'km', label: 'ភាសាខ្មែរ', flag: '🇰🇭' },
    { code: 'zh', label: '中文', flag: '🇨🇳' },
    { code: 'ko', label: '한국어', flag: '🇰🇷' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[9999]" ref={ref}>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-[#121212] border border-gold/20 flex items-center justify-center text-gold shadow-lg shadow-black/50 hover:scale-110 active:scale-95 transition-all duration-300 light-theme-toggle-btn"
        title="Settings & Theme Customization"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 transition-transform duration-500 ${isOpen ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Expanded Settings Panel Card */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-72 bg-[#121212] border border-gold/25 rounded-2xl p-5 shadow-2xl flex flex-col gap-4 animate-in slide-in-from-bottom-4 fade-in duration-200 z-50 bg-opacity-95 backdrop-blur-md">
          <div className="border-b border-gold/10 pb-2">
            <h4 className="text-white font-serif font-bold text-sm tracking-wide">{t('displaySettings')}</h4>
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest mt-0.5">Customize your view</p>
          </div>

          {/* Theme Toggle section */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">{t('visualTheme')}</span>
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between bg-[#0B0B0B] border border-gold/15 hover:border-gold/40 text-xs px-4 py-2.5 rounded-xl text-white transition duration-200"
            >
              <span>{isLight ? t('themeLight') : t('themeDark')}</span>
              <span>
                {isLight ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </span>
            </button>
          </div>

          {/* Preset Colors Grid */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">{t('presetColors')}</span>
            <div className="flex items-center justify-between bg-[#0B0B0B] border border-gold/15 p-2.5 rounded-xl gap-2">
              {presets.map((p) => (
                <button
                  key={p.name}
                  onClick={() => updateAccentColor(p.hex)}
                  className={`w-6 h-6 rounded-full transition-all duration-300 relative flex items-center justify-center ${
                    accent.toLowerCase() === p.hex.toLowerCase() 
                      ? 'scale-115 ring-2 ring-white ring-offset-2 ring-offset-[#121212]' 
                      : 'hover:scale-110 opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: p.hex }}
                  title={p.label}
                >
                  {accent.toLowerCase() === p.hex.toLowerCase() && (
                    <svg className="w-3.5 h-3.5 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Accent Color Picker */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between bg-[#0B0B0B] border border-gold/15 p-2.5 rounded-xl text-xs">
              <span className="text-[#A3A3A3] font-semibold">{t('customAccent')}</span>
              <div className="relative flex items-center gap-2">
                <span className="text-[10px] text-white/70 font-mono">{accent.toUpperCase()}</span>
                <label 
                  className="w-6 h-6 rounded-full border border-gold/30 cursor-pointer overflow-hidden flex items-center justify-center shadow-inner transition-transform hover:scale-110" 
                  style={{ backgroundColor: accent }}
                >
                  <input
                    type="color"
                    value={accent}
                    onChange={(e) => updateAccentColor(e.target.value)}
                    className="opacity-0 w-0 h-0 absolute"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-white drop-shadow mix-blend-difference" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </label>
              </div>
            </div>
          </div>

          {/* Language Selector section */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Language / ភាសា</span>
            <div className="grid grid-cols-2 gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLocale(lang.code)}
                  className={`flex items-center gap-1.5 justify-center py-2 px-1 rounded-xl text-xs border transition duration-200 ${
                    locale === lang.code
                      ? 'bg-gold text-black border-transparent font-bold'
                      : 'bg-[#0B0B0B] border-gold/15 text-[#A3A3A3] hover:text-white hover:border-gold/30'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span className="truncate">{lang.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
