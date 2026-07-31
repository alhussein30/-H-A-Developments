import React, { useState } from "react";
import { useContent } from "../useContent";
import ImageSlot from "../ImageSlot";

const BG = "#101418";
const CARD = "#1A2028";
const BORDER = "#2B333D";
const ACCENT = "#A3E635";
const TEXT = "#F9FAFB";
const TEXT2 = "#9CA3AF";
const FONT_H = "'Space Grotesk', sans-serif";
const FONT_B = "'Inter', sans-serif";

const focusRing = {
  borderColor: ACCENT,
  boxShadow: "0 0 0 3px rgba(163,230,53,.22)",
};

function inp(extra) {
  return {
    background: BG,
    color: TEXT,
    border: `1px solid ${BORDER}`,
    borderRadius: 11,
    padding: "10px 14px",
    fontFamily: FONT_B,
    fontSize: 14,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    transition: "border-color .2s, box-shadow .2s",
    ...extra,
  };
}

function handleFocus(e) {
  Object.assign(e.target.style, focusRing);
}
function handleBlur(e) {
  e.target.style.borderColor = BORDER;
  e.target.style.boxShadow = "none";
}

function Field({ label, value, onChange, textarea, span2, dir }) {
  const wrapper = { display: "flex", flexDirection: "column", gap: 6 };
  if (span2) wrapper.gridColumn = "1 / -1";
  const Tag = textarea ? "textarea" : "input";
  return (
    <div style={wrapper}>
      <label style={{ fontSize: 12, color: TEXT2, fontFamily: FONT_B }}>{label}</label>
      <Tag
        style={inp(textarea ? { resize: "vertical", minHeight: 72 } : {})}
        value={value || ""}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        dir={dir}
      />
    </div>
  );
}

function Card({ title, children, style: extra }) {
  return (
    <div
      style={{
        background: CARD,
        border: `1px solid ${BORDER}`,
        borderRadius: 18,
        padding: 28,
        display: "flex",
        flexDirection: "column",
        gap: 20,
        ...extra,
      }}
    >
      {title && (
        <h3 style={{ margin: 0, fontSize: 16, fontFamily: FONT_H, color: TEXT }}>{title}</h3>
      )}
      {children}
    </div>
  );
}

function Chip({ label, onRemove }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: "rgba(163,230,53,.12)",
        color: ACCENT,
        borderRadius: 8,
        padding: "4px 10px",
        fontSize: 13,
        fontFamily: FONT_B,
      }}
    >
      {label}
      <span
        onClick={onRemove}
        style={{ cursor: "pointer", fontWeight: 700, fontSize: 15, lineHeight: 1 }}
      >
        &times;
      </span>
    </span>
  );
}

function ChipGroup({ label, items, onRemove, draftKey, drafts, setDrafts, onAdd }) {
  return (
    <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: 8 }}>
      <label style={{ fontSize: 12, color: TEXT2, fontFamily: FONT_B }}>{label}</label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {items.map((t, i) => (
          <Chip key={i} label={t} onRemove={() => onRemove(i)} />
        ))}
      </div>
      <input
        style={inp({ maxWidth: 220 })}
        placeholder="Type + Enter"
        value={drafts[draftKey] || ""}
        onChange={(e) => setDrafts({ ...drafts, [draftKey]: e.target.value })}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={(e) => {
          if (e.key === "Enter" && drafts[draftKey]?.trim()) {
            e.preventDefault();
            onAdd(drafts[draftKey].trim());
            setDrafts({ ...drafts, [draftKey]: "" });
          }
        }}
      />
    </div>
  );
}

function AddBtn({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "transparent",
        color: ACCENT,
        border: `1px dashed ${ACCENT}`,
        borderRadius: 11,
        padding: "10px 20px",
        fontFamily: FONT_B,
        fontSize: 14,
        cursor: "pointer",
        alignSelf: "flex-start",
      }}
    >
      {label}
    </button>
  );
}

function RemoveBtn({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "rgba(239,68,68,.12)",
        color: "#EF4444",
        border: "1px solid rgba(239,68,68,.25)",
        borderRadius: 9,
        padding: "6px 14px",
        fontSize: 13,
        fontFamily: FONT_B,
        cursor: "pointer",
      }}
    >
      Remove
    </button>
  );
}

const TABS = [
  { key: "content", label: "Content" },
  { key: "photos", label: "Photos" },
  { key: "projects", label: "Projects" },
  { key: "team", label: "Team & skills" },
  { key: "testimonials", label: "Testimonials" },
  { key: "links", label: "Links" },
  { key: "budget", label: "Budget & types" },
];

const SUBS = {
  content: "Hero copy, about text & statistics",
  photos: "Project covers & team headshots",
  projects: "Portfolio items & coming-soon",
  team: "Members, roles & skill sets",
  testimonials: "Client quotes & endorsements",
  links: "Social & contact links",
  budget: "Budget ranges & project types",
};

function badge(data, key) {
  if (key === "projects") return data.projects?.length || 0;
  if (key === "team") return data.team?.length || 0;
  if (key === "testimonials") return data.quotes?.length || 0;
  if (key === "photos") return (data.projects?.length || 0) + (data.team?.length || 0);
  if (key === "content") return (data.stats?.length || 0);
  if (key === "budget") return (data.budgets?.length || 0) + (data.types?.length || 0);
  if (key === "links") {
    return Object.values(data.links || {}).filter((v) => v).length;
  }
  return 0;
}

export default function Dashboard() {
  const { data, commit, uid, DEFAULTS } = useContent();
  const [tab, setTab] = useState("content");
  const [lang, setLang] = useState("en");
  const [drafts, setDrafts] = useState({});

  const isAr = lang === "ar";
  const dir = isAr ? "rtl" : "ltr";

  function renderContent() {
    return (
      <>
        <Card title="Hero & about">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Field
              label="Hero headline"
              span2
              dir={dir}
              value={data.hero?.[lang]?.title}
              onChange={(e) =>
                commit((d) => {
                  d.hero[lang].title = e.target.value;
                })
              }
            />
            <Field
              label="Hero subheadline"
              textarea
              span2
              dir={dir}
              value={data.hero?.[lang]?.sub}
              onChange={(e) =>
                commit((d) => {
                  d.hero[lang].sub = e.target.value;
                })
              }
            />
            <Field
              label="Primary button"
              dir={dir}
              value={data.hero?.[lang]?.cta1}
              onChange={(e) =>
                commit((d) => {
                  d.hero[lang].cta1 = e.target.value;
                })
              }
            />
            <Field
              label="Secondary button"
              dir={dir}
              value={data.hero?.[lang]?.cta2}
              onChange={(e) =>
                commit((d) => {
                  d.hero[lang].cta2 = e.target.value;
                })
              }
            />
            <Field
              label="About headline"
              span2
              dir={dir}
              value={data.about?.[lang]?.title}
              onChange={(e) =>
                commit((d) => {
                  d.about[lang].title = e.target.value;
                })
              }
            />
            <Field
              label="About paragraph 1"
              textarea
              span2
              dir={dir}
              value={data.about?.[lang]?.body}
              onChange={(e) =>
                commit((d) => {
                  d.about[lang].body = e.target.value;
                })
              }
            />
            <Field
              label="About paragraph 2"
              textarea
              span2
              dir={dir}
              value={data.about?.[lang]?.body2}
              onChange={(e) =>
                commit((d) => {
                  d.about[lang].body2 = e.target.value;
                })
              }
            />
          </div>
        </Card>
        <Card title="Statistics">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {(data.stats || []).map((s, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "100px 1fr auto", gap: 10, alignItems: "end" }}>
                <Field
                  label={i === 0 ? "Value" : ""}
                  value={s.v}
                  onChange={(e) =>
                    commit((d) => {
                      d.stats[i].v = e.target.value;
                    })
                  }
                />
                <Field
                  label={i === 0 ? "Label" : ""}
                  dir={dir}
                  value={s[lang]}
                  onChange={(e) =>
                    commit((d) => {
                      d.stats[i][lang] = e.target.value;
                    })
                  }
                />
                <RemoveBtn
                  onClick={() =>
                    commit((d) => {
                      d.stats.splice(i, 1);
                    })
                  }
                />
              </div>
            ))}
            <AddBtn
              label="+ Add stat"
              onClick={() =>
                commit((d) => {
                  d.stats.push({ v: "", en: "", ar: "" });
                })
              }
            />
          </div>
        </Card>
      </>
    );
  }

  function renderPhotos() {
    const slots = [
      ...(data.projects || []).map((p) => ({ id: p.slot, label: p.name?.[lang] || p.id })),
      ...(data.team || []).map((t) => ({ id: t.slot, label: t.name?.[lang] || t.id })),
    ];
    return (
      <Card title="Image library">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 16,
          }}
        >
          {slots.map((s) => (
            <div key={s.id} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ width: "100%", aspectRatio: "4/3" }}>
                <ImageSlot id={s.id} placeholder="Drop image" radius={14} />
              </div>
              <span style={{ fontSize: 12, color: TEXT2, fontFamily: FONT_B, textAlign: "center" }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  function renderProjects() {
    return (
      <>
        {(data.projects || []).map((p, i) => (
          <Card key={p.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 9,
                    background: ACCENT,
                    color: "#101418",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: 14,
                    fontFamily: FONT_H,
                  }}
                >
                  {i + 1}
                </span>
                <h3 style={{ margin: 0, fontSize: 16, fontFamily: FONT_H, color: TEXT }}>
                  {p.name?.[lang] || "Untitled"}
                </h3>
              </div>
              <RemoveBtn
                onClick={() =>
                  commit((d) => {
                    d.projects.splice(i, 1);
                  })
                }
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Field
                label="Project name"
                dir={dir}
                value={p.name?.[lang]}
                onChange={(e) =>
                  commit((d) => {
                    d.projects[i].name[lang] = e.target.value;
                  })
                }
              />
              <Field
                label="Category"
                dir={dir}
                value={p.kind?.[lang]}
                onChange={(e) =>
                  commit((d) => {
                    d.projects[i].kind[lang] = e.target.value;
                  })
                }
              />
              <Field
                label="Year"
                value={p.year}
                onChange={(e) =>
                  commit((d) => {
                    d.projects[i].year = e.target.value;
                  })
                }
              />
              <Field
                label="Status"
                dir={dir}
                value={p.status?.[lang]}
                onChange={(e) =>
                  commit((d) => {
                    d.projects[i].status[lang] = e.target.value;
                  })
                }
              />
              <Field
                label="Role"
                dir={dir}
                value={p.role?.[lang]}
                onChange={(e) =>
                  commit((d) => {
                    d.projects[i].role[lang] = e.target.value;
                  })
                }
              />
              <Field
                label="Timeline"
                dir={dir}
                value={p.timeline?.[lang]}
                onChange={(e) =>
                  commit((d) => {
                    d.projects[i].timeline[lang] = e.target.value;
                  })
                }
              />
              <Field
                label="Card description"
                textarea
                span2
                dir={dir}
                value={p.desc?.[lang]}
                onChange={(e) =>
                  commit((d) => {
                    d.projects[i].desc[lang] = e.target.value;
                  })
                }
              />
              <Field
                label="Full description"
                textarea
                span2
                dir={dir}
                value={p.long?.[lang]}
                onChange={(e) =>
                  commit((d) => {
                    d.projects[i].long[lang] = e.target.value;
                  })
                }
              />
              <ChipGroup
                label="Card tags"
                items={p.tags || []}
                onRemove={(idx) =>
                  commit((d) => {
                    d.projects[i].tags.splice(idx, 1);
                  })
                }
                draftKey={`proj-tag-${p.id}`}
                drafts={drafts}
                setDrafts={setDrafts}
                onAdd={(v) =>
                  commit((d) => {
                    d.projects[i].tags.push(v);
                  })
                }
              />
              <ChipGroup
                label="Tech stack"
                items={p.stack || []}
                onRemove={(idx) =>
                  commit((d) => {
                    d.projects[i].stack.splice(idx, 1);
                  })
                }
                draftKey={`proj-stack-${p.id}`}
                drafts={drafts}
                setDrafts={setDrafts}
                onAdd={(v) =>
                  commit((d) => {
                    d.projects[i].stack.push(v);
                  })
                }
              />
            </div>
          </Card>
        ))}
        <AddBtn
          label="+ Add project"
          onClick={() =>
            commit((d) => {
              const id = uid("proj");
              d.projects.push({
                id,
                slot: "work-" + id,
                year: "",
                name: { en: "", ar: "" },
                kind: { en: "", ar: "" },
                desc: { en: "", ar: "" },
                long: { en: "", ar: "" },
                role: { en: "", ar: "" },
                timeline: { en: "", ar: "" },
                status: { en: "", ar: "" },
                tags: [],
                stack: [],
              });
            })
          }
        />
        <Card title="Coming soon placeholders">
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {(data.soon || []).map((s, i) => (
              <div key={s.id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 10, alignItems: "end" }}>
                <Field
                  label={i === 0 ? "Name" : ""}
                  dir={dir}
                  value={s.name?.[lang]}
                  onChange={(e) =>
                    commit((d) => {
                      d.soon[i].name[lang] = e.target.value;
                    })
                  }
                />
                <Field
                  label={i === 0 ? "Description" : ""}
                  dir={dir}
                  value={s.desc?.[lang]}
                  onChange={(e) =>
                    commit((d) => {
                      d.soon[i].desc[lang] = e.target.value;
                    })
                  }
                />
                <RemoveBtn
                  onClick={() =>
                    commit((d) => {
                      d.soon.splice(i, 1);
                    })
                  }
                />
              </div>
            ))}
            <AddBtn
              label="+ Add placeholder"
              onClick={() =>
                commit((d) => {
                  d.soon.push({ id: uid("soon"), name: { en: "", ar: "" }, desc: { en: "", ar: "" } });
                })
              }
            />
          </div>
        </Card>
      </>
    );
  }

  function renderTeam() {
    return (
      <>
        {(data.team || []).map((m, i) => (
          <Card key={m.id}>
            <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
              <div style={{ width: 88, height: 88, flexShrink: 0 }}>
                <ImageSlot id={m.slot} placeholder="Photo" radius={14} />
              </div>
              <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Field
                  label="Name"
                  dir={dir}
                  value={m.name?.[lang]}
                  onChange={(e) =>
                    commit((d) => {
                      d.team[i].name[lang] = e.target.value;
                    })
                  }
                />
                <Field
                  label="Role"
                  dir={dir}
                  value={m.role?.[lang]}
                  onChange={(e) =>
                    commit((d) => {
                      d.team[i].role[lang] = e.target.value;
                    })
                  }
                />
                <Field
                  label="Bio"
                  textarea
                  span2
                  dir={dir}
                  value={m.bio?.[lang]}
                  onChange={(e) =>
                    commit((d) => {
                      d.team[i].bio[lang] = e.target.value;
                    })
                  }
                />
                <ChipGroup
                  label="Skills"
                  items={m.skills || []}
                  onRemove={(idx) =>
                    commit((d) => {
                      d.team[i].skills.splice(idx, 1);
                    })
                  }
                  draftKey={`team-skill-${m.id}`}
                  drafts={drafts}
                  setDrafts={setDrafts}
                  onAdd={(v) =>
                    commit((d) => {
                      d.team[i].skills.push(v);
                    })
                  }
                />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <RemoveBtn
                onClick={() =>
                  commit((d) => {
                    d.team.splice(i, 1);
                  })
                }
              />
            </div>
          </Card>
        ))}
        <AddBtn
          label="+ Add member"
          onClick={() =>
            commit((d) => {
              const id = uid("member");
              d.team.push({
                id,
                slot: "team-" + id,
                name: { en: "", ar: "" },
                role: { en: "", ar: "" },
                bio: { en: "", ar: "" },
                skills: [],
              });
            })
          }
        />
      </>
    );
  }

  function renderTestimonials() {
    return (
      <>
        {(data.quotes || []).map((q, i) => (
          <Card key={q.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: 16, fontFamily: FONT_H, color: TEXT }}>
                {q.name?.[lang] || "Untitled"}
              </h3>
              <RemoveBtn
                onClick={() =>
                  commit((d) => {
                    d.quotes.splice(i, 1);
                  })
                }
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Field
                label="Name"
                dir={dir}
                value={q.name?.[lang]}
                onChange={(e) =>
                  commit((d) => {
                    d.quotes[i].name[lang] = e.target.value;
                  })
                }
              />
              <Field
                label="Role / company"
                dir={dir}
                value={q.role?.[lang]}
                onChange={(e) =>
                  commit((d) => {
                    d.quotes[i].role[lang] = e.target.value;
                  })
                }
              />
              <Field
                label="Initials"
                value={q.initials}
                onChange={(e) =>
                  commit((d) => {
                    d.quotes[i].initials = e.target.value;
                  })
                }
              />
              <div />
              <Field
                label="Quote"
                textarea
                span2
                dir={dir}
                value={q.text?.[lang]}
                onChange={(e) =>
                  commit((d) => {
                    d.quotes[i].text[lang] = e.target.value;
                  })
                }
              />
            </div>
          </Card>
        ))}
        <AddBtn
          label="+ Add testimonial"
          onClick={() =>
            commit((d) => {
              d.quotes.push({
                id: uid("q"),
                initials: "",
                name: { en: "", ar: "" },
                role: { en: "", ar: "" },
                text: { en: "", ar: "" },
              });
            })
          }
        />
      </>
    );
  }

  function renderLinks() {
    const fields = [
      ["github", "GitHub"],
      ["linkedin", "LinkedIn"],
      ["email", "Email"],
      ["facebook", "Facebook"],
      ["instagram", "Instagram"],
      ["tiktok", "TikTok"],
      ["youtube", "YouTube"],
    ];
    return (
      <Card title="Social & contact links">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {fields.map(([key, label]) => (
            <Field
              key={key}
              label={label}
              dir="ltr"
              value={data.links?.[key]}
              onChange={(e) =>
                commit((d) => {
                  d.links[key] = e.target.value;
                })
              }
            />
          ))}
        </div>
      </Card>
    );
  }

  function renderBudget() {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <Card title="Budget ranges">
          <p style={{ margin: 0, fontSize: 13, color: TEXT2, fontFamily: FONT_B }}>
            Options shown in the contact form budget dropdown.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {(data.budgets || []).map((b, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "end" }}>
                <div style={{ flex: 1 }}>
                  <Field
                    label={i === 0 ? (isAr ? "Arabic" : "English") : ""}
                    dir={dir}
                    value={b[lang]}
                    onChange={(e) =>
                      commit((d) => {
                        d.budgets[i][lang] = e.target.value;
                      })
                    }
                  />
                </div>
                <RemoveBtn
                  onClick={() =>
                    commit((d) => {
                      d.budgets.splice(i, 1);
                    })
                  }
                />
              </div>
            ))}
            <AddBtn
              label="+ Add range"
              onClick={() =>
                commit((d) => {
                  d.budgets.push({ en: "", ar: "" });
                })
              }
            />
          </div>
        </Card>
        <Card title="Project types">
          <p style={{ margin: 0, fontSize: 13, color: TEXT2, fontFamily: FONT_B }}>
            Options shown in the contact form project-type dropdown.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {(data.types || []).map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "end" }}>
                <div style={{ flex: 1 }}>
                  <Field
                    label={i === 0 ? (isAr ? "Arabic" : "English") : ""}
                    dir={dir}
                    value={t[lang]}
                    onChange={(e) =>
                      commit((d) => {
                        d.types[i][lang] = e.target.value;
                      })
                    }
                  />
                </div>
                <RemoveBtn
                  onClick={() =>
                    commit((d) => {
                      d.types.splice(i, 1);
                    })
                  }
                />
              </div>
            ))}
            <AddBtn
              label="+ Add type"
              onClick={() =>
                commit((d) => {
                  d.types.push({ en: "", ar: "" });
                })
              }
            />
          </div>
        </Card>
      </div>
    );
  }

  const tabInfo = TABS.find((t) => t.key === tab) || TABS[0];

  const content = {
    content: renderContent,
    photos: renderPhotos,
    projects: renderProjects,
    team: renderTeam,
    testimonials: renderTestimonials,
    links: renderLinks,
    budget: renderBudget,
  };

  return (
    <>
      <style>{`
        @media (max-width: 900px) {
          .ha-dash-wrap { flex-direction: column !important; }
          .ha-dash-side { width: 100% !important; height: auto !important; position: relative !important; flex-direction: row !important; overflow-x: auto !important; padding: 12px !important; }
          .ha-dash-side-nav { flex-direction: row !important; gap: 6px !important; }
          .ha-dash-side-bottom { flex-direction: row !important; margin-top: 0 !important; }
          .ha-dash-main { padding: 16px !important; }
        }
      `}</style>
      <div
        className="ha-dash-wrap"
        style={{
          display: "flex",
          minHeight: "100vh",
          background: BG,
          fontFamily: FONT_B,
          color: TEXT,
        }}
      >
        <aside
          className="ha-dash-side"
          style={{
            width: 252,
            background: CARD,
            borderRight: `1px solid ${BORDER}`,
            padding: "24px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
            position: "sticky",
            top: 0,
            height: "100vh",
            boxSizing: "border-box",
            overflowY: "auto",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 11,
                background: ACCENT,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: FONT_H,
                fontWeight: 800,
                fontSize: 16,
                color: "#101418",
                flexShrink: 0,
              }}
            >
              HA
            </div>
            <span style={{ fontFamily: FONT_H, fontWeight: 600, fontSize: 15, color: TEXT }}>
              Control room
            </span>
          </div>
          <nav className="ha-dash-side-nav" style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
            {TABS.map((t) => {
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "9px 14px",
                    borderRadius: 11,
                    border: "none",
                    cursor: "pointer",
                    background: active ? ACCENT : "transparent",
                    color: active ? "#101418" : TEXT2,
                    fontFamily: FONT_B,
                    fontSize: 14,
                    fontWeight: active ? 600 : 400,
                    transition: "all .2s",
                    whiteSpace: "nowrap",
                  }}
                >
                  {t.label}
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      background: active ? "rgba(0,0,0,.15)" : "rgba(255,255,255,.06)",
                      borderRadius: 7,
                      padding: "2px 7px",
                      minWidth: 18,
                      textAlign: "center",
                    }}
                  >
                    {badge(data, t.key)}
                  </span>
                </button>
              );
            })}
          </nav>
          <div className="ha-dash-side-bottom" style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
            <a
              href="/"
              style={{
                color: TEXT2,
                fontSize: 13,
                fontFamily: FONT_B,
                textDecoration: "none",
                padding: "8px 14px",
                borderRadius: 9,
                transition: "color .2s",
              }}
            >
              Open the site
            </a>
            <button
              onClick={() => commit((d) => Object.assign(d, JSON.parse(JSON.stringify(DEFAULTS))))}
              style={{
                background: "transparent",
                color: "#EF4444",
                border: `1px solid rgba(239,68,68,.25)`,
                borderRadius: 9,
                padding: "8px 14px",
                fontSize: 13,
                fontFamily: FONT_B,
                cursor: "pointer",
              }}
            >
              Reset to defaults
            </button>
          </div>
        </aside>
        <main className="ha-dash-main" style={{ flex: 1, padding: "32px 36px", overflowY: "auto", maxHeight: "100vh", boxSizing: "border-box" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 28,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div>
              <h1 style={{ margin: 0, fontSize: 22, fontFamily: FONT_H, color: TEXT }}>{tabInfo.label}</h1>
              <p style={{ margin: "4px 0 0", fontSize: 13, color: TEXT2, fontFamily: FONT_B }}>
                {SUBS[tab]}
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span
                style={{
                  fontSize: 12,
                  fontFamily: FONT_B,
                  color: ACCENT,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: ACCENT, display: "inline-block" }} />
                Saved
              </span>
              <div
                style={{
                  display: "flex",
                  background: BG,
                  borderRadius: 11,
                  border: `1px solid ${BORDER}`,
                  overflow: "hidden",
                }}
              >
                {["en", "ar"].map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    style={{
                      padding: "6px 16px",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: FONT_B,
                      fontSize: 13,
                      fontWeight: lang === l ? 600 : 400,
                      background: lang === l ? ACCENT : "transparent",
                      color: lang === l ? "#101418" : TEXT2,
                      transition: "all .2s",
                    }}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {content[tab]?.()}
          </div>
        </main>
      </div>
    </>
  );
}
