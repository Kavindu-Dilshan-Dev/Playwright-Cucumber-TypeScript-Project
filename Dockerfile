# Playwright image version MUST match the @playwright/test version in package-lock.json
FROM mcr.microsoft.com/playwright:v1.64.1-noble

WORKDIR /app

# Install dependencies first for better layer caching
COPY package*.json ./
RUN npm ci

COPY . .

# Default: run everything. Override the command to change tags, e.g.
#   docker run ... orangehrm-tests npx cucumber-js --tags @smoke
CMD ["npx", "cucumber-js"]
