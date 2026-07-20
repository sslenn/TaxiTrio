import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { ArrowLeft, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../context/LanguageContext';
import { termsTranslations } from './termsTranslations';
import { useTranslatedDoc } from '../../utils/useTranslatedDoc';

export default function TermsOfService() {
  const navigate = useNavigate();
  const { locale } = useTranslation();

  // Dynamically translate the document if the locale is not hardcoded
  const dynamicDoc = useTranslatedDoc('terms', termsTranslations['en'], locale);

  // Get active translation dictionary or fallback to dynamic translated / English
  const tDoc = termsTranslations[locale] || dynamicDoc || termsTranslations['en'];

  // Robust parsing to embed the Privacy Policy link in different languages
  const renderPrivacyParagraph = () => {
    const text = tDoc.privacy.text;
    if (locale === 'km') {
      const parts = text.split('គោលការណ៍ឯកជនភាព');
      return (
        <p>
          {parts[0]}
          <a href="/privacy" className="text-gold underline hover:text-[#e5c158] transition">គោលការណ៍ឯកជនភាព</a>
          {parts[1]}
        </p>
      );
    } else if (locale === 'zh') {
      const parts = text.split('隐私政策');
      return (
        <p>
          {parts[0]}
          <a href="/privacy" className="text-gold underline hover:text-[#e5c158] transition">隐私政策</a>
          {parts[1]}
        </p>
      );
    } else if (locale === 'ko') {
      const parts = text.split('개인정보 처리방침');
      return (
        <p>
          {parts[0]}
          <a href="/privacy" className="text-gold underline hover:text-[#e5c158] transition">개인정보 처리방침</a>
          {parts[1]}
        </p>
      );
    } else {
      const parts = text.split('Privacy Policy');
      return (
        <p>
          {parts[0]}
          <a href="/privacy" className="text-gold underline hover:text-[#e5c158] transition">Privacy Policy</a>
          {parts[1]}
        </p>
      );
    }
  };

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
          <span>{tDoc.goBack}</span>
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-neutral-900 pb-6 mb-8 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-black text-white tracking-wide">{tDoc.title}</h1>
            <p className="text-neutral-400 text-xs mt-1">{tDoc.lastUpdated}</p>
          </div>
        </div>

        {/* Content sections */}
        <div className="flex flex-col gap-8 text-neutral-300 text-sm leading-relaxed font-light relative z-10">
          
          {/* Section 1: Acceptance of Terms */}
          <section className="flex flex-col gap-2.5">
            <h2 className="text-white font-serif font-bold text-lg uppercase tracking-wider text-gold border-l-2 border-gold pl-3">
              {tDoc.acceptance.title}
            </h2>
            <p>{tDoc.acceptance.text}</p>
          </section>

          {/* Section 2: Booking Policy */}
          <section className="flex flex-col gap-2.5">
            <h2 className="text-white font-serif font-bold text-lg uppercase tracking-wider text-gold border-l-2 border-gold pl-3">
              {tDoc.booking.title}
            </h2>
            <p>{tDoc.booking.text}</p>
          </section>

          {/* Section 3: User Responsibilities */}
          <section className="flex flex-col gap-2.5">
            <h2 className="text-white font-serif font-bold text-lg uppercase tracking-wider text-gold border-l-2 border-gold pl-3">
              {tDoc.userResponsibility.title}
            </h2>
            <p>{tDoc.userResponsibility.text}</p>
            <ul className="list-disc pl-5 flex flex-col gap-1.5 mt-1">
              {tDoc.userResponsibility.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>

          {/* Section 4: Payment Terms */}
          <section className="flex flex-col gap-2.5">
            <h2 className="text-white font-serif font-bold text-lg uppercase tracking-wider text-gold border-l-2 border-gold pl-3">
              {tDoc.payment.title}
            </h2>
            <p>{tDoc.payment.text}</p>
          </section>

          {/* Section 5: Cancellation Policy */}
          <section className="flex flex-col gap-2.5">
            <h2 className="text-white font-serif font-bold text-lg uppercase tracking-wider text-gold border-l-2 border-gold pl-3">
              {tDoc.cancellation.title}
            </h2>
            <p>{tDoc.cancellation.text}</p>
          </section>

          {/* Section 6: Driver Responsibilities */}
          <section className="flex flex-col gap-2.5">
            <h2 className="text-white font-serif font-bold text-lg uppercase tracking-wider text-gold border-l-2 border-gold pl-3">
              {tDoc.driverResponsibility.title}
            </h2>
            <p>{tDoc.driverResponsibility.text}</p>
          </section>

          {/* Section 7: Limitation of Liability */}
          <section className="flex flex-col gap-2.5">
            <h2 className="text-white font-serif font-bold text-lg uppercase tracking-wider text-gold border-l-2 border-gold pl-3">
              {tDoc.liability.title}
            </h2>
            <p>{tDoc.liability.text}</p>
          </section>

          {/* Section 8: Privacy */}
          <section className="flex flex-col gap-2.5">
            <h2 className="text-white font-serif font-bold text-lg uppercase tracking-wider text-gold border-l-2 border-gold pl-3">
              {tDoc.privacy.title}
            </h2>
            {renderPrivacyParagraph()}
          </section>

          {/* Section 9: Governing Law */}
          <section className="flex flex-col gap-2.5">
            <h2 className="text-white font-serif font-bold text-lg uppercase tracking-wider text-gold border-l-2 border-gold pl-3">
              {tDoc.law.title}
            </h2>
            <p>{tDoc.law.text}</p>
          </section>

          {/* Section 10: Contact Information */}
          <section className="flex flex-col gap-2.5">
            <h2 className="text-white font-serif font-bold text-lg uppercase tracking-wider text-gold border-l-2 border-gold pl-3">
              {tDoc.contact.title}
            </h2>
            <p>{tDoc.contact.text}</p>
            <div className="flex gap-4 mt-2">
              <a 
                href="https://t.me/sslenn8" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-4 py-2 rounded-xl bg-gold/10 border border-gold/20 text-gold text-xs font-bold hover:bg-gold/20 transition duration-150"
              >
                {tDoc.contact.generalSupport}
              </a>
              <a 
                href="https://t.me/kiki_moew_moew" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-4 py-2 rounded-xl bg-gold/10 border border-gold/20 text-gold text-xs font-bold hover:bg-gold/20 transition duration-150"
              >
                {tDoc.contact.partnershipSupport}
              </a>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
