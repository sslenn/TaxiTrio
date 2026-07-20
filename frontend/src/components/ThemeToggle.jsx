import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from '../context/LanguageContext';
import { Sparkles, Clock, Route, DollarSign, Car, Award, Flame, Sliders } from 'lucide-react';

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
    const factor = 0.55;
    const r = Math.round(rgb.r * factor);
    const g = Math.round(rgb.g * factor);
    const b = Math.round(rgb.b * factor);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }
  return hex;
};

const AVAILABLE_LANGUAGES = [
  { code: 'en', native: 'English', english: 'English', flag: '🇺🇸' },
  { code: 'km', native: 'ភាសាខ្មែរ', english: 'Khmer', flag: '🇰🇭' },
  { code: 'zh', native: '中文', english: 'Chinese', flag: '🇨🇳' },
  { code: 'ko', native: '한국어', english: 'Korean', flag: '🇰🇷' },
  { code: 'ja', native: '日本語', english: 'Japanese', flag: '🇯🇵' },
  { code: 'th', native: 'ไทย', english: 'Thai', flag: '🇹🇭' },
  { code: 'vi', native: 'Tiếng Việt', english: 'Vietnamese', flag: '🇻🇳' },
  { code: 'fr', native: 'Français', english: 'French', flag: '🇫🇷' },
  { code: 'es', native: 'Español', english: 'Spanish', flag: '🇪🇸' },
  { code: 'de', native: 'Deutsch', english: 'German', flag: '🇩🇪' },
  { code: 'it', native: 'Italiano', english: 'Italian', flag: '🇮🇹' },
  { code: 'pt', native: 'Português', english: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', native: 'Русский', english: 'Russian', flag: '🇷🇺' },
  { code: 'ar', native: 'العربية', english: 'Arabic', flag: '🇸🇦' },
  { code: 'hi', native: 'हिन्दी', english: 'Hindi', flag: '🇮🇳' },
  { code: 'id', native: 'Bahasa Indonesia', english: 'Indonesian', flag: '🇮🇩' },
  { code: 'ms', native: 'Bahasa Melayu', english: 'Malay', flag: '🇲🇾' },
  { code: 'fil', native: 'Filipino', english: 'Filipino', flag: '🇵🇭' },
  { code: 'lo', native: 'ພາສາລາວ', english: 'Lao', flag: '🇱🇦' },
  { code: 'my', native: 'မြန်မာဘာသာ', english: 'Burmese', flag: '🇲🇲' }
];

const FLAG_MAPPING = {
  en: 'us',
  km: 'kh',
  zh: 'cn',
  ko: 'kr',
  ja: 'jp',
  th: 'th',
  vi: 'vn',
  fr: 'fr',
  es: 'es',
  de: 'de',
  it: 'it',
  pt: 'pt',
  ru: 'ru',
  ar: 'sa',
  hi: 'in',
  id: 'id',
  ms: 'my',
  fil: 'ph',
  lo: 'la',
  my: 'mm'
};

export default function ThemeToggle() {
  const { locale, changeLocale, t } = useTranslation();
  const [isLight, setIsLight] = useState(false);
  const [accent, setAccent] = useState('#BFA76A');
  const [isOpen, setIsOpen] = useState(false);
  const [langSearch, setLangSearch] = useState('');
  const [showToast, setShowToast] = useState(false);
  const ref = useRef(null);

  // Region settings states
  const [currency, setCurrency] = useState(() => localStorage.getItem('taxi-trio-currency') || 'USD');
  const [distanceUnit, setDistanceUnit] = useState(() => localStorage.getItem('taxi-trio-distance') || 'Kilometers');
  const [timeFormat, setTimeFormat] = useState(() => localStorage.getItem('taxi-trio-time') || '24-hour');
  const [dateFormat, setDateFormat] = useState(() => localStorage.getItem('taxi-trio-date') || 'DD/MM/YYYY');

  // Notifications states
  const [notifBooking, setNotifBooking] = useState(() => localStorage.getItem('taxi-trio-notif-booking') !== 'false');
  const [notifDriver, setNotifDriver] = useState(() => localStorage.getItem('taxi-trio-notif-driver') !== 'false');
  const [notifPayment, setNotifPayment] = useState(() => localStorage.getItem('taxi-trio-notif-payment') !== 'false');
  const [notifCustomTrip, setNotifCustomTrip] = useState(() => localStorage.getItem('taxi-trio-notif-custom') !== 'false');
  const [notifSystem, setNotifSystem] = useState(() => localStorage.getItem('taxi-trio-notif-system') !== 'false');
  const [notifPromos, setNotifPromos] = useState(() => localStorage.getItem('taxi-trio-notif-promos') === 'true');
  const [notifEmail, setNotifEmail] = useState(() => localStorage.getItem('taxi-trio-notif-email') !== 'false');
  const [notifPush, setNotifPush] = useState(() => localStorage.getItem('taxi-trio-notif-push') !== 'false');

  // Travel preferences states
  const [prefStyle, setPrefStyle] = useState(() => localStorage.getItem('taxi-trio-pref-style') || 'Luxury');
  const [prefBudget, setPrefBudget] = useState(() => localStorage.getItem('taxi-trio-pref-budget') || 'Premium');
  const [prefPace, setPrefPace] = useState(() => localStorage.getItem('taxi-trio-pref-pace') || 'Balanced');
  const [prefTransport, setPrefTransport] = useState(() => localStorage.getItem('taxi-trio-pref-transport') || 'SUV');

  // AI Concierge preferences states
  const [aiResponse, setAiResponse] = useState(() => localStorage.getItem('taxi-trio-ai-response') || 'Detailed');
  const [aiRecStyle, setAiRecStyle] = useState(() => localStorage.getItem('taxi-trio-ai-recstyle') || 'Luxury experiences');
  const [aiFocus, setAiFocus] = useState(() => localStorage.getItem('taxi-trio-ai-focus') || 'Attractions');

  // Accessibility states
  const [accReduceMotion, setAccReduceMotion] = useState(() => localStorage.getItem('taxi-trio-acc-motion') === 'true');
  const [accLargerText, setAccLargerText] = useState(() => localStorage.getItem('taxi-trio-acc-text') === 'true');
  const [accHighContrast, setAccHighContrast] = useState(() => localStorage.getItem('taxi-trio-acc-contrast') === 'true');
  const [accCompactLayout, setAccCompactLayout] = useState(() => localStorage.getItem('taxi-trio-acc-compact') === 'true');
  const [accKeyboardFocus, setAccKeyboardFocus] = useState(() => localStorage.getItem('taxi-trio-acc-keyboard') === 'true');

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
    const savedAccent = localStorage.getItem('taxi-trio-accent') || '#BFA76A';
    setAccent(savedAccent);
    
    const rgb = hexToRgb(savedAccent);
    const lightHex = getContrastColor(savedAccent);
    const lightRgb = hexToRgb(lightHex);

    document.documentElement.style.setProperty('--color-accent', savedAccent);
    document.documentElement.style.setProperty('--color-accent-rgb', rgb);
    document.documentElement.style.setProperty('--color-accent-light', lightHex);
    document.documentElement.style.setProperty('--color-accent-light-rgb', lightRgb);
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
    const defaultGold = '#BFA76A';
    const isClickingActive = accent.toLowerCase() === newHex.toLowerCase();
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

  const handleSaveSettings = () => {
    localStorage.setItem('taxi-trio-theme', isLight ? 'light' : 'dark');
    localStorage.setItem('taxi-trio-accent', accent);
    localStorage.setItem('taxi-trio-locale', locale);

    // Save region
    localStorage.setItem('taxi-trio-currency', currency);
    localStorage.setItem('taxi-trio-distance', distanceUnit);
    localStorage.setItem('taxi-trio-time', timeFormat);
    localStorage.setItem('taxi-trio-date', dateFormat);

    // Save notifications
    localStorage.setItem('taxi-trio-notif-booking', String(notifBooking));
    localStorage.setItem('taxi-trio-notif-driver', String(notifDriver));
    localStorage.setItem('taxi-trio-notif-payment', String(notifPayment));
    localStorage.setItem('taxi-trio-notif-custom', String(notifCustomTrip));
    localStorage.setItem('taxi-trio-notif-system', String(notifSystem));
    localStorage.setItem('taxi-trio-notif-promos', String(notifPromos));
    localStorage.setItem('taxi-trio-notif-email', String(notifEmail));
    localStorage.setItem('taxi-trio-notif-push', String(notifPush));

    // Save travel preferences
    localStorage.setItem('taxi-trio-pref-style', prefStyle);
    localStorage.setItem('taxi-trio-pref-budget', prefBudget);
    localStorage.setItem('taxi-trio-pref-pace', prefPace);
    localStorage.setItem('taxi-trio-pref-transport', prefTransport);

    // Save AI Concierge
    localStorage.setItem('taxi-trio-ai-response', aiResponse);
    localStorage.setItem('taxi-trio-ai-recstyle', aiRecStyle);
    localStorage.setItem('taxi-trio-ai-focus', aiFocus);

    // Save Accessibility
    localStorage.setItem('taxi-trio-acc-motion', String(accReduceMotion));
    localStorage.setItem('taxi-trio-acc-text', String(accLargerText));
    localStorage.setItem('taxi-trio-acc-contrast', String(accHighContrast));
    localStorage.setItem('taxi-trio-acc-compact', String(accCompactLayout));
    localStorage.setItem('taxi-trio-acc-keyboard', String(accKeyboardFocus));

    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      setIsOpen(false);
    }, 1500);
  };

  const presets = [
    { name: 'Gold', hex: '#BFA76A', label: 'Gold' },
    { name: 'Blue', hex: '#3B82F6', label: 'Blue' },
    { name: 'Emerald', hex: '#10B981', label: 'Emerald' },
    { name: 'Purple', hex: '#8B5CF6', label: 'Purple' },
    { name: 'Ruby', hex: '#D2042D', label: 'Ruby' }
  ];

  const filteredLangs = AVAILABLE_LANGUAGES.filter(lang => 
    lang.english.toLowerCase().includes(langSearch.toLowerCase()) || 
    lang.native.toLowerCase().includes(langSearch.toLowerCase())
  );

  const renderToggle = (label, desc, value, onChange) => (
    <div 
      className="flex items-center justify-between bg-[#121212] border border-gold/10 p-4 rounded-2xl cursor-pointer select-none text-left transition duration-200 hover:border-gold/30"
      onClick={() => onChange(!value)}
    >
      <div className="flex flex-col gap-0.5">
        <span className="text-xs font-bold text-white uppercase tracking-wider">{label}</span>
        <span className="text-[10px] text-neutral-400 font-light leading-relaxed">{desc}</span>
      </div>
      <div className={`w-9 h-5 rounded-full p-0.5 transition-all duration-300 shrink-0 ${value ? 'bg-gold' : 'bg-neutral-855'}`} style={{ backgroundColor: value ? accent : '#222' }}>
        <div className={`w-4 h-4 bg-black rounded-full transition-transform duration-300 ${value ? 'translate-x-4' : 'translate-x-0'}`} />
      </div>
    </div>
  );

  const renderChips = (title, options, value, onChange) => (
    <div className="flex flex-col gap-2 bg-[#121212] border border-gold/10 p-5 rounded-2xl text-left">
      <span className="text-[9px] uppercase font-bold text-[#BFA76A] tracking-wider block">{title}</span>
      <div className="flex flex-wrap gap-2 mt-1">
        {options.map((opt) => {
          const isSelected = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                isSelected 
                  ? 'text-black shadow-lg scale-105 font-black' 
                  : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'
              }`}
              style={{ backgroundColor: isSelected ? accent : undefined }}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="fixed bottom-6 right-6 z-[9999]" ref={ref}>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-[#121212] border border-gold/20 flex items-center justify-center text-gold shadow-lg shadow-black/50 hover:scale-110 active:scale-95 transition-all duration-300 light-theme-toggle-btn"
        title="Settings & Personalization"
        style={{ borderColor: accent, color: accent }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 transition-transform duration-500 ${isOpen ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Expanded Settings Modal Overlay */}
      {isOpen && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 lg:p-10 font-sans">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity cursor-pointer animate-in fade-in duration-300"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-5xl bg-[#121212] border-t sm:border border-[#2a2a2a] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 animate-in fade-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300 flex flex-col h-[95vh] sm:h-auto max-h-[95vh] sm:max-h-[90vh] text-left">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-[#2a2a2a] bg-[#121212] flex justify-between items-center shrink-0">
              <div className="flex flex-col text-left">
                <h3 className="text-base font-bold text-white uppercase tracking-wider font-serif">
                  Personalization
                </h3>
                <span className="text-[10px] text-neutral-400 font-light mt-0.5 uppercase tracking-wide">
                  Appearance • Language & Region • Notifications • Travel • AI
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-neutral-500 hover:text-white transition-colors duration-150 p-1.5 hover:bg-neutral-900 rounded-lg cursor-pointer"
                title="Close Personalization Hub"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#0b0b0b]">
              
              {/* Left Column: Config panels */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                
                {/* 1. Appearance Section */}
                <div className="flex flex-col gap-3">
                  <h4 className="text-xs font-bold text-[#BFA76A] uppercase tracking-wider flex items-center gap-1.5 font-serif">
                    <span>A.</span> Appearance Settings
                  </h4>
                  
                  {/* Luxury Dark Theme Card */}
                  <div className="bg-[#121212] border border-gold/10 p-5 rounded-2xl flex items-center justify-between shadow-sm" style={{ borderColor: `${accent}20` }}>
                    <div className="flex flex-col gap-1 text-left">
                      <span className="text-xs font-bold text-white font-serif">Luxury Dark Theme</span>
                      <span className="text-[10px] text-neutral-400 leading-none">Elegant dark interface with premium color accents</span>
                    </div>
                    <button
                      onClick={toggleTheme}
                      type="button"
                      className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded border transition-all duration-200"
                      style={{ 
                        color: accent, 
                        borderColor: `${accent}40`, 
                        backgroundColor: `${accent}10` 
                      }}
                    >
                      {isLight ? 'Theme: Light' : 'Theme: Dark (Active)'}
                    </button>
                  </div>

                  {/* Preset Accents Grid */}
                  <div className="flex flex-col gap-2 mt-1">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider text-left">Preset Accents</span>
                    <div className="grid grid-cols-5 gap-3 bg-[#121212] p-4 border border-gold/10 rounded-2xl" style={{ borderColor: `${accent}15` }}>
                      {presets.map((p) => {
                        const isCurrent = accent.toLowerCase() === p.hex.toLowerCase();
                        return (
                          <button
                            key={p.name}
                            type="button"
                            onClick={() => updateAccentColor(p.hex)}
                            className="flex flex-col items-center gap-1.5 group cursor-pointer focus:outline-none"
                          >
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                                isCurrent 
                                  ? 'ring-2 ring-white ring-offset-2 ring-offset-[#121212] scale-110 shadow-md shadow-white/5' 
                                  : 'opacity-75 hover:opacity-100 hover:scale-105'
                              }`}
                              style={{ backgroundColor: p.hex }}
                            >
                              {isCurrent && (
                                <svg className="w-4 h-4 text-white drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <span className={`text-[9px] font-bold tracking-wide uppercase ${isCurrent ? 'text-white' : 'text-neutral-500'}`} style={{ color: isCurrent ? accent : undefined }}>
                              {p.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom Accent Color Picker */}
                  <div className="bg-[#121212] border border-gold/10 p-4 rounded-2xl flex items-center justify-between text-xs mt-1" style={{ borderColor: `${accent}15` }}>
                    <div className="flex flex-col gap-0.5 text-left">
                      <span className="font-bold text-white uppercase tracking-wider text-[10px]">Custom Accent HEX Color</span>
                      <span className="text-[10px] text-neutral-400 font-mono uppercase">{accent}</span>
                    </div>
                    <label
                      className="flex items-center gap-2 px-4 py-2 rounded-xl border bg-[#0B0B0B] text-[10px] font-bold uppercase tracking-wider cursor-pointer transition duration-150"
                      style={{ 
                        borderLeftColor: accent, 
                        borderLeftWidth: '5px',
                        borderColor: `${accent}30`,
                        color: accent
                      }}
                    >
                      <input
                        type="color"
                        value={accent}
                        onChange={(e) => updateAccentColor(e.target.value)}
                        className="opacity-0 w-0 h-0 absolute"
                      />
                      <span>Choose Color</span>
                    </label>
                  </div>
                </div>

                <hr className="border-neutral-900" />

                {/* 2. Language & Region Section */}
                <div className="flex flex-col gap-3">
                  <h4 className="text-xs font-bold text-[#BFA76A] uppercase tracking-wider flex items-center gap-1.5 font-serif">
                    <span>B.</span> Language & Region
                  </h4>

                  {/* Searchable Language Picker */}
                  <div className="flex flex-col gap-3 bg-[#121212] border border-gold/10 p-5 rounded-2xl text-left" style={{ borderColor: `${accent}15` }}>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">Scalable Language Picker (20 Options)</span>
                    
                    {/* Search Field */}
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search language name (English or Native name)..."
                        value={langSearch}
                        onChange={(e) => setLangSearch(e.target.value)}
                        className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-gold/60 transition duration-150 font-light"
                        style={{ borderColor: `${accent}25` }}
                      />
                    </div>
                    
                    {/* Visual Separator Bar Line */}
                    <div className="h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent my-3" style={{ backgroundImage: `linear-gradient(to right, transparent, ${accent}40, transparent)` }}></div>

                    {/* Scrollable Languages Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[150px] overflow-y-auto pr-2 custom-settings-scrollbar">
                      {filteredLangs.map((lang) => {
                        const isCurrent = locale === lang.code;
                        return (
                          <button
                            key={lang.code}
                            type="button"
                            onClick={() => changeLocale(lang.code)}
                            className={`flex items-center justify-between p-2.5 rounded-xl text-xs border transition duration-150 cursor-pointer ${
                              isCurrent
                                ? 'bg-gold/10 border-gold text-white font-bold'
                                : 'bg-[#0B0B0B] border-gold/10 text-neutral-400 hover:text-white hover:border-gold/30'
                            }`}
                            style={{ 
                              borderColor: isCurrent ? accent : undefined, 
                              backgroundColor: isCurrent ? `${accent}15` : undefined 
                            }}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <img 
                                src={`https://flagcdn.com/w40/${FLAG_MAPPING[lang.code] || 'un'}.png`} 
                                alt={lang.english} 
                                className="w-5 h-3.5 object-cover rounded shadow-sm shrink-0 border border-neutral-800" 
                              />
                              <div className="flex flex-col text-left truncate leading-tight">
                                <span className="font-semibold text-[10.5px] text-white">{lang.native}</span>
                                <span className="text-[9px] text-neutral-500 font-light">{lang.english}</span>
                              </div>
                            </div>
                            {isCurrent && (
                              <span className="text-[9px] font-bold uppercase shrink-0 bg-gold/10 px-1.5 py-0.5 rounded border" style={{ color: accent, borderColor: `${accent}30` }}>
                                ✓ Active
                              </span>
                            )}
                          </button>
                        );
                      })}
                      {filteredLangs.length === 0 && (
                        <div className="col-span-2 text-center py-6 text-xs text-neutral-500 font-light">
                          No matching languages found.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Region Selectors */}
                  <div className="grid grid-cols-2 gap-4 bg-[#121212] border border-gold/10 p-5 rounded-2xl text-xs" style={{ borderColor: `${accent}15` }}>
                    <div className="flex flex-col gap-1 text-left">
                      <label className="text-[9px] font-bold text-[#BFA76A] uppercase tracking-wider">Currency</label>
                      <select
                        className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:border-gold transition duration-155 font-medium"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        style={{ borderColor: `${accent}20` }}
                      >
                        <option value="USD">USD ($)</option>
                        <option value="KHR">KHR (៛)</option>
                        <option value="THB">THB (฿)</option>
                        <option value="EUR">EUR (€)</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1 text-left">
                      <label className="text-[9px] font-bold text-[#BFA76A] uppercase tracking-wider">Distance Units</label>
                      <select
                        className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:border-gold transition duration-155 font-medium"
                        value={distanceUnit}
                        onChange={(e) => setDistanceUnit(e.target.value)}
                        style={{ borderColor: `${accent}20` }}
                      >
                        <option value="Kilometers">Kilometers (km)</option>
                        <option value="Miles">Miles (mi)</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1 text-left mt-1">
                      <label className="text-[9px] font-bold text-[#BFA76A] uppercase tracking-wider">Time Format</label>
                      <select
                        className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:border-gold transition duration-155 font-medium"
                        value={timeFormat}
                        onChange={(e) => setTimeFormat(e.target.value)}
                        style={{ borderColor: `${accent}20` }}
                      >
                        <option value="12-hour">12-Hour Format</option>
                        <option value="24-hour">24-Hour Format</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1 text-left mt-1">
                      <label className="text-[9px] font-bold text-[#BFA76A] uppercase tracking-wider">Date Format</label>
                      <select
                        className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:border-gold transition duration-155 font-medium"
                        value={dateFormat}
                        onChange={(e) => setDateFormat(e.target.value)}
                        style={{ borderColor: `${accent}20` }}
                      >
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>
                  </div>
                </div>

                <hr className="border-neutral-900" />

                {/* 3. Notifications Section */}
                <div className="flex flex-col gap-3">
                  <h4 className="text-xs font-bold text-[#BFA76A] uppercase tracking-wider flex items-center gap-1.5 font-serif">
                    <span>C.</span> Notification Preferences
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {renderToggle("Booking Updates", "Get alerts about pending, confirmed or cancelled trips", notifBooking, setNotifBooking)}
                    {renderToggle("Driver Updates", "Get notifications when a driver is assigned or on the way", notifDriver, setNotifDriver)}
                    {renderToggle("Payment Alerts", "Get invoice reminders and proof validation receipts", notifPayment, setNotifPayment)}
                    {renderToggle("Custom Trip Updates", "Get updates on manual review & tailored routing quotes", notifCustomTrip, setNotifCustomTrip)}
                    {renderToggle("System Notices", "General system news, announcements, and developer logs", notifSystem, setNotifSystem)}
                    {renderToggle("Promotions & Offers", "Receive special discounts, coupons and campaign alerts", notifPromos, setNotifPromos)}
                    {renderToggle("Email Dispatches", "Send duplicates of major notifications to your inbox", notifEmail, setNotifEmail)}
                    {renderToggle("Push Notifications", "Allow web push alerts to pop up while browsing", notifPush, setNotifPush)}
                  </div>
                </div>

                <hr className="border-neutral-900" />

                {/* 4. Travel Preferences Section */}
                <div className="flex flex-col gap-3">
                  <h4 className="text-xs font-bold text-[#BFA76A] uppercase tracking-wider flex items-center gap-1.5 font-serif">
                    <span>D.</span> Travel Preferences
                  </h4>
                  <div className="flex flex-col gap-4">
                    {renderChips("Preferred Travel Style", ["Relaxing", "Adventure", "Cultural", "Food", "Nature", "Family", "Luxury", "Budget"], prefStyle, setPrefStyle)}
                    {renderChips("Preferred Budget", ["Budget", "Mid-range", "Premium", "Luxury"], prefBudget, setPrefBudget)}
                    {renderChips("Preferred Pace", ["Slow", "Balanced", "Fast"], prefPace, setPrefPace)}
                    {renderChips("Preferred Transport", ["Car", "Van", "Tuk-tuk", "SUV"], prefTransport, setPrefTransport)}
                  </div>
                </div>

                <hr className="border-neutral-900" />

                {/* 5. AI Concierge Section */}
                <div className="flex flex-col gap-3">
                  <h4 className="text-xs font-bold text-[#BFA76A] uppercase tracking-wider flex items-center gap-1.5 font-serif">
                    <span>E.</span> AI Concierge Preferences
                  </h4>
                  <div className="flex flex-col gap-4">
                    {renderChips("AI Response Length", ["Short", "Balanced", "Detailed"], aiResponse, setAiResponse)}
                    {renderChips("AI Recommendation Style", ["Popular places", "Hidden gems", "Luxury experiences", "Budget-friendly options"], aiRecStyle, setAiRecStyle)}
                    {renderChips("Default AI Planning Focus", ["Attractions", "Restaurants", "Photography", "History", "Nature", "Nightlife", "Family activities"], aiFocus, setAiFocus)}
                  </div>
                </div>

                <hr className="border-neutral-900" />

                {/* 6. Accessibility Section */}
                <div className="flex flex-col gap-3">
                  <h4 className="text-xs font-bold text-[#BFA76A] uppercase tracking-wider flex items-center gap-1.5 font-serif">
                    <span>F.</span> Accessibility Options
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {renderToggle("Reduce Motion", "Deactivate background glows and transition translations", accReduceMotion, setAccReduceMotion)}
                    {renderToggle("Larger Text Scale", "Increase base layout font size across dashboard cards", accLargerText, setAccLargerText)}
                    {renderToggle("High Contrast Mode", "Enforce high contrast border and label colors", accHighContrast, setAccHighContrast)}
                    {renderToggle("Compact Layout", "Decrease spacing margins and padding on UI cards", accCompactLayout, setAccCompactLayout)}
                    {renderToggle("Keyboard Focus Rings", "Render high-visibility outline focus rings on tabs", accKeyboardFocus, setAccKeyboardFocus)}
                  </div>
                </div>

              </div>

              {/* Right Column: Sticky Live Preview */}
              <div className="lg:col-span-4 lg:sticky lg:top-0 flex flex-col gap-6 self-start w-full">
                
                {/* Live Preview Card */}
                <div className="bg-[#121212] border border-gold/15 p-5 rounded-2xl flex flex-col gap-4 text-left shadow-lg" style={{ borderColor: `${accent}20` }}>
                  <h4 className="text-xs font-black uppercase text-[#BFA76A] tracking-wider pb-2.5 border-b border-neutral-900 flex items-center justify-between">
                    <span>Live Preview</span>
                    <span className="w-2 h-2 rounded-full bg-gold animate-pulse" style={{ backgroundColor: accent }} />
                  </h4>

                  {/* Sample Primary Accent Button */}
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] text-neutral-500 font-bold uppercase tracking-wider">Accent Button</span>
                    <button
                      type="button"
                      className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-black transition-all active:scale-[0.98]"
                      style={{ backgroundColor: accent }}
                    >
                      Book Custom Trip
                    </button>
                  </div>

                  {/* Sample Notification Badge */}
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] text-neutral-500 font-bold uppercase tracking-wider">Notification Badge</span>
                    <div className="flex items-center justify-between bg-[#0B0B0B] border border-white/5 p-2.5 rounded-xl text-[10.5px] text-white">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accent }} />
                        <span className="font-light">Notification: Driver Assigned</span>
                      </div>
                      <span className="text-[8px] uppercase font-bold px-1.5 py-0.5 rounded border" style={{ color: accent, borderColor: `${accent}40`, backgroundColor: `${accent}15` }}>
                        Alert
                      </span>
                    </div>
                  </div>

                  {/* Active Language */}
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] text-neutral-500 font-bold uppercase tracking-wider">Active Locale</span>
                    <div className="bg-[#0B0B0B] border border-white/5 p-2.5 rounded-xl text-[10.5px] text-white flex justify-between items-center">
                      <span className="font-light">Language:</span>
                      <span className="font-bold" style={{ color: accent }}>
                        {AVAILABLE_LANGUAGES.find(lang => lang.code === locale)?.english || 'English'}
                      </span>
                    </div>
                  </div>

                  {/* AI Concierge Mini Card */}
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] text-neutral-500 font-bold uppercase tracking-wider">AI Concierge Preferences</span>
                    <div className="bg-[#0B0B0B] border border-gold/10 p-3 rounded-xl text-left flex items-start gap-2.5" style={{ borderColor: `${accent}25` }}>
                      <div className="w-7 h-7 rounded-full border bg-gradient-to-tr from-gold/10 to-transparent flex items-center justify-center text-[10px] font-bold shrink-0 pulse-glow-ring" style={{ borderColor: accent, color: accent }}>
                        AI
                      </div>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider leading-none">Travel Style</span>
                        <span className="text-[9px] text-neutral-400 font-light truncate">Style: {prefStyle} • Pace: {prefPace}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save & Cancel Sticky Actions */}
                <div className="flex flex-col gap-3">
                  {showToast && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2.5 rounded-xl text-xs text-center font-bold tracking-wide animate-in fade-in duration-200">
                      ✓ Preferences updated successfully
                    </div>
                  )}
                  
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="flex-1 py-3.5 bg-[#121212] hover:bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700 text-xs font-black tracking-widest uppercase rounded-full cursor-pointer transition active:scale-[0.98]"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveSettings}
                      className="flex-1 py-3.5 text-xs font-black tracking-widest uppercase rounded-full cursor-pointer transition active:scale-[0.98] text-black"
                      style={{ backgroundColor: accent }}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>

              </div>
            </div>
            
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
