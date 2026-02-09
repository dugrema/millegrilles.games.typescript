# Super Mario GameProvider Complete Rewrite - Implementation Plan

## Overview

The Super Mario clone game is experiencing a critical bug where state captured in `useRef` or `useState` inside the `requestAnimationFrame` game loop becomes stale. This happens because React's state and refs are batched in a way that the animation loop may read values before they've been updated by the same frame's event handlers.

**Solution**: Implement a complete ref-based architecture where all mutable game state lives in refs, and the module-level game loop functions read from and write to refs directly. React's render state is computed from refs in separate functions that trigger re-renders.

# Stale State Fix - Implementation Plan

### Step 1: Move Mutable State to `useRef` in `index.tsx`

**Add these refs after the imports**, before the Provider component starts:

```typescript
// After existing imports, add:

const playerX = useRef(0);
const playerY = useRef(0);
const playerVx = useRef(0);
const playerVy = useRef(0);
const keysPressed = useRef<Record<string, boolean>>({});
const gameStatus = useRef<'start' | 'playing' | 'paused' | 'gameover' | 'win'>('start');
const score = useRef(0);
const coins = useRef(0);
const level = useRef(0);
const cameraX = useRef(0);
```

Also update any existing `useState` for these same values to `useRef`.

---

### Step 2: Update Game Loop to Read/Write Directly to Refs

**In the `gameLoop` function**, modify it to read/write refs directly:

```typescript
function gameLoop(deltaTime: number) {
  if (gameStatus.current !== 'playing') return;

  console.log(`Frame: ${frameCount++}, Delta: ${deltaTime}`);

  // Player physics - read from refs, write to refs
  playerVx.current += acceleration * keysPressed.current['ArrowRight'] ? 1 : 0;
  playerVx.current -= acceleration * keysPressed.current['ArrowLeft'] ? 1 : 0;
  
  // Apply friction
  playerVx.current *= friction;
  
  // Update position
  playerX.current += playerVx.current;
  playerY.current += playerVy.current;
  
  // Gravity
  playerVy.current += gravity;
  
  // Collision detection
  if (playerY.current >= groundLevel) {
    playerY.current = groundLevel;
    playerVy.current = 0;
    playerState.isGrounded.current = true;
  }
  
  // Boundary checks
  if (playerX.current < 0) playerX.current = 0;
  if (playerX.current > levelWidth) playerX.current = levelWidth;
}
```

---

### Step 3: Update Render Computed State to Read from Refs

**In the component body (Provider's `children` or return value)**, create computed state that reads from refs:

```typescript
const playerState = useMemo(() => ({
  x: playerX.current,
  y: playerY.current,
  vx: playerVx.current,
  vy: playerVy.current,
  keysPressed: keysPressed.current,
}), []);

const gameState = useMemo(() => ({
  status: gameStatus.current,
  score: score.current,
  coins: coins.current,
  level: level.current,
  cameraX: cameraX.current,
}), []);
```

---

**Summary**: 
1. **Step 1** moves all mutable state to refs
2. **Step 2** makes the game loop read/write directly to refs (no React batching)
3. **Step 3** computes React render state from refs (reactive but separate from game loop)

This keeps the game working while fixing the stale state bug. The game loop gets fresh values every frame, and React re-renders when the computed state changes.
