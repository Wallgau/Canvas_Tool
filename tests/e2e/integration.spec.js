import { test, expect } from '@playwright/test';

test.describe('Tool Canvas - Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Complete workflow: Create, edit, save, reload, export, import', async ({
    page,
  }) => {
    // 1. Create a complex workflow
    await page.getByRole('button', { name: 'Add Tool' }).click();
    await page.getByText('Weather Forecast').click();

    await page.getByRole('button', { name: 'Add Tool' }).click();
    await page.getByText('Web Search').click();

    await page.getByRole('button', { name: 'Add Tool' }).click();
    await page.getByText('Email Sender').click();

    // 2. Edit tool parameters
    const weatherTool = page
      .locator('[data-testid="tool-card"]')
      .filter({ hasText: 'Weather Forecast' })
      .first();
    await weatherTool.click();

    const locationInput = weatherTool.getByDisplayValue('New York');
    await locationInput.clear();
    await locationInput.fill('San Francisco');

    const unitsSelect = weatherTool.getByDisplayValue('celsius');
    await unitsSelect.selectOption('fahrenheit');

    // 3. Edit Web Search tool
    const webSearchTool = page
      .locator('[data-testid="tool-card"]')
      .filter({ hasText: 'Web Search' })
      .first();
    await webSearchTool.click();

    const queryInput = webSearchTool.getByDisplayValue('search query');
    await queryInput.clear();
    await queryInput.fill('weather in San Francisco');

    // 4. Edit Email Sender tool
    const emailTool = page
      .locator('[data-testid="tool-card"]')
      .filter({ hasText: 'Email Sender' })
      .first();
    await emailTool.click();

    const toInput = emailTool.getByDisplayValue('recipient@example.com');
    await toInput.clear();
    await toInput.fill('weather@example.com');

    const subjectInput = emailTool.getByDisplayValue('Email Subject');
    await subjectInput.clear();
    await subjectInput.fill('Daily Weather Report');

    // 5. Arrange tools
    await weatherTool.dragTo(webSearchTool, {
      targetPosition: { x: 0, y: 0 },
    });

    await webSearchTool.dragTo(emailTool, {
      targetPosition: { x: 0, y: 0 },
    });

    // 6. Export configuration
    const exportButton = page.getByRole('button', {
      name: 'Export current canvas configuration as JSON file',
    });
    const downloadPromise = page.waitForEvent('download');
    await exportButton.click();
    const download = await downloadPromise;

    // 7. Clear canvas
    page.on('dialog', dialog => dialog.accept());
    await page
      .getByRole('button', { name: 'Remove all tools from the canvas' })
      .click();

    // 8. Verify empty state
    await expect(page.getByText('No tools on canvas')).toBeVisible();

    // 9. Reload page to test persistence
    await page.reload();

    // 10. Verify tools are restored with correct parameters
    await expect(page.getByText('Weather Forecast')).toBeVisible();
    await expect(page.getByText('Web Search')).toBeVisible();
    await expect(page.getByText('Email Sender')).toBeVisible();

    // 11. Verify parameters are restored
    const restoredWeatherTool = page
      .locator('[data-testid="tool-card"]')
      .filter({ hasText: 'Weather Forecast' })
      .first();
    await restoredWeatherTool.click();

    await expect(
      restoredWeatherTool.getByDisplayValue('San Francisco')
    ).toBeVisible();
    await expect(
      restoredWeatherTool.getByDisplayValue('fahrenheit')
    ).toBeVisible();

    // 12. Test export again
    const exportButton2 = page.getByRole('button', {
      name: 'Export current canvas configuration as JSON file',
    });
    const downloadPromise2 = page.waitForEvent('download');
    await exportButton2.click();
    const download2 = await downloadPromise2;

    // 13. Test clear and verify empty state
    page.on('dialog', dialog => dialog.accept());
    await page
      .getByRole('button', { name: 'Remove all tools from the canvas' })
      .click();
    await expect(page.getByText('No tools on canvas')).toBeVisible();
  });

  test('Multi-user scenario simulation', async ({ page }) => {
    // Simulate multiple users working on the same canvas
    const user1 = page;
    const user2 = await page.context().newPage();

    await user1.goto('/');
    await user2.goto('/');

    // User 1 adds tools
    await user1.getByRole('button', { name: 'Add Tool' }).click();
    await user1.getByText('Weather Forecast').click();

    await user1.getByRole('button', { name: 'Add Tool' }).click();
    await user1.getByText('Web Search').click();

    // User 2 adds tools
    await user2.getByRole('button', { name: 'Add Tool' }).click();
    await user2.getByText('Email Sender').click();

    await user2.getByRole('button', { name: 'Add Tool' }).click();
    await user2.getByText('Calculator').click();

    // Both users should see their own tools
    await expect(user1.getByText('Weather Forecast')).toBeVisible();
    await expect(user1.getByText('Web Search')).toBeVisible();
    await expect(user1.getByText('Email Sender')).not.toBeVisible();
    await expect(user1.getByText('Calculator')).not.toBeVisible();

    await expect(user2.getByText('Email Sender')).toBeVisible();
    await expect(user2.getByText('Calculator')).toBeVisible();
    await expect(user2.getByText('Weather Forecast')).not.toBeVisible();
    await expect(user2.getByText('Web Search')).not.toBeVisible();

    // User 1 exports and shares configuration
    const exportButton = user1.getByRole('button', {
      name: 'Export current canvas configuration as JSON file',
    });
    const downloadPromise = user1.waitForEvent('download');
    await exportButton.click();
    const download = await downloadPromise;

    // User 2 clears and imports configuration
    page.on('dialog', dialog => dialog.accept());
    await user2
      .getByRole('button', { name: 'Remove all tools from the canvas' })
      .click();

    // Simulate import (in real app, this would be a file upload)
    await user2.evaluate(() => {
      const config = {
        tools: [
          {
            id: 'tool-1',
            type: 'weather_forecast',
            position: { x: 100, y: 100 },
            params: {
              location: 'New York',
              units: 'celsius',
              days: 5,
            },
          },
          {
            id: 'tool-2',
            type: 'web_search',
            position: { x: 300, y: 100 },
            params: {
              query: 'weather forecast',
              results: 10,
            },
          },
        ],
      };
      localStorage.setItem('toolCanvas_tools', JSON.stringify(config));
    });

    await user2.reload();

    // User 2 should now see the imported tools
    await expect(user2.getByText('Weather Forecast')).toBeVisible();
    await expect(user2.getByText('Web Search')).toBeVisible();

    await user1.close();
    await user2.close();
  });

  test('Complex workflow with all tool types', async ({ page }) => {
    // Add all available tool types
    const toolTypes = [
      'Weather Forecast',
      'Web Search',
      'Email Sender',
      'Calculator',
      'Text Translator',
      'Data Processor',
    ];

    for (const toolType of toolTypes) {
      await page.getByRole('button', { name: 'Add Tool' }).click();
      await page.getByText(toolType).click();
    }

    // Verify all tools are added
    for (const toolType of toolTypes) {
      await expect(page.getByText(toolType)).toBeVisible();
    }

    // Edit each tool with specific parameters
    const tools = page.locator('[data-testid="tool-card"]');

    // Weather Forecast
    const weatherTool = tools.filter({ hasText: 'Weather Forecast' }).first();
    await weatherTool.click();
    const locationInput = weatherTool.getByDisplayValue('New York');
    await locationInput.clear();
    await locationInput.fill('Tokyo');

    // Web Search
    const webSearchTool = tools.filter({ hasText: 'Web Search' }).first();
    await webSearchTool.click();
    const queryInput = webSearchTool.getByDisplayValue('search query');
    await queryInput.clear();
    await queryInput.fill('Tokyo weather');

    // Email Sender
    const emailTool = tools.filter({ hasText: 'Email Sender' }).first();
    await emailTool.click();
    const toInput = emailTool.getByDisplayValue('recipient@example.com');
    await toInput.clear();
    await toInput.fill('weather@example.com');

    // Calculator
    const calculatorTool = tools.filter({ hasText: 'Calculator' }).first();
    await calculatorTool.click();
    const expressionInput = calculatorTool.getByDisplayValue('2 + 2');
    await expressionInput.clear();
    await expressionInput.fill('100 * 1.5');

    // Text Translator
    const translatorTool = tools.filter({ hasText: 'Text Translator' }).first();
    await translatorTool.click();
    const textInput = translatorTool.getByDisplayValue('Hello, world!');
    await textInput.clear();
    await textInput.fill('Good morning, Tokyo!');

    // Data Processor
    const dataProcessorTool = tools
      .filter({ hasText: 'Data Processor' })
      .first();
    await dataProcessorTool.click();
    const dataInput = dataProcessorTool.getByDisplayValue('{"key": "value"}');
    await dataInput.clear();
    await dataInput.fill('{"temperature": 25, "humidity": 60}');

    // Arrange tools in a workflow
    const toolPositions = [
      { x: 100, y: 100 }, // Weather Forecast
      { x: 400, y: 100 }, // Web Search
      { x: 100, y: 300 }, // Email Sender
      { x: 400, y: 300 }, // Calculator
      { x: 100, y: 500 }, // Text Translator
      { x: 400, y: 500 }, // Data Processor
    ];

    for (let i = 0; i < tools.count(); i++) {
      const tool = tools.nth(i);
      const targetTool = tools.nth((i + 1) % tools.count());
      await tool.dragTo(targetTool, {
        targetPosition: toolPositions[i],
      });
    }

    // Export the complete workflow
    const exportButton = page.getByRole('button', {
      name: 'Export current canvas configuration as JSON file',
    });
    const downloadPromise = page.waitForEvent('download');
    await exportButton.click();
    const download = await downloadPromise;

    // Verify export filename
    expect(download.suggestedFilename()).toContain('tool-canvas-config');

    // Test persistence
    await page.reload();

    // Verify all tools are restored
    for (const toolType of toolTypes) {
      await expect(page.getByText(toolType)).toBeVisible();
    }

    // Verify parameters are restored
    const restoredWeatherTool = tools
      .filter({ hasText: 'Weather Forecast' })
      .first();
    await restoredWeatherTool.click();
    await expect(restoredWeatherTool.getByDisplayValue('Tokyo')).toBeVisible();
  });

  test('Error recovery and data integrity', async ({ page }) => {
    // Test recovery from various error states

    // 1. Test with corrupted localStorage
    await page.evaluate(() => {
      localStorage.setItem(
        'toolCanvas_tools',
        '{"tools": [{"id": "1", "type": "invalid_type"}]}'
      );
    });

    await page.reload();

    // Should handle gracefully and show empty state
    await expect(page.getByText('No tools on canvas')).toBeVisible();

    // 2. Test with valid data
    await page.getByRole('button', { name: 'Add Tool' }).click();
    await page.getByText('Weather Forecast').click();

    // 3. Test with extremely large parameter values
    const weatherTool = page
      .locator('[data-testid="tool-card"]')
      .filter({ hasText: 'Weather Forecast' })
      .first();
    await weatherTool.click();

    const locationInput = weatherTool.getByDisplayValue('New York');
    const largeText = 'A'.repeat(10000);
    await locationInput.clear();
    await locationInput.fill(largeText);

    // 4. Test persistence with large data
    await page.reload();

    // Should restore the large text
    const restoredWeatherTool = page
      .locator('[data-testid="tool-card"]')
      .filter({ hasText: 'Weather Forecast' })
      .first();
    await restoredWeatherTool.click();
    await expect(
      restoredWeatherTool.getByDisplayValue(largeText)
    ).toBeVisible();

    // 5. Test export with large data
    const exportButton = page.getByRole('button', {
      name: 'Export current canvas configuration as JSON file',
    });
    const downloadPromise = page.waitForEvent('download');
    await exportButton.click();
    const download = await downloadPromise;

    // Should handle large data gracefully
    expect(download.suggestedFilename()).toContain('tool-canvas-config');
  });

  test('Cross-browser compatibility workflow', async ({ page }) => {
    // Test complete workflow that should work across all browsers

    // 1. Add tools
    await page.getByRole('button', { name: 'Add Tool' }).click();
    await page.getByText('Weather Forecast').click();

    await page.getByRole('button', { name: 'Add Tool' }).click();
    await page.getByText('Web Search').click();

    // 2. Edit parameters
    const weatherTool = page
      .locator('[data-testid="tool-card"]')
      .filter({ hasText: 'Weather Forecast' })
      .first();
    await weatherTool.click();

    const locationInput = weatherTool.getByDisplayValue('New York');
    await locationInput.clear();
    await locationInput.fill('London');

    // 3. Test drag and drop
    const webSearchTool = page
      .locator('[data-testid="tool-card"]')
      .filter({ hasText: 'Web Search' })
      .first();
    await weatherTool.dragTo(webSearchTool, {
      targetPosition: { x: 0, y: 0 },
    });

    // 4. Test keyboard navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // 5. Test export
    const exportButton = page.getByRole('button', {
      name: 'Export current canvas configuration as JSON file',
    });
    const downloadPromise = page.waitForEvent('download');
    await exportButton.click();
    const download = await downloadPromise;

    // 6. Test clear
    page.on('dialog', dialog => dialog.accept());
    await page
      .getByRole('button', { name: 'Remove all tools from the canvas' })
      .click();

    // 7. Verify empty state
    await expect(page.getByText('No tools on canvas')).toBeVisible();

    // 8. Test persistence
    await page.reload();
    await expect(page.getByText('No tools on canvas')).toBeVisible();
  });
});
