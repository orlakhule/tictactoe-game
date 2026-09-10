import React, { useState } from 'react';
import { BoardSize, Difficulty, GameMode, MatchFormat, Player, UserSettings } from '../../types/game';
import styles from './StartScreen.module.css';

interface StartScreenProps {
  settings: UserSettings;
  onStartGame: (config: Partial<UserSettings> & { mode: GameMode }) => void;
  onOpenHowToPlay: () => void;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  onOpenStats: () => void;
}

const AVATARS = ['👑', '⚡', '😎', '😀', '🔥', '🎮', '⭐'];

export const StartScreen: React.FC<StartScreenProps> = ({
  settings,
  onStartGame,
  onOpenHowToPlay,
  onOpenSettings,
  onOpenHistory,
  onOpenStats,
}) => {
  const [mode, setMode] = useState<GameMode>('pvp');
  const [player1Name, setPlayer1Name] = useState(settings.player1.name);
  const [player2Name, setPlayer2Name] = useState(settings.player2.name);
  const [player1Avatar, setPlayer1Avatar] = useState(settings.player1.avatar);
  const [player2Avatar, setPlayer2Avatar] = useState(settings.player2.avatar);
  const [humanSymbol, setHumanSymbol] = useState<Player>(settings.player1.symbol);
  const [boardSize, setBoardSize] = useState<BoardSize>(settings.boardSize);
  const [difficulty, setDifficulty] = useState<Difficulty>(settings.difficulty);
  const [matchFormat, setMatchFormat] = useState<MatchFormat>(settings.matchFormat);

  const handleLaunch = () => {
    const p1Symbol = humanSymbol;
    const p2Symbol = humanSymbol === 'X' ? 'O' : 'X';

    onStartGame({
      mode,
      boardSize,
      difficulty,
      matchFormat,
      player1: {
        ...settings.player1,
        name: player1Name.trim() || 'Player 1',
        avatar: player1Avatar,
        symbol: p1Symbol,
      },
      player2: {
        ...settings.player2,
        name: mode === 'computer' ? 'Computer' : player2Name.trim() || 'Player 2',
        avatar: mode === 'computer' ? '🤖' : player2Avatar,
        symbol: p2Symbol,
      },
    });
  };

  return (
    <div className={styles.startScreen}>
      {/* Brand Header */}
      <header className={styles.header}>
        <div className={styles.logoBadge} aria-hidden="true">
          <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
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
        <p className={styles.brandSubtitle}>TIC-TAC-TOE</p>
        <p className={styles.welcomeText}>
          Challenge your intellect in a sleek, modern board duel.
        </p>
      </header>

      {/* Mode Selection */}
      <div className={styles.formSection}>
        <label className={styles.sectionLabel}>Select Game Mode</label>
        <div className={styles.modeToggle} role="radiogroup" aria-label="Game Mode">
          <button
            type="button"
            className={`${styles.modeBtn} ${mode === 'pvp' ? styles.activeMode : ''}`}
            onClick={() => setMode('pvp')}
          >
            👥 Local 2-Player
          </button>
          <button
            type="button"
            className={`${styles.modeBtn} ${mode === 'computer' ? styles.activeMode : ''}`}
            onClick={() => setMode('computer')}
          >
            🤖 vs Computer
          </button>
        </div>
      </div>

      {/* Players Setup */}
      <div className={styles.playersSetup}>
        {/* Player 1 Card */}
        <div className={styles.playerCard}>
          <div className={styles.playerCardHeader}>
            <span className={styles.playerSymbolBadge}>{humanSymbol}</span>
            <span className={styles.cardTitle}>Player 1</span>
          </div>

          <input
            type="text"
            className={styles.nameInput}
            value={player1Name}
            onChange={(e) => setPlayer1Name(e.target.value)}
            placeholder="Your name"
            maxLength={14}
            aria-label="Player 1 Name"
          />

          <div className={styles.avatarRow} aria-label="Choose Player 1 Avatar">
            {AVATARS.map((av) => (
              <button
                key={av}
                type="button"
                className={`${styles.avatarBtn} ${player1Avatar === av ? styles.selectedAvatar : ''}`}
                onClick={() => setPlayer1Avatar(av)}
                aria-label={`Avatar ${av}`}
              >
                {av}
              </button>
            ))}
          </div>

          {/* Symbol Choice */}
          <div className={styles.symbolChoice}>
            <span className={styles.symbolLabel}>Play as:</span>
            <button
              type="button"
              className={`${styles.symbolBtn} ${humanSymbol === 'X' ? styles.symbolActive : ''}`}
              onClick={() => setHumanSymbol('X')}
            >
              X
            </button>
            <button
              type="button"
              className={`${styles.symbolBtn} ${humanSymbol === 'O' ? styles.symbolActive : ''}`}
              onClick={() => setHumanSymbol('O')}
            >
              O
            </button>
          </div>
        </div>

        {/* Player 2 Card (or Computer) */}
        {mode === 'pvp' ? (
          <div className={styles.playerCard}>
            <div className={styles.playerCardHeader}>
              <span className={styles.playerSymbolBadge}>
                {humanSymbol === 'X' ? 'O' : 'X'}
              </span>
              <span className={styles.cardTitle}>Player 2</span>
            </div>

            <input
              type="text"
              className={styles.nameInput}
              value={player2Name}
              onChange={(e) => setPlayer2Name(e.target.value)}
              placeholder="Friend's name"
              maxLength={14}
              aria-label="Player 2 Name"
            />

            <div className={styles.avatarRow} aria-label="Choose Player 2 Avatar">
              {AVATARS.map((av) => (
                <button
                  key={av}
                  type="button"
                  className={`${styles.avatarBtn} ${player2Avatar === av ? styles.selectedAvatar : ''}`}
                  onClick={() => setPlayer2Avatar(av)}
                  aria-label={`Avatar ${av}`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className={`${styles.playerCard} ${styles.aiCard}`}>
            <div className={styles.playerCardHeader}>
              <span className={styles.playerSymbolBadge}>
                {humanSymbol === 'X' ? 'O' : 'X'}
              </span>
              <span className={styles.cardTitle}>Computer (AI)</span>
            </div>
            <div className={styles.aiBadge}>🤖 Unbeatable Minimax AI</div>

            <label className={styles.subLabel}>AI Difficulty</label>
            <div className={styles.difficultyGroup}>
              {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                <button
                  key={d}
                  type="button"
                  className={`${styles.diffBtn} ${difficulty === d ? styles.diffActive : ''}`}
                  onClick={() => setDifficulty(d)}
                >
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Match Format & Board Size */}
      <div className={styles.optionsRow}>
        <div className={styles.optionBox}>
          <label className={styles.sectionLabel}>Board Size</label>
          <div className={styles.pillGroup}>
            {([3, 4, 5] as BoardSize[]).map((s) => (
              <button
                key={s}
                type="button"
                className={`${styles.pillBtn} ${boardSize === s ? styles.pillActive : ''}`}
                onClick={() => setBoardSize(s)}
              >
                {s}&times;{s}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.optionBox}>
          <label className={styles.sectionLabel}>Match Format</label>
          <div className={styles.pillGroup}>
            {(['single', 'bo3', 'bo5'] as MatchFormat[]).map((f) => (
              <button
                key={f}
                type="button"
                className={`${styles.pillBtn} ${matchFormat === f ? styles.pillActive : ''}`}
                onClick={() => setMatchFormat(f)}
              >
                {f === 'single' ? 'Single' : f === 'bo3' ? 'BO3' : 'BO5'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Start Button */}
      <button
        type="button"
        className={styles.startButton}
        onClick={handleLaunch}
      >
        <span>Start Game</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      </button>

      {/* Secondary Actions: Rules, Settings, Stats, History */}
      <div className={styles.bottomNav}>
        <button type="button" className={styles.navBtn} onClick={onOpenHowToPlay}>
          📖 How to Play
        </button>
        <button type="button" className={styles.navBtn} onClick={onOpenStats}>
          📊 Stats &amp; Streaks
        </button>
        <button type="button" className={styles.navBtn} onClick={onOpenHistory}>
          📜 History
        </button>
        <button type="button" className={styles.navBtn} onClick={onOpenSettings}>
          ⚙️ Settings
        </button>
      </div>
    </div>
  );
};
