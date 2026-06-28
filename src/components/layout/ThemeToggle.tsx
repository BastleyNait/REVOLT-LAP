"use client";

import { useEffect, useState } from "react";
import { buttonClasses } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils/cn";

type Theme = "light" | "dark";

/** Reads the theme the no-FOUC inline script (see RootLayout) already applied. */
function currentTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

/**
 * Brutalist light/dark switch. The actual class is applied pre-paint by the
 * inline script in the layout; this only flips it and persists the choice.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // Sync React state with whatever the inline script decided.
  useEffect(() => {
    setTheme(currentTheme());
    setMounted(true);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    const root = document.documentElement;
    root.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* storage may be unavailable (private mode) — ignore */
    }
    setTheme(next);
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className={buttonClasses({ variant: "outline", size: "sm", className: cn("!px-2", className) })}
    >
      {/* Until mounted, render a neutral icon to avoid a hydration mismatch. */}
      <Icon
        name={mounted ? (isDark ? "light_mode" : "dark_mode") : "contrast"}
        className="text-xl"
      />
    </button>
  );
}
