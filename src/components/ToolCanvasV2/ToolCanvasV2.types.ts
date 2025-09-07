/**
 * ToolCanvasV2 component types and interfaces
 */

import type { Tool, ToolTemplate } from '../../types';

// Main component props
export interface ToolCanvasV2Props {
  className?: string;
}

// Canvas related types
export interface CanvasSize {
  width: number;
  height: number;
}

export interface Position {
  x: number;
  y: number;
}

// Tool management types
export interface ToolManagementState {
  tools: Tool[];
  availableTools: ToolTemplate[];
  canvasSize: CanvasSize;
}

export interface ToolManagementActions {
  addTool: (template: ToolTemplate) => void;
  updateTool: (id: string, updates: Partial<Tool>) => void;
  deleteTool: (id: string) => void;
  clearAllTools: () => void;
  reorderTools: (fromIndex: number, toIndex: number) => void;
}

// Toolbar types
export interface ToolbarProps {
  onAddTool: () => void;
  onExport: () => void;
  onClear: () => void;
  showAddTool: boolean;
  hasTools: boolean;
}

// Tool selector types
export interface ToolSelectorProps {
  isVisible: boolean;
  availableTools: ToolTemplate[];
  onSelectTool: (template: ToolTemplate) => void;
  onClose: () => void;
}

// Canvas types
export interface CanvasProps {
  tools: Tool[];
  canvasSize: CanvasSize;
  onUpdateTool: (id: string, updates: Partial<Tool>) => void;
  onDeleteTool: (id: string) => void;
  onReorderTools?: (fromIndex: number, toIndex: number) => void;
  className?: string;
}

// Positioning types
export interface PositioningConfig {
  toolWidth: number;
  toolHeight: number;
  spacing: number;
  margin: number;
  rowThreshold: number;
}

// Export types
export interface ExportData {
  tools: Tool[];
  timestamp: string;
  version: string;
}
