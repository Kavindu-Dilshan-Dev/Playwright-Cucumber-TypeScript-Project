<<<<<<< HEAD
FROM mcr.microsoft.com/playwright:v1.49.1-jammy

WORKDIR /app

COPY package.json package-lock.json ./
=======
# Playwright image version MUST match the @playwright/test version in package-lock.json
FROM mcr.microsoft.com/playwright:v1.64.1-noble

WORKDIR /app

# Install dependencies first for better layer caching
COPY package*.json ./
>>>>>>> b9b574e0d7387c49b863bbb9737c28d6f036780d
RUN npm ci

COPY . .

<<<<<<< HEAD
RUN mkdir -p reports

CMD ["npx", "cucumber-js"]
=======
# Defaults – override at runtime with -e
ENV BASE_URL=https://opensource-demo.orangehrmlive.com \
    ADMIN_USERNAME=Admin \
    ADMIN_PASSWORD=admin123 \
    BROWSER=chromium \
    HEADLESS=true \
    CI=true

# Default: run everything. Override the command to change tags, e.g.
#   docker run ... orangehrm-tests npx cucumber-js --tags @smoke
CMD ["npx", "cucumber-js"]
>>>>>>> b9b574e0d7387c49b863bbb9737c28d6f036780d
