export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl border border-moss/20 bg-chalk p-8 shadow-xl shadow-black/20 ${className}`}>
      {children}
    </div>
  );
}
