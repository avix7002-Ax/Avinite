interface AviniteLogoProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

export function AviniteLogo({ size = 40, className = '', animated = false }: AviniteLogoProps) {
  const uid = Math.random().toString(36).slice(2, 9);
  return (
    <div
      className={`${className} ${animated ? 'avinite-logo-entrance' : ''} avinite-logo-3d`}
      style={{ width: size, height: size, perspective: `${size * 2}px` }}
    >
      <div className="avinite-logo-inner" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Avinite AI logo"
        >
          <defs>
            <linearGradient id={`aviniteGradMain-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="40%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <linearGradient id={`aviniteGradMetal-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.2" />
            </linearGradient>
            <filter id={`aviniteGlow-${uid}`} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id={`aviniteOuterGlow-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3.5" result="outerBlur" />
              <feFlood floodColor="#6366f1" floodOpacity="0.6" result="glowColor" />
              <feComposite in="glowColor" in2="outerBlur" operator="in" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect x="3" y="3" width="42" height="42" rx="13" fill={`url(#aviniteGradMain-${uid})`} opacity="0.15" />
          <rect x="4" y="4" width="40" height="40" rx="12" fill={`url(#aviniteGradMain-${uid})`} filter={`url(#aviniteOuterGlow-${uid})`} />
          <rect x="4" y="4" width="40" height="40" rx="12" fill={`url(#aviniteGradMetal-${uid})`} />
          <rect x="4" y="4" width="40" height="40" rx="12" fill="none" stroke="white" strokeWidth="0.8" opacity="0.25" />
          <g filter={`url(#aviniteGlow-${uid})`}>
            <path d="M 15 35 L 24 11 L 33 35" stroke="white" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.95" />
            <path d="M 19 27.5 L 29 27.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.75" />
          </g>
          <circle cx="24" cy="9.5" r="3.2" fill={`url(#aviniteGradMain-${uid})`} />
          <circle cx="24" cy="9.5" r="1.5" fill="white" opacity="0.95" />
          <ellipse cx="24" cy="10" rx="14" ry="5" fill="white" opacity="0.08" />
        </svg>
      </div>
    </div>
  );
}
