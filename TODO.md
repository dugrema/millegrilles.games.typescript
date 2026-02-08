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

#### **Phase 1.1: Core Infrastructure** ✅ COMPLETED
- [x] **Create types.ts with complete type definitions**
- [x] **Expand constants.ts with input keys, sprites, and levels**
- [x] **Build level1.ts with tile-based map**

#### **Phase 1.2: Game State & Provider** ✅ COMPLETED
- [x] **Implement index.tsx Provider with SoundManager**
- [x] **Add player physics (movement, gravity, jumping)**
- [x] **Implement basic collision detection**
- [x] **Build game loop with requestAnimationFrame**

#### **Phase 1.3: UI Components** ✅ COMPLETED
- [x] **Create ScoreDisplay component**
- [x] **Create LivesDisplay component**
- [x] **Create ControlsHelp component**
- [x] **Create GameOverOverlay component**
- [x] **Create LevelIndicator component**

#### **Phase 1.4: Main Game Component** ✅ COMPLETED
- [x] **Build Game.tsx with canvas rendering**
- [x] **Implement player rendering with animation states**
- [x] **Implement level/world rendering**
- [x] **Handle keyboard input and state updates**

#### **Phase 1.5: Integration & Polish** ⚠️ IN PROGRESS
- [x] **Export Provider from supermario directory**
- [x] **Create route component in routes/games/**
- [x] **Fix START GAME button click handler**
- [x] **Implement RESTART key to start game from 'start' status**
- [x] **Verify game state transitions work correctly**
- [ ] **Test basic gameplay loop**

#### **Phase 1.6: Testing & Quality** 🚧 NOT STARTED
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
_Last updated: 2026-02-20 - Fixed button handler, needs RESTART key fix and testing_
