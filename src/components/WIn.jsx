import React from "react"

export default function Win({ onRestart, onMenu }) {
  return (
    <div style={{ textAlign: "center", color: "#fff", marginTop: 60 }}>
      <h1>🏆 You Win!</h1>
      <p>Congratulations! You completed the level.</p>
      <button
        style={{ margin: 10, padding: "10px 30px", fontSize: "1.1em" }}
        onClick={onRestart}
      >
        Play Again
      </button>
      <button
        style={{ margin: 10, padding: "10px 30px", fontSize: "1.1em" }}
        onClick={onMenu}
      >
        Main Menu
      </button>
    </div>
  )
}
