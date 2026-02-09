import styled from "styled-components";
import { useMinesweeper } from "../index";
import { FLAG_EMOJI, MINE_EMOJI, DIFFICULTIES } from "../constants";

export default function Cell({
  x,
  y,
  "data-x": dataX,
  "data-y": dataY,
  onTouchEnd,
}: {
  x: number;
  y: number;
  "data-x": number;
  "data-y": number;
  onTouchEnd?: (e: React.TouchEvent) => void;
}) {
  const { grid, revealCell, flagCell, gameStatus } = useMinesweeper();
  const cell = grid[y]?.[x];

  const handleClick = () => revealCell(x, y);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    flagCell(x, y);
  };

  const isRevealed = cell?.revealed;
  const isFlagged = cell?.flagged;
  const isMine = cell?.mine;
  const number = cell?.value || 0;

  const getNumberColor = (num: number): string => {
    const { colors } = DIFFICULTIES.easy;
    return colors.numbers[num as keyof typeof colors.numbers] || "#9e9e9e";
  };

  if (isRevealed) {
    if (isMine) {
      return (
        <RevealedCell>
          <MineIcon />
        </RevealedCell>
      );
    }
    return (
      <RevealedCell>
        <NumberDisplay $color={getNumberColor(number)}>{number}</NumberDisplay>
      </RevealedCell>
    );
  }

  if (isFlagged) {
    return (
      <FlaggedCell onContextMenu={handleContextMenu}>
        <FlagIcon>{FLAG_EMOJI}</FlagIcon>
      </FlaggedCell>
    );
  }

  return (
    <TouchableHiddenCell
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      data-x={dataX}
      data-y={dataY}
      onTouchEnd={onTouchEnd}
    />
  );
}

const TouchableHiddenCell = styled.div<{
  "data-x": number;
  "data-y": number;
  onTouchEnd?: (e: React.TouchEvent) => void;
  onClick?: (e: React.MouseEvent) => void;
  onContextMenu?: (e: React.MouseEvent) => void;
}>`
  width: 100%;
  height: 100%;
  background-color: #b0b0b0;
  border: 2px solid #a0a0a0;
  border-radius: 4px;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    background-color: #c0c0c0;
    border-color: #b0b0b0;
  }

  &[data-x],
  &[data-y] {
    @media (pointer: coarse) {
      -webkit-tap-highlight-color: transparent;
    }
  }
`;

const RevealedCell = styled.div`
  width: 100%;
  height: 100%;
  background-color: #d0d0d0;
  border: 2px solid #c0c0c0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;

const NumberDisplay = styled.span<{ $color: string }>`
  color: ${(props) => props.$color};
  font-size: 18px;
`;

const MineIcon = styled.span`
  width: 20px;
  height: 20px;
  background-color: #333;
  border-radius: 50%;
  position: relative;

  &::after {
    content: "";
    width: 10px;
    height: 10px;
    background-color: #333;
    border-radius: 50%;
    position: absolute;
    top: 5px;
    left: 5px;
  }
`;

const FlaggedCell = styled.div`
  width: 100%;
  height: 100%;
  background-color: #d0d0d0;
  border: 2px solid #c0c0c0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`;

const FlagIcon = styled.span`
  color: #d32f2f;
`;
