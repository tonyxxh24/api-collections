# api-collections

Collect free/paid and useful APIs with a modern full-stack UI.

## Quality baseline

This repository now uses a frontend/backend workspace with a quality gate:

- **Lint + formatting** for both apps.
- **Type checking** via TypeScript and Zod schemas for metadata/request payload validation.
- **Backend route tests** for:
  - `GET /apis`
  - `GET /apis/:id`
  - `POST /apis/:id/test` (external fetch mocked)
- **Frontend component tests** for:
  - API list filtering
  - test-console request builder behavior
  - visualization mode toggle
- **CI workflow** that runs lint, format check, typecheck, and tests.

## Commands

```bash
npm run lint
npm run format:check
npm run typecheck
npm test
npm run check
```
