import { useEffect, useCallback } from "react";
import styled from "styled-components";
import Arena from "./Arena";
import Score from "./Score";
import GameTitle from "./GameTitle";
import Food from "./Food";
import GameOver from "./GameOver";
import ControlInstructions from "./Controls";
import SnakeGameProvider, { useSnakeGame } from "../index";

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  min-height: 100vh;
  padding: 16px;
  background: linear-gradient(180deg, #1b5e4e 0%, #2e7d32 100%);
`;

const GameArea = styled.div`
  position: relative;
  max-width: 400px;
  width: 100%;
`;

export default function Game() {
  const { gameOver, score, gameWon, resetGame, setDirection, togglePause } =
    useSnakeGame();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const { key } = event;

      if (gameOver) {
        if (key === "r" || key === "R") {
          resetGame();
        }
        return;
      }

      switch (key) {
        case "ArrowUp":
          event.preventDefault();
          setDirection({ x: 0, y: -1 });
          break;
        case "ArrowDown":
          event.preventDefault();
          setDirection({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
          event.preventDefault();
          setDirection({ x: -1, y: 0 });
          break;
        case "ArrowRight":
          event.preventDefault();
          setDirection({ x: 1, y: 0 });
          break;
        case " ":
          event.preventDefault();
          togglePause();
          break;
        case "r":
        case "R":
          event.preventDefault();
          resetGame();
          break;
      }
    },
    [gameOver, gameWon, resetGame, setDirection, togglePause],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <GameContainer>
      <GameTitle />
      <GameArea>
        <Arena />
        <Score />
        <Food />
        <GameOver />
      </GameArea>
      <ControlInstructions />
    </GameContainer>
  );
}
