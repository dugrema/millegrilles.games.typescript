// UI Overlay component for Super Mario game HUD
// Displays score, lives, level, and time information

import styled from "styled-components";
import type { UIOverlayProps } from "../types";

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px;
  box-sizing: border-box;
  z-index: 10;
`;

const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 16px;
`;

const ScoreDisplay = styled.div`
  font-size: clamp(24px, 4vw, 48px);
  font-weight: bold;
  color: #ffd700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  background: rgba(0, 0, 0, 0.3);
  padding: 8px 16px;
  border-radius: 8px;
`;

const LivesContainer = styled.div`
  font-size: clamp(20px, 3.5vw, 40px);
  font-weight: bold;
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  background: rgba(0, 0, 0, 0.3);
  padding: 8px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LevelDisplay = styled.div`
  font-size: clamp(24px, 4vw, 48px);
  font-weight: bold;
  color: #ffa500;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  background: rgba(0, 0, 0, 0.3);
  padding: 8px 16px;
  border-radius: 8px;
`;

const TimeDisplay = styled.div<{ isLowTime: boolean }>`
  font-size: clamp(24px, 4vw, 48px);
  font-weight: bold;
  color: ${(props) => (props.isLowTime ? "#ff4444" : "#4cd964")};
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  background: rgba(0, 0, 0, 0.3);
  padding: 8px 16px;
  border-radius: 8px;
  transition: color 0.3s ease;
`;

const Icon = styled.span`
  font-size: 0.8em;
`;

export function UIOverlay({
  score,
  highScore,
  lives,
  level,
  time,
  cameraPosition,
}: UIOverlayProps) {
  const isLowTime = time <= 30;
  const scoreWithHighScore = Math.max(score, highScore);

  return (
    <Container>
      <LeftPanel>
        <ScoreDisplay>
          <div>Score: {score.toLocaleString()}</div>
          <div style={{ fontSize: "0.5em", color: "#ccc" }}>
            Best: {scoreWithHighScore.toLocaleString()}
          </div>
        </ScoreDisplay>

        <LivesContainer>
          <Icon>🍄</Icon>
          <span> Lives: {lives}</span>
        </LivesContainer>
      </LeftPanel>

      <RightPanel>
        <LevelDisplay>
          <div>Level: {level}</div>
          <div style={{ fontSize: "0.5em", color: "#ccc" }}>
            Camera: ({cameraPosition?.x?.toFixed(0) || 0},{" "}
            {cameraPosition?.y?.toFixed(0) || 0})
          </div>
        </LevelDisplay>

        <TimeDisplay isLowTime={isLowTime}>
          <div>Time: {time}s</div>
          <div
            style={{
              fontSize: "0.5em",
              color: isLowTime ? "#ffcccc" : "#ccffcc",
            }}
          >
            {isLowTime ? "⏰ Low Time!" : "Good!"}
          </div>
        </TimeDisplay>
      </RightPanel>
    </Container>
  );
}
