import { useEffect, useRef, useState } from "react";
import translations from "./translations.json";
import SystemBar from "./components/system/SystemBar";
import SfSymbol from "./components/SfSymbol";
import BrandIcon from "./components/BrandIcon";

const FRAME_IDS = [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12];

function readStorage(key, fallback) {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

function Rich({ as: Tag = "span", html, ...props }) {
  return <Tag {...props} dangerouslySetInnerHTML={{ __html: html }} />;
}

function Hero({ t }) {
  return (
    <section className="hero card">
      <div className="hero-copy">
        <Rich as="h1" html={t.heroTitle} />
        <p className="intro">{t.heroIntro}</p>
        <a className="primary" href="#journey">
          <span>{t.seeJourney}</span>
          <SfSymbol name="arrow.down" />
        </a>
        <a
          className="text-link"
          href={`${import.meta.env.BASE_URL}assets/cristian-macedo-resume.pdf`}
          target="_blank"
          rel="noopener"
        >
          {t.resume}
        </a>
      </div>
      <div className="portrait">
        <div className="orbit" />
        <span className="portrait-sprite" role="img" aria-label={t.avatarAlt} />
        <span className="portrait-note">
          <span>{t.hello}</span>
          <SfSymbol name="asterisk" />
        </span>
      </div>
      <div className="hero-bottom">
        <span>{t.based}</span>
        <span>
          React <i>·</i> TypeScript <i>·</i> Microfrontends
        </span>
      </div>
    </section>
  );
}

function FocusIcon() {
  return (
    <span className="focus-icon" aria-hidden="true">
      <SfSymbol name="person.text.rectangle" />
    </span>
  );
}

function ControlPanel({
  t,
  language,
  isLight,
  focusMode,
  onLanguage,
  onTheme,
  onFocus,
}) {
  return (
    <aside className="top-widgets" aria-label="Quick controls">
      <div className="control-grid" aria-label="Quick controls">
        <button
          className="language control-tile"
          type="button"
          onClick={onLanguage}
          aria-label={t.languageLabel}
          title="Language"
        >
          <span className="control-icon">文A</span>
          <span className="sr-only">{language === "pt" ? "EN" : "PT"}</span>
        </button>
        <button
          className="theme control-tile"
          type="button"
          onClick={onTheme}
          aria-label={t[isLight ? "themeDark" : "themeLight"]}
          title={t[isLight ? "themeDark" : "themeLight"]}
        >
          <span className="control-icon">◐</span>
          <span className="sr-only">
            {t[isLight ? "themeValueLight" : "themeValueDark"]}
          </span>
        </button>
        <a
          className="control-tile"
          href="https://github.com/cristianmacedo"
          target="_blank"
          rel="noopener"
          aria-label="GitHub"
          title="GitHub"
        >
          <BrandIcon name="github" />
        </a>
        <a
          className="control-tile linkedin-control"
          href="https://www.linkedin.com/in/cristian-macedo"
          target="_blank"
          rel="noopener"
          aria-label="LinkedIn"
          title="LinkedIn"
        >
          <BrandIcon name="linkedin" />
        </a>
      </div>
      <button
        className="focus-toggle"
        type="button"
        aria-pressed={focusMode}
        aria-label={t[focusMode ? "focusDisable" : "focusEnable"]}
        title={t[focusMode ? "focusDisable" : "focusEnable"]}
        onClick={onFocus}
      >
        <span className="focus-badge" aria-hidden="true">
          −
        </span>
        <FocusIcon />
        <span className="focus-copy">
          <strong>{t.focusTitle}</strong>
          <small>{t[focusMode ? "focusStatusOn" : "focusStatusOff"]}</small>
        </span>
      </button>
      <Highlights t={t} />
    </aside>
  );
}

function HighlightsRail({ t }) {
  return (
    <aside className="top-widgets" aria-label={t.highlightsLabel}>
      <Highlights t={t} />
    </aside>
  );
}

function Highlights({ t }) {
  const defaults = [
    { id: "years", title: "7+", detail: t.years, position: 1 },
    { id: "big-techs", title: t.bigTechsMark, detail: t.bigTechs, position: 2 },
    {
      id: "seniority",
      title: t.seniorityMark,
      detail: t.leadershipRange,
      position: 3,
    },
  ];
  const [completed, setCompleted] = useState({
    years: true,
    "big-techs": true,
    seniority: true,
  });
  const [customItems, setCustomItems] = useState([]);
  const [edits, setEdits] = useState({});
  const [pendingFocus, setPendingFocus] = useState(null);
  const inputRefs = useRef(new Map());
  const items = [
    ...defaults.map((item) => ({ ...item, ...edits[item.id] })),
    ...customItems,
  ].sort((a, b) => a.position - b.position);

  useEffect(() => {
    if (!pendingFocus) return;
    const input = inputRefs.current.get(pendingFocus);
    input?.focus();
    input?.setSelectionRange(0, input.value.length);
    setPendingFocus(null);
  }, [customItems, pendingFocus]);

  const toggle = (id) =>
    setCompleted((value) => ({ ...value, [id]: !value[id] }));
  const updateItem = (item, field, value) => {
    if (item.id.startsWith("custom-")) {
      setCustomItems((current) =>
        current.map((candidate) =>
          candidate.id === item.id
            ? { ...candidate, [field]: value }
            : candidate,
        ),
      );
      return;
    }
    setEdits((current) => ({
      ...current,
      [item.id]: { ...current[item.id], [field]: value },
    }));
  };
  const addAfter = (item) => {
    const index = items.findIndex((candidate) => candidate.id === item.id);
    const nextPosition = items[index + 1]?.position;
    const position =
      nextPosition == null
        ? item.position + 1
        : (item.position + nextPosition) / 2;
    const id = `custom-${Date.now()}`;
    setCustomItems((value) => [
      ...value,
      { id, title: "", detail: "", position },
    ]);
    setCompleted((value) => ({ ...value, [id]: false }));
    setPendingFocus(id);
  };
  const handleEnter = (event, item) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    addAfter(item);
  };
  const moveCursorToEnd = (event) => {
    const input = event.currentTarget;
    requestAnimationFrame(() =>
      input.setSelectionRange(input.value.length, input.value.length),
    );
  };

  return (
    <section
      className="proof-strip reminders-widget"
      aria-label="Career highlights"
    >
      <div className="reminders-header">
        <div>
          <strong>{items.length}</strong>
          <span>{t.highlightsLabel}</span>
        </div>
        <span className="reminders-app-icon" aria-hidden="true" />
      </div>
      <ul className="reminders-list">
        {items.map((item) => (
          <li key={item.id}>
            <button
              className="reminder-toggle"
              type="button"
              aria-pressed={Boolean(completed[item.id])}
              aria-label={`${completed[item.id] ? t.unmarkReminder : t.markReminder}: ${item.title}`}
              onClick={() => toggle(item.id)}
            >
              <span
                className={`reminder-check${completed[item.id] ? " is-complete" : ""}`}
                aria-hidden="true"
              />
            </button>
            <div className="reminder-copy">
              <input
                ref={(node) =>
                  node
                    ? inputRefs.current.set(item.id, node)
                    : inputRefs.current.delete(item.id)
                }
                className="reminder-title-input"
                value={item.title}
                size={Math.max(1, item.title.length)}
                placeholder={t.newReminder}
                aria-label={item.title || t.newReminder}
                onChange={(event) =>
                  updateItem(item, "title", event.target.value)
                }
                onFocus={moveCursorToEnd}
                onClick={moveCursorToEnd}
                onKeyDown={(event) => handleEnter(event, item)}
                maxLength={64}
              />
              {item.detail && (
                <input
                  className="reminder-detail-input"
                  value={item.detail}
                  aria-label={item.detail}
                  onChange={(event) =>
                    updateItem(item, "detail", event.target.value)
                  }
                  onFocus={moveCursorToEnd}
                  onClick={moveCursorToEnd}
                  onKeyDown={(event) => handleEnter(event, item)}
                  maxLength={96}
                />
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SectionHeading({ id, title, caption }) {
  return (
    <div className="section-heading" id={id}>
      <h2>{title}</h2>
      <span>{caption}</span>
    </div>
  );
}

function WorkSection({ t, onDetails }) {
  return (
    <section className="work-section page-section" aria-labelledby="work">
      <SectionHeading
        id="work"
        title={t.selectedWork}
        caption={t.workCaption}
      />
      <div className="bento">
        <article className="card featured">
          <div className="card-top">
            <span className="eyebrow">{t.scaleLabel}</span>
            <span className="tag">Mercado Livre</span>
          </div>
          <Rich as="h3" html={t.foundationTitle} />
          <p>{t.foundationCopy}</p>
          <div className="work-scope">
            <div>
              <span>{t.scopeProduct}</span>
              <p>{t.scopeProductCopy}</p>
            </div>
            <div>
              <span>{t.scopePlatform}</span>
              <p>{t.scopePlatformCopy}</p>
            </div>
            <div>
              <span>{t.scopeTeam}</span>
              <p>{t.scopeTeamCopy}</p>
            </div>
          </div>
          <button className="card-link" onClick={onDetails}>
            <span>{t.insideWork}</span>
            <SfSymbol name="arrow.up.right" />
          </button>
        </article>
        <aside className="card now">
          <div className="card-top">
            <span className="eyebrow">{t.currentLabel}</span>
            <SfSymbol name="arrow.up.right" className="tiny-mark" />
          </div>
          <span className="bubble-label from-them">{t.currentQuestion}</span>
          <div className="message-wrap">
            <div className="message from-me">{t.currentMessage}</div>
          </div>
          <p>{t.currentCopy}</p>
          <div className="now-bottom">
            <span className="mini-icon">
              <SfSymbol name="command" />
            </span>
            <Rich html={t.currentFoot} />
          </div>
        </aside>
        <article className="card about" id="about">
          <span className="eyebrow">{t.aboutLabel}</span>
          <Rich as="h3" html={t.aboutTitle} />
          <p>{t.aboutCopy}</p>
          <div className="personal">
            <span>{t.outside}</span>
            <p>{t.outsideCopy}</p>
          </div>
        </article>
      </div>
    </section>
  );
}

const projects = [
  {
    id: "innerbilliards",
    name: "InnerBilliards",
    href: "https://github.com/cristianmacedo/innerbilliards",
    liveUrl: "https://innerbilliards.vercel.app",
    image: "innerbilliards-cover.png",
    category: "innerbilliardsCategory",
    tech: ["React", "Vite"],
    copy: "innerbilliardsCopy",
  },
  {
    id: "senalytics",
    name: "Senalytics",
    href: "https://github.com/cristianmacedo/senalytics",
    liveUrl: "https://senalytics.vercel.app",
    image: "senalytics-cover.png",
    category: "senalyticsCategory",
    tech: ["React", "TypeScript", "React Query", "Recharts"],
    copy: "senalyticsCopy",
    detail: "senalyticsDetail",
  },
  {
    id: "prettygit",
    name: "PrettyGit",
    href: "https://github.com/cristianmacedo/prettygit",
    image: "prettygit-cover.png",
    category: "prettygitCategory",
    tech: ["Browser Extension", "JavaScript", "GitHub"],
    copy: "prettygitCopy",
  },
  {
    id: "spendbox",
    name: "SpendBox",
    href: "https://github.com/cristianmacedo/spendbox",
    liveUrl: "https://spendbox.vercel.app",
    image: "spendbox-cover.png",
    category: "spendboxCategory",
    tech: ["Next.js", "Zustand", "Product UI"],
    copy: "spendboxShort",
  },
  {
    id: "ohnocoiner",
    name: "OhNoCoiner",
    href: "https://github.com/cristianmacedo/ohnocoiner",
    image: "ohnocoiner-cover.png",
    category: "ohnocoinerCategory",
    tech: ["React", "CoinDesk API", "Data"],
    copy: "ohnocoinerCopy",
  },
];

function ProjectDialog({ project, t, onClose }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (project && !dialog.open) dialog.showModal();
    if (!project && dialog.open) dialog.close();
  }, [project]);
  if (!project) return <dialog ref={dialogRef} />;
  return (
    <dialog
      className="project-dialog"
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
    >
      <button
        className="project-dialog-close"
        type="button"
        aria-label={t.closeProject}
        onClick={onClose}
      >
        <SfSymbol name="xmark" />
      </button>
      <div className="project-dialog-art">
        <img
          src={`${import.meta.env.BASE_URL}assets/projects/${project.image}`}
          alt=""
        />
      </div>
      <div className="project-dialog-copy">
        <span className="eyebrow">{t.personalProject}</span>
        <h2>{project.name}</h2>
        <p>{t[project.copy]}</p>
        {project.detail && (
          <p className="project-dialog-detail">{t[project.detail]}</p>
        )}
        <div className="project-dialog-tech">
          {project.tech.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <div className="project-dialog-actions">
          {project.liveUrl && (
            <a
              className="project-dialog-link project-dialog-live-link"
              href={project.liveUrl}
              target="_blank"
              rel="noopener"
            >
              <span>{t.viewProject}</span>
              <SfSymbol name="arrow.up.right" />
            </a>
          )}
          <a
            className="project-dialog-link"
            href={project.href}
            target="_blank"
            rel="noopener"
          >
            <span>{t.viewRepository}</span>
            <SfSymbol name="arrow.up.right" />
          </a>
        </div>
      </div>
    </dialog>
  );
}

function Projects({ t }) {
  const railRef = useRef(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const move = (direction) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector(".project-showcase-card");
    rail.scrollBy({
      left: direction * ((card?.offsetWidth || 300) + 18),
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };
  return (
    <section
      className="projects-section page-section"
      aria-labelledby="side-projects"
    >
      <SectionHeading
        id="side-projects"
        title={t.sideProjectsTitle}
        caption={t.sideProjectsCaption}
      />
      <div className="project-carousel-shell">
        <div
          className="project-carousel"
          ref={railRef}
          aria-label={t.projectsCarousel}
        >
          {projects.map((project) => (
            <article className="project-showcase-card" key={project.id}>
              <img
                src={`${import.meta.env.BASE_URL}assets/projects/${project.image}`}
                alt=""
                loading="lazy"
              />
              <div className="project-showcase-copy">
                <span>{t[project.category]}</span>
                <h3>{project.name}</h3>
                <p>{t[project.copy]}</p>
              </div>
              <button
                className="project-open"
                type="button"
                aria-label={`${t.openProject}: ${project.name}`}
                onClick={() => setSelectedProject(project)}
              >
                <SfSymbol name="plus" />
              </button>
            </article>
          ))}
        </div>
        <div
          className="project-carousel-controls"
          aria-label={t.carouselControls}
        >
          <button
            type="button"
            aria-label={t.previousProject}
            onClick={() => move(-1)}
          >
            <SfSymbol name="chevron.left" />
          </button>
          <button
            type="button"
            aria-label={t.nextProject}
            onClick={() => move(1)}
          >
            <SfSymbol name="chevron.right" />
          </button>
        </div>
      </div>
      <ProjectDialog
        project={selectedProject}
        t={t}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}

function TimelineEntry({
  date,
  duration,
  company,
  place,
  role,
  summary,
  bullets,
  tech,
  current,
  education,
}) {
  return (
    <li
      className={`timeline-item${current ? " current" : ""}${education ? " education-item" : ""}`}
    >
      <div className="timeline-date">
        <span>{date}</span>
        <small>{duration}</small>
      </div>
      <div className="timeline-dot" />
      <div className="timeline-content">
        <div className="timeline-company">
          <h3>{company}</h3>
          <span>{place}</span>
        </div>
        <h4>{role}</h4>
        <p>{summary}</p>
        {bullets && (
          <ul>
            {bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        )}
        {tech && (
          <div className="tech-list">
            {tech.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        )}
        {education && (
          <div className="education-note">
            <SfSymbol name="command" />
            <span>{education}</span>
          </div>
        )}
      </div>
    </li>
  );
}

function Journey({ t }) {
  const entries = [
    {
      date: t.dateMeli,
      duration: t.durationMeli,
      company: "Mercado Livre",
      place: t.meliPlace,
      role: t.meliRoles,
      summary: t.meliSummary,
      bullets: [t.meliOne, t.meliTwo, t.meliThree],
      tech: ["React", "TypeScript", "Go", "Microfrontends", "Design Systems"],
      current: true,
    },
    {
      date: "2021 — 2024",
      duration: t.durationLevva,
      company: "levva",
      place: t.remote,
      role: t.levvaRole,
      summary: t.levvaSummary,
      bullets: [t.levvaOne, t.levvaTwo, t.levvaThree],
      tech: ["React", "React Native", "Node.js", "Segment", "Amplitude"],
    },
    {
      date: "2018 — 2021",
      duration: t.durationIbm,
      company: "IBM",
      place: t.ibmPlace,
      role: t.ibmRoles,
      summary: t.ibmSummary,
      bullets: [t.ibmOne, t.ibmTwo, t.ibmThree],
      tech: ["React", "Carbon", "Storybook", "WCAG", "Performance"],
    },
    {
      date: "2018 — 2020",
      duration: t.degreeDate,
      company: t.university,
      place: "São Paulo",
      role: t.degree,
      summary: t.degreeCopy,
      education: t.educationNote,
    },
  ];
  return (
    <section className="journey-section page-section" aria-labelledby="journey">
      <SectionHeading
        id="journey"
        title={t.journeyTitle}
        caption={t.journeyCaption}
      />
      <section className="card timeline-card">
        <div className="timeline-intro">
          <span className="eyebrow">{t.timelineLabel}</span>
          <Rich as="h3" html={t.timelineHeading} />
          <p>{t.timelineIntro}</p>
        </div>
        <ol className="timeline">
          {entries.map((entry) => (
            <TimelineEntry key={entry.company} {...entry} />
          ))}
        </ol>
      </section>
    </section>
  );
}

function Utility({ t, language }) {
  const [copyStatus, setCopyStatus] = useState("");
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("cristian.silvadk22@gmail.com");
      setCopyStatus(t.copied);
    } catch {
      setCopyStatus("cristian.silvadk22@gmail.com");
    }
  };
  useEffect(() => setCopyStatus(""), [language]);
  return (
    <section className="utility-grid page-section">
      <article className="card approach">
        <span className="eyebrow">{t.thinkingLabel}</span>
        <SfSymbol name="asterisk" className="asterisk" />
        <Rich as="h3" html={t.thinkingTitle} />
        <p>{t.thinkingCopy}</p>
        <div className="ai-practice">
          <span>{t.aiLabel}</span>
          <p>{t.aiCopy}</p>
        </div>
      </article>
      <article className="card contact">
        <span className="eyebrow">{t.helloLabel}</span>
        <Rich as="h3" html={t.contactTitle} />
        <div className="contact-actions">
          <a href="mailto:cristian.silvadk22@gmail.com">{t.sendEmail}</a>
          <button
            id="copy"
            onClick={copyEmail}
            aria-label={t.copyLabel}
            title={t.copyLabel}
          >
            <SfSymbol name="doc.on.doc" />
          </button>
        </div>
        <p id="copy-status" role="status">
          {copyStatus}
        </p>
      </article>
    </section>
  );
}

function DetailDialog({ t, language, open, onClose }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);
  const content =
    language === "pt"
      ? {
          eyebrow: "EXPERIÊNCIA EM DESTAQUE / MERCADO LIVRE",
          title: "Produto, plataforma e responsabilidade técnica.",
          copy: "Trabalho em uma plataforma interna de gestão fiscal que suporta mais de US$ 3 bilhões em operações mensais no Brasil e na Argentina. Meu foco principal é frontend, mas o trabalho frequentemente chega a sistemas compartilhados e serviços em Go.",
          heading: "Onde contribuo",
          bullets: [
            "Componentes compartilhados: criei estruturas reutilizáveis adotadas além do produto principal.",
            "Microfrontends: liderei uma migração que permite aos times evoluir partes diferentes da plataforma de forma independente.",
            "Autorização: construí lógica compartilhada e apoiei a migração para um novo sistema de autenticação.",
            "Time: decisões técnicas, revisões, documentação, exemplos e mentoria.",
          ],
        }
      : {
          eyebrow: "SELECTED EXPERIENCE / MERCADO LIVRE",
          title: "Product, platform, and technical ownership.",
          copy: "I work on an internal tax management platform that supports more than $3B in monthly operations across Brazil and Argentina. My main focus is frontend, but the work often reaches shared systems and Go services.",
          heading: "Where I contribute",
          bullets: [
            "Shared components: created reusable foundations adopted beyond the core product.",
            "Microfrontends: led a migration that lets teams evolve different parts of the platform independently.",
            "Authorization: built shared logic and supported a migration to a new authentication system.",
            "Team: technical decisions, reviews, documentation, examples, and mentoring.",
          ],
        };
  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
    >
      <button className="close" aria-label="Close details" onClick={onClose}>
        <SfSymbol name="xmark" />
      </button>
      <div>
        <span className="eyebrow">{content.eyebrow}</span>
        <h2>{content.title}</h2>
        <p>{content.copy}</p>
        <h3>{content.heading}</h3>
        <ul>
          {content.bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="eyebrow">REACT · TYPESCRIPT · GO · MICROFRONTENDS</p>
      </div>
    </dialog>
  );
}

function useGlassReflection(dependencies) {
  useEffect(() => {
    const finePointer = matchMedia(
      "(pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    if (!finePointer.matches) return undefined;
    let frame = 0;
    const handle = (event) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        document
          .querySelectorAll(
            ".card, .proof-strip, .control-tile, .focus-toggle, .system-control, .control-center-focus",
          )
          .forEach((surface) => {
            const rect = surface.getBoundingClientRect();
            const angle =
              (Math.atan2(
                event.clientY - (rect.top + rect.height / 2),
                event.clientX - (rect.left + rect.width / 2),
              ) *
                180) /
                Math.PI +
              90;
            surface.style.setProperty(
              "--glass-angle",
              `${angle.toFixed(2)}deg`,
            );
          });
        frame = 0;
      });
    };
    document.addEventListener("pointermove", handle, { passive: true });
    return () => {
      document.removeEventListener("pointermove", handle);
      cancelAnimationFrame(frame);
    };
  }, dependencies);
}

function useActiveSection() {
  const [activeSection, setActiveSection] = useState("work");
  useEffect(() => {
    const sections = ["work", "side-projects", "journey", "about"]
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: "-12% 0px -66% 0px", threshold: [0, 0.2, 0.5] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  return activeSection;
}

export default function App() {
  const [language, setLanguage] = useState(() =>
    readStorage(
      "portfolio-language",
      navigator.language.toLowerCase().startsWith("pt") ? "pt" : "en",
    ),
  );
  const [isLight, setIsLight] = useState(() => {
    const stored = readStorage("portfolio-theme", "");
    return stored
      ? stored === "light"
      : matchMedia("(prefers-color-scheme: light)").matches;
  });
  const [focusMode, setFocusMode] = useState(
    () => readStorage("portfolio-focus", "false") === "true",
  );
  const [detailOpen, setDetailOpen] = useState(false);
  const activeSection = useActiveSection();
  const t = translations[language];

  useEffect(() => {
    document.documentElement.lang = language === "pt" ? "pt-BR" : "en";
    document.title =
      language === "pt"
        ? "Cristian Macedo — Engenheiro de Software"
        : "Cristian Macedo — Software Engineer";
    document.querySelector('meta[name="description"]').content =
      language === "pt"
        ? "Cristian Macedo — engenheiro de software frontend sênior atuando entre produto, microfrontends, backend e experiência de desenvolvimento."
        : "Cristian Macedo — senior frontend software engineer working across product, microfrontends, backend, and developer experience.";
    try {
      localStorage.setItem("portfolio-language", language);
    } catch {}
  }, [language]);

  useEffect(() => {
    document.body.classList.toggle("light", isLight);
    try {
      localStorage.setItem("portfolio-theme", isLight ? "light" : "dark");
    } catch {}
  }, [isLight]);

  useEffect(() => {
    document.body.classList.toggle("focus-mode", focusMode);
    try {
      localStorage.setItem("portfolio-focus", String(focusMode));
    } catch {}
  }, [focusMode]);

  useEffect(() => {
    FRAME_IDS.forEach((id) => {
      const image = new Image();
      image.src = `${import.meta.env.BASE_URL}assets/cristian-memoji-dark-to-light-transition-${id}.png`;
    });
  }, []);

  useGlassReflection([focusMode]);

  const changeTheme = () => {
    const nextLight = !isLight;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setIsLight(nextLight);
      return;
    }
    document.body.classList.add(
      "theme-transitioning",
      nextLight
        ? "theme-transitioning-to-light"
        : "theme-transitioning-to-dark",
    );
    setIsLight(nextLight);
    window.setTimeout(
      () =>
        document.body.classList.remove(
          "theme-transitioning",
          "theme-transitioning-to-light",
          "theme-transitioning-to-dark",
        ),
      680,
    );
  };

  const changeFocus = () => {
    const update = () => setFocusMode((value) => !value);
    if (
      !matchMedia("(prefers-reduced-motion: reduce)").matches &&
      document.startViewTransition
    )
      document.startViewTransition(update);
    else update();
  };

  return (
    <>
      <a className="skip" href="#work">
        {t.skip}
      </a>
      <SystemBar
        t={t}
        language={language}
        isLight={isLight}
        focusMode={focusMode}
        activeSection={activeSection}
        onLanguage={() =>
          setLanguage((value) => (value === "en" ? "pt" : "en"))
        }
        onTheme={changeTheme}
        onFocus={changeFocus}
      />
      <div className="shell">
        <main>
          <div className="top-grid">
            <Hero t={t} />
            <HighlightsRail t={t} />
          </div>
          <WorkSection t={t} onDetails={() => setDetailOpen(true)} />
          <Projects t={t} />
          <Journey t={t} />
          <Utility t={t} language={language} />
        </main>
        <footer>
          <span>© {new Date().getFullYear()} Cristian Macedo</span>
          <span className="footer-note">{t.footerNote}</span>
          <div>
            <a
              href="https://github.com/cristianmacedo"
              target="_blank"
              rel="noopener"
            >
              GitHub ↗
            </a>
            <a
              href="https://www.linkedin.com/in/cristian-macedo"
              target="_blank"
              rel="noopener"
            >
              LinkedIn ↗
            </a>
          </div>
        </footer>
      </div>
      <DetailDialog
        t={t}
        language={language}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
      />
    </>
  );
}
