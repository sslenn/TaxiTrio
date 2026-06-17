import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import GoldButton from '../../components/GoldButton';

const services = [
  { title: 'City Ride', desc: 'Quick point-to-point rides around town. Perfect for airport transfers, hotel pickups, and local travel with fixed, transparent pricing.', to: '/traveler/book/city', img: '/images/city_ride.jpg' },
  { title: 'Intercity Transfer', desc: 'Comfortable private or shared transfers between Cambodia’s major destinations with professional, vetted drivers and reliable travel schedules.', to: '/traveler/book/intercity', img: '/images/intercity_transfer.jpg' },
  { title: 'Tour Package', desc: 'Pre-planned multi-day curated travel packages. Explore top attractions and scenic routes without worrying about transportation details.', to: '/traveler/book/package', img: '/images/tour_package.jpg' },
  { title: 'Custom Trip', desc: 'Tailor your own itinerary. Hire a dedicated private driver and high-class vehicle for a completely customizable and flexible journey.', to: '/traveler/custom-trip', img: '/images/custom_trip.jpg' },
];

export default function ServicesPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Our Services" 
        subtitle="Exclusive travel options curated for your comfort and style"
      />
      
      <div className="grid md:grid-cols-2 gap-8">
        {services.map((s) => (
          <div 
            key={s.title} 
            className="card border border-gold/15 bg-[#121212] rounded-2xl flex flex-col justify-between hover:border-gold/40 transition duration-300 relative overflow-hidden group gap-0"
          >
            <div className="h-48 w-full overflow-hidden relative">
              <img 
                src={s.img} 
                alt={s.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent"></div>
            </div>
            
            <div className="p-8 flex flex-col gap-6 flex-1 justify-between relative z-10">
              <div className="flex flex-col gap-3">
                <h3 className="text-xl font-bold text-gold font-serif">{s.title}</h3>
                <p className="text-[#A3A3A3] text-sm leading-relaxed font-light">{s.desc}</p>
              </div>
              
              <div className="pt-2">
                <GoldButton onClick={() => navigate(s.to)} className="w-full sm:w-auto">
                  Book {s.title}
                </GoldButton>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
