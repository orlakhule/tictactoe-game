import React from "react";
import styles from "./GameControls.module.css";

interface GameControlsProps {
  onNewRound: () => void;
  onResetMatch: () => void;
  onUndo: () => void;
  onHint: () => void;
  disabled?: boolean;
  canUndo?: boolean;
  isHintAvailable?: boolean;
}

export const GameControls: React.FC<GameControlsProps> = ({
  onNewRound,
  onResetMatch,
  onUndo,
  onHint,
  disabled = false,
  canUndo = false,
  isHintAvailable = false,
}) => {
  return (
    <div className={styles.controlsContainer}>
      {/* Undo */}
      <button
        type="button"
        className={styles.undoButton}
        onClick={onUndo}
        disabled={disabled || !canUndo}
        aria-label="Undo last move"
        title="Undo"
      >
        <svg
          className={styles.buttonIcon}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M9 14 4 9l5-5" />
          <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
        </svg>
        <span>Undo</span>
      </button>

      {/* New Round (primary) */}
      <button
        type="button"
        className={styles.newRoundButton}
        onClick={onNewRound}
        disabled={disabled}
        aria-label="Start a new round"
      >
        <svg
          className={styles.buttonIcon}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
          <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
          <path d="M16 21h5v-5" />
        </svg>
        <span>New Round</span>
      </button>

      {/* Hint */}
      <button
        type="button"
        className={styles.hintButton}
        onClick={onHint}
        disabled={disabled || !isHintAvailable}
        aria-label="Get a hint for the best move"
        title="Hint"
      >
        <span aria-hidden="true">💡</span>
        <span>Hint</span>
      </button>

      {/* Reset Match */}
      <button
        type="button"
        className={styles.resetMatchButton}
        onClick={onResetMatch}
        disabled={disabled}
        aria-label="Reset match and clear all scores"
      >
        <svg
          className={styles.buttonIcon}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
        <span>Reset</span>
      </button>
    </div>
  );
};
