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
import { chooseMove, getHint } from '@/lib/atariBot';

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
        showToastMessage('Illegal: Position occupied');
      } else if (gameState.koPoint && point.x === gameState.koPoint.x && point.y === gameState.koPoint.y) {
        showToastMessage('Illegal: Ko rule');
      } else {
        showToastMessage('Illegal: Suicide move');
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

  // Get hint
  const handleGetHint = useCallback(() => {
    if (isGameOver(gameState)) return;
    const hint = getHint(gameState, gameState.toPlay);
    showToastMessage(hint);
  }, [gameState, showToastMessage]);

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
          Atari Go (First Capture Wins)
        </h1>
        <p className="text-gray-700 mb-4">
          Place stones to capture your opponent&apos;s stones. First player to capture wins!
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
              Game Status
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Turn:</span>
                <span className={`font-semibold ${gameState.toPlay === 'B' ? 'text-black' : 'text-gray-600'}`}>
                  {gameState.toPlay === 'B' ? 'Black' : 'White'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Captured:</span>
                <span className="font-semibold text-gray-900">
                  B: {gameState.captured.B} | W: {gameState.captured.W}
                </span>
              </div>
              
              {gameOver && winner && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Winner:</span>
                  <span className={`font-semibold ${winner === 'B' ? 'text-black' : 'text-gray-600'}`}>
                    {winner === 'B' ? 'Black' : 'White'} wins by capture!
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="tci-card bg-tci-light">
            <h3 className="text-lg font-semibold text-tci-dark mb-4">
              Controls
            </h3>
            
            <div className="space-y-3">
              <button
                onClick={handleToggleBot}
                className={`w-full px-4 py-2 rounded ${
                  gameState.botEnabled
                    ? 'bg-red-200 text-red-800 hover:bg-red-300'
                    : 'bg-green-200 text-green-800 hover:bg-green-300'
                }`}
              >
                {gameState.botEnabled ? 'Stop Bot' : 'Play vs Bot'}
              </button>
              
              <button
                onClick={handleToggleHumanColor}
                disabled={gameOver}
                className="w-full px-4 py-2 bg-blue-200 text-blue-800 rounded hover:bg-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Human plays {gameState.humanColor === 'B' ? 'White' : 'Black'}
              </button>
              
              <button
                onClick={handleGetHint}
                disabled={gameOver}
                className="w-full px-4 py-2 bg-yellow-200 text-yellow-800 rounded hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Get Hint
              </button>
              
              <button
                onClick={handlePass}
                disabled={gameOver}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Pass Turn
              </button>
              
              <button
                onClick={handleReset}
                className="w-full px-4 py-2 bg-red-200 text-red-800 rounded hover:bg-red-300"
              >
                Reset Game
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="tci-card bg-blue-50 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              How to Play
            </h3>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Click to place stones</li>
              <li>• Capture opponent stones by surrounding them</li>
              <li>• First capture wins the game</li>
              <li>• Red highlights show groups in atari (one liberty)</li>
              <li>• Use hints if you get stuck</li>
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
    </div>
  );
}