import styled from "styled-components";
import { useMinesweeper } from "../index";
import Cell from "./Cell";

const GameBoardContainer = styled.div`
  display: grid;
  gap: 2px;
  padding: 16px;
  background-color: #2a2a2a;
  border: 4px solid #4a4a4a;
  border-radius: 8px;
  max-width: 600px;
  width: 100%;
  aspect-ratio: 1 / 1;
  margin: 0 auto;
  touch-action: manipulation;
  user-select: none;
  -webkit-user-select: none;
`;

const BoardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const HintText = styled.p`
  color: #888;
  font-size: 14px;
  margin: 16px 0 24px 0;
  text-align: center;
  animation: fadeIn 0.5s ease-in;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export default function GameBoard() {
  const { grid, gameStatus, revealedCells, revealCell, flagCell } =
    useMinesweeper();

  if (!grid || grid.length === 0) {
    return (
      <BoardWrapper>
        <HintText>Press Enter to start the game</HintText>
      </BoardWrapper>
    );
  }

  const rows = grid.length;
  const cols = grid[0]?.length || 0;

  // Handle touch events for mobile
  const handleTouchEnd = (e: React.TouchEvent) => {
    // Simply reveal the cell on tap (no flagging for now due to complexity)
    const touch = e.changedTouches[0];
    const target = document.elementFromPoint(
      touch.clientX,
      touch.clientY,
    ) as HTMLElement;

    if (
      target &&
      target.dataset.x !== undefined &&
      target.dataset.y !== undefined
    ) {
      const x = parseInt(target.dataset.x);
      const y = parseInt(target.dataset.y);
      revealCell(x, y);
    }
  };

  return (
    <BoardWrapper>
      <GameBoardContainer
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
      >
        {grid.map((row, y) =>
          row.map((cell, x) => (
            <Cell
              key={`${x}-${y}`}
              x={x}
              y={y}
              data-x={x}
              data-y={y}
              onTouchEnd={handleTouchEnd}
            />
          )),
        )}
      </GameBoardContainer>
    </BoardWrapper>
  );
}
