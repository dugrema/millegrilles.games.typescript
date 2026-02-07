/**
 * Super Mario Game Component
 * Main game rendering component with canvas and UI integration
 */

import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import { useSuperMario } from "./index";
import ScoreDisplay from "./components/ScoreDisplay";
import ScoreLabel from "./components/ScoreLabel";
import CoinIcon from "./components/CoinIcon";
import LivesDisplay from "./components/LivesDisplay";
import ControlsHelp from "./components/ControlsHelp";
import GameOverOverlay from "./components/GameOverOverlay";
import LevelIndicator from "./components/LevelIndicator";

import {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  TILE_SIZE,
  TILE_TYPES,
  ANIMATION_SPEED,
  DEBUG_CONFIG,
} from "./constants";
import type { Tile, TileType } from "./types";

// Styled container for the game
const GameContainer = styled.div`
  position: relative;
  width: ${SCREEN_WIDTH}px;
  height: ${SCREEN_HEIGHT}px;
  background: linear-gradient(to bottom, #87ceeb, #4a90e2);
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
`;

// Canvas for rendering the game world
const GameCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

// HUD container
const HUD = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  font-family: "Arial Black", sans-serif;
  background: linear-gradient(to bottom, #000080, #000040);
  border-bottom: 2px solid #fff;
  box-sizing: border-box;
  z-index: 10;
`;

// HUD items
const HUDItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

// HUD value
const HUDValue = styled.span`
  color: #fff;
  font-size: 16px;
  text-shadow: 2px 2px 0 #000;
`;

// Game component
const Game = () => {
  const context = useSuperMario();
  if (!context)
    throw new Error("useSuperMario must be used within SuperMarioGameProvider");
  const { state, actions } = context;
  const {
    player,
    level,
    tiles,
    input,
    camera,
    status,
    score,
    coins,
    lives,
    isPaused,
  } = state;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  // Setup canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctxRef.current = ctx;

    // Set canvas size
    canvas.width = SCREEN_WIDTH;
    canvas.height = SCREEN_HEIGHT;

    // Render initial frame
    render();

    return () => {
      ctxRef.current = null;
    };
  }, [player, level, tiles, camera]);

  // Render game frame
  const render = () => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    // Draw background
    const gradient = ctx.createLinearGradient(0, 0, 0, SCREEN_HEIGHT);
    gradient.addColorStop(0, "#87CEEB");
    gradient.addColorStop(1, "#4A90E2");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    // Draw clouds
    ctx.fillStyle = "#FFFFFF";
    [
      { x: 100, y: 60 },
      { x: 300, y: 40 },
      { x: 500, y: 80 },
      { x: 700, y: 50 },
    ].forEach((cloud) => {
      ctx.beginPath();
      ctx.arc(cloud.x, cloud.y, 20, 0, Math.PI * 2);
      ctx.arc(cloud.x + 20, cloud.y - 10, 25, 0, Math.PI * 2);
      ctx.arc(cloud.x + 40, cloud.y, 20, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw hills
    ctx.fillStyle = "#228B22";
    [
      { x: 50, y: 350, width: 100, height: 50 },
      { x: 250, y: 380, width: 80, height: 40 },
      { x: 450, y: 360, width: 120, height: 55 },
    ].forEach((hill) => {
      ctx.beginPath();
      ctx.ellipse(
        hill.x + hill.width / 2,
        hill.y + hill.height,
        hill.width / 2,
        hill.height / 2,
        0,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    });

    if (status === "playing" && player && level) {
      // Apply camera offset
      const offsetX = camera.x;
      const offsetY = 0;

      ctx.save();
      ctx.translate(-offsetX, -offsetY);

      // Render tiles
      tiles.forEach((tile: Tile) => {
        renderTile(ctx, tile, offsetX, offsetY);
      });

      // Render player
      if (player) {
        renderPlayer(ctx, player, offsetX, offsetY);
      }

      ctx.restore();
    }
  };

  // Render a single tile
  const renderTile = (
    ctx: CanvasRenderingContext2D,
    tile: Tile,
    offsetX: number,
    offsetY: number,
  ) => {
    const { position, dimensions, type } = tile;

    // Skip if tile is behind camera
    if (
      position.x + dimensions.width < offsetX ||
      position.x > offsetX + SCREEN_WIDTH
    ) {
      return;
    }

    ctx.save();

    // Get tile color
    const tileColor = TILE_TYPES[type as TileType]?.color || "#808080";

    // Apply tile color and type
    switch (type) {
      case "ground":
        ctx.fillStyle = "#8B4513";
        ctx.fillRect(
          position.x,
          position.y,
          dimensions.width,
          dimensions.height,
        );
        // Add texture
        ctx.fillStyle = "#6B3E0A";
        for (let i = 0; i < dimensions.width; i += TILE_SIZE) {
          for (let j = 0; j < dimensions.height; j += TILE_SIZE * 2) {
            ctx.fillRect(
              position.x + i,
              position.y + j,
              TILE_SIZE * 2,
              TILE_SIZE,
            );
          }
        }
        break;

      case "block":
        ctx.fillStyle = "#B8860B";
        ctx.fillRect(
          position.x,
          position.y,
          dimensions.width,
          dimensions.height,
        );
        ctx.strokeStyle = "#806020";
        ctx.lineWidth = 2;
        ctx.strokeRect(
          position.x,
          position.y,
          dimensions.width,
          dimensions.height,
        );
        break;

      case "question":
        ctx.fillStyle = "#FFD700";
        ctx.fillRect(
          position.x,
          position.y,
          dimensions.width,
          dimensions.height,
        );
        ctx.strokeStyle = "#DAA520";
        ctx.lineWidth = 3;
        ctx.strokeRect(
          position.x,
          position.y,
          dimensions.width,
          dimensions.height,
        );
        ctx.fillStyle = "#000";
        ctx.font = "bold 20px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
          "?",
          position.x + dimensions.width / 2,
          position.y + dimensions.height / 2,
        );
        // Bouncing animation
        if (tile.frame !== undefined && tile.frame % 60 < 30) {
          ctx.fillRect(position.x, position.y - 4, dimensions.width, 4);
        }
        break;

      case "brick":
        ctx.fillStyle = "#CD853F";
        ctx.fillRect(
          position.x,
          position.y,
          dimensions.width,
          dimensions.height,
        );
        // Brick pattern
        ctx.strokeStyle = "#8B4513";
        ctx.lineWidth = 2;
        ctx.strokeRect(
          position.x,
          position.y,
          dimensions.width,
          dimensions.height,
        );
        for (let i = 0; i < dimensions.width; i += TILE_SIZE) {
          ctx.beginPath();
          ctx.moveTo(position.x + i, position.y);
          ctx.lineTo(position.x + i, position.y + dimensions.height);
          ctx.stroke();
        }
        break;

      case "coin":
        ctx.fillStyle = "#FFD700";
        ctx.beginPath();
        ctx.ellipse(
          position.x + dimensions.width / 2,
          position.y + dimensions.height / 2,
          dimensions.width / 2,
          dimensions.height / 2,
          0,
          0,
          Math.PI * 2,
        );
        ctx.fill();
        ctx.strokeStyle = "#DAA520";
        ctx.lineWidth = 2;
        ctx.stroke();
        break;

      case "goomba":
        ctx.fillStyle = "#8B4513";
        ctx.beginPath();
        ctx.arc(
          position.x + dimensions.width / 2,
          position.y + dimensions.height - 8,
          16,
          0,
          Math.PI * 2,
        );
        ctx.fill();
        // Eyes
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(position.x + 12, position.y + 20, 4, 0, Math.PI * 2);
        ctx.arc(position.x + 20, position.y + 20, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(position.x + 12, position.y + 20, 2, 0, Math.PI * 2);
        ctx.arc(position.x + 20, position.y + 20, 2, 0, Math.PI * 2);
        ctx.fill();
        // Feet
        ctx.fillStyle = "#000";
        const time = Date.now() / 200;
        const footOffset = Math.sin(time) * 4;
        ctx.fillRect(position.x + 4, position.y + 28, 10, 4 + footOffset);
        ctx.fillRect(position.x + 18, position.y + 28, 10, 4 - footOffset);
        break;

      case "flag":
        ctx.fillStyle = "#228B22";
        ctx.fillRect(position.x, position.y, 4, dimensions.height);
        break;

      case "flagpole":
        ctx.fillStyle = "#228B22";
        ctx.fillRect(position.x, position.y, 4, dimensions.height);
        break;

      default:
        ctx.fillStyle = tileColor || "#808080";
        ctx.fillRect(
          position.x,
          position.y,
          dimensions.width,
          dimensions.height,
        );
    }

    // Debug: Show collision boxes
    if (DEBUG_CONFIG.SHOW_COLLISION_BOXES) {
      ctx.strokeStyle = "rgba(255, 0, 0, 0.5)";
      ctx.lineWidth = 1;
      ctx.strokeRect(
        position.x,
        position.y,
        dimensions.width,
        dimensions.height,
      );
    }

    ctx.restore();
  };

  // Render the player
  const renderPlayer = (
    ctx: CanvasRenderingContext2D,
    player: any,
    offsetX: number,
    offsetY: number,
  ) => {
    const { position, dimensions, direction, state } = player;

    ctx.save();

    // Calculate position with camera offset
    const screenX = position.x - offsetX;
    const screenY = position.y - offsetY;

    // Draw player based on state
    switch (state) {
      case "idle":
        // Simple Mario character
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(screenX, screenY, dimensions.width, dimensions.height);
        // Face
        ctx.fillStyle = "#FFC0CB";
        ctx.beginPath();
        ctx.arc(screenX + 16, screenY + 12, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(screenX + 16, screenY + 12, 3, 0, Math.PI * 2);
        ctx.fill();
        // Hat
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(screenX + 4, screenY - 4, 24, 8);
        // Overalls
        ctx.fillStyle = "#0000AA";
        ctx.fillRect(screenX + 4, screenY + 20, 24, 12);
        // Body
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(screenX + 4, screenY + 8, 24, 12);
        break;

      case "walk":
        // Walking animation
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(screenX, screenY, dimensions.width, dimensions.height);
        // Animated elements
        const walkOffset = Math.floor(Date.now() / 100) % 4;
        ctx.fillRect(screenX + walkOffset, screenY + 8, 8, 12);
        ctx.fillRect(screenX + 24, screenY + 8, 8, 12);
        // Face
        ctx.fillStyle = "#FFC0CB";
        ctx.beginPath();
        ctx.arc(screenX + 16, screenY + 12, 8, 0, Math.PI * 2);
        ctx.fill();
        break;

      case "jump":
        // Jumping pose
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(screenX, screenY, dimensions.width, dimensions.height);
        // Body angled
        ctx.save();
        ctx.translate(screenX + 16, screenY + 16);
        ctx.rotate((-15 * Math.PI) / 180);
        ctx.fillRect(-4, 0, 32, 4);
        ctx.fillRect(-4, 4, 4, 16);
        ctx.restore();
        break;

      case "run":
        // Running animation
        ctx.fillStyle = "#FF0000";
        const runOffset = Math.floor(Date.now() / 50) % 4;
        ctx.fillRect(screenX, screenY, dimensions.width, dimensions.height);
        ctx.fillRect(screenX + runOffset, screenY + 8, 8, 12);
        ctx.fillRect(screenX + 24, screenY + 8, 8, 12);
        // Faster animation
        ctx.fillRect(screenX - runOffset, screenY + 8, 8, 12);
        break;

      case "doubleJump":
        // Double jump pose
        ctx.fillStyle = "#FF6600";
        ctx.fillRect(screenX, screenY, dimensions.width, dimensions.height);
        ctx.fillRect(screenX - 4, screenY + 4, 4, 16);
        ctx.fillRect(screenX + 32, screenY + 4, 4, 16);
        break;

      case "land":
        // Landing pose
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(screenX, screenY, dimensions.width, dimensions.height);
        // Squashed
        ctx.fillRect(screenX + 4, screenY + 4, 24, 16);
        break;

      case "fall":
        // Falling pose
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(screenX, screenY, dimensions.width, dimensions.height);
        // Body stretched
        ctx.fillRect(screenX + 4, screenY + 4, 24, 8);
        ctx.fillRect(screenX + 8, screenY + 12, 16, 4);
        break;
    }

    // Debug: Show player collision box
    if (DEBUG_CONFIG.PLAYER_DEBUG) {
      ctx.strokeStyle = "rgba(0, 255, 0, 0.7)";
      ctx.lineWidth = 2;
      ctx.strokeRect(screenX, screenY, dimensions.width, dimensions.height);
    }

    ctx.restore();
  };

  // Return game UI
  return (
    <GameContainer>
      <GameCanvas ref={canvasRef} />

      {/* HUD */}
      <HUD>
        <HUDItem>
          <ScoreLabel>SCORE:</ScoreLabel>
          <HUDValue>{score.toLocaleString()}</HUDValue>
        </HUDItem>
        <HUDItem>
          <ScoreLabel>COINS:</ScoreLabel>
          <HUDValue>
            {coins} <CoinIcon>🪙</CoinIcon>
          </HUDValue>
        </HUDItem>
        <HUDItem>
          <ScoreLabel>LIVES:</ScoreLabel>
          <HUDValue>{"❤️".repeat(Math.max(0, lives))}</HUDValue>
        </HUDItem>
      </HUD>

      {/* Game Over Overlay */}
      <GameOverOverlay />
      {status !== "start" && !state.isPaused && <ControlsHelp />}
      <ControlsHelp />
    </GameContainer>
  );
};

export default Game;
