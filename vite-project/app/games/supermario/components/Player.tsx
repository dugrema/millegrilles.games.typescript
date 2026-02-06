// Player component with sprite rendering and physics
import React from "react";

export { drawMario };

interface PlayerProps {
  x: number;
  y: number;
  width: number;
  height: number;
  state: "idle" | "walk" | "run" | "jump" | "duck";
  animationFrame: number;
  facingLeft: boolean;
  isSmall: boolean;
  isBig: boolean;
  isFire: boolean;
  isSprinting: boolean;
  cameraX?: number;
  cameraY?: number;
}

/**
 * Get color scheme based on power-up state
 */
const getColors = (
  isSmall: boolean,
  isBigOrFire: boolean,
  isFire: boolean,
): { hat: string; shirt: string; overalls: string; skin: string } => {
  if (isSmall) {
    return {
      hat: "#E53935", // Red
      shirt: "#E53935", // Red
      overalls: "#1E88E5", // Blue
      skin: "#FFCC80", // Light skin tone
    };
  }
  if (isFire) {
    return {
      hat: "#FDD835", // Yellow
      shirt: "#FDD835", // Yellow
      overalls: "#1E88E5", // Blue
      skin: "#FFCC80", // Light skin tone
    };
  }
  return {
    hat: "#E53935", // Red
    shirt: "#E53935", // Red
    overalls: "#1E88E5", // Blue
    skin: "#FFCC80", // Light skin tone
  };
};

/**
 * Get animation frame offset based on state and frame count
 */
const getFrameOffset = (
  state: string,
  animationFrame: number,
  frameCount: number,
): number => {
  const frame = animationFrame % frameCount;

  switch (state) {
    case "idle":
      return frame;
    case "walk":
      return frame * 4; // Walk has more frames
    case "run":
      return frame * 6; // Run has most frames
    case "jump":
      return frame;
    default:
      return frame;
  }
};

/**
 * Draw Mario sprite on canvas
 */
const drawMario = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  state: string,
  frame: number,
  facingLeft: boolean,
  isSmall: boolean,
  isFire: boolean,
): void => {
  const colors = getColors(isSmall, isFire, isFire);

  // Draw shadow
  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  ctx.fillRect(x + 4, y + height - 6, width - 8, 4);

  const spriteWidth = width;
  const spriteHeight = height;
  const frameOffset = getFrameOffset(state, frame, 12);

  // Animation phases based on state
  if (state === "jump" || state === "fall") {
    // Jump animation: arms raised up
    const armOffset = facingLeft ? -2 : 2;

    // Body
    ctx.fillStyle = colors.shirt;
    ctx.fillRect(x, y, spriteWidth, spriteHeight * 0.6);

    // Overalls
    ctx.fillStyle = colors.overalls;
    ctx.fillRect(
      x + 4,
      y + spriteHeight * 0.3,
      spriteWidth - 8,
      spriteHeight * 0.4,
    );

    // Head
    ctx.fillStyle = colors.skin;
    ctx.fillRect(
      x + spriteWidth * 0.2,
      y + (isSmall ? spriteHeight * 0.05 : spriteHeight * 0.08),
      spriteWidth * 0.6,
      spriteHeight * 0.25,
    );

    // Hat
    ctx.fillStyle = colors.hat;
    if (facingLeft) {
      ctx.fillRect(x - 4, y, 8, 8);
      ctx.fillRect(x, y, spriteWidth * 0.4, 8);
    } else {
      ctx.fillRect(x + spriteWidth * 0.6, y, spriteWidth * 0.4, 8);
      ctx.fillRect(x + spriteWidth * 0.8, y, 8, 8);
    }

    // Eyes
    ctx.fillStyle = "#000";
    const eyeX = facingLeft ? x + spriteWidth * 0.25 : x + spriteWidth * 0.55;
    ctx.fillRect(eyeX, y + spriteHeight * 0.12, 2, 3);

    // Arms (raised)
    ctx.fillStyle = colors.overalls;
    ctx.fillRect(x - 2, y + 4, 4, 8);
    ctx.fillRect(x + spriteWidth - 2, y + 4, 4, 8);

    // Legs (together)
    ctx.fillStyle = colors.hat;
    ctx.fillRect(
      x + spriteWidth * 0.3,
      y + spriteHeight * 0.7,
      spriteWidth * 0.2,
      spriteHeight * 0.3,
    );
    ctx.fillRect(
      x + spriteWidth * 0.5,
      y + spriteHeight * 0.7,
      spriteWidth * 0.2,
      spriteHeight * 0.3,
    );
  } else if (state === "duck") {
    // Ducking animation
    const duckHeight = spriteHeight * 0.6;
    const standingHeight = spriteHeight * 0.4;

    // Body (lowered)
    ctx.fillStyle = colors.shirt;
    ctx.fillRect(x, y + duckHeight, spriteWidth, standingHeight);

    // Overalls
    ctx.fillStyle = colors.overalls;
    ctx.fillRect(
      x + 4,
      y + duckHeight + standingHeight * 0.3,
      spriteWidth - 8,
      standingHeight * 0.4,
    );

    // Head (lowered)
    ctx.fillStyle = colors.skin;
    ctx.fillRect(
      x + spriteWidth * 0.2,
      y + duckHeight + 4,
      spriteWidth * 0.6,
      standingHeight * 0.25,
    );

    // Hat
    ctx.fillStyle = colors.hat;
    if (facingLeft) {
      ctx.fillRect(x - 4, y + duckHeight, 8, 8);
      ctx.fillRect(x, y + duckHeight, spriteWidth * 0.4, 8);
    } else {
      ctx.fillRect(x + spriteWidth * 0.6, y + duckHeight, spriteWidth * 0.4, 8);
      ctx.fillRect(x + spriteWidth * 0.8, y + duckHeight, 8, 8);
    }

    // Eyes
    ctx.fillStyle = "#000";
    const eyeX = facingLeft ? x + spriteWidth * 0.25 : x + spriteWidth * 0.55;
    ctx.fillRect(eyeX, y + duckHeight + 12, 2, 3);
  } else {
    // Walking/running animation

    // Body
    ctx.fillStyle = colors.shirt;
    ctx.fillRect(x, y, spriteWidth, spriteHeight * 0.6);

    // Overalls
    ctx.fillStyle = colors.overalls;
    ctx.fillRect(
      x + 4,
      y + spriteHeight * 0.3,
      spriteWidth - 8,
      spriteHeight * 0.4,
    );

    // Head
    ctx.fillStyle = colors.skin;
    ctx.fillRect(
      x + spriteWidth * 0.2,
      y + (isSmall ? spriteHeight * 0.05 : spriteHeight * 0.08),
      spriteWidth * 0.6,
      spriteHeight * 0.25,
    );

    // Hat
    ctx.fillStyle = colors.hat;
    if (facingLeft) {
      ctx.fillRect(x - 4, y, 8, 8);
      ctx.fillRect(x, y, spriteWidth * 0.4, 8);
    } else {
      ctx.fillRect(x + spriteWidth * 0.6, y, spriteWidth * 0.4, 8);
      ctx.fillRect(x + spriteWidth * 0.8, y, 8, 8);
    }

    // Eyes
    ctx.fillStyle = "#000";
    const eyeX = facingLeft ? x + spriteWidth * 0.25 : x + spriteWidth * 0.55;
    ctx.fillRect(eyeX, y + spriteHeight * 0.12, 2, 3);

    // Legs animation based on state and frame
    ctx.fillStyle = colors.hat;
    const legOffset = state === "run" ? Math.sin((frame * Math.PI) / 4) * 6 : 0;

    if (facingLeft) {
      ctx.fillRect(
        x + spriteWidth * 0.3 - legOffset,
        y + spriteHeight * 0.6,
        spriteWidth * 0.15,
        spriteHeight * 0.4,
      );
      ctx.fillRect(
        x + spriteWidth * 0.55 + legOffset,
        y + spriteHeight * 0.6,
        spriteWidth * 0.15,
        spriteHeight * 0.4,
      );
    } else {
      ctx.fillRect(
        x + spriteWidth * 0.3 + legOffset,
        y + spriteHeight * 0.6,
        spriteWidth * 0.15,
        spriteHeight * 0.4,
      );
      ctx.fillRect(
        x + spriteWidth * 0.55 - legOffset,
        y + spriteHeight * 0.6,
        spriteWidth * 0.15,
        spriteHeight * 0.4,
      );
    }

    // Arms animation
    ctx.fillStyle = colors.overalls;
    const armOffset =
      state === "run"
        ? Math.sin((frame * Math.PI) / 4) * 3
        : state === "walk"
          ? Math.sin((frame * Math.PI) / 6) * 3
          : 0;
    if (facingLeft) {
      ctx.fillRect(x - 2, y + 4 + armOffset, 4, 8);
      ctx.fillRect(x + spriteWidth - 2, y + 4 - armOffset, 4, 8);
    } else {
      ctx.fillRect(x - 2, y + 4 - armOffset, 4, 8);
      ctx.fillRect(x + spriteWidth - 2, y + 4 + armOffset, 4, 8);
    }
  }

  // Fire effect for fire Mario
  if (isFire) {
    ctx.fillStyle = `rgba(255, 100, 0, ${0.3 + Math.random() * 0.3})`;
    const fireLength = 8 + Math.floor(frame / 2);
    const fireX = facingLeft ? x - fireLength + 4 : x + width - 4;
    ctx.beginPath();
    ctx.moveTo(fireX, y + height / 2);
    for (let i = 0; i < fireLength; i += 3) {
      ctx.lineTo(fireX + (facingLeft ? -i : i), y + height / 2 + i * 0.5);
    }
    ctx.strokeStyle = "#FF5722";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fill();
  }
};

/**
 * Player component with sprite rendering
 */
export const Player: React.FC<PlayerProps> = ({
  x,
  y,
  width,
  height,
  state,
  animationFrame,
  facingLeft = false,
  isSmall = false,
  isBig = false,
  isFire = false,
  isSprinting = false,
  cameraX = 0,
  cameraY = 0,
}) => {
  // Apply camera offset to player position
  const displayX = x - cameraX;
  const displayY = y - cameraY;

  return (
    <div
      style={{
        position: "absolute",
        left: `${displayX}px`,
        top: `${displayY}px`,
        width: `${width}px`,
        height: `${height}px`,
        transform: facingLeft ? "scaleX(-1)" : "scaleX(1)",
        transition: "transform 0.1s ease-out",
      }}
    >
      <canvas
        width={width}
        height={height}
        ref={(canvas) => {
          if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.clearRect(0, 0, width, height);
              drawMario(
                ctx,
                0,
                0,
                width,
                height,
                state,
                animationFrame,
                facingLeft,
                isSmall,
                isFire,
              );
            }
          }
        }}
        aria-label="Mario character"
      />
    </div>
  );
};

export default Player;
