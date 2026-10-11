import { createContext, useCallback, useContext, useMemo, useState } from "react";

const WindowManagerContext = createContext(null);

export function WindowManagerProvider({ children }) {
  const [order, setOrder] = useState([]);
  const activate = useCallback((id) => {
    setOrder((current) => [...current.filter((value) => value !== id), id]);
  }, []);
  const value = useMemo(() => ({ order, activate }), [activate, order]);
  return <WindowManagerContext.Provider value={value}>{children}</WindowManagerContext.Provider>;
}

export function useWindowManager(id) {
  const manager = useContext(WindowManagerContext);
  if (!manager) throw new Error("useWindowManager must be used inside WindowManagerProvider");
  const index = manager.order.indexOf(id);
  const activate = useCallback(() => manager.activate(id), [id, manager.activate]);
  return {
    activate,
    zIndex: 1100 + Math.max(index, 0),
  };
}
