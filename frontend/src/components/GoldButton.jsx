export default function GoldButton({ children, onClick, type = "button", variant = "filled", className = "", disabled = false }) {
  const baseStyle = "px-6 py-3 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest transition-all duration-300 ease-out select-none active:scale-[0.96] disabled:scale-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none";
  const variants = {
    filled: "bg-[#D4AF37] hover:bg-[#e5c158] text-[#050505] border border-transparent shadow-[0_4px_16px_rgba(212,175,55,0.18)] hover:shadow-[0_8px_25px_rgba(212,175,55,0.35)] hover:-translate-y-0.5",
    outline: "bg-transparent text-[#D4AF37] border border-[#D4AF37]/35 hover:border-[#D4AF37] hover:bg-[#D4AF37]/8 hover:-translate-y-0.5"
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
