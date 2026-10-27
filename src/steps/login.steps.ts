import { Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { config } from '../config/env';
import { CustomWorld } from '../support/world';

When(
  'I login with username {string} and password {string}',
  async function (this: CustomWorld, username: string, password: string) {
    await this.loginPage.login(username, password);
  }
);

When('I login with valid admin credentials', async function (this: CustomWorld) {
  await this.loginPage.login(config.credentials.username, config.credentials.password);
});

When('I logout from the application', async function (this: CustomWorld) {
  await this.dashboardPage.logout();
});

Then('I should be redirected to the dashboard', async function (this: CustomWorld) {
  await this.dashboardPage.waitUntilLoaded();
});

Then('I should see the login error {string}', async function (this: CustomWorld, message: string) {
  expect(await this.loginPage.getErrorMessage()).toBe(message);
});

Then('I should see {string} validation on both fields', async function (this: CustomWorld, message: string) {
  const errors = await this.loginPage.getFieldErrors();
  expect(errors).toEqual([message, message]);
});

Then('I should be back on the login page', async function (this: CustomWorld) {
  await this.loginPage.expectUrlToContain('/auth/login');
  expect(await this.loginPage.isLoginFormDisplayed()).toBe(true);
});
