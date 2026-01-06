const CACHE_NAME = 'geoquest-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  // Removed external CDNs (Tailwind, Fonts, Leaflet) to prevent CORS errors
  // The browser will handle caching of these external resources automatically via HTTP headers
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Strictly skip cross-origin requests from SW caching to avoid CORS failures
  // This prevents 'TypeError: Failed to fetch' for CDNs like tailwindcss.com
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
