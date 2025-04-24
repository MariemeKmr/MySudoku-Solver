import type { AlgoType, GridSize } from "../types/sudoku";
import { ALGOS } from "../types/sudoku";

interface Props {
  size: GridSize;
  algo: AlgoType;
  delay: number;
  onSizeChange: (s: GridSize) => void;
  onAlgoChange: (a: AlgoType) => void;
  onDelayChange: (d: number) => void;
  onSolve: () => void;
  onStop: () => void;
  onExample: () => void;
  onClear: () => void;
  solving: boolean;
}

const DELAYS = [400, 150, 50, 8, 0];
const SPEED_LABELS = ["Tres lente", "Lente", "Normale", "Rapide", "Instantanee"];

export default function Toolbar({
  size, algo, delay,
  onSizeChange, onAlgoChange, onDelayChange,
  onSolve, onStop, onExample, onClear, solving,
}: Props) {
  const speedIndex = DELAYS.indexOf(delay) + 1 || 3;

  return (
    <div style={{
      display: "flex",
      gap: "16px",
      flexWrap: "wrap",
      alignItems: "flex-end",
      borderBottom: "1px solid #1a1a1a",
      padding: "12px 0",
    }}>

      {/* Taille */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <span style={{ fontSize: "8px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#777", fontFamily: "'Libre Baskerville', serif" }}>
          Taille
        </span>
        <select
          value={size}
          onChange={e => onSizeChange(Number(e.target.value) as GridSize)}
          style={{
            background: "transparent",
            border: "1px solid #333",
            padding: "4px 8px",
            fontFamily: "'Libre Baskerville', serif",
            fontSize: "12px",
            color: "#1a1a1a",
            cursor: "pointer",
            borderRadius: "0",
          }}
        >
          <option value={3}>3x3</option>
          <option value={6}>6x6</option>
          <option value={9}>9x9</option>
          <option value={16}>16x16</option>
        </select>
      </div>

      {/* Algorithme */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <span style={{ fontSize: "8px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#777", fontFamily: "'Libre Baskerville', serif" }}>
          Algorithme
        </span>
        <div style={{ display: "flex", border: "1px solid #333" }}>
          {ALGOS.map((a, i) => (
            <button
              key={a.id}
              onClick={() => onAlgoChange(a.id)}
              style={{
                padding: "5px 12px",
                fontFamily: "'Libre Baskerville', serif",
                fontSize: "11px",
                background: algo === a.id ? "#1a1a1a" : "transparent",
                color: algo === a.id ? "#f2ede4" : "#444",
                border: "none",
                borderRight: i < ALGOS.length - 1 ? "1px solid #333" : "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.15s",
              }}
            >
              {a.roman}. {a.label}
            </button>
          ))}
        </div>
      </div>

      {/* Vitesse */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1, minWidth: "160px" }}>
        <span style={{ fontSize: "8px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#777", fontFamily: "'Libre Baskerville', serif" }}>
          Vitesse de visualisation
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "10px", color: "#777" }}>Lente</span>
          <input
            type="range" min={1} max={5}
            value={speedIndex}
            onChange={e => onDelayChange(DELAYS[Number(e.target.value) - 1])}
            style={{ flex: 1, accentColor: "#1a1a1a" }}
          />
          <span style={{ fontSize: "10px", color: "#777" }}>Rapide</span>
          <span style={{ fontSize: "11px", fontWeight: 700, fontFamily: "'Libre Baskerville', serif", minWidth: "80px" }}>
            {SPEED_LABELS[speedIndex - 1]}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        <button onClick={onExample} style={btnStyle(false)}>Exemple</button>
        <button onClick={onClear} style={btnStyle(false)}>Vider</button>
        {solving ? (
          <button onClick={onStop} style={btnStyle(false)}>Pause</button>
        ) : (
          <button onClick={onSolve} style={btnStyle(true)}>Resoudre</button>
        )}
      </div>
    </div>
  );
}

function btnStyle(primary: boolean): React.CSSProperties {
  return {
    background: primary ? "#1a1a1a" : "transparent",
    border: "1px solid #333",
    fontFamily: "'Libre Baskerville', serif",
    fontSize: "11px",
    color: primary ? "#f2ede4" : "#1a1a1a",
    padding: "6px 12px",
    cursor: "pointer",
    letterSpacing: "0.04em",
    transition: "all 0.15s",
  };
}