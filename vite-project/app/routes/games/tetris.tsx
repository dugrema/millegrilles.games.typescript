import { Link } from "react-router";
import { GameOver } from "../../games/tetris/components/GameOver";
import { GameProvider, GameContext } from "../../games/tetris/GameContext";
import { GameBoard } from "../../games/tetris/components/GameBoard";
import { Controls } from "../../games/tetris/components/Controls";
import { useContext } from "react";

/**
 * Main game UI that consumes the GameContext.
 * It receives the current pause state, title, controls, board and game‑over overlay.
 */
function GameContent() {
  const { state, dispatch } = useContext(GameContext);

  const togglePause = () => {
    dispatch({ type: state.isPaused ? "RESUME" : "PAUSE" });
  };

  return (
    <>
      {/* Page title – only visible on desktop */}
      <div className="sm:hidden mb-1 flex items-center gap-2">
        <Link to="/games" className="px-3 py-1 bg-blue-600 text-white rounded">
          Exit
        </Link>
        <button
          onClick={togglePause}
          className="px-3 py-1 bg-yellow-600 text-white rounded"
        >
          {state.isPaused ? "Resume" : "Pause"}
        </button>
      </div>
      <h1 className="text-3xl font-bold mt-0 mb-0 sm:block hidden">Tetris</h1>

      {/* Primary content area – board + controls */}
      <section className="flex flex-col sm:flex-row sm:gap-2 sm:justify-center w-full max-w-4xl">
        {/* Game board – flex‑1 ensures it grows to fill available space */}
        <div className="flex justify-center">
          <GameBoard />
        </div>

        {/* Controls – full width on mobile, fixed width on desktop */}
        <div className="w-full sm:w-48 sm:flex-shrink-0">
          <Controls />
        </div>
      </section>

      {/* Game over overlay */}
      <GameOver />
    </>
  );
}

/**
 * Root component that provides the GameContext to the entire app.
 */
export default function Tetris() {
  return (
    <GameProvider>
      <main className="flex flex-col items-center min-h-96 p-4 sm:p-4 sm:gap-1">
        <GameContent />
      </main>
    </GameProvider>
  );
}
