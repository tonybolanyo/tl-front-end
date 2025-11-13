# FrontEndTest

You will find the instructions running the project:

- `npm install`
- `npm start`

## Development

### Testing

- **Unit tests**: `npm test` - Run Jasmine/Karma tests
- **Test coverage**: `npm run test:coverage` - Generate coverage report
- **E2E tests**: `npm run e2e:ui` - Run Playwright tests in UI mode

### Code quality

- **Lint check**: `npm run lint` - Check code quality with ESLint
- **Lint fix**: `npm run lint:fix` - Auto-fix linting issues

### Git hooks

This project uses Husky for automated checks:
- **pre-commit**: Runs lint-staged on modified files
- **pre-push**: Runs full linting before pushing to remote

