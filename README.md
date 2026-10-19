# houssem-mehouachi.netlify.app

Personal portfolio of **Houssem Mehouachi**, System Administrator (Microsoft 365, Entra ID, Intune, Windows Server, Linux, networking, automation).

Styled as an ops console: a status bar with live "uptime" since my first day in IT, skills mounted in a server rack, experience as a `journalctl` log, projects as `systemctl` services, certifications as installed packages, and contact as a GLPI-style ticket (opens the visitor's mail client — no backend).

## Stack

- Next.js 15 (App Router) as a fully static export (`out/`)
- Plain CSS with light/dark tokens, JetBrains Mono + Space Grotesk
- Deployed on Netlify (`netlify.toml`)

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site in out/
```

All content lives in `src/data/cv.ts`; the downloadable CV is `public/CV_Houssem_Mehouachi.pdf`.
