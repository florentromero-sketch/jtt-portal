// 🛰️ JTT Portal — Service Worker V3.5
const CACHE_NAME = 'jtt-portal-v3-5'; // <— nouveau nom de cache
const URLS_TO_CACHE = [
  '/jtt-portal/',
  '/jtt-portal/index.html',
  '/jtt-portal/manifest.json',
  '/jtt-portal/icon-192.png',
  '/jtt-portal/icon-512.png'
];

// ===== Installation & mise en cache initial =====
self.addEventListener('install', event => {
  console.log('🛰️ [SW] Installation JTT Portal V3.5...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('📦 [SW] Mise en cache initiale :', URLS_TO_CACHE);
      return cache.addAll(URLS_TO_CACHE);
    })
  );
  self.skipWaiting(); // activation immédiate du nouveau SW
});

// ===== Activation : suppresion des vieux caches =====
self.addEventListener('activate', event => {
  console.log('♻️ [SW] Activation JTT Portal V3.5');
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log('🧹 Suppression ancien cache :', key);
            return caches.delete(key);
          })
      );
    })
  );
  self.clients.claim(); // prend le contrôle sans rechargement
});

// ===== Interception des requêtes =====
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // ⚙️ 1. Si présent en cache → retourne‑le
      // ⚙️ 2. Sinon → télécharge depuis le réseau
      return (
        response ||
        fetch(event.request).then(fetchRes => {
          // Stockage opportuniste des nouvelles ressources
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, fetchRes.clone());
            return fetchRes;
          });
        }).catch(() => {
          // Optionnel : renvoyer un fallback hors‑ligne
        })
      );
    })
  );
});

