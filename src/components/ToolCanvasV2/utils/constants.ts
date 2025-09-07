/**
 * Constants for ToolCanvasV2 - no more magic numbers!
 */

export const CANVAS_CONSTANTS = {
  // Tool dimensions (in px, converted to rem in positioning)
  TOOL_WIDTH_PX: 216, // 13.5rem * 16px = 216px (box-sizing: border-box includes padding/border)
  TOOL_HEIGHT_PX: 200,
  
  // Spacing and margins (in rem)
  SPACING_REM: 4, // Increased from 2 to debug overlap issue
  MARGIN_REM: 2,
  ROW_THRESHOLD_REM: 1,
  
  // Canvas settings
  CANVAS_PADDING_PX: 40,
  DEFAULT_CANVAS_WIDTH: 800,
  DEFAULT_CANVAS_HEIGHT: 600,
  
  // Conversion
  REM_TO_PX_RATIO: 16,
  
  // Timing
  FOCUS_DELAY_MS: 100,
  
  // Storage
  STORAGE_KEY: 'tool-canvas-v2-state',
  
  // Default tool
  DEFAULT_TOOL_ID: 'default-weather-tool'
} as const;

export const FILE_EXPORT_CONSTANTS = {
  MIME_TYPE: 'application/json',
  FILE_PREFIX: 'tool-canvas-v2',
  VERSION: '2.0.0'
} as const;
