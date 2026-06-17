import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPackageById, getPackages } from '../../service/packageService';
import PackageHero from '../../components/package/PackageHero';
import PackageTimeline from '../../components/package/PackageTimeline';
import PackageGallery from '../../components/package/PackageGallery';
import PackageIncludes from '../../components/package/PackageIncludes';
import PackageBookingCard from '../../components/package/PackageBookingCard';
import PackageReviews from '../../components/package/PackageReviews';
import RelatedPackages from '../../components/package/RelatedPackages';
import PageHeader from '../../components/PageHeader';
import GoldButton from '../../components/GoldButton';

// Detailed package-specific mock enhancements for gallery, itinerary, reviews, inclusions, and exclusions
const ENHANCED_DETAILS = {
  angkor: {
    province: 'Siem Reap',
    vehicle: 'VIP Minivan',
    bannerImage: '/images/tour_package.jpg',
    galleryImages: [
      '/images/gallery_angkor1.jpg',
      '/images/gallery_angkor2.jpg',
      '/images/gallery_angkor3.jpg',
      '/images/gallery_angkor4.jpg',
    ],
    itinerary: [
      { time: '04:30 AM', title: 'Hotel Pickup', desc: 'Direct pickup from your Siem Reap hotel in an air-conditioned VIP vehicle.' },
      { time: '05:15 AM', title: 'Angkor Wat Sunrise', desc: 'Watch the sunrise behind the iconic towers of Angkor Wat, perfect for photos.' },
      { time: '08:00 AM', title: 'Bayon Temple', desc: 'Explore the mesmerizing smiling stone faces of the Bayon Temple in Angkor Thom.' },
      { time: '10:30 AM', title: 'Ta Prohm Temple', desc: 'Discover the "Tomb Raider" temple, famous for giant tree roots growing over ruins.' },
      { time: '12:00 PM', title: 'Return Transfer', desc: 'Relax on a comfortable transfer back to your hotel or city center.' }
    ],
    includedItems: [
      'Private Transportation',
      'Professional Driver',
      'Fuel & Taxes Included',
      'Chilled Bottled Water',
      'Tolls & Parking Fees',
      'Hotel Pickup & Drop-off'
    ],
    excludedItems: [
      'Angkor Temple Pass ($37/person)',
      'Professional Tour Guide (Optional)',
      'Lunch & Personal Expenses',
      'Traveler Insurance'
    ],
    reviews: {
      rating: 4.9,
      count: 126,
      list: [
        { name: 'Sarah M.', rating: 5, date: 'June 10, 2026', comment: 'The sunrise was breathtaking. The driver arrived precisely on time and the minivan was spotless!' },
        { name: 'David L.', rating: 5, date: 'May 28, 2026', comment: 'Highly recommended! Having a private driver made navigating Angkor Thom and Ta Prohm completely stress-free.' }
      ]
    }
  },
  kampot: {
    province: 'Kampot',
    vehicle: 'Luxury SUV',
    bannerImage: '/images/intercity_transfer.jpg',
    galleryImages: [
      '/images/intercity_transfer.jpg',
      '/images/city_ride.jpg',
      '/images/tour_package.jpg',
      '/images/custom_trip.jpg',
    ],
    itinerary: [
      { time: '08:00 AM', title: 'Hotel Pickup', desc: 'Depart from your hotel in our premium, high-clearance SUV.' },
      { time: '09:30 AM', title: 'Pepper Farm Tour', desc: 'Explore a local organic pepper farm and taste the world-famous Kampot pepper.' },
      { time: '12:00 PM', title: 'Salt Fields', desc: 'See the salt production fields (seasonal) and learn about the local industry.' },
      { time: '02:00 PM', title: 'Bokor Mountain', desc: 'Drive up the winding roads of Bokor Mountain to explore the historic hill station.' },
      { time: '05:30 PM', title: 'Return Transfer', desc: 'Head back to your hotel after a full day of exploration.' }
    ],
    includedItems: [
      'Private SUV Transportation',
      'Vetted Professional Driver',
      'Fuel & Tolls Included',
      'Chilled Bottled Water',
      'Hotel Pickup & Drop-off'
    ],
    excludedItems: [
      'Farm Admission Fees (if any)',
      'Lunch & Refreshments',
      'Personal Souvenirs',
      'Travel Insurance'
    ],
    reviews: {
      rating: 4.8,
      count: 84,
      list: [
        { name: 'Thomas K.', rating: 5, date: 'June 2, 2026', comment: 'Amazing trip. The Bokor mountain road has spectacular views and our SUV was very comfortable.' },
        { name: 'Elena R.', rating: 4, date: 'May 15, 2026', comment: 'Loved the organic pepper farm. Friendly driver who pointed out interesting landmarks along the way.' }
      ]
    }
  },
  kep: {
    province: 'Kep',
    vehicle: 'Comfort Sedan',
    bannerImage: '/images/city_ride.jpg',
    galleryImages: [
      '/images/city_ride.jpg',
      '/images/intercity_transfer.jpg',
      '/images/tour_package.jpg',
      '/images/custom_trip.jpg',
    ],
    itinerary: [
      { time: '08:30 AM', title: 'Hotel Pickup', desc: 'Pickup in our elegant, comfortable sedan.' },
      { time: '10:00 AM', title: 'Kep Crab Market', desc: 'Visit the famous seaside Crab Market and watch fresh catches brought in.' },
      { time: '12:00 PM', title: 'Kep Beach & Seafood Lunch', desc: 'Relax by the white sand beach and enjoy fresh local seafood.' },
      { time: '02:30 PM', title: 'Kep National Park Walk', desc: 'Take a short scenic walk through the lush national park trails.' },
      { time: '05:00 PM', title: 'Return Transfer', desc: 'Smooth return drive to your hotel.' }
    ],
    includedItems: [
      'Private Sedan Transportation',
      'Vetted Driver',
      'Fuel & Parking Fees',
      'Chilled Bottled Water',
      'Hotel Pickup & Drop-off'
    ],
    excludedItems: [
      'Crab & Seafood Meals',
      'National Park Entry Fee',
      'Personal Expenses',
      'Travel Insurance'
    ],
    reviews: {
      rating: 4.7,
      count: 62,
      list: [
        { name: 'Chanthou S.', rating: 5, date: 'June 12, 2026', comment: 'Best crab I have ever had! The driver knew the perfect seafood restaurant and gave excellent recommendations.' }
      ]
    }
  },
  phnom_penh: {
    province: 'Phnom Penh',
    vehicle: 'Executive Sedan',
    bannerImage: '/images/custom_trip.jpg',
    galleryImages: [
      '/images/custom_trip.jpg',
      '/images/city_ride.jpg',
      '/images/intercity_transfer.jpg',
      '/images/tour_package.jpg',
    ],
    itinerary: [
      { time: '08:00 AM', title: 'Hotel Pickup', desc: 'Prompt hotel pickup by our professional driver.' },
      { time: '08:30 AM', title: 'Royal Palace & Silver Pagoda', desc: 'Visit the magnificent residence of the King of Cambodia.' },
      { time: '10:30 AM', title: 'National Museum', desc: 'Explore historical Khmer art, sculptures, and artifacts.' },
      { time: '01:30 PM', title: 'Wat Phnom & Independence Monument', desc: 'Visit the city landmark temple and iconic monument.' },
      { time: '04:00 PM', title: 'Return Transfer', desc: 'Drop-off back at your hotel.' }
    ],
    includedItems: [
      'Private Sedan Transportation',
      'Professional Driver',
      'Fuel & Parking',
      'Cold Bottled Water',
      'Hotel Pickup & Drop-off'
    ],
    excludedItems: [
      'Palace & Museum Entry Tickets',
      'Guide Fees',
      'Lunch & Snacks'
    ],
    reviews: {
      rating: 4.9,
      count: 95,
      list: [
        { name: 'Julie B.', rating: 5, date: 'June 5, 2026', comment: 'Stunning palace. Our driver was very polite and navigated the city traffic beautifully.' }
      ]
    }
  }
};

// Default template fallback for custom created admin packages
const DEFAULT_ENHANCEMENT = {
  province: 'Cambodia',
  vehicle: 'Premium SUV',
  bannerImage: '/images/tour_package.jpg',
  galleryImages: [
    '/images/tour_package.jpg',
    '/images/city_ride.jpg',
    '/images/intercity_transfer.jpg',
    '/images/custom_trip.jpg',
  ],
  itinerary: [
    { time: '08:00 AM', title: 'Hotel Pickup', desc: 'Departure from your hotel in premium private vehicle.' },
    { time: '10:00 AM', title: 'Morning Exploration', desc: 'Sightseeing and stopovers at key local landmarks.' },
    { time: '12:00 PM', title: 'Leisure Break', desc: 'Time for local lunch and refreshment stops.' },
    { time: '02:00 PM', title: 'Afternoon Discovery', desc: 'Visit cultural heritage spots and explore scenic viewpoints.' },
    { time: '05:00 PM', title: 'Return Transfer', desc: 'Relax on a smooth return transfer to your hotel.' }
  ],
  includedItems: [
    'Private Transportation',
    'Professional Vetted Driver',
    'Fuel, Tolls & Parking Fees',
    'Bottled Drinking Water',
    'Hotel Pickup & Drop-off'
  ],
  excludedItems: [
    'Admission Tickets & Entry Passes',
    'Local Professional Tour Guide',
    'Lunch & Gratuities',
    'Traveler Personal Expenses'
  ],
  reviews: {
    rating: 4.8,
    count: 45,
    list: [
      { name: 'Michael R.', rating: 5, date: 'June 4, 2026', comment: 'Highly comfortable and reliable. The driver was exceptionally courteous and drove very safely.' }
    ]
  }
};

export default function PackageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [allPackages, setAllPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');

    // Fetch the single package details AND all packages list for related recommendations
    Promise.all([getPackageById(id), getPackages()])
      .then(([singleRes, listRes]) => {
        setPkg(singleRes.data.data);
        setAllPackages(listRes.data.data);
      })
      .catch((err) => {
        console.error('Failed to fetch tour package details:', err);
        setError('Failed to load package details. It might have been deleted or doesn\'t exist.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex flex-col items-center gap-3 py-24 justify-center">
      <span className="w-8 h-8 border-3 border-gold border-t-transparent rounded-full animate-spin"></span>
      <p className="text-[#A3A3A3] text-sm uppercase tracking-wider">Loading package details...</p>
    </div>
  );

  if (error || !pkg) return (
    <div className="flex flex-col items-center gap-5 py-24 max-w-md mx-auto text-center">
      <span className="text-4xl">⚠️</span>
      <h3 className="text-xl font-bold text-white font-serif">Package Not Found</h3>
      <p className="text-neutral-400 text-sm leading-relaxed font-light">{error || 'The requested package could not be retrieved.'}</p>
      <GoldButton onClick={() => navigate('/traveler/services')} className="px-6 py-2.5">
        Back to Services
      </GoldButton>
    </div>
  );

  // Enhance the basic database fields with beautiful structured content based on name match
  const nameKey = pkg.name.toLowerCase();
  let enhancement = DEFAULT_ENHANCEMENT;

  if (nameKey.includes('angkor')) {
    enhancement = ENHANCED_DETAILS.angkor;
  } else if (nameKey.includes('kampot')) {
    enhancement = ENHANCED_DETAILS.kampot;
  } else if (nameKey.includes('kep')) {
    enhancement = ENHANCED_DETAILS.kep;
  } else if (nameKey.includes('phnom penh') || nameKey.includes('heritage')) {
    enhancement = ENHANCED_DETAILS.phnom_penh;
  }

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-12">
      {/* Top Banner Hero Section */}
      <PackageHero
        name={pkg.name}
        description={pkg.description}
        durationDays={pkg.duration_days}
        maxPersons={pkg.max_persons}
        province={enhancement.province}
        bannerImage={enhancement.bannerImage}
      />

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Columns - Detailed Info (col-span-2) */}
        <div className="lg:col-span-2 flex flex-col gap-10">
          
          {/* About Section */}
          <div className="bg-[#151515] border border-gold/10 p-6 md:p-8 rounded-3xl flex flex-col gap-4">
            <h3 className="text-xl font-bold font-serif text-white uppercase tracking-wider relative pl-3 border-l-2 border-gold">
              About the Experience
            </h3>
            <p className="text-neutral-300 text-sm md:text-base font-light leading-relaxed">
              {pkg.description || 'Enjoy a premium private transportation experience designed to showcase the highlights of Cambodia while traveling in comfort and safety.'}
            </p>
          </div>

          {/* Timeline / Itinerary Section */}
          <PackageTimeline itinerary={enhancement.itinerary} />

          {/* What is Included / Excluded Section */}
          <PackageIncludes 
            includedItems={enhancement.includedItems} 
            excludedItems={enhancement.excludedItems} 
          />

          {/* Gallery Section */}
          <PackageGallery galleryImages={enhancement.galleryImages} />

          {/* Reviews Section */}
          <PackageReviews 
            rating={enhancement.reviews.rating} 
            count={enhancement.reviews.count} 
            reviewsList={enhancement.reviews.list} 
          />

        </div>

        {/* Right Column - Sticky Booking Card */}
        <div className="lg:col-span-1">
          <PackageBookingCard
            packageId={pkg.id}
            price={pkg.price}
            durationDays={pkg.duration_days}
            maxPersons={pkg.max_persons}
            vehicle={enhancement.vehicle}
          />
        </div>

      </div>

      {/* Related Packages Carousel/Grid */}
      <RelatedPackages 
        currentId={pkg.id} 
        allPackages={allPackages} 
      />
    </div>
  );
}
