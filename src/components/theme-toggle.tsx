"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);

  // next-themes needs a client-only render pass to avoid hydration mismatches.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Same box as the real control (icon size = size-11), but invisible:
    // the ghost button has no fill or border at rest, so a bordered
    // placeholder would flash a box the user never sees again.
    return <div className="size-11" aria-hidden />;
  }

  const cycle = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  const icon =
    theme === "light" ? (
      <Sun className="w-4 h-4" />
    ) : theme === "dark" ? (
      <Moon className="w-4 h-4" />
    ) : (
      <Monitor className="w-4 h-4" />
    );

  const nextTheme = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
  const nextLabel =
    nextTheme === "light"
      ? t.theme.light
      : nextTheme === "dark"
        ? t.theme.dark
        : t.theme.auto;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycle}
      title={`${t.theme.switchTo} ${nextLabel}`}
      aria-label={`${t.theme.switchTo} ${nextLabel}`}
    >
      {icon}
    </Button>
  );
}
