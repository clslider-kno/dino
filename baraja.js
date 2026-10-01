/* Baraja: juego de entrenamiento con un naipe inglés. Cada pinta es un
   ejercicio, el número de la carta son las repeticiones, las figuras valen
   15 (o lo que se configure) y los ases y comodines tienen su propio
   ejercicio. La voz va dictando cada carta para poder dejar el teléfono a un
   lado; en el APK la dicta un servicio de Android que sigue hablando con la
   pantalla apagada. Se carga después de reloj.js. */

const CLAVE_BARAJA = 'dinosaurio.baraja';

const PINTAS = [
  { id: 'picas', simbolo: '♠', nombre: 'picas', color: 'negro' },
  { id: 'corazones', simbolo: '♥', nombre: 'corazones', color: 'rojo' },
  { id: 'diamantes', simbolo: '♦', nombre: 'diamantes', color: 'rojo' },
  { id: 'treboles', simbolo: '♣', nombre: 'tréboles', color: 'negro' },
];
const PINTA = Object.fromEntries(PINTAS.map(p => [p.id, p]));

const NOMBRE_RANGO = { A: 'As', J: 'Jota', Q: 'Reina', K: 'Rey' };

const TAMANOS = [
  { id: 'cuarto', nombre: '¼ de baraja', parte: 1 / 4 },
  { id: 'media', nombre: '½ baraja', parte: 1 / 2 },
  { id: 'completa', nombre: 'Baraja completa', parte: 1 },
];

const TEMAS_NAIPE = [
  { id: 'clasica', nombre: 'Clásica' },
  { id: 'casino', nombre: 'Casino' },
  { id: 'vintage', nombre: 'Vintage' },
  { id: 'neon', nombre: 'Neón' },
  { id: 'minimal', nombre: 'Minimal' },
  { id: 'acero', nombre: 'Acero' },
  { id: 'pizarra', nombre: 'Pizarra' },
  { id: 'jurasica', nombre: 'Jurásica' },
  { id: 'dorada', nombre: 'Dorada' },
  { id: 'pop', nombre: 'Pop' },
];

function configBase() {
  return {
    pintas: { picas: 'flexiones', corazones: 'sentadilla_libre', diamantes: 'sit_up', treboles: 'burpees' },
    figuras: 15,
    ases: { activo: true, ej: 'escaladores', reps: 20 },
    comodines: { activo: true, ej: 'saltos_estrella', reps: 30 },
    segs: {},          // segundos por repetición de cada ejercicio
    descanso: 5,
    cuenta: 10,
    tamano: 'completa',
    tema: 'clasica',
  };
}

function cargarBaraja() {
  const c = configBase();
  try {
    const g = JSON.parse(localStorage.getItem(CLAVE_BARAJA));
    if (g) {
      Object.assign(c, g, {
        pintas: { ...c.pintas, ...(g.pintas || {}) },
        ases: { ...c.ases, ...(g.ases || {}) },
        comodines: { ...c.comodines, ...(g.comodines || {}) },
        segs: { ...(g.segs || {}) },
      });
      delete c.segRep;   // antes había un solo tiempo para todos
    }
  } catch (e) { /* sin datos */ }
  // Un ejercicio que ya no existe vuelve al de base.
  const base = configBase();
  for (const p of PINTAS) if (!ejercicio(c.pintas[p.id])) c.pintas[p.id] = base.pintas[p.id];
  if (!ejercicio(c.ases.ej)) c.ases.ej = base.ases.ej;
  if (!ejercicio(c.comodines.ej)) c.comodines.ej = base.comodines.ej;
  return c;
}

/* Tiempo por repetición de partida: cada ejercicio tiene su ritmo. */
const SEG_BASE = {
  escaladores: 1, saltos_estrella: 1, cuerda: 1,
  flexiones: 3, sentadilla_libre: 3, sit_up: 3, flexion_lateral: 2, elev_piernas: 3,
  dominadas: 4, dominadas_supinas: 4, dominadas_toalla: 4, dips: 3,
  burpees: 5, turca: 20, rueda: 4, rueda_pie: 5, pallof: 4, pull_apart: 2, dominadas_banda: 4,
};

function segDe(id) {
  return cfg.segs[id] || SEG_BASE[id] || 3;
}

const cfg = cargarBaraja();

function guardarBaraja() {
  try { localStorage.setItem(CLAVE_BARAJA, JSON.stringify(cfg)); } catch (e) { /* sin almacenamiento */ }
}

/* ---------------- mazo ---------------- */

function mazoCompleto() {
  const m = [];
  for (const p of PINTAS) {
    for (const r of ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']) {
      const figura = 'JQK'.includes(r);
      m.push({ pinta: p.id, rango: r, ej: cfg.pintas[p.id], reps: figura ? cfg.figuras : +r });
    }
    if (cfg.ases.activo) m.push({ pinta: p.id, rango: 'A', ej: cfg.ases.ej, reps: cfg.ases.reps });
  }
  if (cfg.comodines.activo) {
    m.push({ pinta: 'comodin', rango: '★', ej: cfg.comodines.ej, reps: cfg.comodines.reps, color: 'negro' });
    m.push({ pinta: 'comodin', rango: '★', ej: cfg.comodines.ej, reps: cfg.comodines.reps, color: 'rojo' });
  }
  return m;
}

/* Al azar de verdad: el generador criptográfico del teléfono, y
   Fisher-Yates para que ninguna carta se repita. */
function azarHasta(n) {
  const a = new Uint32Array(1);
  crypto.getRandomValues(a);
  return a[0] % n;
}

function barajar(lista) {
  const m = [...lista];
  for (let i = m.length - 1; i > 0; i--) {
    const j = azarHasta(i + 1);
    [m[i], m[j]] = [m[j], m[i]];
  }
  return m;
}

function cartasDelJuego() {
  const todo = mazoCompleto();
  const parte = (TAMANOS.find(t => t.id === cfg.tamano) || TAMANOS[2]).parte;
  return barajar(todo).slice(0, Math.max(1, Math.round(todo.length * parte)));
}

const colorDe = c => c.color || (PINTA[c.pinta] ? PINTA[c.pinta].color : 'negro');
const nombreEj = id => (ejercicio(id) || { nombre: id }).nombre;
const minuscula = t => t.charAt(0).toLowerCase() + t.slice(1);

function nombreCarta(c) {
  if (c.pinta === 'comodin') return 'Comodín';
  return `${NOMBRE_RANGO[c.rango] || c.rango} de ${PINTA[c.pinta].nombre}`;
}

/* Cómo se dice cada ejercicio en voz alta: en plural y corto, para que
   suene «20 sentadillas» y no «20 repeticiones de sentadillas sin peso». */
const NOMBRE_HABLADO = {
  sentadilla_libre: 'sentadillas', flexiones: 'flexiones', sit_up: 'abdominales', burpees: 'burpees',
  escaladores: 'escaladores', saltos_estrella: 'saltos de estrella',
  sent: 'sentadillas traseras', sent_abajo: 'sentadillas desde abajo', sent_frontal: 'sentadillas frontales',
  cuarto_sent: 'cuartos de sentadilla', zancadas_maletas: 'zancadas con maletas', talones: 'elevaciones de talones',
  pm_trap: 'pesos muertos con barra hexagonal', pm: 'pesos muertos', pm_parcial: 'pesos muertos parciales',
  pm_maletas: 'pesos muertos con maletas', pm_rumano: 'pesos muertos rumanos', buenos_dias: 'buenos días',
  press_pie: 'press militar', press_frente: 'press desde la frente', cargada_press: 'cargadas y press',
  push_press: 'push press', press_banca: 'press de banca', press_banca_abajo: 'press de banca desde abajo',
  press_banca_parcial: 'press de banca parcial', press_cerrado: 'press de banca cerrado', floor_press: 'press desde el suelo',
  dips: 'fondos', fondos_anillas: 'fondos en anillas', remo_anillas: 'remos en anillas', dominadas: 'dominadas', dominadas_toalla: 'dominadas con toalla', dominadas_supinas: 'dominadas supinas',
  remo: 'remos con barra', remo_cuello: 'remos al cuello', encog_trap: 'encogimientos', encog_maletas: 'encogimientos con maletas',
  log_press: 'cargadas y press con el tronco', log_clean: 'cargadas del tronco', log_hombro: 'troncos al hombro',
  log_sent: 'sentadillas con el tronco', log_carry: 'pasos con el tronco', farmer_maletas: 'pasos del granjero',
  farmer_trap: 'pasos del granjero', maleta_una: 'pasos con una maleta', colgado: 'segundos colgado',
  sosten_maletas: 'segundos de sostén', sosten_trap: 'segundos de sostén', pinza: 'segundos de pinza',
  curl: 'curls con barra', curl_inv: 'curls invertidos', elev_piernas: 'elevaciones de piernas',
  flexion_lateral: 'flexiones laterales', giro_barra: 'giros con barra', turca: 'levantadas turcas',
  cuello_arnes: 'extensiones de cuello', cuello_arnes_sosten: 'segundos de sostén de cuello', cuello_disco: 'flexiones de cuello',
  jalon_larga: 'jalones', jalon_cerrado: 'jalones cerrados', remo_cerrado: 'remos en polea', remo_cuello_polea: 'remos al cuello en polea',
  remo_larga: 'remos en polea con barra larga', curl_cuerda: 'curls con cuerda', curl_martillo_cuerda: 'curls martillo',
  curl_polea: 'curls en polea', triceps_cuerda: 'extensiones de tríceps', triceps_barra: 'extensiones de tríceps con barra',
  face_pull: 'face pulls', thruster: 'thrusters', cargada: 'cargadas', arranque: 'arranques', ohs: 'sentadillas overhead',
  hspu: 'flexiones de pino', muscle_up: 'muscle-ups', correr: 'segundos corriendo', swing_disco: 'swings', salto_cajon: 'saltos al cajón', pistol: 'pistols', crunch_polea: 'crunches con cuerda', pull_through: 'pull-throughs', remo_v: 'remos con agarre en V', jalon_v: 'jalones con agarre en V', triceps_v: 'extensiones de tríceps', patada_gluteo: 'patadas de glúteo', curl_femoral_pie: 'curls femorales', abduccion_polea: 'abducciones', aduccion_polea: 'aducciones', elev_rodilla_polea: 'elevaciones de rodilla', rueda: 'ruedas abdominales', rueda_pie: 'ruedas abdominales de pie', pallof: 'press Pallof', pull_apart: 'separaciones de banda', dominadas_banda: 'dominadas con banda', pm_bandas: 'pesos muertos con banda', cuerda: 'saltos de cuerda',
};

function nombreHablado(id) {
  return NOMBRE_HABLADO[id] || minuscula(nombreEj(id));
}

/* Lo que dice la voz por cada carta: solo cuántas y qué. */
function anuncio(c) {
  return c.reps === 1 ? `Una vez: ${minuscula(nombreEj(c.ej))}.` : `${c.reps} ${nombreHablado(c.ej)}.`;
}

/* ---------------- dibujo del naipe ---------------- */

const L_ = 28, C_ = 50, R_ = 72;
const PIPS = {
  2: [[C_, 15], [C_, 85]],
  3: [[C_, 15], [C_, 50], [C_, 85]],
  4: [[L_, 15], [R_, 15], [L_, 85], [R_, 85]],
  5: [[L_, 15], [R_, 15], [C_, 50], [L_, 85], [R_, 85]],
  6: [[L_, 15], [R_, 15], [L_, 50], [R_, 50], [L_, 85], [R_, 85]],
  7: [[L_, 15], [R_, 15], [C_, 32], [L_, 50], [R_, 50], [L_, 85], [R_, 85]],
  8: [[L_, 15], [R_, 15], [C_, 32], [L_, 50], [R_, 50], [C_, 68], [L_, 85], [R_, 85]],
  9: [[L_, 15], [R_, 15], [L_, 38], [R_, 38], [C_, 50], [L_, 62], [R_, 62], [L_, 85], [R_, 85]],
  10: [[L_, 15], [R_, 15], [C_, 27], [L_, 38], [R_, 38], [L_, 62], [R_, 62], [C_, 73], [L_, 85], [R_, 85]],
};

function naipe(c, tema, clase) {
  const pinta = PINTA[c.pinta];
  const simbolo = pinta ? pinta.simbolo : '★';
  const rango = c.pinta === 'comodin' ? '★' : c.rango;
  let centro;
  if (PIPS[c.rango]) {
    centro = PIPS[c.rango].map(([x, y]) =>
      `<span class="pip ${y > 50 ? 'girado' : ''}" style="left:${x}%;top:${y}%">${svgFigura(c.ej)}</span>`).join('');
  } else if ('JQK'.includes(c.rango)) {
    centro = `<div class="marco"><span class="letra-grande">${c.rango}</span>${svgFigura(c.ej, 'figura-cara')}<span class="letra-grande girado">${c.rango}</span></div>`;
  } else if (c.rango === 'A') {
    centro = `<span class="pip as" style="left:50%;top:50%">${svgFigura(c.ej)}</span>`;
  } else {
    centro = `<div class="comodin"><span>COMODÍN</span>${svgFigura(c.ej, 'figura-cara')}</div>`;
  }
  const esquina = `<span class="rango">${rango}</span><span class="simbolo">${simbolo}</span>`;
  return `<div class="naipe ${clase || ''}" data-naipe="${tema}" data-color="${colorDe(c)}">
      <div class="esquina sup">${esquina}</div>
      <div class="cara">${centro}</div>
      <div class="esquina inf">${esquina}</div>
    </div>`;
}

/* ---------------- línea de tiempo ---------------- */

/* Tramos del juego: cuenta atrás, y por cada carta un descanso previo (desde
   la segunda) y el tiempo de la carta. Todo en milisegundos desde el inicio. */
function armarTramos(cartas) {
  const t = [];
  let x = 0;
  if (cfg.cuenta > 0) { t.push({ tipo: 'cuenta', ini: x, dur: cfg.cuenta * 1000 }); x += cfg.cuenta * 1000; }
  cartas.forEach((c, i) => {
    if (i > 0 && cfg.descanso > 0) { t.push({ tipo: 'descanso', ini: x, dur: cfg.descanso * 1000, carta: i }); x += cfg.descanso * 1000; }
    const dur = Math.max(1, c.reps * segDe(c.ej)) * 1000;
    t.push({ tipo: 'carta', ini: x, dur, carta: i });
    x += dur;
  });
  return { tramos: t, total: x };
}

const NUMEROS = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez'];

/* Lo que dice la voz y los pitidos: [ms desde el inicio, tipo, frase]. */
function avisosVoz(cartas, tramos, total) {
  const v = [];
  const decir = (ms, frase) => v.push([ms, 4, frase]);
  const pitar = ms => v.push([ms, 0, '']);
  if (cfg.cuenta > 0) {
    const n = cfg.cuenta;
    decir(0, n > 10 ? `Prepárate. Comenzamos en ${n} segundos.` : `Prepárate. Comenzamos en ${NUMEROS[n]}.`);
    for (let k = Math.min(n - 1, 10); k >= 1; k--) decir((n - k) * 1000, NUMEROS[k]);
  }
  for (const tr of tramos) {
    const c = cartas[tr.carta];
    if (tr.tipo === 'descanso') {
      decir(tr.ini, `Descanso. Lo que viene: ${anuncio(c)}`);
      for (let k = 3; k >= 1; k--) if (tr.dur - k * 1000 > 3500) pitar(tr.ini + tr.dur - k * 1000);
    } else if (tr.tipo === 'carta') {
      const primera = tr.carta === 0;
      const conDescanso = !primera && cfg.descanso > 0;
      decir(tr.ini, conDescanso ? '¡Vamos!' : `${primera ? '¡Comenzamos! ' : ''}${anuncio(c)}`);
    }
  }
  decir(total, '¡Baraja terminada! Buen trabajo.');
  return v;
}

/* ---------------- juego ---------------- */

const juego = { cartas: [], tramos: [], total: 0, inicio: 0, pausado: 0, corriendo: false, terminado: false, tic: null, hechos: new Set() };

const VOZ_NATIVA = !!(window.Android && Android.programarVoz);

function hablarNavegador(frase) {
  if (!window.speechSynthesis) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(frase);
  u.lang = 'es-CL';
  const voz = speechSynthesis.getVoices().find(x => /^es/i.test(x.lang));
  if (voz) u.voice = voz;
  speechSynthesis.speak(u);
}

function programarVozDesde(corrido) {
  const avisos = avisosVoz(juego.cartas, juego.tramos, juego.total).filter(a => a[0] >= corrido - 50);
  juego.avisos = avisos;
  juego.hechos = new Set();
  if (!VOZ_NATIVA || !avisos.length) return;
  const base = Date.now() - corrido;
  Android.programarVoz(
    avisos.map(a => base + a[0]).join(','),
    avisos.map(a => a[1]).join(','),
    JSON.stringify(avisos.map(a => a[2])),
    `Baraja: ${juego.cartas.length} cartas`);
}

function corridoJuego() {
  return juego.corriendo ? Date.now() - juego.inicio : juego.pausado;
}

function tramoActual(ms) {
  for (const t of juego.tramos) if (ms < t.ini + t.dur) return t;
  return null;
}

function comenzarBaraja() {
  if (typeof detenerReloj === 'function' && (reloj.corriendo || reloj.pausado)) detenerReloj();
  contextoAudio();
  juego.cartas = cartasDelJuego();
  Object.assign(juego, armarTramos(juego.cartas));
  juego.terminado = false;
  juego.pausado = 0;
  $('#juego').hidden = false;
  document.body.style.overflow = 'hidden';
  girar(true);
  seguirBaraja();
}

function seguirBaraja() {
  const corrido = juego.pausado || 0;
  juego.inicio = Date.now() - corrido;
  juego.pausado = 0;
  juego.corriendo = true;
  pantallaEncendida(true);
  programarVozDesde(corrido);
  clearInterval(juego.tic);
  juego.tic = setInterval(avanzarBaraja, 200);
  pintarJuego();
}

function pausarBaraja() {
  juego.pausado = corridoJuego();
  juego.corriendo = false;
  clearInterval(juego.tic);
  if (VOZ_NATIVA) Android.cancelarTemporizador();
  else if (window.speechSynthesis) speechSynthesis.cancel();
  pantallaEncendida(false);
  pintarJuego();
}

/* Saltar: el reloj del juego avanza hasta el comienzo del tramo siguiente. */
function saltarCarta() {
  const ms = corridoJuego();
  const t = tramoActual(ms);
  if (!t) return;
  const destino = t.ini + t.dur;
  if (juego.corriendo) {
    juego.inicio -= destino - ms;
    programarVozDesde(destino);
    if (!VOZ_NATIVA && window.speechSynthesis) speechSynthesis.cancel();
  } else {
    juego.pausado = destino;
  }
  pintarJuego();
}

function terminarBaraja(completa) {
  clearInterval(juego.tic);
  if (juego.corriendo && !completa) {
    if (VOZ_NATIVA) Android.cancelarTemporizador();
    else if (window.speechSynthesis) speechSynthesis.cancel();
  }
  juego.pausado = Math.min(corridoJuego(), juego.total);
  juego.corriendo = false;
  juego.terminado = true;
  pantallaEncendida(false);
  pintarJuego();
}

function cerrarJuego() {
  if (juego.corriendo) {
    if (VOZ_NATIVA) Android.cancelarTemporizador();
    else if (window.speechSynthesis) speechSynthesis.cancel();
  }
  clearInterval(juego.tic);
  juego.corriendo = false;
  pantallaEncendida(false);
  $('#juego').hidden = true;
  document.body.style.overflow = '';
  girar(false);
}

function avanzarBaraja() {
  const ms = corridoJuego();
  // En el navegador la voz la pone la página.
  if (!VOZ_NATIVA && juego.avisos) {
    juego.avisos.forEach((a, i) => {
      if (a[0] <= ms && !juego.hechos.has(i)) {
        juego.hechos.add(i);
        if (ms - a[0] < 1500) a[1] === 4 ? hablarNavegador(a[2]) : pitido(120, false);
      }
    });
  }
  if (ms >= juego.total) { terminarBaraja(true); return; }
  pintarJuegoVivo(ms);
}

/* Lo que cambia cada instante (números y barra) sin redibujar el naipe. */
function pintarJuegoVivo(ms) {
  const t = tramoActual(ms);
  if (!t) return;
  if (juego.tramoPintado !== t) { pintarJuego(); return; }
  const queda = Math.ceil((t.ini + t.dur - ms) / 1000);
  const n = $('#j-segundos');
  if (n) n.textContent = t.tipo === 'carta' ? mmss(queda) : queda;
  const b = $('#j-barra');
  if (b) b.style.width = `${Math.max(0, (t.ini + t.dur - ms) / t.dur) * 100}%`;
  const total = $('#j-total');
  if (total) total.textContent = mmss((juego.total - ms) / 1000);
}

function pintarJuego() {
  const caja = $('#juego');
  caja.dataset.mesa = cfg.tema;
  if (juego.terminado) { pintarFinal(); return; }
  const ms = corridoJuego();
  const t = tramoActual(ms);
  juego.tramoPintado = t;
  if (!t) return;
  const marcha = juego.corriendo ? 'Pausa' : 'Seguir';
  const arriba = `
    <div class="j-arriba">
      <span>${t.tipo === 'cuenta' ? `${juego.cartas.length} cartas` : `Carta ${t.carta + 1} de ${juego.cartas.length}`} · queda <b id="j-total">${mmss((juego.total - ms) / 1000)}</b></span>
      <button class="cerrar" id="j-cerrar" aria-label="Terminar">${ICONOS.cerrar}</button>
    </div>`;
  let medio;
  if (t.tipo === 'cuenta') {
    medio = `<div class="j-cuenta"><span class="j-titulo">Comenzamos en</span><b id="j-segundos" class="j-grande">${Math.ceil((t.ini + t.dur - ms) / 1000)}</b>
      <span class="j-sub">Primera carta: ${esc(nombreCarta(juego.cartas[0]))} · ${juego.cartas[0].reps} ${esc(nombreEj(juego.cartas[0].ej))}</span></div>`;
  } else {
    const c = juego.cartas[t.carta];
    const descanso = t.tipo === 'descanso';
    const sig = juego.cartas[t.carta + 1];
    medio = `
      <div class="j-mesa ${descanso ? 'en-descanso' : ''}">
        ${descanso ? '<span class="j-titulo">Descanso · lo que viene</span>' : ''}
        ${naipe(c, cfg.tema, 'grande')}
        <div class="j-orden"><b>${c.reps}</b> ${esc(nombreEj(c.ej))}</div>
        <div class="j-tiempo"><span id="j-segundos">${descanso ? Math.ceil((t.ini + t.dur - ms) / 1000) : mmss((t.ini + t.dur - ms) / 1000)}</span><div class="r-pista"><i id="j-barra"></i></div></div>
        ${!descanso && sig ? `<p class="j-sub">Después: ${esc(nombreCarta(sig))} · ${sig.reps} ${esc(nombreEj(sig.ej))}</p>` : ''}
        ${!descanso && tieneEjecucion(c.ej) ? botonEjecucion(c.ej) : ''}
      </div>`;
  }
  caja.innerHTML = `${arriba}${medio}
    <div class="j-botones">
      <button class="boton sobrio" id="j-saltar">Saltar</button>
      <button class="boton principal" id="j-marcha">${marcha}</button>
    </div>`;
  $('#j-cerrar').addEventListener('click', () => terminarBaraja(false));
  $('#j-saltar').addEventListener('click', saltarCarta);
  $('#j-marcha').addEventListener('click', () => juego.corriendo ? pausarBaraja() : seguirBaraja());
  pintarJuegoVivo(ms);
}

function pintarFinal() {
  const ms = juego.pausado;
  const hechas = juego.cartas.filter((c, i) => {
    const t = juego.tramos.find(x => x.tipo === 'carta' && x.carta === i);
    return t && ms >= t.ini + t.dur;
  });
  const porEj = {};
  for (const c of hechas) porEj[c.ej] = (porEj[c.ej] || 0) + c.reps;
  const completa = hechas.length === juego.cartas.length;
  $('#juego').innerHTML = `
    <div class="j-final">
      <span class="j-titulo">${completa ? '¡Baraja terminada!' : 'Juego terminado'}</span>
      <b class="j-grande">${hechas.length}<small>/${juego.cartas.length}</small></b>
      <span class="j-sub">cartas completas · ${mmss(Math.min(ms, juego.total) / 1000)} de juego</span>
      <div class="j-resumen">${Object.entries(porEj).map(([id, n]) =>
        `<div>${svgFigura(id)}<span>${esc(nombreEj(id))}</span><b>${n}</b></div>`).join('') || '<p class="j-sub">Ninguna carta completa.</p>'}</div>
      <div class="j-botones">
        <button class="boton sobrio" id="j-volver">Volver</button>
        <button class="boton principal" id="j-registrar" ${hechas.length ? '' : 'disabled'}>Registrar</button>
      </div>
    </div>`;
  $('#j-volver').addEventListener('click', cerrarJuego);
  $('#j-registrar').addEventListener('click', () => {
    const ids = [...new Set(hechas.map(c => c.ej))];
    cerrarJuego();
    nuevoBorrador(ids);
    borrador.nota = `Baraja: ${hechas.length} cartas. ${Object.entries(porEj).map(([id, n]) => `${nombreEj(id)} ${n}`).join(', ')}.`;
    mostrar('registrar');
    avisar('Revisa y guarda el entrenamiento.');
  });
}

/* ---------------- configuración ---------------- */

/* Todos los ejercicios (también los propios) en orden alfabético. */
function opcionesEjercicio(sel) {
  return [...EJERCICIOS, ...datos.propios]
    .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' }))
    .map(e => `<option value="${esc(e.id)}" ${e.id === sel ? 'selected' : ''}>${esc(e.nombre)}</option>`).join('');
}

function contador(clave, valor, unidad, paso, min, max) {
  return `<div class="b-contador">
      <button data-cont="${clave},${-paso},${min},${max}" aria-label="Menos">−</button>
      <b>${String(valor).replace('.', ',')}${unidad ? ' ' + unidad : ''}</b>
      <button data-cont="${clave},${paso},${min},${max}" aria-label="Más">+</button>
    </div>`;
}

/* Lee o escribe un valor de la configuración con una ruta como "ases.reps". */
function valorCfg(ruta, nuevo) {
  const partes = ruta.split('.');
  let o = cfg;
  while (partes.length > 1) o = o[partes.shift()];
  if (nuevo !== undefined) o[partes[0]] = nuevo;
  return o[partes[0]];
}

function resumenJuego() {
  const todo = mazoCompleto();
  const parte = (TAMANOS.find(t => t.id === cfg.tamano) || TAMANOS[2]).parte;
  const n = Math.max(1, Math.round(todo.length * parte));
  const segMedio = todo.reduce((t, c) => t + c.reps * segDe(c.ej), 0) / todo.length;
  const seg = cfg.cuenta + n * segMedio + (n - 1) * cfg.descanso;
  return { n, de: todo.length, min: Math.round(seg / 60) };
}

/* Contador de segundos por repetición de un ejercicio (de medio en medio). */
function lineaSegundos(id) {
  return `<div class="b-linea b-seg"><span>Segundos por repetición</span>${contador('segs.' + id, segDe(id), 's', 0.5, 0.5, 60)}</div>`;
}

function pintarBaraja() {
  for (const id of [...Object.values(cfg.pintas), cfg.ases.ej, cfg.comodines.ej]) cfg.segs[id] = segDe(id);
  const r = resumenJuego();
  const muestra = { pinta: 'corazones', rango: '7', ej: cfg.pintas.corazones, reps: 7 };
  const fila = (titulo, ruta, activo) => `
    <div class="b-especial ${activo ? '' : 'apagado'}">
      <label class="b-check"><input type="checkbox" data-activo="${ruta}" ${activo ? 'checked' : ''}> ${titulo}</label>
      <select data-ej="${ruta}.ej" ${activo ? '' : 'disabled'}>${opcionesEjercicio(valorCfg(ruta + '.ej'))}</select>
      ${activo ? `<div class="b-linea"><span>Repeticiones</span>${contador(ruta + '.reps', valorCfg(ruta + '.reps'), '', 1, 1, 100)}</div>
        ${lineaSegundos(valorCfg(ruta + '.ej'))}` : '<p class="b-nota">Fuera del juego.</p>'}
    </div>`;
  $('#v-baraja').innerHTML = `
    <h2>Baraja</h2>
    <p class="intro">Un naipe inglés barajado al azar: cada pinta es un ejercicio y cada carta dice cuántas repeticiones. La voz dicta cada carta, así que puedes dejar el teléfono a un lado (también con la pantalla apagada).</p>

    <div class="b-muestra">${naipe(muestra, cfg.tema)}</div>
    <h3>Tema de la baraja</h3>
    <div class="selector b-temas">${TEMAS_NAIPE.map(t =>
      `<button data-tema-naipe="${t.id}" class="${cfg.tema === t.id ? 'activo' : ''}">${t.nombre}</button>`).join('')}</div>

    <h3>Un ejercicio por pinta</h3>
    <p class="b-nota">Del 2 al 10, la carta dice las repeticiones. La figura de la carta toma la forma del ejercicio. Cada ejercicio tiene su propio tiempo por repetición.</p>
    ${PINTAS.map(p => `
      <div class="b-bloque">
      <div class="b-pinta">
        <span class="b-simbolo" data-color="${p.color}">${p.simbolo}</span>
        <span class="b-fig">${svgFigura(cfg.pintas[p.id])}</span>
        <select data-ej="pintas.${p.id}" aria-label="Ejercicio de ${p.nombre}">${opcionesEjercicio(cfg.pintas[p.id])}</select>
        ${tieneEjecucion(cfg.pintas[p.id]) ? `<button class="ver-ej" data-ver="${cfg.pintas[p.id]}" aria-label="Ejecución">${ICONOS.play}</button>` : ''}
      </div>
      ${lineaSegundos(cfg.pintas[p.id])}
      </div>`).join('')}
    <div class="b-linea"><span>J, Q y K valen</span>${contador('figuras', cfg.figuras, 'rep.', 1, 1, 100)}</div>

    <h3>Ases y comodines</h3>
    ${fila('Ases (los 4)', 'ases', cfg.ases.activo)}
    ${fila('Comodines (2)', 'comodines', cfg.comodines.activo)}

    <h3>Ritmo</h3>
    <div class="b-linea"><span>Descanso entre cartas</span>${contador('descanso', cfg.descanso, 's', 5, 0, 120)}</div>
    <div class="b-linea"><span>Cuenta atrás para empezar</span>${contador('cuenta', cfg.cuenta, 's', 5, 0, 60)}</div>

    <h3>Cuántas cartas</h3>
    <div class="selector">${TAMANOS.map(t => `<button data-tamano="${t.id}" class="${cfg.tamano === t.id ? 'activo' : ''}">${t.nombre}</button>`).join('')}</div>
    <p class="b-nota">${r.n} de ${r.de} cartas, sin repetirse · unos ${r.min} minutos.</p>

    <button class="boton sobrio ancho separado" id="b-probar-voz">Probar la voz</button>
    <button class="boton-grande separado" id="b-comenzar">
      <span><strong>Comenzar</strong><small>${r.n} cartas · cuenta atrás de ${cfg.cuenta} s</small></span>
      ${ICONOS.flecha}
    </button>`;

  const repintar = () => { guardarBaraja(); pintarBaraja(); };
  document.querySelectorAll('[data-tema-naipe]').forEach(b => b.addEventListener('click', () => { cfg.tema = b.dataset.temaNaipe; repintar(); }));
  document.querySelectorAll('[data-tamano]').forEach(b => b.addEventListener('click', () => { cfg.tamano = b.dataset.tamano; repintar(); }));
  document.querySelectorAll('select[data-ej]').forEach(s => s.addEventListener('change', () => { valorCfg(s.dataset.ej, s.value); repintar(); }));
  document.querySelectorAll('[data-activo]').forEach(c => c.addEventListener('change', () => { valorCfg(c.dataset.activo + '.activo', c.checked); repintar(); }));
  document.querySelectorAll('[data-cont]').forEach(b => b.addEventListener('click', () => {
    const [ruta, d, mi, ma] = b.dataset.cont.split(',');
    valorCfg(ruta, Math.round(Math.min(+ma, Math.max(+mi, valorCfg(ruta) + +d)) * 2) / 2);
    repintar();
  }));
  $('#b-probar-voz').addEventListener('click', () => {
    const f = `${anuncio({ pinta: 'corazones', rango: '7', ej: cfg.pintas.corazones, reps: 7 })}`;
    if (window.Android && Android.decir) Android.decir(f); else hablarNavegador(f);
  });
  $('#b-comenzar').addEventListener('click', comenzarBaraja);
}

/* El botón atrás termina el juego (y desde el resumen, lo cierra). */
const atrasAntesDeBaraja = window.volverAtras;
window.volverAtras = function () {
  if (!$('#visor').hidden) return atrasAntesDeBaraja();
  if (!$('#juego').hidden) { juego.terminado ? cerrarJuego() : terminarBaraja(false); return true; }
  return atrasAntesDeBaraja();
};

document.addEventListener('visibilitychange', () => { if (!document.hidden && juego.corriendo) avanzarBaraja(); });
