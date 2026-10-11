import FloatingWindow from "./FloatingWindow";

export default function TerminalWindow({ open, onClose, returnFocus }) {
  const close = () => {
    onClose();
    requestAnimationFrame(returnFocus);
  };

  return (
    <FloatingWindow
      id="terminal"
      open={open}
      className="terminal-window"
      ariaLabel="Terminal"
    >
      {({ dragProps }) => (
        <>
          <header className="terminal-titlebar" {...dragProps}>
            <div className="terminal-window-controls">
              <button type="button" className="terminal-close" onPointerDown={(event) => event.stopPropagation()} onClick={close} aria-label="Fechar Terminal" />
              <span className="terminal-minimize" aria-hidden="true" />
              <span className="terminal-zoom" aria-hidden="true" />
            </div>
            <p><span aria-hidden="true">📁</span> cristian@portfolio — zsh — 80×24</p>
          </header>
          <div className="terminal-content">
            <p><span>cristian@portfolio</span> <b>~</b> % <i aria-hidden="true" /></p>
          </div>
        </>
      )}
    </FloatingWindow>
  );
}
