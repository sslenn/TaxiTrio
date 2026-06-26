export default function ServiceCard({ title, description, buttonText, icon, onClick, img }) {
  return (
    <div 
      className="group relative bg-[#111111] border border-gold/15 rounded-3xl flex flex-col justify-between overflow-hidden transition-all duration-350 hover:border-gold/45 hover:shadow-[0_12px_40px_rgba(212,175,55,0.07)] hover:-translate-y-2 cursor-pointer"
      onClick={onClick}
    >
      {/* Header image if supplied */}
      {img && (
        <div className="h-52 w-full overflow-hidden relative select-none">
          <img 
            src={img} 
            alt={title} 
            className="w-full h-full object-cover brightness-[0.7] contrast-[1.05] group-hover:brightness-[0.85] group-hover:scale-105 transition-all duration-700 ease-out"
          />
          {/* Premium multi-layered gradients for seamless background blending */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent"></div>
          {/* Subtle gold highlight line under the image */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/25 to-transparent"></div>
        </div>
      )}

      {/* Decorative luxury abstract background glow/gradient (only if no image) */}
      {!img && (
        <div className="absolute -right-20 -top-20 w-48 h-48 rounded-full bg-gold/5 blur-3xl group-hover:bg-gold/10 transition-all duration-500"></div>
      )}
      
      <div className="p-8 flex flex-col gap-4 relative z-10 flex-1">
        {/* Floating Icon in gold that sits on the image edge */}
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-gold shadow-lg transition-all duration-500 ${
          img 
            ? 'bg-[#111111] border border-gold/25 -mt-16 mb-2 shadow-black/40 group-hover:scale-110 group-hover:border-gold group-hover:shadow-[0_0_15px_rgba(212,175,55,0.2)]' 
            : 'bg-gold/5 border border-gold/15 group-hover:scale-110 group-hover:bg-gold/10 group-hover:border-gold/35'
        }`}>
          {icon}
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-bold text-white group-hover:text-gold transition-colors duration-300">
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-[#A3A3A3] text-sm leading-relaxed font-light">
          {description}
        </p>
      </div>

      {/* Button */}
      <div className="px-8 pb-8 relative z-10 pt-2">
        <button 
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          className="w-full py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 bg-transparent text-gold border border-gold/30 group-hover:bg-gold group-hover:text-black group-hover:border-gold group-hover:shadow-lg group-hover:shadow-gold/15"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
