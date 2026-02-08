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
  const [score, setScore] = useState(INITIAL_SCORE);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [coins, setCoins] = useState(0);

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

  // Level and tiles
  const [level, setLevel] = useState<Level | null>(null);
  const [tiles, setTiles] = useState<Tile[]>([]);

  // Input state
  const [input, setInput] = useState<PlayerInput>({
    left: false,
    right: false,
    up: false,
    down: false,
    jumpPressed: false,
    jumpHeld: false,
    runHeld: false,
    runPressed: false,
  });

  // Animation frame and timers
  const animationFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const tickAccumulatorRef = useRef<number>(0);
  const animateRef = useRef<((timestamp: number) => void) | null>(null);

  // Load level data
  const loadLevel = useCallback(
    (levelNum: number) => {
      const tileSize = LEVEL_1.tileSize;

      // Create player at start position
      const playerWithLevel: Player = {
        ...player,
        position: { x: LEVEL_1.startPos.x, y: LEVEL_1.startPos.y },
        velocity: { x: 0, y: 0 },
        state: "idle",
        animation: "normal",
        animationFrame: 0,
        isGrounded: false,
        isDead: false,
        isRunning: false,
        canDoubleJump: true,
        score: INITIAL_SCORE,
        coins: 0,
      };

      setLevel(LEVEL_1);
      setTiles(LEVEL_1.tiles);
      setPlayer(playerWithLevel);
      setStatus("playing");
      return LEVEL_1;
    },
    [player],
  );

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
        setScore(INITIAL_SCORE);
        setCoins(0);
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
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const inputMap = { ...input };

      if (e.code === KEYS.LEFT) {
        inputMap.left = true;
      } else if (e.code === KEYS.RIGHT) {
        inputMap.right = true;
      } else if (e.code === KEYS.UP) {
        inputMap.up = true;
      } else if (e.code === KEYS.DOWN) {
        inputMap.down = true;
      } else if (e.code === KEYS.RUN) {
        inputMap.runPressed = true;
        inputMap.runHeld = true;
      } else if (e.code === KEYS.JUMP) {
        inputMap.jumpPressed = true;
        inputMap.jumpHeld = true;
      } else if (e.code === KEYS.RESTART) {
        inputMap.jumpPressed = true; // Used to restart
      } else if (e.code === KEYS.ESCAPE) {
        inputMap.jumpPressed = true; // Used to pause/resume/quit
      }

      setInput(inputMap);
    },
    [input, setInput], // Dependencies: setInput from the game context
  );

  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      const inputMap = { ...input };
      if (e.code === KEYS.LEFT) {
        inputMap.left = false;
      } else if (e.code === KEYS.RIGHT) {
        inputMap.right = false;
      } else if (e.code === KEYS.UP) {
        inputMap.up = false;
      } else if (e.code === KEYS.DOWN) {
        inputMap.down = false;
      } else if (e.code === KEYS.RUN) {
        inputMap.runPressed = false;
        inputMap.runHeld = false;
      }
      setInput(inputMap);
    },
    [input, setInput],
  );

  // Handle player input
  const handleInput = useCallback(() => {
    // Handle restart key to start or restart game
    if (input.jumpPressed && (status === "start" || status === "paused")) {
      console.log("Restart triggered:", { status, input });
      loadLevel(currentLevel);
      setStatus("playing");

      // Wait a moment then set input state to start moving
      setTimeout(() => {
        setInput({ ...input, left: true, right: false });
      }, 100);
      return;
    }

    // Handle restart in game over state
    if (status === "gameover" && input.jumpPressed) {
      setStatus("start");
      actions.pauseGame();
      return;
    }

    if (status === "paused" || status === "gameover" || status === "win")
      return;

    const newState: Partial<Player> = {
      position: { x: 0, y: 0 },
      velocity: { x: 0, y: 0 },
    };
    const newStateInput: PlayerInput = {
      left: false,
      right: false,
      up: false,
      down: false,
      jumpPressed: false,
      jumpHeld: false,
      runHeld: false,
      runPressed: false,
    };

    const isMovingLeft = input.left;
    const isMovingRight = input.right;
    const isJumping = input.jumpPressed && !input.jumpHeld;

    // Handle horizontal movement
    if (isMovingLeft && !isMovingRight) {
      newStateInput.left = true;
      newStateInput.right = false;
      if (player.state === "idle" || player.state === "walk") {
        newState.direction = "left";
        newState.animation = "left";
        if (input.runHeld) {
          newState.state = "run";
          newState.isRunning = true;
        } else {
          newState.state = "walk";
          newState.isRunning = false;
        }
      } else if (player.state !== "jump") {
        newState.state = "walk";
        newState.isRunning = false;
      }
    } else if (isMovingRight && !isMovingLeft) {
      newStateInput.right = true;
      newStateInput.left = false;
      if (player.state === "idle" || player.state === "walk") {
        newState.direction = "right";
        newState.animation = "right";
        if (input.runHeld) {
          newState.state = "run";
          newState.isRunning = true;
        } else {
          newState.state = "walk";
          newState.isRunning = false;
        }
      } else if (player.state !== "jump") {
        newState.state = "walk";
        newState.isRunning = false;
      }
    } else {
      // No horizontal input
      newStateInput.left = false;
      newStateInput.right = false;
      if (
        player.state === "idle" ||
        player.state === "walk" ||
        player.state === "run"
      ) {
        newState.state = "idle";
        newState.isRunning = false;
      }
    }

    // Running is controlled by the physics system
    // The runPressed flag just indicates the user wants to run
    // Actual running happens in applyPhysics based on input flags

    // Handle jumping
    if (isJumping) {
      if (player.isGrounded) {
        // First jump
        (newState as Player).velocity.y = JUMP.force;
        newState.isGrounded = false;
        newState.state = "jump";
        newState.animation = player.direction === "left" ? "left" : "right";
        soundManager.playJump();
      } else if (player.canDoubleJump) {
        // Double jump
        (newState as Player).velocity.y = JUMP.force * 0.9;
        newState.canDoubleJump = false;
        newState.state = "doubleJump";
        newState.animation = player.direction === "left" ? "left" : "right";
        soundManager.playDoubleJump();
      }
    }

    // Update player input
    setInput(newStateInput as PlayerInput);
    setPlayer((prev) => ({ ...prev, ...newState }));
  }, [status, input, player, actions]);

  // Apply physics
  const applyPhysics = useCallback(
    (dt: number) => {
      if (status !== "playing" || player.isDead) return;

      const playerState = player;
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

      // Check tile collisions
      for (const tile of tiles) {
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

          // Handle special tile types
          if (tile.type === "coin") {
            tile.type = "coin_item";
            tile.solid = false;
            tile.dimensions.height = playerState.dimensions.height * 1.5;
            tile.position.y -= tile.dimensions.height;
            setCoins((prev) => prev + 1);
            setScore((prev) => prev + SCORE_VALUES.COIN);
            soundManager.playCoin();
          }
        }
      }

      // Update position
      if (!collisionOccurred) {
        playerState.position.x = nextX;
        playerState.position.y = nextY;
      }

      // Check if player fell off level
      if (playerState.position.y > CANVAS_HEIGHT + PLAYER_HEIGHT * 2) {
        handlePlayerDeath();
        return;
      }

      // Update state based on movement
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

      // Check end position (flag reached)
      if (level?.endPos?.x && playerState.position.x > level.endPos.x) {
        setStatus("win");
      }

      setPlayer(playerState);
    },
    [status, player, tiles, level],
  );

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
        player.position = { ...(level?.startPos || { x: 100, y: 400 }) };
        player.velocity = { x: 0, y: 0 };
        player.state = "idle";
        player.isGrounded = false;
      } else {
        setStatus("gameover");
        player.position.y = CANVAS_HEIGHT + 100; // Fall off screen
      }
    }, 2000);

    setPlayer(player);
  }, [lives, level]);

  // Animation loop
  // Game loop function - stores game logic in refs to avoid stale dependencies
  const gameLoop = useCallback(
    (timestamp: number) => {
      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;
      tickAccumulatorRef.current += deltaTime;
      animationFrameRef.current += deltaTime;

      // Physics updates
      if (status === "playing") {
        handleInput();
        applyPhysics(deltaTime);

        // Update enemy positions (simplified)
        tiles.forEach((tile, index) => {
          if (tile.type === "goomba") {
            // Simple enemy movement - just move back and forth
            const currentTileY =
              Math.round(player.position.y / TILE_SIZE) * TILE_SIZE;

            // Basic enemy logic could go here
            // For Phase 1, enemies will be visual only
          }
        });
      }

      // Log frame rate info periodically
      // if (Math.round(timestamp) % 60 === 0) {
      //   const fps = Math.round(1000 / deltaTime);
      //   console.log(
      //     `[Game Loop] Timestamp: ${timestamp} Frame: ${fps} FPS, Delta: ${deltaTime.toFixed(2)}ms, Status: ${status}`,
      //   );
      // }
    },
    [status, player, tiles, level, handleInput, applyPhysics],
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
    // Pass the already-stable functions directly
    // No need to create wrapper functions
    window.addEventListener("keydown", (e: KeyboardEvent) => {
      console.log("Keyboard 'keydown' event:", e.code);
      handleKeyDown(e, setInput);
    });

    window.addEventListener("keyup", (e: KeyboardEvent) => {
      console.log("Keyboard 'keyup' event:", e.code);
      handleKeyUp(
        e,
        setInput as Dispatch<SetStateAction<Partial<PlayerInput>>>,
      );
    });

    return () => {
      window.removeEventListener("keydown", (e: KeyboardEvent) =>
        handleKeyDown(e, setInput),
      );
      window.removeEventListener("keyup", (e: KeyboardEvent) =>
        handleKeyUp(
          e,
          setInput as Dispatch<SetStateAction<Partial<PlayerInput>>>,
        ),
      );
    };
  }, [handleKeyDown, handleKeyUp, setInput]);

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

  // Context value
  const contextValue = useMemo(
    () => ({
      status,
      currentLevel,
      score,
      lives,
      coins,
      time: 0,
      player,
      level,
      tiles,
      input: input as PlayerInput,
      camera: { x: 0, y: 0 },
      animationFrame: animationFrameRef.current,
      isPaused: status === "paused",
      gameOverReason: null,
      actions: actions,
    }),
    [
      status,
      currentLevel,
      score,
      lives,
      coins,
      player,
      level,
      tiles,
      input,
      loadLevel,
      actions,
    ],
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
