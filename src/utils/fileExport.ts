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

export const exportToolsToJSON = (tools: Tool[]): void => {
  const exportData = tools.map(tool => ({
    name: tool.name,
    params: tool.params,
    position: tool.position
  }));
  
  const jsonString = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const filename = `tool-canvas-${generateTimestamp()}.json`;
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};
