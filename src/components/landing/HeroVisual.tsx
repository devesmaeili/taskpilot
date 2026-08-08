export function HeroVisual() {
  return (
    <div className="hero-visual" aria-hidden="true">
      <div className="hero-visual-glow" />
      <svg
        className="hero-visual-art"
        viewBox="0 0 1440 900"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--hero-sky-start)" />
            <stop offset="55%" stopColor="var(--hero-sky-mid)" />
            <stop offset="100%" stopColor="var(--hero-sky-end)" />
          </linearGradient>
        </defs>

        <rect width="1440" height="900" fill="url(#sky)" />

        <g opacity="0.4">
          <path
            d="M0 620 C220 540 360 700 560 640 C760 580 860 500 1040 560 C1220 620 1320 540 1440 580 L1440 900 L0 900 Z"
            fill="var(--hero-wave)"
          />
          <path
            d="M0 700 C180 650 320 760 520 720 C740 670 900 610 1100 660 C1260 700 1360 650 1440 680 L1440 900 L0 900 Z"
            fill="var(--hero-wave-strong)"
          />
        </g>

        <ellipse
          className="hero-orbit-ring"
          cx="1120"
          cy="340"
          rx="230"
          ry="140"
          fill="none"
          stroke="var(--hero-orbit)"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  )
}
