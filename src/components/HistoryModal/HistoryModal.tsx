import React, { useState, useEffect } from 'react';
import { GameRecord } from '../../types/game';
import { clearGameHistory, loadGameHistory } from '../../storage/gameStorage';
import { ConfirmationModal } from '../ConfirmationModal/ConfirmationModal';
import styles from './HistoryModal.module.css';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose }) => {
  const [history, setHistory] = useState<GameRecord[]>([]);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setHistory(loadGameHistory());
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
    clearGameHistory();
    setHistory([]);
    setConfirmClearOpen(false);
  };

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <div className={styles.overlay} onClick={onClose} role="presentation">
        <div
          className={styles.modal}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="history-title"
        >
          <div className={styles.header}>
            <h2 id="history-title" className={styles.title}>Match History</h2>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Close History"
            >
              &times;
            </button>
          </div>

          <div className={styles.content}>
            {history.length === 0 ? (
              <div className={styles.emptyState}>
                <span className={styles.emptyIcon}>📜</span>
                <p className={styles.emptyText}>No matches recorded yet.</p>
                <p className={styles.emptySubtext}>Play a game to begin building your legacy!</p>
              </div>
            ) : (
              <div className={styles.recordsList}>
                {history.map((record) => {
                  const isDraw = record.winner === 'draw';
                  const winnerName = isDraw
                    ? 'Draw'
                    : record.winner === 'X'
                    ? record.playerX
                    : record.playerO;

                  return (
                    <div key={record.id} className={styles.card}>
                      <div className={styles.cardHeader}>
                        <span className={styles.matchup}>
                          {record.playerX} vs {record.playerO}
                        </span>
                        <span className={styles.date}>{record.date}</span>
                      </div>

                      <div className={styles.cardBody}>
                        <div className={styles.winnerBadge}>
                          {isDraw ? '🤝 Draw' : `🏆 Winner: ${winnerName}`}
                        </div>
                        <div className={styles.metaRow}>
                          <span>Moves: <strong>{record.moveCount}</strong></span>
                          <span>Duration: <strong>{formatDuration(record.duration)}</strong></span>
                          <span>Board: <strong>{record.boardSize}&times;{record.boardSize}</strong></span>
                          <span>Mode: <strong>{record.gameMode === 'computer' ? 'AI' : 'Local'}</strong></span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {history.length > 0 && (
            <div className={styles.footer}>
              <button
                type="button"
                className={styles.clearBtn}
                onClick={() => setConfirmClearOpen(true)}
              >
                Clear History
              </button>
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={confirmClearOpen}
        title="Delete Game History?"
        message="This will permanently remove all saved match history from this browser."
        confirmLabel="Delete History"
        onConfirm={handleClear}
        onCancel={() => setConfirmClearOpen(false)}
      />
    </>
  );
};
