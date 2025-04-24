import { formatDate } from "../utils/helpers";

export default function Header() {
  return (
    <header style={{
      textAlign: "center",
      borderBottom: "3px double #1a1a1a",
      padding: "20px 0 12px",
      marginBottom: "0",
      position: "relative",
    }}>
      <div style={{
        fontSize: "10px",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: "#666",
        fontFamily: "'Libre Baskerville', serif",
        marginBottom: "8px",
      }}>
        {formatDate()}
      </div>

      <h1 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "clamp(32px, 6vw, 58px)",
        fontWeight: 900,
        color: "#0d0d0d",
        letterSpacing: "-1px",
        lineHeight: 1,
        marginBottom: "6px",
      }}>
        MySudokuSolver
      </h1>

      <p style={{
        fontFamily: "'IM Fell English', serif",
        fontStyle: "italic",
        fontSize: "13px",
        color: "#555",
        letterSpacing: "0.04em",
      }}>
        Resolvez, visualisez, comprenez - trois algorithmes, une grille
      </p>

      <div style={{ height: "1px", background: "#1a1a1a", marginTop: "10px" }} />
    </header>
  );
}