import { Locator, Page, expect } from '@playwright/test';

/**
 * BasePage – wraps every raw Playwright interaction used by the page objects.
 * Page classes extend this and expose business-level methods only, so locators
 * and low-level waits live in one place.
 */
export abstract class BasePage {
  // Shared OrangeHRM layout elements
  protected readonly moduleTitle: Locator;
  protected readonly toast: Locator;
  protected readonly spinner: Locator;

  constructor(protected readonly page: Page) {
    this.moduleTitle = page.locator('.oxd-topbar-header-breadcrumb-module');
    this.toast = page.locator('.oxd-toast');
    this.spinner = page.locator('.oxd-loading-spinner, .oxd-form-loader').first();
  }

  // ---- Navigation -------------------------------------------------------
  async navigateTo(path: string): Promise<void> {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  async reload(): Promise<void> {
    await this.page.reload({ waitUntil: 'domcontentloaded' });
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  // ---- Element actions --------------------------------------------------
  async click(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }

  async fill(locator: Locator, value: string): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.fill(value);
  }

  /** Clears first (select-all + delete) – more reliable than fill() on OrangeHRM masked inputs. */
  async clearAndType(locator: Locator, value: string): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.click();
    await locator.press('ControlOrMeta+a');
    await locator.press('Delete');
    await locator.pressSequentially(value, { delay: 20 });
  }

  async getText(locator: Locator): Promise<string> {
    await locator.waitFor({ state: 'visible' });
    return (await locator.innerText()).trim();
  }

  async getAllTexts(locator: Locator): Promise<string[]> {
    return (await locator.allInnerTexts()).map((t) => t.trim());
  }

  async isVisible(locator: Locator): Promise<boolean> {
    return locator.isVisible();
  }

  async waitForVisible(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  async waitForHidden(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({ state: 'hidden', timeout });
  }

  // ---- OrangeHRM shared behaviour ----------------------------------------
  /** Waits for the loading spinner (if one appeared) to go away. */
  async waitForLoaders(): Promise<void> {
    try {
      await this.spinner.waitFor({ state: 'visible', timeout: 1_500 });
    } catch {
      /* no spinner appeared – nothing to wait for */
    }
    await this.spinner.waitFor({ state: 'hidden' });
  }

  async getModuleTitle(): Promise<string> {
    return this.getText(this.moduleTitle);
  }

  async getToastMessage(): Promise<string> {
    const message = this.toast.locator('.oxd-text--toast-message');
    await message.waitFor({ state: 'visible' });
    return (await message.innerText()).trim();
  }

  // ---- Assertions --------------------------------------------------------
  async expectUrlToContain(fragment: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(fragment));
  }

  async expectVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }

  async expectText(locator: Locator, text: string | RegExp): Promise<void> {
    await expect(locator).toHaveText(text);
  }

  async expectContainsText(locator: Locator, text: string | RegExp): Promise<void> {
    await expect(locator).toContainText(text);
  }
}
