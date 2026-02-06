// Route component with page styling
import styled from "styled-components";
import { SuperMarioGameProvider } from "../../games/supermario";
import SuperMarioGame from "../../games/supermario/Game";

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
  max-width: 832px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

export function meta() {
  return [
    {
      title: "Super Mario – Arcade Style Game"
    },
    {
      name: "description",
      content:
        "Play Super Mario clone in your browser. Classic platformer action with smooth gameplay."
    },
    { name: "viewport", content: "width=device-width, initial-scale=1" }
  ];
}

export default function SuperMario() {
  return (
    <PageContainer>
      <GameWrapper>
        <SuperMarioGameProvider>
          <SuperMarioGame />
        </SuperMarioGameProvider>
      </GameWrapper>
    </PageContainer>
  );
}
