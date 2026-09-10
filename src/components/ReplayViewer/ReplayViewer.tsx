import React, { useState, useEffect, useRef } from 'react';
import { Board, BoardSize, GameRecord } from '../../types/game';
import styles from './ReplayViewer.module.css';

interface ReplayViewerProps {
  isOpen: boolean;
  gameRecord: GameRecord | null;
  onClose: () => void;
}

export const ReplayViewer: React.FC<ReplayViewerProps> = ({
  isOpen,
  gameRecord,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const playIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const moves = gameRecord?.moves ?? [];
  const size: BoardSize = gameRecord?.boardSize ?? 3;

  // Reconstruct board at current step
  const board: Board = Array(size * size).fill(null);
  for (let i = 0; i < currentStep && i < moves.length; i++) {
    board[moves[i].index] = moves[i].player;
  }

  // Auto-play interval
  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= moves.length) {
            setIsPlaying(false);
            if (playIntervalRef.current) clearInterval(playIntervalRef.current);
            return prev;
          }
          return prev + 1;
        });
      }, 750);
    } else if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
    }
    return () => {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    };
  }, [isPlaying, moves.length]);

  // Reset step on open
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setIsPlaying(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !gameRecord) return null;

  const currentMove = currentStep > 0 ? moves[currentStep - 1] : null;

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="replay-title"
      >
        <div className={styles.header}>
          <h2 id="replay-title" className={styles.title}>Game Replay</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close Replay">
            &times;
          </button>
        </div>

        {/* Step Indicator */}
        <div className={styles.stepInfo}>
          <span>
            {currentStep === 0
              ? 'Start of match'
              : `Move ${currentStep} of ${moves.length} (${currentMove?.player === 'X' ? gameRecord.playerX : gameRecord.playerO} - ${currentMove?.player})`}
          </span>
        </div>

        {/* Mini Replay Board */}
        <div
          className={styles.board}
          style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
        >
          {board.map((val, idx) => {
            const isLastMoved = currentMove?.index === idx;
            return (
              <div
                key={idx}
                className={`${styles.cell} ${val ? styles.occupied : ''} ${isLastMoved ? styles.lastMoved : ''}`}
              >
                {val === 'X' && <span className={styles.symbolX}>X</span>}
                {val === 'O' && <span className={styles.symbolO}>O</span>}
              </div>
            );
          })}
        </div>

        {/* Controls */}
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.controlBtn}
            onClick={() => {
              setIsPlaying(false);
              setCurrentStep(0);
            }}
            disabled={currentStep === 0}
            aria-label="Restart Replay"
          >
            ⏮️
          </button>

          <button
            type="button"
            className={styles.controlBtn}
            onClick={() => {
              setIsPlaying(false);
              setCurrentStep((p) => Math.max(0, p - 1));
            }}
            disabled={currentStep === 0}
            aria-label="Previous Move"
          >
            ◀️
          </button>

          <button
            type="button"
            className={`${styles.controlBtn} ${styles.playBtn}`}
            onClick={() => {
              if (currentStep >= moves.length) setCurrentStep(0);
              setIsPlaying(!isPlaying);
            }}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>

          <button
            type="button"
            className={styles.controlBtn}
            onClick={() => {
              setIsPlaying(false);
              setCurrentStep((p) => Math.min(moves.length, p + 1));
            }}
            disabled={currentStep >= moves.length}
            aria-label="Next Move"
          >
            ▶️
          </button>

          <button
            type="button"
            className={styles.controlBtn}
            onClick={() => {
              setIsPlaying(false);
              setCurrentStep(moves.length);
            }}
            disabled={currentStep >= moves.length}
            aria-label="End of Game"
          >
            ⏭️
          </button>
        </div>
      </div>
    </div>
  );
};
