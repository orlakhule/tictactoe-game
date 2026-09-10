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
import { INITIAL_BOARD } from '../constants';

describe('Game Logic Pure Functions', () => {
  it('returns null winner for initial empty board', () => {
    expect(checkWinner(INITIAL_BOARD)).toBeNull();
    expect(getWinningCells(INITIAL_BOARD)).toEqual([]);
    expect(isBoardFull(INITIAL_BOARD)).toBe(false);
  });

  it('detects horizontal wins for player X', () => {
    // Row 0
    const row0: Board = ['X', 'X', 'X', null, 'O', null, 'O', null, null];
    expect(checkWinner(row0)).toBe('X');
    expect(getWinningCells(row0)).toEqual([0, 1, 2]);

    // Row 1
    const row1: Board = [null, 'O', null, 'X', 'X', 'X', 'O', null, null];
    expect(checkWinner(row1)).toBe('X');
    expect(getWinningCells(row1)).toEqual([3, 4, 5]);

    // Row 2
    const row2: Board = ['O', null, 'O', null, null, null, 'X', 'X', 'X'];
    expect(checkWinner(row2)).toBe('X');
    expect(getWinningCells(row2)).toEqual([6, 7, 8]);
  });

  it('detects vertical wins for player O', () => {
    // Column 0
    const col0: Board = ['O', 'X', null, 'O', 'X', null, 'O', null, null];
    expect(checkWinner(col0)).toBe('O');
    expect(getWinningCells(col0)).toEqual([0, 3, 6]);

    // Column 1
    const col1: Board = ['X', 'O', null, null, 'O', 'X', null, 'O', null];
    expect(checkWinner(col1)).toBe('O');
    expect(getWinningCells(col1)).toEqual([1, 4, 7]);

    // Column 2
    const col2: Board = ['X', null, 'O', null, 'X', 'O', null, null, 'O'];
    expect(checkWinner(col2)).toBe('O');
    expect(getWinningCells(col2)).toEqual([2, 5, 8]);
  });

  it('detects diagonal wins', () => {
    // Main diagonal [0, 4, 8]
    const mainDiag: Board = ['X', 'O', null, null, 'X', 'O', null, null, 'X'];
    expect(checkWinner(mainDiag)).toBe('X');
    expect(getWinningCells(mainDiag)).toEqual([0, 4, 8]);

    // Anti diagonal [2, 4, 6]
    const antiDiag: Board = [null, 'X', 'O', 'X', 'O', null, 'O', null, null];
    expect(checkWinner(antiDiag)).toBe('O');
    expect(getWinningCells(antiDiag)).toEqual([2, 4, 6]);
  });

  it('detects draw game when board is full and no winner', () => {
    const drawBoard: Board = [
      'X', 'O', 'X',
      'X', 'O', 'O',
      'O', 'X', 'X',
    ];
    expect(checkWinner(drawBoard)).toBeNull();
    expect(isBoardFull(drawBoard)).toBe(true);
    expect(getAvailableMoves(drawBoard)).toEqual([]);
  });

  it('validates moves accurately', () => {
    const board: Board = ['X', null, null, null, 'O', null, null, null, null];
    expect(isValidMove(board, 0)).toBe(false); // Occupied
    expect(isValidMove(board, 1)).toBe(true); // Empty
    expect(isValidMove(board, 4)).toBe(false); // Occupied
    expect(isValidMove(board, -1)).toBe(false); // Out of bounds
    expect(isValidMove(board, 9)).toBe(false); // Out of bounds
  });

  it('makes moves immutably and raises error on invalid move', () => {
    const board: Board = [...INITIAL_BOARD];
    const newBoard = makeMove(board, 4, 'X');

    expect(board[4]).toBeNull(); // Immutable
    expect(newBoard[4]).toBe('X');
    expect(getAvailableMoves(newBoard)).toHaveLength(8);

    expect(() => makeMove(newBoard, 4, 'O')).toThrowError();
  });
});

describe('Minimax Computer AI', () => {
  it('returns null if board is full or already won', () => {
    const fullBoard: Board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
    expect(getComputerMove(fullBoard, 'O', 'X')).toBeNull();

    const wonBoard: Board = ['O', 'O', 'O', 'X', 'X', null, null, null, null];
    expect(getComputerMove(wonBoard, 'O', 'X')).toBeNull();
  });

  it('immediately takes winning move if available', () => {
    // O has cells 0 and 1, can win by taking cell 2
    const board: Board = [
      'O', 'O', null,
      'X', 'X', null,
      null, null, null,
    ];
    const move = getComputerMove(board, 'O', 'X');
    expect(move).toBe(2);
  });

  it('blocks human player winning move', () => {
    // X has cells 0 and 3, threat on cell 6. O must block at 6
    const board: Board = [
      'X', null, null,
      'X', 'O', null,
      null, null, null,
    ];
    const move = getComputerMove(board, 'O', 'X');
    expect(move).toBe(6);
  });

  it('blocks diagonal winning move', () => {
    // X has 0 and 4, threat on 8. O must block at 8
    const board: Board = [
      'X', null, null,
      null, 'X', null,
      'O', null, null,
    ];
    const move = getComputerMove(board, 'O', 'X');
    expect(move).toBe(8);
  });

  it('never loses against any human move sequence (plays to a draw or win)', () => {
    // Test center choice or corner response
    const board: Board = [
      'X', null, null,
      null, null, null,
      null, null, null,
    ];
    const move = getComputerMove(board, 'O', 'X');
    // Optimal response to corner 0 is center 4
    expect(move).toBe(4);
  });
});

