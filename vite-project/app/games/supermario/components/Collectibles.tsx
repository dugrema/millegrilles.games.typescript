import React from "react";
import type { Collectible, CollectibleType } from "../types";

export interface CollectibleProps {
  collectible: Collectible;
  cameraX: number;
  cameraY: number;
  isCollected: boolean;
}

export interface DrawCollectibleOptions {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  type: CollectibleType;
  frame: number;
}

export function Collectible({
  collectible,
  cameraX,
  cameraY,
  isCollected,
}: CollectibleProps) {
  if (isCollected) {
    return null;
  }

  const screenX = collectible.x - cameraX;
  const screenY = collectible.y - cameraY;

  return (
    <div
      style={{
        position: "absolute",
        left: screenX,
        top: screenY,
        pointerEvents: "none",
      }}
    />
  );
}

// Render coin as a spinning gold disc
function renderCoin(
  screenX: number,
  screenY: number,
  frame: number,
): React.JSX.Element {
  const rotation = frame * 0.15;
  const scale = 1 + Math.sin(frame * 0.1) * 0.1;

  return (
    <div
      style={{
        position: "absolute",
        left: screenX - 16,
        top: screenY - 16,
        width: 32,
        height: 32,
        transform: `scale(${scale}) rotate(${rotation}rad)`,
        pointerEvents: "none",
      }}
    >
      {/* Coin background */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 32,
          height: 32,
          background: "radial-gradient(circle at 30% 30%, #ffd700, #daa520)",
          borderRadius: "50%",
          border: "2px solid #b8860b",
        }}
      />
      {/* Coin shine */}
      <div
        style={{
          position: "absolute",
          top: 6,
          left: 8,
          width: 10,
          height: 10,
          background: "rgba(255, 255, 255, 0.6)",
          borderRadius: "50%",
        }}
      />
      {/* Coin value symbol ($}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          width: 12,
          height: 12,
          background: "#daa520",
          borderRadius: "50%",
          color: "#8b4513",
          fontSize: "14px",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        $
      </div>
    </div>
  );
}

// Render mushroom power-up
function renderMushroom(screenX: number, screenY: number, frame: number, isRising: boolean): React.JSX.Element {
  const scale = isRising ? 1 + frame * 0.001 : 1;

  return (
    <div
      style={{
        position: "absolute",
        left: screenX - 20,
        top: screenY - 30,
        width: 40,
        height: 60,
        transform: `scale(${scale})`,
        pointerEvents: "none",
      }}
    >
      {/* Mushroom cap */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 5,
          width: 30,
          height: 20,
          background: "linear-gradient(180deg, #e74c3c 0%, #c0392b 100%)",
          borderRadius: "20px 20px 50% 50%",
        }}
      />
      {/* White spots on cap */}
      <div
        style={{
          position: "absolute",
          top: 4,
          left: 8,
          width: 8,
          height: 5,
          background: "white",
          borderRadius: "50%",
          transform: "rotate(-15deg)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 8,
          left: 20,
          width: 8,
          height: 5,
          background: "white",
          borderRadius: "50%",
          transform: "rotate(15deg)",
        }}
      />
      {/* Mushroom stem */}
      <div
        style={{
          position: "absolute",
          top: 18,
          left: 12,
          width: 16,
          height: 42,
          background: "linear-gradient(180deg, #f5deb3 0%, #deb887 100%)",
          borderRadius: "4px",
        }}
      />
    </div>
  );
}

// Render fire flower
function renderFireFlower(
  screenX: number,
  screenY: number,
  frame: number,
): React.JSX.Element {
  // Stems
  const stem1 = frame * 0.05;
  const stem2 = frame * 0.1;

  return (
    <div
      style={{
        position: "absolute",
        left: screenX - 20,
        top: screenY - 40,
        width: 40,
        height: 60,
        pointerEvents: "none",
        transform: `rotate(${stem1}rad)`,
      }}
    >
      {/* Bottom petals */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: 40,
          height: 25,
          background:
            "linear-gradient(180deg, #ff6b6b 0%, #ffd93d 50%, #ff6b6b 100%)",
          borderRadius: "20px 20px 0 0",
        }}
      />
      {/* Middle petals */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: 0,
          width: 40,
          height: 20,
          background:
            "linear-gradient(180deg, #ffd93d 0%, #ff6b6b 50%, #ffd93d 100%)",
          borderRadius: "10px 10px 0 0",
        }}
      />
      {/* Top petals */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 40,
          height: 20,
          background:
            "linear-gradient(180deg, #ff6b6b 0%, #ffd93d 50%, #ff6b6b 100%)",
          borderRadius: "20px 20px 0 0",
        }}
      />
      {/* Center */}
      <div
        style={{
          position: "absolute",
          top: 15,
          left: 12,
          width: 16,
          height: 16,
          background: "white",
          borderRadius: "50%",
        }}
      />
    </div>
  );
}

// Draw coin on canvas
export function drawCoin(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  frame: number,
  isCollected: boolean = false,
): void {
  if (isCollected) {
    return;
  }

  ctx.save();
  ctx.translate(x + 16, y + 16);

  const rotation = frame * 0.15;
  const scale = 1 + Math.sin(frame * 0.1) * 0.1;
  ctx.scale(scale, scale);
  ctx.rotate(rotation);

  // Coin circle
  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 16);
  gradient.addColorStop(0, "#ffd700");
  gradient.addColorStop(0.7, "#daa520");
  gradient.addColorStop(1, "#b8860b");

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(0, 0, 16, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#b8860b";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Coin shine
  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  ctx.beginPath();
  ctx.ellipse(-6, -6, 4, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Symbol
  ctx.fillStyle = "#daa520";
  ctx.beginPath();
  ctx.ellipse(0, 0, 8, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#8b4513";
  ctx.font = "bold 10px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("$", 0, 1);

  ctx.restore();
}

// Draw mushroom power-up
export function drawMushroom(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  frame: number,
  isRising: boolean = false,
): void {
  const scale = isRising ? 1 + frame * 0.0005 : 1;

  ctx.save();
  ctx.translate(x + 20, y + 30);
  ctx.scale(scale, scale);

  // Shadow
  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  ctx.beginPath();
  ctx.ellipse(0, 55, 15, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Stem
  const stemGradient = ctx.createLinearGradient(0, 0, 0, 60);
  stemGradient.addColorStop(0, "#f5deb3");
  stemGradient.addColorStop(0.5, "#e6be8a");
  stemGradient.addColorStop(1, "#d4a574");

  ctx.fillStyle = stemGradient;
  ctx.beginPath();
  ctx.roundRect(-8, 20, 16, 40, 4);
  ctx.fill();

  // Cap
  const capGradient = ctx.createLinearGradient(-15, 0, 15, 0);
  capGradient.addColorStop(0, "#c0392b");
  capGradient.addColorStop(0.5, "#e74c3c");
  capGradient.addColorStop(1, "#c0392b");

  ctx.fillStyle = capGradient;
  ctx.beginPath();
  ctx.arc(0, 0, 20, 0.5, Math.PI, true);
  ctx.fill();

  // Spots
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.ellipse(-4, -3, 6, 4, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(4, -3, 6, 4, 0.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// Draw fire flower
export function drawFireFlower(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  frame: number,
): void {
  const rotation = frame * 0.02;

  ctx.save();
  ctx.translate(x + 20, y + 40);
  ctx.rotate(rotation);

  // Shadow
  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  ctx.beginPath();
  ctx.ellipse(0, 55, 18, 5, 0, 0, Math.PI * 2);

  // Petals gradient
  const colors = [
    ["#ff6b6b", "#ff8e8e", "#ffd93d", "#ff6b6b"],
    ["#ffd93d", "#ff6b6b", "#ffd93d", "#ff6b6b"],
    ["#ff6b6b", "#ffd93d", "#ff6b6b", "#ffd93d"],
    ["#ff6b6b", "#ff6b6b", "#ffd93d", "#ff6b6b"],
  ];

  // Draw petals from bottom to top
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = colors[i][1];
    ctx.beginPath();
    ctx.ellipse(0, -i * 16, 16, 10, 0, 0, Math.PI);
    ctx.fill();

    ctx.fillStyle = colors[i][3];
    ctx.beginPath();
    ctx.ellipse(0, -i * 16, 16, 10, 0, Math.PI, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = colors[i][0];
    ctx.beginPath();
    ctx.arc(0, -i * 16 - 10, 8, 0, Math.PI * 2);
    ctx.fill();

    // Add center
    ctx.fillStyle = colors[i][2];
    ctx.beginPath();
    ctx.ellipse(0, -i * 16 - 10, 6, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Stem
  ctx.fillStyle = "#2ecc71";
  ctx.beginPath();
  ctx.roundRect(-4, 0, 8, 20, 2);
  ctx.fill();

  ctx.restore();
}
