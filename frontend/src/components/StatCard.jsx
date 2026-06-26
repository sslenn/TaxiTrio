export default function StatCard({ label, value, icon, className = "" }) {
  return (
    <div className={`relative overflow-hidden card-luxury p-6 flex items-center justify-between gap-4 ${className}`}>
      <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-gold/5 blur-2xl"></div>
      <div className="flex flex-col gap-1 z-10">
        <span className="text-[#A3A3A3] text-xs font-semibold uppercase tracking-widest">{label}</span>
        <span className="text-2xl font-bold text-white tracking-wide mt-1">{value}</span>
      </div>
      {icon && (
        <div className="w-12 h-12 rounded-xl bg-gold/5 border border-gold/10 flex items-center justify-center text-gold z-10 shrink-0">
          {icon}
        </div>
      )}
    </div>
  );
}
