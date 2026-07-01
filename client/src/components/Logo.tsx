export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="bluePurple" x1="20" y1="20" x2="90" y2="90">
          <stop stopColor="#38BDF8" />
          <stop offset="0.45" stopColor="#2563EB" />
          <stop offset="1" stopColor="#6D28D9" />
        </linearGradient>

        <linearGradient id="pinkCyan" x1="40" y1="10" x2="100" y2="90">
          <stop stopColor="#C026D3" />
          <stop offset="0.5" stopColor="#7C3AED" />
          <stop offset="1" stopColor="#22D3EE" />
        </linearGradient>

        <radialGradient id="glow">
          <stop stopColor="#38BDF8" stopOpacity="0.35" />
          <stop offset="1" stopColor="#020617" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background */}
      <circle cx="60" cy="60" r="55" fill="#18181B" />

      {/* Outer orbit */}
      <circle
        cx="60"
        cy="60"
        r="44"
        stroke="#2563EB"
        strokeWidth="2"
        opacity="0.7"
      />

      <circle
        cx="60"
        cy="60"
        r="42"
        fill="url(#glow)"
      />

      {/* Main AI ribbon A shape */}
      <path
        d="
        M25 85
        L52 18
        Q55 12 62 16
        L92 80
        Q96 88 87 91
        L72 95
        L50 48
        L38 85
        Z
        "
        fill="url(#bluePurple)"
      />

      {/* Upper curved ribbon */}
      <path
        d="
        M55 18
        C75 12 92 18 101 23
        L98 43
        C82 37 67 36 55 43
        L45 30
        Z
        "
        fill="url(#pinkCyan)"
      />

      {/* Lower curve */}
      <path
        d="
        M42 70
        C55 60 70 62 90 72
        L98 88
        C70 78 54 77 36 90
        Z
        "
        fill="url(#pinkCyan)"
        opacity="0.95"
      />

      {/* Neural network lines */}
      <path
        d="M52 58 L72 70 L91 62"
        stroke="#38BDF8"
        strokeWidth="2"
      />

      {/* Neural nodes */}
      <circle cx="52" cy="58" r="5" fill="#38BDF8" />
      <circle cx="72" cy="70" r="5" fill="#8B5CF6" />
      <circle cx="91" cy="62" r="4" fill="#67E8F9" />

      {/* Small center light */}
      <circle cx="61" cy="60" r="3" fill="#F8FAFC" />
    </svg>
  );
}