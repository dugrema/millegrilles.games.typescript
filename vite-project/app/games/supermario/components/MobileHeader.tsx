import React from "react";
import styled from "styled-components";
import { useGameContext } from "../GameContext";

const HeaderContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 40px;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const Button = styled.button`
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
  min-width: 96px;
  text-align: center;

  &:hover {
    background: #45a049;
  }

  &:active {
    background: #3d8b40;
  }
`;

const Title = styled.span`
  color: white;
  font-size: 18px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const MobileHeader: React.FC = () => {
  const { state, pauseGame } = useGameContext();

  const handlePause = () => {
    pauseGame();
  };

  const handleExit = () => {
    // Navigate back to the games list
    window.history.back();
  };

  return (
    <HeaderContainer>
      <Button onClick={handleExit}>Exit</Button>
      <Title>Super Mario</Title>
      <Button onClick={handlePause}>
        {state.status === "PAUSED" ? "Resume" : "Pause"}
      </Button>
    </HeaderContainer>
  );
};

export default MobileHeader;
