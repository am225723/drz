(() => {
  const fallbackMap = {
    '/headshot.jpeg': ['/headshot.jpg', '/headshot.png', '/headshot.webp', '/headshot.svg'],
    '/headshot.jpg': ['/headshot.jpeg', '/headshot.png', '/headshot.webp', '/headshot.svg'],
    '/logo.png': ['/logo.jpg', '/logo.jpeg', '/logo.webp', '/logo.svg']
  };

  function normalizePath(src) {
    try {
      return new URL(src, window.location.origin).pathname;
    } catch {
      return src;
    }
  }

  function attachFallback(img) {
    if (!img || img.dataset.fallbackAttached === 'true') return;
    const path = normalizePath(img.getAttribute('src') || '');
    const fallbacks = fallbackMap[path];
    if (!fallbacks) return;
    img.dataset.fallbackAttached = 'true';
    img.dataset.fallbackIndex = '0';
    img.addEventListener('error', () => {
      const index = Number(img.dataset.fallbackIndex || 0);
      const next = fallbacks[index];
      img.dataset.fallbackIndex = String(index + 1);
      if (next) {
        img.style.display = '';
        img.src = next;
      }
    });
  }

  function scanImages() {
    document.querySelectorAll('img').forEach(attachFallback);
  }

  const observer = new MutationObserver(scanImages);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scanImages);
  else scanImages();
})();
