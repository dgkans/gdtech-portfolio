// Plain JS so it can be imported by both the React app and the inline boot
// script that runs before React mounts (to avoid a flash of wrong theme).

export const THEME_STORAGE_KEY = "gd_theme";
export const THEMES = /** @type {const} */ (["light", "dark", "system"]);

export function getStoredTheme() {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    return THEMES.includes(v) ? v : "system";
  } catch {
    return "system";
  }
}

export function getSystemTheme() {
  if (typeof window === "undefined" || !window.matchMedia) return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function resolveTheme(theme) {
  return theme === "system" ? getSystemTheme() : theme;
}

export function applyTheme(theme) {
  const resolved = resolveTheme(theme);
  const root = document.documentElement;
  root.classList.remove("dark", "light");
  root.classList.add(resolved);
  root.dataset.theme = resolved;
  root.style.colorScheme = resolved;
}

export function setStoredTheme(theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // ignore
  }
}
