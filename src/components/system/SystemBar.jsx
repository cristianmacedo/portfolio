import { useEffect, useRef, useState } from 'react';
import SfSymbol from '../SfSymbol';
import BrandIcon from '../BrandIcon';

function FocusIcon() {
  return <span className="focus-icon" aria-hidden="true"><SfSymbol name="person.text.rectangle" /></span>;
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
      <button className="system-control" type="button" onClick={onLanguage} aria-label={t.languageLabel} title={`${t.languageControl}: ${language === 'pt' ? 'Português' : 'English'}`}><SfSymbol name="translate" /></button>
      <button className="system-control" type="button" onClick={onTheme} aria-label={t[isLight ? 'themeDark' : 'themeLight']} title={`${t.themeControl}: ${t[isLight ? 'themeValueLight' : 'themeValueDark']}`}><SfSymbol name="circle.lefthalf.filled" /></button>
      <a className="system-control" href="https://github.com/cristianmacedo" target="_blank" rel="noopener" aria-label="GitHub" title="GitHub"><BrandIcon name="github" /></a>
      <a className="system-control" href="https://www.linkedin.com/in/cristianmacedo" target="_blank" rel="noopener" aria-label="LinkedIn" title="LinkedIn"><BrandIcon name="linkedin" /></a>
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

  return <div className={`system-bar-layer${open ? ' control-center-open' : ''}`} ref={rootRef}>
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
        <button className="control-center-trigger" type="button" ref={triggerRef} onClick={() => setOpen((value) => !value)} aria-label={t.controlCenter} aria-haspopup="dialog" aria-expanded={open}><SfSymbol name="switch.2" /></button>
        <time className="system-clock" dateTime={new Date().toISOString()}>{systemTime}</time>
      </div>
    </header>
    {open && <ControlCenter t={t} language={language} isLight={isLight} focusMode={focusMode} onLanguage={onLanguage} onTheme={onTheme} onFocus={onFocus} onClose={() => setOpen(false)} triggerRef={triggerRef} />}
  </div>;
}
