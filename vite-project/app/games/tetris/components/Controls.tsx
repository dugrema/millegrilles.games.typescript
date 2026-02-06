import { useContext } from "react";
import { GameContext } from "../GameContext";

export function Controls() {
  const { state, dispatch } = useContext(GameContext);
  const { score, level, nextPiece, linesCleared, gameOver, isPaused } = state;

  /* ---------- Helpers for actions ---------- */
  const tryMove = (dx: number, dy: number) => {
    if (!state.piece || gameOver) return;
    dispatch({ type: "MOVE", payload: { dx, dy } });
  };
  const rotate = () => {
    if (!state.piece || gameOver) return;
    dispatch({ type: "ROTATE" });
  };
  const hardDrop = () => {
    if (!state.piece || gameOver) return;
    dispatch({ type: "HARD_DROP" });
  };
  const togglePause = () => {
    dispatch(state.isPaused ? { type: "RESUME" } : { type: "PAUSE" });
  };

  /* ---------- Render next piece preview ---------- */
  const renderPreview = () => {
    const cellSize = 12;
    const previewStyle: React.CSSProperties = {
      width: `${cellSize * 4}px`,
      height: `${cellSize * 4}px`,
      position: "relative",
      backgroundColor: "#333",
      margin: "0 auto",
    };

    const cells: React.ReactNode[] = [];
    nextPiece.shape.forEach((filled, idx) => {
      if (!filled) return;
      const col = (idx % 4) + 1;
      const row = Math.floor(idx / 4) + 1;
      if (row < 0) return;
      cells.push(
        <div
          key={`np-${row}-${col}`}
          style={{
            width: `${cellSize}px`,
            height: `${cellSize}px`,
            backgroundColor: `hsl(${nextPiece.type * 45}, 70%, 50%)`,
            border: "1px solid #555",
            boxSizing: "border-box",
            position: "absolute" as const,
            left: `${col * cellSize}px`,
            top: `${row * cellSize}px`,
          }}
        />,
      );
    });

    return <div style={previewStyle}>{cells}</div>;
  };

  /* ---------- Main layout ---------- */
  return (
    <aside className="p-4 bg-gray-800 text-white w-48 sm:w-auto mx-auto">
      {/* Small‑screen layout (mobile portrait) */}
      <div className="block sm:hidden">
        {/* Score/level/lines and next preview on single line */}
        <div className="flex items-center justify-between text-xs">
          <div>
            <p>⚙️ {score}</p>
            <p>Lv: {level}</p>
            <p>Ln: {linesCleared}</p>
          </div>
          <div className="ml-2">{renderPreview()}</div>
        </div>

        {/* Buttons in a row at the bottom – omit pause button */}
        <div className="flex justify-between mt-4">
          <button
            onClick={() => tryMove(-1, 0)}
            disabled={gameOver || !state.piece}
            className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50"
          >
            ←
          </button>
          <button
            onClick={rotate}
            disabled={gameOver || !state.piece}
            className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50"
          >
            ↻
          </button>
          <button
            onClick={() => tryMove(1, 0)}
            disabled={gameOver || !state.piece}
            className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50"
          >
            →
          </button>
          <button
            onClick={hardDrop}
            disabled={gameOver || !state.piece}
            className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50"
          >
            ⏬
          </button>
        </div>
      </div>

      {/* Large‑screen layout (tablet / desktop) */}
      <div className="hidden sm:block">
        {/* Pause status indicator */}
        <div className="mb-2">
          <span className="font-medium">Pause: {isPaused ? "On" : "Off"}</span>
          <p className="text-xs text-gray-300">Press “p” to toggle</p>
        </div>

        <h2 className="font-medium mb-2">Score</h2>
        <p className="text-2xl">{score}</p>

        <h3 className="font-medium mt-4 mb-2">Level</h3>
        <p>{level}</p>

        <h3 className="font-medium mt-4 mb-2">Lines</h3>
        <p>{linesCleared}</p>

        <h3 className="font-medium mt-4 mb-2">Next</h3>
        {renderPreview()}

        <div className="mt-4 text-xs">
          <p>← → Rotate</p>
          <p>↓ Drop</p>
          <p>Space = Hard Drop</p>
          <p>p = Pause / Resume</p>
        </div>
      </div>
    </aside>
  );
}
