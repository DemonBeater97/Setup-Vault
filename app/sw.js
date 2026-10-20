// Setup Vault – Offline-Speicher für die App-Dateien.
// Holt immer zuerst die neueste Version, ohne Netz die gespeicherte.
const CACHE = "setup-vault-v11";
const FILES = ["./", "index.html", "manifest.webmanifest", "icon-64.png", "icon-192.png", "icon-512.png", "icon-maskable.png", "apple-touch-icon.png", "qrcode.js"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin || url.pathname.includes("/api/")) return; // fremde Seiten und Abgleich nie anfassen
  e.respondWith(
    fetch(e.request).then(res => {
      if (res.ok && url.origin === location.origin) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return res;
    }).catch(() => caches.match(e.request).then(r => r || (e.request.mode === "navigate" ? caches.match("index.html") : Response.error())))
  );
});
