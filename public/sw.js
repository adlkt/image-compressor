/**
 * 站点挂在 314925.xyz/image-compressor 下，所有路径都带这层前缀。
 * 前缀从注册作用域反推（生产是 /image-compressor，本地 dev 是空串），
 * 这样本文件不需要参与构建、也不用重复维护那份常量。
 */
const BASE = new URL(self.registration.scope).pathname.replace(/\/$/, "");

const CACHE_NAME = "image-compressor-shell-v2";
const APP_SHELL = [`${BASE}/`, `${BASE}/privacy`, `${BASE}/icon.svg`];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter((name) =>
              name.startsWith("image-compressor-shell-") &&
              name !== CACHE_NAME,
            )
            .map((name) => caches.delete(name)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, response.clone());
  }
  return response;
}

async function staleWhileRevalidate(request, event) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  const refresh = fetch(request)
    .then(async (response) => {
      if (response.ok) await cache.put(request, response.clone());
      return response;
    })
    .catch(() => cached ?? Response.error());

  if (cached) {
    event.waitUntil(refresh.then(() => undefined));
    return cached;
  }

  return refresh;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(staleWhileRevalidate(request, event));
    return;
  }

  if (
    url.pathname.startsWith(`${BASE}/_next/static/`) ||
    url.pathname === `${BASE}/icon.svg`
  ) {
    event.respondWith(cacheFirst(request));
  }
});
