import { useEffect } from "react";

export default function useGlassReflection(dependencies) {
  useEffect(() => {
    const finePointer = matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!finePointer.matches) return undefined;
    let frame = 0;
    const handle = (event) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        document.querySelectorAll(".card, .proof-strip, .control-tile, .focus-toggle, .system-control, .control-center-focus, .brand-menu").forEach((surface) => {
          const rect = surface.getBoundingClientRect();
          const angle = (Math.atan2(event.clientY - (rect.top + rect.height / 2), event.clientX - (rect.left + rect.width / 2)) * 180) / Math.PI + 90;
          surface.style.setProperty("--glass-angle", `${angle.toFixed(2)}deg`);
        });
        frame = 0;
      });
    };
    document.addEventListener("pointermove", handle, { passive: true });
    return () => { document.removeEventListener("pointermove", handle); cancelAnimationFrame(frame); };
  }, dependencies);
}
