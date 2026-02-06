import { useEffect, useState } from 'react';

type KiteShape = 'diamond' | 'box' | 'delta' | 'hexagon' | 'star' | 'patang';

interface KiteProps {
  size: number;
  color: string;
  secondaryColor?: string;
  tailColor: string;
  delay: number;
  duration: number;
  startX: number;
  shape: KiteShape;
  swaySpeed?: 'slow' | 'normal' | 'fast';
}

const DiamondKite = ({ color, secondaryColor }: { color: string; secondaryColor?: string }) => (
  <>
    <path d="M20 2 L38 20 L20 38 L2 20 Z" fill={color} opacity="0.9" />
    {secondaryColor && (
      <path d="M20 2 L38 20 L20 20 Z" fill={secondaryColor} opacity="0.85" />
    )}
    <line x1="20" y1="2" x2="20" y2="38" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
    <line x1="2" y1="20" x2="38" y2="20" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
  </>
);

const BoxKite = ({ color, secondaryColor }: { color: string; secondaryColor?: string }) => (
  <>
    <rect x="5" y="5" width="30" height="30" fill={color} opacity="0.9" rx="2" />
    {secondaryColor && (
      <>
        <rect x="5" y="5" width="15" height="15" fill={secondaryColor} opacity="0.85" rx="1" />
        <rect x="20" y="20" width="15" height="15" fill={secondaryColor} opacity="0.85" rx="1" />
      </>
    )}
    <line x1="5" y1="5" x2="35" y2="35" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
    <line x1="35" y1="5" x2="5" y2="35" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
  </>
);

const DeltaKite = ({ color, secondaryColor }: { color: string; secondaryColor?: string }) => (
  <>
    <path d="M20 2 L38 35 L20 28 L2 35 Z" fill={color} opacity="0.9" />
    {secondaryColor && (
      <path d="M20 2 L38 35 L20 28 Z" fill={secondaryColor} opacity="0.85" />
    )}
    <line x1="20" y1="2" x2="20" y2="28" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
  </>
);

const HexagonKite = ({ color, secondaryColor }: { color: string; secondaryColor?: string }) => (
  <>
    <path d="M20 2 L35 10 L35 28 L20 36 L5 28 L5 10 Z" fill={color} opacity="0.9" />
    {secondaryColor && (
      <path d="M20 2 L35 10 L20 19 L5 10 Z" fill={secondaryColor} opacity="0.85" />
    )}
    <line x1="20" y1="2" x2="20" y2="36" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
    <line x1="5" y1="19" x2="35" y2="19" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
  </>
);

// Traditional Pakistani Patang (fighter kite)
const PatangKite = ({ color, secondaryColor }: { color: string; secondaryColor?: string }) => (
  <>
    <path d="M20 0 L40 20 L20 40 L0 20 Z" fill={color} opacity="0.9" />
    {secondaryColor && (
      <>
        <path d="M20 0 L40 20 L20 20 Z" fill={secondaryColor} opacity="0.85" />
        <path d="M0 20 L20 20 L20 40 Z" fill={secondaryColor} opacity="0.85" />
      </>
    )}
    <line x1="20" y1="0" x2="20" y2="40" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
    <line x1="0" y1="20" x2="40" y2="20" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
    <circle cx="20" cy="20" r="3" fill="rgba(255,255,255,0.7)" />
  </>
);

// Star-shaped kite
const StarKite = ({ color, secondaryColor }: { color: string; secondaryColor?: string }) => (
  <>
    <path 
      d="M20 0 L23 14 L38 14 L26 23 L30 38 L20 29 L10 38 L14 23 L2 14 L17 14 Z" 
      fill={color} 
      opacity="0.9" 
    />
    {secondaryColor && (
      <circle cx="20" cy="19" r="8" fill={secondaryColor} opacity="0.8" />
    )}
    <circle cx="20" cy="19" r="3" fill="rgba(255,255,255,0.6)" />
  </>
);

const KiteShapeComponent = ({ shape, color, secondaryColor }: { shape: KiteShape; color: string; secondaryColor?: string }) => {
  switch (shape) {
    case 'box': return <BoxKite color={color} secondaryColor={secondaryColor} />;
    case 'delta': return <DeltaKite color={color} secondaryColor={secondaryColor} />;
    case 'hexagon': return <HexagonKite color={color} secondaryColor={secondaryColor} />;
    case 'patang': return <PatangKite color={color} secondaryColor={secondaryColor} />;
    case 'star': return <StarKite color={color} secondaryColor={secondaryColor} />;
    default: return <DiamondKite color={color} secondaryColor={secondaryColor} />;
  }
};

const getSwayClass = (speed?: 'slow' | 'normal' | 'fast') => {
  switch (speed) {
    case 'slow': return 'kite-sway-slow';
    case 'fast': return 'kite-sway-fast';
    default: return 'kite-sway';
  }
};

const Kite = ({ size, color, secondaryColor, tailColor, delay, duration, startX, shape, swaySpeed }: KiteProps) => {
  return (
    <div
      className="kite-container"
      style={{
        '--kite-delay': `${delay}s`,
        '--kite-duration': `${duration}s`,
        '--kite-start-x': `${startX}%`,
        width: size,
        height: size * 1.75,
      } as React.CSSProperties}
    >
      <svg
        width={size}
        height={size * 1.75}
        viewBox="0 0 40 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={getSwayClass(swaySpeed)}
      >
        <KiteShapeComponent shape={shape} color={color} secondaryColor={secondaryColor} />
        {/* Tail */}
        <path
          d="M20 38 Q26 44 20 50 Q14 56 20 62 Q26 68 20 74"
          stroke={tailColor}
          strokeWidth="2"
          fill="none"
          opacity="0.75"
          className="kite-tail"
        />
        {/* Tail ribbons */}
        <circle cx="20" cy="50" r="2.5" fill={tailColor} opacity="0.8" />
        <circle cx="20" cy="62" r="2" fill={tailColor} opacity="0.7" />
        <circle cx="20" cy="72" r="1.5" fill={tailColor} opacity="0.6" />
      </svg>
    </div>
  );
};

// Expanded kite collection with more variety
const kites: KiteProps[] = [
  // Row 1 - Fast starters
  { size: 38, color: '#ef4444', secondaryColor: '#fbbf24', tailColor: '#fbbf24', delay: 0, duration: 9, startX: 5, shape: 'patang', swaySpeed: 'fast' },
  { size: 30, color: '#3b82f6', secondaryColor: '#60a5fa', tailColor: '#a855f7', delay: 0.8, duration: 11, startX: 25, shape: 'diamond', swaySpeed: 'normal' },
  { size: 34, color: '#22c55e', secondaryColor: '#86efac', tailColor: '#f97316', delay: 1.5, duration: 8, startX: 45, shape: 'delta', swaySpeed: 'fast' },
  
  // Row 2 - Medium delay
  { size: 26, color: '#f97316', secondaryColor: '#fdba74', tailColor: '#ec4899', delay: 2.5, duration: 10, startX: 65, shape: 'star', swaySpeed: 'slow' },
  { size: 32, color: '#a855f7', secondaryColor: '#c084fc', tailColor: '#22c55e', delay: 3.2, duration: 12, startX: 80, shape: 'patang', swaySpeed: 'normal' },
  { size: 28, color: '#ec4899', secondaryColor: '#f9a8d4', tailColor: '#3b82f6', delay: 4, duration: 9, startX: 15, shape: 'hexagon', swaySpeed: 'fast' },
  
  // Row 3 - Later starters
  { size: 36, color: '#14b8a6', secondaryColor: '#5eead4', tailColor: '#f59e0b', delay: 5, duration: 11, startX: 35, shape: 'box', swaySpeed: 'slow' },
  { size: 24, color: '#8b5cf6', secondaryColor: '#a78bfa', tailColor: '#ef4444', delay: 5.8, duration: 8, startX: 55, shape: 'diamond', swaySpeed: 'fast' },
  { size: 30, color: '#f59e0b', secondaryColor: '#fcd34d', tailColor: '#8b5cf6', delay: 6.5, duration: 10, startX: 70, shape: 'patang', swaySpeed: 'normal' },
  
  // Row 4 - Last wave
  { size: 28, color: '#06b6d4', secondaryColor: '#67e8f9', tailColor: '#f43f5e', delay: 7.5, duration: 12, startX: 10, shape: 'star', swaySpeed: 'slow' },
  { size: 34, color: '#f43f5e', secondaryColor: '#fda4af', tailColor: '#06b6d4', delay: 8.2, duration: 9, startX: 50, shape: 'delta', swaySpeed: 'fast' },
  { size: 26, color: '#84cc16', secondaryColor: '#bef264', tailColor: '#d946ef', delay: 9, duration: 11, startX: 85, shape: 'hexagon', swaySpeed: 'normal' },
];

const KiteDecorations = () => {
  const [shouldRender, setShouldRender] = useState(true);

  // Detect low performance devices and respect reduced motion
  useEffect(() => {
    const checkPerformance = () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const isLowEnd = 
        navigator.hardwareConcurrency <= 2 ||
        (navigator as any).deviceMemory <= 1;
      
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
