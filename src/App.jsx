import { useState } from "react"
import MainMenu from "./components/MainMenu"
import Story from "./components/Story"
import WorldSelect from "./components/WorldSelect"
import GameCanvas from "./components/Canvas"
import Win from "./components/Win"
import Lose from "./components/Lose"
import Settings from "./components/Settings"
import levels from "./configurations/levels.json"
import Collectibles from "./components/Collectibles"
import "./App.css"

export default function App() {
  const [screen, setScreen] = useState("menu")

  const [selectedWorld, setSelectedWorld] = useState(null)
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.5)

  // Get level keys for the selected world
  const levelKeys =
    selectedWorld && levels[selectedWorld]
      ? Object.keys(levels[selectedWorld]).filter((key) =>
          key.startsWith("level")
        )
      : []

  function handleWin() {
    setScreen("win")
  }
  function handleLose() {
    setScreen("lose")
  }
  function handleMenu() {
    setScreen("menu")
    setSelectedWorld(null)
    setCurrentLevelIndex(0)
  }
  function handleRestart() {
    setScreen("game")
  }
  function handleNextLevel() {
    if (currentLevelIndex < levelKeys.length - 1) {
      setCurrentLevelIndex(currentLevelIndex + 1)
      setScreen("game")
    } else {
      setScreen("menu")
      setSelectedWorld(null)
      setCurrentLevelIndex(0)
    }
  }

  if (screen === "menu")
    return (
      <MainMenu
        onStart={() => setScreen("story")}
        onSettings={() => setScreen("settings")}
        onCollectibles={() => setScreen("collectibles")}
      />
    )
  if (screen === "story")
    return <Story onContinue={() => setScreen("world-select")} />
  if (screen === "world-select")
    return (
      <WorldSelect
        onSelectWorld={(world) => {
          setSelectedWorld(world)
          setCurrentLevelIndex(0)
          setScreen("game")
        }}
      />
    )
  if (screen === "menu")
    return (
      <MainMenu
        onStart={() => setScreen("story")}
        onCollectibles={() => setScreen("collectibles")}
        onSettings={() => setScreen("settings")}
      />
    )
  if (screen === "settings")
    return (
      <Settings
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        volume={volume}
        setVolume={setVolume}
        onBack={() => setScreen("menu")}
      />
    )
  if (screen === "collectibles")
    return (
      <Collectibles
        world={selectedWorld || "world1"}
        onBack={() => setScreen("menu")}
      />
    )
  if (screen === "game" && selectedWorld && levelKeys.length > 0)
    return (
      <GameCanvas
        world={selectedWorld}
        levelKey={levelKeys[currentLevelIndex]}
        onWin={handleWin}
        onLose={handleLose}
        isMuted={isMuted}
        volume={volume}
        onMenu={() => setScreen("menu")}
      />
    )
  if (screen === "win")
    return (
      <Win
        onRestart={handleNextLevel}
        onMenu={handleMenu}
        isLastLevel={currentLevelIndex === levelKeys.length - 1}
      />
    )
  if (screen === "lose")
    return <Lose onRestart={handleRestart} onMenu={handleMenu} />
  return null
}
