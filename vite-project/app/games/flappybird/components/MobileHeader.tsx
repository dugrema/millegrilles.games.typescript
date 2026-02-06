import React from "react";
import { useNavigate } from "react-router";
import { useGameContext } from "../GameContext";

function MobileHeader() {
  const navigate = useNavigate();
  const {
    state: { status },
    pauseGame,
    resumeGame,
  } = useGameContext();

  const handleExit = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    navigate("/games");
  };

  const handlePause = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    pauseGame();
  };

  const handleResume = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    resumeGame();
  };

  return (
    <>
      <style>
        {`
          .mobile-header {
            display: none;
          }
          @media (max-width: 649px) {
            .mobile-header {
              display: flex;
              position: fixed;
              top: 8px;
              left: 50%;
              transform: translateX(-50%);
              gap: 12px;
              z-index: 101;
            }
            .mobile-header button {
              background: #4caf50;
              color: white;
              border: none;
              border-radius: 4px;
              padding: 6px 12px;
              font-size: 14px;
              cursor: pointer;
            }
          }
        `}
      </style>
      <div className="mobile-header">
        <button
          onClick={handleExit}
          onTouchStart={handleExit}
          aria-label="Exit to games list"
        >
          Exit
        </button>
        {status === "PLAYING" && (
          <button
            onClick={handlePause}
            onTouchStart={handlePause}
            aria-label="Pause game"
          >
            Pause
          </button>
        )}
        {status === "PAUSED" && (
          <button
            onClick={handleResume}
            onTouchStart={handleResume}
            aria-label="Resume game"
          >
            Resume
          </button>
        )}
      </div>
    </>
  );
}

export default MobileHeader;
