/**
 * Level 1 data for Super Mario
 * Contains tile-based map with game elements like enemies, coins, blocks, etc.
 */

import type { Level, Tile, Position } from "../types";
import { TILE_TYPES, LEVEL_CONFIG } from "../constants";

// Level 1 map data (character-based representation)
// Simple DEV map that fits the screen exactly.
const LEVEL_1_MAP = [
  "                         ",
  "                        B",
  "                         ",
  "                         ",
  "                         ",
  "                         ",
  "                         ",
  "                         ",
  "                  ? ? ?  ",
  "                   BBBBF",
  "      G         ?   BBBB ",
  "      C ##  Q            ",
  "                    Q    ",
  "               E  B  P B ",
  "GGGGGGGGGGGGGGGGGGGGGUGGG",
];

/**
 * Create a tile object from map character
 */
function createTile(
  char: string,
  x: number,
  y: number,
  tileSize: number,
): Tile | null {
  // Map characters to tile types
  switch (char) {
    case " ":
      return null; // Empty space

    case "#":
      return {
        id: `tile-${x}-${y}`,
        position: { x, y },
        dimensions: { width: tileSize, height: tileSize },
        type: "ground",
        solid: TILE_TYPES.ground.solid,
        animated: TILE_TYPES.ground.animated,
      };

    case "B": // Brick block
      return {
        id: `tile-${x}-${y}`,
        position: { x, y },
        dimensions: { width: tileSize, height: tileSize },
        type: "brick",
        solid: TILE_TYPES.brick.solid,
        animated: TILE_TYPES.brick.animated,
      };

    case "?": // Question block
      return {
        id: `tile-${x}-${y}`,
        position: { x, y },
        dimensions: { width: tileSize, height: tileSize },
        type: "question",
        solid: TILE_TYPES.question.solid,
        animated: TILE_TYPES.question.animated,
        value: 100, // Can contain coins
        frame: 0,
      };

    case "G": // Ground (lower segment)
      return {
        id: `tile-${x}-${y}`,
        position: { x, y },
        dimensions: { width: tileSize, height: tileSize },
        type: "ground",
        solid: TILE_TYPES.ground.solid,
        animated: TILE_TYPES.ground.animated,
      };

    case "P": // Pipe (left segment)
      return {
        id: `tile-${x}-${y}`,
        position: { x, y },
        dimensions: { width: tileSize, height: tileSize },
        type: "pipe_l",
        solid: TILE_TYPES.pipe_l.solid,
        animated: TILE_TYPES.pipe_l.animated,
      };

    case "Q": // Question block with content
      return {
        id: `tile-${x}-${y}`,
        position: { x, y },
        dimensions: { width: tileSize, height: tileSize },
        type: "question",
        solid: TILE_TYPES.question.solid,
        animated: TILE_TYPES.question.animated,
        value: 1, // Contains 1 coin
        frame: 0,
      };

    case "C": // Coin (floating)
      return {
        id: `coin-${x}-${y}`,
        position: { x, y },
        dimensions: { width: tileSize, height: tileSize },
        type: "coin_item",
        solid: TILE_TYPES.coin_item.solid,
        animated: TILE_TYPES.coin_item.animated,
        value: 100,
        frame: 0,
      };

    case "E": // Goomba (enemy)
      return {
        id: `enemy-${x}-${y}`,
        position: { x, y },
        dimensions: { width: tileSize, height: tileSize },
        type: "goomba",
        solid: TILE_TYPES.goomba.solid,
        animated: TILE_TYPES.goomba.animated,
        frame: 0,
      };

    case "F": // Flag
      return {
        id: `tile-${x}-${y}`,
        position: { x, y },
        dimensions: { width: tileSize, height: tileSize },
        type: "flag",
        solid: TILE_TYPES.flag.solid,
        animated: TILE_TYPES.flag.animated,
        frame: 0,
      };

    case "U": // Underground/pipe floor
      return {
        id: `tile-${x}-${y}`,
        position: { x, y },
        dimensions: { width: tileSize, height: tileSize },
        type: "ground",
        solid: TILE_TYPES.ground.solid,
        animated: TILE_TYPES.ground.animated,
      };

    case "X": // Cloud
      return {
        id: `tile-${x}-${y}`,
        position: { x, y },
        dimensions: { width: tileSize * 2, height: tileSize },
        type: "cloud",
        solid: TILE_TYPES.cloud.solid,
        animated: TILE_TYPES.cloud.animated,
        frame: 0,
      };

    case "Y": // Hill
      return {
        id: `tile-${x}-${y}`,
        position: { x, y },
        dimensions: { width: tileSize * 3, height: tileSize * 2 },
        type: "hill",
        solid: TILE_TYPES.hill.solid,
        animated: TILE_TYPES.hill.animated,
        frame: 0,
      };

    default:
      return null;
  }
}

/**
 * Level 1 configuration
 */
export const LEVEL_1: Level = {
  id: 1,
  name: "World 1-1",
  map: LEVEL_1_MAP,
  tileSize: LEVEL_CONFIG.TILE_SIZE,
  width: LEVEL_CONFIG.LEVEL_WIDTH * LEVEL_CONFIG.TILE_SIZE,
  height: LEVEL_CONFIG.LEVEL_HEIGHT * LEVEL_CONFIG.TILE_SIZE,
  startPos: {
    x: 64,
    y: 288,
  },
  endPos: {
    x: 600,
    y: 200,
  },
  enemyCount: 3,
  tiles: [],
  tilesByPosition: new Map(),
};

/**
 * Parse the level map and create tile objects
 */
function parseLevel(): void {
  const tiles: Tile[] = [];
  const tilesByPosition = new Map<string, Tile>();

  const map = LEVEL_1_MAP;
  const tileSize = LEVEL_1.tileSize;

  for (let row = 0; row < map.length; row++) {
    const rowString = map[row];
    for (let col = 0; col < rowString.length; col++) {
      const char = rowString[col];
      const tile = createTile(char, col * tileSize, row * tileSize, tileSize);

      if (tile) {
        tiles.push(tile);
        tilesByPosition.set(`${tile.position.x},${tile.position.y}`, tile);

        // Create position key for tiles with solid property
        if (tile.solid) {
          tilesByPosition.set(
            `solid-${tile.position.x},${tile.position.y}`,
            tile,
          );
        }
      }
    }
  }

  Object.assign(LEVEL_1, { tiles, tilesByPosition });
}

// Parse the level when imported
parseLevel();

/**
 * Export level for use in the game
 */
export default LEVEL_1;
