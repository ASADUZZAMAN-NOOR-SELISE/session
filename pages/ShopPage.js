// @ts-check
import { expect } from '@playwright/test';
import { URLS, MESSAGES } from '../test-data/loginData.js';

export class ShopPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.productCards = page.locator('app-card');
    this.productTitles = page.locator('.card-title a');
    this.checkoutBtn = page.locator('a.nav-link.btn');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(URLS.shop);
    await expect(this.page).toHaveTitle(MESSAGES.shopTitle);
    await expect(this.productCards.first()).toBeVisible()
  }
}
