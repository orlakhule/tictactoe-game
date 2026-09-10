import { Board, BoardSize } from '../types/game';

const combinationsCache = new Map<number, number[][]>();

/**
 * Dynamically generates all winning combinations for an N x N board with K consecutive symbols required.
 */
export function generateWinningCombinations(size: BoardSize = 3, winLength: number = size): number[][] {
  const cacheKey = size * 100 + winLength;
  if (combinationsCache.has(cacheKey)) {
    return combinationsCache.get(cacheKey)!;
  }

  const combinations: number[][] = [];

  // 1. Horizontal lines
  for (let r = 0; r < size; r++) {
    for (let c = 0; c <= size - winLength; c++) {
      const line: number[] = [];
      for (let i = 0; i < winLength; i++) {
        line.push(r * size + (c + i));
      }
      combinations.push(line);
    }
  }

  // 2. Vertical lines
  for (let c = 0; c < size; c++) {
    for (let r = 0; r <= size - winLength; r++) {
      const line: number[] = [];
      for (let i = 0; i < winLength; i++) {
        line.push((r + i) * size + c);
      }
      combinations.push(line);
    }
  }

  // 3. Diagonal lines (top-left to bottom-right)
  for (let r = 0; r <= size - winLength; r++) {
    for (let c = 0; c <= size - winLength; c++) {
      const line: number[] = [];
      for (let i = 0; i < winLength; i++) {
        line.push((r + i) * size + (c + i));
      }
      combinations.push(line);
    }
  }

  // 4. Anti-diagonal lines (top-right to bottom-left)
  for (let r = 0; r <= size - winLength; r++) {
    for (let c = winLength - 1; c < size; c++) {
      const line: number[] = [];
      for (let i = 0; i < winLength; i++) {
        line.push((r + i) * size + (c - i));
      }
      combinations.push(line);
    }
  }

  combinationsCache.set(cacheKey, combinations);
  return combinations;
}

/**
 * Checks if there is a winning combination on the board for the given board size.
 * Returns the winning cell indices or null if no winner.
 */
export function getWinningCombination(board: Board, size?: BoardSize): number[] | null {
  const boardSize: BoardSize = size ?? (Math.sqrt(board.length) as BoardSize);
  const winLength = boardSize; // 3 on 3x3, 4 on 4x4, 5 on 5x5
  const combinations = generateWinningCombinations(boardSize, winLength);

  for (const combination of combinations) {
    const first = board[combination[0]];
    if (first !== null && combination.every((idx) => board[idx] === first)) {
      return [...combination];
    }
  }

  return null;
}
