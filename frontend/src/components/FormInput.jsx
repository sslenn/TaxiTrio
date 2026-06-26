export default function FormInput({ label, type = "text", placeholder, value, onChange, required = false, className = "", ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-[11px] font-semibold uppercase tracking-widest text-[#BFA76A]">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full bg-[#0B0B0B] border border-gold/15 text-white rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-gold/60 focus:shadow-[0_0_15px_rgba(212,175,55,0.1)] focus:ring-1 focus:ring-gold/20 hover:border-gold/35 transition-all duration-350 ease-out font-light placeholder-neutral-600"
        {...props}
      />
    </div>
  );
}
