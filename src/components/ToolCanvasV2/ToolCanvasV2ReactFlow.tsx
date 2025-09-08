import React, { useCallback, useState, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  NodeTypes,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { Tool } from '../../types';
import { ToolCard } from '../ToolCard/ToolCard';
import { ToolSelector } from './components/ToolSelector/ToolSelector';
import { ConfirmationModal } from '../shared/ConfirmationModal/ConfirmationModal';
import { useToolManagement } from './hooks/useToolManagement';
import { useToolPersistence } from './hooks/useToolPersistence';
import { getToolDisplayName } from '../../utils/toolUtils';

// Custom Node Component for Tools
const ToolNode = ({ data }: { data: { tool: Tool; onUpdate: (tool: Tool) => void; onDelete: (id: string) => void } }) => {
  const { tool, onUpdate, onDelete } = data;

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm p-4 min-w-72 hover:border-primary-500 hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-lg text-gray-900">{getToolDisplayName(tool)}</h3>
        <button
          onClick={() => onDelete(tool.id)}
          className="text-red-500 hover:text-red-700 p-1 rounded"
          aria-label={`Delete ${getToolDisplayName(tool)} tool`}
        >
          ×
        </button>
      </div>
      
      <div className="space-y-2">
        {Object.entries(tool.params).map(([key, value]) => (
          <div key={key} className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-600 min-w-20">{key}:</label>
            <span className="text-sm text-gray-900 bg-gray-50 px-2 py-1 rounded flex-1">
              {value || '<empty>'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const nodeTypes: NodeTypes = {
  tool: ToolNode,
};

export const ToolCanvasV2ReactFlow = (): React.JSX.Element => {
  const [showToolSelector, setShowToolSelector] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);

  const {
    tools,
    setTools,
    addTool,
    updateTool,
    deleteTool,
    clearAllTools,
    exportTools,
  } = useToolManagement();

  // Convert tools to ReactFlow nodes
  const initialNodes: Node[] = tools.map((tool) => ({
    id: tool.id,
    type: 'tool',
    position: tool.position,
    data: {
      tool,
      onUpdate: updateTool,
      onDelete: deleteTool,
    },
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Update nodes when tools change
  React.useEffect(() => {
    const newNodes = tools.map((tool) => ({
      id: tool.id,
      type: 'tool',
      position: tool.position,
      data: {
        tool,
        onUpdate: updateTool,
        onDelete: deleteTool,
      },
    }));
    setNodes(newNodes);
  }, [tools, setNodes, updateTool, deleteTool]);

  // Handle node position changes
  const onNodeDragStop = useCallback((_event: React.MouseEvent, node: Node) => {
    const updatedTool = tools.find(t => t.id === node.id);
    if (updatedTool) {
      updateTool(updatedTool.id, {
        ...updatedTool,
        position: node.position,
      });
    }
  }, [tools, updateTool]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleAddTool = () => {
    setShowToolSelector(true);
  };

  const handleSelectTool = (toolTemplate: any) => {
    addTool(toolTemplate);
    setShowToolSelector(false);
  };

  const handleClear = () => {
    setShowClearModal(true);
  };

  const handleConfirmClear = () => {
    clearAllTools();
    setShowClearModal(false);
  };

  const handleExport = () => {
    exportTools();
  };

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Toolbar */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Tool Canvas</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAddTool}
            className="btn-primary"
          >
            Add Tool
          </button>
          <button
            onClick={handleExport}
            disabled={tools.length === 0}
            className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Export
          </button>
          <button
            onClick={handleClear}
            disabled={tools.length === 0}
            className="btn-destructive disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Clear All
          </button>
        </div>
      </header>

      {/* ReactFlow Canvas */}
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDragStop={onNodeDragStop}
          nodeTypes={nodeTypes}
          fitView
          className="bg-gray-50"
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </div>

      {/* Tool Selector Modal */}
      <ToolSelector
        isVisible={showToolSelector}
        availableTools={[]} // You'll need to define available tools
        onSelectTool={handleSelectTool}
        onClose={() => setShowToolSelector(false)}
      />

      {/* Clear Confirmation Modal */}
      <ConfirmationModal
        isOpen={showClearModal}
        title="Clear All Tools"
        message="Are you sure you want to remove all tools from the canvas? This action cannot be undone."
        confirmText="Clear All"
        cancelText="Cancel"
        onConfirm={handleConfirmClear}
        onCancel={() => setShowClearModal(false)}
        variant="danger"
      />
    </div>
  );
};
