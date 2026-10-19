"use client";

import { useState } from "react";
import { profile } from "@/data/cv";

const categories = ["Job opportunity", "Contract / freelance", "Question", "Other"];
const priorities = ["P3 · normal", "P2 · soon", "P1 · urgent"];

// No backend: the form composes a mailto: link and hands it to the visitor's mail client.
export default function TicketForm() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [priority, setPriority] = useState(priorities[0]);
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const ticketId = "INC-" + String(new Date().getFullYear()).slice(2) + "-" + String(message.length + name.length).padStart(4, "0");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const subject = `[${priority.split(" ")[0]}] ${category}${name ? ` — ${name}` : ""}`;
    const body = `${message}\n\n—\n${name}`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  }

  return (
    <form className="ticket panel" onSubmit={submit}>
      <div className="ticket-head">
        <span className="mono dim">new ticket</span>
        <span className="mono">{ticketId}</span>
      </div>
      <div className="ticket-grid">
        <label>
          <span>requester</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name / company" />
        </label>
        <label>
          <span>category</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
      </div>
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
        <span>description</span>
        <textarea
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Role, location, what you need help with…"
        />
      </label>
      <div className="ticket-actions">
        <button type="submit" className="btn btn-primary">
          submit → mail client
        </button>
        <button type="button" className="btn" onClick={copy}>
          {copied ? "✓ copied" : "copy email"}
        </button>
      </div>
      <p className="fine">Nothing is sent from this page — it opens your own email app with the ticket pre-filled.</p>
    </form>
  );
}
