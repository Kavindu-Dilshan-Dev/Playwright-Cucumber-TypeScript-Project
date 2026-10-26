import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { EmployeeData } from '../utils/testData';

export class PimPage extends BasePage {
  private readonly addEmployeePath = '/web/index.php/pim/addEmployee';
  private readonly employeeListPath = '/web/index.php/pim/viewEmployeeList';

  // Add Employee form
  private readonly firstNameInput: Locator = this.page.locator('input[name="firstName"]');
  private readonly middleNameInput: Locator = this.page.locator('input[name="middleName"]');
  private readonly lastNameInput: Locator = this.page.locator('input[name="lastName"]');
  private readonly addEmployeeIdInput: Locator = this.page
    .locator('.oxd-input-group')
    .filter({ has: this.page.locator('label', { hasText: /^Employee Id$/ }) })
    .locator('input');
  private readonly saveButton: Locator = this.page.getByRole('button', { name: 'Save' });
  private readonly personalDetailsHeading: Locator = this.page.getByRole('heading', { name: 'Personal Details' });

  // Employee List – search filter + results
  private readonly searchIdInput: Locator = this.page
    .locator('.oxd-table-filter .oxd-input-group')
    .filter({ has: this.page.locator('label', { hasText: /^Employee Id$/ }) })
    .locator('input');
  private readonly searchButton: Locator = this.page.getByRole('button', { name: 'Search' });
  private readonly resultRows: Locator = this.page.locator('.oxd-table-body .oxd-table-card');
  private readonly confirmDeleteButton: Locator = this.page.getByRole('button', { name: /Yes, Delete/ });

  // ---- Add employee -------------------------------------------------------
  async openAddEmployee(): Promise<void> {
    await this.navigateTo(this.addEmployeePath);
    await this.waitForVisible(this.firstNameInput);
    await this.waitForLoaders();
  }

  async addEmployee(employee: EmployeeData): Promise<void> {
    await this.fill(this.firstNameInput, employee.firstName);
    await this.fill(this.middleNameInput, employee.middleName);
    await this.fill(this.lastNameInput, employee.lastName);
    await this.clearAndType(this.addEmployeeIdInput, employee.employeeId);
    await this.click(this.saveButton);
  }

  async waitForPersonalDetails(): Promise<void> {
    await this.waitForVisible(this.personalDetailsHeading);
    await this.expectUrlToContain('/pim/viewPersonalDetails');
  }

  // ---- Employee list ------------------------------------------------------
  async openEmployeeList(): Promise<void> {
    await this.navigateTo(this.employeeListPath);
    await this.waitForVisible(this.searchButton);
    await this.waitForLoaders();
  }

  async searchByEmployeeId(employeeId: string): Promise<void> {
    await this.fill(this.searchIdInput, employeeId);
    await this.click(this.searchButton);
    await this.waitForLoaders();
  }

  async getResultCount(): Promise<number> {
    return this.resultRows.count();
  }

  async getFirstResultText(): Promise<string> {
    return this.getText(this.resultRows.first());
  }

  async deleteFirstResult(): Promise<void> {
    await this.click(this.resultRows.first().locator('button:has(.bi-trash)'));
    await this.click(this.confirmDeleteButton);
    await this.waitForLoaders();
  }
}
