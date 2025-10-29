/**
 * useTheme Hook
 * Manages dark/light theme with system preference detection and LocalStorage persistence
 */

import { useState, useEffect } from "react";

type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "tinyhabits_theme";

export function useTheme() {
  // Initialize with system preference or stored preference
  const [theme, setTheme] = useState<Theme>(() => {
    // Check LocalStorage first
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    if (stored === "light" || stored === "dark") {
      return stored;
    }

    // Fall back to system preference
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }

    return "light";
  });

  // Apply theme to document root
  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Save to LocalStorage
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-update if user hasn't manually set a preference
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (!stored) {
        setTheme(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const setLightTheme = () => setTheme("light");
  const setDarkTheme = () => setTheme("dark");

  return {
    theme,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    isDark: theme === "dark",
  };
}
