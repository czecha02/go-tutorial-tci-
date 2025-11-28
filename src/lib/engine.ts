export type Point = { x: number; y: number };
export type Color = "B" | "W";
export type Stone = { x: number; y: number; color: Color };

export interface GameState {
  board: (Color | null)[][];
  toPlay: Color;
  lastMove?: Point;
  previousBoard?: string; // for ko rule
  captured: { B: number; W: number };
}

export function createInitialState(): GameState {
  return {
    board: Array(9).fill(null).map(() => Array(9).fill(null)),
    toPlay: "B",
    captured: { B: 0, W: 0 }
  };
}

export function toStoneArray(board: (Color | null)[][]): Stone[] {
  const stones: Stone[] = [];
  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      if (board[y][x]) {
        stones.push({ x, y, color: board[y][x]! });
      }
    }
  }
  return stones;
}

export function getLiberties(board: (Color | null)[][], x: number, y: number): Point[] {
  const liberties: Point[] = [];
  const color = board[y][x];
  if (!color) return liberties;

  const visited = new Set<string>();
  const toVisit: Point[] = [{ x, y }];

  while (toVisit.length > 0) {
    const current = toVisit.pop()!;
    const key = `${current.x},${current.y}`;
    if (visited.has(key)) continue;
    visited.add(key);

    const currentColor = board[current.y][current.x];
    if (currentColor !== color) {
      if (currentColor === null) {
        liberties.push(current);
      }
      continue;
    }

    // Add adjacent points
    const directions = [
      { x: 0, y: -1 }, { x: 0, y: 1 },
      { x: -1, y: 0 }, { x: 1, y: 0 }
    ];

    for (const dir of directions) {
      const nx = current.x + dir.x;
      const ny = current.y + dir.y;
      if (nx >= 0 && nx < 9 && ny >= 0 && ny < 9) {
        toVisit.push({ x: nx, y: ny });
      }
    }
  }

  return liberties;
}

export function getGroup(board: (Color | null)[][], x: number, y: number): Point[] {
  const group: Point[] = [];
  const color = board[y][x];
  if (!color) return group;

  const visited = new Set<string>();
  const toVisit: Point[] = [{ x, y }];

  while (toVisit.length > 0) {
    const current = toVisit.pop()!;
    const key = `${current.x},${current.y}`;
    if (visited.has(key)) continue;
    visited.add(key);

    const currentColor = board[current.y][current.x];
    if (currentColor !== color) continue;

    group.push(current);

    // Add adjacent points
    const directions = [
      { x: 0, y: -1 }, { x: 0, y: 1 },
      { x: -1, y: 0 }, { x: 1, y: 0 }
    ];

    for (const dir of directions) {
      const nx = current.x + dir.x;
      const ny = current.y + dir.y;
      if (nx >= 0 && nx < 9 && ny >= 0 && ny < 9) {
        toVisit.push({ x: nx, y: ny });
      }
    }
  }

  return group;
}

export function captureGroup(board: (Color | null)[][], group: Point[]): Point[] {
  const captured: Point[] = [];
  for (const point of group) {
    if (board[point.y][point.x]) {
      captured.push(point);
      board[point.y][point.x] = null;
    }
  }
  return captured;
}

export function isLegalMove(state: GameState, point: Point, color: Color): boolean {
  const { board } = state;
  
  // Check if point is empty
  if (board[point.y][point.x] !== null) return false;

  // Create a copy of the board to test the move
  const testBoard = board.map(row => [...row]);
  testBoard[point.y][point.x] = color;

  // Check for captures
  const enemyColor = color === "B" ? "W" : "B";
  const directions = [
    { x: 0, y: -1 }, { x: 0, y: 1 },
    { x: -1, y: 0 }, { x: 1, y: 0 }
  ];

  let captures = false;
  for (const dir of directions) {
    const nx = point.x + dir.x;
    const ny = point.y + dir.y;
    if (nx >= 0 && nx < 9 && ny >= 0 && ny < 9) {
      const adjacentColor = testBoard[ny][nx];
      if (adjacentColor === enemyColor) {
        const group = getGroup(testBoard, nx, ny);
        const liberties = getLiberties(testBoard, nx, ny);
        if (liberties.length === 0) {
          captures = true;
          break;
        }
      }
    }
  }

  // If no captures, check if the new group has liberties (suicide rule)
  if (!captures) {
    const newGroup = getGroup(testBoard, point.x, point.y);
    const liberties = getLiberties(testBoard, point.x, point.y);
    if (liberties.length === 0) return false;
  }

  // Check ko rule
  if (state.previousBoard) {
    const newBoardString = boardToString(testBoard);
    if (newBoardString === state.previousBoard) return false;
  }

  return true;
}

export function placeStone(state: GameState, point: Point, color: Color): { nextState: GameState; captured: Point[] } {
  if (!isLegalMove(state, point, color)) {
    throw new Error("Illegal move");
  }

  const newBoard = state.board.map(row => [...row]);
  newBoard[point.y][point.x] = color;

  // Find and capture enemy groups with no liberties
  const enemyColor = color === "B" ? "W" : "B";
  const directions = [
    { x: 0, y: -1 }, { x: 0, y: 1 },
    { x: -1, y: 0 }, { x: 1, y: 0 }
  ];

  const captured: Point[] = [];
  for (const dir of directions) {
    const nx = point.x + dir.x;
    const ny = point.y + dir.y;
    if (nx >= 0 && nx < 9 && ny >= 0 && ny < 9) {
      const adjacentColor = newBoard[ny][nx];
      if (adjacentColor === enemyColor) {
        const group = getGroup(newBoard, nx, ny);
        const liberties = getLiberties(newBoard, nx, ny);
        if (liberties.length === 0) {
          const groupCaptured = captureGroup(newBoard, group);
          captured.push(...groupCaptured);
        }
      }
    }
  }

  const nextState: GameState = {
    board: newBoard,
    toPlay: color === "B" ? "W" : "B",
    lastMove: point,
    previousBoard: boardToString(state.board),
    captured: {
      B: state.captured.B + (color === "B" ? 0 : captured.length),
      W: state.captured.W + (color === "W" ? 0 : captured.length)
    }
  };

  return { nextState, captured };
}

export function boardToString(board: (Color | null)[][]): string {
  return board.map(row => row.map(cell => cell || ".").join("")).join("\n");
}

export function explainMove(state: GameState, point: Point, color: Color): string {
  const { board } = state;
  
  // Check for captures
  const enemyColor = color === "B" ? "W" : "B";
  const directions = [
    { x: 0, y: -1 }, { x: 0, y: 1 },
    { x: -1, y: 0 }, { x: 1, y: 0 }
  ];

  for (const dir of directions) {
    const nx = point.x + dir.x;
    const ny = point.y + dir.y;
    if (nx >= 0 && nx < 9 && ny >= 0 && ny < 9) {
      const adjacentColor = board[ny][nx];
      if (adjacentColor === enemyColor) {
        const liberties = getLiberties(board, nx, ny);
        if (liberties.length === 1) {
          return `captures ${getGroup(board, nx, ny).length} stone(s)`;
        }
      }
    }
  }

  // Check for connection
  for (const dir of directions) {
    const nx = point.x + dir.x;
    const ny = point.y + dir.y;
    if (nx >= 0 && nx < 9 && ny >= 0 && ny < 9) {
      const adjacentColor = board[ny][nx];
      if (adjacentColor === color) {
        return `connects to group at ${String.fromCharCode(65 + nx)}${9 - ny}`;
      }
    }
  }

  // Check for center bias
  const centerDistance = Math.abs(point.x - 4) + Math.abs(point.y - 4);
  if (centerDistance <= 2) {
    return "takes center influence";
  }

  return "develops position";
}













