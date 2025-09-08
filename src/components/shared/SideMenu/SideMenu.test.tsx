import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import SideMenu from './SideMenu';
import type { SideMenuOption } from './SideMenu.types';

const tools: SideMenuOption[] = [
  { id: 'weather', title: 'Weather Tool', value: 'weather' },
  { id: 'search', title: 'Search Tool', value: 'search' },
  { id: 'calculator', title: 'Calculator', value: 'calculator' },
];

describe('SideMenu - User Critical Features', () => {
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

    // User can see all tools
    expect(screen.getByText('Weather Tool')).toBeInTheDocument();
    expect(screen.getByText('Search Tool')).toBeInTheDocument();
    expect(screen.getByText('Calculator')).toBeInTheDocument();
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
    await user.click(screen.getByText('Weather Tool'));

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

    // User clicks close button (now using Button component)
    const closeButton = screen.getByLabelText('Close menu');
    await user.click(closeButton);

    // Menu closes
    expect(handleClose).toHaveBeenCalled();
  });

  it('closes when user clicks outside', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    const { container } = render(
      <SideMenu
        options={tools}
        isVisible={true}
        onSelect={vi.fn()}
        onClose={handleClose}
      />
    );

    // User clicks on overlay (outside the menu content)
    const overlay = container.querySelector('[class*="overlay"]');
    expect(overlay).toBeInTheDocument();
    await user.click(overlay as HTMLElement);

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
    await user.click(screen.getByText('Weather Tool'));

    // Nothing happens
    expect(handleSelect).not.toHaveBeenCalled();
  });
});
