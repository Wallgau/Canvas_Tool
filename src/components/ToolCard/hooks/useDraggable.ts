import { useState, useRef, useEffect } from 'react';

interface Position {
  x: number;
  y: number;
}

interface UseDraggableOptions {
  onDragEnd?: (position: Position) => void;
  initialPosition?: Position;
}

export const useDraggable = ({
  onDragEnd,
  initialPosition = { x: 0, y: 0 },
}: UseDraggableOptions = {}): {
  position: Position;
  isDragging: boolean;
  dragProps: {
    onMouseDown: (e: React.MouseEvent) => void;
  };
} => {
  const [position, setPosition] = useState<Position>(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const dragInfo = useRef({
    startX: 0,
    startY: 0,
    startLeft: 0,
    startTop: 0,
  });

  // Convert pixels to rem (1rem = 16px typically)
  const pxToRem = (px: number): number => px / 16;

  const handleMouseDown = (e: React.MouseEvent): void => {
    // Only drag if clicking on the drag handle
    const target = e.target as HTMLElement;
    if (!target.closest('.drag-handle')) return;

    e.preventDefault();
    e.stopPropagation();

    setIsDragging(true);

    dragInfo.current = {
      startX: e.clientX,
      startY: e.clientY,
      startLeft: position.x,
      startTop: position.y,
    };

    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'grabbing';
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent): void => {
      if (!isDragging) return;

      e.preventDefault();

      const deltaX = e.clientX - dragInfo.current.startX;
      const deltaY = e.clientY - dragInfo.current.startY;

      // Convert pixel deltas to rem
      const deltaXRem = pxToRem(deltaX);
      const deltaYRem = pxToRem(deltaY);

      const newPosition = {
        x: Math.max(0, dragInfo.current.startLeft + deltaXRem),
        y: Math.max(0, dragInfo.current.startTop + deltaYRem),
      };

      setPosition(newPosition);
    };

    const handleMouseUp = (): void => {
      if (isDragging) {
        setIsDragging(false);
        document.body.style.userSelect = '';
        document.body.style.cursor = '';

        if (onDragEnd) {
          onDragEnd(position);
        }
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return (): void => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, position, onDragEnd, initialPosition]);

  // Update position when initialPosition changes
  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition]);

  return {
    position,
    isDragging,
    dragProps: {
      onMouseDown: handleMouseDown,
      style: {
        position: 'absolute' as const,
        left: `${position.x}rem`,
        top: `${position.y}rem`,
        transform: isDragging ? 'scale(1.05)' : 'scale(1)',
        transition: isDragging ? 'none' : 'transform 0.2s ease',
        zIndex: isDragging ? 1000 : 1,
        boxShadow: isDragging
          ? '0 0.75rem 1.875rem rgba(0, 0, 0, 0.2)'
          : undefined,
      },
    },
  };
};

//REFACTOR to avoid extra re-renders
export const useDraggableOptimized = ({
  onDragEnd,
  initialPosition = { x: 0, y: 0 },
}: UseDraggableOptions = {}): {
  position: Position;
  isDragging: boolean;
  dragProps: {
    onMouseDown: (e: React.MouseEvent) => void;
  };
} => {
  const [position, setPosition] = useState<Position>(initialPosition);
  const [isDragging, setIsDragging] = useState(false);

  // Store current values in refs to avoid stale closures
  const positionRef = useRef(position);
  const onDragEndRef = useRef(onDragEnd);
  const isDraggingRef = useRef(false);

  // Keep refs in sync
  positionRef.current = position;
  onDragEndRef.current = onDragEnd;
  isDraggingRef.current = isDragging;

  const dragInfo = useRef({
    startX: 0,
    startY: 0,
    startLeft: 0,
    startTop: 0,
  });

  const pxToRem = (px: number): number => px / 16;

  const handleMouseDown = (e: React.MouseEvent): void => {
    const target = e.target as HTMLElement;
    if (!target.closest('.drag-handle')) return;

    e.preventDefault();
    e.stopPropagation();

    setIsDragging(true);

    dragInfo.current = {
      startX: e.clientX,
      startY: e.clientY,
      startLeft: positionRef.current.x,
      startTop: positionRef.current.y,
    };

    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'grabbing';
  };

  // ✅ FIXED: Only depend on isDragging, use refs for current values
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent): void => {
      e.preventDefault();

      const deltaX = e.clientX - dragInfo.current.startX;
      const deltaY = e.clientY - dragInfo.current.startY;

      const deltaXRem = pxToRem(deltaX);
      const deltaYRem = pxToRem(deltaY);

      const newPosition = {
        x: Math.max(0, dragInfo.current.startLeft + deltaXRem),
        y: Math.max(0, dragInfo.current.startTop + deltaYRem),
      };

      setPosition(newPosition);
    };

    const handleMouseUp = (): void => {
      setIsDragging(false);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';

      // ✅ FIXED: Use ref to get current position
      if (onDragEndRef.current) {
        onDragEndRef.current(positionRef.current);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return (): void => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, initialPosition]); // ✅ Include initialPosition dependency

  // Update position when initialPosition changes
  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition]);

  return {
    position,
    isDragging,
    dragProps: {
      onMouseDown: handleMouseDown,
      style: {
        position: 'absolute' as const,
        left: `${position.x}rem`,
        top: `${position.y}rem`,
        transform: isDragging ? 'scale(1.05)' : 'scale(1)',
        transition: isDragging ? 'none' : 'transform 0.2s ease',
        zIndex: isDragging ? 1000 : 1,
        boxShadow: isDragging
          ? '0 0.75rem 1.875rem rgba(0, 0, 0, 0.2)'
          : undefined,
      },
    },
  };
};
