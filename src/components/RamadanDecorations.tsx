/**
 * Ramadan Theme Decorations - Visual Enhancement Layer Only
 * CSS-only animations, inline SVG, no external assets
 * Optimized for low-end Android WebView
 */
const RamadanDecorations = () => {
  const stars = [
    { top: '6%',  left: '5%',  size: 3, delay: '0s',    dur: '2.8s' },
    { top: '10%', left: '20%', size: 2, delay: '0.5s',  dur: '3.2s' },
    { top: '4%',  left: '38%', size: 4, delay: '1.1s',  dur: '2.5s' },
    { top: '14%', left: '55%', size: 2, delay: '0.3s',  dur: '3.8s' },
    { top: '7%',  left: '72%', size: 3, delay: '1.6s',  dur: '2.2s' },
    { top: '18%', left: '85%', size: 2, delay: '0.8s',  dur: '4.0s' },
    { top: '22%', left: '12%', size: 2, delay: '2.0s',  dur: '3.0s' },
    { top: '28%', left: '30%', size: 3, delay: '1.4s',  dur: '2.7s' },
    { top: '3%',  left: '60%', size: 2, delay: '0.9s',  dur: '3.5s' },
    { top: '20%', left: '45%', size: 2, delay: '2.2s',  dur: '4.2s' },
    { top: '12%', left: '92%', size: 3, delay: '0.6s',  dur: '2.9s' },
    { top: '30%', left: '78%', size: 2, delay: '1.8s',  dur: '3.3s' },
  ];

  return (
    <>
      {/* Night sky gradient background */}
      <div
        className="ramadan-bg"
        aria-hidden="true"
      />

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

      {/* Crescent moon — top right */}
      <div className="ramadan-moon-wrap" aria-hidden="true">
        <svg
          width="54"
          height="54"
          viewBox="0 0 54 54"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="ramadan-moon"
        >
          {/* Crescent shape: full circle minus an offset circle */}
          <circle cx="27" cy="27" r="22" fill="#c8f5b0" opacity="0.92" />
          <circle cx="38" cy="20" r="18" fill="transparent"
            style={{ mixBlendMode: 'multiply' }}
          />
          {/* Overlay the cut-out using the bg color to create crescent illusion */}
          <circle cx="37" cy="19" r="17" fill="#0d2a1a" opacity="0.95" />
          {/* Glow ring */}
          <circle cx="27" cy="27" r="22" stroke="#a3e88a" strokeWidth="1.5" fill="none" opacity="0.4" />
        </svg>
      </div>

      {/* Mosque silhouette — bottom of screen */}
      <div className="ramadan-mosque-wrap" aria-hidden="true">
        <svg
          viewBox="0 0 800 220"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMax meet"
          className="ramadan-mosque"
        >
          {/* Far left small minaret */}
          <rect x="30" y="80" width="18" height="140" rx="2" fill="#0a2218" />
          <ellipse cx="39" cy="80" rx="9" ry="18" fill="#0a2218" />
          <rect x="36" y="58" width="6" height="12" fill="#0a2218" />
          <polygon points="39,42 36,58 42,58" fill="#0a2218" />

          {/* Left minaret */}
          <rect x="120" y="55" width="22" height="165" rx="2" fill="#0a2218" />
          <ellipse cx="131" cy="55" rx="11" ry="22" fill="#0a2218" />
          <rect x="128" y="30" width="6" height="14" fill="#0a2218" />
          <polygon points="131,12 127,30 135,30" fill="#0a2218" />

          {/* Center main dome */}
          <rect x="200" y="100" width="400" height="120" rx="4" fill="#0a2218" />
          <ellipse cx="400" cy="100" rx="130" ry="70" fill="#0a2218" />

          {/* Smaller dome left */}
          <ellipse cx="270" cy="115" rx="60" ry="38" fill="#0a2218" />
          {/* Smaller dome right */}
          <ellipse cx="530" cy="115" rx="60" ry="38" fill="#0a2218" />

          {/* Arched doorway */}
          <ellipse cx="400" cy="220" rx="28" ry="40" fill="#122e1e" />
          <rect x="372" y="200" width="56" height="30" fill="#122e1e" />

          {/* Windows - arched */}
          <ellipse cx="300" cy="145" rx="12" ry="16" fill="#122e1e" />
          <ellipse cx="500" cy="145" rx="12" ry="16" fill="#122e1e" />
          <ellipse cx="350" cy="135" rx="10" ry="14" fill="#122e1e" />
          <ellipse cx="450" cy="135" rx="10" ry="14" fill="#122e1e" />

          {/* Right minaret */}
          <rect x="658" y="55" width="22" height="165" rx="2" fill="#0a2218" />
          <ellipse cx="669" cy="55" rx="11" ry="22" fill="#0a2218" />
          <rect x="666" y="30" width="6" height="14" fill="#0a2218" />
          <polygon points="669,12 665,30 673,30" fill="#0a2218" />

          {/* Far right small minaret */}
          <rect x="752" y="80" width="18" height="140" rx="2" fill="#0a2218" />
          <ellipse cx="761" cy="80" rx="9" ry="18" fill="#0a2218" />
          <rect x="758" y="58" width="6" height="12" fill="#0a2218" />
          <polygon points="761,42 757,58 765,58" fill="#0a2218" />

          {/* Ground line */}
          <rect x="0" y="218" width="800" height="4" fill="#0a2218" />
        </svg>
      </div>
    </>
  );
};

export default RamadanDecorations;
