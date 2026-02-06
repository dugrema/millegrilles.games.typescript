import { useEffect } from "react";
import styled from "styled-components";
import { useSnakeGame } from "../index";

interface ArenaProps {
  className?: string;
}

const ArenaContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  aspect-ratio: 1 / 1;
  background-color: #2e7d32;
  border: 4px solid #4caf50;
  border-radius: 8px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(20, 1fr);
  grid-template-rows: repeat(20, 1fr);
`;

const SnakeSegment = styled.div<{ $isHead: boolean }>`
  width: 100%;
  height: 100%;

  ${(props) =>
    props.$isHead &&
    `
    background-color: #76ff03;
    border-radius: 4px;
    box-shadow: 0 0 4px rgba(118, 255, 3, 0.3);
  `}
`;

const SnakeBody = styled.div`
  width: 100%;
  height: 100%;
  background-color: #38e179;
  border-radius: 4px;
`;

export default function Arena({ className }: ArenaProps) {
  const {
    arenaSize,
    snake,
    food,
    gameOver,
    gameWon,
    setDirection,
    togglePause,
    resetGame,
  } = useSnakeGame();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          setDirection({ x: 0, y: -1 });
          e.preventDefault();
          break;
        case "ArrowDown":
          setDirection({ x: 0, y: 1 });
          e.preventDefault();
          break;
        case "ArrowLeft":
          setDirection({ x: -1, y: 0 });
          e.preventDefault();
          break;
        case "ArrowRight":
          setDirection({ x: 1, y: 0 });
          e.preventDefault();
          break;
        case " ":
          togglePause();
          e.preventDefault();
          break;
        case "r":
        case "R":
          if (gameOver || gameWon) {
            resetGame();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [setDirection, togglePause, resetGame, gameOver, gameWon]);

  return (
    <>
      <ArenaContainer className={className}>
        {Array.from({ length: arenaSize * arenaSize }).map((_, index) => {
          const x = index % arenaSize;
          const y = Math.floor(index / arenaSize);

          const isSnakeHead = snake[0]?.x === x && snake[0]?.y === y;
          const isSnakeBody = snake
            .slice(1)
            .some((segment) => segment.x === x && segment.y === y);

          return (
            <div
              key={`${x}-${y}`}
              style={{
                gridRow: y + 1,
                gridColumn: x + 1,
              }}
            >
              {isSnakeHead ? (
                <SnakeSegment $isHead />
              ) : isSnakeBody ? (
                <SnakeBody />
              ) : null}
            </div>
          );
        })}
      </ArenaContainer>
    </>
  );
}
