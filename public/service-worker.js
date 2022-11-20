const cacheName = "cache-v1";
const staticAssets = [
    '/',


    '/auth/signin',
    '/auth/signup',

    '/index.html',
    '/favicon.ico',

    '/manifest.webmanifest',

    '/logo192.png',
    '/logo512.png',
    '/logo192masked.png',
    '/logo512masked.png',

    '/static/media/logo.e49f7f96.png',


    '/static/js/bundle.js',
    '/static/js/vendors~main.chunk.js',
    '/static/js/main.chunk.js',



]

self.addEventListener('install', async event => {
    const cache = await caches.open(cacheName);
    await cache.addAll(staticAssets);
    return self.skipWaiting();
});

self.addEventListener('activate', event => {
    self.clients.claim();
});

self.addEventListener('fetch', async event => {
    const req = event.request;
    const url = new URL(req.url);
    if (url.origin === location.origin || url.pathname.split("/")[1] === "media") {
        event.respondWith(cacheFirst(req));
    }
});



async function cacheFirst(req) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(req);
    return cached || fetch(req);
}

async function networkAndCache(req) {
    const cache = await caches.open(cacheName);
    try {
        const fresh = await fetch(req);
        await cache.put(req, fresh.clone());
        return fresh;
    } catch (error) {
        const cached = await cache.match(req);
        return cached;
    }
}