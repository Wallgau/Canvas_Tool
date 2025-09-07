/**
 * Custom hook for managing canvas size - extracted from original ToolCanvas
 */

import { useState, useEffect } from 'react';
import type { CanvasSize } from '../ToolCanvasV2.types';
import { CANVAS_CONSTANTS } from '../utils/constants';

export const useCanvasSize = (canvasClassName: string) => {
  const [canvasSize, setCanvasSize] = useState<CanvasSize>({
    width: CANVAS_CONSTANTS.DEFAULT_CANVAS_WIDTH,
    height: CANVAS_CONSTANTS.DEFAULT_CANVAS_HEIGHT
  });

  useEffect(() => {
    const updateCanvasSize = () => {
      const canvasElement = document.querySelector(`.${canvasClassName}`);
      if (canvasElement) {
        const rect = canvasElement.getBoundingClientRect();
        setCanvasSize({ 
          width: rect.width - CANVAS_CONSTANTS.CANVAS_PADDING_PX,
          height: rect.height - CANVAS_CONSTANTS.CANVAS_PADDING_PX
        });
      }
    };

    // Initial size calculation
    updateCanvasSize();
    
    // Listen for resize events
    window.addEventListener('resize', updateCanvasSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [canvasClassName]);

  return canvasSize;
};
