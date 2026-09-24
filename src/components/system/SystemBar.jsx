import { useEffect, useRef, useState } from 'react';
import SfSymbol from '../ui/SfSymbol';
import BrandIcon from '../ui/BrandIcon';
import AboutPortfolioDialog from './AboutPortfolioDialog';

function FocusIcon() {
  return <span className="focus-icon" aria-hidden="true"><SfSymbol name="person.text.rectangle" /></span>;
}

function useNetworkStatus() {
  const read = () => {
    if (typeof navigator.onLine !== 'boolean') return null;
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    return {
      online: navigator.onLine,
      effectiveType: connection?.effectiveType || null,
      saveData: Boolean(connection?.saveData),
    };
  };
  const [status, setStatus] = useState(read);
  useEffect(() => {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const update = () => setStatus(read());
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    connection?.addEventListener?.('change', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
      connection?.removeEventListener?.('change', update);
    };
  }, []);
  return status;
}

function NetworkStatus({ language }) {
  const status = useNetworkStatus();
  if (!status) return null;
  const constrained = status.saveData || status.effectiveType === 'slow-2g' || status.effectiveType === '2g';
  const symbol = !status.online ? 'wifi.slash' : constrained ? 'wifi.exclamationmark' : 'wifi';
  const detail = !status.online ? (language === 'pt' ? 'Sem conexão' : 'Offline') : status.effectiveType ? status.effectiveType.toUpperCase() : (language === 'pt' ? 'Conectado' : 'Connected');
  const label = `${language === 'pt' ? 'Rede' : 'Network'}: ${detail}`;
  return <span className="system-indicator network-indicator" title={label}><SfSymbol name={symbol} label={label} /></span>;
}

function batterySymbol(level, charging) {
  if (charging) return 'battery.100percent.bolt';
  if (level <= .125) return 'battery.0percent';
  if (level <= .375) return 'battery.25percent';
  if (level <= .625) return 'battery.50percent';
  if (level <= .875) return 'battery.75percent';
  return 'battery.100percent';
}

function BatteryStatus({ language }) {
  const [battery, setBattery] = useState(null);
  useEffect(() => {
    if (typeof navigator.getBattery !== 'function') return undefined;
    let manager;
    let active = true;
    const update = () => {
      if (active && manager) setBattery({ level: manager.level, charging: manager.charging });
    };
    navigator.getBattery().then((value) => {
      if (!active) return;
      manager = value;
      update();
      manager.addEventListener('levelchange', update);
      manager.addEventListener('chargingchange', update);
    }).catch(() => {});
    return () => {
      active = false;
      manager?.removeEventListener('levelchange', update);
      manager?.removeEventListener('chargingchange', update);
    };
  }, []);
  if (!battery) return null;
  const percent = Math.round(battery.level * 100);
  const state = battery.charging ? (language === 'pt' ? 'carregando' : 'charging') : `${percent}%`;
  const label = `${language === 'pt' ? 'Bateria' : 'Battery'}: ${state}`;
  return <span className="system-indicator battery-indicator" title={label}><SfSymbol name={batterySymbol(battery.level, battery.charging)} label={label} /></span>;
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
  const [brandMenuOpen, setBrandMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const rootRef = useRef(null);
  const brandTriggerRef = useRef(null);
  const brandMenuRef = useRef(null);
  const triggerRef = useRef(null);
  const systemTime = useSystemClock(language);
  const navItems = [
    ['work', t.navWork], ['about', t.navAbout], ['side-projects', t.navProjects], ['journey', t.navJourney],
  ];

  useEffect(() => {
    if (!open && !brandMenuOpen) return undefined;
    const dismiss = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
        setBrandMenuOpen(false);
      }
    };
    const dismissWithKeyboard = (event) => {
      if (event.key !== 'Escape' || !brandMenuOpen) return;
      setBrandMenuOpen(false);
      brandTriggerRef.current?.focus();
    };
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', dismissWithKeyboard);
    return () => {
      document.removeEventListener('pointerdown', dismiss);
      document.removeEventListener('keydown', dismissWithKeyboard);
    };
  }, [open, brandMenuOpen]);

  useEffect(() => {
    if (brandMenuOpen) brandMenuRef.current?.querySelector('[role="menuitem"]')?.focus();
  }, [brandMenuOpen]);

  return <div className={`system-bar-layer${open || brandMenuOpen ? ' control-center-open' : ''}`} ref={rootRef}>
    <header className="system-bar">
      <button
        className="system-brand"
        type="button"
        ref={brandTriggerRef}
        aria-label={language === 'pt' ? 'Menu de Cristian Macedo' : 'Cristian Macedo menu'}
        aria-haspopup="menu"
        aria-expanded={brandMenuOpen}
        onClick={() => {
          setOpen(false);
          setBrandMenuOpen((value) => !value);
        }}
      >cm<span>.</span></button>
      <nav className="system-nav" aria-label={t.mainNavigation}>
        {navItems.map(([id, label]) => {
          const disabled = focusMode && id === 'side-projects';
          return <a key={id} href={`#${id}`} className={activeSection === id ? 'active' : ''} aria-current={activeSection === id ? 'location' : undefined} aria-disabled={disabled || undefined} tabIndex={disabled ? -1 : undefined} onClick={disabled ? (event) => event.preventDefault() : undefined}>{label}</a>;
        })}
      </nav>
      <span className="system-current-section" aria-hidden="true">{navItems.find(([id]) => id === activeSection)?.[1] || t.navWork}</span>
      <div className="system-status">
        {focusMode && <button className="system-focus-status" type="button" onClick={onFocus} aria-label={t.focusDisable}><FocusIcon /><span>{t.focusTitle}</span></button>}
        <NetworkStatus language={language} />
        <BatteryStatus language={language} />
        <button className="control-center-trigger" type="button" ref={triggerRef} onClick={() => { setBrandMenuOpen(false); setOpen((value) => !value); }} aria-label={t.controlCenter} aria-haspopup="dialog" aria-expanded={open}><SfSymbol name="switch.2" /></button>
        <time className="system-clock" dateTime={new Date().toISOString()}>{systemTime}</time>
      </div>
    </header>
    {brandMenuOpen && <div className="brand-menu" role="menu" ref={brandMenuRef}>
      <button type="button" role="menuitem" onClick={() => { setBrandMenuOpen(false); setAboutOpen(true); }}>
        {language === 'pt' ? 'Sobre este portfólio' : 'About this portfolio'}
      </button>
    </div>}
    {open && <ControlCenter t={t} language={language} isLight={isLight} focusMode={focusMode} onLanguage={onLanguage} onTheme={onTheme} onFocus={onFocus} onClose={() => setOpen(false)} triggerRef={triggerRef} />}
    <AboutPortfolioDialog language={language} open={aboutOpen} onClose={() => setAboutOpen(false)} />
  </div>;
}
