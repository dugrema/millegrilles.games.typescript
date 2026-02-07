// millegrilles.games.typescript/vite-project/app/games/flappybird/components/GameOverlay.tsx
import React from "react";

export const GameOverlay: React.FC<{
  state: {
    status: "IDLE" | "PLAYING" | "PAUSED" | "GAME_OVER";
    bird: { x: number; y: number; rotation: number };
    pipes: Array<{ x: number; y: number; width: number; height: number }>;
    score: { current: number; highScore: number };
  };
  currentScore: number;
  highScore: number;
  startGame: () => void;
  onRestart: () => void;
}> = ({ state, currentScore, highScore, startGame, onRestart }) => {
  const handleStart = () => {
    startGame();
  };

  const handleRestart = () => {
    onRestart();
  };

  return (
    <>
      <style>
        {`
          @media (max-width: 649px) {
            .idle-header {
              display: none;
            }
          }
        `}
      </style>
      {state.status === "IDLE" && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
          }}
        >
          <div className="idle-header">
            <h1
              style={{
                color: "white",
                fontSize: "48px",
                marginBottom: "20px",
                fontFamily: "Arial, sans-serif",
              }}
            >
              Flappy Bird
            </h1>
            <p
              style={{
                color: "white",
                fontSize: "20px",
                marginBottom: "40px",
                fontFamily: "Arial, sans-serif",
              }}
            >
              Press SPACE or TAP to play
            </p>
          </div>
          <button
            onClick={handleStart}
            style={{
              padding: "15px 30px",
              fontSize: "24px",
              background: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontFamily: "Arial, sans-serif",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
            }}
          >
            START GAME
          </button>
        </div>
      )}
      {state.status === "GAME_OVER" && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
          }}
        >
          <h1
            style={{
              color: "#FF5722",
              fontSize: "48px",
              marginBottom: "20px",
              fontFamily: "Arial, sans-serif",
            }}
          >
            GAME OVER
          </h1>
          <p
            style={{
              color: "white",
              fontSize: "24px",
              marginBottom: "10px",
              fontFamily: "Arial, sans-serif",
            }}
          >
            Score: {state.score.current}
          </p>
          {state.score.current > state.score.highScore && (
            <p
              style={{
                color: "#FFD700",
                fontSize: "20px",
                marginBottom: "20px",
                fontFamily: "Arial, sans-serif",
              }}
            >
              New High Score!
            </p>
          )}
          <p
            style={{
              color: "#e0e0e0",
              fontSize: "18px",
              marginBottom: "40px",
              fontFamily: "Arial, sans-serif",
            }}
          >
            Press SPACE or TAP to restart
          </p>
          <button
            onClick={handleRestart}
            style={{
              padding: "15px 30px",
              fontSize: "24px",
              background: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontFamily: "Arial, sans-serif",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
            }}
          >
            PLAY AGAIN
          </button>
        </div>
      )}
      {state.status === "PAUSED" && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
          }}
        >
          <h2
            style={{
              color: "white",
              fontSize: "48px",
              fontFamily: "Arial, sans-serif",
            }}
          >
            PAUSED
          </h2>
        </div>
      )}
    </>
  );
};
