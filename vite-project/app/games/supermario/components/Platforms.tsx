// Platforms component with tile-based rendering and collision detection
import React, { useMemo, useCallback } from "react";

// --- Platform Types ---

export type TileType =
  | "empty"
  | "ground"
  | "brick"
  | "question"
  | "solid"
  | "pipe-top"
  | "pipe-body"
  | "pipe-base";

export type PlatformType =
  | "air"
  | "ground"
  | "brick"
  | "question_block"
  | "pipe"
  | "block";

export interface Tile {
  x: number;
  y: number;
  type: TileType;
  data?: {
    hasCoin: boolean;
    hasMushroom: boolean;
    blockType: string;
    hit: boolean;
  };
}

export interface PlatformCollision {
  collided: boolean;
  normal: { x: number; y: number };
  platformId?: number;
  hitPlatform?: PlatformType;
}

// --- Tile Constants ---

export const PLATFORM_TILE_SIZE = 32;
export const TILE_PADDING = 4;

export const TILE_TYPES = {
  EMPTY: "empty" as TileType,
  GROUND: "ground" as TileType,
  BRICK: "brick" as TileType,
  QUESTION: "question" as TileType,
  SOLID: "solid" as TileType,
  PIPE_TOP: "pipe-top" as TileType,
  PIPE_BODY: "pipe-body" as TileType,
  PIPE_BASE: "pipe-base" as TileType,
} as const;

export const TILE_COLORS: Record<TileType, string> = {
  empty: "transparent",
  ground: "#8B4513",
  brick: "#A52A2A",
  question: "#FFD700",
  solid: "#A0A0A0",
  "pipe-top": "#228B22",
  "pipe-body": "#228B22",
  "pipe-base": "#006400",
} as const;

export const PLATFORM_CONFIG = {
  tileSize: PLATFORM_TILE_SIZE,
  collisionBox: {
    padding: TILE_PADDING,
  },
  animation: {
    hitDuration: 0.15,
    blockHitDuration: 0.2,
  },
  pipes: {
    pipeWidth: PLATFORM_TILE_SIZE * 1.5,
    pipeHeight: PLATFORM_TILE_SIZE * 1.8,
  },
} as const;

// --- Level Map Parsing ---

function getTileTypeFromValue(value: number): TileType {
  switch (value) {
    case 1:
      return TILE_TYPES.GROUND;
    case 2:
      return TILE_TYPES.BRICK;
    case 3:
      return TILE_TYPES.QUESTION;
    case 4:
      return TILE_TYPES.PIPE_TOP;
    case 5:
      return TILE_TYPES.PIPE_BODY;
    case 6:
      return TILE_TYPES.PIPE_BASE;
    default:
      return TILE_TYPES.EMPTY;
  }
}

function getTileDataFromValue(value: number) {
  switch (value) {
    case 1:
      return {
        hasCoin: false,
        hasMushroom: false,
        blockType: "air",
        hit: false,
      };
    case 2:
      return {
        hasCoin: false,
        hasMushroom: false,
        blockType: "brick",
        hit: false,
      };
    case 3:
      return {
        hasCoin: true,
        hasMushroom: true,
        blockType: "question_block",
        hit: false,
      };
    case 4:
      return {
        hasCoin: true,
        hasMushroom: false,
        blockType: "pipe_top",
        hit: false,
      };
    case 5:
      return {
        hasCoin: false,
        hasMushroom: false,
        blockType: "pipe_body",
        hit: false,
      };
    default:
      return {
        hasCoin: false,
        hasMushroom: false,
        blockType: "air",
        hit: false,
      };
  }
}

function parseTileMap(map: number[][], tileSize: number): Tile[] {
  const tiles: Tile[] = [];

  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      const value = map[row][col];
      const tileType = getTileTypeFromValue(value);
      const tileData = getTileDataFromValue(value);

      tiles.push({
        x: col * tileSize,
        y: row * tileSize,
        type: tileType,
        data: tileData,
      });
    }
  }

  return tiles;
}

// --- Tile Rendering Components ---

const TileBase = ({
  tile,
  tileSize,
  collisionBoxPadding,
}: {
  tile: Tile;
  tileSize: number;
  collisionBoxPadding: number;
}) => {
  const { type, data } = tile;
  const size = tileSize - collisionBoxPadding * 2;
  const baseStyle = {
    position: "absolute" as const,
    left: `${collisionBoxPadding}px`,
    top: `${collisionBoxPadding}px`,
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: TILE_COLORS[type],
  };

  switch (type) {
    case TILE_TYPES.GROUND:
      return {
        ...baseStyle,
        backgroundImage:
          "repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(0,0,0,0.1) 5px, rgba(0,0,0,0.1) 10px)",
        border: "2px solid #5D2E0C",
        borderRadius: "2px",
      };
    case TILE_TYPES.BRICK:
      return {
        ...baseStyle,
        backgroundImage:
          "linear-gradient(45deg, #8B0000 25%, transparent 25%, transparent 50%, #8B0000 50%, #8B0000 75%, transparent 75%, transparent)",
        backgroundSize: "8px 8px",
        border: "2px solid #5D0000",
        borderRadius: "2px",
      };
    case TILE_TYPES.QUESTION:
      return {
        ...baseStyle,
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
        cursor: "pointer",
      };
    case TILE_TYPES.SOLID:
      return {
        ...baseStyle,
        backgroundImage:
          "radial-gradient(circle, #D3D3D3 10%, #808080 10%, #808080 20%, #A0A0A0 20%, #A0A0A0 30%, #808080 30%, #808080 40%, #A0A0A0 40%)",
        backgroundSize: "6px 6px",
        border: "2px solid #696969",
      };
    case TILE_TYPES.PIPE_TOP:
      return {
        ...baseStyle,
        backgroundColor: "#32CD32",
        borderBottom: `4px solid ${TILE_COLORS[TILE_TYPES.PIPE_TOP]}`,
        borderRadius: "4px 4px 0 0",
      };
    case TILE_TYPES.PIPE_BODY:
      return {
        ...baseStyle,
        backgroundColor: TILE_COLORS[TILE_TYPES.PIPE_BODY],
        border: `4px solid ${TILE_COLORS[TILE_TYPES.PIPE_TOP]}`,
        borderRadius: "0 0 4px 4px",
      };
    case TILE_TYPES.PIPE_BASE:
      return {
        ...baseStyle,
        backgroundColor: TILE_COLORS[TILE_TYPES.PIPE_BASE],
        border: `4px solid ${TILE_COLORS[TILE_TYPES.PIPE_TOP]}`,
        borderRadius: "0 0 4px 4px",
      };
    default:
      return baseStyle;
  }
};

const PipeTile: React.FC<{
  tile: Tile;
  tileSize: number;
  collisionBoxPadding: number;
}> = ({ tile, tileSize, collisionBoxPadding }) => {
  const { type, x, y } = tile;
  const size = tileSize - collisionBoxPadding * 2;
  const pipeHeight = tileSize * 1.8;

  // Pipe is taller than other tiles
  const pipeWidth = tileSize * 1.5;
  const pipeTopHeight = tileSize * 0.4;
  const pipeBodyHeight = tileSize * 1.4;

  return (
    <>
      {/* Pipe base */}
      <div
        style={{
          position: "absolute",
          left: `${collisionBoxPadding}px`,
          top: `${collisionBoxPadding + pipeHeight - tileSize * 0.2}px`,
          width: `${pipeWidth}px`,
          height: `${tileSize * 0.2}px`,
          backgroundColor: TILE_COLORS[TILE_TYPES.PIPE_BASE],
          border: `3px solid ${TILE_COLORS[TILE_TYPES.PIPE_TOP]}`,
          borderRadius: "4px 4px 0 0",
        }}
      />
      {/* Pipe body */}
      <div
        style={{
          position: "absolute",
          left: `${collisionBoxPadding}px`,
          top: `${collisionBoxPadding}px`,
          width: `${pipeWidth}px`,
          height: `${pipeBodyHeight}px`,
          backgroundColor: TILE_COLORS[TILE_TYPES.PIPE_BODY],
          border: `4px solid ${TILE_COLORS[TILE_TYPES.PIPE_TOP]}`,
          borderRadius: "0 0 4px 4px",
        }}
      />
      {/* Pipe top */}
      <div
        style={{
          position: "absolute",
          left: `${collisionBoxPadding}px`,
          top: `${collisionBoxPadding}px`,
          width: `${pipeWidth}px`,
          height: `${pipeTopHeight}px`,
          backgroundColor: "#228B22",
          borderBottom: `4px solid ${TILE_COLORS[TILE_TYPES.PIPE_TOP]}`,
          borderRadius: "4px 4px 0 0",
        }}
      />
    </>
  );
};

interface PlatformsProps {
  tiles: Tile[];
  tileSize: number;
  collisionBoxPadding: number;
  cameraX?: number;
  cameraY?: number;
  visibleTilesOnly?: boolean;
}

export const Platforms: React.FC<PlatformsProps> = ({
  tiles,
  tileSize,
  collisionBoxPadding,
  cameraX = 0,
  cameraY = 0,
  visibleTilesOnly = true,
}) => {
  const viewportWidth = 800;
  const viewportHeight = 480;

  // Filter visible tiles
  const visibleTiles = useMemo(() => {
    if (visibleTilesOnly) {
      return tiles.filter(
        (tile) =>
          tile.x - cameraX > -tileSize * 2 &&
          tile.x - cameraX < viewportWidth + tileSize * 2 &&
          tile.y - cameraY > -tileSize * 2 &&
          tile.y - cameraY < viewportHeight + tileSize * 2,
      );
    }
    return tiles;
  }, [
    tiles,
    cameraX,
    cameraY,
    viewportWidth,
    viewportHeight,
    visibleTilesOnly,
  ]);

  const renderTile = useMemo(
    () => (tile: Tile) => {
      if (
        tile.type === TILE_TYPES.PIPE_TOP ||
        tile.type === TILE_TYPES.PIPE_BODY ||
        tile.type === TILE_TYPES.PIPE_BASE
      ) {
        return (
          <PipeTile
            key={`${tile.x}-${tile.y}`}
            tile={tile}
            tileSize={tileSize}
            collisionBoxPadding={collisionBoxPadding}
          />
        );
      }
      const tileStyle = TileBase({ tile, tileSize, collisionBoxPadding });
      return <div key={`${tile.x}-${tile.y}`} style={tileStyle} />;
    },
    [tileSize, collisionBoxPadding],
  );

  return (
    <div
      style={{
        position: "absolute",
        left: `${collisionBoxPadding}px`,
        top: `${collisionBoxPadding}px`,
        width: `${tileSize * tiles[0]?.x + tileSize}px`,
        height: `${tileSize * tiles[0]?.y + tileSize}px`,
      }}
    >
      {visibleTiles.map(renderTile)}
    </div>
  );
};

interface CollisionResult {
  collided: boolean;
  normal: { x: number; y: number };
  platformId?: number;
  hitPlatform?: TileType | PlatformType;
}

function detectCollision(
  playerX: number,
  playerY: number,
  playerWidth: number,
  playerHeight: number,
  tiles: Tile[],
  tileSize: number,
  prevPlayerX: number,
  prevPlayerY: number,
): CollisionResult {
  const playerLeft = playerX;
  const playerRight = playerX + playerWidth;
  const playerTop = playerY;
  const playerBottom = playerY + playerHeight;

  const startCol = Math.max(0, Math.floor(playerLeft / tileSize));
  const endCol = Math.min(Math.ceil(playerRight / tileSize), tiles.length - 1);
  const startRow = Math.max(0, Math.floor(playerTop / tileSize));
  const endRow = Math.min(Math.ceil(playerBottom / tileSize), tiles.length - 1);

  let collided = false;
  let normal = { x: 0, y: 0 };
  let hitPlatform: TileType | PlatformType | undefined;
  let hitIndex: number | undefined;

  for (let col = startCol; col <= endCol; col++) {
    for (let row = startRow; row <= endRow; row++) {
      const tileIndex = row * Math.ceil(tiles[0]?.x / tileSize || 1) + col;
      if (tileIndex >= tiles.length) continue;

      const tile = tiles[tileIndex];
      if (!tile || tile.type === "empty") continue;

      const tileLeft = tile.x;
      const tileRight = tile.x + tileSize;
      const tileTop = tile.y;
      const tileBottom = tile.y + tileSize;

      const overlapLeft = Math.max(playerLeft, tileLeft);
      const overlapRight = Math.min(playerRight, tileRight);
      const overlapTop = Math.max(playerTop, tileTop);
      const overlapBottom = Math.min(playerBottom, tileBottom);

      if (overlapLeft < overlapRight && overlapTop < overlapBottom) {
        const overlapX = overlapRight - overlapLeft;
        const overlapY = overlapBottom - overlapTop;

        const prevPlayerLeft = prevPlayerX;
        const prevPlayerRight = prevPlayerX + playerWidth;
        const prevPlayerTop = prevPlayerY;
        const prevPlayerBottom = prevPlayerY + playerHeight;

        const prevTileLeft = tileLeft;
        const prevTileRight = tileRight;
        const prevTileTop = tileTop;
        const prevTileBottom = tileBottom;

        const prevOverlapLeft = Math.max(prevPlayerLeft, prevTileLeft);
        const prevOverlapRight = Math.min(prevPlayerRight, prevTileRight);
        const prevOverlapTop = Math.max(prevPlayerTop, prevTileTop);
        const prevOverlapBottom = Math.min(prevPlayerBottom, prevTileBottom);

        const prevOverlapX = prevOverlapRight - prevOverlapLeft;
        const prevOverlapY = prevOverlapBottom - prevOverlapTop;

        const deltaX = overlapX - prevOverlapX;
        const deltaY = overlapY - prevOverlapY;

        if (Math.abs(deltaX) < Math.abs(deltaY)) {
          normal.x = deltaX > 0 ? 1 : -1;
          normal.y = 0;
          collided = true;
          hitPlatform = tile.type === "pipe-top" ? "pipe" : tile.type;
          hitIndex = tileIndex;
        } else {
          normal.y = deltaY > 0 ? 1 : -1;
          normal.x = 0;
          collided = true;
          hitPlatform = tile.type === "pipe-top" ? "pipe" : tile.type;
          hitIndex = tileIndex;
        }
      }
    }
  }

  return { collided, normal, platformId: hitIndex, hitPlatform };
}

function isColliding(
  playerX: number,
  playerY: number,
  playerWidth: number,
  playerHeight: number,
  tileX: number,
  tileY: number,
  tileSize: number,
): boolean {
  return (
    playerX < tileX + tileSize &&
    playerX + playerWidth > tileX &&
    playerY < tileY + tileSize &&
    playerY + playerHeight > tileY
  );
}

interface PlatformProps {
  tile: Tile;
  position: number;
  width: number;
  height: number;
}

export const Platform: React.FC<PlatformProps> = ({
  tile,
  position,
  width,
  height,
}) => {
  return (
    <div
      data-platform={tile.type}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: width,
        height: height,
      }}
    />
  );
};
