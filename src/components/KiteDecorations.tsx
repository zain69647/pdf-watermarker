import { useEffect, useState } from 'react';

type KiteShape = 'diamond' | 'box' | 'delta' | 'hexagon';

interface KiteProps {
  size: number;
  color: string;
  tailColor: string;
  delay: number;
  duration: number;
  startX: number;
  startY: number;
  shape: KiteShape;
}

const DiamondKite = ({ color }: { color: string }) => (
  <>
    <path d="M20 2 L38 20 L20 38 L2 20 Z" fill={color} opacity="0.85" />
    <line x1="20" y1="2" x2="20" y2="38" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
    <line x1="2" y1="20" x2="38" y2="20" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
  </>
);

const BoxKite = ({ color }: { color: string }) => (
  <>
    <rect x="5" y="5" width="30" height="30" fill={color} opacity="0.85" rx="2" />
    <line x1="5" y1="5" x2="35" y2="35" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
    <line x1="35" y1="5" x2="5" y2="35" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
  </>
);

const DeltaKite = ({ color }: { color: string }) => (
  <>
    <path d="M20 2 L38 35 L20 28 L2 35 Z" fill={color} opacity="0.85" />
    <line x1="20" y1="2" x2="20" y2="28" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
  </>
);

const HexagonKite = ({ color }: { color: string }) => (
  <>
    <path d="M20 2 L35 10 L35 28 L20 36 L5 28 L5 10 Z" fill={color} opacity="0.85" />
    <line x1="20" y1="2" x2="20" y2="36" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
    <line x1="5" y1="19" x2="35" y2="19" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
  </>
);

const KiteShape = ({ shape, color }: { shape: KiteShape; color: string }) => {
  switch (shape) {
    case 'box': return <BoxKite color={color} />;
    case 'delta': return <DeltaKite color={color} />;
    case 'hexagon': return <HexagonKite color={color} />;
    default: return <DiamondKite color={color} />;
  }
};

const Kite = ({ size, color, tailColor, delay, duration, startX, startY, shape }: KiteProps) => {
  return (
    <div
      className="kite-container"
      style={{
        '--kite-delay': `${delay}s`,
        '--kite-duration': `${duration}s`,
        '--kite-start-x': `${startX}%`,
        '--kite-start-y': `${startY}%`,
        width: size,
        height: size,
      } as React.CSSProperties}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="kite-sway"
      >
        <KiteShape shape={shape} color={color} />
        {/* Tail */}
        <path
          d="M20 38 Q26 44 20 50 Q14 56 20 62 Q26 68 20 74"
          stroke={tailColor}
          strokeWidth="2"
          fill="none"
          opacity="0.7"
          className="kite-tail"
        />
        {/* Tail ribbons */}
        <circle cx="20" cy="50" r="2.5" fill={tailColor} opacity="0.7" />
        <circle cx="20" cy="62" r="2" fill={tailColor} opacity="0.6" />
      </svg>
    </div>
  );
};

const kites: KiteProps[] = [
  { size: 36, color: '#ef4444', tailColor: '#fbbf24', delay: 0, duration: 12, startX: 5, startY: 85, shape: 'diamond' },
  { size: 28, color: '#3b82f6', tailColor: '#a855f7', delay: 2, duration: 14, startX: 20, startY: 90, shape: 'box' },
  { size: 32, color: '#22c55e', tailColor: '#f97316', delay: 4, duration: 11, startX: 40, startY: 88, shape: 'delta' },
  { size: 24, color: '#f97316', tailColor: '#ec4899', delay: 6, duration: 15, startX: 60, startY: 92, shape: 'hexagon' },
  { size: 30, color: '#a855f7', tailColor: '#22c55e', delay: 8, duration: 13, startX: 75, startY: 86, shape: 'diamond' },
  { size: 26, color: '#ec4899', tailColor: '#3b82f6', delay: 10, duration: 12, startX: 50, startY: 94, shape: 'box' },
];

const KiteDecorations = () => {
  const [shouldRender, setShouldRender] = useState(true);

  // Detect low performance devices and respect reduced motion
  useEffect(() => {
    const checkPerformance = () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const isLowEnd = 
        navigator.hardwareConcurrency <= 2 ||
        (navigator as any).deviceMemory <= 2 ||
        /Android.*(?:4\.[0-3]|2\.|1\.)/i.test(navigator.userAgent);
      
      setShouldRender(!prefersReducedMotion && !isLowEnd);
    };
    
    checkPerformance();
  }, []);

  if (!shouldRender) return null;

  return (
    <div className="kite-decorations-layer" aria-hidden="true">
      {kites.map((kite, index) => (
        <Kite key={index} {...kite} />
      ))}
    </div>
  );
};

export default KiteDecorations;
