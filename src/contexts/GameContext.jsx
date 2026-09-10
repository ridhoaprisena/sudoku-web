import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { generatePuzzle, isBoardComplete, getConflictCells } from '../utils/sudokuGenerator';

const GameContext = createContext(null);

const MAX_LIVES = 3;
const MAX_HINTS = 3;

export function GameProvider({ children }) {
  const [screen, setScreen] = useState('menu');
  const [difficulty, setDifficulty] = useState('medium');
  const [board, setBoard] = useState(null);
  const [solution, setSolution] = useState(null);
  const [given, setGiven] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [notes, setNotes] = useState(null);
  const [history, setHistory] = useState([]);
  const [lives, setLives] = useState(MAX_LIVES);
  const [hintsLeft, setHintsLeft] = useState(MAX_HINTS);
  const [timer, setTimer] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [notesMode, setNotesMode] = useState(false);
  const [shakingCell, setShakingCell] = useState(null);
  const [highlightNumber, setHighlightNumber] = useState(null);

  const timerRef = useRef(null);

  useEffect(() => {
    if (screen !== 'game' || isPaused || isGameOver || isWon) {
      clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [screen, isPaused, isGameOver, isWon]);

  const startGame = useCallback((diff) => {
    setDifficulty(diff);
    const { puzzle, solution: sol } = generatePuzzle(diff);
    const givenMap = puzzle.map(row => row.map(v => v !== 0));
    setBoard(puzzle.map(r => [...r]));
    setSolution(sol.map(r => [...r]));
    setGiven(givenMap);
    setNotes(Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => new Set())));
    setHistory([]);
    setLives(MAX_LIVES);
    setHintsLeft(MAX_HINTS);
    setTimer(0);
    setIsPaused(false);
    setIsGameOver(false);
    setIsWon(false);
    setSelectedCell(null);
    setNotesMode(false);
    setShakingCell(null);
    setHighlightNumber(null);
    setScreen('game');
  }, []);

  const goToMenu = useCallback(() => {
    setScreen('menu');
    setSelectedCell(null);
  }, []);

  const selectCell = useCallback((row, col) => {
    setSelectedCell({ row, col });
    if (board && board[row][col] !== 0) {
      setHighlightNumber(board[row][col]);
    } else {
      setHighlightNumber(null);
    }
  }, [board]);

  const inputNumber = useCallback((num) => {
    if (!selectedCell || isGameOver || isWon || isPaused) return;
    const { row, col } = selectedCell;
    if (given[row][col]) return;

    if (notesMode) {
      setNotes(prev => {
        const next = prev.map(r => r.map(s => new Set(s)));
        const cellNotes = next[row][col];
        if (cellNotes.has(num)) cellNotes.delete(num);
        else cellNotes.add(num);
        return next;
      });
      return;
    }

    setHistory(prev => [...prev, {
      board: board.map(r => [...r]),
      notes: notes.map(r => r.map(s => new Set(s))),
      lives,
    }]);

    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = num;

    const newNotes = notes.map(r => r.map(s => new Set(s)));
    newNotes[row][col] = new Set();
    for (let i = 0; i < 9; i++) {
      newNotes[row][i].delete(num);
      newNotes[i][col].delete(num);
    }
    const br = Math.floor(row / 3) * 3, bc = Math.floor(col / 3) * 3;
    for (let dr = 0; dr < 3; dr++)
      for (let dc = 0; dc < 3; dc++)
        newNotes[br + dr][bc + dc].delete(num);

    setNotes(newNotes);
    setBoard(newBoard);
    setHighlightNumber(num);

    if (num !== solution[row][col]) {
      setShakingCell({ row, col });
      setTimeout(() => setShakingCell(null), 600);
      if (difficulty !== 'easy') {
        const newLives = lives - 1;
        setLives(newLives);
        if (newLives <= 0) {
          setIsGameOver(true);
        }
      }
      return;
    }

    if (isBoardComplete(newBoard, solution)) {
      setIsWon(true);
    }
  }, [selectedCell, given, board, notes, solution, lives, difficulty, isGameOver, isWon, isPaused, notesMode]);

  const eraseCell = useCallback(() => {
    if (!selectedCell || isGameOver || isWon || isPaused) return;
    const { row, col } = selectedCell;
    if (given[row][col]) return;

    setHistory(prev => [...prev, {
      board: board.map(r => [...r]),
      notes: notes.map(r => r.map(s => new Set(s))),
      lives,
    }]);

    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = 0;
    setBoard(newBoard);

    const newNotes = notes.map(r => r.map(s => new Set(s)));
    newNotes[row][col] = new Set();
    setNotes(newNotes);
    setHighlightNumber(null);
  }, [selectedCell, given, board, notes, lives, isGameOver, isWon, isPaused]);

  const undoMove = useCallback(() => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setBoard(prev.board);
    setNotes(prev.notes);
    setLives(prev.lives);
    setHistory(h => h.slice(0, -1));
    if (isGameOver) setIsGameOver(false);
  }, [history, isGameOver]);

  const useHint = useCallback(() => {
    if (hintsLeft <= 0 || !selectedCell || isGameOver || isWon || isPaused) return;
    const { row, col } = selectedCell;
    if (given[row][col] || board[row][col] === solution[row][col]) return;

    setHistory(prev => [...prev, {
      board: board.map(r => [...r]),
      notes: notes.map(r => r.map(s => new Set(s))),
      lives,
    }]);

    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = solution[row][col];
    setBoard(newBoard);
    setHintsLeft(h => h - 1);
    setHighlightNumber(solution[row][col]);

    if (isBoardComplete(newBoard, solution)) {
      setIsWon(true);
    }
  }, [hintsLeft, selectedCell, given, board, notes, solution, lives, isGameOver, isWon, isPaused]);

  const togglePause = useCallback(() => {
    if (isGameOver || isWon) return;
    setIsPaused(p => !p);
  }, [isGameOver, isWon]);

  const toggleNotesMode = useCallback(() => setNotesMode(m => !m), []);

  const conflicts = board ? getConflictCells(board) : new Set();

  const numberCounts = Array.from({ length: 10 }, (_, n) => {
    if (n === 0) return 0;
    let count = 0;
    if (board) {
      for (let r = 0; r < 9; r++)
        for (let c = 0; c < 9; c++)
          if (board[r][c] === n) count++;
    }
    return 9 - count;
  });

  return (
    <GameContext.Provider value={{
      screen, difficulty,
      board, solution, given, notes,
      selectedCell, selectCell,
      lives, hintsLeft,
      timer, isPaused, togglePause,
      isGameOver, isWon,
      notesMode, toggleNotesMode,
      conflicts,
      shakingCell,
      highlightNumber,
      numberCounts,
      canUndo: history.length > 0,
      startGame, goToMenu,
      inputNumber, eraseCell, undoMove, useHint,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be inside GameProvider');
  return ctx;
}
