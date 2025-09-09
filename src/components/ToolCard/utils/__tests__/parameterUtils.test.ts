import {
  extractParameterFields,
  getParameterSection,
  getParameterDisplayValue,
  isParameterBeingEdited,
} from '../parameterUtils';
import type { Tool } from '../../../../types';

describe('parameterUtils utilities', () => {
  const mockTool: Tool = {
    id: 'test-tool-1',
    name: 'test_tool',
    params: {
      param1: 'value1',
      param2: 'value2',
      param3: '',
      param4: 'value4',
    },
    position: { x: 100, y: 200 },
  };

  describe('extractParameterFields', () => {
    it('should extract parameter fields from tool with params', () => {
      const fields = extractParameterFields(mockTool, false, null);

      expect(fields).toHaveLength(4);
      expect(fields[0]).toEqual({
        name: 'param1',
        value: 'value1',
        id: 'test-tool-1-param1',
        isEditing: false,
      });
      expect(fields[1]).toEqual({
        name: 'param2',
        value: 'value2',
        id: 'test-tool-1-param2',
        isEditing: false,
      });
      expect(fields[2]).toEqual({
        name: 'param3',
        value: '',
        id: 'test-tool-1-param3',
        isEditing: false,
      });
      expect(fields[3]).toEqual({
        name: 'param4',
        value: 'value4',
        id: 'test-tool-1-param4',
        isEditing: false,
      });
    });

    it('should mark correct parameter as editing when isEditing is true', () => {
      const fields = extractParameterFields(mockTool, true, 'param2');

      expect(fields[0].isEditing).toBe(false); // param1
      expect(fields[1].isEditing).toBe(true); // param2
      expect(fields[2].isEditing).toBe(false); // param3
      expect(fields[3].isEditing).toBe(false); // param4
    });

    it('should return empty array for tool with no params', () => {
      const toolWithoutParams: Tool = {
        ...mockTool,
        params: {},
      };

      const fields = extractParameterFields(toolWithoutParams, false, null);

      expect(fields).toEqual([]);
    });

    it('should return empty array for tool with undefined params', () => {
      const toolWithUndefinedParams: Tool = {
        ...mockTool,
        params: undefined as unknown as Record<string, string>,
      };

      const fields = extractParameterFields(
        toolWithUndefinedParams,
        false,
        null
      );

      expect(fields).toEqual([]);
    });

    it('should handle null values in params', () => {
      const toolWithNullValues: Tool = {
        ...mockTool,
        params: {
          param1: 'value1',
          param2: null as unknown as string,
          param3: undefined as unknown as string,
        },
      };

      const fields = extractParameterFields(toolWithNullValues, false, null);

      expect(fields).toHaveLength(3);
      expect(fields[0].value).toBe('value1');
      expect(fields[1].value).toBe('');
      expect(fields[2].value).toBe('');
    });

    it('should generate correct IDs for different tools', () => {
      const anotherTool: Tool = {
        ...mockTool,
        id: 'another-tool',
        params: { param1: 'value1' },
      };

      const fields = extractParameterFields(anotherTool, false, null);

      expect(fields[0].id).toBe('another-tool-param1');
    });
  });

  describe('getParameterSection', () => {
    it('should return section with parameters when tool has params', () => {
      const section = getParameterSection(mockTool, false, null);

      expect(section.hasParameters).toBe(true);
      expect(section.fields).toHaveLength(4);
      expect(section.fields[0].name).toBe('param1');
    });

    it('should return section without parameters when tool has no params', () => {
      const toolWithoutParams: Tool = {
        ...mockTool,
        params: {},
      };

      const section = getParameterSection(toolWithoutParams, false, null);

      expect(section.hasParameters).toBe(false);
      expect(section.fields).toEqual([]);
    });

    it('should pass through editing state correctly', () => {
      const section = getParameterSection(mockTool, true, 'param2');

      expect(section.hasParameters).toBe(true);
      expect(section.fields[1].isEditing).toBe(true);
      expect(section.fields[0].isEditing).toBe(false);
    });

    it('should handle undefined params', () => {
      const toolWithUndefinedParams: Tool = {
        ...mockTool,
        params: undefined as unknown as Record<string, string>,
      };

      const section = getParameterSection(toolWithUndefinedParams, false, null);

      expect(section.hasParameters).toBe(false);
      expect(section.fields).toEqual([]);
    });
  });

  describe('getParameterDisplayValue', () => {
    it('should return value when value is not empty', () => {
      expect(getParameterDisplayValue('test value')).toBe('test value');
      expect(getParameterDisplayValue('0')).toBe('0');
      expect(getParameterDisplayValue('false')).toBe('false');
    });

    it('should return placeholder when value is empty', () => {
      expect(getParameterDisplayValue('')).toBe('Click to edit');
      expect(getParameterDisplayValue('   ')).toBe('   '); // Only empty string, not whitespace
    });

    it('should handle null and undefined values', () => {
      expect(getParameterDisplayValue(null as unknown as string)).toBe(
        'Click to edit'
      );
      expect(getParameterDisplayValue(undefined as unknown as string)).toBe(
        'Click to edit'
      );
    });

    it('should handle special characters', () => {
      expect(getParameterDisplayValue('test@example.com')).toBe(
        'test@example.com'
      );
      expect(getParameterDisplayValue('123-456-7890')).toBe('123-456-7890');
      expect(getParameterDisplayValue('Hello, World!')).toBe('Hello, World!');
    });
  });

  describe('isParameterBeingEdited', () => {
    it('should return true when parameter is being edited', () => {
      expect(isParameterBeingEdited('param1', true, 'param1')).toBe(true);
    });

    it('should return false when not editing', () => {
      expect(isParameterBeingEdited('param1', false, 'param1')).toBe(false);
    });

    it('should return false when different parameter is being edited', () => {
      expect(isParameterBeingEdited('param1', true, 'param2')).toBe(false);
    });

    it('should return false when no parameter is being edited', () => {
      expect(isParameterBeingEdited('param1', true, null)).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(isParameterBeingEdited('', true, '')).toBe(true);
      expect(isParameterBeingEdited('param1', true, '')).toBe(false);
      expect(isParameterBeingEdited('', true, 'param1')).toBe(false);
    });

    it('should be case sensitive', () => {
      expect(isParameterBeingEdited('Param1', true, 'param1')).toBe(false);
      expect(isParameterBeingEdited('param1', true, 'Param1')).toBe(false);
    });
  });

  describe('integration tests', () => {
    it('should work together for complete parameter management flow', () => {
      const tool: Tool = {
        id: 'integration-test',
        name: 'test_tool',
        params: {
          email: 'test@example.com',
          name: 'John Doe',
          age: '25',
        },
        position: { x: 0, y: 0 },
      };

      // Extract fields
      const fields = extractParameterFields(tool, true, 'email');
      expect(fields).toHaveLength(3);
      expect(fields[0].isEditing).toBe(true); // email
      expect(fields[1].isEditing).toBe(false); // name
      expect(fields[2].isEditing).toBe(false); // age

      // Get section
      const section = getParameterSection(tool, true, 'email');
      expect(section.hasParameters).toBe(true);
      expect(section.fields).toEqual(fields);

      // Check editing status
      expect(isParameterBeingEdited('email', true, 'email')).toBe(true);
      expect(isParameterBeingEdited('name', true, 'email')).toBe(false);

      // Get display values
      expect(getParameterDisplayValue('test@example.com')).toBe(
        'test@example.com'
      );
      expect(getParameterDisplayValue('')).toBe('Click to edit');
    });

    it('should handle empty tool gracefully', () => {
      const emptyTool: Tool = {
        id: 'empty-tool',
        name: 'empty_tool',
        params: {},
        position: { x: 0, y: 0 },
      };

      const fields = extractParameterFields(emptyTool, false, null);
      const section = getParameterSection(emptyTool, false, null);

      expect(fields).toEqual([]);
      expect(section.hasParameters).toBe(false);
      expect(section.fields).toEqual([]);
    });
  });
});
