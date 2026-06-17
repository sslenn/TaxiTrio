export default function DashboardCard({ title, children, className = "", action }) {
  return (
    <div className={`bg-[#121212] border border-gold/15 rounded-2xl p-6 ${className}`}>
      {(title || action) && (
        <div className="flex justify-between items-center mb-6 pb-3 border-b border-neutral-900">
          {title && <h3 className="text-base font-bold text-white tracking-wide">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}
