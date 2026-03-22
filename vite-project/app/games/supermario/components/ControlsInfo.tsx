import React, { useState, useEffect } from "react";
import styled from "styled-components";

const OverlayContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ControlsBox = styled.div`
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 24px 32px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 2;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  max-width: 400px;
  width: 90%;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const SectionTitle = styled.div`
  font-weight: bold;
  color: #4caf50;
  margin-bottom: 16px;
  font-size: 18px;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-align: center;
`;

const Key = styled.kbd`
  background: #444;
  border: 1px solid #666;
  border-radius: 4px;
  padding: 2px 8px;
  font-family: monospace;
  font-size: 13px;
  color: #fff;
  margin: 0 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const CloseHint = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
  color: #888;
  font-size: 12px;
`;

const ControlsInfo: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "h") {
        setIsVisible((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  if (!isVisible) return null;

  return (
    <OverlayContainer onClick={() => setIsVisible(false)}>
      <ControlsBox onClick={(e) => e.stopPropagation()}>
        <SectionTitle>Controls</SectionTitle>
        <div>
          <strong>Move:</strong> <Key>←</Key> <Key>→</Key> or <Key>A</Key>{" "}
          <Key>D</Key>
        </div>
        <div>
          <strong>Run:</strong> <Key>Shift</Key> + <Key>←</Key> <Key>→</Key>
        </div>
        <div>
          <strong>Jump:</strong> <Key>Space</Key> or <Key>↑</Key> or{" "}
          <Key>W</Key>
        </div>
        <div>
          <strong>Pause:</strong> <Key>P</Key> or <Key>Esc</Key>
        </div>
        <div>
          <strong>Start/Restart:</strong> <Key>Enter</Key> or <Key>↑</Key>
        </div>
        <CloseHint>
          Press <Key>H</Key> to close
        </CloseHint>
      </ControlsBox>
    </OverlayContainer>
  );
};

export default ControlsInfo;
