import '@testing-library/jest-dom';
import { vi, afterEach } from 'vitest';

// Memory management for tests
afterEach(() => {
  // Clear all mocks after each test
  vi.clearAllMocks();
  
  // Clear timers
  vi.clearAllTimers();
  
  // Force garbage collection if available
  if (global.gc) {
    global.gc();
  }
});

// Reduce memory usage
process.setMaxListeners(0);
