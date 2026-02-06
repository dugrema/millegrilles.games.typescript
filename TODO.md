# Project TODO

## 📌 High-level Tasks
- [x] Implement Tetris
- [x] Implement Snake
- [x] Implement Flappy Bird
- [x] Create design for Minesweeper
- [x] Implement Minesweeper
- [ ] Implement Super Mario clone game

## Super Mario Implementation tasks (current)
Note: When finishing a phase, always ensure the application can load and the screens can be displayed without error.

### Phase 1: Create project structure ✅ COMPLETE
- [x] Create project structure in `app/games/supermario`
  - [x] Create `index.tsx` main entry point (context, provider, hook)
  - [x] Create `types.ts` type definitions
  - [x] Create `constants.ts` game constants
  - [x] Create `Game.tsx` main game component
  - [x] Create `components/` directory
  - [x] Create `routes/games/supermario.tsx` route component
  - [x] Create `game-styles.css` global styles

### Phase 2: Implement player physics and movement ✅ COMPLETE
- [x] Create Player component with rendering
- [x] Implement gravity and jump mechanics
- [x] Implement horizontal movement and friction
- [x] Add run boost functionality
- [x] Implement collision detection with platforms

### Phase 3: Implement camera system ✅ COMPLETE
- [x] Create camera following logic
- [x] Implement smooth horizontal scrolling
- [x] Handle level boundaries

### Phase 4: Create platform system ✅ COMPLETE
- [x] Create Platforms component
- [x] Implement tile-based map parsing
- [x] Add platform collision detection
- [x] Implement platform types (ground, bricks, blocks, pipes)
- [x] Create level map data (EXAMPLE_LEVEL_1)

### Phase 5: Create UI elements ✅ COMPLETE
- [x] Create UIOverlay component
- [x] Display score, lives, and level
- [x] Add time counter
- [x] Create GameOverlay component for start/game over screens
- [x] Fix diagnostic issues of all files in project
- [x] Run build, troubleshoot

### Phase 6: Implement game loop and state management ✅ COMPLETE
- [x] Create GameContainer with Canvas rendering
- [x] Implement main game loop using requestAnimationFrame
- [x] Add game state management (idle, playing, paused, game over, victory)
- [x] Handle level transitions
- [x] The value of PlatformType.AIR was changed from 0 to 7. Fix level-data.ts.
- [x] Fix canvas rendering

### Phase 7: Add controls and input handling
- [ ] Implement keyboard event listeners
- [ ] Add touch controls for mobile
- [ ] Implement pause functionality
- [ ] Add restart functionality
- [ ] Wire all modules so that the game can start running
- [ ] Let the user test initial gameplay and troubleshoot

### Phase 8: Implement enemy system
- [ ] Create Enemy component
- [ ] Implement Goomba AI (patrol and turn)
- [ ] Implement Koopa AI
- [ ] Add enemy death animation
- [ ] Implement player vs enemy collision

### Phase 9: Create collectibles system
- [ ] Create Collectibles component
- [ ] Implement coin spawning and collection
- [ ] Implement power-up system (Mushroom, Fire Flower)
- [ ] Add power-up spawning from question blocks

### Phase 10: Add sound effects and music
- [ ] Implement Web Audio API for sound effects
- [ ] Add jump, coin, enemy defeat sounds
- [ ] Add power-up, game over, level complete sounds
- [ ] Implement background music

### Phase 11: Implement lives and scoring
- [ ] Create lives system
- [ ] Implement score tracking
- [ ] Add respawn mechanics on death
- [ ] Handle high score persistence

### Phase 12: Add level progression
- [ ] Create multiple level definitions
- [ ] Implement level completion detection (reach flag pole)
- [ ] Add level transition screens

### Phase 13: Implement power-up mechanics
- [ ] Create power-up states (small, big, fire)
- [ ] Implement size change and hit detection
- [ ] Add fire flower shooting (if applicable)
- [ ] Handle power-up duration and expiration

### Phase 14: Polish and refine
- [ ] Add sprite animations (walk, idle, jump)
- [ ] Create visual effects (sparkles, particle effects)
- [ ] Add background elements (clouds, hills)
- [ ] Implement save progress feature (optional)
- [ ] Add responsive design

## 📌 Blockers
- None

---
_Last updated: 2026-01-30_
