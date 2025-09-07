/**
 * File export utilities - extracted from original ToolCanvas
 */

import type { Tool } from '../../../types';
import type { ExportData } from '../ToolCanvasV2.types';
import { FILE_EXPORT_CONSTANTS } from './constants';

/**
 * Generate a timestamp string for file naming
 */
export const generateTimestamp = (): string => {
  return new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
};

/**
 * Create export data object
 */
export const createExportData = (tools: Tool[]): ExportData => {
  return {
    tools,
    timestamp: new Date().toISOString(),
    version: FILE_EXPORT_CONSTANTS.VERSION
  };
};

/**
 * Export tools to JSON file and trigger download
 */
export const exportToolsToJSON = (tools: Tool[]): void => {
  const exportData = createExportData(tools);
  const jsonString = JSON.stringify(exportData, null, 2);
  
  // Create blob and URL
  const blob = new Blob([jsonString], { type: FILE_EXPORT_CONSTANTS.MIME_TYPE });
  const url = URL.createObjectURL(blob);
  
  // Generate filename with timestamp
  const timestamp = generateTimestamp();
  const filename = `${FILE_EXPORT_CONSTANTS.FILE_PREFIX}-${timestamp}.json`;
  
  // Create temporary download link
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL
  URL.revokeObjectURL(url);
  
  console.log('Exported JSON file:', filename);
};

/**
 * Validate if data can be exported
 */
export const canExport = (tools: Tool[]): boolean => {
  return tools.length > 0;
};
