// @ts-check
import { test as base, expect } from '@playwright/test';
import { LoginPage } from './LoginPage.js';
import { ShopPage } from './ShopPage.js';

/** @type {import('@playwright/test').TestType<{ loginPage: LoginPage, shopPage: ShopPage }, {}>} */
export const test = base.extend({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },
  shopPage: async ({ page }, use) => {
    await use(new ShopPage(page));
  },
});

export { expect };
