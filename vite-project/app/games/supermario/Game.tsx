import React, { useEffect, useRef } from "react";
import styled, { keyframes, css } from "styled-components";
import { useGameLogic } from "./useGameLogic";
import MobileHeader from "./components/MobileHeader";
import GameOverlay from "./components/GameOverlay";
import Score from "./components/Score";
import LivesDisplay from "./components/LivesDisplay";
import LevelIndicator from "./components/LevelIndicator";
import TransitionOverlay from "./components/TransitionOverlay";
import Particles from "./components/Particles";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  GROUND_HEIGHT,
  MARIO_WIDTH,
  MARIO_HEIGHT,
  COLORS,
  FLAGPOLE_WIDTH,
  FLAGPOLE_HEIGHT,
  FLAG_WIDTH,
  FLAG_HEIGHT,
  FLAG_COLOR,
  FLAGPOLE_BASE_WIDTH,
  FLAGPOLE_BASE_HEIGHT,
  FLAGPOLE_BASE_COLOR,
  FLAGPOLE_COLOR,
  ENEMY_WIDTH,
  ENEMY_HEIGHT,
  ENEMY_COLOR,
  COIN_WIDTH,
  COIN_HEIGHT,
  COIN_COLOR,
  PLATFORM_COLOR,
  PLATFORM_TOP_COLOR,
  BRICK_BLOCK_COLOR,
  QUESTION_BLOCK_COLOR,
  HARD_BLOCK_COLOR,
  MUSHROOM_CAP_COLOR,
  MUSHROOM_STEM_COLOR,
  MUSHROOM_SPOT_COLOR,
  MUSHROOM_1UP_COLOR,
  MUSHROOM_1UP_TEXT_COLOR,
  MUSHROOM_WIDTH,
  MUSHROOM_HEIGHT,
  BIG_MARIO_HEIGHT,
} from "./constants";

const GameContainer = styled.div`
  position: relative;
  width: ${CANVAS_WIDTH}px;
  height: ${CANVAS_HEIGHT}px;
  background: linear-gradient(
    to bottom,
    ${COLORS.SKY_TOP},
    ${COLORS.SKY_BOTTOM}
  );
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  user-select: none;
`;

/* Flash animation for invulnerability */
const flashAnimation = keyframes`
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0.3; }
`;

const MarioDiv = styled.div<{
  $facingRight: boolean;
  $isBig?: boolean;
  $invulnerable?: number;
}>`
  position: absolute;
  width: ${MARIO_WIDTH}px;
  height: ${(props) => (props.$isBig ? BIG_MARIO_HEIGHT : MARIO_HEIGHT)}px;
  background: ${COLORS.MARIO_RED};
  border-radius: 4px;
  transform: ${(props) => (props.$facingRight ? "scaleX(1)" : "scaleX(-1)")};
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);

  ${(props) =>
    props.$invulnerable &&
    props.$invulnerable > 0 &&
    css`
      animation: ${flashAnimation} 0.1s linear infinite;
    `}

  /* Mario's overall/blue pants */
  &::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 4px;
    right: 4px;
    height: 12px;
    background: ${COLORS.MARIO_OVERALL};
    border-radius: 2px;
  }

  /* Mario's hat brim */
  &::after {
    content: "";
    position: absolute;
    top: 4px;
    left: 0;
    width: 100%;
    height: 6px;
    background: ${COLORS.MARIO_RED};
    border-radius: 2px;
  }
`;

const MushroomDiv = styled.div<{ $type?: string }>`
  position: absolute;
  width: ${MUSHROOM_WIDTH}px;
  height: ${MUSHROOM_HEIGHT}px;
  pointer-events: none;

  /* Mushroom cap - red for SUPER, green for 1UP */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 16px;
    background: ${(props) =>
      props.$type === "1UP" ? MUSHROOM_1UP_COLOR : MUSHROOM_CAP_COLOR};
    border-radius: 16px 16px 0 0;

    /* White spots on cap (only for SUPER) */
    ${(props) =>
      props.$type !== "1UP" &&
      `
      &::after {
        content: "";
        position: absolute;
        top: 4px;
        left: 6px;
        width: 6px;
        height: 6px;
        background: ${MUSHROOM_SPOT_COLOR};
        border-radius: 50%;
        box-shadow:
          12px 0 0 ${MUSHROOM_SPOT_COLOR},
          6px 6px 0 ${MUSHROOM_SPOT_COLOR};
      }
    `}
  }

  /* Mushroom stem (beige) */
  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 8px;
    right: 8px;
    height: 16px;
    background: ${MUSHROOM_STEM_COLOR};
    border-radius: 0 0 4px 4px;
  }

  /* 1UP text indicator */
  ${(props) =>
    props.$type === "1UP" &&
    `
    &::before {
      content: "1UP";
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: bold;
      color: ${MUSHROOM_1UP_TEXT_COLOR};
    }
    &::after {
      content: none;
    }
  `}
`;

const GroundDiv = styled.div<{ $width: number; $height: number }>`
  position: absolute;
  width: ${(props) => props.$width}px;
  height: ${(props) => props.$height}px;
  background: ${COLORS.GROUND_BROWN};
  border-top: 8px solid ${COLORS.GROUND_GRASS};
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
`;

const PipeDiv = styled.div<{ height: number }>`
  position: absolute;
  width: 50px;
  height: ${(props) => props.height}px;
  background: ${COLORS.PIPE_GREEN};
  border: 3px solid ${COLORS.PIPE_DARK_GREEN};
  border-radius: 4px;
`;

const FlagpoleDiv = styled.div<{ x: number; y: number }>`
  position: absolute;
  left: ${(props) => props.x}px;
  top: ${(props) => props.y}px;
  width: ${FLAGPOLE_WIDTH}px;
  height: ${FLAGPOLE_HEIGHT}px;
  background: ${FLAGPOLE_COLOR}; // Olive green pole
`;

const FlagpoleBaseDiv = styled.div<{ x: number; y: number }>`
  position: absolute;
  left: ${(props) => props.x}px;
  top: ${(props) => props.y}px;
  width: ${FLAGPOLE_BASE_WIDTH}px;
  height: ${FLAGPOLE_BASE_HEIGHT}px;
  background: ${FLAGPOLE_BASE_COLOR}; // Olive green base
  border: 3px solid ${COLORS.PIPE_DARK_GREEN};
  border-radius: 4px 4px 0 0;
`;

const FlagDiv = styled.div<{ x: number; y: number }>`
  position: absolute;
  left: ${(props) => props.x}px;
  top: ${(props) => props.y}px;
  width: ${FLAG_WIDTH}px;
  height: ${FLAG_HEIGHT}px;
  background: ${FLAG_COLOR};
  border-radius: 2px;
`;

const EnemyDiv = styled.div`
  position: absolute;
  width: ${ENEMY_WIDTH}px;
  height: ${ENEMY_HEIGHT}px;
  background: ${ENEMY_COLOR};
  border-radius: 4px 4px 0 0;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);

  /* Enemy eyes */
  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 8px;
    width: 6px;
    height: 6px;
    background: white;
    border-radius: 50%;
  }

  &::before {
    left: 6px;
  }

  &::after {
    right: 6px;
  }
`;

const CoinDiv = styled.div`
  position: absolute;
  width: ${COIN_WIDTH}px;
  height: ${COIN_HEIGHT}px;
  background: ${COIN_COLOR};
  border: 2px solid #ffa500;
  border-radius: 50%;
  box-shadow: 0 0 8px ${COIN_COLOR};
`;

const PlatformDiv = styled.div<{
  $width: number;
  $height: number;
  $type?: string;
}>`
  position: absolute;
  width: ${(props) => props.$width}px;
  height: ${(props) => props.$height}px;
  background: ${PLATFORM_COLOR};
  border-top: 4px solid ${PLATFORM_TOP_COLOR};
  border-radius: 2px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const BlockDiv = styled.div<{ $type: string; $used: boolean }>`
  position: absolute;
  width: 40px;
  height: 40px;
  background: ${(props) => {
    if (props.$used && props.$type === "QUESTION") return HARD_BLOCK_COLOR;
    if (props.$type === "QUESTION") return QUESTION_BLOCK_COLOR;
    if (props.$type === "BRICK") return BRICK_BLOCK_COLOR;
    return HARD_BLOCK_COLOR;
  }};
  border: 2px solid rgba(0, 0, 0, 0.3);
  border-radius: 2px;

  ${(props) =>
    props.$type === "QUESTION" &&
    !props.$used &&
    `
    display: flex;
    align-items: center;
    justify-content: center;

    &::after {
      content: "?";
      font-size: 24px;
      font-weight: bold;
      color: #8B4513;
    }
  `}

  ${(props) =>
    props.$type === "BRICK" &&
    `
    background-image: linear-gradient(
      45deg,
      transparent 48%,
      rgba(0, 0, 0, 0.1) 48%,
      rgba(0, 0, 0, 0.1) 52%,
      transparent 52%
    );
    background-size: 10px 10px;
  `}
`;

const CameraTransform = styled.div`
  will-change: transform;
`;

const Game: React.FC = () => {
  const {
    state,
    jump,
    moveLeft,
    moveRight,
    stop,
    startGame,
    pauseGame,
    restartGame,
    getTransitionState,
  } = useGameLogic();

  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const keysPressed = useRef<Set<string>>(new Set());

  /* ---------- Keyboard controls ---------- */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.code);

      switch (e.code) {
        case "ArrowLeft":
        case "KeyA":
          e.preventDefault();
          if (state.status.state === "PLAYING") {
            const isRunning =
              keysPressed.current.has("ShiftRight") ||
              keysPressed.current.has("ShiftLeft");
            moveLeft(isRunning);
          }
          break;

        case "ArrowRight":
        case "KeyD":
          e.preventDefault();
          if (state.status.state === "PLAYING") {
            const isRunning =
              keysPressed.current.has("ShiftRight") ||
              keysPressed.current.has("ShiftLeft");
            moveRight(isRunning);
          }
          break;

        case "ArrowUp":
        case "Space":
        case "KeyW":
          e.preventDefault();
          if (
            state.status.state === "IDLE" ||
            state.status.state === "GAME_OVER"
          ) {
            startGame();
          } else if (state.status.state === "PLAYING") {
            jump();
          }
          break;

        case "KeyP":
        case "Escape":
          e.preventDefault();
          if (
            state.status.state === "PLAYING" ||
            state.status.state === "PAUSED"
          ) {
            pauseGame();
          }
          break;

        case "Enter":
          e.preventDefault();
          if (
            state.status.state === "GAME_OVER" ||
            state.status.state === "IDLE"
          ) {
            restartGame();
          }
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.code);

      switch (e.code) {
        case "ArrowLeft":
        case "KeyA":
        case "ArrowRight":
        case "KeyD":
          if (state.status.state === "PLAYING") {
            stop();
          }
          break;
      }
    };

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener("keydown", handleKeyDown);
      canvas.addEventListener("keyup", handleKeyUp);
      canvas.focus();
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener("keydown", handleKeyDown);
        canvas.removeEventListener("keyup", handleKeyUp);
      }
    };
  }, [
    state.status,
    jump,
    moveLeft,
    moveRight,
    stop,
    startGame,
    pauseGame,
    restartGame,
  ]);

  /* ---------- Continuous movement based on held keys ---------- */
  useEffect(() => {
    if (state.status !== "PLAYING") return;

    const interval = setInterval(() => {
      const isRunning =
        keysPressed.current.has("ShiftRight") ||
        keysPressed.current.has("ShiftLeft");

      if (
        keysPressed.current.has("ArrowLeft") ||
        keysPressed.current.has("KeyA")
      ) {
        moveLeft(isRunning);
      }
      if (
        keysPressed.current.has("ArrowRight") ||
        keysPressed.current.has("KeyD")
      ) {
        moveRight(isRunning);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [state.status, moveLeft, moveRight]);

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
    <div
      ref={containerRef}
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
      <GameContainer
        ref={canvasRef}
        tabIndex={0}
        role="application"
        aria-label="Super Mario Game"
      >
        {/* Mobile header (Exit + Pause/Resume) */}
        <MobileHeader />

        {/* Score display and level indicator */}
        <div
          style={{
            position: "absolute",
            top: "8px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "16px",
            zIndex: 10,
          }}
        >
          <Score
            currentScore={state.score.score}
            coinCount={state.score.coins}
            highScore={state.score.highScore}
            currentTime={state.score.currentTime || 400}
          />
          <LevelIndicator
            world={state.status.currentWorld}
            level={state.status.currentLevel}
          />
          <LivesDisplay />
        </div>

        {/* Particles overlay - inside CameraTransform so particles scroll with world */}
        <Particles />

        {/* Game world with camera transform */}
        <CameraTransform
          style={{
            transform: `translateX(${-state.camera.x}px)`,
          }}
        >
          {/* Mario */}
          <MarioDiv
            $facingRight={state.mario.facingRight}
            $isBig={state.mario.isBig}
            $invulnerable={state.mario.invulnerable}
            style={{
              left: state.mario.x,
              top: state.mario.y,
            }}
          />

          {/* Pipes */}
          {state.pipes.map((pipe: any) => (
            <PipeDiv
              key={pipe.id}
              height={pipe.height}
              style={{ left: pipe.x, top: pipe.y }}
            />
          ))}

          {/* Enemies */}
          {state.enemies
            .filter((enemy: any) => enemy.alive)
            .map((enemy: any) => (
              <EnemyDiv
                key={enemy.id}
                style={{ left: enemy.x, top: enemy.y }}
              />
            ))}

          {/* Coins */}
          {state.coins
            .filter((coin: any) => !coin.collected)
            .map((coin: any) => (
              <CoinDiv key={coin.id} style={{ left: coin.x, top: coin.y }} />
            ))}

          {/* Mushrooms */}
          {(state.mushrooms || []).map((mushroom: any) =>
            mushroom.active ? (
              <MushroomDiv
                key={mushroom.id}
                $type={mushroom.type}
                style={{ left: mushroom.x, top: mushroom.y }}
              />
            ) : null,
          )}

          {/* Platforms */}
          {state.platforms.map((platform: any) => (
            <PlatformDiv
              key={platform.id}
              $type={platform.type}
              $width={platform.width}
              $height={platform.height}
              style={{
                left: platform.x,
                top: platform.y,
              }}
            />
          ))}

          {/* Blocks */}
          {state.blocks.map((block: any) => (
            <BlockDiv
              key={block.id}
              $type={block.type}
              $used={block.used}
              style={{ left: block.x, top: block.y }}
            />
          ))}

          {/* Flagpole */}
          {state.flagpole && (
            <>
              {/* Flagpole pole */}
              <FlagpoleDiv x={state.flagpole.x} y={state.flagpole.y} />
              {/* Flagpole base at bottom */}
              <FlagpoleBaseDiv
                x={
                  state.flagpole.x -
                  FLAGPOLE_BASE_WIDTH / 2 +
                  FLAGPOLE_WIDTH / 2
                }
                y={CANVAS_HEIGHT - GROUND_HEIGHT - FLAGPOLE_BASE_HEIGHT}
              />
              {/* Red flag */}
              <FlagDiv
                x={state.flagpole.x + FLAGPOLE_WIDTH}
                y={state.flagpole.y + 20}
              />
            </>
          )}

          {/* Ground segments with pits */}
          {state.grounds.map((ground: any) => (
            <GroundDiv
              key={ground.id}
              $width={ground.width}
              $height={ground.height}
              style={{ left: ground.x, top: ground.y }}
            />
          ))}
        </CameraTransform>

        {/* Game overlay (start screen, game over, etc.) */}
        <GameOverlay
          currentScore={state.score.score}
          coinCount={state.score.coins}
          highScore={state.score.highScore}
          lives={state.score.lives}
          gameState={state.status}
          gameOverReason={state.status.gameOverReason}
          onStartGame={startGame}
          onRestart={restartGame}
        />

        {/* Transition overlay for level changes */}
        <TransitionOverlay
          isVisible={getTransitionState().isVisible}
          levelInfo={getTransitionState().levelInfo}
        />
      </GameContainer>
    </div>
  );
};

export default Game;
