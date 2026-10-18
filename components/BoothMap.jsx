/**
 * Gartner floor plan: booths, elevators → our booth route, "TechChoice is here" tag.
 * Drawn as SVG (sharp at any size, animated when it scrolls into view).
 * The highlighted booth comes from WordPress (booth number); the route is drawn to booth 140's spot.
 */

// [label, x, y, w, h, grey?]
const BOOTHS = [
  ['548', 153, 42, 152, 77], ['449', 153, 120, 152, 77], ['447', 363, 42, 76, 155], ['445', 443, 42, 76, 155],
  ['437', 642, 42, 154, 155, 1], ['431', 887, 42, 156, 155, 1],
  ['448', 153, 262, 152, 72], ['349', 153, 335, 152, 72], ['347', 363, 262, 76, 149], ['345', 443, 262, 76, 149],
  ['337', 642, 262, 154, 149, 1], ['331', 887, 262, 156, 149, 1],
  ['350', 153, 472, 72, 77], ['348', 227, 472, 72, 77], ['251', 153, 551, 72, 76], ['249', 227, 551, 72, 76],
  ['346', 326, 472, 72, 77], ['342', 399, 472, 151, 77], ['247', 326, 551, 72, 76], ['245', 399, 551, 77, 76], ['243', 478, 551, 72, 76],
  ['336', 646, 472, 156, 77], ['239', 646, 551, 72, 76], ['237', 720, 551, 82, 76],
  ['332', 856, 472, 72, 77], ['233', 856, 551, 72, 76], ['231', 935, 472, 76, 155],
  ['250', 153, 692, 72, 77], ['248', 227, 692, 72, 77], ['151', 153, 770, 72, 77], ['149', 227, 770, 72, 77],
  ['246', 326, 692, 72, 77], ['242', 399, 692, 151, 77], ['147', 326, 770, 72, 77], ['145', 399, 770, 77, 77], ['143', 478, 770, 72, 77],
  ['238', 646, 692, 72, 77], ['236', 720, 692, 82, 77], ['139', 646, 770, 72, 77], ['137', 720, 770, 82, 77],
  ['234', 856, 692, 72, 77], ['232', 930, 692, 117, 77], ['135', 856, 770, 72, 77], ['133', 930, 770, 43, 77], ['131', 975, 770, 72, 77],
  ['148', 290, 922, 72, 76], ['146', 363, 922, 72, 76], ['142', 464, 922, 72, 76], ['140', 537, 922, 76, 76], ['138', 625, 922, 72, 76],
  ['132', 908, 922, 72, 76], ['130', 981, 922, 72, 76],
];
const NODES = [228, 412, 597, 782, 965];

export default function BoothMap({ booth = '140', tag = 'TechChoice is here', label = 'Booth locator' }) {
  return (
    <svg className="ev-plan" viewBox="0 0 1080 1100" role="img" aria-label={`${label}: ${tag} — booth ${booth}`}>
      <defs>
        <linearGradient id="evRoute" gradientUnits="userSpaceOnUse" x1="119" y1="229" x2="597" y2="930">
          <stop offset="0" stopColor="#FD2E44" />
          <stop offset=".45" stopColor="#EC01A0" />
          <stop offset="1" stopColor="#5E41FB" />
        </linearGradient>
        <linearGradient id="evBooth" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#EC01A0" />
          <stop offset="1" stopColor="#8A1BEF" />
        </linearGradient>
      </defs>

      <rect x="17" y="20" width="1046" height="1062" rx="30" fill="#f4f4f5" />

      {/* booths */}
      {BOOTHS.map(([n, x, y, w, h, grey]) => {
        const on = n === String(booth);
        return (
          <g key={n} className={on ? 'ev-b on' : 'ev-b'}>
            {on ? <rect x={x - 7} y={y - 7} width={w + 14} height={h + 14} fill="#EC01A0" opacity=".22" className="ev-b-glow" /> : null}
            <rect x={x} y={y} width={w} height={h} fill={on ? 'url(#evBooth)' : grey ? '#dededf' : '#fff'} stroke={on ? '#111' : '#cfcfd3'} strokeWidth={on ? 3 : 1.5} />
            <text x={x + w / 2} y={y + h / 2} dy=".35em" textAnchor="middle" fontSize={on ? 27 : grey ? 25 : 21} fontWeight={on ? 700 : 500} fill={on ? '#fff' : grey ? '#555' : '#6b6b70'}>
              {n}
            </text>
          </g>
        );
      })}

      {/* elevators */}
      <rect x="27" y="69" width="92" height="310" rx="10" fill="#0d0d0f" />
      <text x="73" y="224" transform="rotate(-90 73 224)" textAnchor="middle" dy=".35em" fontSize="19" fontWeight="700" letterSpacing="3" fill="#fff">
        ELEVATORS
      </text>

      {/* route */}
      <path className="ev-route" d="M119 229 H597 V912" pathLength="1" fill="none" stroke="url(#evRoute)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <path className="ev-arrow" d="M579 900 L597 932 L615 900 Z" fill="#3b34f5" />
      {NODES.map((cx, i) => (
        <g key={cx} className="ev-node" style={{ '--n': i }}>
          <circle cx={cx} cy="229" r="17" fill="#fff" stroke="#0d0d0f" strokeWidth="5" />
          <circle cx={cx} cy="229" r="7" fill={['#FD2E44', '#F7176F', '#EC01A0', '#C906C0', '#A10EDA'][i]} />
        </g>
      ))}

      {/* tag */}
      <g className="ev-tag">
        <rect x="622" y="868" width="207" height="38" rx="19" fill="#0d0d0f" />
        <text x="725.5" y="887" dy=".35em" textAnchor="middle" fontSize="19" fontWeight="700" fill="#fff">
          {tag}
        </text>
      </g>

      {/* exits */}
      <line x1="27" y1="1043" x2="1063" y2="1043" stroke="#9a9aa0" strokeWidth="4" />
      <text x="73" y="1064" fontSize="18" fontWeight="700" letterSpacing="2" fill="#6b6b70">
        EXITS
      </text>
    </svg>
  );
}
