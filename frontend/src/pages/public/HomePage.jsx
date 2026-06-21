import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../../utils/auth';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ServiceCard from '../../components/ServiceCard';
import { useTranslation } from '../../context/LanguageContext';

const pageTranslations = {
  en: {
    heroTitleStart: "Explore Cambodia ",
    heroTitleHighlight: "Without the Stress",
    heroDesc: "Provide premium transportation solutions for travelers, tourists, families, and business visitors with transparent pricing and reliable booking experiences.",
    startJourney: "Start Journey",
    viewServices: "View Services",
    
    servicesTitle: "Choose Your Travel Service",
    servicesSubtitle: "Tailored luxury transportation options for every travel requirement.",
    exploreBtn: "Explore →",
    
    whyTitle: "The Standard of Excellence",
    whySubtitle: "Uncompromising quality and reliability for your journeys in Cambodia.",
    profChauffeurs: "Professional Chauffeurs",
    profChauffeursDesc: "Trained, verified, experienced drivers.",
    transFares: "Transparent Fares",
    transFaresDesc: "Fixed pricing with no hidden charges.",
    secBooking: "Secure Booking",
    secBookingDesc: "Verified booking process and records.",
    custSupport: "Customer Support",
    custSupportDesc: "Fast response and assistance.",
    
    routesTitle: "Curated Journeys",
    routesSubtitle: "Experience our most popular routes in premium comfort.",
    ppToSr: "Phnom Penh → Siem Reap",
    ppToSv: "Phnom Penh → Sihanoukville",
    duration: "Est. Duration",
    startingFrom: "Starting Price",
    hours5_5: "5.5 Hours",
    hours2_5: "2.5 Hours",
    
    ctaTitle: "Ready to Travel in Style?",
    ctaDesc: "Book premium transportation services throughout Cambodia.",
    bookNow: "Book Now",
    requestCustom: "Request a Custom Trip",
    
    quickBookTitle: "Book Your Chauffeur",
    pickupLoc: "Pickup Location",
    dropoffLoc: "Dropoff Location",
    selectRoute: "Select Curated Route",
    selectPackage: "Select Private Tour Package",
    customTripDesc: "Custom multi-day journeys, business travel & custom itineraries.",
    bookBtn: "Confirm & Book"
  },
  km: {
    heroTitleStart: "ធ្វើដំណើរជុំវិញប្រទេសកម្ពុជា ",
    heroTitleHighlight: "ដោយគ្មានភាពតានតឹង",
    heroDesc: "ផ្តល់ជូននូវដំណោះស្រាយដឹកជញ្ជូនលំដាប់ខ្ពស់សម្រាប់អ្នកធ្វើដំណើរ ភ្ញៀវទេសចរ គ្រួសារ និងអ្នកជំនួញ ជាមួយនឹងតម្លៃច្បាស់លាស់ និងការកក់ទុកដែលអាចទុកចិត្តបាន។",
    startJourney: "ចាប់ផ្តើមដំណើរ",
    viewServices: "មើលសេវាកម្ម",
    
    servicesTitle: "ជ្រើសរើសសេវាកម្មធ្វើដំណើររបស់អ្នក",
    servicesSubtitle: "ជម្រើសដឹកជញ្ជូនលំដាប់ខ្ពស់ដែលរៀបចំឡើងជាពិសេសសម្រាប់តម្រូវការធ្វើដំណើរគ្រប់ប្រភេទ។",
    exploreBtn: "ស្វែងយល់បន្ថែម →",
    
    whyTitle: "ស្តង់ដារនៃឧត្តមភាព",
    whySubtitle: "គុណភាពខ្ពស់ និងភាពជឿជាក់សម្រាប់រាល់ការធ្វើដំណើររបស់អ្នកនៅកម្ពុជា។",
    profChauffeurs: "អ្នកបើកបរអាជីព",
    profChauffeursDesc: "អ្នកបើកបរដែលបានឆ្លងកាត់ការបណ្តុះបណ្តាល ផ្ទៀងផ្ទាត់ និងមានបទពិសោធន៍។",
    transFares: "តម្លៃច្បាស់លាស់",
    transFaresDesc: "តម្លៃថេរ និងគ្មានការគិតថ្លៃលាក់កំបាំងឡើយ។",
    secBooking: "ការកក់ដែលមានសុវត្ថិភាព",
    secBookingDesc: "ប្រព័ន្ធកក់ដែលបានផ្ទៀងផ្ទាត់ និងកត់ត្រាទុកច្បាស់លាស់។",
    custSupport: "ការគាំទ្រអតិថិជន",
    custSupportDesc: "ការឆ្លើយតប និងការជួយសម្រួលយ៉ាងរហ័ស។",
    
    routesTitle: "ដំណើរដែលរៀបចំជាពិសេស",
    routesSubtitle: "បទពិសោធន៍ធ្វើដំណើរតាមផ្លូវពេញនិយមបំផុតរបស់យើងប្រកបដោយភាពងាយស្រួល និងប្រណីតភាព។",
    ppToSr: "ភ្នំពេញ → សៀមរាប",
    ppToSv: "ភ្នំពេញ → ព្រះសីហនុ",
    duration: "រយៈពេលប៉ាន់ស្មាន",
    startingFrom: "តម្លៃចាប់ផ្តើម",
    hours5_5: "៥.៥ ម៉ោង",
    hours2_5: "២.៥ ម៉ោង",
    
    ctaTitle: "ត្រៀមខ្លួនធ្វើដំណើរប្រកបដោយភាពស៊ីវិល័យហើយឬនៅ?",
    ctaDesc: "កក់សេវាកម្មដឹកជញ្ជូនលំដាប់ខ្ពស់នៅទូទាំងប្រទេសកម្ពុជា។",
    bookNow: "កក់ឥឡូវនេះ",
    requestCustom: "ស្នើសុំដំណើរផ្ទាល់ខ្លួន",
    
    quickBookTitle: "កក់អ្នកបើកបររបស់អ្នក",
    pickupLoc: "ទីតាំងទទួល",
    dropoffLoc: "គោលដៅជូនទៅ",
    selectRoute: "ជ្រើសរើសផ្លូវធ្វើដំណើរ",
    selectPackage: "ជ្រើសរើសកញ្ចប់ដំណើរឯកជន",
    customTripDesc: "ដំណើរផ្ទាល់ខ្លួនជាច្រើនថ្ងៃ ការធ្វើដំណើរអាជីវកម្ម និងផ្លូវដែលអ្នកចង់បាន។",
    bookBtn: "បញ្ជាក់ការកក់"
  },
  zh: {
    heroTitleStart: "探索柬埔寨 ",
    heroTitleHighlight: "轻松无忧",
    heroDesc: "为旅客、游客、家庭和商务访客提供优质交通解决方案，价格透明，预订体验可靠。",
    startJourney: "开启旅程",
    viewServices: "查看服务",
    
    servicesTitle: "选择您的出行服务",
    servicesSubtitle: "为每项出行需求量身定制的奢华交通选择。",
    exploreBtn: "立即探索 →",
    
    whyTitle: "卓越的的标准",
    whySubtitle: "为您的柬埔寨之旅提供妥协的品质和可靠性。",
    profChauffeurs: "专业司导",
    profChauffeursDesc: "经过专业培训、身份验证且经验丰富的司机。",
    transFares: "透明票价",
    transFaresDesc: "固定价格，无任何隐藏费用。",
    secBooking: "安全预订",
    secBookingDesc: "经过验证的的预订流程与系统记录。",
    custSupport: "客户支持",
    custSupportDesc: "极速响应与全方位出行协助。",
    
    routesTitle: "甄选旅程",
    routesSubtitle: "在卓越舒适中体验我们最受欢迎的经典路线。",
    ppToSr: "金边 → 暹粒",
    ppToSv: "金边 → 西哈努克",
    duration: "预计时间",
    startingFrom: "起步价",
    hours5_5: "5.5 小时",
    hours2_5: "2.5 小时",
    
    ctaTitle: "开启您的奢华出行之旅？",
    ctaDesc: "即刻预订柬埔寨全境的高端专属出行服务。",
    bookNow: "立即预订",
    requestCustom: "定制专属行程",
    
    quickBookTitle: "预订专属司机",
    pickupLoc: "出发地点",
    dropoffLoc: "送达目的地",
    selectRoute: "选择推荐路线",
    selectPackage: "选择私人旅游套餐",
    customTripDesc: "私人多日游、商务出行及个性化行程规划。",
    bookBtn: "确认并预订"
  },
  ko: {
    heroTitleStart: "캄보디아를 탐험하세요, ",
    heroTitleHighlight: "스트레스 없이 편안하게",
    heroDesc: "투어객, 가족, 비즈니스 고객을 위해 투명한 요금제와 안전한 예약 시스템을 바탕으로 프리미엄 모빌리티 솔루션을 제공합니다.",
    startJourney: "여정 시작하기",
    viewServices: "서비스 안내",
    
    servicesTitle: "원하는 이동 서비스를 선택하세요",
    servicesSubtitle: "모든 목적에 맞춰 준비된 럭셔리 커스텀 차량 스케줄입니다.",
    exploreBtn: "이동하기 →",
    
    whyTitle: "최상의 우수성 기준",
    whySubtitle: "캄보디아 내 최상의 만족을 위해 타협 없는 서비스 퀄리티를 유지합니다.",
    profChauffeurs: "전문 쇼퍼 서비스",
    profChauffeursDesc: "철저한 검증과 교육을 수료한 베테랑 쇼퍼가 대기합니다.",
    transFares: "투명한 정찰제 요금",
    transFaresDesc: "숨은 추가 요금이 없는 안전하고 투명한 구간 요금제입니다.",
    secBooking: "안전 예약 기록",
    secBookingDesc: "신원 확인 및 간편 모바일 예약 증빙서 열람이 제공됩니다.",
    custSupport: "실시간 컨시어지",
    custSupportDesc: "신속한 문의 해결과 긴급 현장 처리를 보장합니다.",
    
    routesTitle: "엄선된 프리미엄 코스",
    routesSubtitle: "고객님들이 가장 선호하는 노선을 가장 아늑하게 연결합니다.",
    ppToSr: "프놈펜 → 시엠레아프",
    ppToSv: "프놈펜 → 시아누크빌",
    duration: "소요 시간",
    startingFrom: "시작 가격",
    hours5_5: "5.5 시간",
    hours2_5: "2.5 시간",
    
    ctaTitle: "품격 있는 여행을 원하시나요?",
    ctaDesc: "캄보디아 전역의 정예 럭셔리 모빌리티 서비스를 예약해보세요.",
    bookNow: "예약 신청",
    requestCustom: "맞춤 여정 커스텀",
    
    quickBookTitle: "리무진 쇼퍼 예약",
    pickupLoc: "출발지 입력",
    dropoffLoc: "목적지 입력",
    selectRoute: "시외 노선 선택",
    selectPackage: "프라이빗 패키지 선택",
    customTripDesc: "고객 맞춤 장기 대절 및 복수 목적지 일정 조율 서비스입니다.",
    bookBtn: "예약하기"
  }
};

export default function HomePage() {
  const navigate = useNavigate();
  const user = getUser();
  const { locale } = useTranslation();
  const [activeTab, setActiveTab] = useState('city');

  const getTranslation = (key) => {
    const lang = pageTranslations[locale] || pageTranslations['en'];
    return lang[key] || pageTranslations['en'][key];
  };

  const handleBookAction = (targetPath) => {
    if (user && user.role === 'traveler') {
      navigate(`/traveler${targetPath}`);
    } else {
      // Redirect to login if not authenticated or not traveler
      navigate(`/login?redirect=${encodeURIComponent(`/traveler${targetPath}`)}`);
    }
  };

  // SVGs for the luxury services (line-art gold styling)
  const cityRideIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <line x1="9" y1="22" x2="9" y2="16" />
      <line x1="15" y1="22" x2="15" y2="16" />
      <line x1="9" y1="16" x2="15" y2="16" />
      <path d="M8 6h2v2H8V6z" />
      <path d="M14 6h2v2h-2V6z" />
      <path d="M8 10h2v2H8v-2z" />
      <path d="M14 10h2v2h-2v-2z" />
    </svg>
  );

  const intercityIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 22L8 2M20 22L16 2" />
      <path d="M12 2v4M12 9v4M12 16v4" />
    </svg>
  );

  const tourIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );

  const customTripIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );

  // SVGs for Feature Cards (Why Choose Us)
  const chauffeurIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.25}>
      <circle cx="12" cy="8" r="4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 21a6 6 0 0 0-12 0" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  );

  const faresIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.25}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.22.11a3 3 0 003.56 0l.22-.11m-3-6.364l.22-.11a3 3 0 003.56 0l.22.11M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );

  const secureIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.25}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  );

  const supportIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.25}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A9.75 9.75 0 0112 2.25v0A9.75 9.75 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-2.12 0L5.44 7.56a1.5 1.5 0 000 2.12l2.12 2.12a1.5 1.5 0 002.12 0L12 9.75m0 0l3.12 3.12a1.5 1.5 0 002.12 0l2.12-2.12a1.5 1.5 0 000-2.12l-2.12-2.12a1.5 1.5 0 00-2.12 0L12 9.75z" />
    </svg>
  );

  const executeQuickBook = () => {
    if (activeTab === 'city') {
      handleBookAction('/book/city');
    } else if (activeTab === 'intercity') {
      handleBookAction('/book/intercity');
    } else if (activeTab === 'package') {
      handleBookAction('/book/package');
    } else {
      handleBookAction('/custom-trip');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-poppins selection:bg-gold selection:text-black antialiased">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center py-20 px-6 md:px-12 lg:px-24 overflow-hidden">
        {/* Background Image with luxury dark gradient overlay */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <img 
            src="/images/custom_trip.jpg" 
            alt="Premium Chauffeur Road Travel" 
            className="w-full h-full object-cover brightness-[0.25] contrast-[1.05] scale-[1.01]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-[#0A0A0A]/60 to-[#0A0A0A]"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/30 to-transparent"></div>
          {/* Neon Glow spots */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gold/5 blur-[120px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#E6C45A]/5 blur-[120px]"></div>
        </div>

        <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 flex flex-col items-start gap-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/5 border border-gold/15 text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">
              ✨ Premium Travel Platform Cambodia
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-normal leading-tight font-serif text-white tracking-wide">
              {getTranslation('heroTitleStart')}
              <span className="text-[#D4AF37] italic font-playfair block sm:inline">
                {getTranslation('heroTitleHighlight')}
              </span>
            </h1>

            <p className="text-[#D1D5DB] text-sm md:text-base font-light leading-relaxed max-w-xl font-poppins">
              {getTranslation('heroDesc')}
            </p>

            <div className="flex flex-wrap gap-4 mt-2">
              <button 
                onClick={() => handleBookAction('/services')}
                className="bg-[#D4AF37] hover:bg-[#E6C45A] text-black px-8 py-3.5 rounded-full font-bold transition-all duration-300 shadow-lg hover:shadow-[#D4AF37]/20 uppercase tracking-widest text-xs border border-[#D4AF37]"
              >
                {getTranslation('startJourney')}
              </button>
              <a 
                href="#services"
                className="border border-white/20 hover:border-gold hover:text-gold text-white px-8 py-3.5 rounded-full font-bold transition-all duration-300 uppercase tracking-widest text-xs bg-black/40 backdrop-blur-sm"
              >
                {getTranslation('viewServices')}
              </a>
            </div>
          </div>

          {/* Hero Right Content - Conversion Booking Widget */}
          <div className="lg:col-span-5 w-full">
            <div className="bg-[#121212]/90 border border-gold/10 rounded-[2rem] p-6 md:p-8 shadow-[0_0_50px_rgba(212,175,55,0.04)] backdrop-blur-xl relative overflow-hidden group">
              <div className="absolute -right-20 -top-20 w-40 h-40 rounded-full bg-gold/5 blur-2xl group-hover:bg-gold/10 transition-all duration-500"></div>
              
              <h3 className="text-xl font-bold font-serif text-[#D4AF37] mb-6 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-[#E6C45A] animate-pulse"></span>
                {getTranslation('quickBookTitle')}
              </h3>

              {/* Tabs */}
              <div className="grid grid-cols-4 gap-1 border-b border-white/10 pb-3 mb-6">
                {['city', 'intercity', 'package', 'custom'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-2 text-[10px] font-bold uppercase tracking-widest text-center transition-all duration-200 ${
                      activeTab === tab 
                        ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' 
                        : 'text-[#9CA3AF] hover:text-white'
                    }`}
                  >
                    {tab === 'city' && 'City'}
                    {tab === 'intercity' && 'Inter'}
                    {tab === 'package' && 'Tours'}
                    {tab === 'custom' && 'Custom'}
                  </button>
                ))}
              </div>

              {/* Tab Form Fields */}
              <div className="space-y-4 min-h-[140px] flex flex-col justify-center">
                {activeTab === 'city' && (
                  <>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-[#9CA3AF] block mb-1.5 font-semibold">{getTranslation('pickupLoc')}</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Phnom Penh International Airport (PNH)" 
                        className="w-full bg-[#181818] border border-white/10 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#D4AF37] transition duration-200"
                        readOnly
                        onClick={() => handleBookAction('/book/city')}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-[#9CA3AF] block mb-1.5 font-semibold">{getTranslation('dropoffLoc')}</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Hyatt Regency Phnom Penh" 
                        className="w-full bg-[#181818] border border-white/10 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#D4AF37] transition duration-200"
                        readOnly
                        onClick={() => handleBookAction('/book/city')}
                      />
                    </div>
                  </>
                )}

                {activeTab === 'intercity' && (
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-[#9CA3AF] block mb-1.5 font-semibold">{getTranslation('selectRoute')}</label>
                    <select 
                      className="w-full bg-[#181818] border border-white/10 text-white rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#D4AF37] transition duration-200 cursor-pointer"
                      onChange={executeQuickBook}
                    >
                      <option>-- Select a route --</option>
                      <option>Phnom Penh ⇄ Siem Reap</option>
                      <option>Phnom Penh ⇄ Sihanoukville</option>
                      <option>Phnom Penh ⇄ Battambang</option>
                      <option>Siem Reap ⇄ Sihanoukville</option>
                    </select>
                  </div>
                )}

                {activeTab === 'package' && (
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-[#9CA3AF] block mb-1.5 font-semibold">{getTranslation('selectPackage')}</label>
                    <select 
                      className="w-full bg-[#181818] border border-white/10 text-white rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#D4AF37] transition duration-200 cursor-pointer"
                      onChange={executeQuickBook}
                    >
                      <option>-- Select a tour --</option>
                      <option>Angkor Wat Archaeological Express</option>
                      <option>Sihanoukville Coastal Highway Escapade</option>
                      <option>Phnom Penh Historical Chauffeur Tour</option>
                      <option>Cardamom Mountains Eco Journey</option>
                    </select>
                  </div>
                )}

                {activeTab === 'custom' && (
                  <div className="text-center py-4">
                    <p className="text-[#D1D5DB] text-xs font-light leading-relaxed">
                      {getTranslation('customTripDesc')}
                    </p>
                    <span className="text-[#D4AF37] text-[10px] uppercase tracking-widest font-bold block mt-2">
                      Tailored Exclusively For You
                    </span>
                  </div>
                )}
              </div>

              {/* Book Button */}
              <button 
                onClick={executeQuickBook}
                className="w-full mt-6 bg-[#D4AF37] hover:bg-[#E6C45A] text-black py-3.5 rounded-xl font-bold transition duration-300 shadow-md uppercase tracking-wider text-xs font-inter"
              >
                {getTranslation('bookBtn')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SERVICES SECTION */}
      <section id="services" className="py-24 px-6 md:px-12 lg:px-24 bg-[#121212]/30 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gold/3 rounded-full blur-[160px] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col items-center gap-3">
            <span className="text-[#D4AF37] uppercase text-xs tracking-widest font-bold font-inter">
              {getTranslation('servicesSubtitle')}
            </span>
            <h2 className="text-3xl md:text-5xl font-normal text-white font-serif tracking-wide leading-tight">
              {getTranslation('servicesTitle')}
            </h2>
            <div className="w-16 h-[1px] bg-gold/30 mt-2"></div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <ServiceCard 
              title={locale === 'km' ? 'ជិះក្នុងក្រុង' : locale === 'zh' ? '市级出行' : locale === 'ko' ? '시티 라이드' : 'City Ride'}
              description={locale === 'km' ? 'ផ្ទេរទៅព្រលានយន្តហោះ ផ្ទេរទៅសណ្ឋាគារ និងដឹកជញ្ជូនក្នុងតំបន់។' : locale === 'zh' ? '机场接送、酒店往返以及市内本地出行。' : locale === 'ko' ? '공항 픽업, 호텔 샌딩 및 시내 관광 전속 대절 서비스입니다.' : 'Airport transfers, hotel transfers, local transportation.'}
              buttonText={getTranslation('exploreBtn')}
              icon={cityRideIcon}
              onClick={() => handleBookAction('/book/city')}
            />
            <ServiceCard 
              title={locale === 'km' ? 'ឆ្លងខេត្ត' : locale === 'zh' ? '城际专线' : locale === 'ko' ? '도시 간 이동' : 'Intercity Transfer'}
              description={locale === 'km' ? 'ការធ្វើដំណើរប្រកបដោយទំនុកចិត្តពីទីក្រុងមួយទៅទីក្រុងមួយទៀតនៅក្នុងប្រទេសកម្ពុជា។' : locale === 'zh' ? '提供柬埔寨各大城市间安全可靠的点对点长途出行。' : locale === 'ko' ? '캄보디아 내 주요 거점 도시들을 다이렉트로 연결하는 요금제입니다.' : 'Reliable point-to-point travel between major cities in Cambodia.'}
              buttonText={getTranslation('exploreBtn')}
              icon={intercityIcon}
              onClick={() => handleBookAction('/book/intercity')}
            />
            <ServiceCard 
              title={locale === 'km' ? 'កញ្ចប់សេវាកម្ម' : locale === 'zh' ? '私人小团' : locale === 'ko' ? '투어 패키지' : 'Tour Packages'}
              description={locale === 'km' ? 'ដំណើរទស្សនកិច្ចពិសេសទៅកាន់ប្រាសាទអង្គរវត្ត តំបន់ឆ្នេរ និងតំបន់ទេសចរណ៍លាក់ខ្លួន។' : locale === 'zh' ? '精心策划的吴哥窟、海滩及柬埔寨秘境的观光探索之旅。' : locale === 'ko' ? '앙코르와트, 남부 휴양지 비치 등 엄선된 랜드마크 코스 대절입니다.' : 'Curated sightseeing journeys to Angkor Wat, beaches, and hidden gems.'}
              buttonText={getTranslation('exploreBtn')}
              icon={tourIcon}
              onClick={() => handleBookAction('/book/package')}
            />
            <ServiceCard 
              title={locale === 'km' ? 'ដំណើរផ្ទាល់ខ្លួន' : locale === 'zh' ? '定制专属行程' : locale === 'ko' ? '커스텀 투어' : 'Custom Trips'}
              description={locale === 'km' ? 'រៀបចំផ្លូវធ្វើដំណើរផ្ទាល់ខ្លួន ការធ្វើដំណើរអាជីវកម្ម និងព្រឹត្តិការណ៍ជាក្រុម។' : locale === 'zh' ? '量身定制路线、多日行程规划、商务会议及团体活动出行。' : locale === 'ko' ? '고객별 이동 일정, 비즈니스 출장 및 동호회 행사용 복수 예약 조율입니다.' : 'Tailored itineraries, business travels, and group events.'}
              buttonText={getTranslation('exploreBtn')}
              icon={customTripIcon}
              onClick={() => handleBookAction('/custom-trip')}
            />
          </div>
        </div>
      </section>

      {/* 3. WHY CHOOSE US SECTION */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-[#0A0A0A] relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col items-center gap-3">
            <span className="text-[#D4AF37] uppercase text-xs tracking-widest font-bold font-inter">
              {getTranslation('whySubtitle')}
            </span>
            <h2 className="text-3xl md:text-5xl font-normal text-white font-serif tracking-wide leading-tight">
              {getTranslation('whyTitle')}
            </h2>
            <div className="w-16 h-[1px] bg-gold/30 mt-2"></div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Chauffeurs */}
            <div className="group bg-[#121212] border border-gold/10 rounded-2xl p-8 flex flex-col items-center text-center gap-4 transition-all duration-500 hover:border-gold/30 hover:shadow-[0_0_30px_rgba(212,175,55,0.05)] hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-gold/5 border border-gold/15 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-gold/10 group-hover:border-gold/35">
                {chauffeurIcon}
              </div>
              <h4 className="text-lg font-bold text-white uppercase tracking-wider font-serif group-hover:text-gold transition-colors duration-300">
                {getTranslation('profChauffeurs')}
              </h4>
              <p className="text-[#9CA3AF] text-sm font-light leading-relaxed font-poppins">
                {getTranslation('profChauffeursDesc')}
              </p>
            </div>

            {/* Fares */}
            <div className="group bg-[#121212] border border-gold/10 rounded-2xl p-8 flex flex-col items-center text-center gap-4 transition-all duration-500 hover:border-gold/30 hover:shadow-[0_0_30px_rgba(212,175,55,0.05)] hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-gold/5 border border-gold/15 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-gold/10 group-hover:border-gold/35">
                {faresIcon}
              </div>
              <h4 className="text-lg font-bold text-white uppercase tracking-wider font-serif group-hover:text-gold transition-colors duration-300">
                {getTranslation('transFares')}
              </h4>
              <p className="text-[#9CA3AF] text-sm font-light leading-relaxed font-poppins">
                {getTranslation('transFaresDesc')}
              </p>
            </div>

            {/* Secure */}
            <div className="group bg-[#121212] border border-gold/10 rounded-2xl p-8 flex flex-col items-center text-center gap-4 transition-all duration-500 hover:border-gold/30 hover:shadow-[0_0_30px_rgba(212,175,55,0.05)] hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-gold/5 border border-gold/15 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-gold/10 group-hover:border-gold/35">
                {secureIcon}
              </div>
              <h4 className="text-lg font-bold text-white uppercase tracking-wider font-serif group-hover:text-gold transition-colors duration-300">
                {getTranslation('secBooking')}
              </h4>
              <p className="text-[#9CA3AF] text-sm font-light leading-relaxed font-poppins">
                {getTranslation('secBookingDesc')}
              </p>
            </div>

            {/* Support */}
            <div className="group bg-[#121212] border border-gold/10 rounded-2xl p-8 flex flex-col items-center text-center gap-4 transition-all duration-500 hover:border-gold/30 hover:shadow-[0_0_30px_rgba(212,175,55,0.05)] hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-gold/5 border border-gold/15 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-gold/10 group-hover:border-gold/35">
                {supportIcon}
              </div>
              <h4 className="text-lg font-bold text-white uppercase tracking-wider font-serif group-hover:text-gold transition-colors duration-300">
                {getTranslation('custSupport')}
              </h4>
              <p className="text-[#9CA3AF] text-sm font-light leading-relaxed font-poppins">
                {getTranslation('custSupportDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED TRAVEL ROUTES SECTION ("Curated Journeys") */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-[#121212]/30 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center md:text-left mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <span className="text-[#D4AF37] uppercase text-xs tracking-widest font-inter font-bold">
                {getTranslation('routesSubtitle')}
              </span>
              <h2 className="text-3xl md:text-5xl font-normal text-white font-serif mt-2">
                {getTranslation('routesTitle')}
              </h2>
            </div>
            <div className="w-20 h-[1px] bg-gold/30 hidden md:block mb-4 flex-1 max-w-xs mx-8"></div>
            <p className="text-[#9CA3AF] text-sm md:text-base font-light max-w-md font-poppins">
              Select from our most requested premium itineraries. Travel in modern comfort with our professional chauffeurs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
            {/* Route 1 */}
            <div 
              onClick={() => handleBookAction('/book/intercity')}
              className="group relative h-96 rounded-3xl overflow-hidden cursor-pointer border border-gold/10 hover:border-gold/30 hover:shadow-[0_0_50px_-10px_rgba(212,175,55,0.15)] transition-all duration-500"
            >
              {/* Background Image */}
              <img 
                src="/images/gallery_angkor1.jpg" 
                alt="Phnom Penh to Siem Reap" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.4] group-hover:brightness-[0.45]"
              />
              {/* Subtle top/bottom overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
              
              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
                <div className="flex justify-between items-start">
                  <span className="px-3.5 py-1.5 rounded-full bg-black/60 border border-gold/20 text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] backdrop-blur-sm">
                    Popular Route
                  </span>
                  <span className="text-[#9CA3AF] text-xs font-semibold uppercase tracking-wider font-inter">
                    {getTranslation('duration')}: <span className="text-white font-medium">{getTranslation('hours5_5')}</span>
                  </span>
                </div>
                
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-serif text-white group-hover:text-gold transition-colors duration-300">
                      {getTranslation('ppToSr')}
                    </h3>
                    <p className="text-[#D1D5DB] text-xs md:text-sm font-light mt-1 font-poppins max-w-xs">
                      Travel from the bustling capital to the majestic temples of Angkor.
                    </p>
                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="text-[#9CA3AF] text-xs uppercase tracking-wider font-inter">{getTranslation('startingFrom')}</span>
                      <span className="text-[#E6C45A] text-xl font-bold font-inter">$80 USD</span>
                    </div>
                  </div>
                  
                  <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 group-hover:bg-gold group-hover:text-black flex items-center justify-center transition-all duration-300 text-gold shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Route 2 */}
            <div 
              onClick={() => handleBookAction('/book/intercity')}
              className="group relative h-96 rounded-3xl overflow-hidden cursor-pointer border border-gold/10 hover:border-gold/30 hover:shadow-[0_0_50px_-10px_rgba(212,175,55,0.15)] transition-all duration-500"
            >
              {/* Background Image */}
              <img 
                src="/images/intercity_transfer.jpg" 
                alt="Phnom Penh to Sihanoukville" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.4] group-hover:brightness-[0.45]"
              />
              {/* Subtle top/bottom overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
              
              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
                <div className="flex justify-between items-start">
                  <span className="px-3.5 py-1.5 rounded-full bg-black/60 border border-gold/20 text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] backdrop-blur-sm">
                    Expressway
                  </span>
                  <span className="text-[#9CA3AF] text-xs font-semibold uppercase tracking-wider font-inter">
                    {getTranslation('duration')}: <span className="text-white font-medium">{getTranslation('hours2_5')}</span>
                  </span>
                </div>
                
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-serif text-white group-hover:text-gold transition-colors duration-300">
                      {getTranslation('ppToSv')}
                    </h3>
                    <p className="text-[#D1D5DB] text-xs md:text-sm font-light mt-1 font-poppins max-w-xs">
                      Sleek, rapid journey along the coastal expressway to the beaches.
                    </p>
                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="text-[#9CA3AF] text-xs uppercase tracking-wider font-inter">{getTranslation('startingFrom')}</span>
                      <span className="text-[#E6C45A] text-xl font-bold font-inter">$60 USD</span>
                    </div>
                  </div>
                  
                  <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 group-hover:bg-gold group-hover:text-black flex items-center justify-center transition-all duration-300 text-gold shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL-TO-ACTION SECTION */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-[#0A0A0A] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gold/3 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="bg-[#121212] border border-gold/10 rounded-[2.5rem] p-8 md:p-16 shadow-[0_0_50px_rgba(212,175,55,0.04)] relative overflow-hidden group">
            {/* Background luxury gradient glows */}
            <div className="absolute -left-24 -bottom-24 w-60 h-60 rounded-full bg-gold/5 blur-3xl group-hover:bg-gold/10 transition-all duration-500"></div>
            <div className="absolute -right-24 -top-24 w-60 h-60 rounded-full bg-[#E6C45A]/5 blur-3xl group-hover:bg-[#E6C45A]/10 transition-all duration-500"></div>

            <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center gap-6">
              <span className="text-[#D4AF37] uppercase text-xs tracking-widest font-bold font-inter">
                Luxury Travel Experiences
              </span>
              <h2 className="text-3xl md:text-5xl font-normal leading-tight font-serif text-white">
                {getTranslation('ctaTitle')}
              </h2>
              <p className="text-[#D1D5DB] text-sm md:text-base font-light font-poppins max-w-md leading-relaxed">
                {getTranslation('ctaDesc')}
              </p>

              <div className="flex flex-wrap justify-center gap-4 mt-4 w-full">
                <button 
                  onClick={() => handleBookAction('/services')}
                  className="bg-[#D4AF37] hover:bg-[#E6C45A] text-black px-8 py-4 rounded-full font-bold transition-all duration-300 shadow-lg hover:shadow-[#D4AF37]/20 uppercase tracking-widest text-xs border border-[#D4AF37]"
                >
                  {getTranslation('bookNow')}
                </button>
                <button 
                  onClick={() => handleBookAction('/custom-trip')}
                  className="border border-[#D4AF37]/35 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black px-8 py-4 rounded-full font-bold transition-all duration-300 uppercase tracking-widest text-xs bg-black/40 backdrop-blur-sm"
                >
                  {getTranslation('requestCustom')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
