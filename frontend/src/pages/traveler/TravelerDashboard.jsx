import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../utils/auth";
import { getPackages } from "../../service/packageService";
import { getMyBookings } from "../../service/bookingService";
import { getMyReviews } from "../../service/reviewService";
import PageHeader from "../../components/PageHeader";
import { Clock, Users, Star } from "lucide-react";
import StatCard from "../../components/StatCard";
import GoldButton from "../../components/GoldButton";
import TourCard from "../../components/tour/TourCard";
import { useTranslation } from "../../context/LanguageContext";

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const getPackageImage = (name = "") => {
  const key = name.toLowerCase();
  if (key.includes("angkor")) return "/images/gallery_angkor1.jpg";
  if (key.includes("kampot")) return "/images/gallery_angkor2.jpg";
  if (key.includes("kep"))
    return "https://upload.wikimedia.org/wikipedia/commons/e/e6/Crab_statue_Kep_Cambodia.jpg";
  if (key.includes("phnom penh") || key.includes("heritage"))
    return "/images/gallery_angkor3.jpg";

  // Explicit mappings for Pailin/Phnom Yat, Pursat/Cardamom, Stung Treng/Ramsar, Kompong Cham/Bamboo
  if (key.includes("phnom yat") || key.includes("pailin"))
    return "https://upload.wikimedia.org/wikipedia/commons/2/2a/Wat_Phnom_Yat%2C_Pailin.jpg";
  if (key.includes("pursat") || key.includes("cardamom"))
    return "https://upload.wikimedia.org/wikipedia/commons/5/52/Tonle_Sap_floating_village_houses.jpg";
  if (key.includes("stung treng") || key.includes("ramsar"))
    return "https://upload.wikimedia.org/wikipedia/commons/e/e5/Mekong_flooded_forest_Stung_Treng.jpg";
  if (key.includes("kompong cham") || key.includes("bamboo"))
    return "https://upload.wikimedia.org/wikipedia/commons/0/09/Kompong_Cham%2C_Bamboo_Bridge%2C_Cambodia.jpg";

  return "/images/gallery_angkor1.jpg";
};

const mapDbPackageToTour = (p) => {
  const pSlug = slugify(p.province || "cambodia");
  const dSlug = slugify(p.name || "package");
  const imgUrl = p.image_url || getPackageImage(p.name);

  return {
    id: p.id,
    province: p.province || "Cambodia",
    provinceSlug: pSlug,
    destination: p.name,
    destinationSlug: dSlug,
    title: p.name,
    category: "Custom Package",
    categories: ["Custom", "Private"],
    shortDescription: p.description,
    description: p.description,
    price: Number(p.price) || 0,
    durationDays: p.duration_days,
    suggestedDuration: `${p.duration_days} day(s)`,
    maxPersons: p.max_persons,
    cardImage: { src: imgUrl, alt: p.name },
    image: imgUrl,
    routePath: `/traveler/packages/${p.id}`,
    isDbPackage: true,
  };
};

const actions = [
  {
    label: "City Ride",
    to: "/traveler/book/city",
    desc: "Book a ride within the city",
    img: "/images/city_ride.jpg",
  },
  {
    label: "Intercity Transfer",
    to: "/traveler/book/intercity",
    desc: "Travel between cities",
    img: "/images/intercity_transfer.jpg",
  },
  {
    label: "Tour Package",
    to: "/traveler/book/package",
    desc: "Curated travel packages",
    img: "/images/gallery_angkor1.jpg",
  },
  {
    label: "Custom Trip",
    to: "/traveler/custom-trip",
    desc: "Request a custom journey",
    img: "/images/custom_trip.jpg",
  },
];

export default function TravelerDashboard() {
  const navigate = useNavigate();
  const user = getUser();
  const [packages, setPackages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { locale } = useTranslation();

  useEffect(() => {
    Promise.all([getPackages(), getMyBookings(), getMyReviews()])
      .then(([pkgsRes, bookingsRes, reviewsRes]) => {
        setPackages(pkgsRes.data?.data?.filter((p) => p.is_active) || []);
        setBookings(bookingsRes.data?.data || []);
        setReviews(reviewsRes.data?.data || []);
      })
      .catch((err) => console.error("Failed to load dashboard data:", err))
      .finally(() => setLoading(false));
  }, [locale]);

  const totalBookings = bookings.length;
  const pendingPayment = bookings.filter(
    (b) => b.status === "pending_payment",
  ).length;
  const completedTrips = bookings.filter(
    (b) => b.status === "completed",
  ).length;
  const totalSpent = bookings
    .filter((b) => b.status === "completed")
    .reduce((sum, b) => sum + Number(b.total_fare || 0), 0);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title={`Welcome, ${user?.full_name || "Traveler"}`}
        subtitle="Where would you like to go today?"
      >
        <GoldButton
          onClick={() => navigate("/traveler/bookings")}
          variant="outline"
        >
          View My Bookings
        </GoldButton>
      </PageHeader>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Bookings"
          value={totalBookings}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.129-1.125v-3.75c0-.621-.504-1.125-1.125-1.125H3.375M16.5 4.5h3"
              />
            </svg>
          }
        />
        <StatCard
          label="Pending Payment"
          value={pendingPayment}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.5 8.5h19M2.5 12.5h19M2.5 16.5h19"
              />
            </svg>
          }
        />
        <StatCard
          label="Completed Trips"
          value={completedTrips}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
        <StatCard
          label="Total Spent"
          value={`$${totalSpent.toFixed(2)}`}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v12m-3-2.818l.22.11a3 3 0 003.56 0l.22-.11m-3-6.364l.22-.11a3 3 0 003.56 0l.22.11M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          }
        />
      </div>

      {/* Booking Quick Actions */}
      <div>
        <h3 className="text-xl font-bold mb-4 text-white font-serif">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {actions.map((a) => (
            <button
              key={a.to}
              onClick={() => navigate(a.to)}
              className="card text-left bg-[#121212] border border-gold/15 rounded-2xl hover:border-gold/60 transition group cursor-pointer overflow-hidden flex flex-col gap-0"
            >
              <div className="h-28 w-full overflow-hidden relative">
                <img
                  src={a.img}
                  alt={a.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent"></div>
              </div>
              <div className="p-5 flex flex-col gap-1">
                <p className="text-gold font-bold uppercase tracking-wider text-[10px] group-hover:underline">
                  {a.label}
                </p>
                <p className="text-[#A3A3A3] text-[11px] font-light leading-relaxed mt-0.5">
                  {a.desc}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Available Packages Section */}
      <div>
        <h3 className="text-xl font-bold mb-4 text-white font-serif">
          Available Tour Packages
        </h3>
        {loading ? (
          <div className="flex items-center gap-2 py-4">
            <span className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin"></span>
            <p className="text-[#A3A3A3] text-xs uppercase tracking-wider">
              Loading packages...
            </p>
          </div>
        ) : packages.length === 0 ? (
          <p className="text-[#A3A3A3] text-xs">
            No active tour packages offered right now.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.slice(0, 3).map((p, index) => {
              const tour = mapDbPackageToTour(p);
              return (
                <TourCard
                  key={p.id}
                  tour={tour}
                  index={index}
                  onSelect={() => navigate(`/traveler/packages/${p.id}`)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* My Feedbacks & Reviews Section */}
      <div>
        <h3 className="text-xl font-bold mb-4 text-white font-serif">
          My Feedbacks & Reviews
        </h3>
        {loading ? (
          <div className="flex items-center gap-2 py-4">
            <span className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin"></span>
            <p className="text-[#A3A3A3] text-xs uppercase tracking-wider">
              Loading reviews...
            </p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-[#121212] border border-gold/15 rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-2 shadow-lg">
            <Star className="w-8 h-8 text-gold/30" />
            <p className="text-[#A3A3A3] text-sm">
              You haven't submitted any reviews yet.
            </p>
            <p className="text-neutral-500 text-xs">
              Once you complete a trip, you can write feedback for your driver
              on the booking status page.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="bg-[#121212] border border-gold/15 hover:border-gold/30 transition duration-300 rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden shadow-lg"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full blur-2xl"></div>
                <div className="flex justify-between items-start gap-2 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border border-gold/20 overflow-hidden bg-[#0B0B0B] flex items-center justify-center">
                      {r.driver?.avatar_url ? (
                        <img
                          src={r.driver.avatar_url}
                          alt={r.driver.full_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gold font-bold text-sm font-serif">
                          {r.driver?.full_name?.charAt(0).toUpperCase() || "D"}
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="text-white text-xs font-semibold uppercase tracking-wider">
                        {r.driver?.full_name || "Driver"}
                      </h4>
                      <p className="text-[#A3A3A3] text-[10px] font-light leading-relaxed">
                        {r.driver?.email || "driver@taxitrio.com"}
                      </p>
                    </div>
                  </div>

                  {/* Stars Representation */}
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${star <= r.rating ? "fill-gold text-gold" : "text-neutral-800"}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="relative z-10">
                  <p className="text-[#E5E5E5] text-sm font-light italic leading-relaxed">
                    "{r.comment || "No written comment provided."}"
                  </p>
                </div>

                <div className="border-t border-neutral-900/60 pt-3 flex justify-between items-center text-[10px] text-neutral-500 font-light relative z-10">
                  <span>
                    Trip type:{" "}
                    <strong className="text-gold capitalize">
                      {r.booking?.booking_type?.replace("_", " ") || "Ride"}
                    </strong>
                  </span>
                  <span>
                    {new Date(
                      r.created_at || r.createdAt || Date.now(),
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
