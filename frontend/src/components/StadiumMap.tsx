import React from 'react';

interface StadiumMapProps {
  highlightZone?: string;
  onGateSelect?: (gateId: string) => void;
  gatesData?: Array<{
    id: string;
    name: string;
    congestion: number;
    waitTime: number;
    status: string;
  }>;
}

export const StadiumMap: React.FC<StadiumMapProps> = ({
  highlightZone = 'default',
  onGateSelect,
  gatesData = []
}) => {
  // Find congestion percentage for styling
  const getGateColor = (gateId: string) => {
    const gate = gatesData.find(g => g.id === gateId);
    if (!gate) return '#00cc66'; // default green
    if (gate.congestion >= 80) return '#ef4444'; // critical red
    if (gate.congestion >= 40) return '#f59e0b'; // warning yellow
    return '#00cc66'; // clear green
  };

  const isHighlighted = (zoneId: string) => {
    if (highlightZone === 'accessibility_path' && zoneId === 'access_path') return true;
    return highlightZone === zoneId;
  };

  const handleKeyPress = (e: React.KeyboardEvent, gateId: string) => {
    if ((e.key === 'Enter' || e.key === ' ') && onGateSelect) {
      e.preventDefault();
      onGateSelect(gateId);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* SVG Container */}
      <div className="relative w-full max-w-[480px] aspect-square bg-[#0f0e26] rounded-2xl border border-indigo-950 p-4 shadow-inner">
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full select-none"
          aria-label="Stadium interactive layout map. Shows gates, seating sectors, and accessibility paths."
          role="img"
        >
          <defs>
            {/* Pulsing glow filters for alerts */}
            <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-blue" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-gold" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Boundary Ground */}
          <circle cx="250" cy="250" r="230" fill="#131230" stroke="#1d1b4b" strokeWidth="2" />

          {/* Outer Spec Walking Track (Dotted circle) */}
          <circle
            cx="250"
            cy="250"
            r="200"
            fill="none"
            stroke="#312e81"
            strokeWidth="3"
            strokeDasharray="6,8"
          />

          {/* Accessibility Route Highlight - Neon Blue (Solid Line from Gate 2 & Gate 5 to Sectors) */}
          <path
            d="M 430 250 C 370 250, 320 280, 290 280 M 360 140 C 320 160, 290 200, 280 220"
            fill="none"
            stroke={isHighlighted('access_path') || highlightZone === 'accessibility_path' ? '#38bdf8' : '#1e3a8a'}
            strokeWidth={isHighlighted('access_path') || highlightZone === 'accessibility_path' ? '6' : '3'}
            strokeLinecap="round"
            className="transition-all duration-300"
            filter={isHighlighted('access_path') || highlightZone === 'accessibility_path' ? 'url(#glow-blue)' : undefined}
          />
          {/* Wheelchair accessible path overlay label */}
          {(isHighlighted('access_path') || highlightZone === 'accessibility_path') && (
            <text x="320" y="270" fill="#38bdf8" fontSize="11" fontWeight="bold" className="animate-pulse">
              ★ Accessible Route
            </text>
          )}

          {/* Stadium Seating Bowl (Large Oval) */}
          <ellipse
            cx="250"
            cy="250"
            rx="160"
            ry="130"
            fill="#18163c"
            stroke="#2e2b66"
            strokeWidth="4"
          />

          {/* Sector Delineations & Seats Blocks */}
          {/* Sector A (Top-Left) */}
          <path
            d="M 120 200 A 150 120 0 0 1 250 130 L 250 210 A 50 40 0 0 0 200 230 Z"
            fill={isHighlighted('sector_a') ? '#4338ca' : '#1e1b4e'}
            stroke="#312e81"
            strokeWidth="2"
            className="cursor-pointer transition-colors duration-200 hover:fill-indigo-900"
            onClick={() => onGateSelect && onGateSelect('sector_a')}
          />
          <text x="170" y="180" fill="#9ca3af" fontSize="12" fontWeight="bold">SEC A</text>

          {/* Sector B (Top-Right) */}
          <path
            d="M 250 130 A 150 120 0 0 1 380 200 L 300 230 A 50 40 0 0 0 250 210 Z"
            fill={isHighlighted('sector_b') ? '#4338ca' : '#1e1b4e'}
            stroke="#312e81"
            strokeWidth="2"
            className="cursor-pointer transition-colors duration-200 hover:fill-indigo-900"
            onClick={() => onGateSelect && onGateSelect('sector_b')}
          />
          <text x="300" y="180" fill="#9ca3af" fontSize="12" fontWeight="bold">SEC B</text>

          {/* Sector C (Bottom-Left) */}
          <path
            d="M 120 300 A 150 120 0 0 0 250 370 L 250 290 A 50 40 0 0 1 200 270 Z"
            fill={isHighlighted('sector_c') ? '#4338ca' : '#1e1b4e'}
            stroke="#312e81"
            strokeWidth="2"
            className="cursor-pointer transition-colors duration-200 hover:fill-indigo-900"
            onClick={() => onGateSelect && onGateSelect('sector_c')}
          />
          <text x="170" y="330" fill="#9ca3af" fontSize="12" fontWeight="bold">SEC C</text>

          {/* Sector D (Bottom-Right) */}
          <path
            d="M 250 370 A 150 120 0 0 0 380 300 L 300 270 A 50 40 0 0 1 250 290 Z"
            fill={isHighlighted('sector_d') ? '#4338ca' : '#1e1b4e'}
            stroke="#312e81"
            strokeWidth="2"
            className="cursor-pointer transition-colors duration-200 hover:fill-indigo-900"
            onClick={() => onGateSelect && onGateSelect('sector_d')}
          />
          <text x="300" y="330" fill="#9ca3af" fontSize="12" fontWeight="bold">SEC D</text>

          {/* Inner Pitch (Green Field) */}
          <rect x="200" y="220" width="100" height="60" fill="#065f46" stroke="#059669" strokeWidth="2" rx="4" />
          {/* Pitch lines */}
          <line x1="250" y1="220" x2="250" y2="280" stroke="#047857" strokeWidth="2" />
          <circle cx="250" cy="250" r="12" fill="none" stroke="#047857" strokeWidth="2" />

          {/* GATES (Interactive buttons around the perimeter) */}
          {/* Gate 1 (VIP - North) */}
          <g
            role="button"
            tabIndex={0}
            aria-label="Gate 1 North VIP access. Congestion low."
            onClick={() => onGateSelect && onGateSelect('gate_1')}
            onKeyDown={(e) => handleKeyPress(e, 'gate_1')}
            className="cursor-pointer focus:outline-none"
          >
            <circle
              cx="250"
              cy="50"
              r="18"
              fill={getGateColor('gate_1')}
              stroke="#ffffff"
              strokeWidth={isHighlighted('gate_1') ? '3' : '1'}
              className="transition-all duration-300 hover:scale-110"
              filter={isHighlighted('gate_1') ? 'url(#glow-gold)' : undefined}
            />
            <text x="250" y="54" fill="#000000" fontSize="10" fontWeight="bold" textAnchor="middle">G1</text>
            <text x="250" y="28" fill="#e5e7eb" fontSize="10" textAnchor="middle">Gate 1 (VIP)</text>
          </g>

          {/* Gate 2 (East - Accessible) */}
          <g
            role="button"
            tabIndex={0}
            aria-label="Gate 2 East. Accessible entry. Congestion moderate."
            onClick={() => onGateSelect && onGateSelect('gate_2')}
            onKeyDown={(e) => handleKeyPress(e, 'gate_2')}
            className="cursor-pointer focus:outline-none"
          >
            <circle
              cx="440"
              cy="250"
              r="18"
              fill={getGateColor('gate_2')}
              stroke="#ffffff"
              strokeWidth={isHighlighted('gate_2') ? '3' : '1'}
              className="transition-all duration-300 hover:scale-110"
              filter={isHighlighted('gate_2') ? 'url(#glow-gold)' : undefined}
            />
            <text x="440" y="254" fill="#000000" fontSize="10" fontWeight="bold" textAnchor="middle">G2</text>
            <text x="440" y="282" fill="#38bdf8" fontSize="10" textAnchor="middle">♿ Gate 2</text>
          </g>

          {/* Gate 3 (South) */}
          <g
            role="button"
            tabIndex={0}
            aria-label="Gate 3 South. Congestion low."
            onClick={() => onGateSelect && onGateSelect('gate_3')}
            onKeyDown={(e) => handleKeyPress(e, 'gate_3')}
            className="cursor-pointer focus:outline-none"
          >
            <circle
              cx="250"
              cy="450"
              r="18"
              fill={getGateColor('gate_3')}
              stroke="#ffffff"
              strokeWidth={isHighlighted('gate_3') ? '3' : '1'}
              className="transition-all duration-300 hover:scale-110"
              filter={isHighlighted('gate_3') ? 'url(#glow-gold)' : undefined}
            />
            <text x="250" y="454" fill="#000000" fontSize="10" fontWeight="bold" textAnchor="middle">G3</text>
            <text x="250" y="482" fill="#e5e7eb" fontSize="10" textAnchor="middle">Gate 3</text>
          </g>

          {/* Gate 4 (West - Bottlenecked) */}
          <g
            role="button"
            tabIndex={0}
            aria-label="Gate 4 West. Congestion critical. Delays expected."
            onClick={() => onGateSelect && onGateSelect('gate_4')}
            onKeyDown={(e) => handleKeyPress(e, 'gate_4')}
            className="cursor-pointer focus:outline-none"
          >
            {/* Blinking outer circle for high congestion */}
            <circle
              cx="60"
              cy="250"
              r="26"
              fill="none"
              stroke="#ef4444"
              strokeWidth="2"
              className="animate-ping"
              style={{ animationDuration: '1.5s' }}
            />
            <circle
              cx="60"
              cy="250"
              r="18"
              fill={getGateColor('gate_4')}
              stroke="#ffffff"
              strokeWidth={isHighlighted('gate_4') ? '3' : '1'}
              className="transition-all duration-300 hover:scale-110"
              filter="url(#glow-red)"
            />
            <text x="60" y="254" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">G4</text>
            <text x="60" y="282" fill="#ef4444" fontSize="10" fontWeight="bold" textAnchor="middle">⚠️ Gate 4</text>
          </g>

          {/* Gate 5 (Northeast - Accessible) */}
          <g
            role="button"
            tabIndex={0}
            aria-label="Gate 5 Northeast. Accessible entry. Congestion low."
            onClick={() => onGateSelect && onGateSelect('gate_5')}
            onKeyDown={(e) => handleKeyPress(e, 'gate_5')}
            className="cursor-pointer focus:outline-none"
          >
            <circle
              cx="360"
              cy="120"
              r="18"
              fill={getGateColor('gate_5')}
              stroke="#ffffff"
              strokeWidth={isHighlighted('gate_5') ? '3' : '1'}
              className="transition-all duration-300 hover:scale-110"
              filter={isHighlighted('gate_5') ? 'url(#glow-gold)' : undefined}
            />
            <text x="360" y="124" fill="#000000" fontSize="10" fontWeight="bold" textAnchor="middle">G5</text>
            <text x="390" y="105" fill="#38bdf8" fontSize="10" textAnchor="middle">♿ Gate 5</text>
          </g>
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 justify-center text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-[#00cc66]" /> Clear Queue (&lt; 5m)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-[#f59e0b]" /> Moderate Queue (5-15m)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-[#ef4444] animate-pulse" /> Congested Queue (&gt; 25m)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-6 h-0.5 border-t-2 border-dashed border-[#1e3a8a]" /> Regular Walkway
        </span>
        <span className="flex items-center gap-1">
          <span className="w-6 h-0.5 border-t-2 border-[#38bdf8]" /> Accessible Path ♿
        </span>
      </div>
    </div>
  );
};
