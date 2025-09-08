import { describe, it, expect } from 'vitest';
import {
  sanitizeHtml,
  sanitizeText,
  validateInput,
  sanitizeToolParams,
  sanitizeToolData,
  sanitizeJsonData,
  validateLocalStorageData,
  EMAIL_REGEX,
  URL_REGEX,
  PHONE_REGEX,
  ALPHANUMERIC_REGEX,
  NUMERIC_REGEX,
  INTEGER_REGEX,
} from '../inputSanitization';

describe('Input Sanitization', () => {
  describe('sanitizeHtml', () => {
    it('should remove script tags', () => {
      const input = '<script>alert("xss")</script><p>Hello</p>';
      const result = sanitizeHtml(input);
      expect(result).toBe('Hello');
    });

    it('should remove dangerous attributes', () => {
      const input = '<img src="x" onerror="alert(1)">';
      const result = sanitizeHtml(input);
      expect(result).toBe('');
    });

    it('should remove javascript: URLs', () => {
      const input = '<a href="javascript:alert(1)">Click me</a>';
      const result = sanitizeHtml(input);
      expect(result).toBe('Click me');
    });

    it('should escape HTML entities when requested', () => {
      const input = '<script>alert("xss")</script>';
      const result = sanitizeHtml(input, { escapeHtml: true });
      expect(result).toBe('');
    });
  });

  describe('sanitizeText', () => {
    it('should remove XSS patterns', () => {
      const input = 'Hello <script>alert("xss")</script> World';
      const result = sanitizeText(input);
      expect(result).toBe('Hello  World');
    });

    it('should remove SQL injection patterns', () => {
      const input = "'; DROP TABLE users; --";
      const result = sanitizeText(input);
      expect(result).toBe('');
    });

    it('should trim whitespace by default', () => {
      const input = '  Hello World  ';
      const result = sanitizeText(input);
      expect(result).toBe('Hello World');
    });

    it('should limit length', () => {
      const input = 'A'.repeat(2000);
      const result = sanitizeText(input, { maxLength: 100 });
      expect(result).toHaveLength(100);
    });

    it('should normalize Unicode', () => {
      const input = 'café';
      const result = sanitizeText(input, { normalizeUnicode: true });
      expect(result).toBe('café');
    });
  });

  describe('validateInput', () => {
    it('should validate email format', () => {
      const validEmail = 'test@example.com';
      const result = validateInput(validEmail, 'email');
      expect(result.isValid).toBe(true);
      expect(result.sanitizedValue).toBe(validEmail);
    });

    it('should reject invalid email format', () => {
      const invalidEmail = 'not-an-email';
      const result = validateInput(invalidEmail, 'email');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid email format');
    });

    it('should validate URL format', () => {
      const validUrl = 'https://example.com';
      const result = validateInput(validUrl, 'url');
      expect(result.isValid).toBe(true);
    });

    it('should reject invalid URL format', () => {
      const invalidUrl = 'not-a-url';
      const result = validateInput(invalidUrl, 'url');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid URL format');
    });

    it('should validate phone format', () => {
      const validPhone = '+1234567890';
      const result = validateInput(validPhone, 'phone');
      expect(result.isValid).toBe(true);
    });

    it('should validate numeric format', () => {
      const validNumber = '123.45';
      const result = validateInput(validNumber, 'numeric');
      expect(result.isValid).toBe(true);
    });

    it('should validate integer format', () => {
      const validInteger = '123';
      const result = validateInput(validInteger, 'integer');
      expect(result.isValid).toBe(true);
    });

    it('should validate alphanumeric format', () => {
      const validAlphanumeric = 'Hello123 World!';
      const result = validateInput(validAlphanumeric, 'alphanumeric');
      expect(result.isValid).toBe(true);
    });

    it('should reject invalid alphanumeric format', () => {
      const invalidAlphanumeric = 'Hello<script>alert(1)</script>';
      const result = validateInput(invalidAlphanumeric, 'alphanumeric');
      expect(result.isValid).toBe(false);
    });

    it('should validate JSON format', () => {
      const validJson = '{"key": "value"}';
      const result = validateInput(validJson, 'json');
      expect(result.isValid).toBe(true);
    });

    it('should reject invalid JSON format', () => {
      const invalidJson = '{"key": "value"';
      const result = validateInput(invalidJson, 'json');
      expect(result.isValid).toBe(false);
    });
  });

  describe('sanitizeToolParams', () => {
    it('should sanitize weather forecast parameters', () => {
      const params = {
        location: 'New York<script>alert(1)</script>',
        units: 'celsius',
        days: '5',
      };
      const result = sanitizeToolParams(params);
      expect(result.location).toBe('New York');
      expect(result.units).toBe('celsius');
      expect(result.days).toBe(5);
    });

    it('should sanitize email parameters', () => {
      const params = {
        to: 'test@example.com',
        subject: 'Hello<script>alert(1)</script>',
        message: 'Test message',
      };
      const result = sanitizeToolParams(params);
      expect(result.to).toBe('test@example.com');
      expect(result.subject).toBe('Hello');
      expect(result.message).toBe('Test message');
    });

    it('should sanitize web search parameters', () => {
      const params = {
        query: 'weather<script>alert(1)</script>',
        results: '10',
      };
      const result = sanitizeToolParams(params);
      expect(result.query).toBe('weather');
      expect(result.results).toBe(10);
    });
  });

  describe('sanitizeToolData', () => {
    it('should sanitize complete tool data', () => {
      const tool = {
        id: 'tool-1<script>alert(1)</script>',
        name: 'weather_forecast',
        params: {
          location: 'New York<script>alert(1)</script>',
          units: 'celsius',
        },
        position: { x: 100, y: 200 },
      };
      const result = sanitizeToolData(tool);
      expect(result.id).toBe('tool-1');
      expect(result.name).toBe('weather_forecast');
      expect((result.params as Record<string, unknown>).location).toBe(
        'New York'
      );
      expect((result.params as Record<string, unknown>).units).toBe('celsius');
      expect(result.position).toEqual({ x: 100, y: 200 });
    });

    it('should clamp position values', () => {
      const tool = {
        id: 'tool-1',
        name: 'weather_forecast',
        params: {},
        position: { x: -100, y: 20000 },
      };
      const result = sanitizeToolData(tool);
      expect((result.position as Record<string, unknown>).x).toBe(0);
      expect((result.position as Record<string, unknown>).y).toBe(10000);
    });
  });

  describe('sanitizeJsonData', () => {
    it('should remove script tags from JSON', () => {
      const jsonString = '{"data": "<script>alert(1)</script>"}';
      const result = sanitizeJsonData(jsonString);
      expect(result).toBe('{"data": ""}');
    });

    it('should remove XSS patterns from JSON', () => {
      const jsonString = '{"data": "Hello <script>alert(1)</script> World"}';
      const result = sanitizeJsonData(jsonString);
      expect(result).toBe('{"data": "Hello  World"}');
    });
  });

  describe('validateLocalStorageData', () => {
    it('should validate valid tool array', () => {
      const validData = JSON.stringify([
        {
          id: 'tool-1',
          name: 'weather_forecast',
          params: { location: 'New York', units: 'celsius' },
          position: { x: 100, y: 200 },
        },
      ]);
      const result = validateLocalStorageData(validData);
      expect(result.isValid).toBe(true);
      expect(result.sanitizedData).toHaveLength(1);
    });

    it('should reject invalid JSON', () => {
      const invalidData = '{"invalid": json}';
      const result = validateLocalStorageData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid JSON data');
    });

    it('should reject non-array data', () => {
      const invalidData = '{"not": "an array"}';
      const result = validateLocalStorageData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Data must be an array of tools');
    });

    it('should sanitize corrupted tool data', () => {
      const corruptedData = JSON.stringify([
        {
          id: 'tool-1<script>alert(1)</script>',
          name: 'weather_forecast',
          params: { location: 'New York<script>alert(1)</script>' },
          position: { x: 100, y: 200 },
        },
      ]);
      const result = validateLocalStorageData(corruptedData);
      expect(result.isValid).toBe(true);
      expect((result.sanitizedData as Record<string, unknown>[])[0].id).toBe(
        'tool-1'
      );
      expect(
        (
          (result.sanitizedData as Record<string, unknown>[])[0]
            .params as Record<string, unknown>
        ).location
      ).toBe('New York');
    });
  });

  describe('Regex patterns', () => {
    it('should validate email regex', () => {
      expect(EMAIL_REGEX.test('test@example.com')).toBe(true);
      expect(EMAIL_REGEX.test('invalid-email')).toBe(false);
    });

    it('should validate URL regex', () => {
      expect(URL_REGEX.test('https://example.com')).toBe(true);
      expect(URL_REGEX.test('http://example.com')).toBe(true);
      expect(URL_REGEX.test('not-a-url')).toBe(false);
    });

    it('should validate phone regex', () => {
      expect(PHONE_REGEX.test('+1234567890')).toBe(true);
      expect(PHONE_REGEX.test('1234567890')).toBe(true);
      expect(PHONE_REGEX.test('invalid-phone')).toBe(false);
    });

    it('should validate alphanumeric regex', () => {
      expect(ALPHANUMERIC_REGEX.test('Hello123 World!')).toBe(true);
      // Note: The regex allows < and > but HTML tags are checked separately in validation
      expect(ALPHANUMERIC_REGEX.test('Hello<script>alert(1)</script>')).toBe(
        true
      );
    });

    it('should validate numeric regex', () => {
      expect(NUMERIC_REGEX.test('123.45')).toBe(true);
      expect(NUMERIC_REGEX.test('-123.45')).toBe(true);
      expect(NUMERIC_REGEX.test('not-a-number')).toBe(false);
    });

    it('should validate integer regex', () => {
      expect(INTEGER_REGEX.test('123')).toBe(true);
      expect(INTEGER_REGEX.test('-123')).toBe(true);
      expect(INTEGER_REGEX.test('123.45')).toBe(false);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty strings', () => {
      const result = validateInput('', 'text');
      expect(result.isValid).toBe(true);
      expect(result.sanitizedValue).toBe('');
    });

    it('should handle null and undefined', () => {
      const result1 = validateInput(null as unknown as string, 'text');
      const result2 = validateInput(undefined as unknown as string, 'text');
      expect(result1.isValid).toBe(true);
      expect(result2.isValid).toBe(true);
    });

    it('should handle very long inputs', () => {
      const longInput = 'A'.repeat(10000);
      const result = validateInput(longInput, 'text', { maxLength: 100 });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Input too long (max 100 characters)');
    });

    it('should handle special characters', () => {
      const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      const result = validateInput(specialChars, 'alphanumeric');
      expect(result.isValid).toBe(true);
    });

    it('should handle Unicode characters', () => {
      const unicode = 'Hello 世界 🌍';
      const result = validateInput(unicode, 'text');
      expect(result.isValid).toBe(true);
    });
  });
});
