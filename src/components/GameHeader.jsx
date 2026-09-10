import { useGame } from '../contexts/GameContext';
import { formatTime } from '../utils/sudokuGenerator';
import './GameHeader.css';

const DIFFICULTY_LABELS = {
  easy: 'Mudah',
  medium: 'Sedang',
  hard: 'Sulit',
  expert: 'Ahli',
};

export default function GameHeader({ onMenu }) {
  const { lives, timer, isPaused, togglePause, difficulty, isGameOver, isWon } = useGame();
  const isEasy = difficulty === 'easy';

  return (
    <header className="game-header">
      <div className="header-left">
        <button className="header-icon-btn" onClick={onMenu} aria-label="Kembali ke menu">
          <span className="material-icons-round">arrow_back</span>
        </button>
        <span className="difficulty-chip">{DIFFICULTY_LABELS[difficulty] || difficulty}</span>
      </div>

      <div className="header-center">
        <span className="material-icons-round timer-icon">schedule</span>
        <span className={`timer-display ${isPaused ? 'timer-paused' : ''}`}>
          {formatTime(timer)}
        </span>
      </div>

      <div className="header-right">
        {isEasy ? (
          <div className="easy-badge" aria-label="Mode Santai — tanpa nyawa">
            <span className="material-icons-round">all_inclusive</span>
          </div>
        ) : (
          <div className="lives-container" aria-label={`${lives} nyawa tersisa`}>
            {[...Array(3)].map((_, i) => (
              <span
                key={i}
                className={`material-icons-round life-icon ${i < lives ? 'life-active' : 'life-empty'}`}
                aria-hidden="true"
              >
                {i < lives ? 'favorite' : 'favorite_border'}
              </span>
            ))}
          </div>
        )}
        {!isGameOver && !isWon && (
          <button
            className="header-icon-btn"
            onClick={togglePause}
            aria-label={isPaused ? 'Lanjutkan' : 'Jeda'}
          >
            <span className="material-icons-round">
              {isPaused ? 'play_arrow' : 'pause'}
            </span>
          </button>
        )}
      </div>
    </header>
  );
}
