import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { ArrowLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PrivacyPolicy() {
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
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-black text-white tracking-wide">Privacy Policy</h1>
            <p className="text-neutral-400 text-xs mt-1">Last Updated: July 5, 2026</p>
          </div>
        </div>

        {/* Content sections */}
        <div className="flex flex-col gap-8 text-neutral-300 text-sm leading-relaxed font-light relative z-10">
          
          <section className="flex flex-col gap-2.5">
            <h2 className="text-white font-serif font-bold text-lg uppercase tracking-wider text-gold border-l-2 border-gold pl-3">
              1. Introduction
            </h2>
            <p>
              Welcome to TaxiTrio. We are committed to protecting your personal data and respecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, mobile application, and transportation booking services. By using our service, you consent to the data practices described in this policy.
            </p>
          </section>

          <section className="flex flex-col gap-2.5">
            <h2 className="text-white font-serif font-bold text-lg uppercase tracking-wider text-gold border-l-2 border-gold pl-3">
              2. Information We Collect
            </h2>
            <p>
              We collect information that identifies, relates to, describes, or could reasonably be linked with you. This includes:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-1.5 mt-1">
              <li><strong>Personal Identifiers:</strong> Name, email address, phone number, and account login details.</li>
              <li><strong>Geolocational Data:</strong> Real-time pickup and dropoff coordinates, route histories, and active tracking data for dispatching.</li>
              <li><strong>Payment Records:</strong> Transaction details, bank transfer screenshots, ABA receipt proofs, and payment confirmations. We do not store raw credit card details on our servers.</li>
              <li><strong>Device Info:</strong> IP addresses, browser types, and usage data collected automatically during visits.</li>
            </ul>
          </section>

          <section className="flex flex-col gap-2.5">
            <h2 className="text-white font-serif font-bold text-lg uppercase tracking-wider text-gold border-l-2 border-gold pl-3">
              3. How We Use Your Information
            </h2>
            <p>
              The information we collect is used to power our booking system, including:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-1.5 mt-1">
              <li>Processing and managing your city and intercity transfer bookings.</li>
              <li>Connecting traveler accounts with designated fleet drivers.</li>
              <li>Verifying ABA Bank transfers and payment uploads.</li>
              <li>Sending ride updates, arrival notifications, and driver details.</li>
              <li>Improving website speed, map routing precision, and passenger safety.</li>
            </ul>
          </section>

          <section className="flex flex-col gap-2.5">
            <h2 className="text-white font-serif font-bold text-lg uppercase tracking-wider text-gold border-l-2 border-gold pl-3">
              4. Cookies & Tracking
            </h2>
            <p>
              We use cookies and similar tracking technologies to track activity on our platform and hold session information. Cookies help us keep you logged in, remember your preferences, and understand route searches to enhance performance. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
          </section>

          <section className="flex flex-col gap-2.5">
            <h2 className="text-white font-serif font-bold text-lg uppercase tracking-wider text-gold border-l-2 border-gold pl-3">
              5. User Account Data
            </h2>
            <p>
              Your account details are securely encrypted on our servers. Passwords are hashed using bcrypt before database storage. Travelers, drivers, and administrators have specific access controls to ensure data segregation. You are responsible for maintaining the confidentiality of your login credentials.
            </p>
          </section>

          <section className="flex flex-col gap-2.5">
            <h2 className="text-white font-serif font-bold text-lg uppercase tracking-wider text-gold border-l-2 border-gold pl-3">
              6. Data Security
            </h2>
            <p>
              We implement industry-standard administrative, technical, and physical security measures designed to protect your personal information from unauthorized access, loss, misuse, or alteration. While we strive to use commercially acceptable means to protect your personal data, no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section className="flex flex-col gap-2.5">
            <h2 className="text-white font-serif font-bold text-lg uppercase tracking-wider text-gold border-l-2 border-gold pl-3">
              7. Third-Party Services
            </h2>
            <p>
              We may utilize third-party integrations (e.g., OpenStreetMap, Nominatim, and OSRM for maps and route calculation). These services only receive coordinates necessary to generate geographic routes and do not store personal account profiles. We do not sell or trade passenger travel histories.
            </p>
          </section>

          <section className="flex flex-col gap-2.5">
            <h2 className="text-white font-serif font-bold text-lg uppercase tracking-wider text-gold border-l-2 border-gold pl-3">
              8. User Rights
            </h2>
            <p>
              You have the right to access, update, or request deletion of your personal account information at any time. You can modify profile details directly in your Traveler Dashboard or contact our support team to request permanent account termination.
            </p>
          </section>

          <section className="flex flex-col gap-2.5">
            <h2 className="text-white font-serif font-bold text-lg uppercase tracking-wider text-gold border-l-2 border-gold pl-3">
              9. Contact Information
            </h2>
            <p>
              For questions, clarifications, or concerns regarding your private data and this policy, please reach out to our team via Telegram:
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
