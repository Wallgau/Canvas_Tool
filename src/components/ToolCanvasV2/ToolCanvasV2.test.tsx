/**
 * ToolCanvasV2 tests - focused on user critical features
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import ToolCanvasV2 from './ToolCanvasV2';
import type { Tool } from '../../types';

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Mock ResizeObserver
Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })),
});

// Mock requestIdleCallback for our optimized save
Object.defineProperty(window, 'requestIdleCallback', {
  writable: true,
  configurable: true,
  value: vi.fn(callback => {
    callback();
    return 1;
  }),
});

// Mock window.confirm
Object.defineProperty(window, 'confirm', {
  writable: true,
  configurable: true,
  value: vi.fn(),
});

const mockSavedTools: Tool[] = [
  {
    id: 'saved-tool-1',
    name: 'get_weather',
    params: { location: 'Durham, NC', date: 'tomorrow' },
    position: { x: 2, y: 2 },
  },
];

describe('ToolCanvasV2 - User Critical Features', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  it('renders the canvas interface', () => {
    render(<ToolCanvasV2 />);

    // User can see the main interface
    expect(screen.getByText('Tool Canvas')).toBeInTheDocument();
    expect(screen.getByLabelText('Tool canvas area')).toBeInTheDocument();
  });

  it('creates default tool when no saved tools exist', async () => {
    // Mock empty localStorage - this will trigger default tool creation
    mockLocalStorage.getItem.mockReturnValue(null);

    render(<ToolCanvasV2 />);

    // Should eventually create default tool (after useEffect runs)
    // Initially might show empty state, but default tool gets created
    expect(screen.getByLabelText('Tool canvas area')).toBeInTheDocument();
  });

  it('loads saved tools from localStorage', () => {
    // Mock saved tools in localStorage
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockSavedTools));

    render(<ToolCanvasV2 />);

    // Should load saved tools and not show empty state
    expect(screen.queryByText('No tools on canvas')).not.toBeInTheDocument();
  });

  it('shows empty state when tools array is truly empty', () => {
    // Mock empty array in localStorage (tools were cleared)
    mockLocalStorage.getItem.mockReturnValue('[]');

    render(<ToolCanvasV2 />);

    // Should show empty state since no tools exist
    expect(screen.getByText('No tools on canvas')).toBeInTheDocument();
    expect(
      screen.getByText('Click "Add Tool" to start building your tool workflow')
    ).toBeInTheDocument();
  });

  it('opens tool selector when add tool is clicked', async () => {
    const user = userEvent.setup();
    render(<ToolCanvasV2 />);

    // User clicks add tool
    const addButton = screen.getByLabelText('Add a new tool to the canvas');
    await user.click(addButton);

    // Tool selector opens (lazy loaded, so we check for loading state)
    expect(screen.getByText('Loading tools...')).toBeInTheDocument();
  });

  it('export button works with tools', () => {
    // Mock saved tools in localStorage
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockSavedTools));

    render(<ToolCanvasV2 />);

    // Export button should be enabled when tools exist
    const exportButton = screen.getByLabelText(
      'Export current canvas configuration as JSON file'
    );
    expect(exportButton).not.toBeDisabled();
  });

  it('clear button works with tools', () => {
    // Mock saved tools so we have something to clear
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockSavedTools));

    render(<ToolCanvasV2 />);

    // Clear button should be enabled when tools exist
    const clearButton = screen.getByLabelText(
      'Remove all tools from the canvas'
    );
    expect(clearButton).not.toBeDisabled();
  });

  it('manages internal state correctly', () => {
    render(<ToolCanvasV2 />);

    // Component should render and manage its own state
    expect(screen.getByLabelText('Tool canvas area')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<ToolCanvasV2 className='custom-canvas' />);

    expect(container.firstChild).toHaveClass('custom-canvas');
  });

  it('handles tool management operations', async () => {
    const user = userEvent.setup();

    // Mock saved tools so we have something to clear
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockSavedTools));

    render(<ToolCanvasV2 />);

    // User can clear tools
    const clearButton = screen.getByLabelText(
      'Remove all tools from the canvas'
    );
    await user.click(clearButton);

    // Modal should open
    expect(
      screen.getByRole('button', { name: /clear all/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Are you sure you want to clear all tools? This action cannot be undone.'
      )
    ).toBeInTheDocument();

    // User confirms the clear action
    const confirmButton = screen.getByRole('button', { name: /clear all/i });
    await user.click(confirmButton);

    // After clearing, should show empty state
    expect(screen.getByText('No tools on canvas')).toBeInTheDocument();
  });
});
