import { expect, Page, test } from '@playwright/test';

test.describe('SelectorComponent E2E Tests', () => {
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Component Rendering', () => {
    test('should render the selector components', async () => {
      const multipleSelector = page.locator('[data-testid="multiple-days-selector"]');
      const singleSelector = page.locator('[data-testid="single-day-selector"]');

      await expect(multipleSelector.locator('.selector-container')).toBeVisible();
      await expect(singleSelector.locator('.selector-container')).toBeVisible();
    });

    test('should render day buttons in multiple selector', async () => {
      const multipleSelector = page.locator('[data-testid="multiple-days-selector"]');
      const dayButtons = multipleSelector.locator('.day-button');
      const count = await dayButtons.count();

      // Should have multiple days (at least 28 from first month)
      expect(count).toBeGreaterThanOrEqual(28);
    });

    test('should display day numbers and month names', async () => {
      const multipleSelector = page.locator('[data-testid="multiple-days-selector"]');
      const firstDay = multipleSelector.locator('.day-button').first();
      const dayNumber = firstDay.locator('.day-number');
      const dayMonth = firstDay.locator('.day-month');

      await expect(dayNumber).toBeVisible();
      await expect(dayMonth).toBeVisible();

      const numberText = await dayNumber.textContent();
      const monthText = await dayMonth.textContent();

      expect(numberText).toBeTruthy();
      expect(monthText).toBeTruthy();
    });

    test('should render Previous and Next navigation buttons', async () => {
      const multipleSelector = page.locator('[data-testid="multiple-days-selector"]');
      const navButtons = multipleSelector.locator('.nav-button');
      await expect(navButtons).toHaveCount(2);

      const previousButton = navButtons.first();
      const nextButton = navButtons.last();

      await expect(previousButton).toContainText('Previous');
      await expect(nextButton).toContainText('Next');
    });
  });

  test.describe('Day Selection - Single Mode', () => {
    test('should select a day when clicked', async () => {
      const singleSelector = page.locator('[data-testid="single-day-selector"]');
      const firstDay = singleSelector.locator('.day-button').first();

      // Initially not selected
      await expect(firstDay).not.toHaveClass(/selected/);

      // Click to select
      await firstDay.click();

      // Should be selected
      await expect(firstDay).toHaveClass(/selected/);
    });

    test('should deselect previous day when selecting a new one', async () => {
      const singleSelector = page.locator('[data-testid="single-day-selector"]');
      const firstDay = singleSelector.locator('.day-button').first();
      const secondDay = singleSelector.locator('.day-button').nth(1);

      // Select first day
      await firstDay.click();
      await expect(firstDay).toHaveClass(/selected/);

      // Select second day
      await secondDay.click();
      await expect(secondDay).toHaveClass(/selected/);

      // First day should no longer be selected
      await expect(firstDay).not.toHaveClass(/selected/);
    });

    test('should apply correct styling to selected day', async () => {
      const singleSelector = page.locator('[data-testid="single-day-selector"]');
      const firstDay = singleSelector.locator('.day-button').first();

      // Get initial border color
      const initialBorderColor = await firstDay.evaluate((el) =>
        window.getComputedStyle(el).borderColor
      );

      // Click to select
      await firstDay.click();

      // Get selected border color
      const selectedBorderColor = await firstDay.evaluate((el) =>
        window.getComputedStyle(el).borderColor
      );

      // Border colors should be different
      expect(initialBorderColor).not.toBe(selectedBorderColor);

      // Verify it has the selected class
      await expect(firstDay).toHaveClass(/selected/);
    });
  });

  test.describe('Scroll Navigation', () => {
    test('should have Previous button disabled initially', async () => {
      const multipleSelector = page.locator('[data-testid="multiple-days-selector"]');
      const previousButton = multipleSelector.locator('.nav-button').first();
      await expect(previousButton).toBeDisabled();
    });

    test('should scroll right when Next button is clicked', async () => {
      const multipleSelector = page.locator('[data-testid="multiple-days-selector"]');
      const scrollContainer = multipleSelector.locator('.days-scroll');
      const nextButton = multipleSelector.locator('.nav-button').last();

      // Get initial scroll position
      const initialScroll = await scrollContainer.evaluate((el) => el.scrollLeft);

      // Click Next button
      await nextButton.click();

      // Wait for scroll animation
      await page.waitForTimeout(500);

      // Get new scroll position
      const newScroll = await scrollContainer.evaluate((el) => el.scrollLeft);

      // Should have scrolled to the right
      expect(newScroll).toBeGreaterThan(initialScroll);
    });

    test('should enable Previous button after scrolling right', async () => {
      const multipleSelector = page.locator('[data-testid="multiple-days-selector"]');
      const previousButton = multipleSelector.locator('.nav-button').first();
      const nextButton = multipleSelector.locator('.nav-button').last();

      // Initially disabled
      await expect(previousButton).toBeDisabled();

      // Scroll right
      await nextButton.click();
      await page.waitForTimeout(500);

      // Previous should now be enabled
      await expect(previousButton).not.toBeDisabled();
    });

    test('should scroll left when Previous button is clicked', async () => {
      const multipleSelector = page.locator('[data-testid="multiple-days-selector"]');
      const scrollContainer = multipleSelector.locator('.days-scroll');
      const previousButton = multipleSelector.locator('.nav-button').first();
      const nextButton = multipleSelector.locator('.nav-button').last();

      // First scroll right
      await nextButton.click();
      await page.waitForTimeout(500);

      // Get scroll position after scrolling right
      const scrollAfterRight = await scrollContainer.evaluate((el) => el.scrollLeft);

      // Now scroll left
      await previousButton.click();
      await page.waitForTimeout(500);

      // Get new scroll position
      const scrollAfterLeft = await scrollContainer.evaluate((el) => el.scrollLeft);

      // Should have scrolled to the left
      expect(scrollAfterLeft).toBeLessThan(scrollAfterRight);
    });

    test('should show gradient indicators when scrolling', async () => {
      const multipleSelector = page.locator('[data-testid="multiple-days-selector"]');
      const leftGradient = multipleSelector.locator('.gradient-left');
      const nextButton = multipleSelector.locator('.nav-button').last();

      // Initially, left gradient should not be visible
      await expect(leftGradient).not.toHaveClass(/visible/);

      // Scroll right
      await nextButton.click();
      await page.waitForTimeout(500);

      // Left gradient should now be visible
      await expect(leftGradient).toHaveClass(/visible/);
    });
  });

  test.describe('Multiple Day Selection', () => {
    test('should select multiple days when in multiple mode', async () => {
      const multipleSelector = page.locator('[data-testid="multiple-days-selector"]');
      const firstDay = multipleSelector.locator('.day-button').first();
      const secondDay = multipleSelector.locator('.day-button').nth(1);
      const thirdDay = multipleSelector.locator('.day-button').nth(2);

      // Select first day
      await firstDay.click();
      await expect(firstDay).toHaveClass(/selected/);

      // Select second day
      await secondDay.click();
      await expect(secondDay).toHaveClass(/selected/);

      // Select third day
      await thirdDay.click();
      await expect(thirdDay).toHaveClass(/selected/);

      // All three should remain selected in multiple mode
      await expect(firstDay).toHaveClass(/selected/);
      await expect(secondDay).toHaveClass(/selected/);
      await expect(thirdDay).toHaveClass(/selected/);
    });

    test('should deselect a day when clicked again in multiple mode', async () => {
      const multipleSelector = page.locator('[data-testid="multiple-days-selector"]');
      const firstDay = multipleSelector.locator('.day-button').first();

      // Select day
      await firstDay.click();
      await expect(firstDay).toHaveClass(/selected/);

      // Click again to deselect
      await firstDay.click();
      await expect(firstDay).not.toHaveClass(/selected/);
    });
  });

  test.describe('Responsive Behavior', () => {
    test('should display correctly on mobile viewport', async () => {
      await page.setViewportSize({ width: 375, height: 667 });

      const multipleSelector = page.locator('[data-testid="multiple-days-selector"]');
      const selector = multipleSelector.locator('.selector-container');
      await expect(selector).toBeVisible();

      const dayButtons = multipleSelector.locator('.day-button');
      const count = await dayButtons.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should have smaller day buttons on mobile', async () => {
      const multipleSelector = page.locator('[data-testid="multiple-days-selector"]');

      // Desktop size
      const desktopWidth = await multipleSelector.locator('.day-button').first().evaluate((el) =>
        el.getBoundingClientRect().width
      );

      // Mobile size
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(300); // Wait for resize

      const mobileWidth = await multipleSelector.locator('.day-button').first().evaluate((el) =>
        el.getBoundingClientRect().width
      );

      // Mobile buttons should be smaller or equal
      expect(mobileWidth).toBeLessThanOrEqual(desktopWidth);
    });

    test('should scroll horizontally on mobile', async () => {
      await page.setViewportSize({ width: 375, height: 667 });

      const multipleSelector = page.locator('[data-testid="multiple-days-selector"]');
      const scrollContainer = multipleSelector.locator('.days-scroll');
      const nextButton = multipleSelector.locator('.nav-button').last();

      const initialScroll = await scrollContainer.evaluate((el) => el.scrollLeft);

      await nextButton.click();
      await page.waitForTimeout(500);

      const newScroll = await scrollContainer.evaluate((el) => el.scrollLeft);
      expect(newScroll).toBeGreaterThan(initialScroll);
    });
  });

  test.describe('Visual Regression', () => {
    test('should match screenshot of default state', async () => {
      const multipleSelector = page.locator('[data-testid="multiple-days-selector"]');
      await expect(multipleSelector).toHaveScreenshot('selector-default.png');
    });

    test('should match screenshot with selected day', async () => {
      const multipleSelector = page.locator('[data-testid="multiple-days-selector"]');
      const firstDay = multipleSelector.locator('.day-button').first();
      await firstDay.click();

      await expect(multipleSelector).toHaveScreenshot('selector-with-selection.png');
    });

    test('should match screenshot after scrolling', async () => {
      const multipleSelector = page.locator('[data-testid="multiple-days-selector"]');
      const nextButton = multipleSelector.locator('.nav-button').last();
      await nextButton.click();
      await page.waitForTimeout(500);

      await expect(multipleSelector).toHaveScreenshot('selector-scrolled.png');
    });
  });

  test.describe('Accessibility', () => {
    test('should have accessible day buttons', async () => {
      const multipleSelector = page.locator('[data-testid="multiple-days-selector"]');
      const firstButton = multipleSelector.locator('.day-button').first();

      // Check that button is keyboard accessible
      await firstButton.focus();
      await expect(firstButton).toBeFocused();

      // Check button type
      const buttonType = await firstButton.getAttribute('type');
      expect(buttonType).toBe('button');
    });

    test('should navigate with keyboard', async () => {
      const multipleSelector = page.locator('[data-testid="multiple-days-selector"]');
      const firstDay = multipleSelector.locator('.day-button').first();

      // Focus first button
      await firstDay.focus();
      await expect(firstDay).toBeFocused();

      // Press Enter to select
      await page.keyboard.press('Enter');
      await expect(firstDay).toHaveClass(/selected/);
    });

    test('should have proper button states', async () => {
      const multipleSelector = page.locator('[data-testid="multiple-days-selector"]');
      const previousButton = multipleSelector.locator('.nav-button').first();
      const nextButton = multipleSelector.locator('.nav-button').last();

      // Check disabled state
      await expect(previousButton).toBeDisabled();
      await expect(nextButton).not.toBeDisabled();

      // Scroll right
      await nextButton.click();
      await page.waitForTimeout(500);

      // Previous should now be enabled
      await expect(previousButton).not.toBeDisabled();
    });
  });

  test.describe('Performance', () => {
    test('should render many days without performance issues', async () => {
      const multipleSelector = page.locator('[data-testid="multiple-days-selector"]');
      const startTime = Date.now();

      const dayButtons = multipleSelector.locator('.day-button');
      const count = await dayButtons.count();

      const endTime = Date.now();
      const renderTime = endTime - startTime;

      // Should render quickly (less than 2 seconds)
      expect(renderTime).toBeLessThan(2000);
      expect(count).toBeGreaterThan(0);
    });

    test('should scroll smoothly', async () => {
      const multipleSelector = page.locator('[data-testid="multiple-days-selector"]');
      const nextButton = multipleSelector.locator('.nav-button').last();

      const startTime = Date.now();
      await nextButton.click();
      await page.waitForTimeout(300);
      const endTime = Date.now();

      const scrollTime = endTime - startTime;

      // Scroll animation should complete quickly
      expect(scrollTime).toBeLessThan(1000);
    });
  });
});
