/**
 * Performance optimization utilities
 * Focus on Core Web Vitals: FCP, LCP, TBT, CLS
 */

// Debounce function for performance-critical operations
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>): void => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle function for scroll/resize events
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

// Request idle callback with fallback
export const requestIdleCallback = (
  callback: () => void,
  options?: { timeout?: number }
): number => {
  if ('requestIdleCallback' in window) {
    return window.requestIdleCallback(callback, options);
  }
  return setTimeout(callback, options?.timeout || 0) as unknown as number;
};

// Cancel idle callback with fallback
export const cancelIdleCallback = (id: number): void => {
  if ('cancelIdleCallback' in window) {
    window.cancelIdleCallback(id);
  } else {
    clearTimeout(id);
  }
};

// Intersection Observer for lazy loading
export const createIntersectionObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
): IntersectionObserver | null => {
  if ('IntersectionObserver' in window) {
    return new IntersectionObserver(callback, options);
  }
  return null;
};

// Preload critical resources
export const preloadResource = (href: string, as: string): void => {
  if (document.querySelector(`link[href="${href}"]`)) return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (as === 'style') {
    link.onload = (): void => {
      link.rel = 'stylesheet';
    };
  }
  document.head.appendChild(link);
};

// Optimize images with lazy loading
export const optimizeImage = (img: HTMLImageElement): void => {
  img.loading = 'lazy';
  img.decoding = 'async';
};

// Performance monitoring
export const measurePerformance = (name: string, fn: () => void): void => {
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
    const start = performance.now();
    fn();
    const end = performance.now();
    // eslint-disable-next-line no-console
    console.log(`${name} took ${end - start} milliseconds`);
  } else {
    fn();
  }
};

// Critical resource hints
export const addResourceHints = (): void => {
  // Preconnect to external domains if needed
  // Preload critical CSS
  preloadResource('/src/styles/app.css', 'style');

  // DNS prefetch for external resources
  const dnsPrefetch = document.createElement('link');
  dnsPrefetch.rel = 'dns-prefetch';
  dnsPrefetch.href = '//fonts.googleapis.com';
  document.head.appendChild(dnsPrefetch);
};

// Optimize scroll performance
export const optimizeScroll = (): void => {
  // Use passive event listeners for better scroll performance
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function (
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void {
    if (type === 'scroll' || type === 'touchmove') {
      options = typeof options === 'boolean' ? options : {};
      if (typeof options === 'object') {
        options.passive = true;
      }
    }
    return originalAddEventListener.call(this, type, listener, options);
  };
};

// Initialize performance optimizations
export const initPerformanceOptimizations = (): void => {
  addResourceHints();
  optimizeScroll();
};
