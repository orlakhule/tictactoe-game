import React from 'react';
import { GameMode } from '../../types/game';
import styles from './GameModeSelector.module.css';

interface GameModeSelectorProps {
  currentMode: GameMode;
  onModeChange: (mode: GameMode) => void;
  disabled?: boolean;
}

export const GameModeSelector: React.FC<GameModeSelectorProps> = ({
  currentMode,
  onModeChange,
  disabled = false,
}) => {
  return (
    <div
      className={styles.modeContainer}
      role="radiogroup"
      aria-label="Game Mode Selection"
    >
      <button
        type="button"
        role="radio"
        aria-checked={currentMode === 'pvp'}
        className={`${styles.modeButton} ${currentMode === 'pvp' ? styles.active : ''}`}
        onClick={() => onModeChange('pvp')}
        disabled={disabled}
      >
        <svg
          className={styles.icon}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        <span>Player vs Player</span>
      </button>

      <button
        type="button"
        role="radio"
        aria-checked={currentMode === 'computer'}
        className={`${styles.modeButton} ${currentMode === 'computer' ? styles.active : ''}`}
        onClick={() => onModeChange('computer')}
        disabled={disabled}
      >
        <svg
          className={styles.icon}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="11" width="18" height="10" rx="2" />
          <circle cx="12" cy="5" r="2" />
          <path d="M12 7v4" />
          <line x1="8" y1="16" x2="8" y2="16.01" strokeWidth="3" />
          <line x1="16" y1="16" x2="16" y2="16.01" strokeWidth="3" />
        </svg>
        <span>Player vs Computer</span>
      </button>
    </div>
  );
};

