/**
 * Input type utilities for determining appropriate input types based on parameter names
 */

import type { InputType } from './inputSanitization';

/**
 * Determines the appropriate input type for a parameter based on its name and tool type
 *
 * @param paramKey - The parameter key/name
 * @param _toolName - The tool name (currently unused but kept for future extensibility)
 * @returns The appropriate InputType for the parameter
 */
export function getInputTypeForParam(paramKey: string): InputType {
  const lowerKey = paramKey.toLowerCase();

  // Email parameters
  if (
    lowerKey.includes('email') ||
    lowerKey === 'to' ||
    lowerKey.includes('recipient')
  ) {
    return 'email';
  }

  // URL parameters
  if (
    lowerKey.includes('url') ||
    lowerKey.includes('link') ||
    lowerKey.includes('href')
  ) {
    return 'url';
  }

  // Phone parameters
  if (
    lowerKey.includes('phone') ||
    lowerKey.includes('mobile') ||
    lowerKey.includes('tel')
  ) {
    return 'phone';
  }

  // Mathematical expression parameters
  if (
    lowerKey.includes('expression') ||
    lowerKey.includes('formula') ||
    lowerKey.includes('equation') ||
    lowerKey.includes('calculation') ||
    lowerKey.includes('math') ||
    lowerKey.includes('calculator') ||
    lowerKey.includes('compute') ||
    lowerKey.includes('calculate')
  ) {
    return 'math';
  }

  // Numeric parameters
  if (
    lowerKey.includes('count') ||
    lowerKey.includes('number') ||
    lowerKey.includes('days') ||
    lowerKey.includes('results') ||
    lowerKey.includes('delay') ||
    lowerKey.includes('timeout')
  ) {
    return 'integer';
  }

  // JSON parameters
  if (
    lowerKey.includes('data') ||
    lowerKey.includes('json') ||
    lowerKey.includes('config')
  ) {
    return 'json';
  }

  // Text parameters
  if (
    lowerKey.includes('message') ||
    lowerKey.includes('description') ||
    lowerKey.includes('text') ||
    lowerKey.includes('query') ||
    lowerKey.includes('subject') ||
    lowerKey.includes('title')
  ) {
    return 'text';
  }

  // Default to alphanumeric for other parameters
  return 'alphanumeric';
}
