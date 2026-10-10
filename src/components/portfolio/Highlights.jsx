import { useRef, useState } from "react";
import BrandIcon from "../ui/BrandIcon";
import LocalClock from "./LocalClock";

const hasContent = ({ title, detail }) =>
  Boolean(title.trim() || detail.trim());

function setCaretToEnd(element) {
  const range = document.createRange();
  const selection = window.getSelection();
  range.selectNodeContents(element);
  range.collapse(false);
  selection?.removeAllRanges();
  selection?.addRange(range);
}

function readEditor(element) {
  const title = element.querySelector("b")?.textContent ?? "";
  const text = element.textContent ?? "";
  return {
    title: title.slice(0, 64),
    detail: text.slice(title.length).trimStart().slice(0, 96),
  };
}

export default function Highlights({ t }) {
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
  const draftRef = useRef(null);
  const items = [
    ...defaults.map((item) => ({ ...item, ...edits[item.id] })),
    ...customItems.filter(hasContent),
  ].sort((a, b) => a.position - b.position);

  const toggle = (id) =>
    setCompleted((value) => ({ ...value, [id]: !value[id] }));
  const updateItem = (item, changes) => {
    if (item.id.startsWith("custom-")) {
      setCustomItems((current) =>
        current.map((candidate) =>
          candidate.id === item.id ? { ...candidate, ...changes } : candidate,
        ),
      );
      return;
    }
    setEdits((current) => ({
      ...current,
      [item.id]: { ...current[item.id], ...changes },
    }));
  };
  const removeCustomItem = (id) => {
    setCustomItems((current) => current.filter((item) => item.id !== id));
    setCompleted((current) => {
      const { [id]: _, ...remaining } = current;
      return remaining;
    });
  };
  const addDraftItem = (detail) => {
    const content = detail.trim().slice(0, 160);
    if (!content) return;
    const id = `custom-${crypto.randomUUID()}`;
    setCustomItems((current) => [
      ...current,
      {
        id,
        title: "",
        detail: content,
        position: Math.max(3, ...current.map((item) => item.position)) + 1,
      },
    ]);
    setCompleted((value) => ({ ...value, [id]: false }));
  };
  const restoreEditor = (element, item) => {
    element.replaceChildren();
    if (item.title) {
      const emphasis = document.createElement("b");
      emphasis.textContent = item.title;
      element.append(emphasis);
    }
    if (item.title && item.detail) element.append(" ");
    if (item.detail) element.append(item.detail);
  };
  const commitItem = (item, element) => {
    const changes = readEditor(element);
    if (!hasContent(changes)) {
      if (item.id.startsWith("custom-")) removeCustomItem(item.id);
      else restoreEditor(element, item);
      return false;
    }
    updateItem(item, changes);
    return true;
  };
  const handleItemEnter = (event, item) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    commitItem(item, event.currentTarget);
    requestAnimationFrame(() => draftRef.current?.focus());
  };
  const commitDraft = (element) => {
    const detail = element.textContent ?? "";
    if (!detail.trim()) return;
    addDraftItem(detail);
    element.replaceChildren();
  };

  return (
    <section className="proof-strip reminders-widget" aria-label={t.highlightsLabel}>
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
              <span className={`reminder-check${completed[item.id] ? " is-complete" : ""}`} aria-hidden="true" />
            </button>
            <div
              className="reminder-copy"
              contentEditable
              suppressContentEditableWarning
              role="textbox"
              aria-multiline="false"
              aria-label={`${item.title} ${item.detail}`.trim() || t.newReminder}
              data-placeholder={t.newReminder}
              onFocus={(event) => requestAnimationFrame(() => setCaretToEnd(event.currentTarget))}
              onClick={(event) => requestAnimationFrame(() => setCaretToEnd(event.currentTarget))}
              onKeyDown={(event) => handleItemEnter(event, item)}
              onBlur={(event) => commitItem(item, event.currentTarget)}
            >
              {item.title && <b>{item.title}</b>}
              {item.title && item.detail ? " " : ""}
              {item.detail}
            </div>
          </li>
        ))}
        <li className="reminder-draft">
          <span className="reminder-toggle" aria-hidden="true"><span className="reminder-check" /></span>
          <div
            ref={draftRef}
            className="reminder-copy"
            contentEditable
            suppressContentEditableWarning
            role="textbox"
            aria-multiline="false"
            aria-label={t.newReminder}
            data-placeholder={t.newReminder}
            onKeyDown={(event) => {
              if (event.key !== "Enter") return;
              event.preventDefault();
              commitDraft(event.currentTarget);
            }}
            onBlur={(event) => commitDraft(event.currentTarget)}
          />
        </li>
      </ul>
    </section>
  );
}

function SocialApps() {
  return (
    <nav className="social-apps" aria-label="Social profiles">
      <a
        className="social-app social-app-github"
        href="https://github.com/cristianmacedo"
        target="_blank"
        rel="noopener"
        aria-label="GitHub"
      >
        <BrandIcon name="github" />
      </a>
      <a
        className="social-app social-app-linkedin"
        href="https://www.linkedin.com/in/cristianmacedo"
        target="_blank"
        rel="noopener"
        aria-label="LinkedIn"
      >
        <BrandIcon name="linkedin" />
      </a>
    </nav>
  );
}

export function HighlightsRail({ t }) {
  return <><Highlights t={t} /><SocialApps /><LocalClock t={t} /></>;
}
