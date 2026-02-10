import type { LevelConfig, Block } from "../types";

const BLOCK_SIZE = 40; // pixels per grid cell

export function parseLevelConfig(levelConfig: LevelConfig): Block[] {
  const blocks: Block[] = [];

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
          // Player start position
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

  return blocks;
}
