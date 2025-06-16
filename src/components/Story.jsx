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
      <h1>Nutri-Quest: Battle of Balanced Diet</h1>
      <p>
        People used to live healthy lives. However, they started losing their
        appetite because their food was bland and they got bored. A group of
        researchers studied how to improve the flavor of food to make it more
        appealing and delicious. Eventually, they succeeded in creating tastier
        and flavorful food, and introduced it to them. The public instantly
        loved it. But as time passed, people began to experience health
        problems. They became weak and more sickly. To solve this, experts and
        the community created guidelines to promote balanced health. This is
        when the Food Pyramid was born, consisting of the three main food
        groups: Go, Glow, and Grow. The group that first made tasty food was not
        happy with this. They formed a corporation called Food Junkie and
        plotted to destroy the Food Pyramid. They wanted to replace the
        nutritious foods in the pyramid with junk food, to once again control
        what people would eat. But there’s one nutritionist who stood up against
        them. His mission is to recover the Nutritious Food Group and once again
        teach the people the value of proper nutrition and balanced diet.
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
