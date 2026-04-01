/**
 * Service Worker for Cyber Defense Simulator PWA
 * Provides offline functionality and performance optimization
 */

const CACHE_VERSION = 'v1.0.1';
const CACHE_NAME = `soc-simulator-${CACHE_VERSION}`;
const DATA_CACHE_NAME = `soc-data-${CACHE_VERSION}`;

// Assets to cache immediately on install
const PRE_CACHE_ASSETS = [
  '/soc-dashboard.html',
  '/soc-style.css',
  '/educational-styles.css',
  '/soc-game.js',
  '/educational-system.js',
  '/stats-dashboard.js',
  '/educational-content.js',
  '/manifest.json'
];

// Data files to cache
const DATA_ASSETS = [
  '/data/tutorial.json',
  '/data/glossary.json',
  '/data/education.json',
  '/data/frameworks.json',
  '/data/quiz.json',
  '/data/flashcards.json',
  '/data/careers.json'
];

// API endpoints that should use network-first strategy
const API_PATTERNS = [
  '/api/',
  'http://localhost:8080/api/'
];

// URLs to never cache
const NEVER_CACHE = [
  '/sw.js',
  '/service-worker.js'
];

/**
 * Install Event - Cache critical assets
 */
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(CACHE_NAME).then((cache) => {
        console.log('[Service Worker] Pre-caching static assets');
        return cache.addAll(PRE_CACHE_ASSETS.map(url => new Request(url, {cache: 'reload'})));
      }),
      // Cache data files
      caches.open(DATA_CACHE_NAME).then((cache) => {
        console.log('[Service Worker] Pre-caching data files');
        return cache.addAll(DATA_ASSETS.map(url => new Request(url, {cache: 'reload'})));
      })
    ]).then(() => {
      console.log('[Service Worker] Installed successfully');
      return self.skipWaiting(); // Activate immediately
    }).catch((error) => {
      console.error('[Service Worker] Installation failed:', error);
    })
  );
});

/**
 * Activate Event - Clean up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== DATA_CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[Service Worker] Activated successfully');
      return self.clients.claim(); // Take control immediately
    })
  );
});

/**
 * Fetch Event - Serve from cache or network
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip service worker for never-cache URLs
  if (NEVER_CACHE.some(pattern => url.pathname.includes(pattern))) {
    return;
  }

  // API requests: Network First (with cache fallback)
  if (isAPIRequest(url)) {
    event.respondWith(networkFirstStrategy(request, DATA_CACHE_NAME));
    return;
  }

  // Data files: Stale While Revalidate
  if (isDataFile(url)) {
    event.respondWith(staleWhileRevalidateStrategy(request, DATA_CACHE_NAME));
    return;
  }

  // Static assets: Cache First (with network fallback)
  event.respondWith(cacheFirstStrategy(request, CACHE_NAME));
});

/**
 * Cache First Strategy
 * Try cache first, fallback to network if not found
 */
async function cacheFirstStrategy(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('[Service Worker] Serving from cache:', request.url);
      return cachedResponse;
    }

    console.log('[Service Worker] Fetching from network:', request.url);
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[Service Worker] Fetch failed:', error);
    return offlineFallback(request);
  }
}

/**
 * Network First Strategy
 * Try network first, fallback to cache if offline
 */
async function networkFirstStrategy(request, cacheName) {
  try {
    console.log('[Service Worker] Network first:', request.url);
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[Service Worker] Network failed, trying cache:', request.url);
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return offlineFallback(request);
  }
}

/**
 * Stale While Revalidate Strategy
 * Return cached version immediately, update cache in background
 */
async function staleWhileRevalidateStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => {
    // Network failed, but we already returned cache
    console.log('[Service Worker] Background update failed:', request.url);
  });

  return cachedResponse || fetchPromise;
}

/**
 * Check if request is to API
 */
function isAPIRequest(url) {
  return API_PATTERNS.some(pattern => url.pathname.includes(pattern) || url.href.includes(pattern));
}

/**
 * Check if request is for data file
 */
function isDataFile(url) {
  return url.pathname.includes('/data/') && url.pathname.endsWith('.json');
}

/**
 * Offline Fallback
 * Return appropriate offline response
 */
function offlineFallback(request) {
  const url = new URL(request.url);
  
  // HTML pages
  if (request.destination === 'document') {
    return new Response(
      `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Offline - SOC Simulator</title>
        <style>
          body {
            font-family: 'Courier New', monospace;
            background: #0a0e27;
            color: #00ff41;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            text-align: center;
          }
          .offline-container {
            max-width: 500px;
            padding: 40px;
          }
          h1 {
            font-size: 48px;
            margin-bottom: 20px;
          }
          p {
            font-size: 18px;
            line-height: 1.6;
          }
          .retry-btn {
            background: #00ff41;
            color: #0a0e27;
            border: none;
            padding: 12px 30px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            margin-top: 20px;
            font-family: 'Courier New', monospace;
          }
          .retry-btn:hover {
            background: #00dd35;
          }
        </style>
      </head>
      <body>
        <div class="offline-container">
          <h1>🔌 Offline</h1>
          <p>You're currently offline. Some features may not be available.</p>
          <p>The SOC Simulator can work offline with cached data, but some real-time features require internet connection.</p>
          <button class="retry-btn" onclick="window.location.reload()">Retry</button>
        </div>
      </body>
      </html>`,
      {
        headers: { 'Content-Type': 'text/html' }
      }
    );
  }

  // JSON data
  if (request.destination === 'json' || url.pathname.endsWith('.json')) {
    return new Response(
      JSON.stringify({ error: 'Offline', message: 'This data is not available offline' }),
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  // Default fallback
  return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
}

/**
 * Background Sync Event
 * Sync data when connection is restored
 */
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag);
  
  if (event.tag === 'sync-game-data') {
    event.waitUntil(syncGameData());
  }
});

/**
 * Sync game data with server
 */
async function syncGameData() {
  try {
    // Get pending sync items from IndexedDB or localStorage
    // This would sync saved games, achievements, etc.
    console.log('[Service Worker] Syncing game data...');
    
    // Implement actual sync logic here
    // For now, just log
    return Promise.resolve();
  } catch (error) {
    console.error('[Service Worker] Sync failed:', error);
    throw error; // Retry later
  }
}

/**
 * Push Event
 * Handle push notifications
 */
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push received:', event);
  
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/manifest.json',
    badge: '/manifest.json',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'open',
        title: 'Open Game'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('SOC Simulator', options)
  );
});

/**
 * Notification Click Event
 */
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked:', event);
  
  event.notification.close();

  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/soc-dashboard.html')
    );
  }
});

/**
 * Message Event
 * Handle messages from clients
 */
self.addEventListener('message', (event) => {
  console.log('[Service Worker] Message received:', event.data);
  
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(event.data.urls);
      })
    );
  }
  
  if (event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_VERSION });
  }
});

console.log('[Service Worker] Loaded successfully');
