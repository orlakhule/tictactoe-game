import React from 'react';
import { GameMode, MatchState, Player, PlayerProfile, Score } from '../../types/game';
import styles from './Scoreboard.module.css';

interface ScoreboardProps {
  score: Score;
  currentPlayer: Player;
  mode: GameMode;
  status: string;
  player1?: PlayerProfile;
  player2?: PlayerProfile;
  matchState?: MatchState;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({
  score,
  currentPlayer,
  mode,
  status,
  player1,
  player2,
  matchState,
}) => {
  const isPlayerXTurn = status === 'playing' && currentPlayer === 'X';
  const isPlayerOTurn = status === 'playing' && currentPlayer === 'O';

  const nameX = player1?.symbol === 'X' ? player1.name : player2?.name || 'Player X';
  const avatarX = player1?.symbol === 'X' ? player1.avatar : player2?.avatar || '👑';

  const nameO = player1?.symbol === 'O' ? player1.name : mode === 'computer' ? 'Computer' : player2?.name || 'Player O';
  const avatarO = player1?.symbol === 'O' ? player1.avatar : mode === 'computer' ? '🤖' : player2?.avatar || '😎';

  return (
    <section className={styles.scoreboardWrapper} aria-label="Game Scoreboard">
      {matchState && matchState.format !== 'single' && (
        <div className={styles.matchProgress}>
          <span>
            {matchState.format.toUpperCase()} • Game {matchState.gameNumber} (First to {matchState.targetWins})
          </span>
        </div>
      )}

      <div className={styles.scoreboard}>
        {/* Player X Card */}
        <div
          className={`${styles.card} ${styles.playerX} ${isPlayerXTurn ? styles.activeCard : ''}`}
        >
          <div className={styles.playerInfo}>
            <span className={styles.avatar}>{avatarX}</span>
            <span className={styles.playerLabel}>{nameX} (X)</span>
          </div>
          <span className={styles.scoreValue}>
            {matchState && matchState.format !== 'single' ? matchState.winsX : score.X}
          </span>
          {isPlayerXTurn && <span className={styles.turnIndicator}>Turn</span>}
        </div>

        {/* Draws Card */}
        <div className={`${styles.card} ${styles.drawCard}`}>
          <div className={styles.playerInfo}>
            <span className={styles.avatar}>🤝</span>
            <span className={styles.playerLabel}>Draws</span>
          </div>
          <span className={styles.scoreValue}>{score.draws}</span>
        </div>

        {/* Player O / Computer Card */}
        <div
          className={`${styles.card} ${styles.playerO} ${isPlayerOTurn ? styles.activeCard : ''}`}
        >
          <div className={styles.playerInfo}>
            <span className={styles.avatar}>{avatarO}</span>
            <span className={styles.playerLabel}>{nameO} (O)</span>
          </div>
          <span className={styles.scoreValue}>
            {matchState && matchState.format !== 'single' ? matchState.winsO : score.O}
          </span>
          {isPlayerOTurn && <span className={styles.turnIndicator}>Turn</span>}
        </div>
      </div>
    </section>
  );
};
