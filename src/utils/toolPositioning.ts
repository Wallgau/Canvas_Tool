import type { Tool, Position } from '../types';
import { LAYOUT_CONSTANTS } from './constants';
import { pxToRem } from './positioning';

interface PositionCalculatorOptions {
  tools: Tool[];
  canvasSize: { width: number; height: number };
}

export class ToolPositionCalculator {
  private tools: Tool[];
  private canvasSize: { width: number; height: number };

  constructor({ tools, canvasSize }: PositionCalculatorOptions) {
    this.tools = tools;
    this.canvasSize = canvasSize;
  }

  calculateNewToolPosition(): Position {
    if (this.tools.length === 0) {
      return { x: LAYOUT_CONSTANTS.MARGIN_REM, y: LAYOUT_CONSTANTS.MARGIN_REM };
    }

    const rows = this.groupToolsByRows();
    const positionInRow = this.findPositionInExistingRow(rows);

    return positionInRow || this.createNewRow();
  }

  private groupToolsByRows(): Tool[][] {
    const rows: Tool[][] = [];

    this.tools.forEach(tool => {
      const existingRow = rows.find(
        row =>
          Math.abs(row[0].position.y - tool.position.y) <
          LAYOUT_CONSTANTS.ROW_THRESHOLD_REM
      );

      if (existingRow) {
        existingRow.push(tool);
      } else {
        rows.push([tool]);
      }
    });

    return rows.sort((a, b) => a[0].position.y - b[0].position.y);
  }

  private findPositionInExistingRow(rows: Tool[][]): Position | null {
    const toolWidthRem = pxToRem(LAYOUT_CONSTANTS.TOOL_WIDTH_PX);
    const maxCanvasWidthRem =
      pxToRem(this.canvasSize.width) - LAYOUT_CONSTANTS.MARGIN_REM;

    for (const row of rows) {
      row.sort((a, b) => a.position.x - b.position.x);
      const rightmostTool = row[row.length - 1];
      const newX =
        rightmostTool.position.x + toolWidthRem + LAYOUT_CONSTANTS.SPACING_REM;

      if (newX + toolWidthRem <= maxCanvasWidthRem) {
        return { x: newX, y: rightmostTool.position.y };
      }
    }

    return null;
  }

  private createNewRow(): Position {
    const bottomMostTool = this.tools.reduce((bottom, tool) =>
      tool.position.y > bottom.position.y ? tool : bottom
    );

    return {
      x: LAYOUT_CONSTANTS.MARGIN_REM,
      y:
        bottomMostTool.position.y +
        pxToRem(LAYOUT_CONSTANTS.TOOL_HEIGHT_PX) +
        LAYOUT_CONSTANTS.SPACING_REM,
    };
  }
}
