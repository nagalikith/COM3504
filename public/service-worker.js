let cache = null;
let cacheName = 'chat-website-cache';
var filesToCache = [
    '/',
    '/images/cathedral.jpg',
    '/images/spylogo.png',
    '/javascripts/canvas.js',
    '/javascripts/index.js',
    "/javascripts/database.js",
    '/stylesheets/style.css',
    '/javascripts/idb/index.js',
    "/javascripts/app.js",
    '/javascripts/idb/wrap-idb-value.js',
];

/**
 * install event : adds all the files to be cached
 */
self.addEventListener("install", function (event) {
    console.log("[ServiceWorker] Install");
    event.waitUntil(
        caches.open(cacheName).then(function (cacheX) {
            console.log("Caching app shell");
            cache = cacheX;
            return cache.addAll(filesToCache);
        })
    );
});
/**
 * activation : removes unnecessary cashed files
 */
self.addEventListener("activate", function (e) {
    console.log("[ServiceWorker] Activate");
    e.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(
                keyList.map(function (key) {
                    if (key !== cacheName) {
                        console.log("[ServiceWorker] Removing old cache", key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

/**
 the Cache strategy used is falling back to the network
 */
self.addEventListener("fetch", function (e) {
    console.log("[Service Worker] Fetch", e.request.url);
    if (e.request.url.indexOf("localhost") === -1 || e.request.url.indexOf("chat.io") > -1) {
        console.log("External request");
        e.respondWith(fetch(e.request));
    } else {
        e.respondWith(
            caches.match(e.request).then(function (response) {
                return (
                    response ||
                    fetch(e.request)
                        .then(function (response) {
                            if (!response.ok || response.statusCode > 299) {
                                console.log("error: " + response.error());
                            } else {
                                caches.add(e.request.url);
                                return response;
                            }
                        })
                        .catch(function (err) {
                            console.log("error: " + err);
                        })
                );
            })
        );
    }
});