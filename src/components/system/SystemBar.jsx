import { useEffect, useRef, useState } from 'react';

function FocusIcon() {
  return <span className="focus-icon" aria-hidden="true"><span className="focus-id"><i /></span></span>;
}

function ControlCenterIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="5" rx="2.5" /><circle cx="8" cy="7.5" r="2" /><rect x="4" y="14" width="16" height="5" rx="2.5" /><circle cx="16" cy="16.5" r="2" /></svg>;
}

function GitHubIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.87c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.58 9.58 0 0 1 12 6.82a9.6 9.6 0 0 1 2.5.34c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.77c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" /></svg>;
}

function ControlCenter({ t, language, isLight, focusMode, onLanguage, onTheme, onFocus, onClose, triggerRef }) {
  const panelRef = useRef(null);

  useEffect(() => {
    panelRef.current?.querySelector('button, a')?.focus();
    const dismiss = (event) => {
      if (event.key === 'Escape') {
        onClose();
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', dismiss);
    return () => document.removeEventListener('keydown', dismiss);
  }, [onClose, triggerRef]);

  return <div className="control-center-popover" role="dialog" aria-label={t.controlCenter} ref={panelRef}>
    <div className="control-center-actions">
      <button className="system-control language-control" type="button" onClick={onLanguage} aria-label={t.languageLabel} title={`${t.languageControl}: ${language === 'pt' ? 'Português' : 'English'}`}><span className="system-control-icon">文A</span></button>
      <button className="system-control" type="button" onClick={onTheme} aria-label={t[isLight ? 'themeDark' : 'themeLight']} title={`${t.themeControl}: ${t[isLight ? 'themeValueLight' : 'themeValueDark']}`}><span className="system-control-icon theme-glyph">◐</span></button>
      <a className="system-control" href="https://github.com/cristianmacedo" target="_blank" rel="noopener" aria-label="GitHub" title="GitHub"><GitHubIcon /></a>
      <a className="system-control linkedin-system-control" href="https://www.linkedin.com/in/cristian-macedo" target="_blank" rel="noopener" aria-label="LinkedIn" title="LinkedIn"><b aria-hidden="true">in</b></a>
    </div>
    <button className="control-center-focus" type="button" aria-pressed={focusMode} onClick={onFocus}>
      <FocusIcon /><span><strong>{t.focusTitle}</strong><small>{t[focusMode ? 'focusStatusOn' : 'focusStatusOff']}</small></span>
    </button>
  </div>;
}

function useSystemClock(language) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);
  if (language === 'pt') {
    const weekday = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' }).format(now);
    const month = new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(now);
    const time = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false }).format(now);
    return `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)} ${now.getDate()} de ${month} ${time}`;
  }
  const date = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(now);
  const time = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }).format(now);
  return `${date} ${time}`;
}

export default function SystemBar({ t, language, isLight, focusMode, activeSection, onLanguage, onTheme, onFocus }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const systemTime = useSystemClock(language);
  const navItems = [
    ['work', t.navWork], ['side-projects', t.navProjects], ['journey', t.navJourney], ['about', t.navAbout],
  ];

  useEffect(() => {
    if (!open) return undefined;
    const dismiss = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, [open]);

  return <div className="system-bar-layer" ref={rootRef}>
    <header className="system-bar">
      <a className="system-brand" href="#" aria-label="Cristian Macedo home">cm<span>.</span></a>
      <nav className="system-nav" aria-label={t.mainNavigation}>
        {navItems.map(([id, label]) => {
          const disabled = focusMode && id === 'side-projects';
          return <a key={id} href={`#${id}`} className={activeSection === id ? 'active' : ''} aria-current={activeSection === id ? 'location' : undefined} aria-disabled={disabled || undefined} tabIndex={disabled ? -1 : undefined} onClick={disabled ? (event) => event.preventDefault() : undefined}>{label}</a>;
        })}
      </nav>
      <span className="system-current-section" aria-hidden="true">{navItems.find(([id]) => id === activeSection)?.[1] || t.navWork}</span>
      <div className="system-status">
        {focusMode && <button className="system-focus-status" type="button" onClick={onFocus} aria-label={t.focusDisable}><FocusIcon /><span>{t.focusTitle}</span></button>}
        <time className="system-clock" dateTime={new Date().toISOString()}>{systemTime}</time>
        <button className="control-center-trigger" type="button" ref={triggerRef} onClick={() => setOpen((value) => !value)} aria-label={t.controlCenter} aria-haspopup="dialog" aria-expanded={open}><ControlCenterIcon /></button>
      </div>
    </header>
    {open && <ControlCenter t={t} language={language} isLight={isLight} focusMode={focusMode} onLanguage={onLanguage} onTheme={onTheme} onFocus={onFocus} onClose={() => setOpen(false)} triggerRef={triggerRef} />}
  </div>;
}
