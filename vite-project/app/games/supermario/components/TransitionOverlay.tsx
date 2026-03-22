import React, { useEffect, useState } from "react";
import styled from "styled-components";

interface TransitionOverlayProps {
  isVisible: boolean;
  levelInfo: {
    world: number;
    level: number;
    nextWorld?: number;
    nextLevel?: number;
  };
}

const TransitionOverlayContainer = styled.div<{ $visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.95) 0%,
    rgba(30, 60, 100, 0.95) 50%,
    rgba(0, 0, 0, 0.95) 100%
  );
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;
  opacity: ${props => (props.$visible ? 1 : 0)};
  transition: opacity 0.3s ease-in-out;
  pointer-events: ${props => (props.$visible ? "auto" : "none")};
`;

const TransitionContent = styled.div<{ $visible: boolean }>`
  text-align: center;
  transform: ${props => (props.$visible ? "scale(1)" : "scale(0.8)")};
  transition: transform 0.3s ease-in-out;
`;

const TransitionTitle = styled.h1`
  font-size: 64px;
  font-weight: bold;
  color: #00ff00;
  text-shadow:
    4px 4px 0 #006600,
    -2px -2px 0 #00cc00,
    0 0 20px rgba(0, 255, 0, 0.5);
  margin-bottom: 20px;
  animation: pulse 1.5s ease-in-out infinite;

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }
`;

const TransitionSubtitle = styled.p`
  font-size: 24px;
  color: #ffffff;
  margin-bottom: 40px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
`;

const LevelInfoBox = styled.div`
  background: rgba(255, 215, 0, 0.15);
  border: 3px solid #ffd700;
  border-radius: 16px;
  padding: 30px 50px;
  margin-bottom: 40px;
  box-shadow:
    0 8px 32px rgba(255, 215, 0, 0.3),
    inset 0 2px 4px rgba(255, 255, 255, 0.2);
`;

const LevelInfoTitle = styled.span`
  font-size: 18px;
  color: #ffd700;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 15px;
  display: block;
`;

const LevelInfoValue = styled.span`
  font-size: 32px;
  font-weight: bold;
  color: #ffffff;
  font-family: "Press Start 2P", monospace;
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);
`;

const CountdownContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const CountdownText = styled.span`
  font-size: 20px;
  color: #ffd700;
  font-weight: bold;
`;

const CountdownNumber = styled.span<{ $countdown: number }>`
  font-size: 48px;
  font-weight: bold;
  color: #ff6b6b;
  font-family: "Press Start 2P", monospace;
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);
  animation: bounce 0.6s ease-in-out;

  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
`;

const ProgressContainer = styled.div`
  width: 300px;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
  margin-top: 30px;
`;

const ProgressBar = styled.div<{ $progress: number }>`
  height: 100%;
  background: linear-gradient(
    90deg,
    #00ff00 0%,
    #00cc00 50%,
    #00ff00 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1s linear infinite;
  width: ${props => props.$progress}%;
  border-radius: 4px;

  @keyframes shimmer {
    0% {
      background-position: 100% 0;
    }
    100% {
      background-position: -100% 0;
    }
  }
`;

const TransitionOverlay: React.FC<TransitionOverlayProps> = ({
  isVisible,
  levelInfo,
}) => {
  const [countdown, setCountdown] = useState(3);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setCountdown(3);
      setProgress(0);
      return;
    }

    const startTime = Date.now();
    const duration = 3000; // 3 second transition

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, Math.ceil((duration - elapsed) / 1000));
      setCountdown(remaining);
      setProgress((elapsed / duration) * 100);

      if (elapsed >= duration) {
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  const { world, level, nextWorld, nextLevel } = levelInfo;
  const nextLevelDisplay =
    nextWorld !== undefined && nextLevel !== undefined
      ? `World ${nextWorld}-${nextLevel}`
      : "Game Complete!";

  return (
    <TransitionOverlayContainer $visible={isVisible}>
      <TransitionContent $visible={isVisible}>
        <TransitionTitle>Level Complete!</TransitionTitle>
        <TransitionSubtitle>Preparing next stage...</TransitionSubtitle>

        <LevelInfoBox>
          <LevelInfoTitle>Current Level</LevelInfoTitle>
          <LevelInfoValue>
            World {world}-{level}
          </LevelInfoValue>
          <br />
          <LevelInfoTitle style={{ marginTop: "20px" }}>
            {nextLevelDisplay === "Game Complete!" ? "Congratulations!" : "Next Level"}
          </LevelInfoTitle>
          <LevelInfoValue>{nextLevelDisplay}</LevelInfoValue>
        </LevelInfoBox>

        <CountdownContainer>
          <CountdownText>Starting in:</CountdownText>
          <CountdownNumber $countdown={countdown}>{countdown}</CountdownNumber>
        </CountdownContainer>

        <ProgressContainer>
          <ProgressBar $progress={progress} />
        </ProgressContainer>
      </TransitionContent>
    </TransitionOverlayContainer>
  );
};

export default TransitionOverlay;
