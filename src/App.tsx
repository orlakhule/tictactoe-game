import React, { useState } from "react";
import { useTicTacToe } from "./hooks/useTicTacToe";
import { Header } from "./components/Header/Header";
import { StartScreen } from "./components/StartScreen/StartScreen";
import { Scoreboard } from "./components/Scoreboard/Scoreboard";
import { GameStatus } from "./components/GameStatus/GameStatus";
import { Board } from "./components/Board/Board";
import { GameControls } from "./components/GameControls/GameControls";
import { SettingsModal } from "./components/SettingsModal/SettingsModal";
import { HowToPlayModal } from "./components/HowToPlayModal/HowToPlayModal";
import { MatchSummaryModal } from "./components/MatchSummaryModal/MatchSummaryModal";
import { ReplayViewer } from "./components/ReplayViewer/ReplayViewer";
import { HistoryModal } from "./components/HistoryModal/HistoryModal";
import { StatsModal } from "./components/StatsModal/StatsModal";
import styles from "./App.module.css";

export const App: React.FC = () => {
  const {
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
    lastCompletedGame,
    hintCell,
    invalidCell,
    timeRemaining,
    handleCellClick,
    handleNewRound,
    handleResetMatch,
    handleUndoMove,
    handleRequestHint,
    handleRematch,
    handleUpdateSettings,
    handleStartGame,
    handleReturnToStart,
  } = useTicTacToe();

  // Modal visibility state
  const [showSettings, setShowSettings] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showReplay, setShowReplay] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showStats, setShowStats] = useState(false);

  // Board is disabled when: game over, AI is thinking, or it's AI's turn
  const compSymbol = settings.player1.symbol === "X" ? "O" : "X";
  const isBoardDisabled =
    status !== "playing" ||
    isThinking ||
    (mode === "computer" && currentPlayer === compSymbol);

  const canUndo =
    status === "playing" &&
    !isThinking &&
    board.some((cell) => cell !== null);

  const isHintAvailable = status === "playing" && !isThinking;

  // ---- START SCREEN ----
  if (screen === "start") {
    return (
      <div className={styles.appContainer}>
        <StartScreen
          settings={settings}
          onStartGame={handleStartGame}
          onOpenHowToPlay={() => setShowHowToPlay(true)}
          onOpenSettings={() => setShowSettings(true)}
          onOpenHistory={() => setShowHistory(true)}
          onOpenStats={() => setShowStats(true)}
        />

        <SettingsModal
          isOpen={showSettings}
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onClose={() => setShowSettings(false)}
        />
        <HowToPlayModal
          isOpen={showHowToPlay}
          onClose={() => setShowHowToPlay(false)}
        />
        <HistoryModal
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
        />
        <StatsModal
          isOpen={showStats}
          onClose={() => setShowStats(false)}
        />
      </div>
    );
  }

  // ---- GAME SCREEN ----
  return (
    <div className={styles.appContainer}>
      <Header
        onOpenSettings={() => setShowSettings(true)}
        onReturnToStart={handleReturnToStart}
      />

      <Scoreboard
        score={score}
        currentPlayer={currentPlayer}
        mode={mode}
        status={status}
        player1={settings.player1}
        player2={settings.player2}
        matchState={matchState}
      />

      <GameStatus
        status={status}
        currentPlayer={currentPlayer}
        winner={winner}
        mode={mode}
        isThinking={isThinking}
        timeRemaining={timeRemaining}
        timerDuration={settings.timerDuration}
        player1={settings.player1}
        player2={settings.player2}
      />

      <Board
        board={board}
        winningCells={winningCells}
        disabled={isBoardDisabled}
        onCellClick={handleCellClick}
        hintCell={hintCell}
        invalidCell={invalidCell}
        boardSize={settings.boardSize}
        colorX={settings.player1.symbol === "X" ? settings.player1.color : settings.player2.color}
        colorO={settings.player1.symbol === "O" ? settings.player1.color : settings.player2.color}
      />

      <GameControls
        onNewRound={handleNewRound}
        onResetMatch={handleResetMatch}
        onUndo={handleUndoMove}
        onHint={handleRequestHint}
        disabled={isThinking}
        canUndo={canUndo}
        isHintAvailable={isHintAvailable}
      />

      <footer className={styles.footer}>
        <p>CHARIS &bull; Pure Logic &bull; Built with React &amp; TypeScript</p>
      </footer>

      {/* Modals */}
      <MatchSummaryModal
        isOpen={status === "won" || status === "draw"}
        gameRecord={lastCompletedGame}
        matchState={matchState}
        onRematch={handleRematch}
        onNewGame={handleReturnToStart}
        onReplay={() => setShowReplay(true)}
        onClose={handleNewRound}
      />

      <ReplayViewer
        isOpen={showReplay}
        gameRecord={lastCompletedGame}
        onClose={() => setShowReplay(false)}
      />

      <SettingsModal
        isOpen={showSettings}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onClose={() => setShowSettings(false)}
      />

      <HowToPlayModal
        isOpen={showHowToPlay}
        onClose={() => setShowHowToPlay(false)}
      />

      <HistoryModal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
      />

      <StatsModal
        isOpen={showStats}
        onClose={() => setShowStats(false)}
      />
    </div>
  );
};

export default App;

