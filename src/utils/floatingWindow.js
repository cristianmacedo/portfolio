export function clampWindowPosition(position, size, viewport, margin = 8) {
  const maxX = Math.max(margin, viewport.width - size.width - margin);
  const maxY = Math.max(margin, viewport.height - size.height - margin);
  return {
    x: Math.min(Math.max(margin, position.x), maxX),
    y: Math.min(Math.max(margin, position.y), maxY),
  };
}

export function getCenteredWindowPosition(size, viewport, margin = 8) {
  return clampWindowPosition(
    { x: (viewport.width - size.width) / 2, y: (viewport.height - size.height) / 2 },
    size,
    viewport,
    margin,
  );
}
