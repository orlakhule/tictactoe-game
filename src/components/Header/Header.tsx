import React from "react";
import styles from "./Header.module.css";

interface HeaderProps {
  onOpenSettings?: () => void;
  onReturnToStart?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSettings,
  onReturnToStart,
}) => {
  return (
    <header className={styles.header}>
      {onReturnToStart && (
        <button
          type="button"
          className={styles.backButton}
          onClick={onReturnToStart}
          aria-label="Return to start screen"
          title="Back to start"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
      )}

      <div className={styles.brandContainer}>
        <div className={styles.logoBadge} aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="28" height="28" rx="8" fill="white" />
            <path
              d="M19 9.5C18.2 8.5 16.9 8 15.3 8C12.3 8 10 10.3 10 14C10 17.7 12.3 20 15.3 20C16.9 20 18.2 19.5 19 18.5"
              stroke="#2563EB"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h1 className={styles.brandTitle}>CHARIS</h1>
      </div>
      <p className={styles.subtitle}>TIC-TAC-TOE</p>

      <div className={styles.headerActions}>
        {onOpenSettings && (
          <button
            type="button"
            className={styles.iconButton}
            onClick={onOpenSettings}
            aria-label="Open settings"
            title="Settings"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        )}
      </div>
    </header>
  );
};
