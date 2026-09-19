# TP Growth Pool v2.0

Member platform for **Trading Point** — clean rebuild, replacing v1.0.
This repository is built in green, reviewable release milestones. Each
milestone must pass `npm install`, `npm run build`, and GitHub Actions
before the next one begins.

## Status: Milestone 1 — Foundation

This milestone delivers only the project scaffold. No authentication,
Supabase, or business features are included yet.

### What's included

- Next.js 15.5.x (App Router)
- React 19
- TypeScript 5.9 (`strict` mode, no `any`, no `@ts-ignore`)
- Tailwind CSS 3.4
- ESLint 9 (flat config, `next/core-web-vitals` + `next/typescript`)
- GitHub Actions CI (`.github/workflows/build.yml`)
- Vercel-ready configuration (`vercel.json`)

## Tech stack

| Layer      | Choice              |
| ---------- | ------------------- |
| Framework  | Next.js 15.5.x       |
| UI library | React 19             |
| Language   | TypeScript 5.9       |
| Styling    | Tailwind CSS 3.4     |
| Runtime    | Node 20 LTS          |
| Backend    | Supabase (from Milestone 3) |
| CI         | GitHub Actions       |
| Hosting    | Vercel               |

## Getting started

Requires **Node 20.x**.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command             | Description                          |
| ------------------- | ------------------------------------- |
| `npm run dev`       | Start the local dev server            |
| `npm run build`     | Production build                      |
| `npm run start`     | Serve the production build            |
| `npm run lint`      | ESLint                                |
| `npm run typecheck` | `tsc --noEmit`, no emitted output     |

### Environment variables

Copy `.env.example` to `.env.local` before running locally. No secrets
are required for Milestone 1; Supabase variables are reserved for a
later milestone.

## Continuous integration

Every push and pull request to `main` runs `.github/workflows/build.yml`,
which installs dependencies, lints, type-checks, and builds the project
on Node 20. A milestone is not considered complete until this workflow
is green.

## Deployment

The project is zero-config on [Vercel](https://vercel.com): import the
repository and Vercel will detect Next.js automatically using the
settings in `vercel.json`.

## Release milestones

1. **Foundation** (this milestone) — scaffold, CI, deploy config.
2. Core UI shell / routing structure.
3. Supabase integration (auth, database).
4. Member dashboard and business features.

Milestone 2 does not begin until Milestone 1 is verified green in both
GitHub Actions and Vercel.

## Non-negotiable engineering rules

- Every milestone must build successfully before the next starts.
- No `any`, no `@ts-ignore`, no disabling TypeScript checks.
- No milestone is merged with a failing build.
