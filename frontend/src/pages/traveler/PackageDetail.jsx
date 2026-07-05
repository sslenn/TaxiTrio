import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, ChevronRight, Home, MapPin } from 'lucide-react';
import GoldButton from '../../components/GoldButton';
import PackageBookingCard from '../../components/package/PackageBookingCard';
import PackageGallery from '../../components/package/PackageGallery';
import PackageHero from '../../components/package/PackageHero';
import PackageHighlights from '../../components/package/PackageHighlights';
import PackageIncludes from '../../components/package/PackageIncludes';
import PackageMap from '../../components/package/PackageMap';
import PackageReviews from '../../components/package/PackageReviews';
import PackageTimeline from '../../components/package/PackageTimeline';
import RelatedPackages from '../../components/package/RelatedPackages';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { getPackageById } from '../../service/packageService';
import {
  findDestinationByParams,
  getNearbyDestinations,
  getSimilarDestinations,
} from '../../data/cambodiaDestinations';

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const getPackageImage = (name = '') => {
  const key = name.toLowerCase();
  if (key.includes('angkor')) return '/images/gallery_angkor1.jpg';
  if (key.includes('kampot')) return '/images/gallery_angkor2.jpg';
  if (key.includes('kep')) return 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Crab_statue_Kep_Cambodia.jpg';
  if (key.includes('phnom penh') || key.includes('heritage')) return '/images/gallery_angkor3.jpg';
  
  // Explicit mappings for Pailin/Phnom Yat, Pursat/Cardamom, Stung Treng/Ramsar, Kompong Cham/Bamboo
  if (key.includes('phnom yat') || key.includes('pailin')) return 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Wat_Phnom_Yat%2C_Pailin.jpg';
  if (key.includes('pursat') || key.includes('cardamom')) return 'https://upload.wikimedia.org/wikipedia/commons/5/52/Tonle_Sap_floating_village_houses.jpg';
  if (key.includes('stung treng') || key.includes('ramsar')) return 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Mekong_flooded_forest_Stung_Treng.jpg';
  if (key.includes('kompong cham') || key.includes('bamboo')) return 'https://upload.wikimedia.org/wikipedia/commons/0/09/Kompong_Cham%2C_Bamboo_Bridge%2C_Cambodia.jpg';
  
  return '/images/gallery_angkor1.jpg';
};

const mapDbPackageToTour = (p) => {
  const pSlug = slugify(p.province || 'cambodia');
  const dSlug = slugify(p.name || 'package');
  const imgUrl = p.image_url || getPackageImage(p.name);
  
  return {
    id: p.id,
    province: p.province || 'Cambodia',
    provinceSlug: pSlug,
    destination: p.name,
    destinationSlug: dSlug,
    title: p.name,
    category: 'Custom Package',
    categories: ['Custom', 'Private'],
    shortDescription: p.description,
    description: p.description,
    price: Number(p.price) || 0,
    durationDays: p.duration_days,
    suggestedDuration: `${p.duration_days} day(s)`,
    maxPersons: p.max_persons,
    cardImage: { src: imgUrl, alt: p.name },
    image: imgUrl,
    heroImage: imgUrl,
    routePath: `/traveler/packages/${p.id}`,
    isDbPackage: true,
    highlights: [
      'Flexible private touring',
      'Personalized itinerary coordination',
      'Professional driver service',
      'Door-to-door transportation'
    ],
    itinerary: [
      { day: 1, title: 'Arrival & Destination Exploration', description: p.description, image: imgUrl }
    ],
    includedItems: ['Private Air-Conditioned Vehicle', 'Professional Local Driver', 'Fuel & Toll Fees', 'Bottled Cold Water'],
    excludedItems: ['Attraction Entrance Tickets', 'Meals & Drinks', 'Personal Expenses', 'Accommodation'],
    galleryImages: [{ src: imgUrl, alt: p.name }],
    reviews: { rating: 5.0, count: 0, breakdown: [0, 0, 0, 0, 0], list: [] },
    vehicle: { type: 'Premium Sedan/SUV', description: 'Air-conditioned premium vehicle' },
    nearbyProvinces: []
  };
};

export default function PackageDetail() {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const showPublicHeader = !location.pathname.startsWith('/traveler');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const staticTour = findDestinationByParams(params);
    if (staticTour) {
      setTour(staticTour);
      setLoading(false);
    } else if (params.id) {
      setLoading(true);
      // Fetch DB Package
      getPackageById(params.id)
        .then((res) => {
          if (res.data?.data) {
            setTour(mapDbPackageToTour(res.data.data));
          } else {
            setTour(null);
          }
        })
        .catch((err) => {
          console.error('Error loading package detail:', err);
          setTour(null);
        })
        .finally(() => setLoading(false));
    } else {
      setTour(null);
      setLoading(false);
    }
  }, [params]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-3">
        <span className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin"></span>
        <p className="text-[#A3A3A3] text-xs uppercase tracking-widest">Loading Tour Details...</p>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center gap-5 text-center">
        <span className="rounded-full border border-gold/25 bg-gold/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-gold">
          Destination Missing
        </span>
        <h1 className="font-serif text-4xl font-black text-white">Tour Not Found</h1>
        <p className="text-sm font-light leading-7 text-neutral-400">
          This destination is not available in the Cambodia tour catalog.
        </p>
        <GoldButton onClick={() => navigate('/tours')}>Explore Tours</GoldButton>
      </div>
    );
  }

  const similarTours = getSimilarDestinations(tour, 6);
  const nearbyTours = getNearbyDestinations(tour, 4);

  const scrollToBooking = () => {
    document.getElementById('booking-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <>
      {showPublicHeader && <Navbar />}

      <div className={`mx-auto flex w-full max-w-7xl flex-col gap-8 pb-14 ${showPublicHeader ? 'pt-8 px-4 md:px-8' : ''}`}>
        {/* Navigation Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(location.pathname.startsWith('/traveler') ? '/traveler/book/package' : '/tours')}
              className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-gold transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
              <span>Back to Tours</span>
            </button>

            <span className="h-4 w-px bg-white/10" />

            <button
              onClick={() => navigate(location.pathname.startsWith('/traveler') ? '/traveler' : '/')}
              className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-gold transition-colors duration-200"
            >
              <Home className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
              <span>Go Back Home</span>
            </button>
          </div>
        </div>

        <PackageHero
          name={tour.title}
          description={tour.shortDescription}
          durationDays={tour.durationDays}
          maxPersons={tour.maxPersons}
          province={tour.province}
          destination={tour.destination}
          bannerImage={tour.heroImage}
          price={tour.price}
          rating={tour.rating}
          onBookClick={scrollToBooking}
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <main className="flex min-w-0 flex-col gap-10">
            <motion.section
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="rounded-2xl border border-white/10 bg-[#121212] p-6 md:p-8"
            >
              <SectionHeading eyebrow="Overview" title="Why Visit" />
              <p className="mt-5 text-sm font-light leading-8 text-neutral-300 md:text-base">
                {tour.description}
              </p>
            </motion.section>

            <PackageHighlights highlights={tour.highlights} />
            <PackageTimeline itinerary={tour.itinerary} />
            <PackageIncludes includedItems={tour.includedItems} excludedItems={tour.excludedItems} />
            <PackageGallery galleryImages={tour.galleryImages} />
            <PackageReviews
              rating={tour.reviews.rating}
              count={tour.reviews.count}
              breakdown={tour.reviews.breakdown}
              reviewsList={tour.reviews.list}
            />
            <PackageMap tour={tour} />
          </main>

          <PackageBookingCard
            packageId={tour.id}
            tour={tour}
            price={tour.price}
            durationDays={tour.durationDays}
            maxPersons={tour.maxPersons}
            vehicle={tour.vehicle}
          />
        </div>

        <RelatedPackages title="Similar Tours" tours={similarTours} />
        <ProvinceNavigation currentTour={tour} tours={nearbyTours} />
      </div>

      {showPublicHeader && <Footer />}
    </>
  );
}

function SectionHeading({ eyebrow, title }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-black uppercase tracking-[0.28em] text-gold">{eyebrow}</span>
      <h2 className="border-l-2 border-gold pl-3 font-serif text-2xl font-bold text-white">{title}</h2>
    </div>
  );
}

function ProvinceNavigation({ currentTour, tours }) {
  const navigate = useNavigate();

  if (!tours.length) return null;

  return (
    <section className="rounded-2xl border border-white/10 bg-[#101010] p-5 md:p-6">
      <div className="mb-5 flex flex-col gap-1">
        <span className="text-[10px] font-black uppercase tracking-[0.28em] text-gold">Explore More Destinations</span>
        <h2 className="font-serif text-2xl font-bold text-white">
          Nearby from {currentTour.province}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        {tours.map((tour, index) => (
          <button
            key={tour.id}
            type="button"
            onClick={() => navigate(tour.routePath)}
            className="group flex items-center justify-between rounded-2xl border border-white/10 bg-black/25 p-4 text-left transition duration-300 hover:border-gold/45 hover:bg-gold/5"
          >
            <span className="flex min-w-0 flex-col">
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                <MapPin className="h-3.5 w-3.5 text-gold" />
                Stop {index + 1}
              </span>
              <span className="truncate font-serif text-lg font-bold text-white">{tour.province}</span>
              <span className="truncate text-xs text-neutral-400">{tour.destination}</span>
            </span>
            {index < tours.length - 1 ? (
              <ChevronRight className="h-5 w-5 shrink-0 text-gold" />
            ) : (
              <ArrowUpRight className="h-5 w-5 shrink-0 text-gold" />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
