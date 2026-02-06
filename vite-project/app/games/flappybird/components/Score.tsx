// Score.tsx - Score display component
import React from "react";

interface ScoreProps {
  current: number;
  highScore?: number;
  isGameActive?: boolean;
}

export const Score: React.FC<ScoreProps> = ({
  current,
  highScore,
  isGameActive = true,
}) => {
  return (
    <>
      {/* Current score */}
      <div
        className="score-display"
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          fontSize: "48px",
          fontWeight: "bold",
          color: "white",
          fontFamily: "monospace",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
          zIndex: 10,
        }}
      >
        {current}
      </div>

      {/* High score */}
      {highScore !== undefined && (
        <div
          className="high-score-display"
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            fontSize: "18px",
            fontWeight: "bold",
            color: "rgba(255, 255, 255, 0.8)",
            fontFamily: "monospace",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
            zIndex: 10,
          }}
        >
          High Score: {highScore}
        </div>
      )}
    </>
  );
};
