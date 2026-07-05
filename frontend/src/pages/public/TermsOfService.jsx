import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { ArrowLeft, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TermsOfService() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto px-6 py-12 md:py-20 w-full animate-fade-in relative">
        {/* Ambient Glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold/5 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Back navigation */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-sm text-neutral-400 hover:text-gold mb-8 transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
          <span>Go Back</span>
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-neutral-900 pb-6 mb-8 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-black text-white tracking-wide">Terms of Service</h1>
            <p className="text-neutral-400 text-xs mt-1">Last Updated: July 5, 2026</p>
          </div>
        </div>

        {/* Content sections */}
        <div className="flex flex-col gap-8 text-neutral-300 text-sm leading-relaxed font-light relative z-10">
          
          <section className="flex flex-col gap-2.5">
            <h2 className="text-white font-serif font-bold text-lg uppercase tracking-wider text-gold border-l-2 border-gold pl-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing, browsing, or using the TaxiTrio platform (including our website and booking systems), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these terms, you must not use or access our dispatching platform.
            </p>
          </section>

          <section className="flex flex-col gap-2.5">
            <h2 className="text-white font-serif font-bold text-lg uppercase tracking-wider text-gold border-l-2 border-gold pl-3">
              2. Booking Policy
            </h2>
            <p>
              TaxiTrio operates as a digital transportation dispatching system in Cambodia. A booking is considered active once the traveler inputs route coordinates, selects a vehicle class, and completes the checkout verification process. While we strive to match all bookings with active drivers, matches depend on current vehicle availability in the fleet.
            </p>
          </section>

          <section className="flex flex-col gap-2.5">
            <h2 className="text-white font-serif font-bold text-lg uppercase tracking-wider text-gold border-l-2 border-gold pl-3">
              3. User Responsibilities
            </h2>
            <p>
              As a user of our platform, you agree to:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-1.5 mt-1">
              <li>Provide accurate pickup and dropoff location details.</li>
              <li>Remain present at the specified pickup coordinates at the scheduled pickup time.</li>
              <li>Treat dispatch chauffeurs with respect and refrain from illegal or hazardous activities during trips.</li>
              <li>Maintain the security and secrecy of your Traveler Account password.</li>
            </ul>
          </section>

          <section className="flex flex-col gap-2.5">
            <h2 className="text-white font-serif font-bold text-lg uppercase tracking-wider text-gold border-l-2 border-gold pl-3">
              4. Payment Terms
            </h2>
            <p>
              Fares are estimated dynamically for City Rides and set at fixed base prices for Intercity Routes. All bookings require a verified payment verification step. Users must upload a valid transfer receipt (e.g., ABA Bank receipt screenshot) to confirm booking verification. Fares are processed in US Dollars (USD).
            </p>
          </section>

          <section className="flex flex-col gap-2.5">
            <h2 className="text-white font-serif font-bold text-lg uppercase tracking-wider text-gold border-l-2 border-gold pl-3">
              5. Cancellation Policy
            </h2>
            <p>
              Travelers can cancel bookings free of charge during the "Pending Payment" status phase. If a cancellation is requested after a payment is verified or after a chauffeur is dispatched, a cancellation fee may apply depending on route type. Refunds for payments are reviewed manually by administrative support staff.
            </p>
          </section>

          <section className="flex flex-col gap-2.5">
            <h2 className="text-white font-serif font-bold text-lg uppercase tracking-wider text-gold border-l-2 border-gold pl-3">
              6. Driver Responsibilities
            </h2>
            <p>
              Designated fleet drivers are required to operate clean, safe, and licensed vehicles. Drivers must follow routes provided by the mapping systems and adhere to Cambodia's transport safety laws. Drivers reserve the right to decline passengers who act aggressively, are heavily intoxicated, or refuse to comply with standard safety laws.
            </p>
          </section>

          <section className="flex flex-col gap-2.5">
            <h2 className="text-white font-serif font-bold text-lg uppercase tracking-wider text-gold border-l-2 border-gold pl-3">
              7. Limitation of Liability
            </h2>
            <p>
              TaxiTrio operates as an intermediary dispatching software between travelers and private fleet drivers. To the extent permitted by law, TaxiTrio is not liable for indirect, incidental, special, or consequential damages resulting from rides, traffic delays, property loss, or road accidents.
            </p>
          </section>

          <section className="flex flex-col gap-2.5">
            <h2 className="text-white font-serif font-bold text-lg uppercase tracking-wider text-gold border-l-2 border-gold pl-3">
              8. Privacy
            </h2>
            <p>
              Your privacy is extremely important to us. Access and use of the platform are subject to our <a href="/privacy" className="text-gold underline hover:text-[#e5c158] transition">Privacy Policy</a>, which details how we collect, process, and protect your identity and geolocational coordinates.
            </p>
          </section>

          <section className="flex flex-col gap-2.5">
            <h2 className="text-white font-serif font-bold text-lg uppercase tracking-wider text-gold border-l-2 border-gold pl-3">
              9. Governing Law
            </h2>
            <p>
              These Terms of Service and any dispute arising from the use of our services shall be governed by and construed in accordance with the laws of the Kingdom of Cambodia, without regard to conflict of law principles.
            </p>
          </section>

          <section className="flex flex-col gap-2.5">
            <h2 className="text-white font-serif font-bold text-lg uppercase tracking-wider text-gold border-l-2 border-gold pl-3">
              10. Contact Information
            </h2>
            <p>
              If you have any questions or require support regarding these Terms, please contact us on Telegram:
            </p>
            <div className="flex gap-4 mt-2">
              <a 
                href="https://t.me/sslenn8" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-4 py-2 rounded-xl bg-gold/10 border border-gold/20 text-gold text-xs font-bold hover:bg-gold/20 transition duration-150"
              >
                General Support
              </a>
              <a 
                href="https://t.me/kiki_moew_moew" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-4 py-2 rounded-xl bg-gold/10 border border-gold/20 text-gold text-xs font-bold hover:bg-gold/20 transition duration-150"
              >
                Partnerships Support
              </a>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
