import { useEffect, useRef, useState } from 'react';

function FocusIcon() {
  return <span className="focus-icon" aria-hidden="true"><span className="focus-id"><i /></span></span>;
}

function ControlCenterIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h2m4 0h10" /><circle cx="16" cy="7" r="2" /><circle cx="8" cy="17" r="2" /></svg>;
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
    <div className="control-center-heading"><strong>{t.controlCenter}</strong><span>{t.preferences}</span></div>
    <div className="control-center-actions">
      <button className="system-control language-control" type="button" onClick={onLanguage} aria-label={t.languageLabel}>
        <span className="system-control-icon">文A</span><span><strong>{t.languageControl}</strong><small>{language === 'pt' ? 'Português' : 'English'}</small></span>
      </button>
      <button className="system-control" type="button" onClick={onTheme} aria-label={t[isLight ? 'themeDark' : 'themeLight']}>
        <span className="system-control-icon theme-glyph">◐</span><span><strong>{t.themeControl}</strong><small>{t[isLight ? 'themeValueLight' : 'themeValueDark']}</small></span>
      </button>
    </div>
    <button className="control-center-focus" type="button" aria-pressed={focusMode} onClick={onFocus}>
      <FocusIcon /><span><strong>{t.focusTitle}</strong><small>{t[focusMode ? 'focusStatusOn' : 'focusStatusOff']}</small></span><span className="control-switch" aria-hidden="true" />
    </button>
    <div className="control-center-links" aria-label={t.socialLinks}>
      <a href="https://github.com/cristianmacedo" target="_blank" rel="noopener"><GitHubIcon /><span>GitHub</span></a>
      <a href="https://www.linkedin.com/in/cristian-macedo" target="_blank" rel="noopener"><b aria-hidden="true">in</b><span>LinkedIn</span></a>
    </div>
  </div>;
}

export default function SystemBar({ t, language, isLight, focusMode, activeSection, onLanguage, onTheme, onFocus }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
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
        <button className="control-center-trigger" type="button" ref={triggerRef} onClick={() => setOpen((value) => !value)} aria-label={t.controlCenter} aria-haspopup="dialog" aria-expanded={open}><ControlCenterIcon /></button>
      </div>
    </header>
    {open && <ControlCenter t={t} language={language} isLight={isLight} focusMode={focusMode} onLanguage={onLanguage} onTheme={onTheme} onFocus={onFocus} onClose={() => setOpen(false)} triggerRef={triggerRef} />}
  </div>;
}
