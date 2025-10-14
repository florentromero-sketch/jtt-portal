// 🛰️ JTT Portal — Service Worker V3.7
// Objectif : nettoyage complet des anciens caches + affichage unique

const CACHE_NAME = 'jtt-portal-v3-7';

// 🗂️ Liste des fichiers essentiels en cache
const URLS_TO_CACHE = [
  '/jtt-portal/',
  '/jtt-portal/index.html',
  '/jtt-portal/manifest.json',
  '/jtt-portal/icon-192.png',
  '/jtt-portal/icon-512.png'
];

// ===== Installation =====
self.addEventListener('install', event => {
  console.log('🛰️ [SW V3.7] Installation en cours...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(URLS_TO_CACHE))
  );
  self.skipWaiting(); // activation immédiate
});

// ===== Activation : suppression des anciens caches =====
self.addEventListener('activate', event => {
  console.log('♻️ [SW V3.7] Activation + nettoyage des anciens caches');
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(k => k.startsWith('jtt-portal-') && k !== CACHE_NAME)
          .map(k => {
            console.log('🧹 Suppression ancien cache :', k);
            return caches.delete(k);
          })
      );
    })
  );
  self.clients.claim(); // prend le contrôle immédiatement
});

// ===== Interception des requêtes réseau =====
self.addEventListener('fetch', event => {
  // Ne pas traiter les requêtes "chrome-extension" ou externes
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) {
        // Réponse depuis le cache
        return cached;
      }
      // Sinon, récupération réseau + ajout au cache
      return fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
          return response;
        })
        .catch(err => {
          console.warn('⚠️ [SW] Fetch échoué :', err);
          // Aucun fallback ici → laisse le navigateur gérer
        });
    })
  );
});
