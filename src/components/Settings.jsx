import React from "react"

export default function Settings({
  isMuted,
  setIsMuted,
  volume,
  setVolume,
  onBack,
}) {
  return (
    <div
      style={{
        maxWidth: 400,
        margin: "40px auto",
        color: "#fff",
        textAlign: "center",
      }}
    >
      <h1>Settings</h1>
      <div style={{ margin: "20px 0" }}>
        <button
          onClick={() => setIsMuted((m) => !m)}
          style={{ marginRight: 10 }}
        >
          {isMuted ? "Unmute" : "Mute"}
        </button>
        <input
          type='range'
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          style={{ verticalAlign: "middle" }}
        />
      </div>
      <button onClick={onBack} style={{ marginTop: 30, padding: "10px 30px" }}>
        Back
      </button>
    </div>
  )
}
