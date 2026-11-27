// Önce internetten al (güncel kalsın), yoksa önbellekten aç. Supabase istekleri önbelleğe alınmaz.
const CACHE = "gramermatik-online-v4";
const DOSYALAR = ["./", "index.html", "app.js", "bulut.js", "ekle.js", "ayar.js", "veri.js", "gramer.js", "cevaplar.js", "kod.js", "manifest.json", "ikon.svg"];
self.addEventListener("install", e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(DOSYALAR)).then(() => self.skipWaiting())));
self.addEventListener("activate", e => e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))).then(() => self.clients.claim())));
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.hostname.endsWith("supabase.co")) return;
  e.respondWith(fetch(e.request).then(r => { const k = r.clone(); caches.open(CACHE).then(c => c.put(e.request, k)); return r; }).catch(() => caches.match(e.request)));
});
