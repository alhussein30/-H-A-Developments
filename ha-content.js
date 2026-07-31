import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getFirestore, doc, setDoc, onSnapshot
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// ── Firebase config ─────────────────────────────────────────────────
// Replace with your own Firebase project credentials:
const firebaseConfig = {
  apiKey:            "AIzaSyDupbwagCiP12m1ECTgOzpk8ARGXC1HYHk",
  authDomain:        "ha-development-9320c.firebaseapp.com",
  projectId:         "ha-development-9320c",
  storageBucket:     "ha-development-9320c.firebasestorage.app",
  messagingSenderId: "777481007131",
  appId:             "1:777481007131:web:81f214968c2abdd12988be",
  measurementId:     "G-2VWQK9RYP2"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);
const DOC = doc(db, "site", "content");

const LS_KEY = "ha-site-content";

// ── Defaults ────────────────────────────────────────────────────────

export const DEFAULTS = {
  hero: {
    en: {
      title: "We build software that grows businesses.",
      sub: "Scalable web applications, enterprise systems and AI-powered products — architected end to end, shipped fast, engineered to last.",
      cta1: "Start your project",
      cta2: "View portfolio"
    },
    ar: {
      title: "نبني برمجيات تُنمّي الأعمال.",
      sub: "تطبيقات ويب قابلة للتوسّع، وأنظمة مؤسسية، ومنتجات مدعومة بالذكاء الاصطناعي — نهندسها من الفكرة حتى الإطلاق، بسرعة وبمتانة تدوم.",
      cta1: "ابدأ مشروعك",
      cta2: "شاهد أعمالنا"
    }
  },
  about: {
    en: {
      title: "Building software with precision.",
      body: "H&A Developments pairs frontend craft with serious backend engineering. We take products from first sketch to production deployment — no handoffs, no translation loss between design and infrastructure.",
      body2: "Startups use us to launch faster than a full in-house team allows. Established businesses use us to modernise systems that have outgrown their architecture."
    },
    ar: {
      title: "نبني البرمجيات بدقة.",
      body: "إتش آند إيه للتطوير تجمع بين إتقان الواجهات وهندسة خلفية جادة. نأخذ المنتج من أول رسم تخطيطي حتى النشر في الإنتاج — دون تسليمات وسيطة ودون فقدان المعنى بين التصميم والبنية التحتية.",
      body2: "تعتمد علينا الشركات الناشئة للانطلاق أسرع مما يتيحه فريق داخلي كامل، وتعتمد علينا الشركات القائمة لتحديث أنظمة تجاوزت حدود بنيتها الحالية."
    }
  },
  stats: [
    { v: "20+", en: "Projects shipped end to end", ar: "مشروعًا مكتملًا من البداية للنهاية" },
    { v: "100%", en: "Responsive, accessible builds", ar: "واجهات متجاوبة وسهلة الوصول" },
    { v: "9", en: "Core engineering services", ar: "خدمات هندسية أساسية" },
    { v: "24h", en: "Average response time", ar: "متوسط زمن الاستجابة" }
  ],
  projects: [
    {
      id: "jurista", slot: "work-jurista", year: "2025",
      name:     { en: "Jurista", ar: "Jurista" },
      kind:     { en: "Legal services platform", ar: "منصة خدمات قانونية" },
      desc:     { en: "A modern platform connecting clients with legal professionals — case intake, document handling and consultation booking in one clean flow.", ar: "منصة حديثة تربط العملاء بالمحترفين القانونيين — استقبال القضايا وإدارة المستندات وحجز الاستشارات في مسار واحد واضح." },
      long:     { en: "Jurista replaces the paperwork-first experience of traditional legal services with a guided digital flow. Clients describe their case, get matched to the right professional, and manage documents and consultations from a single dashboard. The interface was built for people under stress: plain language, obvious next steps, and no dead ends.", ar: "تستبدل Jurista تجربة الأوراق التقليدية بمسار رقمي موجَّه. يصف العميل قضيته، فيُوصَل بالمحترف المناسب، ويدير مستنداته واستشاراته من لوحة واحدة. صُمّمت الواجهة لأشخاص تحت الضغط: لغة واضحة، وخطوات تالية بديهية، وبلا طرق مسدودة." },
      role:     { en: "Design + build", ar: "تصميم وتطوير" },
      timeline: { en: "14 weeks", ar: "14 أسبوعًا" },
      status:   { en: "Live", ar: "مُطلق" },
      tags: ["React", "Responsive", "Clean UI"],
      stack: ["React", "JavaScript", "Tailwind CSS", "REST API", "Responsive design"]
    },
    {
      id: "yaqtin", slot: "work-yaqtin", year: "2024",
      name:     { en: "Al-Yaqtin Bookstore", ar: "مكتبة اليقطين" },
      kind:     { en: "E-commerce", ar: "تجارة إلكترونية" },
      desc:     { en: "An online bookstore with fast browsing, a smooth cart and a reading-first product page that makes discovery feel effortless.", ar: "مكتبة إلكترونية بتصفّح سريع وسلة سلسة وصفحة منتج تضع تجربة القراءة أولًا." },
      long:     { en: "Al-Yaqtin is a bilingual online bookstore built around discovery. Browsing stays instant thanks to client-side filtering, the cart persists across sessions, and product pages lead with the reading experience — excerpt, format, and availability — instead of a wall of metadata.", ar: "مكتبة اليقطين متجر كتب ثنائي اللغة مبني حول الاكتشاف. يبقى التصفّح فوريًا بفضل التصفية من جهة العميل، وتُحفظ السلة بين الجلسات، وتبدأ صفحة المنتج بتجربة القراءة — مقتطف، وصيغة، وتوافر — بدل جدار من البيانات." },
      role:     { en: "Frontend build", ar: "تطوير الواجهة" },
      timeline: { en: "9 weeks", ar: "9 أسابيع" },
      status:   { en: "Live", ar: "مُطلق" },
      tags: ["React", "Interactive UX", "Responsive"],
      stack: ["React", "State management", "Tailwind CSS", "Responsive design", "Arabic + English"]
    }
  ],
  soon: [
    { id: "s1", name: { en: "Enterprise support portal", ar: "بوابة دعم للمؤسسات" }, desc: { en: "Ticketing, SLA tracking and reporting for a regional operations team.", ar: "تذاكر ومتابعة اتفاقيات الخدمة وتقارير لفريق عمليات إقليمي." } },
    { id: "s2", name: { en: "AI operations assistant", ar: "مساعد عمليات بالذكاء الاصطناعي" }, desc: { en: "An agentic layer over internal tooling — drafting, triage and summaries.", ar: "طبقة وكلاء فوق الأدوات الداخلية — صياغة وفرز وتلخيص." } }
  ],
  team: [
    {
      id: "hussein", slot: "team-hussein",
      name:  { en: "Hussein Salah", ar: "حسين صلاح" },
      role:  { en: "Frontend Engineer", ar: "مهندس واجهات أمامية" },
      bio:   { en: "Builds the layer your users actually touch — component architecture, motion, and interfaces that hold up on every screen size.", ar: "يبني الطبقة التي يلمسها المستخدم فعليًا — معمارية المكوّنات، والحركة، وواجهات تصمد على كل مقاس شاشة." },
      skills: ["React", "JavaScript", "Tailwind CSS", "UI/UX", "Responsive design", "Animations"]
    },
    {
      id: "abdelrahman", slot: "team-abdelrahman",
      name:  { en: "Abdelrahman Alaa", ar: "عبدالرحمن علاء" },
      role:  { en: "Backend Engineer", ar: "مهندس خلفية" },
      bio:   { en: "Builds the layer that keeps it standing — APIs, data models, cloud infrastructure and the AI integrations on top.", ar: "يبني الطبقة التي تُبقي كل شيء واقفًا — واجهات البرمجة، ونماذج البيانات، والبنية السحابية، ودمج الذكاء الاصطناعي فوقها." },
      skills: ["Ruby on Rails", "REST APIs", "PostgreSQL", "Azure", "System design", "AI integration", "Authentication"]
    }
  ],
  quotes: [
    { id: "q1", initials: "LH", name: { en: "Layla Haddad", ar: "ليلى حداد" }, role: { en: "Founder, legal tech startup", ar: "مؤسِّسة، شركة تقنية قانونية" }, text: { en: "They shipped in ten weeks what our previous agency quoted six months for — and the code was clean enough for our own team to extend.", ar: "أنجزوا خلال عشرة أسابيع ما قدّرته الوكالة السابقة بستة أشهر — وبكود نظيف بما يكفي ليكمله فريقنا الداخلي." } },
    { id: "q2", initials: "ON", name: { en: "Omar Nassar", ar: "عمر نصار" }, role: { en: "Operations lead, retail group", ar: "مدير عمليات، مجموعة تجزئة" }, text: { en: "The backend held up on launch day without a single incident. Query times stayed flat as our catalogue tripled.", ar: "صمدت الخلفية يوم الإطلاق دون أي عُطل واحد، وبقيت أزمنة الاستعلام ثابتة رغم تضاعف الكتالوج ثلاث مرات." } },
    { id: "q3", initials: "SM", name: { en: "Sara Mansour", ar: "سارة منصور" }, role: { en: "Product manager, SaaS", ar: "مديرة منتج، شركة SaaS" }, text: { en: "Rare to find a team that treats design and infrastructure with equal seriousness. Everything arrived finished, not almost-finished.", ar: "نادرًا ما تجد فريقًا يتعامل مع التصميم والبنية التحتية بالجدية نفسها. كل شيء وصل مكتملًا لا شبه مكتمل." } }
  ],
  links: {
    github: "https://github.com/",
    linkedin: "https://linkedin.com/in/",
    email: "hello@ha-dev.com",
    facebook: "",
    instagram: "",
    tiktok: "",
    youtube: ""
  },
  budgets: [
    { en: "Under $5k", ar: "أقل من 5 آلاف $" },
    { en: "$5k – $15k", ar: "5 – 15 ألف $" },
    { en: "$15k – $40k", ar: "15 – 40 ألف $" },
    { en: "$40k+", ar: "أكثر من 40 ألف $" },
    { en: "Not sure yet", ar: "لم أحدد بعد" }
  ],
  types: [
    { en: "Web application", ar: "تطبيق ويب" },
    { en: "Full stack product", ar: "منتج متكامل" },
    { en: "API / backend", ar: "واجهات برمجية / خلفية" },
    { en: "AI integration", ar: "دمج ذكاء اصطناعي" },
    { en: "UI/UX design", ar: "تصميم واجهات" },
    { en: "Maintenance", ar: "صيانة ودعم" }
  ]
};

// ── Helpers ──────────────────────────────────────────────────────────

export function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function uid(prefix) {
  return prefix + "-" + Math.random().toString(36).slice(2, 9);
}

// ── Persistence (Firebase + localStorage fallback) ──────────────────

let _cache = null;

function toLS(data) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch {}
}

function fromLS() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function load() {
  return _cache || fromLS();
}

export async function save(data) {
  _cache = data;
  toLS(data);
  window.dispatchEvent(new CustomEvent("ha-content-change"));

  try {
    await setDoc(DOC, data);
  } catch (err) {
    console.warn("[ha-content] Firebase write failed, data saved locally:", err);
  }
}

// ── Real-time sync ──────────────────────────────────────────────────
// Firestore listener keeps every open tab (Control Room + live site)
// in sync automatically. Falls back to localStorage events for offline.

let _unsubscribe = null;

function startSync() {
  if (_unsubscribe) return;
  try {
    _unsubscribe = onSnapshot(DOC, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        _cache = data;
        toLS(data);
        window.dispatchEvent(new CustomEvent("ha-content-change"));
      }
    }, (err) => {
      console.warn("[ha-content] Firestore listener error:", err);
    });
  } catch (err) {
    console.warn("[ha-content] Could not start Firestore sync:", err);
  }
}

startSync();
