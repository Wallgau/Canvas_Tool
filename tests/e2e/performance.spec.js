import { test, expect } from '@playwright/test';

test.describe('Tool Canvas - Performance and Stress Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Clear localStorage to start fresh
    await page.evaluate(() => localStorage.clear());
  });

  test('Performance with large number of tools', async ({ page }) => {
    // Measure performance metrics
    const startTime = Date.now();

    // Add 100 tools
    const toolTypes = [
      'Weather Forecast',
      'Web Search',
      'Email Sender',
      'Calculator',
      'Text Translator',
    ];

    for (let i = 0; i < 100; i++) {
      await page.getByRole('button', { name: 'Add Tool' }).click();
      const toolType = toolTypes[i % toolTypes.length];
      await page.getByText(toolType).click();

      // Wait for tool to be added
      await expect(page.getByText(toolType)).toBeVisible();
    }

    const endTime = Date.now();
    const totalTime = endTime - startTime;

    // Should complete within reasonable time (10 seconds)
    expect(totalTime).toBeLessThan(10000);

    // Verify all tools are visible
    const tools = page.locator('[data-testid="tool-card"]');
    await expect(tools).toHaveCount(100);

    // Test drag performance with many tools
    const firstTool = tools.first();
    const lastTool = tools.last();

    const dragStartTime = Date.now();
    await firstTool.dragTo(lastTool, {
      targetPosition: { x: 0, y: 0 },
    });
    const dragEndTime = Date.now();
    const dragTime = dragEndTime - dragStartTime;

    // Drag should complete within reasonable time (5 seconds)
    expect(dragTime).toBeLessThan(5000);

    // All tools should still be visible
    await expect(tools).toHaveCount(100);
  });

  test('Memory usage and cleanup', async ({ page }) => {
    // Monitor memory usage
    const initialMemory = await page.evaluate(() => {
      return performance.memory ? performance.memory.usedJSHeapSize : 0;
    });

    // Add many tools
    const toolTypes = [
      'Weather Forecast',
      'Web Search',
      'Email Sender',
      'Calculator',
      'Text Translator',
    ];

    for (let i = 0; i < 50; i++) {
      await page.getByRole('button', { name: 'Add Tool' }).click();
      const toolType = toolTypes[i % toolTypes.length];
      await page.getByText(toolType).click();
    }

    const memoryAfterAdd = await page.evaluate(() => {
      return performance.memory ? performance.memory.usedJSHeapSize : 0;
    });

    // Clear all tools
    page.on('dialog', dialog => dialog.accept());
    await page
      .getByRole('button', { name: 'Remove all tools from the canvas' })
      .click();

    // Force garbage collection if available
    await page.evaluate(() => {
      if (window.gc) {
        window.gc();
      }
    });

    const memoryAfterClear = await page.evaluate(() => {
      return performance.memory ? performance.memory.usedJSHeapSize : 0;
    });

    // Memory should be cleaned up (allow some tolerance)
    expect(memoryAfterClear).toBeLessThan(
      memoryAfterAdd + memoryAfterAdd * 0.1
    );
  });

  test('Rapid user interactions performance', async ({ page }) => {
    // Test rapid clicking performance
    const addButton = page.getByRole('button', { name: 'Add Tool' });

    const startTime = Date.now();

    // Rapidly add 20 tools
    for (let i = 0; i < 20; i++) {
      await addButton.click();
      await page.getByText('Weather Forecast').click();
    }

    const endTime = Date.now();
    const totalTime = endTime - startTime;

    // Should complete within reasonable time (5 seconds)
    expect(totalTime).toBeLessThan(5000);

    // Verify all tools are added
    const tools = page.locator('[data-testid="tool-card"]');
    await expect(tools).toHaveCount(20);
  });

  test('Drag and drop performance with many tools', async ({ page }) => {
    // Add 50 tools
    const toolTypes = [
      'Weather Forecast',
      'Web Search',
      'Email Sender',
      'Calculator',
      'Text Translator',
    ];

    for (let i = 0; i < 50; i++) {
      await page.getByRole('button', { name: 'Add Tool' }).click();
      const toolType = toolTypes[i % toolTypes.length];
      await page.getByText(toolType).click();
    }

    const tools = page.locator('[data-testid="tool-card"]');
    await expect(tools).toHaveCount(50);

    // Test drag performance
    const firstTool = tools.first();
    const middleTool = tools.nth(25);
    const lastTool = tools.last();

    // Drag first tool to middle
    const drag1Start = Date.now();
    await firstTool.dragTo(middleTool, {
      targetPosition: { x: 0, y: 0 },
    });
    const drag1End = Date.now();
    const drag1Time = drag1End - drag1Start;

    // Drag middle tool to end
    const drag2Start = Date.now();
    await middleTool.dragTo(lastTool, {
      targetPosition: { x: 0, y: 0 },
    });
    const drag2End = Date.now();
    const drag2Time = drag2End - drag2Start;

    // Each drag should complete within reasonable time (2 seconds)
    expect(drag1Time).toBeLessThan(2000);
    expect(drag2Time).toBeLessThan(2000);

    // All tools should still be visible
    await expect(tools).toHaveCount(50);
  });

  test('Parameter editing performance', async ({ page }) => {
    // Add a tool
    await page.getByRole('button', { name: 'Add Tool' }).click();
    await page.getByText('Email Sender').click();

    const emailTool = page
      .locator('[data-testid="tool-card"]')
      .filter({ hasText: 'Email Sender' })
      .first();
    await emailTool.click();

    // Test rapid parameter editing
    const toInput = emailTool.getByDisplayValue('recipient@example.com');
    const messageTextarea = emailTool.getByDisplayValue(
      'Hello, this is a test email.'
    );

    const startTime = Date.now();

    // Rapidly edit parameters
    for (let i = 0; i < 100; i++) {
      await toInput.clear();
      await toInput.fill(`test${i}@example.com`);
      await messageTextarea.clear();
      await messageTextarea.fill(`Message ${i}`);
    }

    const endTime = Date.now();
    const totalTime = endTime - startTime;

    // Should complete within reasonable time (10 seconds)
    expect(totalTime).toBeLessThan(10000);

    // Verify final values
    await expect(toInput).toHaveValue('test99@example.com');
    await expect(messageTextarea).toHaveValue('Message 99');
  });

  test('Export performance with large datasets', async ({ page }) => {
    // Add many tools with complex parameters
    const toolTypes = [
      'Weather Forecast',
      'Web Search',
      'Email Sender',
      'Calculator',
      'Text Translator',
    ];

    for (let i = 0; i < 100; i++) {
      await page.getByRole('button', { name: 'Add Tool' }).click();
      const toolType = toolTypes[i % toolTypes.length];
      await page.getByText(toolType).click();

      // Edit parameters to make them more complex
      const tool = page
        .locator('[data-testid="tool-card"]')
        .filter({ hasText: toolType })
        .first();
      await tool.click();

      if (toolType === 'Weather Forecast') {
        const locationInput = tool.getByDisplayValue('New York');
        await locationInput.clear();
        await locationInput.fill(
          `City ${i} with very long name that might affect performance`
        );
      }
    }

    // Test export performance
    const exportButton = page.getByRole('button', {
      name: 'Export current canvas configuration as JSON file',
    });

    const startTime = Date.now();
    const downloadPromise = page.waitForEvent('download');
    await exportButton.click();
    const download = await downloadPromise;
    const endTime = Date.now();

    const exportTime = endTime - startTime;

    // Export should complete within reasonable time (5 seconds)
    expect(exportTime).toBeLessThan(5000);

    // Verify download
    expect(download.suggestedFilename()).toContain('tool-canvas-config');
  });

  test('Page load performance', async ({ page }) => {
    // Measure page load time
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const endTime = Date.now();

    const loadTime = endTime - startTime;

    // Page should load within reasonable time (3 seconds)
    expect(loadTime).toBeLessThan(3000);

    // Verify page is interactive
    await expect(page.getByText('No tools on canvas')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add Tool' })).toBeVisible();
  });

  test('Responsive performance on different screen sizes', async ({ page }) => {
    const viewports = [
      { width: 320, height: 568 }, // iPhone SE
      { width: 375, height: 667 }, // iPhone 8
      { width: 768, height: 1024 }, // iPad
      { width: 1024, height: 768 }, // iPad landscape
      { width: 1920, height: 1080 }, // Desktop
      { width: 2560, height: 1440 }, // Large desktop
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);

      // Add tools
      await page.getByRole('button', { name: 'Add Tool' }).click();
      await page.getByText('Weather Forecast').click();

      await page.getByRole('button', { name: 'Add Tool' }).click();
      await page.getByText('Web Search').click();

      // Verify tools are visible and responsive
      await expect(page.getByText('Weather Forecast')).toBeVisible();
      await expect(page.getByText('Web Search')).toBeVisible();

      // Test drag performance
      const weatherTool = page
        .locator('[data-testid="tool-card"]')
        .filter({ hasText: 'Weather Forecast' })
        .first();
      const webSearchTool = page
        .locator('[data-testid="tool-card"]')
        .filter({ hasText: 'Web Search' })
        .first();

      const dragStart = Date.now();
      await weatherTool.dragTo(webSearchTool, {
        targetPosition: { x: 0, y: 0 },
      });
      const dragEnd = Date.now();
      const dragTime = dragEnd - dragStart;

      // Drag should complete within reasonable time (1 second)
      expect(dragTime).toBeLessThan(1000);

      // Clear tools for next viewport test
      page.on('dialog', dialog => dialog.accept());
      await page
        .getByRole('button', { name: 'Remove all tools from the canvas' })
        .click();
    }
  });

  test('Concurrent operations performance', async ({ page }) => {
    // Test multiple concurrent operations
    const startTime = Date.now();

    // Start multiple operations simultaneously
    const operations = [];

    // Add tools concurrently
    for (let i = 0; i < 10; i++) {
      operations.push(
        page
          .getByRole('button', { name: 'Add Tool' })
          .click()
          .then(() => page.getByText('Weather Forecast').click())
      );
    }

    await Promise.all(operations);

    const endTime = Date.now();
    const totalTime = endTime - startTime;

    // Should complete within reasonable time (5 seconds)
    expect(totalTime).toBeLessThan(5000);

    // Verify all tools are added
    const tools = page.locator('[data-testid="tool-card"]');
    await expect(tools).toHaveCount(10);
  });

  test('Memory leak detection', async ({ page }) => {
    // Monitor memory usage over time
    const memoryReadings = [];

    // Take initial memory reading
    memoryReadings.push(
      await page.evaluate(() => {
        return performance.memory ? performance.memory.usedJSHeapSize : 0;
      })
    );

    // Perform operations that might cause memory leaks
    for (let cycle = 0; cycle < 5; cycle++) {
      // Add tools
      for (let i = 0; i < 20; i++) {
        await page.getByRole('button', { name: 'Add Tool' }).click();
        await page.getByText('Weather Forecast').click();
      }

      // Edit parameters
      const tools = page.locator('[data-testid="tool-card"]');
      for (let i = 0; i < 10; i++) {
        const tool = tools.nth(i);
        await tool.click();
        const locationInput = tool.getByDisplayValue('New York');
        await locationInput.clear();
        await locationInput.fill(`City ${cycle}-${i}`);
      }

      // Clear tools
      page.on('dialog', dialog => dialog.accept());
      await page
        .getByRole('button', { name: 'Remove all tools from the canvas' })
        .click();

      // Force garbage collection if available
      await page.evaluate(() => {
        if (window.gc) {
          window.gc();
        }
      });

      // Take memory reading
      memoryReadings.push(
        await page.evaluate(() => {
          return performance.memory ? performance.memory.usedJSHeapSize : 0;
        })
      );
    }

    // Check for memory leaks (memory should not continuously increase)
    const memoryIncrease =
      memoryReadings[memoryReadings.length - 1] - memoryReadings[0];
    const memoryIncreasePercent = (memoryIncrease / memoryReadings[0]) * 100;

    // Memory increase should be less than 50% (allow some tolerance for normal fluctuations)
    expect(memoryIncreasePercent).toBeLessThan(50);
  });
});
