# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: checkout.spec.ts >> Checkout Flow >> should render address selector and add new address
- Location: e2e\checkout.spec.ts:4:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Add New Address')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=Add New Address')

```

```yaml
- navigation:
  - link "Vogueish Logo":
    - /url: /
    - img "Vogueish Logo"
  - link "Shop":
    - /url: /shop
  - link "AI Bot":
    - /url: /ai-bot
  - link "Custom Tailoring":
    - /url: /custom-tailoring
  - link "Home Trials":
    - /url: /home-trials
  - link "Donation":
    - /url: /donation
  - button "Toggle Theme":
    - img
  - link "1":
    - /url: /cart
    - img
    - text: "1"
  - link "Login":
    - /url: /login
    - img
  - button "Toggle quick links menu":
    - img
- main:
  - link "Back to Cart":
    - /url: /cart
    - img
    - text: Back to Cart
  - heading "Checkout" [level=1]
  - img
  - heading "Shipping Address" [level=2]
  - text: First Name
  - textbox "First Name"
  - text: Last Name
  - textbox "Last Name"
  - text: Street Address
  - textbox "Street Address":
    - /placeholder: Flat / House No / Building / Street
  - text: City
  - textbox "City":
    - /placeholder: e.g. Bengaluru
  - text: State
  - textbox "State":
    - /placeholder: e.g. Karnataka
  - text: Pincode
  - textbox "Pincode":
    - /placeholder: e.g. 560001
  - text: Country
  - textbox "Country":
    - /placeholder: e.g. India
    - text: India
  - text: Phone
  - textbox "Phone"
  - img
  - heading "Payment Method" [level=2]
  - radio "Credit / Debit Card" [checked]
  - text: Credit / Debit Card
  - radio "UPI / Wallet"
  - text: UPI / Wallet
  - radio "Cash on Delivery"
  - text: Cash on Delivery
  - button "Place Order"
  - complementary:
    - heading "Order Summary" [level=2]
    - text: Subtotal (1 items) ₹1,000 Shipping ₹214 GST (18%) ₹180 Total ₹1,394
- contentinfo:
  - heading "VOGUEISH" [level=2]
  - paragraph:
    - text: Specializing in high-quality, tailor-fit fashion. Experience our premium
    - strong: Home Trial
    - text: service today.
  - paragraph: info@voguish.live
  - heading "Contact Us" [level=3]
  - paragraph: 9th level, Delhi Secretariat, New Delhi - 110002
  - paragraph: customersupport@vogueish.live
  - heading "Policies" [level=3]
  - list:
    - listitem:
      - link "Shipping Policy":
        - /url: "#"
    - listitem:
      - link "Privacy Policy":
        - /url: "#"
    - listitem:
      - link "Terms & Conditions":
        - /url: "#"
  - img
  - img
  - img
  - img
  - text: © 2026 VOGUEISH. All rights reserved.
- region "Notifications alt+T"
- alert
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Checkout Flow', () => {
  4  |   test('should render address selector and add new address', async ({ page }) => {
  5  |     // Navigate to a blank page first to set localStorage
  6  |     await page.goto('/');
  7  |     await page.evaluate(() => {
  8  |       localStorage.setItem('ecommerce-cart', JSON.stringify([
  9  |         {
  10 |           id: 'mock-id-1',
  11 |           name: 'Mock Product',
  12 |           brand: 'Mock Brand',
  13 |           slug: 'mock-product',
  14 |           price: 1000,
  15 |           quantity: 1,
  16 |           size: 'M',
  17 |           image: '/mock.jpg'
  18 |         }
  19 |       ]));
  20 |     });
  21 | 
  22 |     // Navigate to /checkout
  23 |     await page.goto('/checkout');
  24 |     
  25 |     // Wait for the "Shipping Address" heading
  26 |     const heading = page.locator('h2', { hasText: 'Shipping Address' });
  27 |     await expect(heading).toBeVisible();
  28 | 
  29 |     // Look for the "Add New Address" button
  30 |     const addNewBtn = page.locator('text=Add New Address');
> 31 |       await expect(addNewBtn).toBeVisible();
     |                               ^ Error: expect(locator).toBeVisible() failed
  32 | 
  33 |       // Click to add new address
  34 |       await addNewBtn.click();
  35 | 
  36 |       // Form should appear
  37 |       await expect(page.locator('text=New Address Details')).toBeVisible();
  38 | 
  39 |       // Fill in details
  40 |       await page.fill('input[placeholder="Flat / House No / Street"]', '123 E2E Test St');
  41 |       await page.fill('input[placeholder="City"]', 'Test City');
  42 |       await page.fill('input[placeholder="State"]', 'TS');
  43 |       await page.fill('input[placeholder="Pincode"]', '123456');
  44 | 
  45 |       // (We won't submit the form to avoid polluting the DB, just verify UI works)
  46 |       const cancelBtn = page.locator('button', { hasText: 'Cancel' });
  47 |       await cancelBtn.click();
  48 |       await expect(page.locator('text=New Address Details')).not.toBeVisible();
  49 |   });
  50 | });
  51 | 
```