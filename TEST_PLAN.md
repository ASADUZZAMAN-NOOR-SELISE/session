# Test Plan: Login Flow

**Application under test:** https://rahulshettyacademy.com/loginpagePractise/
**Framework:** Playwright (JavaScript), `@playwright/test`
**Spec file:** `tests/loginPage.spec.js`
**Browsers:** Chromium, Firefox, WebKit (from `playwright.config.js`)

---

## 1. Objective

Check the login page end to end: how it looks, how the form controls behave, and what happens on successful and failed logins. Each test is tagged so the critical subset can run quickly (`@SMOKE`) and the full suite can run before a release (`@REGRESSION`).

## 2. Scope

### In scope
- Page load and title
- Form elements: username, password, Admin/User radio, role dropdown, terms checkbox, Sign In button
- User-type confirmation modal (Okay / Cancel)
- Successful login and redirect to the shop page
- Failed login: invalid, empty, case-sensitive, whitespace and malicious input
- Error message display and auto-hide
- Header links (open in a new tab)

### Out of scope
- Shop, cart and checkout features beyond checking that the login landed on the shop page
- Performance, load and accessibility audits
- Backend or API testing

## 3. Application Behaviour Observed During Exploration

| Area | Observed behaviour |
|---|---|
| Valid credentials | `rahulshettyacademy` / `Learning@830$3mK2` → redirects to `/angularpractice/shop` (title "ProtoCommerce") |
| Wrong credentials | Red alert: **"Incorrect username/password."**; stays on the login page |
| Empty username or password | Red alert: **"Empty username/password."** |
| Error alert | Disappears on its own after about 2 seconds |
| Sign In button | Text changes to **"Signing .."** while the request is processing |
| User radio | Opens a modal: "You will be limited to only fewer functionalities of the app. Proceed?" |
| Modal → Okay | User stays selected |
| Modal → Cancel | Selection goes back to Admin |
| Terms checkbox | **Not enforced.** Login succeeds even when it is unchecked (possible defect) |
| Case / whitespace | Credentials are case-sensitive; leading or trailing spaces are rejected |
| Enter key | Pressing Enter in the password field submits the form |
| Header links | Two `.blinkingText` links with `target="_blank"` |
| Injection input | SQL injection and XSS payloads are rejected with "Incorrect" and no script runs |

## 4. Tagging Strategy

| Tag | Purpose | When to run |
|---|---|---|
| `@SMOKE` | Critical-path checks: the page loads, valid login works, basic errors show | Every commit or deploy (about 1 minute) |
| `@REGRESSION` | Full coverage, including edge cases and negative cases | Nightly or before a release |

Every `@SMOKE` test is also tagged `@REGRESSION`, so the regression run is the complete suite.

## 5. Test Data

| Data | Value |
|---|---|
| Valid username | `rahulshettyacademy` |
| Valid password | `Learning@830$3mK2` |
| Invalid username / password | `invalidUser` / `invalidPass` |
| Roles | `stud` (Student), `teach` (Teacher), `consult` (Consultant) |
| Malicious input | `' OR '1'='1`, `<script>alert(1)</script>`, `<img src=x onerror=alert(1)>` |
| Boundary input | 500-character strings, special characters only, whitespace only |

## 6. Test Cases

### 6.1 UI / Page Elements

| ID | Test case | Expected result | Tags |
|---|---|---|---|
| TC01 | Page loads with the correct title | Title is "LoginPage Practise \| Rahul Shetty Academy" | @SMOKE @REGRESSION |
| TC02 | All form elements are visible | Username, password, both radios, dropdown, terms checkbox and Sign In button are visible; the button is enabled | @SMOKE @REGRESSION |
| TC03 | Field labels and input types | Labels "Username:" and "Password:"; input types are `text` and `password` | @REGRESSION |
| TC04 | Default form state | Fields empty, Admin checked, Student selected, terms unchecked, no alert, no modal | @REGRESSION |
| TC05 | Dropdown options | Student, Teacher and Consultant are listed and each can be selected | @REGRESSION |
| TC06 | Credentials hint shown | The hint text shows the valid username and password | @REGRESSION |
| TC07 | Password is masked | Field type stays `password` after typing | @REGRESSION |
| TC08 | Terms checkbox toggles | Can be checked and unchecked | @REGRESSION |
| TC09 | Header links | 2 links with the correct `href`; clicking opens a new tab and the login page stays open | @REGRESSION |

### 6.2 User Type Radio and Modal

| ID | Test case | Expected result | Tags |
|---|---|---|---|
| TC10 | Select User | The modal appears with the warning text and Okay/Cancel buttons | @SMOKE @REGRESSION |
| TC11 | Modal → Okay | The modal closes and User stays checked | @REGRESSION |
| TC12 | Modal → Cancel | The modal closes and the selection goes back to Admin | @REGRESSION |
| TC13 | Switch back to Admin | No modal appears and Admin is checked | @REGRESSION |

### 6.3 Login: Positive

| ID | Test case | Expected result | Tags |
|---|---|---|---|
| TC14 | Admin login with valid credentials | Redirects to the shop page (ProtoCommerce) | @SMOKE @REGRESSION |
| TC15 | Shop page content after login | 4 products (iphone X, Samsung Note 8, Nokia Edge, Blackberry); Checkout shows (0) | @SMOKE @REGRESSION |
| TC16 | User login with each role (Student, Teacher, Consultant), data-driven | Each role reaches the shop page | @REGRESSION |
| TC17 | Admin login with the Consultant role | Reaches the shop page | @REGRESSION |
| TC18 | Submit with the Enter key | Reaches the shop page | @REGRESSION |
| TC19 | Button loading state | The button shows "Signing .." and then redirects | @REGRESSION |
| TC20 | Valid login after a failed attempt | The error shows first, then the valid login succeeds | @REGRESSION |
| TC21 | Login without accepting terms | Succeeds; records current behaviour (possible defect) | @REGRESSION |
| TC22 | Browser Back after login | Returns to the login page | @REGRESSION |

### 6.4 Login: Negative

| ID | Test case | Expected result | Tags |
|---|---|---|---|
| TC23 | Invalid username and password | "Incorrect username/password." | @SMOKE @REGRESSION |
| TC24 | Both fields empty | "Empty username/password." | @SMOKE @REGRESSION |
| TC25a | Valid username, wrong password | Incorrect error | @REGRESSION |
| TC25b | Wrong username, valid password | Incorrect error | @REGRESSION |
| TC25c | Username in uppercase | Incorrect error (case-sensitive) | @REGRESSION |
| TC25d | Password in lowercase | Incorrect error (case-sensitive) | @REGRESSION |
| TC25e | Username with leading or trailing spaces | Incorrect error (input not trimmed) | @REGRESSION |
| TC25f | Password with a trailing space | Incorrect error | @REGRESSION |
| TC25g | Partial password | Incorrect error | @REGRESSION |
| TC25h | Username and password swapped | Incorrect error | @REGRESSION |
| TC25i | SQL injection payload | Incorrect error and no bypass | @REGRESSION |
| TC25j | XSS payload | Incorrect error and no JavaScript dialog appears | @REGRESSION |
| TC25k | 500-character input | Incorrect error and no crash | @REGRESSION |
| TC25l | Special characters only | Incorrect error | @REGRESSION |
| TC26a | Only username filled | "Empty username/password." | @REGRESSION |
| TC26b | Only password filled | "Empty username/password." | @REGRESSION |
| TC27 | Whitespace-only credentials | An error is shown and the page stays on login | @REGRESSION |
| TC28 | Invalid login as the User type | Incorrect error | @REGRESSION |
| TC29 | Error alert auto-hides | The alert disappears within a few seconds | @REGRESSION |
| TC30 | Values kept after a failed login | Username and password keep the entered values | @REGRESSION |
| TC31 | No access to the shop on failure | URL is not the shop page and no product cards are shown | @REGRESSION |

**Total:** 31 test IDs, which expand to **45 test runs per browser** because of the data-driven cases.

## 7. Coverage Summary

| Category | Test runs |
|---|---|
| UI / elements | 9 |
| Radio and modal | 4 |
| Positive login | 11 |
| Negative login | 21 |
| **Total per browser** | **45** |
| `@SMOKE` subset | 7 |

## 8. Implementation Approach

- **Page Object Model:**
  - `pages/LoginPage.js`: locators and actions for the login page (`login()`, `selectUser()`, `selectRole()`, `expectError()`, and so on)
  - `pages/ShopPage.js`: locators for the shop page and `expectLoaded()`
  - `pages/fixtures.js`: custom `loginPage` and `shopPage` fixtures; `loginPage` opens the login URL automatically
  - `test-data/loginData.js`: URLs, credentials, messages, roles and the data-driven input sets
- **Data-driven loops** cover the role variations and invalid-input variations.
- **`beforeEach`** opens the login page so every test starts from a clean state.
- **Playwright tag syntax:** `test('name', { tag: ['@SMOKE', '@REGRESSION'] }, ...)`.
- Web-first assertions (`toBeVisible`, `toHaveURL`, `toHaveText`) are used instead of fixed waits.

## 9. Execution Commands

Suites are defined as projects in `playwright.config.js` (`smoke` filters on `@SMOKE`, `regression` filters on `@REGRESSION`):

```bash
npm run test:smoke        # smoke suite
npm run test:regression   # regression suite
npm run test:all          # both suites
npm run report            # open the HTML report

# Equivalent direct commands
npx playwright test --project=smoke
npx playwright test --project=regression

# Smoke suite by tag
npx playwright test --grep @SMOKE

# Full regression suite
npx playwright test --grep @REGRESSION

# Single browser
npx playwright test --grep @SMOKE --project=chromium

# HTML report
npx playwright show-report
```

## 10. Entry and Exit Criteria

**Entry:** the site is reachable, Playwright browsers are installed (`npx playwright install`), and the test credentials are valid.

**Exit:** all `@SMOKE` tests pass on all browsers; any `@REGRESSION` failures are triaged and either fixed or logged as defects.

## 11. Risks and Notes

| Risk / note | Mitigation |
|---|---|
| Public third-party site: content, credentials or timing may change | Keep credentials and expected text in constants at the top of the spec |
| Network latency | Use web-first assertions with default timeouts; CI retries are set to 2 in the config |
| The error alert auto-hides after about 2 seconds | Assert visibility right after the action |
| **Terms checkbox not enforced (TC21)** | Confirm the business rule with the product owner. If terms should be mandatory, log a defect and change TC21 to expect a blocked login |

## 12. Current Status

- Spec implemented: `tests/loginPage.spec.js`
- Chromium run: **45 passed, 0 failed**
- Firefox and WebKit: not run yet
