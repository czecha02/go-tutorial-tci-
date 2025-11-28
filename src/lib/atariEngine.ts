/**
 * Atari Go (Capture Go) Engine
 * Simplified Go variant focusing on capturing stones
 */

export interface AtariBoard {
  size: number;
  stones: (null | 'B' | 'W')[][];
  captures: { black: number; white: number };
  currentPlayer: 'B' | 'W';
  gameOver: boolean;
  winner?: 'B' | 'W';
  lastMove?: { x: number; y: number };
  gameMode: 'first-capture' | 'multiple-captures' | 'race-to-n';
  targetCaptures?: number;
}

export interface AtariConfig {
  boardSize: 5 | 7 | 9;
  gameMode: 'first-capture' | 'multiple-captures' | 'race-to-n';
  targetCaptures?: number;
  handicap?: number;
  timeLimit?: number; // seconds
}

export interface AtariMove {
  x: number;
  y: number;
  color: 'B' | 'W';
  captures: { x: number; y: number }[];
  liberties: number[];
  isValid: boolean;
  reason?: string;
}

export interface AtariBot {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  playMove: (board: AtariBoard) => AtariMove;
}

export class AtariEngine {
  private board: AtariBoard;
  private config: AtariConfig;
  private moveHistory: AtariMove[] = [];

  constructor(config: AtariConfig) {
    this.config = config;
    this.board = this.createEmptyBoard(config.boardSize);
    this.board.gameMode = config.gameMode;
    this.board.targetCaptures = config.targetCaptures;
  }

  /**
   * Create empty Atari board
   */
  private createEmptyBoard(size: number): AtariBoard {
    const stones: (null | 'B' | 'W')[][] = [];
    for (let i = 0; i < size; i++) {
      stones[i] = new Array(size).fill(null);
    }

    return {
      size,
      stones,
      captures: { black: 0, white: 0 },
      currentPlayer: 'B',
      gameOver: false,
      gameMode: 'first-capture'
    };
  }

  /**
   * Make a move on the Atari board
   */
  public makeMove(x: number, y: number, color: 'B' | 'W'): AtariMove {
    if (this.board.gameOver) {
      return {
        x, y, color,
        captures: [],
        liberties: [],
        isValid: false,
        reason: 'Game is over'
      };
    }

    if (color !== this.board.currentPlayer) {
      return {
        x, y, color,
        captures: [],
        liberties: [],
        isValid: false,
        reason: 'Not your turn'
      };
    }

    if (this.board.stones[x][y] !== null) {
      return {
        x, y, color,
        captures: [],
        liberties: [],
        isValid: false,
        reason: 'Position already occupied'
      };
    }

    // Place stone
    this.board.stones[x][y] = color;
    this.board.lastMove = { x, y };

    // Check for captures
    const captures = this.checkCaptures(x, y, color);
    
    // Remove captured stones
    captures.forEach(capture => {
      this.board.stones[capture.x][capture.y] = null;
      if (color === 'B') {
        this.board.captures.black++;
      } else {
        this.board.captures.white++;
      }
    });

    // Check for suicide (simplified - no suicide rule in Atari Go)
    // In Atari Go, suicide moves are generally allowed

    const move: AtariMove = {
      x, y, color,
      captures,
      liberties: this.getLiberties(x, y),
      isValid: true
    };

    this.moveHistory.push(move);

    // Check win conditions
    this.checkWinConditions();

    // Switch player
    this.board.currentPlayer = this.board.currentPlayer === 'B' ? 'W' : 'B';

    return move;
  }

  /**
   * Check for captures after placing a stone
   */
  private checkCaptures(x: number, y: number, color: 'B' | 'W'): { x: number; y: number }[] {
    const captures: { x: number; y: number }[] = [];
    const opponent = color === 'B' ? 'W' : 'B';
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    // Check adjacent opponent groups
    directions.forEach(([dx, dy]) => {
      const nx = x + dx;
      const ny = y + dy;

      if (this.isValidPosition(nx, ny) && this.board.stones[nx][ny] === opponent) {
        const group = this.getGroup(nx, ny, opponent);
        const liberties = this.getGroupLiberties(group);

        // If group has no liberties, it's captured
        if (liberties.length === 0) {
          captures.push(...group);
        }
      }
    });

    return captures;
  }

  /**
   * Get liberties of a stone
   */
  private getLiberties(x: number, y: number): number[] {
    const liberties: number[] = [];
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    directions.forEach(([dx, dy]) => {
      const nx = x + dx;
      const ny = y + dy;

      if (this.isValidPosition(nx, ny) && this.board.stones[nx][ny] === null) {
        liberties.push(nx * this.board.size + ny);
      }
    });

    return liberties;
  }

  /**
   * Get group of connected stones
   */
  private getGroup(x: number, y: number, color: 'B' | 'W'): { x: number; y: number }[] {
    const group: { x: number; y: number }[] = [];
    const visited = new Set<string>();
    const stack: { x: number; y: number }[] = [{ x, y }];

    while (stack.length > 0) {
      const current = stack.pop()!;
      const key = `${current.x},${current.y}`;

      if (visited.has(key)) continue;
      visited.add(key);

      if (this.isValidPosition(current.x, current.y) && 
          this.board.stones[current.x][current.y] === color) {
        group.push(current);

        // Add adjacent stones to stack
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        directions.forEach(([dx, dy]) => {
          stack.push({ x: current.x + dx, y: current.y + dy });
        });
      }
    }

    return group;
  }

  /**
   * Get liberties of a group
   */
  private getGroupLiberties(group: { x: number; y: number }[]): { x: number; y: number }[] {
    const liberties = new Set<string>();

    group.forEach(stone => {
      const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      directions.forEach(([dx, dy]) => {
        const nx = stone.x + dx;
        const ny = stone.y + dy;

        if (this.isValidPosition(nx, ny) && this.board.stones[nx][ny] === null) {
          liberties.add(`${nx},${ny}`);
        }
      });
    });

    return Array.from(liberties).map(coord => {
      const [x, y] = coord.split(',').map(Number);
      return { x, y };
    });
  }

  /**
   * Check win conditions based on game mode
   */
  private checkWinConditions(): void {
    switch (this.board.gameMode) {
      case 'first-capture':
        if (this.board.captures.black > 0 || this.board.captures.white > 0) {
          this.board.gameOver = true;
          this.board.winner = this.board.captures.black > 0 ? 'B' : 'W';
        }
        break;

      case 'multiple-captures':
        // Game continues until board is full or one player has significantly more captures
        if (this.isBoardFull()) {
          this.board.gameOver = true;
          this.board.winner = this.board.captures.black > this.board.captures.white ? 'B' : 
                             this.board.captures.white > this.board.captures.black ? 'W' : 
                             undefined; // Tie
        }
        break;

      case 'race-to-n':
        if (this.board.targetCaptures) {
          if (this.board.captures.black >= this.board.targetCaptures) {
            this.board.gameOver = true;
            this.board.winner = 'B';
          } else if (this.board.captures.white >= this.board.targetCaptures) {
            this.board.gameOver = true;
            this.board.winner = 'W';
          }
        }
        break;
    }
  }

  /**
   * Check if board is full
   */
  private isBoardFull(): boolean {
    for (let x = 0; x < this.board.size; x++) {
      for (let y = 0; y < this.board.size; y++) {
        if (this.board.stones[x][y] === null) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Check if position is valid
   */
  private isValidPosition(x: number, y: number): boolean {
    return x >= 0 && x < this.board.size && y >= 0 && y < this.board.size;
  }

  /**
   * Get current board state
   */
  public getBoard(): AtariBoard {
    return { ...this.board };
  }

  /**
   * Get move history
   */
  public getMoveHistory(): AtariMove[] {
    return [...this.moveHistory];
  }

  /**
   * Reset the game
   */
  public reset(): void {
    this.board = this.createEmptyBoard(this.config.boardSize);
    this.board.gameMode = this.config.gameMode;
    this.board.targetCaptures = this.config.targetCaptures;
    this.moveHistory = [];
  }

  /**
   * Undo last move
   */
  public undo(): boolean {
    if (this.moveHistory.length === 0) return false;

    const lastMove = this.moveHistory.pop()!;
    
    // Remove the placed stone
    this.board.stones[lastMove.x][lastMove.y] = null;
    this.board.lastMove = undefined;

    // Restore captured stones
    lastMove.captures.forEach(capture => {
      const originalColor = this.board.currentPlayer === 'B' ? 'W' : 'B';
      this.board.stones[capture.x][capture.y] = originalColor;
      
      if (originalColor === 'B') {
        this.board.captures.white--;
      } else {
        this.board.captures.black--;
      }
    });

    // Switch player back
    this.board.currentPlayer = this.board.currentPlayer === 'B' ? 'W' : 'B';
    
    // Reset game over state
    this.board.gameOver = false;
    this.board.winner = undefined;

    return true;
  }

  /**
   * Get available moves for current player
   */
  public getAvailableMoves(): { x: number; y: number }[] {
    const moves: { x: number; y: number }[] = [];

    for (let x = 0; x < this.board.size; x++) {
      for (let y = 0; y < this.board.size; y++) {
        if (this.board.stones[x][y] === null) {
          moves.push({ x, y });
        }
      }
    }

    return moves;
  }

  /**
   * Evaluate position for AI
   */
  public evaluatePosition(color: 'B' | 'W'): number {
    let score = 0;

    // Capture advantage
    if (color === 'B') {
      score += this.board.captures.black * 10;
      score -= this.board.captures.white * 10;
    } else {
      score += this.board.captures.white * 10;
      score -= this.board.captures.black * 10;
    }

    // Territory control (simplified)
    for (let x = 0; x < this.board.size; x++) {
      for (let y = 0; y < this.board.size; y++) {
        if (this.board.stones[x][y] === color) {
          score += this.getLiberties(x, y).length;
        } else if (this.board.stones[x][y] !== null) {
          score -= this.getLiberties(x, y).length;
        }
      }
    }

    return score;
  }
}

/**
 * AI Bot implementations
 */
export class BeginnerBot implements AtariBot {
  name = 'Beginner Bot';
  level = 'beginner' as const;

  playMove(board: AtariBoard): AtariMove {
    const engine = new AtariEngine({
      boardSize: board.size as 5 | 7 | 9,
      gameMode: board.gameMode
    });
    engine.board = { ...board };

    const availableMoves = engine.getAvailableMoves();
    
    // Look for obvious captures
    for (const move of availableMoves) {
      const testMove = engine.makeMove(move.x, move.y, board.currentPlayer);
      if (testMove.captures.length > 0) {
        engine.undo();
        return testMove;
      }
      engine.undo();
    }

    // Random move if no obvious capture
    const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    return engine.makeMove(randomMove.x, randomMove.y, board.currentPlayer);
  }
}

export class IntermediateBot implements AtariBot {
  name = 'Intermediate Bot';
  level = 'intermediate' as const;

  playMove(board: AtariBoard): AtariMove {
    const engine = new AtariEngine({
      boardSize: board.size as 5 | 7 | 9,
      gameMode: board.gameMode
    });
    engine.board = { ...board };

    const availableMoves = engine.getAvailableMoves();
    let bestMove = availableMoves[0];
    let bestScore = -Infinity;

    // Look for captures first
    for (const move of availableMoves) {
      const testMove = engine.makeMove(move.x, move.y, board.currentPlayer);
      if (testMove.captures.length > 0) {
        engine.undo();
        return testMove;
      }
      
      // Evaluate position
      const score = engine.evaluatePosition(board.currentPlayer);
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
      
      engine.undo();
    }

    return engine.makeMove(bestMove.x, bestMove.y, board.currentPlayer);
  }
}

export class AdvancedBot implements AtariBot {
  name = 'Advanced Bot';
  level = 'advanced' as const;

  playMove(board: AtariBoard): AtariMove {
    const engine = new AtariEngine({
      boardSize: board.size as 5 | 7 | 9,
      gameMode: board.gameMode
    });
    engine.board = { ...board };

    const availableMoves = engine.getAvailableMoves();
    let bestMove = availableMoves[0];
    let bestScore = -Infinity;

    // Mini-max with simple evaluation
    for (const move of availableMoves) {
      const testMove = engine.makeMove(move.x, move.y, board.currentPlayer);
      
      // If this move captures stones, it's probably good
      if (testMove.captures.length > 0) {
        const score = testMove.captures.length * 100 + engine.evaluatePosition(board.currentPlayer);
        if (score > bestScore) {
          bestScore = score;
          bestMove = move;
        }
      } else {
        // Evaluate defensive value
        const score = engine.evaluatePosition(board.currentPlayer);
        if (score > bestScore) {
          bestScore = score;
          bestMove = move;
        }
      }
      
      engine.undo();
    }

    return engine.makeMove(bestMove.x, bestMove.y, board.currentPlayer);
  }
}

// Export bot instances
export const atariBots = {
  beginner: new BeginnerBot(),
  intermediate: new IntermediateBot(),
  advanced: new AdvancedBot()
};

export default AtariEngine;










