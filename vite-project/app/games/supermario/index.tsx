import type {
  SuperMarioContext,
  SuperMarioProviderProps,
  PlayerState,
  LevelConfig,
  Block,
} from "./types";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  GRAVITY,
  JUMP_VELOCITY,
  MOVE_SPEED,
  MAX_SPEED,
  FRICTION_FACTOR,
  GROUND_Y,
  CANVAS_HEIGHT,
  PLAYER_HEIGHT,
  MAX_RUN_SPEED,
  CANVAS_WIDTH,
  BLOCK_SIZE,
  PLAYER_WIDTH,
} from "./constants";
import { parseLevelConfig } from "./utils/LevelParser";

/* Context creation */
const SuperMarioContext = createContext<SuperMarioContext | null>(null);

/* Provider component */
export function SuperMarioProvider({ children }: SuperMarioProviderProps) {
  const [player, setPlayer] = useState<PlayerState>({
    pos: { x: 50, y: GROUND_Y - PLAYER_HEIGHT },
    vel: { x: 0, y: 0 },
    onGround: true,
    cameraOffset: { x: 0, y: 0 },
  });

  const [currentLevel, setCurrentLevel] = useState<LevelConfig | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);

  const [running, setRunning] = useState(false);
  const lastTimeRef = useRef<number>(0);

  /* Key state */
  const keysRef = useRef<{
    left: boolean;
    right: boolean;
    jump: boolean;
    run: boolean;
  }>({
    left: false,
    right: false,
    jump: false,
    run: false,
  });

  /* Keyboard listeners */
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.key.toLowerCase() === "arrowleft") keysRef.current.left = true;
      if (e.key.toLowerCase() === "arrowright") keysRef.current.right = true;
      if (e.key.toLowerCase() === " ") keysRef.current.jump = true;
      if (e.code === "ShiftLeft") keysRef.current.run = true;
      if (e.key.toLowerCase() === "r") setRunning((prev) => !prev);
    };
    const up = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "arrowleft") keysRef.current.left = false;
      if (e.key.toLowerCase() === "arrowright") keysRef.current.right = false;
      if (e.key.toLowerCase() === " ") keysRef.current.jump = false;
      if (e.code === "ShiftLeft") keysRef.current.run = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

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

  /* Gameloop */
  useEffect(() => {
    let anim: number = 0;
    const loop = (time: number) => {
      setPlayer((prev) => {
        // Apply friction (opposes current velocity)
        let vx = prev.vel.x;

        // Apply input acceleration
        if (keysRef.current.right) vx += MOVE_SPEED;
        else if (keysRef.current.left) vx -= MOVE_SPEED;
        else if (prev.onGround) {
          if (vx > -0.1 && vx < 0.1) vx = 0.0;
          else vx -= vx * FRICTION_FACTOR;
        }

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

        // === BLOCK-BASED COLLISION DETECTION ===

        let onGround = false;
        let groundY = GROUND_Y; // Default to floor

        // Calculate potential new positions
        let newX = prev.pos.x + vx;
        let newY = prev.pos.y + vy;

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
          if (
            prev.pos.y < blockBottom &&
            prev.pos.y + PLAYER_HEIGHT > blockTop
          ) {
            // Player is vertically within block bounds
            // Check if moving into block
            if (vx > 0 && newX + PLAYER_WIDTH > blockLeft && newX < blockLeft) {
              // Moving right into block
              newX = blockLeft - PLAYER_WIDTH;
              vx = 0;
            } else if (
              vx < 0 &&
              newX < blockRight &&
              newX + PLAYER_WIDTH > blockRight
            ) {
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

    /* Helper to calculate camera offset */
    const calculateCameraOffset = (playerX: number) => {
      // Keep player in center of screen
      const targetX = CANVAS_WIDTH / 2 - playerX;
      // Clamp offset to screen bounds
      const minX = -playerX; // Player can't go past left edge
      const maxX = -playerX + CANVAS_WIDTH; // Player can't go past right edge
      return { x: Math.max(Math.min(targetX, maxX), minX), y: 0 };
    };

    if (running) {
      anim = requestAnimationFrame(loop);
    }
    return () => cancelAnimationFrame(anim);
  }, [running]);

  /* Public API */
  const startGame = () => setRunning(true);
  const pauseGame = () => setRunning(false);

  const loadLevel = (levelConfig: LevelConfig) => {
    setCurrentLevel(levelConfig);
    const parsedBlocks = parseLevelConfig(levelConfig);
    setBlocks(parsedBlocks);
    // Reset player position when loading a new level
    setPlayer({
      pos: { x: levelConfig.playerStartX || 0, y: GROUND_Y - PLAYER_HEIGHT },
      vel: { x: 0, y: 0 },
      onGround: true,
      cameraOffset: { x: 0, y: 0 },
    });
  };

  return (
    <SuperMarioContext.Provider
      value={{ player, startGame, pauseGame, loadLevel, currentLevel, blocks }}
    >
      {children}
    </SuperMarioContext.Provider>
  );
}

/* Hook for components */
export function useSuperMario(): SuperMarioContext {
  const ctx = useContext(SuperMarioContext);
  if (!ctx)
    throw new Error("useSuperMario must be used within SuperMarioProvider");
  return ctx;
}

export default SuperMarioProvider;
