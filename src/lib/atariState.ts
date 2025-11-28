/**
 * Atari Go State Management
 * Simplified Go variant where first capture wins
 */

export type Color = 'B' | 'W';
export type Point = { x: number; y: number }; // A1→{0,0}, I9→{8,8}

export interface GameState {
  board: (Color | null)[][];
  toPlay: Color;                // 'B' moves first
  lastMove?: { p: Point; c: Color };
  koPoint?: Point | null;
  captured: { B: number; W: number };
  winner?: Color;               // set when first capture occurs
  botEnabled: boolean;
  humanColor: Color;            // toggleable
  moveHistory: string[];        // board hashes
}

/**
 * Convert coordinate string to Point
 * A1 → {0,0}, I9 → {8,8}
 */
export function coordToPoint(c: `${'A'|'B'|'C'|'D'|'E'|'F'|'G'|'H'|'I'}${1|2|3|4|5|6|7|8|9}`): Point {
  return { x: c.charCodeAt(0) - 65, y: Number(c.slice(1)) - 1 };
}

/**
 * Convert Point to coordinate string
 * {0,0} → A1, {8,8} → I9
 */
export function pointToCoord(p: Point): string {
  return String.fromCharCode(65 + p.x) + (p.y + 1).toString();
}

/**
 * Get all neighbors of a point
 */
export function neighbors(p: Point): Point[] {
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  return dirs
    .map(([dx, dy]) => ({ x: p.x + dx, y: p.y + dy }))
    .filter(({ x, y }) => x >= 0 && x < 9 && y >= 0 && y < 9);
}

/**
 * Get group of connected stones and their liberties
 */
export function getGroup(board: (Color | null)[][], p: Point): { stones: Point[]; liberties: Point[]; color: Color } {
  const color = board[p.x][p.y];
  if (!color) return { stones: [], liberties: [], color: 'B' };

  const stones: Point[] = [];
  const liberties: Point[] = [];
  const visited = new Set<string>();
  const stack: Point[] = [p];

  while (stack.length > 0) {
    const current = stack.pop()!;
    const key = `${current.x},${current.y}`;
    
    if (visited.has(key)) continue;
    visited.add(key);

    if (board[current.x][current.y] === color) {
      stones.push(current);
      
      // Check neighbors
      neighbors(current).forEach(neighbor => {
        const neighborColor = board[neighbor.x][neighbor.y];
        if (neighborColor === null) {
          // Empty intersection - liberty
          if (!liberties.some(l => l.x === neighbor.x && l.y === neighbor.y)) {
            liberties.push(neighbor);
          }
        } else if (neighborColor === color) {
          // Same color - add to stack
          stack.push(neighbor);
        }
      });
    }
  }

  return { stones, liberties, color };
}

/**
 * Check if a move is legal
 */
export function isLegalMove(state: GameState, p: Point, color: Color): boolean {
  // Check if position is empty
  if (state.board[p.x][p.y] !== null) return false;

  // Check ko
  if (state.koPoint && p.x === state.koPoint.x && p.y === state.koPoint.y) return false;

  // Simulate the move
  const testState = { ...state };
  testState.board = state.board.map(row => [...row]);
  testState.board[p.x][p.y] = color;

  // Check for captures
  const captured: Point[] = [];
  neighbors(p).forEach(neighbor => {
    const neighborColor = testState.board[neighbor.x][neighbor.y];
    if (neighborColor && neighborColor !== color) {
      const group = getGroup(testState.board, neighbor);
      if (group.liberties.length === 0) {
        captured.push(...group.stones);
      }
    }
  });

  // If we capture, move is legal
  if (captured.length > 0) return true;

  // Check for suicide (illegal unless it captures)
  const group = getGroup(testState.board, p);
  if (group.liberties.length === 0) return false;

  return true;
}

/**
 * Place a stone and return new state
 */
export function placeStone(state: GameState, p: Point, color: Color): { next: GameState; captured: Point[] } | null {
  if (!isLegalMove(state, p, color)) return null;

  const newBoard = state.board.map(row => [...row]);
  newBoard[p.x][p.y] = color;

  // Find captures
  const captured: Point[] = [];
  neighbors(p).forEach(neighbor => {
    const neighborColor = newBoard[neighbor.x][neighbor.y];
    if (neighborColor && neighborColor !== color) {
      const group = getGroup(newBoard, neighbor);
      if (group.liberties.length === 0) {
        captured.push(...group.stones);
        // Remove captured stones
        group.stones.forEach(stone => {
          newBoard[stone.x][stone.y] = null;
        });
      }
    }
  });

  // Update captured counts
  const newCaptured = { ...state.captured };
  captured.forEach(stone => {
    const stoneColor = state.board[stone.x][stone.y];
    if (stoneColor) {
      newCaptured[stoneColor]++;
    }
  });

  // Determine ko point
  let koPoint: Point | null = null;
  if (captured.length === 1 && neighbors(p).length === 4) {
    // Simple ko check - if we captured exactly one stone and it's in a corner
    const capturedStone = captured[0];
    if (capturedStone.x === p.x && capturedStone.y === p.y) {
      koPoint = capturedStone;
    }
  }

  const newState: GameState = {
    board: newBoard,
    toPlay: color === 'B' ? 'W' : 'B',
    lastMove: { p, c: color },
    koPoint,
    captured: newCaptured,
    winner: captured.length > 0 ? color : undefined,
    botEnabled: state.botEnabled,
    humanColor: state.humanColor,
    moveHistory: [...state.moveHistory, boardHash(newBoard)]
  };

  return { next: newState, captured };
}

/**
 * Generate board hash for move history
 */
export function boardHash(board: (Color | null)[][]): string {
  return board.map(row => row.map(cell => cell || 'E').join('')).join('');
}

/**
 * Create initial game state
 */
export function createInitialState(): GameState {
  const board: (Color | null)[][] = Array(9).fill(null).map(() => Array(9).fill(null));
  
  return {
    board,
    toPlay: 'B',
    captured: { B: 0, W: 0 },
    botEnabled: false,
    humanColor: 'B',
    moveHistory: [boardHash(board)]
  };
}

/**
 * Check if game is over
 */
export function isGameOver(state: GameState): boolean {
  return state.winner !== undefined;
}

/**
 * Get winner
 */
export function getWinner(state: GameState): Color | null {
  return state.winner || null;
}

/**
 * Reset game to initial state
 */
export function resetGame(): GameState {
  return createInitialState();
}

/**
 * Pass turn
 */
export function passTurn(state: GameState): GameState {
  return {
    ...state,
    toPlay: state.toPlay === 'B' ? 'W' : 'B',
    moveHistory: [...state.moveHistory, boardHash(state.board)]
  };
}

/**
 * Toggle bot
 */
export function toggleBot(state: GameState): GameState {
  return {
    ...state,
    botEnabled: !state.botEnabled
  };
}

/**
 * Set human color
 */
export function setHumanColor(state: GameState, color: Color): GameState {
  return {
    ...state,
    humanColor: color
  };
}

/**
 * Get all legal moves for a color
 */
export function generateLegalMoves(state: GameState, color: Color): Point[] {
  const moves: Point[] = [];
  
  for (let x = 0; x < 9; x++) {
    for (let y = 0; y < 9; y++) {
      if (isLegalMove(state, { x, y }, color)) {
        moves.push({ x, y });
      }
    }
  }
  
  return moves;
}

/**
 * Find groups in atari (exactly one liberty)
 */
export function findAtariGroups(board: (Color | null)[][], color: Color): Point[][] {
  const atariGroups: Point[][] = [];
  const visited = new Set<string>();

  for (let x = 0; x < 9; x++) {
    for (let y = 0; y < 9; y++) {
      const key = `${x},${y}`;
      if (visited.has(key)) continue;
      
      const stone = board[x][y];
      if (stone === color) {
        const group = getGroup(board, { x, y });
        if (group.liberties.length === 1) {
          atariGroups.push(group.stones);
          group.stones.forEach(stone => {
            visited.add(`${stone.x},${stone.y}`);
          });
        }
      }
    }
  }

  return atariGroups;
}










