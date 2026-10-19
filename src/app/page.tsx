import StatusBar from "@/components/StatusBar";
import Terminal from "@/components/Terminal";
import TicketForm from "@/components/TicketForm";
import { education, experience, languages, packages, profile, rack, services } from "@/data/cv";

const yearsInIT = Math.floor((Date.now() - new Date(profile.itSince).getTime()) / (365.25 * 24 * 3600 * 1000));
const buildDate = new Date().toISOString().slice(0, 10);

const stateLabel = { running: "active (running)", internal: "active · internal", lab: "loaded · lab" } as const;

function SectionHead({ n, cmd, title, note }: { n: string; cmd: string; title: string; note?: string }) {
  return (
    <div className="sec-head">
      <div className="sec-cmd mono">
        <span className="dim">{n}</span> <span className="prompt">$</span> {cmd}
      </div>
      <h2>{title}</h2>
      {note && <p className="sec-note">{note}</p>}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <StatusBar />
      <main id="top">
        {/* ── HERO ─────────────────────────────────────── */}
        <section className="hero wrap">
          <div className="hero-copy">
            <div className="mono motd">
              <span className="led led-ok" aria-hidden /> /etc/motd — all systems operational
            </div>
            <h1>
              Houssem
              <br />
              Mehouachi<span className="cursor-block" aria-hidden />
            </h1>
            <p className="role">
              <strong>{profile.role}</strong>
              <span className="dim"> // </span>
              {profile.tagline}
            </p>
            <p className="summary">{profile.summary}</p>
            <div className="cta">
              <a className="btn btn-primary" href={profile.cv} download>
                ↓ download-cv.pdf
              </a>
              <a className="btn" href="#ticket">
                open a ticket →
              </a>
              <a className="btn btn-ghost" href={profile.linkedin} target="_blank" rel="noreferrer">
                linkedin
              </a>
              <a className="btn btn-ghost" href={profile.github} target="_blank" rel="noreferrer">
                github
              </a>
            </div>
            <ul className="chips mono">
              <li>📍 {profile.location}</li>
              <li>✈ {profile.relocation}</li>
            </ul>
          </div>
          <Terminal />
        </section>

        {/* ── HEALTH STRIP ─────────────────────────────── */}
        <section className="wrap health" aria-label="At a glance">
          <div className="metric">
            <span className="m-val">{yearsInIT}+</span>
            <span className="m-key">years hands-on IT</span>
            <span className="m-bar"><i style={{ width: "78%" }} /></span>
          </div>
          <div className="metric">
            <span className="m-val">0</span>
            <span className="m-key">inbound ports opened · Zero Trust</span>
            <span className="m-bar"><i style={{ width: "100%" }} /></span>
          </div>
          <div className="metric">
            <span className="m-val">IT Tech → SysAdmin</span>
            <span className="m-key">promoted at Best Beton</span>
            <span className="m-bar"><i style={{ width: "64%" }} /></span>
          </div>
          <div className="metric">
            <span className="m-val">C2</span>
            <span className="m-key">English · EF SET 76/100</span>
            <span className="m-bar"><i style={{ width: "92%" }} /></span>
          </div>
        </section>

        {/* ── RACK / SKILLS ────────────────────────────── */}
        <section id="rack" className="wrap sec">
          <SectionHead
            n="01"
            cmd="lsblk --skills --tree"
            title="The rack"
            note="Everything I run, mounted by domain. Each unit is a part of the stack I administer day to day."
          />
          <div className="rack">
            <div className="rack-top mono">
              <span>RACK-A · {profile.host}</span>
              <span className="dim">{rack.length}U populated</span>
            </div>
            {rack.map((u, i) => (
              <div className="unit" key={u.id}>
                <span className="u-num mono">U{String(i + 1).padStart(2, "0")}</span>
                <span className="u-leds" aria-hidden>
                  <span className={`led led-${u.led} pulse`} style={{ animationDelay: `${i * 0.37}s` }} />
                  <span className="led led-ok" />
                </span>
                <span className="u-model mono">{u.model}</span>
                <span className="u-label">{u.label}</span>
                <ul className="u-ports">
                  {u.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="unit unit-blank" aria-hidden>
              <span className="u-num mono">U{String(rack.length + 1).padStart(2, "0")}</span>
              <span className="mono dim">— reserved for whatever you run next —</span>
            </div>
          </div>
        </section>

        {/* ── JOURNAL / EXPERIENCE ─────────────────────── */}
        <section id="journal" className="wrap sec">
          <SectionHead n="02" cmd="journalctl -u career --since 2020-12 --reverse" title="Career journal" />
          <ol className="journal">
            {experience.map((e) => (
              <li key={e.unit + e.start} className={e.current ? "j-entry current" : "j-entry"}>
                <div className="j-time mono">
                  <span>{e.start}</span>
                  <span className="dim">→ {e.end}</span>
                </div>
                <div className="j-body">
                  <div className="j-head">
                    <span className="mono dim">{profile.host} systemd[1]:</span>{" "}
                    <span className="j-started">Started</span> <strong>{e.unit}</strong>
                    <span className="dim"> @ </span>
                    {e.org}
                    <span className="j-place mono dim"> · {e.place}</span>
                    {e.current && <span className="pill pill-ok mono">running</span>}
                  </div>
                  {e.promotion && <div className="j-promo mono">⚑ {e.promotion}</div>}
                  <ul className="j-lines">
                    {e.lines.map((l) => (
                      <li key={l}>{l}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ── SERVICES / PROJECTS ──────────────────────── */}
        <section id="services" className="wrap sec">
          <SectionHead
            n="03"
            cmd="systemctl list-units --type=service --all"
            title="Services I built"
            note="Tools from my GitHub. Most are internal to the company and live in private repositories, so they are described here rather than linked."
          />
          <div className="svc-grid">
            {services.map((s) => (
              <article key={s.slug} className={`svc panel state-${s.state}`}>
                <div className="svc-top mono">
                  <span>
                    <span className={`led led-${s.state === "lab" ? "info" : "ok"}`} aria-hidden /> {s.slug}
                  </span>
                  <span className="dim">{stateLabel[s.state]}</span>
                </div>
                <h3>{s.name}</h3>
                <p className="svc-sum">{s.summary}</p>
                <p className="svc-detail">{s.detail}</p>
                <ul className="tags mono">
                  {s.stack.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <div className="svc-foot mono">
                  {s.url ? (
                    <a href={s.url} target="_blank" rel="noreferrer">
                      view source ↗
                    </a>
                  ) : (
                    <span className="dim">🔒 private repo</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── PACKAGES / CERTS + EDU ───────────────────── */}
        <section id="packages" className="wrap sec">
          <SectionHead n="04" cmd="apt list --installed | grep -E 'cert|edu|locale'" title="Installed packages" />
          <div className="pkg panel">
            <div className="pkg-row pkg-th mono">
              <span>package</span>
              <span>version</span>
              <span>source</span>
              <span>description</span>
            </div>
            {packages.map((p) => (
              <div className="pkg-row mono" key={p.name}>
                <span className="pkg-name">
                  <span className="ok">ii</span> {p.name}
                </span>
                <span>{p.version}</span>
                <span className="dim">{p.source}</span>
                <span className="pkg-desc">{p.desc}</span>
              </div>
            ))}
          </div>

          <div className="pkg-split">
            <div className="panel edu">
              <div className="mono dim small">/usr/share/education</div>
              {education.map((e) => (
                <div key={e.title} className="edu-item">
                  <div className="mono small dim">{e.period}</div>
                  <div className="edu-title">{e.title}</div>
                  <div className="dim">{e.school}</div>
                </div>
              ))}
            </div>
            <div className="panel langs">
              <div className="mono dim small">locale -a</div>
              {languages.map((l) => (
                <div key={l.name} className="lang">
                  <div className="lang-top">
                    <span>{l.name}</span>
                    <span className="mono dim">{l.level}</span>
                  </div>
                  <span className="m-bar">
                    <i style={{ width: `${l.pct}%` }} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONTACT / TICKET ─────────────────────────── */}
        <section id="ticket" className="wrap sec">
          <SectionHead
            n="05"
            cmd="glpi ticket --new --assignee houssem"
            title="Open a ticket"
            note="Hiring for a sysadmin, IT support or M365 role? SLA: I reply within a day."
          />
          <div className="ticket-wrap">
            <TicketForm />
            <aside className="panel direct">
              <div className="mono dim small">direct lines</div>
              <a href={`mailto:${profile.email}`}>
                <span className="mono dim">mail</span> {profile.email}
              </a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer">
                <span className="mono dim">in</span> linkedin.com/in/houssem-mehouachi
              </a>
              <a href={profile.github} target="_blank" rel="noreferrer">
                <span className="mono dim">gh</span> github.com/Houssem64
              </a>
              <a href={profile.cv} download>
                <span className="mono dim">pdf</span> CV — System Administrator
              </a>
              <p className="dim small">
                Based in {profile.location}. {profile.relocation}.
              </p>
            </aside>
          </div>
        </section>
      </main>

      <footer className="wrap foot mono">
        <span># EOF</span>
        <span className="dim">
          build {buildDate} · next.js static export · © {new Date().getFullYear()} {profile.name}
        </span>
      </footer>
    </>
  );
}
