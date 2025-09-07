/**
 * Toolbar component - extracted from original ToolCanvas
 * Pure UI component for canvas actions
 */

// Toolbar component - pure UI
import { Button } from '../../../shared/Button/Button';
import type { ToolbarProps } from '../../ToolCanvasV2.types';
// CSS inlined in index.html for optimal performance

export const Toolbar = ({
  onAddTool,
  onExport,
  onClear,
  showAddTool,
  hasTools
}: ToolbarProps) => {
  return (
    <header className="toolbar" role="banner">
      <h1 id="main-heading">🛠️ Tool Canvas</h1>
      <nav className="actions" role="toolbar" aria-label="Canvas actions">
        <Button
          variant="primary"
          onClick={onAddTool}
          aria-expanded={showAddTool}
          aria-haspopup="menu"
          aria-label="Add a new tool to the canvas"
        >
          Add Tool
        </Button>
        
        <Button
          variant="outline"
          onClick={onExport}
          disabled={!hasTools}
          aria-label="Export current canvas configuration as JSON file"
        >
          Export
        </Button>
        
        <Button
          variant="destructive"
          onClick={onClear}
          disabled={!hasTools}
          aria-label="Remove all tools from the canvas"
        >
          Clear All
        </Button>
      </nav>
    </header>
  );
};
