import styled from "styled-components";
import { MinesweeperGameProvider } from "../../games/minesweeper";
import MinesweeperGame from "../../games/minesweeper/Game";

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
`;

const GameWrapper = styled.div`
  width: 100%;
  max-width: 800px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

export function meta() {
  return [
    { title: "Minesweeper – Quick Match" },
    {
      name: "description",
      content:
        "Play Minesweeper in your browser. Test your logic and speed with this classic puzzle game.",
    },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
  ];
}

export default function Minesweeper() {
  return (
    <PageContainer>
      <GameWrapper>
        <MinesweeperGameProvider>
          <MinesweeperGame />
        </MinesweeperGameProvider>
      </GameWrapper>
    </PageContainer>
  );
}
