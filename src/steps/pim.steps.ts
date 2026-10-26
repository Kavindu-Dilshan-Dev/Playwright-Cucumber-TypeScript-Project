import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { generateEmployee } from '../utils/testData';

Given('I have added a new employee', async function (this: CustomWorld) {
  this.employee = generateEmployee();
  await this.pimPage.openAddEmployee();
  await this.pimPage.addEmployee(this.employee);
  await this.pimPage.waitForPersonalDetails();
});

When('I add a new employee with unique details', async function (this: CustomWorld) {
  this.employee = generateEmployee();
  await this.pimPage.openAddEmployee();
  await this.pimPage.addEmployee(this.employee);
});

Then('the employee should be saved successfully', async function (this: CustomWorld) {
  await this.pimPage.waitForPersonalDetails();
});

When('I search the employee list by the new employee id', async function (this: CustomWorld) {
  await this.pimPage.openEmployeeList();
  await this.pimPage.searchByEmployeeId(this.employee!.employeeId);
});

Then('the employee should appear in the search results', async function (this: CustomWorld) {
  expect(await this.pimPage.getResultCount()).toBe(1);
  const row = await this.pimPage.getFirstResultText();
  expect(row).toContain(this.employee!.employeeId);
  expect(row).toContain(this.employee!.firstName);
  expect(row).toContain(this.employee!.lastName);
});

When('I delete the employee from the results', async function (this: CustomWorld) {
  await this.pimPage.deleteFirstResult();
});

Then('searching for the employee id should return no records', async function (this: CustomWorld) {
  await this.pimPage.searchByEmployeeId(this.employee!.employeeId);
  expect(await this.pimPage.getResultCount()).toBe(0);
});
