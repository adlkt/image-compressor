<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# image-compressor — Agent 规则

图片压缩 Web 应用（处理 macOS 截图文件过大）。Next.js 16 App Router + React 19，React Compiler 已开启（写组件时勿手动 `useMemo` 硬优化，让编译器处理）。

## 技术栈要点
- UI 用 **`@base-ui/react`**（非 Radix）。shadcn 组件在 `src/components/ui`（`button` / `card` / `select`），由 `shadcn@4` 生成。
- 样式 Tailwind v4（CSS-first，`globals.css` 里 `@import "tailwindcss"` + `@theme`），无 `tailwind.config.js`。
- 状态：`zustand`（`src/lib/store.ts`）。主题：`next-themes` + `src/components/theme-provider.tsx`。
- 图标：`lucide-react`。
- 多语言：`next-intl` + `src/i18n`（`request.ts` / `locales.ts` / `translations.ts`），语言切换器 `src/components/language-switcher.tsx`。

## 目录
- `src/app`：`layout.tsx` / `page.tsx` / `globals.css` / `privacy/page.tsx`（隐私页）。
- `src/components`：业务组件（`navbar` / `file-queue` / `preview-panel` / `settings-bar` / `summary-bar` 等）。
- `src/lib`：`compression.ts`（压缩逻辑）、`store.ts`（zustand）、`utils.ts`。
- `src/i18n`：国际化。

## 约定
- 压缩核心在 `src/lib/compression.ts`，新增压缩算法/格式走这里，不要在组件里内联。
- 新增 UI 原子组件用 `shadcn add`，保持 `src/components/ui` 单一来源。
- 跑 `pnpm --filter image-compressor dev` 默认端口 3456（`NODE_OPTIONS='--no-deprecation'`）。
- 根仓库 `AGENTS.md` 的 monorepo / submodule / 提交约定同样适用（本 app 是 git submodule）。
