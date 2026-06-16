const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');

test('POM - Valid Login', async ({ page }) => {
  const login = new LoginPage(page);

  await login.goto();
  await login.login('standard_user', 'secret_sauce');

  await expect(page).toHaveURL(/inventory/);
});

test('POM - Invalid Login', async ({ page }) => {
  const login = new LoginPage(page);

  await login.goto();
  await login.login('standard_user', 'wrong_pass');

  await expect(login.errorMessage).toBeVisible();
});
