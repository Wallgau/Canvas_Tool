/**
 * JSX Type Declarations for React
 * Ensures TypeScript recognizes JSX elements
 */

/// <reference types="react" />

declare global {
  namespace JSX {
    interface Element extends React.JSX.Element {
      // Custom element properties can be added here
      type?: string;
    }
    interface ElementClass extends React.Component {
      // Custom component properties can be added here
      displayName?: string;
    }
    interface ElementAttributesProperty {
      props: Record<string, unknown>;
    }
    interface ElementChildrenAttribute {
      children: Record<string, unknown>;
    }
    interface IntrinsicElements extends React.JSX.IntrinsicElements {
      // Add any custom JSX elements here if needed
      // Example: 'custom-element': { customProp?: string };
      'custom-element'?: { customProp?: string };
    }
  }
}

export {};
