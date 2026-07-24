export function PitchCorner({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden="true" fill="none">
      <path d="M0 40 H400" stroke="#EFEAD8" strokeOpacity="0.35" strokeWidth="2" />
      <path d="M40 0 V400" stroke="#EFEAD8" strokeOpacity="0.35" strokeWidth="2" />
      <path d="M40 90 A50 50 0 0 0 90 40" stroke="#EFEAD8" strokeOpacity="0.5" strokeWidth="2" />
      <circle cx="400" cy="400" r="160" stroke="#EFEAD8" strokeOpacity="0.25" strokeWidth="2" />
      <circle cx="400" cy="400" r="4" fill="#EFEAD8" fillOpacity="0.5" />
      <circle cx="140" cy="180" r="7" fill="#A3441C" />
      <circle cx="230" cy="120" r="5" fill="#EFEAD8" fillOpacity="0.8" />
      <circle cx="280" cy="240" r="6" fill="#EFEAD8" fillOpacity="0.6" />
      <circle cx="180" cy="290" r="5" fill="#A3441C" fillOpacity="0.7" />
      <circle cx="330" cy="180" r="4" fill="#EFEAD8" fillOpacity="0.4" />
    </svg>
  );
}
