import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  private readonly path = '/web/index.php/auth/login';

  private readonly usernameInput: Locator = this.page.locator('input[name="username"]');
  private readonly passwordInput: Locator = this.page.locator('input[name="password"]');
  private readonly loginButton: Locator = this.page.getByRole('button', { name: 'Login' });
  private readonly loginTitle: Locator = this.page.getByRole('heading', { name: 'Login' });
  private readonly errorAlert: Locator = this.page.locator('.oxd-alert-content-text');
  private readonly fieldErrors: Locator = this.page.locator('.oxd-input-field-error-message');

  async open(): Promise<void> {
    await this.navigateTo(this.path);
    await this.waitForVisible(this.loginTitle);
  }

  async login(username: string, password: string): Promise<void> {
    if (username) await this.fill(this.usernameInput, username);
    if (password) await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
  }

  async getErrorMessage(): Promise<string> {
    return this.getText(this.errorAlert);
  }

  async getFieldErrors(): Promise<string[]> {
    await this.waitForVisible(this.fieldErrors.first());
    return this.getAllTexts(this.fieldErrors);
  }

  async isLoginFormDisplayed(): Promise<boolean> {
    return this.isVisible(this.loginButton);
  }
}
