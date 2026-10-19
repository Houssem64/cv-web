"use client";

import { useEffect, useState } from "react";

type Line = { cmd: string; out: { text: string; tone?: "ok" | "warn" | "info" | "dim" }[] };

const script: Line[] = [
  { cmd: "whoami", out: [{ text: "houssem — system administrator" }] },
  {
    cmd: "systemctl status it@best-beton",
    out: [
      { text: "● it@best-beton — multi-site manufacturer", tone: "ok" },
      { text: "  Active: active (running) since 2025-09", tone: "ok" },
      { text: "  Units:  m365 entra intune ad nav-sql glpi", tone: "dim" },
    ],
  },
  {
    cmd: "cloudflared tunnel list",
    out: [
      { text: "nav-odata   HEALTHY   via Zero Trust", tone: "info" },
      { text: "inbound firewall ports opened: 0", tone: "ok" },
    ],
  },
  {
    cmd: "./restore-test.sh --target nav-vm",
    out: [
      { text: "snapshot ✓  db backup ✓  offsite ✓", tone: "ok" },
      { text: "restore verified — backups are only real if they restore", tone: "dim" },
    ],
  },
  { cmd: "echo $NEXT", out: [{ text: "open to roles in Europe & Asia — relocation ready", tone: "warn" }] },
];

export default function Terminal() {
  const [step, setStep] = useState(0); // index of line being typed
  const [chars, setChars] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStep(script.length);
      setDone(true);
      return;
    }
    if (step >= script.length) {
      setDone(true);
      return;
    }
    const cmd = script[step].cmd;
    const t =
      chars < cmd.length
        ? setTimeout(() => setChars((c) => c + 1), 38 + Math.random() * 40)
        : setTimeout(() => {
            setStep((s) => s + 1);
            setChars(0);
          }, 520);
    return () => clearTimeout(t);
  }, [step, chars]);

  return (
    <div className="term" role="img" aria-label="Terminal summary: system administrator at Best Beton, zero inbound ports, restore-tested backups, open to relocation">
      <div className="term-bar">
        <span className="dot r" />
        <span className="dot y" />
        <span className="dot g" />
        <span className="term-title">ssh houssem@infra-01</span>
      </div>
      <div className="term-body" aria-hidden>
        {script.slice(0, Math.min(step + 1, script.length)).map((l, i) => {
          const typing = i === step && !done;
          return (
            <div key={i} className="term-block">
              <div>
                <span className="prompt">❯</span> {typing ? l.cmd.slice(0, chars) : l.cmd}
                {typing && <span className="caret" />}
              </div>
              {!typing &&
                l.out.map((o, j) => (
                  <div key={j} className={`out ${o.tone ?? ""}`}>
                    {o.text}
                  </div>
                ))}
            </div>
          );
        })}
        {done && (
          <div>
            <span className="prompt">❯</span> <span className="caret" />
          </div>
        )}
      </div>
    </div>
  );
}
