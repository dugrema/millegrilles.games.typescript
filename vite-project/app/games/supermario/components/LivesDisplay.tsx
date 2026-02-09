import styled from "styled-components";
import { useSuperMario } from "../index";

const LivesContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  background: linear-gradient(to right, #000040, #000080);
  border-left: 2px solid #fff;
`;

const Heart = styled.span`
  font-size: 28px;
  margin-right: 8px;
  animation: pulse 1.5s ease-in-out infinite;
`;

const LivesDisplay = () => {
  const context = useSuperMario();
  if (!context)
    throw new Error("useSuperMario must be used within SuperMarioGameProvider");
  const { lives } = context;

  return (
    <LivesContainer>
      {[...Array(lives)].map((_, index) => (
        <Heart key={index}>❤️</Heart>
      ))}
      {Array.from({ length: Math.max(0, 3 - lives) }).map((_, index) => (
        <span
          key={`empty-${index}`}
          style={{ fontSize: "28px", opacity: "0.3" }}
        >
          💔
        </span>
      ))}
    </LivesContainer>
  );
};

export default LivesDisplay;
