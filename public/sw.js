const CACHE_NAME = 'guia-venezolario-v1'
const STATIC_CACHE_URLS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/main_mascot.png',
  '/look_mascot.png',
  '/guess_mascot.png',
  '/background.png'
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets...')
        return cache.addAll(STATIC_CACHE_URLS)
      })
      .then(() => {
        console.log('Service Worker: Static assets cached successfully')
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('Service Worker: Error caching static assets:', error)
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Service Worker: Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('Service Worker: Activated and ready')
        return self.clients.claim()
      })
  )
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests and API calls
  if (!event.request.url.startsWith(self.location.origin) || 
      event.request.url.includes('googleapis.com') ||
      event.request.url.includes('googletagmanager.com')) {
    return
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          console.log('Service Worker: Serving from cache:', event.request.url)
          return cachedResponse
        }

        // Otherwise fetch from network
        console.log('Service Worker: Fetching from network:', event.request.url)
        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response
            }

            // Cache successful responses for static assets
            if (event.request.method === 'GET' && 
                (event.request.url.endsWith('.js') || 
                 event.request.url.endsWith('.css') || 
                 event.request.url.endsWith('.png') || 
                 event.request.url.endsWith('.jpg') || 
                 event.request.url.endsWith('.ico') ||
                 event.request.url === self.location.origin + '/')) {
              
              const responseToCache = response.clone()
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache)
                })
            }

            return response
          })
          .catch((error) => {
            console.error('Service Worker: Network fetch failed:', error)
            
            // Serve offline fallback for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match('/')
            }
            
            throw error
          })
      })
  )
})

// Handle background sync for offline functionality
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Service Worker: Background sync triggered')
    // Could implement offline queue here for API requests
  }
})

// Handle push notifications (for future use)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: '/main_mascot.png',
      badge: '/favicon.ico',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey || 1
      }
    }
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    )
  }
})

console.log('Service Worker: Loaded and ready')