/**
 * Desktop-only drag hook for free positioning
 * Simplified version without mobile responsive logic
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { Position } from '../../../types/global';
import { pxToRem } from '../../../utils/positioning';

interface UseDraggableDesktopOptions {
  onDragEnd?: (position: Position) => void;
  initialPosition?: Position;
}

export const useDraggableDesktop = ({
  onDragEnd,
  initialPosition = { x: 0, y: 0 },
}: UseDraggableDesktopOptions = {}): {
  position: Position;
  isDragging: boolean;
  dragProps: {
    onMouseDown: (e: React.MouseEvent) => void;
    style?: React.CSSProperties;
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

  /**
   * Handle desktop free positioning
   */
  const handleDesktopPosition = useCallback((e: MouseEvent): void => {
    const deltaX = e.clientX - dragInfo.current.startX;
    const deltaY = e.clientY - dragInfo.current.startY;

    const deltaXRem = pxToRem(deltaX);
    const deltaYRem = pxToRem(deltaY);

    const newPosition = {
      x: Math.max(0, dragInfo.current.startLeft + deltaXRem),
      y: Math.max(0, dragInfo.current.startTop + deltaYRem),
    };

    setPosition(newPosition);
  }, []);

  const handleMouseUp = useCallback((): void => {
    if (!isDraggingRef.current) return;

    setIsDragging(false);

    // Call onDragEnd with final position
    if (onDragEndRef.current) {
      onDragEndRef.current(positionRef.current);
    }

    // Remove global event listeners
    document.removeEventListener('mousemove', handleDesktopPosition);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleDesktopPosition]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-drag-handle="true"]')) return;

      e.preventDefault();
      e.stopPropagation();

      setIsDragging(true);

      // Store initial positions
      dragInfo.current.startX = e.clientX;
      dragInfo.current.startY = e.clientY;
      dragInfo.current.startLeft = positionRef.current.x;
      dragInfo.current.startTop = positionRef.current.y;

      // Add global event listeners
      document.addEventListener('mousemove', handleDesktopPosition);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [handleDesktopPosition, handleMouseUp]
  );

  // Cleanup on unmount
  useEffect(() => {
    return (): void => {
      document.removeEventListener('mousemove', handleDesktopPosition);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleDesktopPosition, handleMouseUp]);

  // Update position when initialPosition changes
  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition]);

  return {
    dragProps: {
      onMouseDown: handleMouseDown,
      style: {
        position: 'absolute' as const,
        left: `${position.x}rem`,
        top: `${position.y}rem`,
        cursor: isDragging ? 'grabbing' : 'grab',
      } as React.CSSProperties,
    },
    isDragging,
    position,
  };
};
