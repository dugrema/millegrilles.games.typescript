import type { LevelConfig, Block } from "../types";
import { BLOCK_SIZE } from "../constants";

export interface ParsedLevel {
  blocks: Block[];
  playerStart: { x: number; y: number } | null;
  groundY: number;
  groundHeight: number;
}

export function parseLevelConfig(levelConfig: LevelConfig): ParsedLevel {
  const blocks: Block[] = [];
  let playerStart: { x: number; y: number } | null = null;

  // Find the ground row (last row containing ground blocks)
  const groundRowIndex = levelConfig.levelData.length - 1;
  const groundY = groundRowIndex * BLOCK_SIZE;

  // Calculate the height from the bottom of the level to the ground
  const remainingRows = levelConfig.levelData.length - 1 - groundRowIndex;
  const groundHeight = (remainingRows + 1) * BLOCK_SIZE;

  levelConfig.levelData.forEach((row, rowIndex) => {
    const y = rowIndex * BLOCK_SIZE;

    for (let colIndex = 0; colIndex < row.length; colIndex++) {
      const char = row[colIndex];
      const x = colIndex * BLOCK_SIZE;

      switch (char) {
        case "G":
          blocks.push({
            type: "ground",
            x,
            y,
            width: BLOCK_SIZE,
            height: BLOCK_SIZE,
          });
          break;
        case "B":
          blocks.push({
            type: "breakable",
            x,
            y,
            width: BLOCK_SIZE,
            height: BLOCK_SIZE,
            health: 2,
          });
          break;
        case "P":
          playerStart = { x, y };
          break;
        case "?":
          blocks.push({
            type: "mystery",
            x,
            y,
            width: BLOCK_SIZE,
            height: BLOCK_SIZE,
            content: "coin",
          });
          break;
        case "#":
          blocks.push({
            type: "hard",
            x,
            y,
            width: BLOCK_SIZE,
            height: BLOCK_SIZE,
          });
          break;
      }
    }
  });

  return { blocks, playerStart, groundY, groundHeight };
}
