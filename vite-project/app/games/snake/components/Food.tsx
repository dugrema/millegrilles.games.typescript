import styled from "styled-components";
import { useSnakeGame } from "../index";

const FoodContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const FoodItem = styled.div<{ $visible: boolean }>`
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: #ff0000;
  border-radius: 50%;
  transform: translate(-50%, -50%);

  ${(props) =>
    props.$visible &&
    `
    animation: pulse 0.5s ease-in-out infinite;
  `}

  ${(props) =>
    !props.$visible &&
    `
    opacity: 0;
    animation: none;
  `}
`;

const pulseAnimation = `
  @keyframes pulse {
    0%, 100% {
      transform: translate(-50%, -50%) scale(1);
      box-shadow: 0 0 8px rgba(255, 0, 0, 0.5);
    }
    50% {
      transform: translate(-50%, -50%) scale(1.2);
      box-shadow: 0 0 16px rgba(255, 0, 0, 0.8);
    }
  }
`;

export default function Food({ className }: { className?: string }) {
  const { arenaSize, food, gameOver, gameWon } = useSnakeGame();

  if (!food) {
    return (
      <>
        <style>{pulseAnimation}</style>
        <FoodContainer className={className} />
      </>
    );
  }

  // Center the food inside the cell: add 0.5 to each coordinate
  const leftPercent = ((food.x + 0.5) / arenaSize) * 100;
  const topPercent = ((food.y + 0.5) / arenaSize) * 100;

  const style = {
    left: `${leftPercent}%`,
    top: `${topPercent}%`,
  };

  return (
    <>
      <style>{pulseAnimation}</style>
      <FoodContainer className={className}>
        <FoodItem $visible={!gameOver && !gameWon} style={style} />
      </FoodContainer>
    </>
  );
}
