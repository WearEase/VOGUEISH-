import { test, expect } from '@playwright/test';

test.describe('Cart Flow', () => {
  test('should allow a guest to add an item to the cart', async ({ page }) => {
    // Mock the products API response to ensure products exist in an empty DB
    await page.route('**/api/products*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            _id: 'mock-id-1',
            name: 'Mock Product',
            brand: 'Mock Brand',
            slug: 'mock-product',
            realPrice: '2000',
            discountedPrice: '1000',
            mainImage: '/mock.jpg',
            images: ['/mock.jpg'],
            description: 'Mock Description',
            category: 'Mock',
            gender: 'Men',
            collectionType: 'Summer',
            rating: 5,
            reviewsCount: 10,
            sizesAvailable: ['S', 'M', 'L'],
            colors: ['Red'],
            stock: 10,
            tags: [],
          }
        ]),
      });
    });

    // 1. Visit the homepage
    await page.goto('/');

    // 2. Navigate to Shop
    await page.click('text=Shop');
    await expect(page).toHaveURL(/.*shop/);

    // 3. Wait for products to load and click the first "Add to cart" button
    const addToCartBtn = page.locator('button[title="Add to cart"]').first();
    await expect(addToCartBtn).toBeVisible();
    await addToCartBtn.click();

    // 4. Select a size from the popup
    const sizeBtn = page.locator('button', { hasText: 'M' }).first();
    await expect(sizeBtn).toBeVisible();
    await sizeBtn.click();

    // 5. Verify the success notification appeared
    await expect(page.locator('text=/Added .* size of .* to cart/i')).toBeVisible();

    // 6. Navigate to Cart
    await page.goto('/cart');

    // 7. Verify the cart is not empty and shows the Shopping Cart summary
    await expect(page.locator('text=Shopping Cart')).toBeVisible();
    await expect(page.locator('text=Your cart is empty')).not.toBeVisible();
  });
});
