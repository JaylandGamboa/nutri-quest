import React from "react"

export default function Story({ onContinue }) {
  return (
    <div
      style={{
        maxWidth: 600,
        margin: "40px auto",
        color: "#fff",
        textAlign: "center",
      }}
    >
      <h1>Nutri-Quest: The Adventure Begins</h1>
      <p>
        In a world where healthy food is scarce, you are the last hope! Embark
        on a journey through mysterious lands, collect nutritious foods, and
        defeat the junk food minions threatening your village.
      </p>
      <p>Will you restore balance and become the hero your world needs?</p>
      <button
        style={{
          marginTop: 30,
          padding: "12px 32px",
          fontSize: "1.2em",
          borderRadius: "8px",
          background: "#4caf50",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
        onClick={onContinue}
      >
        Continue
      </button>
    </div>
  )
}
