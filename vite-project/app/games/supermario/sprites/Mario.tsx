import React from "react";

/**
 * Encapsulated Mario sprite component that handles all animation frames internally.
 *
 * @param frame - Current frame index, handled internally for cycling
 * @param action - Current action type: "walking", "jumping", "idle", "dead"
 * @param x - Horizontal position (px)
 * @param y - Vertical position (px)
 */
export default function Mario({
  frame,
  action = "idle",
  x,
  y,
}: {
  frame: number;
  action?: "walking" | "jumping" | "idle" | "dead";
  x: number;
  y: number;
}) {
  // Internal frame definitions for each action type
  const frameDefinitions = {
    walking: [0, 1, 2], // Frame indices for walking animation
    jumping: [3, 2, 3, 4], // Frame indices for jump cycle
    idle: [0], // Frame indices for idle
    dead: [5], // Frame indices for death
  };

  // Get the frames for the current action
  const actionFrames = frameDefinitions[action] || frameDefinitions.idle;

  // Determine the current actual frame based on action and input frame
  const currentFrameIndex = actionFrames[frame % actionFrames.length];

  // Define all frame symbols (reusable components)
  const Frame0 = () => (
    <symbol id="mario-0">
      <rect x="176" y="256" width="160" height="256" fill="#1e90ff" />
      <rect x="192" y="320" width="128" height="80" fill="#fff" />
      <rect x="224" y="352" width="64" height="144" fill="#ff0000" />
    </symbol>
  );

  const Frame1 = () => (
    <symbol id="mario-1">
      <rect x="176" y="256" width="160" height="256" fill="#1e90ff" />
      <rect x="192" y="320" width="128" height="80" fill="#fff" />
      <rect x="224" y="352" width="64" height="144" fill="#ff0000" />
      <rect x="208" y="384" width="16" height="64" fill="#000" />
    </symbol>
  );

  const Frame2 = () => (
    <symbol id="mario-2">
      <rect x="176" y="256" width="160" height="256" fill="#1e90ff" />
      <rect x="192" y="320" width="128" height="80" fill="#fff" />
      <rect x="224" y="352" width="64" height="144" fill="#ff0000" />
      <rect x="304" y="384" width="16" height="64" fill="#000" />
    </symbol>
  );

  const Frame3 = () => (
    <symbol id="mario-3">
      <rect x="176" y="208" width="160" height="304" fill="#1e90ff" />
      <rect x="192" y="272" width="128" height="80" fill="#fff" />
      <rect x="224" y="304" width="64" height="144" fill="#ff0000" />
      <polygon points="256,256 240,240 272,240" fill="#ff0" />
    </symbol>
  );

  const Frame4 = () => (
    <symbol id="mario-4">
      <rect x="176" y="256" width="160" height="256" fill="#1e90ff" />
      <rect x="192" y="320" width="128" height="80" fill="#fff" />
      <rect x="224" y="352" width="64" height="144" fill="#ff0000" />
      <rect x="200" y="384" width="24" height="8" fill="#000" />
    </symbol>
  );

  const Frame5 = () => (
    <symbol id="mario-5">
      <rect x="176" y="256" width="160" height="256" fill="#888" />
      <rect x="192" y="320" width="128" height="80" fill="#444" />
      <rect x="224" y="352" width="64" height="144" fill="#222" />
      <path d="M 200 256 l 40 80" stroke="#000" stroke-width="8" />
      <path d="M 240 256 l -40 80" stroke="#000" stroke-width="8" />
    </symbol>
  );

  // Render all symbols and the current frame
  return (
    <svg
      width={64}
      height={64}
      style={{
        position: "absolute",
        left: x,
        top: y,
        pointerEvents: "none",
        imageRendering: "pixelated" as const,
      }}
      viewBox="0 0 512 512"
      preserveAspectRatio="xMidYMid slice"
    >
      <Frame0 />
      <Frame1 />
      <Frame2 />
      <Frame3 />
      <Frame4 />
      <Frame5 />
      <use href={`#mario-${currentFrameIndex}`} />
    </svg>
  );
}
