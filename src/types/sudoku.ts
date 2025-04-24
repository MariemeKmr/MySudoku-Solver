export type CellState = "idle" | "given" | "active" | "checking" | "conflict" | "solved";

export type AlgoType = 0 | 1 | 2;

export type GridSize = 3 | 6 | 9 | 16;

export interface Cell {
  value: number;
  state: CellState;
  given: boolean;
}

export interface SolveStats {
  steps: number;
  timeMs: number;
  status: "idle" | "solving" | "solved" | "impossible" | "stopped";
}

export interface AlgoInfo {
  id: AlgoType;
  label: string;
  roman: string;
  caption: string;
}

export const ALGOS: AlgoInfo[] = [
  {
    id: 0,
    roman: "I",
    label: "Backtracking",
    caption: "Force brute recursive - explore chaque possibilite jusqu'a trouver la solution",
  },
  {
    id: 1,
    roman: "II",
    label: "Greedy MRV",
    caption: "Greedy + MRV - choisit d'abord la case avec le moins de possibilites",
  },
  {
    id: 2,
    roman: "III",
    label: "Dancing Links",
    caption: "Algorithme X de Knuth - couverture exacte avec colonnes dansantes",
  },
];

export const EXAMPLES: Record<GridSize, number[][]> = {
  3: [
    [0, 0, 1],
    [1, 0, 0],
    [0, 1, 0],
  ],
  6: [
    [5, 3, 0, 0, 7, 0],
    [6, 0, 0, 1, 9, 5],
    [0, 9, 8, 0, 0, 0],
    [8, 0, 0, 0, 6, 0],
    [4, 0, 0, 8, 0, 3],
    [7, 0, 0, 0, 2, 0],
  ],
  9: [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
  ],
  16: Array.from({ length: 16 }, (_, i) =>
    Array.from({ length: 16 }, (_, j) => (i === 0 && j < 4 ? j + 1 : 0))
  ),
};