// Layout and positioning constants
export const LAYOUT_CONSTANTS = {
  REM_TO_PX_RATIO: 16,
  TOOL_WIDTH_PX: 250,
  TOOL_HEIGHT_PX: 200,
  SPACING_REM: 2,
  MARGIN_REM: 2,
  ROW_THRESHOLD_REM: 1,
  CANVAS_PADDING: 40,
  DEFAULT_CANVAS_WIDTH: 800,
  DEFAULT_CANVAS_HEIGHT: 600,
  FOCUS_DELAY_MS: 100,
} as const;

// Storage keys
export const STORAGE_KEYS = {
  TOOL_CANVAS_STATE: 'tool-canvas-state',
} as const;

// Tool IDs - currently none defined
export const TOOL_IDS = {} as const;
