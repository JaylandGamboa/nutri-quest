import { useState } from "react"
import "./App.css"
import GameCanvas from "./components/canvas"
import MainMenu from "./components/MainMenu"
export default function App() {
  const [showMenu, setShowMenu] = useState(true)

  return showMenu ? (
    <MainMenu
      onStart={() => setShowMenu(false)}
      onHowToPlay={() =>
        alert("Use arrow keys/WASD to move, space to shoot. Collect all food!")
      }
      onQuit={() => window.close()}
    />
  ) : (
    <GameCanvas />
  )
}
