import React from "react";

export interface BackgroundProps {
  levelWidth: number;
  levelHeight: number;
  cameraX: number;
  cameraY: number;
  theme?: "day" | "night" | "sunset";
}

interface Cloud {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
}

interface Hill {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

export function Background({
  levelWidth,
  levelHeight,
  cameraX,
  cameraY,
}: BackgroundProps) {
  // Generate clouds for background
  const clouds = React.useMemo(() => {
    const cloudList: Cloud[] = [];
    const numClouds = 8;

    for (let i = 0; i < numClouds; i++) {
      cloudList.push({
        x: i * (levelWidth / numClouds) - Math.random() * 200,
        y: 50 + Math.random() * 150,
        width: 100 + Math.random() * 100,
        height: 30 + Math.random() * 30,
        speed: 0.2 + Math.random() * 0.3,
      });
    }

    return cloudList;
  }, [levelWidth]);

  // Generate hills for background
  const hills = React.useMemo(() => {
    const hillList: Hill[] = [];
    const numHills = 5;

    for (let i = 0; i < numHills; i++) {
      hillList.push({
        x: i * (levelWidth / numHills),
        y: levelHeight - 60,
        width: 200 + Math.random() * 150,
        height: 40 + Math.random() * 40,
        color: `hsl(${20 + Math.random() * 20}, ${70 + Math.random() * 20}%, ${40 + Math.random() * 20}%)`,
      });
    }

    return hillList;
  }, [levelWidth, levelHeight]);

  // Simple background theme colors
  const getThemeColors = (cameraX: number) => {
    switch (cameraX % 600) {
      case 0:
        return {
          sky: ["#5c94fc", "#87CEEB"],
          ground: "#228B22",
          grass: "#006400",
        };
      case 300:
        return {
          sky: ["#FF6347", "#87CEEB"],
          ground: "#228B22",
          grass: "#006400",
        };
      default:
        return {
          sky: ["#5c94fc", "#87CEEB"],
          ground: "#228B22",
          grass: "#006400",
        };
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: levelWidth,
        height: levelHeight,
        overflow: "hidden",
      }}
    >
      {/* Sky gradient */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: levelWidth,
          height: levelHeight,
          background: "linear-gradient(180deg, #5c94fc 0%, #87CEEB 100%)",
        }}
      />

      {/* Clouds */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: levelWidth,
          height: levelHeight,
        }}
      >
        {clouds.map((cloud, index) => {
          const screenX = cloud.x - cameraX * 0.3;
          const screenY = cloud.y - cameraY;

          if (screenX > -150 && screenX < levelWidth + 150) {
            return (
              <div
                key={index}
                style={{
                  position: "absolute",
                  left: screenX,
                  top: screenY,
                  width: cloud.width,
                  height: cloud.height,
                  background: "rgba(255, 255, 255, 0.8)",
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {/* Cloud puffs */}
                <div
                  style={{
                    position: "absolute",
                    left: 20,
                    top: 15,
                    width: 40,
                    height: 25,
                    background: "rgba(255, 255, 255, 0.9)",
                    borderRadius: "50%",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    right: 20,
                    top: 10,
                    width: 35,
                    height: 20,
                    background: "rgba(255, 255, 255, 0.9)",
                    borderRadius: "50%",
                  }}
                />
              </div>
            );
          }

          return null;
        })}
      </div>

      {/* Hills */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: levelWidth,
          height: levelHeight,
        }}
      >
        {hills.map((hill, index) => {
          const screenX = hill.x - cameraX * 0.1;
          const screenY = hill.y - cameraY;

          if (screenX > -hill.width && screenX < levelWidth + hill.width) {
            return (
              <div
                key={index}
                style={{
                  position: "absolute",
                  left: screenX,
                  bottom: 0,
                  width: hill.width,
                  height: hill.height,
                  background: hill.color,
                  borderRadius: "50% 50% 0 0",
                  transform: "rotate(-15deg)",
                }}
              />
            );
          }

          return null;
        })}
      </div>

      {/* Bush decorations at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: levelWidth,
          height: 40,
          background: "#228B22",
          borderTop: "10px solid #006400",
        }}
      />
    </div>
  );
}

// Export helper functions for static elements
export { drawCloud, drawHill, drawBush };

function drawCloud(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  frame: number = 0,
): void {
  ctx.save();
  ctx.fillStyle = "rgba(255, 255, 255, 0.9)";

  // Main cloud body
  ctx.beginPath();
  ctx.arc(x, y, width / 3, 0, Math.PI * 2);
  ctx.arc(x + width / 3, y - 10, width / 2.5, 0, Math.PI * 2);
  ctx.arc(x + width / 2, y, width / 2.5, 0, Math.PI * 2);
  ctx.arc(x + (width * 2) / 3, y - 5, width / 3, 0, Math.PI * 2);
  ctx.fill();

  // Simple cloud animation - slight horizontal movement
  const offset = Math.sin(frame * 0.05) * 20;
  if (offset !== 0) {
    ctx.translate(offset, 0);
  }

  ctx.restore();
}

function drawHill(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string = "#4a7c4e",
): void {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x - width / 2, y);
  ctx.quadraticCurveTo(x, y - height, x + width / 2, y);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawBush(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
): void {
  ctx.save();
  ctx.fillStyle = "#2d5a3d";
  ctx.beginPath();
  ctx.arc(x, y, width / 2, 0, Math.PI * 2);
  ctx.arc(x - width / 3, y + 5, width / 3, 0, Math.PI * 2);
  ctx.arc(x + width / 3, y + 5, width / 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
