export default function StatusBadge({ status }) {
  const normalized = status?.toLowerCase() || "";
  
  const styles = {
    pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    pending_payment: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    payment_verified: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    driver_assigned: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    accepted: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
    confirmed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    en_route: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    arrived: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    in_progress: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    completed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    cancelled: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    rejected: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    active: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    inactive: "bg-neutral-500/10 text-neutral-400 border-neutral-500/20",
    paid: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    unpaid: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  };

  const currentStyle = styles[normalized] || "bg-neutral-500/10 text-neutral-400 border-neutral-500/20";

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${currentStyle}`}>
      {status}
    </span>
  );
}
