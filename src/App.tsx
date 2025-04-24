import { useState, useCallback, useRef } from "react";
import "./App.css";
import Header from "./components/Header";
import Grid from "./components/Grid";
// import Sidebar from "./components/Sidebar";
import type { Cell, GridSize, AlgoType, SolveStats } from "./types/sudoku";
import { EXAMPLES, ALGOS } from "./types/sudoku";
import { getSolver } from "./utils/algorithms";

const DELAYS = [400, 150, 50, 8, 0];
const SPEED_LABELS = ["Tres lente", "Lente", "Normale", "Rapide", "Instantanee"];

function makeBoard(size: GridSize): Cell[][] {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => ({ value: 0, state: "idle" as const, given: false }))
  );
}

function loadExample(size: GridSize): Cell[][] {
  const ex = EXAMPLES[size];
  return ex.map(row =>
    row.map(v => ({ value: v, state: v !== 0 ? "given" as const : "idle" as const, given: v !== 0 }))
  );
}

const STATUS_LABELS: Record<string, string> = {
  idle: "En attente",
  solving: "Resolution...",
  solved: "Resolu",
  impossible: "Impossible",
  stopped: "Arrete",
};

export default function App() {
  const [size, setSize] = useState<GridSize>(9);
  const [algo, setAlgo] = useState<AlgoType>(0);
  const [delay, setDelay] = useState(50);
  const [cells, setCells] = useState<Cell[][]>(() => loadExample(9));
  const [solving, setSolving] = useState(false);
  const [stats, setStats] = useState<SolveStats>({ steps: 0, timeMs: 0, status: "idle" });
  const [speedIndex, setSpeedIndex] = useState(3);

  const stoppedRef = useRef(false);
  const stepsRef = useRef(0);
  const startRef = useRef(0);

  const handleSizeChange = (s: GridSize) => {
    stoppedRef.current = true;
    setSolving(false);
    setSize(s);
    setCells(loadExample(s));
    setStats({ steps: 0, timeMs: 0, status: "idle" });
  };

  const handleExample = () => {
    stoppedRef.current = true;
    setSolving(false);
    setCells(loadExample(size));
    setStats({ steps: 0, timeMs: 0, status: "idle" });
  };

  const handleClear = () => {
    stoppedRef.current = true;
    setSolving(false);
    setCells(makeBoard(size));
    setStats({ steps: 0, timeMs: 0, status: "idle" });
  };

  const handleStop = () => {
    stoppedRef.current = true;
    setSolving(false);
    setStats(s => ({ ...s, status: "stopped" }));
  };

  const handleCellClick = (r: number, c: number) => {
    setCells(prev => {
      const next = prev.map(row => row.map(cell => ({ ...cell })));
      next[r][c].value = (next[r][c].value + 1) % (size + 1);
      return next;
    });
  };

  const setCell = useCallback((r: number, c: number, state: string, val?: number) => {
    setCells(prev => {
      if (prev[r][c].given) return prev;
      const next = prev.map(row => row.map(cell => ({ ...cell })));
      next[r][c].state = state as Cell["state"];
      if (val !== undefined) next[r][c].value = val;
      return next;
    });
  }, []);

  const handleSolve = async () => {
    if (solving) return;
    stoppedRef.current = false;
    stepsRef.current = 0;
    startRef.current = performance.now();
    setSolving(true);
    setStats({ steps: 0, timeMs: 0, status: "solving" });

    const board = cells.map(row => row.map(cell => cell.value));
    const solver = getSolver(algo);
    const ok = await solver(
      board, size, delay,
      setCell,
      () => stoppedRef.current,
      () => {
        stepsRef.current++;
        if (stepsRef.current % 100 === 0) {
          setStats({
            steps: stepsRef.current,
            timeMs: Math.round(performance.now() - startRef.current),
            status: "solving",
          });
        }
      }
    );

    if (!stoppedRef.current) {
      if (ok) {
        setCells(prev => {
          const next = prev.map(row => row.map(cell => ({ ...cell })));
          for (let r = 0; r < size; r++)
            for (let c = 0; c < size; c++)
              if (!next[r][c].given) { next[r][c].value = board[r][c]; next[r][c].state = "solved"; }
          return next;
        });
        setStats({ steps: stepsRef.current, timeMs: Math.round(performance.now() - startRef.current), status: "solved" });
      } else {
        setStats({ steps: stepsRef.current, timeMs: Math.round(performance.now() - startRef.current), status: "impossible" });
      }
    }
    setSolving(false);
  };

  return (
    <>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=IM+Fell+English:ital@0;1&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap");
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f2ede4; }
        .journal-btn { background: transparent; border: 1px solid #333; font-family: 'Libre Baskerville', serif; font-size: 11px; color: #1a1a1a; padding: 5px 12px; cursor: pointer; letter-spacing: 0.04em; transition: all 0.15s; }
        .journal-btn:hover { background: #1a1a1a; color: #f2ede4; }
        .journal-btn.primary { background: #1a1a1a; color: #f2ede4; }
        .journal-btn.primary:hover { background: #333; }
        .algo-tab { padding: 5px 12px; font-family: 'Libre Baskerville', serif; font-size: 11px; background: transparent; color: #444; border: none; border-right: 1px solid #333; cursor: pointer; transition: all 0.15s; white-space: nowrap; }
        .algo-tab:last-child { border-right: none; }
        .algo-tab.active { background: #1a1a1a; color: #f2ede4; }
        .section-rule { border: none; border-top: 1px solid #1a1a1a; margin: 0; }
        .section-head { font-family: 'Playfair Display', serif; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #1a1a1a; text-align: center; padding: 6px 0; border-top: 2px solid #1a1a1a; border-bottom: 1px solid #1a1a1a; margin-bottom: 12px; }
        .col-rule { width: 1px; background: #1a1a1a; margin: 0 16px; }
        .stat-row { display: flex; justify-content: space-between; font-size: 11px; padding: 4px 0; border-bottom: 0.5px solid rgba(0,0,0,0.12); font-family: 'Libre Baskerville', serif; color: #444; }
        .stat-row:last-child { border-bottom: none; }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "#f2ede4",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E"), repeating-linear-gradient(180deg, transparent, transparent 27px, rgba(0,0,0,0.05) 27px, rgba(0,0,0,0.05) 28px)`,
        backgroundSize: "180px, auto",
      }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 24px 32px" }}>

          {/* Masthead */}
          <Header />

          {/* Ligne de navigation journalistique */}
          <div style={{ borderBottom: "1px solid #1a1a1a", borderTop: "1px solid #1a1a1a", display: "flex", justifyContent: "center", gap: "24px", padding: "5px 0", margin: "0" }}>
            {["Resoudre", "Visualiser", "Comprendre", "Algorithmes", "A propos"].map(item => (
              <span key={item} style={{ fontFamily: "'Libre Baskerville', serif", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#444", cursor: "default" }}>
                {item}
              </span>
            ))}
          </div>

          {/* Gros titre editorial */}
          <div style={{ textAlign: "center", borderBottom: "3px double #1a1a1a", padding: "20px 0 14px" }}>
            <p style={{ fontFamily: "'IM Fell English', serif", fontStyle: "italic", fontSize: "12px", color: "#666", marginBottom: "8px", letterSpacing: "0.04em" }}>
              Visualisation interactive des algorithmes de resolution
            </p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(22px, 4vw, 38px)", fontWeight: 900, color: "#0d0d0d", lineHeight: 1.1, marginBottom: "6px" }}>
              Trois Algorithmes, Une Grille, Infinite Logique
            </h2>
            <p style={{ fontFamily: "'Libre Baskerville', serif", fontSize: "12px", color: "#555", lineHeight: 1.6, maxWidth: "560px", margin: "0 auto" }}>
              Observez en temps reel comment le Backtracking, le Greedy MRV et les Dancing Links resolvent une grille de Sudoku. Choisissez votre algorithme, votre taille et votre vitesse.
            </p>
          </div>

          {/* Layout 3 colonnes style journal */}
          <div style={{ display: "grid", gridTemplateColumns: "200px 1fr 180px", gap: "0", paddingTop: "16px" }}>

            {/* Colonne gauche - Controles */}
            <div style={{ paddingRight: "16px", borderRight: "1px solid #1a1a1a" }}>

              <div className="section-head">Parametres</div>

              {/* Taille */}
              <div style={{ marginBottom: "16px" }}>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "12px", fontWeight: 700, color: "#1a1a1a", marginBottom: "6px" }}>
                  Taille de la grille
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  {([3, 6, 9, 16] as GridSize[]).map(s => (
                    <button
                      key={s}
                      onClick={() => handleSizeChange(s)}
                      className={`journal-btn${size === s ? " primary" : ""}`}
                      style={{ textAlign: "left", padding: "5px 10px" }}
                    >
                      {size === s ? ">" : ""} Grille {s}x{s}
                    </button>
                  ))}
                </div>
              </div>

              <hr className="section-rule" style={{ margin: "12px 0" }} />

              {/* Algorithme */}
              <div style={{ marginBottom: "16px" }}>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "12px", fontWeight: 700, color: "#1a1a1a", marginBottom: "6px" }}>
                  Algorithme
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  {ALGOS.map(a => (
                    <button
                      key={a.id}
                      onClick={() => setAlgo(a.id)}
                      className={`journal-btn${algo === a.id ? " primary" : ""}`}
                      style={{ textAlign: "left", padding: "5px 10px" }}
                    >
                      {algo === a.id ? ">" : ""} {a.roman}. {a.label}
                    </button>
                  ))}
                </div>
              </div>

              <hr className="section-rule" style={{ margin: "12px 0" }} />

              {/* Vitesse */}
              <div style={{ marginBottom: "16px" }}>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "12px", fontWeight: 700, color: "#1a1a1a", marginBottom: "6px" }}>
                  Vitesse
                </p>
                <input
                  type="range" min={1} max={5}
                  value={speedIndex}
                  onChange={e => {
                    const v = Number(e.target.value);
                    setSpeedIndex(v);
                    setDelay(DELAYS[v - 1]);
                  }}
                  style={{ width: "100%", accentColor: "#1a1a1a", marginBottom: "4px" }}
                />
                <p style={{ fontFamily: "'Libre Baskerville', serif", fontSize: "11px", color: "#555", textAlign: "center" }}>
                  {SPEED_LABELS[speedIndex - 1]}
                </p>
              </div>

              <hr className="section-rule" style={{ margin: "12px 0" }} />

              {/* Actions */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <button onClick={handleExample} className="journal-btn" style={{ width: "100%" }}>Charger exemple</button>
                <button onClick={handleClear} className="journal-btn" style={{ width: "100%" }}>Vider la grille</button>
                {solving
                  ? <button onClick={handleStop} className="journal-btn" style={{ width: "100%" }}>Pause</button>
                  : <button onClick={handleSolve} className="journal-btn primary" style={{ width: "100%" }}>Resoudre</button>
                }
              </div>

              <hr className="section-rule" style={{ margin: "16px 0 12px" }} />

              {/* Legende */}
              <div>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "12px", fontWeight: 700, color: "#1a1a1a", marginBottom: "8px" }}>Legende</p>
                {[
                  { color: "#e8e0d0", label: "Case active" },
                  { color: "#ddd8cc", label: "Verification" },
                  { color: "#c8b8a0", label: "Conflit" },
                  { color: "#bbb5aa", label: "Resolu" },
                ].map(l => (
                  <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "10px", color: "#555", padding: "2px 0", fontFamily: "'Libre Baskerville', serif" }}>
                    <div style={{ width: "12px", height: "12px", background: l.color, border: "0.5px solid rgba(0,0,0,0.2)", flexShrink: 0 }} />
                    {l.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Colonne centrale - Grille */}
            <div style={{ paddingLeft: "20px", paddingRight: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>

              <div className="section-head" style={{ width: "100%" }}>Grille {size}x{size}</div>

              <p style={{ fontFamily: "'IM Fell English', serif", fontStyle: "italic", fontSize: "11px", color: "#666", textAlign: "center", marginBottom: "16px", lineHeight: 1.6 }}>
                {ALGOS[algo].caption}
              </p>

              <Grid cells={cells} size={size} onCellClick={handleCellClick} solving={solving} />

              <p style={{ fontFamily: "'Libre Baskerville', serif", fontSize: "10px", color: "#888", marginTop: "12px", textAlign: "center", fontStyle: "italic" }}>
                Cliquez sur une case vide pour modifier sa valeur
              </p>
            </div>

            {/* Colonne droite - Stats */}
            <div style={{ paddingLeft: "16px", borderLeft: "1px solid #1a1a1a" }}>

              <div className="section-head">Statistiques</div>

              <div style={{ marginBottom: "16px" }}>
                {[
                  { label: "Etapes", value: stats.steps.toLocaleString() },
                  { label: "Temps", value: `${stats.timeMs} ms` },
                  { label: "Statut", value: STATUS_LABELS[stats.status] },
                  { label: "Grille", value: `${size}x${size}` },
                  { label: "Algo", value: ALGOS[algo].label },
                ].map(s => (
                  <div key={s.label} className="stat-row">
                    <span>{s.label}</span>
                    <span style={{ fontWeight: 700, color: "#1a1a1a" }}>{s.value}</span>
                  </div>
                ))}
              </div>

              <hr className="section-rule" style={{ margin: "12px 0" }} />

              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "12px", fontWeight: 700, color: "#1a1a1a", marginBottom: "8px" }}>
                A propos
              </p>
              <p style={{ fontSize: "10px", color: "#666", fontFamily: "'Libre Baskerville', serif", lineHeight: 1.7, marginBottom: "12px" }}>
                Backtracking explore toutes les possibilites de facon systematique. MRV priorise les cases les plus contraintes. Dancing Links utilise la couverture exacte de Knuth.
              </p>

              <hr className="section-rule" style={{ margin: "12px 0" }} />

              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "12px", fontWeight: 700, color: "#1a1a1a", marginBottom: "8px" }}>
                Complexite
              </p>
              {[
                { label: "Backtracking", value: "O(n!)" },
                { label: "Greedy MRV", value: "O(n log n)" },
                { label: "Dancing Links", value: "O(n)" },
              ].map(s => (
                <div key={s.label} className="stat-row">
                  <span>{s.label}</span>
                  <span style={{ fontWeight: 700, color: "#1a1a1a", fontStyle: "italic" }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer journal */}
          <div style={{ borderTop: "3px double #1a1a1a", marginTop: "24px", padding: "10px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "'IM Fell English', serif", fontStyle: "italic", fontSize: "11px", color: "#888" }}>
              MySudokuSolver - Vol. I, No. 1
            </span>
            <span style={{ fontFamily: "'IM Fell English', serif", fontStyle: "italic", fontSize: "11px", color: "#888" }}>
              @2026 Marieme KAMARA - Tous droits reserves
            </span>
          </div>

        </div>
      </div>
    </>
  );
}