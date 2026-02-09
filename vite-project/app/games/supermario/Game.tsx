import { useRef, useEffect } from "react";
import { useSuperMario } from "./index";
import {
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  GROUND_Y,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
} from "./constants";

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { startGame, pauseGame, player } = useSuperMario();

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

      // Player
      ctx.fillStyle = "orange";
      ctx.fillRect(
        player.pos.x,
        player.pos.y,
        PLAYER_WIDTH,
        PLAYER_HEIGHT
      );
    };

    const loop = () => {
      render();
      animation = requestAnimationFrame(loop);
    };
    loop();

    return () => cancelAnimationFrame(animation);
  }, [player]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        style={{ border: "1px solid #333" }}
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
