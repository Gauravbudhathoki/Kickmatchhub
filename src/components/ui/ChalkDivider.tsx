interface ChalkDividerProps {
  className?: string;
  flip?: boolean;
}

export function ChalkDivider({ className = "", flip = false }: ChalkDividerProps) {
  const path = flip
    ? "M0,10 C 80,2 160,18 240,9 C 320,1 400,16 480,8 C 560,2 640,17 720,9 C 800,3 880,15 960,8 C 1040,2 1120,14 1200,9 L1200,11 C 1120,16 1040,4 960,10 C 880,17 800,5 720,11 C 640,19 560,4 480,10 C 400,18 320,3 240,11 C 160,20 80,4 0,12 Z"
    : "M0,9 C 80,17 160,1 240,10 C 320,18 400,3 480,11 C 560,17 640,2 720,10 C 800,16 880,4 960,11 C 1040,17 1120,5 1200,10 L1200,8 C 1120,3 1040,15 960,9 C 880,2 800,14 720,8 C 640,0 560,15 480,9 C 400,1 320,16 240,8 C 160,0 80,15 0,7 Z";

  return (
    <svg viewBox="0 0 1200 20" preserveAspectRatio="none" className={`h-3 w-full ${className}`} aria-hidden="true">
      <path d={path} fill="currentColor" />
    </svg>
  );
}
