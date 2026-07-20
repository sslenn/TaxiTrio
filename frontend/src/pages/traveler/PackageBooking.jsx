import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, Sparkles, ArrowLeft } from 'lucide-react';
import TourCard from '../../components/tour/TourCard';
import TourPublicHeader from '../../components/tour/TourPublicHeader';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { getPackages } from '../../service/packageService';
import { TOUR_CATEGORIES, cambodiaDestinations } from '../../data/cambodiaDestinations';
import { useTranslation } from '../../context/LanguageContext';

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

const sortOptions = [
  { value: 'popular', label: 'Popularity' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'duration', label: 'Duration' },
  { value: 'alphabetical', label: 'Alphabetical' },
];

export default function PackageBooking() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState('All');
  const [provinceSearch, setProvinceSearch] = useState('');
  const [destinationSearch, setDestinationSearch] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [dbPackages, setDbPackages] = useState([]);
  const { locale } = useTranslation();

  useEffect(() => {
    getPackages()
      .then((res) => {
        setDbPackages(res.data?.data?.filter((p) => p.is_active) || []);
      })
      .catch((err) => console.error('Failed to load db packages:', err));
  }, [locale]);

  const filteredTours = useMemo(() => {
    const provinceQuery = provinceSearch.trim().toLowerCase();
    const destinationQuery = destinationSearch.trim().toLowerCase();

    const mappedDbPackages = dbPackages.map((p) => {
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
        categories: ['Custom', 'Private', 'All'],
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
        popularity: 1,
        nearbyProvinces: []
      };
    });

    return [...cambodiaDestinations, ...mappedDbPackages]
      .filter((tour) => {
        const matchesCategory = activeCategory === 'All' || tour.categories.includes(activeCategory);
        const matchesProvince = !provinceQuery || tour.province.toLowerCase().includes(provinceQuery);
        const matchesDestination =
          !destinationQuery ||
          tour.destination.toLowerCase().includes(destinationQuery) ||
          tour.title.toLowerCase().includes(destinationQuery) ||
          tour.shortDescription.toLowerCase().includes(destinationQuery);

        return matchesCategory && matchesProvince && matchesDestination;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'duration') return a.durationDays - b.durationDays || a.price - b.price;
        if (sortBy === 'alphabetical') return a.province.localeCompare(b.province);
        return b.popularity - a.popularity;
      });
  }, [activeCategory, destinationSearch, provinceSearch, sortBy, dbPackages]);

  const handleSelectTour = (tour) => {
    navigate(tour.routePath);
  };

  const showPublicHeader = !location.pathname.startsWith('/traveler');

  return (
    <>
      {showPublicHeader && <Navbar />}

      <div className={`mx-auto flex w-full max-w-7xl flex-col gap-8 pb-12 ${showPublicHeader ? 'pt-8 px-4 md:px-8' : ''}`}>

        {/* Back to Home Button */}
        <button
          onClick={() => navigate(location.pathname.startsWith('/traveler') ? '/traveler' : '/')}
          className="group flex w-fit items-center gap-2 text-sm text-neutral-400 hover:text-gold transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
          <span>Back to Home</span>
        </button>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0A] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] md:p-10"
      >
        <div className="absolute inset-0">
          <img
            src="/images/gallery_angkor1.jpg"
            alt="Cambodia temple landscape"
            className="h-full w-full object-cover opacity-35"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/85 to-[#0A0A0A]/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 flex max-w-4xl flex-col gap-5">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-gold/35 bg-gold/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.28em] text-gold">
            <Sparkles className="h-3.5 w-3.5" />
            Cambodia Private Touring
          </span>
          <div className="flex flex-col gap-3">
            <h1 className="font-serif text-4xl font-black leading-tight text-white md:text-6xl">
              Tour Packages
            </h1>
            <p className="max-w-2xl text-sm font-light leading-7 text-neutral-300 md:text-base">
              A complete premium destination collection across Cambodia 25 administrative regions, curated for private
              drivers, elegant routing, cultural depth, and comfortable travel.
            </p>
          </div>
          <div className="grid max-w-2xl grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl border border-white/10 bg-black/45 p-4 backdrop-blur-md">
              <span className="block font-serif text-2xl font-black text-white">25</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Regions</span>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/45 p-4 backdrop-blur-md">
              <span className="block font-serif text-2xl font-black text-white">12</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Styles</span>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/45 p-4 backdrop-blur-md">
              <span className="block font-serif text-2xl font-black text-white">4.8</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Average</span>
            </div>
          </div>
        </div>
      </motion.section>

      <section className="rounded-2xl border border-white/10 bg-[#111111] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.25)] md:p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/25 bg-gold/10 text-gold">
              <SlidersHorizontal className="h-4 w-4" />
            </span>
            <div>
              <h2 className="font-serif text-xl font-bold text-white">Explore Cambodia</h2>
              <p className="text-xs text-neutral-500">{filteredTours.length} curated destinations available</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_220px]">
          <label className="relative block">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gold">
              <Search className="h-4 w-4" />
            </span>
            <input
              value={provinceSearch}
              onChange={(event) => setProvinceSearch(event.target.value)}
              placeholder="Search by province"
              className="input-premium h-12 !pl-12 text-sm"
            />
          </label>

          <label className="relative block">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gold">
              <Search className="h-4 w-4" />
            </span>
            <input
              value={destinationSearch}
              onChange={(event) => setDestinationSearch(event.target.value)}
              placeholder="Search by destination"
              className="input-premium h-12 !pl-12 text-sm"
            />
          </label>

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="input-premium h-12 text-sm"
            aria-label="Sort tour packages"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
          {TOUR_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`shrink-0 rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-widest transition ${
                activeCategory === category
                  ? 'border-gold bg-gold text-black shadow-[0_8px_24px_rgba(212,175,55,0.22)]'
                  : 'border-white/10 text-neutral-400 hover:border-gold/40 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {filteredTours.length > 0 ? (
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredTours.map((tour, index) => (
            <TourCard key={tour.id} tour={tour} index={index} onSelect={handleSelectTour} />
          ))}
        </section>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-[#111111] p-12 text-center">
          <h3 className="font-serif text-2xl font-bold text-white">No matching destinations</h3>
          <p className="mt-2 text-sm text-neutral-400">Try another province, destination, or category.</p>
        </div>
      )}
      </div>

      {showPublicHeader && <Footer />}
    </>
  );
}
