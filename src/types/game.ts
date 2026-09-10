export type Player = 'X' | 'O';

export type CellValue = Player | null;

export type Board = CellValue[];

export type GameMode = 'pvp' | 'computer';

export type GameStatus = 'playing' | 'won' | 'draw';

export type BoardSize = 3 | 4 | 5;

export type Difficulty = 'easy' | 'medium' | 'hard';

export type MatchFormat = 'single' | 'bo3' | 'bo5';

export type Theme = 'classic' | 'neon' | 'minimal' | 'cyberpunk';

export type ColorMode = 'light' | 'dark';

export interface PlayerProfile {
  name: string;
  symbol: Player;
  avatar: string;
  color: string;
}

export interface MoveRecord {
  index: number;
  player: Player;
  timestamp: number;
}

export interface GameRecord {
  id: string;
  playerX: string;
  playerO: string;
  winner: Player | 'draw';
  winningSymbol?: Player;
  moveCount: number;
  duration: number; // in seconds
  gameMode: GameMode;
  difficulty?: Difficulty;
  boardSize: BoardSize;
  date: string;
  moves: MoveRecord[];
  scoreX: number;
  scoreO: number;
}

export interface OverallStats {
  totalGames: number;
  wins: number; // player wins
  losses: number;
  draws: number;
  currentStreak: number;
  bestStreak: number;
}

export interface LeaderboardEntry {
  name: string;
  wins: number;
  totalGames: number;
  winRate: number;
  bestStreak: number;
}

export interface UserSettings {
  theme: Theme;
  colorMode: ColorMode;
  soundEnabled: boolean;
  timerDuration: number; // 0 = off, 10, 15, 30, 60
  reducedMotion: boolean;
  boardSize: BoardSize;
  difficulty: Difficulty;
  matchFormat: MatchFormat;
  player1: PlayerProfile;
  player2: PlayerProfile;
}

export interface MatchState {
  format: MatchFormat;
  winsX: number;
  winsO: number;
  targetWins: number;
  isMatchOver: boolean;
  matchWinner: Player | null;
  gameNumber: number;
}

export interface GameState {
  board: Board;
  currentPlayer: Player;
  winner: Player | null;
  winningCells: number[];
  status: GameStatus;
  mode: GameMode;
  isThinking: boolean;
}

export interface Score {
  X: number;
  O: number;
  draws: number;
}
