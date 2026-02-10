# Detailed Implementation Design for Level System

## Overview

This document provides a comprehensive implementation design for two critical level system issues in the Super Mario clone:

1. **Horizontal Scrolling**: Fix camera offset rendering for level blocks
2. **Collision Detection**: Implement block-based ground collision and wall collisions

## Issue 1: Horizontal Scrolling - Implementation

### Current State Analysis

**File**: `millegrilles.games.typescript/vite-project/app/games/supermario/index.tsx`

**Problem**:
```typescript
// Line 144-146: calculateCameraOffset is defined inside game loop
const calculateCameraOffset = (playerX: number) => {
  const targetX = CANVAS_WIDTH / 2 - playerX;
  const minX = -playerX;
  const maxX = -playerX + CANVAS_WIDTH;
  return { x: Math.max(Math.min(targetX, maxX), minX), y: 0 };
};

// Line 150-151: But this is used incorrectly
cameraOffset: calculateCameraOffset(prev.pos.x + vx),
```

**Result**: 
- Mario renders at `pos.x + cameraOffset.x` (correct)
- Blocks render at `block.x` (incorrect - missing camera offset)

### Implementation

#### Step 1: Fix Camera Offset Calculation

Move `calculateCameraOffset` to be a proper helper function at the module level:

```typescript
// millegrilles.games.typescript/vite-project/app/games/supermario/index.tsx

const calculateCameraOffset = (playerX: number) => {
  // Keep player in center of screen
  const targetX = CANVAS_WIDTH / 2 - playerX;
  // Clamp offset to screen bounds
  const minX = -playerX; // Player can't go past left edge
  const maxX = -playerX + CANVAS_WIDTH; // Player can't go past right edge
  return { 
    x: Math.max(Math.min(targetX, maxX), minX), 
    y: 0 
  };
};
```

#### Step 2: Update Game Loop to Use Camera Offset

The game loop already calculates camera offset correctly, but we need to ensure it's used consistently:

```typescript
// millegrilles.games.typescript/vite-project/app/games/supermario/index.tsx

// Gameloop
useEffect(() => {
  let anim: number = 0;
  const loop = (time: number) => {
    setPlayer((prev) => {
      // ... existing code for velocity and movement ...
      
      // Calculate camera offset
      const newCameraOffset = calculateCameraOffset(prev.pos.x + vx);

      return {
        pos: { x: prev.pos.x + vx, y: newY },
        vel: { x: vx, y: onGround ? 0 : vy },
        onGround,
        cameraOffset: newCameraOffset, // This is already being set
      };
    });
    // ... rest of the loop
  };
  // ...
}, [running]);
```

**Note**: The game loop is already working correctly for Mario rendering. The issue is in the LevelBlocks component.

#### Step 3: Fix LevelBlocks Component to Use Camera Offset

**File**: `millegrilles.games.typescript/vite-project/app/games/supermario/components/levelblocks/LevelBlocks.tsx`

```typescript
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

// Props now include cameraOffset from the player state
interface LevelBlocksProps {
  blocks: Block[];
  cameraOffset: { x: number; y: number };
}

```typescript
 export default function LevelBlocks({ blocks, cameraOffset }: LevelBlocksProps) {
   const levelContainerStyle: React.CSSProperties = {
     position: "relative",
     width: CANVAS_WIDTH,
     height: CANVAS_HEIGHT,
     overflow: "hidden", // Clip blocks that render outside canvas
   };

   return (
     <div style={levelContainerStyle}>
       {blocks.map((block, index) => (
         <div
           key={index}
           style={{
             position: "absolute",
             // FIX: Add cameraOffset to block position
             left: block.x + cameraOffset.x,
             top: block.y + cameraOffset.y,
             width: block.width,
             height: block.height,
             backgroundColor: BLOCK_COLORS[block.type] || "#000",
             ...BLOCK_STYLES[block.type],
           }}
         />
       ))}
     </div>
   );
 }
```

#### Step 4: Pass Camera Offset to LevelBlocks from Game.tsx

**File**: `millegrilles.games.typescript/vite-project/app/games/supermario/Game.tsx`

```typescript
// millegrilles.games.typescript/vite-project/app/games/supermario/Game.tsx

// ... existing imports

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { startGame, pauseGame, player, loadLevel, blocks, currentLevel } =
    useSuperMario();

  // ... existing frame and animation logic ...

  return (
    <div
      style={{
        position: "relative",
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
      }}
    >
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        style={{ border: "1px solid #333" }}
      />
      {/* FIX: Pass cameraOffset to LevelBlocks component */}
      <LevelBlocks
        blocks={blocks}
        cameraOffset={player.cameraOffset}
      />

      {/* Mario renders at pos.x + cameraOffset.x */}
      <Mario
        frame={frame}
        action={
          player.onGround
            ? player.vel.x !== 0
              ? "walking"
              : "idle"
            : "jumping"
        }
        x={player.pos.x + player.cameraOffset.x}
        y={player.pos.y}
      />

      {/* ... existing UI buttons ... */}
    </div>
  );
}
```

## Issue 2: Collision Detection - Implementation

### Current State Analysis

**File**: `millegrilles.games.typescript/vite-project/app/games/supermario/index.tsx`

**Current Logic** (Lines 123-129):
```typescript
// Ground collision with push-out and horizontal velocity reset
const groundLevel = GROUND_Y - PLAYER_HEIGHT;
let newY = prev.pos.y + vy;
if (newY > groundLevel) {
  // Player sank into ground - push them out
  newY = groundLevel;
  vy = 0;
}
const onGround = newY >= groundLevel;

return {
  pos: { x: prev.pos.x + vx, y: newY },
  vel: { x: vx, y: onGround ? 0 : vy },
  onGround,
  cameraOffset: calculateCameraOffset(prev.pos.x + vx),
};
```

**Problems**:
1. Only checks `GROUND_Y = 300`, ignores actual blocks
2. No wall collision (can walk through blocks)
3. No block height checking (can jump up from below)
4. No "climbing blocks" prevention

### Implementation

#### Helper Functions

Add these helper functions before the game loop in `index.tsx`:

```typescript
// millegrilles.games.typescript/vite-project/app/games/supermario/index.tsx

/**
 * Check if player overlaps with a block
 * @param player - Player position and dimensions
 * @param block - Block position and dimensions
 * @returns true if player and block overlap
 */
function checkCollision(player: PlayerState, block: Block): boolean {
  const playerLeft = player.pos.x;
  const playerRight = player.pos.x + PLAYER_WIDTH;
  const playerTop = player.pos.y;
  const playerBottom = player.pos.y + PLAYER_HEIGHT;

  const blockLeft = block.x;
  const blockRight = block.x + block.width;
  const blockTop = block.y;
  const blockBottom = block.y + block.height;

  return (
    playerLeft < blockRight &&
    playerRight > blockLeft &&
    playerTop < blockBottom &&
    playerBottom > blockTop
  );
}

/**
 * Check if player is ABOVE a block
 * @param player - Player position
 * @param block - Block position and dimensions
 * @returns true if player's bottom is above block's top
 */
function isAboveBlock(player: PlayerState, block: Block): boolean {
  const playerBottom = player.pos.y + PLAYER_HEIGHT;
  const blockTop = block.y;
  return playerBottom < blockTop;
}

/**
 * Check if player is BELOW a block
 * @param player - Player position
 * @param block - Block position and dimensions
 * @returns true if player's top is above block's bottom
 */
function isBelowBlock(player: PlayerState, block: Block): boolean {
  const playerTop = player.pos.y;
  const blockBottom = block.y + block.height;
  return playerTop > blockBottom;
}
```

#### Integration Logic

Replace the collision logic in the game loop with block-based collision detection:

```typescript
// millegrilles.games.typescript/vite-project/app/games/supermario/index.tsx

// Gameloop
useEffect(() => {
  let anim: number = 0;
  const loop = (time: number) => {
    setPlayer((prev) => {
      // Apply friction
      let vx = prev.vel.x;

      // Apply input acceleration
      if (keysRef.current.right) vx += MOVE_SPEED;
      else if (keysRef.current.left) vx -= MOVE_SPEED;
      else if (prev.onGround) {
        if (vx > -0.1 && vx < 0.1) vx = 0.0;
        else vx -= vx * FRICTION_FACTOR;
      }

      // Apply run speed modifier
      let maxSpeed = MAX_SPEED;
      if (keysRef.current.run) {
        maxSpeed = MAX_RUN_SPEED;
      }

      // Clamp to max speed
      if (vx > 0) vx = Math.min(maxSpeed, vx);
      else vx = Math.max(-maxSpeed, vx);

      // Jump
      if (keysRef.current.jump && prev.onGround) {
        return {
          ...prev,
          vel: { x: vx, y: JUMP_VELOCITY },
          onGround: false,
          cameraOffset: calculateCameraOffset(prev.pos.x + vx),
        };
      }

      // Gravity
      let vy = prev.vel.y + GRAVITY;

      // Calculate potential new positions
      const newX = prev.pos.x + vx;
      const newY = prev.pos.y + vy;

      // === BLOCK-BASED COLLISION DETECTION ===
      
      let onGround = false;
      let groundY = GROUND_Y; // Default to floor

      // Check collisions with all blocks
      for (const block of blocks) {
        // Skip player-start position blocks to prevent early collision
        if (block.type === "player") continue;

        // Calculate block position with camera offset
        const blockLeft = block.x + prev.cameraOffset.x;
        const blockRight = block.x + block.width + prev.cameraOffset.x;
        const blockTop = block.y + prev.cameraOffset.y;
        const blockBottom = block.y + block.height + prev.cameraOffset.y;

        // Check for horizontal collision (wall)
        if (prev.pos.y < blockBottom && prev.pos.y + PLAYER_HEIGHT > blockTop) {
          // Player is vertically within block bounds
          // Check if moving into block
          if (vx > 0 && newX + PLAYER_WIDTH > blockLeft && newX < blockLeft) {
            // Moving right into block
            newX = blockLeft - PLAYER_WIDTH;
            vx = 0;
          } else if (vx < 0 && newX < blockRight && newX + PLAYER_WIDTH > blockRight) {
            // Moving left into block
            newX = blockRight;
            vx = 0;
          }
        }

        // Check for ground collision
        if (newY + PLAYER_HEIGHT > blockTop && newY < blockBottom) {
          // Player is falling and would hit or pass through block
          if (vy > 0) {
            // Only allow ground collision if player is below block top (not climbing)
            // or if player is above and we're setting ground level
            const playerAbove = prev.pos.y + PLAYER_HEIGHT < blockTop;
            const playerBelow = prev.pos.y > blockBottom;
            
            if (playerBelow) {
              // Player is walking on or below block
              newY = blockTop - PLAYER_HEIGHT;
              vy = 0;
              onGround = true;
              groundY = blockTop;
            } else if (playerAbove && vy > 0) {
              // Player falling and would hit block top
              // Adjust to sit on top of block
              newY = blockTop - PLAYER_HEIGHT;
              vy = 0;
              onGround = true;
              groundY = blockTop;
            }
          }
        }
      }

      // Fallback to floor if no ground found
      if (!onGround) {
        const floorLevel = GROUND_Y - PLAYER_HEIGHT;
        if (newY > floorLevel) {
          newY = floorLevel;
          vy = 0;
          onGround = true;
          groundY = GROUND_Y;
        }
      }

      return {
        pos: { x: newX, y: newY },
        vel: { x: vx, y: vy }, // Keep vertical velocity for jumping
        onGround,
        cameraOffset: calculateCameraOffset(newX),
      };
    });

    if (running) {
      anim = requestAnimationFrame(loop);
    }
  };

  if (running) {
    anim = requestAnimationFrame(loop);
  }
  return () => cancelAnimationFrame(anim);
}, [running, blocks]);
```

#### Alternative: More Concise Collision Logic

For better readability, we can use the helper functions with a simpler approach:

```typescript
// Calculate potential new positions
const newX = prev.pos.x + vx;
const newY = prev.pos.y + vy;
let onGround = prev.onGround;
let vy = prev.vel.y + GRAVITY;

// Find the highest ground block
let highestGroundY = groundLevel;

// Check collisions
for (const block of blocks) {
  if (block.type === "player") continue;
  if (!checkCollision(prev, block)) continue;

  // Get block position with camera offset
  const blockX = block.x + prev.cameraOffset.x;
  const blockY = block.y + prev.cameraOffset.y;

  // Horizontal collision (wall)
  if (isAboveBlock(prev, block) || isBelowBlock(prev, block)) {
    if (vx > 0 && newX >= blockX && newX < blockX + PLAYER_WIDTH) {
      newX = blockX - PLAYER_WIDTH;
      vx = 0;
    } else if (vx < 0 && newX + PLAYER_WIDTH <= blockX + block.width && newX + PLAYER_WIDTH > blockX) {
      newX = blockX + block.width;
      vx = 0;
    }
  }

  // Vertical collision (ground)
  if (vy > 0) {
    if (isAboveBlock(prev, block)) {
      // Player falling onto block
      newY = blockY - PLAYER_HEIGHT;
      vy = 0;
      onGround = true;
      highestGroundY = Math.min(highestGroundY, blockY);
    } else if (isBelowBlock(prev, block) && newY + PLAYER_HEIGHT <= blockY + block.height) {
      // Player walking on top of block
      newY = blockY - PLAYER_HEIGHT;
      vy = 0;
      onGround = true;
      highestGroundY = Math.min(highestGroundY, blockY);
    }
  }
}

// Ensure on floor if no ground found
if (!onGround) {
  if (newY > highestGroundY) {
    newY = highestGroundY;
    vy = 0;
    onGround = true;
  }
}
```

## Integration Plan

### Step-by-Step Implementation

#### Phase 1: Horizontal Scrolling (Step 1)

**Files to modify**:
1. `millegrilles.games.typescript/vite-project/app/games/supermario/components/levelblocks/LevelBlocks.tsx`
   - Add `cameraOffset` prop
   - Add camera offset to block positions

2. `millegrilles.games.typescript/vite-project/app/games/supermario/Game.tsx`
   - Pass `player.cameraOffset` to `LevelBlocks` component

**Actions**:
1. Update `LevelBlocks` component interface and rendering
2. Pass camera offset from Game.tsx
3. Test by moving right and ensuring blocks scroll with Mario

**Expected behavior**:
- Mario stays centered horizontally
- Blocks scroll with Mario
- Player can move right and see new blocks appearing

---

#### Phase 2: Collision Helper Functions (Step 2)

**Files to modify**:
1. `millegrilles.games.typescript/vite-project/app/games/supermario/index.tsx`
   - Add `checkCollision()`, `isAboveBlock()`, `isBelowBlock()` helper functions

**Actions**:
1. Add helper functions before the game loop
2. Verify TypeScript types are correct
3. Ensure helper functions use correct player/block types

**Testing**: No visual testing yet - just verify code compiles

---

#### Phase 3: Collision Integration (Step 3)

**Files to modify**:
1. `millegrilles.games.typescript/vite-project/app/games/supermario/index.tsx`
   - Replace ground collision logic with block-based detection

**Actions**:
1. Copy collision logic into game loop
2. Handle blocks with camera offset
3. Implement wall collision (horizontal)
4. Implement ground collision (vertical)
5. Add player-start position blocks to skip list

**Expected behavior**:
- Player can walk on ground blocks
- Player can jump onto blocks from below
- Player cannot walk into blocks from side
- Player cannot climb up blocks from side

---

#### Phase 4: Testing and Tuning (Step 4)

**Testing checklist**:
1. **Horizontal scrolling**:
   - [ ] Move right - blocks scroll with Mario
   - [ ] Move left - blocks scroll with Mario
   - [ ] Camera clamps at edges
   - [ ] Mario stays centered

2. **Ground walking**:
   - [ ] Walk on floor blocks
   - [ ] Walk on elevated blocks
   - [ ] Walk on multiple blocks of different heights

3. **Jumping**:
   - [ ] Jump from floor
   - [ ] Jump onto blocks
   - [ ] Jump from one block to another
   - [ ] Jump height is reasonable

4. **Walls**:
   - [ ] Cannot walk into blocks from side
   - [ ] Cannot walk through walls
   - [ ] Friction works correctly

5. **Edge cases**:
   - [ ] No falling through blocks
   - [ ] No floating through blocks
   - [ ] No clipping through walls

**Tuning parameters** (in `constants.ts`):
- Gravity: `GRAVITY = 0.15` (may need adjustment)
- Jump velocity: `JUMP_VELOCITY = -5` (may need adjustment)
- Move speed: `MOVE_SPEED = 0.1` (may need adjustment)
- Max speed: `MAX_SPEED = 3`
- Max run speed: `MAX_RUN_SPEED = 5`
- Friction: `FRICTION_FACTOR = 0.1`

**When tuning**:
- If jumps are too low: Increase `JUMP_VELOCITY` to be more negative
- If jumps are too high: Decrease `JUMP_VELOCITY`
- If gravity is too strong: Decrease `GRAVITY` value
- If player moves too slowly: Increase `MOVE_SPEED`
- If player slides too much: Decrease `FRICTION_FACTOR`

---

## Data Flow After Implementation

```
Level Configuration (LevelConfig)
    ↓
LevelParser (parseLevelConfig)
    ↓
Block[] array (stored in state)
    ↓
LevelBlocks Component (renders with camera offset)
    ↓
Game Loop (checks collisions)
    ↓
Player State update (pos, vel, onGround)
    ↓
Mario Component (renders at pos + cameraOffset)
```

## Code Quality Notes

- All collisions use AABB (Axis-Aligned Bounding Box) logic
- Helper functions use explicit typed parameters for clarity
- Collision checks are performed per-frame with current velocities
- Camera offset is properly integrated into collision calculations
- Block type filtering (skip "player" blocks) prevents early collision

## Extension Points

Once the basic collision system is working, you can add:

1. **Platform physics**: Add slopes, stairs, or diagonal movement
2. **Block interactions**: Breakable blocks, mystery blocks with items
3. **Damage blocks**: Spikes, pits, or enemies
4. **Multiple levels**: Use player start positions to define level entrances
5. **Save system**: Store player progress in localStorage
6. **Sound effects**: Play sounds on block collision or interaction

## Files Summary

Files to modify for full implementation:
1. ✏️ `millegrilles.games.typescript/vite-project/app/games/supermario/index.tsx` - Gameloop and collision logic
2. ✏️ `millegrilles.games.typescript/vite-project/app/games/supermario/Game.tsx` - Pass camera offset to LevelBlocks
3. ✏️ `millegrilles.games.typescript/vite-project/app/games/supermario/components/levelblocks/LevelBlocks.tsx` - Accept and use camera offset

## Testing Workflow

After each phase:
1. Build project: `npx tsc --noEmit --jsx react-jsx`
2. Run development server: `cd /home/mathieu/git/millegrilles.games.typescript/vite-project && npm run dev` (set timeout to 30 seconds)
3. Open in browser and test specific features
4. Verify TypeScript compilation succeeds
5. Proceed to next phase only when current phase is working

Expected total time: ~60-90 minutes for implementation and testing
