"use client";

import { useState } from "react";
import { profile } from "@/data/cv";

const categories = ["Job opportunity", "Contract / freelance", "Question", "Other"];
const priorities = ["P3 · normal", "P2 · soon", "P1 · urgent"];

type Status = { kind: "idle" | "sending" | "sent" | "error"; msg?: string; id?: string };

// Posts to the Netlify function at /api/contact (Resend). Falls back to mailto: if that fails.
export default function TicketForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [priority, setPriority] = useState(priorities[0]);
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [copied, setCopied] = useState(false);

  const ticketId = "INC-" + String(new Date().getFullYear()).slice(2) + "-" + String(message.length + name.length).padStart(4, "0");

  const mailto = () => {
    const subject = `[${priority.split(" ")[0]}] ${category}${name ? ` — ${name}` : ""}`;
    return `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`${message}\n\n—\n${name}`)}`;
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, category, priority, message, website }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not send right now");
      setStatus({ kind: "sent", id: data.id });
      setMessage("");
    } catch (err) {
      setStatus({ kind: "error", msg: err instanceof Error ? err.message : "Could not send right now" });
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  }

  if (status.kind === "sent") {
    return (
      <div className="ticket panel" role="status">
        <div className="ticket-head">
          <span className="mono dim">ticket submitted</span>
          <span className="mono ok">● resolved: delivered</span>
        </div>
        <p className="ticket-done">
          Thanks{name ? `, ${name}` : ""} — your ticket landed in my inbox. I&apos;ll reply to <strong>{email}</strong> within a day.
        </p>
        <div className="ticket-actions">
          <button type="button" className="btn" onClick={() => setStatus({ kind: "idle" })}>
            open another ticket
          </button>
        </div>
      </div>
    );
  }

  const sending = status.kind === "sending";

  return (
    <form className="ticket panel" onSubmit={submit}>
      <div className="ticket-head">
        <span className="mono dim">new ticket</span>
        <span className="mono">{ticketId}</span>
      </div>
      <div className="ticket-grid">
        <label>
          <span>requester</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name / company" maxLength={120} />
        </label>
        <label>
          <span>reply-to email *</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            maxLength={200}
          />
        </label>
      </div>
      <label>
        <span>category</span>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </label>
      <fieldset className="prio">
        <legend>priority</legend>
        {priorities.map((p) => (
          <label key={p} className={priority === p ? "on" : ""}>
            <input type="radio" name="prio" value={p} checked={priority === p} onChange={() => setPriority(p)} />
            {p}
          </label>
        ))}
      </fieldset>
      <label>
        <span>description *</span>
        <textarea
          required
          minLength={10}
          maxLength={5000}
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Role, location, what you need help with…"
        />
      </label>
      <label className="hp" aria-hidden>
        Website
        <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </label>
      <div className="ticket-actions">
        <button type="submit" className="btn btn-primary" disabled={sending}>
          {sending ? "sending…" : "submit ticket →"}
        </button>
        <button type="button" className="btn" onClick={copy}>
          {copied ? "✓ copied" : "copy email"}
        </button>
      </div>
      {status.kind === "error" ? (
        <p className="fine err" role="alert">
          ✕ {status.msg}. <a href={mailto()}>Send it from your email app instead →</a>
        </p>
      ) : (
        <p className="fine">Goes straight to my inbox. Your email is only used to reply.</p>
      )}
    </form>
  );
}
