import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Toolbar } from '../components/ToolCanvasV2/components/Toolbar/Toolbar';

describe('Toolbar', () => {
  const mockProps = {
    onAddTool: vi.fn(),
    onExport: vi.fn(),
    onClear: vi.fn(),
    showAddTool: false,
    hasTools: false,
  };

  it('renders toolbar with correct title', () => {
    render(<Toolbar {...mockProps} />);
    expect(screen.getByText('Tool Canvas')).toBeInTheDocument();
  });

  it('calls onAddTool when Add Tool button is clicked', () => {
    render(<Toolbar {...mockProps} />);
    const addButton = screen.getByText('Add Tool');
    fireEvent.click(addButton);
    expect(mockProps.onAddTool).toHaveBeenCalledTimes(1);
  });

  it('disables export and clear buttons when no tools', () => {
    render(<Toolbar {...mockProps} hasTools={false} />);
    expect(screen.getByText('Export')).toBeDisabled();
    expect(screen.getByText('Clear All')).toBeDisabled();
  });
});
