import { useEffect, useCallback } from 'react';
import { useGame } from '../contexts/GameContext';
import GameHeader from '../components/GameHeader';
import SudokuBoard from '../components/SudokuBoard';
import GameControls from '../components/GameControls';
import NumberPad from '../components/NumberPad';
import ResultModal from '../components/ResultModal';
import './GameScreen.css';

export default function GameScreen({ onMenu }) {
  const {
    isPaused, togglePause,
    isGameOver, isWon,
    startGame, difficulty,
    inputNumber, eraseCell, undoMove,
  } = useGame();

  const handleKeyDown = useCallback((e) => {
    if (isGameOver || isWon) return;
    const key = e.key;
    if (key >= '1' && key <= '9') {
      e.preventDefault();
      inputNumber(parseInt(key));
    } else if (key === 'Backspace' || key === 'Delete' || key === '0') {
      e.preventDefault();
      eraseCell();
    } else if (key === 'z' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      undoMove();
    } else if (key === 'Escape') {
      e.preventDefault();
      togglePause();
    }
  }, [isGameOver, isWon, inputNumber, eraseCell, undoMove, togglePause]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleNewGame = () => startGame(difficulty);

  return (
    <div className="game-screen">
      <GameHeader onMenu={onMenu} />

      <main className="game-main">
        {isPaused && !isGameOver && !isWon && (
          <div className="pause-overlay animate-fade-in" onClick={togglePause}>
            <div className="pause-card animate-scale-bounce">
              <span className="pause-icon material-icons-round">pause_circle</span>
              <h2 className="pause-title">Dijeda</h2>
              <p className="pause-hint">Ketuk untuk melanjutkan</p>
            </div>
          </div>
        )}

        <div className="game-layout">
          <div className="board-area">
            <SudokuBoard />
          </div>

          <div className="controls-area">
            <div className="sidebar-label" aria-hidden="true">
              <span className="material-icons-round">tune</span>
              <span>Aksi</span>
            </div>
            <GameControls />
            <div className="sidebar-divider" aria-hidden="true" />
            <div className="sidebar-label" aria-hidden="true">
              <span className="material-icons-round">pin</span>
              <span>Angka</span>
            </div>
            <NumberPad />
            <div className="keyboard-hint" aria-hidden="true">
              <span className="material-icons-round hint-icon">keyboard</span>
              <span>1–9 · Del · Ctrl+Z · Esc</span>
            </div>
          </div>
        </div>
      </main>

      <ResultModal onNewGame={handleNewGame} onMenu={onMenu} />
    </div>
  );
}
