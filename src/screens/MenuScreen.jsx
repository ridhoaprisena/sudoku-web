import { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import ThemePicker from '../components/ThemePicker';
import './MenuScreen.css';

const DIFFICULTIES = [
  { id: 'easy',   label: 'Mudah',  clues: 36, desc: 'Tanpa nyawa · Santai' },
  { id: 'medium', label: 'Sedang', clues: 28, desc: '3 nyawa · Seru' },
  { id: 'hard',   label: 'Sulit',  clues: 22, desc: '3 nyawa · Menantang' },
  { id: 'expert', label: 'Ahli',   clues: 17, desc: '3 nyawa · Ekstrem' },
];

export default function MenuScreen() {
  const { startGame } = useGame();
  const [selectedDiff, setSelectedDiff] = useState('medium');
  const [isLoading, setIsLoading] = useState(false);

  const selected = DIFFICULTIES.find(d => d.id === selectedDiff);

  const handlePlay = () => {
    setIsLoading(true);
    setTimeout(() => {
      startGame(selectedDiff);
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="menu-screen">
      <div className="menu-inner">
        <div className="menu-hero animate-fade-in-up">
          <h1 className="hero-title">Sudoku</h1>
          <p className="hero-sub">Teka-teki angka klasik — isi grid 9×9</p>
        </div>

        <div className="menu-form animate-fade-in-up delay-200">
          <div className="form-group">
            <span className="form-label">Kesulitan</span>
            <div className="diff-segments" role="radiogroup" aria-label="Tingkat kesulitan">
              {DIFFICULTIES.map(diff => (
                <button
                  key={diff.id}
                  id={`diff-${diff.id}`}
                  role="radio"
                  aria-checked={selectedDiff === diff.id}
                  className={`diff-seg ${selectedDiff === diff.id ? 'diff-seg-active' : ''}`}
                  onClick={() => setSelectedDiff(diff.id)}
                >
                  {diff.label}
                </button>
              ))}
            </div>
            <p className="diff-hint">
              <span className="material-icons-round diff-hint-icon">info</span>
              {selected.clues} petunjuk · {selected.desc}
            </p>
          </div>

          <div className="form-group">
            <span className="form-label">Tema</span>
            <ThemePicker />
          </div>

          <button
            id="btn-play"
            className={`play-btn ${isLoading ? 'play-loading' : ''}`}
            onClick={handlePlay}
            disabled={isLoading}
            aria-label={`Mulai permainan tingkat ${selectedDiff}`}
          >
            {isLoading ? (
              <span className="material-icons-round loading-spin">autorenew</span>
            ) : (
              <span className="material-icons-round">play_arrow</span>
            )}
            {isLoading ? 'Memuat...' : 'Mulai Bermain'}
          </button>
        </div>
      </div>
    </div>
  );
}
