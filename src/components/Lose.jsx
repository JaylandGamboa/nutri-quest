import React from "react"

export default function Lose({ onRestart, onMenu }) {
  return (
    <div style={{ textAlign: "center", color: "#fff", marginTop: 60 }}>
      <h1>💀 Game Over</h1>
      <p>Don't give up! Try again to beat the level.</p>
      <button
        style={{ margin: 10, padding: "10px 30px", fontSize: "1.1em" }}
        onClick={onRestart}
      >
        Retry
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
