import type { GridSize } from "../types/sudoku";

export function getBoxDims(size: GridSize): { boxR: number; boxC: number } {
  if (size === 9) return { boxR: 3, boxC: 3 };
  if (size === 16) return { boxR: 4, boxC: 4 };
  if (size === 6) return { boxR: 2, boxC: 3 };
  return { boxR: 1, boxC: 1 };
}

export function isValid(
  board: number[][],
  r: number,
  c: number,
  v: number,
  size: GridSize
): boolean {
  const { boxR, boxC } = getBoxDims(size);
  for (let i = 0; i < size; i++) {
    if (board[r][i] === v || board[i][c] === v) return false;
  }
  const sr = Math.floor(r / boxR) * boxR;
  const sc = Math.floor(c / boxC) * boxC;
  for (let i = sr; i < sr + boxR; i++) {
    for (let j = sc; j < sc + boxC; j++) {
      if (board[i][j] === v) return false;
    }
  }
  return true;
}

export function findEmpty(board: number[][], size: GridSize): [number, number] | null {
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c] === 0) return [r, c];
    }
  }
  return null;
}

export function findMRV(board: number[][], size: GridSize): [number, number] | null {
  let best: [number, number] | null = null;
  let bestCount = size + 1;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c] !== 0) continue;
      let count = 0;
      for (let v = 1; v <= size; v++) {
        if (isValid(board, r, c, v, size)) count++;
      }
      if (count < bestCount) {
        bestCount = count;
        best = [r, c];
      }
    }
  }
  return best;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export function formatDate(): string {
  const d = new Date();
  const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  const months = [
    "Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre",
  ];
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} - Vol. I, No. 1`;
}