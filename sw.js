const CACHE_NAME = "chambers-app-v1";
const APP_SHELL = [
  "/",
  "/manifest.json",
  "/assets/favicon.svg",
  "/assets/icons/icon-192.png",
  "/assets/icons/icon-512.png",
  "/assets/icons/apple-touch-icon.png",
  "/assets/img/portrait.jpg",
  "/assets/img/og-cover.jpg",
  "/assets/img/gallery/certificate-ceremony.jpg",
  "/assets/img/gallery/chambers-office.jpg",
  "/assets/img/gallery/document-handover.jpg",
  "/assets/img/gallery/kp-judicial-academy.jpg",
  "/assets/img/gallery/scbap-lounge.jpg",
  "/assets/img/gallery/standing-portrait.jpg",
  "/CSS/style.css?v=production-2",
  "/CSS/responsive-hardening.css?v=4",
  "/JS/data.js",
  "/JS/app.js?v=production-1",
  "/JS/pwa.js?v=1"
];

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(APP_SHELL);
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter(key => key.startsWith("chambers-app-") && key !== CACHE_NAME)
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      try {
        const response = await fetch(request);
        if (response.ok) await cache.put("/", response.clone());
        return response;
      } catch {
        const fallback = await cache.match("/");
        return fallback || new Response("You are offline. Reconnect and try again.", {
          status: 503,
          headers: { "Content-Type": "text/plain; charset=utf-8" }
        });
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) return cached;

    const response = await fetch(request);
    if (response.ok && response.type === "basic") {
      await cache.put(request, response.clone());
    }
    return response;
  })());
});
