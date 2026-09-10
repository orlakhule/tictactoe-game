import { describe, it, expect } from 'vitest';
import { Board } from '../../types/game';
import { generateWinningCombinations, getWinningCombination } from '../winConditions';
import { checkWinner } from '../gameLogic';
import { getComputerMove, getHintMove } from '../computerPlayer';

describe('Dynamic N x N Board Rules & AI Evaluation', () => {
  describe('Dynamic Combinations Generation', () => {
    it('generates correct number of combinations for 3x3 (8 combos)', () => {
      const combos = generateWinningCombinations(3, 3);
      expect(combos).toHaveLength(8);
    });

    it('generates correct number of combinations for 4x4 (10 combos)', () => {
      // 4 horizontal, 4 vertical, 2 diagonals = 10
      const combos = generateWinningCombinations(4, 4);
      expect(combos).toHaveLength(10);
      for (const line of combos) {
        expect(line).toHaveLength(4);
      }
    });

    it('generates correct number of combinations for 5x5 (12 combos)', () => {
      // 5 horizontal, 5 vertical, 2 diagonals = 12
      const combos = generateWinningCombinations(5, 5);
      expect(combos).toHaveLength(12);
      for (const line of combos) {
        expect(line).toHaveLength(5);
      }
    });
  });

  describe('4x4 Win Detection', () => {
    it('detects horizontal win on 4x4', () => {
      const board: Board = Array(16).fill(null);
      // Row 1: 4, 5, 6, 7
      board[4] = 'X';
      board[5] = 'X';
      board[6] = 'X';
      board[7] = 'X';

      expect(checkWinner(board, 4)).toBe('X');
      expect(getWinningCombination(board, 4)).toEqual([4, 5, 6, 7]);
    });

    it('detects diagonal win on 4x4', () => {
      const board: Board = Array(16).fill(null);
      // Main diagonal: 0, 5, 10, 15
      board[0] = 'O';
      board[5] = 'O';
      board[10] = 'O';
      board[15] = 'O';

      expect(checkWinner(board, 4)).toBe('O');
      expect(getWinningCombination(board, 4)).toEqual([0, 5, 10, 15]);
    });
  });

  describe('5x5 Win Detection', () => {
    it('detects vertical win on 5x5', () => {
      const board: Board = Array(25).fill(null);
      // Col 2: 2, 7, 12, 17, 22
      board[2] = 'X';
      board[7] = 'X';
      board[12] = 'X';
      board[17] = 'X';
      board[22] = 'X';

      expect(checkWinner(board, 5)).toBe('X');
      expect(getWinningCombination(board, 5)).toEqual([2, 7, 12, 17, 22]);
    });

    it('detects anti-diagonal win on 5x5', () => {
      const board: Board = Array(25).fill(null);
      // Anti-diag: 4, 8, 12, 16, 20
      board[4] = 'O';
      board[8] = 'O';
      board[12] = 'O';
      board[16] = 'O';
      board[20] = 'O';

      expect(checkWinner(board, 5)).toBe('O');
      expect(getWinningCombination(board, 5)).toEqual([4, 8, 12, 16, 20]);
    });
  });

  describe('AI Difficulties and Hint Engine', () => {
    it('medium difficulty blocks immediate winning threat on 4x4', () => {
      const board: Board = Array(16).fill(null);
      // Human has 0, 1, 2. Threat on 3
      board[0] = 'X';
      board[1] = 'X';
      board[2] = 'X';
      board[8] = 'O';

      const move = getComputerMove(board, 'O', 'X', 'medium', 4);
      expect(move).toBe(3);
    });

    it('generates a valid hint move for human player', () => {
      const board: Board = [
        'X', 'X', null,
        'O', null, null,
        null, null, null,
      ];
      const hint = getHintMove(board, 'X', 'O', 3);
      // Best hint is cell 2 to win immediately
      expect(hint).toBe(2);
    });
  });
});
