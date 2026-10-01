/* Visor de ejecución (fotos paso a paso) y temporizador a pantalla completa
   con cuenta atrás, cronómetro y tábata. Se carga después de app.js. */

/* ---------------- ejecución ---------------- */

const visor = { id: null, paso: 0, auto: null };

function tieneEjecucion(id) { return !!EJECUCION[id]; }

function botonEjecucion(id) {
  return tieneEjecucion(id)
    ? `<button class="boton-ejecucion" data-ver="${esc(id)}">${ICONOS.play} Ejecución</button>`
    : '';
}

/* Los botones se pintan en muchas pantallas: un solo escuchador para todos. */
document.addEventListener('click', ev => {
  const b = ev.target.closest('[data-ver]');
  if (!b) return;
  ev.preventDefault();
  ev.stopPropagation();
  abrirEjecucion(b.dataset.ver);
}, true);

function abrirEjecucion(id) {
  visor.id = id;
  visor.paso = 0;
  $('#visor').hidden = false;
  pintarVisor();
}

function cerrarEjecucion() {
  clearInterval(visor.auto);
  visor.auto = null;
  $('#visor').hidden = true;
}

function pintarVisor() {
  const ej = ejercicio(visor.id);
  const pasos = EJECUCION[visor.id];
  const [foto, texto] = pasos[visor.paso];
  $('#visor').innerHTML = `
    <div class="visor-arriba">
      <div><span class="visor-equipo">${esc(ej.equipo)}</span><h3>${esc(ej.nombre)}</h3></div>
      <div class="visor-acciones">
        <button class="visor-reloj" id="v-reloj" aria-label="Temporizador">${ICONOS.reloj}<span id="v-tiempo"></span></button>
        <button class="cerrar" id="v-cerrar" aria-label="Cerrar">${ICONOS.cerrar}</button>
      </div>
    </div>
    <div class="visor-foto" id="v-foto">
      <img src="ejecucion/${foto}.jpg" alt="Paso ${visor.paso + 1}">
      ${pasos.length > 1 ? `<span class="visor-num">${visor.paso + 1} / ${pasos.length}</span>` : ''}
    </div>
    ${pasos.length > 1 ? `<div class="visor-puntos">${pasos.map((_, i) =>
      `<button data-paso="${i}" class="${i === visor.paso ? 'activo' : ''}" aria-label="Paso ${i + 1}"></button>`).join('')}</div>` : ''}
    <p class="visor-texto"><b>${visor.paso + 1}.</b> ${esc(texto)}</p>
    ${ej.tip ? `<p class="kubik visor-tip">${esc(ej.tip)}</p>` : ''}
    <div class="visor-botones">
      <button class="boton sobrio" id="v-ant" ${visor.paso === 0 ? 'disabled' : ''}>Anterior</button>
      ${pasos.length > 1 ? `<button class="boton sobrio" id="v-auto">${visor.auto ? 'Pausa' : 'Animar'}</button>` : ''}
      <button class="boton principal" id="v-sig">${visor.paso === pasos.length - 1 ? 'Listo' : 'Siguiente'}</button>
    </div>
    <p class="visor-fuente">Fotos: free-exercise-db (dominio público).</p>`;
  $('#v-cerrar').addEventListener('click', cerrarEjecucion);
  $('#v-reloj').addEventListener('click', abrirReloj);
  pintarMiniReloj();
  $('#v-ant').addEventListener('click', () => irPaso(visor.paso - 1));
  $('#v-sig').addEventListener('click', () => visor.paso === pasos.length - 1 ? cerrarEjecucion() : irPaso(visor.paso + 1));
  const auto = $('#v-auto');
  if (auto) auto.addEventListener('click', () => {
    if (visor.auto) { clearInterval(visor.auto); visor.auto = null; }
    else visor.auto = setInterval(() => irPaso((visor.paso + 1) % pasos.length, true), 1600);
    pintarVisor();
  });
  document.querySelectorAll('[data-paso]').forEach(b => b.addEventListener('click', () => irPaso(+b.dataset.paso)));
  // Deslizar el dedo sobre la foto cambia de paso.
  let x0 = null;
  const f = $('#v-foto');
  f.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  f.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) irPaso(visor.paso + (dx < 0 ? 1 : -1));
    x0 = null;
  });
}

function irPaso(n, desdeAuto) {
  const total = EJECUCION[visor.id].length;
  if (n < 0 || n >= total) return;
  if (!desdeAuto && visor.auto) { clearInterval(visor.auto); visor.auto = null; }
  visor.paso = n;
  pintarVisor();
}

/* ---------------- sonido y alarma ---------------- */

let audio = null;
function contextoAudio() {
  if (!audio) {
    try { audio = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; }
  }
  if (audio.state === 'suspended') audio.resume();
  return audio;
}

/* Un pitido. En el APK lo hace el teléfono por el canal de alarma, que suena
   fuerte aunque el volumen multimedia esté bajo; en el navegador, con Web Audio. */
function pitido(ms, agudo) {
  if (window.Android && Android.pitido) { Android.pitido(ms, !!agudo); return; }
  const ctx = contextoAudio();
  if (!ctx) return;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'square';
  o.frequency.value = agudo ? 1760 : 1046;
  g.gain.setValueAtTime(0.9, ctx.currentTime);
  g.gain.setValueAtTime(0, ctx.currentTime + ms / 1000);
  o.connect(g).connect(ctx.destination);
  o.start();
  o.stop(ctx.currentTime + ms / 1000 + 0.02);
}

function vibrar(patron) {
  if (window.Android && Android.vibrar) Android.vibrar(patron.join(','));
  else if (navigator.vibrate) navigator.vibrate(patron);
}

/* Alarma final: ráfagas de pitidos y vibración hasta que se toque la pantalla
   (o 60 segundos). */
let alarmaActiva = null;
function sonarAlarma() {
  pararAlarma(true);
  $('#reloj').classList.add('sonando');
  if (NATIVO) { alarmaActiva = setInterval(() => {}, 60e3); setTimeout(() => { if (alarmaActiva) pararAlarma(); }, 60e3); return; }
  let n = 0;
  const rafaga = () => {
    [0, 180, 360].forEach(t => setTimeout(() => pitido(140, true), t));
    vibrar([500, 200, 500]);
    if (++n >= 60) pararAlarma();
  };
  rafaga();
  alarmaActiva = setInterval(rafaga, 1000);
  $('#reloj').classList.add('sonando');
}

function pararAlarma(sinAvisar) {
  const sonaba = !!alarmaActiva;
  if (alarmaActiva) clearInterval(alarmaActiva);
  alarmaActiva = null;
  $('#reloj').classList.remove('sonando');
  if (!sinAvisar && (sonaba || !NATIVO) && window.Android && Android.pararAlarma) Android.pararAlarma();
}

/* En el APK, los avisos los toca un servicio de Android que sigue sonando con
   la pantalla apagada; la página solo muestra los números. */
const NATIVO = !!(window.Android && Android.programarTemporizador);
const AVISO = { corto: 0, trabajo: 1, descanso: 2, fin: 3 };

/* Lista de avisos desde ahora: pitidos de los últimos 3 segundos, cambios de
   fase del tábata y la alarma final. */
function avisosDesde(ahora) {
  const corrido = (ahora - reloj.inicio) / 1000;
  const lista = [];
  const agregar = (seg, tipo) => { if (seg > corrido) lista.push([reloj.inicio + Math.round(seg * 1000), tipo]); };
  const ultimos3 = finSeg => { for (let k = 3; k >= 1; k--) agregar(finSeg - k, AVISO.corto); };
  if (reloj.modo === 'cuenta') {
    ultimos3(reloj.cuenta);
    agregar(reloj.cuenta, AVISO.fin);
  } else if (reloj.modo === 'tabata') {
    let t = 0;
    const fases = fasesTabata();
    fases.forEach((f, i) => {
      if (i > 0) agregar(t, f.fase === 'trabajo' ? AVISO.trabajo : AVISO.descanso);
      t += f.dur;
      if (i < fases.length - 1) ultimos3(t);
    });
    ultimos3(t);
    agregar(t, AVISO.fin);
  }
  return lista;
}

function programarNativo() {
  if (!NATIVO || reloj.modo === 'crono') return;
  const avisos = avisosDesde(Date.now());
  if (!avisos.length) return;
  const titulo = reloj.modo === 'tabata' ? `Tábata: ${reloj.rondas} rondas de ${reloj.trabajo} s` : `Cuenta atrás de ${mmss(reloj.cuenta)}`;
  Android.programarTemporizador(avisos.map(a => a[0]).join(','), avisos.map(a => a[1]).join(','), titulo);
}

function cancelarNativo() { if (NATIVO) Android.cancelarTemporizador(); }

/* ---------------- temporizador ---------------- */

const CLAVE_RELOJ = 'dinosaurio.reloj';
const reloj = cargarReloj();
let tic = null;
let wakeLock = null;

function cargarReloj() {
  const base = { modo: 'cuenta', cuenta: 90, prep: 10, trabajo: 20, descanso: 10, rondas: 8 };
  try { Object.assign(base, JSON.parse(localStorage.getItem(CLAVE_RELOJ)) || {}); } catch (e) { /* sin datos */ }
  return { ...base, corriendo: false, fin: 0, inicio: 0, pausado: 0, fase: null, ronda: 0, terminado: false, ultimoSeg: null };
}

function guardarReloj() {
  const { modo, cuenta, prep, trabajo, descanso, rondas } = reloj;
  try { localStorage.setItem(CLAVE_RELOJ, JSON.stringify({ modo, cuenta, prep, trabajo, descanso, rondas })); } catch (e) { /* sin almacenamiento */ }
}

const mmss = s => {
  s = Math.max(0, Math.ceil(s));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

function volumenBajo() {
  try { return !!(window.Android && Android.volumen && Android.volumen() === 0); } catch (e) { return false; }
}

function girar(libre) {
  if (window.Android && Android.girar) Android.girar(libre);
}

function abrirReloj() {
  girar(true);
  $('#reloj').hidden = false;
  document.body.style.overflow = 'hidden';
  pintarReloj();
}

function cerrarReloj() {
  // Desde la ejecución, cerrar solo esconde el reloj: sigue corriendo y se ve arriba.
  if (!$('#visor').hidden && (reloj.corriendo || reloj.pausado)) {
    $('#reloj').hidden = true;
    girar(false);
    pintarMiniReloj();
    return;
  }
  detenerReloj();
  pararAlarma();
  $('#reloj').hidden = true;
  girar(false);
  if ($('#hoja').hidden) document.body.style.overflow = '';
}

function pantallaEncendida(si) {
  if (window.Android && Android.pantallaEncendida) { Android.pantallaEncendida(si); return; }
  if (si && navigator.wakeLock) navigator.wakeLock.request('screen').then(w => { wakeLock = w; }).catch(() => {});
  if (!si && wakeLock) { wakeLock.release(); wakeLock = null; }
}

/* Fases del tábata: preparación, y luego trabajo/descanso por cada ronda
   (sin descanso después de la última). */
function fasesTabata() {
  const f = [];
  if (reloj.prep > 0) f.push({ fase: 'prep', dur: reloj.prep, ronda: 0 });
  for (let r = 1; r <= reloj.rondas; r++) {
    f.push({ fase: 'trabajo', dur: reloj.trabajo, ronda: r });
    if (r < reloj.rondas && reloj.descanso > 0) f.push({ fase: 'descanso', dur: reloj.descanso, ronda: r });
  }
  return f;
}

function iniciarReloj() {
  contextoAudio();      // el navegador solo deja sonar si el audio parte con un toque
  pararAlarma();
  const ahora = Date.now();
  if (reloj.pausado) {
    // Reanuda desde donde quedó.
    const corrido = reloj.pausado;
    reloj.inicio = ahora - corrido;
    reloj.pausado = 0;
  } else {
    reloj.inicio = ahora;
    reloj.terminado = false;
    reloj.ultimoSeg = null;
    reloj.fase = null;
  }
  reloj.corriendo = true;
  pantallaEncendida(true);
  clearInterval(tic);
  tic = setInterval(avanzar, 100);
  programarNativo();
  avanzar();
}

function pausarReloj() {
  cancelarNativo();
  reloj.pausado = Date.now() - reloj.inicio;
  reloj.corriendo = false;
  clearInterval(tic);
  pantallaEncendida(false);
  pintarReloj();
}

function detenerReloj() {
  if (reloj.corriendo) cancelarNativo();
  clearInterval(tic);
  reloj.corriendo = false;
  reloj.pausado = 0;
  reloj.fase = null;
  reloj.terminado = false;
  pantallaEncendida(false);
}

/* Cuánto lleva y qué mostrar, según el modo. */
function estadoReloj() {
  const corrido = (reloj.corriendo ? Date.now() - reloj.inicio : reloj.pausado) / 1000;
  if (reloj.modo === 'crono') return { numero: mmss(Math.floor(corrido)), restante: Infinity, fase: 'trabajo' };
  if (reloj.modo === 'cuenta') {
    const r = reloj.cuenta - corrido;
    return { numero: mmss(r), restante: r, fase: 'trabajo', total: reloj.cuenta };
  }
  const fases = fasesTabata();
  let t = corrido;
  for (const f of fases) {
    if (t < f.dur) return { numero: String(Math.ceil(f.dur - t)), restante: f.dur - t, fase: f.fase, ronda: f.ronda, total: f.dur };
    t -= f.dur;
  }
  return { numero: '0', restante: 0, fase: 'fin', ronda: reloj.rondas };
}

function avanzar() {
  const e = estadoReloj();
  // Avisos: cambio de fase en el tábata y los últimos 3 segundos.
  if (reloj.modo === 'tabata' && e.fase !== reloj.fase && e.fase !== 'fin') {
    if (reloj.fase !== null && !NATIVO) {
      pitido(e.fase === 'trabajo' ? 600 : 400, e.fase === 'trabajo');
      vibrar(e.fase === 'trabajo' ? [400] : [200, 100, 200]);
    }
    reloj.fase = e.fase;
    reloj.ultimoSeg = null;
  }
  const seg = Math.ceil(e.restante);
  if (reloj.modo !== 'crono' && seg <= 3 && seg >= 1 && seg !== reloj.ultimoSeg) {
    reloj.ultimoSeg = seg;
    if (!NATIVO) pitido(120, false);
  }
  if (reloj.modo !== 'crono' && e.restante <= 0) {
    clearInterval(tic);
    reloj.corriendo = false;
    reloj.pausado = 0;
    reloj.terminado = true;
    pantallaEncendida(false);
    pintarReloj();
    sonarAlarma();
    return;
  }
  pintarNumero(e);
}

/* Los números ocupan todo el ancho (o el alto) disponible. Solo se mide de
   nuevo cuando cambia la cantidad de cifras, el tema o el tamaño. */
function ajustarNumero(n) {
  const centro = $('#r-centro');
  if (!centro.clientWidth) return;   // reloj escondido: se mide al abrirlo
  const clave = `${n.textContent.length}|${document.documentElement.dataset.tema || ''}|${centro.clientWidth}x${centro.clientHeight}`;
  if (n.dataset.medido === clave) return;
  n.style.fontSize = '100px';
  const ancho = n.scrollWidth, alto = n.offsetHeight;
  // Alto libre: el de la pantalla menos la fase, la barra y la indicación.
  const px = (el, prop) => parseFloat(getComputedStyle(el)[prop]) || 0;
  const otros = [...centro.children].filter(c => c !== n)
    .reduce((t, c) => t + c.offsetHeight + px(c, 'marginTop') + px(c, 'marginBottom'), 0);
  const libre = centro.clientHeight - px(centro, 'paddingTop') - px(centro, 'paddingBottom') - otros;
  const tam = Math.min(100 * centro.clientWidth * 0.98 / ancho, 100 * libre * 0.97 / alto);
  n.style.fontSize = `${Math.floor(tam)}px`;
  n.dataset.medido = clave;
}

const NOMBRE_FASE = { prep: 'Prepárate', trabajo: '¡Trabajo!', descanso: 'Descanso', fin: 'Terminado' };

/* En la pantalla de ejecución, el tiempo que queda junto al ícono del reloj. */
function pintarMiniReloj(e) {
  const t = $('#v-tiempo');
  if (!t) return;
  const activo = reloj.corriendo || reloj.pausado || reloj.terminado;
  if (!activo) { t.textContent = ''; t.parentElement.dataset.fase = ''; return; }
  e = e || (reloj.terminado ? { numero: '0', fase: 'fin' } : estadoReloj());
  t.textContent = reloj.pausado && !reloj.corriendo ? `${e.numero} ⏸` : e.numero;
  t.parentElement.dataset.fase = reloj.modo === 'tabata' ? e.fase : reloj.terminado ? 'fin' : '';
}

function pintarNumero(e) {
  pintarMiniReloj(e);
  const n = $('#r-numero');
  if (!n) return;
  n.textContent = e.numero;
  ajustarNumero(n);
  const caja = $('#reloj');
  caja.dataset.fase = reloj.modo === 'tabata' && (reloj.corriendo || reloj.pausado) ? e.fase : '';
  const fase = $('#r-fase');
  if (fase) {
    fase.textContent = reloj.modo === 'tabata' && (reloj.corriendo || reloj.pausado)
      ? `${NOMBRE_FASE[e.fase]}${e.ronda ? ` · ronda ${e.ronda} de ${reloj.rondas}` : ''}`
      : reloj.modo === 'tabata' ? `${reloj.rondas} rondas · ${reloj.trabajo} s / ${reloj.descanso} s` : '';
  }
  const barra = $('#r-barra');
  if (barra) barra.style.width = e.total && (reloj.corriendo || reloj.pausado) ? `${Math.max(0, e.restante / e.total) * 100}%` : '100%';
}

function paso(campo, delta, min, max) {
  reloj[campo] = Math.min(max, Math.max(min, reloj[campo] + delta));
  guardarReloj();
  pintarReloj();
}

function pintarReloj() {
  const quieto = !reloj.corriendo && !reloj.pausado;
  const config = !quieto || reloj.terminado ? '' : reloj.modo === 'cuenta' ? `
      <div class="r-config">
        <div class="r-ajuste"><button data-paso-r="cuenta,-60,5,5940">−1 min</button><button data-paso-r="cuenta,-15,5,5940">−15 s</button><button data-paso-r="cuenta,15,5,5940">+15 s</button><button data-paso-r="cuenta,60,5,5940">+1 min</button></div>
        <div class="r-rapidos">${[30, 60, 90, 120, 180, 300].map(s => `<button data-fijar="${s}" class="${reloj.cuenta === s ? 'activo' : ''}">${mmss(s)}</button>`).join('')}</div>
      </div>`
    : reloj.modo === 'tabata' ? `
      <div class="r-config r-tabata">
        ${[['prep', 'Preparación', 5, 0, 60, 's'], ['trabajo', 'Trabajo', 5, 5, 600, 's'], ['descanso', 'Descanso', 5, 0, 600, 's'], ['rondas', 'Rondas', 1, 1, 50, '']].map(([c, n, d, mi, ma, u]) => `
          <div class="r-fila"><span>${n}</span>
            <button data-paso-r="${c},-${d},${mi},${ma}" aria-label="Menos">−</button>
            <b>${reloj[c]}${u ? ' ' + u : ''}</b>
            <button data-paso-r="${c},${d},${mi},${ma}" aria-label="Más">+</button></div>`).join('')}
        <div class="r-rapidos"><button data-tabata="20,10,8">Clásico 20/10 × 8</button><button data-tabata="40,20,8">40/20 × 8</button><button data-tabata="60,30,5">1 min / 30 s × 5</button></div>
      </div>` : '';
  /* Arriba, los números a pantalla completa (tocarlos empieza o pausa);
     abajo, deslizando, los modos, los ajustes y los botones. */
  $('#reloj').innerHTML = `
    <button class="cerrar r-cerrar" id="r-cerrar" aria-label="Cerrar">${ICONOS.cerrar}</button>
    <div class="r-centro" id="r-centro">
      <div class="r-fase" id="r-fase"></div>
      <div class="r-numero" id="r-numero"></div>
      <div class="r-pista"><i id="r-barra"></i></div>
      <p class="r-pie">${reloj.terminado ? '¡Tiempo! Toca para apagar la alarma.'
        : `Toca los números para ${reloj.corriendo ? 'pausar' : reloj.pausado ? 'seguir' : 'empezar'} · ajustes abajo ▾`}</p>
    </div>
    <div class="r-abajo">
    <div class="selector">${[['cuenta', 'Cuenta atrás'], ['crono', 'Cronómetro'], ['tabata', 'Tábata']].map(([m, n]) =>
      `<button data-modo="${m}" class="${reloj.modo === m ? 'activo' : ''}" ${quieto ? '' : 'disabled'}>${n}</button>`).join('')}</div>
    ${volumenBajo() ? `<p class="r-volumen">🔇 El volumen del teléfono está en cero: la alarma solo va a vibrar. Súbelo con los botones del costado.</p>` : ''}
    ${config}
    <div class="r-botones">
      <button class="boton sobrio" id="r-reiniciar" ${quieto && !reloj.terminado ? 'disabled' : ''}>Reiniciar</button>
      <button class="boton principal" id="r-marcha">${reloj.corriendo ? 'Pausa' : reloj.pausado ? 'Seguir' : 'Empezar'}</button>
    </div>
    </div>`;
  pintarNumero(reloj.terminado ? { numero: reloj.modo === 'tabata' ? '0' : '0:00', restante: 0, fase: 'fin', total: 1 } : estadoReloj());
  if (reloj.terminado) $('#r-fase').textContent = 'Terminado';

  $('#r-cerrar').addEventListener('click', cerrarReloj);
  const marcha = () => reloj.corriendo ? pausarReloj() : (reloj.terminado && detenerReloj(), iniciarReloj(), pintarReloj());
  $('#r-marcha').addEventListener('click', marcha);
  $('#r-centro').addEventListener('click', marcha);
  $('#r-reiniciar').addEventListener('click', () => { pararAlarma(); detenerReloj(); pintarReloj(); });
  document.querySelectorAll('[data-modo]').forEach(b => b.addEventListener('click', () => {
    reloj.modo = b.dataset.modo; detenerReloj(); guardarReloj(); pintarReloj();
  }));
  document.querySelectorAll('[data-paso-r]').forEach(b => b.addEventListener('click', () => {
    const [c, d, mi, ma] = b.dataset.pasoR.split(',');
    paso(c, +d, +mi, +ma);
  }));
  document.querySelectorAll('[data-fijar]').forEach(b => b.addEventListener('click', () => {
    reloj.cuenta = +b.dataset.fijar; guardarReloj(); pintarReloj();
  }));
  document.querySelectorAll('[data-tabata]').forEach(b => b.addEventListener('click', () => {
    const [t, d, r] = b.dataset.tabata.split(',').map(Number);
    Object.assign(reloj, { trabajo: t, descanso: d, rondas: r }); guardarReloj(); pintarReloj();
  }));
}

$('#b-reloj').addEventListener('click', abrirReloj);
// Tocar cualquier parte apaga la alarma.
$('#reloj').addEventListener('click', ev => {
  if (!alarmaActiva) return;
  pararAlarma();
  ev.stopPropagation();
  pintarReloj();
}, true);

/* El botón atrás de Android cierra primero el visor y el reloj. */
const atrasPrevio = window.volverAtras;
window.volverAtras = function () {
  if (!$('#reloj').hidden) { cerrarReloj(); return true; }
  if (!$('#visor').hidden) { cerrarEjecucion(); return true; }
  return atrasPrevio();
};
window.addEventListener('resize', () => { const n = $('#r-numero'); if (n && !$('#reloj').hidden) ajustarNumero(n); });
// Al volver a la app (o encender la pantalla) el número se pone al día de inmediato.
document.addEventListener('visibilitychange', () => { if (!document.hidden && reloj.corriendo) avanzar(); });
// Revisa el volumen cada pocos segundos mientras el temporizador está abierto.
setInterval(() => {
  if ($('#reloj').hidden || !(window.Android && Android.volumen)) return;
  const aviso = !!document.querySelector('.r-volumen');
  if (aviso !== volumenBajo() && !reloj.corriendo) pintarReloj();
}, 1500);
