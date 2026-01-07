'use client';

/**
 * Atari Go Page
 * First capture wins - simplified Go variant
 */

import React, { useState, useEffect, useCallback } from 'react';
import BoardSvg from '@/components/BoardSvg';
import {
  GameState,
  Point,
  Color,
  createInitialState,
  placeStone,
  isGameOver,
  getWinner,
  resetGame,
  toggleBot,
  setHumanColor,
  passTurn,
  findAtariGroups,
  coordToPoint,
  pointToCoord
} from '@/lib/atariState';
import { chooseMove } from '@/lib/atariBot';
import LessonNavigation from '@/components/LessonNavigation';

export default function AtariPage() {
  const [gameState, setGameState] = useState<GameState>(createInitialState());
  const [showToast, setShowToast] = useState<string>('');
  const [atariGroups, setAtariGroups] = useState<Point[][]>([]);
  const [showAtariHighlight, setShowAtariHighlight] = useState(false);
  const [hoverPosition, setHoverPosition] = useState<Point | null>(null);

  // Show toast message
  const showToastMessage = useCallback((message: string) => {
    setShowToast(message);
    setTimeout(() => setShowToast(''), 3000);
  }, []);

  // Handle human move
  const handleHumanMove = useCallback((x: number, y: number) => {
    if (isGameOver(gameState)) return;
    if (gameState.botEnabled && gameState.toPlay !== gameState.humanColor) return;

    const point: Point = { x, y };
    const result = placeStone(gameState, point, gameState.toPlay);

    if (!result) {
      // Illegal move
      if (gameState.board[x][y] !== null) {
        showToastMessage('Ungültig: Position besetzt');
      } else if (gameState.koPoint && point.x === gameState.koPoint.x && point.y === gameState.koPoint.y) {
        showToastMessage('Ungültig: Ko-Regel');
      } else {
        showToastMessage('Ungültig: Selbstmord-Zug');
      }
      return;
    }

    setGameState(result.next);

    // Check for atari groups to highlight
    const opponentColor: Color = gameState.toPlay === 'B' ? 'W' : 'B';
    const newAtariGroups = findAtariGroups(result.next.board, opponentColor);
    if (newAtariGroups.length > 0) {
      setAtariGroups(newAtariGroups);
      setShowAtariHighlight(true);
      setTimeout(() => setShowAtariHighlight(false), 2000);
    }

    // If bot is enabled and it's bot's turn, make bot move
    if (gameState.botEnabled && result.next.toPlay !== gameState.humanColor && !isGameOver(result.next)) {
      setTimeout(() => {
        const botMove = chooseMove(result.next, result.next.toPlay);
        if (botMove) {
          const botResult = placeStone(result.next, botMove, result.next.toPlay);
          if (botResult) {
            setGameState(botResult.next);

            // Check for atari groups after bot move
            const botOpponentColor: Color = result.next.toPlay === 'B' ? 'W' : 'B';
            const botAtariGroups = findAtariGroups(botResult.next.board, botOpponentColor);
            if (botAtariGroups.length > 0) {
              setAtariGroups(botAtariGroups);
              setShowAtariHighlight(true);
              setTimeout(() => setShowAtariHighlight(false), 2000);
            }
          }
        } else {
          // Bot passes
          setGameState(prev => passTurn(prev));
        }
      }, 500);
    }
  }, [gameState, showToastMessage]);

  // Reset game
  const handleReset = useCallback(() => {
    setGameState(createInitialState());
    setAtariGroups([]);
    setShowAtariHighlight(false);
  }, []);

  // Toggle bot
  const handleToggleBot = useCallback(() => {
    setGameState(prev => toggleBot(prev));
  }, []);

  // Toggle human color
  const handleToggleHumanColor = useCallback(() => {
    if (isGameOver(gameState)) return;
    setGameState(prev => setHumanColor(prev, prev.humanColor === 'B' ? 'W' : 'B'));
  }, [gameState]);

  // Pass turn
  const handlePass = useCallback(() => {
    if (isGameOver(gameState)) return;
    setGameState(prev => passTurn(prev));
  }, [gameState]);



  // Handle mouse move for hover
  const handleMouseMove = useCallback((x: number, y: number) => {
    if (isGameOver(gameState)) return;
    if (gameState.botEnabled && gameState.toPlay !== gameState.humanColor) return;

    // Check if position is empty
    if (gameState.board[x][y] === null) {
      setHoverPosition({ x, y });
    } else {
      setHoverPosition(null);
    }
  }, [gameState]);

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    setHoverPosition(null);
  }, []);

  // Convert board state for BoardSvg
  const boardStones = gameState.board.flatMap((row, x) =>
    row.map((cell, y) =>
      cell ? { x, y, color: cell as "B" | "W" } : null
    ).filter((stone): stone is { x: number; y: number; color: "B" | "W" } => stone !== null)
  );

  const winner = getWinner(gameState);
  const gameOver = isGameOver(gameState);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-tci-dark mb-4">
          Atari Go (Erste Gefangennahme gewinnt)
        </h1>
        <p className="text-gray-700 mb-4">
          Setze Steine, um die Steine deines Gegners zu schlagen. Wer zuerst schlägt, gewinnt!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Game Board */}
        <div className="lg:col-span-2">
          <BoardSvg
            size={580}
            stones={boardStones}
            lastMove={gameState.lastMove ? { x: gameState.lastMove.p.x, y: gameState.lastMove.p.y } : undefined}
            hover={hoverPosition ? { x: hoverPosition.x, y: hoverPosition.y, color: gameState.toPlay } : null}
            onPlace={handleHumanMove}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            showCoords={true}
            liberties={showAtariHighlight ? atariGroups.flat() : []}
            showLiberties={showAtariHighlight}
          />
        </div>

        {/* Controls & Status */}
        <div className="space-y-6">
          {/* Game Status */}
          <div className="tci-card bg-tci-light">
            <h3 className="text-lg font-semibold text-tci-dark mb-4">
              Spielstatus
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Am Zug:</span>
                <span className={`font-semibold ${gameState.toPlay === 'B' ? 'text-black' : 'text-gray-600'}`}>
                  {gameState.toPlay === 'B' ? 'Schwarz' : 'Weiß'}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Geschlagen:</span>
                <span className="font-semibold text-gray-900">
                  B: {gameState.captured.B} | W: {gameState.captured.W}
                </span>
              </div>

              {gameOver && winner && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Gewinner:</span>
                  <span className={`font-semibold ${winner === 'B' ? 'text-black' : 'text-gray-600'}`}>
                    {winner === 'B' ? 'Schwarz' : 'Weiß'} gewinnt durch Gefangennahme!
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="tci-card bg-tci-light">
            <h3 className="text-lg font-semibold text-tci-dark mb-4">
              Steuerung
            </h3>

            <div className="space-y-3">
              <button
                onClick={handleToggleBot}
                className={`w-full px-4 py-2 rounded ${gameState.botEnabled
                  ? 'bg-red-200 text-red-800 hover:bg-red-300'
                  : 'bg-green-200 text-green-800 hover:bg-green-300'
                  }`}
              >
                {gameState.botEnabled ? 'Bot stoppen' : 'Gegen Bot spielen'}
              </button>

              <button
                onClick={handleToggleHumanColor}
                disabled={gameOver}
                className="w-full px-4 py-2 bg-blue-200 text-blue-800 rounded hover:bg-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Mensch spielt {gameState.humanColor === 'B' ? 'Weiß' : 'Schwarz'}
              </button>



              <button
                onClick={handlePass}
                disabled={gameOver}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Passen
              </button>

              <button
                onClick={handleReset}
                className="w-full px-4 py-2 bg-red-200 text-red-800 rounded hover:bg-red-300"
              >
                Spiel zurücksetzen
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="tci-card bg-blue-50 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              Spielanleitung
            </h3>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Klicke, um Steine zu setzen</li>
              <li>• Schlage gegnerische Steine durch Umzingeln</li>
              <li>• Die erste Gefangennahme gewinnt das Spiel</li>
              <li>• Rote Markierungen zeigen Gruppen in Atari (eine Freiheit)</li>

            </ul>
          </div>
        </div>
      </div>

      {/* Toast Messages */}
      {showToast && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
          {showToast}
        </div>
      )}
      <LessonNavigation currentLessonId={6} />
    </div>
  );
}