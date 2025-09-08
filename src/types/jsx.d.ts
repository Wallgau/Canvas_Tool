/**
 * JSX Type Declarations for React
 * Ensures TypeScript recognizes JSX elements
 */

/// <reference types="react" />

declare global {
  namespace JSX {
    interface Element extends React.JSX.Element {}
    interface ElementClass extends React.Component {}
    interface ElementAttributesProperty {
      props: {};
    }
    interface ElementChildrenAttribute {
      children: {};
    }
    interface IntrinsicElements extends React.JSX.IntrinsicElements {
      // Add any custom JSX elements here if needed
    }
  }
}

export {};
