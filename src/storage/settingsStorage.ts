import { UserSettings } from '../types/game';

export const STORAGE_KEY_SETTINGS = 'charis-tictactoe-settings';

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'classic',
  colorMode: 'light',
  soundEnabled: true,
  timerDuration: 0, // off by default
  reducedMotion: false,
  boardSize: 3,
  difficulty: 'hard',
  matchFormat: 'single',
  player1: {
    name: 'CHARIS',
    symbol: 'X',
    avatar: '👑',
    color: '#2563EB', // Primary Brand Blue
  },
  player2: {
    name: 'Player 2',
    symbol: 'O',
    avatar: '😎',
    color: '#0284C7', // Sky Blue
  },
};

export function loadSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        player1: { ...DEFAULT_SETTINGS.player1, ...(parsed.player1 || {}) },
        player2: { ...DEFAULT_SETTINGS.player2, ...(parsed.player2 || {}) },
      };
    }
  } catch (err) {
    console.warn('Failed to load user settings from localStorage:', err);
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.warn('Failed to save settings to localStorage:', err);
  }
}
