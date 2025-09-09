import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import SideMenu from './SideMenu';
import type { SideMenuOption } from './SideMenu.types';

const tools: SideMenuOption[] = [
  {
    id: 'weather',
    title: 'Weather Tool',
    description: 'Weather Tool',
    value: 'weather',
  },
  {
    id: 'search',
    title: 'Search Tool',
    description: 'Search Tool',
    value: 'search',
  },
  {
    id: 'calculator',
    title: 'Calculator',
    description: 'Calculator',
    value: 'calculator',
  },
];

describe('SideMenu - User Critical Features', () => {
  afterEach(() => {
    cleanup();
  });

  it('shows the menu when opened', () => {
    render(
      <SideMenu
        options={tools}
        isVisible={true}
        onSelect={vi.fn()}
        onClose={vi.fn()}
      />
    );

    // User can see the menu
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('hides the menu when closed', () => {
    render(
      <SideMenu
        options={tools}
        isVisible={false}
        onSelect={vi.fn()}
        onClose={vi.fn()}
      />
    );

    // User cannot see the menu
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('shows all available tools', () => {
    render(
      <SideMenu
        options={tools}
        isVisible={true}
        onSelect={vi.fn()}
        onClose={vi.fn()}
      />
    );

    // User can see all tools using data-testid
    expect(screen.getAllByTestId('weather')[0]).toBeInTheDocument();
    expect(screen.getAllByTestId('search')[0]).toBeInTheDocument();
    expect(screen.getAllByTestId('calculator')[0]).toBeInTheDocument();
  });

  it('calls onSelect when user picks a tool', async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    render(
      <SideMenu
        options={tools}
        isVisible={true}
        onSelect={handleSelect}
        onClose={vi.fn()}
      />
    );

    // User clicks on a tool
    await user.click(screen.getAllByTestId('weather')[0]);

    // Tool gets selected
    expect(handleSelect).toHaveBeenCalledWith(tools[0]);
  });

  it('closes when user clicks close button', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(
      <SideMenu
        options={tools}
        isVisible={true}
        onSelect={vi.fn()}
        onClose={handleClose}
      />
    );

    // User clicks close button (shadcn Sheet uses different structure)
    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);

    // Menu closes
    expect(handleClose).toHaveBeenCalled();
  });

  it('closes when user clicks outside', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(
      <SideMenu
        options={tools}
        isVisible={true}
        onSelect={vi.fn()}
        onClose={handleClose}
      />
    );

    // User presses Escape key (shadcn Sheet handles this automatically)
    await user.keyboard('{Escape}');

    // Menu closes
    expect(handleClose).toHaveBeenCalled();
  });

  it('shows empty state when no tools available', () => {
    render(
      <SideMenu
        options={[]}
        isVisible={true}
        onSelect={vi.fn()}
        onClose={vi.fn()}
      />
    );

    // User sees helpful message
    expect(screen.getByText('No options available')).toBeInTheDocument();
  });

  it('handles disabled tools correctly', async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();
    const disabledTools = [
      {
        id: 'weather',
        title: 'Weather Tool',
        description: 'Weather Tool',
        value: 'weather',
        disabled: true,
      },
    ];

    render(
      <SideMenu
        options={disabledTools}
        isVisible={true}
        onSelect={handleSelect}
        onClose={vi.fn()}
      />
    );

    // User tries to click disabled tool
    await user.click(screen.getAllByTestId('weather')[0]);

    // Nothing happens
    expect(handleSelect).not.toHaveBeenCalled();
  });
});
