/**
 * JSX Type Declarations for React
 * Ensures TypeScript recognizes JSX elements
 */

/// <reference types="react" />

declare global {
  namespace JSX {
    interface IntrinsicElements extends React.JSX.IntrinsicElements {}
  }
}

export {};

