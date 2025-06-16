import React from "react"
import levels from "../configurations/levels.json"

export default function Collectibles({ world = "world1", onBack }) {
  // Get the collectibles image array for the selected world
  const collectibleImages = levels[world]["collectibles-1-images"] || []

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#222",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1>Food Group</h1>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "2rem",
          justifyContent: "center",
          margin: "2rem 0",
        }}
      >
        {collectibleImages.map((imgSrc, idx) => {
          // Extract filename without extension
          const fileName = imgSrc
            .split("/")
            .pop()
            .replace(/\.[^/.]+$/, "")
          return (
            <div
              key={idx}
              style={{
                background: "#333",
                borderRadius: "12px",
                padding: "1rem",
                textAlign: "center",
                boxShadow: "0 2px 8px #000a",
              }}
            >
              <img
                src={imgSrc}
                alt={`Collectible ${idx + 1}`}
                style={{ width: 64, height: 64, objectFit: "contain" }}
              />
              <div style={{ marginTop: "0.5rem" }}>{fileName}</div>
            </div>
          )
        })}
      </div>
      <button
        onClick={onBack}
        style={{
          marginTop: 30,
          padding: "10px 30px",
          fontSize: "1.1em",
          borderRadius: "8px",
          background: "#4caf50",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        Back
      </button>
    </div>
  )
}
