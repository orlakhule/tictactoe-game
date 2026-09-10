import React from 'react';
import { BoardSize, CellValue } from '../../types/game';
import styles from './Cell.module.css';

interface CellProps {
  index: number;
  value: CellValue;
  isWinningCell: boolean;
  isHintCell?: boolean;
  isInvalidCell?: boolean;
  disabled: boolean;
  boardSize?: BoardSize;
  colorX?: string;
  colorO?: string;
  onClick: (index: number) => void;
}

export const Cell: React.FC<CellProps> = ({
  index,
  value,
  isWinningCell,
  isHintCell = false,
  isInvalidCell = false,
  disabled,
  boardSize = 3,
  colorX,
  colorO,
  onClick,
}) => {
  const row = Math.floor(index / boardSize) + 1;
  const col = (index % boardSize) + 1;

  const getAriaLabel = () => {
    const statusDesc = value ? `Marked with ${value}` : 'Empty';
    const winDesc = isWinningCell ? ', Winning cell' : '';
    const hintDesc = isHintCell ? ', Suggested hint move' : '';
    return `Cell ${index + 1}, Row ${row}, Column ${col}, ${statusDesc}${winDesc}${hintDesc}`;
  };

  const renderSymbol = () => {
    if (value === 'X') {
      return (
        <svg
          className={`${styles.symbol} ${styles.symbolX}`}
          style={colorX ? { color: colorX } : undefined}
          viewBox="0 0 48 48"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 12L36 36M36 12L12 36"
            stroke="currentColor"
            strokeWidth="5.5"
            strokeLinecap="round"
          />
        </svg>
      );
    }
    if (value === 'O') {
      return (
        <svg
          className={`${styles.symbol} ${styles.symbolO}`}
          style={colorO ? { color: colorO } : undefined}
          viewBox="0 0 48 48"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="24"
            cy="24"
            r="14"
            stroke="currentColor"
            strokeWidth="5"
          />
        </svg>
      );
    }
    return null;
  };

  const classNames = [
    styles.cell,
    value ? styles.occupied : '',
    isWinningCell ? styles.winning : '',
    isHintCell ? styles.hint : '',
    isInvalidCell ? styles.invalid : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      role="gridcell"
      className={classNames}
      aria-label={getAriaLabel()}
      disabled={disabled || value !== null}
      onClick={() => onClick(index)}
    >
      {renderSymbol()}
      {isHintCell && !value && <span className={styles.hintDot} aria-hidden="true" />}
    </button>
  );
};
