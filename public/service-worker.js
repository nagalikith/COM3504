let dataCacheName = 'appData-v1';
let cacheName = 'applicationPWA-step-8-1';
let cache = null;
let filesToCache = [
    '/',
    '/images/cathedral.jpg',
    '/images/spylogo.png',
    '/javascripts/canvas.js',
    '/javascripts/index.js',
    '/stylesheets/style.css',
    '/javascripts/idb/index.js',
    '/javascripts/idb/wrap-idb-value.js'
];


/**
 * installation event: it adds all the files to be cached
 */
self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function (cacheX) {
            console.log('[ServiceWorker] Caching app shell');
            cache= cacheX;
            return cache.addAll(filesToCache);
        })
    );
});



