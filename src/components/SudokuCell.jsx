import { useCallback } from 'react';
import { useGame } from '../contexts/GameContext';
import './SudokuCell.css';

export default function SudokuCell({ row, col }) {
  const {
    board, given, notes, selectedCell,
    selectCell, conflicts, shakingCell,
    highlightNumber, solution, isWon, isPaused,
  } = useGame();

  const value = board?.[row]?.[col] ?? 0;
  const isGiven = given?.[row]?.[col] ?? false;
  const cellNotes = notes?.[row]?.[col] ?? new Set();
  const isSelected = selectedCell?.row === row && selectedCell?.col === col;
  const isShaking = shakingCell?.row === row && shakingCell?.col === col;
  const isCorrect = isWon || (value !== 0 && value === solution?.[row]?.[col] && !isGiven);

  let isHighlightedArea = false;
  if (selectedCell) {
    const sr = selectedCell.row, sc = selectedCell.col;
    const sameBox =
      Math.floor(sr / 3) === Math.floor(row / 3) &&
      Math.floor(sc / 3) === Math.floor(col / 3);
    isHighlightedArea = sr === row || sc === col || sameBox;
  }

  const isHighlightedNumber = highlightNumber && value === highlightNumber && value !== 0;
  const hasConflict = conflicts.has(`${row}-${col}`);

  const handleClick = useCallback(() => {
    if (isPaused) return;
    selectCell(row, col);
  }, [row, col, selectCell, isPaused]);

  const buildClass = () => {
    let cls = 'sudoku-cell';
    if (isSelected)             cls += ' cell-selected';
    else if (isHighlightedNumber) cls += ' cell-highlight-number';
    else if (isHighlightedArea) cls += ' cell-highlight-area';
    if (hasConflict) cls += ' cell-conflict';
    if (isGiven)     cls += ' cell-given';
    if (isCorrect)   cls += ' cell-correct';
    if (isShaking)   cls += ' cell-shaking';
    if (isPaused)    cls += ' cell-paused';
    return cls;
  };

  const renderNotes = () => (
    <div className="cell-notes">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
        <span key={n} className={`note-num ${cellNotes.has(n) ? 'note-active' : ''}`}>
          {cellNotes.has(n) ? n : ''}
        </span>
      ))}
    </div>
  );

  return (
    <button
      className={buildClass()}
      onClick={handleClick}
      aria-label={`Baris ${row + 1} kolom ${col + 1}${value ? `, nilai ${value}` : ''}`}
      aria-selected={isSelected}
    >
      {value !== 0 ? (
        <span className={`cell-value ${!isGiven && !isPaused ? 'cell-value-entered' : ''}`}>
          {isPaused ? '' : value}
        </span>
      ) : (
        cellNotes.size > 0 && !isPaused ? renderNotes() : null
      )}
    </button>
  );
}
