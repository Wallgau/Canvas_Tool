/**
 * Accessibility utility functions
 * Reusable functions for improving accessibility across components
 */

/**
 * Announces a message to screen readers using the live region
 * @param message - The message to announce
 */
export const announceToScreenReader = (message: string): void => {
  const liveRegion = document.getElementById('live-region');
  if (liveRegion) {
    liveRegion.textContent = message;
    // Clear after announcement to allow for future announcements
    setTimeout(() => {
      liveRegion.textContent = '';
    }, 1000);
  }
};

/**
 * Focuses an element and announces it to screen readers
 * @param element - The element to focus
 * @param announcement - Optional announcement message
 */
export const focusAndAnnounce = (
  element: HTMLElement,
  announcement?: string
): void => {
  element.focus();
  if (announcement) {
    announceToScreenReader(announcement);
  }
};

/**
 * Creates a unique ID for accessibility attributes
 * @param prefix - The prefix for the ID
 * @returns A unique ID string
 */
export const createAccessibilityId = (prefix: string): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Checks if the user prefers reduced motion
 * @returns True if reduced motion is preferred
 */
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Generates ARIA labels for dynamic content
 * @param action - The action being performed
 * @param item - The item being acted upon
 * @param count - Optional count for pluralization
 * @returns A descriptive ARIA label
 */
export const generateAriaLabel = (
  action: string,
  item: string,
  count?: number
): string => {
  if (count !== undefined && count !== 1) {
    return `${action} ${count} ${item}s`;
  }
  return `${action} ${item}`;
};
