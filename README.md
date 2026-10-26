# OrangeHRM – Playwright + TypeScript + Cucumber

BDD test automation for the [OrangeHRM demo](https://opensource-demo.orangehrmlive.com)
using **Playwright**, **Cucumber (Gherkin)** and **TypeScript**, structured with the
**BasePage + Page Object Model** pattern.

## Structure

```
features/                 Gherkin feature files (login, dashboard, pim)
src/
  config/env.ts           Typed config loaded from .env
  pages/
    BasePage.ts           Shared Playwright wrappers, waits, assertions, layout locators
    LoginPage.ts          extends BasePage
    DashboardPage.ts      extends BasePage (menu, widgets, logout)
    PimPage.ts            extends BasePage (add / search / delete employee)
  steps/                  Step definitions (thin – delegate to page objects)
  support/
    world.ts              CustomWorld: page/context + lazy page-object getters
    hooks.ts              Browser lifecycle, screenshots + traces on failure
  utils/testData.ts       Unique test data generator
cucumber.js               Cucumber runner config
reports/                  HTML/JSON reports, screenshots, traces (generated)
```

## Setup

```bash
npm install
npm run install:browsers      # downloads Playwright browsers
cp .env.example .env          # already provided; edit if needed
```

## Run

```bash
npm test                      # all scenarios, headless
npm run test:headed           # watch the browser
npm run test:smoke            # @smoke only
npm run test:regression       # @regression only
npm run test:parallel         # 2 parallel workers
npm run test:firefox          # or test:webkit
npx cucumber-js --tags "@pim and not @smoke"
npx cucumber-js features/login.feature:12   # single scenario by line
```

## Reports & debugging

- HTML report: `reports/cucumber-report.html` (failed scenarios include a screenshot)
- JSON report: `reports/cucumber-report.json`
- Failed-scenario traces: `npx playwright show-trace reports/traces/<scenario>.zip`

## Adding a new page / feature

1. Create `src/pages/XPage.ts` extending `BasePage`; keep locators `private`, expose business methods.
2. Add a lazy getter in `src/support/world.ts`.
3. Write a `.feature` file and step definitions that call `this.xPage.*`.

## Notes

- The public demo is shared and resets periodically; tests generate unique employee data and
  clean up where they delete. Occasional slowness/flakiness on the demo site is normal –
  tune `DEFAULT_TIMEOUT` / `STEP_TIMEOUT` in `.env`.
"# Playwright-Cucumber-TypeScript-Project" 
