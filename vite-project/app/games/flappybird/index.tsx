import React, { useEffect, useRef } from "react";

import { Bird } from "./components/Bird";
import { Pipes } from "./components/Pipes";
import { Score } from "./components/Score";
import { GameOverlay } from "./components/GameOverlay";
import MobileHeader from "./components/MobileHeader";

import type { GameState } from "./types";
import { CANVAS_WIDTH, CANVAS_HEIGHT, COLORS } from "./constants";
import { useGameLogic } from "./useGameLogic";

function FlappyBird() {
  const { state, jump, startGame, pauseGame, restartGame } = useGameLogic();

  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  /* ---------- Keyboard & touch controls ---------- */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        switch (state.status) {
          case "IDLE":
          case "GAME_OVER":
            startGame();
            break;
          case "PLAYING":
            jump();
            break;
          case "PAUSED":
            pauseGame();
            break;
        }
      }

      if (e.code === "KeyP") {
        e.preventDefault();
        if (state.status === "PLAYING" || state.status === "PAUSED") {
          pauseGame();
        }
      }

      if (e.code === "Enter") {
        e.preventDefault();
        restartGame();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      switch (state.status) {
        case "IDLE":
        case "GAME_OVER":
          startGame();
          break;
        case "PLAYING":
        case "PAUSED":
          jump();
          break;
      }
    };

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener("keydown", handleKeyDown);
      canvas.addEventListener("touchstart", handleTouchStart, {
        passive: false,
      });
      canvas.focus();
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener("keydown", handleKeyDown);
        canvas.removeEventListener("touchstart", handleTouchStart);
      }
    };
  }, [state.status, jump, startGame, pauseGame, restartGame]);

  /* ---------- Window resize for responsive design ---------- */
  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      if (container) {
        const maxWidth = Math.min(window.innerWidth - 32, CANVAS_WIDTH);
        const maxHeight = Math.min(window.innerHeight - 32, CANVAS_HEIGHT);
        const scale = Math.min(
          maxWidth / CANVAS_WIDTH,
          maxHeight / CANVAS_HEIGHT,
        );
        container.style.transform = `scale(${scale})`;
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <style>{`
          @keyframes scrollGround {
            0% { background-position: 0 0; }
            100% { background-position: -800px 0; }
          }
          .ground {
            animation: scrollGround 3s linear infinite;
          }
          .game-container {
          }
          @media (max-width: 649px) {
            .game-container {
              margin-top: -40px;
            }
          }
        `}</style>
      <div
        ref={containerRef}
        className="game-container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
          background: "#2c3e50",
          padding: "16px",
          overflow: "hidden",
        }}
      >
        <div
          ref={canvasRef}
          tabIndex={0}
          style={{
            position: "relative",
            width: `${CANVAS_WIDTH}px`,
            height: `${CANVAS_HEIGHT}px`,
            background: `linear-gradient(to bottom, ${COLORS.SKY_TOP}, ${COLORS.SKY_BOTTOM})`,
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 8x 16px rgba(0, 0, 0, 0.3)",
          }}
        >
          {/* Mobile header (Exit + Pause/Resume) */}
          <MobileHeader />

          {/* Score display */}
          <Score
            current={state.score.current}
            highScore={state.score.highScore}
          />

          {/* Game canvas content */}
          <Bird bird={state.bird} />
          <Pipes pipes={state.pipes} />

          {/* Ground */}
          <div
            className="ground"
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "100px",
              background: `linear-gradient(to bottom, ${COLORS.GROUND}, ${COLORS.GROUND_GRASS})`,
              borderTop: `4px solid ${COLORS.GROUND_GRASS}`,
              backgroundSize: "2000px 100px",
            }}
          >
            {/* Grass texture */}
            <div
              style={{
                position: "absolute",
                top: "8px",
                left: "0",
                right: "0",
                height: "8px",
                background:
                  "repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(0,0,0,0.1) 20px, rgba(0,0,0,0.1) 40px)",
              }}
            />
          </div>

          {/* Game overlay */}
          <GameOverlay
            currentScore={state.score.current}
            highScore={state.score.highScore}
            state={state}
            startGame={startGame}
            onRestart={restartGame}
          />
        </div>
      </div>
    </>
  );
}

export default FlappyBird;
