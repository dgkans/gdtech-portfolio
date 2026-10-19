import { createContext, useCallback, useEffect, useState } from "react";
import {
  applyTheme,
  getStoredTheme,
  resolveTheme,
  setStoredTheme,
} from "../lib/theme";

export const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => getStoredTheme());
  const [resolvedTheme, setResolved] = useState(() =>
    resolveTheme(getStoredTheme())
  );

  useEffect(() => {
    applyTheme(theme);
    setResolved(resolveTheme(theme));
    setStoredTheme(theme);
  }, [theme]);

  // Live-update if user is on "system" and their OS theme changes.
  useEffect(() => {
    if (
      theme !== "system" ||
      typeof window === "undefined" ||
      !window.matchMedia
    ) {
      return undefined;
    }
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      applyTheme("system");
      setResolved(resolveTheme("system"));
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [theme]);

  const setTheme = useCallback((next) => setThemeState(next), []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
