import { GameRecord } from '../types/game';

export const STORAGE_KEY_HISTORY = 'charis-tictactoe-history';

export function loadGameHistory(): GameRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to load game history from localStorage:', err);
  }
  return [];
}

export function saveGameRecord(record: GameRecord): void {
  try {
    const history = loadGameHistory();
    // Prepend new record, keeping up to 50 most recent records
    const updated = [record, ...history.filter((r) => r.id !== record.id)].slice(0, 50);
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to save game record to localStorage:', err);
  }
}

export function clearGameHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_HISTORY);
  } catch (err) {
    console.warn('Failed to clear game history from localStorage:', err);
  }
}
