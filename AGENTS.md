# Trust No One Protocol (Antigravity)

This repository follows a strict workflow for AI agents.

## Core Principles
1. **Real E2E (End-to-End) Tests Only**: Do not ask if code works. Spin up the app, check the database, and verify actual output.
2. **Logs are King**: Add logging to every feature. Read logs to find issues before merging.
3. **Distrust Unit Tests**: Ignore unit tests; focus on regression/integration tests.
4. **Embrace the Rewrite**: If scope is fuzzy, a rewrite is often faster than patching a shaky foundation.
5. **Enforce via Scripts, Not Just Text**: Use a preflight script to check rules.
6. **Map the Architecture**: Regularly generate flowcharts of data flow to reveal logic gaps.
7. **Boring CI/CD is Essential**: Automate preflight and E2E tests.
8. **Manual Review**: Do not skip code review.
9. **Code is Documentation**: Add JSDoc/comments inline; external docs rot.

## Preflight Script (Required)
Save as `preflight.sh` in the project root:

```bash
#!/bin/bash

# Configuration
# Colors for clear feedback
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to handle errors
fail() {
    echo -e "${RED}[FAILURE] $1${NC}"
    echo "----------------------------------------------------"
    echo "The preflight check failed. Do not merge. Fix the issues."
    exit 1
}

pass() {
    echo -e "${GREEN}[PASS] $1${NC}"
}

echo "----------------------------------------------------"
echo -e "${YELLOW}STARTING PREFLIGHT CHECKS${NC}"
echo "----------------------------------------------------"

# 1. IDENTIFY ENVIRONMENT
if [ -f "package.json" ]; then
    ENV="NODE"
    echo "Detected: Node.js/TypeScript environment"
elif [ -f "requirements.txt" ] || [ -f "pyproject.toml" ]; then
    ENV="PYTHON"
    echo "Detected: Python environment"
else
    echo "Unknown environment. Defaulting to generic checks."
    ENV="GENERIC"
fi

# 2. STATIC ANALYSIS & TYPE CHECKING
echo -e "\nRunning Static Analysis..."
if [ "$ENV" == "NODE" ]; then
    # Using TypeScript compiler to check for type errors without emitting files
    npx tsc --noEmit || fail "TypeScript compilation failed. Types are mismatched."
    pass "TypeScript checks clean."
elif [ "$ENV" == "PYTHON" ]; then
    # using mypy for type checking
    mypy . || fail "Python type checking failed."
    pass "Type checks clean."
fi

# 3. LOGGING ENFORCEMENT
echo -e "\nVerifying Observability..."
CHANGED_FILES=$(git diff --name-only --cached) # Checks staged files
if [ -z "$CHANGED_FILES" ]; then
    echo "No files staged. Checking recent source files..."
    if [ "$ENV" == "NODE" ]; then
        grep -r "console.log\|logger\." ./src > /dev/null || fail "No logging detected in ./src. Add logs to trace execution."
    else
        grep -r "print(\|logging\." . > /dev/null || fail "No logging detected. Add logs to trace execution."
    fi
else
    for file in $CHANGED_FILES; do
        if [[ $file == *.ts ]] || [[ $file == *.js ]] || [[ $file == *.py ]]; then
            grep "console.log\|logger\.\|print(\|logging\." "$file" > /dev/null
            if [ $? -ne 0 ]; then
                echo -e "${YELLOW}WARNING: No logs found in modified file: $file${NC}"
                # Uncomment to fail on missing logs:
                # fail "You modified code without adding logging."
            fi
        fi
    done
fi
pass "Logging presence verified."

# 4. RUN REAL TESTS (E2E)
echo -e "\nRunning End-to-End Tests..."
if [ "$ENV" == "NODE" ]; then
    # Runs Playwright using the config
    npx playwright test || fail "E2E Tests failed. Run 'npx playwright show-report' to see why."
elif [ "$ENV" == "PYTHON" ]; then
    pytest || fail "Tests failed."
fi
pass "Real-world verification complete."

echo "----------------------------------------------------"
echo -e "${GREEN}PREFLIGHT COMPLETE. SYSTEM IS STABLE.${NC}"
echo "----------------------------------------------------"
```

Make it executable:

```bash
chmod +x preflight.sh
```

## Playwright E2E Configuration (Node/TypeScript)
Save as `playwright.config.ts`:

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
```

Baseline sanity test `e2e/sanity.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

test('App loads and has correct title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Math Omni/);
  const mainHeading = page.locator('h1');
  await expect(mainHeading).toBeVisible();
});
```

## Governor System Prompt (Copy into AGENTS.md, .cursorrules, or system instructions)
```
RULE: THE PREFLIGHT PROTOCOL
CRITICAL PROTOCOLS:
NO UNIT TESTS: Do not generate unit tests. Only generate and run End-to-End (E2E) tests that verify actual app behavior (DB writes, UI renders).
VERIFY VIA LOGS: Before confirming a task is done, you must read the application logs. If there are no logs, add them.
PREFLIGHT MANDATORY: You are not allowed to submit code for review until you have run ./preflight.sh and fixed all errors.
VISUALIZE FIRST: If I ask for a major feature, generate a text-based flowchart (Mermaid.js) of the data flow first. Find the logic gaps before writing code.
DOCS IN CODE: Do not write a README summary. Add JSDoc/Comments directly to the functions explaining why this exists, not just what it does.
EXECUTION LOOP:
Before you claim ANY task is "complete" or ask for my review:
Run ./preflight.sh in the terminal.
Analyze the Output. If it fails, do not ask me what to do. Read the error, fix the code, and run it again.
Only when the script outputs [PASS] may you present the solution.
```

## Daily Workflow Template
```
Implement [Feature Name]. Update the architecture diagram to show how it fits. Create a new E2E test file e2e/[feature].spec.ts that verifies the success state. Implement the code, add logging, and run ./preflight.sh. Do not ask for feedback until the preflight passes.
```
