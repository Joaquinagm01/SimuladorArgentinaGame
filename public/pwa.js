/**
 * PWA Registration and Install Prompt
 */

let deferredPrompt;
let swRegistration;

/**
 * Register Service Worker
 */
async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      swRegistration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      
      console.log('✅ Service Worker registered:', swRegistration.scope);
      
      // Check for updates
      swRegistration.addEventListener('updatefound', () => {
        const newWorker = swRegistration.installing;
        console.log('🔄 Service Worker update found');
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New service worker available
            showUpdateNotification();
          }
        });
      });
      
      // Check for updates on page load
      if (swRegistration.waiting) {
        showUpdateNotification();
      }
      
    } catch (error) {
      console.error('❌ Service Worker registration failed:', error);
    }
  } else {
    console.log('⚠️ Service Workers not supported');
  }
}

/**
 * Show update notification when new version is available
 */
function showUpdateNotification() {
  const updateBanner = document.createElement('div');
  updateBanner.className = 'pwa-update-banner';
  updateBanner.innerHTML = `
    <div class="pwa-update-content">
      <span>🔄 New version available!</span>
      <button onclick="updateServiceWorker()" class="pwa-update-btn">Update</button>
      <button onclick="this.parentElement.parentElement.remove()" class="pwa-dismiss-btn">Later</button>
    </div>
  `;
  document.body.appendChild(updateBanner);
}

/**
 * Update Service Worker
 */
function updateServiceWorker() {
  if (swRegistration && swRegistration.waiting) {
    swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
    window.location.reload();
  }
}

/**
 * Handle Install Prompt Event
 */
window.addEventListener('beforeinstallprompt', (event) => {
  console.log('💾 Install prompt available');
  
  // Prevent automatic prompt
  event.preventDefault();
  
  // Save for later
  deferredPrompt = event;
  
  // Show custom install button
  showInstallButton();
});

/**
 * Show Install Button
 */
function showInstallButton() {
  // Check if already shown or dismissed
  const dismissed = localStorage.getItem('pwa-install-dismissed');
  const installed = localStorage.getItem('pwa-installed');
  
  if (dismissed || installed) {
    return;
  }
  
  // Create install prompt UI
  const installPrompt = document.createElement('div');
  installPrompt.className = 'pwa-install-prompt';
  installPrompt.innerHTML = `
    <div class="pwa-install-content">
      <div class="pwa-install-icon">🛡️</div>
      <div class="pwa-install-text">
        <h3>Install SOC Simulator</h3>
        <p>Install this app for offline access and better performance</p>
      </div>
      <div class="pwa-install-actions">
        <button onclick="installPWA()" class="pwa-install-btn">Install</button>
        <button onclick="dismissInstallPrompt()" class="pwa-dismiss-btn">Not Now</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(installPrompt);
  
  // Auto-show after 30 seconds if not interacted
  setTimeout(() => {
    if (installPrompt.parentElement) {
      installPrompt.classList.add('pwa-install-prompt-show');
    }
  }, 30000);
}

/**
 * Install PWA
 */
async function installPWA() {
  if (!deferredPrompt) {
    console.log('⚠️ Install prompt not available');
    return;
  }
  
  // Show install prompt
  deferredPrompt.prompt();
  
  // Wait for user choice
  const { outcome } =  await deferredPrompt.userChoice;
  console.log(`Install prompt outcome: ${outcome}`);
  
  if (outcome === 'accepted') {
    console.log('✅ PWA installed');
    localStorage.setItem('pwa-installed', 'true');
  }
  
  // Remove prompt
  removeInstallPrompt();
  
  // Clear deferred prompt
  deferredPrompt = null;
}

/**
 * Dismiss Install Prompt
 */
function dismissInstallPrompt() {
  localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  removeInstallPrompt();
}

/**
 * Remove Install Prompt from DOM
 */
function removeInstallPrompt() {
  const prompt = document.querySelector('.pwa-install-prompt');
  if (prompt) {
    prompt.remove();
  }
}

/**
 * Handle App Installed Event
 */
window.addEventListener('appinstalled', () => {
  console.log('✅ PWA installed successfully');
  localStorage.setItem('pwa-installed', 'true');
  removeInstallPrompt();
  
  // Show success message
  showToast('App installed successfully! 🎉');
});

/**
 * Show Toast Notification
 */
function showToast(message, duration = 3000) {
  const toast = document.createElement('div');
  toast.className = 'pwa-toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('pwa-toast-show');
  }, 100);
  
  setTimeout(() => {
    toast.classList.remove('pwa-toast-show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/**
 * Check if running as PWA
 */
function isPWA() {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true;
}

/**
 * Request Push Notification Permission
 */
async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.log('⚠️ Notifications not supported');
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
}

/**
 * Show local notification
 */
function showNotification(title, options = {}) {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/manifest.json',
      badge: '/manifest.json',
      ...options
    });
  }
}

/**
 * Check for updates periodically
 */
function checkForUpdates() {
  if (swRegistration) {
    swRegistration.update();
  }
}

/**
 * Initialize PWA Features
 */
function initPWA() {
  // Register service worker
  registerServiceWorker();
  
  // Show install prompt if appropriate
  setTimeout(() => {
    if (deferredPrompt && !isPWA()) {
      showInstallButton();
    }
  }, 5000);
  
  // Check for updates every 60 seconds
  setInterval(checkForUpdates, 60000);
  
  // Show PWA status
  if (isPWA()) {
    console.log('✅ Running as installed PWA');
    document.body.classList.add('pwa-installed');
  }
  
  // Track PWA engagement
  if (isPWA()) {
    // Analytics or tracking code here
    console.log('📊 PWA engagement tracked');
  }
}

/**
 * Handle online/offline events
 */
window.addEventListener('online', () => {
  console.log('🌐 Back online');
  showToast('Connection restored ✅');
  
  // Sync data if needed
  if ('sync' in swRegistration) {
    swRegistration.sync.register('sync-game-data');
  }
});

window.addEventListener('offline', () => {
  console.log('🔌 Gone offline');
  showToast('You are offline. Some features may be limited.');
});

/**
 * Handle visibility change (for background sync)
 */
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && swRegistration) {
    checkForUpdates();
  }
});

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPWA);
} else {
  initPWA();
}

// Expose functions globally
window.installPWA = installPWA;
window.dismissInstallPrompt = dismissInstallPrompt;
window.updateServiceWorker = updateServiceWorker;
window.requestNotificationPermission = requestNotificationPermission;
window.showNotification = showNotification;
