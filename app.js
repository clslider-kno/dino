/* Pantallas de la app. Los datos viven en localStorage del teléfono. */

const CLAVE = 'dinosaurio.v1';
const $ = sel => document.querySelector(sel);

const ICONOS = {
  flecha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  cerrar: '<svg viewBox="0 0 24 24" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  tic: '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"/></svg>',
  abajo: '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>',
  reloj: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="12" cy="13.5" r="7.5"/><path d="M12 9.5v4l2.5 2M9.5 3h5M12 3v3"/></svg>',
  play: '<svg viewBox="0 0 24 24"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/></svg>',
  pesa: '<svg viewBox="0 0 32 32"><path d="M3 13h3v6H3zM26 13h3v6h-3zM7 10h3v12H7zM22 10h3v12h-3zM11 15h10v2H11z" fill="currentColor"/></svg>',
};

/* ---------------- datos ---------------- */

function cargar() {
  try {
    const d = JSON.parse(localStorage.getItem(CLAVE));
    if (d && Array.isArray(d.sesiones)) {
      migrarPropios(d);
      return { sesiones: d.sesiones, descansos: d.descansos || {}, propios: d.propios || [], lesion: zonasVigentes(d.lesion) };
    }
  } catch (e) { /* sin datos o almacenamiento bloqueado */ }
  return { sesiones: [], descansos: {}, propios: [], lesion: [] };
}

/* Zonas de dolor guardadas: las antiguas pasan a sus reemplazos y las que ya
   no existen se descartan. */
function zonasVigentes(lista) {
  const r = [];
  for (const z of lista || []) {
    for (const n of ZONAS_RENOMBRADAS[z] || [z]) {
      if ((MUS[n] || ARTICULACIONES.some(a => a.id === n)) && !r.includes(n)) r.push(n);
    }
  }
  return r;
}

/* Ejercicios propios que ahora vienen en el catálogo: sus registros pasan al
   ejercicio oficial y el propio desaparece de «Mis ejercicios». */
const PROPIOS_ADOPTADOS = [[/remo\s+al\s+cuello/, 'remo_cuello']];

function migrarPropios(d) {
  if (!Array.isArray(d.propios)) return;
  const cambio = {};
  d.propios = d.propios.filter(e => {
    const par = PROPIOS_ADOPTADOS.find(([re]) => re.test(normal(e.nombre || '')));
    if (par) cambio[e.id] = par[1];
    return !par;
  });
  if (!Object.keys(cambio).length) return;
  for (const s of d.sesiones) {
    s.ejercicios = [...new Set((s.ejercicios || []).map(id => cambio[id] || id))];
  }
  try { localStorage.setItem(CLAVE, JSON.stringify(d)); } catch (e) { /* se reintenta al guardar */ }
}

let datos = cargar();

function guardar() {
  try { localStorage.setItem(CLAVE, JSON.stringify(datos)); }
  catch (e) { avisar('No pude guardar en el teléfono'); }
}

function descansos() {
  const r = {};
  for (const m of MUSCULOS) r[m.id] = datos.descansos[m.id] || m.descanso;
  return r;
}

function estadoAhora() {
  return calcularEstado(datos.sesiones, Date.now(), descansos(), datos.propios);
}

function ejercicio(id) { return buscarEjercicio(id, datos.propios); }

/* ---------------- formatos ---------------- */

const DIAS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const dos = n => String(n).padStart(2, '0');

function fmtCuando(ms) {
  const d = new Date(ms);
  return `${DIAS[d.getDay()]} ${d.getDate()} ${MESES[d.getMonth()]} · ${dos(d.getHours())}:${dos(d.getMinutes())}`;
}

function fmtHoraDia(ms) {
  const d = new Date(ms);
  const hoy = new Date();
  const man = new Date(); man.setDate(hoy.getDate() + 1);
  const hora = `${dos(d.getHours())}:${dos(d.getMinutes())}`;
  if (d.toDateString() === hoy.toDateString()) return `hoy a las ${hora}`;
  if (d.toDateString() === man.toDateString()) return `mañana a las ${hora}`;
  return `el ${DIAS[d.getDay()]} ${d.getDate()} a las ${hora}`;
}

function fmtFaltan(horas) {
  if (horas < 1) return 'menos de 1 h';
  if (horas < 24) return `${Math.ceil(horas)} h`;
  const d = Math.floor(horas / 24), h = Math.round(horas % 24);
  return h ? `${d} d ${h} h` : `${d} d`;
}

function fmtHace(ms) {
  const h = (Date.now() - ms) / HORA;
  if (h < 1) return 'recién';
  if (h < 24) return `hace ${Math.floor(h)} h`;
  const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
  const dias = Math.round((hoy - new Date(ms).setHours(0, 0, 0, 0)) / DIA);
  if (dias <= 1) return 'ayer';
  return `hace ${dias} días`;
}

function aInput(ms) {
  const d = new Date(ms);
  return `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}T${dos(d.getHours())}:${dos(d.getMinutes())}`;
}

function esc(t) {
  return String(t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function claseEstado(e) {
  if (datos.lesion.includes(e.id)) return 'descansa';
  if (e.listo) return 'listo';
  return e.recup >= MINIMO_SECUNDARIO ? 'casi' : 'descansa';
}

/* La barra muestra el cansancio: llena recién trabajado, vacía cuando ya
   descansó. Así una barra vacía nunca se confunde con un músculo entrenado. */
function cansancio(e) {
  if (datos.lesion.includes(e.id)) return 1;
  return e.listo ? 0 : 1 - e.recup;
}

function textoEstado(e) {
  if (datos.lesion.includes(e.id)) return 'Con dolor';
  if (e.listo) return e.ultima === null ? 'Sin trabajar' : 'Listo';
  return `${e.recup >= MINIMO_SECUNDARIO ? 'Casi' : 'Descansa'} · ${fmtFaltan(e.faltanHoras)}`;
}

function puntos(semana) {
  let h = '';
  for (let i = 0; i < META_SEMANAL; i++) {
    const c = semana >= i + 1 ? 'lleno' : semana >= i + 0.5 ? 'medio' : '';
    h += `<i class="${c}"></i>`;
  }
  return `<span class="puntos" title="${semana} esta semana">${h}</span>`;
}

function chipsMusculos(inv) {
  const orden = MUSCULOS.map(m => m.id).filter(id => inv[id]);
  orden.sort((a, b) => (inv[a] === 'p' ? 0 : 1) - (inv[b] === 'p' ? 0 : 1));
  return orden.map(id => `<span class="chip ${inv[id]}">${esc(MUS[id].corto)}</span>`).join('');
}

/* ---------------- navegación ---------------- */

let vistaActual = 'hoy';

function mostrar(vista) {
  vistaActual = vista;
  document.querySelectorAll('.vista').forEach(v => { v.hidden = v.id !== 'v-' + vista; });
  document.querySelectorAll('#navegacion button').forEach(b => b.classList.toggle('activa', b.dataset.vista === vista));
  pintar();
  window.scrollTo(0, 0);
}

function pintar() {
  if (vistaActual === 'hoy') pintarHoy();
  if (vistaActual === 'registrar') pintarRegistrar();
  if (vistaActual === 'libro') pintarLibro();
  if (vistaActual === 'historial') pintarHistorial();
  if (vistaActual === 'guia') pintarGuia();
  if (vistaActual === 'baraja') pintarBaraja();
  if (vistaActual === 'crossfit') pintarCrossfit();
}

document.querySelectorAll('#navegacion button').forEach(b => {
  b.addEventListener('click', () => mostrar(b.dataset.vista));
});

/* ---------------- ajustes: temas ---------------- */

const TEMAS = [
  { id: 'hierro', nombre: 'Hierro', desc: 'El de siempre: fondo oscuro, óxido y letras condensadas.', fondo: '#131211' },
  { id: 'papel', nombre: 'Revista antigua', desc: 'Claro, color papel y letras con serifa, como las revistas de fuerza de antes.', fondo: '#efe6d4', claro: true },
  { id: 'acero', nombre: 'Acero', desc: 'Gris azulado y azul acero, letras altas y limpias.', fondo: '#0f1317' },
  { id: 'jurasico', nombre: 'Jurásico', desc: 'Verde selva y lima, letras de cartel.', fondo: '#0d1410' },
  { id: 'contraste', nombre: 'Alto contraste', desc: 'Negro y amarillo, letras más grandes: se lee bien con el teléfono en el suelo.', fondo: '#000000' },
  { id: 'tiza', nombre: 'Tiza', desc: 'Gris cemento claro, negro y rojo, letras técnicas: como una pizarra de gimnasio.', fondo: '#ebebe8', claro: true },
  { id: 'coliseo', nombre: 'Coliseo', desc: 'Arena y rojo sangre, títulos romanos grabados en piedra.', fondo: '#17110c' },
  { id: 'neon', nombre: 'Neón', desc: 'Noche violeta con rosa y verde eléctricos, letras de ciencia ficción.', fondo: '#0c0a14' },
  { id: 'militar', nombre: 'Militar', desc: 'Verde oliva y caqui, títulos de esténcil como cajas de munición.', fondo: '#1b1d14' },
  { id: 'glaciar', nombre: 'Glaciar', desc: 'Claro, blanco hielo y azul profundo, letras redondas y anchas.', fondo: '#e9f1f6', claro: true },
];
const CLAVE_TEMA = 'dinosaurio.tema';

function temaActual() {
  try { return localStorage.getItem(CLAVE_TEMA) || 'hierro'; } catch (e) { return 'hierro'; }
}

function aplicarTema(id) {
  const t = TEMAS.find(x => x.id === id) || TEMAS[0];
  if (t.id === 'hierro') delete document.documentElement.dataset.tema;
  else document.documentElement.dataset.tema = t.id;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = t.fondo;
  document.querySelector('meta[name="color-scheme"]').content = t.claro ? 'light' : 'dark';
  // En el APK, los íconos de la barra del sistema tienen que verse sobre el fondo claro.
  if (window.Android && Android.barrasClaras) Android.barrasClaras(!!t.claro, t.fondo);
}

function abrirAjustes() {
  $('#hoja').hidden = false;
  document.body.style.overflow = 'hidden';
  pintarAjustes();
  $('#hoja').scrollTop = 0;
}

/* ---------------- ajustes: pasar la app a otro teléfono ---------------- */

const WEB = 'https://clslider-kno.github.io/dino/';
const DESTINOS = {
  android: {
    nombre: 'Android', enlace: WEB + 'DinoEntreno.apk', qr: 'compartir/qr-android.svg',
    pasos: [
      'En el otro teléfono, escanea el código con la cámara (o ábrele el enlace) y descarga <b>DinoEntreno.apk</b>.',
      'Abre el archivo descargado. Si Android pregunta, permite <b>instalar apps de esta fuente</b>.',
      'Toca <b>Instalar</b>. Queda como una app más, sin internet y con temporizador por pantalla apagada.',
    ],
  },
  web: {
    nombre: 'iPhone o web', enlace: WEB, qr: 'compartir/qr-web.svg',
    pasos: [
      'En el iPhone, escanea el código con la cámara y ábrelo en <b>Safari</b>.',
      'Toca <b>Compartir</b> (el cuadro con la flecha) y elige <b>Agregar a inicio</b>. Queda con su ícono y funciona sin internet.',
      'En un computador o en otro Android, ábrelo en Chrome y elige <b>Instalar app</b> en el menú; o úsala directo en el navegador.',
    ],
  },
};
let destino = 'android';

function seccionCompartir() {
  const d = DESTINOS[destino];
  return `
    <div class="titulo-rutina separado">Pasar la app a otro teléfono</div>
    <p class="intro">Elige el teléfono de destino: el otro escanea el código o recibe el enlace.</p>
    <div class="selector">${Object.entries(DESTINOS).map(([id, x]) =>
      `<button data-destino="${id}" class="${destino === id ? 'activo' : ''}">${x.nombre}</button>`).join('')}</div>
    <div class="compartir">
      <img class="qr" src="${d.qr}" alt="Código QR para ${esc(d.nombre)}" width="220" height="220">
      <code class="enlace-app">${esc(d.enlace)}</code>
      <div class="fila-botones">
        <button class="boton principal" id="b-compartir-app">Compartir enlace</button>
        <button class="boton sobrio" id="b-copiar-app">Copiar</button>
      </div>
      <ol class="pasos-app">${d.pasos.map(p => `<li>${p}</li>`).join('')}</ol>
      <p class="nota">Tus entrenamientos no se pasan solos: en el teléfono nuevo, carga un <b>respaldo</b> de este.
        <button class="enlace" id="b-ir-respaldo">Ir al respaldo</button></p>
    </div>`;
}

function enlazarCompartir() {
  const d = DESTINOS[destino];
  document.querySelectorAll('[data-destino]').forEach(b => b.addEventListener('click', () => {
    destino = b.dataset.destino;
    pintarAjustes();
  }));
  const texto = `DinoEntreno para ${d.nombre}: ${d.enlace}`;
  $('#b-compartir-app').addEventListener('click', () => {
    if (window.Android && Android.compartirTexto) Android.compartirTexto(texto, 'DinoEntreno');
    else if (navigator.share) navigator.share({ title: 'DinoEntreno', text: texto, url: d.enlace }).catch(() => {});
    else copiarTexto(d.enlace);
  });
  $('#b-copiar-app').addEventListener('click', () => copiarTexto(d.enlace));
  $('#b-ir-respaldo').addEventListener('click', () => {
    cerrarHoja();
    mostrar('guia');
    const r = document.getElementById('respaldo');
    if (r) r.scrollIntoView({ behavior: 'smooth' });
  });
}

function copiarTexto(t) {
  if (navigator.clipboard) navigator.clipboard.writeText(t).then(() => avisar('Enlace copiado'), () => avisar(t));
  else avisar(t);
}

function pintarAjustes() {
  const actual = temaActual();
  const b = document.querySelector('.barra-inferior');
  if (b) b.remove();
  $('#hoja-cuerpo').innerHTML = `
    <div class="hoja-arriba">
      <h3 style="margin:0">Ajustes</h3>
      <button class="cerrar" id="b-cerrar" aria-label="Cerrar">${ICONOS.cerrar}</button>
    </div>
    <div class="titulo-rutina">Tema</div>
    <p class="intro">Colores y tipo de letra de toda la app. Tus entrenamientos no cambian.</p>
    <div class="temas">${TEMAS.map(t => `
      <button class="tema ${t.id === actual ? 'activo' : ''}" data-tema="${t.id}" data-elegir="${t.id}">
        ${t.id === actual ? '<span class="marca-activo">✓ En uso</span>' : ''}
        <span class="nombre-tema">${esc(t.nombre)}</span>
        <p class="desc">${esc(t.desc)}</p>
        <span class="muestra">
          <span class="falso-boton">Lo hice</span>
          <span class="bolitas"><i style="background:var(--listo)"></i><i style="background:var(--casi)"></i><i style="background:var(--descansa)"></i></span>
        </span>
      </button>`).join('')}
    </div>
    ${seccionCompartir()}`;
  $('#b-cerrar').addEventListener('click', cerrarHoja);
  enlazarCompartir();
  document.querySelectorAll('[data-elegir]').forEach(x => x.addEventListener('click', () => {
    try { localStorage.setItem(CLAVE_TEMA, x.dataset.elegir); } catch (e) { /* sin almacenamiento */ }
    aplicarTema(x.dataset.elegir);
    pintarAjustes();
  }));
}

$('#b-ajustes').addEventListener('click', abrirAjustes);
aplicarTema(temaActual());

/* ---------------- hoy ---------------- */

function pintarHoy() {
  const est = estadoAhora();
  const ahora = Date.now();
  const semana = datos.sesiones.filter(s => s.fecha <= ahora && ahora - s.fecha < 7 * DIA).length;
  const listos = MUSCULOS.filter(m => est[m.id].listo).length;
  const ultima = [...datos.sesiones].filter(s => s.fecha <= ahora).sort((a, b) => b.fecha - a.fecha)[0];

  let h = `
    <button class="boton-grande" id="b-sugerir">
      <span><strong>Entrenamiento sugerido</strong><small>Según lo que ya descansó y lo que falta esta semana</small></span>
      ${ICONOS.flecha}
    </button>
    ${botonLesion()}
    <div class="cifras">
      <div class="cifra"><b>${semana}</b><span>sesiones en 7 días</span></div>
      <div class="cifra"><b>${listos}/${MUSCULOS.length}</b><span>músculos listos</span></div>
      <div class="cifra"><b>${ultima ? esc(fmtHace(ultima.fecha).replace('hace ', '')) : '—'}</b><span>${ultima ? 'desde la última' : 'sin registros'}</span></div>
    </div>`;

  for (const [zona, nombre] of Object.entries(ZONAS)) {
    h += `<h3>${nombre}</h3><div class="musculos">`;
    for (const m of MUSCULOS.filter(x => x.zona === zona)) {
      const e = est[m.id];
      const c = claseEstado(e);
      h += `
        <button class="musculo" data-musculo="${m.id}">
          <span class="fila"><span class="nombre">${esc(m.corto)}</span><span class="estado ${c}">${textoEstado(e)}</span></span>
          <span class="barra"><i class="${c}" style="width:${Math.round(cansancio(e) * 100)}%"></i></span>
          <span class="pie"><span>${e.ultima ? esc(fmtHace(e.ultima)) : 'sin registros'}</span>${puntos(e.semana)}</span>
        </button>`;
    }
    h += '</div>';
  }
  $('#v-hoy').innerHTML = h;
  $('#b-sugerir').addEventListener('click', () => abrirSugerencia());
  $('#b-lesion').addEventListener('click', () => abrirSugerencia(true));
  document.querySelectorAll('[data-musculo]').forEach(b => b.addEventListener('click', () => {
    const m = MUS[b.dataset.musculo];
    const e = est[m.id];
    const d = descansos()[m.id];
    avisar(e.listo
      ? `${m.corto}: listo. Descansa ${d} h tras trabajarlo.`
      : `${m.corto}: listo ${fmtHoraDia(e.listoEn)}.`, 3200);
  }));
}

/* ---------------- rutina sugerida ---------------- */

const sug = { foco: 'auto', semilla: 1 };
const FOCOS = [
  ['auto', 'Automático'], ['inferior', 'Piernas'], ['superior', 'Torso'],
  ['completo', 'Completo'], ['corto', 'Agarre y cuello'],
];

function abrirSugerencia(lesion) {
  sug.foco = 'auto';
  sug.semilla = 1;
  $('#hoja').hidden = false;
  document.body.style.overflow = 'hidden';
  lesion ? pintarLesion() : pintarSugerencia();
}

/* ---------------- lesión ---------------- */

function nombreZona(id) {
  return MUS[id] ? MUS[id].corto : (ARTICULACIONES.find(a => a.id === id) || {}).corto || id;
}

function botonLesion() {
  const z = datos.lesion;
  return `<button class="boton-lesion ${z.length ? 'activa' : ''}" id="b-lesion">
      <span><b>Lesión o dolor</b><small>${z.length ? esc(z.map(nombreZona).join(', ')) : 'Marca lo que duele y la rutina lo evita'}</small></span>
      <span class="cambiar">${z.length ? 'Cambiar' : 'Marcar'}</span>
    </button>`;
}

function pintarLesion() {
  const barra = document.querySelector('.barra-inferior');
  if (barra) barra.remove();
  const marcada = id => datos.lesion.includes(id);
  const fila = (id, nombre, ayuda) => `<button class="opcion ${marcada(id) ? 'marcada dolor' : ''}" data-zona="${id}">
      <span class="caja">${ICONOS.tic}</span>
      <span class="txt"><b>${esc(nombre)}</b>${ayuda ? `<small>${esc(ayuda)}</small>` : ''}</span>
    </button>`;
  let h = `
    <div class="hoja-arriba">
      <h3 style="margin:0">Lesión o dolor</h3>
      <button class="cerrar" id="b-cerrar" aria-label="Cerrar">${ICONOS.cerrar}</button>
    </div>
    <p class="intro kubik">El dolor articular no se entrena encima. Marca dónde te duele: la rutina sugerida deja fuera todo lo que cargue esa zona hasta que la desmarques.</p>`;
  for (const r of REGIONES_LESION) {
    h += `<h3>${esc(r.nombre)}</h3><div class="lista-ej">${ARTICULACIONES.filter(a => a.region === r.id).map(a => fila(a.id, a.nombre, a.ayuda)).join('')}</div>`;
  }
  h += `<h3>Músculos</h3>
    <p class="intro" style="margin-top:-4px;font-size:14px">Dolor en el músculo mismo (un tirón, una contractura). Queda fuera todo lo que lo use, aunque sea de rebote.</p>
    <div class="chips">${MUSCULOS.map(m => `<button class="chip ${marcada(m.id) ? 'dolor' : ''}" data-zona="${m.id}">${marcada(m.id) ? '✓ ' : '+ '}${esc(m.nombre)}</button>`).join('')}</div>
    <div class="fila-botones separado">
      <button class="boton sobrio" id="b-sin-dolor" ${datos.lesion.length ? '' : 'disabled'}>Ya no me duele nada</button>
      <button class="boton principal" id="b-lesion-listo">Ver entrenamiento</button>
    </div>`;
  const arriba = $('#hoja').scrollTop;
  $('#hoja-cuerpo').innerHTML = h;
  $('#hoja').scrollTop = arriba;
  $('#b-cerrar').addEventListener('click', () => { cerrarHoja(); if (vistaActual === 'hoy') pintarHoy(); });
  document.querySelectorAll('[data-zona]').forEach(b => b.addEventListener('click', () => {
    const id = b.dataset.zona;
    datos.lesion = marcada(id) ? datos.lesion.filter(x => x !== id) : [...datos.lesion, id];
    guardar();
    pintarLesion();
  }));
  $('#b-sin-dolor').addEventListener('click', () => { datos.lesion = []; guardar(); pintarLesion(); });
  $('#b-lesion-listo').addEventListener('click', () => {
    if (vistaActual === 'hoy') pintarHoy();
    pintarSugerencia();
  });
}

function cerrarHoja() {
  $('#hoja').hidden = true;
  document.body.style.overflow = '';
  const barra = document.querySelector('.barra-inferior');
  if (barra) barra.remove();
}

function pintarSugerencia() {
  const r = sugerir(datos.sesiones, Date.now(), descansos(), datos.propios, { ...sug, lesion: datos.lesion });
  let h = `
    <div class="hoja-arriba">
      <h3 style="margin:0">Entrenamiento sugerido</h3>
      <button class="cerrar" id="b-cerrar" aria-label="Cerrar">${ICONOS.cerrar}</button>
    </div>
    <div class="selector">${FOCOS.map(([id, n]) =>
      `<button data-foco="${id}" class="${sug.foco === id ? 'activo' : ''}">${n}</button>`).join('')}</div>
    ${botonLesion()}`;
  if (datos.lesion.length) {
    const fuera = EJERCICIOS.filter(e => r.vetados.has(e.id) && e.kubik !== false).map(e => e.nombre);
    h += `<div class="nota" style="margin-bottom:14px">Por el dolor quedan fuera <strong>${fuera.length} ejercicios</strong>. Si algo de lo que sigue igual te molesta, no lo hagas: nadie se hizo fuerte entrenando lesionado.
      <details class="fuera"><summary>Ver cuáles</summary><p>${fuera.map(esc).join(' · ')}</p></details></div>`;
  }

  let puedeRegistrar = false;
  if (r.foco === 'descanso' || r.foco === 'cumplida') {
    const prox = r.proximo;
    h += `<div class="titulo-rutina">${r.foco === 'descanso' ? 'Hoy se descansa' : 'Semana cumplida'}</div>
      <p class="intro kubik">${r.foco === 'descanso'
        ? 'Descansar también es entrenar. El músculo crece mientras duermes, no mientras levantas.'
        : 'Ya trabajaste cada grupo grande dos veces en siete días. Un dinosaurio sabe cuándo parar.'}</p>`;
    if (prox) {
      h += `<div class="nota">Lo próximo en quedar listo: <strong>${esc(MUS[prox.id].nombre)}</strong>, ${fmtHoraDia(prox.listoEn)}.</div>`;
    }
    h += `<p class="intro separado">Si igual quieres moverte, elige arriba <strong>Agarre y cuello</strong>: agarre, cuello y abdomen se recuperan en 48 horas.</p>`;
  } else {
    h += `<div class="titulo-rutina">${esc(r.titulo)}</div>
      <p class="intro kubik">${esc(r.intro)}</p>`;
    if (!r.ejercicios.length) {
      h += `<div class="nota">Con lo que todavía está descansando no hay ejercicios de este tipo que respeten el descanso. Prueba con <strong>Automático</strong>.</div>`;
    } else {
      puedeRegistrar = true;
      if (r.faltaPrincipal) {
        h += `<div class="nota" style="margin-bottom:10px">Los músculos grandes de este foco todavía descansan. Esto es lo único que se puede hacer sin pisar su descanso.</div>`;
      }
      /* En los días de torso, la banda prepara los hombros para los presses. */
      const conBanda = (r.foco === 'superior' || r.foco === 'completo') && !r.vetados.has('pull_apart');
      h += `
        <div class="ejercicio calentar" style="--i:0">
          <span class="num">C</span>
          <div>
            <h4>Calentamiento</h4>
            <span class="equipo">${r.vetados.has('cuerda') ? 'Caminata' : 'Cuerda'}${r.foco === 'corto' ? '' : ' + barra sola'}${conBanda ? ' + banda' : ''}</span>
            <p class="kubik">${r.vetados.has('cuerda') ? '5 minutos de caminata suave' : '2 a 5 minutos de cuerda'}${conBanda ? ', 20 separaciones con la banda para despertar los hombros' : ''}${r.foco === 'corto' ? '. Nada de barra: hoy los músculos grandes descansan' : ` y ${r.vetados.has('cargada_press') ? 'una o dos series livianas del primer ejercicio, solo con la barra' : 'una serie liviana de 6 a 8 cargadas y press'}. Guarda la energía para el hierro`}.</p>
          </div>
        </div>`;
      r.ejercicios.forEach((x, i) => {
        const ej = EJ[x.id];
        const esq = ESQUEMAS[x.esquema];
        const inv = {};
        for (const m of ej.s) inv[m] = 's';
        for (const m of ej.p) inv[m] = 'p';
        h += `
          <div class="ejercicio" style="--i:${i + 1}">
            <span class="num">${i + 1}</span>
            <div>
              <h4>${esc(ej.nombre)}</h4>
              <span class="equipo">${esc(ej.equipo)}</span>
              <div class="esquema"><b>${esc(esq.nombre)}</b>${esc(esq.texto)}</div>
              <p class="kubik">${esc(ej.tip)}</p>
              <div class="chips">${chipsMusculos(inv)}</div>
              ${botonEjecucion(ej.id)}
            </div>
          </div>`;
      });
    }
  }

  const descansan = (r.descansan || []).filter(e => !e.lesion);
  if (descansan.length) {
    h += `<h3>Descansan hoy</h3><div class="chips">${descansan.map(e =>
      `<span class="chip">${esc(MUS[e.id].corto)} · ${fmtFaltan(e.faltanHoras)}</span>`).join('')}</div>`;
  }

  $('#hoja-cuerpo').innerHTML = h;
  $('#hoja').scrollTop = 0;
  $('#b-cerrar').addEventListener('click', cerrarHoja);
  $('#b-lesion').addEventListener('click', pintarLesion);
  document.querySelectorAll('[data-foco]').forEach(b => b.addEventListener('click', () => {
    sug.foco = b.dataset.foco;
    sug.semilla = 1;
    pintarSugerencia();
  }));

  let barra = document.querySelector('.barra-inferior');
  if (!barra) {
    barra = document.createElement('div');
    barra.className = 'barra-inferior';
    document.body.appendChild(barra);
  }
  barra.innerHTML = `<div class="dentro">
      <button class="boton sobrio" id="b-otra" ${puedeRegistrar ? '' : 'disabled'}>Otra opción</button>
      <button class="boton principal" id="b-hecho" ${puedeRegistrar ? '' : 'disabled'}>Lo hice</button>
    </div>`;
  $('#b-otra').addEventListener('click', () => { sug.semilla++; pintarSugerencia(); });
  $('#b-hecho').addEventListener('click', () => {
    nuevoBorrador([...(r.vetados.has('cuerda') ? [] : ['cuerda']), ...r.ejercicios.map(x => x.id)]);
    cerrarHoja();
    mostrar('registrar');
    avisar('Revisa y guarda. Puedes quitar lo que no hiciste.');
  });
}

/* ---------------- registrar ---------------- */

let borrador;
let abiertas = new Set();
let filtro = '';
let creando = null;

function nuevoBorrador(ejercicios, sesion) {
  borrador = sesion
    ? { id: sesion.id, fecha: sesion.fecha, ejercicios: new Set(sesion.ejercicios), extra: { ...(sesion.extra || {}) }, nota: sesion.nota || '', programa: sesion.programa || null, wod: sesion.wod || null }
    : { id: null, fecha: Date.now(), ejercicios: new Set(ejercicios || []), extra: {}, nota: '', programa: null, wod: null };
  abiertas = new Set();
  for (const id of borrador.ejercicios) {
    const e = ejercicio(id);
    if (e) abiertas.add(e.cat);
  }
  filtro = '';
  creando = null;
}

nuevoBorrador();

function listaCompleta() {
  return [...EJERCICIOS, ...datos.propios];
}

function categoriasCompletas() {
  return datos.propios.length ? [{ id: 'propios', nombre: 'Mis ejercicios' }, ...CATEGORIAS] : CATEGORIAS;
}

function normal(t) {
  return t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function filaEjercicio(e) {
  const marcada = borrador.ejercicios.has(e.id);
  const etiqueta = e.planB ? '<span class="etiqueta">plan B</span>'
    : e.kubik === false ? '<span class="etiqueta">complemento</span>' : '';
  const prin = (e.p || []).map(m => MUS[m].corto).join(', ');
  return `<div class="fila-ej"><button class="opcion ${marcada ? 'marcada' : ''}" data-ej="${esc(e.id)}">
      <span class="caja">${ICONOS.tic}</span>
      <span class="txt"><b>${esc(e.nombre)}${etiqueta}</b><small>${esc(e.equipo)}${prin ? ' · ' + esc(prin) : ''}</small></span>
    </button>${typeof EJECUCION !== 'undefined' && EJECUCION[e.id] ? `<button class="ver-ej" data-ver="${esc(e.id)}" aria-label="Ejecución">${ICONOS.play}</button>` : ''}</div>`;
}

function pintarRegistrar() {
  const editando = !!borrador.id;
  let h = `<h2>${editando ? 'Editar entrenamiento' : 'Registrar entrenamiento'}</h2>
    <div class="campo">
      <label for="f-dia">Cuándo entrenaste</label>
      <div class="fecha-hora">
        <input type="date" id="f-dia" value="${aInput(borrador.fecha).slice(0, 10)}" max="${aInput(Date.now()).slice(0, 10)}">
        <input type="time" id="f-hora" value="${aInput(borrador.fecha).slice(11)}">
      </div>
      <div class="chips fecha-rapida">
        <button class="chip" data-dias="0">Ahora</button>
        <button class="chip" data-dias="1">Ayer</button>
        <button class="chip" data-dias="2">Anteayer</button>
      </div>
      <small class="fecha-texto" id="f-texto"></small>
    </div>
    <div class="campo">
      <label for="f-buscar">Ejercicios que hiciste</label>
      <input type="search" id="f-buscar" placeholder="Buscar: sentadilla, maletas, polea…" value="${esc(filtro)}">
    </div>
    <div id="lista-categorias"></div>
    <h3>Agregar un músculo a mano</h3>
    <p class="intro" style="margin-top:-4px;font-size:14px">Para lo que no esté en la lista. Toca para marcarlo como trabajado.</p>
    <div class="chips" id="extra"></div>
    <div id="crear" class="separado"></div>
    <div class="campo separado">
      <label for="f-nota">Nota (opcional)</label>
      <textarea id="f-nota" placeholder="Cómo te sentiste, qué dolió, lo que quieras">${esc(borrador.nota)}</textarea>
    </div>
    <div class="resumen-registro" id="resumen"></div>`;
  $('#v-registrar').innerHTML = h;

  /* Fecha y hora por separado; los botones rápidos dejan la hora puesta
     (salvo «Ahora», que pone la de este momento). */
  const textoFecha = () => {
    const d = new Date(borrador.fecha);
    $('#f-texto').textContent = d.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })
      + ' a las ' + d.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }) + ' h';
  };
  const leerFecha = () => {
    const t = new Date(`${$('#f-dia').value}T${$('#f-hora').value || '00:00'}`).getTime();
    if (!isNaN(t)) borrador.fecha = t;
    textoFecha();
  };
  $('#f-dia').addEventListener('change', leerFecha);
  $('#f-hora').addEventListener('change', leerFecha);
  document.querySelectorAll('[data-dias]').forEach(b => b.addEventListener('click', () => {
    const n = +b.dataset.dias;
    const d = n === 0 ? new Date() : new Date(borrador.fecha);
    if (n) { const hoy = new Date(); d.setFullYear(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() - n); }
    borrador.fecha = d.getTime();
    $('#f-dia').value = aInput(borrador.fecha).slice(0, 10);
    $('#f-hora').value = aInput(borrador.fecha).slice(11);
    textoFecha();
  }));
  textoFecha();
  $('#f-buscar').addEventListener('input', ev => { filtro = ev.target.value; pintarLista(); });
  $('#f-nota').addEventListener('input', ev => { borrador.nota = ev.target.value; });
  pintarLista();
  pintarExtra();
  pintarCrear();
  pintarResumen();
}

function pintarLista() {
  const q = normal(filtro.trim());
  const todos = listaCompleta();
  let h = '';
  for (const c of categoriasCompletas()) {
    const lista = todos.filter(e => e.cat === c.id && (!q || normal(e.nombre + ' ' + e.equipo).includes(q)));
    if (!lista.length) continue;
    const marcados = lista.filter(e => borrador.ejercicios.has(e.id)).length;
    const abierta = q || abiertas.has(c.id);
    h += `<div class="categoria ${abierta ? 'abierta' : ''}">
        <button data-cat="${c.id}"><span>${esc(c.nombre)}</span>
          <span style="display:flex;align-items:center;gap:8px">${marcados ? `<span class="cuenta">${marcados} marcado${marcados > 1 ? 's' : ''}</span>` : ''}${ICONOS.abajo}</span>
        </button>
        ${abierta ? `<div class="lista-ej">${lista.map(filaEjercicio).join('')}</div>` : ''}
      </div>`;
  }
  if (!h) h = '<p class="intro">Nada con ese nombre. Puedes crearlo más abajo.</p>';
  $('#lista-categorias').innerHTML = h;

  document.querySelectorAll('[data-cat]').forEach(b => b.addEventListener('click', () => {
    const id = b.dataset.cat;
    abiertas.has(id) ? abiertas.delete(id) : abiertas.add(id);
    pintarLista();
  }));
  document.querySelectorAll('[data-ej]').forEach(b => b.addEventListener('click', () => {
    const id = b.dataset.ej;
    borrador.ejercicios.has(id) ? borrador.ejercicios.delete(id) : borrador.ejercicios.add(id);
    b.classList.toggle('marcada');
    pintarResumen();
    pintarExtra();
    const cab = b.closest('.categoria').querySelector('.cuenta');
    const n = b.closest('.lista-ej').querySelectorAll('.opcion.marcada').length;
    const zona = b.closest('.categoria').querySelector('[data-cat] > span:last-child');
    if (cab) cab.remove();
    if (n) zona.insertAdjacentHTML('afterbegin', `<span class="cuenta">${n} marcado${n > 1 ? 's' : ''}</span>`);
  }));
}

function musculosDesdeEjercicios() {
  return musculosDeSesion({ ejercicios: [...borrador.ejercicios] }, datos.propios);
}

function pintarExtra() {
  const deEj = musculosDesdeEjercicios();
  $('#extra').innerHTML = MUSCULOS.map(m => {
    if (deEj[m.id] === 'p') return `<span class="chip p" title="Ya viene de un ejercicio">${esc(m.corto)}</span>`;
    const marcado = borrador.extra[m.id] === 'p';
    return `<button class="chip ${marcado ? 'p' : ''}" data-extra="${m.id}">${marcado ? '✓ ' : '+ '}${esc(m.corto)}</button>`;
  }).join('');
  document.querySelectorAll('[data-extra]').forEach(b => b.addEventListener('click', () => {
    const id = b.dataset.extra;
    if (borrador.extra[id]) delete borrador.extra[id]; else borrador.extra[id] = 'p';
    pintarExtra();
    pintarResumen();
  }));
}

function pintarResumen() {
  const inv = musculosDeSesion({ ejercicios: [...borrador.ejercicios], extra: borrador.extra }, datos.propios);
  const n = borrador.ejercicios.size;
  const hay = n || Object.keys(borrador.extra).length;
  const choque = choqueDeGrupos([...borrador.ejercicios], datos.propios);
  $('#resumen').innerHTML = `
    <p>${n ? `${n} ejercicio${n > 1 ? 's' : ''} · ${esc(tipoDeSesion(inv))}` : 'Marca los ejercicios que hiciste'}</p>
    ${choque ? `<div class="nota" style="margin-bottom:10px">${esc(choque.join(' y '))} el mismo día no: cada uno pide todo lo que tienes. Deja uno para la próxima sesión de piernas.</div>` : ''}
    ${hay ? `<div class="chips">${chipsMusculos(inv)}</div>` : ''}
    <div class="fila-botones">
      ${borrador.id ? '<button class="boton sobrio" id="b-cancelar">Cancelar</button>' : ''}
      <button class="boton principal" id="b-guardar" ${hay ? '' : 'disabled'}>${borrador.id ? 'Guardar cambios' : 'Guardar entrenamiento'}</button>
    </div>`;
  $('#b-guardar').addEventListener('click', guardarBorrador);
  const cancelar = $('#b-cancelar');
  if (cancelar) cancelar.addEventListener('click', () => { nuevoBorrador(); mostrar('historial'); });
}

function guardarBorrador() {
  const sesion = {
    id: borrador.id || 's' + Date.now().toString(36),
    fecha: borrador.fecha,
    ejercicios: [...borrador.ejercicios],
    extra: borrador.extra,
    nota: borrador.nota.trim(),
  };
  if (borrador.programa) sesion.programa = borrador.programa;
  if (borrador.wod) sesion.wod = borrador.wod;
  const i = datos.sesiones.findIndex(s => s.id === sesion.id);
  if (i >= 0) datos.sesiones[i] = sesion; else datos.sesiones.push(sesion);
  datos.sesiones.sort((a, b) => a.fecha - b.fecha);
  guardar();
  const editado = !!borrador.id;
  nuevoBorrador();
  mostrar(editado ? 'historial' : 'hoy');
  avisar(editado ? 'Cambios guardados' : 'Guardado. Ahora a comer y a dormir.');
}

/* Ejercicio propio: nombre y músculos. Un toque lo marca principal, otro
   secundario, otro lo quita. */
function pintarCrear() {
  const caja = $('#crear');
  if (!creando) {
    caja.innerHTML = '<button class="enlace" id="b-crear">¿No está tu ejercicio? Créalo</button>';
    $('#b-crear').addEventListener('click', () => { creando = { nombre: '', m: {} }; pintarCrear(); });
    return;
  }
  caja.innerHTML = `
    <div class="nota" style="border-style:solid">
      <div class="campo"><label for="f-nombre">Nombre del ejercicio</label>
        <input type="text" id="f-nombre" value="${esc(creando.nombre)}" placeholder="Ej.: remo con maleta a una mano"></div>
      <label style="font-size:13px">Músculos (un toque: principal · otro: secundario · otro: quitar)</label>
      <div class="chips separado" id="crear-m">${MUSCULOS.map(m => {
        const t = creando.m[m.id];
        return `<button class="chip ${t || ''}" data-cm="${m.id}">${t === 'p' ? '● ' : t === 's' ? '○ ' : ''}${esc(m.corto)}</button>`;
      }).join('')}</div>
      <div class="fila-botones separado">
        <button class="boton sobrio" id="b-crear-no">Cancelar</button>
        <button class="boton principal" id="b-crear-si">Crear</button>
      </div>
    </div>`;
  $('#f-nombre').addEventListener('input', ev => { creando.nombre = ev.target.value; });
  document.querySelectorAll('[data-cm]').forEach(b => b.addEventListener('click', () => {
    const id = b.dataset.cm;
    const t = creando.m[id];
    if (!t) creando.m[id] = 'p'; else if (t === 'p') creando.m[id] = 's'; else delete creando.m[id];
    pintarCrear();
  }));
  $('#b-crear-no').addEventListener('click', () => { creando = null; pintarCrear(); });
  $('#b-crear-si').addEventListener('click', () => {
    const nombre = creando.nombre.trim();
    const p = Object.keys(creando.m).filter(k => creando.m[k] === 'p');
    const s = Object.keys(creando.m).filter(k => creando.m[k] === 's');
    if (!nombre) return avisar('Ponle un nombre');
    if (!p.length) return avisar('Marca al menos un músculo principal');
    const nuevo = { id: 'propio_' + Date.now().toString(36), cat: 'propios', pat: 'propio', equipo: 'Propio', nombre, p, s, esq: [] };
    datos.propios.push(nuevo);
    guardar();
    borrador.ejercicios.add(nuevo.id);
    abiertas.add('propios');
    creando = null;
    pintarLista();
    pintarCrear();
    pintarExtra();
    pintarResumen();
    avisar('Creado y marcado');
  });
}

/* ---------------- libro ---------------- */

/* Última sesión registrada desde un programa del libro. */
function ultimaDelLibro(idPrograma) {
  return [...datos.sesiones].filter(s => s.programa && PROG[s.programa.id] && (!idPrograma || s.programa.id === idPrograma))
    .sort((a, b) => b.fecha - a.fecha)[0] || null;
}

function diaSiguiente(idPrograma) {
  const u = ultimaDelLibro(idPrograma);
  return u ? (u.programa.dia + 1) % PROG[idPrograma].dias.length : 0;
}

function pintarLibro() {
  const u = ultimaDelLibro();
  let h = `<h2>Entreno dinosaurio</h2>
    <p class="intro">Las rutinas de dos y tres días por semana que Brooks Kubik propone en <em>Dinosaur Training</em>, con tu equipo: donde él usa bolsas de arena o barriles va el tronco, y donde usa mancuernas, las maletas o la barra.</p>`;
  if (u && Date.now() - u.fecha < 21 * DIA) {
    const p = PROG[u.programa.id];
    const sig = diaSiguiente(p.id);
    h += `<button class="boton-grande" data-programa="${p.id}" data-dia="${sig}">
        <span><strong>Sigue: ${esc(p.dias[sig].nombre)}</strong><small>${esc(p.nombre)} · el último fue ${esc(p.dias[u.programa.dia].nombre)}, ${esc(fmtHace(u.fecha))}</small></span>
        ${ICONOS.flecha}
      </button>`;
  }
  for (const [frec, titulo] of [[2, 'Dos días por semana'], [3, 'Tres días por semana']]) {
    h += `<div class="semana-sep">${titulo}</div>`;
    for (const p of PROGRAMAS.filter(x => x.frecuencia === frec)) {
      h += `<article class="sesion programa" data-programa="${p.id}">
          <div class="arriba"><span class="cuando">${esc(p.nombre)}</span><span class="hace">${p.dias.length} sesiones</span></div>
          <div class="tipo">${esc(p.fuente)}</div>
          <p class="intro" style="margin:0 0 10px;font-size:14.5px">${esc(p.intro)}</p>
          <div class="chips">${p.dias.map(d => `<span class="chip">${esc(d.nombre)}</span>`).join('')}</div>
        </article>`;
    }
  }
  $('#v-libro').innerHTML = h;
  document.querySelectorAll('[data-programa]').forEach(b => b.addEventListener('click', () =>
    abrirPrograma(b.dataset.programa, b.dataset.dia !== undefined ? +b.dataset.dia : diaSiguiente(b.dataset.programa))));
}

const libro = { id: null, dia: 0 };

function abrirPrograma(id, dia) {
  libro.id = id;
  libro.dia = dia;
  $('#hoja').hidden = false;
  document.body.style.overflow = 'hidden';
  pintarPrograma();
}

function pintarPrograma() {
  const p = PROG[libro.id];
  const d = p.dias[libro.dia];
  const est = estadoAhora();
  const ids = d.ej.map(x => x[0]);
  let h = `
    <div class="hoja-arriba">
      <h3 style="margin:0">${esc(p.fuente)}</h3>
      <button class="cerrar" id="b-cerrar" aria-label="Cerrar">${ICONOS.cerrar}</button>
    </div>
    <div class="titulo-rutina">${esc(p.nombre)}</div>
    <p class="intro kubik">${esc(p.intro)}</p>
    <div class="selector" style="margin-bottom:14px">${p.dias.map((x, i) =>
      `<button data-dia="${i}" class="${i === libro.dia ? 'activo' : ''}">${esc(x.nombre)}</button>`).join('')}</div>`;

  // Avisos: lo que todavía descansa y la mezcla de sentadilla con peso muerto.
  const inv = musculosDeSesion({ ejercicios: ids }, datos.propios);
  const cansados = Object.keys(inv).filter(m => inv[m] === 'p' && est[m] && !est[m].listo);
  if (cansados.length) {
    h += `<div class="nota" style="margin-bottom:10px">Todavía descansan: <strong>${cansados.map(m =>
      `${esc(MUS[m].corto)} (${fmtFaltan(est[m].faltanHoras)})`).join(', ')}</strong>. Si puedes, espera; si no, baja el peso en lo que los carga.</div>`;
  }
  const choque = choqueDeGrupos(ids, datos.propios);
  if (choque) {
    h += `<div class="nota" style="margin-bottom:10px">Kubik junta aquí ${esc(choque.join(' y ').toLowerCase())}. La rutina sugerida de la app nunca lo hace; en el libro va así a propósito.</div>`;
  }

  h += `
    <div class="ejercicio calentar" style="--i:0">
      <span class="num">C</span>
      <div>
        <h4>Calentamiento</h4>
        <span class="equipo">Cuerda</span>
        <p class="kubik">2 a 5 minutos de cuerda, suave. Guarda la energía para el hierro.</p>
      </div>
    </div>`;
  d.ej.forEach(([id, series, nota], i) => {
    const ej = ejercicio(id);
    const m = {};
    for (const x of ej.s) m[x] = 's';
    for (const x of ej.p) m[x] = 'p';
    h += `
      <div class="ejercicio" style="--i:${i + 1}">
        <span class="num">${i + 1}</span>
        <div>
          <h4>${esc(ej.nombre)}</h4>
          <span class="equipo">${esc(ej.equipo)}</span>
          <div class="esquema">${esc(series)}</div>
          ${nota ? `<p class="kubik">${esc(nota)}</p>` : ''}
          <div class="chips">${chipsMusculos(m)}</div>
          ${botonEjecucion(id)}
        </div>
      </div>`;
  });

  $('#hoja-cuerpo').innerHTML = h;
  $('#hoja').scrollTop = 0;
  $('#b-cerrar').addEventListener('click', cerrarHoja);
  document.querySelectorAll('#hoja-cuerpo [data-dia]').forEach(b => b.addEventListener('click', () => {
    libro.dia = +b.dataset.dia;
    pintarPrograma();
  }));

  let barra = document.querySelector('.barra-inferior');
  if (!barra) {
    barra = document.createElement('div');
    barra.className = 'barra-inferior';
    document.body.appendChild(barra);
  }
  barra.innerHTML = `<div class="dentro"><button class="boton principal" id="b-hecho">Lo hice</button></div>`;
  $('#b-hecho').addEventListener('click', () => {
    nuevoBorrador(['cuerda', ...ids]);
    borrador.programa = { id: p.id, dia: libro.dia };
    cerrarHoja();
    mostrar('registrar');
    avisar('Revisa y guarda. Puedes quitar lo que no hiciste.');
  });
}

/* ---------------- historial ---------------- */

function inicioSemana(ms) {
  const d = new Date(ms);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));   // lunes
  return d.getTime();
}

function pintarHistorial() {
  const lista = [...datos.sesiones].sort((a, b) => b.fecha - a.fecha);
  if (!lista.length) {
    $('#v-historial').innerHTML = `<h2>Historial</h2>
      <div class="vacio">${ICONOS.pesa}<p>Todavía no hay entrenamientos.<br>El primero se registra en <strong>Registrar</strong>, o desde la rutina sugerida con <strong>Lo hice</strong>.</p></div>`;
    return;
  }
  const esta = inicioSemana(Date.now());
  let h = '<h2>Historial</h2>';
  let semanaActual = null;
  for (const s of lista) {
    const sem = inicioSemana(s.fecha);
    if (sem !== semanaActual) {
      semanaActual = sem;
      const d = new Date(sem);
      const nombre = sem === esta ? 'Esta semana'
        : sem === esta - 7 * DIA ? 'Semana pasada'
        : `Semana del ${d.getDate()} ${MESES[d.getMonth()]}`;
      const n = lista.filter(x => inicioSemana(x.fecha) === sem).length;
      h += `<div class="semana-sep">${nombre} · ${n} ${n > 1 ? 'sesiones' : 'sesión'}</div>`;
    }
    const inv = musculosDeSesion(s, datos.propios);
    const nombres = s.ejercicios.map(id => ejercicio(id)).filter(Boolean).map(e => e.nombre);
    const aMano = Object.keys(s.extra || {}).map(id => MUS[id] && MUS[id].corto).filter(Boolean);
    h += `<article class="sesion">
        <div class="arriba"><span class="cuando">${esc(fmtCuando(s.fecha))}</span><span class="hace">${esc(fmtHace(s.fecha))}</span></div>
        <div class="tipo">${esc(tipoDeSesion(inv))}</div>
        ${s.wod && typeof WOD !== 'undefined' && WOD[s.wod.id] ? `<p class="intro" style="margin:0 0 8px;font-size:14px">CrossFit: ${esc(WOD[s.wod.id].nombre)}${s.wod.resultado ? ' · ' + esc(s.wod.resultado) : ''}</p>` : ''}
        ${s.programa && PROG[s.programa.id] ? `<p class="intro" style="margin:0 0 8px;font-size:14px">Entreno dinosaurio: ${esc(PROG[s.programa.id].nombre)} · ${esc(PROG[s.programa.id].dias[s.programa.dia].nombre)}</p>` : ''}
        ${nombres.length ? `<ul>${nombres.map(n => `<li>${esc(n)}</li>`).join('')}</ul>` : ''}
        ${aMano.length ? `<p class="intro" style="margin:0 0 8px;font-size:14px">A mano: ${esc(aMano.join(', '))}</p>` : ''}
        <div class="chips">${chipsMusculos(inv)}</div>
        ${s.nota ? `<p class="kubik" style="margin:10px 0 0;font-size:14.5px">${esc(s.nota)}</p>` : ''}
        <div class="acciones">
          <button class="boton sobrio" data-editar="${esc(s.id)}">Editar</button>
          <button class="boton sobrio" data-borrar="${esc(s.id)}">Borrar</button>
        </div>
      </article>`;
  }
  $('#v-historial').innerHTML = h;
  document.querySelectorAll('[data-editar]').forEach(b => b.addEventListener('click', () => {
    const s = datos.sesiones.find(x => x.id === b.dataset.editar);
    if (!s) return;
    nuevoBorrador(null, s);
    mostrar('registrar');
  }));
  document.querySelectorAll('[data-borrar]').forEach(b => b.addEventListener('click', () => {
    const s = datos.sesiones.find(x => x.id === b.dataset.borrar);
    if (!s) return;
    confirmar(`¿Borrar el entrenamiento del ${fmtCuando(s.fecha)}?`, 'Borrar', () => {
      datos.sesiones = datos.sesiones.filter(x => x.id !== s.id);
      guardar();
      pintarHistorial();
      avisar('Borrado');
    });
  }));
}

/* ---------------- guía ---------------- */

function pintarGuia() {
  const d = descansos();
  let h = `<h2>Los principios</h2>
    <p class="intro">Basado en <em>Dinosaur Training</em> de Brooks Kubik (1996).</p>
    ${PRINCIPIOS.map(([t, x], i) => `<div class="principio"><span class="n">${i + 1}</span><div><b>${esc(t)}</b><p>${esc(x)}</p></div></div>`).join('')}

    <h2>Cómo decide la app</h2>
    <div class="nota">
      <p style="margin-top:0">Cada músculo tiene su descanso. Un ejercicio lo trabaja como <strong>principal</strong> (pide el descanso completo) o <strong>de rebote</strong> (pide un tercio y cuenta como media vez en la semana). Las dominadas, por ejemplo, trabajan la espalda como principal y el bíceps de rebote. Para que un músculo entre de rebote tiene que estar recuperado en un 75 %: así, el día después de los brazos no aparecen las dominadas.</p>
      <p>La meta es tocar cada músculo <strong>2 veces en 7 días</strong>. La rutina sugerida:</p>
      <p>· elige piernas, torso o cuerpo completo según lo que ya descansó;<br>
      · solo usa ejercicios cuyos músculos principales cumplieron su descanso, y cuyos músculos de rebote van en un 60 % o más;<br>
      · prefiere lo que va más atrasado en la semana;<br>
      · no repite los ejercicios de la sesión anterior (Kubik tampoco lo hacía);<br>
      · deja las poleas como complemento o plan B.</p>
      <p style="margin-bottom:0">No anotas kilos ni series: cada esquema dice cómo medir el esfuerzo y cuándo subir el peso.</p>
    </div>

    <h2>Descanso por músculo</h2>
    <p class="intro">Tras trabajarlo como principal. Puedes ajustarlo si te recuperas más rápido o más lento.</p>
    ${MUSCULOS.map(m => `<div class="descanso-fila">
        <div class="txt"><b>${esc(m.nombre)}</b><small>${esc(m.porque)}</small></div>
        <div class="pasos">
          <button data-menos="${m.id}" aria-label="Menos">−</button>
          <output>${d[m.id]} h</output>
          <button data-mas="${m.id}" aria-label="Más">+</button>
        </div>
      </div>`).join('')}
    <button class="enlace separado" id="b-restaurar">Volver a los valores de Kubik</button>

    <h2 id="respaldo">Respaldo</h2>
    <p class="intro">Tus datos viven solo en este teléfono. Exporta de vez en cuando y guarda el texto donde quieras (correo, WhatsApp, Drive).</p>
    <div class="fila-botones">
      <button class="boton sobrio" id="b-exportar">Exportar</button>
      <button class="boton sobrio" id="b-importar">Importar</button>
    </div>
    <div id="importar" hidden class="separado">
      <textarea id="f-importar" placeholder="Pega aquí el texto del respaldo"></textarea>
      <button class="boton principal ancho separado" id="b-importar-si">Reemplazar mis datos con este respaldo</button>
    </div>
    <button class="enlace separado" id="b-borrar-todo" style="color:var(--descansa)">Borrar todos los datos</button>`;
  $('#v-guia').innerHTML = h;

  const cambiar = (id, delta) => {
    const m = MUS[id];
    const v = Math.min(120, Math.max(24, (datos.descansos[id] || m.descanso) + delta));
    if (v === m.descanso) delete datos.descansos[id]; else datos.descansos[id] = v;
    guardar();
    pintarGuia();
  };
  document.querySelectorAll('[data-menos]').forEach(b => b.addEventListener('click', () => cambiar(b.dataset.menos, -12)));
  document.querySelectorAll('[data-mas]').forEach(b => b.addEventListener('click', () => cambiar(b.dataset.mas, 12)));
  $('#b-restaurar').addEventListener('click', () => { datos.descansos = {}; guardar(); pintarGuia(); avisar('Descansos restaurados'); });
  $('#b-exportar').addEventListener('click', exportar);
  $('#b-importar').addEventListener('click', () => { $('#importar').hidden = !$('#importar').hidden; });
  $('#b-importar-si').addEventListener('click', () => {
    try {
      const d = JSON.parse($('#f-importar').value.trim());
      if (!d || !Array.isArray(d.sesiones)) throw new Error('formato');
      confirmar(`El respaldo trae ${d.sesiones.length} entrenamientos. ¿Reemplazar los datos actuales?`, 'Reemplazar', () => {
        migrarPropios(d);
        datos = { sesiones: d.sesiones, descansos: d.descansos || {}, propios: d.propios || [], lesion: zonasVigentes(d.lesion) };
        guardar();
        pintarGuia();
        avisar('Respaldo cargado');
      });
    } catch (e) {
      avisar('Ese texto no es un respaldo de la app');
    }
  });
  $('#b-borrar-todo').addEventListener('click', () => {
    confirmar('¿Borrar todos los entrenamientos, ejercicios propios y ajustes? No se puede deshacer.', 'Borrar todo', () => {
      datos = { sesiones: [], descansos: {}, propios: [], lesion: [] };
      guardar();
      pintarGuia();
      avisar('Datos borrados');
    });
  });
}

function exportar() {
  const texto = JSON.stringify({ app: 'dinosaurio', version: 1, exportado: new Date().toISOString(), ...datos });
  if (window.Android && Android.compartirTexto) {
    Android.compartirTexto(texto, 'Respaldo DinoEntreno');
  } else if (navigator.share) {
    navigator.share({ title: 'Respaldo DinoEntreno', text: texto }).catch(() => {});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(texto).then(() => avisar('Respaldo copiado'), () => avisar('No pude copiarlo'));
  }
}

/* ---------------- avisos y diálogo ---------------- */

let temporizador;
function avisar(texto, ms) {
  const a = $('#aviso');
  a.textContent = texto;
  a.hidden = false;
  a.style.animation = 'none'; void a.offsetWidth; a.style.animation = '';
  clearTimeout(temporizador);
  temporizador = setTimeout(() => { a.hidden = true; }, ms || 2400);
}

let alConfirmar = null;
function confirmar(texto, boton, accion) {
  $('#dialogo-texto').textContent = texto;
  $('#dialogo-si').textContent = boton;
  alConfirmar = accion;
  $('#dialogo').hidden = false;
}
$('#dialogo-no').addEventListener('click', () => { $('#dialogo').hidden = true; alConfirmar = null; });
$('#dialogo-si').addEventListener('click', () => {
  $('#dialogo').hidden = true;
  const f = alConfirmar; alConfirmar = null;
  if (f) f();
});
$('#dialogo').addEventListener('click', ev => { if (ev.target.id === 'dialogo') { $('#dialogo').hidden = true; alConfirmar = null; } });

/* El botón atrás de Android: primero cierra lo que esté encima. */
window.volverAtras = function () {
  if (!$('#dialogo').hidden) { $('#dialogo').hidden = true; return true; }
  if (!$('#hoja').hidden) { cerrarHoja(); return true; }
  if (vistaActual !== 'hoy') { mostrar('hoy'); return true; }
  return false;
};

/* ---------------- arranque ---------------- */

$('#frase').textContent = FRASES[Math.floor(Date.now() / DIA) % FRASES.length];
mostrar('hoy');

// Los estados cambian con el reloj: se repinta al volver a la app y cada minuto.
document.addEventListener('visibilitychange', () => { if (!document.hidden && vistaActual === 'hoy') pintarHoy(); });
setInterval(() => { if (vistaActual === 'hoy' && $('#hoja').hidden) pintarHoy(); }, 60e3);

// Instalada desde el navegador (iPhone): funciona sin internet y pide que no le borren los datos.
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
  if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
}
