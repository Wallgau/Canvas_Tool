import React, { useCallback, useState, useMemo } from 'react';
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  type Connection,
  type Node,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Toolbar } from '../components/Toolbar';
import { ToolSelector } from '../components/ToolSelector';
import { ConfirmationModal } from '../components/reusable/ConfirmationModal/ConfirmationModal';
import { useToolManagement } from '../hooks/useToolManagement';
import { useToolPersistence } from '../hooks/useToolPersistence';
import type { ToolTemplate, Tool } from '../types';
import type { ToolbarAction } from '../components/Toolbar';
import { ToolCard } from '../components/ToolCard';

// Custom node component for ReactFlow
const ToolNode = ({
  data,
}: {
  data: {
    tool: Tool;
    onDeleteTool: (toolId: string) => void;
    onUpdateTool: (id: string, updates: Partial<Tool>) => void;
  };
}): React.JSX.Element => {
  return (
    <ToolCard
      tool={data.tool}
      onUpdate={data.onUpdateTool}
      onDelete={data.onDeleteTool}
      isNew={false}
    />
  );
};

const ToolCanvasPage: React.FC = (): React.JSX.Element => {
  const { tools, setTools } = useToolPersistence();
  const {
    addTool,
    updateTool,
    clearTools,
    exportTools,
    availableTools,
    deleteTool,
  } = useToolManagement({
    tools,
    setTools,
  });

  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [showToolSelector, setShowToolSelector] = useState<boolean>(false);
  const [showClearConfirmation, setShowClearConfirmation] =
    useState<boolean>(false);

  // Convert tools to ReactFlow nodes
  const reactFlowNodes = useMemo((): Node[] => {
    return tools.map((tool, index) => ({
      id: tool.id,
      type: 'toolNode',
      position: tool.position || { x: 100 + index * 300, y: 100 + index * 200 },
      data: {
        tool: tool,
        onDeleteTool: deleteTool,
        onUpdateTool: updateTool,
      },
      draggable: true,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tools]); // Only tools should trigger recalculation

  // Define custom node types
  const nodeTypes = useMemo(
    () => ({
      toolNode: ToolNode,
    }),
    []
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(reactFlowNodes);

  // Update nodes when tools change
  React.useEffect(() => {
    setNodes(reactFlowNodes);
  }, [reactFlowNodes, setNodes]);

  // Handle node position changes
  const handleNodePositionChange = useCallback(
    (nodeId: string, position: { x: number; y: number }) => {
      // Update the tool position in our tools array
      setTools(prevTools =>
        prevTools.map(tool =>
          tool.id === nodeId ? { ...tool, position } : tool
        )
      );
    },
    [setTools]
  );

  const handleAddTool = useCallback(
    (toolTemplate: ToolTemplate): void => {
      addTool(toolTemplate);
      setShowToolSelector(false);
    },
    [addTool]
  );

  const handleExport = useCallback((): void => {
    exportTools();
  }, [exportTools]);

  const handleClear = useCallback((): void => {
    setShowClearConfirmation(true);
  }, []);

  const handleConfirmClear = useCallback((): void => {
    clearTools();
    setShowClearConfirmation(false);
  }, [clearTools]);

  const handleCancelClear = useCallback((): void => {
    setShowClearConfirmation(false);
  }, []);

  const onConnect = useCallback(
    (params: Connection): void => {
      setEdges(eds => addEdge(params, eds));
    },
    [setEdges]
  );

  const toolbarActions: ToolbarAction[] = [
    {
      id: 'add-tool',
      label: 'Add Tool',
      variant: 'primary',
      onClick: () => setShowToolSelector(true),
      'aria-expanded': showToolSelector,
      'aria-haspopup': 'menu',
      'aria-label': 'Add a new tool to the canvas',
    },
    {
      id: 'export',
      label: 'Export',
      variant: 'outline',
      onClick: handleExport,
      disabled: tools.length === 0,
      'aria-label': 'Export current canvas configuration as JSON file',
    },
    {
      id: 'clear',
      label: 'Clear All',
      variant: 'destructive',
      onClick: handleClear,
      disabled: tools.length === 0,
      'aria-label': 'Remove all tools from the canvas',
    },
  ];

  return (
    <div className='w-full h-screen'>
      <Toolbar title='Tool Canvas' actions={toolbarActions} />

      {showToolSelector && (
        <ToolSelector
          isVisible={showToolSelector}
          availableTools={availableTools}
          onSelectTool={handleAddTool}
          onClose={() => setShowToolSelector(false)}
        />
      )}

      <ConfirmationModal
        isVisible={showClearConfirmation}
        description='Are you sure you want to remove all tools from the canvas?'
        onConfirm={handleConfirmClear}
        onCancel={handleCancelClear}
      />

      <div className='flex-1 h-full bg-white'>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={changes => {
            onNodesChange(changes);
            // Handle position changes
            changes.forEach(change => {
              if (change.type === 'position' && change.position) {
                handleNodePositionChange(change.id, change.position);
              }
            });
          }}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          defaultViewport={{ x: 0, y: 0, zoom: 0 }}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
};

export default ToolCanvasPage;
