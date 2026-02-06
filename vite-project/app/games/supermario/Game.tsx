// Game component with GameContainer and canvas rendering
import React, { useCallback, useState, useEffect } from "react";
import { useSuperMario } from "./index";
import {
  GameState as GameStateType,
  type InputState,
  type MarioGameState,
  type MarioGameActions,
} from "./types";
import { InputHandler } from "./components/InputHandler";
import { TouchControls } from "./components/TouchControls";
import GameOverlay from "./components/GameOverlay";

import { GameContainer } from "./components/GameContainer";
import { drawMario } from "./components/Player";
import { drawEnemy } from "./components/Enemies";
import {
  drawCoin,
  drawMushroom,
  drawFireFlower,
} from "./components/Collectibles";
import { drawCloud, drawHill, drawBush } from "./components/Background";
import { drawParticle } from "./components/Particles";
import { SCREEN_WIDTH, SCREEN_HEIGHT, TILE_SIZE } from "./constants";
import { LEVEL_CONFIGS, DEFAULT_LEVEL } from "./level-data";
import { PlatformType } from "./types";

export default function Game() {
  const {
    gameState,
    actions,
    state,
  }: {
    gameState: GameStateType;
    actions: MarioGameActions;
    state: MarioGameState;
  } = useSuperMario();

  const {
    score,
    highScore,
    lives,
    level,
    time,
    player,
    camera,
    platforms,
    enemies,
    collectibles,
    currentLevel,
  } = state;

  const renderCallback = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      // Clear canvas
      ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

      // Get current level data
      const levelData = LEVEL_CONFIGS[currentLevel] || DEFAULT_LEVEL;

      // Draw background
      drawBackground(ctx, gameState, player.animationFrame);

      // Draw platforms
      drawPlatforms(
        ctx,
        gameState,
        levelData,
        state.platforms,
        camera,
        TILE_SIZE,
      );

      // Draw collectibles
      drawCollectibles(
        ctx,
        gameState,
        currentLevel,
        collectibles,
        camera,
        player.animationFrame,
      );

      // Draw player
      const playerScreenX = player.x - camera.x;
      const playerScreenY = player.y - camera.y;
      drawMario(
        ctx,
        playerScreenX,
        playerScreenY,
        player.width,
        player.height,
        player.state,
        player.animationFrame,
        player.facingLeft,
        player.isSmall,
        player.isFire,
      );

      // Draw UI overlay
      drawUIOverlay(ctx, score, highScore, lives, level, time, camera);
    },
    [state, gameState, player, camera, collectibles, enemies],
  );

  // Create handler for TouchControls
  const handleTouchInput = useCallback(
    (action: string | number | symbol, pressed: boolean) => {
      if (pressed) {
        actions.setInput({ [action]: true });
      } else {
        actions.setInput({ [action]: false });
      }
    },
    [actions.setInput],
  );

  return (
    <>
      <GameContainer
        width={SCREEN_WIDTH}
        height={SCREEN_HEIGHT}
        renderCallback={renderCallback}
      />
      <TouchControls onInput={handleTouchInput} hideOnDesktop={true} />
      <GameOverlay
        gameState={gameState}
        score={score}
        highScore={highScore}
        level={level}
        inputActions={{ setInput: actions.setInput }}
        onRestart={actions.restartLevel}
        onResume={actions.resumeGame}
        onNextLevel={actions.nextLevel}
        onStart={actions.startGame}
      />
      <InputHandler
        onInputChange={actions.setInput}
        enabled={
          gameState === GameStateType.PLAYING ||
          gameState === GameStateType.PAUSED ||
          gameState === GameStateType.IDLE
        }
      />
    </>
  );
}

// Helper function to draw background elements
function drawBackground(
  ctx: CanvasRenderingContext2D,
  gameState: GameStateType,
  animationFrame: number,
): void {
  // Sky gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, SCREEN_HEIGHT);
  gradient.addColorStop(0, "#5c94fc");
  gradient.addColorStop(1, "#87CEEB");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

  // Draw clouds (parallax effect based on camera)
  drawCloud(ctx, 0, 50, 100, 30, animationFrame * 0.02);
  drawCloud(ctx, SCREEN_WIDTH * 0.3, 80, 80, 25, animationFrame * 0.03);
  drawCloud(ctx, SCREEN_WIDTH * 0.6, 60, 120, 35, animationFrame * 0.01);

  // Draw hills (parallax)
  drawHill(ctx, 0, SCREEN_HEIGHT - 40, 200, 60, "#4a7c4e");
  drawHill(ctx, SCREEN_WIDTH * 0.25, SCREEN_HEIGHT - 30, 150, 45, "#5a8c5e");
  drawHill(ctx, SCREEN_WIDTH * 0.5, SCREEN_HEIGHT - 50, 180, 55, "#3a6c3e");

  // Draw bushes at bottom
  drawBush(ctx, 0, SCREEN_HEIGHT - 40, SCREEN_WIDTH, 40);
}

// Helper function to draw platforms
function drawPlatforms(
  ctx: CanvasRenderingContext2D,
  gameState: GameStateType,
  levelData: any,
  platforms: PlatformType[][],
  camera: any,
  tileSize: number,
): void {
  if (!gameState || !levelData || !platforms) return;

  ctx.save();
  const offsetX = camera.x - levelData.width * tileSize;
  const offsetY = camera.y - levelData.height * tileSize;

  // Iterate through visible tiles
  for (let row = 0; row < levelData.height; row++) {
    for (let col = 0; col < levelData.width; col++) {
      const tile = (platforms[row]?.[col] as PlatformType) ?? undefined;
      if (!tile) continue;

      const x = col * tileSize + offsetX;
      const y = row * tileSize + offsetY;

      // Only draw if visible on screen
      if (
        x + tileSize > camera.x &&
        x < camera.x + SCREEN_WIDTH &&
        y + tileSize > camera.y &&
        y < camera.y + SCREEN_HEIGHT
      ) {
        switch (tile) {
          case PlatformType.AIR:
            break;
          case PlatformType.GROUND:
            drawGround(ctx, x, y, tileSize);
            break;
          case PlatformType.BRICK:
            drawBrick(ctx, x, y, tileSize);
            break;
          case PlatformType.QUESTION_BLOCK:
            drawQuestionBlock(ctx, x, y, tileSize);
            break;
          case PlatformType.PIPE:
            drawPipe(ctx, x, y, tileSize);
            break;
          case PlatformType.FLAG_POLE:
            drawFlagPole(ctx, x, y, tileSize);
            break;
          case PlatformType.BLOCK:
            break;
          default:
            break;
        }
      }
    }
  }
  ctx.restore();
}

// Individual platform drawing functions
function drawGround(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
): void {
  ctx.fillStyle = "#8B4513";
  ctx.fillRect(x, y, size, size);
  ctx.fillStyle = "#654321";
  ctx.fillRect(x + 2, y + 2, size - 4, size - 4);
}

function drawBrick(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
): void {
  ctx.fillStyle = "#C0392B";
  ctx.fillRect(x, y, size, size);
  ctx.strokeStyle = "#8B0000";
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, size, size);
  ctx.fillStyle = "#E74C3C";
  ctx.fillRect(x + 4, y + 4, size - 8, size - 8);
}

function drawQuestionBlock(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
): void {
  ctx.fillStyle = "#F1C40F";
  ctx.fillRect(x, y, size, size);
  ctx.strokeStyle = "#DAA520";
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, size, size);
  ctx.fillStyle = "#DAA520";
  ctx.font = "bold 20px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("?", x + size / 2, y + size / 2);
}

function drawPipe(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
): void {
  const pipeHeight = size * 3;
  // Pipe body
  ctx.fillStyle = "#228B22";
  ctx.fillRect(x + 4, y, size - 8, pipeHeight);
  // Pipe top
  ctx.fillStyle = "#32CD32";
  ctx.fillRect(x, y - 10, size, 16);
  ctx.strokeStyle = "#006400";
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y - 10, size, 16);
  ctx.strokeRect(x + 4, y, size - 8, pipeHeight);
}

function drawFlagPole(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
): void {
  // Pole
  ctx.fillStyle = "#90EE90";
  ctx.fillRect(x + size / 2 - 3, y, 6, size * 5);
  // Ball on top
  ctx.fillStyle = "#FFD700";
  ctx.beginPath();
  ctx.arc(x + size / 2, y + 15, 8, 0, Math.PI * 2);
  ctx.fill();
  // Flag
  ctx.fillStyle = "#FF0000";
  ctx.beginPath();
  ctx.moveTo(x + size / 2 + 3, y + 25);
  ctx.lineTo(x + size * 3, y + size * 1.5);
  ctx.lineTo(x + size / 2 + 3, y + size * 2);
  ctx.closePath();
  ctx.fill();
}

// Helper function to draw collectibles
function drawCollectibles(
  ctx: CanvasRenderingContext2D,
  gameState: GameStateType,
  levelData: any,
  collectibles: any[],
  camera: any,
  animationFrame: number,
): void {
  if (!gameState || !levelData || !collectibles) return;

  collectibles.forEach((c: any) => {
    if (c.collected) return;

    const x = c.x - camera.x;
    const y = c.y - camera.y;

    // Only draw if visible on screen
    if (x > -50 && x < SCREEN_WIDTH + 50 && y > -50 && y < SCREEN_HEIGHT + 50) {
      switch (c.type) {
        case "coin":
          drawCoin(ctx, x, y, animationFrame, false);
          break;
        case "mushroom":
          drawMushroom(ctx, x, y, animationFrame, false);
          break;
        case "fire-flower":
          drawFireFlower(ctx, x, y, animationFrame);
          break;
      }
    }
  });
}

// Helper function to draw enemies
function drawEnemies(
  ctx: CanvasRenderingContext2D,
  gameState: GameStateType,
  levelData: any,
  enemies: any[],
  camera: any,
  animationFrame: number,
): void {
  if (!gameState || !levelData || !enemies) return;

  enemies.forEach((enemy: any) => {
    if (enemy.dead) return;

    const x = enemy.x - camera.x;
    const y = enemy.y - camera.y;

    // Only draw if visible on screen
    if (x > -50 && x < SCREEN_WIDTH + 50 && y > -50 && y < SCREEN_HEIGHT + 50) {
      drawEnemy(ctx, {
        x,
        y,
        type: enemy.type,
        frame: animationFrame,
        isAlive: true,
        facingLeft: enemy.facingLeft,
      });
    }
  });
}

// Helper function to draw UI overlay
function drawUIOverlay(
  ctx: CanvasRenderingContext2D,
  score: number,
  highScore: number,
  lives: number,
  level: number,
  time: number,
  camera: any,
): void {
  ctx.save();

  // Score display (top left)
  ctx.fillStyle = "#FFD700";
  ctx.font = "bold 24px Arial";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(`Score: ${score.toLocaleString()}`, 20, 25);

  // High score
  ctx.fillStyle = "#CCCCCC";
  ctx.font = "18px Arial";
  ctx.fillText(`High Score: ${highScore.toLocaleString()}`, 20, 50);

  // Lives
  ctx.fillStyle = "#FFD700";
  ctx.font = "bold 20px Arial";
  ctx.fillText(`🍄 Lives: ${lives}`, 20, 75);

  // Level (top right)
  ctx.textAlign = "right";
  ctx.fillStyle = "#FFA500";
  ctx.font = "bold 24px Arial";
  ctx.fillText(`Level: ${level}`, SCREEN_WIDTH - 150, 25);

  // Time (right side)
  ctx.fillStyle = time <= 30 ? "#FF6B6B" : "#4CAF50";
  ctx.font = "bold 24px Arial";
  ctx.fillText(`Time: ${time}s`, SCREEN_WIDTH - 150, 50);

  ctx.restore();
}

// Helper function to draw state overlays
function drawStateOverlay(
  ctx: CanvasRenderingContext2D,
  gameState: GameStateType,
  state: any,
  score: number,
  highScore: number,
  level: number,
): void {
  if (gameState === GameStateType.IDLE) {
    // Start screen
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 48px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🍄 Super Mario 🍄", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 60);

    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.fillText("Press SPACE to Start", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);

    ctx.font = "16px Arial";
    ctx.fillStyle = "#DDDDDD";
    ctx.fillText(
      "Arrow Keys to move",
      SCREEN_WIDTH / 2,
      SCREEN_HEIGHT / 2 + 50,
    );
    ctx.fillText(
      "↑ to jump | SHIFT to run",
      SCREEN_WIDTH / 2,
      SCREEN_HEIGHT / 2 + 80,
    );
    ctx.fillText("SPACE to pause", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 110);
  } else if (gameState === GameStateType.PAUSED) {
    // Pause screen
    const gradient = ctx.createLinearGradient(0, 0, 0, SCREEN_HEIGHT);
    gradient.addColorStop(0, "rgba(0, 0, 0, 0.8)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0.6)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 48px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("⏸️ PAUSED", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 30);

    ctx.fillStyle = "#DDDDDD";
    ctx.font = "24px Arial";
    ctx.fillText(
      "Press SPACE to Resume",
      SCREEN_WIDTH / 2,
      SCREEN_HEIGHT / 2 + 30,
    );
  } else if (gameState === GameStateType.GAME_OVER) {
    // Game Over screen
    const gradient = ctx.createLinearGradient(0, 0, 0, SCREEN_HEIGHT);
    gradient.addColorStop(0, "rgba(139, 0, 0, 0.9)");
    gradient.addColorStop(1, "rgba(100, 0, 0, 0.8)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    ctx.fillStyle = "#FF0000";
    ctx.font = "bold 48px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("💀 Game Over 💀", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 60);

    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.fillText(
      "Don't worry, you can try again!",
      SCREEN_WIDTH / 2,
      SCREEN_HEIGHT / 2,
    );

    ctx.font = "18px Arial";
    ctx.fillStyle = "#DDDDDD";
    ctx.fillText(
      `Final Score: ${score.toLocaleString()}`,
      SCREEN_WIDTH / 2,
      SCREEN_HEIGHT / 2 + 60,
    );
    ctx.fillText(
      "Press SPACE to Restart",
      SCREEN_WIDTH / 2,
      SCREEN_HEIGHT / 2 + 100,
    );
  } else if (gameState === GameStateType.VICTORY) {
    // Victory screen
    const gradient = ctx.createLinearGradient(0, 0, 0, SCREEN_HEIGHT);
    gradient.addColorStop(0, "rgba(255, 215, 0, 0.9)");
    gradient.addColorStop(1, "rgba(255, 165, 0, 0.8)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 48px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🎉 Victory! 🎉", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 60);

    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.fillText(
      `Level ${level} Complete!`,
      SCREEN_WIDTH / 2,
      SCREEN_HEIGHT / 2,
    );

    ctx.font = "18px Arial";
    ctx.fillStyle = "#DDDDDD";
    ctx.fillText(
      `Score: ${score.toLocaleString()}`,
      SCREEN_WIDTH / 2,
      SCREEN_HEIGHT / 2 + 60,
    );
    ctx.fillText(
      "Press SPACE to Continue",
      SCREEN_WIDTH / 2,
      SCREEN_HEIGHT / 2 + 100,
    );
  } else if (gameState === GameStateType.LEVEL_TRANSITION) {
    // Level transition screen
    const gradient = ctx.createLinearGradient(0, 0, 0, SCREEN_HEIGHT);
    gradient.addColorStop(0, "rgba(59, 130, 246, 0.9)");
    gradient.addColorStop(1, "rgba(37, 99, 235, 0.8)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 48px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      "⭐ Level Complete!",
      SCREEN_WIDTH / 2,
      SCREEN_HEIGHT / 2 - 40,
    );

    ctx.fillStyle = "#DDDDDD";
    ctx.font = "24px Arial";
    ctx.fillText("Great job! Keep it up!", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);

    ctx.font = "18px Arial";
    ctx.fillText(
      `Score: ${score.toLocaleString()}`,
      SCREEN_WIDTH / 2,
      SCREEN_HEIGHT / 2 + 50,
    );
    ctx.fillText(
      "Press SPACE for Next Level",
      SCREEN_WIDTH / 2,
      SCREEN_HEIGHT / 2 + 90,
    );
  }
}

export function meta() {
  return [
    { title: "Super Mario – Arcade Style Game" },
    {
      name: "description",
      content:
        "Play Super Mario clone in your browser. Classic platformer action with smooth gameplay.",
    },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
  ];
}
