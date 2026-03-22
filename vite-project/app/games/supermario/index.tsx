import React from "react";
import { GameProvider } from "./GameContext";
import Game from "./Game";

/**
 * Super Mario Game Provider wrapper
 *
 * This component provides the game context and wraps the Game component.
 * It should be used in the route file along with the Game component.
 *
 * Example usage in routes/games/supermario.tsx:
 *
 * import styled from "styled-components";
 * import { SuperMarioGameProvider } from "../../games/supermario";
 * import SuperMarioGame from "../../games/supermario/Game";
 *
 * export default function SuperMario() {
 *   return (
 *     <PageContainer>
 *       <GameWrapper>
 *         <SuperMarioGameProvider>
 *           <SuperMarioGame />
 *         </SuperMarioGameProvider>
 *       </GameWrapper>
 *     </PageContainer>
 *   );
 * }
 */
export function SuperMarioGameProvider({ children }: { children: React.ReactNode }) {
  return <GameProvider>{children}</GameProvider>;
}

// Export the main Game component
export { default as SuperMarioGame } from "./Game";

// Export the GameProvider for use in routes
export default SuperMarioGameProvider;
