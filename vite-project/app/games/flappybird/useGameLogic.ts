import { useEffect, useCallback, useRef } from "react";
import { useGameContext } from "./GameContext";
import type { Bird, Pipe } from "./types";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  GRAVITY,
  JUMP_VELOCITY,
  PIPE_GAP,
  PIPE_MAX_HEIGHT,
  PIPE_MIN_HEIGHT,
  PIPE_WIDTH,
  BASE_PIPE_SPEED,
  GAME_SPEED_INCREASE_INTERVAL,
  START_SPEED,
  MAX_SPEED,
} from "./constants";

/**
 * Main hook that drives the game loop, physics and state updates.
 */
export function useGameLogic() {
  /* ---------- Context & state ---------- */
  const {
    state,
    dispatch,
    jump: contextJump,
    handleGameOver,
    resetGame,
  } = useGameContext();

  /* ---------- Mutable refs ---------- */
  const animationFrameRef = useRef<number | undefined>(undefined);
  const tapCooldownRef = useRef(false);
  const justResumedRef = useRef(false);

  const localBirdRef = useRef<Bird>({ ...state.bird });
  const pipesRef = useRef<Pipe[]>([...state.pipes]);
  const gameSpeedRef = useRef(START_SPEED);
  const frameCountRef = useRef(0);

  /* ---------- Sync refs to context ---------- */
  useEffect(() => {
    localBirdRef.current = { ...state.bird };
    pipesRef.current = [...state.pipes];
    frameCountRef.current = 0;
  }, [state.bird, state.pipes]);

  /* ---------- Collision helper ---------- */
  const isColliding = (
    a: { x: number; y: number; width: number; height: number },
    b: { x: number; y: number; width: number; height: number },
  ) => {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  };

  /* ---------- Update physics ---------- */
  const updatePhysics = useCallback(() => {
    if (state.status !== "PLAYING") return;

    frameCountRef.current++;

    // Bird physics
    const bird = localBirdRef.current;
    bird.velocity += GRAVITY;
    bird.y += bird.velocity;
    bird.rotation = Math.max(-0.5, Math.min(0.5, bird.velocity * 0.05));

    // Ground and ceiling collision
    if (bird.y + bird.height > CANVAS_HEIGHT) {
      bird.y = CANVAS_HEIGHT - bird.height;
      bird.velocity = 0;
      handleGameOver("Ground collision");
      return;
    }
    if (bird.y < 0) {
      bird.y = 0;
      bird.velocity = 0;
      handleGameOver("Ceiling collision");
      return;
    }

    /* ---------- Pipe handling ---------- */
    const pipes = pipesRef.current;

    // Immediate spawn if none exist
    if (pipes.length === 0) {
      const topH =
        Math.random() * (PIPE_MAX_HEIGHT - PIPE_MIN_HEIGHT) + PIPE_MIN_HEIGHT;
      pipesRef.current.push({
        x: CANVAS_WIDTH,
        y: 0,
        width: PIPE_WIDTH,
        height: topH,
        gap: PIPE_GAP,
        passed: false,
      });
    }

    // Spawn new pipe pair at regular intervals
    if (frameCountRef.current % GAME_SPEED_INCREASE_INTERVAL === 0) {
      const topH =
        Math.random() * (PIPE_MAX_HEIGHT - PIPE_MIN_HEIGHT) + PIPE_MIN_HEIGHT;
      pipesRef.current.push({
        x: CANVAS_WIDTH,
        y: 0,
        width: PIPE_WIDTH,
        height: topH,
        gap: PIPE_GAP,
        passed: false,
      });
    }

    // Move pipes leftwards and check for collisions
    for (let i = pipes.length - 1; i >= 0; i--) {
      const pipe = pipes[i];
      pipe.x -= BASE_PIPE_SPEED * gameSpeedRef.current;

      // Scoring logic
      if (
        !pipe.passed &&
        pipe.x + pipe.width < localBirdRef.current.x + localBirdRef.current.width / 2
      ) {
        pipe.passed = true;
        dispatch({ type: "ADD_SCORE" });

        // Gradually speed up
        if (frameCountRef.current % 5 === 0 && gameSpeedRef.current < MAX_SPEED) {
          gameSpeedRef.current += 0.2;
        }
      }

      // Remove off‑screen pipes
      if (pipe.x + pipe.width < 0) {
        pipesRef.current.splice(i, 1);
        continue;
      }

      // Collision detection with pipes
      const birdBox = {
        x: bird.x,
        y: bird.y,
        width: bird.width,
        height: bird.height,
      };

      const topPipeBox = {
        x: pipe.x,
        y: 0,
        width: pipe.width,
        height: pipe.height,
      };

      const bottomPipeBox = {
        x: pipe.x,
        y: pipe.height + pipe.gap,
        width: pipe.width,
        height: CANVAS_HEIGHT - pipe.height - pipe.gap,
      };

      if (isColliding(birdBox, topPipeBox) || isColliding(birdBox, bottomPipeBox)) {
        // Collision with either pipe side triggers game over
        handleGameOver("Pipe collision");
        return;
      }
    }

    // Push updated state back to context
    dispatch({
      type: "UPDATE_LOCAL_STATE",
      payload: { bird: { ...bird }, pipes: [...pipesRef.current] },
    });
  }, [state.status, handleGameOver, dispatch]);

  /* ---------- Animation loop ---------- */
  const loopRef = useRef<(time: number) => void | null>(null);
  loopRef.current = useCallback(
    (time: number) => {
      if (state.status !== "PLAYING") return;
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

  /* ---------- Lifecycle effects ---------- */
  useEffect(() => {
    if (state.status === "PLAYING") {
      if (!animationFrameRef.current) {
        animationFrameRef.current = requestAnimationFrame(loopRef.current!);
      }
    } else if (
      state.status === "PAUSED" ||
      state.status === "GAME_OVER" ||
      state.status === "IDLE"
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
  }, [state.status]);

  /* ---------- Game controls ---------- */
  const startGame = useCallback(() => {
    if (state.status !== "PLAYING") {
      gameSpeedRef.current = START_SPEED;
      frameCountRef.current = 0;
      pipesRef.current = [];
      dispatch({ type: "GAME_START" });
    }
  }, [state.status, dispatch]);

  const pauseGame = useCallback(() => {
    if (state.status === "PLAYING") {
      dispatch({ type: "PAUSE" });
    } else if (state.status === "PAUSED") {
      justResumedRef.current = true;
      dispatch({ type: "RESUME" });
    }
  }, [state.status, dispatch]);

  const restartGame = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    resetGame();
    startGame();
  }, [resetGame, startGame]);

  const handleJump = useCallback(() => {
    if (tapCooldownRef.current || state.status !== "PLAYING") return;
    tapCooldownRef.current = true;
    const bird = localBirdRef.current;
    bird.velocity = JUMP_VELOCITY;
    bird.rotation = -0.3;
    contextJump();
    setTimeout(() => {
      tapCooldownRef.current = false;
    }, 150);
  }, [state.status, contextJump]);

  /* ---------- Public API ---------- */
  return {
    state,
    jump: handleJump,
    startGame,
    pauseGame,
    restartGame,
  };
}
