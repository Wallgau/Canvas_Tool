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
