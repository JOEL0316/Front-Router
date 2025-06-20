const CACHE_NAME = 'red-admin-lite-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './login.html',
    './register.html',
    './css/styles.css',
    './js/auth.js',
    './js/app.js',
    './js/devices.js',
    './js/rules.js',
    './js/schedules.js',
    './images/icons/icon-192.png',
    './images/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS_TO_CACHE))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});