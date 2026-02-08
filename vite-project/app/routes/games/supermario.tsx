// Route component for Super Mario game with Phase 1.5 integration
import React, { useEffect } from "react";
import styled from "styled-components";
import { SuperMarioGameProvider, useSuperMario } from "../../games/supermario";
import Game from "../../games/supermario/Game";

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
`;

const GameWrapper = styled.div`
  position: relative;
  width: 800px;
  max-width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  overflow: hidden;
`;

const Header = styled.div`
  position: absolute;
  top: 10px;
  left: 0;
  right: 0;
  text-align: center;
  z-index: 20;
  padding: 10px;
`;

const HeaderTitle = styled.h1`
  margin: 0;
  font-size: 28px;
  color: #fff;
  text-shadow: 3px 3px 0 #000;
  font-family: "Arial Black", sans-serif;
  letter-spacing: 2px;
`;

const HeaderSubtitle = styled.p`
  margin: 5px 0 0 0;
  color: #ffff00;
  text-shadow: 2px 2px 0 #000;
  font-family: "Arial", sans-serif;
  font-size: 14px;
`;

const MobileControls = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    position: absolute;
    bottom: 20px;
    left: 0;
    right: 0;
    justify-content: space-between;
    padding: 0 20px;
    z-index: 30;
    pointer-events: none;

    button,
    .control-group {
      pointer-events: auto;
    }
  }
`;

// Export metadata
export function meta() {
  return [
    {
      title: "Super Mario – Arcade Style Game",
    },
    {
      name: "description",
      content:
        "Play Super Mario clone in your browser. Classic platformer action with smooth gameplay.",
    },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
  ];
}

// Inner component that uses the game context
function SuperMario() {
  const context = useSuperMario();
  if (!context)
    throw new Error("useSuperMario must be used within SuperMarioGameProvider");
  const { status, actions } = context;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Start/restart game from start status with 'r' key
      if (e.key.toLowerCase() === "r" && status === "start") {
        actions.startGame();
      }
      // Pause game with ESC
      if (e.key === "Escape") {
        if (status === "playing") {
          actions.pauseGame();
        } else if (status === "paused") {
          actions.resumeGame();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [status, actions]);

  // Show start screen when status is "start"
  if (status === "start") {
    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0, 0, 0, 0.9)",
          zIndex: 50,
          padding: "20px",
          textAlign: "center",
        }}
      >
        <strong
          style={{ color: "#ffff00", fontSize: "28px", marginBottom: "15px" }}
        >
          🍄 SUPER MARIO 🍄
        </strong>
        <p style={{ margin: "8px 0", fontSize: "16px", color: "#fff" }}>
          Platformer Adventure
        </p>
        <p style={{ margin: "8px 0", fontSize: "16px", color: "#fff" }}>
          Press "START" button or press "R" key to begin
        </p>
        <button
          onClick={actions.startGame}
          style={{
            marginTop: "25px",
            padding: "12px 35px",
            fontSize: "16px",
            background: "#ff6b6b",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontFamily: "Arial Black, sans-serif",
            textTransform: "uppercase",
            transition: "all 0.2s",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "#ff5252";
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "#ff6b6b";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          START GAME
        </button>
        <p
          style={{
            marginTop: "15px",
            fontSize: "14px",
            color: "#aaa",
          }}
        >
          Controls: Arrow Keys to move, SPACE to jump, SHIFT to run
        </p>
      </div>
    );
  }

  // Show game normally when playing or in other states
  return <Game />;
}

// Main route component
export default function SuperMarioRoute() {
  return (
    <PageContainer>
      <GameWrapper>
        <Header>
          <HeaderTitle>🍄 SUPER MARIO 🍄</HeaderTitle>
          <HeaderSubtitle>Platformer Adventure</HeaderSubtitle>
        </Header>

        <SuperMarioGameProvider>
          <SuperMario />

          <MobileControls>
            {/* Mobile touch controls would be implemented in Phase 8 */}
            <div className="control-group">
              <button>🎮</button>
            </div>
          </MobileControls>
        </SuperMarioGameProvider>
      </GameWrapper>
    </PageContainer>
  );
}
