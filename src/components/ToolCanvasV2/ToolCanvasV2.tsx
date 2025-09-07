/**
 * ToolCanvasV2 - Clean architecture version
 * Pure UI component using extracted hooks and utilities
 */

import { useState } from 'react';
import type { ToolCanvasV2Props } from './ToolCanvasV2.types';

// Optimized Hooks  
import { useCanvasSize } from './hooks/useCanvasSize';
import { useToolPersistence } from './hooks/useToolPersistence';
import { useToolManagement } from './hooks/useToolManagement';

// Components
import { Toolbar } from './components/Toolbar/Toolbar';
import { ToolSelector } from './components/ToolSelector/ToolSelector';
import { Canvas } from './components/Canvas/Canvas';

// Utils
import { exportToolsToJSON, canExport } from './utils/fileExport';

// CSS inlined in index.html for optimal performance

// Re-export types for external use
export type { ToolCanvasV2Props } from './ToolCanvasV2.types';

export const ToolCanvasV2 = ({
  className = ''
}: ToolCanvasV2Props) => {
  // State for UI
  const [showToolSelector, setShowToolSelector] = useState(false);
  
  // Optimized hooks with lazy initialization
  const canvasSize = useCanvasSize('canvas');
  
  // Single hook manages tools state with lazy loading and optimized persistence
  const { 
    tools, 
    setTools
  } = useToolPersistence({ 
    canvasSize
  });

  // Start with empty canvas - no default tools
  
  // Tool management operations
  const { 
    addTool, 
    updateTool, 
    deleteTool, 
    clearAllTools, 
    reorderTools,
    availableTools 
  } = useToolManagement({ 
    tools, 
    setTools, 
    canvasSize 
  });

  // Event handlers
  const handleAddTool = () => {
    setShowToolSelector(true);
  };

  const handleSelectTool = (template: any) => {
    addTool(template);
    setShowToolSelector(false);
  };

  const handleCloseSelector = () => {
    setShowToolSelector(false);
  };

  const handleExport = () => {
    if (canExport(tools)) {
      exportToolsToJSON(tools);
    }
  };

  const handleClear = () => {
    clearAllTools();
  };

  // Note: onToolsChange is now handled inside useToolPersistence
  // No useEffect needed here - better performance!

  return (
    <div className={`container ${className}`}>
      <Toolbar
        onAddTool={handleAddTool}
        onExport={handleExport}
        onClear={handleClear}
        showAddTool={showToolSelector}
        hasTools={tools.length > 0}
      />
      
      <Canvas
        tools={tools}
        canvasSize={canvasSize}
        onUpdateTool={updateTool}
        onDeleteTool={deleteTool}
        onReorderTools={reorderTools}
        className="canvas"
      />
      
      {showToolSelector && <ToolSelector
        isVisible={showToolSelector}
        availableTools={availableTools}
        onSelectTool={handleSelectTool}
        onClose={handleCloseSelector}
      />}
    </div>
  );
};
