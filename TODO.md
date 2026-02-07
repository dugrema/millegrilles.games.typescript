# Project TODO

## 📌 High-level Tasks
- [x] Implement Tetris
- [x] Implement Snake
- [x] Implement Flappy Bird
- [x] Create design for Minesweeper
- [x] Implement Minesweeper
- [ ] Implement Super Mario clone game

## Super Mario Implementation tasks
Note: When finishing a phase, always ensure the application can load and the screens can be displayed without error.

### Phase 1 Tasks (in order of dependency)

#### **Phase 1.1: Core Infrastructure**
- [ ] **Create types.ts with complete type definitions**
- [ ] **Expand constants.ts with input keys, sprites, and levels**
- [ ] **Build level1.ts with tile-based map**

#### **Phase 1.2: Game State & Provider**
- [ ] **Implement index.tsx Provider with SoundManager**
- [ ] **Add player physics (movement, gravity, jumping)**
- [ ] **Implement basic collision detection**
- [ ] **Build game loop with requestAnimationFrame**

#### **Phase 1.3: UI Components**
- [ ] **Create ScoreDisplay component**
- [ ] **Create LivesDisplay component**
- [ ] **Create ControlsHelp component**
- [ ] **Create GameOverOverlay component**
- [ ] **Create LevelIndicator component**

#### **Phase 1.4: Main Game Component**
- [ ] **Build Game.tsx with canvas rendering**
- [ ] **Implement player rendering with animation states**
- [ ] **Implement level/world rendering**
- [ ] **Handle keyboard input and state updates**

#### **Phase 1.5: Integration & Polish**
- [ ] **Export Provider from supermario directory**
- [ ] **Create route component in routes/games/**
- [ ] **Implement game state transitions**
- [ ] **Add basic sound effects**
- [ ] **Test basic gameplay loop**

#### **Phase 1.6: Testing & Quality**
- [ ] **Verify TypeScript compilation (`npx tsc --noEmit`)**
- [ ] **Test movement (left, right, jump, double jump)**
- [ ] **Test collision detection**
- [ ] **Test level loading**
- [ ] **Test game over/win conditions**
- [ ] **Verify responsive design**
- [ ] **Test audio playback**


## 📌 Blockers
- None

---
_Last updated: 2026-01-30_
