"use client";

import { useEffect, useState } from "react";
import { profile } from "@/data/cv";

const nav = [
  ["rack", "#rack"],
  ["journal", "#journal"],
  ["services", "#services"],
  ["packages", "#packages"],
  ["ticket", "#ticket"],
] as const;

export function uptimeParts(since: Date, now: Date) {
  let years = now.getFullYear() - since.getFullYear();
  let months = now.getMonth() - since.getMonth();
  let days = now.getDate() - since.getDate();
  if (days < 0) {
    months -= 1;
    days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  const pad = (n: number) => String(n).padStart(2, "0");
  const clock = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  return { years, months, days, clock };
}

export default function StatusBar() {
  const [now, setNow] = useState<Date | null>(null);
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    const set = document.documentElement.dataset.theme as "light" | "dark" | undefined;
    setTheme(set ?? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
    return () => clearInterval(id);
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
    setTheme(next);
  }

  const up = now ? uptimeParts(new Date(profile.itSince), now) : null;

  return (
    <header className="statusbar">
      <a href="#top" className="sb-host">
        <span className="led led-ok pulse" aria-hidden />
        <span>
          {profile.handle}@{profile.host}
        </span>
      </a>
      <nav className="sb-nav" aria-label="Sections">
        {nav.map(([label, href], i) => (
          <a key={href} href={href}>
            <span className="dim">{String(i + 1).padStart(2, "0")}</span>
            {label}
          </a>
        ))}
      </nav>
      <div className="sb-right">
        <span className="sb-uptime" title="Time since my first day in IT (Dec 2020)">
          up {up ? `${up.years}y ${up.months}m ${up.days}d ${up.clock}` : "—"}
        </span>
        <button className="sb-theme" onClick={toggle} aria-label="Toggle colour theme">
          {theme === "dark" ? "☀ light" : "☾ dark"}
        </button>
      </div>
    </header>
  );
}
