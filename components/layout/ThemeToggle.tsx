"use client";

import { useTheme } from "@/components/theme/ThemeProvider";
import { Moon, Sun } from "lucide-react";
import React from "react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors inline-flex items-center justify-center ${className}`}
    >
      {theme === "dark" ? (
        <Moon className="w-4 h-4 transition-transform" />
      ) : (
        <Sun className="w-4 h-4 transition-transform" />
      )}
    </button>
  );
}

