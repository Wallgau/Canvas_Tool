/**
 * Tool positioning utilities - extracted from original ToolCanvas
 */

import type { Tool, ToolTemplate } from '../../../types';
import type { Position, PositioningConfig } from '../ToolCanvasV2.types';
import { CANVAS_CONSTANTS } from './constants';

/**
 * Convert pixels to rem units
 */
export const pxToRem = (px: number): number =>
  px / CANVAS_CONSTANTS.REM_TO_PX_RATIO;

/**
 * Convert rem to pixel units
 */
export const remToPx = (rem: number): number =>
  rem * CANVAS_CONSTANTS.REM_TO_PX_RATIO;

/**
 * Get default center position for a tool
 */
export const getDefaultPosition = (): Position => {
  // Use reasonable default canvas size (800x600)
  const defaultWidth = 800;
  const defaultHeight = 600;
  return {
    x: Math.max(0, pxToRem(defaultWidth - CANVAS_CONSTANTS.TOOL_WIDTH_PX) / 2),
    y: Math.max(
      0,
      pxToRem(defaultHeight - CANVAS_CONSTANTS.TOOL_HEIGHT_PX) / 2
    ),
  };
};

/**
 * Generate unique ID for tools
 */
export const generateToolId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

/**
 * Get tools that are already on the canvas
 */
export const getUsedToolNames = (tools: Tool[]): Set<string> => {
  return new Set(tools.map(tool => tool.name));
};

/**
 * Detect if we're on a mobile device based on viewport width
 */
const isMobileViewport = (): boolean => {
  return typeof window !== 'undefined' && window.innerWidth <= 768;
};

/**
 * Calculate position for a new tool using responsive smart layout
 * - Mobile: Always stack vertically with 2rem spacing
 * - Desktop: Try horizontal placement first, fallback to new row
 */
export const calculateNewToolPosition = (existingTools: Tool[]): Position => {
  // Default position if no tools exist
  if (existingTools.length === 0) {
    return { x: CANVAS_CONSTANTS.MARGIN_REM, y: CANVAS_CONSTANTS.MARGIN_REM };
  }

  const config: PositioningConfig = {
    toolWidth: pxToRem(CANVAS_CONSTANTS.TOOL_WIDTH_PX),
    toolHeight: pxToRem(CANVAS_CONSTANTS.TOOL_HEIGHT_PX),
    spacing: isMobileViewport() ? 1 : 2, // 1rem for mobile, 2rem for desktop
    margin: CANVAS_CONSTANTS.MARGIN_REM,
    rowThreshold: CANVAS_CONSTANTS.ROW_THRESHOLD_REM,
  };

  // Mobile: Always stack vertically
  if (isMobileViewport()) {
    return calculateMobilePosition(existingTools, config);
  }

  // Desktop: Try horizontal first, then vertical
  return calculateDesktopPosition(existingTools, config);
};

/**
 * Calculate position for mobile - always stack vertically
 */
const calculateMobilePosition = (
  existingTools: Tool[],
  config: PositioningConfig
): Position => {
  // Find the bottom-most tool
  const bottomMost = existingTools.reduce((bottom, tool) =>
    tool.position.y > bottom.position.y ? tool : bottom
  );

  return {
    x: config.margin,
    y: bottomMost.position.y + config.toolHeight + config.spacing,
  };
};

/**
 * Estimate actual width of a tool based on its content
 * Tools now have a fixed width of 13.5rem with box-sizing: border-box
 */
const estimateToolWidth = (): number => {
  // Since tools now have a fixed width, return the constant value
  return pxToRem(285); // 17.5rem (box-sizing: border-box includes padding/border)
};

/**
 * Calculate position for desktop - horizontal first, then vertical
 */
const calculateDesktopPosition = (
  existingTools: Tool[],
  config: PositioningConfig
): Position => {
  // Use a reasonable default canvas width (800px = 50rem)
  const maxCanvasWidthRem = 50 - config.margin;

  // Group tools by rows (tools with similar Y positions)
  const rows: Tool[][] = [];

  existingTools.forEach(tool => {
    const existingRow = rows.find(
      row => Math.abs(row[0].position.y - tool.position.y) < config.rowThreshold
    );
    if (existingRow) {
      existingRow.push(tool);
    } else {
      rows.push([tool]);
    }
  });

  // Sort rows by Y position
  rows.sort((a, b) => a[0].position.y - b[0].position.y);

  // Try to find space in existing rows first (2rem to the right)
  for (const row of rows) {
    // Sort tools in this row by X position
    row.sort((a, b) => a.position.x - b.position.x);
    const rightmostInRow = row[row.length - 1];

    // Calculate the actual width of the rightmost tool
    const rightmostToolWidth = estimateToolWidth(rightmostInRow);
    const newXRem =
      rightmostInRow.position.x + rightmostToolWidth + config.spacing;

    // Check if there's space in this row (using estimated width for new tool)
    const newToolWidth = config.toolWidth; // Use default for new tool estimation
    if (newXRem + newToolWidth <= maxCanvasWidthRem) {
      return {
        x: newXRem,
        y: rightmostInRow.position.y,
      };
    }
  }

  // If no space in existing rows, create a new row (2rem below)
  if (rows.length > 0) {
    const lastRow = rows[rows.length - 1];
    const newYRem = lastRow[0].position.y + config.toolHeight + config.spacing;
    return {
      x: config.margin,
      y: newYRem,
    };
  }

  // Fallback to default position
  return { x: config.margin, y: config.margin };
};

/**
 * Create a new tool from template with calculated position
 */
export const createToolFromTemplate = (
  template: ToolTemplate,
  existingTools: Tool[]
): Tool => {
  return {
    id: generateToolId(),
    name: template.name,
    params: { ...template.defaultParams },
    position: calculateNewToolPosition(existingTools),
  };
};
