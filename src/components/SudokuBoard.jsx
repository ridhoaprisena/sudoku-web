import SudokuCell from './SudokuCell';
import { useGame } from '../contexts/GameContext';
import './SudokuBoard.css';

export default function SudokuBoard() {
  const { board } = useGame();
  if (!board) return null;

  return (
    <div className="sudoku-board-wrapper animate-scale-bounce">
      <div className="sudoku-board" role="grid" aria-label="Papan Sudoku">
        {Array.from({ length: 9 }, (_, row) => (
          <div key={row} className="board-row" role="row">
            {Array.from({ length: 9 }, (_, col) => (
              <div key={col} className={getCellWrapClass(row, col)} role="gridcell">
                <SudokuCell row={row} col={col} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function getCellWrapClass(row, col) {
  let cls = 'cell-wrapper';
  if (row % 3 === 0 && row !== 0) cls += ' border-top-thick';
  if (col % 3 === 0 && col !== 0) cls += ' border-left-thick';
  return cls;
}
