# 🚀 CI/CD Pipeline Guide

This document explains the comprehensive CI/CD pipeline setup for Tool Canvas.

## 📋 Overview

Our CI/CD pipeline includes:

- **Automated Testing** - Unit, integration, and E2E tests
- **Code Quality** - Linting, type checking, and security audits
- **Performance Monitoring** - Lighthouse CI and bundle analysis
- **Accessibility Testing** - Automated a11y checks
- **Regression Detection** - Performance and functionality regression tests
- **Automated Deployment** - GitHub Pages deployment
- **Dependency Management** - Automated updates with Dependabot

## 🔄 Workflows

### 1. CI Workflow (`.github/workflows/ci.yml`)

**Triggers:** Push to main/develop, Pull Requests

**Jobs:**

- **Test Suite** - Runs on Node.js 20 & 22
  - Type checking (`npm run type-check`)
  - Linting (`npm run lint`)
  - Unit tests (`npm run test:run`)
  - Coverage reporting (`npm run test:coverage`)
  - Uploads coverage to Codecov

- **Build & Bundle Analysis**
  - Builds the application
  - Analyzes bundle sizes
  - Uploads build artifacts

- **Performance Testing**
  - Runs Lighthouse CI
  - Checks performance budgets
  - Monitors Core Web Vitals

- **Security Audit**
  - Runs `npm audit`
  - Snyk security scanning
  - Vulnerability detection

- **Accessibility Testing**
  - Playwright E2E tests
  - A11y compliance checks
  - Screen reader compatibility

- **Regression Detection** (PR only)
  - Compares bundle sizes
  - Performance regression checks
  - Functionality regression tests

### 2. Deploy Workflow (`.github/workflows/deploy.yml`)

**Triggers:** Push to main, Manual dispatch

**Jobs:**

- **Deploy to GitHub Pages**
  - Builds production bundle
  - Deploys to GitHub Pages
  - Sets up proper permissions

- **Lighthouse CI**
  - Runs performance tests on deployed site
  - Uploads results to temporary storage

### 3. Performance Workflow (`.github/workflows/performance.yml`)

**Triggers:** Weekly schedule, Manual dispatch, Source code changes

**Jobs:**

- **Performance Budget Check**
  - Lighthouse CI with strict budgets
  - Core Web Vitals monitoring
  - Performance regression detection

- **Bundle Size Analysis**
  - Detailed bundle size reporting
  - Gzip size analysis
  - Size budget enforcement

### 4. Dependabot Workflow (`.github/workflows/dependabot.yml`)

**Triggers:** Dependabot PRs

**Jobs:**

- **Auto-merge Dependabot PRs**
  - Runs full test suite
  - Auto-merges if all checks pass
  - Handles minor/patch updates

## 🛠️ Configuration Files

### Lighthouse CI (`lighthouserc.js`)

```javascript
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:4173'],
      startServerCommand: 'npm run preview',
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'first-contentful-paint': ['error', { maxNumericValue: 1800 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        // ... more assertions
      },
    },
  },
};
```

### Vitest Configuration (`vitest.config.ts`)

```typescript
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'c8',
      reporter: ['text', 'json', 'html', 'lcov'],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
});
```

### Playwright Configuration (`playwright.config.js`)

```javascript
module.exports = defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
  ],
});
```

## 📊 Performance Budgets

| Metric      | Budget  | Current | Status |
| ----------- | ------- | ------- | ------ |
| LCP         | < 2.5s  | ~0.8s   | ✅     |
| FCP         | < 1.8s  | ~0.3s   | ✅     |
| TTI         | < 3.8s  | ~1.2s   | ✅     |
| CLS         | < 0.1   | ~0.05   | ✅     |
| Bundle Size | < 500KB | ~200KB  | ✅     |

## 🧪 Test Coverage

| Type       | Coverage | Target |
| ---------- | -------- | ------ |
| Lines      | 85%+     | 80%    |
| Functions  | 85%+     | 80%    |
| Branches   | 80%+     | 80%    |
| Statements | 85%+     | 80%    |

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run dev:fast         # Fast dev with watch
npm run dev:100          # Production-like dev

# Building
npm run build            # Build for production
npm run build:watch      # Build with watch mode
npm run preview          # Preview production build

# Testing
npm run test             # Run tests in watch mode
npm run test:run         # Run tests once
npm run test:coverage    # Run tests with coverage
npm run test:ui          # Run tests with UI
npm run test:a11y        # Run accessibility tests
npm run test:regression  # Run regression tests

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run type-check       # Run TypeScript checks
npm run audit            # Security audit
npm run audit:fix        # Fix security issues

# Performance
npm run lighthouse       # Run Lighthouse CI
npm run bundle-analyze   # Analyze bundle size
```

## 🚨 Troubleshooting

### Common Issues

1. **Tests failing in CI but passing locally**
   - Check Node.js version compatibility
   - Ensure all dependencies are installed
   - Verify environment variables

2. **Performance tests failing**
   - Check if the preview server is running
   - Verify Lighthouse CI configuration
   - Check for network issues

3. **Build failures**
   - Check TypeScript errors
   - Verify all imports are correct
   - Check for missing dependencies

4. **Deployment failures**
   - Verify GitHub Pages settings
   - Check build artifacts
   - Verify permissions

### Debug Commands

```bash
# Run specific test suites
npm run test:run -- --reporter=verbose
npm run test:a11y -- --debug

# Check bundle size locally
npm run build
npm run bundle-analyze

# Run Lighthouse locally
npm run preview &
npm run lighthouse
```

## 📈 Monitoring

### GitHub Actions

- View workflow runs in the Actions tab
- Check individual job logs for failures
- Monitor performance trends over time

### Codecov

- Track test coverage trends
- Identify uncovered code areas
- Set coverage requirements

### Lighthouse CI

- Monitor Core Web Vitals
- Track performance scores
- Identify regression patterns

## 🔄 Maintenance

### Weekly Tasks

- Review Dependabot PRs
- Check performance metrics
- Review security alerts

### Monthly Tasks

- Update dependencies
- Review and update performance budgets
- Analyze test coverage trends

### Quarterly Tasks

- Review and update CI/CD configuration
- Evaluate new testing tools
- Update documentation

## 📚 Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Dependabot Documentation](https://docs.github.com/en/code-security/dependabot)
