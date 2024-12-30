const CACHE_NAME = 'kiks-travel-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/about.html',
    '/contact.html',
    '/destinations.html',
    '/offres.html',
    '/reservations.html',
    '/styles.css',
    '/css/footer.css',
    '/css/language-switcher.css',
    '/js/main.js',
    '/js/translations.js',
    '/js/language-switcher.js',
    '/globe.js',
    '/assets/images/kikslogo.png'
];

// Installation du Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache ouvert');
                return cache.addAll(urlsToCache);
            })
    );
});

// Stratégie de cache : Network First avec fallback sur le cache
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
            .then(response => {
                // Si la requête réussit, mettre en cache et retourner la réponse
                if (response.ok) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseClone);
                        });
                }
                return response;
            })
            .catch(() => {
                // Si la requête échoue, essayer de récupérer depuis le cache
                return caches.match(event.request);
            })
    );
});

// Nettoyage des anciens caches
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
