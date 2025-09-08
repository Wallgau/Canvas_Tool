import type { Tool } from '../types';

export const generateTimestamp = (): string => {
  return new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
};

export const generateUniqueId = (): string => {
  // Use crypto.randomUUID if available, fallback to timestamp + random
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString() + Math.random().toString(36).substring(2, 9);
};

export interface ExportData {
  tools: Tool[];
  timestamp: string;
  version: string;
}

export const createExportData = (
  tools: Tool[],
  version: string = '2.0.0'
): ExportData => {
  return {
    tools,
    timestamp: new Date().toISOString(),
    version,
  };
};

export const exportToolsToJSON = (
  tools: Tool[],
  options: {
    filename?: string;
    version?: string;
    mimeType?: string;
  } = {}
): void => {
  const {
    filename = `tool-canvas-${generateTimestamp()}.json`,
    version = '2.0.0',
    mimeType = 'application/json',
  } = options;

  const exportData = createExportData(tools, version);
  const jsonString = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonString], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

export const canExport = (tools: Tool[]): boolean => {
  return tools.length > 0;
};
