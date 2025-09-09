/**
 * Parameter utilities - abstract data manipulation
 */

import type { Tool } from '../../types';

export interface ParameterField {
  name: string;
  value: string;
  id: string;
  isEditing: boolean;
}

export interface ParameterSection {
  hasParameters: boolean;
  fields: ParameterField[];
}

/**
 * Extract parameter fields from tool
 */
export const extractParameterFields = (
  tool: Tool,
  isEditing: boolean,
  editingParam: string | null
): ParameterField[] => {
  if (!tool.params || Object.keys(tool.params).length === 0) {
    return [];
  }

  return Object.entries(tool.params).map(([name, value]) => ({
    name,
    value: value || '',
    id: `${tool.id}-${name}`,
    isEditing: isEditing && editingParam === name,
  }));
};

/**
 * Get parameter section data
 */
export const getParameterSection = (
  tool: Tool,
  isEditing: boolean,
  editingParam: string | null
): ParameterSection => {
  const fields = extractParameterFields(tool, isEditing, editingParam);

  return {
    hasParameters: fields.length > 0,
    fields,
  };
};

/**
 * Get display value for parameter
 */
export const getParameterDisplayValue = (value: string): string => {
  return value || 'Click to edit';
};

/**
 * Check if parameter is being edited
 */
export const isParameterBeingEdited = (
  paramName: string,
  isEditing: boolean,
  editingParam: string | null
): boolean => {
  return isEditing && editingParam === paramName;
};
