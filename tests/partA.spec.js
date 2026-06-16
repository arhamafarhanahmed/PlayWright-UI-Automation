const { test, expect } = require('@playwright/test');

const URL = 'https://www.saucedemo.com';

test('Login — valid credentials', async ({ page }) => {
  await page.goto(URL);
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  await expect(page).toHaveURL(/inventory/);
});

test('Login — invalid password shows error', async ({ page }) => {
  await page.goto(URL);
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'wrong_pass');
  await page.click('#login-button');

  await expect(page.locator('[data-test="error"]')).toBeVisible();
});

test('Add 2 items to cart', async ({ page }) => {
  await page.goto(URL);
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  await page.click('#add-to-cart-sauce-labs-backpack');
  await page.click('#add-to-cart-sauce-labs-bike-light');

  await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
});

test('Complete checkout flow', async ({ page }) => {
  await page.goto(URL);

  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  await page.click('#add-to-cart-sauce-labs-backpack');
  await page.click('.shopping_cart_link');

  await page.click('#checkout');

  await page.fill('#first-name', 'Test');
  await page.fill('#last-name', 'User');
  await page.fill('#postal-code', '12345');

  await page.click('#continue');
  await page.click('#finish');

  await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
});

test('Logout test', async ({ page }) => {
  await page.goto(URL);

  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  await page.click('#react-burger-menu-btn');
  await page.click('#logout_sidebar_link');

  await expect(page).toHaveURL(URL);
});

test('Sort products by price low to high', async ({ page }) => {
  await page.goto(URL);

  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  await page.selectOption('.product_sort_container', 'lohi');

  const prices = await page.$$eval('.inventory_item_price', (els) =>
    els.map((e) => parseFloat(e.textContent.replace('$', '')))
  );

  expect(prices[0]).toBeLessThanOrEqual(prices[prices.length - 1]);
});
