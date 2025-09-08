import { ToolPositionCalculator } from '../toolPositioning';
import type { Tool } from '../../types';

// Mock the constants
vi.mock('../constants', () => ({
  LAYOUT_CONSTANTS: {
    MARGIN_REM: 1,
    ROW_THRESHOLD_REM: 0.5,
    SPACING_REM: 0.5,
    TOOL_WIDTH_PX: 200,
    TOOL_HEIGHT_PX: 100,
    REM_TO_PX_RATIO: 16,
  },
}));

// Mock the positioning utility
vi.mock('../positioning', () => ({
  pxToRem: (px: number): number => px / 16,
}));

describe('ToolPositionCalculator', () => {
  const mockCanvasSize = { width: 800, height: 600 };

  describe('constructor', () => {
    it('should initialize with tools and canvas size', () => {
      const tools: Tool[] = [];
      const calculator = new ToolPositionCalculator({
        tools,
        canvasSize: mockCanvasSize,
      });

      expect(calculator).toBeInstanceOf(ToolPositionCalculator);
    });
  });

  describe('calculateNewToolPosition', () => {
    it('should return margin position for empty tools array', () => {
      const tools: Tool[] = [];
      const calculator = new ToolPositionCalculator({
        tools,
        canvasSize: mockCanvasSize,
      });

      const position = calculator.calculateNewToolPosition();

      expect(position).toEqual({ x: 1, y: 1 }); // MARGIN_REM
    });

    it('should place tool in existing row if space available', () => {
      const tools: Tool[] = [
        {
          id: '1',
          name: 'Tool 1',
          params: {},
          position: { x: 1, y: 1 },
        },
      ];
      const calculator = new ToolPositionCalculator({
        tools,
        canvasSize: mockCanvasSize,
      });

      const position = calculator.calculateNewToolPosition();

      // Should place next to existing tool
      // Tool width in rem: 200/16 = 12.5, spacing: 0.5
      // Expected x: 1 + 12.5 + 0.5 = 14
      expect(position.x).toBe(14);
      expect(position.y).toBe(1);
    });

    it('should create new row when no space in existing rows', () => {
      // Use a narrow canvas to force new row creation
      const narrowCanvas = { width: 200, height: 600 };
      const tools: Tool[] = [
        {
          id: '1',
          name: 'Tool 1',
          params: {},
          position: { x: 1, y: 1 },
        },
      ];
      const calculator = new ToolPositionCalculator({
        tools,
        canvasSize: narrowCanvas,
      });

      const position = calculator.calculateNewToolPosition();

      // Should create new row below since canvas is too narrow
      // Tool height: 6.25rem, spacing: 0.5rem
      // Expected y: 1 + 6.25 + 0.5 = 7.75
      expect(position.x).toBe(1); // MARGIN_REM
      expect(position.y).toBe(7.75);
    });

    it('should handle tools in different rows', () => {
      const tools: Tool[] = [
        {
          id: '1',
          name: 'Tool 1',
          params: {},
          position: { x: 1, y: 1 },
        },
        {
          id: '2',
          name: 'Tool 2',
          params: {},
          position: { x: 1, y: 8 }, // Different row
        },
      ];
      const calculator = new ToolPositionCalculator({
        tools,
        canvasSize: mockCanvasSize,
      });

      const position = calculator.calculateNewToolPosition();

      // Should place in first row (y=1) next to first tool
      expect(position.x).toBe(14);
      expect(position.y).toBe(1);
    });

    it('should handle tools with similar y positions (within threshold)', () => {
      const tools: Tool[] = [
        {
          id: '1',
          name: 'Tool 1',
          params: {},
          position: { x: 1, y: 1 },
        },
        {
          id: '2',
          name: 'Tool 2',
          params: {},
          position: { x: 1, y: 1.3 }, // Within ROW_THRESHOLD_REM (0.5)
        },
      ];
      const calculator = new ToolPositionCalculator({
        tools,
        canvasSize: mockCanvasSize,
      });

      const position = calculator.calculateNewToolPosition();

      // Should place in the same row as the rightmost tool
      expect(position.x).toBe(14);
      expect(position.y).toBe(1.3);
    });
  });

  describe('Edge cases', () => {
    it('should handle canvas smaller than tool width', () => {
      const smallCanvas = { width: 100, height: 200 };
      const tools: Tool[] = [
        {
          id: '1',
          name: 'Tool 1',
          params: {},
          position: { x: 1, y: 1 },
        },
      ];
      const calculator = new ToolPositionCalculator({
        tools,
        canvasSize: smallCanvas,
      });

      const position = calculator.calculateNewToolPosition();

      // Should create new row since no space in existing row
      expect(position.x).toBe(1);
      expect(position.y).toBe(7.75);
    });

    it('should handle tools at canvas edge', () => {
      const tools: Tool[] = [
        {
          id: '1',
          name: 'Tool 1',
          params: {},
          position: { x: 40, y: 1 }, // Near right edge
        },
      ];
      const calculator = new ToolPositionCalculator({
        tools,
        canvasSize: mockCanvasSize,
      });

      const position = calculator.calculateNewToolPosition();

      // Should create new row since no space
      expect(position.x).toBe(1);
      expect(position.y).toBe(7.75);
    });

    it('should handle multiple tools in same row', () => {
      // Use a canvas that can fit 3 tools but not 4
      const narrowCanvas = { width: 400, height: 600 }; // 25rem width
      const tools: Tool[] = [
        {
          id: '1',
          name: 'Tool 1',
          params: {},
          position: { x: 1, y: 1 },
        },
        {
          id: '2',
          name: 'Tool 2',
          params: {},
          position: { x: 14, y: 1 },
        },
        {
          id: '3',
          name: 'Tool 3',
          params: {},
          position: { x: 27, y: 1 },
        },
      ];
      const calculator = new ToolPositionCalculator({
        tools,
        canvasSize: narrowCanvas,
      });

      const position = calculator.calculateNewToolPosition();

      // Should create new row since canvas is too narrow for 4th tool
      // Max width: 25 - 1 = 24rem, but 4 tools need: 1 + 12.5 + 0.5 + 12.5 + 0.5 + 12.5 + 0.5 + 12.5 = 40rem
      expect(position.x).toBe(1); // MARGIN_REM
      expect(position.y).toBe(7.75); // 1 + 6.25 + 0.5
    });

    it('should handle tools with negative positions', () => {
      const tools: Tool[] = [
        {
          id: '1',
          name: 'Tool 1',
          params: {},
          position: { x: -5, y: -10 },
        },
      ];
      const calculator = new ToolPositionCalculator({
        tools,
        canvasSize: mockCanvasSize,
      });

      const position = calculator.calculateNewToolPosition();

      // Should place next to the tool with negative position
      // -5 + 12.5 + 0.5 = 8
      expect(position.x).toBe(8);
      expect(position.y).toBe(-10);
    });

    it('should handle very large canvas', () => {
      const largeCanvas = { width: 2000, height: 1500 };
      const tools: Tool[] = [
        {
          id: '1',
          name: 'Tool 1',
          params: {},
          position: { x: 1, y: 1 },
        },
      ];
      const calculator = new ToolPositionCalculator({
        tools,
        canvasSize: largeCanvas,
      });

      const position = calculator.calculateNewToolPosition();

      // Should place next to existing tool
      expect(position.x).toBe(14);
      expect(position.y).toBe(1);
    });
  });

  describe('Row grouping logic', () => {
    it('should group tools by y position within threshold', () => {
      const tools: Tool[] = [
        { id: '1', name: 'Tool 1', params: {}, position: { x: 1, y: 1 } },
        { id: '2', name: 'Tool 2', params: {}, position: { x: 14, y: 1.2 } }, // Within threshold
        { id: '3', name: 'Tool 3', params: {}, position: { x: 1, y: 2 } }, // Different row
        { id: '4', name: 'Tool 4', params: {}, position: { x: 14, y: 2.1 } }, // Within threshold of row 3
      ];
      const calculator = new ToolPositionCalculator({
        tools,
        canvasSize: mockCanvasSize,
      });

      const position = calculator.calculateNewToolPosition();

      // Should place in the first row (y=1) next to the rightmost tool in that row
      // Tool 2 is at x=14, so next position is 14 + 12.5 + 0.5 = 27
      expect(position.x).toBe(27);
      expect(position.y).toBe(1.2);
    });

    it('should sort rows by y position', () => {
      const tools: Tool[] = [
        { id: '1', name: 'Tool 1', params: {}, position: { x: 1, y: 10 } },
        { id: '2', name: 'Tool 2', params: {}, position: { x: 1, y: 5 } },
        { id: '3', name: 'Tool 3', params: {}, position: { x: 1, y: 1 } },
      ];
      const calculator = new ToolPositionCalculator({
        tools,
        canvasSize: mockCanvasSize,
      });

      const position = calculator.calculateNewToolPosition();

      // Should place in the topmost row (y=1)
      expect(position.x).toBe(14);
      expect(position.y).toBe(1);
    });
  });
});
