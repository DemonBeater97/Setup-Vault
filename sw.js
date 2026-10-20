// Alter Offline-Speicher von der ersten iPhone-Version: räumt sich selbst auf.
// Die App hat jetzt ihren eigenen Speicher im Ordner app/.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.map(c => caches.delete(c))))
    .then(() => self.registration.unregister())
    .then(() => self.clients.matchAll()).then(cs => cs.forEach(c => c.navigate(c.url))));
});
