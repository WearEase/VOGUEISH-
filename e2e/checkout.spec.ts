import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test('should render address selector and add new address', async ({ page }) => {
    // Mock NextAuth session so AddressSelector renders
    await page.route('**/api/auth/session', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: { name: 'Test User', email: 'test@example.com' },
          expires: '2100-01-01T00:00:00.000Z'
        }),
      });
    });

    // Mock Addresses endpoint
    await page.route('**/api/user/addresses', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ addresses: [] }),
      });
    });

    // Navigate to a blank page first to set localStorage
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('ecommerce-cart', JSON.stringify([
        {
          id: 'mock-id-1',
          name: 'Mock Product',
          brand: 'Mock Brand',
          slug: 'mock-product',
          price: 1000,
          quantity: 1,
          size: 'M',
          image: '/mock.jpg'
        }
      ]));
    });

    // Navigate to /checkout
    await page.goto('/checkout');
    
    // Wait for the "Shipping Address" heading
    const heading = page.locator('h2', { hasText: 'Shipping Address' });
    await expect(heading).toBeVisible();

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
  });
});
