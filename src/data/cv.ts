// Single source of truth for the site content. Mirrors the System Administrator CV.

export const profile = {
  name: "Houssem Mehouachi",
  handle: "houssem",
  host: "infra-01",
  role: "System Administrator",
  tagline: "IT Support Engineer · Microsoft 365, Entra ID & Intune",
  location: "Zaghouan, Tunisia",
  relocation: "Open to relocation (work-permit sponsorship required)",
  email: "houssem.sysadmin@gmail.com",
  linkedin: "https://www.linkedin.com/in/houssem-mehouachi",
  github: "https://github.com/Houssem64",
  cv: "/CV_Houssem_Mehouachi.pdf",
  // First day in IT (Autoliv internship) — drives the live uptime counter.
  itSince: "2020-12-01T08:00:00+01:00",
  summary:
    "I run the IT environment of a multi-site precast-concrete manufacturer: Microsoft 365, Entra ID and Intune, Active Directory, Windows Server and Linux, the network edge, and a business-critical ERP on SQL Server. Promoted from IT Technician to System Administrator. I like boring infrastructure: remote access with zero inbound ports, backups that are actually restore-tested, and routine work that PowerShell and Python do for me.",
};

export type RackUnit = {
  id: string;
  label: string;
  model: string;
  items: string[];
  led: "ok" | "warn" | "info";
};

export const rack: RackUnit[] = [
  {
    id: "id",
    label: "Identity & Microsoft 365",
    model: "IDM-365",
    led: "ok",
    items: [
      "Active Directory",
      "Microsoft Entra ID",
      "Intune (MDM)",
      "Conditional Access",
      "MFA",
      "Exchange Online",
      "Teams",
      "SharePoint",
      "OneDrive",
      "Licensing & security groups",
      "Onboarding / offboarding",
    ],
  },
  {
    id: "sys",
    label: "Systems & Virtualization",
    model: "SRV-VM",
    led: "ok",
    items: [
      "Windows Server",
      "Windows 10/11",
      "Linux",
      "Virtual machines & snapshots",
      "SQL Server",
      "Dynamics NAV 2018 (ERP)",
    ],
  },
  {
    id: "net",
    label: "Networking & Security",
    model: "NET-SEC",
    led: "info",
    items: [
      "TCP/IP",
      "VLANs",
      "Routing & switching",
      "VPN",
      "Firewall management",
      "Cloudflare Zero Trust",
      "Secure tunnels",
      "Structured cabling (RJ45)",
    ],
  },
  {
    id: "ops",
    label: "IT Operations",
    model: "OPS-ITIL",
    led: "ok",
    items: [
      "Incident & request mgmt (GLPI)",
      "ITIL-aligned workflows",
      "IT asset management",
      "Backup & disaster recovery",
      "Restore testing",
      "Monitoring & log analysis",
    ],
  },
  {
    id: "auto",
    label: "Automation & Scripting",
    model: "AUTO-PY",
    led: "warn",
    items: ["PowerShell", "Python", "Automated reporting & alerting", "Scheduled jobs", "Local LLMs (Ollama)"],
  },
  {
    id: "dev",
    label: "Development",
    model: "DEV-WEB",
    led: "info",
    items: ["Next.js", "React", "TypeScript", "PostgreSQL / SQLite", "REST APIs", "OData", "FastAPI", "HTML/CSS"],
  },
  {
    id: "hw",
    label: "Hardware",
    model: "HW-BENCH",
    led: "ok",
    items: ["Desktop & laptop repair", "PC assembly", "Component replacement", "Data recovery", "CCTV installation"],
  },
];

export type LogEntry = {
  start: string;
  end: string;
  unit: string;
  org: string;
  place: string;
  current?: boolean;
  promotion?: string;
  lines: string[];
};

export const experience: LogEntry[] = [
  {
    start: "2026-09",
    end: "present",
    unit: "System Administrator",
    org: "Best Beton",
    place: "Jbel Ouest, Tunisia",
    current: true,
    promotion: "role changed: it-technician → system-administrator",
    lines: [
      "Administer servers, network services and business applications for a multi-site precast-concrete manufacturer, including the Dynamics NAV 2018 VM and its SQL Server database.",
      "Publish internal apps and NAV OData web services through Cloudflare Zero Trust tunnels, with no inbound firewall ports opened.",
      "Run backup & DR: scheduled VM snapshots, database backups, offsite replication and regular restore tests.",
      "Administer Microsoft 365 (Exchange Online, Teams, SharePoint, OneDrive): onboarding/offboarding, licensing, security groups.",
      "Manage Intune enrolment, compliance policies and MDM; enforce Conditional Access and MFA in Entra ID.",
      "Run GLPI for incidents, requests, asset tracking and workflow automation.",
      "Automate reporting, notifications, monitoring and log analysis with Python and Ollama; build internal dashboards and production apps.",
    ],
  },
  {
    start: "2025-09",
    end: "2026-09",
    unit: "IT Technician",
    org: "Best Beton",
    place: "Jbel Ouest, Tunisia",
    lines: [
      "Diagnosed and resolved hardware, software and network issues for users across several sites, on-site and remote.",
      "Installed, updated and configured Windows and Linux systems.",
      "Deployed and supported ERP clients (Dynamics NAV / Navision) and engineering software (Revit, Tekla, SolidWorks).",
      "Built a full-stack internal HR web application (Next.js, React, PostgreSQL) for employee management.",
    ],
  },
  {
    start: "2024-07",
    end: "2024-07",
    unit: "IT Support Technician",
    org: "Teriak",
    place: "Jbel Ouest, Tunisia",
    lines: [
      "Resolved hardware, software and network issues; installed and updated Windows and Linux.",
      "Administered user accounts in Active Directory.",
    ],
  },
  {
    start: "2021-10",
    end: "2022-03",
    unit: "Computer Support Technician",
    org: "TIBH",
    place: "Hammamet, Tunisia",
    lines: [
      "Repaired and configured customer devices: component replacement, data recovery, backups, OS, driver and antivirus installs.",
      "Installed and cabled network infrastructure, including RJ45 patch panels and outlets.",
    ],
  },
  {
    start: "2020-12",
    end: "2021-01",
    unit: "IT Support Intern",
    org: "Autoliv",
    place: "El Fahs, Tunisia",
    lines: ["Monitored and maintained computer systems and industrial networks; resolved hardware and software failures."],
  },
];

export type Service = {
  name: string;
  slug: string;
  state: "running" | "internal" | "lab";
  summary: string;
  detail: string;
  stack: string[];
  url?: string;
};

// Pulled from github.com/Houssem64. Most are private (internal company tools), so only public repos get a link.
export const services: Service[] = [
  {
    name: "Remote Exec",
    slug: "remote-exec.service",
    state: "running",
    summary: "Run scripts on servers behind a FortiGate without opening a single inbound port.",
    detail:
      "A Python agent on the internal host polls a cloud command server over outbound HTTPS, pulls pending jobs, executes them and posts the output back. Packaged as a standalone Windows executable.",
    stack: ["Python", "Webhooks", "HTTPS polling", "PyInstaller"],
  },
  {
    name: "ZK Transactions API",
    slug: "zk-api.service",
    state: "running",
    summary: "Turns a ZKTeco biometric attendance terminal into a JSON API.",
    detail:
      "Node.js service that talks to the device over the LAN, pulls every punch and serves /health and /transactions endpoints so HR tools can consume attendance data.",
    stack: ["Node.js", "ZKTeco protocol", "REST", "Windows service"],
  },
  {
    name: "HR Management System",
    slug: "hr-portal.service",
    state: "internal",
    summary: "Attendance, absences, disciplinary actions and payroll prep for a multi-site workforce.",
    detail:
      "Next.js + SQLite app installed as a PWA, served behind a Caddy reverse proxy with TLS on the LAN, posting data back to Dynamics NAV.",
    stack: ["Next.js", "TypeScript", "SQLite", "Caddy", "Dynamics NAV"],
  },
  {
    name: "Etat Absences Mailer",
    slug: "absence-mailer.timer",
    state: "running",
    summary: "Daily absence report built and emailed to management automatically.",
    detail:
      "One Python file: a desktop UI when launched by hand, a headless run under Task Scheduler. Builds the Excel report from the HR API and mails it. Ships as a single .exe.",
    stack: ["Python", "Excel", "SMTP", "Task Scheduler"],
  },
  {
    name: "Lettrage",
    slug: "lettrage.service",
    state: "internal",
    summary: "Matches invoices against payments and credit notes from NAV exports.",
    detail: "FastAPI backend with a custom matching engine and Excel export, replacing hours of manual accounting reconciliation.",
    stack: ["Python", "FastAPI", "Dynamics NAV", "Excel"],
  },
  {
    name: "Smart Meter Packaging",
    slug: "packaging.service",
    state: "internal",
    summary: "Unit labels, carton grouping and Excel import/export for a meter production line.",
    detail: "Next.js App Router with Drizzle ORM on libSQL (local SQLite in dev, Turso in prod) and a single bcrypt + JWT admin account.",
    stack: ["Next.js 16", "Drizzle", "Turso", "JWT"],
  },
  {
    name: "Ops Analytics",
    slug: "analytics.service",
    state: "internal",
    summary: "Production tonnage, salary and employee analytics with anomaly detection.",
    detail:
      "Python pipelines that normalise years of legacy .xls exports into Excel and HTML reports, plus a Next.js + Prisma dashboard for management.",
    stack: ["Python", "pandas", "Next.js", "Prisma"],
  },
  {
    name: "JobHunter",
    slug: "jobhunter.service",
    state: "lab",
    summary: "Local job-search pipeline: scrape boards, score with an LLM, send via Microsoft 365.",
    detail: "CLI + web UI that scrapes European job boards, writes language-aware letters with Ollama, tracks state in Turso and sends through Outlook.",
    stack: ["Python", "Ollama", "Turso", "Microsoft 365"],
  },
  {
    name: "Roomly",
    slug: "roomly.service",
    state: "lab",
    summary: "Property rental and management platform.",
    detail: "Full-stack Next.js 14 app with listings, bookings and an admin panel.",
    stack: ["Next.js", "Tailwind", "MongoDB"],
    url: "https://github.com/Houssem64/roomly",
  },
  {
    name: "DAEMON://SHELL",
    slug: "daemon-shell.game",
    state: "lab",
    summary: "Off-hours: a hacker-themed puzzle game with a fake CRT terminal.",
    detail: "C++17 and SFML. Patch corrupted code snippets with PATCH / RUN / SCAN commands to break through each node.",
    stack: ["C++17", "SFML", "CMake"],
  },
];

export const packages = [
  { name: "google-it-support", version: "2023", source: "Coursera", desc: "Google IT Support Professional Certificate" },
  { name: "m365-administration", version: "2024", source: "LinkedIn Learning", desc: "Microsoft 365: Administration" },
  { name: "cisco-network-technician", version: "2024", source: "Cisco NetAcad", desc: "Network Technician Career Path" },
  { name: "cisco-intro-cybersecurity", version: "2024", source: "Cisco NetAcad", desc: "Introduction to Cybersecurity" },
  { name: "ef-set-english", version: "C2 · 76/100", source: "EF SET", desc: "English certificate, C2 Proficient" },
  { name: "fullstack-dev-track", version: "—", source: "Track", desc: "Full-Stack Development" },
];

export const education = [
  {
    title: "BTS — Web Development",
    school: "IMSET, Nabeul",
    period: "2022 — 2024",
  },
  {
    title: "BTP — Computer Micro-Systems Maintenance",
    school: "Centre Sectoriel de Formation en Maintenance, Nabeul",
    period: "2020 — 2022",
  },
];

export const languages = [
  { name: "English", level: "C2", pct: 98 },
  { name: "Arabic", level: "Native", pct: 100 },
  { name: "French", level: "Intermediate", pct: 55 },
];
