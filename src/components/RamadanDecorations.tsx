/**
 * Ramadan Theme Decorations - Visual Enhancement Layer Only
 * CSS-only animations, inline SVG, no external assets
 * Optimized for low-end Android WebView
 */
const RamadanDecorations = () => {
  const stars = [
    { top: '5%',  left: '4%',  size: 3, delay: '0s',    dur: '2.8s' },
    { top: '9%',  left: '18%', size: 2, delay: '0.5s',  dur: '3.2s' },
    { top: '3%',  left: '35%', size: 4, delay: '1.1s',  dur: '2.5s' },
    { top: '13%', left: '52%', size: 2, delay: '0.3s',  dur: '3.8s' },
    { top: '6%',  left: '68%', size: 3, delay: '1.6s',  dur: '2.2s' },
    { top: '16%', left: '82%', size: 2, delay: '0.8s',  dur: '4.0s' },
    { top: '21%', left: '10%', size: 2, delay: '2.0s',  dur: '3.0s' },
    { top: '27%', left: '28%', size: 3, delay: '1.4s',  dur: '2.7s' },
    { top: '2%',  left: '58%', size: 2, delay: '0.9s',  dur: '3.5s' },
    { top: '19%', left: '43%', size: 2, delay: '2.2s',  dur: '4.2s' },
    { top: '11%', left: '90%', size: 3, delay: '0.6s',  dur: '2.9s' },
    { top: '29%', left: '75%', size: 2, delay: '1.8s',  dur: '3.3s' },
  ];

  return (
    <>
      {/* Night sky gradient background */}
      <div className="ramadan-bg" aria-hidden="true" />

      {/* Twinkling stars */}
      <div className="ramadan-stars-layer" aria-hidden="true">
        {stars.map((s, i) => (
          <div
            key={i}
            className="ramadan-star"
            style={{
              top: s.top,
              left: s.left,
              width: s.size,
              height: s.size,
              animationDelay: s.delay,
              animationDuration: s.dur,
            }}
          />
        ))}
      </div>

      {/* Crescent moon — top right, using clipPath for a true crescent */}
      <div className="ramadan-moon-wrap" aria-hidden="true">
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <clipPath id="crescent-clip">
              {/* Show the big circle... */}
              <circle cx="32" cy="32" r="26" />
            </clipPath>
            <radialGradient id="moon-grad" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#fff8c0" />
              <stop offset="100%" stopColor="#f4c542" />
            </radialGradient>
          </defs>

          {/* Full golden circle, clipped to big circle */}
          <circle cx="32" cy="32" r="26" fill="url(#moon-grad)" clipPath="url(#crescent-clip)" />

          {/* Punch out the crescent shadow (offset circle = crescent shape) */}
          <circle cx="42" cy="24" r="22" fill="#1a0a3c" clipPath="url(#crescent-clip)" />

          {/* Soft glow ring */}
          <circle cx="32" cy="32" r="26" stroke="#f4c54260" strokeWidth="2" fill="none" />
        </svg>
      </div>

      {/* Mosque silhouette — bottom */}
      <div className="ramadan-mosque-wrap" aria-hidden="true">
        <svg
          viewBox="0 0 800 220"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMax meet"
          className="ramadan-mosque"
        >
          {/* Far left small minaret */}
          <rect x="30"  y="80"  width="18" height="140" rx="2" fill="#1a0a3c" />
          <ellipse cx="39"  cy="80"  rx="9"  ry="18" fill="#1a0a3c" />
          <rect x="36"  y="58"  width="6"  height="12" fill="#1a0a3c" />
          <polygon points="39,42 36,58 42,58" fill="#1a0a3c" />

          {/* Left minaret */}
          <rect x="120" y="55"  width="22" height="165" rx="2" fill="#1a0a3c" />
          <ellipse cx="131" cy="55"  rx="11" ry="22" fill="#1a0a3c" />
          <rect x="128" y="30"  width="6"  height="14" fill="#1a0a3c" />
          <polygon points="131,12 127,30 135,30" fill="#1a0a3c" />

          {/* Centre main dome */}
          <rect x="200" y="100" width="400" height="120" rx="4" fill="#1a0a3c" />
          <ellipse cx="400" cy="100" rx="130" ry="70" fill="#1a0a3c" />

          {/* Flanking domes */}
          <ellipse cx="270" cy="115" rx="60"  ry="38" fill="#1a0a3c" />
          <ellipse cx="530" cy="115" rx="60"  ry="38" fill="#1a0a3c" />

          {/* Arched doorway */}
          <ellipse cx="400" cy="220" rx="28" ry="40" fill="#2a1260" />
          <rect x="372" y="200" width="56" height="30" fill="#2a1260" />

          {/* Windows */}
          <ellipse cx="300" cy="145" rx="12" ry="16" fill="#2a1260" />
          <ellipse cx="500" cy="145" rx="12" ry="16" fill="#2a1260" />
          <ellipse cx="350" cy="135" rx="10" ry="14" fill="#2a1260" />
          <ellipse cx="450" cy="135" rx="10" ry="14" fill="#2a1260" />

          {/* Right minaret */}
          <rect x="658" y="55"  width="22" height="165" rx="2" fill="#1a0a3c" />
          <ellipse cx="669" cy="55"  rx="11" ry="22" fill="#1a0a3c" />
          <rect x="666" y="30"  width="6"  height="14" fill="#1a0a3c" />
          <polygon points="669,12 665,30 673,30" fill="#1a0a3c" />

          {/* Far right small minaret */}
          <rect x="752" y="80"  width="18" height="140" rx="2" fill="#1a0a3c" />
          <ellipse cx="761" cy="80"  rx="9"  ry="18" fill="#1a0a3c" />
          <rect x="758" y="58"  width="6"  height="12" fill="#1a0a3c" />
          <polygon points="761,42 757,58 765,58" fill="#1a0a3c" />

          {/* Ground */}
          <rect x="0" y="218" width="800" height="4" fill="#1a0a3c" />
        </svg>
      </div>
    </>
  );
};

export default RamadanDecorations;
