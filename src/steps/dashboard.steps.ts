import { Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

Then('I should see the dashboard widget {string}', async function (this: CustomWorld, widget: string) {
  expect(await this.dashboardPage.isWidgetVisible(widget)).toBe(true);
});

Then('the side menu should contain {string}', async function (this: CustomWorld, menu: string) {
  const items = await this.dashboardPage.getSideMenuNames();
  expect(items).toContain(menu);
});

When('I open the {string} menu', async function (this: CustomWorld, menu: string) {
  await this.dashboardPage.openMenu(menu);
});

Then('the page header should show {string}', async function (this: CustomWorld, title: string) {
  expect(await this.dashboardPage.getModuleTitle()).toBe(title);
});
