// Level component with camera offset and tile-based rendering
import styled from "styled-components";
import { PlatformType } from "../types";

interface LevelProps {
  map: number[][];
  width: number;
  height: number;
  startX: number;
  startY: number;
  gravity: number;
  jumpForce: number;
  moveSpeed: number;
  cameraOffset: { x: number; y: number };
  tileSize: number;
  showPlatforms?: boolean;
}

/**
 * Get tile style based on platform type
 */
const getTileStyle = (type: number): React.CSSProperties | null => {
  switch (type) {
    case PlatformType.GROUND:
      return {
        backgroundColor: "#8B4513",
        backgroundImage:
          "repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(0,0,0,0.1) 5px, rgba(0,0,0,0.1) 10px)",
        border: "1px solid #5D2E0C",
        borderRadius: "2px",
      };
    case PlatformType.BRICK:
      return {
        backgroundColor: "#A52A2A",
        backgroundImage:
          "linear-gradient(45deg, #8B0000 25%, transparent 25%, transparent 50%, #8B0000 50%, #8B0000 75%, transparent 75%, transparent)",
        backgroundSize: "8px 8px",
        border: "2px solid #5D0000",
        borderRadius: "2px",
      };
    case PlatformType.QUESTION_BLOCK:
      return {
        backgroundColor: "#FFD700",
        backgroundImage:
          "linear-gradient(135deg, #FFD700 25%, transparent 25%, transparent 50%, #FFD700 50%, #FFD700 75%, transparent 75%, transparent)",
        backgroundSize: "10px 10px",
        border: "2px solid #B8860B",
        borderRadius: "4px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#8B4513",
        fontWeight: "bold",
        fontSize: "12px",
      };
    case PlatformType.PIPE:
      return {
        backgroundColor: "#228B22",
        border: "4px solid #006400",
        borderRadius: "8px 8px 0 0",
      };
    case PlatformType.BLOCK:
      return {
        backgroundColor: "#A0A0A0",
        backgroundImage:
          "radial-gradient(circle, #D3D3D3 10%, #808080 10%, #808080 20%, #A0A0A0 20%, #A0A0A0 30%, #808080 30%, #808080 40%, #A0A0A0 40%)",
        backgroundSize: "6px 6px",
        border: "2px solid #696969",
      };
    case PlatformType.AIR:
      return null;
    default:
      return {
        backgroundColor: "#696969",
        borderRadius: "2px",
      };
  }
};

/**
 * Level component that renders tile-based level map with camera offset
 */
export const Level: React.FC<LevelProps> = ({
  map,
  width,
  height,
  startX,
  startY,
  gravity,
  jumpForce,
  moveSpeed,
  cameraOffset,
  tileSize = 32,
  showPlatforms = true,
}) => {
  // Filter empty rows and columns based on map data
  const renderMap = () => {
    if (!showPlatforms) return null;

    return map.map((row, rowIndex) =>
      row.map((tile, colIndex) => {
        if (tile === PlatformType.AIR) return null;

        const tileStyle = getTileStyle(tile);
        if (!tileStyle) return null;

        return (
          <div
            key={`${rowIndex}-${colIndex}`}
            style={{
              position: "absolute",
              left: `${colIndex * tileSize + cameraOffset.x}px`,
              top: `${rowIndex * tileSize + cameraOffset.y}px`,
              width: `${tileSize}px`,
              height: `${tileSize}px`,
              ...tileStyle,
            }}
          >
            {/* Question block styling */}
            {tile === PlatformType.QUESTION_BLOCK && (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {"?"}
              </div>
            )}

            {/* Pipe styling */}
            {tile === PlatformType.PIPE && (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                }}
              >
                {/* Pipe top */}
                <div
                  style={{
                    height: `${tileSize * 0.4}px`,
                    backgroundColor: "#32CD32",
                    borderBottom: `4px solid ${tile === PlatformType.PIPE ? "#228B22" : "#006400"}`,
                  }}
                />
                {/* Pipe body */}
                <div
                  style={{
                    width: "100%",
                    height: `${tileSize * 0.6}px`,
                    backgroundColor: "#228B22",
                    border: `4px solid ${tile === PlatformType.PIPE ? "#006400" : "#228B22"}`,
                    borderRadius: "0 0 8px 8px",
                  }}
                />
              </div>
            )}

            {/* Brick pattern for brick blocks */}
            {tile === PlatformType.BRICK && (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundImage:
                    "linear-gradient(45deg, transparent 48%, rgba(0,0,0,0.1) 50%, transparent 52%)",
                  backgroundSize: "8px 8px",
                }}
              />
            )}
          </div>
        );
      }),
    );
  };

  return <div>{renderMap()}</div>;
};

export default Level;
