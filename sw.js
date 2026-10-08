/* Deja la app funcionando sin internet cuando se instala desde el navegador
   (iPhone). Responde con lo guardado y, si hay red, lo renueva para la
   próxima vez que se abra. En el APK no se usa. */
const CACHE = 'dinoentreno';
const ARCHIVOS = [
  './', 'index.html', 'estilos.css', 'datos.js', 'programas.js', 'ejecucion.js', 'figuras.js', 'motor.js', 'app.js', 'reloj.js', 'baraja.js', 'wods.js', 'crossfit.js',
  'manifest.webmanifest', 'iconos/icono-180.png', 'iconos/icono-192.png', 'iconos/icono-512.png',
  'fuentes/barlow-400.woff2', 'fuentes/barlow-600.woff2',
  'fuentes/barlowc-600.woff2', 'fuentes/barlowc-800.woff2',
  'fuentes/bitter.woff2', 'fuentes/oswald.woff2', 'fuentes/inter.woff2', 'fuentes/bebas-400.woff2', 'fuentes/rubik.woff2',
  'fuentes/archivoblack-400.woff2', 'fuentes/atkinson-400.woff2', 'fuentes/atkinson-700.woff2',
  'fuentes/plexcond-600.woff2', 'fuentes/plexcond-700.woff2', 'fuentes/plex.woff2', 'fuentes/cinzel.woff2',
  'fuentes/alegreya-400.woff2', 'fuentes/alegreya-700.woff2', 'fuentes/rajdhani-600.woff2', 'fuentes/rajdhani-700.woff2',
  'fuentes/exo2.woff2', 'fuentes/saira-stencil-400.woff2', 'fuentes/saira-400.woff2', 'fuentes/montserrat.woff2', 'fuentes/nunito.woff2',
];

// Las fotos de ejecución también quedan guardadas desde el principio.
importScripts('ejecucion.js');
const FOTOS = [...new Set(Object.values(EJECUCION).flat().map((x) => `ejecucion/${x[0]}.jpg`))];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll([...ARCHIVOS, ...FOTOS])).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.open(CACHE).then(async (c) => {
    const guardado = await c.match(e.request, { ignoreSearch: true });
    const red = fetch(e.request, { cache: 'no-cache' }).then((r) => {
      if (r.ok) c.put(e.request, r.clone());
      return r;
    }).catch(() => guardado);
    if (guardado) { e.waitUntil(red); return guardado; }
    return red;
  }));
});
