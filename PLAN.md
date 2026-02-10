# Super Mario Level Design - Text-Based Level System

## Overview

This text-based level system allows for easy creation and editing of Super Mario levels using simple character-based grids. Level data is stored in `.tsx` files with rows of text, making it quick and intuitive to modify levels without complex coding.

## File Structure

### Level File Format

Level files should be placed in `millegrilles.games.typescript/vite-project/app/games/supermario/levels/` with a `.tsx` extension.

```typescript
// Example: levels/LevelName.tsx
import type { LevelConfig } from "../types";

export const levelConfig: LevelConfig = {
  name: "Level Name Here",
  description: "Optional description",
  levelData: [
    "...................",  // Row 0
    "...................",  // Row 1
    ".......B...........",  // Row 2
    ".......P...........",  // Row 3
    ".....GGGGGG........",  // Row 4
    "GGGGGGGGGGGGGGGGGG",  // Row 5
    "GGGGGGGGGGGGGGGGGG",  // Row 6
    "GGGGGGGGGGGGGGGGGG",  // Row 7
  ],
  width: 40,
  height: 8,
  playerStartX: 4,
};
```

## Legend

| Character | Meaning | Game Object Type |
|-----------|---------|------------------|
| `.` | Empty space | No game object |
| `G` | Ground block | Solid ground platform |
| `B` | Breakable block | Block that can be destroyed |
| `P` | Player start | Where player spawns |
| `?` | Mystery block | Block that gives items |
| `#` | Hard block | Indestructible block |

## Game Level Types

### Block Interface

```typescript
interface Block {
  type: "ground" | "breakable" | "mystery" | "hard" | "player";
  x: number;
  y: number;
  width: number;
  height: number;
  health?: number;  // For breakable blocks
  content?: "coin" | "mushroom" | "star";  // For mystery blocks
}
```

### Level Configuration Interface

```typescript
interface LevelConfig {
  name: string;
  description: string;
  levelData: string[];
  width: number;  // Must match levelData columns
  height: number; // Must match levelData rows
  playerStartX?: number;
  playerStartY?: number;
}
```

## Implementation Components

### 1. Level Parser

Create `utils/LevelParser.tsx` to parse text-based levels:

```typescript
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
```

### 2. Level Blocks Component

Create `components/LevelBlocks.tsx` to render level objects:

```typescript
import React from "react";
import type { Block } from "../types";

const BLOCK_COLORS: Record<string, string> = {
  ground: "#228B22",      // Forest green
  breakable: "#A0522D",    // Sienna
  mystery: "#FFD700",      // Gold
  hard: "#696969",        // Dim gray
};

const BLOCK_STYLES: Record<string, React.CSSProperties> = {
  ground: {
    border: "1px solid #000",
    borderRadius: "4px",
  },
  breakable: {
    border: "2px solid #8B4513",
    backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(0,0,0,0.1) 5px, rgba(0,0,0,0.1) 10px)",
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
```

## Example Levels

### Simple Ground Test

```typescript
// levels/SimpleGround.tsx
export const levelConfig = {
  name: "Simple Ground",
  levelData: [
    "...................................................",
    "...................................................",
    "....................B...B.....B...................",
    "....................P....................P........",
    ".................GGGGGGGGGGGGGGGGGGGGGGGGGGGGGG...",
    "GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG...",
    "GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG...",
    "GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG...",
  ],
  width: 40,
  height: 8,
};
```

### Block Jumping

```typescript
// levels/BlockJump.tsx
export const levelConfig = {
  name: "Block Jump",
  levelData: [
    "........................B....B....................",
    ".............................B.................B..",
    "...............................B................B..",
    "........P......................B...................",
    ".....................BBBBBBBBB.....................",
    "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB",
    "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB",
    "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB",
    "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB",
  ],
  width: 40,
  height: 9,
};
```

## Integration with Existing Code

### Types.ts Updates

Add these interfaces to `types.ts`:

```typescript
/* Level configuration types */
export interface Block {
  type: "ground" | "breakable" | "mystery" | "hard" | "player";
  x: number;
  y: number;
  width: number;
  height: number;
  health?: number;
  content?: "coin" | "mushroom" | "star";
}

export interface LevelConfig {
  name: string;
  levelData: string[];
  width: number;
  height: number;
  playerStartX?: number;
  playerStartY?: number;
}
```

### Constants.ts Updates

Add these constants:

```typescript
export const BLOCK_SIZE = 40;  // Pixels per grid cell
export const BLOCK_ROWS = 16;  // Maximum rows
export const BLOCK_COLS = 40;  // Maximum columns
```

### Index.tsx Updates

Add level loading state to `SuperMarioProvider`:

```typescript
const [currentLevel, setCurrentLevel] = useState<LevelConfig | null>(null);
const [blocks, setBlocks] = useState<Block[]>([]);

const loadLevel = (levelConfig: LevelConfig) => {
  setCurrentLevel(levelConfig);
  const parsedBlocks = parseLevelConfig(levelConfig);
  setBlocks(parsedBlocks);
};
```

### Game.tsx Updates

Add LevelBlocks component to rendering:

```typescript
import LevelBlocks from "./components/LevelBlocks";

// In render JSX
<div style={{ position: "relative", width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}>
  <canvas ref={canvasRef} ... />
  <LevelBlocks blocks={blocks} />
  <Mario ... />
  <div style={{ marginTop: "8px" }}>
    {/* Buttons */}
  </div>
</div>
```

## Advantages of This Design

1. **Developer Friendly**: Simple text format, no complex JSON
2. **Visual**: Can see level structure at a glance
3. **Easy to Modify**: Quick changes without programming
4. **Portable**: Can share level files via text
5. **Flexible**: Easy to extend with new tile types
6. **Type Safe**: Strong typing throughout the level system
7. **Maintainable**: Simple text format is easy to edit and understand
8. **Minimal Changes**: Reuses existing game loop, rendering, and state management

## Future Enhancements

- Add more block types (coins, pipes, enemies, power-ups)
- Implement level editor UI
- Add multiple level selection UI
- Implement save/load progress
- Add level completion tracking
- Create custom block designs using sprites
- Support for scrolling levels beyond 40x16 grid
```

The user wants me to save this content directly as PLAN.md. I'll provide the file content wrapped in triple backticks as requested.</think>```markdown
# Super Mario Level Design - Text-Based Level System

## Overview

This text-based level system allows for easy creation and editing of Super Mario levels using simple character-based grids. Level data is stored in `.tsx` files with rows of text, making it quick and intuitive to modify levels without complex coding.

## File Structure

### Level File Format

Level files should be placed in `millegrilles.games.typescript/vite-project/app/games/supermario/levels/` with a `.tsx` extension.

```typescript
// Example: levels/LevelName.tsx
import type { LevelConfig } from "../types";

export const levelConfig: LevelConfig = {
  name: "Level Name Here",
  description: "Optional description",
  levelData: [
    "...................",  // Row 0
    "...................",  // Row 1
    ".......B...........",  // Row 2
    ".......P...........",  // Row 3
    ".....GGGGGG........",  // Row 4
    "GGGGGGGGGGGGGGGGGG",  // Row 5
    "GGGGGGGGGGGGGGGGGG",  // Row 6
    "GGGGGGGGGGGGGGGGGG",  // Row 7
  ],
  width: 40,
  height: 8,
  playerStartX: 4,
};
```

## Legend

| Character | Meaning | Game Object Type |
|-----------|---------|------------------|
| `.` | Empty space | No game object |
| `G` | Ground block | Solid ground platform |
| `B` | Breakable block | Block that can be destroyed |
| `P` | Player start | Where player spawns |
| `?` | Mystery block | Block that gives items |
| `#` | Hard block | Indestructible block |

## Game Level Types

### Block Interface

```typescript
interface Block {
  type: "ground" | "breakable" | "mystery" | "hard" | "player";
  x: number;
  y: number;
  width: number;
  height: number;
  health?: number;  // For breakable blocks
  content?: "coin" | "mushroom" | "star";  // For mystery blocks
}
```

### Level Configuration Interface

```typescript
interface LevelConfig {
  name: string;
  description: string;
  levelData: string[];
  width: number;  // Must match levelData columns
  height: number; // Must match levelData rows
  playerStartX?: number;
  playerStartY?: number;
}
```

## Implementation Components

### 1. Level Parser

Create `utils/LevelParser.tsx` to parse text-based levels:

```typescript
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
```

### 2. Level Blocks Component

Create `components/LevelBlocks.tsx` to render level objects:

```typescript
import React from "react";
import type { Block } from "../types";

const BLOCK_COLORS: Record<string, string> = {
  ground: "#228B22",      // Forest green
  breakable: "#A0522D",    // Sienna
  mystery: "#FFD700",      // Gold
  hard: "#696969",        // Dim gray
};

const BLOCK_STYLES: Record<string, React.CSSProperties> = {
  ground: {
    border: "1px solid #000",
    borderRadius: "4px",
  },
  breakable: {
    border: "2px solid #8B4513",
    backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(0,0,0,0.1) 5px, rgba(0,0,0,0.1) 10px)",
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
```

## Example Levels

### Simple Ground Test

```typescript
// levels/SimpleGround.tsx
export const levelConfig = {
  name: "Simple Ground",
  levelData: [
    "...................................................",
    "...................................................",
    "....................B...B.....B...................",
    "....................P....................P........",
    ".................GGGGGGGGGGGGGGGGGGGGGGGGGGGGGG...",
    "GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG...",
    "GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG...",
    "GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG...",
  ],
  width: 40,
  height: 8,
};
```

### Block Jumping

```typescript
// levels/BlockJump.tsx
export const levelConfig = {
  name: "Block Jump",
  levelData: [
    "........................B....B....................",
    ".............................B.................B..",
    "...............................B................B..",
    "........P......................B...................",
    ".....................BBBBBBBBB.....................",
    "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB",
    "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB",
    "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB",
    "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB",
  ],
  width: 40,
  height: 9,
};
```

## Integration with Existing Code

### Types.ts Updates

Add these interfaces to `types.ts`:

```typescript
/* Level configuration types */
export interface Block {
  type: "ground" | "breakable" | "mystery" | "hard" | "player";
  x: number;
  y: number;
  width: number;
  height: number;
  health?: number;
  content?: "coin" | "mushroom" | "star";
}

export interface LevelConfig {
  name: string;
  levelData: string[];
  width: number;
  height: number;
  playerStartX?: number;
  playerStartY?: number;
}
```

### Constants.ts Updates

Add these constants:

```typescript
export const BLOCK_SIZE = 40;  // Pixels per grid cell
export const BLOCK_ROWS = 16;  // Maximum rows
export const BLOCK_COLS = 40;  // Maximum columns
```

### Index.tsx Updates

Add level loading state to `SuperMarioProvider`:

```typescript
const [currentLevel, setCurrentLevel] = useState<LevelConfig | null>(null);
const [blocks, setBlocks] = useState<Block[]>([]);

const loadLevel = (levelConfig: LevelConfig) => {
  setCurrentLevel(levelConfig);
  const parsedBlocks = parseLevelConfig(levelConfig);
  setBlocks(parsedBlocks);
};
```

### Game.tsx Updates

Add LevelBlocks component to rendering:

```typescript
import LevelBlocks from "./components/LevelBlocks";

// In render JSX
<div style={{ position: "relative", width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}>
  <canvas ref={canvasRef} ... />
  <LevelBlocks blocks={blocks} />
  <Mario ... />
  <div style={{ marginTop: "8px" }}>
    {/* Buttons */}
  </div>
</div>
```

## Advantages of This Design

1. **Developer Friendly**: Simple text format, no complex JSON
2. **Visual**: Can see level structure at a glance
3. **Easy to Modify**: Quick changes without programming
4. **Portable**: Can share level files via text
5. **Flexible**: Easy to extend with new tile types
6. **Type Safe**: Strong typing throughout the level system
7. **Maintainable**: Simple text format is easy to edit and understand
8. **Minimal Changes**: Reuses existing game loop, rendering, and state management

## Future Enhancements

- Add more block types (coins, pipes, enemies, power-ups)
- Implement level editor UI
- Add multiple level selection UI
- Implement save/load progress
- Add level completion tracking
- Create custom block designs using sprites
- Support for scrolling levels beyond 40x16 grid