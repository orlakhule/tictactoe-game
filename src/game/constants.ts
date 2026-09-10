import { Board, Score } from '../types/game';

export const WINNING_COMBINATIONS: ReadonlyArray<readonly [number, number, number]> = [
  // Horizontal rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Vertical columns
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonals
  [0, 4, 8],
  [2, 4, 6],
];

export const INITIAL_BOARD: Board = Array(9).fill(null);

export const DEFAULT_SCORE: Score = {
  X: 0,
  O: 0,
  draws: 0,
};

export const STORAGE_KEY_SCORE = 'charis-tictactoe-score';

