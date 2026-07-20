import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { ArrowLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../context/LanguageContext';
import { privacyTranslations } from './privacyTranslations';
import { useTranslatedDoc } from '../../utils/useTranslatedDoc';

export default function PrivacyPolicy() {
  const navigate = useNavigate();
  const { locale } = useTranslation();

  // Dynamically translate the document if the locale is not hardcoded
  const dynamicDoc = useTranslatedDoc('privacy', privacyTranslations['en'], locale);

  // Get active translation dictionary or fallback to dynamic translated / English
  const tDoc = privacyTranslations[locale] || dynamicDoc || privacyTranslations['en'];

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
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-black text-white tracking-wide">{tDoc.title}</h1>
            <p className="text-neutral-400 text-xs mt-1">{tDoc.lastUpdated}</p>
          </div>
        </div>

        {/* Content sections */}
        <div className="flex flex-col gap-8 text-neutral-300 text-sm leading-relaxed font-light relative z-10">
          
          {/* Section 1: Introduction */}
          <section className="flex flex-col gap-2.5">
            <h2 className="text-white font-serif font-bold text-lg uppercase tracking-wider text-gold border-l-2 border-gold pl-3">
              {tDoc.introduction.title}
            </h2>
            <p>{tDoc.introduction.text}</p>
          </section>

          {/* Section 2: Information We Collect */}
          <section className="flex flex-col gap-2.5">
            <h2 className="text-white font-serif font-bold text-lg uppercase tracking-wider text-gold border-l-2 border-gold pl-3">
              {tDoc.collect.title}
            </h2>
            <p>{tDoc.collect.text}</p>
            <ul className="list-disc pl-5 flex flex-col gap-1.5 mt-1">
              {tDoc.collect.items.map((item, i) => {
                const parts = item.split(':');
                if (parts.length > 1) {
                  return (
                    <li key={i}>
                      <strong>{parts[0]}:</strong>{parts.slice(1).join(':')}
                    </li>
                  );
                }
                return <li key={i}>{item}</li>;
              })}
            </ul>
          </section>

          {/* Section 3: How We Use Your Information */}
          <section className="flex flex-col gap-2.5">
            <h2 className="text-white font-serif font-bold text-lg uppercase tracking-wider text-gold border-l-2 border-gold pl-3">
              {tDoc.use.title}
            </h2>
            <p>{tDoc.use.text}</p>
            <ul className="list-disc pl-5 flex flex-col gap-1.5 mt-1">
              {tDoc.use.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>

          {/* Section 4: Cookies & Tracking */}
          <section className="flex flex-col gap-2.5">
            <h2 className="text-white font-serif font-bold text-lg uppercase tracking-wider text-gold border-l-2 border-gold pl-3">
              {tDoc.cookies.title}
            </h2>
            <p>{tDoc.cookies.text}</p>
          </section>

          {/* Section 5: User Account Data */}
          <section className="flex flex-col gap-2.5">
            <h2 className="text-white font-serif font-bold text-lg uppercase tracking-wider text-gold border-l-2 border-gold pl-3">
              {tDoc.account.title}
            </h2>
            <p>{tDoc.account.text}</p>
          </section>

          {/* Section 6: Data Security */}
          <section className="flex flex-col gap-2.5">
            <h2 className="text-white font-serif font-bold text-lg uppercase tracking-wider text-gold border-l-2 border-gold pl-3">
              {tDoc.security.title}
            </h2>
            <p>{tDoc.security.text}</p>
          </section>

          {/* Section 7: Third-Party Services */}
          <section className="flex flex-col gap-2.5">
            <h2 className="text-white font-serif font-bold text-lg uppercase tracking-wider text-gold border-l-2 border-gold pl-3">
              {tDoc.thirdParty.title}
            </h2>
            <p>{tDoc.thirdParty.text}</p>
          </section>

          {/* Section 8: User Rights */}
          <section className="flex flex-col gap-2.5">
            <h2 className="text-white font-serif font-bold text-lg uppercase tracking-wider text-gold border-l-2 border-gold pl-3">
              {tDoc.rights.title}
            </h2>
            <p>{tDoc.rights.text}</p>
          </section>

          {/* Section 9: Contact Information */}
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
