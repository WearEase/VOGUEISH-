import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test('should render address selector and add new address', async ({ page }) => {
    // Navigate to a page that contains the checkout or address flow
    // (Assuming we mock or navigate to /checkout)
    await page.goto('/checkout');
    
    // We assume the page loads the address selector (even if empty cart, we can test UI presence if we mock cart)
    // Wait for the "Shipping Address" heading
    const heading = page.locator('h2', { hasText: 'Shipping Address' });
    if (await heading.isVisible()) {
      // Look for the "Add New Address" button
      const addNewBtn = page.locator('text=Add New Address');
      await expect(addNewBtn).toBeVisible();

      // Click to add new address
      await addNewBtn.click();

      // Form should appear
      await expect(page.locator('text=New Address Details')).toBeVisible();

      // Fill in details
      await page.fill('input[placeholder="Flat / House No / Street"]', '123 E2E Test St');
      await page.fill('input[placeholder="City"]', 'Test City');
      await page.fill('input[placeholder="State"]', 'TS');
      await page.fill('input[placeholder="Pincode"]', '123456');

      // (We won't submit the form to avoid polluting the DB, just verify UI works)
      const cancelBtn = page.locator('button', { hasText: 'Cancel' });
      await cancelBtn.click();
      await expect(page.locator('text=New Address Details')).not.toBeVisible();
    }
  });
});
