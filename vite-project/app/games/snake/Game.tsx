import styled from "styled-components";
import Arena from "./components/Arena";
import Food from "./components/Food";
import GameTitle from "./components/GameTitle";
import GameOver from "./components/GameOver";
import ScoreButtonArea from "./components/ScoreButtonArea";
import MobileControls from "./components/MobileControls";
import { SnakeGameProvider } from "./index";

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
  return (
    <SnakeGameProvider>
      <GameContainer>
        <GameTitle />
        <GameArea>
          <Arena />
          <Food />
          <GameOver />
        </GameArea>
        <MobileControls />
        <ScoreButtonArea />
      </GameContainer>
    </SnakeGameProvider>
  );
}
