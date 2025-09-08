/**
 * Utility functions for working with tools
 */

import type { Tool, ToolTemplate } from '../types';
import { PREDEFINED_TOOLS } from '../types';

/**
 * Gets the display name for a tool based on its template
 *
 * @param tool - The tool object
 * @returns The display name for the tool
 */
export function getToolDisplayName(tool: Tool): string {
  const toolTemplate = PREDEFINED_TOOLS.find(t => t.name === tool.name);
  return toolTemplate?.displayName || tool.name;
}

/**
 * Gets the tool template for a given tool
 *
 * @param tool - The tool object
 * @returns The tool template or undefined if not found
 */
export function getToolTemplate(tool: Tool): ToolTemplate | undefined {
  return PREDEFINED_TOOLS.find(t => t.name === tool.name);
}
