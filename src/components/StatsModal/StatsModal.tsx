import React, { useState, useEffect } from 'react';
import { LeaderboardEntry, OverallStats } from '../../types/game';
import {
  clearLeaderboard,
  clearOverallStats,
  loadLeaderboard,
  loadOverallStats,
} from '../../storage/statisticsStorage';
import { ConfirmationModal } from '../ConfirmationModal/ConfirmationModal';
import styles from './StatsModal.module.css';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose }) => {
  const [stats, setStats] = useState<OverallStats>(loadOverallStats);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStats(loadOverallStats());
      setLeaderboard(loadLeaderboard());
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !confirmClearOpen) onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, confirmClearOpen, onClose]);

  if (!isOpen) return null;

  const handleClear = () => {
    clearOverallStats();
    clearLeaderboard();
    setStats(loadOverallStats());
    setLeaderboard([]);
    setConfirmClearOpen(false);
  };

  const winPercentage =
    stats.totalGames > 0 ? Math.round((stats.wins / stats.totalGames) * 100) : 0;

  return (
    <>
      <div className={styles.overlay} onClick={onClose} role="presentation">
        <div
          className={styles.modal}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="stats-title"
        >
          <div className={styles.header}>
            <h2 id="stats-title" className={styles.title}>Statistics &amp; Leaderboard</h2>
            <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close Stats">
              &times;
            </button>
          </div>

          <div className={styles.content}>
            {/* Streak Cards */}
            <div className={styles.streakRow}>
              <div className={styles.streakCard}>
                <span className={styles.streakIcon}>🔥</span>
                <div>
                  <span className={styles.streakLabel}>Current Streak</span>
                  <span className={styles.streakVal}>{stats.currentStreak} Games</span>
                </div>
              </div>
              <div className={styles.streakCard}>
                <span className={styles.streakIcon}>⭐</span>
                <div>
                  <span className={styles.streakLabel}>Best Streak</span>
                  <span className={styles.streakVal}>{stats.bestStreak} Games</span>
                </div>
              </div>
            </div>

            {/* Overall Stat Numbers */}
            <div className={styles.statsGrid}>
              <div className={styles.statBox}>
                <span className={styles.boxLabel}>Played</span>
                <span className={styles.boxVal}>{stats.totalGames}</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.boxLabel}>Won</span>
                <span className={`${styles.boxVal} ${styles.winVal}`}>{stats.wins}</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.boxLabel}>Lost</span>
                <span className={`${styles.boxVal} ${styles.lossVal}`}>{stats.losses}</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.boxLabel}>Draws</span>
                <span className={styles.boxVal}>{stats.draws}</span>
              </div>
              <div className={`${styles.statBox} ${styles.wideBox}`}>
                <span className={styles.boxLabel}>Win Rate</span>
                <span className={`${styles.boxVal} ${styles.rateVal}`}>{winPercentage}%</span>
              </div>
            </div>

            {/* Local Leaderboard */}
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionHeading}>Device Leaderboard</h3>
            </div>

            {leaderboard.length === 0 ? (
              <p className={styles.noPlayers}>No players ranked yet. Play a match to climb the ranks!</p>
            ) : (
              <div className={styles.leaderboardList}>
                {leaderboard.map((player, idx) => (
                  <div key={player.name} className={styles.leaderRow}>
                    <div className={styles.rankCol}>
                      <span className={styles.rankNum}>
                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                      </span>
                      <span className={styles.pName}>{player.name}</span>
                    </div>
                    <div className={styles.scoreCol}>
                      <span className={styles.winsText}>
                        <strong>{player.wins}</strong> W ({player.winRate}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.footer}>
            <button
              type="button"
              className={styles.resetBtn}
              onClick={() => setConfirmClearOpen(true)}
            >
              Reset Statistics
            </button>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={confirmClearOpen}
        title="Reset All Statistics?"
        message="This will reset your winning streaks, overall match stats, and clear the device leaderboard."
        confirmLabel="Reset Stats"
        onConfirm={handleClear}
        onCancel={() => setConfirmClearOpen(false)}
      />
    </>
  );
};
