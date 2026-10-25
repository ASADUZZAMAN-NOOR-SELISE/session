// @ts-check
import { test, expect } from '../pages/fixtures.js';
import {
  URLS, VALID_USER, MESSAGES, ROLES, PRODUCTS, INVALID_CREDENTIALS, EMPTY_CREDENTIALS,
} from '../test-data/loginData.js';

const { username: USER, password: PASS } = VALID_USER;

test.describe('Login page - UI', () => {
  test('TC01 page loads with correct title', { tag: ['@SMOKE', '@REGRESSION'] }, async ({ loginPage }) => {
    await expect(loginPage.page).toHaveTitle(MESSAGES.pageTitle);
  });

  test('TC02 all login form elements are visible', { tag: ['@SMOKE', '@REGRESSION'] }, async ({ loginPage }) => {
    for (const el of [loginPage.username, loginPage.password, loginPage.adminRadio, loginPage.userRadio,
      loginPage.roleDropdown, loginPage.terms, loginPage.signInBtn]) {
      await expect(el).toBeVisible();
    }
    await expect(loginPage.signInBtn).toBeEnabled();
    await expect(loginPage.signInBtn).toHaveValue(MESSAGES.signIn);
  });

  test('TC03 fields have correct labels and input types', { tag: '@REGRESSION' }, async ({ loginPage, page }) => {
    await expect(page.getByLabel('Username:')).toBeVisible();
    await expect(page.getByLabel('Password:')).toBeVisible();
    await expect(loginPage.username).toHaveAttribute('type', 'text');
    await expect(loginPage.password).toHaveAttribute('type', 'password');
  });

  test('TC04 default state of the form', { tag: '@REGRESSION' }, async ({ loginPage }) => {
    await expect(loginPage.username).toBeEmpty();
    await expect(loginPage.password).toBeEmpty();
    await expect(loginPage.adminRadio).toBeChecked();
    await expect(loginPage.userRadio).not.toBeChecked();
    await expect(loginPage.roleDropdown).toHaveValue('stud');
    await expect(loginPage.terms).not.toBeChecked();
    await expect(loginPage.errorAlert).toBeHidden();
    await expect(loginPage.modal).toBeHidden();
  });

  test('TC05 role dropdown has Student, Teacher and Consultant options', { tag: '@REGRESSION' }, async ({ loginPage }) => {
    await expect(loginPage.roleOptions).toHaveText(ROLES.map((r) => r.label));
    for (const { value } of ROLES) {
      await loginPage.selectRole(value);
      await expect(loginPage.roleDropdown).toHaveValue(value);
    }
  });

  test('TC06 credentials hint is displayed', { tag: '@REGRESSION' }, async ({ loginPage }) => {
    await expect(loginPage.credentialsHint).toHaveText(`(username is ${USER} and Password is ${PASS})`);
  });

  test('TC07 password field masks the input', { tag: '@REGRESSION' }, async ({ loginPage }) => {
    await loginPage.enterPassword(PASS);
    await expect(loginPage.password).toHaveAttribute('type', 'password');
    await expect(loginPage.password).toHaveValue(PASS);
  });

  test('TC08 terms checkbox can be checked and unchecked', { tag: '@REGRESSION' }, async ({ loginPage }) => {
    await loginPage.terms.check();
    await expect(loginPage.terms).toBeChecked();
    await loginPage.terms.uncheck();
    await expect(loginPage.terms).not.toBeChecked();
  });

  test('TC09 blinking text links open in a new tab', { tag: '@REGRESSION' }, async ({ loginPage }) => {
    await expect(loginPage.blinkingLinks).toHaveCount(2);
    await expect(loginPage.blinkingLinks.nth(0)).toHaveAttribute('href', URLS.documentsRequest);
    await expect(loginPage.blinkingLinks.nth(1)).toHaveAttribute('href', URLS.qaCareer);

    const newTab = await loginPage.openBlinkingLink(0);
    await expect(newTab).toHaveURL(/documents-request/);
    await expect(loginPage.page).toHaveURL(URLS.login);
  });
});

test.describe('Login page - User type radio & modal', () => {
  test('TC10 selecting User shows the confirmation modal', { tag: ['@SMOKE', '@REGRESSION'] }, async ({ loginPage }) => {
    await loginPage.userRadio.check();
    await expect(loginPage.modal).toBeVisible();
    await expect(loginPage.modal).toContainText(MESSAGES.userModal);
    await expect(loginPage.modalOkayBtn).toBeVisible();
    await expect(loginPage.modalCancelBtn).toBeVisible();
  });

  test('TC11 clicking Okay keeps User selected', { tag: '@REGRESSION' }, async ({ loginPage }) => {
    await loginPage.selectUser({ confirm: true });
    await expect(loginPage.userRadio).toBeChecked();
    await expect(loginPage.adminRadio).not.toBeChecked();
  });

  test('TC12 clicking Cancel reverts selection to Admin', { tag: '@REGRESSION' }, async ({ loginPage }) => {
    await loginPage.selectUser({ confirm: false });
    await expect(loginPage.adminRadio).toBeChecked();
    await expect(loginPage.userRadio).not.toBeChecked();
  });

  test('TC13 switching back to Admin does not show the modal', { tag: '@REGRESSION' }, async ({ loginPage }) => {
    await loginPage.selectUser();
    await loginPage.selectAdmin();
    await expect(loginPage.adminRadio).toBeChecked();
    await expect(loginPage.modal).toBeHidden();
  });
});

test.describe('Login flow - positive', () => {
  test('TC14 login as Admin with valid credentials', { tag: ['@SMOKE', '@REGRESSION'] }, async ({ loginPage, shopPage }) => {
    await loginPage.login(USER, PASS);
    await shopPage.expectLoaded();
  });

  test('TC15 shop page shows products after login', { tag: ['@SMOKE', '@REGRESSION'] }, async ({ loginPage, shopPage }) => {
    await loginPage.login(USER, PASS);
    await shopPage.expectLoaded();
    await expect(shopPage.productTitles).toHaveText(PRODUCTS);
    await expect(shopPage.checkoutBtn).toContainText('Checkout ( 0 )');
  });

  for (const { value, label } of ROLES) {
    test(`TC16 login as User with ${label} role`, { tag: '@REGRESSION' }, async ({ loginPage, shopPage }) => {
      await loginPage.selectUser();
      await loginPage.selectRole(value);
      await loginPage.login(USER, PASS);
      await shopPage.expectLoaded();
    });
  }

  test('TC17 login as Admin with Consultant role', { tag: '@REGRESSION' }, async ({ loginPage, shopPage }) => {
    await loginPage.selectRole('consult');
    await loginPage.login(USER, PASS);
    await shopPage.expectLoaded();
  });

  test('TC18 login by pressing Enter in password field', { tag: '@REGRESSION' }, async ({ loginPage, shopPage }) => {
    await loginPage.enterUsername(USER);
    await loginPage.enterPassword(PASS);
    await loginPage.acceptTerms();
    await loginPage.submitWithEnter();
    await shopPage.expectLoaded();
  });

  test('TC19 Sign In button shows "Signing .." while processing', { tag: '@REGRESSION' }, async ({ loginPage, shopPage }) => {
    await loginPage.login(USER, PASS);
    await expect(loginPage.signInBtn).toHaveValue(MESSAGES.signingIn);
    await shopPage.expectLoaded();
  });

  test('TC20 login succeeds after a failed attempt', { tag: '@REGRESSION' }, async ({ loginPage, shopPage }) => {
    await loginPage.login(USER, 'wrongPassword');
    await loginPage.expectError(MESSAGES.incorrect);
    await loginPage.login(USER, PASS);
    await shopPage.expectLoaded();
  });

  // Observed behaviour: the site does NOT enforce the terms checkbox.
  // If the business rule says terms are mandatory, this test documents a defect.
  test('TC21 login without accepting terms (terms not enforced)', { tag: '@REGRESSION' }, async ({ loginPage, shopPage }) => {
    await loginPage.login(USER, PASS, { acceptTerms: false });
    await shopPage.expectLoaded();
  });

  test('TC22 browser back from shop returns to login page', { tag: '@REGRESSION' }, async ({ loginPage, shopPage, page }) => {
    await loginPage.login(USER, PASS);
    await shopPage.expectLoaded();
    await page.goBack();
    await expect(page).toHaveURL(URLS.login);
  });
});

test.describe('Login flow - negative', () => {
  test('TC23 invalid username and password shows error', { tag: ['@SMOKE', '@REGRESSION'] }, async ({ loginPage }) => {
    await loginPage.login('invalidUser', 'invalidPass');
    await loginPage.expectError(MESSAGES.incorrect);
  });

  test('TC24 empty username and password shows error', { tag: ['@SMOKE', '@REGRESSION'] }, async ({ loginPage }) => {
    await loginPage.clickSignIn();
    await loginPage.expectError(MESSAGES.empty);
  });

  for (const { name, username, password } of INVALID_CREDENTIALS) {
    test(`TC25 incorrect credentials: ${name}`, { tag: '@REGRESSION' }, async ({ loginPage, page }) => {
      let dialogShown = false;
      page.on('dialog', async (dialog) => {
        dialogShown = true;
        await dialog.dismiss();
      });
      await loginPage.login(username, password);
      await loginPage.expectError(MESSAGES.incorrect);
      expect(dialogShown, 'no script should execute from input').toBe(false);
    });
  }

  for (const { name, username, password } of EMPTY_CREDENTIALS) {
    test(`TC26 empty field: ${name}`, { tag: '@REGRESSION' }, async ({ loginPage }) => {
      await loginPage.login(username, password);
      await loginPage.expectError(MESSAGES.empty);
    });
  }

  test('TC27 whitespace-only credentials are rejected', { tag: '@REGRESSION' }, async ({ loginPage }) => {
    await loginPage.login('   ', '   ');
    await expect(loginPage.errorAlert).toBeVisible();
    await expect(loginPage.page).toHaveURL(URLS.login);
  });

  test('TC28 invalid login as User type shows error', { tag: '@REGRESSION' }, async ({ loginPage }) => {
    await loginPage.selectUser();
    await loginPage.login('invalidUser', 'invalidPass');
    await loginPage.expectError(MESSAGES.incorrect);
  });

  test('TC29 error alert disappears automatically', { tag: '@REGRESSION' }, async ({ loginPage }) => {
    await loginPage.login('invalidUser', 'invalidPass');
    await loginPage.expectError(MESSAGES.incorrect);
    await expect(loginPage.errorAlert).toBeHidden({ timeout: 10000 });
  });

  test('TC30 entered values are retained after failed login', { tag: '@REGRESSION' }, async ({ loginPage }) => {
    await loginPage.login('invalidUser', 'invalidPass');
    await loginPage.expectError(MESSAGES.incorrect);
    await expect(loginPage.username).toHaveValue('invalidUser');
    await expect(loginPage.password).toHaveValue('invalidPass');
  });

  test('TC31 shop page is not reached on failed login', { tag: '@REGRESSION' }, async ({ loginPage, shopPage }) => {
    await loginPage.login(USER, 'wrongPassword');
    await loginPage.expectError(MESSAGES.incorrect);
    await expect(loginPage.page).not.toHaveURL(URLS.shop);
    await expect(shopPage.productCards).toHaveCount(0);
  });
});
