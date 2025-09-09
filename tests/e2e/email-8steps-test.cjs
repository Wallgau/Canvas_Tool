// Email 11-Steps Test - Complete flow with zoom, drag, and export
const { chromium } = require('@playwright/test');

async function runEmail11StepsTest() {
  console.log('🚀 Starting Email 11-Steps Test...');

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // Setup
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState('networkidle');

    // STEP 1: Select Email Sender
    console.log('\n📧 STEP 1: Selecting Email Sender...');
    await page.click('button:has-text("Add First Tool")');
    await page.waitForTimeout(1000);

    // Use data-id for reliable selection - Email Sender has id 'send_email'
    console.log('🔍 Selecting Email Sender by data-id...');
    const emailButton = await page.locator(
      '[data-testid="tool-selector"] button[data-id="send_email"]'
    );
    await emailButton.waitFor({ state: 'visible', timeout: 5000 });

    // Focus on the Email Sender button to show selection
    await emailButton.focus();
    await page.waitForTimeout(500);
    console.log('🔍 Email Sender button focused');

    await emailButton.click();
    await page.waitForTimeout(2000);
    console.log('✅ Email Sender selected');

    // STEP 2: Tap Invalid Email
    console.log('\n❌ STEP 2: Tapping invalid email...');
    const emailInput = await page.locator('input[placeholder*="to"]').first();
    await emailInput.click({ force: true });
    await emailInput.fill('invalid-email');
    console.log('✅ Invalid email entered: invalid-email');

    // STEP 3: Display Error
    console.log('\n💾 STEP 3: Trying to save to display error...');
    await page.click('button:has-text("Save")', { force: true });
    await page.waitForTimeout(2000);
    console.log('✅ Error should be displayed');

    // STEP 4: Change Input to Valid Email
    console.log('\n✅ STEP 4: Changing input to valid email...');
    await emailInput.click({ force: true });
    await emailInput.selectText(); // Select all text first
    await emailInput.fill('valid@gmail.com'); // Then fill with valid email

    // Verify the field value is actually changed - retry if needed
    let currentValue = await emailInput.inputValue();
    console.log(`🔍 Current field value: "${currentValue}"`);

    if (currentValue !== 'valid@gmail.com') {
      console.log('❌ Input value not changed correctly, retrying...');
      await emailInput.click({ force: true });
      await emailInput.selectText();
      await emailInput.fill('valid@gmail.com');
      currentValue = await emailInput.inputValue();
      console.log(`🔍 Retry field value: "${currentValue}"`);
    }

    if (currentValue === 'valid@gmail.com') {
      console.log('✅ Input successfully changed to: valid@gmail.com');
    } else {
      console.log('❌ Input value verification failed - stopping test');
      throw new Error('Failed to change input value to valid email');
    }

    // STEP 5: Save
    console.log('\n💾 STEP 5: Saving...');

    // Show the valid email value before saving
    const currentEmailValue = await emailInput.inputValue();
    console.log(`🔍 Current email value before save: "${currentEmailValue}"`);

    // Focus on save button to make it clear we're saving
    const saveButton = await page.locator('button:has-text("Save")');
    await saveButton.focus();
    await page.waitForTimeout(500);
    console.log('🔍 Save button focused');

    await saveButton.click({ force: true });
    await page.waitForTimeout(1000);
    console.log('✅ Save clicked');

    // STEP 6: Confirm Modal by Clicking Save
    console.log('\n✅ STEP 6: Confirming modal by clicking save...');

    // Focus on the Save button in the modal (not Cancel)
    const modalSaveButton = await page
      .locator('button:has-text("Save")')
      .last(); // Get the last Save button (modal one)
    await modalSaveButton.focus();
    await page.waitForTimeout(500);
    console.log('🔍 Modal Save button focused');

    await modalSaveButton.click({ force: true });
    await page.waitForTimeout(1000);
    console.log('✅ Modal confirmed and saved');

    // STEP 7: Add Calculator
    console.log('\n🧮 STEP 7: Adding Calculator...');
    await page.click('button:has-text("Add Tool")');
    await page.waitForTimeout(1000);

    // Use unique data-id - Calculator has id 'calculate'
    console.log('🔍 Looking for Calculator by data-id...');
    const calcButton = await page.locator(
      '[data-testid="tool-selector"] button[data-id="calculate"]'
    );
    await calcButton.waitFor({ state: 'visible', timeout: 5000 });

    // Focus on the Calculator button to show selection
    await calcButton.focus();
    await page.waitForTimeout(500);
    console.log('🔍 Calculator button focused');

    await calcButton.click();
    await page.waitForTimeout(2000);

    // Verify calculator was added by checking tool count
    const toolCountAfterCalc = await page
      .locator('[data-testid*="rf__node"]')
      .count();
    console.log(`🔍 Tool count after adding calculator: ${toolCountAfterCalc}`);

    if (toolCountAfterCalc >= 2) {
      console.log('✅ Calculator added successfully');
    } else {
      console.log('❌ Calculator not added');
    }

    // STEP 8: Zoom Out Before Drag and Drop
    console.log('\n🔍 STEP 8: Zooming out canvas before drag and drop...');

    // Try different zoom methods
    console.log('🔍 Trying keyboard zoom...');
    await page.keyboard.press('Control+-');
    await page.waitForTimeout(500);
    await page.keyboard.press('Control+-');
    await page.waitForTimeout(500);
    await page.keyboard.press('Control+-');
    await page.waitForTimeout(500);

    // Try mouse wheel zoom
    console.log('🔍 Trying mouse wheel zoom...');
    const canvas = await page.locator('.react-flow');
    await canvas.hover();
    await page.mouse.wheel(0, -500); // Scroll up to zoom out
    await page.waitForTimeout(500);
    await page.mouse.wheel(0, -500);
    await page.waitForTimeout(500);
    await page.mouse.wheel(0, -500);
    await page.waitForTimeout(500);

    // Try using the zoom controls if they exist
    console.log('🔍 Looking for zoom controls...');
    const zoomOutButton = await page
      .locator('button[title*="zoom out"], button[aria-label*="zoom out"]')
      .first();
    const zoomOutExists = await zoomOutButton.isVisible();
    if (zoomOutExists) {
      console.log('🔍 Found zoom out button, clicking...');
      await zoomOutButton.click();
      await page.waitForTimeout(500);
      await zoomOutButton.click();
      await page.waitForTimeout(500);
      await zoomOutButton.click();
      await page.waitForTimeout(500);
    } else {
      console.log('🔍 No zoom out button found, trying alternative...');
      // Try clicking on the canvas and using keyboard
      await canvas.click();
      await page.keyboard.press('Control+-');
      await page.waitForTimeout(500);
      await page.keyboard.press('Control+-');
      await page.waitForTimeout(500);
      await page.keyboard.press('Control+-');
      await page.waitForTimeout(500);
    }

    console.log('✅ Canvas zoom out attempted');

    // STEP 9: Drag and Drop Calculator
    console.log('\n🖱️ STEP 9: Dragging calculator tool further...');

    // Wait for both tools to be visible
    await page.waitForTimeout(2000);

    // Get all tool nodes and find the calculator (should be the second one)
    const toolNodes = await page.locator('[data-testid*="rf__node"]').all();
    console.log(`🔍 Found ${toolNodes.length} tool nodes`);

    if (toolNodes.length >= 2) {
      const calcNode = toolNodes[1]; // Calculator is the second tool
      const calcBox = await calcNode.boundingBox();
      if (calcBox) {
        console.log(`🔍 Starting position: x=${calcBox.x}, y=${calcBox.y}`);
        await page.mouse.move(
          calcBox.x + calcBox.width / 2,
          calcBox.y + calcBox.height / 2
        );
        await page.mouse.down();
        // Drag much further - 400px right and 300px down
        await page.mouse.move(calcBox.x + 400, calcBox.y + 300);
        await page.mouse.up();
        console.log(
          `🔍 Dragged to: x=${calcBox.x + 400}, y=${calcBox.y + 300}`
        );
        console.log('✅ Calculator tool dragged much further');
      }
    } else {
      console.log('❌ Not enough tools found for dragging');
    }
    await page.waitForTimeout(1000);

    // STEP 10: Export Canvas
    console.log('\n📤 STEP 10: Exporting canvas...');

    // Look for export button (could be in toolbar or menu)
    const exportButton = await page
      .locator(
        'button:has-text("Export"), button[title*="export"], button[aria-label*="export"]'
      )
      .first();
    const exportExists = await exportButton.isVisible();

    if (exportExists) {
      console.log('🔍 Found export button, clicking...');
      await exportButton.click();
      await page.waitForTimeout(1000);
      console.log('✅ Export initiated');
    } else {
      console.log('🔍 No export button found, trying alternative...');
      // Try looking for export in a menu or dropdown
      const menuButton = await page
        .locator('button[aria-label*="menu"], button[title*="menu"]')
        .first();
      const menuExists = await menuButton.isVisible();
      if (menuExists) {
        console.log('🔍 Found menu button, clicking to look for export...');
        await menuButton.click();
        await page.waitForTimeout(500);

        const exportInMenu = await page
          .locator('button:has-text("Export"), a:has-text("Export")')
          .first();
        const exportInMenuExists = await exportInMenu.isVisible();
        if (exportInMenuExists) {
          console.log('🔍 Found export in menu, clicking...');
          await exportInMenu.click();
          await page.waitForTimeout(1000);
          console.log('✅ Export from menu initiated');
        } else {
          console.log('❌ No export option found in menu');
        }
      } else {
        console.log('❌ No export functionality found');
      }
    }

    // STEP 11: Clear All
    console.log('\n🧹 STEP 11: Clearing all tools...');
    await page.click('button:has-text("Clear All")');
    await page.waitForTimeout(1000);

    // Focus on the Remove button to make it clear the user is confirming removal
    const removeButton = await page.locator('button:has-text("Remove")');
    await removeButton.focus();
    await page.waitForTimeout(500);

    // Verify the Remove button is focused
    const isRemoveButtonFocused = await removeButton.evaluate(
      el => el === document.activeElement
    );
    console.log(`🔍 Remove button focused: ${isRemoveButtonFocused}`);

    await removeButton.click();
    await page.waitForTimeout(1000);
    console.log('✅ All tools cleared');

    console.log('\n🎉 Email 11-Steps Test completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

runEmail11StepsTest();
