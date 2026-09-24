import { useEffect, useMemo, useRef, useState } from "react";
import projects from "../../data/projects";
import SfSymbol from "../ui/SfSymbol";

const normalize = (value) =>
  value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export default function Spotlight({
  language,
  isLight,
  focusMode,
  open,
  onClose,
  onLanguage,
  onTheme,
  onFocus,
}) {
  const inputRef = useRef(null);
  const shellRef = useRef(null);
  const dragRef = useRef(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [position, setPosition] = useState(null);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("cristian.silvadk22@gmail.com");
    } catch {}
  };

  const goTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const items = useMemo(() => {
    const pt = language === "pt";
    const sections = [
      ["work", pt ? "No que estou trabalhando" : "What I’m working on", pt ? "Seção" : "Section"],
      ["about", pt ? "Sobre mim" : "About me", pt ? "Seção" : "Section"],
      ["side-projects", pt ? "Projetinhos pessoais" : "Side projects", pt ? "Seção" : "Section"],
      ["journey", pt ? "Trajetória profissional" : "Professional journey", pt ? "Seção" : "Section"],
    ].map(([id, label, category]) => ({ id: `section-${id}`, label, category, keywords: id, run: () => goTo(id) }));

    const projectItems = projects.map((project) => ({
      id: `project-${project.id}`,
      label: project.name,
      category: pt ? "Projeto" : "Project",
      keywords: `${project.id} ${project.tech.join(" ")}`,
      run: () => goTo("side-projects"),
    }));

    const experience = ["Mercado Livre", "levva", "IBM", "Mackenzie"].map((label) => ({
      id: `experience-${label}`,
      label,
      category: pt ? "Experiência" : "Experience",
      keywords: label,
      run: () => goTo("journey"),
    }));

    const actions = [
      { id: "theme", label: pt ? `Usar modo ${isLight ? "escuro" : "claro"}` : `Use ${isLight ? "dark" : "light"} mode`, category: pt ? "Ação" : "Action", keywords: "tema theme light dark", run: onTheme },
      { id: "language", label: pt ? "Mudar para English" : "Mudar para Português", category: pt ? "Ação" : "Action", keywords: "idioma language portugues english", run: onLanguage },
      { id: "focus", label: pt ? `${focusMode ? "Desativar" : "Ativar"} modo foco` : `${focusMode ? "Disable" : "Enable"} focus mode`, category: pt ? "Ação" : "Action", keywords: "foco focus", run: onFocus },
      { id: "resume", label: pt ? "Abrir currículo" : "Open résumé", category: pt ? "Documento" : "Document", keywords: "curriculo resume cv", run: () => window.open(`${import.meta.env.BASE_URL}assets/cristian-macedo-resume.pdf`, "_blank", "noopener") },
      { id: "email", label: pt ? "Copiar email" : "Copy email", category: pt ? "Contato" : "Contact", keywords: "email contato contact", run: copyEmail },
      { id: "github", label: "GitHub", category: pt ? "Perfil" : "Profile", keywords: "codigo code repositorio", run: () => window.open("https://github.com/cristianmacedo", "_blank", "noopener") },
      { id: "linkedin", label: "LinkedIn", category: pt ? "Perfil" : "Profile", keywords: "trabalho career perfil", run: () => window.open("https://www.linkedin.com/in/cristian-macedo", "_blank", "noopener") },
    ];

    return [...sections, ...projectItems, ...experience, ...actions];
  }, [focusMode, isLight, language, onFocus, onLanguage, onTheme]);

  const results = useMemo(() => {
    const term = normalize(query.trim());
    if (!term) return [];
    return items.filter((item) => normalize(`${item.label} ${item.category} ${item.keywords}`).includes(term)).slice(0, 8);
  }, [items, query]);

  const hasQuery = Boolean(query.trim());
  const resultsHeight = Math.min((results.length || 1) * 45 + 15, 440);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActiveIndex(0);
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  useEffect(() => setActiveIndex(0), [query]);

  useEffect(() => {
    if (!open) return undefined;
    const close = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [onClose, open]);

  useEffect(() => {
    const keepInViewport = () => {
      if (!position || !shellRef.current) return;
      const rect = shellRef.current.getBoundingClientRect();
      setPosition({
        x: Math.min(Math.max(8, position.x), window.innerWidth - rect.width - 8),
        y: Math.min(Math.max(8, position.y), window.innerHeight - rect.height - 8),
      });
    };
    window.addEventListener("resize", keepInViewport);
    return () => window.removeEventListener("resize", keepInViewport);
  }, [position]);

  const run = (item) => {
    item.run();
    onClose();
  };

  const handleKeys = (event) => {
    if (!results.length) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((value) => (value + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((value) => (value - 1 + results.length) % results.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      run(results[activeIndex]);
    }
  };

  const startDrag = (event) => {
    if (!shellRef.current) return;
    const rect = shellRef.current.getBoundingClientRect();
    dragRef.current = {
      pointerId: event.pointerId,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      startX: event.clientX,
      startY: event.clientY,
      moved: false,
      actionId: event.target.closest("[data-spotlight-id]")?.dataset.spotlightId,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const drag = (event) => {
    if (!dragRef.current || dragRef.current.pointerId !== event.pointerId || !shellRef.current) return;
    const distance = Math.hypot(event.clientX - dragRef.current.startX, event.clientY - dragRef.current.startY);
    if (!dragRef.current.moved && distance < 4) return;
    dragRef.current.moved = true;
    const rect = shellRef.current.getBoundingClientRect();
    setPosition({
      x: Math.min(Math.max(8, event.clientX - dragRef.current.offsetX), window.innerWidth - rect.width - 8),
      y: Math.min(Math.max(8, event.clientY - dragRef.current.offsetY), window.innerHeight - rect.height - 8),
    });
  };

  const stopDrag = (event) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    const { actionId, moved } = dragRef.current;
    dragRef.current = null;
    if (!moved && actionId) {
      const item = results.find((candidate) => candidate.id === actionId);
      if (item) run(item);
    }
    requestAnimationFrame(() => inputRef.current?.focus({ preventScroll: true }));
  };

  if (!open) return null;

  return (
    <div
      className={`spotlight${hasQuery ? " has-results" : ""}${position ? " is-positioned" : ""}`}
      ref={shellRef}
      role="dialog"
      aria-label={language === "pt" ? "Busca do Spotlight" : "Spotlight Search"}
      style={position ? { left: position.x, top: position.y } : undefined}
      onPointerDown={(event) => {
        event.preventDefault();
        inputRef.current?.focus({ preventScroll: true });
        startDrag(event);
      }}
      onPointerMove={drag}
      onPointerUp={stopDrag}
      onPointerCancel={stopDrag}
    >
      <div className="spotlight-search">
        <span
          className="spotlight-drag-handle"
          aria-hidden="true"
        >
          <SfSymbol name="magnifyingglass" />
        </span>
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={handleKeys}
          placeholder={language === "pt" ? "Busca do Spotlight" : "Spotlight Search"}
          aria-label={language === "pt" ? "Busca do Spotlight" : "Spotlight Search"}
          role="combobox"
          aria-expanded={Boolean(results.length)}
          aria-controls="spotlight-results"
          aria-activedescendant={results[activeIndex] ? `spotlight-${results[activeIndex].id}` : undefined}
          autoComplete="off"
          onBlur={() => requestAnimationFrame(() => open && inputRef.current?.focus({ preventScroll: true }))}
        />
      </div>
      <div
        className={`spotlight-results${hasQuery ? " is-visible" : ""}`}
        id="spotlight-results"
        role="listbox"
        aria-hidden={!hasQuery}
        style={{ "--spotlight-results-height": `${resultsHeight}px` }}
      >
        {hasQuery && (
          <>
          {results.length ? results.map((item, index) => (
            <button
              id={`spotlight-${item.id}`}
              key={item.id}
              data-spotlight-id={item.id}
              type="button"
              role="option"
              aria-selected={index === activeIndex}
              className={index === activeIndex ? "active" : ""}
              tabIndex={-1}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={(event) => {
                if (event.detail === 0) run(item);
              }}
            >
              <span>{item.label}</span><small>{item.category}</small>
            </button>
          )) : <p>{language === "pt" ? "Nenhum resultado" : "No results"}</p>}
          </>
        )}
      </div>
    </div>
  );
}
