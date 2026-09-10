import { Board, BoardSize, Player } from '../types/game';
import { getWinningCombination } from './winConditions';

/**
 * Returns the winning player ('X' or 'O') if any, otherwise null.
 */
export function checkWinner(board: Board, size?: BoardSize): Player | null {
  const win = getWinningCombination(board, size);
  if (!win) {
    return null;
  }
  return board[win[0]];
}

/**
 * Returns an array of cell indices that form the winning line.
 * If there is no winner, returns an empty array.
 */
export function getWinningCells(board: Board, size?: BoardSize): number[] {
  const win = getWinningCombination(board, size);
  return win ? [...win] : [];
}

/**
 * Returns true if all cells on the board are filled.
 */
export function isBoardFull(board: Board): boolean {
  return board.every((cell) => cell !== null);
}

/**
 * Returns true if the index is within bounds and the cell is currently empty.
 */
export function isValidMove(board: Board, index: number): boolean {
  if (index < 0 || index >= board.length) {
    return false;
  }
  return board[index] === null;
}

/**
 * Returns a new board with the specified move applied.
 * Does not mutate the original board.
 */
export function makeMove(board: Board, index: number, player: Player): Board {
  if (!isValidMove(board, index)) {
    throw new Error(`Invalid move at index ${index}. Cell must be empty and within board boundaries.`);
  }
  const newBoard = [...board];
  newBoard[index] = player;
  return newBoard;
}

/**
 * Returns all available (empty) cell indices on the board.
 */
export function getAvailableMoves(board: Board): number[] {
  const available: number[] = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      available.push(i);
    }
  }
  return available;
}
