import { GameState, Color, Point, getLiberties, getGroup, isLegalMove } from './engine';

export function getBotMove(gameState: GameState, botColor: Color): Point | null {
    const { board } = gameState;
    const opponentColor = botColor === 'B' ? 'W' : 'B';
    const size = 9;

    // Helper to get all groups of a color
    const getGroups = (color: Color) => {
        const groups: Point[][] = [];
        const visited = new Set<string>();

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                if (board[y][x] === color && !visited.has(`${x},${y}`)) {
                    const group = getGroup(board, x, y);
                    groups.push(group);
                    group.forEach(p => visited.add(`${p.x},${p.y}`));
                }
            }
        }
        return groups;
    };

    // Helper to check if a point is an eye for a color
    // An eye is an empty point surrounded by stones of the same color
    // (Simplified definition for beginner bot: orthogonal neighbors must be same color or edge)
    const isEye = (x: number, y: number, color: Color): boolean => {
        const directions = [
            { x: 0, y: -1 }, { x: 0, y: 1 },
            { x: -1, y: 0 }, { x: 1, y: 0 }
        ];

        for (const dir of directions) {
            const nx = x + dir.x;
            const ny = y + dir.y;
            if (nx >= 0 && nx < size && ny >= 0 && ny < size) {
                const neighborColor = board[ny][nx];
                if (neighborColor !== color) {
                    return false; // Neighbor is enemy or empty, not an eye
                }
            }
        }
        return true;
    };

    // 1. OFFENSE: Check if we can capture any opponent group (Atari)
    const opponentGroups = getGroups(opponentColor);
    for (const group of opponentGroups) {
        // Check liberties of the group
        // We can pick any stone in the group to check liberties
        const sampleStone = group[0];
        const liberties = getLiberties(board, sampleStone.x, sampleStone.y);

        if (liberties.length === 1) {
            const killSpot = liberties[0];
            if (isLegalMove(gameState, killSpot, botColor)) {
                return killSpot;
            }
        }
    }

    // 2. DEFENSE: Check if any of our groups are in Atari and save them
    const myGroups = getGroups(botColor);
    for (const group of myGroups) {
        const sampleStone = group[0];
        const liberties = getLiberties(board, sampleStone.x, sampleStone.y);

        if (liberties.length === 1) {
            const saveSpot = liberties[0];
            // Check if playing here actually helps (increases liberties)
            // We simulate the move
            if (isLegalMove(gameState, saveSpot, botColor)) {
                // Don't save if it's a snapback (we just die again immediately) - simplified check
                // For now, always try to save
                // Simple heuristic: if it's legal, try it. 
                // A smarter bot would check if it actually gains liberties, but for beginner level, extending is usually good.
                return saveSpot;
            }
        }
    }

    // 3. SHAPE/LOCAL: Play near existing stones, but AVOID EYES
    // This simulates "fighting" or "responding" rather than playing randomly
    const allStones: Point[] = [];
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            if (board[y][x] !== null) {
                allStones.push({ x, y });
            }
        }
    }

    const interestingMoves: Point[] = [];

    // If board is empty or nearly empty, prefer 3-3, 4-4, 3-4 points
    if (allStones.length < 4) {
        const openingMoves = [
            { x: 2, y: 2 }, { x: 6, y: 2 }, { x: 2, y: 6 }, { x: 6, y: 6 }, // 3-3
            { x: 3, y: 3 }, { x: 5, y: 3 }, { x: 3, y: 5 }, { x: 5, y: 5 }, // 4-4
            { x: 4, y: 4 } // Tengen
        ];

        // Filter valid openings
        const validOpenings = openingMoves.filter(p => isLegalMove(gameState, p, botColor));
        if (validOpenings.length > 0) {
            return validOpenings[Math.floor(Math.random() * validOpenings.length)];
        }
    }

    // Find legal moves adjacent to existing stones (diagonal or orthogonal)
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            if (board[y][x] === null) {
                const p = { x, y };

                // Skip if it's an eye for US (don't fill own eyes)
                if (isEye(x, y, botColor)) continue;

                // Skip if it's an eye for ENEMY (don't play inside enemy territory unless capturing)
                // Note: Capturing logic (Atari) is handled above. If we are here, it's not a capture.
                if (isEye(x, y, opponentColor)) continue;

                if (isLegalMove(gameState, p, botColor)) {
                    // Check proximity to other stones
                    let isNear = false;
                    for (const s of allStones) {
                        if (Math.abs(s.x - x) <= 2 && Math.abs(s.y - y) <= 2) {
                            isNear = true;
                            break;
                        }
                    }

                    // Avoid self-atari (simple check: don't play if it leaves us with 1 liberty)
                    // Note: isLegalMove handles suicide (0 liberties), but we want to avoid 1 liberty too unless necessary
                    // For a beginner bot, maybe we allow mistakes? Let's filter out immediate self-death but allow bad shapes.

                    if (isNear) {
                        interestingMoves.push(p);
                    }
                }
            }
        }
    }

    if (interestingMoves.length > 0) {
        return interestingMoves[Math.floor(Math.random() * interestingMoves.length)];
    }

    // 4. RANDOM: If no interesting local moves, play anywhere legal (but still avoid eyes)
    const allLegalMoves: Point[] = [];
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            // Skip eyes
            if (isEye(x, y, botColor)) continue;
            if (isEye(x, y, opponentColor)) continue;

            if (isLegalMove(gameState, { x, y }, botColor)) {
                allLegalMoves.push({ x, y });
            }
        }
    }

    if (allLegalMoves.length > 0) {
        return allLegalMoves[Math.floor(Math.random() * allLegalMoves.length)];
    }

    // Pass if no moves (or only eye-filling moves remain)
    return null;
}
