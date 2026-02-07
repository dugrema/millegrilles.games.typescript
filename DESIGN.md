# Design file for games

Note: This design is copied from the AGENTS.md file once the game implementation is complete.

## Tetris Design
- **Component Structure**
 - `GameContext` (React Context) to provide global state (grid, current piece, score, level, next piece).
 - `GameBoard` component: renders a 10x20 grid using `<div>`s or `<canvas>`, highlights active tetromino.
 - `Tetromino` component: receives piece shape and rotation matrix, renders cells absolutely positioned.
 - `Controls` component: displays score, level, next piece preview, and line counter.
 - `GameLoop` using `requestAnimationFrame` + `setInterval` for tick logic (gravity, hold, lock delay).
- **State Management**
 - Use `useReducer` to manage complex game state transitions (spawn, move, rotate, lock, line clear).
 - Persist `highScore` in `localStorage` and maybe `SessionStorage` for best plays.
- **Game Engine Core**
 - Represent the board as a 2D array `[20][10]` of numbers/objects (0 = empty, >0 = block type).
 - Tetromino shapes defined as 4x4 boolean matrices with rotation functions.
 - Collision detection: check intended position against board boundaries and occupied cells.
 - Lock delay timer to allow last-move before piece locks when landed.
 - Line clearing: scan rows from bottom up; remove full rows, shift above rows down, increase score.
 - Level progression: increase gravity rate after clearing a set number of lines (e.g., each 10 lines).
 - Timing: base tick interval ~800ms, reduce by level (e.g., `tickInterval = 800 - (level * 50)`).
- **Input Handling**
 - Global keydown listener for ArrowLeft/Right, ArrowUp (rotate), ArrowDown (soft drop), Space (hard drop).
 - Debounce rapid rotates: allow a small delay between successive rotations.
- **Testing Strategy**
 - Use Jest with React Testing Library for component rendering.
 - Test engine functions (`canMove`, `rotateShape`, `clearLines`) in isolation.
 - Mock timers for gravity and lock delay to test timing logic.
- **Additional Features (Optional)**
 - Sound: Play Tetris "drop" and "line clear" sounds using Web Audio API.
 - Responsive: CSS grid adapts container size; maintain 4:5 aspect ratio.

## Design of Snake game

### Implementation notes

- Mimic the file structure from Tetris under app/games/tetris.
  - The snake game goes under app/games/snake.
  - Hook these components using app/routes/games/snake.

### Game Overview

Snake is a classic arcade game where a snake-shaped player moves around a grid eating food items. The snake grows each time it eats food, and the player must avoid hitting the walls or the snake's own body.

### Core Components

#### 1. Game Arena
- **Grid Size**: 20x20 cells
- **Cell Size**: 20x20 pixels
- **Arena Size**: 400x400 pixels
- **Background**: Dark green (#2e7d32)
- **Border**: Light green (#4caf50)

#### 2. Snake Entity
- **Initial Position**: Center of the arena (10,10)
- **Direction**: Starts moving right
- **Segment Size**: Same as cell size (20x20)
- **Head Color**: Bright green (#76ff03)
- **Body Color**: Darker green (#38e179)
- **Movement Speed**: 150ms per move
- **Growth**: +1 segment when food eaten
- **Movement Logic**: Grid-based movement
  - Can move: Up, Down, Left, Right
  - Cannot reverse direction (can't go left if currently moving right)
- **Collision Detection**:
  - Wall collision: Out of bounds (0-19 x, 0-19 y)
  - Self collision: Any previous segment position

#### 3. Food Entity
- **Food Color**: Red (#ff0000)
- **Food Shape**: Circle
- **Food Size**: Small (10x10 pixels inside cell)
- **Placement**: Random empty cell on grid
- **Frequency**: Places every time snake grows
- **Visual Effect**: Pulses when eaten

#### 4. Score System
- **Score**: Points earned from eating food
- **Initial Score**: 0
- **Points per food**: +10
- **Display**: Top right corner of arena
- **Color**: White text

#### 5. Game States
- **Playing**: Game actively running
- **Paused**: Game temporarily stopped
- **GameOver**: Snake hit wall or itself
- **Won**: Unlimited game mode (no win condition)

#### 6. User Controls
- **Arrow Keys**: Control snake direction
  - Up arrow: Move up
  - Down arrow: Move down
  - Left arrow: Move left
  - Right arrow: Move right
- **Space Bar**: Pause/Resume game
- **R Key**: Restart game after Game Over

#### 7. UI Elements
- **Game Title**: Large text at top center
- **Score Display**: Small text showing current score
- **Control Instructions**: Bottom area showing key mappings
- **Pause Indicator**: "PAUSED" text when paused
- **Game Over Screen**: Overlay with final score and restart option

#### 8. Game Logic
- **Update Loop**: `setInterval` running at 150ms
- **Render Loop**: React `useEffect` with state updates
- **Food Generation**: Check for collisions before placement
- **Score Tracking**: Update score state when food eaten
- **Direction Queue**: Handle rapid key presses
  - Prevent multiple same-direction presses in one move
  - Store direction changes temporarily

#### 9. Visual Design
- **Arena Container**: Responsive with max-width
- **Styled Components**: React styled-components
- **Animations**: CSS transitions for smooth movement
- **Colors**: Green theme throughout
- **Fonts**: Monospace for technical feel

### Implementation Notes
- Use functional components with hooks
- Keep state minimal: snake position, direction, score, game state
- Use keyboard event listeners in `useEffect`
- Implement proper cleanup in `useEffect` to remove listeners
- Handle window resize gracefully
- Ensure accessibility with proper keyboard focus management

## Design of Flappy Bird game

### Component Structure
- `GameContext` (React Context) to manage bird state, pipes, score, and game status
- `FlappyBird` component: main game container with Canvas rendering
- `Bird` component: renders the bird sprite with rotation based on velocity
- `Pipes` component: manages pipe array, spacing, and collision detection
- `Score` component: displays current score in top-left corner
- `GameOverlay` component: shows start button, game over screen, and restart option
- `GameLoop` using `requestAnimationFrame` for smooth 60fps rendering and physics updates

### State Management
- Use `useReducer` to manage game state (bird position, velocity, gravity, score, game status)
- Persist `highScore` in `localStorage` for best performances
- Bird physics: gravity acceleration, jump velocity, velocity damping

### Game Engine Core
- Bird physics model:
  - Gravity: constant downward acceleration (e.g., 0.5 px/frame²)
  - Jump: upward velocity impulse (e.g., -9 px/frame)
  - Velocity: current vertical speed
  - Position: x/y coordinates
- Pipe generation:
  - Spawn new pipe pair every N frames or pixel distance
  - Pipe pair contains top and bottom pipes with gap in between
  - Gap size: constant (e.g., 150-180 px)
  - Pipe width: constant (e.g., 60 px)
  - Pipe height: random (e.g., 100-300 px)
- Collision detection:
  - Bird bounds vs pipe rectangle boundaries
  - Bird bounds vs ground/ceiling
  - Ground collision: if bird y + birdHeight >= canvasHeight
- Scoring:
  - Increment score when passing a pipe pair
  - Score display updates in real-time

### Game States
- **Idle**: Waiting for player to start
- **Playing**: Game actively running
- **Paused**: Game temporarily stopped
- **GameOver**: Bird collided with pipe or ground

### User Controls
- **Space Bar**: Trigger jump
- **Space Bar**: Pause/Resume (optional)
- **Enter Key**: Restart game

### Visual Design
- Canvas size: 480x640 pixels (mobile-friendly aspect ratio)
- Bird sprite: yellow bird with small wing and eye
- Pipes: green with darker green tops and lighter green bottoms
- Background: blue sky gradient
- Ground: brown with grass details at top
- Score display: white text, top-left corner
- Font: monospace for score and UI elements

### Audio Effects
- Jump sound: short beep/trill
- Score sound: pleasant chime
- Collision sound: crash/fail sound

### Implementation Notes
- Use functional components with hooks
- Canvas rendering for smooth performance
- Responsive design: scale canvas on smaller screens
- Physics simulation frame-based
- Handle window resize events
- Debounce input to prevent multiple jumps
- Game speed can increase as score increases

### Directory Structure
```
millegrilles.games.typescript/vite-project/app/
├── games/
│   └── flappybird/
│       ├── index.tsx           # Main game entry point
│       ├── components/
│       │   ├── Bird.tsx        # Bird rendering component
│       │   ├── Pipes.tsx       # Pipe management component
│       │   ├── Score.tsx       # Score display component
│       │   └── GameOverlay.tsx # Start/Game Over UI
│       ├── types.ts            # TypeScript type definitions
│       ├── constants.ts        # Game constants (gravity, speeds, etc.)
│       ├── useGameLogic.ts     # Custom hook for game mechanics
│       └── GameContext.tsx     # React Context for global state
├── routes/
│   └── games/
│       └── flappybird.tsx      # Route component for the game
└── Game.tsx                    # Global game context provider
```

### Key Features
- Physics-based bird movement
- Randomized pipe generation
- Collision detection system
- Real-time score tracking
- High score persistence
- Responsive canvas rendering
- Start/Restart game flow
- Touch controls for mobile (tap to jump)
- Sound effects using Web Audio API
- Smooth 60fps animation loop
- Pause functionality

## Design of Minesweeper game

### Component Structure
- `GameContext` (React Context) to manage game state (grid, revealed cells, mine count, timer, game status)
- `GameBoard` component: renders the minefield grid with cell rendering
- `Cell` component: individual cell with mine, number, flag, and reveal states
- `Header` component: displays mine counter, timer, and difficulty selector
- `GameOverlay` component: shows start screen, game over/win screen with restart option
- `GameLoop` using `requestAnimationFrame` or `setInterval` for timer updates

### State Management
- Use `useReducer` to manage game state (grid configuration, revealed cells, flagged cells, mine count, timer, game status)
- Persist `highScore` in `localStorage` and difficulty preferences
- Grid state represented as 2D array or flat array with coordinate mapping
- Timer runs in a separate effect/update loop

### Game Engine Core
- **Grid System**:
  - Difficulty levels: Easy (9x9), Medium (16x16), Hard (30x16)
  - Mine count per difficulty: Easy (10), Medium (40), Hard (99)
  - Cell types: empty, mine, number 0-8
- **Mine Placement**:
  - Random distribution with constraints
  - First-click guarantee: first clicked cell is never a mine
  - Ensure at least one valid path to open areas
- **Number Calculation**:
  - Count adjacent mines for each cell
  - Handle edge and corner cells properly
- **Flood Fill Algorithm**:
  - Recursive or stack-based cell opening
  - Reveal all adjacent empty cells (0-value)
  - Cascade to reveal connected safe areas
- **Win Condition**: All non-mine cells revealed, game status = Win
- **Loss Condition**: Clicked a mine, game status = Game Over
- **Timer**: Start on first click, reset on game reset

### Game States
- **Idle**: Waiting for player to start
- **Playing**: Game actively running, timer counting
- **Paused**: Game temporarily stopped
- **GameOver**: Player clicked a mine
- **Won**: All non-mine cells revealed

### User Controls
- **Left Click**: Reveal cell
  - Numbers show adjacent mine count
  - Empty cells trigger flood fill
  - Mine ends game
- **Right Click**: Flag/Unflag cell
  - Toggle flag state on cell
  - Mine counter updates
- **Difficulty Selector**: Choose Easy/Medium/Hard
  - Reset game with selected difficulty
- **R Key**: Restart game after Game Over
- **Enter Key**: Start new game
- **Esc Key**: Pause/Resume game (optional)

### Visual Design
- **Board Size**: 600x600 pixels (standard minesweeper size)
- **Cell Size**: 30x30 pixels
- **Colors**:
  - Hidden cells: Blue-gray (#b0b0b0)
  - Revealed cells: Light gray (#d0d0d0)
  - Flagged cells: Red flag emoji
  - Mines: Black circle with center dot or emoji
  - Number colors: 
    - 1: Blue (#1976d2)
    - 2: Green (#388e3c)
    - 3: Red (#d32f2f)
    - 4: Dark blue (#7b1fa2)
    - 5: Brown (#795548)
    - 6: Cyan (#0097a7)
    - 7: Black (#000000)
    - 8: Gray (#9e9e9e)
- **Layout**: Board centered with header above and footer below
- **Font**: Monospace for numbers and UI elements

### Audio Effects
- First click: Subtle click sound
- Reveal empty cell: Pleasant chime
- Reveal number: Very subtle sound
- Flag/Unflag: Click sound
- Game Over: Failure sound
- Win: Success chime with fanfare

### Implementation Notes
- Use functional components with hooks
- CSS Grid for board rendering (responsive considerations)
- Event handling for both mouse and touch (tap to reveal, long-press to flag)
- Debounce rapid right-clicks to prevent context menu issues
- Persistent difficulty preference in localStorage
- First-click guarantee requires regenerating mine positions if first click is a mine
- Flood fill should be optimized to prevent stack overflow on large boards
- Mobile considerations: separate tap actions (single tap = reveal, long press = flag)

### Directory Structure
```
millegrilles.games.typescript/vite-project/app/
├── games/
│   └── minesweeper/
│       ├── index.tsx           # Main game entry point
│       ├── components/
│       │   ├── GameBoard.tsx   # Main grid container
│       │   ├── Cell.tsx        # Individual cell component
│       │   ├── Header.tsx      # Mine counter, timer, difficulty
│       │   └── GameOverlay.tsx # Start/Game Over/Win UI
│       ├── types.ts            # TypeScript type definitions
│       ├── constants.ts        # Game constants (grid sizes, colors)
│       ├── useGameLogic.ts     # Custom hook for game mechanics
│       └── GameContext.tsx     # React Context for global state
├── routes/
│   └── games/
│       └── minesweeper.tsx     # Route component for the game
└── Game.tsx                    # Global game context provider
```

### Key Features
- Classic minesweeper gameplay with three difficulty levels
- First-click protection (never mine on first click)
- Efficient flood fill algorithm for opening empty areas
- Mine counter and timer display
- Flagging system for tracking mines
- Game over detection with visual feedback
- Win condition detection
- Restart game functionality
- High score tracking per difficulty
- Responsive design with touch support
- Keyboard and mouse controls
- Sound effects for gameplay events
