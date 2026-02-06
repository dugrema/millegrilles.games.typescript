import styled from "styled-components";
import { useSnakeGame } from "../index";

const TitleContainer = styled.div`
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  color: #ffffff;
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  z-index: 20;
  letter-spacing: 2px;
`;

const GameTitleDiv = styled.div`
  background: rgba(46, 125, 50, 0.9);
  padding: 8px 24px;
  border-radius: 8px;
  border: 2px solid #4caf50;
  backdrop-filter: blur(4px);
`;

export default function GameTitle() {
  const { status } = useSnakeGame();

  return (
    <TitleContainer>
      <GameTitleDiv>
        {status === "paused" ? "PAUSED" : "SNAKE GAME"}
      </GameTitleDiv>
    </TitleContainer>
  );
}
