# cv-web — personal portfolio

## Purpose

- Public portfolio site for Houssem Mehouachi (System Administrator / IT Support), deployed to houssem-mehouachi.netlify.app from `master` (GitHub: Houssem64/cv-web)

## Ownership

- `src/data/cv.ts` — all site content (profile, rack skills, experience, services/projects, certs, education, languages)
- `src/app/` — layout, single page, global CSS tokens, favicon (`icon.svg`)
- `src/components/` — client widgets: `StatusBar` (uptime + theme toggle), `Terminal` (typed hero console), `TicketForm` (mailto contact)
- `public/CV_Houssem_Mehouachi.pdf` — copy of `job-application/profile/CV_Houssem_Mehouachi_System_Administrator.pdf`

## Local Contracts

- Static export only (`output: "export"`, Netlify publishes `out/`); no API routes, database, or server secrets
- Content must match the CV in `job-application/profile/`; when the CV changes, update `src/data/cv.ts` and re-copy the PDF
- Private GitHub repos are described but never linked; only public repos get a `url`
- Theme: colors are CSS tokens on `:root` with dark overrides under `prefers-color-scheme` and `[data-theme="dark"]`

## Work Guidance

- Visual concept is an ops console (rack / journal / systemctl / apt / ticket); keep new sections in that metaphor

## Verification

- `npm run build` must succeed; preview `out/` (`.claude/launch.json` → `site` on port 4173) at desktop and 375px widths in both themes

## Child DOX Index

- None
