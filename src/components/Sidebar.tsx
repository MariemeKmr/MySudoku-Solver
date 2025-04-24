import type { SolveStats, AlgoType } from "../types/sudoku";
import { ALGOS } from "../types/sudoku";

interface Props {
  stats: SolveStats;
  algo: AlgoType;
  size: number;
}

const STATUS_LABELS: Record<string, string> = {
  idle: "En attente",
  solving: "Resolution...",
  solved: "Resolu",
  impossible: "Impossible",
  stopped: "Arrete",
};

export default function Sidebar({ stats, algo, size }: Props) {
  return (
    <div style={{ width: "180px", display: "flex", flexDirection: "column", gap: "16px" }}>

      {/* Stats */}
      <div style={{ borderTop: "2px solid #1a1a1a", paddingTop: "10px" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "14px", fontWeight: 700, color: "#1a1a1a", marginBottom: "10px" }}>
          Statistiques
        </div>
        {[
          { label: "Etapes", value: stats.steps.toLocaleString() },
          { label: "Temps", value: `${stats.timeMs} ms` },
          { label: "Statut", value: STATUS_LABELS[stats.status] },
          { label: "Grille", value: `${size}x${size}` },
        ].map(s => (
          <div key={s.label} style={{
            display: "flex", justifyContent: "space-between",
            fontSize: "12px", color: "#444", padding: "4px 0",
            borderBottom: "0.5px solid rgba(0,0,0,0.1)",
            fontFamily: "'Libre Baskerville', serif",
          }}>
            <span>{s.label}</span>
            <span style={{ fontWeight: 700, color: "#1a1a1a" }}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Algorithme actif */}
      <div style={{ borderTop: "2px solid #1a1a1a", paddingTop: "10px" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "14px", fontWeight: 700, color: "#1a1a1a", marginBottom: "8px" }}>
          Algorithme
        </div>
        <p style={{ fontSize: "11px", color: "#555", fontFamily: "'Libre Baskerville', serif", lineHeight: 1.7, fontStyle: "italic" }}>
          {ALGOS[algo].caption}
        </p>
      </div>

      {/* Legende */}
      <div style={{ borderTop: "2px solid #1a1a1a", paddingTop: "10px" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "14px", fontWeight: 700, color: "#1a1a1a", marginBottom: "8px" }}>
          Legende
        </div>
        {[
          { color: "#e8e0d0", label: "Case active" },
          { color: "#ddd8cc", label: "Verification" },
          { color: "#c8b8a0", label: "Conflit" },
          { color: "#bbb5aa", label: "Resolu" },
        ].map(l => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "10px", color: "#555", padding: "2px 0", fontFamily: "'Libre Baskerville', serif" }}>
            <div style={{ width: "14px", height: "14px", background: l.color, border: "0.5px solid rgba(0,0,0,0.2)", flexShrink: 0 }} />
            {l.label}
          </div>
        ))}
      </div>

      {/* A propos */}
      <div style={{ borderTop: "2px solid #1a1a1a", paddingTop: "10px" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "14px", fontWeight: 700, color: "#1a1a1a", marginBottom: "8px" }}>
          A propos
        </div>
        <p style={{ fontSize: "10px", color: "#666", fontFamily: "'Libre Baskerville', serif", lineHeight: 1.7 }}>
          Trois algorithmes classiques de resolution de Sudoku avec visualisation pas a pas. Cliquez sur une case pour modifier sa valeur.
        </p>
      </div>
    </div>
  );
}