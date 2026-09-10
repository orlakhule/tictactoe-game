import React, { useEffect } from 'react';
import { BoardSize, Difficulty, MatchFormat, Theme, UserSettings } from '../../types/game';
import styles from './SettingsModal.module.css';

interface SettingsModalProps {
  isOpen: boolean;
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  onUpdateSettings,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const update = (partial: Partial<UserSettings>) => {
    onUpdateSettings({ ...settings, ...partial });
  };

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
      >
        <div className={styles.header}>
          <h2 id="settings-title" className={styles.title}>Game Settings</h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close Settings"
          >
            &times;
          </button>
        </div>

        <div className={styles.content}>
          {/* Appearance Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Appearance</h3>
            
            {/* Color Mode (Light / Dark) */}
            <div className={styles.row}>
              <span className={styles.label}>Mode</span>
              <div className={styles.pillGroup}>
                <button
                  type="button"
                  className={`${styles.pillBtn} ${settings.colorMode === 'light' ? styles.active : ''}`}
                  onClick={() => update({ colorMode: 'light' })}
                >
                  ☀️ Light
                </button>
                <button
                  type="button"
                  className={`${styles.pillBtn} ${settings.colorMode === 'dark' ? styles.active : ''}`}
                  onClick={() => update({ colorMode: 'dark' })}
                >
                  🌙 Dark
                </button>
              </div>
            </div>

            {/* Themes */}
            <div className={styles.row}>
              <span className={styles.label}>Theme</span>
              <div className={styles.pillGroup}>
                {(['classic', 'neon', 'minimal', 'cyberpunk'] as Theme[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`${styles.pillBtn} ${settings.theme === t ? styles.active : ''}`}
                    onClick={() => update({ theme: t })}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sound Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Audio</h3>
            <div className={styles.row}>
              <span className={styles.label}>Sound Effects</span>
              <button
                type="button"
                className={`${styles.toggleBtn} ${settings.soundEnabled ? styles.toggleOn : ''}`}
                onClick={() => update({ soundEnabled: !settings.soundEnabled })}
                aria-pressed={settings.soundEnabled}
              >
                <span className={styles.toggleThumb} />
              </button>
            </div>
          </div>

          {/* Gameplay Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Gameplay</h3>

            {/* Board Size */}
            <div className={styles.row}>
              <span className={styles.label}>Board Size</span>
              <div className={styles.pillGroup}>
                {([3, 4, 5] as BoardSize[]).map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`${styles.pillBtn} ${settings.boardSize === size ? styles.active : ''}`}
                    onClick={() => update({ boardSize: size })}
                  >
                    {size}&times;{size}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div className={styles.row}>
              <span className={styles.label}>AI Difficulty</span>
              <div className={styles.pillGroup}>
                {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                  <button
                    key={d}
                    type="button"
                    className={`${styles.pillBtn} ${settings.difficulty === d ? styles.active : ''}`}
                    onClick={() => update({ difficulty: d })}
                  >
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Match Format */}
            <div className={styles.row}>
              <span className={styles.label}>Match Format</span>
              <div className={styles.pillGroup}>
                {(['single', 'bo3', 'bo5'] as MatchFormat[]).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    className={`${styles.pillBtn} ${settings.matchFormat === fmt ? styles.active : ''}`}
                    onClick={() => update({ matchFormat: fmt })}
                  >
                    {fmt === 'single' ? 'Single' : fmt === 'bo3' ? 'Best of 3' : 'Best of 5'}
                  </button>
                ))}
              </div>
            </div>

            {/* Move Timer */}
            <div className={styles.row}>
              <span className={styles.label}>Move Timer</span>
              <div className={styles.pillGroup}>
                {[0, 10, 15, 30, 60].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    className={`${styles.pillBtn} ${settings.timerDuration === sec ? styles.active : ''}`}
                    onClick={() => update({ timerDuration: sec })}
                  >
                    {sec === 0 ? 'Off' : `${sec}s`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Accessibility Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Accessibility</h3>
            <div className={styles.row}>
              <span className={styles.label}>Reduced Motion</span>
              <button
                type="button"
                className={`${styles.toggleBtn} ${settings.reducedMotion ? styles.toggleOn : ''}`}
                onClick={() => update({ reducedMotion: !settings.reducedMotion })}
                aria-pressed={settings.reducedMotion}
              >
                <span className={styles.toggleThumb} />
              </button>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <button type="button" className={styles.doneBtn} onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
