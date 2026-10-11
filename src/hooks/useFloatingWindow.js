import { useCallback, useEffect, useRef, useState } from "react";
import { clampWindowPosition, getCenteredWindowPosition } from "../utils/floatingWindow";
import { useWindowManager } from "../components/system/WindowManager";

const MOVE_THRESHOLD = 4;

export default function useFloatingWindow({ id, open, margin = 8 }) {
  const windowRef = useRef(null);
  const dragRef = useRef(null);
  const movedRef = useRef(false);
  const [position, setPosition] = useState(null);
  const { activate, zIndex } = useWindowManager(id);

  const readBounds = useCallback(() => ({
    width: window.innerWidth,
    height: window.innerHeight,
  }), []);
  const readMargin = useCallback(
    () => (window.innerWidth <= 650 ? 12 : margin),
    [margin],
  );

  const center = useCallback(() => {
    const rect = windowRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPosition(getCenteredWindowPosition(rect, readBounds(), readMargin()));
  }, [readBounds, readMargin]);

  useEffect(() => {
    if (!open) {
      setPosition(null);
      dragRef.current = null;
      return undefined;
    }
    activate();
    const frame = requestAnimationFrame(center);
    return () => cancelAnimationFrame(frame);
  }, [activate, center, open]);

  useEffect(() => {
    if (!open) return undefined;
    const keepInViewport = () => {
      const rect = windowRef.current?.getBoundingClientRect();
      if (!rect) return;
      setPosition((current) => current && clampWindowPosition(current, rect, readBounds(), readMargin()));
    };
    window.addEventListener("resize", keepInViewport);
    return () => window.removeEventListener("resize", keepInViewport);
  }, [open, readBounds, readMargin]);

  const startDrag = useCallback((event) => {
    if (event.button !== 0 || !windowRef.current) return;
    const rect = windowRef.current.getBoundingClientRect();
    activate();
    movedRef.current = false;
    dragRef.current = {
      pointerId: event.pointerId,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      startX: event.clientX,
      startY: event.clientY,
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }, [activate]);

  const moveDrag = useCallback((event) => {
    const drag = dragRef.current;
    const element = windowRef.current;
    if (!drag || drag.pointerId !== event.pointerId || !element) return;
    const distance = Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY);
    if (!movedRef.current && distance < MOVE_THRESHOLD) return;
    movedRef.current = true;
    event.preventDefault();
    const rect = element.getBoundingClientRect();
    setPosition(clampWindowPosition(
      { x: event.clientX - drag.offsetX, y: event.clientY - drag.offsetY },
      rect,
      readBounds(),
      readMargin(),
    ));
  }, [readBounds, readMargin]);

  const stopDrag = useCallback((event) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
  }, []);

  return {
    windowRef,
    position,
    zIndex,
    activate,
    dragProps: {
      onPointerDown: startDrag,
      onPointerMove: moveDrag,
      onPointerUp: stopDrag,
      onPointerCancel: stopDrag,
    },
    consumeDrag: () => {
      const moved = movedRef.current;
      movedRef.current = false;
      return moved;
    },
  };
}
