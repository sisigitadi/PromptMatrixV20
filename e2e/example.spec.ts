import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Prompt Matrix 2.0/);
});

test('get started button is visible', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  // Expect a specific button to be visible
  const getStartedButton = page.getByRole('button', { name: 'Get Started' });
  await expect(getStartedButton).toBeVisible();
});
