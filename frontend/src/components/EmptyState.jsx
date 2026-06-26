export default function EmptyState({ title = "No Data Available", message = "There is nothing to display here at the moment.", icon, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6 card-luxury">
      {icon ? (
        <div className="text-gold mb-4">{icon}</div>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-neutral-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      )}
      <h3 className="text-white text-base font-semibold tracking-wide">{title}</h3>
      <p className="text-muted text-xs max-w-xs mt-1.5 leading-relaxed">{message}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
