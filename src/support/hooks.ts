import {
  After,
  AfterAll,
  Before,
  BeforeAll,
  ITestCaseHookParameter,
  Status,
  setDefaultTimeout
} from '@cucumber/cucumber';
import { Browser, chromium, firefox, webkit } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { config } from '../config/env';
import { CustomWorld } from './world';

setDefaultTimeout(config.stepTimeout);

let browser: Browser;

const launchers = { chromium, firefox, webkit };

BeforeAll(async function () {
  fs.mkdirSync('reports/screenshots', { recursive: true });
  fs.mkdirSync('reports/traces', { recursive: true });
  browser = await launchers[config.browser].launch({
    headless: config.headless,
    slowMo: config.slowMo
  });
});

Before(async function (this: CustomWorld) {
  this.browser = browser;
  this.context = await browser.newContext({
    baseURL: config.baseUrl,
    viewport: { width: 1440, height: 900 }
  });
  if (config.traceOnFailure) {
    await this.context.tracing.start({ screenshots: true, snapshots: true });
  }
  this.page = await this.context.newPage();
  this.page.setDefaultTimeout(config.defaultTimeout);
});

After(async function (this: CustomWorld, scenario: ITestCaseHookParameter) {
  const failed = scenario.result?.status === Status.FAILED;
  const safeName = scenario.pickle.name.replace(/[^a-z0-9]+/gi, '_').slice(0, 80);

  if (failed) {
    const screenshot = await this.page.screenshot({ fullPage: true });
    await this.attach(screenshot, 'image/png');
    fs.writeFileSync(path.join('reports/screenshots', `${safeName}.png`), screenshot);
  }

  if (config.traceOnFailure) {
    await this.context.tracing.stop(
      failed ? { path: path.join('reports/traces', `${safeName}.zip`) } : undefined
    );
  }

  await this.page.close();
  await this.context.close();
});

AfterAll(async function () {
  await browser?.close();
});
