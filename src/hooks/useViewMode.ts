// Inside layout.tsx
import { createContext, useContext } from "react";

type ViewMode = "card" | "list" | "grid";

export const ViewModeContext = createContext<{
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
} | null>(null);

export const useViewMode = () => {
  const context = useContext(ViewModeContext);
  if (!context) {
    throw new Error("useViewMode must be used within a ViewModeProvider");
  }
  return context;
};
