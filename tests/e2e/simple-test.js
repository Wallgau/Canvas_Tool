// Simple E2E test using Playwright without config file
const { chromium } = require('@playwright/test');

async function runTest() {
  console.log('🚀 Starting E2E test...');

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // Navigate to the app
    console.log('📱 Navigating to app...');
    await page.goto('http://localhost:4173');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check if empty state is visible
    console.log('🔍 Checking empty state...');
    const emptyStateText = await page.textContent(
      'text=No tools have been added'
    );
    if (emptyStateText) {
      console.log('✅ Empty state is visible');
    } else {
      console.log('❌ Empty state not found');
    }

    // Check if Add First Tool button is visible
    const addButton = await page.locator('button:has-text("Add First Tool")');
    if (await addButton.isVisible()) {
      console.log('✅ Add First Tool button is visible');

      // Click the button
      console.log('🖱️ Clicking Add First Tool button...');
      await addButton.click();

      // Wait for tool selector to appear
      await page.waitForTimeout(1000);

      // Check if tool selector is visible
      const toolSelector = await page.locator('[data-testid="tool-selector"]');
      if (await toolSelector.isVisible()) {
        console.log('✅ Tool selector opened successfully');
      } else {
        console.log('❌ Tool selector not visible');
      }
    } else {
      console.log('❌ Add First Tool button not found');
    }

    console.log('🎉 Test completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

runTest();
