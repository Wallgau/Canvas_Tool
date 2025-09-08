import { test, expect } from '@playwright/test';

test.describe('Tool Canvas - Complete User Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Clear localStorage to start fresh
    await page.evaluate(() => localStorage.clear());
  });

  test('Complete user workflow: Add tools, edit, move, export, clear', async ({
    page,
  }) => {
    // 1. Initial state - should show empty state
    await expect(page.getByText('No tools on canvas')).toBeVisible();
    await expect(
      page.getByText('Click "Add Tool" to start building your tool workflow')
    ).toBeVisible();

    // 2. Add first tool
    await page.getByRole('button', { name: 'Add Tool' }).click();
    await expect(page.getByText('Select a Tool')).toBeVisible();

    // Select Weather Forecast tool
    await page.getByText('Weather Forecast').click();
    await expect(page.getByText('Weather Forecast')).toBeVisible();

    // 3. Add second tool
    await page.getByRole('button', { name: 'Add Tool' }).click();
    await page.getByText('Web Search').click();
    await expect(page.getByText('Web Search')).toBeVisible();

    // 4. Add third tool
    await page.getByRole('button', { name: 'Add Tool' }).click();
    await page.getByText('Email Sender').click();
    await expect(page.getByText('Email Sender')).toBeVisible();

    // 5. Verify all tools are on canvas
    await expect(page.getByText('Weather Forecast')).toBeVisible();
    await expect(page.getByText('Web Search')).toBeVisible();
    await expect(page.getByText('Email Sender')).toBeVisible();

    // 6. Edit tool parameters
    const weatherTool = page
      .locator('[data-testid="tool-card"]')
      .filter({ hasText: 'Weather Forecast' })
      .first();
    await weatherTool.click();

    // Edit location parameter
    const locationInput = weatherTool.getByDisplayValue('New York');
    await locationInput.clear();
    await locationInput.fill('San Francisco');

    // Edit units parameter
    const unitsSelect = weatherTool.getByDisplayValue('celsius');
    await unitsSelect.selectOption('fahrenheit');

    // 7. Move tools around (drag and drop)
    const webSearchTool = page
      .locator('[data-testid="tool-card"]')
      .filter({ hasText: 'Web Search' })
      .first();
    const emailTool = page
      .locator('[data-testid="tool-card"]')
      .filter({ hasText: 'Email Sender' })
      .first();

    // Get initial positions
    const webSearchBox = await webSearchTool.boundingBox();
    const emailBox = await emailTool.boundingBox();

    // Drag Web Search tool to a new position
    await webSearchTool.dragTo(emailTool, {
      targetPosition: { x: 50, y: 50 },
    });

    // 8. Test export functionality
    const exportButton = page.getByRole('button', {
      name: 'Export current canvas configuration as JSON file',
    });
    await expect(exportButton).toBeEnabled();

    // Start download
    const downloadPromise = page.waitForEvent('download');
    await exportButton.click();
    const download = await downloadPromise;

    // Verify download
    expect(download.suggestedFilename()).toContain('tool-canvas-config');

    // 9. Test clear functionality
    const clearButton = page.getByRole('button', {
      name: 'Remove all tools from the canvas',
    });
    await expect(clearButton).toBeEnabled();

    // Mock confirm dialog
    page.on('dialog', dialog => dialog.accept());
    await clearButton.click();

    // 10. Verify empty state after clear
    await expect(page.getByText('No tools on canvas')).toBeVisible();
    await expect(page.getByText('Weather Forecast')).not.toBeVisible();
    await expect(page.getByText('Web Search')).not.toBeVisible();
    await expect(page.getByText('Email Sender')).not.toBeVisible();
  });

  test('Tool parameter editing and validation', async ({ page }) => {
    // Add a tool with various parameter types
    await page.getByRole('button', { name: 'Add Tool' }).click();
    await page.getByText('Email Sender').click();

    const emailTool = page
      .locator('[data-testid="tool-card"]')
      .filter({ hasText: 'Email Sender' })
      .first();
    await emailTool.click();

    // Test text input
    const toInput = emailTool.getByDisplayValue('recipient@example.com');
    await toInput.clear();
    await toInput.fill('test@example.com');
    await expect(toInput).toHaveValue('test@example.com');

    // Test textarea
    const messageTextarea = emailTool.getByDisplayValue(
      'Hello, this is a test email.'
    );
    await messageTextarea.clear();
    await messageTextarea.fill('This is a custom message for testing.');
    await expect(messageTextarea).toHaveValue(
      'This is a custom message for testing.'
    );

    // Test select dropdown
    const prioritySelect = emailTool.getByDisplayValue('normal');
    await prioritySelect.selectOption('high');
    await expect(prioritySelect).toHaveValue('high');

    // Test number input
    const delayInput = emailTool.getByDisplayValue('0');
    await delayInput.clear();
    await delayInput.fill('5');
    await expect(delayInput).toHaveValue('5');

    // Test checkbox
    const urgentCheckbox = emailTool.getByRole('checkbox', { name: 'Urgent' });
    await urgentCheckbox.check();
    await expect(urgentCheckbox).toBeChecked();
  });

  test('Mobile responsive behavior', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Add tools
    await page.getByRole('button', { name: 'Add Tool' }).click();
    await page.getByText('Weather Forecast').click();

    await page.getByRole('button', { name: 'Add Tool' }).click();
    await page.getByText('Web Search').click();

    // On mobile, tools should stack vertically
    const tools = page.locator('[data-testid="tool-card"]');
    const toolCount = await tools.count();
    expect(toolCount).toBe(2);

    // Test mobile drag behavior (reordering)
    const firstTool = tools.first();
    const secondTool = tools.nth(1);

    // Drag to reorder
    await firstTool.dragTo(secondTool, {
      targetPosition: { x: 0, y: 100 },
    });

    // Verify tools are still visible
    await expect(page.getByText('Weather Forecast')).toBeVisible();
    await expect(page.getByText('Web Search')).toBeVisible();
  });

  test('Keyboard navigation and accessibility', async ({ page }) => {
    // Test tab navigation
    await page.keyboard.press('Tab');
    const firstFocused = page.locator(':focus');
    await expect(firstFocused).toBeVisible();

    // Tab through all interactive elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Add tool using keyboard
    await page.keyboard.press('Enter');
    await expect(page.getByText('Select a Tool')).toBeVisible();

    // Navigate tool selection with arrow keys
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    // Verify tool was added
    await expect(page.getByText('Calculator')).toBeVisible();

    // Test escape key to close modal
    await page.getByRole('button', { name: 'Add Tool' }).click();
    await page.keyboard.press('Escape');
    await expect(page.getByText('Select a Tool')).not.toBeVisible();
  });

  test('Data persistence and localStorage', async ({ page }) => {
    // Add tools and modify them
    await page.getByRole('button', { name: 'Add Tool' }).click();
    await page.getByText('Weather Forecast').click();

    const weatherTool = page
      .locator('[data-testid="tool-card"]')
      .filter({ hasText: 'Weather Forecast' })
      .first();
    await weatherTool.click();

    // Modify parameters
    const locationInput = weatherTool.getByDisplayValue('New York');
    await locationInput.clear();
    await locationInput.fill('London');

    // Refresh page
    await page.reload();

    // Verify data persisted
    await expect(page.getByText('Weather Forecast')).toBeVisible();
    const persistedLocationInput = page
      .locator('[data-testid="tool-card"]')
      .filter({ hasText: 'Weather Forecast' })
      .first()
      .getByDisplayValue('London');
    await expect(persistedLocationInput).toBeVisible();
  });

  test('Error handling and edge cases', async ({ page }) => {
    // Test with invalid localStorage data
    await page.evaluate(() => {
      localStorage.setItem('toolCanvas_tools', 'invalid-json');
    });

    await page.reload();

    // Should handle gracefully and show empty state
    await expect(page.getByText('No tools on canvas')).toBeVisible();

    // Test rapid clicking
    const addButton = page.getByRole('button', { name: 'Add Tool' });
    await addButton.click();
    await addButton.click();
    await addButton.click();

    // Should only show one modal
    const modals = page.getByText('Select a Tool');
    await expect(modals).toHaveCount(1);

    // Test with very long parameter values
    await page.getByText('Weather Forecast').click();
    const weatherTool = page
      .locator('[data-testid="tool-card"]')
      .filter({ hasText: 'Weather Forecast' })
      .first();
    await weatherTool.click();

    const locationInput = weatherTool.getByDisplayValue('New York');
    const longText = 'A'.repeat(1000);
    await locationInput.clear();
    await locationInput.fill(longText);

    // Should handle long input gracefully
    await expect(locationInput).toHaveValue(longText);
  });

  test('Performance under load', async ({ page }) => {
    // Add many tools to test performance
    const toolTypes = [
      'Weather Forecast',
      'Web Search',
      'Email Sender',
      'Calculator',
      'Text Translator',
    ];

    for (let i = 0; i < 10; i++) {
      await page.getByRole('button', { name: 'Add Tool' }).click();
      const toolType = toolTypes[i % toolTypes.length];
      await page.getByText(toolType).click();

      // Wait for tool to be added
      await expect(page.getByText(toolType)).toBeVisible();
    }

    // Verify all tools are visible
    const tools = page.locator('[data-testid="tool-card"]');
    const toolCount = await tools.count();
    expect(toolCount).toBe(10);

    // Test drag performance with many tools
    const firstTool = tools.first();
    const lastTool = tools.last();

    await firstTool.dragTo(lastTool, {
      targetPosition: { x: 0, y: 0 },
    });

    // All tools should still be visible
    await expect(tools).toHaveCount(10);
  });

  test('Cross-browser compatibility', async ({ page }) => {
    // Test basic functionality across different browsers
    await page.getByRole('button', { name: 'Add Tool' }).click();
    await page.getByText('Weather Forecast').click();

    // Verify tool was added
    await expect(page.getByText('Weather Forecast')).toBeVisible();

    // Test export functionality
    const exportButton = page.getByRole('button', {
      name: 'Export current canvas configuration as JSON file',
    });
    await expect(exportButton).toBeEnabled();

    // Test clear functionality
    const clearButton = page.getByRole('button', {
      name: 'Remove all tools from the canvas',
    });
    await expect(clearButton).toBeEnabled();

    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toBeVisible();
  });
});
