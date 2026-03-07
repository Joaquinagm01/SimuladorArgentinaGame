# PWA Implementation Guide

## 🎯 Overview
Complete documentation of the Progressive Web App (PWA) implementation for the SOC Simulator, enabling installation, offline functionality, and native app-like experience.

---

## 🏗️ Architecture

### Components
```
public/
├── manifest.json          # PWA manifest (app metadata)
├── sw.js                  # Service Worker (caching & offline)
├── pwa.js                 # PWA registration & install logic
├── pwa-styles.css         # PWA UI components
└── soc-dashboard.html     # Main app (PWA integration)
```

### Flow Diagram
```
User Visits → Register SW → Cache Assets → Show Install Prompt
     ↓              ↓              ↓                ↓
  Page Load    Background    Offline Ready    User Installs
     ↓              ↓              ↓                ↓
  Content     Update Check   Network Fallback   Standalone App
```

---

## 📄 Web App Manifest

### Location
`public/manifest.json`

### Purpose
Defines app metadata, icons, display mode, and capabilities for installation.

### Key Properties

#### Basic Info
```json
{
  "name": "Cyber Defense Simulator - SOC Training",
  "short_name": "SOC Simulator",
  "description": "Interactive cybersecurity training game...",
  "start_url": "/soc-dashboard.html"
}
```

#### Display & Theme
```json
{
  "display": "standalone",       // Fullscreen app mode
  "orientation": "any",          // Portrait or landscape
  "theme_color": "#00ff41",      // Browser UI color (matrix green)
  "background_color": "#0a0e27"  // Splash screen background
}
```

#### Icons
- **10 icons** in multiple sizes (72px to 512px)
- **SVG format** (scalable, small size)
- **Maskable icons** for Android adaptive icons (192px, 512px)
- **Purpose**: Any (normal) and Maskable (adaptive)

```json
{
  "icons": [
    {
      "src": "data:image/svg+xml,...",
      "sizes": "192x192",
      "type": "image/svg+xml",
      "purpose": "maskable"
    }
  ]
}
```

#### Screenshots
For app store listings and install prompts:
```json
{
  "screenshots": [
    {
      "src": "data:image/svg+xml,...",
      "sizes": "800x600",
      "type": "image/svg+xml",
      "form_factor": "wide"
    }
  ]
}
```

#### Shortcuts
Quick actions from home screen or app icon:
```json
{
  "shortcuts": [
    {
      "name": "Start New Game",
      "short_name": "New Game",
      "description": "Start a new SOC training game",
      "url": "/soc-dashboard.html",
      "icons": [{ "src": "...", "sizes": "192x192" }]
    }
  ]
}
```

#### Share Target
Receive shares from other apps:
```json
{
  "share_target": {
    "action": "/share",
    "method": "POST",
    "enctype": "multipart/form-data",
    "params": {
      "title": "title",
      "text": "text",
      "url": "url"
    }
  }
}
```

#### Categories
For app store classification:
```json
{
  "categories": ["education", "games", "productivity"]
}
```

### Best Practices
- ✅ Include multiple icon sizes (192px and 512px minimum)
- ✅ Use maskable icons for Android adaptive icons
- ✅ Set appropriate display mode (standalone for app-like)
- ✅ Choose meaningful theme color that matches brand
- ✅ Add shortcuts for common actions
- ✅ Include screenshots for better install prompts

---

## ⚙️ Service Worker

### Location
`public/sw.js`

### Purpose
Handles caching, offline functionality, background sync, and push notifications.

### Cache Strategy

#### Static Assets (Cache First)
```javascript
// Try cache first, fallback to network
cacheFirstStrategy(request, CACHE_NAME)
```

**Use case**: HTML, CSS, JS files
**Benefit**: Instant loading, works offline

#### API Requests (Network First)
```javascript
// Try network first, fallback to cache
networkFirstStrategy(request, CACHE_NAME)
```

**Use case**: API endpoints
**Benefit**: Fresh data when online, cached fallback

#### Data Files (Stale While Revalidate)
```javascript
// Return cache immediately, update in background
staleWhileRevalidateStrategy(request, DATA_CACHE_NAME)
```

**Use case**: JSON data files
**Benefit**: Instant response + fresh updates

### Event Handlers

#### Install Event
```javascript
self.addEventListener('install', (event) => {
  // 1. Open caches
  // 2. Pre-cache critical assets
  // 3. Skip waiting (activate immediately)
});
```

**Triggered**: When SW is first installed or updated
**Purpose**: Pre-cache critical assets

#### Activate Event
```javascript
self.addEventListener('activate', (event) => {
  // 1. Delete old caches
  // 2. Claim all clients
  // 3. Start controlling immediately
});
```

**Triggered**: After install, when SW takes control
**Purpose**: Clean up old versions

#### Fetch Event
```javascript
self.addEventListener('fetch', (event) => {
  // Route request to appropriate strategy
  if (isAPIRequest) return networkFirst();
  if (isDataFile) return staleWhileRevalidate();
  return cacheFirst();
});
```

**Triggered**: Every network request from page
**Purpose**: Intercept and cache/serve requests

#### Sync Event
```javascript
self.addEventListener('sync', (event) => {
  // Sync data when connection restored
  if (event.tag === 'sync-game-data') {
    event.waitUntil(syncGameData());
  }
});
```

**Triggered**: When connection restored
**Purpose**: Background data synchronization

#### Push Event
```javascript
self.addEventListener('push', (event) => {
  // Show push notification
  const options = {
    body: event.data.text(),
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    vibrate: [200, 100, 200]
  };
  self.registration.showNotification(title, options);
});
```

**Triggered**: When push message received
**Purpose**: Display push notifications

#### Notification Click
```javascript
self.addEventListener('notificationclick', (event) => {
  // Handle notification click
  event.notification.close();
  clients.openWindow('/soc-dashboard.html');
});
```

**Triggered**: When user clicks notification
**Purpose**: Navigate to specific page

#### Message Event
```javascript
self.addEventListener('message', (event) => {
  // Handle messages from page
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
```

**Triggered**: Messages from page via postMessage
**Purpose**: Control SW lifecycle

### Offline Fallback

#### HTML Pages
Returns styled offline page with retry button:
```html
<div style="...">
  <h1>🔌 You're Offline</h1>
  <p>Please check your connection</p>
  <button onclick="location.reload()">Retry</button>
</div>
```

#### JSON Data
Returns error object:
```json
{
  "error": "Offline",
  "message": "Please check your internet connection"
}
```

### Cache Management

#### Versioning
```javascript
const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `soc-simulator-${CACHE_VERSION}`;
```

**Update process**:
1. Change CACHE_VERSION
2. Deploy new SW
3. Old caches automatically deleted
4. New assets cached

#### Never Cache
```javascript
const NEVER_CACHE = ['sw.js', 'service-worker.js'];
```

Prevents SW from caching itself (would prevent updates).

---

## 📱 PWA Registration & UI

### Location
`public/pwa.js`

### Purpose
Register Service Worker, manage install prompt, handle updates, track PWA state.

### Key Functions

#### Service Worker Registration
```javascript
async function registerServiceWorker() {
  const registration = await navigator.serviceWorker.register('/sw.js', {
    scope: '/'  // Control all pages
  });
  
  // Listen for updates
  registration.addEventListener('updatefound', () => {
    showUpdateNotification();
  });
}
```

**When**: On page load
**Purpose**: Activate Service Worker

#### Install Prompt
```javascript
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();  // Don't show browser's prompt
  deferredPrompt = e;  // Save for later
  
  // Show custom prompt after 30 seconds
  setTimeout(() => showInstallButton(), 30000);
});
```

**Trigger**: When PWA install criteria met
**Purpose**: Custom install experience

#### Custom Install UI
```javascript
function showInstallButton() {
  // Check if already dismissed/installed
  if (localStorage.getItem('pwa-install-dismissed')) return;
  if (localStorage.getItem('pwa-installed')) return;
  
  // Create purple gradient prompt card
  const prompt = createInstallPrompt();
  document.body.appendChild(prompt);
}
```

**When**: 30 seconds after page load
**Purpose**: User-friendly install prompt

#### Install Flow
```javascript
async function installPWA() {
  // Show native prompt
  deferredPrompt.prompt();
  
  // Wait for user choice
  const { outcome } = await deferredPrompt.userChoice;
  
  if (outcome === 'accepted') {
    localStorage.setItem('pwa-installed', 'true');
    showToast('App installed successfully! 🎉');
  }
  
  deferredPrompt = null;
}
```

**Trigger**: User clicks Install button
**Purpose**: Complete installation

#### Update Notification
```javascript
function showUpdateNotification() {
  // Create orange banner at top
  const banner = `
    <div class="pwa-update-banner">
      🔄 New version available!
      <button onclick="updateServiceWorker()">Update</button>
    </div>
  `;
  document.body.insertAdjacentHTML('afterbegin', banner);
}

function updateServiceWorker() {
  // Tell SW to skip waiting
  swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
  
  // Reload page to activate new version
  window.location.reload();
}
```

**Trigger**: When new SW detected
**Purpose**: Notify user of updates

#### PWA Detection
```javascript
function isPWA() {
  // Check if running as installed app
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
}
```

**Purpose**: Conditional behavior for installed app

#### Online/Offline Detection
```javascript
window.addEventListener('online', () => {
  showToast('Connection restored ✅');
  
  // Trigger background sync
  if ('serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype) {
    navigator.serviceWorker.ready.then(reg => {
      reg.sync.register('sync-game-data');
    });
  }
});

window.addEventListener('offline', () => {
  showToast('You are offline. Some features may be limited.');
  document.body.classList.add('offline');
});
```

**Purpose**: Inform user of connection status

#### Update Checker
```javascript
// Check for updates every 60 seconds
setInterval(() => {
  if (swRegistration) {
    swRegistration.update();
  }
}, 60000);
```

**Purpose**: Keep app up to date

---

## 🎨 PWA UI Styles

### Location
`public/pwa-styles.css`

### Components

#### Install Prompt
**Design**: Purple gradient card at bottom
**Animation**: Slide up from bottom after 1s
**Content**: Icon, title, description, Install/Dismiss buttons
**Responsive**: Stacks vertically on mobile

```css
.pwa-install-prompt {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  animation: slideUpPWA 0.5s ease-out 1s both;
}
```

#### Update Banner
**Design**: Orange bar at top
**Animation**: Slide down from top
**Content**: Message, Update/Later buttons
**Responsive**: Vertical stack on mobile

```css
.pwa-update-banner {
  position: fixed;
  top: 0;
  width: 100%;
  background: #ed8936;
  animation: slideDownBanner 0.3s ease-out;
}
```

#### Toast Notifications
**Design**: Dark semi-transparent bottom-center
**Animation**: Fade in + slide up
**Duration**: 3 seconds (customizable)
**Max Width**: 400px

```css
.pwa-toast {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.9);
  padding: 16px 24px;
  border-radius: 8px;
}
```

#### Loading Skeletons
**Design**: Shimmer animation for lazy loading
**Variants**: Text, heading, button, card
**Animation**: 1.5s infinite gradient movement

```css
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s ease-in-out infinite;
}
```

#### Offline Indicator
**Design**: Red bar at top when offline
**Animation**: Slide down when connection lost
**Trigger**: body.offline class added

```css
.offline-indicator {
  position: fixed;
  top: 0;
  width: 100%;
  background: #f56565;
  transform: translateY(-100%);
  transition: transform 0.3s ease;
}

body.offline .offline-indicator {
  transform: translateY(0);
}
```

### Accessibility Features

#### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

#### High Contrast
```css
@media (prefers-contrast: high) {
  .pwa-install-prompt,
  .pwa-update-banner {
    border: 2px solid currentColor;
  }
}
```

#### Dark Mode
```css
@media (prefers-color-scheme: dark) {
  .skeleton {
    background: linear-gradient(90deg, #2a2a2a 25%, #1a1a1a 50%, #2a2a2a 75%);
  }
}
```

#### PWA Display Mode
```css
@media (display-mode: standalone) {
  .pwa-install-prompt {
    display: none; /* Already installed */
  }
  
  body {
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
  }
}
```

---

## 🔗 HTML Integration

### Location
`public/soc-dashboard.html`

### Meta Tags

#### Primary
```html
<meta name="title" content="Cyber Defense Simulator - SOC Training">
<meta name="description" content="Interactive cybersecurity training game...">
<meta name="keywords" content="cybersecurity, SOC, security operations...">
<meta name="author" content="SOC Simulator Team">
```

#### Open Graph (Facebook)
```html
<meta property="og:type" content="website">
<meta property="og:url" content="https://your-app.vercel.app/">
<meta property="og:title" content="Cyber Defense Simulator">
<meta property="og:description" content="Learn cybersecurity...">
<meta property="og:image" content="preview-image.png">
```

#### Twitter Card
```html
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="https://your-app.vercel.app/">
<meta property="twitter:title" content="Cyber Defense Simulator">
<meta property="twitter:description" content="Learn cybersecurity...">
<meta property="twitter:image" content="preview-image.png">
```

#### PWA
```html
<meta name="theme-color" content="#00ff41">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="SOC Simulator">
```

#### Viewport
```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
```

### Links
```html
<!-- Manifest -->
<link rel="manifest" href="/manifest.json">

<!-- Icons -->
<link rel="apple-touch-icon" href="/icon-192.png">
<link rel="icon" type="image/svg+xml" href="/icon.svg">

<!-- Styles -->
<link rel="stylesheet" href="pwa-styles.css">

<!-- Preconnect -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="dns-prefetch" href="https://fonts.googleapis.com">
```

### Scripts
```html
<!-- PWA (load first) -->
<script src="pwa.js"></script>

<!-- Performance Optimizations -->
<script src="performance.js"></script>

<!-- Other scripts... -->
```

### UI Elements
```html
<!-- Offline Indicator -->
<div class="offline-indicator">
  🔌 You are offline. Some features may be limited.
</div>
```

---

## ✅ Installation Criteria

### Browser Requirements
For the install prompt to appear, app must meet:

1. **Served over HTTPS** (or localhost)
2. **Has a Web App Manifest** with:
   - `name` or `short_name`
   - `icons` (192px and 512px)
   - `start_url`
   - `display` (standalone, fullscreen, or minimal-ui)
3. **Has a Service Worker** registered
4. **Service Worker has a fetch event handler**
5. **User engagement** (visited at least twice, with at least 30 seconds between visits)

### Browser Support

#### Desktop
- ✅ Chrome 72+
- ✅ Edge 79+
- ⚠️ Firefox (limited, no install prompt)
- ⚠️ Safari (limited PWA support)

#### Mobile
- ✅ Chrome for Android
- ✅ Samsung Internet
- ✅ Safari iOS 11.3+ (limited)
- ⚠️ Firefox Android (limited)

---

## 🧪 Testing

### Local Testing
```bash
# Serve with HTTPS (required for PWA)
npx serve -s public --ssl-cert cert.pem --ssl-key key.pem

# Or use localhost (HTTPS not required)
npx serve -s public
```

### Chrome DevTools

#### Application Panel
1. **Manifest**: Verify manifest loads correctly
2. **Service Workers**: Check registration status
3. **Cache Storage**: Inspect cached assets
4. **Clear Storage**: Test fresh install

#### Lighthouse
1. Run Lighthouse audit
2. Check PWA score (should be 100)
3. Review installability
4. Verify offline functionality

### Manual Testing Checklist
- [ ] Install prompt appears
- [ ] App installs successfully
- [ ] Shortcuts work from home screen
- [ ] App opens in standalone mode
- [ ] Theme color applies correctly
- [ ] Offline mode works
- [ ] Update notification appears
- [ ] Background sync works
- [ ] Push notifications work (if implemented)

### Test Offline Mode
1. Open app when online
2. Open DevTools → Network tab
3. Check "Offline" checkbox
4. Reload page
5. Verify app still works
6. Check cached assets load

### Test Update Flow
1. Install app
2. Update CACHE_VERSION in sw.js
3. Deploy new version
4. Open installed app
5. Verify update notification appears
6. Click Update button
7. Verify new version loads

---

## 🚀 Deployment

### Build Process
```bash
# 1. Update cache version
# sw.js: CACHE_VERSION = 'v1.0.1'

# 2. Update manifest version
# manifest.json: "version": "1.0.1"

# 3. Test locally
npm run test

# 4. Deploy to server
vercel deploy --prod
```

### Vercel Configuration
```json
{
  "headers": [
    {
      "source": "/sw.js",
      "headers": [
        {
          "key": "Service-Worker-Allowed",
          "value": "/"
        },
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    },
    {
      "source": "/manifest.json",
      "headers": [
        {
          "key": "Content-Type",
          "value": "application/manifest+json"
        }
      ]
    }
  ]
}
```

### Post-Deployment Checklist
- [ ] Manifest loads at /manifest.json
- [ ] Service Worker registers successfully
- [ ] Install criteria met
- [ ] HTTPS enabled
- [ ] Icons load correctly
- [ ] Lighthouse PWA score 100
- [ ] Test on real devices

---

## 🛠️ Maintenance

### Updating the App

#### Minor Updates (Bug fixes, content)
1. Make changes to code
2. Deploy (SW will auto-update)
3. Users get update notification
4. No CACHE_VERSION change needed

#### Major Updates (Breaking changes)
1. Make changes to code
2. Update CACHE_VERSION in sw.js
3. Deploy
4. Old caches deleted
5. New assets cached
6. Users get update notification

### Monitoring
```javascript
// Track PWA metrics
navigator.serviceWorker.ready.then(reg => {
  reg.active.postMessage({
    type: 'GET_CACHE_SIZE'
  });
});

// Track install success rate
window.addEventListener('appinstalled', () => {
  analytics.track('PWA Installed');
});
```

---

## 📚 Resources

### Documentation
- [PWA Guide (web.dev)](https://web.dev/progressive-web-apps/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Workbox (SW Library)](https://developers.google.com/web/tools/workbox)

### Tools
- [PWA Builder](https://www.pwabuilder.com/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Maskable.app (Icon Generator)](https://maskable.app/)
- [Favicon Generator](https://realfavicongenerator.net/)

### Examples
- [PWABuilder Samples](https://github.com/pwa-builder/pwa-starter)
- [Service Worker Cookbook](https://serviceworke.rs/)
- [Google PWA Examples](https://github.com/GoogleChrome/samples/tree/gh-pages/service-worker)

---

## 🎯 Success Metrics

### Installation
- **Install Rate**: % of eligible users who install
- **Install Prompt CTR**: % who click Install vs Dismiss
- **Retention**: % who keep app installed after 7/30 days

### Engagement
- **DAU/MAU**: Daily/Monthly Active Users
- **Session Duration**: Time spent in app
- **Return Rate**: % of users who return

### Performance
- **Offline Usage**: % of sessions that go offline
- **Cache Hit Rate**: % of requests served from cache
- **Update Success**: % of users on latest version

### Target Metrics
- Install Rate: > 20%
- 7-Day Retention: > 40%
- Cache Hit Rate: > 80%
- Lighthouse PWA Score: 100

---

**Last Updated**: 2024
**Status**: ✅ PWA Fully Implemented
**Version**: 1.0.0
