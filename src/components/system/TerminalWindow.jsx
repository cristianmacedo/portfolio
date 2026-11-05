import WindowControls from "../ui/WindowControls";
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
            <WindowControls label="Fechar Terminal" onClose={close} />
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
