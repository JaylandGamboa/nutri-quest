import React from "react"

const worlds = [
  {
    key: "world1",
    name: "World 1: Go Unhealthy City",
    description: "A city filled with junk food and sugary snacks.",
  },
  {
    key: "world2",
    name: "World 2: Junk Factory",
    description:
      "A factory filled with processed foods and unhealthy snacks. (Coming Soon)",
  },
  {
    key: "world3",
    name: "World 3: Food Junkie Corporation Headquarters",
    description:
      "A corporate headquarters filled with unhealthy food options. (Coming Soon)",
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
