import dotenv from 'dotenv';

dotenv.config();

const bool = (value: string | undefined, fallback: boolean): boolean =>
  value === undefined ? fallback : value.toLowerCase() === 'true';

export type BrowserName = 'chromium' | 'firefox' | 'webkit';

export const config = {
  baseUrl: process.env.BASE_URL ?? 'https://opensource-demo.orangehrmlive.com',
  credentials: {
    username: process.env.ADMIN_USERNAME ?? 'Admin',
    password: process.env.ADMIN_PASSWORD ?? 'admin123'
  },
  browser: (process.env.BROWSER ?? 'chromium') as BrowserName,
  headless: bool(process.env.HEADLESS, true),
  slowMo: Number(process.env.SLOW_MO ?? 0),
  defaultTimeout: Number(process.env.DEFAULT_TIMEOUT ?? 30_000),
  stepTimeout: Number(process.env.STEP_TIMEOUT ?? 60_000),
  traceOnFailure: bool(process.env.TRACE_ON_FAILURE, true)
};
