import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import translations from "./translations.json";
import Hero from "./components/portfolio/Hero";
import WorkSection from "./components/portfolio/WorkSection";
import Projects from "./components/portfolio/Projects";
import Journey from "./components/portfolio/Journey";
import Utility from "./components/portfolio/Utility";
import DetailDialog from "./components/portfolio/DetailDialog";
import { HighlightsRail } from "./components/portfolio/Highlights";
import SystemBar from "./components/system/SystemBar";
import TerminalWindow from "./components/system/TerminalWindow";
import { WindowManagerProvider } from "./components/system/WindowManager";
import useActiveSection from "./hooks/useActiveSection";
import useGlassReflection from "./hooks/useGlassReflection";
import useMemojiPreload from "./hooks/useMemojiPreload";
import useWidgetLayout from "./hooks/useWidgetLayout";
import { readStorage } from "./utils/storage";

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
  const [terminalOpen, setTerminalOpen] = useState(false);
  const activeSection = useActiveSection();
  const { layout, isEditing, getWidgetProps, finishEditing } = useWidgetLayout();
  const t = translations[language];

  useMemojiPreload();
  useGlassReflection([focusMode]);

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

  const changeTheme = () => {
    const nextLight = !isLight;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches)
      return setIsLight(nextLight);
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

  const closeTerminal = () => {
    setTerminalOpen(false);
    requestAnimationFrame(() => document.querySelector('.top-grid > [data-widget-id="terminal"]')?.focus());
  };

  return (
    <WindowManagerProvider>
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
        onOpenTerminal={() => setTerminalOpen(true)}
      />
      <div className="shell">
        <main>
          <div className="top-grid" data-layout-editing={isEditing || undefined}>
            <HighlightsRail
              t={t}
              layout={layout}
              getWidgetProps={getWidgetProps}
              onOpenTerminal={() => setTerminalOpen(true)}
              hero={<Hero key="hero" t={t} widgetProps={getWidgetProps("hero")} />}
            />
            {isEditing && (
              <button className="layout-done" type="button" onClick={finishEditing}>
                {t.layoutDone}
              </button>
            )}
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
        language={language}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
      />
      <TerminalWindow open={terminalOpen} onClose={closeTerminal} returnFocus={() => document.querySelector('.top-grid > [data-widget-id="terminal"]')?.focus()} />
      <Analytics />
      <SpeedInsights />
    </WindowManagerProvider>
  );
}
