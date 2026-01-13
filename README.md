# Blipzo Web

React + Vite + Tailwind + TypeScript frontend for the Blipzo expense tracker. It uses React Query for data fetching, Zustand for auth state, and cookie-based authentication against the Blipzo API.

## Features
- Landing page with login/register modals.
- Auth guarded dashboard routed with React Router.
- Transactions list, summary cards, analytics views, and modals for settings/reports/adding transactions.
- API client with automatic session refresh using HttpOnly cookies.

## Release Notes
Detailed release notes for each version can be found in the [docs/releases](docs/releases/) directory.
- Latest Release: [v1.0.0](docs/releases/v1.0.0.md)

## Project structure (high level)
```
.
├─ src/
│  ├─ api/           # axios client, auth/transactions/category calls
│  ├─ components/    # shared UI (Navbar, cards, lists, protected route, etc.)
│  ├─ context/       # Zustand auth store
│  ├─ hooks/         # useAuth and helpers
│  ├─ modals/        # feature modals (AddTransaction, Settings, Reports)
│  ├─ pages/         # LandingPage, DashboardPage
│  ├─ types/         # shared TypeScript types
│  └─ utils/         # utilities
├─ public/           # static assets
├─ dist/             # build output (generated)
├─ nginx.conf        # SPA routing config for Nginx (try_files ...)
└─ .github/workflows/deploy-frontend.yml  # CI/CD build + deploy
```

## Getting started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment:
   - Create a `.env` file and set `VITE_API_BASE_URL` to your backend URL (e.g., `http://localhost:3000`).
   - Backend must enable CORS with credentials and issue HttpOnly `accessToken`/`refreshToken` cookies on auth routes.
3. Run the app:
   ```bash
   npm run dev
   ```
   Vite serves at http://localhost:5173 by default.

## Scripts
- `npm run dev` — start the Vite dev server.
- `npm run build` — type-check and create a production build.
- `npm run preview` — preview the production build locally.
- `npm run lint` — lint with ESLint + TypeScript rules.

## Auth expectations (frontend ↔ backend)
- Frontend sends `withCredentials` on all requests and relies on cookies; it does not store tokens.
- `GET /api/auth/session` should return `{ user }` when the access token cookie is valid.
- `POST /api/auth/refresh` should rotate cookies and respond with 401/419 on failure.
- `POST /api/auth/logout` should clear cookies.


## License
MIT
