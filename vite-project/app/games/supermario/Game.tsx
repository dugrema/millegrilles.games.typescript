import React, { useRef, useEffect, useState } from "react";
import { useSuperMario } from "./index";
import {
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  GROUND_Y,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
} from "./constants";
import Mario from "./sprites/Mario";
import LevelBlocks from "./components/levelblocks/LevelBlocks";
import { levelConfig as simpleGroundLevel } from "./levels/SimpleGround";

/**
 * Main Super Mario game component.
 *
 * The game keeps the same rendering logic for the background and
 * control UI but adds the animated Mario sprite on top of the canvas.
 */
export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { startGame, pauseGame, player, loadLevel, blocks, currentLevel } =
    useSuperMario();

  /* Simple frame cycling logic.
 Each tick increments the frame, wrapping at 6.
 The animation now runs at a controlled speed using setTimeout. */
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const tick = () => {
      setFrame((f) => (f + 1) % 6);
      setTimeout(tick, 150); // 150ms delay = ~4 fps
    };
    tick();
  }, []);

  /* Canvas background rendering (sky). */
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let animation: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Sky background
      ctx.fillStyle = "skyblue";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const loop = () => {
      render();
      animation = requestAnimationFrame(loop);
    };
    loop();

    return () => cancelAnimationFrame(animation);
  }, []);

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
      {/* Render level blocks on top of the canvas. */}
      <LevelBlocks blocks={blocks} cameraOffset={player.cameraOffset} />

      {/* Render the animated Mario sprite on top of the canvas. */}
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

      <div style={{ marginTop: "8px" }}>
        {currentLevel?.name && (
          <div style={{ marginBottom: "8px" }}>Level: {currentLevel.name}</div>
        )}
        <button onClick={startGame}>Start</button>
        <button onClick={pauseGame} style={{ marginLeft: "8px" }}>
          Pause
        </button>
        <button
          onClick={() => loadLevel(simpleGroundLevel)}
          style={{ marginLeft: "8px" }}
        >
          Load Level
        </button>
      </div>
    </div>
  );
}
