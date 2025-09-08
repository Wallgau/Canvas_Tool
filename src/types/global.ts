/**
 * Global types used across multiple components
 * This file contains types that are imported and used throughout the application
 */

// Core application types
export interface Tool {
  id: string;
  name: string;
  params: Record<string, string>;
  position: {
    x: number;
    y: number;
  };
}

export interface ToolTemplate {
  name: string;
  displayName: string;
  defaultParams: Record<string, string>;
  description?: string;
}

export interface Position {
  x: number;
  y: number;
}

// Tool management types
export interface ToolManagementState {
  tools: Tool[];
  availableTools: ToolTemplate[];
}

export interface ToolManagementActions {
  addTool: (toolName: string) => string;
  updateTool: (id: string, updates: Partial<Tool>) => void;
  deleteTool: (id: string) => void;
  clearAllTools: () => void;
  reorderTools: (fromIndex: number, toIndex: number) => void;
}

// Export data types
export interface ExportData {
  tools: Tool[];
  timestamp: string;
  version: string;
}

// Predefined tools constant
export const PREDEFINED_TOOLS: ToolTemplate[] = [
  {
    name: 'get_weather',
    displayName: 'Weather Forecast',
    defaultParams: { location: 'Durham, NC', date: 'tomorrow' },
    description: 'Get weather information for any location and date',
  },
  {
    name: 'search_wikipedia',
    displayName: 'Wikipedia Search',
    defaultParams: { query: 'React', language: 'en' },
    description: 'Search Wikipedia articles and get information',
  },
  {
    name: 'send_email',
    displayName: 'Email Sender',
    defaultParams: { to: '', subject: '', body: '' },
    description: 'Compose and send email messages',
  },
  {
    name: 'calculate',
    displayName: 'Calculator',
    defaultParams: { expression: '2 + 2' },
    description: 'Perform mathematical calculations and equations',
  },
  {
    name: 'translate_text',
    displayName: 'Text Translator',
    defaultParams: { text: '', from: 'en', to: 'es' },
    description: 'Translate text between different languages',
  },
];
