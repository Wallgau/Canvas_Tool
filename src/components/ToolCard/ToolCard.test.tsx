import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { ToolCard } from './ToolCard';
import type { Tool } from '../../types';

const mockTool: Tool = {
  id: 'test-tool',
  name: 'get_weather',
  params: { location: 'Durham, NC', date: 'tomorrow' },
  position: { x: 0, y: 0 },
};

const mockOnUpdate = vi.fn();
const mockOnDelete = vi.fn();

describe('ToolCard', () => {
  beforeEach(() => {
    mockOnUpdate.mockClear();
    mockOnDelete.mockClear();
  });

  it('renders tool with display name', () => {
    render(
      <ToolCard
        tool={mockTool}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Weather Forecast')).toBeInTheDocument();
  });

  it('renders tool parameters', () => {
    render(
      <ToolCard
        tool={mockTool}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('location:')).toBeInTheDocument();
    expect(screen.getByText('Durham, NC')).toBeInTheDocument();
    expect(screen.getByText('date:')).toBeInTheDocument();
    expect(screen.getByText('tomorrow')).toBeInTheDocument();
  });

  it('enters edit mode when parameter is clicked', () => {
    render(
      <ToolCard
        tool={mockTool}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.click(screen.getByText('Durham, NC'));

    expect(screen.getByDisplayValue('Durham, NC')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', () => {
    render(
      <ToolCard
        tool={mockTool}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.click(screen.getByTitle('Delete tool'));

    expect(mockOnDelete).toHaveBeenCalledWith('test-tool');
  });

  it('saves parameter changes', () => {
    render(
      <ToolCard
        tool={mockTool}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    // Enter edit mode
    fireEvent.click(screen.getByText('Durham, NC'));

    // Change value
    const input = screen.getByDisplayValue('Durham, NC');
    fireEvent.change(input, { target: { value: 'New York' } });

    // Save changes
    fireEvent.click(screen.getByText('Save'));

    expect(mockOnUpdate).toHaveBeenCalledWith({
      ...mockTool,
      params: { ...mockTool.params, location: 'New York' },
    });
  });

  it('cancels parameter changes', () => {
    render(
      <ToolCard
        tool={mockTool}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    // Enter edit mode
    fireEvent.click(screen.getByText('Durham, NC'));

    // Change value
    const input = screen.getByDisplayValue('Durham, NC');
    fireEvent.change(input, { target: { value: 'New York' } });

    // Cancel changes
    fireEvent.click(screen.getByText('Cancel'));

    expect(mockOnUpdate).not.toHaveBeenCalled();
    expect(screen.getByText('Durham, NC')).toBeInTheDocument();
  });
});
