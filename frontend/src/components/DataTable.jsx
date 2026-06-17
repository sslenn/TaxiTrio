export default function DataTable({ headers, children, className = "" }) {
  return (
    <div className={`w-full overflow-x-auto border border-gold/15 rounded-2xl bg-[#121212] ${className}`}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gold/15 bg-black/40">
            {headers.map((h, idx) => (
              <th key={idx} className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#BFA76A]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-900/60 text-sm">
          {children}
        </tbody>
      </table>
    </div>
  );
}
