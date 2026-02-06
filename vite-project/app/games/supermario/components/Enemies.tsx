import React from "react";
import type { Enemy, EnemyType } from "../types";
import type { CameraState } from "../types";

export interface EnemyProps {
  enemy: Enemy;
  cameraX: number;
  cameraY: number;
}

export interface DrawEnemyOptions {
  x: number;
  y: number;
  type: EnemyType;
  frame: number;
  isAlive: boolean;
  facingLeft: boolean;
}

export function Enemy({ enemy, cameraX, cameraY }: EnemyProps) {
  // Filter enemies that are on screen
  if (!isEnemyVisible(enemy, cameraX, cameraY)) {
    return null;
  }

  const screenX = enemy.x - cameraX;
  const screenY = enemy.y - cameraY;
  const frame = enemy.frame || 0;
  const facingLeft =
    enemy.facingLeft !== undefined ? enemy.facingLeft : enemy.direction < 0;

  // Render based on enemy type
  if (enemy.type === "goomba") {
    return renderGoomba(screenX, screenY, frame, facingLeft);
  } else if (enemy.type === "koopa") {
    return renderKoopa(screenX, screenY, frame, enemy.alive, facingLeft);
  }

  return null;
}

// Determine if enemy should be rendered
function isEnemyVisible(
  enemy: Enemy,
  cameraX: number,
  cameraY: number,
): boolean {
  const screenX = enemy.x - cameraX;
  const screenY = enemy.y - cameraY;
  return screenX > -50 && screenX < 850 && screenY > -50 && screenY < 530;
}

// Render Goomba enemy
function renderGoomba(
  screenX: number,
  screenY: number,
  frame: number,
  facingLeft: boolean,
): React.ReactElement {
  const waddle = Math.abs(Math.sin(frame * 0.1)) * 4;

  return (
    <div
      style={{
        position: "absolute",
        left: screenX - 16,
        top: screenY - 16,
        width: 32,
        height: 32,
        transform: facingLeft ? "scaleX(-1)" : "scaleX(1)",
      }}
    >
      {/* Goomba body */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 32,
          height: 32,
          background: "#8B4513",
          borderRadius: "4px 4px 16px 16px",
        }}
      />
      {/* Goomba eyes */}
      <div
        style={{
          position: "absolute",
          left: 6,
          top: 4,
          width: 8,
          height: 8,
          background: "#FFF",
          borderRadius: "50%",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 18,
          top: 4,
          width: 8,
          height: 8,
          background: "#FFF",
          borderRadius: "50%",
        }}
      />
      {/* Goomba pupils */}
      <div
        style={{
          position: "absolute",
          left: 8,
          top: 6,
          width: 4,
          height: 4,
          background: "#000",
          borderRadius: "50%",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 20,
          top: 6,
          width: 4,
          height: 4,
          background: "#000",
          borderRadius: "50%",
        }}
      />
      {/* Goomba eyebrows */}
      <div
        style={{
          position: "absolute",
          left: 4,
          top: 2,
          width: 8,
          height: 2,
          background: "#654321",
          borderRadius: "2px",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 20,
          top: 2,
          width: 8,
          height: 2,
          background: "#654321",
          borderRadius: "2px",
        }}
      />
      {/* Goomba feet animation */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 28,
          width: 10,
          height: 4,
          background: "#654321",
          borderRadius: "2px",
          transform: `translateX(${Math.sin(frame * 0.2) * 4}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 22,
          top: 28,
          width: 10,
          height: 4,
          background: "#654321",
          borderRadius: "2px",
          transform: `translateX(${-Math.sin(frame * 0.2) * 4}px)`,
        }}
      />
    </div>
  );
}

// Render Koopa enemy
function renderKoopa(
  screenX: number,
  screenY: number,
  frame: number,
  isAlive: boolean,
  facingLeft: boolean,
): React.ReactElement | null {
  const waddle = Math.abs(Math.sin(frame * 0.1)) * 4;

  if (!isAlive) {
    // Render dead Koopa shell
    return (
      <div
        style={{
          position: "absolute",
          left: screenX - 16,
          top: screenY - 16,
          width: 32,
          height: 32,
          transform: facingLeft ? "scaleX(-1)" : "scaleX(1)",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 8,
            top: 4,
            width: 16,
            height: 20,
            background: "#228B22",
            borderRadius: "50% 50% 4px 4px",
          }}
        />
      </div>
    );
  }

  // Render alive Koopa
  return (
    <div
      style={{
        position: "absolute",
        left: screenX - 16,
        top: screenY - 16,
        width: 32,
        height: 32,
        transform: facingLeft ? "scaleX(-1)" : "scaleX(1)",
      }}
    >
      {/* Koopa shell */}
      <div
        style={{
          position: "absolute",
          left: 4,
          top: 8,
          width: 24,
          height: 20,
          background: "#228B22",
          borderRadius: "50% 50% 4px 4px",
          border: "2px solid #006400",
        }}
      />
      {/* Koopa head */}
      <div
        style={{
          position: "absolute",
          left: 6,
          top: 0,
          width: 20,
          height: 12,
          background: "#228B22",
          borderRadius: "50% 50% 20% 20%",
        }}
      />
      {/* Koopa eye */}
      <div
        style={{
          position: "absolute",
          left: 16,
          top: 4,
          width: 6,
          height: 6,
          background: "#FFF",
          borderRadius: "50%",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 18,
          top: 5,
          width: 2,
          height: 2,
          background: "#000",
          borderRadius: "50%",
        }}
      />
    </div>
  );
}

// Canvas-based enemy rendering helper
export function drawEnemy(
  ctx: CanvasRenderingContext2D,
  options: DrawEnemyOptions,
): void {
  const { x, y, type, frame, isAlive, facingLeft } = options;

  ctx.save();
  ctx.translate(x, y);

  if (facingLeft) {
    ctx.scale(-1, 1);
  }

  switch (type) {
    case "goomba":
      drawGoomba(ctx, frame);
      break;
    case "koopa":
      drawKoopa(ctx, frame, isAlive);
      break;
  }

  ctx.restore();
}

// Draw Goomba on canvas
function drawGoomba(ctx: CanvasRenderingContext2D, frame: number): void {
  const waddle = Math.abs(Math.sin(frame * 0.1)) * 4;

  // Shadow
  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  ctx.beginPath();
  ctx.ellipse(0, 12, 12 - waddle * 0.5, 4 - waddle * 0.3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Body
  ctx.fillStyle = "#8B4513";
  ctx.beginPath();
  ctx.ellipse(0, -4, 16, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  // Brown stripes
  ctx.fillStyle = "#654321";
  ctx.beginPath();
  ctx.ellipse(0, 0, 14, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eyes
  ctx.fillStyle = "#FFF";
  ctx.beginPath();
  ctx.ellipse(-5, -8, 4, 5, 0, 0, Math.PI * 2);
  ctx.ellipse(5, -8, 4, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Pupils
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.arc(-4, -8, 2, 0, Math.PI * 2);
  ctx.arc(6, -8, 2, 0, Math.PI * 2);
  ctx.fill();

  // Eyebrows (angry look)
  ctx.strokeStyle = "#654321";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-9, -12);
  ctx.lineTo(-1, -10);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(9, -12);
  ctx.lineTo(1, -10);
  ctx.stroke();

  // Feet
  const footOffset = Math.sin(frame * 0.2) * 4;
  ctx.fillStyle = "#654321";
  ctx.beginPath();
  ctx.ellipse(-5, 12 - footOffset, 6, 3, 0, 0, Math.PI * 2);
  ctx.ellipse(5, 12 + footOffset, 6, 3, 0, 0, Math.PI * 2);
  ctx.fill();
}

// Draw Koopa on canvas
function drawKoopa(
  ctx: CanvasRenderingContext2D,
  frame: number,
  isAlive: boolean,
): void {
  if (!isAlive) {
    // Draw dead shell
    ctx.fillStyle = "#228B22";
    ctx.beginPath();
    ctx.ellipse(0, 4, 12, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#006400";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 4, 12, 10, 0, 0, Math.PI * 2);
    ctx.stroke();
    return;
  }

  // Shadow
  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  ctx.beginPath();
  ctx.ellipse(0, 10, 14, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Shell
  ctx.fillStyle = "#228B22";
  ctx.beginPath();
  ctx.ellipse(0, 4, 14, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#006400";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Head
  ctx.fillStyle = "#228B22";
  ctx.beginPath();
  ctx.arc(0, -6, 8, 0, Math.PI * 2);
  ctx.fill();

  // Face
  ctx.fillStyle = "#90EE90";
  ctx.beginPath();
  ctx.ellipse(-2, -8, 3, 2, 0, 0, Math.PI * 2);
  ctx.ellipse(2, -8, 3, 2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eye
  ctx.fillStyle = "#FFF";
  ctx.beginPath();
  ctx.arc(4, -6, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.arc(5, -6, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Feet
  const footOffset = Math.sin(frame * 0.15) * 4;
  ctx.fillStyle = "#006400";
  ctx.beginPath();
  ctx.ellipse(-4, 8 - footOffset, 5, 2.5, 0, 0, Math.PI * 2);
  ctx.ellipse(4, 8 + footOffset, 5, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();
}
