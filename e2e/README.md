# Playwright E2E Tests for SelectorComponent

This directory contains end-to-end tests for the SelectorComponent using Playwright.

## Installation

First, install Playwright and its browsers:

```bash
npm install
npx playwright install
```

## Running tests

### Run all E2E tests
```bash
npm run e2e
```

### Run tests in UI mode (interactive)
```bash
npm run e2e:ui
```

### Run tests in headed mode (see browser)
```bash
npm run e2e:headed
```

### Debug tests
```bash
npm run e2e:debug
```

### View test report
```bash
npm run e2e:report
```

## Test coverage

The E2E tests cover:

### Component rendering
- Component visibility
- Day buttons rendering
- Day numbers and month names display
- Navigation buttons (Previous/Next)

### Day selection
- Single day selection
- Deselection behavior
- Selected day styling
- Multiple day selection (if enabled)

### Scroll navigation
- Previous button disabled state
- Scroll right functionality
- Scroll left functionality
- Button state changes
- Gradient indicators

### Responsive behavior
- Mobile viewport display
- Responsive button sizes
- Mobile scroll functionality

### Visual regression
- Default state screenshots
- Selected state screenshots
- Scrolled state screenshots

### Accessibility
- Keyboard navigation
- Button accessibility
- Focus states
- ARIA attributes

### Performance
- Render time
- Scroll performance

## Test structure

```
e2e/
├── selector.component.e2e.spec.ts  # Main test file
└── .gitignore                       # Git ignore for test artifacts
```

## Configuration

The Playwright configuration is in `playwright.config.ts` at the project root.

### Browsers tested
- Chromium (Desktop Chrome)
- Firefox
- WebKit (Safari)
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

### Test reports
- HTML reports are generated in `playwright-report/`
- Test results are stored in `test-results/`
- Screenshots are taken on failures

## Tips

1. **Running specific tests:**
   ```bash
   npx playwright test selector.component.e2e.spec.ts
   ```

2. **Running tests in specific browser:**
   ```bash
   npx playwright test --project=chromium
   ```

3. **Updating screenshots:**
   ```bash
   npx playwright test --update-snapshots
   ```

4. **Running tests matching a pattern:**
   ```bash
   npx playwright test -g "should select"
   ```
