export default function PageHeader({ title, subtitle, children }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-gold/10">
      <div>
        <h2 className="text-3xl font-normal text-white font-serif tracking-wide">{title}</h2>
        {subtitle && <p className="text-muted text-xs mt-1 tracking-wider uppercase font-light text-[#BFA76A]">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  );
}
