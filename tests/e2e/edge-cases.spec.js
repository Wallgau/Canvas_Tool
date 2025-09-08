import { test, expect } from '@playwright/test';

test.describe('Tool Canvas - Edge Cases and Error Scenarios', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Handles corrupted localStorage data gracefully', async ({ page }) => {
    // Test various corrupted localStorage scenarios
    const corruptedData = [
      'invalid-json',
      '{"tools": "not-an-array"}',
      '{"tools": [{"id": "invalid"}]}',
      '{"tools": [{"id": "1", "type": "nonexistent"}]}',
      '{"tools": [{"id": "1", "type": "weather_forecast", "position": "invalid"}]}',
      '{"tools": [{"id": "1", "type": "weather_forecast", "position": {"x": "not-a-number", "y": 100}}]}',
      '{"tools": [{"id": "1", "type": "weather_forecast", "params": "not-an-object"}]}',
    ];

    for (const data of corruptedData) {
      await page.evaluate(corruptedData => {
        localStorage.setItem('toolCanvas_tools', corruptedData);
      }, data);

      await page.reload();

      // Should handle gracefully and show empty state
      await expect(page.getByText('No tools on canvas')).toBeVisible();
      await expect(
        page.getByText('Click "Add Tool" to start building your tool workflow')
      ).toBeVisible();
    }
  });

  test('Handles extremely large datasets', async ({ page }) => {
    // Create a large dataset
    const largeDataset = {
      tools: Array.from({ length: 1000 }, (_, i) => ({
        id: `tool-${i}`,
        type: 'weather_forecast',
        position: { x: Math.random() * 2000, y: Math.random() * 2000 },
        params: {
          location: `City ${i}`,
          units: 'celsius',
          days: 5,
        },
      })),
    };

    await page.evaluate(data => {
      localStorage.setItem('toolCanvas_tools', JSON.stringify(data));
    }, largeDataset);

    await page.reload();

    // Should handle large dataset gracefully
    await expect(page.getByText('Weather Forecast')).toBeVisible();

    // Should be able to add more tools
    await page.getByRole('button', { name: 'Add Tool' }).click();
    await page.getByText('Web Search').click();
    await expect(page.getByText('Web Search')).toBeVisible();
  });

  test('Handles rapid user interactions', async ({ page }) => {
    // Rapid clicking on add button
    const addButton = page.getByRole('button', { name: 'Add Tool' });

    // Click rapidly multiple times
    for (let i = 0; i < 10; i++) {
      await addButton.click();
    }

    // Should only show one modal
    const modals = page.getByText('Select a Tool');
    await expect(modals).toHaveCount(1);

    // Close modal and test rapid tool selection
    await page.keyboard.press('Escape');

    // Rapid tool addition
    for (let i = 0; i < 5; i++) {
      await addButton.click();
      await page.getByText('Weather Forecast').click();
      // Don't wait for animation, just click rapidly
    }

    // Should have 5 tools
    const tools = page.locator('[data-testid="tool-card"]');
    await expect(tools).toHaveCount(5);
  });

  test('Handles network failures and offline scenarios', async ({ page }) => {
    // Simulate offline mode
    await page.context().setOffline(true);

    // Should still work with cached resources
    await page.getByRole('button', { name: 'Add Tool' }).click();
    await page.getByText('Weather Forecast').click();
    await expect(page.getByText('Weather Forecast')).toBeVisible();

    // Simulate network recovery
    await page.context().setOffline(false);

    // Should continue working normally
    await page.getByRole('button', { name: 'Add Tool' }).click();
    await page.getByText('Web Search').click();
    await expect(page.getByText('Web Search')).toBeVisible();
  });

  test('Handles memory pressure and cleanup', async ({ page }) => {
    // Add many tools and then remove them
    const toolTypes = [
      'Weather Forecast',
      'Web Search',
      'Email Sender',
      'Calculator',
      'Text Translator',
    ];

    // Add 50 tools
    for (let i = 0; i < 50; i++) {
      await page.getByRole('button', { name: 'Add Tool' }).click();
      const toolType = toolTypes[i % toolTypes.length];
      await page.getByText(toolType).click();
    }

    // Verify all tools are added
    const tools = page.locator('[data-testid="tool-card"]');
    await expect(tools).toHaveCount(50);

    // Clear all tools
    page.on('dialog', dialog => dialog.accept());
    await page
      .getByRole('button', { name: 'Remove all tools from the canvas' })
      .click();

    // Should show empty state
    await expect(page.getByText('No tools on canvas')).toBeVisible();

    // Should be able to add new tools after cleanup
    await page.getByRole('button', { name: 'Add Tool' }).click();
    await page.getByText('Weather Forecast').click();
    await expect(page.getByText('Weather Forecast')).toBeVisible();
  });

  test('Handles invalid parameter values', async ({ page }) => {
    // Add a tool
    await page.getByRole('button', { name: 'Add Tool' }).click();
    await page.getByText('Weather Forecast').click();

    const weatherTool = page
      .locator('[data-testid="tool-card"]')
      .filter({ hasText: 'Weather Forecast' })
      .first();
    await weatherTool.click();

    // Test invalid input values
    const locationInput = weatherTool.getByDisplayValue('New York');

    // Test with special characters
    await locationInput.clear();
    await locationInput.fill('City with "quotes" and \'apostrophes\'');
    await expect(locationInput).toHaveValue(
      'City with "quotes" and \'apostrophes\''
    );

    // Test with very long text
    const longText = 'A'.repeat(10000);
    await locationInput.clear();
    await locationInput.fill(longText);
    await expect(locationInput).toHaveValue(longText);

    // Test with empty string
    await locationInput.clear();
    await locationInput.fill('');
    await expect(locationInput).toHaveValue('');

    // Test with only whitespace
    await locationInput.fill('   ');
    await expect(locationInput).toHaveValue('   ');
  });

  test('Handles concurrent operations', async ({ page }) => {
    // Start multiple operations simultaneously
    const addButton = page.getByRole('button', { name: 'Add Tool' });

    // Click add button multiple times quickly
    await Promise.all([
      addButton.click(),
      addButton.click(),
      addButton.click(),
    ]);

    // Should only show one modal
    const modals = page.getByText('Select a Tool');
    await expect(modals).toHaveCount(1);

    // Close modal
    await page.keyboard.press('Escape');

    // Add tools rapidly
    const toolTypes = ['Weather Forecast', 'Web Search', 'Email Sender'];
    const promises = toolTypes.map(async toolType => {
      await addButton.click();
      await page.getByText(toolType).click();
    });

    await Promise.all(promises);

    // All tools should be added
    for (const toolType of toolTypes) {
      await expect(page.getByText(toolType)).toBeVisible();
    }
  });

  test('Handles browser back/forward navigation', async ({ page }) => {
    // Add a tool
    await page.getByRole('button', { name: 'Add Tool' }).click();
    await page.getByText('Weather Forecast').click();
    await expect(page.getByText('Weather Forecast')).toBeVisible();

    // Navigate back
    await page.goBack();

    // Should still show the tool (state persisted in localStorage)
    await expect(page.getByText('Weather Forecast')).toBeVisible();

    // Navigate forward
    await page.goForward();
    await expect(page.getByText('Weather Forecast')).toBeVisible();
  });

  test('Handles page refresh during operations', async ({ page }) => {
    // Start adding a tool
    await page.getByRole('button', { name: 'Add Tool' }).click();
    await page.getByText('Weather Forecast').click();

    // Refresh page immediately
    await page.reload();

    // Should show the tool that was added
    await expect(page.getByText('Weather Forecast')).toBeVisible();

    // Should be able to continue normal operations
    await page.getByRole('button', { name: 'Add Tool' }).click();
    await page.getByText('Web Search').click();
    await expect(page.getByText('Web Search')).toBeVisible();
  });

  test('Handles extreme viewport sizes', async ({ page }) => {
    // Test very small viewport
    await page.setViewportSize({ width: 320, height: 568 });

    await page.getByRole('button', { name: 'Add Tool' }).click();
    await page.getByText('Weather Forecast').click();
    await expect(page.getByText('Weather Forecast')).toBeVisible();

    // Test very large viewport
    await page.setViewportSize({ width: 2560, height: 1440 });

    await page.getByRole('button', { name: 'Add Tool' }).click();
    await page.getByText('Web Search').click();
    await expect(page.getByText('Web Search')).toBeVisible();

    // Test ultra-wide viewport
    await page.setViewportSize({ width: 3840, height: 1080 });

    await page.getByRole('button', { name: 'Add Tool' }).click();
    await page.getByText('Email Sender').click();
    await expect(page.getByText('Email Sender')).toBeVisible();
  });

  test('Handles drag and drop edge cases', async ({ page }) => {
    // Add multiple tools
    await page.getByRole('button', { name: 'Add Tool' }).click();
    await page.getByText('Weather Forecast').click();

    await page.getByRole('button', { name: 'Add Tool' }).click();
    await page.getByText('Web Search').click();

    const weatherTool = page
      .locator('[data-testid="tool-card"]')
      .filter({ hasText: 'Weather Forecast' })
      .first();
    const webSearchTool = page
      .locator('[data-testid="tool-card"]')
      .filter({ hasText: 'Web Search' })
      .first();

    // Test dragging to invalid positions
    await weatherTool.dragTo(webSearchTool, {
      targetPosition: { x: -1000, y: -1000 },
    });

    // Tools should still be visible
    await expect(page.getByText('Weather Forecast')).toBeVisible();
    await expect(page.getByText('Web Search')).toBeVisible();

    // Test dragging to very large positions
    await weatherTool.dragTo(webSearchTool, {
      targetPosition: { x: 10000, y: 10000 },
    });

    // Tools should still be visible
    await expect(page.getByText('Weather Forecast')).toBeVisible();
    await expect(page.getByText('Web Search')).toBeVisible();
  });

  test('Handles export/import edge cases', async ({ page }) => {
    // Add a tool
    await page.getByRole('button', { name: 'Add Tool' }).click();
    await page.getByText('Weather Forecast').click();

    // Test export with no tools (should be disabled)
    const exportButton = page.getByRole('button', {
      name: 'Export current canvas configuration as JSON file',
    });
    await expect(exportButton).toBeEnabled();

    // Test export with tools
    const downloadPromise = page.waitForEvent('download');
    await exportButton.click();
    const download = await downloadPromise;

    // Verify download
    expect(download.suggestedFilename()).toContain('tool-canvas-config');

    // Test clear with no tools (should be disabled)
    const clearButton = page.getByRole('button', {
      name: 'Remove all tools from the canvas',
    });
    await expect(clearButton).toBeEnabled();

    // Clear tools
    page.on('dialog', dialog => dialog.accept());
    await clearButton.click();

    // Export should be disabled now
    await expect(exportButton).toBeDisabled();
    await expect(clearButton).toBeDisabled();
  });

  test('Handles keyboard edge cases', async ({ page }) => {
    // Test with no focusable elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Should be able to add tool with Enter
    await page.keyboard.press('Enter');
    await expect(page.getByText('Select a Tool')).toBeVisible();

    // Test escape key handling
    await page.keyboard.press('Escape');
    await expect(page.getByText('Select a Tool')).not.toBeVisible();

    // Test arrow key navigation in empty state
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowRight');

    // Should not cause any errors
    await expect(page.getByText('No tools on canvas')).toBeVisible();
  });
});
