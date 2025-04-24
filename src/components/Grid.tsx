import type { Cell, GridSize } from "../types/sudoku";
import { getBoxDims } from "../utils/helpers";

interface Props {
  cells: Cell[][];
  size: GridSize;
  onCellClick: (r: number, c: number) => void;
  solving: boolean;
}

const CELL_COLORS: Record<string, string> = {
  idle: "#f2ede4",
  given: "#f2ede4",
  active: "#e8e0d0",
  checking: "#ddd8cc",
  conflict: "#c8b8a0",
  solved: "#bbb5aa",
};

export default function Grid({ cells, size, onCellClick, solving }: Props) {
  const { boxR, boxC } = getBoxDims(size);
  const cellSize = size === 16 ? 26 : size === 6 ? 40 : size === 3 ? 52 : 36;
  const fontSize = size === 16 ? 11 : size === 3 ? 20 : 15;

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: `repeat(${size}, ${cellSize}px)`,
      border: "2px solid #1a1a1a",
      background: "#1a1a1a",
      gap: "0",
      boxShadow: "4px 4px 0 rgba(0,0,0,0.15)",
    }}>
      {cells.map((row, r) =>
        row.map((cell, c) => {
          const isBoxRight = (c + 1) % boxC === 0 && c < size - 1;
          const isBoxBottom = (r + 1) % boxR === 0 && r < size - 1;

          return (
            <div
              key={`${r}_${c}`}
              onClick={() => !solving && !cell.given && onCellClick(r, c)}
              style={{
                width: `${cellSize}px`,
                height: `${cellSize}px`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Playfair Display', serif",
                fontSize: `${fontSize}px`,
                fontWeight: cell.given ? 700 : cell.state === "solved" ? 400 : 400,
                fontStyle: cell.state === "solved" ? "italic" : "normal",
                background: CELL_COLORS[cell.state],
                color: "#1a1a1a",
                borderRight: isBoxRight ? "2px solid #1a1a1a" : "0.5px solid rgba(0,0,0,0.2)",
                borderBottom: isBoxBottom ? "2px solid #1a1a1a" : "0.5px solid rgba(0,0,0,0.2)",
                cursor: cell.given || solving ? "default" : "pointer",
                transition: "background 0.08s",
                userSelect: "none",
              }}
            >
              {cell.value || ""}
            </div>
          );
        })
      )}
    </div>
  );
}