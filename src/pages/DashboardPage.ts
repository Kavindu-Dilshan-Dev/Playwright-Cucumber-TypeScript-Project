import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  private readonly userDropdown: Locator = this.page.locator('.oxd-userdropdown-tab');
  private readonly logoutMenuItem: Locator = this.page.getByRole('menuitem', { name: 'Logout' });
  private readonly sideMenuItems: Locator = this.page.locator('.oxd-main-menu-item');

  async waitUntilLoaded(): Promise<void> {
    await this.expectUrlToContain('/dashboard/index');
    await this.expectText(this.moduleTitle, 'Dashboard');
  }

  widget(title: string): Locator {
    return this.page.locator('.orangehrm-dashboard-widget').filter({ hasText: title });
  }

  async isWidgetVisible(title: string): Promise<boolean> {
    await this.waitForVisible(this.widget(title).first());
    return this.isVisible(this.widget(title).first());
  }

  async openMenu(menuName: string): Promise<void> {
    await this.click(this.sideMenuItems.filter({ hasText: menuName }).first());
    await this.waitForLoaders();
  }

  async getSideMenuNames(): Promise<string[]> {
    await this.waitForVisible(this.sideMenuItems.first());
    return this.getAllTexts(this.sideMenuItems);
  }

  async logout(): Promise<void> {
    await this.click(this.userDropdown);
    await this.click(this.logoutMenuItem);
  }
}
