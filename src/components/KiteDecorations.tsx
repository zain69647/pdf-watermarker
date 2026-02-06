import { useEffect, useState } from 'react';

interface KiteProps {
  size: number;
  color: string;
  tailColor: string;
  delay: number;
  duration: number;
  startX: number;
  startY: number;
}

const Kite = ({ size, color, tailColor, delay, duration, startX, startY }: KiteProps) => {
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
      {/* Kite body - diamond shape */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="kite-sway"
      >
        {/* Main kite shape */}
        <path
          d="M20 0 L40 20 L20 40 L0 20 Z"
          fill={color}
          opacity="0.85"
        />
        {/* Cross struts */}
        <line x1="20" y1="0" x2="20" y2="40" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <line x1="0" y1="20" x2="40" y2="20" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        {/* Tail */}
        <path
          d="M20 40 Q25 45 20 50 Q15 55 20 60 Q25 65 20 70"
          stroke={tailColor}
          strokeWidth="2"
          fill="none"
          opacity="0.7"
          className="kite-tail"
        />
        {/* Tail ribbons */}
        <circle cx="20" cy="50" r="2" fill={tailColor} opacity="0.6" />
        <circle cx="20" cy="60" r="1.5" fill={tailColor} opacity="0.5" />
        <circle cx="20" cy="70" r="1" fill={tailColor} opacity="0.4" />
      </svg>
    </div>
  );
};

interface KiteDecorationsProps {
  enabled: boolean;
}

const kites: KiteProps[] = [
  { size: 32, color: '#ef4444', tailColor: '#fbbf24', delay: 0, duration: 25, startX: 10, startY: 90 },
  { size: 24, color: '#3b82f6', tailColor: '#a855f7', delay: 3, duration: 30, startX: 25, startY: 95 },
  { size: 28, color: '#22c55e', tailColor: '#f97316', delay: 6, duration: 28, startX: 45, startY: 92 },
  { size: 20, color: '#f97316', tailColor: '#ec4899', delay: 9, duration: 35, startX: 65, startY: 88 },
  { size: 26, color: '#a855f7', tailColor: '#22c55e', delay: 12, duration: 27, startX: 80, startY: 94 },
  { size: 22, color: '#ec4899', tailColor: '#3b82f6', delay: 15, duration: 32, startX: 55, startY: 96 },
];

const KiteDecorations = ({ enabled }: KiteDecorationsProps) => {
  const [shouldRender, setShouldRender] = useState(enabled);
  const [isLowPerformance, setIsLowPerformance] = useState(false);

  // Detect low performance devices
  useEffect(() => {
    const checkPerformance = () => {
      // Check for low-end devices
      const isLowEnd = 
        navigator.hardwareConcurrency <= 2 || // Low CPU cores
        (navigator as any).deviceMemory <= 2 || // Low RAM (if available)
        /Android.*(?:4\.[0-3]|2\.|1\.)/i.test(navigator.userAgent); // Old Android
      
      setIsLowPerformance(isLowEnd);
    };
    
    checkPerformance();
  }, []);

  useEffect(() => {
    if (enabled && !isLowPerformance) {
      setShouldRender(true);
    } else {
      // Delay unmount for fade out animation
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [enabled, isLowPerformance]);

  if (!shouldRender || isLowPerformance) return null;

  return (
    <div 
      className={`kite-decorations-layer ${enabled ? 'opacity-100' : 'opacity-0'}`}
      aria-hidden="true"
    >
      {kites.map((kite, index) => (
        <Kite key={index} {...kite} />
      ))}
    </div>
  );
};

export default KiteDecorations;
