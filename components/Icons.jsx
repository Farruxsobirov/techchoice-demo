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

/* Line icons for the Design page cards (choose by name in WordPress). */
const LINE = {
  scan: (
    <>
      <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" />
      <circle cx="11.5" cy="11.5" r="3" />
      <path d="m16 16-2.3-2.3" />
    </>
  ),
  chart: <path d="M4 21v-3M8 21v-7M12 21v-5M16 21v-7M20 21V10M2 15l6.6-6.6a.5.5 0 0 1 .7 0l3.3 3.3a.5.5 0 0 0 .7 0L22 3" />,
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  plug: (
    <>
      <path d="m19 5 3-3M2 22l3-3M7.5 13.5 10 11M10.5 16.5 13 14" />
      <path d="M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4ZM12 6l6 6 2.3-2.3a2.4 2.4 0 0 0 0-3.4l-2.6-2.6a2.4 2.4 0 0 0-3.4 0Z" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="5" r="2" />
      <path d="m12.99 6.74 1.93 3.44M19.14 12a10 10 0 0 1-14.27 0M21 21l-2.16-3.84M3 21l8.02-14.26" />
    </>
  ),
  filter: <path d="M3 6h18M7 12h10M10 18h4" />,
  contract: (
    <>
      <path d="m18 5-2.4-2.4A2 2 0 0 0 14.2 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2" />
      <path d="M21.4 12.6a1 1 0 0 0-3-3l-4 4a2 2 0 0 0-.5.85l-.84 2.87a.5.5 0 0 0 .62.62l2.87-.84a2 2 0 0 0 .85-.5zM8 18h1" />
    </>
  ),
  route: (
    <>
      <circle cx="6" cy="19" r="3" />
      <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
      <circle cx="18" cy="5" r="3" />
    </>
  ),
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />,
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 3 3 5-6" />
    </>
  ),
};

export function LineIcon({ name }) {
  return (
    <svg {...base} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {LINE[name] || LINE.scan}
    </svg>
  );
}
