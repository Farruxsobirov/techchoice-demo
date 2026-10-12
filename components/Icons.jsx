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
  kanban: <path d="M6 5v11M12 5v6M18 5v14" />,
  shield_alert: (
    <>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="M12 8v4M12 16h.01" />
    </>
  ),
  handshake: (
    <>
      <path d="m11 17 2 2a1 1 0 1 0 3-3M14 14l2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
      <path d="m21 3 1 11h-2M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3M3 4h8" />
    </>
  ),
  eye: (
    <>
      <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" />
      <circle cx="12" cy="12" r="1" />
      <path d="M18.94 12.33a1 1 0 0 0 0-.66 7.5 7.5 0 0 0-13.88 0 1 1 0 0 0 0 .66 7.5 7.5 0 0 0 13.88 0" />
    </>
  ),
  calendar: (
    <>
      <path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5M16 2v4M8 2v4M3 10h5M17.5 17.5 16 16.3V14" />
      <circle cx="16" cy="16" r="6" />
    </>
  ),
  wallet: (
    <>
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
    </>
  ),
  dashboard: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 21V9" />
    </>
  ),
  report: (
    <>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4M8 18v-1M12 18v-6M16 18v-3" />
    </>
  ),
  refresh: <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8M21 3v5h-5M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16M8 16H3v5" />,
  receipt: <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1ZM14 8H8M16 12H8M13 16H8" />,
  etm: (
    <>
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <circle cx="12" cy="12" r="2.2" />
      <path d="M12 8.4v1.3M12 14.3v1.3M8.4 12h1.3M14.3 12h1.3M9.5 9.5l.9.9M13.6 13.6l.9.9M14.5 9.5l-.9.9M10.4 13.6l-.9.9" />
    </>
  ),
  calendar_range: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M3 10h18M8 2v4M17 14h-6M13 18H7M7 14h.01M17 18h.01" />
    </>
  ),
  badge: <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76ZM9 12l2 2 4-4" />,
  sliders: <path d="M21 4h-7M10 4H3M21 12h-9M8 12H3M21 20h-5M12 20H3M14 2v4M8 10v4M16 18v4" />,
  boxes: (
    <>
      <path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42ZM7 16.5l-4.74-2.85M7 16.5l5-3M7 16.5v5.17" />
      <path d="M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3ZM17 16.5l-5-3M17 16.5l4.74-2.85M17 16.5v5.17" />
      <path d="M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8ZM12 8 7.26 5.15M12 8l4.74-2.85M12 13.5V8" />
    </>
  ),
  pie: <path d="M21 12c.55 0 1-.45.95-1A10 10 0 0 0 13 2.05c-.55-.06-1 .4-1 .95v8a1 1 0 0 0 1 1zM21.21 15.89A10 10 0 1 1 8 2.83" />,
  file_in: <path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4M14 2v4a2 2 0 0 0 2 2h4M2 15h10M9 18l3-3-3-3" />,
  macd: (
    <>
      <circle cx="5" cy="6" r="3" />
      <circle cx="19" cy="18" r="3" />
      <path d="M5 9v12M15 9l-3-3 3-3M12 6h5a2 2 0 0 1 2 2v7" />
    </>
  ),
  messages: <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2zM18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />,
  pin: (
    <>
      <path d="M12 2.5a4.5 4.5 0 0 0-4.5 4.5c0 3.2 4.5 7 4.5 7s4.5-3.8 4.5-7A4.5 4.5 0 0 0 12 2.5Z" />
      <circle cx="12" cy="7" r="1.5" />
      <path d="M3.5 21.5a8.5 5.5 0 0 1 17 0" />
    </>
  ),
  trend: <path d="M22 7l-8.5 8.5-5-5L2 17M16 7h6v6" />,
  workflow: (
    <>
      <rect x="3" y="3" width="8" height="8" rx="2" />
      <path d="M7 11v4a2 2 0 0 0 2 2h4" />
      <rect x="13" y="13" width="8" height="8" rx="2" />
    </>
  ),
  calendar_check: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M8 2v4M16 2v4M3 10h18M9 16l2 2 4-4" />
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
