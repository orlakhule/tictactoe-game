import React, { useRef } from 'react';
import { Board as BoardType, BoardSize } from '../../types/game';
import { Cell } from '../Cell/Cell';
import styles from './Board.module.css';

interface BoardProps {
  board: BoardType;
  winningCells: number[];
  disabled: boolean;
  hintCell?: number | null;
  invalidCell?: number | null;
  boardSize?: BoardSize;
  colorX?: string;
  colorO?: string;
  onCellClick: (index: number) => void;
}

export const Board: React.FC<BoardProps> = ({
  board,
  winningCells,
  disabled,
  hintCell,
  invalidCell,
  boardSize = 3,
  colorX,
  colorO,
  onCellClick,
}) => {
  const gridRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation across grid with Arrow Keys
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = index;
    if (e.key === 'ArrowUp') {
      nextIndex = index - boardSize;
    } else if (e.key === 'ArrowDown') {
      nextIndex = index + boardSize;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = index - 1;
    } else if (e.key === 'ArrowRight') {
      nextIndex = index + 1;
    } else {
      return;
    }

    if (nextIndex >= 0 && nextIndex < board.length) {
      e.preventDefault();
      const cells = gridRef.current?.querySelectorAll<HTMLButtonElement>('button[role="gridcell"]');
      cells?.[nextIndex]?.focus();
    }
  };

  return (
    <main
      className={styles.boardContainer}
      role="grid"
      aria-label="CHARIS Tic-Tac-Toe Game Board"
    >
      <div
        ref={gridRef}
        className={styles.grid}
        style={{
          gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
          gridTemplateRows: `repeat(${boardSize}, 1fr)`,
        }}
      >
        {board.map((value, index) => {
          const isWinningCell = winningCells.includes(index);
          const isHint = hintCell === index;
          const isInvalid = invalidCell === index;

          return (
            <div
              key={index}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={styles.cellWrapper}
            >
              <Cell
                index={index}
                value={value}
                isWinningCell={isWinningCell}
                isHintCell={isHint}
                isInvalidCell={isInvalid}
                disabled={disabled}
                boardSize={boardSize}
                colorX={colorX}
                colorO={colorO}
                onClick={onCellClick}
              />
            </div>
          );
        })}
      </div>
    </main>
  );
};
