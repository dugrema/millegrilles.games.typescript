import { useEffect } from "react";
import styled from "styled-components";
import { useMinesweeper } from "../index";
import type { Difficulty } from "../types";

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 16px 24px;
  background-color: #1a1a2e;
  border-bottom: 3px solid #16213e;
  margin-bottom: 16px;
  border-radius: 8px 8px 0 0;

  @media (max-width: 600px) {
    flex-wrap: wrap;
    gap: 10px;
    justify-content: space-between;
  }
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Label = styled.span`
  font-size: 12px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 4px;
`;

const Value = styled.span`
  font-size: 24px;
  font-weight: bold;
  font-family: monospace;
  color: #fff;
`;

const MineCounterValue = styled(Value)<{ $mineCount: number }>`
  color: ${(props) => (props.$mineCount <= 10 ? "#ff6b6b" : "#4ecdc4")};
`;

const TimerValue = styled(Value)`
  color: #ffe66d;
`;

const DifficultySelector = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DifficultyLabel = styled.span`
  font-size: 14px;
  color: #aaa;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const DifficultyBtn = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #444;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    opacity: 0.6;
  }

  @media (max-width: 600px) {
    padding: 6px 12px;
    font-size: 12px;
  }
`;

const GameStatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatusDot = styled.div<{ $active: boolean; $status: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${(props) =>
    props.$active
      ? props.$status === "playing"
        ? "#4ade80"
        : props.$status === "won"
          ? "#22c55e"
          : props.$status === "gameover"
            ? "#ef4444"
            : props.$status === "paused"
              ? "#eab308"
              : "#666"
      : "#666"};
  animation: ${(props) =>
    props.$active && props.$status === "playing"
      ? "pulse 1s infinite"
      : "none"};
  box-shadow: 0 0 8px currentColor;

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

const StatusLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
`;

export default function Header() {
  const { state, startGame, restartGame, togglePause, toggleDifficulty } =
    useMinesweeper();

  const { mineCount, timer, gameStatus, difficulty, highScores, isPaused } =
    state;

  // difficulty values aligned with state format
  const difficulties: Difficulty[] = ["easy", "medium", "hard"];
  const currentIndex = difficulties.indexOf(difficulty);

  const getDifficultyDisplay = (diff: Difficulty) => {
    if (!diff) return diff;
    const capitalized = diff.charAt(0).toUpperCase() + diff.slice(1);
    return `${capitalized} (${difficulty} - ${highScores[diff]} pts)`;
  };

  const handleToggleDifficulty = () => {
    if (gameStatus === "playing" || gameStatus === "won") {
      toggleDifficulty();
    }
  };

  // Global keyboard event listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Enter":
          toggleDifficulty();
          break;
        case "r":
        case "R":
          restartGame();
          break;
        case "Escape":
          if (gameStatus === "playing" || gameStatus === "paused") {
            togglePause();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [toggleDifficulty, restartGame, togglePause, gameStatus]);

  return (
    <HeaderContainer>
      {/* Mine Counter */}
      <InfoContainer>
        <Label>Mines</Label>
        <MineCounterValue $mineCount={mineCount}>
          {mineCount === -1 ? "999" : mineCount}
        </MineCounterValue>
      </InfoContainer>

      {/* Game Status */}
      <GameStatusIndicator>
        <StatusDot
          $active={
            gameStatus === "playing" ||
            gameStatus === "gameover" ||
            gameStatus === "won" ||
            isPaused
          }
          $status={isPaused ? "paused" : gameStatus}
        />
        <StatusLabel>
          {isPaused
            ? "Paused"
            : gameStatus === "playing"
              ? "Playing"
              : gameStatus === "paused"
                ? "Paused"
                : gameStatus}
        </StatusLabel>
      </GameStatusIndicator>

      {/* Timer */}
      <InfoContainer>
        <Label>Time</Label>
        <TimerValue>{timer.toString().padStart(3, "0")}</TimerValue>
      </InfoContainer>

      {/* Difficulty Selector */}
      <DifficultySelector>
        <DifficultyLabel>Difficulty:</DifficultyLabel>
        <DifficultyBtn
          onClick={toggleDifficulty}
          value={difficulty}
          role="button"
          tabIndex={0}
        >
          {getDifficultyDisplay(difficulties[currentIndex])}
        </DifficultyBtn>
      </DifficultySelector>
    </HeaderContainer>
  );
}
