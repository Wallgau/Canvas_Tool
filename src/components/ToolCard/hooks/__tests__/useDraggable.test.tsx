import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { useDraggable, useDraggableOptimized } from '../useDraggable';

// Mock mouse events
const createMouseEvent = (
  type: string,
  clientX: number,
  clientY: number
): MouseEvent => {
  return new MouseEvent(type, {
    clientX,
    clientY,
    bubbles: true,
    cancelable: true,
  });
};

const createReactMouseEvent = (
  type: string,
  clientX: number,
  clientY: number
): React.MouseEvent => {
  return {
    type,
    clientX,
    clientY,
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
    target: {
      closest: vi.fn(),
    } as unknown as HTMLElement,
  } as unknown as React.MouseEvent;
};

describe('useDraggable', () => {
  beforeEach(() => {
    // Reset document styles
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
  });

  afterEach(() => {
    // Clean up any event listeners
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
  });

  describe('Basic functionality', () => {
    it('should initialize with default position', () => {
      const { result } = renderHook(() => useDraggable());

      expect(result.current.position).toEqual({ x: 0, y: 0 });
      expect(result.current.isDragging).toBe(false);
    });

    it('should initialize with custom position', () => {
      const initialPosition = { x: 10, y: 20 };
      const { result } = renderHook(() => useDraggable({ initialPosition }));

      expect(result.current.position).toEqual(initialPosition);
    });

    it('should update position when initialPosition changes', () => {
      const { result, rerender } = renderHook(
        ({ initialPosition }) => useDraggable({ initialPosition }),
        { initialProps: { initialPosition: { x: 0, y: 0 } } }
      );

      expect(result.current.position).toEqual({ x: 0, y: 0 });

      rerender({ initialPosition: { x: 10, y: 20 } });

      expect(result.current.position).toEqual({ x: 10, y: 20 });
    });
  });

  describe('Drag functionality', () => {
    it('should not start dragging if target is not a drag handle', () => {
      const { result } = renderHook(() => useDraggable());
      const mockEvent = createReactMouseEvent('mousedown', 100, 100);
      (mockEvent.target as HTMLElement).closest = vi.fn().mockReturnValue(null);

      act(() => {
        result.current.dragProps.onMouseDown(mockEvent);
      });

      expect(result.current.isDragging).toBe(false);
    });

    it('should start dragging when clicking on drag handle', () => {
      const { result } = renderHook(() => useDraggable());
      const mockEvent = createReactMouseEvent('mousedown', 100, 100);
      (mockEvent.target as HTMLElement).closest.mockReturnValue({});

      act(() => {
        result.current.dragProps.onMouseDown(mockEvent);
      });

      expect(result.current.isDragging).toBe(true);
      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });

    it('should update position during drag', () => {
      const { result } = renderHook(() => useDraggable());
      const mockEvent = createReactMouseEvent('mousedown', 100, 100);
      (mockEvent.target as HTMLElement).closest.mockReturnValue({});

      // Start dragging
      act(() => {
        result.current.dragProps.onMouseDown(mockEvent);
      });

      expect(result.current.isDragging).toBe(true);

      // Simulate mouse move
      const moveEvent = createMouseEvent('mousemove', 200, 200);
      act(() => {
        document.dispatchEvent(moveEvent);
      });

      // Position should be updated (100px = 6.25rem at 16px base)
      expect(result.current.position.x).toBeCloseTo(6.25, 2);
      expect(result.current.position.y).toBeCloseTo(6.25, 2);
    });

    it('should prevent negative positions', () => {
      const { result } = renderHook(() => useDraggable());
      const mockEvent = createReactMouseEvent('mousedown', 100, 100);
      (mockEvent.target as HTMLElement).closest.mockReturnValue({});

      // Start dragging
      act(() => {
        result.current.dragProps.onMouseDown(mockEvent);
      });

      // Simulate mouse move to negative position
      const moveEvent = createMouseEvent('mousemove', 50, 50);
      act(() => {
        document.dispatchEvent(moveEvent);
      });

      // Position should be clamped to 0
      expect(result.current.position.x).toBe(0);
      expect(result.current.position.y).toBe(0);
    });

    it('should end dragging on mouse up', () => {
      const onDragEnd = vi.fn();
      const { result } = renderHook(() => useDraggable({ onDragEnd }));
      const mockEvent = createReactMouseEvent('mousedown', 100, 100);
      (mockEvent.target as HTMLElement).closest.mockReturnValue({});

      // Start dragging
      act(() => {
        result.current.dragProps.onMouseDown(mockEvent);
      });

      expect(result.current.isDragging).toBe(true);

      // Simulate mouse up
      const upEvent = createMouseEvent('mouseup', 200, 200);
      act(() => {
        document.dispatchEvent(upEvent);
      });

      expect(result.current.isDragging).toBe(false);
      expect(onDragEnd).toHaveBeenCalledWith(result.current.position);
    });

    it('should restore document styles on drag end', () => {
      const { result } = renderHook(() => useDraggable());
      const mockEvent = createReactMouseEvent('mousedown', 100, 100);
      (mockEvent.target as HTMLElement).closest.mockReturnValue({});

      // Start dragging
      act(() => {
        result.current.dragProps.onMouseDown(mockEvent);
      });

      expect(document.body.style.userSelect).toBe('none');
      expect(document.body.style.cursor).toBe('grabbing');

      // End dragging
      const upEvent = createMouseEvent('mouseup', 200, 200);
      act(() => {
        document.dispatchEvent(upEvent);
      });

      expect(document.body.style.userSelect).toBe('');
      expect(document.body.style.cursor).toBe('');
    });
  });

  describe('Drag props', () => {
    it('should return correct drag props', () => {
      const { result } = renderHook(() =>
        useDraggable({ initialPosition: { x: 10, y: 20 } })
      );

      expect(result.current.dragProps).toEqual({
        onMouseDown: expect.any(Function),
        style: {
          position: 'absolute',
          left: '10rem',
          top: '20rem',
          transform: 'scale(1)',
          transition: 'transform 0.2s ease',
          zIndex: 1,
          boxShadow: undefined,
        },
      });
    });

    it('should update style when dragging', () => {
      const { result } = renderHook(() => useDraggable());
      const mockEvent = createReactMouseEvent('mousedown', 100, 100);
      (mockEvent.target as HTMLElement).closest.mockReturnValue({});

      // Start dragging
      act(() => {
        result.current.dragProps.onMouseDown(mockEvent);
      });

      expect(result.current.dragProps.style?.transform).toBe('scale(1.05)');
      expect(result.current.dragProps.style?.transition).toBe('none');
      expect(result.current.dragProps.style?.zIndex).toBe(1000);
      expect(result.current.dragProps.style?.boxShadow).toBe(
        '0 0.75rem 1.875rem rgba(0, 0, 0, 0.2)'
      );
    });
  });

  describe('pxToRem conversion', () => {
    it('should convert pixels to rem correctly', () => {
      const { result } = renderHook(() => useDraggable());
      const mockEvent = createReactMouseEvent('mousedown', 0, 0);
      (mockEvent.target as HTMLElement).closest.mockReturnValue({});

      // Start dragging
      act(() => {
        result.current.dragProps.onMouseDown(mockEvent);
      });

      // Move 160px (should be 10rem)
      const moveEvent = createMouseEvent('mousemove', 160, 160);
      act(() => {
        document.dispatchEvent(moveEvent);
      });

      expect(result.current.position.x).toBe(10);
      expect(result.current.position.y).toBe(10);
    });
  });
});

describe('useDraggableOptimized', () => {
  beforeEach(() => {
    // Reset document styles
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
  });

  afterEach(() => {
    // Clean up any event listeners
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
  });

  it('should initialize with default position', () => {
    const { result } = renderHook(() => useDraggableOptimized());

    expect(result.current.position).toEqual({ x: 0, y: 0 });
    expect(result.current.isDragging).toBe(false);
  });

  it('should handle dragging with optimized version', () => {
    const onDragEnd = vi.fn();
    const { result } = renderHook(() => useDraggableOptimized({ onDragEnd }));
    const mockEvent = createReactMouseEvent('mousedown', 100, 100);
    (mockEvent.target as HTMLElement).closest = vi.fn().mockReturnValue({});

    // Start dragging
    act(() => {
      result.current.dragProps.onMouseDown(mockEvent);
    });

    expect(result.current.isDragging).toBe(true);

    // Simulate mouse move
    const moveEvent = createMouseEvent('mousemove', 200, 200);
    act(() => {
      document.dispatchEvent(moveEvent);
    });

    // Simulate mouse up
    const upEvent = createMouseEvent('mouseup', 200, 200);
    act(() => {
      document.dispatchEvent(upEvent);
    });

    expect(result.current.isDragging).toBe(false);
    expect(onDragEnd).toHaveBeenCalled();
  });

  it('should update position when initialPosition changes', () => {
    const { result, rerender } = renderHook(
      ({ initialPosition }) => useDraggableOptimized({ initialPosition }),
      { initialProps: { initialPosition: { x: 0, y: 0 } } }
    );

    expect(result.current.position).toEqual({ x: 0, y: 0 });

    rerender({ initialPosition: { x: 15, y: 25 } });

    expect(result.current.position).toEqual({ x: 15, y: 25 });
  });
});
