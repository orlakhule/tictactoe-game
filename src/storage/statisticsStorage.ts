import { OverallStats, LeaderboardEntry } from '../types/game';

export const STORAGE_KEY_STATS = 'charis-tictactoe-stats';
export const STORAGE_KEY_LEADERBOARD = 'charis-tictactoe-leaderboard';

export const DEFAULT_STATS: OverallStats = {
  totalGames: 0,
  wins: 0,
  losses: 0,
  draws: 0,
  currentStreak: 0,
  bestStreak: 0,
};

export function loadOverallStats(): OverallStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STATS);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_STATS, ...parsed };
    }
  } catch (err) {
    console.warn('Failed to load stats from localStorage:', err);
  }
  return DEFAULT_STATS;
}

export function saveOverallStats(stats: OverallStats): void {
  try {
    localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
  } catch (err) {
    console.warn('Failed to save stats to localStorage:', err);
  }
}

export function recordGameStats(
  isWin: boolean,
  isLoss: boolean,
  isDraw: boolean
): OverallStats {
  const current = loadOverallStats();
  const totalGames = current.totalGames + 1;
  const wins = current.wins + (isWin ? 1 : 0);
  const losses = current.losses + (isLoss ? 1 : 0);
  const draws = current.draws + (isDraw ? 1 : 0);

  let currentStreak = current.currentStreak;
  if (isWin) {
    currentStreak += 1;
  } else if (isLoss) {
    currentStreak = 0;
  }
  // If draw, streak is maintained (neither increased nor reset)

  const bestStreak = Math.max(current.bestStreak, currentStreak);

  const updated: OverallStats = {
    totalGames,
    wins,
    losses,
    draws,
    currentStreak,
    bestStreak,
  };

  saveOverallStats(updated);
  return updated;
}

export function clearOverallStats(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_STATS);
  } catch (err) {
    console.warn('Failed to clear stats from localStorage:', err);
  }
}

export function loadLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LEADERBOARD);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to load leaderboard from localStorage:', err);
  }
  return [];
}

export function updateLeaderboard(
  winnerName: string | null,
  playerNames: [string, string],
  isDraw: boolean
): LeaderboardEntry[] {
  try {
    const board = loadLeaderboard();
    const map = new Map<string, LeaderboardEntry>();

    board.forEach((entry) => map.set(entry.name.trim().toLowerCase(), { ...entry }));

    for (const name of playerNames) {
      const trimmed = name.trim();
      if (!trimmed || trimmed.toLowerCase() === 'computer') continue;

      const key = trimmed.toLowerCase();
      const existing = map.get(key) || {
        name: trimmed,
        wins: 0,
        totalGames: 0,
        winRate: 0,
        bestStreak: 0,
      };

      existing.totalGames += 1;
      if (!isDraw && winnerName && winnerName.trim().toLowerCase() === key) {
        existing.wins += 1;
      }
      existing.winRate = Math.round((existing.wins / existing.totalGames) * 100);
      map.set(key, existing);
    }

    const sorted = Array.from(map.values()).sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      return b.winRate - a.winRate;
    });

    localStorage.setItem(STORAGE_KEY_LEADERBOARD, JSON.stringify(sorted));
    return sorted;
  } catch (err) {
    console.warn('Failed to update leaderboard in localStorage:', err);
    return [];
  }
}

export function clearLeaderboard(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_LEADERBOARD);
  } catch (err) {
    console.warn('Failed to clear leaderboard from localStorage:', err);
  }
}
