import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  layoutsMatch,
  moveWidgetToIndex,
  readWidgetLayout,
  saveWidgetLayout,
} from "../utils/widgetLayout";

const LONG_PRESS_MS = 520;
const MOVE_THRESHOLD = 8;
const FLIP_DURATION = 260;
const FLIP_EASING = "cubic-bezier(0.22, 0.8, 0.25, 1)";

function getInsertionIndex(nodes, draggedId, point) {
  const entries = [...nodes.entries()]
    .filter(([id]) => id !== draggedId)
    .map(([id, node]) => ({ id, rect: node.getBoundingClientRect() }))
    .sort((left, right) => {
      const rowDistance = Math.abs(left.rect.top - right.rect.top);
      return rowDistance > 12
        ? left.rect.top - right.rect.top
        : left.rect.left - right.rect.left;
    });

  for (let index = 0; index < entries.length; index += 1) {
    const { rect } = entries[index];
    const centerY = rect.top + rect.height / 2;
    const centerX = rect.left + rect.width / 2;
    const isAbove = point.y < centerY - 8;
    const isBeforeOnSameRow =
      Math.abs(point.y - centerY) <= rect.height / 2 && point.x < centerX;
    if (isAbove || isBeforeOnSameRow) return index;
  }

  return entries.length;
}

export default function useWidgetLayout() {
  const [layout, setLayout] = useState(readWidgetLayout);
  const [isEditing, setIsEditing] = useState(false);
  const [draggedId, setDraggedId] = useState(null);
  const [pressedId, setPressedId] = useState(null);
  const widgetNodes = useRef(new Map());
  const press = useRef(null);
  const activeDrag = useRef(null);
  const preview = useRef(null);
  const pendingPoint = useRef(null);
  const previewFrame = useRef(null);
  const previousRects = useRef(null);

  useEffect(() => {
    saveWidgetLayout(layout);
  }, [layout]);

  const clearPress = useCallback(() => {
    if (press.current) {
      window.clearTimeout(press.current.timer);
      press.current = null;
    }
    setPressedId(null);
  }, []);

  const removePreview = useCallback(() => {
    if (previewFrame.current) cancelAnimationFrame(previewFrame.current);
    previewFrame.current = null;
    pendingPoint.current = null;
    preview.current?.remove();
    preview.current = null;
  }, []);

  const updatePreview = useCallback(() => {
    previewFrame.current = null;
    const dragPreview = preview.current;
    const point = pendingPoint.current;
    if (!dragPreview || !point) return;
    dragPreview.style.setProperty("--drag-x", `${point.x}px`);
    dragPreview.style.setProperty("--drag-y", `${point.y}px`);
  }, []);

  const queuePreviewUpdate = useCallback((event) => {
    const drag = activeDrag.current;
    if (!preview.current || !drag) return;
    pendingPoint.current = {
      x: event.clientX - drag.offset.x - drag.offset.left,
      y: event.clientY - drag.offset.y - drag.offset.top,
    };
    if (!previewFrame.current) previewFrame.current = requestAnimationFrame(updatePreview);
  }, [updatePreview]);

  const beginDrag = useCallback((element, point, pointerId, id) => {
    const rect = element.getBoundingClientRect();
    const dragPreview = element.cloneNode(true);
    dragPreview.classList.add("layout-drag-preview");
    dragPreview.classList.remove("is-layout-pressing");
    dragPreview.removeAttribute("id");
    dragPreview.setAttribute("aria-hidden", "true");
    dragPreview.style.width = `${rect.width}px`;
    dragPreview.style.height = `${rect.height}px`;
    dragPreview.style.left = `${rect.left}px`;
    dragPreview.style.top = `${rect.top}px`;
    dragPreview.style.setProperty("--drag-x", "0px");
    dragPreview.style.setProperty("--drag-y", "0px");
    document.body.append(dragPreview);
    requestAnimationFrame(() => dragPreview.classList.add("is-layout-lifted"));
    preview.current = dragPreview;
    activeDrag.current = {
      id,
      source: element,
      pointerId,
      offset: {
        x: point.x - rect.left,
        y: point.y - rect.top,
        left: rect.left,
        top: rect.top,
      },
      insertionIndex: getInsertionIndex(widgetNodes.current, id, point),
    };
    setDraggedId(id);
    setIsEditing(true);
  }, []);

  const reorderAt = useCallback((widgetId, insertionIndex) => {
    setLayout((current) => {
      const next = moveWidgetToIndex(current, widgetId, insertionIndex);
      if (layoutsMatch(current, next)) return current;
      previousRects.current = new Map(
        [...widgetNodes.current.entries()].map(([id, node]) => [id, node.getBoundingClientRect()]),
      );
      return next;
    });
  }, []);

  useLayoutEffect(() => {
    const before = previousRects.current;
    if (!before) return;
    previousRects.current = null;

    for (const [id, node] of widgetNodes.current) {
      if (id === activeDrag.current?.id) continue;
      const previous = before.get(id);
      if (!previous) continue;
      const next = node.getBoundingClientRect();
      const deltaX = previous.left - next.left;
      const deltaY = previous.top - next.top;
      if (!deltaX && !deltaY) continue;
      node.style.transition = "none";
      node.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`;
      requestAnimationFrame(() => {
        node.style.transition = `transform ${FLIP_DURATION}ms ${FLIP_EASING}`;
        node.style.removeProperty("transform");
        window.setTimeout(
          () => node.style.removeProperty("transition"),
          FLIP_DURATION,
        );
      });
    }
  }, [layout]);

  const finishDrag = useCallback(() => {
    const drag = activeDrag.current;
    if (!drag) return;
    drag.source.releasePointerCapture?.(drag.pointerId);
    activeDrag.current = null;
    removePreview();
    setDraggedId(null);
  }, [removePreview]);

  const finishEditing = useCallback(() => {
    clearPress();
    finishDrag();
    setIsEditing(false);
  }, [clearPress, finishDrag]);

  const moveActiveDrag = useCallback((event) => {
    const drag = activeDrag.current;
    if (!drag || event.pointerId !== drag.pointerId) return;
    event.preventDefault();
    queuePreviewUpdate(event);
    const insertionIndex = getInsertionIndex(widgetNodes.current, drag.id, {
      x: event.clientX,
      y: event.clientY,
    });
    if (insertionIndex !== drag.insertionIndex) {
      drag.insertionIndex = insertionIndex;
      reorderAt(drag.id, insertionIndex);
    }
  }, [queuePreviewUpdate, reorderAt]);

  useEffect(() => {
    const onPointerUp = (event) => {
      if (event.pointerId === activeDrag.current?.pointerId) finishDrag();
      if (event.pointerId === press.current?.pointerId) clearPress();
    };
    document.addEventListener("pointermove", moveActiveDrag, { passive: false });
    document.addEventListener("pointerup", onPointerUp);
    document.addEventListener("pointercancel", onPointerUp);
    return () => {
      document.removeEventListener("pointermove", moveActiveDrag);
      document.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("pointercancel", onPointerUp);
    };
  }, [clearPress, finishDrag, moveActiveDrag]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") finishEditing();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [finishEditing]);

  useEffect(() => {
    if (!isEditing) return undefined;

    const dismissOnOutsidePress = (event) => {
      if (activeDrag.current) return;
      const target = event.target;
      if (
        target instanceof Element &&
        target.closest("[data-widget-id], .layout-done, .layout-drag-preview")
      ) return;
      finishEditing();
    };

    document.addEventListener("pointerdown", dismissOnOutsidePress);
    return () => document.removeEventListener("pointerdown", dismissOnOutsidePress);
  }, [finishEditing, isEditing]);

  useEffect(() => () => {
    clearPress();
    removePreview();
  }, [clearPress, removePreview]);

  const getWidgetProps = useCallback(
    (id) => ({
      ref: (node) => {
        if (node) widgetNodes.current.set(id, node);
        else widgetNodes.current.delete(id);
      },
      "data-widget-id": id,
      draggable: false,
      className: [
        isEditing && "is-layout-editable",
        pressedId === id && "is-layout-pressing",
        draggedId === id && "is-layout-dragging",
      ].filter(Boolean).join(" "),
      onPointerDown: (event) => {
        if (event.button !== 0 || activeDrag.current) return;
        const element = event.currentTarget;
        element.setPointerCapture?.(event.pointerId);

        if (isEditing) {
          event.preventDefault();
          beginDrag(
            element,
            { x: event.clientX, y: event.clientY },
            event.pointerId,
            id,
          );
          return;
        }

        setPressedId(id);
        press.current = {
          element,
          pointerId: event.pointerId,
          x: event.clientX,
          y: event.clientY,
          timer: window.setTimeout(() => {
            const activePress = press.current;
            if (!activePress) return;
            press.current = null;
            setPressedId(null);
            beginDrag(
              activePress.element,
              { x: activePress.x, y: activePress.y },
              activePress.pointerId,
              id,
            );
          }, LONG_PRESS_MS),
        };
      },
      onPointerMove: (event) => {
        const activePress = press.current;
        if (isEditing || !activePress || activePress.pointerId !== event.pointerId) return;
        const distance = Math.hypot(
          event.clientX - activePress.x,
          event.clientY - activePress.y,
        );
        if (distance > MOVE_THRESHOLD) clearPress();
      },
      onPointerUp: () => clearPress(),
      onPointerCancel: () => clearPress(),
      onDragStart: (event) => event.preventDefault(),
      onClick: (event) => {
        if (isEditing) event.preventDefault();
      },
    }),
    [beginDrag, clearPress, draggedId, isEditing, pressedId],
  );

  return { layout, isEditing, getWidgetProps, finishEditing };
}
