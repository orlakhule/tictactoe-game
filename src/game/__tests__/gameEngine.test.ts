import { describe, it, expect } from 'vitest';
import { Board } from '../../types/game';
import {
  checkWinner,
  getWinningCells,
  isBoardFull,
  isValidMove,
  makeMove,
  getAvailableMoves,
} from '../gameLogic';
import { getComputerMove } from '../computerPlayer';
import { INITIAL_BOARD, WINNING_COMBINATIONS } from '../constants';

describe('CHARIS Tic-Tac-Toe Game Engine', () => {
  describe('Board Initialization & Constants', () => {
    it('has an initial board with 9 empty cells', () => {
      expect(INITIAL_BOARD).toHaveLength(9);
      expect(INITIAL_BOARD.every((cell) => cell === null)).toBe(true);
    });

    it('has exactly 8 winning combinations (3 rows, 3 cols, 2 diagonals)', () => {
      expect(WINNING_COMBINATIONS).toHaveLength(8);
      // All combinations have 3 unique indices within 0..8
      for (const [a, b, c] of WINNING_COMBINATIONS) {
        expect([a, b, c].every((idx) => idx >= 0 && idx <= 8)).toBe(true);
        expect(new Set([a, b, c]).size).toBe(3);
      }
    });
  });

  describe('Move Validation and Immutability', () => {
    it('identifies valid empty cells and out of bounds', () => {
      const board: Board = ['X', null, 'O', null, null, null, null, null, null];
      expect(isValidMove(board, 0)).toBe(false);
      expect(isValidMove(board, 2)).toBe(false);
      expect(isValidMove(board, 1)).toBe(true);
      expect(isValidMove(board, 8)).toBe(true);
      expect(isValidMove(board, -1)).toBe(false);
      expect(isValidMove(board, 9)).toBe(false);
      expect(isValidMove(board, 100)).toBe(false);
    });

    it('returns a new board instance on move without mutating input', () => {
      const original: Board = [...INITIAL_BOARD];
      const nextBoard = makeMove(original, 4, 'X');

      expect(original[4]).toBeNull();
      expect(nextBoard[4]).toBe('X');
      expect(nextBoard).not.toBe(original);
    });

    it('throws descriptive error on invalid move', () => {
      const board: Board = ['X', null, null, null, null, null, null, null, null];
      expect(() => makeMove(board, 0, 'O')).toThrowError(/Invalid move at index 0/);
      expect(() => makeMove(board, 12, 'O')).toThrowError(/Invalid move at index 12/);
    });

    it('correctly reports available moves', () => {
      expect(getAvailableMoves(INITIAL_BOARD)).toHaveLength(9);
      const partial: Board = ['X', 'O', 'X', null, null, null, null, null, null];
      expect(getAvailableMoves(partial)).toEqual([3, 4, 5, 6, 7, 8]);
    });
  });

  describe('Win and Draw Detection', () => {
    it('detects all 3 horizontal row wins', () => {
      for (let row = 0; row < 3; row++) {
        const board: Board = [...INITIAL_BOARD];
        const a = row * 3;
        const b = row * 3 + 1;
        const c = row * 3 + 2;
        board[a] = 'X';
        board[b] = 'X';
        board[c] = 'X';

        expect(checkWinner(board)).toBe('X');
        expect(getWinningCells(board)).toEqual([a, b, c]);
      }
    });

    it('detects all 3 vertical column wins', () => {
      for (let col = 0; col < 3; col++) {
        const board: Board = [...INITIAL_BOARD];
        const a = col;
        const b = col + 3;
        const c = col + 6;
        board[a] = 'O';
        board[b] = 'O';
        board[c] = 'O';

        expect(checkWinner(board)).toBe('O');
        expect(getWinningCells(board)).toEqual([a, b, c]);
      }
    });

    it('detects main diagonal win [0, 4, 8]', () => {
      const board: Board = ['X', null, null, null, 'X', null, null, null, 'X'];
      expect(checkWinner(board)).toBe('X');
      expect(getWinningCells(board)).toEqual([0, 4, 8]);
    });

    it('detects anti diagonal win [2, 4, 6]', () => {
      const board: Board = [null, null, 'O', null, 'O', null, 'O', null, null];
      expect(checkWinner(board)).toBe('O');
      expect(getWinningCells(board)).toEqual([2, 4, 6]);
    });

    it('detects drawn game when full with no winner', () => {
      const drawBoard: Board = [
        'X', 'O', 'X',
        'X', 'X', 'O',
        'O', 'X', 'O',
      ];
      expect(checkWinner(drawBoard)).toBeNull();
      expect(isBoardFull(drawBoard)).toBe(true);
      expect(getWinningCells(drawBoard)).toEqual([]);
    });

    it('returns false for isBoardFull if any cell is null', () => {
      const nearlyFull: Board = [
        'X', 'O', 'X',
        'X', 'X', 'O',
        'O', 'X', null,
      ];
      expect(isBoardFull(nearlyFull)).toBe(false);
    });
  });

  describe('Minimax AI Strategy & Invariance', () => {
    it('returns null on game completion or full board', () => {
      const fullBoard: Board = ['X', 'O', 'X', 'X', 'X', 'O', 'O', 'X', 'O'];
      expect(getComputerMove(fullBoard, 'O', 'X')).toBeNull();

      const wonBoard: Board = ['O', 'O', 'O', null, null, null, null, null, null];
      expect(getComputerMove(wonBoard, 'O', 'X')).toBeNull();
    });

    it('takes the winning move when available in 1 ply', () => {
      const board: Board = [
        'O', 'O', null, // Cell 2 wins for O
        'X', 'X', null,
        null, null, null,
      ];
      expect(getComputerMove(board, 'O', 'X')).toBe(2);
    });

    it('blocks immediate opponent win threat', () => {
      const board: Board = [
        'X', 'X', null, // Cell 2 would win for X
        'O', null, null,
        null, null, null,
      ];
      expect(getComputerMove(board, 'O', 'X')).toBe(2);
    });

    it('blocks opponent vertical win threat', () => {
      const board: Board = [
        'X', 'O', null,
        'X', null, null,
        null, null, null, // Cell 6 would win for X
      ];
      expect(getComputerMove(board, 'O', 'X')).toBe(6);
    });

    it('blocks opponent diagonal win threat', () => {
      const board: Board = [
        'X', null, null,
        null, 'X', null,
        null, null, null, // Cell 8 would win for X
      ];
      expect(getComputerMove(board, 'O', 'X')).toBe(8);
    });

    it('simulates 10 matches against a random human player and AI never loses', () => {
      // Minimax playing as 'O', human playing as 'X' making random moves
      for (let seed = 0; seed < 10; seed++) {
        let board: Board = [...INITIAL_BOARD];
        let turn = 0;

        while (!isBoardFull(board) && checkWinner(board) === null) {
          if (turn % 2 === 0) {
            // Human move (X)
            const available = getAvailableMoves(board);
            const humanMove = available[(seed + turn) % available.length];
            board = makeMove(board, humanMove, 'X');
          } else {
            // Computer move (O)
            const compMove = getComputerMove(board, 'O', 'X');
            expect(compMove).not.toBeNull();
            board = makeMove(board, compMove!, 'O');
          }
          turn++;
        }

        const winner = checkWinner(board);
        // Computer must NEVER lose to human (winner is either 'O' or null for draw)
        expect(winner).not.toBe('X');
      }
    });
  });
});

