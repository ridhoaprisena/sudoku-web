import { useEffect, useRef } from 'react';
import { useGame } from '../contexts/GameContext';
import { formatTime } from '../utils/sudokuGenerator';
import './ResultModal.css';

const DIFFICULTY_LABELS = {
  easy: 'Mudah',
  medium: 'Sedang',
  hard: 'Sulit',
  expert: 'Ahli',
};

const MAX_HINTS = 3;

export default function ResultModal({ onNewGame, onMenu }) {
  const { isWon, isGameOver, timer, difficulty, hintsLeft, lives } = useGame();
  const confettiRef = useRef(null);
  const isEasy = difficulty === 'easy';

  useEffect(() => {
    if (isWon && confettiRef.current) {
      spawnConfetti(confettiRef.current);
    }
  }, [isWon]);

  if (!isWon && !isGameOver) return null;

  return (
    <div className="modal-backdrop animate-fade-in" role="dialog" aria-modal="true">
      {isWon && <div ref={confettiRef} className="confetti-container" aria-hidden="true" />}

      <div className="modal-card animate-scale-bounce">
        <div className={`modal-icon-wrap ${isWon ? 'icon-win' : 'icon-lose'}`}>
          <span className="material-icons-round modal-icon">
            {isWon ? 'emoji_events' : 'mood_bad'}
          </span>
        </div>

        <h2 className="modal-title">
          {isWon ? 'Selesai!' : 'Game Over'}
        </h2>
        <p className="modal-subtitle">
          {isWon
            ? 'Puzzle berhasil diselesaikan.'
            : 'Semua nyawa habis. Coba lagi?'}
        </p>

        <div className="modal-stats">
          <div className="stat-item animate-fade-in-up delay-100">
            <span className="material-icons-round stat-icon">schedule</span>
            <div>
              <div className="stat-value">{formatTime(timer)}</div>
              <div className="stat-label">Waktu</div>
            </div>
          </div>
          <div className="stat-item animate-fade-in-up delay-200">
            <span className="material-icons-round stat-icon">bar_chart</span>
            <div>
              <div className="stat-value">{DIFFICULTY_LABELS[difficulty]}</div>
              <div className="stat-label">Kesulitan</div>
            </div>
          </div>
          <div className="stat-item animate-fade-in-up delay-300">
            <span className="material-icons-round stat-icon">lightbulb</span>
            <div>
              <div className="stat-value">{MAX_HINTS - hintsLeft}/{MAX_HINTS}</div>
              <div className="stat-label">Bantuan</div>
            </div>
          </div>
          {isWon && !isEasy && (
            <div className="stat-item animate-fade-in-up delay-400">
              <span className="material-icons-round stat-icon">favorite</span>
              <div>
                <div className="stat-value">{lives}/3</div>
                <div className="stat-label">Nyawa Sisa</div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-actions animate-fade-in-up delay-500">
          <button id="modal-new-game" className="modal-btn modal-btn-filled" onClick={onNewGame}>
            <span className="material-icons-round">refresh</span>
            Main Lagi
          </button>
          <button id="modal-menu" className="modal-btn modal-btn-tonal" onClick={onMenu}>
            <span className="material-icons-round">home</span>
            Menu Utama
          </button>
        </div>
      </div>
    </div>
  );
}

function spawnConfetti(container) {
  const colors = ['#6750A4', '#B5EAD7', '#FFD700', '#FF9AA2', '#C7CEEA', '#FFDAC1'];
  container.innerHTML = '';
  for (let i = 0; i < 55; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    Object.assign(el.style, {
      left: `${Math.random() * 100}%`,
      background: colors[Math.floor(Math.random() * colors.length)],
      width: `${6 + Math.random() * 7}px`,
      height: `${6 + Math.random() * 7}px`,
      borderRadius: Math.random() > 0.5 ? '50%' : '2px',
      animationDelay: `${Math.random() * 1.8}s`,
      animationDuration: `${2 + Math.random() * 1.5}s`,
      transform: `rotate(${Math.random() * 360}deg)`,
    });
    container.appendChild(el);
  }
}
