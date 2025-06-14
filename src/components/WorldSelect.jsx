import React from "react"

const worlds = [
  {
    key: "world1",
    name: "Green Meadows",
    description: "A lush, vibrant land full of fresh veggies.",
  },
  {
    key: "world2",
    name: "Fruit Forest",
    description: "A sweet and colorful forest of fruits.",
  },
  {
    key: "world3",
    name: "Protein Peaks",
    description: "Mountains where strength is forged.",
  },
]

function WorldSelect({ onSelectWorld }) {
  return (
    <div
      style={{
        maxWidth: 600,
        margin: "40px auto",
        color: "#fff",
        textAlign: "center",
      }}
    >
      <h1>Select Your World</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          marginTop: 30,
        }}
      >
        {worlds.map((world) => (
          <button
            key={world.key}
            style={{
              padding: "18px",
              borderRadius: "10px",
              background: "#2196f3",
              color: "#fff",
              fontSize: "1.1em",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
            }}
            onClick={() => onSelectWorld(world.key)}
          >
            <strong>{world.name}</strong>
            <div style={{ fontSize: "0.95em", marginTop: 5 }}>
              {world.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default WorldSelect
