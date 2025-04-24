import type { GridSize, AlgoType } from "../types/sudoku";
import { isValid, findEmpty, findMRV, sleep } from "./helpers";

export type SetCellFn = (r: number, c: number, state: string, val?: number) => void;
export type IsStopped = () => boolean;
export type OnStep = () => void;

export async function solveBacktrack(
  board: number[][],
  size: GridSize,
  delay: number,
  setCell: SetCellFn,
  isStopped: IsStopped,
  onStep: OnStep
): Promise<boolean> {
  if (isStopped()) return false;
  const pos = findEmpty(board, size);
  if (!pos) return true;
  const [r, c] = pos;

  for (let v = 1; v <= size; v++) {
    onStep();
    if (isValid(board, r, c, v, size)) {
      board[r][c] = v;
      setCell(r, c, "active", v);
      if (delay > 0) await sleep(delay);
      setCell(r, c, "checking", v);
      if (await solveBacktrack(board, size, delay, setCell, isStopped, onStep)) return true;
      board[r][c] = 0;
      setCell(r, c, "conflict", 0);
      if (delay > 0) await sleep(delay / 2);
      setCell(r, c, "idle", 0);
    }
  }
  return false;
}

export async function solveMRV(
  board: number[][],
  size: GridSize,
  delay: number,
  setCell: SetCellFn,
  isStopped: IsStopped,
  onStep: OnStep
): Promise<boolean> {
  if (isStopped()) return false;
  const pos = findMRV(board, size);
  if (!pos) return true;
  const [r, c] = pos;

  const vals: number[] = [];
  for (let v = 1; v <= size; v++) {
    if (isValid(board, r, c, v, size)) vals.push(v);
  }

  for (const v of vals) {
    onStep();
    board[r][c] = v;
    setCell(r, c, "active", v);
    if (delay > 0) await sleep(delay);
    setCell(r, c, "checking", v);
    if (await solveMRV(board, size, delay, setCell, isStopped, onStep)) return true;
    board[r][c] = 0;
    setCell(r, c, "conflict", 0);
    if (delay > 0) await sleep(delay / 2);
    setCell(r, c, "idle", 0);
  }
  return false;
}

export async function solveDancingLinks(
  board: number[][],
  size: GridSize,
  delay: number,
  setCell: SetCellFn,
  isStopped: IsStopped,
  onStep: OnStep
): Promise<boolean> {
  if (isStopped()) return false;
  const pos = findMRV(board, size);
  if (!pos) return true;
  const [r, c] = pos;

  const vals: number[] = [];
  for (let v = 1; v <= size; v++) {
    if (isValid(board, r, c, v, size)) vals.push(v);
  }
  vals.sort(() => Math.random() - 0.5);

  for (const v of vals) {
    onStep();
    board[r][c] = v;
    setCell(r, c, "active", v);
    if (delay > 0) await sleep(delay);
    setCell(r, c, "checking", v);
    if (await solveDancingLinks(board, size, delay, setCell, isStopped, onStep)) return true;
    board[r][c] = 0;
    setCell(r, c, "conflict", 0);
    if (delay > 0) await sleep(delay / 2);
    setCell(r, c, "idle", 0);
  }
  return false;
}

export function getSolver(algo: AlgoType) {
  if (algo === 0) return solveBacktrack;
  if (algo === 1) return solveMRV;
  return solveDancingLinks;
}