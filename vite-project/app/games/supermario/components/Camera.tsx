// Camera component with smooth following and level boundaries
import { createContext, useContext, useState, useCallback } from "react";
import type { CameraState } from "../types";

// Smoothly interpolate between current and target values
const lerp = (start: number, end: number, factor: number): number => {
  return start + (end - start) * factor;
};

// Create camera context
const CameraContext = createContext<{
  camera: CameraState;
  setCamera: React.Dispatch<React.SetStateAction<CameraState>>;
  getCameraPosition: () => { x: number; y: number };
  updateCamera: (
    currentCameraX: number,
    currentCameraY: number,
    targetX: number,
    targetY: number,
  ) => void;
  clampCamera: (cameraX: number, cameraY: number) => { x: number; y: number };
  getClampedCamera: () => { x: number; y: number };
  isInView: (
    objectX: number,
    objectY: number,
    width: number,
    height: number,
  ) => boolean;
  getViewport: () => {
    left: number;
    top: number;
    width: number;
    height: number;
  };
  ensurePlayerVisible: (playerX: number, playerY: number) => void;
} | null>(null);

interface CameraProviderProps {
  children: React.ReactNode;
  canvasWidth?: number;
  canvasHeight?: number;
  levelWidth?: number;
  levelHeight?: number;
  padding?: number;
}

/**
 * Apply camera position to transform context
 */
export const CameraProvider: React.FC<CameraProviderProps> = ({
  children,
  canvasWidth = 800,
  canvasHeight = 480,
  levelWidth = 3200,
  levelHeight = 480,
  padding = 64,
}) => {
  const [camera, setCamera] = useState<CameraState>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  const getCameraPosition = useCallback(() => {
    return { x: camera.x, y: camera.y };
  }, [camera.x, camera.y]);

  const updateCamera = useCallback(
    (
      currentCameraX: number,
      currentCameraY: number,
      targetX: number,
      targetY: number,
    ) => {
      // Calculate new camera position with smoothing
      const newCameraX = lerp(currentCameraX, targetX, 0.1);
      const newCameraY = lerp(currentCameraY, targetY, 0.1);
      setCamera({
        x: newCameraX,
        y: newCameraY,
        targetX,
        targetY,
      });
    },
    [],
  );

  const clampCamera = useCallback(
    (cameraX: number, cameraY: number) => {
      const levelWidth = 3200;
      const levelHeight = 480;
      const newX = Math.max(0, Math.min(cameraX, levelWidth - canvasWidth));
      const newY = Math.max(0, Math.min(cameraY, levelHeight - canvasHeight));
      return { x: newX, y: newY };
    },
    [canvasWidth, canvasHeight],
  );

  const getClampedCamera = useCallback(() => {
    const { x, y } = camera;
    const levelWidth = 3200;
    const levelHeight = 480;
    return {
      x: Math.max(0, Math.min(x, levelWidth - canvasWidth)),
      y: Math.max(0, Math.min(y, levelHeight - canvasHeight)),
    };
  }, [camera.x, camera.y, canvasWidth, canvasHeight]);

  const getViewport = useCallback(() => {
    return {
      left: camera.x,
      top: camera.y,
      width: canvasWidth,
      height: canvasHeight,
    };
  }, [camera.x, camera.y, canvasWidth, canvasHeight]);

  const isInView = useCallback(
    (
      objectX: number,
      objectY: number,
      width: number = 32,
      height: number = 32,
    ) => {
      const viewport = getViewport();
      const padding = 64;
      const left = viewport.left;
      const right = viewport.left + viewport.width;
      const top = viewport.top;
      const bottom = viewport.top + viewport.height;

      return (
        objectX + width + padding >= left &&
        objectX - padding <= right &&
        objectY + height + padding >= top &&
        objectY - padding <= bottom
      );
    },
    [getViewport],
  );

  const ensurePlayerVisible = useCallback(
    (playerX: number, playerY: number) => {
      const viewport = getViewport();
      const padding = 64;
      const newX = camera.x;

      // If player is too far to the left, adjust camera
      if (playerX - newX < padding) {
        const newCameraX = Math.max(0, playerX - padding);
        setCamera({
          x: newCameraX,
          y: camera.y,
          targetX: newCameraX,
          targetY: camera.y,
        });
      } else if (playerX + viewport.width > newX + viewport.width) {
        // If player is too far to the right, adjust camera
        const levelWidth = 3200;
        const newCameraX = Math.min(
          levelWidth - viewport.width,
          playerX + viewport.width - padding,
        );
        setCamera({
          x: newCameraX,
          y: camera.y,
          targetX: newCameraX,
          targetY: camera.y,
        });
      }

      // If player is too far above, adjust camera
      if (playerY < camera.y + padding) {
        setCamera({
          x: camera.x,
          y: Math.max(0, playerY - padding),
          targetX: camera.x,
          targetY: playerY,
        });
      } else if (playerY + viewport.height > camera.y + viewport.height) {
        // If player is too far below, adjust camera
        const levelHeight = 480;
        setCamera({
          x: camera.x,
          y: Math.min(levelHeight - viewport.height, playerY),
          targetX: camera.x,
          targetY: playerY,
        });
      }
    },
    [camera.x, camera.y, getViewport],
  );

  const contextValue = {
    camera,
    setCamera,
    getCameraPosition,
    updateCamera,
    clampCamera,
    getClampedCamera,
    ensurePlayerVisible,
    getViewport,
    isInView,
  };

  return (
    <CameraContext.Provider value={contextValue}>
      {children}
    </CameraContext.Provider>
  );
};

// Custom hook for camera
export function useCamera() {
  const ctx = useContext(CameraContext);
  if (!ctx) {
    throw new Error("useCamera must be used within CameraProvider");
  }
  return ctx;
}

export default CameraProvider;
