/**
 * Input Sanitization and Validation Utilities
 * Provides comprehensive input sanitization for security and data integrity
 */

// HTML sanitization patterns
const HTML_TAGS_REGEX = /<[^>]*>/g;
const SCRIPT_TAGS_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
// const JAVASCRIPT_URL_REGEX = /javascript:/gi;
// const DATA_URL_REGEX = /data:(?!image\/[png|jpg|jpeg|gif|webp])/gi;

// XSS prevention patterns
const XSS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
  /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
  /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
  /<link\b[^<]*(?:(?!<\/link>)<[^<]*)*<\/link>/gi,
  /<meta\b[^<]*(?:(?!<\/meta>)<[^<]*)*<\/meta>/gi,
  /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi,
  /on\w+\s*=/gi, // Event handlers like onclick, onload, etc.
  /javascript:/gi,
  /vbscript:/gi,
  /data:text\/html/gi,
  /expression\s*\(/gi, // CSS expressions
  /url\s*\(/gi, // CSS url() functions
];

// SQL injection patterns - cleaned up and more comprehensive
const SQL_INJECTION_PATTERNS = [
  // Most specific patterns first
  /'\s*;\s*drop\s+table\s+users\s*;\s*--/gi,
  /'\s*;\s*drop\s+table\s+\w+\s*;\s*--/gi,
  /drop\s+table\s+users\s*;\s*--/gi,
  /drop\s+table\s+\w+\s*;\s*--/gi,
  /'\s*;\s*drop\s+table\s+\w+/gi,
  /'\s*;\s*drop\s+table\s+users/gi,
  // General patterns
  /union\s+select/gi,
  /drop\s+table/gi,
  /insert\s+into/gi,
  /delete\s+from/gi,
  /update\s+set/gi,
  /exec\s*\(/gi,
  /execute\s*\(/gi,
  /;\s*--/gi,
  /\/\*.*?\*\//gi,
  /'\s*or\s*'1'\s*=\s*'1/gi,
  /'\s*or\s*1\s*=\s*1/gi,
  /'\s*union\s*select/gi,
  /'\s*drop\s*table/gi,
  /'\s*insert\s*into/gi,
  /'\s*delete\s*from/gi,
  /'\s*update\s*set/gi,
  /;\s*drop\s+table/gi,
  /;\s*delete\s+from/gi,
  /;\s*insert\s+into/gi,
  /;\s*update\s+set/gi,
  /;\s*union\s+select/gi,
];

// Input validation patterns
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_REGEX = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
const PHONE_REGEX = /^[+]?[1-9][\d]{0,15}$/;
const ALPHANUMERIC_REGEX =
  /^[a-zA-Z0-9\s\-_.,!?@#$%^&*()+={}[\]|\\:";'/~`<>]*$/; // Include < and > but check for HTML tags separately
const HTML_TAG_REGEX = /<[a-zA-Z][^>]*>/g; // More specific: must start with a letter
const NUMERIC_REGEX = /^-?\d+(\.\d+)?$/;
const INTEGER_REGEX = /^-?\d+$/;

// Maximum lengths for different input types
const MAX_LENGTHS = {
  EMAIL: 254,
  URL: 2048,
  PHONE: 20,
  TEXT: 1000,
  JSON: 10000,
  ALPHANUMERIC: 1000,
} as const;

export type InputType =
  | 'text'
  | 'email'
  | 'url'
  | 'phone'
  | 'numeric'
  | 'integer'
  | 'alphanumeric'
  | 'json';

export interface SanitizationOptions {
  maxLength?: number;
  trimWhitespace?: boolean;
  removeEmptyLines?: boolean;
  normalizeUnicode?: boolean;
  escapeHtml?: boolean;
  allowHtml?: boolean;
  type?: InputType;
}

export interface ValidationResult {
  isValid: boolean;
  sanitizedValue: string;
  errors: string[];
  warnings: string[];
}

/**
 * Sanitizes HTML content by removing dangerous elements and attributes
 */
export function sanitizeHtml(
  input: string,
  options: SanitizationOptions = {}
): string {
  if (input == null) return '';

  let sanitized = String(input);

  // Always remove dangerous content, even if HTML is allowed
  SCRIPT_TAGS_REGEX.lastIndex = 0;
  sanitized = sanitized.replace(SCRIPT_TAGS_REGEX, '');

  // Remove dangerous attributes
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/vbscript:/gi, '');

  if (!options.allowHtml) {
    // Remove all HTML tags
    sanitized = sanitized.replace(HTML_TAGS_REGEX, '');
  }

  if (options.escapeHtml) {
    sanitized = sanitized
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }

  return sanitized;
}

/**
 * Sanitizes text input by removing XSS and SQL injection patterns
 */
export function sanitizeText(
  input: string,
  options: SanitizationOptions = {}
): string {
  // Handle null/undefined inputs
  if (input == null) {
    return '';
  }

  let sanitized = String(input);

  // Trim whitespace if requested
  if (options.trimWhitespace !== false) {
    sanitized = sanitized.trim();
  }

  // Remove empty lines if requested
  if (options.removeEmptyLines) {
    sanitized = sanitized.replace(/^\s*[\r\n]/gm, '');
  }

  // Normalize Unicode if requested
  if (options.normalizeUnicode) {
    sanitized = sanitized.normalize('NFC');
  }

  // Remove SQL injection patterns
  SQL_INJECTION_PATTERNS.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });

  // Remove XSS patterns
  XSS_PATTERNS.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });

  // Limit length
  const maxLength = options.maxLength || MAX_LENGTHS.TEXT;
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
}

/**
 * Validates and sanitizes input based on type
 */
export function validateInput(
  input: string,
  type: InputType,
  options: SanitizationOptions = {}
): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    sanitizedValue: '',
    errors: [],
    warnings: [],
  };

  // Handle null/undefined inputs
  if (input == null) {
    result.sanitizedValue = '';
    return result;
  }

  let sanitizedValue = String(input);

  // Apply length validation first
  const maxLength =
    options.maxLength ||
    MAX_LENGTHS[type.toUpperCase() as keyof typeof MAX_LENGTHS] ||
    MAX_LENGTHS.TEXT;
  if (sanitizedValue.length > maxLength) {
    result.errors.push(`Input too long (max ${maxLength} characters)`);
    result.isValid = false;
    sanitizedValue = sanitizedValue.substring(0, maxLength);
  }

  // Check for HTML tags in alphanumeric input before sanitization
  if (
    type === 'alphanumeric' &&
    sanitizedValue &&
    HTML_TAG_REGEX.test(sanitizedValue)
  ) {
    result.errors.push('HTML tags are not allowed in alphanumeric input');
    result.isValid = false;
  }

  // Apply sanitization
  if (type === 'json') {
    sanitizedValue = sanitizeJsonData(sanitizedValue);
  } else {
    sanitizedValue = sanitizeText(sanitizedValue, options);
  }

  // Validate based on type
  switch (type) {
    case 'email':
      if (sanitizedValue && !EMAIL_REGEX.test(sanitizedValue)) {
        result.errors.push('Invalid email format');
        result.isValid = false;
      }
      break;

    case 'url':
      if (sanitizedValue && !URL_REGEX.test(sanitizedValue)) {
        result.errors.push('Invalid URL format');
        result.isValid = false;
      }
      break;

    case 'phone':
      if (sanitizedValue && !PHONE_REGEX.test(sanitizedValue)) {
        result.errors.push('Invalid phone number format');
        result.isValid = false;
      }
      break;

    case 'numeric':
      if (sanitizedValue && !NUMERIC_REGEX.test(sanitizedValue)) {
        result.errors.push('Invalid numeric format');
        result.isValid = false;
      }
      break;

    case 'integer':
      if (sanitizedValue && !INTEGER_REGEX.test(sanitizedValue)) {
        result.errors.push('Invalid integer format');
        result.isValid = false;
      }
      break;

    case 'alphanumeric':
      if (sanitizedValue && !ALPHANUMERIC_REGEX.test(sanitizedValue)) {
        result.errors.push(
          'Only alphanumeric characters, spaces, and basic punctuation allowed'
        );
        result.isValid = false;
      }
      break;

    case 'json':
      try {
        JSON.parse(sanitizedValue);
      } catch {
        result.errors.push('Invalid JSON format');
        result.isValid = false;
      }
      break;

    case 'text':
    default:
      // Basic text validation - no additional checks
      break;
  }

  result.sanitizedValue = sanitizedValue;
  return result;
}

/**
 * Sanitizes tool parameters based on tool type
 */
export function sanitizeToolParams(
  params: Record<string, unknown>
): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(params)) {
    if (value == null) {
      sanitized[key] = '';
      continue;
    }

    const stringValue = String(value);
    let inputType: InputType = 'text';

    // Determine input type based on parameter key and tool name
    const lowerKey = key.toLowerCase();
    // const lowerToolName = toolName.toLowerCase();

    if (
      lowerKey.includes('email') ||
      lowerKey.includes('to') ||
      lowerKey.includes('recipient')
    ) {
      inputType = 'email';
    } else if (
      lowerKey.includes('url') ||
      lowerKey.includes('link') ||
      lowerKey.includes('href')
    ) {
      inputType = 'url';
    } else if (
      lowerKey.includes('phone') ||
      lowerKey.includes('mobile') ||
      lowerKey.includes('tel')
    ) {
      inputType = 'phone';
    } else if (
      lowerKey.includes('count') ||
      lowerKey.includes('number') ||
      lowerKey.includes('days') ||
      lowerKey.includes('results')
    ) {
      inputType = 'integer';
    } else if (
      lowerKey.includes('data') ||
      lowerKey.includes('json') ||
      lowerKey.includes('config')
    ) {
      inputType = 'json';
    } else if (
      lowerKey.includes('message') ||
      lowerKey.includes('description') ||
      lowerKey.includes('text')
    ) {
      inputType = 'text';
    } else {
      inputType = 'alphanumeric';
    }

    const validation = validateInput(stringValue, inputType, {
      maxLength: 1000,
      trimWhitespace: true,
      escapeHtml: true,
    });

    // Try to preserve original type if it's a number, or convert string numbers for numeric fields
    if (
      typeof value === 'number' &&
      !isNaN(Number(validation.sanitizedValue))
    ) {
      sanitized[key] = Number(validation.sanitizedValue);
    } else if (
      inputType === 'integer' &&
      !isNaN(Number(validation.sanitizedValue))
    ) {
      sanitized[key] = Number(validation.sanitizedValue);
    } else {
      sanitized[key] = validation.sanitizedValue;
    }
  }

  return sanitized;
}

/**
 * Sanitizes complete tool data
 */
export function sanitizeToolData(
  tool: Record<string, unknown>
): Record<string, unknown> {
  return {
    id: sanitizeText(tool.id as string, {
      maxLength: 100,
      type: 'alphanumeric',
    }),
    name: sanitizeText(tool.name as string, {
      maxLength: 50,
      type: 'alphanumeric',
    }),
    params: sanitizeToolParams(tool.params as Record<string, unknown>),
    position: {
      x: Math.max(
        0,
        Math.min(
          10000,
          Number((tool.position as Record<string, unknown>)?.x) || 0
        )
      ),
      y: Math.max(
        0,
        Math.min(
          10000,
          Number((tool.position as Record<string, unknown>)?.y) || 0
        )
      ),
    },
  };
}

/**
 * Sanitizes JSON data before parsing
 */
export function sanitizeJsonData(jsonString: string): string {
  let sanitized = String(jsonString);

  // Remove script tags
  sanitized = sanitized.replace(SCRIPT_TAGS_REGEX, '');

  // Remove XSS patterns
  XSS_PATTERNS.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });

  return sanitized;
}

/**
 * Validates and sanitizes localStorage data
 */
export function validateLocalStorageData(data: string): {
  isValid: boolean;
  sanitizedData: unknown;
  errors: string[];
} {
  try {
    const parsed = JSON.parse(data);

    if (!Array.isArray(parsed)) {
      return {
        isValid: false,
        sanitizedData: [],
        errors: ['Data must be an array of tools'],
      };
    }

    const sanitized = parsed.map(tool => sanitizeToolData(tool));

    return {
      isValid: true,
      sanitizedData: sanitized,
      errors: [],
    };
  } catch {
    return {
      isValid: false,
      sanitizedData: [],
      errors: ['Invalid JSON data'],
    };
  }
}

export {
  MAX_LENGTHS,
  EMAIL_REGEX,
  URL_REGEX,
  PHONE_REGEX,
  ALPHANUMERIC_REGEX,
  NUMERIC_REGEX,
  INTEGER_REGEX,
};
