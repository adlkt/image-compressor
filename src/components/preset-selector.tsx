"use client";

import { useI18n } from "@/i18n";
import { DELIVERY_RECIPES, useCompressor, type RecipeId } from "@/lib/store";

type Recipe = Exclude<RecipeId, "custom">;
type Orientation = "row" | "column";

/**
 * 档位选择器。
 *
 * 它不是四张卡片，而是同一台仪器上的四个档位：选中态是一条信号色边线，
 * 不是一块填充底色——填色会把「当前档位」和「可点区域」搅在一起。
 * 档位的详细参数按规格牌摊开成若干格，比连成一句话更好扫。
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

  const specs: Array<{ id: Recipe; title: string; detail: string; target: string }> = [
    {
      id: "web",
      title: t.presets.presetWeb,
      detail: t.presets.presetWebDesc,
      target: `${Math.round((DELIVERY_RECIPES.web.targetBytes ?? 0) / 1024)} KB`,
    },
    {
      id: "social",
      title: t.presets.presetSocial,
      detail: t.presets.presetSocialDesc,
      target: `${Math.round((DELIVERY_RECIPES.social.targetBytes ?? 0) / 1024)} KB`,
    },
    {
      id: "ecommerce",
      title: t.presets.presetEcommerce,
      detail: t.presets.presetEcommerceDesc,
      target: `${Math.round((DELIVERY_RECIPES.ecommerce.targetBytes ?? 0) / 1024)} KB`,
    },
    {
      id: "quality",
      title: t.presets.presetMax,
      detail: t.presets.presetMaxDesc,
      target: t.controls.noLimit,
    },
  ];

  const column = orientation === "column";

  return (
    <fieldset className={className}>
      <legend data-silk className="panel-label mb-2">
        {t.controls.presets}
      </legend>

      <div
        className={
          column
            ? "flex flex-col divide-y divide-border border-y border-border"
            : "grid grid-cols-2 border-t border-border sm:grid-cols-4"
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
              className={`group relative text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/40 ${
                column ? "py-2.5 pr-2" : "border-b border-border px-0 py-2.5 sm:border-b-0"
              } ${active ? "" : "hover:bg-accent/60"}`}
            >
              {/* 选中态：一条边线。列向在左边线，行向在顶边线。 */}
              <span
                aria-hidden="true"
                className={`absolute bg-primary transition-opacity ${
                  column ? "top-0 bottom-0 left-0 w-[2px]" : "top-0 right-3 left-0 h-[2px]"
                } ${active ? "opacity-100" : "opacity-0"}`}
              />

              <span className={column ? "block pl-2.5" : "block pr-3"}>
                <span
                  className={`block text-xs font-medium ${
                    active ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                  }`}
                >
                  {spec.title}
                </span>

                {/* 规格牌：每个参数占一格，比连成一句话好扫 */}
                <span className="mt-1 flex flex-wrap items-center">
                  {[...spec.detail.split(" · "), spec.target].map((segment, index) => (
                    <span
                      key={segment}
                      data-numeric
                      className={`text-[10px] leading-4 text-muted-foreground ${
                        index === 0 ? "" : "ml-1.5 border-l border-border pl-1.5"
                      }`}
                    >
                      {segment}
                    </span>
                  ))}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
