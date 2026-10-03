const base = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'aria-hidden': true };

export function ArrowUpRight() {
  return (
    <svg {...base} strokeWidth="1.6">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export function ArrowDown() {
  return (
    <svg {...base} strokeWidth="1.6">
      <path d="M12 4v16M6 14l6 6 6-6" />
    </svg>
  );
}

export function ArrowUp() {
  return (
    <svg {...base} strokeWidth="1.6">
      <path d="M12 20V4M6 10l6-6 6 6" />
    </svg>
  );
}

export function Asterisk() {
  return (
    <svg {...base} strokeWidth="1.3">
      <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4" />
    </svg>
  );
}

/** Tile icons, chosen per tile in WordPress. */
const TILE = {
  chip: (
    <>
      <rect x="7" y="7" width="10" height="10" rx="1.5" />
      <rect x="10" y="10" width="4" height="4" />
      <path d="M9.5 3v4M14.5 3v4M9.5 17v4M14.5 17v4M3 9.5h4M3 14.5h4M17 9.5h4M17 14.5h4" />
    </>
  ),
  cloud: (
    <>
      <path d="M7 18H6.5a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 17.6 8.1 4.5 4.5 0 0 1 17.5 18H17" />
      <path d="M12 20v-8M9 15l3-3 3 3" />
    </>
  ),
  chart: (
    <>
      <path d="M3 4v16h18" />
      <path d="m6 9 4 4 3-3 6 6" />
      <path d="M19 12v4h-4" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 4.5 6v5.5c0 4.6 3.1 8.2 7.5 9.5 4.4-1.3 7.5-4.9 7.5-9.5V6L12 3Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  bolt: <path d="M13 3 5 13.5h6L10 21l8-10.5h-6L13 3Z" />,
  users: (
    <>
      <circle cx="9" cy="8.5" r="3.2" />
      <path d="M3.5 19.5c.6-3.1 2.8-5 5.5-5s4.9 1.9 5.5 5" />
      <circle cx="16.8" cy="9.3" r="2.5" />
      <path d="M16 14.6c2.3.1 4 1.7 4.5 4.4" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10.5" width="14" height="10" rx="1.8" />
      <path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2.8v2.6M12 18.6v2.6M21.2 12h-2.6M5.4 12H2.8M18.5 5.5l-1.8 1.8M7.3 16.7l-1.8 1.8M18.5 18.5l-1.8-1.8M7.3 7.3 5.5 5.5" />
    </>
  ),
};

export function TileIcon({ name }) {
  return (
    <svg {...base} strokeWidth="1.4">
      {TILE[name] || TILE.chip}
    </svg>
  );
}
