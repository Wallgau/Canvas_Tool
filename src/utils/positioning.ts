import { LAYOUT_CONSTANTS } from './constants';
import type { Position } from '../types/global';

// Utility functions for position calculations
export const pxToRem = (px: number): number =>
  px / LAYOUT_CONSTANTS.REM_TO_PX_RATIO;

export const remToPx = (rem: number): number =>
  rem * LAYOUT_CONSTANTS.REM_TO_PX_RATIO;

export const getDefaultPosition = (canvasSize: {
  width: number;
  height: number;
}): Position => {
  return {
    x: Math.max(
      0,
      pxToRem(canvasSize.width - LAYOUT_CONSTANTS.TOOL_WIDTH_PX) / 2
    ),
    y: Math.max(
      0,
      pxToRem(canvasSize.height - LAYOUT_CONSTANTS.TOOL_HEIGHT_PX) / 2
    ),
  };
};

/**
 * Check if two positions are close enough to be considered in the same row
 */
export const isInSameRow = (
  pos1: Position,
  pos2: Position,
  threshold: number = LAYOUT_CONSTANTS.ROW_THRESHOLD_REM
): boolean => {
  return Math.abs(pos1.y - pos2.y) < threshold;
};

/**
 * Calculate distance between two positions
 */
export const calculateDistance = (pos1: Position, pos2: Position): number => {
  const dx = pos1.x - pos2.x;
  const dy = pos1.y - pos2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Clamp a position to stay within canvas bounds
 */
export const clampPosition = (
  position: Position,
  canvasSize: { width: number; height: number }
): Position => {
  const maxX =
    (canvasSize.width - LAYOUT_CONSTANTS.TOOL_WIDTH_PX) /
    LAYOUT_CONSTANTS.REM_TO_PX_RATIO;
  const maxY =
    (canvasSize.height - LAYOUT_CONSTANTS.TOOL_HEIGHT_PX) /
    LAYOUT_CONSTANTS.REM_TO_PX_RATIO;

  return {
    x: Math.max(0, Math.min(position.x, maxX)),
    y: Math.max(0, Math.min(position.y, maxY)),
  };
};
