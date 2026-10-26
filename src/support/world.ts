import { IWorldOptions, World, setWorldConstructor } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { PimPage } from '../pages/PimPage';
import { EmployeeData } from '../utils/testData';

/**
 * One World instance is created per scenario. It owns the browser context/page
 * and lazily creates page objects, so steps stay free of `new XPage(...)` noise.
 */
export class CustomWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;

  /** Scenario-scoped data shared between steps. */
  employee?: EmployeeData;

  private _loginPage?: LoginPage;
  private _dashboardPage?: DashboardPage;
  private _pimPage?: PimPage;

  constructor(options: IWorldOptions) {
    super(options);
  }

  get loginPage(): LoginPage {
    return (this._loginPage ??= new LoginPage(this.page));
  }

  get dashboardPage(): DashboardPage {
    return (this._dashboardPage ??= new DashboardPage(this.page));
  }

  get pimPage(): PimPage {
    return (this._pimPage ??= new PimPage(this.page));
  }
}

setWorldConstructor(CustomWorld);
