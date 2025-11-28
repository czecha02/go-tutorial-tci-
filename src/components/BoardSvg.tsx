import React from "react";

type Props = {
  size?: number; // px
  stones: Array<{ x: number; y: number; color: "B" | "W" }>;
  lastMove?: { x: number; y: number };
  hover?: { x: number; y: number; color: "B" | "W" } | null; // ghost stone
  onPlace?: (x: number, y: number) => void;
  onMouseMove?: (x: number, y: number) => void; // mouse move handler
  onMouseLeave?: () => void; // mouse leave handler
  onStoneClick?: (x: number, y: number) => void; // for dead stone marking
  showCoords?: boolean;
  liberties?: Array<{ x: number; y: number }>; // liberty points to highlight
  showLiberties?: boolean; // whether to show liberty highlighting
  blackTerritory?: Array<{ x: number; y: number }>; // black territory points to highlight
  whiteTerritory?: Array<{ x: number; y: number }>; // white territory points to highlight
  showBlackTerritory?: boolean; // whether to show black territory highlighting
  showWhiteTerritory?: boolean; // whether to show white territory highlighting
  deadStones?: Array<{ x: number; y: number }>; // dead stones to mark
  showDeadStones?: boolean; // whether to show dead stone marking
};

const N = 9;

export default function BoardSvg({
  size = 580,
  stones,
  lastMove,
  hover,
  onPlace,
  onMouseMove,
  onMouseLeave,
  onStoneClick,
  showCoords = true,
  liberties = [],
  showLiberties = false,
  blackTerritory = [],
  whiteTerritory = [],
  showBlackTerritory = false,
  showWhiteTerritory = false,
  deadStones = [],
  showDeadStones = false,
}: Props) {
  const padding = 40;
  const inner = size - padding * 2;
  const cell = inner / (N - 1);
  const stoneR = cell * 0.42; // slightly inside the grid

  const toXY = (i: number, j: number) => ({
    x: padding + i * cell,
    y: padding + j * cell,
  });

  const coords = Array.from({ length: N }, (_, i) => i);

  // Mouse → nearest intersection
  const handleClick: React.MouseEventHandler<SVGSVGElement> = (e) => {
    if (!onPlace) return;
    const rect = (e.target as SVGElement).closest("svg")!.getBoundingClientRect();
    const px = e.clientX - rect.left - padding;
    const py = e.clientY - rect.top - padding;
    const i = Math.round(px / cell);
    const j = Math.round(py / cell);
    if (i >= 0 && i < N && j >= 0 && j < N) onPlace(i, j);
  };

  // Mouse move handler with improved precision
  const handleMouseMove: React.MouseEventHandler<SVGSVGElement> = (e) => {
    if (!onMouseMove) return;
    const rect = (e.target as SVGElement).closest("svg")!.getBoundingClientRect();
    const px = e.clientX - rect.left - padding;
    const py = e.clientY - rect.top - padding;
    const i = Math.round(px / cell);
    const j = Math.round(py / cell);
    if (i >= 0 && i < N && j >= 0 && j < N) onMouseMove(i, j);
  };

  return (
    <svg
      width={size}
      height={size}
      role="img"
      aria-label="Go board 9 by 9"
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ background: "var(--tci-board, #8B4513)" }}
    >
      {/* Grid on dark wood board */}
      <g stroke="#4A2C17" strokeWidth={1.5}>
        {/* verticals */}
        {coords.map((i) => {
          const { x } = toXY(i, 0);
          const y1 = padding, y2 = size - padding;
          return <line key={`v-${i}`} x1={x} y1={y1} x2={x} y2={y2} />;
        })}
        {/* horizontals */}
        {coords.map((j) => {
          const { y } = toXY(0, j);
          const x1 = padding, x2 = size - padding;
          return <line key={`h-${j}`} x1={x1} y1={y} x2={x2} y2={y} />;
        })}
      </g>

      {/* Coordinate labels */}
      {showCoords && (
        <g fontSize={14} fill="#222" fontFamily="ui-sans-serif, system-ui" fontWeight="500">
          {/* All Columns A-I at top */}
          {coords.map((i) => {
            const { x } = toXY(i, 0);
            const label = String.fromCharCode("A".charCodeAt(0) + i);
            return (
              <text key={`col-top-${i}`} x={x} y={padding - 15} textAnchor="middle">{label}</text>
            );
          })}
          {/* All Columns A-I at bottom */}
          {coords.map((i) => {
            const { x } = toXY(i, 0);
            const label = String.fromCharCode("A".charCodeAt(0) + i);
            return (
              <text key={`col-bottom-${i}`} x={x} y={size - padding + 20} textAnchor="middle">{label}</text>
            );
          })}
          {/* All Rows 1-9 on left and right */}
          {coords.map((j) => {
            const { y } = toXY(0, j);
            const label = (j + 1).toString(); // 1, 2, 3, 4, 5, 6, 7, 8, 9
            return (
              <g key={`row-${j}`} dominantBaseline="middle">
                <text x={padding - 15} y={y} textAnchor="end">{label}</text>
                <text x={size - padding + 15} y={y} textAnchor="start">{label}</text>
              </g>
            );
          })}
        </g>
      )}

      {/* Hover ghost stone with improved smoothness */}
      {hover && (
        <circle
          cx={toXY(hover.x, hover.y).x}
          cy={toXY(hover.x, hover.y).y}
          r={stoneR}
          fill={hover.color === "B" ? "#1a1a1a" : "#f8f8f8"}
          opacity={0.4}
          stroke={hover.color === "B" ? "#e0e0e0" : "#2a2a2a"}
          strokeWidth={1.5}
          style={{ 
            transition: "cx 50ms ease-out, cy 50ms ease-out, opacity 100ms ease-out",
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
          }}
          pointerEvents="none"
        />
      )}

      {/* Liberty highlighting */}
      {showLiberties && liberties.map((liberty, idx) => {
        const { x, y } = toXY(liberty.x, liberty.y);
        return (
          <circle
            key={`liberty-${liberty.x}-${liberty.y}-${idx}`}
            cx={x}
            cy={y}
            r={stoneR * 0.6}
            fill="#ff6b6b"
            stroke="#ff4444"
            strokeWidth={2}
            opacity={0.8}
          >
            {/* Fast fade-in (150ms) → visible → fade-out (300ms) */}
            <animate
              attributeName="opacity"
              values="0;0.8;0.8;0"
              dur="4000ms"
              keyTimes="0;0.0375;0.925;1"
              fill="freeze"
            />
          </circle>
        );
      })}

      {/* Territory highlighting */}
      {showBlackTerritory && blackTerritory.map((territory, idx) => {
        const { x, y } = toXY(territory.x, territory.y);
        return (
          <circle
            key={`black-territory-${territory.x}-${territory.y}-${idx}`}
            cx={x}
            cy={y}
            r={stoneR * 0.3}
            fill="#333"
            stroke="#000"
            strokeWidth={1}
            opacity={0.3}
          />
        );
      })}

      {showWhiteTerritory && whiteTerritory.map((territory, idx) => {
        const { x, y } = toXY(territory.x, territory.y);
        return (
          <circle
            key={`white-territory-${territory.x}-${territory.y}-${idx}`}
            cx={x}
            cy={y}
            r={stoneR * 0.3}
            fill="#fff"
            stroke="#333"
            strokeWidth={1}
            opacity={0.5}
          />
        );
      })}

      {/* Stones */}
      <g>
        {stones.map((s, idx) => {
          const { x, y } = toXY(s.x, s.y);
          const isLast = lastMove && lastMove.x === s.x && lastMove.y === s.y;
          const isDead = showDeadStones && deadStones.some(dead => dead.x === s.x && dead.y === s.y);
          
          return (
            <g key={idx}>
              <circle
                cx={x}
                cy={y}
                r={stoneR}
                fill={s.color === "B" ? "#0a0a0a" : "#ffffff"}
                stroke={s.color === "B" ? "#333" : "#1a1a1a"}
                strokeWidth={s.color === "W" ? 1.5 : 0.5}
                opacity={isDead ? 0.3 : 1}
                style={{ cursor: onStoneClick ? 'pointer' : 'default' }}
                onClick={() => onStoneClick?.(s.x, s.y)}
              >
                {/* scale-in animation */}
                <animate attributeName="r" from={0} to={stoneR} dur="120ms" fill="freeze" />
              </circle>
              {isDead && (
                <circle
                  cx={x}
                  cy={y}
                  r={stoneR * 0.8}
                  fill="none"
                  stroke="red"
                  strokeWidth={2}
                  opacity={0.8}
                />
              )}
              {isLast && (
                <circle cx={x} cy={y} r={stoneR * 0.18} fill={s.color === "B" ? "#e9e9e9" : "#222"} />
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
}

// Helper component for captured stones with fade-out animation
export function CapturedStone({ x, y, color, r }: { x: number; y: number; color: "B"|"W"; r: number }) {
  return (
    <circle cx={x} cy={y} r={r} fill={color === "B" ? "#0a0a0a" : "#ffffff"} opacity={1}>
      <animate attributeName="opacity" from="1" to="0" dur="200ms" fill="freeze" />
    </circle>
  );
}



