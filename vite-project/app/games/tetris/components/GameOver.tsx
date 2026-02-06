import { useContext } from "react";
import { GameContext } from "../GameContext";

export function GameOver() {
  const { state, dispatch } = useContext(GameContext);

  if (!state.gameOver) return null;

  const restart = () => {
    dispatch({ type: "RESET" });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
      <div className="bg-gray-800 p-6 rounded-lg text-center max-w-xs w-full">
        <h2 className="text-3xl font-bold mb-4 text-white">Game Over</h2>
        <p className="text-white mb-2">Score: {state.score}</p>
        <p className="text-white mb-4">High Score: {state.highScore}</p>
        <button
          onClick={restart}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
        >
          Restart
        </button>
      </div>
    </div>
  );
}

export default GameOver;
