import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPackages, createPackage } from '../../service/packageService';
import PageHeader from '../../components/PageHeader';
import GoldButton from '../../components/GoldButton';
import TourCard from '../../components/tour/TourCard';
import { cambodiaDestinations } from '../../data/cambodiaDestinations';
import { useTranslation } from '../../context/LanguageContext';

const empty = { name: '', description: '', price: '', duration_days: 1, max_persons: 4, province: '' };

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export default function ManagePackages() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [form, setForm] = useState(empty);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const { locale } = useTranslation();

  const load = () => getPackages().then((r) => setPackages(r.data.data));
  useEffect(() => { load(); }, [locale]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCancel = () => {
    setForm(empty);
    setImageFile(null);
    setImagePreview('');
    setShowForm(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try { 
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('province', form.province);
      formData.append('description', form.description);
      formData.append('price', form.price);
      formData.append('duration_days', form.duration_days);
      formData.append('max_persons', form.max_persons);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await createPackage(formData); 
      setForm(empty); 
      setImageFile(null);
      setImagePreview('');
      setShowForm(false); 
      load(); 
    } catch (err) { 
      alert(err.response?.data?.message || 'Error'); 
    }
  };

  // Selector for beautiful tour destination images
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

  // Convert database packages into the same schema structure as cambodiaDestinations
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
      price: p.price,
      durationDays: p.duration_days,
      suggestedDuration: `${p.duration_days} day(s)`,
      maxPersons: p.max_persons,
      cardImage: { src: imgUrl, alt: p.name },
      image: imgUrl,
      routePath: `/traveler/packages/${p.id}`,
      isDbPackage: true
    };
  };

  // Map custom added packages and combine them with the pre-built traveler tour list
  const mappedDbPackages = packages.map(mapDbPackageToTour);
  const allTours = [...cambodiaDestinations, ...mappedDbPackages];

  const filteredTours = allTours.filter((tour) => 
    tour.destination?.toLowerCase().includes(search.toLowerCase()) ||
    tour.title?.toLowerCase().includes(search.toLowerCase()) || 
    tour.province?.toLowerCase().includes(search.toLowerCase()) ||
    tour.description?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectTour = (tour) => {
    navigate(tour.routePath);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Manage Packages" 
        subtitle="Manage tourist packages, set durations, passenger capacities, and pricing models"
      >
        <div className="flex items-center gap-3">
          <div className="relative w-48 shrink-0">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neutral-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-gold/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              className="w-full bg-[#121212] border border-gold/15 text-white placeholder-neutral-500 rounded-full py-2 pl-9 pr-3 text-[11px] focus:outline-none focus:border-gold/50 transition duration-300"
              placeholder="Search packages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <GoldButton onClick={() => { if (showForm) handleCancel(); else setShowForm(true); }} variant={showForm ? "outline" : "filled"} className="py-2 px-4">
            {showForm ? 'Cancel' : '+ Add Package'}
          </GoldButton>
        </div>
      </PageHeader>

      {showForm && (
        <form onSubmit={handleCreate} className="card border border-gold/15 bg-[#121212] p-6 flex flex-col gap-6 rounded-2xl shadow-xl max-w-4xl w-full mx-auto animate-in slide-in-from-top-4 duration-300 text-left">
          <h3 className="text-[#D4AF37] font-bold font-serif text-lg border-b border-neutral-900 pb-3 uppercase tracking-wider">Configure New Tour Package</h3>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Column: Input Fields */}
            <div className="flex-1 flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Package Name</label>
                  <input 
                    className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/50 transition duration-300" 
                    placeholder="e.g. Angkor Wat Explorer" 
                    required
                    value={form.name} 
                    onChange={(e) => setForm({ ...form, name: e.target.value })} 
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Province Location</label>
                  <input 
                    className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/50 transition duration-300" 
                    placeholder="e.g. Siem Reap" 
                    required
                    value={form.province} 
                    onChange={(e) => setForm({ ...form, province: e.target.value })} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Price ($)</label>
                  <input 
                    className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/50 transition duration-300" 
                    type="number"
                    placeholder="e.g. 150" 
                    required
                    value={form.price} 
                    onChange={(e) => setForm({ ...form, price: e.target.value })} 
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Duration (days)</label>
                  <input 
                    className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/50 transition duration-300" 
                    type="number"
                    min="1"
                    placeholder="Duration" 
                    required
                    value={form.duration_days} 
                    onChange={(e) => setForm({ ...form, duration_days: +e.target.value })} 
                  />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Max Passengers</label>
                  <input 
                    className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/50 transition duration-300" 
                    type="number"
                    min="1"
                    placeholder="Max persons" 
                    required
                    value={form.max_persons} 
                    onChange={(e) => setForm({ ...form, max_persons: +e.target.value })} 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Description Details</label>
                <textarea 
                  className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/50 transition duration-300" 
                  placeholder="Provide a detailed itinerary summary..." 
                  rows={4}
                  value={form.description} 
                  onChange={(e) => setForm({ ...form, description: e.target.value })} 
                />
              </div>
            </div>

            {/* Right Column: Image Preview & Upload */}
            <div className="w-full md:w-80 flex flex-col gap-4 border-t md:border-t-0 md:border-l border-neutral-900 pt-6 md:pt-0 md:pl-8">
              <label className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-wider block">Package Image</label>
              
              <div 
                onClick={() => document.getElementById('package-image-input').click()}
                className="w-full h-56 bg-[#0B0B0B] border-2 border-dashed border-gold/15 hover:border-gold/45 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer transition duration-300 animate-fade-in"
              >
                {imagePreview ? (
                  <>
                    <img 
                      src={imagePreview} 
                      alt="Package preview" 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition duration-300">
                      <span className="text-white text-xs font-semibold uppercase tracking-wider bg-gold/80 px-3 py-1.5 rounded-lg border border-gold/40">Change Image</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-3 p-4 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-gold/60 group-hover:text-gold transition duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-gold text-xs font-semibold uppercase tracking-wider group-hover:underline">Upload Image</p>
                      <p className="text-[#A3A3A3] text-[10px] mt-1">Supports JPG, PNG, WEBP (Max 5MB)</p>
                    </div>
                  </div>
                )}
              </div>

              <input 
                id="package-image-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              
              {imageFile && (
                <div className="flex items-center justify-between bg-[#0B0B0B] border border-gold/10 rounded-xl px-3 py-2 text-xs animate-in fade-in duration-300">
                  <span className="text-neutral-400 truncate max-w-[180px]">{imageFile.name}</span>
                  <button 
                    type="button" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageFile(null);
                      setImagePreview('');
                    }}
                    className="text-red-500 hover:text-red-400 font-bold uppercase text-[9px] tracking-wider ml-2"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-neutral-950 pt-4 flex justify-end gap-3">
            <GoldButton type="button" variant="outline" onClick={handleCancel} className="px-6 py-2.5">Cancel</GoldButton>
            <GoldButton type="submit" className="px-8 py-2.5">Save Package</GoldButton>
          </div>
        </form>
      )}

      {filteredTours.length === 0 ? (
        <div className="card border border-gold/15 bg-[#121212] p-12 text-center rounded-2xl">
          <p className="text-[#A3A3A3] text-sm">No packages found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTours.map((tour, index) => (
            <div key={tour.id} className="relative">
              {/* Renders the TourCard component with View Details button text */}
              <TourCard tour={tour} index={index} onSelect={handleSelectTour} buttonText="View Details" />
              
              {/* Floating Source Badge to indicate package type to the Admin */}
              <span className={`absolute top-4 right-14 z-10 text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border shadow-md backdrop-blur-md ${
                tour.isDbPackage 
                  ? 'bg-emerald-500/80 text-emerald-100 border-emerald-500/40 shadow-emerald-500/10' 
                  : 'bg-gold/80 text-black border-gold/40 shadow-gold/10'
              }`}>
                {tour.isDbPackage ? 'Custom Added' : 'Traveler Catalog'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
