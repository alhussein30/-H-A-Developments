import React, { useState, useEffect, useRef, useCallback } from "react";
import { useContent } from "../useContent";
import { EN, AR, ICONS, SERVICE_ICONS, WHY_ICONS, TECH, SECTIONS } from "./translations";
import ImageSlot from "../ImageSlot";

const C = { bg: "#101418", card: "#1A2028", border: "#2B333D", accent: "#A3E635", text: "#F9FAFB", dim: "#9CA3AF" };

function Ico({ paths, size = 24, color = C.accent, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={style}>
      {paths.map((d, i) => <path key={i} d={d} />)}
    </svg>
  );
}

function Counter({ to, suffix }) {
  const ref = useRef(null);
  const [v, setV] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      const start = performance.now();
      const dur = 1800;
      function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        setV(Math.floor(p * to));
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{v}{suffix}</span>;
}

export default function Site() {
  const { data } = useContent();
  const [lang, setLang] = useState("en");
  const [active, setActive] = useState("");
  const [modalIndex, setModalIndex] = useState(-1);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "", type: "", budget: "", message: "" });
  const [errors, setErrors] = useState({});
  const revealRef = useRef([]);

  const ar = lang === "ar";
  const t = ar ? AR : EN;
  const dir = ar ? "rtl" : "ltr";
  const fontStack = ar ? "'IBM Plex Sans Arabic','Inter',sans-serif" : "'Inter',system-ui,sans-serif";
  const headFont = ar ? "'IBM Plex Sans Arabic','Space Grotesk',sans-serif" : "'Space Grotesk','Inter',sans-serif";
  const monoFont = "'JetBrains Mono',monospace";

  const hero = data.hero?.[lang] || (ar ? AR : EN);
  const projects = data.projects || [];
  const soon = data.soon || [];
  const team = data.team || [];
  const quotes = data.quotes || [];
  const links = data.links || {};
  const budgets = data.budgets || [];
  const types = data.types || [];

  useEffect(() => {
    const secs = SECTIONS.map(id => document.getElementById(id));
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: "-40% 0px -55% 0px" });
    secs.forEach(s => { if (s) obs.observe(s); });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    revealRef.current = els;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = "1";
          e.target.style.transform = "none";
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [lang]);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") setModalIndex(-1); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const reveal = { opacity: 0, transform: "translateY(24px)", transition: "opacity .6s ease, transform .6s ease" };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const validate = useCallback(() => {
    const e = {};
    if (!form.name.trim()) e.name = t.contact.err.name;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = t.contact.err.email;
    if (form.message.trim().length < 10) e.message = t.contact.err.message;
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [form, t]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) setSent(true);
  };

  const setField = (k, v) => {
    setForm(prev => ({ ...prev, [k]: v }));
    setErrors(prev => { const n = { ...prev }; delete n[k]; return n; });
  };

  const navSections = ["services", "portfolio", "process", "team", "contact"];

  const sectionLabel = (text) => ({
    display: "inline-block", fontSize: 13, fontWeight: 600, fontFamily: monoFont,
    color: C.accent, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8,
  });

  const sectionTitle = { fontSize: "clamp(28px,4vw,42px)", fontWeight: 700, fontFamily: headFont, color: C.text, margin: "0 0 12px" };
  const sectionSub = { fontSize: 17, color: C.dim, maxWidth: 560, margin: "0 0 48px", lineHeight: 1.7 };
  const cardStyle = { background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, padding: 28, transition: "border-color .25s" };

  const wrap = { maxWidth: 1200, margin: "0 auto", padding: "0 24px", boxSizing: "border-box" };

  const btnPrimary = {
    display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px",
    background: C.accent, color: "#101418", fontWeight: 600, fontSize: 15,
    borderRadius: 10, border: "none", cursor: "pointer", fontFamily: fontStack, transition: "opacity .2s",
  };

  const btnOutline = {
    ...btnPrimary, background: "transparent", color: C.text,
    border: `1px solid ${C.border}`,
  };

  const marqStyle = `@keyframes marq{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`;

  const modalProject = modalIndex >= 0 ? projects[modalIndex] : null;

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: fontStack, direction: dir, minHeight: "100vh", overflowX: "hidden" }}>
      <style>{marqStyle}</style>

      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", background: "rgba(16,20,24,.8)", borderBottom: `1px solid ${C.border}` }}>
        <div className="site-wrap" style={{ ...wrap, display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15, color: "#101418", fontFamily: headFont }}>HA</div>
          </div>
          <nav className="site-nav" style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <div className="site-nav-links" style={{ display: "flex", alignItems: "center", gap: 28 }}>
              {t.nav.items.map((label, i) => (
                <a key={i} onClick={() => scrollTo(navSections[i])} style={{ fontSize: 14, fontWeight: 500, color: active === navSections[i] ? C.accent : C.dim, cursor: "pointer", textDecoration: "none", transition: "color .2s", borderBottom: active === navSections[i] ? `2px solid ${C.accent}` : "2px solid transparent", paddingBottom: 4 }}>{label}</a>
              ))}
            </div>
            <button onClick={() => setLang(ar ? "en" : "ar")} style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.dim, padding: "6px 14px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontFamily: fontStack }}>{t.langToggle}</button>
            <button onClick={() => scrollTo("contact")} style={{ ...btnPrimary, padding: "8px 20px", fontSize: 14 }}>{t.nav.cta}</button>
          </nav>
        </div>
      </header>

      <section className="hero-section" style={{ paddingTop: 140, paddingBottom: 80 }}>
        <div className="hero-grid site-wrap" style={{ ...wrap, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          <div data-reveal style={reveal}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.card, border: `1px solid ${C.border}`, borderRadius: 100, padding: "6px 16px", marginBottom: 24, fontSize: 13, color: C.dim }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.accent, display: "inline-block" }} />
              {ar ? "متاحون لمشاريع جديدة" : "Available for new projects"}
            </div>
            <h1 style={{ fontSize: "clamp(36px,5vw,56px)", fontWeight: 700, fontFamily: headFont, lineHeight: 1.15, margin: "0 0 20px", color: C.text }}>{hero.title || (ar ? AR.heroStats[0].label : "We build software that grows businesses.")}</h1>
            <p style={{ fontSize: 18, color: C.dim, lineHeight: 1.7, margin: "0 0 32px", maxWidth: 520 }}>{hero.sub || ""}</p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 48 }}>
              <button onClick={() => scrollTo("contact")} style={btnPrimary}>{hero.cta1 || t.nav.cta}</button>
              <button onClick={() => scrollTo("portfolio")} style={btnOutline}>{hero.cta2 || t.work.view}</button>
            </div>
            <div className="hero-stats" style={{ display: "flex", gap: 40 }}>
              {t.heroStats.map((s, i) => (
                <div key={i}>
                  <div style={{ fontSize: 32, fontWeight: 700, fontFamily: headFont, color: C.accent }}><Counter to={s.n} suffix={s.suffix} /></div>
                  <div style={{ fontSize: 13, color: C.dim, marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div data-reveal style={{ ...reveal, position: "relative", minHeight: 380 }} className="hero-right">
            <div className="hero-card-1" style={{ ...cardStyle, position: "absolute", top: 0, right: ar ? "auto" : 0, left: ar ? 0 : "auto", width: 260, zIndex: 3, animation: "floaty 6s ease-in-out infinite", animationDelay: "0s" }}>
              <div style={{ fontSize: 12, color: C.dim, marginBottom: 12, fontFamily: monoFont }}>revenue.ts</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80 }}>
                {[40, 65, 50, 80, 60, 90, 75].map((h, i) => (
                  <div key={i} style={{ width: 24, borderRadius: 4, background: i === 5 ? C.accent : C.border, height: `${h}%`, animation: `barGrow .8s ease ${i * 0.1}s both`, transformOrigin: "bottom" }} />
                ))}
              </div>
            </div>

            <div className="hero-card-2" style={{ ...cardStyle, position: "absolute", top: 100, right: ar ? "auto" : 60, left: ar ? 60 : "auto", width: 240, zIndex: 2, animation: "floaty2 7s ease-in-out infinite", animationDelay: ".5s" }}>
              <div style={{ fontSize: 12, color: C.dim, marginBottom: 8, fontFamily: monoFont }}>api/health</div>
              {["Users API", "Payments", "Auth"].map((name, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0", borderBottom: i < 2 ? `1px solid ${C.border}` : "none" }}>
                  <span style={{ fontSize: 13, color: C.dim }}>{name}</span>
                  <span style={{ fontSize: 12, color: C.accent, fontFamily: monoFont }}>200 OK</span>
                </div>
              ))}
            </div>

            <div className="hero-card-3" style={{ ...cardStyle, position: "absolute", top: 220, right: ar ? "auto" : 20, left: ar ? 20 : "auto", width: 280, zIndex: 1, animation: "floaty 5s ease-in-out infinite", animationDelay: "1s" }}>
              <pre style={{ margin: 0, fontSize: 12, fontFamily: monoFont, color: C.dim, lineHeight: 1.6 }}>
                <span style={{ color: "#c084fc" }}>const</span>{" "}
                <span style={{ color: C.accent }}>deploy</span>{" "}
                <span style={{ color: C.dim }}>=</span>{" "}
                <span style={{ color: "#c084fc" }}>await</span>{"\n"}
                {"  "}<span style={{ color: "#60a5fa" }}>pipeline</span>
                <span style={{ color: C.dim }}>.run(</span>
                <span style={{ color: "#fbbf24" }}>"prod"</span>
                <span style={{ color: C.dim }}>);</span>
              </pre>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "40px 0", overflow: "hidden" }}>
        <div style={{ ...wrap, marginBottom: 20, textAlign: "center" }}>
          <span style={sectionLabel()}>{t.tech.label}</span>
        </div>
        <div style={{ position: "relative", maskImage: "linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent)", WebkitMaskImage: "linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent)" }}>
          <div style={{ display: "flex", gap: 48, animation: "marq 42s linear infinite", width: "max-content" }}>
            {[...TECH, ...TECH].map((name, i) => (
              <span key={i} style={{ fontSize: 15, color: C.dim, fontFamily: monoFont, whiteSpace: "nowrap", fontWeight: 500 }}>{name}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad" style={{ padding: "80px 0" }}>
        <div className="about-grid site-wrap" style={{ ...wrap, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          <div data-reveal style={reveal}>
            <span style={sectionLabel()}>{ar ? "من نحن" : "About"}</span>
            <h2 style={sectionTitle}>{data.about?.[lang]?.title || (ar ? "نبني البرمجيات بدقة." : "Building software with precision.")}</h2>
            <p style={{ fontSize: 16, color: C.dim, lineHeight: 1.8, margin: "0 0 16px" }}>{data.about?.[lang]?.body || (ar ? "إتش آند إيه للتطوير تجمع بين إتقان الواجهات وهندسة خلفية جادة." : "H&A Developments pairs frontend craft with serious backend engineering. We take products from first sketch to production deployment — no handoffs, no translation loss between design and infrastructure.")}</p>
            <p style={{ fontSize: 16, color: C.dim, lineHeight: 1.8, margin: 0 }}>{data.about?.[lang]?.body2 || (ar ? "تعتمد علينا الشركات الناشئة للانطلاق أسرع مما يتيحه فريق داخلي كامل." : "Startups use us to launch faster than a full in-house team allows. Established businesses use us to modernise systems that have outgrown their architecture.")}</p>
          </div>
          <div data-reveal style={{ ...reveal, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {(data.stats || []).map((s, i) => (
              <div key={i} style={cardStyle}>
                <div style={{ fontSize: 28, fontWeight: 700, fontFamily: headFont, color: C.accent, marginBottom: 6 }}>{s.v}</div>
                <div style={{ fontSize: 13, color: C.dim, lineHeight: 1.5 }}>{s[lang] || s.en}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="section-pad" style={{ padding: "80px 0" }}>
        <div className="site-wrap" style={wrap}>
          <div data-reveal style={{ ...reveal, textAlign: "center", marginBottom: 48 }}>
            <span style={sectionLabel()}>{t.services.label}</span>
            <h2 style={{ ...sectionTitle, textAlign: "center" }}>{t.services.title}</h2>
            <p style={{ ...sectionSub, margin: "0 auto 48px" }}>{t.services.sub}</p>
          </div>
          <div className="services-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20 }}>
            {t.services.items.map((svc, i) => (
              <div key={i} data-reveal style={{ ...reveal, ...cardStyle, transitionDelay: `${i * 0.05}s` }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(163,230,53,.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <Ico paths={SERVICE_ICONS[i]} size={22} />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 600, fontFamily: headFont, color: C.text, margin: "0 0 8px" }}>{svc.t}</h3>
                <p style={{ fontSize: 14, color: C.dim, lineHeight: 1.7, margin: "0 0 16px" }}>{svc.d}</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {svc.tags.map((tag, j) => (
                    <span key={j} style={{ fontSize: 12, fontFamily: monoFont, color: C.accent, background: "rgba(163,230,53,.08)", padding: "4px 10px", borderRadius: 6 }}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="portfolio" className="section-pad" style={{ padding: "80px 0" }}>
        <div className="site-wrap" style={wrap}>
          <div data-reveal style={{ ...reveal, textAlign: "center", marginBottom: 48 }}>
            <span style={sectionLabel()}>{t.work.label}</span>
            <h2 style={{ ...sectionTitle, textAlign: "center" }}>{t.work.title}</h2>
            <p style={{ ...sectionSub, margin: "0 auto 48px" }}>{t.work.sub}</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {projects.map((p, i) => (
              <div key={p.id} data-reveal className="project-card" style={{ ...reveal, ...cardStyle, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "center", padding: 0, overflow: "hidden" }}>
                <div style={{ padding: 32 }}>
                  <div style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "center" }}>
                    <span style={{ fontSize: 12, fontFamily: monoFont, color: C.accent, background: "rgba(163,230,53,.1)", padding: "4px 10px", borderRadius: 6 }}>{p.year}</span>
                    <span style={{ fontSize: 13, color: C.dim }}>{p.kind?.[lang] || ""}</span>
                  </div>
                  <h3 style={{ fontSize: 24, fontWeight: 700, fontFamily: headFont, color: C.text, margin: "0 0 10px" }}>{p.name?.[lang] || ""}</h3>
                  <p style={{ fontSize: 15, color: C.dim, lineHeight: 1.7, margin: "0 0 16px" }}>{p.desc?.[lang] || ""}</p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
                    {(p.tags || []).map((tag, j) => (
                      <span key={j} style={{ fontSize: 12, fontFamily: monoFont, color: C.dim, background: C.bg, padding: "4px 10px", borderRadius: 6, border: `1px solid ${C.border}` }}>{tag}</span>
                    ))}
                  </div>
                  <button onClick={() => setModalIndex(i)} style={btnOutline}>{t.work.view}</button>
                </div>
                <div className="project-card-img" style={{ height: "100%", minHeight: 260, background: C.bg }}>
                  <ImageSlot id={p.slot} placeholder={p.name?.en || "Project"} radius={0} />
                </div>
              </div>
            ))}
          </div>

          {soon.length > 0 && (
            <div style={{ marginTop: 40 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, fontFamily: headFont, color: C.dim, marginBottom: 20, textAlign: "center" }}>{t.work.comingSoon}</h3>
              <div className="coming-soon-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16 }}>
                {soon.map(s => (
                  <div key={s.id} style={{ ...cardStyle, borderStyle: "dashed" }}>
                    <h4 style={{ fontSize: 16, fontWeight: 600, fontFamily: headFont, color: C.text, margin: "0 0 6px" }}>{s.name?.[lang] || ""}</h4>
                    <p style={{ fontSize: 14, color: C.dim, margin: 0, lineHeight: 1.6 }}>{s.desc?.[lang] || ""}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section id="process" className="section-pad" style={{ padding: "80px 0" }}>
        <div className="site-wrap" style={wrap}>
          <div data-reveal style={{ ...reveal, textAlign: "center", marginBottom: 48 }}>
            <span style={sectionLabel()}>{t.process.label}</span>
            <h2 style={{ ...sectionTitle, textAlign: "center" }}>{t.process.title}</h2>
          </div>
          <div className="process-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20 }}>
            {t.process.steps.map((step, i) => (
              <div key={i} data-reveal style={{ ...reveal, ...cardStyle, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: C.border }}>
                  <div style={{ height: "100%", width: `${((i + 1) / 6) * 100}%`, background: C.accent, borderRadius: 2 }} />
                </div>
                <span style={{ fontSize: 32, fontWeight: 700, fontFamily: headFont, color: "rgba(163,230,53,.15)", display: "block", marginBottom: 8 }}>{step.n}</span>
                <h3 style={{ fontSize: 18, fontWeight: 600, fontFamily: headFont, color: C.text, margin: "0 0 8px" }}>{step.t}</h3>
                <p style={{ fontSize: 14, color: C.dim, lineHeight: 1.7, margin: 0 }}>{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad" style={{ padding: "80px 0" }}>
        <div className="site-wrap" style={wrap}>
          <div data-reveal style={{ ...reveal, textAlign: "center", marginBottom: 48 }}>
            <span style={sectionLabel()}>{t.why.label}</span>
            <h2 style={{ ...sectionTitle, textAlign: "center" }}>{t.why.title}</h2>
          </div>
          <div className="why-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 20 }}>
            {t.why.items.map((item, i) => (
              <div key={i} data-reveal style={{ ...reveal, ...cardStyle }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(163,230,53,.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                  <Ico paths={WHY_ICONS[i]} size={20} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 600, fontFamily: headFont, color: C.text, margin: "0 0 6px" }}>{item.t}</h3>
                <p style={{ fontSize: 14, color: C.dim, lineHeight: 1.7, margin: 0 }}>{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="team" className="section-pad" style={{ padding: "80px 0" }}>
        <div className="site-wrap" style={wrap}>
          <div data-reveal style={{ ...reveal, textAlign: "center", marginBottom: 48 }}>
            <span style={sectionLabel()}>{t.team.label}</span>
            <h2 style={{ ...sectionTitle, textAlign: "center" }}>{t.team.title}</h2>
            <p style={{ ...sectionSub, margin: "0 auto 48px" }}>{t.team.sub}</p>
          </div>
          <div className="team-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))", gap: 24 }}>
            {team.map(m => (
              <div key={m.id} data-reveal style={{ ...reveal, ...cardStyle, textAlign: "center" }}>
                <div style={{ width: 100, height: 100, borderRadius: "50%", overflow: "hidden", margin: "0 auto 16px", border: `2px solid ${C.border}` }}>
                  <ImageSlot id={m.slot} placeholder={m.name?.en || ""} radius={50} />
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 600, fontFamily: headFont, color: C.text, margin: "0 0 4px" }}>{m.name?.[lang] || ""}</h3>
                <div style={{ fontSize: 14, color: C.accent, fontFamily: monoFont, marginBottom: 10 }}>{m.role?.[lang] || ""}</div>
                <p style={{ fontSize: 14, color: C.dim, lineHeight: 1.7, margin: "0 0 14px" }}>{m.bio?.[lang] || ""}</p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
                  {(m.skills || []).map((sk, j) => (
                    <span key={j} style={{ fontSize: 11, fontFamily: monoFont, color: C.dim, background: C.bg, padding: "3px 8px", borderRadius: 6, border: `1px solid ${C.border}` }}>{sk}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad" style={{ padding: "80px 0" }}>
        <div className="site-wrap" style={wrap}>
          <div data-reveal style={{ ...reveal, textAlign: "center", marginBottom: 48 }}>
            <span style={sectionLabel()}>{t.quotes.label}</span>
            <h2 style={{ ...sectionTitle, textAlign: "center" }}>{t.quotes.title}</h2>
          </div>
          <div className="quotes-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 20 }}>
            {quotes.map(q => (
              <div key={q.id} data-reveal style={{ ...reveal, ...cardStyle }}>
                <span style={{ fontSize: 48, fontFamily: "Georgia,serif", color: C.accent, lineHeight: 1, display: "block", marginBottom: 8 }}>&ldquo;</span>
                <p style={{ fontSize: 15, color: C.dim, lineHeight: 1.8, margin: "0 0 20px", fontStyle: "italic" }}>{q.text?.[lang] || ""}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(163,230,53,.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: C.accent, fontFamily: monoFont }}>{q.initials}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{q.name?.[lang] || ""}</div>
                    <div style={{ fontSize: 12, color: C.dim }}>{q.role?.[lang] || ""}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="section-pad" style={{ padding: "80px 0" }}>
        <div className="site-wrap" style={wrap}>
          <div data-reveal style={{ ...reveal, ...cardStyle, padding: 0, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }} className="contact-grid">
              <div className="contact-left" style={{ padding: 48, background: C.bg }}>
                <h2 style={{ ...sectionTitle, marginBottom: 12 }}>{t.contact.title}</h2>
                <p style={{ fontSize: 16, color: C.dim, lineHeight: 1.7, margin: "0 0 28px" }}>{t.contact.sub}</p>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px" }}>
                  {t.contact.points.map((pt, i) => (
                    <li key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, fontSize: 15, color: C.dim }}>
                      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      {pt}
                    </li>
                  ))}
                </ul>
                <p style={{ fontSize: 14, color: C.dim, margin: 0 }}>{t.contact.call}</p>
                {links.email && <a href={`mailto:${links.email}`} style={{ fontSize: 15, color: C.accent, textDecoration: "none", fontFamily: monoFont }}>{links.email}</a>}
              </div>

              <div className="contact-right" style={{ padding: 48 }}>
                {sent ? (
                  <div style={{ textAlign: "center", padding: "60px 0" }}>
                    <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(163,230,53,.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                      <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                    <h3 style={{ fontSize: 22, fontWeight: 600, fontFamily: headFont, color: C.text, margin: "0 0 8px" }}>{t.contact.sentTitle}</h3>
                    <p style={{ fontSize: 15, color: C.dim, margin: "0 0 24px" }}>{t.contact.sentBody}</p>
                    <button onClick={() => { setSent(false); setForm({ name: "", email: "", company: "", type: "", budget: "", message: "" }); }} style={btnOutline}>{t.contact.again}</button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="contact-form">
                    {[
                      { k: "name", span: 1 },
                      { k: "email", span: 1, type: "email" },
                      { k: "company", span: 2 },
                    ].map(f => (
                      <div key={f.k} style={{ gridColumn: f.span === 2 ? "1/-1" : undefined }}>
                        <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: C.dim, marginBottom: 6 }}>{t.contact.labels[f.k]}</label>
                        <input type={f.type || "text"} value={form[f.k]} onChange={e => setField(f.k, e.target.value)} placeholder={t.contact.ph[f.k]} style={{ width: "100%", padding: "12px 14px", background: C.bg, border: `1px solid ${errors[f.k] ? "#ef4444" : C.border}`, borderRadius: 10, color: C.text, fontSize: 14, fontFamily: fontStack, outline: "none", boxSizing: "border-box", transition: "border-color .2s" }} />
                        {errors[f.k] && <span style={{ fontSize: 12, color: "#ef4444", marginTop: 4, display: "block" }}>{errors[f.k]}</span>}
                      </div>
                    ))}

                    <div>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: C.dim, marginBottom: 6 }}>{t.contact.labels.type}</label>
                      <select value={form.type} onChange={e => setField("type", e.target.value)} style={{ width: "100%", padding: "12px 14px", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, color: form.type ? C.text : C.dim, fontSize: 14, fontFamily: fontStack, outline: "none", boxSizing: "border-box", appearance: "none" }}>
                        <option value="">—</option>
                        {types.map((tp, i) => <option key={i} value={tp[lang] || tp.en}>{tp[lang] || tp.en}</option>)}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: C.dim, marginBottom: 6 }}>{t.contact.labels.budget}</label>
                      <select value={form.budget} onChange={e => setField("budget", e.target.value)} style={{ width: "100%", padding: "12px 14px", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, color: form.budget ? C.text : C.dim, fontSize: 14, fontFamily: fontStack, outline: "none", boxSizing: "border-box", appearance: "none" }}>
                        <option value="">—</option>
                        {budgets.map((b, i) => <option key={i} value={b[lang] || b.en}>{b[lang] || b.en}</option>)}
                      </select>
                    </div>

                    <div style={{ gridColumn: "1/-1" }}>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: C.dim, marginBottom: 6 }}>{t.contact.labels.message}</label>
                      <textarea value={form.message} onChange={e => setField("message", e.target.value)} placeholder={t.contact.ph.message} rows={4} style={{ width: "100%", padding: "12px 14px", background: C.bg, border: `1px solid ${errors.message ? "#ef4444" : C.border}`, borderRadius: 10, color: C.text, fontSize: 14, fontFamily: fontStack, outline: "none", resize: "vertical", boxSizing: "border-box" }} />
                      {errors.message && <span style={{ fontSize: 12, color: "#ef4444", marginTop: 4, display: "block" }}>{errors.message}</span>}
                    </div>

                    <div style={{ gridColumn: "1/-1" }}>
                      <button type="submit" style={{ ...btnPrimary, width: "100%", justifyContent: "center" }}>{t.contact.send}</button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer style={{ borderTop: `1px solid ${C.border}`, padding: "60px 0 0" }}>
        <div className="footer-grid footer-inner site-wrap" style={{ ...wrap, display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 48, paddingBottom: 48 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15, color: "#101418", fontFamily: headFont }}>HA</div>
              <span style={{ fontWeight: 700, fontSize: 18, fontFamily: headFont }}>H&A Developments</span>
            </div>
            <p style={{ fontSize: 14, color: C.dim, lineHeight: 1.7, maxWidth: 360, margin: 0 }}>{t.footer.blurb}</p>
          </div>
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 16, fontFamily: headFont }}>{t.footer.navTitle}</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {t.nav.items.map((item, i) => (
                <li key={i} style={{ marginBottom: 10 }}>
                  <a onClick={() => scrollTo(navSections[i])} style={{ fontSize: 14, color: C.dim, cursor: "pointer", textDecoration: "none", transition: "color .2s" }}>{item}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 16, fontFamily: headFont }}>{t.footer.connect}</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {links.email && <li style={{ marginBottom: 10 }}><a href={`mailto:${links.email}`} style={{ fontSize: 14, color: C.dim, textDecoration: "none" }}>Email</a></li>}
              {links.github && <li style={{ marginBottom: 10 }}><a href={links.github} target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, color: C.dim, textDecoration: "none" }}>GitHub</a></li>}
              {links.linkedin && <li style={{ marginBottom: 10 }}><a href={links.linkedin} target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, color: C.dim, textDecoration: "none" }}>LinkedIn</a></li>}
              {links.facebook && <li style={{ marginBottom: 10 }}><a href={links.facebook} target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, color: C.dim, textDecoration: "none" }}>Facebook</a></li>}
              {links.instagram && <li style={{ marginBottom: 10 }}><a href={links.instagram} target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, color: C.dim, textDecoration: "none" }}>Instagram</a></li>}
              {links.tiktok && <li style={{ marginBottom: 10 }}><a href={links.tiktok} target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, color: C.dim, textDecoration: "none" }}>TikTok</a></li>}
              {links.youtube && <li style={{ marginBottom: 10 }}><a href={links.youtube} target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, color: C.dim, textDecoration: "none" }}>YouTube</a></li>}
            </ul>
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${C.border}`, padding: "20px 0" }}>
          <div style={{ ...wrap, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, color: C.dim }}>
            <span>&copy; {new Date().getFullYear()} H&A Developments. {t.footer.rights}</span>
            <span>{t.footer.made}</span>
          </div>
        </div>
      </footer>

      {modalProject && (
        <div onClick={() => setModalIndex(-1)} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div className="modal-inner" onClick={e => e.stopPropagation()} style={{ background: C.card, borderRadius: 20, border: `1px solid ${C.border}`, maxWidth: 720, width: "100%", maxHeight: "90vh", overflow: "auto", position: "relative" }}>
            <button onClick={() => setModalIndex(-1)} style={{ position: "absolute", top: 16, right: ar ? "auto" : 16, left: ar ? 16 : "auto", background: C.bg, border: `1px solid ${C.border}`, color: C.dim, width: 36, height: 36, borderRadius: 10, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}>&times;</button>
            <div className="modal-img" style={{ height: 280, background: C.bg, borderRadius: "20px 20px 0 0", overflow: "hidden" }}>
              <ImageSlot id={modalProject.slot} placeholder={modalProject.name?.en || ""} radius={0} />
            </div>
            <div style={{ padding: 32 }}>
              <span style={{ fontSize: 12, fontFamily: monoFont, color: C.accent, background: "rgba(163,230,53,.1)", padding: "4px 10px", borderRadius: 6, marginBottom: 12, display: "inline-block" }}>{modalProject.kind?.[lang] || ""}</span>
              <h2 style={{ fontSize: 28, fontWeight: 700, fontFamily: headFont, color: C.text, margin: "0 0 12px" }}>{modalProject.name?.[lang] || ""}</h2>
              <p style={{ fontSize: 15, color: C.dim, lineHeight: 1.8, margin: "0 0 24px" }}>{modalProject.long?.[lang] || modalProject.desc?.[lang] || ""}</p>
              <div className="modal-facts" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
                {[
                  { l: t.work.factLabels.role, v: modalProject.role?.[lang] },
                  { l: t.work.factLabels.timeline, v: modalProject.timeline?.[lang] },
                  { l: t.work.factLabels.status, v: modalProject.status?.[lang] },
                ].map((f, i) => (
                  <div key={i} style={{ background: C.bg, borderRadius: 10, padding: "12px 16px", border: `1px solid ${C.border}` }}>
                    <div style={{ fontSize: 11, fontFamily: monoFont, color: C.dim, marginBottom: 4, textTransform: "uppercase" }}>{f.l}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{f.v || "—"}</div>
                  </div>
                ))}
              </div>
              {modalProject.stack && modalProject.stack.length > 0 && (
                <div>
                  <div style={{ fontSize: 12, fontFamily: monoFont, color: C.dim, marginBottom: 8, textTransform: "uppercase" }}>{ar ? "التقنيات" : "Tech Stack"}</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {modalProject.stack.map((s, i) => (
                      <span key={i} style={{ fontSize: 12, fontFamily: monoFont, color: C.accent, background: "rgba(163,230,53,.08)", padding: "5px 12px", borderRadius: 6 }}>{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media(max-width:980px){
          .hero-right{display:none!important}
          .hero-grid{grid-template-columns:1fr!important;gap:32px!important}
          .about-grid{grid-template-columns:1fr!important;gap:32px!important}
          .contact-grid,.footer-grid{grid-template-columns:1fr!important}
          .project-card{grid-template-columns:1fr!important}
          .project-card-img{min-height:200px!important;height:200px!important}
          .modal-facts{grid-template-columns:1fr!important}
        }
        @media(max-width:768px){
          .site-nav-links{display:none!important}
          .site-nav{gap:12px!important}
          .hero-section{padding-top:100px!important;padding-bottom:40px!important}
          .hero-stats{gap:20px!important}
          .hero-stats>div>div:first-child{font-size:24px!important}
          .section-pad{padding:48px 0!important}
          .services-grid{grid-template-columns:1fr!important}
          .process-grid{grid-template-columns:1fr!important}
          .why-grid{grid-template-columns:1fr!important}
          .team-grid{grid-template-columns:1fr!important}
          .quotes-grid{grid-template-columns:1fr!important}
          .coming-soon-grid{grid-template-columns:1fr!important}
          .contact-form{grid-template-columns:1fr!important}
          .footer-grid{gap:32px!important}
          .modal-inner{margin:12px!important;max-height:95vh!important}
          .modal-img{height:180px!important}
        }
        @media(max-width:480px){
          .site-wrap{padding:0 16px!important}
          .hero-stats{flex-direction:column!important;gap:12px!important}
          .contact-left,.contact-right{padding:24px!important}
          .footer-inner{padding-bottom:24px!important}
        }
      `}</style>
    </div>
  );
}
