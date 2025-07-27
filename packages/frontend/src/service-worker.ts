import { precacheAndRoute } from 'workbox-precaching';

const CACHE_NAME = 'my-pwa-cache';

declare var self: ServiceWorkerGlobalScope;

precacheAndRoute(self.__WB_MANIFEST || []);

self.addEventListener('activate', (event: ExtendableEvent) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

export { };

// const urlsToCache = [
//   '/',
//   './index.html',
//   //   './index.css',
//   //   './App.css',
//   //   './types/api-types.md',
//   //   './types/parking-types.md',
// ];

// self.addEventListener('install', (event: ExtendableEvent) => {
//   event.waitUntil(
//     caches.open(CACHE_NAME)
//       .then((cache) => {
//         return cache.addAll(urlsToCache);
//       })
//   );
// });

// self.addEventListener('fetch', (event: FetchEvent) => {
//   event.respondWith(
//     caches.match(event.request)
//       .then((cachedResponse) => {
//         if (cachedResponse) {
//           return cachedResponse;
//         }
//         return fetch(event.request)
//           .then((networkResponse) => {
//             return caches.open(CACHE_NAME)
//               .then((cache) => {
//                 cache.put(event.request, networkResponse.clone());
//                 return networkResponse;
//               });
//           });
//       })
//   );
// });

// function fetchData() {
//   return caches.match('/api/data').then((cachedData) => {
//     if (cachedData) {
//       return cachedData.json();
//     } else {
//       return fetch('/api/data')
//         .then(response => response.json())
//         .then(data => {
//           caches.open('depark-cache').then((cache) => {
//             cache.put('/api/data', new Response(JSON.stringify(data)));
//           });
//           return data;
//         })
//         .catch(() => {
//           return Promise.reject('Unable to fetch data from the network or cache.');
//         });
//     }
//   });
// }
