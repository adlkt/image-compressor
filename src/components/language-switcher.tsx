"use client";

import { Menu } from "@base-ui/react/menu";
import { Button } from "@/components/ui/button";
import { useI18n, type Lang } from "@/i18n";

const langOptions: { value: Lang; label: string }[] = [
  { value: "zh", label: "中文" },
  { value: "en", label: "English" },
];

export function LanguageSwitcher() {
  const { lang, setLang, isPending, t } = useI18n();
  const current = lang === "zh" ? "中文" : "EN";

  return (
    <Menu.Root modal={false}>
      <Menu.Trigger
        render={
          <Button
            variant="ghost"
            size="lg"
            title={t.lang}
            aria-label={`${t.lang}：${lang === "zh" ? "中文" : "English"}`}
            className="h-11 min-w-11 px-2.5"
          >
            <span className="text-xs leading-none font-medium">
              {current}
            </span>
          </Button>
        }
      />
      <Menu.Portal>
        <Menu.Positioner side="bottom" align="end" sideOffset={8}>
          <Menu.Popup className="z-50 min-w-[7.5rem] rounded-md border border-border bg-popover py-1 shadow-overlay outline-none">
            {langOptions.map((opt) => (
              <Menu.Item
                key={opt.value}
                disabled={isPending}
                onClick={() => setLang(opt.value)}
                aria-current={lang === opt.value ? "true" : undefined}
                className={`flex cursor-default items-center justify-between px-3 py-2 text-sm outline-none transition-colors data-[highlighted]:bg-accent data-[highlighted]:text-foreground data-[disabled]:opacity-60 ${lang === opt.value ? "text-foreground" : "text-muted-foreground"}`}
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
