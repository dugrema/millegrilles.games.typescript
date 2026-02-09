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

/**
 * Main Super Mario game component.
 *
 * The game keeps the same rendering logic for the background and
 * control UI but adds the animated Mario sprite on top of the canvas.
 */
export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { startGame, pauseGame, player } = useSuperMario();

  /* Simple frame cycling logic.
     Each tick increments the frame, wrapping at 6.
     The animation runs at the display frame rate. */
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    let id: number | null = null;
    const tick = () => {
      setFrame((f) => (f + 1) % 6);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => {
      if (id !== null) {
        cancelAnimationFrame(id);
      }
    };
  }, []);

  /* Canvas background rendering (sky + ground). */
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let animation: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Sky background
      ctx.fillStyle = "skyblue";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Ground
      ctx.fillStyle = "green";
      ctx.fillRect(0, GROUND_Y, canvas.width, canvas.height - GROUND_Y);
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
        x={player.pos.x}
        y={player.pos.y}
      />

      <div style={{ marginTop: "8px" }}>
        <button onClick={startGame}>Start</button>
        <button onClick={pauseGame} style={{ marginLeft: "8px" }}>
          Pause
        </button>
      </div>
    </div>
  );
}
