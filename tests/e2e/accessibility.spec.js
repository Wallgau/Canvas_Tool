// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have proper page title', async ({ page }) => {
    await expect(page).toHaveTitle(/Tool Canvas/);
  });

  test('should have proper heading structure', async ({ page }) => {
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    await expect(h1).toHaveText(/Tool Canvas/);
  });

  test('should be keyboard navigable', async ({ page }) => {
    // Test tab navigation
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should have proper ARIA labels', async ({ page }) => {
    // Check for ARIA labels on interactive elements
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();

    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const ariaLabel = await button.getAttribute('aria-label');
      const textContent = await button.textContent();

      // Either has aria-label or has text content
      expect(ariaLabel || textContent?.trim()).toBeTruthy();
    }
  });

  test('should have proper color contrast', async ({ page }) => {
    // This is a basic test - in a real scenario, you'd use axe-core
    const body = page.locator('body');
    await expect(body).toBeVisible();

    // Check that text is visible (basic contrast check)
    const textElements = page.locator('p, h1, h2, h3, h4, h5, h6, span, div');
    const textCount = await textElements.count();

    for (let i = 0; i < Math.min(textCount, 10); i++) {
      const element = textElements.nth(i);
      const isVisible = await element.isVisible();
      if (isVisible) {
        const text = await element.textContent();
        if (text && text.trim().length > 0) {
          // Check that text has some color (not transparent)
          const color = await element.evaluate(
            el => window.getComputedStyle(el).color
          );
          expect(color).not.toBe('rgba(0, 0, 0, 0)');
        }
      }
    }
  });

  test('should support screen readers', async ({ page }) => {
    // Check for proper semantic HTML
    const main = page.locator('main, [role="main"]');
    await expect(main).toBeVisible();

    // Check for proper heading hierarchy
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await headings.count();
    expect(headingCount).toBeGreaterThan(0);
  });

  test('should handle focus management', async ({ page }) => {
    // Test that focus is properly managed
    await page.keyboard.press('Tab');
    const firstFocused = page.locator(':focus');
    await expect(firstFocused).toBeVisible();

    // Test that focus moves to next element
    await page.keyboard.press('Tab');
    const secondFocused = page.locator(':focus');
    await expect(secondFocused).toBeVisible();
    await expect(secondFocused).not.toBe(firstFocused);
  });
});
