export function isValid(board, row, col, num) {
  for (let c = 0; c < 9; c++) {
    if (board[row][c] === num) return false;
  }
  for (let r = 0; r < 9; r++) {
    if (board[r][col] === num) return false;
  }
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (board[boxRow + r][boxCol + c] === num) return false;
    }
  }
  return true;
}

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function solve(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (const num of nums) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solve(board)) return true;
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function countSolutions(board, limit = 2) {
  let count = 0;
  function helper(b) {
    if (count >= limit) return;
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (b[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(b, row, col, num)) {
              b[row][col] = num;
              helper(b);
              b[row][col] = 0;
            }
          }
          return;
        }
      }
    }
    count++;
  }
  helper(board.map(r => [...r]));
  return count;
}

const CLUE_COUNTS = {
  easy: 36,
  medium: 28,
  hard: 22,
  expert: 17,
};

export function generatePuzzle(difficulty = 'medium') {
  const solution = Array.from({ length: 9 }, () => Array(9).fill(0));
  solve(solution);

  const clues = CLUE_COUNTS[difficulty] ?? 28;
  const cellsToRemove = 81 - clues;
  const puzzle = solution.map(r => [...r]);

  const positions = shuffle(
    Array.from({ length: 81 }, (_, i) => ({ row: Math.floor(i / 9), col: i % 9 }))
  );

  let removed = 0;
  for (const { row, col } of positions) {
    if (removed >= cellsToRemove) break;
    const backup = puzzle[row][col];
    puzzle[row][col] = 0;
    if (difficulty === 'hard' || difficulty === 'expert') {
      if (countSolutions(puzzle) !== 1) {
        puzzle[row][col] = backup;
        continue;
      }
    }
    removed++;
  }

  return {
    puzzle: puzzle.map(r => [...r]),
    solution: solution.map(r => [...r]),
  };
}

export function isBoardComplete(board, solution) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] !== solution[r][c]) return false;
    }
  }
  return true;
}

export function getConflictCells(board) {
  const conflicts = new Set();
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) continue;
      const num = board[r][c];
      for (let cc = 0; cc < 9; cc++) {
        if (cc !== c && board[r][cc] === num) {
          conflicts.add(`${r}-${c}`);
          conflicts.add(`${r}-${cc}`);
        }
      }
      for (let rr = 0; rr < 9; rr++) {
        if (rr !== r && board[rr][c] === num) {
          conflicts.add(`${r}-${c}`);
          conflicts.add(`${rr}-${c}`);
        }
      }
      const br = Math.floor(r / 3) * 3, bc = Math.floor(c / 3) * 3;
      for (let dr = 0; dr < 3; dr++) {
        for (let dc = 0; dc < 3; dc++) {
          const nr = br + dr, nc = bc + dc;
          if ((nr !== r || nc !== c) && board[nr][nc] === num) {
            conflicts.add(`${r}-${c}`);
            conflicts.add(`${nr}-${nc}`);
          }
        }
      }
    }
  }
  return conflicts;
}

export function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
