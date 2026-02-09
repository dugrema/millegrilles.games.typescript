/**
 * Super Mario Game Provider
 * Contains SoundManager, game state, player physics, collision detection, and game loop
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import type { Dispatch, SetStateAction } from "react";
import type {
  SuperMarioContextType,
  GameState,
  Player,
  PlayerInput,
  Tile,
  Level,
} from "./types";
import {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  PIXEL_SCALE,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  TILE_SIZE,
  GRAVITY,
  JUMP,
  MOVEMENT,
  RUN_BOOST,
  CAMERA_SCROLL_SPEED,
  CAMERA_SMOOTHING,
  INITIAL_LIVES,
  INITIAL_SCORE,
  TIME_LIMIT,
  STORAGE_KEYS,
  KEYS,
  LEVEL_CONFIG,
  SCORE_VALUES,
  ANIMATION_SPEED,
  LEVELS,
} from "./constants";
import { LEVEL_1 } from "./levels/level1";

// Sound Manager class
class SoundManager {
  private audioContext: AudioContext | null = null;
  private enabled = false;

  getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
    }
    return this.audioContext;
  }

  playTone(
    frequency: number,
    duration: number,
    type: "sine" | "square" | "triangle" = "sine",
  ): void {
    if (!this.enabled) return;

    try {
      const ctx = this.getContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        ctx.currentTime + duration,
      );

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Sound error:", e);
    }
  }

  playJump(): void {
    this.playTone(440, 0.3, "sine");
  }

  playDoubleJump(): void {
    this.playTone(554, 0.3, "sine");
  }

  playCoin(): void {
    this.playTone(988, 0.1, "sine");
    setTimeout(() => this.playTone(1319, 0.1, "sine"), 100);
  }

  playBreakBlock(): void {
    this.playTone(200, 0.15, "square");
  }

  playDie(): void {
    const frequencies = [392, 349, 330, 294, 262];
    frequencies.forEach((freq, index) => {
      setTimeout(() => this.playTone(freq, 0.3, "sine"), index * 200);
    });
  }

  playWin(): void {
    const frequencies = [523, 587, 659, 698, 784];
    frequencies.forEach((freq, index) => {
      setTimeout(() => this.playTone(freq, 0.3, "sine"), index * 150);
    });
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }
}

// Create singleton sound manager
const soundManager = new SoundManager();

// Super Mario Context
const SuperMarioContext = createContext<SuperMarioContextType>(null);

// Super Mario Game Provider Component
export function SuperMarioGameProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [status, setStatus] = useState<
    "start" | "playing" | "paused" | "gameover" | "win"
  >("start");
  const [currentLevel, setCurrentLevel] = useState(1);
  const [lives, setLives] = useState(INITIAL_LIVES);

  // Player state
  const [player, setPlayer] = useState<Player>({
    id: "player",
    position: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    dimensions: { width: PLAYER_WIDTH, height: PLAYER_HEIGHT },
    direction: "right",
    state: "idle",
    animation: "normal",
    animationFrame: 0,
    isGrounded: false,
    isFacingLeft: false,
    isRunning: false,
    canDoubleJump: true,
    isDead: false,
    score: 0,
    lives: INITIAL_LIVES,
    coins: 0,
  });

  // Level and tiles state
  const [tiles, setTiles] = useState<Tile[]>([]);

  // Animation frame and timers
  const animationFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const tickAccumulatorRef = useRef<number>(0);
  const animateRef = useRef<((timestamp: number) => void) | null>(null);

  // Mutable game state refs (Phase 6 Stale State Fix)
  const playerX = useRef(0);
  const playerY = useRef(0);
  const playerVx = useRef(0);
  const playerVy = useRef(0);
  const keysPressed = useRef<Record<string, boolean>>({});
  const gameStatus = useRef<
    "start" | "playing" | "paused" | "gameover" | "win"
  >("start");
  const score = useRef(INITIAL_SCORE);
  const coins = useRef(0);
  const level = useRef<Level | null>(null);
  const cameraX = useRef(0);

  // Load level data
  const loadLevel = useCallback((levelNum: number) => {
    const tileSize = LEVEL_1.tileSize;

    // Initialize player refs with level start position (Phase 6 Stale State Fix)
    playerX.current = LEVEL_1.startPos.x;
    playerY.current = LEVEL_1.startPos.y;
    playerVx.current = 0;
    playerVy.current = 0;
    keysPressed.current = {};
    gameStatus.current = "playing";
    score.current = INITIAL_SCORE;
    coins.current = 0;
    level.current = LEVEL_1;
    cameraX.current = 0;

    return LEVEL_1;
  }, []);

  // Player game actions
  const actions = useMemo(
    () => ({
      restartLevel: () => {
        loadLevel(currentLevel);
      },
      pauseGame: () => {
        if (status === "playing") {
          setStatus("paused");
        }
      },
      resumeGame: () => {
        if (status === "paused") {
          setStatus("playing");
        }
      },
      restartGame: () => {
        setLives(INITIAL_LIVES);
        loadLevel(1);
      },
      startGame: () => {
        if (status === "start") {
          loadLevel(currentLevel);
          setStatus("playing");
        }
      },
    }),
    [status, currentLevel, loadLevel, lives, score, coins],
  );

  // Player input handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.code) {
      case KEYS.LEFT:
        keysPressed.current.ArrowLeft = true;
        break;
      case KEYS.RIGHT:
        keysPressed.current.ArrowRight = true;
        break;
      case KEYS.UP:
        keysPressed.current.ArrowUp = true;
        break;
      case KEYS.DOWN:
        keysPressed.current.ArrowDown = true;
        break;
      case KEYS.JUMP:
        keysPressed.current[" "] = true;
        break;
      case KEYS.RUN:
        keysPressed.current.Shift = true;
        break;
      case KEYS.RESTART:
        keysPressed.current["Escape"] = true;
        break;
      case KEYS.ESCAPE:
        keysPressed.current["Escape"] = true;
        break;
      default:
        break;
    }
  }, []);

  // Keyboard input release handler
  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    switch (e.code) {
      case KEYS.LEFT:
        keysPressed.current.ArrowLeft = false;
        break;
      case KEYS.RIGHT:
        keysPressed.current.ArrowRight = false;
        break;
      case KEYS.UP:
        keysPressed.current.ArrowUp = false;
        break;
      case KEYS.DOWN:
        keysPressed.current.ArrowDown = false;
        break;
      case KEYS.JUMP:
        keysPressed.current[" "] = false;
        break;
      case KEYS.RUN:
        keysPressed.current.Shift = false;
        break;
      case KEYS.RESTART:
        keysPressed.current["Escape"] = false;
        break;
      case KEYS.ESCAPE:
        keysPressed.current["Escape"] = false;
        break;
      default:
        break;
    }
  }, []);

  // Phase 6: Handle input by reading from refs and updating player refs directly
  const handleInput = useCallback(() => {
    // Phase 6: Read game status from ref
    const currentStatus = gameStatus.current;

    // Handle restart in game over state
    if (currentStatus === "gameover" && keysPressed.current["Escape"]) {
      gameStatus.current = "start";
      setStatus("start");
      return;
    }

    if (
      currentStatus === "paused" ||
      currentStatus === "gameover" ||
      currentStatus === "win"
    )
      return;

    // Read input from keysPressed ref
    const isMovingLeft = keysPressed.current["ArrowLeft"];
    const isMovingRight = keysPressed.current["ArrowRight"];
    const isJumping = keysPressed.current[" "] && !keysPressed.current["Shift"];
    const isRunPressed = keysPressed.current.Shift;

    // Handle horizontal movement
    if (isMovingLeft && !isMovingRight) {
      if (player.state === "idle" || player.state === "walk") {
        player.direction = "left";
        player.animation = "left";
        if (keysPressed.current["Shift"]) {
          player.state = "run";
          player.isRunning = true;
        } else {
          player.state = "walk";
          player.isRunning = false;
        }
      } else if (player.state !== "jump") {
        player.state = "walk";
        player.isRunning = false;
      }
    } else if (isMovingRight && !isMovingLeft) {
      if (player.state === "idle" || player.state === "walk") {
        player.direction = "right";
        player.animation = "right";
        if (keysPressed.current["Shift"]) {
          player.state = "run";
          player.isRunning = true;
        } else {
          player.state = "walk";
          player.isRunning = false;
        }
      } else if (player.state !== "jump") {
        player.state = "walk";
        player.isRunning = false;
      }
    } else {
      // No horizontal input
      if (
        player.state === "idle" ||
        player.state === "walk" ||
        player.state === "run"
      ) {
        player.state = "idle";
        player.isRunning = false;
      }
    }

    // Running is controlled by the physics system
    // The runHeld flag just indicates the user wants to run
    // Actual running happens in applyPhysics based on input flags

    // Handle jumping
    if (isJumping) {
      if (player.isGrounded) {
        // First jump
        playerVy.current = JUMP.force;
        player.isGrounded = false;
        player.state = "jump";
        player.animation = player.direction === "left" ? "left" : "right";
        soundManager.playJump();
      } else if (player.canDoubleJump) {
        // Double jump
        playerVy.current = JUMP.force * 0.9;
        player.canDoubleJump = false;
        player.state = "doubleJump";
        player.animation = player.direction === "left" ? "left" : "right";
        soundManager.playDoubleJump();
      }
    }
  }, [player]);

  // Apply physics
  const applyPhysics = useCallback((dt: number) => {
    // Phase 6: Read game status from ref
    const currentStatus = gameStatus.current;
    if (currentStatus !== "playing") return;

    // Phase 6: Read player state from refs (no React state batching)
    const playerState = {
      position: { x: playerX.current, y: playerY.current },
      velocity: { x: playerVx.current, y: playerVy.current },
      direction: player.direction,
      state: player.state,
      isGrounded: player.isGrounded,
      isRunning: player.isRunning,
      canDoubleJump: player.canDoubleJump,
      isDead: player.isDead,
      dimensions: player.dimensions,
      score: player.score,
      lives: player.lives,
      coins: player.coins,
      animationFrame: player.animationFrame,
    };
    let nextX = playerState.position.x + playerState.velocity.x;
    let nextY = playerState.position.y + playerState.velocity.y;
    const isMovingHorizontally = playerState.velocity.x !== 0;
    const isRunning = playerState.isRunning;
    const direction = playerState.direction;

    // Calculate target speed
    let targetSpeed = isRunning ? MOVEMENT.runSpeed : MOVEMENT.maxSpeed;

    // Apply acceleration
    if (isMovingHorizontally) {
      if (playerState.velocity.x < 0) {
        playerState.velocity.x -= MOVEMENT.acceleration;
      } else {
        playerState.velocity.x += MOVEMENT.acceleration;
      }
    }

    // Apply friction
    if (!playerState.isGrounded) {
      playerState.velocity.x *= MOVEMENT.airResistance;
    } else {
      playerState.velocity.x *= MOVEMENT.friction;
    }

    // Clamp speed
    const maxSpeed =
      isRunning && playerState.isGrounded
        ? MOVEMENT.maxSpeed + MOVEMENT.runBoost
        : MOVEMENT.maxSpeed;
    playerState.velocity.x = Math.max(
      -maxSpeed,
      Math.min(maxSpeed, playerState.velocity.x),
    );

    // Apply gravity
    playerState.velocity.y += GRAVITY.acceleration;

    // Collision detection
    const playerBounds = {
      left: nextX,
      right: nextX + playerState.dimensions.width,
      top: nextY,
      bottom: nextY + playerState.dimensions.height,
    };

    let collisionOccurred = false;

    // Phase 6: Get tiles from level ref
    const currentTiles = level.current?.tiles || [];

    // Check tile collisions
    for (const tile of currentTiles) {
      if (!tile.solid) continue;

      if (
        playerBounds.left < tile.position.x + tile.dimensions.width &&
        playerBounds.right > tile.position.x &&
        playerBounds.top < tile.position.y + tile.dimensions.height &&
        playerBounds.bottom > tile.position.y
      ) {
        // Horizontal collision
        const tileBounds = {
          left: tile.position.x,
          right: tile.position.x + tile.dimensions.width,
          top: tile.position.y,
          bottom: tile.position.y + tile.dimensions.height,
        };

        const horizontalOverlap =
          Math.min(playerBounds.right, tileBounds.right) -
          Math.max(playerBounds.left, tileBounds.left);
        const verticalOverlap =
          Math.min(playerBounds.bottom, tileBounds.bottom) -
          Math.max(playerBounds.top, tileBounds.top);

        if (horizontalOverlap < verticalOverlap) {
          // Horizontal collision
          if (playerState.velocity.x > 0) {
            nextX = tile.position.x - playerState.dimensions.width;
          } else if (playerState.velocity.x < 0) {
            nextX = tile.position.x + tile.dimensions.width;
          }
          playerState.velocity.x = 0;
        } else {
          // Vertical collision
          if (playerState.velocity.y > 0) {
            // Landing on ground
            nextY = tile.position.y - playerState.dimensions.height;
            playerState.velocity.y = 0;
            if (!playerState.isGrounded) {
              playerState.state = "land";
              playerState.animationFrame = 0;
            }
            playerState.isGrounded = true;
          } else if (playerState.velocity.y < 0) {
            // Hitting ceiling
            nextY = tile.position.y + tile.dimensions.height;
            playerState.velocity.y = 0;
          }
        }

        collisionOccurred = true;

        // Phase 6: Handle special tile types - update coins and score refs
        if (tile.type === "coin") {
          tile.type = "coin_item";
          tile.solid = false;
          tile.dimensions.height = playerState.dimensions.height * 1.5;
          tile.position.y -= tile.dimensions.height;
          coins.current = coins.current + 1;
          score.current = score.current + SCORE_VALUES.COIN;
          soundManager.playCoin();
        }
      }
    }

    // Phase 6: Update position refs
    if (!collisionOccurred) {
      playerX.current = nextX;
      playerY.current = nextY;
    }

    // Phase 6: Check if player fell off level
    if (playerState.position.y > CANVAS_HEIGHT + PLAYER_HEIGHT * 2) {
      handlePlayerDeath();
      return;
    }

    // Phase 6: Update state based on movement
    if (playerState.isGrounded) {
      if (Math.abs(playerState.velocity.x) > 1) {
        playerState.state = isRunning ? "run" : "walk";
      } else {
        playerState.state = "idle";
      }
    } else if (playerState.velocity.y < 0) {
      playerState.state = "jump";
    } else {
      playerState.state = "fall";
    }

    // Phase 6: Check end position (flag reached)
    if (
      level.current?.endPos?.x &&
      playerState.position.x > level.current.endPos.x
    ) {
      gameStatus.current = "win";
    }
  }, []);

  // Handle player death
  const handlePlayerDeath = useCallback(() => {
    if (player.isDead) return;

    player.isDead = true;
    player.velocity.y = -8; // Small hop up
    player.state = "dead";

    soundManager.playDie();

    setTimeout(() => {
      setLives(lives - 1);
      player.isDead = false;
      if (lives > 0) {
        player.position = {
          ...(level.current?.startPos || { x: 100, y: 400 }),
        };
        player.velocity = { x: 0, y: 0 };
        player.state = "idle";
        player.isGrounded = false;
      } else {
        setStatus("gameover");
        player.position.y = CANVAS_HEIGHT + 100; // Fall off screen
      }
    }, 2000);

    setPlayer(player);
  }, [lives, level, player]);

  // Animation loop
  // Game loop function - Phase 6: Uses refs to avoid stale dependencies
  const gameLoop = useCallback(
    (timestamp: number) => {
      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;
      tickAccumulatorRef.current += deltaTime;
      animationFrameRef.current += deltaTime;

      // Physics updates - Phase 6: Read from refs, write to refs
      if (gameStatus.current === "playing") {
        handleInput();
        applyPhysics(deltaTime);

        // Update enemy positions (simplified)
        level.current?.tiles.forEach((tile, index) => {
          if (tile.type === "goomba") {
            // Simple enemy movement - just move back and forth
            const currentTileY =
              Math.round(playerY.current / TILE_SIZE) * TILE_SIZE;

            // Basic enemy logic could go here
            // For Phase 1, enemies will be visual only
          }
        });
      }

      // Log frame rate info periodically
      // if (Math.round(timestamp) % 60 === 0) {
      //   const fps = Math.round(1000 / deltaTime);
      //   console.log(
      //     `[Game Loop] Timestamp: ${timestamp} Frame: ${fps} FPS, Delta: ${deltaTime.toFixed(2)}ms, Status: ${gameStatus.current}`,
      //   );
      // }
    },
    [handleInput, applyPhysics],
  );

  // Animation wrapper - only depends on status
  const animate = useCallback(
    (timestamp: number) => {
      if (status === "playing" && animateRef.current) {
        animateRef.current(timestamp);
      }
      animationFrameId.current = requestAnimationFrame(animate);
    },
    [status],
  );

  const animationFrameId = useRef<number>(0);

  // Keyboard handlers
  useEffect(() => {
    console.warn("Registering keyboard listeners");
    // Pass the already-stable functions directly
    // No need to create wrapper functions
    window.addEventListener("keydown", (e: KeyboardEvent) => {
      // console.log("Keyboard 'keydown' event:", e.code);
      handleKeyDown(e);
    });

    window.addEventListener("keyup", (e: KeyboardEvent) => {
      // console.log("Keyboard 'keyup' event:", e.code);
      handleKeyUp(e);
    });

    return () => {
      console.warn("Removing keyboard listeners");
      window.removeEventListener("keydown", (e: KeyboardEvent) =>
        handleKeyDown(e),
      );
      window.removeEventListener("keyup", (e: KeyboardEvent) => handleKeyUp(e));
    };
  }, [handleKeyDown, handleKeyUp]);

  // Start animation loop
  useEffect(() => {
    if (status === "playing") {
      lastTimeRef.current = performance.now();
      // Set the game loop function in the ref
      animateRef.current = gameLoop;
      animationFrameId.current = requestAnimationFrame(animate);
    } else {
      // Cancel animation loop when game is not playing
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = 0;
      }
    }
  }, [status]);

  // Phase 6: Context value - computed from refs to avoid stale state
  const contextValue = useMemo(
    () => ({
      status: gameStatus.current,
      currentLevel,
      score: score.current,
      lives,
      coins: coins.current,
      time: 0,
      player: {
        ...player,
        position: { x: playerX.current, y: playerY.current },
        velocity: { x: playerVx.current, y: playerVy.current },
      },
      level: level.current,
      tiles: level.current?.tiles || [],
      input: {
        left: keysPressed.current["ArrowLeft"],
        right: keysPressed.current["ArrowRight"],
        up: keysPressed.current["ArrowUp"],
        down: keysPressed.current["ArrowDown"],
        jumpPressed: keysPressed.current[" "],
        jumpHeld: keysPressed.current["Shift"],
        runHeld: keysPressed.current["Shift"],
        runPressed: keysPressed.current["r"],
        escapePressed: keysPressed.current["Escape"],
      } as PlayerInput,
      camera: { x: cameraX.current, y: 0 },
      animationFrame: animationFrameRef.current,
      isPaused: gameStatus.current === "paused",
      gameOverReason: null,
      actions: actions,
    }),
    [currentLevel, lives, actions],
  );

  return (
    <SuperMarioContext.Provider value={contextValue}>
      {children}
    </SuperMarioContext.Provider>
  );
}

// Custom hook for accessing game state
export function useSuperMario(): SuperMarioContextType {
  const context = useContext(SuperMarioContext);
  if (!context) {
    throw new Error("useSuperMario must be used within SuperMarioGameProvider");
  }
  return context;
}
