/**
 * Tests for useParameterEditing hook
 */

import { renderHook, act } from '@testing-library/react';
import { useParameterEditing } from '../useParameterEditing';
import type { Tool } from '../../../../types';

import { vi } from 'vitest';

// Mock the utility functions
vi.mock('../../../../utils/inputSanitization', () => ({
  validateInput: vi.fn((value: string) => ({
    sanitizedValue: value,
    warnings: [],
    errors: [],
  })),
}));

vi.mock('../../../../utils/inputTypeUtils', () => ({
  getInputTypeForParam: vi.fn(() => 'text'),
}));

describe('useParameterEditing', () => {
  const mockTool: Tool = {
    id: 'test-tool-1',
    name: 'get_weather',
    params: { location: 'Durham, NC', date: 'tomorrow' },
    position: { x: 0, y: 0 },
  };

  const mockOnUpdate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() =>
      useParameterEditing({ tool: mockTool, onUpdate: mockOnUpdate })
    );

    expect(result.current.isEditing).toBe(false);
    expect(result.current.editParams).toEqual(mockTool.params);
    expect(result.current.editingParam).toBe(null);
  });

  it('should start editing when startEditing is called', () => {
    const { result } = renderHook(() =>
      useParameterEditing({ tool: mockTool, onUpdate: mockOnUpdate })
    );

    act(() => {
      result.current.startEditing('location');
    });

    expect(result.current.isEditing).toBe(true);
    expect(result.current.editingParam).toBe('location');
  });

  it('should handle parameter changes', () => {
    const { result } = renderHook(() =>
      useParameterEditing({ tool: mockTool, onUpdate: mockOnUpdate })
    );

    act(() => {
      result.current.handleParamChange('location', 'New York, NY');
    });

    expect(result.current.editParams).toEqual({
      ...mockTool.params,
      location: 'New York, NY',
    });
  });

  it('should save parameters and call onUpdate', () => {
    const { result } = renderHook(() =>
      useParameterEditing({ tool: mockTool, onUpdate: mockOnUpdate })
    );

    // First change a parameter
    act(() => {
      result.current.handleParamChange('location', 'New York, NY');
    });

    // Then save
    act(() => {
      result.current.handleSaveParams();
    });

    expect(mockOnUpdate).toHaveBeenCalledWith({
      ...mockTool,
      params: {
        ...mockTool.params,
        location: 'New York, NY',
      },
    });
    expect(result.current.isEditing).toBe(false);
    expect(result.current.editingParam).toBe(null);
  });

  it('should cancel editing and reset parameters', () => {
    const { result } = renderHook(() =>
      useParameterEditing({ tool: mockTool, onUpdate: mockOnUpdate })
    );

    // First change a parameter
    act(() => {
      result.current.handleParamChange('location', 'New York, NY');
    });

    // Then cancel
    act(() => {
      result.current.handleCancelEdit();
    });

    expect(result.current.editParams).toEqual(mockTool.params);
    expect(result.current.isEditing).toBe(false);
    expect(result.current.editingParam).toBe(null);
    expect(mockOnUpdate).not.toHaveBeenCalled();
  });

  it('should handle keyboard events for editing', () => {
    const { result } = renderHook(() =>
      useParameterEditing({ tool: mockTool, onUpdate: mockOnUpdate })
    );

    const mockEvent = {
      key: 'Enter',
      preventDefault: vi.fn(),
    } as React.KeyboardEvent<HTMLInputElement>;

    act(() => {
      result.current.handleKeyPress(mockEvent, 'location');
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(result.current.isEditing).toBe(true);
    expect(result.current.editingParam).toBe('location');
  });
});
