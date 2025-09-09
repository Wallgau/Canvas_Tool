/**
 * Tests for inputTypeUtils
 */

import { getInputTypeForParam } from '../inputTypeUtils';

describe('getInputTypeForParam', () => {
  it('should return email for email-related parameters', () => {
    expect(getInputTypeForParam('email')).toBe('email');
    expect(getInputTypeForParam('to')).toBe('email');
    expect(getInputTypeForParam('recipient')).toBe('email');
    expect(getInputTypeForParam('userEmail')).toBe('email');
  });

  it('should return url for URL-related parameters', () => {
    expect(getInputTypeForParam('url')).toBe('url');
    expect(getInputTypeForParam('link')).toBe('url');
    expect(getInputTypeForParam('href')).toBe('url');
    expect(getInputTypeForParam('websiteUrl')).toBe('url');
  });

  it('should return phone for phone-related parameters', () => {
    expect(getInputTypeForParam('phone')).toBe('phone');
    expect(getInputTypeForParam('mobile')).toBe('phone');
    expect(getInputTypeForParam('tel')).toBe('phone');
    expect(getInputTypeForParam('phoneNumber')).toBe('phone');
  });

  it('should return integer for numeric parameters', () => {
    expect(getInputTypeForParam('count')).toBe('integer');
    expect(getInputTypeForParam('number')).toBe('integer');
    expect(getInputTypeForParam('days')).toBe('integer');
    expect(getInputTypeForParam('results')).toBe('integer');
    expect(getInputTypeForParam('delay')).toBe('integer');
    expect(getInputTypeForParam('timeout')).toBe('integer');
  });

  it('should return json for JSON-related parameters', () => {
    expect(getInputTypeForParam('data')).toBe('json');
    expect(getInputTypeForParam('json')).toBe('json');
    expect(getInputTypeForParam('config')).toBe('json');
    expect(getInputTypeForParam('jsonData')).toBe('json');
  });

  it('should return text for text-related parameters', () => {
    expect(getInputTypeForParam('message')).toBe('text');
    expect(getInputTypeForParam('description')).toBe('text');
    expect(getInputTypeForParam('text')).toBe('text');
    expect(getInputTypeForParam('query')).toBe('text');
    expect(getInputTypeForParam('subject')).toBe('text');
    expect(getInputTypeForParam('title')).toBe('text');
  });

  it('should return alphanumeric for unknown parameters', () => {
    expect(getInputTypeForParam('unknown')).toBe('alphanumeric');
    expect(getInputTypeForParam('custom')).toBe('alphanumeric');
    expect(getInputTypeForParam('param')).toBe('alphanumeric');
  });

  it('should be case insensitive', () => {
    expect(getInputTypeForParam('EMAIL')).toBe('email');
    expect(getInputTypeForParam('URL')).toBe('url');
    expect(getInputTypeForParam('Phone')).toBe('phone');
    expect(getInputTypeForParam('Count')).toBe('integer');
  });

  it('should handle partial matches', () => {
    expect(getInputTypeForParam('userEmail')).toBe('email');
    expect(getInputTypeForParam('websiteUrl')).toBe('url');
    expect(getInputTypeForParam('phoneNumber')).toBe('phone');
    expect(getInputTypeForParam('resultCount')).toBe('integer');
  });

  it('should detect math expression parameters', () => {
    expect(getInputTypeForParam('expression')).toBe('math');
    expect(getInputTypeForParam('formula')).toBe('math');
    expect(getInputTypeForParam('equation')).toBe('math');
    expect(getInputTypeForParam('calculation')).toBe('math');
    expect(getInputTypeForParam('math')).toBe('math');
    expect(getInputTypeForParam('calculator')).toBe('math');
    expect(getInputTypeForParam('compute')).toBe('math');
    expect(getInputTypeForParam('calculate')).toBe('math');
  });

  it('should handle math parameter partial matches', () => {
    expect(getInputTypeForParam('mathExpression')).toBe('math');
    expect(getInputTypeForParam('calculatorFormula')).toBe('math');
    expect(getInputTypeForParam('computeResult')).toBe('math');
  });
});
