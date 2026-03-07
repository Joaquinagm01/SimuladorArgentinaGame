/**
 * Performance Optimizations
 * Lazy loading, critical CSS, font optimization, etc.
 */

/**
 * Lazy Load Images using Intersection Observer
 */
class LazyLoader {
  constructor(options = {}) {
    this.options = {
      root: null,
      rootMargin: '50px',
      threshold: 0.01,
      ...options
    };
    
    this.observer = null;
    this.init();
  }
  
  init() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        this.handleIntersection.bind(this),
        this.options
      );
      
      this.observe();
    } else {
      // Fallback for old browsers
      this.loadAll();
    }
  }
  
  observe() {
    const images = document.querySelectorAll('img[data-src], [data-bg], iframe[data-src]');
    images.forEach(element => {
      this.observer.observe(element);
    });
  }
  
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.loadElement(entry.target);
        this.observer.unobserve(entry.target);
      }
    });
  }
  
  loadElement(element) {
    if (element.tagName === 'IMG') {
      const src = element.dataset.src;
      if (src) {
        element.src = src;
        element.onload = () => {
          element.removeAttribute('data-src');
          element.setAttribute('data-loaded', 'true');
        };
      }
    } else if (element.dataset.bg) {
      element.style.backgroundImage = `url(${element.dataset.bg})`;
      element.removeAttribute('data-bg');
    } else if (element.tagName === 'IFRAME') {
      const src = element.dataset.src;
      if (src) {
        element.src = src;
        element.removeAttribute('data-src');
      }
    }
  }
  
  loadAll() {
    const elements = document.querySelectorAll('[data-src], [data-bg]');
    elements.forEach(element => this.loadElement(element));
  }
}

/**
 * Optimize Font Loading
 */
function optimizeFonts() {
  // Preload critical fonts
  const criticalFonts = [
    // Add your critical font URLs here
  ];
  
  criticalFonts.forEach(fontUrl => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    link.href = fontUrl;
    document.head.appendChild(link);
  });
  
  // Use Font Loading API if available
  if ('fonts' in document) {
    Promise.all([
      // document.fonts.load('1em CustomFont'),
    ]).then(() => {
      document.documentElement.classList.add('fonts-loaded');
    });
  }
}

/**
 * Defer Non-Critical Scripts
 */
function deferNonCriticalScripts() {
  const scripts = [
    // Add non-critical script URLs here
  ];
  
  scripts.forEach(src => {
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    document.body.appendChild(script);
  });
}

/**
 * Prefetch Important Resources
 */
function prefetchResources() {
  const resources = [
    { href: '/data/frameworks.json', as: 'fetch' },
    { href: '/data/quiz.json', as: 'fetch' },
    { href: '/data/flashcards.json', as: 'fetch' },
    { href: '/data/careers.json', as: 'fetch' }
  ];
  
  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = resource.href;
    link.as = resource.as;
    document.head.appendChild(link);
  });
}

/**
 * Optimize Third-Party Scripts
 */
function optimizeThirdPartyScripts() {
  // Load analytics only when idle
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      // Load Google Analytics, etc.
      console.log('Loading third-party scripts...');
    });
  } else {
    setTimeout(() => {
      console.log('Loading third-party scripts...');
    }, 2000);
  }
}

/**
 * Reduce JavaScript Execution Time
 */
function optimizeJavaScript() {
  // Debounce scroll events
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (scrollTimeout) {
      window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = window.requestAnimationFrame(() => {
      // Handle scroll
    });
  }, { passive: true });
  
  // Throttle resize events
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Handle resize
    }, 150);
  });
}

/**
 * Optimize Images
 */
function optimizeImages() {
  // Convert images to WebP if supported
  const supportsWebP = document.createElement('canvas')
    .toDataURL('image/webp')
    .indexOf('data:image/webp') === 0;
  
  if (supportsWebP) {
    document.documentElement.classList.add('webp-supported');
  }
  
  // Add loading="lazy" to images
  const images = document.querySelectorAll('img:not([loading])');
  images.forEach(img => {
    if (!img.getAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }
  });
}

/**
 * Critical CSS Inlining
 * (This should be done at build time, but including as example)
 */
function inlineCriticalCSS() {
  const criticalCSS = `
    /* Critical CSS that affects above-the-fold content */
    body {
      margin: 0;
      font-family: 'Courier New', monospace;
      background: #0a0e27;
      color: #00ff41;
    }
  `;
  
  // This would typically be done at build time
  // For now, just a placeholder
}

/**
 * Reduce Initial Bundle Size
 */
function implementCodeSplitting() {
  // Dynamic imports for large features
  const loadQuizSystem = () => import('./educational-content.js');
  const loadFrameworks = () => import('./educational-content.js');
  
  // Load when needed
  // Example: When user clicks on quiz button
  document.addEventListener('click', (e) => {
    if (e.target.matches('.quiz-btn')) {
      loadQuizSystem();
    }
  });
}

/**
 * Measure Performance
 */
function measurePerformance() {
  if ('performance' in window && 'PerformanceObserver' in window) {
    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    
    // First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        console.log('FID:', entry.processingStart - entry.startTime);
      });
    });
    fidObserver.observe({ type: 'first-input', buffered: true });
    
    // Cumulative Layout Shift
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      console.log('CLS:', clsValue);
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });
  }
  
  // Navigation Timing
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      const connectTime = perfData.responseEnd - perfData.requestStart;
      const renderTime = perfData.domComplete - perfData.domLoading;
      
      console.log('📊 Performance Metrics:');
      console.log('  Page Load Time:', pageLoadTime + 'ms');
      console.log('  Connect Time:', connectTime + 'ms');
      console.log('  Render Time:', renderTime + 'ms');
      
      // Send to analytics
      sendPerformanceMetrics({
        pageLoadTime,
        connectTime,
        renderTime
      });
    }, 0);
  });
}

/**
 * Send performance metrics to analytics
 */
function sendPerformanceMetrics(metrics) {
  // Send to your analytics service
  console.log('Sending metrics:', metrics);
  
  // Example with Beacon API
  if ('sendBeacon' in navigator) {
    const data = JSON.stringify(metrics);
    navigator.sendBeacon('/api/analytics', data);
  }
}

/**
 * Reduce Memory Usage
 */
function optimizeMemory() {
  // Remove event listeners on hidden/inactive elements
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // Pause animations, clear intervals, etc.
      console.log('Page hidden, optimizing memory...');
    } else {
      console.log('Page visible, resuming...');
    }
  });
  
  // Clean up when navigating away
  window.addEventListener('pagehide', () => {
    // Clear caches, cancel requests, etc.
    console.log('Cleaning up before navigation...');
  });
}

/**
 * Optimize Network Requests
 */
function optimizeNetwork() {
  // Use HTTP/2 Server Push (configured on server)
  
  // Combine API requests
  const batchRequests = async (urls) => {
    return Promise.all(urls.map(url => fetch(url)));
  };
  
  // Use Resource Hints
  const preconnectToAPI = () => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = 'http://localhost:8080';
    document.head.appendChild(link);
  };
  
  preconnectToAPI();
}

/**
 * Initialize Performance Optimizations
 */
function initPerformanceOptimizations() {
  console.log('🚀 Initializing performance optimizations...');
  
  // Lazy load images
  new LazyLoader();
  
  // Optimize fonts
  optimizeFonts();
  
  // Optimize images
  optimizeImages();
  
  // Optimize JavaScript
  optimizeJavaScript();
  
  // Prefetch resources
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      prefetchResources();
      optimizeThirdPartyScripts();
    });
  } else {
    setTimeout(() => {
      prefetchResources();
      optimizeThirdPartyScripts();
    }, 1000);
  }
  
  // Optimize network
  optimizeNetwork();
  
  // Optimize memory
  optimizeMemory();
  
  // Measure performance
  measurePerformance();
  
  console.log('✅ Performance optimizations initialized');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPerformanceOptimizations);
} else {
  initPerformanceOptimizations();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    LazyLoader,
    optimizeFonts,
    optimizeImages,
    measurePerformance
  };
}
