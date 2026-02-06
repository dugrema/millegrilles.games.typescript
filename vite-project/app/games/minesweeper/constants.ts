export const DIFFICULTIES = {
  easy: {
    rows: 9,
    cols: 9,
    mines: 10,
    cellSize: 30,
    colors: {
      hidden: '#b0b0b0',
      revealed: '#d0d0d0',
      numbers: {
        1: '#1976d2',
        2: '#388e3c',
        3: '#d32f2f',
        4: '#7b1fa2',
        5: '#795548',
        6: '#0097a7',
        7: '#000000',
        8: '#9e9e9e',
      },
    },
    boardSize: 600,
  },
  medium: {
    rows: 16,
    cols: 16,
    mines: 40,
    cellSize: 30,
    colors: {
      hidden: '#b0b0b0',
      revealed: '#d0d0d0',
      numbers: {
        1: '#1976d2',
        2: '#388e3c',
        3: '#d32f2f',
        4: '#7b1fa2',
        5: '#795548',
        6: '#0097a7',
        7: '#000000',
        8: '#9e9e9e',
      },
    },
    boardSize: 480,
  },
  hard: {
    rows: 16,
    cols: 30,
    mines: 99,
    cellSize: 20,
    colors: {
      hidden: '#b0b0b0',
      revealed: '#d0d0d0',
      numbers: {
        1: '#1976d2',
        2: '#388e3c',
        3: '#d32f2f',
        4: '#7b1fa2',
        5: '#795548',
        6: '#0097a7',
        7: '#000000',
        8: '#9e9e9e',
      },
    },
    boardSize: 600,
  },
} as const;

export const CELL_TYPES = ['empty', 'mine'] as const;
export const CELL_VALUES = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const;
export const CELL_EMPTY = 'empty';
export const CELL_MINE = 'mine';

export const FLAG_EMOJI = '🚩';
export const MINE_EMOJI = '💣';
export const TIMER_START_VALUE = 0;
export const TIMER_MAX_VALUE = 999;
export const INITIAL_MINE_COUNT = -1;
export const KEYBOARD_CONTROLS = {
  RESTART: 'r',
  START_NEW_GAME: 'Enter',
  PAUSE_RESUME: 'Escape',
} as const;
export const STORAGE_KEYS = {
  HIGH_SCORES: 'minesweeper_high_scores',
  PREFERRED_DIFFICULTY: 'minesweeper_preferred_difficulty',
} as const;
