"use client";

import { useI18n } from "@/i18n";
import { DELIVERY_RECIPES, useCompressor, type RecipeId } from "@/lib/store";
import { formatTargetSize } from "@/lib/format";
import { Check } from "lucide-react";

type Recipe = Exclude<RecipeId, "custom">;
type Orientation = "row" | "column";

/**
 * 预设选择器。
 *
 * 选中态使用浅蓝色面与勾选标记，不靠边框或颜色单独表达。
 * 每个预设的参数摊成若干格，比连成一句话更好扫。
 */
export function PresetSelector({
  orientation = "row",
  className = "",
}: {
  orientation?: Orientation;
  className?: string;
}) {
  const { t } = useI18n();
  const activeRecipeId = useCompressor((state) => state.activeRecipeId);
  const applyRecipe = useCompressor((state) => state.applyRecipe);

  const presets: Array<{ id: Recipe; title: string }> = [
    { id: "web", title: t.presets.presetWeb },
    { id: "social", title: t.presets.presetSocial },
    { id: "ecommerce", title: t.presets.presetEcommerce },
    { id: "quality", title: t.presets.presetMax },
  ];

  const specs: Array<{
    id: Recipe;
    title: string;
    description: string;
    cells: string[];
  }> = presets.map(
    (preset) => {
      const recipe = DELIVERY_RECIPES[preset.id];
      return {
        ...preset,
        description: t.presets.descriptions[preset.id],
        // 参数来自真实配置，不由一句话拆开——拆字符串会把文案和参数绑死
        cells: [
          recipe.format,
          `${recipe.quality}%`,
          recipe.maxWidth === 0 ? t.controls.originalSize : `${recipe.maxWidth}px`,
          recipe.targetBytes === null
            ? t.controls.noTarget
            : formatTargetSize(recipe.targetBytes),
        ],
      };
    },
  );

  const column = orientation === "column";

  return (
    <fieldset className={className}>
      <legend className="mb-2 text-sm leading-[1.4] font-semibold">
        {t.controls.presets}
      </legend>

      <div
        className={
          column
            ? "flex flex-col gap-1"
            : "grid grid-cols-2 gap-1 sm:grid-cols-4"
        }
      >
        {specs.map((spec) => {
          const active = activeRecipeId === spec.id;
          return (
            <button
              key={spec.id}
              type="button"
              aria-pressed={active}
              onClick={() => applyRecipe(spec.id)}
              className={`group relative min-h-11 rounded-[10px] px-3 py-2.5 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                active
                  ? "bg-primary/[0.09] hover:bg-primary/[0.12]"
                  : "hover:bg-accent/60 active:bg-accent"
              }`}
            >
              <span className="block">
                <span
                  className={`flex items-center justify-between gap-2 text-xs font-medium ${
                    active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  }`}
                >
                  <span>{spec.title}</span>
                  {active ? (
                    <span
                      aria-hidden="true"
                      className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
                    >
                      <Check className="size-3.5" strokeWidth={2.5} />
                    </span>
                  ) : spec.id === "web" ? (
                    <span className="font-normal text-primary">{t.presets.recommended}</span>
                  ) : null}
                </span>

                {active ? (
                  <span className="mt-1 flex flex-wrap items-center">
                    {spec.cells.map((cell, index) => (
                      <span
                        key={cell}
                        data-numeric
                        className={`text-xs leading-[1.5] text-foreground/65 ${
                          index === 0 ? "" : "ml-2 border-l border-primary/20 pl-2"
                        }`}
                      >
                        {cell}
                      </span>
                    ))}
                  </span>
                ) : (
                  <span className="mt-1 block text-xs leading-[1.5] text-muted-foreground">
                    {spec.description}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
