/**
 * Atari Go Bot
 * Simple heuristic-based AI for Atari Go
 */

import { GameState, Point, Color, placeStone, generateLegalMoves, findAtariGroups, neighbors } from './atariState';

/**
 * Choose the best move for the bot
 */
export function chooseMove(state: GameState, color: Color): Point | null {
  const legalMoves = generateLegalMoves(state, color);
  if (legalMoves.length === 0) return null;

  // Score each move and pick the best one
  const scoredMoves = legalMoves
    .map(move => ({
      move,
      score: scoreMove(state, move, color)
    }))
    .sort((a, b) => b.score - a.score);

  return scoredMoves[0]?.move || null;
}

/**
 * Score a potential move
 */
function scoreMove(state: GameState, p: Point, color: Color): number {
  // Simulate the move
  const result = placeStone(state, p, color);
  if (!result) return -1e6; // Illegal move

  const { next, captured } = result;
  
  // Immediate win - highest priority
  if (captured.length > 0) {
    return 1000 + captured.length * 100;
  }

  // Count opponent groups in atari after this move
  const opponentColor: Color = color === 'B' ? 'W' : 'B';
  const atariGroups = findAtariGroups(next.board, opponentColor);
  const atariScore = atariGroups.length * 50;

  // Count our own groups in atari (bad)
  const ourAtariGroups = findAtariGroups(next.board, color);
  const ourAtariPenalty = ourAtariGroups.length * -30;

  // Prefer moves that connect to existing stones
  const connectionScore = countAdjacency(next.board, p, color) * 10;

  // Prefer center moves
  const centerBias = 4 - manhattanToCenter(p);

  // Avoid self-atari
  const selfAtariPenalty = isSelfAtari(next, p, color) ? -100 : 0;

  // Prefer moves that create atari for opponent
  const createAtariScore = countNewAtaris(next, opponentColor) * 20;

  return atariScore + ourAtariPenalty + connectionScore + centerBias + selfAtariPenalty + createAtariScore;
}

/**
 * Count how many stones of the same color are adjacent
 */
function countAdjacency(board: (Color | null)[][], p: Point, color: Color): number {
  return neighbors(p).filter(neighbor => 
    board[neighbor.x][neighbor.y] === color
  ).length;
}

/**
 * Calculate Manhattan distance to center
 */
function manhattanToCenter(p: Point): number {
  return Math.abs(p.x - 4) + Math.abs(p.y - 4);
}

/**
 * Check if a move puts us in self-atari
 */
function isSelfAtari(state: GameState, p: Point, color: Color): boolean {
  const result = placeStone(state, p, color);
  if (!result) return true;

  const { next } = result;
  const atariGroups = findAtariGroups(next.board, color);
  
  // Check if our move created a self-atari group
  return atariGroups.some(group => 
    group.some(stone => stone.x === p.x && stone.y === p.y)
  );
}

/**
 * Count how many new atari groups we create for opponent
 */
function countNewAtaris(state: GameState, opponentColor: Color): number {
  const beforeAtari = findAtariGroups(state.board, opponentColor);
  const afterAtari = findAtariGroups(state.board, opponentColor);
  
  return Math.max(0, afterAtari.length - beforeAtari.length);
}

/**
 * Get a simple move suggestion for hints
 */
export function getHint(state: GameState, color: Color): string {
  const move = chooseMove(state, color);
  if (!move) return "No legal moves available. Consider passing.";

  const result = placeStone(state, move, color);
  if (!result) return "No legal moves available.";

  const { captured } = result;
  
  if (captured.length > 0) {
    return `Place at ${String.fromCharCode(65 + move.x)}${move.y + 1} to capture ${captured.length} stone(s)!`;
  }

  const atariGroups = findAtariGroups(state.board, color === 'B' ? 'W' : 'B');
  if (atariGroups.length > 0) {
    return `Look for opponent stones with only one liberty remaining!`;
  }

  return `Try placing at ${String.fromCharCode(65 + move.x)}${move.y + 1} to create a strong position.`;
}

/**
 * Get all capture opportunities
 */
export function getCaptureOpportunities(state: GameState, color: Color): Point[] {
  const opportunities: Point[] = [];
  const legalMoves = generateLegalMoves(state, color);

  legalMoves.forEach(move => {
    const result = placeStone(state, move, color);
    if (result && result.captured.length > 0) {
      opportunities.push(move);
    }
  });

  return opportunities;
}

/**
 * Check if opponent has any groups in atari
 */
export function hasAtariGroups(state: GameState, color: Color): boolean {
  const opponentColor: Color = color === 'B' ? 'W' : 'B';
  const atariGroups = findAtariGroups(state.board, opponentColor);
  return atariGroups.length > 0;
}

/**
 * Get the best defensive move
 */
export function getDefensiveMove(state: GameState, color: Color): Point | null {
  const legalMoves = generateLegalMoves(state, color);
  
  // Look for moves that save our own groups in atari
  const ourAtariGroups = findAtariGroups(state.board, color);
  if (ourAtariGroups.length === 0) return null;

  // Find moves that add liberties to our atari groups
  for (const move of legalMoves) {
    const result = placeStone(state, move, color);
    if (!result) continue;

    const newAtariGroups = findAtariGroups(result.next.board, color);
    if (newAtariGroups.length < ourAtariGroups.length) {
      return move;
    }
  }

  return null;
}










