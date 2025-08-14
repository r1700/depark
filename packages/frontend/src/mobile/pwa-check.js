// pwa-check.js
if ('serviceWorker' in navigator) {
  console.log('[PWA CHECK] Service Worker נתמך בדפדפן');
  navigator.serviceWorker.getRegistrations().then(regs => {
    if (regs.length > 0) {
      console.log(`[PWA CHECK] נמצא ${regs.length} service worker רשומים:`, regs);
    } else {
      console.warn('[PWA CHECK] לא נמצא Service Worker רשום');
    }
  });
} else {
  console.warn('[PWA CHECK] Service Worker לא נתמך בדפדפן');
}

fetch('/manifest.json')
  .then(res => {
    if (res.ok) {
      console.log('[PWA CHECK] manifest.json נטען בהצלחה');
      return res.json();
    } else {
      throw new Error('manifest.json לא נמצא');
    }
  })
  .then(data => console.log('[PWA CHECK] תוכן ה־manifest:', data))
  .catch(err => console.error('[PWA CHECK] בעיה עם manifest:', err));
