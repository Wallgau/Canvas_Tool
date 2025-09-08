import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import App from './App';

// Mock the ToolCanvasV2 component
vi.mock('../components/ToolCanvasV2/ToolCanvasV2', () => ({
  default: (): React.JSX.Element => (
    <div data-testid='tool-canvas-v2'>Tool Canvas V2 Component</div>
  ),
}));

describe('App', () => {
  it('should render the App component', () => {
    render(<App />);

    expect(screen.getByTestId('tool-canvas-v2')).toBeInTheDocument();
  });

  it('should have the correct CSS class', () => {
    const { container } = render(<App />);

    // Check that the element has a class that contains 'App' (CSS module hash)
    expect(container.firstChild).toHaveClass(expect.stringContaining('App'));
  });

  it('should render ToolCanvasV2 component', () => {
    render(<App />);

    expect(screen.getByText('Tool Canvas V2 Component')).toBeInTheDocument();
  });
});
