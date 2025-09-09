import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useParameterEditing } from '../useParameterEditing';
import type { Tool } from '../../../../types';

// Mock the parameter editing utilities
vi.mock('../../utils/parameterEditing', () => ({
  createParameterEditingState: vi.fn((tool: Tool) => ({
    isEditing: true,
    editParams: { ...tool.params },
    editingParam: null,
    validationErrors: {},
  })),
  createParameterEditingActions: vi.fn(() => ({
    handleParamChange: vi.fn(),
    startEditing: vi.fn(),
    handleKeyPress: vi.fn(),
    handleSaveParams: vi.fn(),
    handleCancelEdit: vi.fn(),
  })),
}));

describe('useParameterEditing', () => {
  const mockTool: Tool = {
    id: 'test-tool-1',
    name: 'test_tool',
    params: {
      param1: 'initial value 1',
      param2: 'initial value 2',
    },
    position: { x: 100, y: 200 },
  };

  const mockOnUpdate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() =>
      useParameterEditing({ tool: mockTool, onUpdate: mockOnUpdate })
    );

    expect(result.current.isEditing).toBe(true);
    expect(result.current.editParams).toEqual({
      param1: 'initial value 1',
      param2: 'initial value 2',
    });
    expect(result.current.editingParam).toBe(null);
    expect(result.current.validationErrors).toEqual({});
  });

  it('should provide all required methods', () => {
    const { result } = renderHook(() =>
      useParameterEditing({ tool: mockTool, onUpdate: mockOnUpdate })
    );

    expect(typeof result.current.handleParamChange).toBe('function');
    expect(typeof result.current.startEditing).toBe('function');
    expect(typeof result.current.handleKeyPress).toBe('function');
    expect(typeof result.current.handleSaveParams).toBe('function');
    expect(typeof result.current.handleCancelEdit).toBe('function');
    expect(typeof result.current.setValidationErrors).toBe('function');
  });

  it('should call createParameterEditingState with the tool', async () => {
    const { createParameterEditingState } = await import(
      '../../utils/parameterEditing'
    );

    renderHook(() =>
      useParameterEditing({ tool: mockTool, onUpdate: mockOnUpdate })
    );

    expect(createParameterEditingState).toHaveBeenCalledWith(mockTool);
  });

  it('should call createParameterEditingActions with correct config', async () => {
    const { createParameterEditingActions } = await import(
      '../../utils/parameterEditing'
    );

    renderHook(() =>
      useParameterEditing({ tool: mockTool, onUpdate: mockOnUpdate })
    );

    expect(createParameterEditingActions).toHaveBeenCalledWith(
      expect.objectContaining({
        tool: mockTool,
        onUpdate: mockOnUpdate,
      }),
      expect.any(Object),
      expect.any(Function)
    );
  });

  it('should update validation errors when setValidationErrors is called', () => {
    const { result } = renderHook(() =>
      useParameterEditing({ tool: mockTool, onUpdate: mockOnUpdate })
    );

    const newErrors = {
      param1: ['Error message 1', 'Error message 2'],
      param2: ['Error message 3'],
    };

    act(() => {
      result.current.setValidationErrors(newErrors);
    });

    expect(result.current.validationErrors).toEqual(newErrors);
  });

  it('should replace validation errors when setValidationErrors is called', () => {
    const { result } = renderHook(() =>
      useParameterEditing({ tool: mockTool, onUpdate: mockOnUpdate })
    );

    // Set initial errors
    act(() => {
      result.current.setValidationErrors({
        param1: ['Initial error'],
      });
    });

    // Replace with new errors
    const newErrors = {
      param2: ['New error'],
    };

    act(() => {
      result.current.setValidationErrors(newErrors);
    });

    expect(result.current.validationErrors).toEqual({
      param2: ['New error'],
    });
  });

  it('should clear validation errors when empty object is passed', () => {
    const { result } = renderHook(() =>
      useParameterEditing({ tool: mockTool, onUpdate: mockOnUpdate })
    );

    // Set initial errors
    act(() => {
      result.current.setValidationErrors({
        param1: ['Error 1'],
        param2: ['Error 2'],
      });
    });

    // Clear errors
    act(() => {
      result.current.setValidationErrors({});
    });

    expect(result.current.validationErrors).toEqual({});
  });

  it('should handle tool updates correctly', () => {
    const updatedTool: Tool = {
      ...mockTool,
      params: {
        param1: 'updated value 1',
        param2: 'updated value 2',
        param3: 'new param',
      },
    };

    const { result, rerender } = renderHook(
      ({ tool, onUpdate }) => useParameterEditing({ tool, onUpdate }),
      {
        initialProps: { tool: mockTool, onUpdate: mockOnUpdate },
      }
    );

    // Rerender with updated tool
    rerender({ tool: updatedTool, onUpdate: mockOnUpdate });

    // The hook should still work with the updated tool
    expect(result.current.isEditing).toBe(true);
    expect(typeof result.current.handleParamChange).toBe('function');
  });

  it('should provide consistent method types across rerenders', () => {
    const { result, rerender } = renderHook(
      ({ tool, onUpdate }) => useParameterEditing({ tool, onUpdate }),
      {
        initialProps: { tool: mockTool, onUpdate: mockOnUpdate },
      }
    );

    // Rerender with same props
    rerender({ tool: mockTool, onUpdate: mockOnUpdate });

    // Methods should still be functions
    expect(typeof result.current.handleParamChange).toBe('function');
    expect(typeof result.current.startEditing).toBe('function');
    expect(typeof result.current.handleKeyPress).toBe('function');
    expect(typeof result.current.handleSaveParams).toBe('function');
    expect(typeof result.current.handleCancelEdit).toBe('function');
    expect(typeof result.current.setValidationErrors).toBe('function');
  });
});
