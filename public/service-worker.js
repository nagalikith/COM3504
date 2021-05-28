let cacheName = 'chat-website-cache';
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


/**
 * activation : removes unnecessary cashed files
 */
self.addEventListener('activate', function (e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (key !== cacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

/**
 * called everytime a files is fetched
 * Will use   the strategy Cache,falling back to the network
 */
self.addEventListener("fetch", function (e) {
    console.log("[Service Worker] Fetch", e.request.url);
    // Check if the request is external , like when an user uses an image from internet
    // Another external request is for socket.io , it only works when the user is connected to internet
    if (e.request.url.indexOf("localhost") === -1 || e.request.url.indexOf("socket.io") > -1) {
        console.log("External request");
        e.respondWith(fetch(e.request));
    } else {
        e.respondWith(
            caches.match(e.request).then(function (response) {
                return (
                    response ||
                    fetch(e.request)
                        .then(function (response) {
                            // note if network error happens, fetch does not return
                            // an error. it just returns response not ok
                            // https://www.tjvantoll.com/2015/09/13/fetch-and-errors/
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