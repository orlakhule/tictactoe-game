import React from 'react';
import { GameMode, GameStatus as GameStatusType, Player, PlayerProfile } from '../../types/game';
import styles from './GameStatus.module.css';

interface GameStatusProps {
  status: GameStatusType;
  currentPlayer: Player;
  winner: Player | null;
  mode: GameMode;
  isThinking: boolean;
  timeRemaining?: number;
  timerDuration?: number;
  player1?: PlayerProfile;
  player2?: PlayerProfile;
}

export const GameStatus: React.FC<GameStatusProps> = ({
  status,
  currentPlayer,
  winner,
  mode,
  isThinking,
  timeRemaining,
  timerDuration = 0,
  player1,
  player2,
}) => {
  let message = '';
  let statusClass = styles.turnStatus;
  let icon: React.ReactNode = null;

  const nameX = player1?.symbol === 'X' ? player1.name : player2?.name || 'Player X';
  const nameO =
    player1?.symbol === 'O'
      ? player1.name
      : mode === 'computer'
      ? 'Computer'
      : player2?.name || 'Player O';

  if (status === 'won') {
    statusClass = styles.winStatus;
    if (winner === 'X') {
      message = `${nameX} Wins!`;
    } else {
      message = mode === 'computer' ? 'Computer Wins!' : `${nameO} Wins!`;
    }
    icon = (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
      </svg>
    );
  } else if (status === 'draw') {
    statusClass = styles.drawStatus;
    message = "It's a Draw!";
    icon = (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    );
  } else if (isThinking) {
    statusClass = styles.thinkingStatus;
    message = 'Computer is thinking...';
    icon = (
      <span className={styles.dots} aria-hidden="true">
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
      </span>
    );
  } else {
    // Current turn
    const activeName = currentPlayer === 'X' ? nameX : nameO;
    message = `${activeName}'s Turn (${currentPlayer})`;
    icon = (
      <span
        className={`${styles.playerDot} ${currentPlayer === 'X' ? styles.dotX : styles.dotO}`}
      />
    );
  }

  const showTimer = timerDuration > 0 && status === 'playing' && !isThinking && timeRemaining !== undefined;

  return (
    <div className={styles.statusWrapper}>
      <div
        className={`${styles.statusContainer} ${statusClass}`}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <span className={styles.iconWrapper}>{icon}</span>
        <span className={styles.statusText}>{message}</span>
      </div>

      {showTimer && (
        <div
          className={`${styles.timerBadge} ${timeRemaining <= 3 ? styles.timerWarning : ''}`}
          aria-label={`Time remaining: ${timeRemaining} seconds`}
        >
          ⏱️ 00:{timeRemaining.toString().padStart(2, '0')}
        </div>
      )}
    </div>
  );
};
