/**
 * Tests for inputTypeUtils
 */

import { getInputTypeForParam } from '../inputTypeUtils';

describe('getInputTypeForParam', () => {
  it('should return email for email-related parameters', () => {
    expect(getInputTypeForParam('email', 'test-tool')).toBe('email');
    expect(getInputTypeForParam('to', 'test-tool')).toBe('email');
    expect(getInputTypeForParam('recipient', 'test-tool')).toBe('email');
    expect(getInputTypeForParam('userEmail', 'test-tool')).toBe('email');
  });

  it('should return url for URL-related parameters', () => {
    expect(getInputTypeForParam('url', 'test-tool')).toBe('url');
    expect(getInputTypeForParam('link', 'test-tool')).toBe('url');
    expect(getInputTypeForParam('href', 'test-tool')).toBe('url');
    expect(getInputTypeForParam('websiteUrl', 'test-tool')).toBe('url');
  });

  it('should return phone for phone-related parameters', () => {
    expect(getInputTypeForParam('phone', 'test-tool')).toBe('phone');
    expect(getInputTypeForParam('mobile', 'test-tool')).toBe('phone');
    expect(getInputTypeForParam('tel', 'test-tool')).toBe('phone');
    expect(getInputTypeForParam('phoneNumber', 'test-tool')).toBe('phone');
  });

  it('should return integer for numeric parameters', () => {
    expect(getInputTypeForParam('count', 'test-tool')).toBe('integer');
    expect(getInputTypeForParam('number', 'test-tool')).toBe('integer');
    expect(getInputTypeForParam('days', 'test-tool')).toBe('integer');
    expect(getInputTypeForParam('results', 'test-tool')).toBe('integer');
    expect(getInputTypeForParam('delay', 'test-tool')).toBe('integer');
    expect(getInputTypeForParam('timeout', 'test-tool')).toBe('integer');
  });

  it('should return json for JSON-related parameters', () => {
    expect(getInputTypeForParam('data', 'test-tool')).toBe('json');
    expect(getInputTypeForParam('json', 'test-tool')).toBe('json');
    expect(getInputTypeForParam('config', 'test-tool')).toBe('json');
    expect(getInputTypeForParam('jsonData', 'test-tool')).toBe('json');
  });

  it('should return text for text-related parameters', () => {
    expect(getInputTypeForParam('message', 'test-tool')).toBe('text');
    expect(getInputTypeForParam('description', 'test-tool')).toBe('text');
    expect(getInputTypeForParam('text', 'test-tool')).toBe('text');
    expect(getInputTypeForParam('query', 'test-tool')).toBe('text');
    expect(getInputTypeForParam('subject', 'test-tool')).toBe('text');
    expect(getInputTypeForParam('title', 'test-tool')).toBe('text');
  });

  it('should return alphanumeric for unknown parameters', () => {
    expect(getInputTypeForParam('unknown', 'test-tool')).toBe('alphanumeric');
    expect(getInputTypeForParam('custom', 'test-tool')).toBe('alphanumeric');
    expect(getInputTypeForParam('param', 'test-tool')).toBe('alphanumeric');
  });

  it('should be case insensitive', () => {
    expect(getInputTypeForParam('EMAIL', 'test-tool')).toBe('email');
    expect(getInputTypeForParam('URL', 'test-tool')).toBe('url');
    expect(getInputTypeForParam('Phone', 'test-tool')).toBe('phone');
    expect(getInputTypeForParam('Count', 'test-tool')).toBe('integer');
  });

  it('should handle partial matches', () => {
    expect(getInputTypeForParam('userEmail', 'test-tool')).toBe('email');
    expect(getInputTypeForParam('websiteUrl', 'test-tool')).toBe('url');
    expect(getInputTypeForParam('phoneNumber', 'test-tool')).toBe('phone');
    expect(getInputTypeForParam('resultCount', 'test-tool')).toBe('integer');
  });
});
