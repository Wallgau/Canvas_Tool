/**
 * Canvas component - pure UI for displaying tools
 * Separated from tool management logic
 */

import { memo } from 'react';
import { ToolCard } from '../../../ToolCard/ToolCard';
import type { CanvasProps } from '../../ToolCanvasV2.types';
import type { Tool } from '../../../../types';
// CSS inlined in index.html for optimal performance

export const Canvas = memo(({
  tools,
  canvasSize: _canvasSize, // Currently unused but may be needed for future positioning
  onUpdateTool,
  onDeleteTool,
  onReorderTools,
  className = ''
}: CanvasProps) => {
  
  return (
    <main 
      className={`canvas ${tools.length === 0 ? 'empty' : ''} ${className}`}
      role="main"
      aria-label="Tool canvas area"
    >
      {tools.length === 0 ? (
        <div className="emptyState">
          <h2 className="emptyTitle">No tools on canvas</h2>
          <p className="emptyDescription">
            Click "Add Tool" to start building your tool workflow
          </p>
        </div>
      ) : (
        tools.map((tool, index) => (
          <ToolCard
            key={tool.id}
            tool={tool}
            toolIndex={index}
            onUpdate={(updates: Partial<Tool>) => onUpdateTool(tool.id, updates)}
            onDelete={() => onDeleteTool(tool.id)}
            onMobileReorder={onReorderTools}
          />
        ))
      )}
    </main>
  );
});
