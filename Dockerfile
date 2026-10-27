# Use a Playwright image with browsers and system dependencies
FROM mcr.microsoft.com/playwright:v1.64.1-noble

WORKDIR /app

# Install project dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy the automation source code
COPY . .

# Create a directory for test reports
RUN mkdir -p reports

# Default command; Jenkins can override this
CMD ["npx", "cucumber-js"]