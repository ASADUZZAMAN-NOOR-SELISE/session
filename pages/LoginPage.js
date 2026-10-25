// @ts-check
import { expect } from '@playwright/test';
import { URLS } from '../test-data/loginData.js';

export class LoginPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.username = page.locator('#username');
    this.password = page.locator('#password');
    this.adminRadio = page.locator('input[value="admin"]');
    this.userRadio = page.locator('input[value="user"]');
    this.roleDropdown = page.locator('select.form-control');
    this.roleOptions = this.roleDropdown.locator('option');
    this.terms = page.locator('#terms');
    this.signInBtn = page.locator('#signInBtn');
    this.errorAlert = page.locator('.alert-danger');
    this.credentialsHint = page.locator('p.text-center');
    this.blinkingLinks = page.locator('a.blinkingText');
    this.modal = page.locator('#myModal');
    this.modalOkayBtn = page.locator('#okayBtn');
    this.modalCancelBtn = page.locator('#cancelBtn');
  }

  async goto() {
    await this.page.goto(URLS.login);
  }

  /** @param {string} username */
  async enterUsername(username) {
    await this.username.fill(username);
  }

  /** @param {string} password */
  async enterPassword(password) {
    await this.password.fill(password);
  }

  /** @param {string} value stud | teach | consult */
  async selectRole(value) {
    await this.roleDropdown.selectOption(value);
  }

  async acceptTerms() {
    await this.terms.check();
  }

  async clickSignIn() {
    await this.signInBtn.click();
  }

  async submitWithEnter() {
    await this.password.press('Enter');
  }

  async selectAdmin() {
    await this.adminRadio.check();
  }

  /** Selects User and answers the confirmation modal. */
  async selectUser({ confirm = true } = {}) {
    await this.userRadio.check();
    await expect(this.modal).toBeVisible();
    await (confirm ? this.modalOkayBtn : this.modalCancelBtn).click();
    await expect(this.modal).toBeHidden();
  }

  /**
   * @param {string} username
   * @param {string} password
   * @param {{ acceptTerms?: boolean }} [opts]
   */
  async login(username, password, { acceptTerms = true } = {}) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    if (acceptTerms) await this.acceptTerms();
    await this.clickSignIn();
  }

  /** Clicks a header link and returns the new tab it opens. */
  async openBlinkingLink(index) {
    const [newTab] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.blinkingLinks.nth(index).click(),
    ]);
    await newTab.waitForLoadState();
    return newTab;
  }

  /** @param {string} message */
  async expectError(message) {
    await expect(this.errorAlert).toBeVisible();
    await expect(this.errorAlert).toHaveText(message);
    await expect(this.page).toHaveURL(URLS.login)
  }
}
