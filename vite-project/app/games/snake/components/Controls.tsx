import styled from "styled-components";
import { useSnakeGame } from "../index";

const ControlsContainer = styled.div`
  margin-top: 16px;
  padding: 12px;
  background-color: rgba(46, 125, 50, 0.1);
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
`;

const ControlsTitle = styled.div`
  font-weight: bold;
  color: #4caf50;
  margin-bottom: 8px;
  font-size: 16px;
`;

const ControlRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 4px;
`;

const ControlKey = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 28px;
  background-color: #1b5e4e;
  color: white;
  border-radius: 4px;
  padding: 0 8px;
  font-family: monospace;
  font-size: 12px;
  border: 1px solid #2e7d32;
`;

const ControlText = styled.span`
  color: white;
  font-size: 14px;
`;

export default function Controls() {
  return (
    <ControlsContainer>
      <ControlsTitle>Controls</ControlsTitle>
      <ControlRow>
        <ControlKey>↑</ControlKey>
        <ControlKey>↓</ControlKey>
        <ControlKey>←</ControlKey>
        <ControlKey>→</ControlKey>
      </ControlRow>
      <ControlText>Move snake</ControlText>

      <ControlRow>
        <ControlKey>Space</ControlKey>
      </ControlRow>
      <ControlText>Pause/Resume</ControlText>

      <ControlRow>
        <ControlKey>R</ControlKey>
      </ControlRow>
      <ControlText>Restart game</ControlText>
    </ControlsContainer>
  );
}
