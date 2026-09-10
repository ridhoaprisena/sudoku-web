import { useGame } from '../contexts/GameContext';
import './GameControls.css';

export default function GameControls() {
  const { undoMove, eraseCell, toggleNotesMode, useHint, notesMode, hintsLeft, canUndo } = useGame();

  const controls = [
    { id: 'undo',  icon: 'undo',      label: 'Batal',            action: undoMove,       disabled: !canUndo },
    { id: 'erase', icon: 'backspace',  label: 'Hapus',            action: eraseCell,      disabled: false },
    { id: 'notes', icon: 'edit_note',  label: 'Catatan',          action: toggleNotesMode,disabled: false, active: notesMode },
    { id: 'hint',  icon: 'lightbulb', label: `Bantuan (${hintsLeft})`, action: useHint,  disabled: hintsLeft === 0 },
  ];

  return (
    <div className="game-controls">
      {controls.map(ctrl => (
        <button
          key={ctrl.id}
          id={`ctrl-${ctrl.id}`}
          className={`control-btn ${ctrl.active ? 'control-active' : ''} ${ctrl.disabled ? 'control-disabled' : ''}`}
          onClick={ctrl.action}
          disabled={ctrl.disabled}
          aria-label={ctrl.label}
          aria-pressed={ctrl.active}
          title={ctrl.label}
        >
          <span className="control-icon-wrap">
            <span className="material-icons-round">{ctrl.icon}</span>
            {ctrl.id === 'notes' && notesMode && (
              <span className="active-indicator" aria-hidden="true" />
            )}
          </span>
          <span className="control-label">{ctrl.label}</span>
        </button>
      ))}
    </div>
  );
}
