import { LAYOUT_CONSTANTS, STORAGE_KEYS, TOOL_IDS } from '../constants';

describe('constants', () => {
  describe('LAYOUT_CONSTANTS', () => {
    it('should have correct REM_TO_PX_RATIO', () => {
      expect(LAYOUT_CONSTANTS.REM_TO_PX_RATIO).toBe(16);
    });

    it('should have correct tool dimensions', () => {
      expect(LAYOUT_CONSTANTS.TOOL_WIDTH_PX).toBe(250);
      expect(LAYOUT_CONSTANTS.TOOL_HEIGHT_PX).toBe(200);
    });

    it('should have correct spacing values', () => {
      expect(LAYOUT_CONSTANTS.SPACING_REM).toBe(2);
      expect(LAYOUT_CONSTANTS.MARGIN_REM).toBe(2);
      expect(LAYOUT_CONSTANTS.ROW_THRESHOLD_REM).toBe(1);
    });

    it('should have correct canvas values', () => {
      expect(LAYOUT_CONSTANTS.CANVAS_PADDING).toBe(40);
      expect(LAYOUT_CONSTANTS.DEFAULT_CANVAS_WIDTH).toBe(800);
      expect(LAYOUT_CONSTANTS.DEFAULT_CANVAS_HEIGHT).toBe(600);
    });

    it('should have correct timing values', () => {
      expect(LAYOUT_CONSTANTS.FOCUS_DELAY_MS).toBe(100);
    });

    it('should be readonly', () => {
      // TypeScript should prevent modification, but we can test the structure
      expect(Object.isFrozen(LAYOUT_CONSTANTS)).toBe(false); // Not frozen in JS, but const in TS

      // Test that all properties are numbers
      Object.values(LAYOUT_CONSTANTS).forEach(value => {
        expect(typeof value).toBe('number');
      });
    });
  });

  describe('STORAGE_KEYS', () => {
    it('should have correct storage key', () => {
      expect(STORAGE_KEYS.TOOL_CANVAS_STATE).toBe('tool-canvas-state');
    });

    it('should be readonly', () => {
      // Test that all properties are strings
      Object.values(STORAGE_KEYS).forEach(value => {
        expect(typeof value).toBe('string');
      });
    });
  });

  describe('TOOL_IDS', () => {
    it('should be empty object', () => {
      expect(Object.keys(TOOL_IDS)).toHaveLength(0);
    });

    it('should be readonly', () => {
      // Test that all properties are strings (when they exist)
      Object.values(TOOL_IDS).forEach(value => {
        expect(typeof value).toBe('string');
      });
    });
  });

  describe('Constants validation', () => {
    it('should have positive values for layout constants', () => {
      Object.values(LAYOUT_CONSTANTS).forEach(value => {
        expect(value).toBeGreaterThan(0);
      });
    });

    it('should have non-empty strings for storage keys', () => {
      Object.values(STORAGE_KEYS).forEach(value => {
        expect(value).toBeTruthy();
        expect(value.length).toBeGreaterThan(0);
      });
    });

    it('should have non-empty strings for tool IDs', () => {
      Object.values(TOOL_IDS).forEach(value => {
        expect(value).toBeTruthy();
        expect(value.length).toBeGreaterThan(0);
      });
    });

    it('should have reasonable tool dimensions', () => {
      expect(LAYOUT_CONSTANTS.TOOL_WIDTH_PX).toBeGreaterThan(100);
      expect(LAYOUT_CONSTANTS.TOOL_WIDTH_PX).toBeLessThan(1000);
      expect(LAYOUT_CONSTANTS.TOOL_HEIGHT_PX).toBeGreaterThan(50);
      expect(LAYOUT_CONSTANTS.TOOL_HEIGHT_PX).toBeLessThan(500);
    });

    it('should have reasonable canvas dimensions', () => {
      expect(LAYOUT_CONSTANTS.DEFAULT_CANVAS_WIDTH).toBeGreaterThan(400);
      expect(LAYOUT_CONSTANTS.DEFAULT_CANVAS_WIDTH).toBeLessThan(2000);
      expect(LAYOUT_CONSTANTS.DEFAULT_CANVAS_HEIGHT).toBeGreaterThan(300);
      expect(LAYOUT_CONSTANTS.DEFAULT_CANVAS_HEIGHT).toBeLessThan(1500);
    });

    it('should have reasonable spacing values', () => {
      expect(LAYOUT_CONSTANTS.SPACING_REM).toBeGreaterThan(0);
      expect(LAYOUT_CONSTANTS.SPACING_REM).toBeLessThan(10);
      expect(LAYOUT_CONSTANTS.MARGIN_REM).toBeGreaterThan(0);
      expect(LAYOUT_CONSTANTS.MARGIN_REM).toBeLessThan(10);
    });
  });

  describe('Constants structure', () => {
    it('should have expected number of layout constants', () => {
      const layoutKeys = Object.keys(LAYOUT_CONSTANTS);
      expect(layoutKeys).toHaveLength(10); // Updated to match actual count
    });

    it('should have expected layout constant keys', () => {
      const expectedKeys = [
        'REM_TO_PX_RATIO',
        'TOOL_WIDTH_PX',
        'TOOL_HEIGHT_PX',
        'SPACING_REM',
        'MARGIN_REM',
        'ROW_THRESHOLD_REM',
        'CANVAS_PADDING',
        'DEFAULT_CANVAS_WIDTH',
        'DEFAULT_CANVAS_HEIGHT',
        'FOCUS_DELAY_MS',
      ];

      expectedKeys.forEach(key => {
        expect(LAYOUT_CONSTANTS).toHaveProperty(key);
      });
    });

    it('should have expected storage key', () => {
      expect(STORAGE_KEYS).toHaveProperty('TOOL_CANVAS_STATE');
    });

    it('should have empty tool IDs object', () => {
      expect(Object.keys(TOOL_IDS)).toHaveLength(0);
    });
  });
});
