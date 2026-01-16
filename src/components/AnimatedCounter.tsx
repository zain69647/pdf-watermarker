import { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  value: number | null;
  duration?: number;
  className?: string;
}

/**
 * Animated counter that smoothly increments/decrements to target value
 */
const AnimatedCounter = ({ value, duration = 500, className = '' }: AnimatedCounterProps) => {
  const [displayValue, setDisplayValue] = useState(value ?? 0);
  const previousValue = useRef(value ?? 0);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (value === null) return;

    const startValue = previousValue.current;
    const endValue = value;
    const diff = endValue - startValue;

    if (diff === 0) return;

    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      const currentValue = Math.round(startValue + diff * easeOutQuart);
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        previousValue.current = endValue;
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, duration]);

  if (value === null) {
    return <span className={className}>...</span>;
  }

  return (
    <span className={`tabular-nums ${className}`}>
      {displayValue.toLocaleString()}
    </span>
  );
};

export default AnimatedCounter;
