import React, { useState, useEffect } from 'react';
import { GameRecord, MatchState } from '../../types/game';
import styles from './MatchSummaryModal.module.css';

interface MatchSummaryModalProps {
  isOpen: boolean;
  gameRecord: GameRecord | null;
  matchState: MatchState;
  onRematch: () => void;
  onNewGame: () => void;
  onReplay: () => void;
  onClose: () => void;
}

export const MatchSummaryModal: React.FC<MatchSummaryModalProps> = ({
  isOpen,
  gameRecord,
  matchState,
  onRematch,
  onNewGame,
  onReplay,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !gameRecord) return null;

  const isDraw = gameRecord.winner === 'draw';
  const winnerName = isDraw
    ? "It's a Draw!"
    : gameRecord.winner === 'X'
    ? `${gameRecord.playerX} Wins!`
    : `${gameRecord.playerO} Wins!`;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleShare = async () => {
    const text = `🎮 CHARIS Tic-Tac-Toe\n\n${winnerName}\nResult: ${gameRecord.scoreX} – ${gameRecord.scoreO}\nMoves: ${gameRecord.moveCount}\nDuration: ${formatDuration(gameRecord.duration)}\nBoard: ${gameRecord.boardSize}x${gameRecord.boardSize}\n\nCan you beat my score?`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'CHARIS Tic-Tac-Toe Result',
          text,
        });
        return;
      } catch (err) {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.warn('Clipboard write failed:', err);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="summary-title"
      >
        <div className={styles.celebrationHeader}>
          <span className={styles.trophy}>{isDraw ? '🤝' : '🏆'}</span>
          <h2 id="summary-title" className={styles.winnerHeading}>
            {matchState.isMatchOver
              ? `👑 Match Champion: ${matchState.matchWinner === 'X' ? gameRecord.playerX : gameRecord.playerO}!`
              : winnerName}
          </h2>
          {matchState.format !== 'single' && (
            <p className={styles.formatSubtitle}>
              {matchState.isMatchOver
                ? `Final Series Score`
                : `Match in Progress (${matchState.format.toUpperCase()} • First to ${matchState.targetWins})`}
            </p>
          )}
        </div>

        {/* Score Banner */}
        <div className={styles.scoreBanner}>
          <div className={styles.playerColumn}>
            <span className={styles.playerName}>{gameRecord.playerX} (X)</span>
            <span className={styles.scoreNumber}>{gameRecord.scoreX}</span>
          </div>
          <span className={styles.scoreDivider}>—</span>
          <div className={styles.playerColumn}>
            <span className={styles.playerName}>{gameRecord.playerO} (O)</span>
            <span className={styles.scoreNumber}>{gameRecord.scoreO}</span>
          </div>
        </div>

        {/* Game Stats Details */}
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Moves</span>
            <span className={styles.statValue}>{gameRecord.moveCount}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Duration</span>
            <span className={styles.statValue}>{formatDuration(gameRecord.duration)}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Board</span>
            <span className={styles.statValue}>{gameRecord.boardSize}&times;{gameRecord.boardSize}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Mode</span>
            <span className={styles.statValue}>
              {gameRecord.gameMode === 'computer'
                ? `AI (${gameRecord.difficulty})`
                : 'Local 2P'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          <button type="button" className={styles.primaryBtn} onClick={onRematch}>
            🔄 {matchState.isMatchOver ? 'Play Again' : 'Next Game'}
          </button>
          <button type="button" className={styles.secondaryBtn} onClick={onReplay}>
            ▶️ Replay Game
          </button>
          <button type="button" className={styles.secondaryBtn} onClick={handleShare}>
            {copied ? '✅ Copied!' : '📤 Share Result'}
          </button>
          <button type="button" className={styles.outlineBtn} onClick={onNewGame}>
            🏠 Main Menu
          </button>
        </div>
      </div>
    </div>
  );
};
