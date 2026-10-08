/* Cálculo de descanso y armado de la rutina sugerida. No toca la pantalla:
   recibe las sesiones guardadas y devuelve datos. */

const HORA = 3600e3;
const DIA = 24 * HORA;
const META_SEMANAL = 2;          // veces por semana que se quiere tocar cada músculo
const FACTOR_SECUNDARIO = 1 / 3; // un músculo tocado de rebote pide un tercio del descanso
const PESO_SECUNDARIO = 0.5;     // y cuenta como media vez en la semana
const MINIMO_SECUNDARIO = 0.75;  // para usarlo de rebote tiene que estar recuperado en tres cuartos

const EJ = Object.fromEntries(EJERCICIOS.map(e => [e.id, e]));
const MUS = Object.fromEntries(MUSCULOS.map(m => [m.id, m]));

function buscarEjercicio(id, propios) {
  return EJ[id] || (propios || []).find(e => e.id === id) || null;
}

/* Qué músculos tocó una sesión: 'p' principal, 's' secundario. Si un
   ejercicio lo tiene de principal y otro de secundario, gana el principal. */
function musculosDeSesion(sesion, propios) {
  const r = {};
  for (const id of sesion.ejercicios || []) {
    const e = buscarEjercicio(id, propios);
    if (!e) continue;
    for (const m of e.s || []) if (!r[m]) r[m] = 's';
    for (const m of e.p || []) r[m] = 'p';
  }
  for (const [m, t] of Object.entries(sesion.extra || {})) {
    if (t === 'p' || (t === 's' && !r[m])) r[m] = t;
  }
  return r;
}

/* Estado de cada músculo en un momento dado. */
function calcularEstado(sesiones, ahora, descansos, propios) {
  const est = {};
  for (const m of MUSCULOS) {
    est[m.id] = { id: m.id, listoEn: 0, recup: 1, ultima: null, semana: 0, veces: 0 };
  }
  for (const s of sesiones) {
    if (s.fecha > ahora) continue;
    const inv = musculosDeSesion(s, propios);
    for (const [m, tipo] of Object.entries(inv)) {
      const e = est[m];
      if (!e) continue;
      const f = tipo === 'p' ? 1 : FACTOR_SECUNDARIO;
      const dur = (descansos[m] || MUS[m].descanso) * f * HORA;
      const fin = s.fecha + dur;
      if (fin > e.listoEn) e.listoEn = fin;
      const r = Math.min(1, (ahora - s.fecha) / dur);
      if (r < e.recup) e.recup = r;
      if (e.ultima === null || s.fecha > e.ultima) e.ultima = s.fecha;
      if (ahora - s.fecha < 7 * DIA) e.semana += tipo === 'p' ? 1 : PESO_SECUNDARIO;
      e.veces++;
    }
  }
  for (const e of Object.values(est)) {
    e.listo = ahora >= e.listoEn;
    e.faltanHoras = e.listo ? 0 : (e.listoEn - ahora) / HORA;
    e.deficit = Math.max(0, META_SEMANAL - e.semana);
  }
  return est;
}

/* Cuánto conviene entrenar hoy ese músculo. Cero si no ha descansado. */
function prioridad(e, ahora) {
  if (!e.listo) return 0;
  const dias = e.ultima === null ? 7 : Math.min(7, (ahora - e.ultima) / DIA);
  return e.deficit * 10 + dias;
}

function permitido(ej, est) {
  if (!(ej.p || []).every(m => est[m] && est[m].listo)) return false;
  return (ej.s || []).every(m => !est[m] || est[m].listo || est[m].recup >= MINIMO_SECUNDARIO);
}

/* Números pseudoaleatorios repetibles: la misma semilla da la misma rutina. */
function azar(semilla) {
  let a = semilla >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const INF = ['cuadriceps', 'gluteos', 'lumbares'];
const SUP = ['pecho', 'espalda', 'hombros'];

/* ¿Entrena día por medio o menos? Entonces conviene cuerpo completo para
   llegar a dos veces por semana. Si entrena seguido, se divide en piernas y
   torso: así siempre queda algo descansado para el día siguiente. */
function entrenaEspaciado(sesiones, ahora) {
  const fechas = sesiones.filter(s => s.fecha <= ahora && ahora - s.fecha < 21 * DIA)
    .map(s => s.fecha).sort((a, b) => a - b);
  if (fechas.length < 2) return false;
  fechas.push(ahora);
  const brecha = (fechas[fechas.length - 1] - fechas[0]) / (fechas.length - 1);
  return brecha >= 2.5 * DIA;
}

function elegirFoco(est, sesiones, ahora, pri) {
  const pide = m => est[m].listo && est[m].deficit > 0;
  const okInf = INF.filter(pide).length >= 2;
  const okSup = SUP.filter(pide).length >= 2;
  if (okInf && okSup && entrenaEspaciado(sesiones, ahora)) return 'completo';
  if (okInf && okSup) {
    const suma = lista => lista.reduce((t, m) => t + pri[m], 0);
    return suma(INF) / INF.length >= suma(SUP) / SUP.length ? 'inferior' : 'superior';
  }
  if (okInf) return 'inferior';
  if (okSup) return 'superior';
  if (['agarre', 'core', 'cuello'].some(pide)) return 'corto';
  const grandes = [...INF, ...SUP];
  if (grandes.some(m => !est[m].listo)) return 'descanso';
  return 'cumplida';
}

/* Zonas con dolor: el músculo queda como si no hubiera descansado (fuera de
   principal y de rebote) y la articulación veta los ejercicios que la cargan.
   Devuelve los ids de ejercicios que no entran hoy. */
function aplicarLesion(est, zonas) {
  const vetados = new Set();
  for (const z of zonas) {
    if (est[z]) Object.assign(est[z], { listo: false, recup: 0, deficit: 0, lesion: true });
    const art = ARTICULACIONES.find(a => a.id === z);
    if (art) art.ej.forEach(id => vetados.add(id));
  }
  for (const ej of EJERCICIOS) {
    if ([...ej.p, ...(ej.s || [])].some(m => est[m] && est[m].lesion)) vetados.add(ej.id);
  }
  return vetados;
}

/* El siguiente músculo grande que termina de descansar. */
function proximoListo(est) {
  let mejor = null;
  for (const m of [...INF, ...SUP]) {
    const e = est[m];
    if (!e.listo && !e.lesion && (!mejor || e.listoEn < mejor.listoEn)) mejor = e;
  }
  return mejor;
}

/* Arma la rutina. opciones.foco: 'auto' o el nombre de una plantilla. */
function sugerir(sesiones, ahora, descansos, propios, opciones) {
  const semilla = opciones.semilla || 1;
  const rnd = azar(semilla * 7919 + Math.floor(ahora / DIA));
  const est = calcularEstado(sesiones, ahora, descansos, propios);
  const vetados = aplicarLesion(est, opciones.lesion || []);
  const pri = {};
  for (const m of MUSCULOS) pri[m.id] = prioridad(est[m.id], ahora);
  const automatico = !opciones.foco || opciones.foco === 'auto';
  const base = { automatico, est, vetados, proximo: proximoListo(est) };
  if (!automatico) return armar(opciones.foco, base, sesiones, ahora, propios, semilla, rnd, est, pri);

  // En automático, si el foco elegido no se puede armar bien, se prueba el
  // siguiente: siempre hay algo que entrenar sin pisar el descanso de ayer.
  const primero = elegirFoco(est, sesiones, ahora, pri);
  if (!PLANTILLAS[primero]) return { ...base, foco: primero, ejercicios: [] };
  const orden = [primero, ...['inferior', 'superior', 'corto'].filter(f => f !== primero)];
  for (const foco of orden) {
    const r = armar(foco, base, sesiones, ahora, propios, semilla, azar(semilla * 7919 + Math.floor(ahora / DIA)), est, { ...pri });
    if (!r.faltaPrincipal && r.ejercicios.length >= (foco === 'corto' ? 1 : 2)) return r;
  }
  return { ...base, foco: 'descanso', ejercicios: [] };
}

function armar(foco, base, sesiones, ahora, propios, semilla, rnd, est, pri) {
  const resultado = { ...base, foco, ejercicios: [] };
  if (!PLANTILLAS[foco]) return resultado;   // descanso o semana cumplida

  const plantilla = PLANTILLAS[foco];
  resultado.titulo = plantilla.titulo;
  resultado.intro = plantilla.intro;

  // Kubik no repetía los mismos ejercicios en dos sesiones seguidas.
  const ordenadas = [...sesiones].filter(s => s.fecha <= ahora).sort((a, b) => b.fecha - a.fecha);
  const ultima = new Set(ordenadas[0] ? ordenadas[0].ejercicios : []);
  const penultima = new Set(ordenadas[1] ? ordenadas[1].ejercicios : []);

  // Sentadilla y peso muerto se turnan: el que se hizo la última vez cede el
  // lugar al otro, y nunca van juntos en la misma sesión.
  let grupoAnterior = null;
  for (const s of ordenadas) {
    const g = (s.ejercicios || []).map(id => (EJ[id] || {}).grupo).find(Boolean);
    if (g) { grupoAnterior = g; break; }
  }
  let grupoUsado = null;

  const ajenos = new Set(foco === 'inferior' ? [...SUP, 'triceps', 'biceps']
    : foco === 'superior' || foco === 'corto' ? INF : []);

  const usados = new Set();
  const patronesUsados = new Set();
  plantilla.casilleros.forEach((patrones, n) => {
    let mejor = null;
    for (const ej of EJERCICIOS) {
      if (ej.kubik === false || usados.has(ej.id) || !patrones.includes(ej.pat)) continue;
      if (base.vetados.has(ej.id) || !permitido(ej, est)) continue;
      if (ej.grupo && grupoUsado && ej.grupo !== grupoUsado) continue;
      // Los burpees no tienen músculo principal: son para los pulmones.
      const aporte = ej.pat === 'acondicionamiento' ? 6 : ej.p.reduce((t, m) => t + pri[m], 0);
      if (aporte <= 0) continue;
      // El primer patrón del casillero es el que Kubik pondría ahí; los
      // levantamientos básicos con barra van por delante de las variantes.
      const orden = patrones.indexOf(ej.pat);
      let puntaje = aporte / Math.max(1, ej.p.length) * (1 + 0.15 * Math.max(0, ej.p.length - 1))
        + (orden === 0 ? 5 : orden === 1 ? 2 : 0)
        + (ej.base ? 3 : 0)
        + rnd() * 2.5;
      // Lo que toca de rebote músculos del otro día les come descanso.
      for (const m of ej.s || []) if (ajenos.has(m)) puntaje -= 2.5;
      if (patrones.length > 1 && patronesUsados.has(ej.pat)) puntaje -= 6;
      if (ultima.has(ej.id)) puntaje -= 8;
      else if (penultima.has(ej.id)) puntaje -= 3;
      if (ej.planB) puntaje -= 6;
      if (ej.grupo && ej.grupo === grupoAnterior) puntaje -= 8;
      if (!mejor || puntaje > mejor.puntaje) mejor = { ej, puntaje };
    }
    if (!mejor || mejor.puntaje < 4) {
      // En el día corto ningún casillero es imprescindible: si el agarre
      // todavía descansa, igual quedan el cuello y el abdomen.
      if (n === 0 && foco !== 'corto') resultado.faltaPrincipal = true;
      return;
    }
    const ej = mejor.ej;
    usados.add(ej.id);
    patronesUsados.add(ej.pat);
    if (ej.grupo) grupoUsado = ej.grupo;
    // Lo ya trabajado en esta sesión pierde interés para los casilleros siguientes.
    for (const m of ej.p) pri[m] *= 0.2;
    for (const m of ej.s || []) pri[m] *= 0.6;
    const veces = sesiones.filter(s => (s.ejercicios || []).includes(ej.id)).length;
    const esquema = ej.esq[(veces + semilla - 1) % ej.esq.length];
    resultado.ejercicios.push({ id: ej.id, esquema });
  });

  const tocados = musculosDeSesion({ ejercicios: resultado.ejercicios.map(e => e.id) }, propios);
  resultado.tocados = tocados;
  if (foco === 'corto' && resultado.ejercicios.length && !tocados.agarre) {
    resultado.titulo = 'Cuello y abdomen';
    resultado.intro = 'Piernas, torso y manos siguen reconstruyéndose. Hoy van el cuello y el abdomen, que se recuperan rápido, y a la casa.';
  }
  resultado.descansan = MUSCULOS.filter(m => !est[m.id].listo).map(m => est[m.id]);
  return resultado;
}

/* Si una lista de ejercicios mezcla sentadilla y peso muerto, devuelve los
   nombres de los dos grupos; si no, null. */
function choqueDeGrupos(ids, propios) {
  const g = new Set(ids.map(id => (buscarEjercicio(id, propios) || {}).grupo).filter(Boolean));
  return g.size > 1 ? [...g].map(x => GRUPOS_EXCLUYENTES[x]) : null;
}

/* Nombre corto del tipo de sesión, deducido de lo que se trabajó. */
function tipoDeSesion(inv) {
  const p = Object.keys(inv).filter(m => inv[m] === 'p');
  const inf = p.some(m => INF.includes(m));
  const sup = p.some(m => [...SUP, 'triceps', 'biceps'].includes(m));
  if (inf && sup) return 'Cuerpo completo';
  if (inf) return 'Piernas y cadera';
  if (sup) return 'Torso';
  if (p.length) return 'Agarre, cuello y abdomen';
  return 'Liviano';
}
