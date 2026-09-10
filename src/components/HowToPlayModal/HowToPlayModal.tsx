import React, { useEffect } from 'react';
import styles from './HowToPlayModal.module.css';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="howtoplay-title"
      >
        <div className={styles.header}>
          <h2 id="howtoplay-title" className={styles.title}>How to Play</h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close Rules"
          >
            &times;
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.ruleCard}>
            <span className={styles.icon}>🎯</span>
            <div>
              <h3 className={styles.ruleTitle}>The Objective</h3>
              <p className={styles.ruleText}>
                Be the first player to form an unbroken horizontal, vertical, or diagonal line of symbols.
              </p>
            </div>
          </div>

          <div className={styles.ruleCard}>
            <span className={styles.icon}>📏</span>
            <div>
              <h3 className={styles.ruleTitle}>Dynamic Board Sizes</h3>
              <p className={styles.ruleText}>
                <strong>3&times;3:</strong> Connect 3 symbols to win.<br />
                <strong>4&times;4:</strong> Connect 4 symbols to win.<br />
                <strong>5&times;5:</strong> Connect 5 symbols to win.
              </p>
            </div>
          </div>

          <div className={styles.ruleCard}>
            <span className={styles.icon}>🕹️</span>
            <div>
              <h3 className={styles.ruleTitle}>Game Modes &amp; Matches</h3>
              <p className={styles.ruleText}>
                Play local <strong>Player vs Player</strong> on the same device or face the unbeatable <strong>Minimax Computer</strong>. Challenge yourself with <strong>Best-of-3</strong> or <strong>Best-of-5</strong> matches!
              </p>
            </div>
          </div>

          <div className={styles.ruleCard}>
            <span className={styles.icon}>💡</span>
            <div>
              <h3 className={styles.ruleTitle}>Tools &amp; Features</h3>
              <p className={styles.ruleText}>
                <strong>Hint (💡):</strong> Highlights the optimal move recommended by the game engine.<br />
                <strong>Undo (↩️):</strong> Step backward to rethink your previous move.<br />
                <strong>Timer (⏱️):</strong> Optional countdown to test your speed!
              </p>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <button type="button" className={styles.gotItBtn} onClick={onClose}>
            Got It, Let's Play!
          </button>
        </div>
      </div>
    </div>
  );
};
