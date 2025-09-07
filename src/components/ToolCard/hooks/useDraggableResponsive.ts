import { useState, useRef, useEffect, useCallback } from 'react';

interface Position {
  x: number;
  y: number;
}

interface UseDraggableResponsiveOptions {
  onDragEnd?: (position: Position) => void;
  onMobileReorder?: (dragIndex: number, hoverIndex: number) => void;
  initialPosition?: Position;
  toolIndex?: number; // For mobile reordering
}

/**
 * Responsive drag hook that handles:
 * - Desktop: Free positioning with absolute coordinates
 * - Mobile: Reordering within flexbox layout
 */
export const useDraggableResponsive = ({ 
  onDragEnd, 
  onMobileReorder,
  initialPosition = { x: 0, y: 0 },
  toolIndex = 0
}: UseDraggableResponsiveOptions = {}) => {
  const [position, setPosition] = useState<Position>(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobileReordering, setIsMobileReordering] = useState(false);
  
  // Store current values in refs to avoid stale closures
  const positionRef = useRef(position);
  const onDragEndRef = useRef(onDragEnd);
  const onMobileReorderRef = useRef(onMobileReorder);
  const isDraggingRef = useRef(false);
  
  // Keep refs in sync
  positionRef.current = position;
  onDragEndRef.current = onDragEnd;
  onMobileReorderRef.current = onMobileReorder;
  isDraggingRef.current = isDragging;
  
  const dragInfo = useRef({
    startX: 0,
    startY: 0,
    startLeft: 0,
    startTop: 0,
    startIndex: toolIndex
  });

  const pxToRem = (px: number) => px / 16;

  /**
   * Detect if we're on a mobile device based on viewport width
   */
  const isMobileViewport = useCallback((): boolean => {
    return typeof window !== 'undefined' && window.innerWidth <= 768;
  }, []);

  /**
   * Handle mobile reordering logic
   */
  const handleMobileReorder = useCallback((e: MouseEvent) => {
    const currentY = e.clientY;
    const startY = dragInfo.current.startY;
    const deltaY = currentY - startY;
    
    // Calculate how many positions we've moved (approximate)
    const itemHeight = 120; // Approximate tool card height in pixels
    const positionsMoved = Math.round(deltaY / itemHeight);
    const newIndex = Math.max(0, dragInfo.current.startIndex + positionsMoved);
    
    // Only trigger reorder if we've moved to a different position
    if (newIndex !== dragInfo.current.startIndex && onMobileReorderRef.current) {
      onMobileReorderRef.current(dragInfo.current.startIndex, newIndex);
      dragInfo.current.startIndex = newIndex; // Update for continuous dragging
    }
  }, []);

  /**
   * Handle desktop free positioning
   */
  const handleDesktopPosition = useCallback((e: MouseEvent) => {
    const deltaX = e.clientX - dragInfo.current.startX;
    const deltaY = e.clientY - dragInfo.current.startY;
    
    const deltaXRem = pxToRem(deltaX);
    const deltaYRem = pxToRem(deltaY);
    
    const newPosition = {
      x: Math.max(0, dragInfo.current.startLeft + deltaXRem),
      y: Math.max(0, dragInfo.current.startTop + deltaYRem)
    };
    
    setPosition(newPosition);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.drag-handle')) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const isMobile = isMobileViewport();
    
    setIsDragging(true);
    setIsMobileReordering(isMobile);
    
    dragInfo.current = {
      startX: e.clientX,
      startY: e.clientY,
      startLeft: positionRef.current.x,
      startTop: positionRef.current.y,
      startIndex: toolIndex
    };
    
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'grabbing';
  }, [toolIndex, isMobileViewport]);

  // Mouse move and up handlers
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      
      if (isMobileReordering) {
        handleMobileReorder(e);
      } else {
        handleDesktopPosition(e);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsMobileReordering(false);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
      
      // Only call onDragEnd for desktop positioning
      if (!isMobileReordering && onDragEndRef.current) {
        onDragEndRef.current(positionRef.current);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isMobileReordering, handleMobileReorder, handleDesktopPosition]);

  // Update position when initialPosition changes
  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition.x, initialPosition.y]);

  // Generate responsive styles
  const getResponsiveStyles = () => {
    const isMobile = isMobileViewport();
    
    if (isMobile) {
      // Mobile: Use static positioning, allow flexbox to handle layout
      return {
        position: 'static' as const,
        transform: isDragging ? 'scale(1.02) rotate(2deg)' : 'scale(1)',
        transition: isDragging ? 'none' : 'transform 0.2s ease',
        zIndex: isDragging ? 1000 : 1,
        opacity: isDragging ? 0.8 : 1,
        boxShadow: isDragging ? '0 0.5rem 1rem rgba(0, 0, 0, 0.3)' : undefined,
      };
    } else {
      // Desktop: Use absolute positioning for free placement
      return {
        position: 'absolute' as const,
        left: `${position.x + 2}rem`,
        top: `${position.y}rem`,
        transform: isDragging ? 'scale(1.05)' : 'scale(1)',
        transition: isDragging ? 'none' : 'transform 0.2s ease',
        zIndex: isDragging ? 1000 : 1,
        boxShadow: isDragging ? '0 0.75rem 1.875rem rgba(0, 0, 0, 0.2)' : undefined,
      };
    }
  };

  return {
    position,
    isDragging,
    isMobileReordering,
    dragProps: {
      onMouseDown: handleMouseDown,
      style: getResponsiveStyles()
    }
  };
};
