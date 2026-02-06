import styled from "styled-components";
import { useMinesweeper } from "./index";
import Header from "./components/Header";
import GameBoard from "./components/GameBoard";
import GameOverlay from "./components/GameOverlay";

const GameContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 16px;
  min-height: 100vh;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
`;

const Title = styled.h1`
  text-align: center;
  font-size: 48px;
  font-weight: bold;
  color: white;
  margin-bottom: 32px;
  text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.2);
  animation: slideDown 0.5s ease-out;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ControlsHelp = styled.div`
  text-align: center;
  color: white;
  opacity: 0.9;
  margin-top: 12px;
  font-size: 14px;

  @media (max-width: 600px) {
    font-size: 12px;
  }
`;

const KeyHint = styled.code`
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: "Courier New", monospace;
`;

export default function Game() {
  const { state, restartGame } = useMinesweeper();
  const { gameStatus, timer, mineCount, difficulty } = state;

  const getDifficultyStats = () => {
    return `(${difficulty})`;
  };

  const formatTimer = (seconds: number) => {
    return seconds.toString().padStart(3, "0");
  };

  const formatMines = () => {
    return mineCount === -1 ? "999" : mineCount;
  };

  return (
    <GameContainer>
      <Title>💣 Minesweeper</Title>

      <Header />

      <GameBoard />

      <GameOverlay />

      <ControlsHelp>
        <div>
          <span>Controls:</span> <KeyHint>Left Click</KeyHint> reveal •
          <KeyHint>Right Click</KeyHint> flag •<KeyHint>R</KeyHint> restart •
          <KeyHint>Esc</KeyHint> pause
        </div>
        <div style={{ marginTop: "8px" }}>
          <span>Mobile:</span> <KeyHint>Tap</KeyHint> reveal •
          <KeyHint>Long Press</KeyHint> flag
        </div>
      </ControlsHelp>
    </GameContainer>
  );
}

export function meta() {
  return [
    { title: "Minesweeper – Quick Match" },
    { name: "description", content: "Play Minesweeper in the browser" },
  ];
}
