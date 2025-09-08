/**
 * Tests for toolUtils
 */

import { getToolDisplayName, getToolTemplate } from '../toolUtils';
import type { Tool } from '../../types';

describe('toolUtils', () => {
  describe('getToolDisplayName', () => {
    it('should return the display name for a known tool', () => {
      const tool: Tool = {
        id: 'test-1',
        name: 'get_weather',
        params: { location: 'Durham, NC' },
        position: { x: 0, y: 0 },
      };

      expect(getToolDisplayName(tool)).toBe('Weather Forecast');
    });

    it('should return the tool name for an unknown tool', () => {
      const tool: Tool = {
        id: 'test-1',
        name: 'unknown_tool',
        params: {},
        position: { x: 0, y: 0 },
      };

      expect(getToolDisplayName(tool)).toBe('unknown_tool');
    });
  });

  describe('getToolTemplate', () => {
    it('should return the template for a known tool', () => {
      const tool: Tool = {
        id: 'test-1',
        name: 'get_weather',
        params: { location: 'Durham, NC' },
        position: { x: 0, y: 0 },
      };

      const template = getToolTemplate(tool);
      expect(template).toBeDefined();
      expect(template?.name).toBe('get_weather');
      expect(template?.displayName).toBe('Weather Forecast');
    });

    it('should return undefined for an unknown tool', () => {
      const tool: Tool = {
        id: 'test-1',
        name: 'unknown_tool',
        params: {},
        position: { x: 0, y: 0 },
      };

      expect(getToolTemplate(tool)).toBeUndefined();
    });
  });
});
