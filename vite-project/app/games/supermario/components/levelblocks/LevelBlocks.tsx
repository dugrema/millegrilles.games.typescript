import React from "react";
import type { Block } from "../../types";

const BLOCK_COLORS: Record<string, string> = {
  ground: "#228B22", // Forest green
  breakable: "#A0522D", // Sienna
  mystery: "#FFD700", // Gold
  hard: "#696969", // Dim gray
};

const BLOCK_STYLES: Record<string, React.CSSProperties> = {
  ground: {
    border: "1px solid #000",
    borderRadius: "4px",
  },
  breakable: {
    border: "2px solid #8B4513",
    backgroundImage:
      "repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(0,0,0,0.1) 5px, rgba(0,0,0,0.1) 10px)",
  },
  mystery: {
    border: "2px solid #FFA500",
    background: "#FFD700",
  },
  hard: {
    border: "2px solid #333",
    background: "#4a4a4a",
  },
};

interface LevelBlocksProps {
  blocks: Block[];
}

export default function LevelBlocks({ blocks }: LevelBlocksProps) {
  return (
    <>
      {blocks.map((block, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: block.x,
            top: block.y,
            width: block.width,
            height: block.height,
            backgroundColor: BLOCK_COLORS[block.type] || "#000",
            ...BLOCK_STYLES[block.type],
          }}
        />
      ))}
    </>
  );
}
