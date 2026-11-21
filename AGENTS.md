# Repository Guidelines

## Project Structure & Module Organization

QuickOffice is split into two independently runnable applications:

- `backend/` contains the Django project (`quickoffice/`) and the `documents` app. API views, serializers, models, authentication, migrations, and PDF generation utilities live in `backend/documents/`; the PDF template is under `backend/documents/templates/`.
- `frontend/` is a Next.js App Router application. Pages are in `frontend/app/`, shared API and number-formatting helpers are in `frontend/lib/`, and static assets are in `frontend/public/`.
- Keep generated files, local databases, virtual environments, and environment files out of Git; the root `.gitignore` already covers these.

## Build, Test, and Development Commands

Backend, from `backend/`:

```bash
python -m venv .venv
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
python manage.py test
```

Frontend, from `frontend/` (the repository includes a `pnpm-lock.yaml`):

```bash
pnpm install
pnpm dev       # local development at http://localhost:3000
pnpm build     # production build
pnpm start     # serve the production build
```

## Coding Style & Naming Conventions

Use four spaces and PEP 8-style naming in Python (`snake_case` for functions and variables, `PascalCase` for classes). Use TypeScript/React conventions in the frontend: two-space indentation, `PascalCase` components, `camelCase` helpers, and descriptive route folder names. Preserve existing TypeScript strictness and keep API calls centralized in `frontend/lib/api.ts`. No formatter or linter is currently configured; keep changes consistent with neighboring files.

## Testing Guidelines

Backend tests use Django's `TestCase` and should live in `backend/documents/tests.py` or clearly named `test_*.py` modules. Run `python manage.py test` from `backend/`. Add coverage for document creation, authentication, serialization, and PDF-related behavior when changing those areas. The frontend currently has no test framework or test script; verify UI changes with `pnpm build` and manual browser checks.

## Commit & Pull Request Guidelines

Use concise, imperative Conventional Commit-style subjects, for example `feat: add invoice validation` or `fix: preserve API trailing slashes`. Pull requests should explain the user-visible change, identify backend/frontend impact, list verification commands, link related issues, and include screenshots for UI or PDF changes.

## Security & Configuration

Backend settings require `SECRET_KEY` and support `DEBUG` through environment variables. Use a local `backend/.env` for development, never commit secrets, and review `ALLOWED_HOSTS`, CORS, and database settings before deployment. Keep production `DEBUG` disabled.
