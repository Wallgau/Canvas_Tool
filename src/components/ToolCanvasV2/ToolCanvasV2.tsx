/**
 * ToolCanvasV2 - Clean architecture version
 * Pure UI component using extracted hooks and utilities
 */

import React, { useState, lazy, Suspense } from 'react';
import type { ToolCanvasV2Props, ToolTemplate } from '../../types';

// Optimized Hooks
import { useToolPersistence } from './hooks/useToolPersistence';
import { useToolManagement } from './hooks/useToolManagement';

// Components
import { Toolbar } from './components/Toolbar/Toolbar';
import { Canvas } from './components/Canvas/Canvas';

// Lazy load heavy components
const ToolSelector = lazy(() =>
  import('./components/ToolSelector/ToolSelector').then(m => ({
    default: m.ToolSelector,
  }))
);
const ConfirmationModal = lazy(() =>
  import('../shared/ConfirmationModal').then(m => ({
    default: m.ConfirmationModal,
  }))
);

// Utils
import { exportToolsToJSON, canExport } from '../../utils/fileExport';
import { announceToScreenReader } from '../../utils/accessibility';

// CSS inlined in index.html for optimal performance

// Types are now exported from src/types/components.ts

const ToolCanvasV2 = ({ className = '' }: ToolCanvasV2Props): React.JSX.Element => {
  // State for UI
  const [showToolSelector, setShowToolSelector] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [newlyAddedToolId, setNewlyAddedToolId] = useState<string | null>(null);

  // Single hook manages tools state with lazy loading and optimized persistence
  const { tools, setTools } = useToolPersistence();

  // Start with empty canvas - no default tools

  // Tool management operations
  const { addTool, updateTool, deleteTool, clearAllTools, availableTools } =
    useToolManagement({
      tools,
      setTools,
    });

  // Event handlers
  const handleAddTool = (): void => {
    setShowToolSelector(true);
    // Announce to screen readers
    announceToScreenReader('Tool selector opened. Use arrow keys to navigate and Enter to select.');
  };

  const handleSelectTool = (template: ToolTemplate): void => {
    // Add the tool and get the new tool ID
    const newToolId = addTool(template);

    // Set the newly added tool ID for focus management
    setNewlyAddedToolId(newToolId);

    setShowToolSelector(false);

    // Announce to screen readers
    announceToScreenReader(`${template.displayName} tool added to canvas.`);

    // Clear the newly added tool ID after a delay
    setTimeout(() => {
      setNewlyAddedToolId(null);
    }, 2000);
  };

  const handleCloseSelector = (): void => {
    setShowToolSelector(false);
    announceToScreenReader('Tool selector closed.');
  };

  const handleExport = (): void => {
    // Early return if no tools to avoid unnecessary operations
    if (tools.length === 0) return;

    if (canExport(tools)) {
      exportToolsToJSON(tools);
      announceToScreenReader(`Exported ${tools.length} tools to JSON file.`);
    }
  };

  const handleClear = (): void => {
    setShowClearModal(true);
  };

  const handleConfirmClear = (): void => {
    clearAllTools();
    setShowClearModal(false);
    announceToScreenReader('All tools cleared from canvas.');
  };

  const handleCancelClear = (): void => {
    setShowClearModal(false);
  };

  // Note: onToolsChange is now handled inside useToolPersistence
  // No useEffect needed here - better performance!

  return (
    <div
      className={`container ${className}`}
      role='main'
      aria-label='Tool Canvas Workspace'
    >
      <Toolbar
        onAddTool={handleAddTool}
        onExport={handleExport}
        onClear={handleClear}
        showAddTool={showToolSelector}
        hasTools={tools.length > 0}
      />

      <Canvas
        tools={tools}
        onUpdateTool={updateTool}
        onDeleteTool={deleteTool}
        className='canvas'
        newlyAddedToolId={newlyAddedToolId}
      />

      {showToolSelector && (
        <Suspense
          fallback={<div className='loading-placeholder'>Loading tools...</div>}
        >
          <ToolSelector
            isVisible={showToolSelector}
            availableTools={availableTools}
            onSelectTool={handleSelectTool}
            onClose={handleCloseSelector}
          />
        </Suspense>
      )}

      <Suspense fallback={null}>
        <ConfirmationModal
          isOpen={showClearModal}
          title='Clear All Tools'
          message='Are you sure you want to clear all tools? This action cannot be undone.'
          confirmText='Clear All'
          cancelText='Cancel'
          onConfirm={handleConfirmClear}
          onCancel={handleCancelClear}
          variant='danger'
        />
      </Suspense>

      {/* Live region for screen reader announcements */}
      <div
        id='live-region'
        aria-live='polite'
        aria-atomic='true'
        className='sr-only'
        style={{
          position: 'absolute',
          left: '-10000px',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
      >
        {tools.length === 0
          ? 'Canvas is empty. Add tools to get started.'
          : `${tools.length} tool${tools.length === 1 ? '' : 's'} on canvas.`}
      </div>
    </div>
  );
};

export default ToolCanvasV2;
