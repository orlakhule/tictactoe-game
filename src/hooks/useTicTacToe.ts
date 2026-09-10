import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Board,
  GameMode,
  GameRecord,
  GameStatus,
  MatchFormat,
  MatchState,
  MoveRecord,
  Player,
  Score,
  UserSettings,
} from '../types/game';
import { DEFAULT_SCORE, STORAGE_KEY_SCORE } from '../game/constants';
import { checkWinner, getWinningCells, isBoardFull, isValidMove, makeMove } from '../game/gameLogic';
import { getComputerMove, getHintMove } from '../game/computerPlayer';
import { loadSettings, saveSettings } from '../storage/settingsStorage';
import { recordGameStats, updateLeaderboard } from '../storage/statisticsStorage';
import { saveGameRecord } from '../storage/gameStorage';
import {
  playClickSound,
  playDrawSound,
  playInvalidSound,
  playMoveSound,
  playWinSound,
} from '../utils/soundEffects';

function loadStoredScore(): Score {
  try {
    const item = localStorage.getItem(STORAGE_KEY_SCORE);
    if (item) {
      const parsed = JSON.parse(item);
      if (
        typeof parsed.X === 'number' &&
        typeof parsed.O === 'number' &&
        typeof parsed.draws === 'number'
      ) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to load score from localStorage:', err);
  }
  return DEFAULT_SCORE;
}

function getTargetWins(format: MatchFormat): number {
  if (format === 'bo3') return 2;
  if (format === 'bo5') return 3;
  return 1;
}

export function useTicTacToe() {
  const [settings, setSettings] = useState<UserSettings>(loadSettings);
  const [screen, setScreen] = useState<'start' | 'game'>('start');

  // Board and Turn State
  const boardSize = settings.boardSize;
  const [board, setBoard] = useState<Board>(() => Array(boardSize * boardSize).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player | null>(null);
  const [winningCells, setWinningCells] = useState<number[]>([]);
  const [status, setStatus] = useState<GameStatus>('playing');
  const [mode, setMode] = useState<GameMode>('pvp');
  const [score, setScore] = useState<Score>(loadStoredScore);
  const [isThinking, setIsThinking] = useState(false);

  // Match State (Single, BO3, BO5)
  const [matchState, setMatchState] = useState<MatchState>(() => ({
    format: settings.matchFormat,
    winsX: 0,
    winsO: 0,
    targetWins: getTargetWins(settings.matchFormat),
    isMatchOver: false,
    matchWinner: null,
    gameNumber: 1,
  }));

  // Move History Stack for Undo and Replay
  const [moveHistory, setMoveHistory] = useState<MoveRecord[]>([]);
  const [gameStartTime, setGameStartTime] = useState<number>(() => Date.now());
  const [lastCompletedGame, setLastCompletedGame] = useState<GameRecord | null>(null);

  // Hint and Invalid Feedback States
  const [hintCell, setHintCell] = useState<number | null>(null);
  const [invalidCell, setInvalidCell] = useState<number | null>(null);

  // Move Timer
  const [timeRemaining, setTimeRemaining] = useState<number>(settings.timerDuration);

  // Timers Refs
  const computerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const moveTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hintTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const invalidTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Apply theme & reduced motion attributes to root document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
    document.documentElement.setAttribute('data-color-mode', settings.colorMode);
    document.documentElement.setAttribute('data-reduced-motion', String(settings.reducedMotion));
    saveSettings(settings);
  }, [settings]);

  // Synchronize score with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SCORE, JSON.stringify(score));
    } catch (err) {
      console.warn('Failed to save score to localStorage:', err);
    }
  }, [score]);

  // Clean up all timers on unmount
  useEffect(() => {
    return () => {
      if (computerTimerRef.current) clearTimeout(computerTimerRef.current);
      if (moveTimerRef.current) clearInterval(moveTimerRef.current);
      if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
      if (invalidTimeoutRef.current) clearTimeout(invalidTimeoutRef.current);
    };
  }, []);

  // Reset move timer on turn change
  useEffect(() => {
    if (moveTimerRef.current) {
      clearInterval(moveTimerRef.current);
      moveTimerRef.current = null;
    }

    if (settings.timerDuration > 0 && status === 'playing' && !isThinking) {
      setTimeRemaining(settings.timerDuration);
      moveTimerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Timer expired: trigger timeout move
            if (moveTimerRef.current) clearInterval(moveTimerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (moveTimerRef.current) {
        clearInterval(moveTimerRef.current);
        moveTimerRef.current = null;
      }
    };
  }, [currentPlayer, status, isThinking, settings.timerDuration]);

  // Handle timer expiration (turn timeout)
  useEffect(() => {
    if (timeRemaining === 0 && status === 'playing' && !isThinking && settings.timerDuration > 0) {
      // Pick a random legal move for timeout player
      const available = board
        .map((val, idx) => (val === null ? idx : null))
        .filter((idx): idx is number => idx !== null);

      if (available.length > 0) {
        const timeoutMove = available[Math.floor(Math.random() * available.length)];
        handleCellClick(timeoutMove);
      }
    }
  }, [timeRemaining, status, isThinking, settings.timerDuration, board]);

  // Finalize Game completion: update match score, save history, record stats
  const handleGameEnd = useCallback(
    (_finalBoard: Board, gameWinner: Player | null, isDraw: boolean, currentMoves: MoveRecord[]) => {
      const durationSeconds = Math.max(1, Math.round((Date.now() - gameStartTime) / 1000));
      const humanIsX = settings.player1.symbol === 'X';

      let newScore = { ...score };
      if (gameWinner) {
        newScore = { ...newScore, [gameWinner]: newScore[gameWinner] + 1 };
      } else if (isDraw) {
        newScore = { ...newScore, draws: newScore.draws + 1 };
      }
      setScore(newScore);

      // Match State (BO3 / BO5)
      let matchOver = false;
      let mWinner: Player | null = null;
      const target = matchState.targetWins;
      const newWinsX = matchState.winsX + (gameWinner === 'X' ? 1 : 0);
      const newWinsO = matchState.winsO + (gameWinner === 'O' ? 1 : 0);

      if (newWinsX >= target) {
        matchOver = true;
        mWinner = 'X';
      } else if (newWinsO >= target) {
        matchOver = true;
        mWinner = 'O';
      }

      setMatchState((prev) => ({
        ...prev,
        winsX: newWinsX,
        winsO: newWinsO,
        isMatchOver: matchOver,
        matchWinner: mWinner,
        gameNumber: prev.gameNumber + 1,
      }));

      // Record Stats & History
      const isHumanWin = gameWinner !== null && (humanIsX ? gameWinner === 'X' : gameWinner === 'O');
      const isHumanLoss = gameWinner !== null && !isHumanWin;

      recordGameStats(isHumanWin, isHumanLoss, isDraw);

      const playerXName = humanIsX
        ? settings.player1.name
        : mode === 'computer'
        ? 'Computer'
        : settings.player2.name;
      const playerOName = !humanIsX
        ? settings.player1.name
        : mode === 'computer'
        ? 'Computer'
        : settings.player2.name;

      updateLeaderboard(
        gameWinner === 'X' ? playerXName : gameWinner === 'O' ? playerOName : null,
        [playerXName, playerOName],
        isDraw
      );

      const record: GameRecord = {
        id: `game-${Date.now()}`,
        playerX: playerXName,
        playerO: playerOName,
        winner: gameWinner ?? 'draw',
        winningSymbol: gameWinner ?? undefined,
        moveCount: currentMoves.length,
        duration: durationSeconds,
        gameMode: mode,
        difficulty: mode === 'computer' ? settings.difficulty : undefined,
        boardSize: settings.boardSize,
        date: new Date().toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        moves: currentMoves,
        scoreX: newWinsX,
        scoreO: newWinsO,
      };

      setLastCompletedGame(record);
      saveGameRecord(record);

      if (gameWinner) {
        playWinSound(settings.soundEnabled);
      } else {
        playDrawSound(settings.soundEnabled);
      }
    },
    [gameStartTime, settings, score, matchState, mode]
  );

  // New Round (clears board, preserves match and session score)
  const handleNewRound = useCallback(() => {
    if (computerTimerRef.current) {
      clearTimeout(computerTimerRef.current);
      computerTimerRef.current = null;
    }
    const newBoard = Array(settings.boardSize * settings.boardSize).fill(null);
    setBoard(newBoard);
    setCurrentPlayer('X');
    setWinner(null);
    setWinningCells([]);
    setStatus('playing');
    setIsThinking(false);
    setMoveHistory([]);
    setHintCell(null);
    setInvalidCell(null);
    setGameStartTime(Date.now());
  }, [settings.boardSize]);

  // Reset Match (clears board and resets current match score)
  const handleResetMatch = useCallback(() => {
    if (computerTimerRef.current) {
      clearTimeout(computerTimerRef.current);
      computerTimerRef.current = null;
    }
    const newBoard = Array(settings.boardSize * settings.boardSize).fill(null);
    setBoard(newBoard);
    setCurrentPlayer('X');
    setWinner(null);
    setWinningCells([]);
    setStatus('playing');
    setIsThinking(false);
    setMoveHistory([]);
    setHintCell(null);
    setInvalidCell(null);
    setGameStartTime(Date.now());
    setScore(DEFAULT_SCORE);
    setMatchState({
      format: settings.matchFormat,
      winsX: 0,
      winsO: 0,
      targetWins: getTargetWins(settings.matchFormat),
      isMatchOver: false,
      matchWinner: null,
      gameNumber: 1,
    });
    try {
      localStorage.removeItem(STORAGE_KEY_SCORE);
    } catch (err) {
      console.warn('Failed to clear score from localStorage:', err);
    }
  }, [settings.boardSize, settings.matchFormat]);

  // Rematch action: resets board and match scores, keeping same players & settings
  const handleRematch = useCallback(() => {
    handleResetMatch();
  }, [handleResetMatch]);

  // Mode change handler
  const handleModeChange = useCallback(
    (newMode: GameMode) => {
      if (computerTimerRef.current) {
        clearTimeout(computerTimerRef.current);
        computerTimerRef.current = null;
      }
      setMode(newMode);
      handleNewRound();
    },
    [handleNewRound]
  );

  // Computer AI move trigger
  useEffect(() => {
    const isComputerTurn =
      mode === 'computer' &&
      status === 'playing' &&
      !isThinking &&
      ((settings.player1.symbol === 'X' && currentPlayer === 'O') ||
        (settings.player1.symbol === 'O' && currentPlayer === 'X'));

    if (isComputerTurn) {
      setIsThinking(true);

      computerTimerRef.current = setTimeout(() => {
        const compSymbol = currentPlayer;
        const humanSymbol = compSymbol === 'X' ? 'O' : 'X';
        const move = getComputerMove(
          board,
          compSymbol,
          humanSymbol,
          settings.difficulty,
          settings.boardSize
        );

        if (move !== null && isValidMove(board, move)) {
          const newBoard = makeMove(board, move, compSymbol);
          const gameWinner = checkWinner(newBoard, settings.boardSize);
          const winCells = getWinningCells(newBoard, settings.boardSize);
          const isDraw = !gameWinner && isBoardFull(newBoard);

          const moveRec: MoveRecord = {
            index: move,
            player: compSymbol,
            timestamp: Date.now(),
          };
          const updatedMoves = [...moveHistory, moveRec];
          setMoveHistory(updatedMoves);
          setBoard(newBoard);
          playMoveSound(settings.soundEnabled, compSymbol === 'O');

          if (gameWinner) {
            setWinner(gameWinner);
            setWinningCells(winCells);
            setStatus('won');
            handleGameEnd(newBoard, gameWinner, false, updatedMoves);
          } else if (isDraw) {
            setStatus('draw');
            handleGameEnd(newBoard, null, true, updatedMoves);
          } else {
            setCurrentPlayer(humanSymbol);
          }
        }
        setIsThinking(false);
      }, 450); // Natural pacing delay
    }
  }, [
    board,
    currentPlayer,
    mode,
    status,
    isThinking,
    settings.player1.symbol,
    settings.difficulty,
    settings.boardSize,
    settings.soundEnabled,
    moveHistory,
    handleGameEnd,
  ]);

  // Player Cell Click Handler
  const handleCellClick = useCallback(
    (index: number) => {
      // If cell is already occupied, trigger invalid move feedback
      if (status === 'playing' && !isValidMove(board, index)) {
        playInvalidSound(settings.soundEnabled);
        setInvalidCell(index);
        if (invalidTimeoutRef.current) clearTimeout(invalidTimeoutRef.current);
        invalidTimeoutRef.current = setTimeout(() => setInvalidCell(null), 400);
        return;
      }

      // Disallow moves if game finished or computer thinking
      if (status !== 'playing') return;
      if (isThinking) return;

      // In computer mode, prevent clicks if it is the computer's turn
      const isHumanTurn =
        mode === 'pvp' ||
        (mode === 'computer' && currentPlayer === settings.player1.symbol);
      if (!isHumanTurn) return;

      const player = currentPlayer;
      const nextPlayer: Player = player === 'X' ? 'O' : 'X';
      const newBoard = makeMove(board, index, player);
      const gameWinner = checkWinner(newBoard, settings.boardSize);
      const winCells = getWinningCells(newBoard, settings.boardSize);
      const isDraw = !gameWinner && isBoardFull(newBoard);

      const moveRec: MoveRecord = {
        index,
        player,
        timestamp: Date.now(),
      };
      const updatedMoves = [...moveHistory, moveRec];
      setMoveHistory(updatedMoves);
      setBoard(newBoard);
      setHintCell(null);
      playMoveSound(settings.soundEnabled, player === 'O');

      if (gameWinner) {
        setWinner(gameWinner);
        setWinningCells(winCells);
        setStatus('won');
        handleGameEnd(newBoard, gameWinner, false, updatedMoves);
      } else if (isDraw) {
        setStatus('draw');
        handleGameEnd(newBoard, null, true, updatedMoves);
      } else {
        setCurrentPlayer(nextPlayer);
      }
    },
    [
      board,
      currentPlayer,
      isThinking,
      mode,
      status,
      settings.boardSize,
      settings.player1.symbol,
      settings.soundEnabled,
      moveHistory,
      handleGameEnd,
    ]
  );

  // Undo Move Feature
  const handleUndoMove = useCallback(() => {
    if (moveHistory.length === 0 || isThinking) return;

    if (computerTimerRef.current) {
      clearTimeout(computerTimerRef.current);
      computerTimerRef.current = null;
    }

    playClickSound(settings.soundEnabled);

    // In PvC: undo human + computer (2 moves) if both occurred
    const movesToUndo = mode === 'computer' && moveHistory.length >= 2 ? 2 : 1;
    const remainingMoves = moveHistory.slice(0, moveHistory.length - movesToUndo);

    // Rebuild board from remaining moves
    const freshBoard: Board = Array(settings.boardSize * settings.boardSize).fill(null);
    remainingMoves.forEach((m) => {
      freshBoard[m.index] = m.player;
    });

    // Next player is the player of the undone move
    const lastUndone = moveHistory[moveHistory.length - movesToUndo];
    setCurrentPlayer(lastUndone.player);
    setBoard(freshBoard);
    setMoveHistory(remainingMoves);
    setWinner(null);
    setWinningCells([]);
    setStatus('playing');
    setIsThinking(false);
    setHintCell(null);
  }, [moveHistory, isThinking, mode, settings.boardSize, settings.soundEnabled]);

  // Hint Button Feature
  const handleRequestHint = useCallback(() => {
    if (status !== 'playing' || isThinking) return;
    const opponent = currentPlayer === 'X' ? 'O' : 'X';
    const hint = getHintMove(board, currentPlayer, opponent, settings.boardSize);

    if (hint !== null) {
      playClickSound(settings.soundEnabled);
      setHintCell(hint);
      if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
      hintTimeoutRef.current = setTimeout(() => {
        setHintCell(null);
      }, 2500);
    }
  }, [status, isThinking, board, currentPlayer, settings.boardSize, settings.soundEnabled]);

  // Update Settings
  const handleUpdateSettings = useCallback((newSettings: UserSettings) => {
    setSettings(newSettings);
    // If board size changed, reset board to match new size
    setBoard((prev) => {
      if (prev.length !== newSettings.boardSize * newSettings.boardSize) {
        return Array(newSettings.boardSize * newSettings.boardSize).fill(null);
      }
      return prev;
    });
  }, []);

  // Transition from Start Screen to Game Screen
  const handleStartGame = useCallback(
    (customConfig?: Partial<UserSettings> & { mode?: GameMode }) => {
      if (customConfig) {
        const updated = { ...settings, ...customConfig };
        setSettings(updated);
        if (customConfig.mode) setMode(customConfig.mode);
        const newBoard = Array(updated.boardSize * updated.boardSize).fill(null);
        setBoard(newBoard);
      } else {
        handleNewRound();
      }
      setScreen('game');
    },
    [settings, handleNewRound]
  );

  // Return to Start Screen
  const handleReturnToStart = useCallback(() => {
    if (computerTimerRef.current) clearTimeout(computerTimerRef.current);
    setScreen('start');
  }, []);

  return {
    screen,
    board,
    currentPlayer,
    winner,
    winningCells,
    status,
    mode,
    score,
    isThinking,
    settings,
    matchState,
    moveHistory,
    lastCompletedGame,
    hintCell,
    invalidCell,
    timeRemaining,
    handleCellClick,
    handleNewRound,
    handleResetMatch,
    handleModeChange,
    handleUndoMove,
    handleRequestHint,
    handleRematch,
    handleUpdateSettings,
    handleStartGame,
    handleReturnToStart,
  };
}
