import { Given } from '@cucumber/cucumber';
import { config } from '../config/env';
import { CustomWorld } from '../support/world';

Given('I am on the OrangeHRM login page', async function (this: CustomWorld) {
  await this.loginPage.open();
});

Given('I am logged in as an admin user', async function (this: CustomWorld) {
  await this.loginPage.open();
  await this.loginPage.login(config.credentials.username, config.credentials.password);
  await this.dashboardPage.waitUntilLoaded();
});
