import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { type InputState } from "../types";
import { TOUCH_CONTROLS } from "../constants";

// Button styling
const ControlButton = styled.button<{ $active?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  margin: 5px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.6);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 24px;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  transition: all 0.1s ease;

  &:active {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(0.95);
  }

  ${(props) =>
    props.$active &&
    `
    background: rgba(255, 255, 255, 0.4);
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.6);
  `}
`;

const DPad = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  display: grid;
  grid-template-columns: repeat(3, 60px);
  grid-template-rows: repeat(2, 60px);
  gap: 0;
`;

const ActionButtons = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

const BigButton = styled(ControlButton)<{ $primary?: boolean }>`
  width: 80px;
  height: 80px;
  font-size: 32px;
  border-color: ${(props) =>
    props.$primary ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.6)"};

  &:active {
    background: ${(props) =>
      props.$primary ? "rgba(255, 100, 100, 0.4)" : "rgba(255, 255, 255, 0.3)"};
  }
`;

const SmallButton = styled(ControlButton)`
  width: 50px;
  height: 50px;
  font-size: 20px;
`;

const PauseButton = styled(ControlButton)`
  position: fixed;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  font-size: 16px;
  z-index: 1000;
`;

// Control button positions in D-Pad
const DPadLayout = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  display: grid;
  grid-template-columns: repeat(3, 60px);
  grid-template-rows: repeat(2, 60px);
  gap: 0;
`;

interface TouchControlsProps {
  onInput: (action: keyof InputState, pressed: boolean) => void;
  hideOnDesktop?: boolean;
}

export function TouchControls({
  onInput,
  hideOnDesktop = true,
}: TouchControlsProps) {
  const [pressedButtons, setPressedButtons] = useState<Set<keyof InputState>>(
    new Set(),
  );

  // Prevent scrolling on touch
  useEffect(() => {
    const handleTouch = (e: TouchEvent) => {
      if (hideOnDesktop) {
        e.preventDefault();
      }
    };

    if (hideOnDesktop) {
      window.addEventListener("touchstart", handleTouch, { passive: false });
      window.addEventListener("touchmove", handleTouch, { passive: false });
      window.addEventListener("touchend", handleTouch, { passive: false });
    }

    return () => {
      if (hideOnDesktop) {
        window.removeEventListener("touchstart", handleTouch);
        window.removeEventListener("touchmove", handleTouch);
        window.removeEventListener("touchend", handleTouch);
      }
    };
  }, [hideOnDesktop]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent, action: keyof InputState) => {
      e.preventDefault();
      if (!pressedButtons.has(action)) {
        const newPressed = new Set(pressedButtons);
        newPressed.add(action);
        setPressedButtons(newPressed);
        onInput(action, true);
      }
    },
    [pressedButtons, onInput],
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent, action: keyof InputState) => {
      e.preventDefault();
      const newPressed = new Set(pressedButtons);
      newPressed.delete(action);
      setPressedButtons(newPressed);
      onInput(action, false);
    },
    [pressedButtons, onInput],
  );

  return (
    <>
      {hideOnDesktop && (
        <DPadLayout>
          {[
            ["Up", "up"],
            ["Left", "left"],
            ["Down", "down"],
            ["Right", "right"],
          ].map(([label, action]) => {
            return (
              <ControlButton
                key={action}
                $active={pressedButtons.has(action as keyof InputState)}
                onTouchStart={(e) =>
                  handleTouchStart(e, action as keyof InputState)
                }
                onTouchEnd={(e) =>
                  handleTouchEnd(e, action as keyof InputState)
                }
                aria-label={label}
              >
                {label === "Up" && "↑"}
                {label === "Down" && "↓"}
                {label === "Left" && "←"}
                {label === "Right" && "→"}
              </ControlButton>
            );
          })}
        </DPadLayout>
      )}

      {hideOnDesktop && (
        <ActionButtons>
          <BigButton
            id={TOUCH_CONTROLS.JUMP}
            $primary
            $active={pressedButtons.has("jump")}
            onTouchStart={(e) => handleTouchStart(e, "jump")}
            onTouchEnd={(e) => handleTouchEnd(e, "jump")}
            aria-label="Jump"
          >
            A
          </BigButton>

          <SmallButton
            id={TOUCH_CONTROLS.RUN}
            $active={pressedButtons.has("run")}
            onTouchStart={(e) => handleTouchStart(e, "run")}
            onTouchEnd={(e) => handleTouchEnd(e, "run")}
            aria-label="Run"
          >
            B
          </SmallButton>
        </ActionButtons>
      )}
    </>
  );
}

export function MobilePauseButton({ onPress }: { onPress: () => void }) {
  const [isPressed, setIsPressed] = useState(false);

  const handlePressStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      setIsPressed(true);
      onPress();
    },
    [onPress],
  );

  const handlePressEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    setIsPressed(false);
  }, []);

  return (
    <PauseButton
      id={TOUCH_CONTROLS.PAUSE}
      $active={isPressed}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      aria-label="Pause"
    >
      {isPressed ? "▶" : "⏸"}
    </PauseButton>
  );
}
