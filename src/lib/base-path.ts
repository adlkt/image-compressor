/**
 * 前端侧的 basePath，值由 next.config.ts 的 env 注入（单一来源）。
 *
 * 只给「拿不到 Next 路由前缀」的地方用：raw fetch 的资源路径、service worker
 * 注册路径。写成 next/link 的 href、或 metadata 里的相对资源都不需要它 ——
 * Next 会自动补前缀，手动再加反而会重复。
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
