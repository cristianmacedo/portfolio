import { createPortal } from "react-dom";
import useFloatingWindow from "../../hooks/useFloatingWindow";

export default function FloatingWindow({
  id,
  open,
  className,
  role = "dialog",
  ariaLabel,
  children,
}) {
  const floating = useFloatingWindow({ id, open, margin: 8 });
  if (!open) return null;

  return createPortal(
    <section
      ref={floating.windowRef}
      className={`floating-window ${className}${floating.position ? " is-positioned" : ""}`}
      role={role}
      aria-label={ariaLabel}
      style={{
        ...(floating.position ? { left: floating.position.x, top: floating.position.y } : undefined),
        zIndex: floating.zIndex,
      }}
      onPointerDownCapture={floating.activate}
    >
      {children(floating)}
    </section>,
    document.body,
  );
}
