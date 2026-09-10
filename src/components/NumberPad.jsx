import { useGame } from '../contexts/GameContext';
import './NumberPad.css';

export default function NumberPad() {
  const { inputNumber, numberCounts, selectedCell, isPaused, isGameOver, isWon } = useGame();
  const isDisabled = !selectedCell || isPaused || isGameOver || isWon;

  return (
    <div className="number-pad" role="group" aria-label="Pad angka">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
        const remaining = numberCounts[num];
        const isComplete = remaining === 0;
        return (
          <button
            key={num}
            id={`numpad-${num}`}
            className={`num-btn ${isComplete ? 'num-complete' : ''} ${isDisabled ? 'num-disabled' : ''}`}
            onClick={() => !isDisabled && inputNumber(num)}
            disabled={isDisabled || isComplete}
            aria-label={`Angka ${num}, tersisa ${remaining}`}
          >
            <span className="num-digit">{num}</span>
            <span className="num-remaining">
              {isComplete
                ? <span className="material-icons-round num-check">check</span>
                : remaining}
            </span>
          </button>
        );
      })}
    </div>
  );
}
