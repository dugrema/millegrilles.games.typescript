import React from "react";
import { GameProvider } from "../../games/flappybird/GameContext";
import FlappyBirdGame from "../../games/flappybird";

export default function FlappyBirdRoute() {
  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "0 auto",
        padding: "20px",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>
        Flappy Bird
      </h1>
      <GameProvider>
        <FlappyBirdGame />
      </GameProvider>
    </div>
  );
}
