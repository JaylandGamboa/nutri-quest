import { useState } from "react"
import MainMenu from "./components/MainMenu"
import Story from "./components/Story"
import WorldSelect from "./components/WorldSelect"
import GameCanvas from "./components/Canvas"
import Win from "./components/Win"
import Lose from "./components/Lose"

export default function App() {
  const [screen, setScreen] = useState("menu")
  const [selectedWorld, setSelectedWorld] = useState(null)

  // Example handlers for win/lose
  function handleRestart() {
    setScreen("game") // or reset your game state as needed
  }
  function handleMenu() {
    setScreen("menu")
    setSelectedWorld(null)
  }
  function handleWin() {
    setScreen("win")
  }
  function handleLose() {
    setScreen("lose")
  }
  if (screen === "menu") return <MainMenu onStart={() => setScreen("story")} />
  if (screen === "story")
    return <Story onContinue={() => setScreen("world-select")} />
  if (screen === "world-select")
    return (
      <WorldSelect
        onSelectWorld={(world) => {
          setSelectedWorld(world)
          setScreen("game")
        }}
      />
    )
  if (screen === "game")
    return (
      <GameCanvas world={selectedWorld} onWin={handleWin} onLose={handleLose} />
    )
  if (screen === "win")
    return (
      <Win
        onRestart={() => setScreen("game")}
        onMenu={() => setScreen("menu")}
      />
    )
  if (screen === "lose")
    return (
      <Lose
        onRestart={() => setScreen("game")}
        onMenu={() => setScreen("menu")}
      />
    )
  return null
}
