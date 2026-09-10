import { Board, BoardSize, Difficulty, Player } from '../types/game';
import { checkWinner, getAvailableMoves, isBoardFull } from './gameLogic';
import { generateWinningCombinations } from './winConditions';

interface MinimaxResult {
  score: number;
  bestMove: number | null;
}

/**
 * Standard Minimax algorithm for 3x3 boards.
 */
function minimax3x3(
  board: Board,
  depth: number,
  isMaximizing: boolean,
  computerPlayer: Player,
  humanPlayer: Player
): MinimaxResult {
  const winner = checkWinner(board, 3);

  if (winner === computerPlayer) {
    return { score: 10 - depth, bestMove: null };
  }
  if (winner === humanPlayer) {
    return { score: depth - 10, bestMove: null };
  }
  if (isBoardFull(board)) {
    return { score: 0, bestMove: null };
  }

  const availableMoves = getAvailableMoves(board);

  if (isMaximizing) {
    let maxScore = -Infinity;
    let bestMove = availableMoves[0] ?? null;

    for (const move of availableMoves) {
      board[move] = computerPlayer;
      const result = minimax3x3(board, depth + 1, false, computerPlayer, humanPlayer);
      board[move] = null; // Backtrack

      if (result.score > maxScore) {
        maxScore = result.score;
        bestMove = move;
      }
    }

    return { score: maxScore, bestMove };
  } else {
    let minScore = Infinity;
    let bestMove = availableMoves[0] ?? null;

    for (const move of availableMoves) {
      board[move] = humanPlayer;
      const result = minimax3x3(board, depth + 1, true, computerPlayer, humanPlayer);
      board[move] = null; // Backtrack

      if (result.score < minScore) {
        minScore = result.score;
        bestMove = move;
      }
    }

    return { score: minScore, bestMove };
  }
}

/**
 * Heuristic board evaluation for N x N boards.
 */
function evaluateBoard(board: Board, size: BoardSize, computerPlayer: Player, humanPlayer: Player): number {
  const combinations = generateWinningCombinations(size, size);
  let score = 0;

  for (const combo of combinations) {
    let compCount = 0;
    let humanCount = 0;

    for (const idx of combo) {
      if (board[idx] === computerPlayer) compCount++;
      else if (board[idx] === humanPlayer) humanCount++;
    }

    if (compCount > 0 && humanCount > 0) {
      continue; // Blocked line
    }

    if (compCount === size) return 10000;
    if (humanCount === size) return -10000;

    if (compCount > 0) {
      score += Math.pow(10, compCount);
    } else if (humanCount > 0) {
      score -= Math.pow(10, humanCount) * 1.2; // Prioritize blocking
    }
  }

  return score;
}

/**
 * Alpha-Beta depth-limited search for larger boards (4x4, 5x5).
 */
function alphaBeta(
  board: Board,
  size: BoardSize,
  depth: number,
  maxDepth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  computerPlayer: Player,
  humanPlayer: Player
): { score: number; bestMove: number | null } {
  const winner = checkWinner(board, size);
  if (winner === computerPlayer) return { score: 10000 - depth, bestMove: null };
  if (winner === humanPlayer) return { score: depth - 10000, bestMove: null };
  if (isBoardFull(board) || depth >= maxDepth) {
    return { score: evaluateBoard(board, size, computerPlayer, humanPlayer), bestMove: null };
  }

  const availableMoves = getAvailableMoves(board);
  // Sort moves near center for better pruning
  const center = (size * size) / 2;
  availableMoves.sort((a, b) => Math.abs(a - center) - Math.abs(b - center));

  if (isMaximizing) {
    let maxScore = -Infinity;
    let bestMove = availableMoves[0] ?? null;

    for (const move of availableMoves) {
      board[move] = computerPlayer;
      const res = alphaBeta(board, size, depth + 1, maxDepth, alpha, beta, false, computerPlayer, humanPlayer);
      board[move] = null;

      if (res.score > maxScore) {
        maxScore = res.score;
        bestMove = move;
      }
      alpha = Math.max(alpha, maxScore);
      if (beta <= alpha) break;
    }
    return { score: maxScore, bestMove };
  } else {
    let minScore = Infinity;
    let bestMove = availableMoves[0] ?? null;

    for (const move of availableMoves) {
      board[move] = humanPlayer;
      const res = alphaBeta(board, size, depth + 1, maxDepth, alpha, beta, true, computerPlayer, humanPlayer);
      board[move] = null;

      if (res.score < minScore) {
        minScore = res.score;
        bestMove = move;
      }
      beta = Math.min(beta, minScore);
      if (beta <= alpha) break;
    }
    return { score: minScore, bestMove };
  }
}

/**
 * Calculates optimal or difficulty-adjusted move for the computer.
 */
export function getComputerMove(
  board: Board,
  computerPlayer: Player = 'O',
  humanPlayer: Player = 'X',
  difficulty: Difficulty = 'hard',
  size?: BoardSize
): number | null {
  const boardSize: BoardSize = size ?? (Math.sqrt(board.length) as BoardSize);
  const availableMoves = getAvailableMoves(board);

  if (availableMoves.length === 0 || checkWinner(board, boardSize) !== null) {
    return null;
  }

  // Easy difficulty: 70% random, 30% smart
  if (difficulty === 'easy' && Math.random() < 0.7) {
    const randomIdx = Math.floor(Math.random() * availableMoves.length);
    return availableMoves[randomIdx];
  }

  // Medium difficulty: takes immediate win or block, else random/center
  if (difficulty === 'medium') {
    // 1. Check if computer can win immediately
    for (const move of availableMoves) {
      board[move] = computerPlayer;
      if (checkWinner(board, boardSize) === computerPlayer) {
        board[move] = null;
        return move;
      }
      board[move] = null;
    }

    // 2. Check if human can win immediately and block
    for (const move of availableMoves) {
      board[move] = humanPlayer;
      if (checkWinner(board, boardSize) === humanPlayer) {
        board[move] = null;
        return move;
      }
      board[move] = null;
    }

    // 50% chance of random move vs smart move
    if (Math.random() < 0.5) {
      const randomIdx = Math.floor(Math.random() * availableMoves.length);
      return availableMoves[randomIdx];
    }
  }

  // Hard difficulty or fallback from medium:
  // First move optimization on empty board:
  if (availableMoves.length === board.length) {
    const center = Math.floor(board.length / 2);
    return center;
  }

  // Check 1-ply winning or blocking moves directly for instant response
  for (const move of availableMoves) {
    board[move] = computerPlayer;
    if (checkWinner(board, boardSize) === computerPlayer) {
      board[move] = null;
      return move;
    }
    board[move] = null;
  }
  for (const move of availableMoves) {
    board[move] = humanPlayer;
    if (checkWinner(board, boardSize) === humanPlayer) {
      board[move] = null;
      return move;
    }
    board[move] = null;
  }

  const boardCopy = [...board];

  if (boardSize === 3) {
    const result = minimax3x3(boardCopy, 0, true, computerPlayer, humanPlayer);
    return result.bestMove;
  } else {
    // 4x4 or 5x5: use depth-limited search (depth 3 on 4x4, depth 2 on 5x5 for smooth UX)
    const maxDepth = boardSize === 4 ? 3 : 2;
    const result = alphaBeta(boardCopy, boardSize, 0, maxDepth, -Infinity, Infinity, true, computerPlayer, humanPlayer);
    return result.bestMove;
  }
}

/**
 * Returns a recommended hint move for the given player.
 */
export function getHintMove(
  board: Board,
  player: Player,
  opponent: Player,
  size?: BoardSize
): number | null {
  return getComputerMove(board, player, opponent, 'hard', size);
}
