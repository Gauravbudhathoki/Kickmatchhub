export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl border border-moss/20 bg-white/50 p-8 shadow-sm ${className}`}>
      {children}
    </div>
  );
}
