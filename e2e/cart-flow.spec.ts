import { test, expect } from '@playwright/test';

test.describe('Cart Flow', () => {
  test('should allow a guest to add an item to the cart', async ({ page }) => {
    // 1. Visit the homepage
    await page.goto('/');

    // 2. Navigate to Shop
    await page.click('text=Shop');
    await expect(page).toHaveURL(/.*shop/);

    // 3. Wait for products to load and click the first "Add to cart" button
    const addToCartBtn = page.locator('button[title="Add to cart"]').first();
    await expect(addToCartBtn).toBeVisible();
    await addToCartBtn.click();

    // 4. Verify the success notification appeared
    await expect(page.locator('text=Added to cart')).toBeVisible();

    // 5. Navigate to Cart
    await page.goto('/cart');

    // 6. Verify the cart is not empty and shows the Shopping Cart summary
    await expect(page.locator('text=Shopping Cart')).toBeVisible();
    await expect(page.locator('text=Your cart is empty')).not.toBeVisible();
  });
});
