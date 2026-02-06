// Super Mario game main entry point
// Includes context, provider, custom hook, sound manager, and all Phase 2 game logic

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import type {
  PlayerState,
  InputState,
  MarioGameActions,
  MarioGameContextType,
  MarioGameState,
  Enemy,
  Collectible,
} from "./types";
import { GameState as GameStateType, PlatformType } from "./types";

import {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  INITIAL_LIVES,
  INITIAL_SCORE,
  TIME_LIMIT,
  STORAGE_KEYS,
  GRAVITY,
  JUMP,
  MOVEMENT,
  RUN_BOOST,
  ANIMATION_FRAMES,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  CAMERA_SMOOTHING,
} from "./constants";
import Player from "./components/Player";
import CameraProvider from "./components/Camera";
import { getLevel } from "./level-data";
import { InputHandler } from "./components/InputHandler";

// Sound manager
class SoundManager {
  private audioContext: AudioContext | null = null;

  private getContext() {
    if (!this.audioContext) {
      this.audioContext = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
    }
    return this.audioContext;
  }

  playTone(frequency: number, duration: number, type: OscillatorType = "sine") {
    const ctx = this.getContext();
    if (ctx.state === "suspended") {
      ctx.resume();
    }
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      ctx.currentTime + duration,
    );

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }

  playJumpSound() {
    this.playTone(400, 0.1, "sine");
    setTimeout(() => this.playTone(600, 0.15, "sine"), 100);
  }

  playCoinSound() {
    this.playTone(900, 0.05, "square");
    setTimeout(() => this.playTone(1200, 0.1, "square"), 80);
  }

  playStompSound() {
    this.playTone(150, 0.1, "sawtooth");
  }

  playPowerUpSound() {
    const ctx = this.getContext();
    if (ctx.state === "suspended") {
      ctx.resume();
    }
    [400, 500, 600, 800].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.2, "sine"), i * 80);
    });
  }

  playBoostStartSound() {
    this.playTone(300, 0.1, "sine");
  }

  playBoostStopSound() {
    this.playTone(200, 0.15, "sawtooth");
  }

  playBoostDepletedSound() {
    this.playTone(100, 0.3, "sawtooth");
  }
}

const soundManager = new SoundManager();

// AABB collision detection
const checkAABB = (
  rect1: { x: number; y: number; width: number; height: number },
  rect2: { x: number; y: number; width: number; height: number },
): boolean => {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
};

// Check platform collision
const checkPlatformCollision = (
  player: PlayerState,
  platforms: PlatformType[][],
): boolean => {
  const playerRect = {
    x: player.x,
    y: player.y,
    width: player.width,
    height: player.height,
  };

  let collision = false;

  // Check each tile in the platform grid
  for (let y = 0; y < platforms.length && !collision; y++) {
    for (let x = 0; x < platforms[y].length && !collision; x++) {
      const platformType = platforms[y][x];
      if (platformType !== PlatformType.AIR) {
        const platform = {
          x: x * PLAYER_WIDTH,
          y: y * PLAYER_HEIGHT,
          width: PLAYER_WIDTH,
          height: PLAYER_HEIGHT,
          type: platformType,
        };

        if (checkAABB(playerRect, platform)) {
          collision = true;
        }
      }
    }
  }

  return collision;
};

// Resolve platform collisions
const resolvePlatformCollisions = (
  player: PlayerState,
  platforms: PlatformType[][],
) => {
  const playerRect = {
    x: player.x,
    y: player.y,
    width: player.width,
    height: player.height,
  };

  let groundPlatform = null as {
    x: number;
    y: number;
    type: PlatformType;
  } | null;

  // Check which platforms we're colliding with
  for (let y = 0; y < platforms.length; y++) {
    for (let x = 0; x < platforms[y].length; x++) {
      const platformType = platforms[y][x];
      if (platformType !== PlatformType.AIR) {
        const platform = {
          x: x * PLAYER_WIDTH,
          y: y * PLAYER_HEIGHT,
          width: PLAYER_WIDTH,
          height: PLAYER_HEIGHT,
          type: platformType,
        };

        if (checkAABB(playerRect, platform)) {
          // Check if we're falling onto this platform
          if (player.vy >= 0) {
            const playerBottom = player.y + player.height;
            const platformTop = platform.y;

            if (playerBottom >= platformTop) {
              // This might be the ground
              if (!groundPlatform || platformTop > groundPlatform.y) {
                groundPlatform = platform;
              }
            }
          }
        }
      }
    }
  }

  if (groundPlatform) {
    // Snap to ground
    player.y = groundPlatform.y - player.height;
    player.vy = 0;
    player.isGrounded = true;
    player.isJumping = false;
    player.canJump = true;

    // Check for special platform interactions
    if (groundPlatform.type === PlatformType.QUESTION_BLOCK) {
      // Question block handling - can be implemented in Phase 6
    }
  } else {
    player.isGrounded = false;
  }
};

// Initialize player state
const initializePlayer = (): PlayerState => ({
  x: 50,
  y: SCREEN_HEIGHT - PLAYER_HEIGHT * 2,
  width: PLAYER_WIDTH,
  height: PLAYER_HEIGHT,
  vx: 0,
  vy: 0,
  state: "idle" as const,
  isGrounded: true,
  isSmall: false,
  isBig: false,
  isFire: false,
  isPowerUpActive: false,
  powerUpType: "none" as const,
  isJumping: false,
  canJump: true,
  isDucking: false,
  facingLeft: true,
  isRunning: false,
  isSprinting: false,
  boostMeter: RUN_BOOST.maxMeter,
  animationFrame: 0,
  animationState: "idle",
  platformsCollided: [],
  lives: INITIAL_LIVES,
});

// Update player physics (gravity)
const updatePlayerPhysics = (
  player: PlayerState,
  input: Partial<InputState> = {},
) => {
  // Apply gravity when in air
  if (!player.isGrounded) {
    player.vy += GRAVITY.acceleration;

    // Cap fall speed
    if (player.vy > GRAVITY.velocity) {
      player.vy = GRAVITY.velocity;
    }

    // Apply air friction
    player.vx *= GRAVITY.friction;
  }

  // Apply air resistance
  player.vx *= MOVEMENT.airResistance;

  // Clamp velocity
  const maxSpeed = player.isRunning
    ? MOVEMENT.runSpeed + (player.isSprinting ? MOVEMENT.runBoost : 0)
    : MOVEMENT.maxSpeed;

  player.vx = Math.max(-maxSpeed, Math.min(maxSpeed, player.vx));

  // Stop completely if very slow
  if (Math.abs(player.vx) < MOVEMENT.acceleration) {
    player.vx = 0;
  }

  // Update position
  player.x += player.vx;
  player.y += player.vy;

  // Handle edge cases
  // Screen boundaries
  player.x = Math.max(0, Math.min(player.x, SCREEN_WIDTH - player.width));

  // Don't fall below level
  if (player.y > SCREEN_HEIGHT) {
    return true; // Player fell off
  }

  return false;
};

// Update horizontal movement
const updateHorizontalMovement = (
  player: PlayerState,
  input: Partial<InputState> = {},
) => {
  // Read input from parameter or player state
  const moveLeft = input.left ?? false;
  const moveRight = input.right ?? false;
  const isRunningInput = input.run ?? player.isRunning;
  const isSprintingInput = player.isSprinting;

  // Calculate speed cap based on input and boost
  const maxSpeed = isRunningInput
    ? MOVEMENT.runSpeed + (isSprintingInput ? MOVEMENT.runBoost : 0)
    : MOVEMENT.maxSpeed;

  // Apply input-based acceleration
  if (moveLeft) {
    player.vx -= MOVEMENT.acceleration;
  }
  if (moveRight) {
    player.vx += MOVEMENT.acceleration;
  }

  // Apply friction towards target speed
  player.vx *= MOVEMENT.friction;

  // Stop completely if very slow
  if (Math.abs(player.vx) < MOVEMENT.acceleration) {
    player.vx = 0;
  }

  // Update facing direction from input
  if (moveLeft) {
    player.facingLeft = true;
  } else if (moveRight) {
    player.facingLeft = false;
  }
};

// Update player animation
const updatePlayerAnimation = (
  player: PlayerState,
  isSprinting: boolean,
): number => {
  if (!player.isGrounded) {
    player.animationState = player.vy < 0 ? "jump" : "fall";
    return 0;
  }

  if (player.isDucking) {
    player.animationState = "duck";
    return 0;
  }

  const speed = Math.abs(player.vx);
  if (speed > MOVEMENT.acceleration) {
    const targetState = speed >= MOVEMENT.runSpeed ? "run" : "walk";
    player.animationState = targetState;
    return (player.animationFrame + 1) % ANIMATION_FRAMES[targetState];
  } else {
    player.animationState = "idle";
    return 0;
  }
};

// Update run boost
const updateRunBoost = (player: PlayerState) => {
  if (player.isRunning && player.isSprinting) {
    player.boostMeter -= RUN_BOOST.decayRate;

    if (player.boostMeter <= 0) {
      player.isSprinting = false;
      player.isRunning = false;
      player.boostMeter = 0;
      soundManager.playBoostDepletedSound();
    }
  } else if (!player.isSprinting && player.boostMeter < RUN_BOOST.maxMeter) {
    player.boostMeter += RUN_BOOST.rechargeRate;
    if (player.boostMeter > RUN_BOOST.maxMeter) {
      player.boostMeter = RUN_BOOST.maxMeter;
    }
  }
};

// Initialize level platform map
const initializePlatforms = () => {
  const map: PlatformType[][] = [];
  // Ground level
  const groundLevel = Math.floor(SCREEN_HEIGHT / PLAYER_HEIGHT) - 2;
  for (let y = 0; y < SCREEN_HEIGHT / PLAYER_HEIGHT; y++) {
    const row: PlatformType[] = [];
    for (let x = 0; x < SCREEN_WIDTH / PLAYER_WIDTH; x++) {
      if (y === groundLevel) {
        row.push(PlatformType.GROUND);
      } else {
        row.push(PlatformType.AIR);
      }
    }
    map.push(row);
  }
  return map;
};

// Create context
export const SuperMarioContext = createContext<MarioGameContextType | null>(
  null,
);

// Create provider component
export function SuperMarioGameProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [player, setPlayer] = useState<PlayerState>(initializePlayer());
  const [gameState, setGameState] = useState<MarioGameState>({
    currentLevel: "level1",
    isPaused: false,
    score: INITIAL_SCORE,
    highScore: Number(localStorage.getItem(STORAGE_KEYS.HIGH_SCORE)) || 0,
    lives: INITIAL_LIVES,
    level: 1,
    gameState: GameStateType.IDLE,
    player: player,
    platforms: initializePlatforms(),
    enemies: [],
    collectibles: [],
    camera: { x: 0, y: 0, targetX: 0, targetY: 0 },
    input: {
      left: false,
      right: false,
      up: false,
      down: false,
      jump: false,
      run: false,
      duck: false,
      pause: false,
      restart: false,
      start: false,
    },
    time: TIME_LIMIT,
  });

  // Extract gameState value to avoid naming conflict
  const gameStateValue = gameState;
  const isPaused = gameStateValue.isPaused;
  const input = gameStateValue.input;
  // Game loop
  const animationFrameRef = useRef<number | undefined>(undefined);
  const gameLoopRef = useRef<(time: number) => void | null>(null);

  gameLoopRef.current = useCallback(() => {
    if (!isPaused) {
      // Read input state for movement decisions
      const canJump = player.isGrounded && !gameState.input.jump;
      const isMoving = gameState.input.left || gameState.input.right;
      const isRunning = gameState.input.run;

      // Set player run state for movement functions
      player.isRunning = isRunning;
      player.isSprinting = isMoving && isRunning && player.boostMeter > 0;
      if (player.isSprinting) {
        player.boostMeter = Math.max(
          0,
          player.boostMeter - RUN_BOOST.decayRate,
        );
      } else {
        player.boostMeter = Math.min(
          RUN_BOOST.maxMeter,
          player.boostMeter + RUN_BOOST.rechargeRate,
        );
      }

      // Update horizontal movement
      const fellOff = updatePlayerPhysics(player, gameState.input);
      player.isGrounded = false;
      player.platformsCollided = [];
      const colliding = checkPlatformCollision(player, gameState.platforms);
      if (colliding) {
        // Find all platforms we're colliding with
        for (let y = 0; y < gameState.platforms.length; y++) {
          for (let x = 0; x < gameState.platforms[y].length; x++) {
            const platformType = gameState.platforms[y][x];
            if (platformType !== PlatformType.AIR) {
              const playerRect = {
                x: player.x,
                y: player.y,
                width: player.width,
                height: player.height,
              };
              const platform = {
                x: x * PLAYER_WIDTH,
                y: y * PLAYER_HEIGHT,
                width: PLAYER_WIDTH,
                height: PLAYER_HEIGHT,
                type: platformType,
              };
              if (checkAABB(playerRect, platform)) {
                player.platformsCollided.push(platformType);
              }
            }
          }
        }
      }
      resolvePlatformCollisions(player, gameState.platforms);

      // Jump handling using input state
      if (gameState.input.up && canJump) {
        player.vy = JUMP.force;
        player.isJumping = true;
        player.isGrounded = false;

        // Set facing direction based on input
        if (gameState.input.left || gameState.input.right) {
          player.facingLeft = gameState.input.left;
        }
      } else if (!gameState.input.up) {
        // Keep input direction for facing logic
        if (gameState.input.left) {
          player.facingLeft = true;
        } else if (gameState.input.right) {
          player.facingLeft = false;
        }
      }

      // Update horizontal movement
      updateHorizontalMovement(player, gameState.input);

      // Update run boost
      updateRunBoost(player);

      // Handle edge cases
      if (fellOff) {
        const newLives = gameState.lives - 1;
        setGameState((prev) => ({ ...prev, lives: newLives }));
        if (newLives <= 0) {
          setGameState((prev) => ({
            ...prev,
            gameState: GameStateType.GAME_OVER,
          }));
        } else {
          // Respawn
          const respawnedPlayer = initializePlayer();
          respawnedPlayer.x = 50;
          respawnedPlayer.y = SCREEN_HEIGHT - PLAYER_HEIGHT * 2;
          respawnedPlayer.width = PLAYER_WIDTH;
          respawnedPlayer.height = PLAYER_HEIGHT;
          setPlayer(respawnedPlayer);
          animationFrameRef.current = 0;
        }
      }

      // Update animation
      const newAnimationFrame = updatePlayerAnimation(
        player,
        player.isSprinting,
      );
      animationFrameRef.current = newAnimationFrame;
      setPlayer({ ...player, animationFrame: newAnimationFrame });

      // Update camera to track player
      // Set camera target to player's position with slight delay
      let targetX = player.x - SCREEN_WIDTH / 2 + player.width / 2;
      // Clamp target to reasonable bounds
      targetX = Math.max(0, Math.min(targetX, SCREEN_WIDTH * 3));
      // Smoothly interpolate camera x towards target
      setGameState((prev) => ({
        ...prev,
        camera: {
          x: prev.camera.x + (targetX - prev.camera.x) * CAMERA_SMOOTHING,
          y: 0,
          targetX: targetX,
          targetY: 0,
        },
      }));
    }

    animationFrameRef.current = requestAnimationFrame(gameLoopRef.current!);
  }, [player, gameState, isPaused]);

  // Start game on load
  useEffect(() => {
    if (isPaused) {
      console.log("Paused");
      return;
    }
    console.log("Starting gameloop");
    animationFrameRef.current = requestAnimationFrame(gameLoopRef.current!);
    return () => {
      if (gameLoopRef.current) {
        console.log("Stopping gameloop");
        cancelAnimationFrame(animationFrameRef.current!);
      }
    };
  }, [isPaused]);

  // Handle start/restart
  const startGame = useCallback(() => {
    console.debug("Starting game");
    setGameState((prev) => ({
      ...prev,
      gameState: GameStateType.PLAYING,
      isPaused: false,
    }));
    // Reset input state to clean start
    handleInput({
      left: false,
      right: false,
      up: false,
      down: false,
      jump: false,
      run: false,
      duck: false,
      pause: false,
      restart: false,
      start: false,
    });
  }, []);

  // Restart level
  const restartLevel = useCallback(() => {
    const newPlayer = initializePlayer();
    newPlayer.x = 50;
    newPlayer.y = SCREEN_HEIGHT - PLAYER_HEIGHT * 2;
    newPlayer.width = PLAYER_WIDTH;
    newPlayer.height = PLAYER_HEIGHT;
    setPlayer(newPlayer);
    animationFrameRef.current = 0;
    setGameState((prev: MarioGameState) => ({
      ...prev,
      gameState: GameStateType.PLAYING,
      isPaused: false,
    }));
  }, []);

  // Resume game
  const resumeGame = useCallback(() => {
    setGameState((prev: MarioGameState) => ({ ...prev, isPaused: false }));
  }, []);

  // Pause game
  const pauseGame = useCallback(() => {
    setGameState((prev: MarioGameState) => ({ ...prev, isPaused: true }));
  }, []);

  // Handle input action
  const handleInput = useCallback(
    (newInput: Partial<InputState>) => {
      // Check if game is in IDLE state and start was pressed - start the game
      if (
        gameStateValue.gameState === GameStateType.IDLE &&
        (newInput.start === true || newInput.restart === true)
      ) {
        startGame();
      }

      // Update gameState.input directly
      setGameState((prev: MarioGameState) => ({
        ...prev,
        input: { ...prev.input, ...newInput },
      }));
      // Note: No need for setTimeout as InputHandler calls this directly
    },
    [setGameState, startGame, gameState],
  );

  // Update player action - updateInput is now handled by InputHandler component

  // Check collisions action
  const checkCollisions = useCallback(() => {
    // Platform collision already handled in game loop
  }, []);

  // Update enemies action
  const updateEnemies = useCallback(() => {
    // Phase 5 - enemy updates
  }, []);

  // Check lose condition action
  const checkLoseCondition = useCallback(() => {
    // Phase 10 - lose condition handled in game loop
  }, []);

  // Check win condition action
  const checkWinCondition = useCallback(() => {
    const level = getLevel(gameState.currentLevel);
    const flagPoleX =
      level.startPlayerX + (level.flagPoleX || 0) * (PLAYER_WIDTH * 2);

    // Check if player reached the flag pole
    if (player.x + player.width >= flagPoleX) {
      setGameState((prev) => ({
        ...prev,
        gameState: GameStateType.VICTORY,
      }));
    }
  }, [player.x, player.width, gameState.currentLevel]);

  // Next level action
  const nextLevel = useCallback(() => {
    setGameState((prev) => ({ ...prev, level: prev.level + 1 }));
    restartLevel();
  }, [restartLevel]);

  // Add score action
  const addScore = useCallback((points: number) => {
    setGameState((prev) => ({ ...prev, score: prev.score + points }));
  }, []);

  // Update player action - updateInput is now handled by InputHandler component
  const updatePlayer = useCallback(() => {}, []);

  const actions: MarioGameActions = {
    startGame,
    restartLevel,
    resumeGame,
    pauseGame,
    setInput: handleInput,
    updatePlayer,
    checkCollisions,
    updateEnemies,
    checkWinCondition,
    checkLoseCondition,
    nextLevel,
    addScore,
  };

  return (
    <CameraProvider levelWidth={3200} levelHeight={480}>
      <SuperMarioContext.Provider value={{ state: gameState, actions }}>
        <InputHandler onInputChange={handleInput} />
        {children}
      </SuperMarioContext.Provider>
    </CameraProvider>
  );
}

// Create custom hook
export function useSuperMario() {
  const ctx = useContext(SuperMarioContext);
  if (!ctx) {
    throw new Error("useSuperMario must be used within SuperMarioGameProvider");
  }
  return {
    ...ctx,
    ...ctx.state,
    ...ctx.actions,
  };
}

export { Player };
