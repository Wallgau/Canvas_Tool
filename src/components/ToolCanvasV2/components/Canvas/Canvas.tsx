/**
 * Canvas component - pure UI for displaying tools
 * Separated from tool management logic
 */

import React, { memo } from 'react';
import { ToolCard } from '../../../ToolCard/ToolCard';
import type { Tool } from '../../../../types';
// CSS inlined in index.html for optimal performance

export const Canvas = memo(
  ({
    tools,
    onUpdateTool,
    onDeleteTool,
    className = '',
    newlyAddedToolId,
  }: {
    tools: Tool[];
    onUpdateTool: (id: string, updates: Partial<Tool>) => void;
    onDeleteTool: (id: string) => void;
    className?: string;
    newlyAddedToolId?: string | null;
  }): React.JSX.Element => {
    return (
      <section
        id='main-content'
        className={`canvas ${tools.length === 0 ? 'empty' : ''} ${className}`}
        aria-label='Tool canvas area'
      >
        {tools.length === 0 ? (
          <div className='emptyState' role='status' aria-live='polite'>
            <h2 className='emptyTitle'>No tools on canvas</h2>
            <p className='emptyDescription'>
              Click "Add Tool" to start building your tool workflow
            </p>
          </div>
        ) : (
          tools.map(tool => (
            <ToolCard
              key={tool.id}
              tool={tool}
              onUpdate={(updates: Partial<Tool>) =>
                onUpdateTool(tool.id, updates)
              }
              onDelete={() => onDeleteTool(tool.id)}
              isNew={tool.id === newlyAddedToolId}
            />
          ))
        )}
      </section>
    );
  }
);
