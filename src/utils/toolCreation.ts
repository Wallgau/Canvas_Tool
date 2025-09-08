/**
 * Tool creation and management utilities
 * Reusable functions for creating and managing tools across components
 */

import type { Tool, ToolTemplate } from '../types';
import type { Position } from '../types/global';
import { LAYOUT_CONSTANTS } from './constants';

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
 * Get default center position for a tool
 */
export const getDefaultToolPosition = (canvasSize?: {
  width: number;
  height: number;
}): Position => {
  const defaultWidth = canvasSize?.width || LAYOUT_CONSTANTS.DEFAULT_CANVAS_WIDTH;
  const defaultHeight = canvasSize?.height || LAYOUT_CONSTANTS.DEFAULT_CANVAS_HEIGHT;
  
  return {
    x: Math.max(0, (defaultWidth - LAYOUT_CONSTANTS.TOOL_WIDTH_PX) / 2 / LAYOUT_CONSTANTS.REM_TO_PX_RATIO),
    y: Math.max(0, (defaultHeight - LAYOUT_CONSTANTS.TOOL_HEIGHT_PX) / 2 / LAYOUT_CONSTANTS.REM_TO_PX_RATIO),
  };
};

/**
 * Detect if we're on a mobile device based on viewport width
 */
export const isMobileViewport = (): boolean => {
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
    return { 
      x: LAYOUT_CONSTANTS.MARGIN_REM, 
      y: LAYOUT_CONSTANTS.MARGIN_REM 
    };
  }

  const toolWidthRem = LAYOUT_CONSTANTS.TOOL_WIDTH_PX / LAYOUT_CONSTANTS.REM_TO_PX_RATIO;
  const toolHeightRem = LAYOUT_CONSTANTS.TOOL_HEIGHT_PX / LAYOUT_CONSTANTS.REM_TO_PX_RATIO;
  const spacing = isMobileViewport() ? 1 : 2; // 1rem for mobile, 2rem for desktop

  // Mobile: Always stack vertically
  if (isMobileViewport()) {
    return calculateMobilePosition(existingTools, {
      toolWidth: toolWidthRem,
      toolHeight: toolHeightRem,
      spacing,
      margin: LAYOUT_CONSTANTS.MARGIN_REM,
    });
  }

  // Desktop: Try horizontal first, then vertical
  return calculateDesktopPosition(existingTools, {
    toolWidth: toolWidthRem,
    toolHeight: toolHeightRem,
    spacing,
    margin: LAYOUT_CONSTANTS.MARGIN_REM,
    rowThreshold: LAYOUT_CONSTANTS.ROW_THRESHOLD_REM,
  });
};

/**
 * Calculate position for mobile - always stack vertically
 */
const calculateMobilePosition = (
  existingTools: Tool[],
  config: {
    toolWidth: number;
    toolHeight: number;
    spacing: number;
    margin: number;
  }
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
 * Calculate position for desktop - horizontal first, then vertical
 */
const calculateDesktopPosition = (
  existingTools: Tool[],
  config: {
    toolWidth: number;
    toolHeight: number;
    spacing: number;
    margin: number;
    rowThreshold: number;
  }
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
    const rightmostToolWidth = config.toolWidth;
    const newXRem = rightmostInRow.position.x + rightmostToolWidth + config.spacing;

    // Check if there's space in this row (using estimated width for new tool)
    const newToolWidth = config.toolWidth;
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
