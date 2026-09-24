"use client";

import { Menu } from "@base-ui/react/menu";
import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n, type Lang } from "@/i18n";

const langOptions: { value: Lang; label: string }[] = [
  { value: "zh", label: "中文" },
  { value: "en", label: "English" },
  { value: "ja", label: "日本語" },
];

export function LanguageSwitcher() {
  const { lang, setLang, isPending, t } = useI18n();

  return (
    <Menu.Root modal={false}>
      <Menu.Trigger
        render={
          <Button
            variant="ghost"
            size="icon"
            title={t.lang}
            aria-label={t.lang}
          >
            <Languages className="w-4 h-4" />
          </Button>
        }
      />
      <Menu.Portal>
        <Menu.Positioner side="bottom" align="end" sideOffset={8}>
          <Menu.Popup className="z-50 min-w-[128px] rounded-md border border-border bg-popover py-1 shadow-lg outline-none">
            {langOptions.map((opt) => (
              <Menu.Item
                key={opt.value}
                disabled={isPending}
                onClick={() => setLang(opt.value)}
                aria-current={lang === opt.value ? "true" : undefined}
                className={`flex cursor-default items-center justify-between px-3 py-1.5 text-sm outline-none transition-colors data-[highlighted]:bg-accent data-[highlighted]:text-foreground data-[disabled]:opacity-60 ${lang === opt.value ? "text-foreground" : "text-muted-foreground"}`}
              >
                <span>{opt.label}</span>
                {lang === opt.value && (
                  <span className="size-1.5 rounded-full bg-primary" />
                )}
              </Menu.Item>
            ))}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
