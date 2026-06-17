export default function Footer() {
  return (
    <footer className="w-full border-t border-gold/10 bg-[#0B0B0B] py-12 px-6 md:px-12 mt-16">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
        {/* Column 1 */}
        <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
          <span className="text-gold font-bold text-xl tracking-wider font-serif">TaxiTrio</span>
          <p className="text-[#A3A3A3] text-xs leading-relaxed font-light">
            The Gold Standard in Cambodian Travel. Premium vehicles, experienced drivers, and customizable journeys.
          </p>
          <span className="text-[#555] text-[10px] uppercase tracking-widest mt-2">
            © 2026 TaxiTrio. All rights reserved.
          </span>
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-3">
          <span className="text-white text-xs font-bold uppercase tracking-widest border-b border-gold/10 pb-2 mb-1">Services</span>
          <a href="#fleet" className="text-[#A3A3A3] hover:text-gold text-xs transition duration-200">Luxury Fleet</a>
          <a href="#airport" className="text-[#A3A3A3] hover:text-gold text-xs transition duration-200">Airport Transfers</a>
        </div>

        {/* Column 3 */}
        <div className="flex flex-col gap-3">
          <span className="text-white text-xs font-bold uppercase tracking-widest border-b border-gold/10 pb-2 mb-1">Support</span>
          <a href="#corporate" className="text-[#A3A3A3] hover:text-gold text-xs transition duration-200">Corporate Accounts</a>
          <a href="#support" className="text-[#A3A3A3] hover:text-gold text-xs transition duration-200">Contact Support</a>
        </div>

        {/* Column 4 */}
        <div className="flex flex-col gap-3">
          <span className="text-white text-xs font-bold uppercase tracking-widest border-b border-gold/10 pb-2 mb-1">Legal</span>
          <a href="#terms" className="text-[#A3A3A3] hover:text-gold text-xs transition duration-200">Terms of Service</a>
          <a href="#privacy" className="text-[#A3A3A3] hover:text-gold text-xs transition duration-200">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}
