'use client';

/**
 * Atari Go Board Component
 * Specialized board for Capture Go games
 */

import React, { useState, useCallback, useMemo } from 'react';
import { AtariBoard as AtariBoardType, AtariMove } from '@/lib/atariEngine';

interface AtariBoardProps {
  board: AtariBoardType;
  onMove: (x: number, y: number) => void;
  onUndo?: () => void;
  showCoordinates?: boolean;
  highlightLiberties?: boolean;
  highlightCaptures?: boolean;
  disabled?: boolean;
  size?: number;
}

export default function AtariBoard({
  board,
  onMove,
  onUndo,
  showCoordinates = true,
  highlightLiberties = true,
  highlightCaptures = true,
  disabled = false,
  size = 400
}: AtariBoardProps) {
  const [hoveredPosition, setHoveredPosition] = useState<{x: number; y: number} | null>(null);
  const [showLastMove, setShowLastMove] = useState(true);

  const padding = 30;
  const inner = size - padding * 2;
  const cell = inner / (board.size - 1);
  const stoneR = cell * 0.4;

  const toXY = useCallback((i: number, j: number) => ({
    x: padding + i * cell,
    y: padding + j * cell,
  }), [padding, cell]);

  const handleClick = useCallback((x: number, y: number) => {
    if (disabled || board.gameOver || board.stones[x][y] !== null) return;
    onMove(x, y);
  }, [disabled, board.gameOver, board.stones, onMove]);

  const handleMouseEnter = useCallback((x: number, y: number) => {
    if (!disabled && board.stones[x][y] === null) {
      setHoveredPosition({ x, y });
    }
  }, [disabled, board.stones]);

  const handleMouseLeave = useCallback(() => {
    setHoveredPosition(null);
  }, []);

  const getLiberties = useCallback((x: number, y: number) => {
    const liberties: {x: number; y: number}[] = [];
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    directions.forEach(([dx, dy]) => {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < board.size && ny >= 0 && ny < board.size && board.stones[nx][ny] === null) {
        liberties.push({ x: nx, y: ny });
      }
    });

    return liberties;
  }, [board.size, board.stones]);

  const getStoneColor = useCallback((color: 'B' | 'W') => {
    return color === 'B' ? '#000' : '#fff';
  }, []);

  const getStoneStroke = useCallback((color: 'B' | 'W') => {
    return color === 'W' ? '#333' : '#000';
  }, []);

  const isLastMove = useCallback((x: number, y: number) => {
    return showLastMove && board.lastMove && board.lastMove.x === x && board.lastMove.y === y;
  }, [showLastMove, board.lastMove]);

  const isHovered = useCallback((x: number, y: number) => {
    return hoveredPosition && hoveredPosition.x === x && hoveredPosition.y === y;
  }, [hoveredPosition]);

  const getLibertyCount = useCallback((x: number, y: number) => {
    if (board.stones[x][y] === null) return 0;
    return getLiberties(x, y).length;
  }, [board.stones, getLiberties]);

  const getCoordinateLabel = useCallback((index: number, isColumn: boolean) => {
    if (isColumn) {
      return String.fromCharCode('A'.charCodeAt(0) + index);
    } else {
      return (index + 1).toString();
    }
  }, []);

  const gameStatusText = useMemo(() => {
    if (board.gameOver) {
      if (board.winner) {
        return `${board.winner === 'B' ? 'Black' : 'White'} wins!`;
      } else {
        return 'Game ended in a tie!';
      }
    } else {
      return `${board.currentPlayer === 'B' ? 'Black' : 'White'}'s turn`;
    }
  }, [board.gameOver, board.winner, board.currentPlayer]);

  const captureInfo = useMemo(() => {
    return {
      black: board.captures.black,
      white: board.captures.white
    };
  }, [board.captures]);

  return (
    <div className="atari-board-container">
      {/* Game Status */}
      <div className="mb-4 text-center">
        <div className={`text-lg font-semibold ${
          board.gameOver 
            ? (board.winner === 'B' ? 'text-black' : board.winner === 'W' ? 'text-gray-600' : 'text-gray-500')
            : (board.currentPlayer === 'B' ? 'text-black' : 'text-gray-600')
        }`}>
          {gameStatusText}
        </div>
        <div className="text-sm text-gray-600 mt-1">
          Captures: Black {captureInfo.black} - White {captureInfo.white}
        </div>
      </div>

      {/* Board */}
      <div className="relative inline-block">
        <svg
          width={size}
          height={size}
          className="border border-gray-300 rounded-lg"
          style={{ background: '#F2D28C' }}
        >
          {/* Grid Lines */}
          <g stroke="#333" strokeWidth={1.5}>
            {/* Vertical lines */}
            {Array.from({ length: board.size }, (_, i) => {
              const { x } = toXY(i, 0);
              return (
                <line
                  key={`v-${i}`}
                  x1={x}
                  y1={padding}
                  x2={x}
                  y2={size - padding}
                />
              );
            })}
            {/* Horizontal lines */}
            {Array.from({ length: board.size }, (_, j) => {
              const { y } = toXY(0, j);
              return (
                <line
                  key={`h-${j}`}
                  x1={padding}
                  y1={y}
                  x2={size - padding}
                  y2={y}
                />
              );
            })}
          </g>

          {/* Coordinates */}
          {showCoordinates && (
            <g fontSize={12} fill="#333" fontFamily="monospace" fontWeight="500">
              {/* Column labels (top) */}
              {Array.from({ length: board.size }, (_, i) => {
                const { x } = toXY(i, 0);
                return (
                  <text
                    key={`col-top-${i}`}
                    x={x}
                    y={padding - 8}
                    textAnchor="middle"
                  >
                    {getCoordinateLabel(i, true)}
                  </text>
                );
              })}
              {/* Column labels (bottom) */}
              {Array.from({ length: board.size }, (_, i) => {
                const { x } = toXY(i, 0);
                return (
                  <text
                    key={`col-bottom-${i}`}
                    x={x}
                    y={size - padding + 15}
                    textAnchor="middle"
                  >
                    {getCoordinateLabel(i, true)}
                  </text>
                );
              })}
              {/* Row labels (left) */}
              {Array.from({ length: board.size }, (_, j) => {
                const { y } = toXY(0, j);
                return (
                  <text
                    key={`row-left-${j}`}
                    x={padding - 15}
                    y={y + 4}
                    textAnchor="end"
                    dominantBaseline="middle"
                  >
                    {getCoordinateLabel(j, false)}
                  </text>
                );
              })}
              {/* Row labels (right) */}
              {Array.from({ length: board.size }, (_, j) => {
                const { y } = toXY(0, j);
                return (
                  <text
                    key={`row-right-${j}`}
                    x={size - padding + 15}
                    y={y + 4}
                    textAnchor="start"
                    dominantBaseline="middle"
                  >
                    {getCoordinateLabel(j, false)}
                  </text>
                );
              })}
            </g>
          )}

          {/* Liberty highlighting for stones */}
          {highlightLiberties && Array.from({ length: board.size }, (_, x) =>
            Array.from({ length: board.size }, (_, y) => {
              if (board.stones[x][y] !== null && getLibertyCount(x, y) === 1) {
                const liberties = getLiberties(x, y);
                return liberties.map((liberty, idx) => {
                  const { x: lx, y: ly } = toXY(liberty.x, liberty.y);
                  return (
                    <circle
                      key={`liberty-${x}-${y}-${idx}`}
                      cx={lx}
                      cy={ly}
                      r={stoneR * 0.3}
                      fill="red"
                      opacity={0.6}
                    />
                  );
                });
              }
              return null;
            })
          )}

          {/* Stones */}
          {Array.from({ length: board.size }, (_, x) =>
            Array.from({ length: board.size }, (_, y) => {
              const stone = board.stones[x][y];
              if (!stone) return null;

              const { x: px, y: py } = toXY(x, y);
              const liberties = getLibertyCount(x, y);

              return (
                <g key={`stone-${x}-${y}`}>
                  <circle
                    cx={px}
                    cy={py}
                    r={stoneR}
                    fill={getStoneColor(stone)}
                    stroke={getStoneStroke(stone)}
                    strokeWidth={stone === 'W' ? 1 : 0}
                    style={{ cursor: disabled ? 'default' : 'pointer' }}
                    onClick={() => handleClick(x, y)}
                    onMouseEnter={() => handleMouseEnter(x, y)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {/* Scale-in animation */}
                    <animate
                      attributeName="r"
                      from={0}
                      to={stoneR}
                      dur="150ms"
                      fill="freeze"
                    />
                  </circle>

                  {/* Last move marker */}
                  {isLastMove(x, y) && (
                    <circle
                      cx={px}
                      cy={py}
                      r={stoneR * 0.3}
                      fill="red"
                      opacity={0.8}
                    />
                  )}

                  {/* Liberty count display */}
                  {liberties <= 3 && (
                    <text
                      x={px}
                      y={py + 4}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={stoneR * 0.6}
                      fill={stone === 'B' ? 'white' : 'black'}
                      fontWeight="bold"
                    >
                      {liberties}
                    </text>
                  )}
                </g>
              );
            })
          )}

          {/* Hover ghost stone */}
          {hoveredPosition && !disabled && !board.gameOver && (
            <circle
              cx={toXY(hoveredPosition.x, hoveredPosition.y).x}
              cy={toXY(hoveredPosition.x, hoveredPosition.y).y}
              r={stoneR}
              fill={board.currentPlayer === 'B' ? '#333' : '#ccc'}
              stroke={board.currentPlayer === 'B' ? '#000' : '#666'}
              strokeWidth={1}
              opacity={0.6}
              style={{ cursor: 'pointer' }}
              onClick={() => handleClick(hoveredPosition.x, hoveredPosition.y)}
            />
          )}

          {/* Capture highlighting */}
          {highlightCaptures && board.lastMove && (
            <>
              {/* Show what would be captured */}
              {getLiberties(board.lastMove.x, board.lastMove.y).map((liberty, idx) => {
                const stone = board.stones[liberty.x][liberty.y];
                if (stone && stone !== board.currentPlayer) {
                  const { x: px, y: py } = toXY(liberty.x, liberty.y);
                  return (
                    <circle
                      key={`capture-hint-${idx}`}
                      cx={px}
                      cy={py}
                      r={stoneR * 1.1}
                      fill="none"
                      stroke="red"
                      strokeWidth={3}
                      opacity={0.8}
                    />
                  );
                }
                return null;
              })}
            </>
          )}
        </svg>

        {/* Board size indicator */}
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
          {board.size}×{board.size}
        </div>
      </div>

      {/* Controls */}
      <div className="mt-4 flex justify-center space-x-2">
        {onUndo && (
          <button
            onClick={onUndo}
            disabled={disabled}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Undo
          </button>
        )}
        
        <button
          onClick={() => setShowLastMove(!showLastMove)}
          className="px-4 py-2 bg-blue-200 text-blue-700 rounded hover:bg-blue-300"
        >
          {showLastMove ? 'Hide' : 'Show'} Last Move
        </button>
      </div>
    </div>
  );
}

// Export types for use in other components
export type { AtariBoardProps };
