import { useTranslation } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const { t, locale } = useTranslation();
  const navigate = useNavigate();

  // Multi-lingual labels for sections
  const labels = {
    en: {
      services: "Services",
      legal: "Legal",
      socialMedia: "Social Media",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
      contactUs: "Contact Us",
    },
    km: {
      services: "សេវាកម្ម",
      legal: "ច្បាប់",
      socialMedia: "បណ្តាញសង្គម",
      privacyPolicy: "គោលការណ៍ឯកជនភាព",
      termsOfService: "លក្ខខណ្ឌប្រើប្រាស់",
      contactUs: "ទាក់ទងមកយើង",
    },
    zh: {
      services: "特色服务",
      legal: "法律条款",
      socialMedia: "社交媒体",
      privacyPolicy: "隐私政策",
      termsOfService: "服务协议",
      contactUs: "联系我们",
    },
    ko: {
      services: "서비스",
      legal: "법적 고지",
      socialMedia: "소셜 미디어",
      privacyPolicy: "개인정보 처리방침",
      termsOfService: "이용 약관",
      contactUs: "문의하기",
    }
  };

  const getLabel = (key) => {
    const lang = labels[locale] || labels['en'];
    return lang[key] || labels['en'][key];
  };

  return (
    <footer className="w-full border-t border-gold/10 bg-[#050505] py-20 px-6 md:px-12 mt-32 relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gold/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 md:gap-16 relative z-10">
        {/* Column 1 - Brand & Desc */}
        <div className="flex flex-col gap-4">
          <span 
            onClick={() => navigate('/')} 
            className="text-[#D4AF37] font-bold text-2xl tracking-widest font-serif cursor-pointer transition duration-300 hover:text-white"
          >
            TaxiTrio
          </span>
          <p className="text-[#A3A3A3] text-xs leading-relaxed font-light mt-2">
            {t('footerDesc')}
          </p>
          <span className="text-[#A3A3A3]/40 text-[10px] tracking-wider mt-6 font-mono">
            {t('copyright')}
          </span>
        </div>

        {/* Column 2 - Services */}
        <div className="flex flex-col gap-3.5">
          <span className="text-white text-xs font-bold uppercase tracking-widest border-b border-gold/10 pb-2 mb-2">
            {getLabel('services')}
          </span>
          {[
            { path: '/traveler/book/city', label: t('cityRide') },
            { path: '/traveler/book/intercity', label: t('intercityTransfer') },
            { path: '/traveler/book/package', label: t('tourPackage') },
            { path: '/traveler/custom-trip', label: t('customJourney') }
          ].map((item) => (
            <button 
              key={item.path}
              onClick={() => navigate(item.path)} 
              className="text-[#A3A3A3] hover:text-[#D4AF37] text-xs text-left transition-all duration-300 transform hover:translate-x-1 bg-transparent border-none p-0 cursor-pointer font-light tracking-wide"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Column 3 - Legal */}
        <div className="flex flex-col gap-3.5">
          <span className="text-white text-xs font-bold uppercase tracking-widest border-b border-gold/10 pb-2 mb-2">
            {getLabel('legal')}
          </span>
          {[
            { label: getLabel('privacyPolicy'), href: '#privacy' },
            { label: getLabel('termsOfService'), href: '#terms' },
            { label: getLabel('contactUs'), href: '#contact' }
          ].map((item) => (
            <a 
              key={item.href}
              href={item.href} 
              className="text-[#A3A3A3] hover:text-[#D4AF37] text-xs transition-all duration-300 transform hover:translate-x-1 font-light tracking-wide"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Column 4 - Social Media */}
        <div className="flex flex-col gap-3.5">
          <span className="text-white text-xs font-bold uppercase tracking-widest border-b border-gold/10 pb-2 mb-2">
            {getLabel('socialMedia')}
          </span>
          <a 
            href="https://facebook.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[#A3A3A3] hover:text-[#D4AF37] text-xs transition-all duration-300 transform hover:translate-x-1 flex items-center gap-2.5 font-light tracking-wide"
          >
            <svg className="w-3.5 h-3.5 fill-current text-gold/80" viewBox="0 0 24 24">
              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
            </svg>
            Facebook
          </a>
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[#A3A3A3] hover:text-[#D4AF37] text-xs transition-all duration-300 transform hover:translate-x-1 flex items-center gap-2.5 font-light tracking-wide"
          >
            <svg className="w-3.5 h-3.5 fill-current text-gold/80" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            Instagram
          </a>
          <a 
            href="https://t.me" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[#A3A3A3] hover:text-[#D4AF37] text-xs transition-all duration-300 transform hover:translate-x-1 flex items-center gap-2.5 font-light tracking-wide"
          >
            <svg className="w-3.5 h-3.5 fill-current text-gold/80" viewBox="0 0 24 24">
              <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.24-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.538-.196 1.006.128.832.957z"/>
            </svg>
            Telegram
          </a>
        </div>
      </div>
    </footer>
  );
}
