export default function DataTable({ headers, children, className = "" }) {
  return (
    <div className={`w-full overflow-x-auto border border-gold/10 rounded-2xl bg-[#111111] shadow-[0_8px_32px_rgba(0,0,0,0.5)] ${className}`}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gold/15 bg-black/45">
            {headers.map((h, idx) => (
              <th key={idx} className="px-6 py-4.5 text-[10px] font-black uppercase tracking-widest text-[#BFA76A]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-900/65 text-sm text-neutral-300">
          {children}
        </tbody>
      </table>
    </div>
  );
}
