# Milestone 1 — File Checklist

Every file expected in this deliverable, and what it's for.

## Root config

- [x] `package.json` — dependencies pinned to Next.js 15.5.x, React 19,
      TypeScript 5.9, Tailwind 3.4, ESLint 9; `dev`/`build`/`start`/`lint`/`typecheck` scripts; `engines.node` locked to 20.x.
- [x] `tsconfig.json` — `strict: true`, path alias `@/*` → `src/*`, Next.js plugin.
- [x] `next.config.ts` — TypeScript-native Next config.
- [x] `tailwind.config.ts` — Tailwind 3.4 config, content globs for `src/app` and `src/components`.
- [x] `postcss.config.mjs` — Tailwind + Autoprefixer pipeline (v3-style, not the v4 `@tailwindcss/postcss` plugin).
- [x] `eslint.config.mjs` — flat config extending `next/core-web-vitals` and `next/typescript`.
- [x] `.gitignore` — excludes `node_modules`, `.next`, `.env*.local`, `.vercel`, `next-env.d.ts`, etc.
- [x] `.npmrc` — `engine-strict=true` (enforces Node 20), disables funding/audit noise.
- [x] `.env.example` — app-level placeholders only; Supabase vars reserved (commented) for a later milestone.
- [x] `vercel.json` — declares `framework: nextjs` and explicit install/build/dev commands.
- [x] `README.md` — stack, scripts, CI/CD, milestone roadmap, non-negotiable rules.
- [x] `CHECKLIST.md` — this file.

## CI/CD

- [x] `.github/workflows/build.yml` — runs on push/PR to `main` and manual dispatch; installs on Node 20.x, then `lint`, `typecheck`, `build`. Must be green before Milestone 2.

## Application (App Router)

- [x] `src/app/layout.tsx` — root layout, page metadata.
- [x] `src/app/page.tsx` — placeholder home page confirming the scaffold (Tailwind classes render correctly).
- [x] `src/app/globals.css` — Tailwind directives (`@tailwind base/components/utilities`) + CSS variables for light/dark background/foreground.

## Public assets

- [x] `public/robots.txt` — minimal, allows all crawling.

## Not included in Milestone 1 (by design)

- No Supabase client, schema, or environment variables beyond placeholders.
- No authentication/login.
- No dashboard or business logic/routes beyond the placeholder home page.
- No component library beyond what Tailwind provides out of the box.

These are explicitly deferred to Milestones 2+ per the release plan in `README.md`.

## Verification notes

`npm install` / `npm run build` were **not** executed inside this
authoring session — outbound access to the npm registry is blocked by
this sandbox's network policy, so a local install/build isn't possible
here. Every file above follows the standard, current Next.js 15
App Router + TypeScript + Tailwind 3 + ESLint 9 conventions exactly (no
experimental APIs), and static checks that don't require `node_modules`
were run and passed: JSON validity of all config files, YAML validity
of the workflow file, and a search confirming no `any`, `@ts-ignore`, or
`@ts-nocheck` anywhere in the codebase.

Per the agreed workflow, treat the real `npm install` / `npm run build`
run inside GitHub Actions (`build.yml`) as the source of truth for
Milestone 1's acceptance criteria, along with the Vercel deployment
once the repo is imported there.
