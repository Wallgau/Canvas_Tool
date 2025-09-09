# Git Hooks

This project uses Husky to enforce code quality before commits and pushes.

## Hooks

### Pre-commit Hook

Runs automatically before each commit:

- **lint-staged**: Lints and formats only staged files
- **Tests**: Runs the full test suite
- **Type Check**: Ensures TypeScript compilation

### Pre-push Hook

Runs automatically before each push:

- **Tests**: Full test suite
- **Type Check**: TypeScript compilation
- **Linting**: ESLint check
- **Prettier**: Code formatting check
- **Build**: Ensures the project builds successfully

## What This Prevents

- ❌ Committing code with linting errors
- ❌ Committing code that doesn't pass tests
- ❌ Committing code with TypeScript errors
- ❌ Pushing code that doesn't build
- ❌ Pushing code with formatting issues

## Bypassing Hooks (Not Recommended)

If you absolutely need to bypass hooks (emergency fixes only):

```bash
# Skip pre-commit hook
git commit --no-verify -m "emergency fix"

# Skip pre-push hook
git push --no-verify
```

## Setup for New Developers

When a new developer clones the repo, they need to run:

```bash
npm install
```

This will automatically set up the Git hooks via the `prepare` script in package.json.
