/**
 * UI utility functions
 * Reusable functions for UI interactions and styling
 */

/**
 * Debounce function to limit the rate of function execution
 * @param func - The function to debounce
 * @param wait - The number of milliseconds to delay
 * @returns The debounced function
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>): void => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function to limit the rate of function execution
 * @param func - The function to throttle
 * @param limit - The number of milliseconds to throttle
 * @returns The throttled function
 */
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return (...args: Parameters<T>): void => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Check if an element is in the viewport
 * @param element - The element to check
 * @returns True if the element is in the viewport
 */
export const isInViewport = (element: Element): boolean => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

/**
 * Smooth scroll to an element
 * @param element - The element to scroll to
 * @param offset - Optional offset from the top
 */
export const scrollToElement = (element: Element, offset: number = 0): void => {
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth',
  });
};

/**
 * Get the computed style value for an element
 * @param element - The element to get the style from
 * @param property - The CSS property name
 * @returns The computed style value
 */
export const getComputedStyleValue = (
  element: Element,
  property: string
): string => {
  return window.getComputedStyle(element).getPropertyValue(property);
};

/**
 * Add or remove a CSS class with animation support
 * @param element - The element to modify
 * @param className - The class name to add/remove
 * @param add - Whether to add (true) or remove (false) the class
 */
export const toggleClass = (
  element: Element,
  className: string,
  add: boolean
): void => {
  if (add) {
    element.classList.add(className);
  } else {
    element.classList.remove(className);
  }
};

/**
 * Check if the user prefers reduced motion
 * @returns True if reduced motion is preferred
 */
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get the appropriate animation duration based on user preferences
 * @param normalDuration - The normal animation duration in milliseconds
 * @returns The appropriate duration (0 if reduced motion is preferred)
 */
export const getAnimationDuration = (normalDuration: number): number => {
  return prefersReducedMotion() ? 0 : normalDuration;
};

/**
 * Create a CSS custom property value
 * @param property - The property name
 * @param value - The property value
 * @returns The CSS custom property string
 */
export const createCSSVariable = (property: string, value: string): string => {
  return `--${property}: ${value};`;
};

/**
 * Get the z-index for a given layer
 * @param layer - The layer name
 * @returns The z-index value
 */
export const getZIndex = (
  layer: 'modal' | 'tooltip' | 'dropdown' | 'overlay'
): number => {
  const zIndexMap = {
    modal: 1000,
    tooltip: 1100,
    dropdown: 1200,
    overlay: 1300,
  };

  return zIndexMap[layer];
};
