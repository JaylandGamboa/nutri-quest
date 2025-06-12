import React from "react"

const menuBtnStyle = {
  padding: "1rem 2.5rem",
  margin: "1rem",
  fontSize: "1.2rem",
  borderRadius: "8px",
  border: "none",
  background: "#0f3460",
  color: "#fff",
  cursor: "pointer",
  transition: "background 4.2s",
}

class MainMenu extends React.Component {
  render() {
    const { onStart, onHowToPlay, onQuit } = this.props
    return (
      <div
        style={{
          background: "#1a1a2e",
          color: "#fff",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <h1 style={{ fontSize: "3rem", marginBottom: "2rem" }}>Nutri Quest</h1>
        <button style={menuBtnStyle} onClick={onStart}>
          Start Game
        </button>
        <button style={menuBtnStyle} onClick={onHowToPlay}>
          How to Play
        </button>
        <button style={menuBtnStyle} onClick={onQuit}>
          Quit
        </button>
      </div>
    )
  }
}

export default MainMenu
