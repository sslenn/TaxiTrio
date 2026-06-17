import { useNavigate } from 'react-router-dom';
import { getUser } from '../../utils/auth';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ServiceCard from '../../components/ServiceCard';

export default function HomePage() {
  const navigate = useNavigate();
  const user = getUser();

  const handleBookAction = (targetPath) => {
    if (user && user.role === 'traveler') {
      navigate(`/traveler${targetPath}`);
    } else {
      // Redirect to login if not authenticated or not traveler
      navigate(`/login?redirect=${encodeURIComponent(`/traveler${targetPath}`)}`);
    }
  };

  // SVGs for the luxury services
  const cityRideIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3C13 6.9 11.8 6 10 6H4c-1.1 0-2 .9-2 2v8c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <path d="M9 17h6" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  );

  const intercityIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
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
      <circle cx="6" cy="19" r="3" />
      <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
      <circle cx="18" cy="5" r="3" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-[#020202] text-white flex items-center justify-center p-4 md:p-8 font-sans selection:bg-gold selection:text-black">
      {/* Centered Main Container with purple/blue outline glow */}
      <div className="w-full max-w-[1200px] bg-[#0B0B0B] border border-neutral-900 rounded-[2rem] overflow-hidden shadow-[0_0_80px_-20px_rgba(168,85,247,0.2),_0_0_120px_-30px_rgba(59,130,246,0.15)] flex flex-col min-h-[90vh] relative">
        
        {/* Ambient background glow elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-600/5 blur-[120px] pointer-events-none z-0"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-gold/5 blur-[120px] pointer-events-none z-0"></div>
        
        <Navbar />

        {/* Main content body */}
        <main className="flex-1 flex flex-col justify-center py-16 px-6 md:px-16 lg:px-24 relative z-10">
          
          {/* Hero Section */}
          <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col items-center gap-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/5 border border-gold/15 text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] mb-2">
              ✨ Premium Travel Platform Cambodia
            </div>
            <h1 className="text-4xl md:text-5xl font-normal text-white font-serif tracking-wide leading-tight">
              Select Your <span className="text-[#D4AF37] italic">Journey</span>
            </h1>
            <div className="w-16 h-[1px] bg-gold/40 my-1"></div>
            <p className="text-[#BFA76A] text-xs md:text-sm font-semibold tracking-widest uppercase">
              Experience reliable transportation tailored to your travel needs across Cambodia.
            </p>
          </div>

          {/* Service Cards Grid (2x2) */}
          <div className="grid md:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto w-full relative z-10">
            <ServiceCard 
              title="City Ride"
              description="Seamless point-to-point transfers within the city. Perfect for airport transfers, hotel pickups, and local travel."
              buttonText="Select City Ride"
              icon={cityRideIcon}
              onClick={() => handleBookAction('/book/city')}
            />
            <ServiceCard 
              title="Intercity Transfer"
              description="Travel comfortably between Cambodia’s major destinations with fixed route pricing and reliable drivers."
              buttonText="Select Intercity"
              icon={intercityIcon}
              onClick={() => handleBookAction('/book/intercity')}
            />
            <ServiceCard 
              title="Tour Package"
              description="Explore curated destination routes and attraction-based transportation packages across Cambodia."
              buttonText="View Packages"
              icon={tourIcon}
              onClick={() => handleBookAction('/book/package')}
            />
            <ServiceCard 
              title="Custom Trip"
              description="Design your own itinerary with multiple stops, custom schedules, and flexible transportation needs."
              buttonText="Build Itinerary"
              icon={customTripIcon}
              onClick={() => handleBookAction('/custom-trip')}
            />
          </div>

          {/* Trust Indicators / Stats */}
          <div className="mt-20 border-t border-gold/10 pt-12 max-w-5xl mx-auto w-full relative z-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="flex flex-col items-center text-center gap-2 group">
                <div className="w-10 h-10 rounded-full bg-gold/5 border border-gold/15 flex items-center justify-center text-gold group-hover:bg-gold/10 transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                  </svg>
                </div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider font-serif">100% Vetted Drivers</h4>
                <p className="text-[#A3A3A3] text-xs font-light max-w-[200px]">Strictly background-checked professional operators.</p>
              </div>

              <div className="flex flex-col items-center text-center gap-2 group">
                <div className="w-10 h-10 rounded-full bg-gold/5 border border-gold/15 flex items-center justify-center text-gold group-hover:bg-gold/10 transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.22.11a3 3 0 003.56 0l.22-.11m-3-6.364l.22-.11a3 3 0 003.56 0l.22.11M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider font-serif">Fixed Fair Rates</h4>
                <p className="text-[#A3A3A3] text-xs font-light max-w-[200px]">Transparent route-based pricing without hidden fees.</p>
              </div>

              <div className="flex flex-col items-center text-center gap-2 group">
                <div className="w-10 h-10 rounded-full bg-gold/5 border border-gold/15 flex items-center justify-center text-gold group-hover:bg-gold/10 transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider font-serif">Secure Bookings</h4>
                <p className="text-[#A3A3A3] text-xs font-light max-w-[200px]">Instantly track booking status and verify payment proofs.</p>
              </div>

              <div className="flex flex-col items-center text-center gap-2 group">
                <div className="w-10 h-10 rounded-full bg-gold/5 border border-gold/15 flex items-center justify-center text-gold group-hover:bg-gold/10 transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A9.75 9.75 0 0112 2.25v0A9.75 9.75 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-2.12 0L5.44 7.56a1.5 1.5 0 000 2.12l2.12 2.12a1.5 1.5 0 002.12 0L12 9.75m0 0l3.12 3.12a1.5 1.5 0 002.12 0l2.12-2.12a1.5 1.5 0 000-2.12l-2.12-2.12a1.5 1.5 0 00-2.12 0L12 9.75z" />
                  </svg>
                </div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider font-serif">24/7 Concierge</h4>
                <p className="text-[#A3A3A3] text-xs font-light max-w-[200px]">Premium operator support whenever you travel.</p>
              </div>
            </div>
          </div>

        </main>

        <Footer />
      </div>
    </div>
  );
}
