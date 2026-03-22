import { useEffect, useCallback, useRef } from "react";
import { useGameContext } from "./GameContext";
import { useParticleSystem } from "./ParticleSystem";
import type {
  Mario,
  Pipe,
  Flagpole,
  Enemy,
  Coin,
  Platform,
  Block,
  Mushroom,
  Ground,
} from "./types";

import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  GROUND_HEIGHT,
  GRAVITY,
  JUMP_VELOCITY,
  MOVE_SPEED,
  RUN_SPEED,
  FRICTION,
  MUSHROOM_SPEED,
  MUSHROOM_LIFETIME,
  BIG_MARIO_HEIGHT,
  MARIO_HEIGHT,
  MARIO_WIDTH,
  MAX_FALL_SPEED,
  MUSHROOM_1UP_COLOR,
} from "./constants";

import audioManager from "./audio";

/**
 * Main hook that drives the game loop and state updates for Super Mario.
 * Provides basic game loop functionality: start, pause, resume, restart.
 */
export function useGameLogic() {
  /* ---------- Context & state ---------- */
  const {
    state,
    dispatch,
    jump: contextJump,
    startGame: contextStartGame,
    handleGameOver,
    handleGameWin,
    handleLevelComplete,
    resetGame,
    updateTime,
    loseLife,
    getTransitionState,
  } = useGameContext();

  /* ---------- Particle system ---------- */
  const { spawnParticles } = useParticleSystem();

  /* ---------- Enable audio on first interaction ---------- */
  useEffect(() => {
    if (state.status.state === "PLAYING") {
      audioManager.enableAudio();
    }
  }, [state.status.state]);

  /* ---------- Respawn timer ref ---------- */
  const respawnTimerRef = useRef<number | null>(null);
  const RESPAWN_DELAY = 2000; // 2 second delay

  /* ---------- Death handler function ---------- */
  const die = useCallback(() => {
    // Lose a life (triggers delayed respawn)
    dispatch({ type: "RESPAWN_DELAY" });
    // Spawn death particles
    spawnParticles(
      "BRICK_BREAK",
      localMarioRef.current.x + MARIO_WIDTH / 2,
      localMarioRef.current.y + MARIO_HEIGHT / 2,
      8,
    );
    // Play death sound
    audioManager.playDeath();
    // Start respawn timer
    respawnTimerRef.current = window.setTimeout(() => {
      dispatch({ type: "RESPAWN_COMPLETE" });
    }, RESPAWN_DELAY) as unknown as number;
  }, [dispatch, spawnParticles]);

  /* ---------- Mutable refs for smooth game loop ---------- */
  const animationFrameRef = useRef<number | undefined>(undefined);

  /* ---------- Cleanup respawn timer on unmount ---------- */
  useEffect(() => {
    return () => {
      if (respawnTimerRef.current) {
        window.clearTimeout(respawnTimerRef.current);
      }
    };
  }, []);
  const justResumedRef = useRef(false);

  const localMarioRef = useRef<Mario>({ ...state.mario });
  const pipesRef = useRef<Pipe[]>([...state.pipes]);
  const groundsRef = useRef<Ground[]>([]);
  const platformsRef = useRef<Platform[]>([]);
  const blocksRef = useRef<Block[]>([]);
  const enemiesRef = useRef<Enemy[]>([]);
  const coinsRef = useRef<Coin[]>([]);
  const mushroomsRef = useRef<Mushroom[]>([]);
  const flagpoleRef = useRef<Flagpole | null>(null);
  const cameraRef = useRef({ x: 0, scrollSpeed: 5 });

  /* ---------- Sync refs to context state ---------- */
  /* ---------- Sync state to refs for game loop ---------- */
  useEffect(() => {
    localMarioRef.current = { ...state.mario };
    pipesRef.current = [...state.pipes];
    platformsRef.current = [...state.platforms];
    blocksRef.current = [...state.blocks];
    groundsRef.current = [...(state.grounds || [])];
    enemiesRef.current = [...state.enemies];
    coinsRef.current = [...state.coins];
    mushroomsRef.current = [...(state.mushrooms || [])];
    flagpoleRef.current = state.flagpole;
    cameraRef.current = { ...state.camera }; // Sync camera position
  }, [
    state.mario,
    state.pipes,
    state.platforms,
    state.blocks,
    state.grounds,
    state.enemies,
    state.coins,
    state.mushrooms,
    state.flagpole,
    state.camera,
  ]);

  /* ---------- Update physics (basic movement) ---------- */
  const updatePhysics = useCallback(() => {
    if (state.status.state !== "PLAYING") return;

    const mario = localMarioRef.current;
    const pipes = pipesRef.current;
    const platforms = platformsRef.current;
    const blocks = blocksRef.current;
    const grounds = groundsRef.current;
    const enemies = enemiesRef.current;
    const coins = coinsRef.current;
    const mushrooms = mushroomsRef.current;

    // Apply gravity
    mario.velocityY += GRAVITY;

    // Limit fall speed to prevent tunneling through ground
    if (mario.velocityY > MAX_FALL_SPEED) {
      mario.velocityY = MAX_FALL_SPEED;
    }

    // Apply friction to horizontal movement only when nearly stopped
    // This allows Mario to maintain horizontal velocity while jumping
    if (Math.abs(mario.velocityX) < 0.5) {
      mario.velocityX *= FRICTION;
    }

    // Update horizontal position first
    mario.x += mario.velocityX;

    // Keep Mario within visible bounds (basic boundary check)
    if (mario.x < 0) {
      mario.x = 0;
      mario.velocityX = 0;
    }

    // Pipe collision detection (horizontal)
    for (const pipe of pipes) {
      // Use expanded hitbox for more forgiving collision detection
      const hitboxPadding = 4;
      const marioLeft = mario.x - hitboxPadding;
      const marioRight = mario.x + mario.width + hitboxPadding;
      const marioTop = mario.y - hitboxPadding;
      const marioBottom = mario.y + mario.height + hitboxPadding;

      if (
        marioLeft < pipe.x + pipe.width &&
        marioRight > pipe.x &&
        marioTop < pipe.y + pipe.height &&
        marioBottom > pipe.y
      ) {
        // Mario collided with pipe - resolve collision
        // Check if Mario is above the pipe (can stand on top)
        if (
          marioBottom - hitboxPadding <= pipe.y + 10 &&
          mario.velocityY >= 0
        ) {
          // Land on top of pipe
          mario.y = pipe.y - mario.height;
          mario.velocityY = 0;
          mario.isGrounded = true;
          mario.isJumping = false;
        }
        // Check if Mario hit the side of the pipe
        else if (
          mario.velocityY >= 0 &&
          mario.x + mario.width / 2 < pipe.x + pipe.width / 2
        ) {
          // Mario is on the left side of pipe - push left
          mario.x = pipe.x - mario.width;
          mario.velocityX = 0;
        } else if (
          mario.velocityY >= 0 &&
          mario.x + mario.width / 2 >= pipe.x + pipe.width / 2
        ) {
          // Mario is on the right side - push right
          mario.x = pipe.x + pipe.width;
          mario.velocityX = 0;
        }
      }
    }

    // Platform collision detection (horizontal)
    for (const platform of platforms) {
      // Use expanded hitbox for more forgiving collision detection
      const hitboxPadding = 4;
      const marioLeft = mario.x - hitboxPadding;
      const marioRight = mario.x + mario.width + hitboxPadding;
      const marioTop = mario.y - hitboxPadding;
      const marioBottom = mario.y + mario.height + hitboxPadding;

      if (
        marioLeft < platform.x + platform.width &&
        marioRight > platform.x &&
        marioTop < platform.y + platform.height &&
        marioBottom > platform.y
      ) {
        // Check if Mario is above the platform (can stand on top)
        if (
          marioBottom - hitboxPadding <= platform.y + 10 &&
          mario.velocityY >= 0
        ) {
          // Land on top of platform
          mario.y = platform.y - mario.height;
          mario.velocityY = 0;
          mario.isGrounded = true;
          mario.isJumping = false;
        } else if (
          mario.velocityY >= 0 &&
          mario.x + mario.width / 2 < platform.x + platform.width / 2
        ) {
          // Mario is on the left side - push left
          mario.x = platform.x - mario.width;
          mario.velocityX = 0;
        } else if (
          mario.velocityY >= 0 &&
          mario.x + mario.width / 2 >= platform.x + platform.width / 2
        ) {
          // Mario is on the right side - push right
          mario.x = platform.x + platform.width;
          mario.velocityX = 0;
        }
      }
    }

    // Update vertical position
    mario.y += mario.velocityY;

    // Ground collision detection with pits
    mario.isGrounded = false;

    for (const ground of grounds) {
      // Check if Mario is above or inside this ground segment
      // Use exact bounds for horizontal check to prevent falling through gaps
      // when moving quickly over pit edges
      const marioLeft = mario.x;
      const marioRight = mario.x + mario.width;
      const marioBottom = mario.y + mario.height;

      // Check horizontal overlap - Mario's feet must be within ground bounds
      if (
        marioLeft < ground.x + ground.width &&
        marioRight > ground.x &&
        marioBottom >= ground.y &&
        marioBottom <= ground.y + 50 &&
        mario.velocityY >= 0
      ) {
        // Mario is landing on top of this ground segment
        mario.y = ground.y - mario.height;
        mario.velocityY = 0;
        mario.isGrounded = true;
        mario.isJumping = false;
        break;
      }
    }

    // Check if Mario landed on top of any pipe
    for (const pipe of pipes) {
      // Use exact bounds for horizontal check to prevent landing on pipes
      // when jumping over them while moving
      const marioLeft = mario.x;
      const marioRight = mario.x + mario.width;
      const marioBottom = mario.y + mario.height;
      const marioTop = mario.y;

      if (marioLeft < pipe.x + pipe.width && marioRight > pipe.x) {
        // Check if Mario is landing on top (feet were above pipe last frame or at pipe top)
        if (
          marioBottom >= pipe.y &&
          marioBottom <= pipe.y + 10 &&
          mario.velocityY >= 0
        ) {
          // Mario is landing on top of pipe
          mario.y = pipe.y - mario.height;
          mario.velocityY = 0;
          mario.isGrounded = true;
          mario.isJumping = false;
        }
        // Check if Mario's head hits the underside of pipe while jumping up
        else if (
          marioTop <= pipe.y + pipe.height &&
          marioTop >= pipe.y &&
          mario.velocityY < 0
        ) {
          // Mario's head hits pipe underside - stop upward movement
          mario.y = pipe.y + pipe.height;
          mario.velocityY = 0;
        }
        // Horizontal collision on sides - only if Mario actually overlaps the pipe side
        else if (
          marioTop < pipe.y + pipe.height &&
          marioBottom > pipe.y &&
          // Mario must actually be touching the side, not just passing underneath
          ((marioRight > pipe.x && marioLeft < pipe.x) ||
            (marioLeft < pipe.x + pipe.width &&
              marioRight > pipe.x + pipe.width))
        ) {
          // Check if Mario is on the left side of pipe
          if (mario.x + mario.width / 2 < pipe.x + pipe.width / 2) {
            mario.x = pipe.x - mario.width;
            mario.velocityX = 0;
          } else {
            mario.x = pipe.x + pipe.width;
            mario.velocityX = 0;
          }
        }
      }
    }

    // Check if Mario landed on top of any platform
    for (const platform of platforms) {
      // Use exact bounds for horizontal check to prevent landing on platforms
      // when jumping over them while moving
      const marioLeft = mario.x;
      const marioRight = mario.x + mario.width;
      const marioBottom = mario.y + mario.height;
      const marioTop = mario.y;

      if (marioLeft < platform.x + platform.width && marioRight > platform.x) {
        // Check if Mario is landing on top (feet were above platform last frame or at platform top)
        if (
          marioBottom >= platform.y &&
          marioBottom <= platform.y + 10 &&
          mario.velocityY >= 0
        ) {
          // Mario is landing on top of platform
          mario.y = platform.y - mario.height;
          mario.velocityY = 0;
          mario.isGrounded = true;
          mario.isJumping = false;
        }
        // Check if Mario's head hits the underside of platform while jumping up
        else if (
          marioTop <= platform.y + platform.height &&
          marioTop >= platform.y &&
          mario.velocityY < 0
        ) {
          // Mario's head hits platform underside - stop upward movement
          mario.y = platform.y + platform.height;
          mario.velocityY = 0;
        }
        // Horizontal collision on sides - only if Mario actually overlaps the platform side
        else if (
          marioTop < platform.y + platform.height &&
          marioBottom > platform.y &&
          // Mario must actually be touching the side, not just passing underneath
          ((marioRight > platform.x && marioLeft < platform.x) ||
            (marioLeft < platform.x + platform.width &&
              marioRight > platform.x + platform.width))
        ) {
          // Mario is touching the platform side
          if (mario.x + mario.width / 2 < platform.x + platform.width / 2) {
            mario.x = platform.x - mario.width;
            mario.velocityX = 0;
          } else {
            mario.x = platform.x + platform.width;
            mario.velocityX = 0;
          }
        }
      }
    }

    // Block collision detection (standing on top, head bump)
    for (const block of blocks) {
      // Skip ground blocks (they're too low)
      // Used question blocks remain solid obstacles
      if (block.y >= CANVAS_HEIGHT - GROUND_HEIGHT - block.height) continue;

      // Use exact bounds for precise collision
      const marioLeft = mario.x;
      const marioRight = mario.x + mario.width;
      const marioTop = mario.y;
      const marioBottom = mario.y + mario.height;

      // Check horizontal overlap first
      if (marioLeft < block.x + block.width && marioRight > block.x) {
        // Check if Mario is landing on top of block (feet at block top, falling down)
        if (
          marioBottom >= block.y &&
          marioBottom <= block.y + 10 &&
          mario.velocityY >= 0
        ) {
          // Land on top of block
          mario.y = block.y - mario.height;
          mario.velocityY = 0;
          mario.isGrounded = true;
          mario.isJumping = false;
        }
        // Check if Mario's head hits the underside of block while jumping up
        else if (
          marioTop <= block.y + block.height &&
          marioTop >= block.y &&
          mario.velocityY < 0
        ) {
          // Mario's head hits block underside - stop upward movement
          mario.y = block.y + block.height;
          mario.velocityY = 0;

          // Activate question block
          if (block.type === "QUESTION" && !block.used) {
            block.used = true;

            // Deliver contents if any
            if (block.contents === "COIN") {
              dispatch({ type: "ADD_COIN" });
              audioManager.playCoin();
              spawnParticles("COIN_SPARKLE", block.x + 20, block.y + 20);
            } else if (block.contents === "MUSHROOM") {
              // Spawn mushroom entity that moves right (SUPER type by default)
              const newMushroom: Mushroom = {
                id: `mushroom-${block.id}-${Date.now()}`,
                x: block.x,
                y: block.y - 32, // Spawn just above block
                width: 32,
                height: 32,
                velocityX: MUSHROOM_SPEED,
                velocityY: 0, // Start with no vertical velocity
                active: true,
                spawnTime: Date.now(),
                type: "SUPER", // Default to SUPER mushroom
              };
              // Add to ref - will be synced via UPDATE_LOCAL_STATE
              mushroomsRef.current.push(newMushroom);
              audioManager.playMushroomSpawn();
              spawnParticles("MUSHROOM_BURST", block.x + 20, block.y + 20);
            } else if (block.contents === null) {
              // Empty question block just gives 100 points
              dispatch({ type: "ADD_SCORE", payload: 100 });
              audioManager.playMushroomSpawn();
              spawnParticles("MUSHROOM_BURST", block.x + 20, block.y + 20);
            }
          } else if (block.type === "BRICK" && mario.isBig) {
            // Big Mario breaks brick - remove from ref so UPDATE_LOCAL_STATE doesn't restore it
            blocksRef.current = blocksRef.current.filter(
              (b: Block) => b.x !== block.x || b.y !== block.y,
            );
            dispatch({
              type: "BREAK_BRICK",
              payload: { x: block.x, y: block.y },
            });
            audioManager.playBrickBreak();
            spawnParticles("BRICK_BREAK", block.x + 20, block.y + 20);
            dispatch({ type: "ADD_SCORE", payload: 100 });
          }
        }
        // Horizontal collision on sides - only if Mario actually overlaps the block side
        else if (
          marioTop < block.y + block.height &&
          marioBottom > block.y &&
          // Mario must actually be touching the side, not just passing underneath
          ((marioRight > block.x && marioLeft < block.x) ||
            (marioLeft < block.x + block.width &&
              marioRight > block.x + block.width))
        ) {
          // Mario is touching the block side - side collision
          if (mario.x + mario.width / 2 < block.x + block.width / 2) {
            mario.x = block.x - mario.width;
            mario.velocityX = 0;
          } else {
            mario.x = block.x + block.width;
            mario.velocityX = 0;
          }
        }
      }
    }

    // Update vertical position
    mario.y += mario.velocityY;
    // Enemy movement with gravity (patrol behavior)
    for (const enemy of enemies) {
      if (!enemy.alive) continue;

      // Apply gravity to enemy
      enemy.velocityY += GRAVITY;

      // Limit fall speed
      if (enemy.velocityY > MAX_FALL_SPEED) {
        enemy.velocityY = MAX_FALL_SPEED;
      }

      // Move enemy horizontally (no friction - keep constant patrol speed)
      enemy.x += enemy.velocityX;

      // Move enemy vertically
      enemy.y += enemy.velocityY;

      // Check if enemy reached patrol boundaries
      if (
        enemy.x > enemy.walkStart + enemy.walkRange ||
        enemy.x < enemy.walkStart - enemy.walkRange
      ) {
        // Reverse direction (no snap-back to avoid interfering with pipe collision)
        enemy.velocityX = -enemy.velocityX;
      }

      // Enemy collision with pipes (horizontal only - pass through vertically)
      for (const pipe of pipes) {
        // Check if enemy overlaps with pipe horizontally
        if (
          enemy.x < pipe.x + pipe.width &&
          enemy.x + enemy.width > pipe.x &&
          enemy.y < pipe.y + pipe.height &&
          enemy.y + enemy.height > pipe.y
        ) {
          // Determine which side of pipe enemy is on BEFORE reversing
          const enemyCenter = enemy.x + enemy.width / 2;
          const pipeCenter = pipe.x + pipe.width / 2;
          const wasOnLeft = enemyCenter < pipeCenter;

          // Enemy hit the pipe - reverse direction and step back
          enemy.velocityX = -enemy.velocityX;
          // Move enemy back out of pipe with a small buffer
          if (wasOnLeft) {
            // Enemy was on left side of pipe - move left with buffer
            enemy.x = pipe.x - enemy.width - 5;
          } else {
            // Enemy was on right side of pipe - move right with buffer
            enemy.x = pipe.x + pipe.width + 5;
          }
        }
      }

      // Enemy collision with other enemies
      for (const otherEnemy of enemies) {
        if (!otherEnemy.alive || otherEnemy === enemy) continue;

        // Check if enemies overlap
        if (
          enemy.x < otherEnemy.x + otherEnemy.width &&
          enemy.x + enemy.width > otherEnemy.x &&
          enemy.y < otherEnemy.y + otherEnemy.height &&
          enemy.y + enemy.height > otherEnemy.y
        ) {
          // Enemies collided - reverse both directions
          enemy.velocityX = -enemy.velocityX;
          otherEnemy.velocityX = -otherEnemy.velocityX;

          // Separate them with a small buffer to prevent sticking
          if (enemy.x < otherEnemy.x) {
            enemy.x = otherEnemy.x - enemy.width - 5;
          } else {
            enemy.x = otherEnemy.x + otherEnemy.width + 5;
          }
        }
      }

      // Enemy collision with platforms (can stand on top)
      for (const platform of platforms) {
        const hitboxPadding = 4;
        const enemyLeft = enemy.x - hitboxPadding;
        const enemyRight = enemy.x + enemy.width + hitboxPadding;
        const enemyTop = enemy.y - hitboxPadding;
        const enemyBottom = enemy.y + enemy.height + hitboxPadding;

        if (
          enemyLeft < platform.x + platform.width &&
          enemyRight > platform.x &&
          enemyTop < platform.y + platform.height &&
          enemyBottom > platform.y
        ) {
          // Check if enemy is above the platform (can stand on top)
          if (
            enemyBottom - hitboxPadding <= platform.y + 10 &&
            enemy.velocityY >= 0
          ) {
            // Land on top of platform
            enemy.y = platform.y - enemy.height;
            enemy.velocityY = 0;
          }
          // Check if enemy hits the bottom of platform from below
          else if (
            enemyTop >= platform.y + platform.height - 10 &&
            enemy.velocityY < 0
          ) {
            // Hit head on bottom of platform
            enemy.y = platform.y + platform.height;
            enemy.velocityY = 0;
          }
        }
      }

      // Enemy collision with blocks (can stand on top)
      for (const block of blocks) {
        // Skip ground blocks (they're too low)
        if (block.y >= CANVAS_HEIGHT - GROUND_HEIGHT - block.height) continue;

        const hitboxPadding = 1;
        const enemyLeft = enemy.x - hitboxPadding;
        const enemyRight = enemy.x + enemy.width + hitboxPadding;
        const enemyTop = enemy.y - hitboxPadding;
        const enemyBottom = enemy.y + enemy.height + hitboxPadding;

        // Check if enemy is above the block (can stand on top)
        if (
          enemyLeft < block.x + block.width &&
          enemyRight > block.x &&
          enemyBottom >= block.y &&
          enemyBottom <= block.y + 10 &&
          enemy.velocityY >= 0
        ) {
          // Land on top of block
          enemy.y = block.y - enemy.height;
          enemy.velocityY = 0;
        }
        // Check if enemy hits the bottom of block from below
        else if (
          enemyLeft < block.x + block.width &&
          enemyRight > block.x &&
          enemyTop < block.y + block.height &&
          enemyBottom > block.y + block.height &&
          enemy.velocityY < 0
        ) {
          // Hit head on bottom of block
          enemy.y = block.y + block.height;
          enemy.velocityY = 0;
        }
      }

      // Enemy ground collision - check if enemy falls off the ground
      for (const ground of grounds) {
        const hitboxPadding = 4;
        const enemyLeft = enemy.x - hitboxPadding;
        const enemyRight = enemy.x + enemy.width + hitboxPadding;
        const enemyTop = enemy.y - hitboxPadding;
        const enemyBottom = enemy.y + enemy.height + hitboxPadding;

        if (
          enemyLeft < ground.x + ground.width &&
          enemyRight > ground.x &&
          enemyTop < ground.y + ground.height &&
          enemyBottom > ground.y
        ) {
          // Check if enemy is above the ground (can stand on top)
          if (
            enemyBottom - hitboxPadding <= ground.y + 10 &&
            enemy.velocityY >= 0
          ) {
            // Land on top of ground
            enemy.y = ground.y - enemy.height;
            enemy.velocityY = 0;
          }
        }
      }

      // Enemy keeps moving forward - will fall off edges naturally (no edge detection)
    }

    // Enemy collision detection
    for (const enemy of enemies) {
      if (!enemy.alive) continue;

      // Check if Mario overlaps with enemy
      if (
        mario.x < enemy.x + enemy.width &&
        mario.x + mario.width > enemy.x &&
        mario.y < enemy.y + enemy.height &&
        mario.y + mario.height > enemy.y
      ) {
        // Determine collision direction
        // Check if Mario is falling onto enemy from above (stomp)
        const marioBottom = mario.y + mario.height;
        const enemyTop = enemy.y;
        const isStomp =
          mario.velocityY > 0 &&
          marioBottom <= enemyTop + 15 &&
          mario.y + mario.height / 2 < enemy.y;

        if (isStomp) {
          // Stomp enemy - enemy dies, Mario bounces
          enemy.alive = false;
          mario.velocityY = -8; // Small bounce
          dispatch({ type: "ADD_SCORE", payload: 200 });
        } else {
          // Mario touches enemy from side - lose a life
          die();
          return;
        }
      }
    }

    // Coin collection
    for (const coin of coins) {
      if (coin.collected) continue;

      // Check if Mario touches coin
      // Use expanded hitbox for more forgiving collision detection
      const hitboxPadding = 4;
      const marioLeft = mario.x - hitboxPadding;
      const marioRight = mario.x + mario.width + hitboxPadding;
      const marioTop = mario.y - hitboxPadding;
      const marioBottom = mario.y + mario.height + hitboxPadding;

      if (
        marioLeft < coin.x + coin.width &&
        marioRight > coin.x &&
        marioTop < coin.y + coin.height &&
        marioBottom > coin.y
      ) {
        // Mario collects coin
        coin.collected = true;
        dispatch({ type: "ADD_COIN" });
        audioManager.playCoin();
        spawnParticles("COIN_SPARKLE", coin.x + 10, coin.y + 10);
      }
    }

    // Mushroom physics and collection
    for (const mushroom of mushrooms) {
      if (!mushroom.active) continue;

      // Check if mushroom timed out (disappears after MUSHROOM_LIFETIME ms)
      if (Date.now() - mushroom.spawnTime > MUSHROOM_LIFETIME) {
        mushroom.active = false;
        continue;
      }

      // Apply gravity to mushroom (same as Mario)
      mushroom.velocityY += GRAVITY;

      // Limit fall speed for mushroom
      if (mushroom.velocityY > MAX_FALL_SPEED) {
        mushroom.velocityY = MAX_FALL_SPEED;
      }

      // Move mushroom horizontally (no friction - keep constant speed)
      mushroom.x += mushroom.velocityX;

      // Move mushroom vertically
      mushroom.y += mushroom.velocityY;

      // Mushroom collision with pipes - pass through (ghost-like)
      // But mushroom stops at walls/boundaries
      if (mushroom.x > CANVAS_WIDTH * 2) {
        // Mushroom went off screen - deactivate
        mushroom.active = false;
      }

      // Mushroom collision with platforms (can stand on top)
      for (const platform of platforms) {
        const hitboxPadding = 4;
        const mushroomLeft = mushroom.x - hitboxPadding;
        const mushroomRight = mushroom.x + mushroom.width + hitboxPadding;
        const mushroomTop = mushroom.y - hitboxPadding;
        const mushroomBottom = mushroom.y + mushroom.height + hitboxPadding;

        if (
          mushroomLeft < platform.x + platform.width &&
          mushroomRight > platform.x &&
          mushroomTop < platform.y + platform.height &&
          mushroomBottom > platform.y
        ) {
          // Check if mushroom is above the platform (can stand on top)
          if (
            mushroomBottom - hitboxPadding <= platform.y + 10 &&
            mushroom.velocityY >= 0
          ) {
            // Land on top of platform
            mushroom.y = platform.y - mushroom.height;
            mushroom.velocityY = 0;
          }
          // Check if mushroom hits the bottom of platform from below
          else if (
            mushroomTop >= platform.y + platform.height - 10 &&
            mushroom.velocityY < 0
          ) {
            // Hit head on bottom of platform
            mushroom.y = platform.y + platform.height;
            mushroom.velocityY = 0;
          }
          // Check if mushroom hits the side of platform
          else if (mushroom.velocityY >= 0) {
            // Mushroom is not falling fast, resolve horizontal collision
            if (
              mushroom.x + mushroom.width / 2 <
              platform.x + platform.width / 2
            ) {
              mushroom.x = platform.x - mushroom.width;
            } else {
              mushroom.x = platform.x + platform.width;
            }
            mushroom.velocityX = -mushroom.velocityX;
          }
        }
      }

      // Mushroom collision with blocks (can stand on top, hit head from below)
      for (const block of blocks) {
        // Skip ground blocks (they're too low)
        if (block.y >= CANVAS_HEIGHT - GROUND_HEIGHT - block.height) continue;

        const hitboxPadding = 1;
        const mushroomLeft = mushroom.x - hitboxPadding;
        const mushroomRight = mushroom.x + mushroom.width + hitboxPadding;
        const mushroomTop = mushroom.y - hitboxPadding;
        const mushroomBottom = mushroom.y + mushroom.height + hitboxPadding;

        // Check if mushroom is above the block (can stand on top)
        if (
          mushroomLeft < block.x + block.width &&
          mushroomRight > block.x &&
          mushroomBottom >= block.y &&
          mushroomBottom <= block.y + 10 &&
          mushroom.velocityY >= 0
        ) {
          // Land on top of block
          mushroom.y = block.y - mushroom.height;
          mushroom.velocityY = 0;
        }
        // Check if mushroom hits the bottom of block from below
        else if (
          mushroomLeft < block.x + block.width &&
          mushroomRight > block.x &&
          mushroomTop < block.y + block.height &&
          mushroomBottom > block.y + block.height &&
          mushroom.velocityY < 0
        ) {
          // Hit head on bottom of block
          mushroom.y = block.y + block.height;
          mushroom.velocityY = 0;
        }
      }

      // Mushroom ground collision - check if mushroom lands on ground
      for (const ground of grounds) {
        const hitboxPadding = 4;
        const mushroomLeft = mushroom.x - hitboxPadding;
        const mushroomRight = mushroom.x + mushroom.width + hitboxPadding;
        const mushroomBottom = mushroom.y + mushroom.height;

        if (
          mushroomLeft < ground.x + ground.width &&
          mushroomRight > ground.x &&
          mushroomBottom >= ground.y &&
          mushroomBottom <= ground.y + 50 &&
          mushroom.velocityY >= 0
        ) {
          // Mushroom is landing on top of ground
          mushroom.y = ground.y - mushroom.height;
          mushroom.velocityY = 0;
        }
      }

      // Mushroom keeps moving forward - will fall off edges naturally (no edge detection)

      // Check if Mario collects the mushroom
      // Use expanded hitbox for more forgiving collision detection
      const hitboxPadding = 4;
      const marioLeft = mario.x - hitboxPadding;
      const marioRight = mario.x + mario.width + hitboxPadding;
      const marioTop = mario.y - hitboxPadding;
      const marioBottom = mario.y + mario.height + hitboxPadding;

      if (
        marioLeft < mushroom.x + mushroom.width &&
        marioRight > mushroom.x &&
        marioTop < mushroom.y + mushroom.height &&
        marioBottom > mushroom.y
      ) {
        // Mario collects mushroom
        mushroom.active = false;

        // Check mushroom type
        if (mushroom.type === "1UP") {
          // 1UP mushroom grants extra life
          dispatch({ type: "GIVE_EXTRA_LIFE" });
          audioManager.playMushroomCollect();
          spawnParticles(
            "MUSHROOM_COLLECT",
            mario.x + mario.width / 2,
            mario.y + mario.height / 2,
          );
        } else if (!mario.isBig) {
          // SUPER mushroom - transform Mario to big size
          dispatch({ type: "TRANSFORM_MARIO" });
          mario.height = BIG_MARIO_HEIGHT;
          mario.isBig = true;
          mario.invulnerable = 60; // 1 second invulnerability
          audioManager.playPowerUp();
          spawnParticles(
            "TRANSFORM_BURST",
            mario.x + mario.width / 2,
            mario.y + mario.height / 2,
          );
        } else {
          // Already big - just collect for points
          dispatch({ type: "ADD_SCORE", payload: 100 });
          audioManager.playMushroomCollect();
          spawnParticles(
            "MUSHROOM_COLLECT",
            mario.x + mario.width / 2,
            mario.y + mario.height / 2,
          );
        }
      }
    }

    // Decrement Mario's invulnerability counter
    if (mario.invulnerable > 0) {
      mario.invulnerable--;
    }

    // Update enemy collision for big Mario
    for (const enemy of enemies) {
      if (!enemy.alive) continue;

      // Check if Mario is invulnerable - skip enemy collision
      if (mario.invulnerable > 0 && Math.floor(Date.now() / 100) % 2 === 0) {
        continue;
      }

      // Check if Mario overlaps with enemy
      // Use expanded hitbox for more forgiving collision detection
      const hitboxPadding = 4;
      const marioLeft = mario.x - hitboxPadding;
      const marioRight = mario.x + mario.width + hitboxPadding;
      const marioTop = mario.y - hitboxPadding;
      const marioBottom = mario.y + mario.height + hitboxPadding;

      if (
        marioLeft < enemy.x + enemy.width &&
        marioRight > enemy.x &&
        marioTop < enemy.y + enemy.height &&
        marioBottom > enemy.y
      ) {
        // Determine collision direction
        // Check if Mario is falling onto enemy from above (stomp)
        const enemyTop = enemy.y;
        const isStomp =
          mario.velocityY > 0 &&
          marioBottom <= enemyTop + 15 &&
          mario.y + mario.height / 2 < enemy.y;

        if (isStomp) {
          // Stomp enemy - enemy dies, Mario bounces
          enemy.alive = false;
          mario.velocityY = -8; // Small bounce
          dispatch({ type: "ADD_SCORE", payload: 200 });
          audioManager.playStomp();
          spawnParticles("BRICK_BREAK", enemy.x + 16, enemy.y + 16, 6);
        } else if (mario.isBig && mario.invulnerable === 0) {
          // Big Mario touches enemy from side - shrink back to small
          enemy.alive = false;
          dispatch({ type: "SHRINK_MARIO" });
          mario.height = MARIO_HEIGHT;
          mario.isBig = false;
          mario.invulnerable = 90; // 1.5 seconds invulnerability
          // Bounce Mario back
          mario.velocityX = mario.x < enemy.x ? -5 : 5;
          audioManager.playShrink();
          spawnParticles(
            "MUSHROOM_BURST",
            mario.x + mario.width / 2,
            mario.y + mario.height / 2,
            8,
          );
        } else {
          // Small Mario touches enemy from side - lose a life
          die();
          return;
        }
      }
    }

    // Check if Mario fell into a pit (death by falling)
    // If Mario falls below the screen bottom, lose a life
    if (mario.y > CANVAS_HEIGHT) {
      die();
      return;
    }

    // Check if Mario reached the flagpole (win condition)
    if (flagpoleRef.current) {
      const flagpole = flagpoleRef.current;
      // Mario touches the flagpole
      // Use expanded hitbox for more forgiving collision detection
      const hitboxPadding = 4;
      const marioLeft = mario.x - hitboxPadding;
      const marioRight = mario.x + mario.width + hitboxPadding;
      const marioTop = mario.y - hitboxPadding;
      const marioBottom = mario.y + mario.height + hitboxPadding;

      if (
        marioLeft < flagpole.x + flagpole.width &&
        marioRight > flagpole.x &&
        marioTop < flagpole.y + flagpole.height &&
        marioBottom > flagpole.y
      ) {
        // Mario wins!
        audioManager.playVictory();
        handleLevelComplete();
        return;
      }
    }

    // Check if time ran out
    if (state.score.currentTime <= 0) {
      // Time's up - lose a life
      die();
      return;
    }

    // Update time counter (1 second per frame at 60fps = ~1 second)
    if (state.status.state === "PLAYING") {
      updateTime(1 / 60);
    }

    // Simple camera follow (scroll with Mario)
    // Only apply when actively playing, not during respawn delay
    if (state.status.state === "PLAYING") {
      const cameraThreshold = CANVAS_WIDTH / 3;

      // Standard Mario camera behavior:
      // - Camera never scrolls left (only moves right)
      // - Once Mario crosses threshold, camera follows him
      // - After respawn, camera starts at 0 and follows as Mario advances
      const targetCameraX = mario.x - cameraThreshold;

      // Only update camera if target is to the right of current position
      // This prevents camera from scrolling back left when Mario moves backward
      if (targetCameraX > cameraRef.current.x) {
        cameraRef.current.x = targetCameraX;
      }
    }

    // Push updated state back to context
    // Only sync camera during PLAYING state to avoid overriding context-controlled camera
    const cameraPayload =
      state.status.state === "PLAYING"
        ? { camera: { ...cameraRef.current } }
        : {};

    dispatch({
      type: "UPDATE_LOCAL_STATE",
      payload: {
        mario: { ...mario },
        pipes: [...pipesRef.current],
        platforms: [...platformsRef.current],
        blocks: [...blocksRef.current],
        enemies: [...enemiesRef.current],
        coins: [...coinsRef.current],
        mushrooms: [...mushroomsRef.current],
        ...cameraPayload,
      },
    });
  }, [
    state.status,
    dispatch,
    die,
    handleGameWin,
    MUSHROOM_LIFETIME,
    BIG_MARIO_HEIGHT,
    MARIO_HEIGHT,
  ]);

  /* ---------- Animation loop ---------- */
  const loopRef = useRef<(time: number) => void | null>(null);
  loopRef.current = useCallback(
    (time: number) => {
      if (state.status.state !== "PLAYING") return;

      if (justResumedRef.current) {
        justResumedRef.current = false;
        animationFrameRef.current = requestAnimationFrame(loopRef.current!);
        return;
      }

      updatePhysics();
      animationFrameRef.current = requestAnimationFrame(loopRef.current!);
    },
    [state.status, updatePhysics],
  );

  /* ---------- Lifecycle effects for game loop control ---------- */
  useEffect(() => {
    if (state.status.state === "PLAYING") {
      if (!animationFrameRef.current) {
        animationFrameRef.current = requestAnimationFrame(loopRef.current!);
      }
    } else if (
      state.status.state === "PAUSED" ||
      state.status.state === "GAME_OVER" ||
      state.status.state === "IDLE"
    ) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = undefined;
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [state.status.state]);

  /* ---------- Game controls ---------- */
  const startGame = useCallback(async () => {
    if (state.status.state !== "PLAYING") {
      cameraRef.current = { x: 0, scrollSpeed: 5 };
      pipesRef.current = [];
      // Use context's startGame which loads level config
      await contextStartGame("1-1");
    }
  }, [state.status.state, contextStartGame]);

  const pauseGame = useCallback(() => {
    if (state.status.state === "PLAYING") {
      dispatch({ type: "PAUSE" });
    } else if (state.status.state === "PAUSED") {
      justResumedRef.current = true;
      dispatch({ type: "RESUME" });
    }
  }, [state.status.state, dispatch]);

  const restartGame = useCallback(() => {
    if (state.status.state === "GAME_OVER") {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = undefined;
      }
      resetGame();
      startGame();
    }
  }, [resetGame, startGame, state.status.state]);

  /* ---------- Movement controls ---------- */
  const handleMoveLeft = useCallback(
    (isRunning = false) => {
      if (state.status.state === "PLAYING") {
        localMarioRef.current.velocityX = isRunning ? -RUN_SPEED : -MOVE_SPEED;
        localMarioRef.current.facingRight = false;
      }
    },
    [state.status.state],
  );

  const handleMoveRight = useCallback(
    (isRunning = false) => {
      if (state.status.state === "PLAYING") {
        localMarioRef.current.velocityX = isRunning ? RUN_SPEED : MOVE_SPEED;
        localMarioRef.current.facingRight = true;
      }
    },
    [state.status.state],
  );

  const handleStop = useCallback(() => {
    if (state.status.state === "PLAYING") {
      localMarioRef.current.velocityX = 0;
    }
  }, [state.status.state]);

  const handleJump = useCallback(() => {
    if (state.status.state === "PLAYING" && localMarioRef.current.isGrounded) {
      localMarioRef.current.velocityY = JUMP_VELOCITY;
      localMarioRef.current.isGrounded = false;
      localMarioRef.current.isJumping = true;
      contextJump();
      audioManager.playJump();
    }
  }, [state.status.state, contextJump]);

  /* ---------- Public API ---------- */
  return {
    state,
    jump: handleJump,
    moveLeft: handleMoveLeft,
    moveRight: handleMoveRight,
    stop: handleStop,
    startGame,
    pauseGame,
    restartGame,
    die,
    getTransitionState,
  };
}
