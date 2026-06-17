export default function GoldButton({ children, onClick, type = "button", variant = "filled", className = "", disabled = false }) {
  const baseStyle = "px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 active:scale-[0.98]";
  const variants = {
    filled: "bg-[#D4AF37] hover:bg-[#BFA76A] text-black border border-transparent shadow-lg shadow-gold/10 disabled:bg-[#BFA76A]/50 disabled:cursor-not-allowed",
    outline: "bg-transparent text-[#D4AF37] border border-gold/40 hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] disabled:border-gold/20 disabled:text-gold/40 disabled:cursor-not-allowed"
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
