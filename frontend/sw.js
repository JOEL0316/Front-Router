const CACHE_NAME = 'red-admin-prod-v1';
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
    if (!event.request.url.startsWith('http')) return;

    event.respondWith(
        fetch(event.request)
            .then(response => {
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
                return response;
            })
            .catch(() => caches.match(event.request))
    );
});