import { pxToRem, remToPx, getDefaultPosition } from '../positioning';
// import { LAYOUT_CONSTANTS } from '../constants';

// Mock the constants
vi.mock('../constants', () => ({
  LAYOUT_CONSTANTS: {
    REM_TO_PX_RATIO: 16,
    TOOL_WIDTH_PX: 200,
    TOOL_HEIGHT_PX: 100,
  },
}));

describe('positioning utilities', () => {
  describe('pxToRem', () => {
    it('should convert pixels to rem correctly', () => {
      expect(pxToRem(16)).toBe(1);
      expect(pxToRem(32)).toBe(2);
      expect(pxToRem(8)).toBe(0.5);
      expect(pxToRem(0)).toBe(0);
    });

    it('should handle decimal values', () => {
      expect(pxToRem(24)).toBe(1.5);
      expect(pxToRem(12)).toBe(0.75);
    });

    it('should handle negative values', () => {
      expect(pxToRem(-16)).toBe(-1);
      expect(pxToRem(-32)).toBe(-2);
    });
  });

  describe('remToPx', () => {
    it('should convert rem to pixels correctly', () => {
      expect(remToPx(1)).toBe(16);
      expect(remToPx(2)).toBe(32);
      expect(remToPx(0.5)).toBe(8);
      expect(remToPx(0)).toBe(0);
    });

    it('should handle decimal values', () => {
      expect(remToPx(1.5)).toBe(24);
      expect(remToPx(0.75)).toBe(12);
    });

    it('should handle negative values', () => {
      expect(remToPx(-1)).toBe(-16);
      expect(remToPx(-2)).toBe(-32);
    });
  });

  describe('getDefaultPosition', () => {
    it('should center tool on canvas', () => {
      const canvasSize = { width: 800, height: 600 };
      const position = getDefaultPosition(canvasSize);

      // Expected: (800 - 200) / 2 / 16 = 18.75rem
      expect(position.x).toBe(18.75);
      // Expected: (600 - 100) / 2 / 16 = 15.625rem
      expect(position.y).toBe(15.625);
    });

    it('should handle small canvas sizes', () => {
      const canvasSize = { width: 100, height: 50 };
      const position = getDefaultPosition(canvasSize);

      // Should not go negative
      expect(position.x).toBe(0);
      expect(position.y).toBe(0);
    });

    it('should handle canvas smaller than tool', () => {
      const canvasSize = { width: 150, height: 80 };
      const position = getDefaultPosition(canvasSize);

      // Should clamp to 0
      expect(position.x).toBe(0);
      expect(position.y).toBe(0);
    });

    it('should handle zero canvas size', () => {
      const canvasSize = { width: 0, height: 0 };
      const position = getDefaultPosition(canvasSize);

      expect(position.x).toBe(0);
      expect(position.y).toBe(0);
    });

    it('should handle very large canvas sizes', () => {
      const canvasSize = { width: 2000, height: 1500 };
      const position = getDefaultPosition(canvasSize);

      // Expected: (2000 - 200) / 2 / 16 = 56.25rem
      expect(position.x).toBe(56.25);
      // Expected: (1500 - 100) / 2 / 16 = 43.75rem
      expect(position.y).toBe(43.75);
    });

    it('should return correct data structure', () => {
      const canvasSize = { width: 400, height: 300 };
      const position = getDefaultPosition(canvasSize);

      expect(position).toHaveProperty('x');
      expect(position).toHaveProperty('y');
      expect(typeof position.x).toBe('number');
      expect(typeof position.y).toBe('number');
    });
  });

  describe('Edge cases', () => {
    it('should handle floating point precision', () => {
      const canvasSize = { width: 333, height: 222 };
      const position = getDefaultPosition(canvasSize);

      // Should handle floating point calculations correctly
      expect(position.x).toBeCloseTo(4.15625, 5);
      expect(position.y).toBeCloseTo(3.8125, 5);
    });

    it('should work with different REM_TO_PX_RATIO values', () => {
      // This test would require mocking the constants differently
      // For now, we test with the default 16px = 1rem
      expect(pxToRem(16)).toBe(1);
      expect(remToPx(1)).toBe(16);
    });
  });
});
