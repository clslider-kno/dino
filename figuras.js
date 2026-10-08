/* Figuras de palitos para la Baraja: la pinta de cada carta toma la forma
   del ejercicio. Todas en un cuadro de 100 × 100 y con el color de la tinta. */

const FIGURAS = (() => {
  const L = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
  const P = (...pts) => `<polyline points="${pts.join(' ')}"/>`;
  const cabeza = (x, y) => `<circle class="lleno" cx="${x}" cy="${y}" r="7"/>`;
  const disco = (x, y, r = 9) => `<circle class="lleno" cx="${x}" cy="${y}" r="${r}"/>`;
  const barra = (x1, x2, y) => L(x1, y, x2, y) + `<rect class="lleno" x="${x1 - 3}" y="${y - 9}" width="7" height="18" rx="2"/><rect class="lleno" x="${x2 - 4}" y="${y - 9}" width="7" height="18" rx="2"/>`;
  return {
    sentadilla: cabeza(66, 18) + disco(52, 30, 10) + P('60,28', '40,56', '66,60', '62,88', '74,88') + P('58,32', '50,40'),
    sentadilla_libre: cabeza(62, 18) + P('58,26', '40,56', '66,60', '62,88', '74,88') + P('56,32', '84,34'),
    peso_muerto: cabeza(70, 33) + P('62,40', '34,50', '48,68', '44,88', '54,88') + L(62, 41, 62, 64) + disco(62, 70, 11),
    press: barra(22, 78, 10) + cabeza(50, 26) + L(50, 34, 50, 60) + P('38,12', '50,36', '62,12') + P('40,88', '50,60', '60,88'),
    banca: L(14, 72, 86, 72) + L(26, 72, 26, 88) + L(74, 72, 74, 88) + cabeza(80, 58) + P('72,63', '38,63', '24,56', '20,88') + L(64, 62, 64, 36) + disco(64, 30, 10),
    dominada: L(12, 10, 88, 10) + cabeza(50, 22) + P('38,10', '36,24', '50,30', '64,24', '62,10') + L(50, 30, 50, 58) + P('44,86', '50,58', '56,86'),
    remo: cabeza(82, 34) + P('72,40', '32,48', '46,66', '42,88', '52,88') + P('68,42', '58,58', '50,52') + disco(50, 60, 9),
    curl: cabeza(38, 18) + L(38, 26, 38, 58) + P('38,30', '40,50', '60,40') + disco(66, 38, 9) + P('32,88', '38,58', '46,88'),
    flexion: cabeza(82, 48) + P('74,53', '16,74', '12,84') + L(70, 55, 70, 84) + L(8, 88, 92, 88),
    abdominal: cabeza(64, 34) + P('40,74', '58,44') + P('58,46', '70,28') + P('40,74', '24,54', '12,80') + L(6, 86, 94, 86),
    burpee: cabeza(50, 22) + L(50, 30, 50, 58) + P('30,10', '50,32', '70,10') + P('46,86', '42,72', '50,58', '58,72', '54,86') + L(34, 94, 44, 94) + L(56, 94, 66, 94),
    estrella: cabeza(50, 18) + L(50, 26, 50, 54) + P('22,8', '50,30', '78,8') + P('24,90', '50,54', '76,90'),
    escalador: cabeza(84, 44) + P('76,49', '36,62', '12,82') + P('36,62', '58,70', '54,84') + L(74, 50, 76, 84) + L(6, 88, 94, 88),
    acarreo: cabeza(50, 16) + L(50, 24, 50, 56) + P('40,54', '50,28', '60,54') + `<rect class="lleno" x="33" y="54" width="14" height="16" rx="3"/><rect class="lleno" x="53" y="54" width="14" height="16" rx="3"/>` + P('36,88', '50,56', '64,88'),
    cuerda: cabeza(50, 18) + L(50, 26, 50, 56) + P('32,50', '50,30', '68,50') + P('44,82', '50,56', '56,82') + `<path d="M32 50 Q50 112 68 50" stroke-width="3"/><path d="M32 50 Q50 -16 68 50" stroke-width="3" stroke-dasharray="4 6"/>`,
    fondos: L(30, 46, 30, 92) + L(70, 46, 70, 92) + cabeza(50, 14) + L(50, 22, 50, 52) + P('30,46', '40,40', '50,26', '60,40', '70,46') + P('50,52', '42,70', '52,80'),
    tronco: cabeza(50, 14) + L(50, 22, 50, 58) + `<rect x="20" y="30" width="60" height="18" rx="9"/>` + P('32,40', '50,28', '68,40') + P('40,88', '50,58', '60,88'),
    pesa: L(30, 50, 70, 50) + `<rect class="lleno" x="18" y="32" width="12" height="36" rx="3"/><rect class="lleno" x="70" y="32" width="12" height="36" rx="3"/>` + `<rect class="lleno" x="10" y="38" width="8" height="24" rx="2"/><rect class="lleno" x="82" y="38" width="8" height="24" rx="2"/>`,
  };
})();

/* Qué figura lleva cada ejercicio: primero por id, después por patrón. */
const FIGURA_POR_ID = {
  sentadilla_libre: 'sentadilla_libre', thruster: 'press', ohs: 'press', arranque: 'press', cargada: 'peso_muerto',
  hspu: 'press', muscle_up: 'dominada', correr: 'acarreo', swing_disco: 'peso_muerto', salto_cajon: 'burpee', pistol: 'sentadilla_libre',
  dips: 'fondos', fondos_anillas: 'fondos', flexiones: 'flexion', burpees: 'burpee', saltos_estrella: 'estrella', escaladores: 'escalador',
  cuerda: 'cuerda', colgado: 'dominada', elev_piernas: 'dominada', remo_cuello: 'curl', remo_cuello_polea: 'curl',
  encog_trap: 'acarreo', encog_maletas: 'acarreo', talones: 'sentadilla', turca: 'press', giro_barra: 'press',
  log_sent: 'tronco', pull_through: 'peso_muerto', face_pull: 'remo', crunch_polea: 'abdominal',
  triceps_v: 'curl', patada_gluteo: 'peso_muerto', curl_femoral_pie: 'sentadilla_libre', abduccion_polea: 'estrella', aduccion_polea: 'estrella', elev_rodilla_polea: 'escalador',
  rueda: 'flexion', rueda_pie: 'flexion', pull_apart: 'remo',
  triceps_cuerda: 'curl', triceps_barra: 'curl', cuarto_sent: 'sentadilla', press_banca_parcial: 'banca',
};
const FIGURA_POR_PATRON = {
  sentadilla: 'sentadilla', bisagra: 'peso_muerto', parcial: 'peso_muerto', empuje_v: 'press', empuje_h: 'banca',
  tiron_v: 'dominada', tiron_h: 'remo', trapecio: 'acarreo', brazos: 'curl', core: 'abdominal', acarreo: 'acarreo',
  agarre: 'acarreo', tronco_pierna: 'tronco', acondicionamiento: 'burpee', calentar: 'cuerda',
};

function figuraDe(idEjercicio) {
  const e = typeof ejercicio === 'function' ? ejercicio(idEjercicio) : null;
  const clave = FIGURA_POR_ID[idEjercicio] || (e && FIGURA_POR_PATRON[e.pat]) || 'pesa';
  return FIGURAS[clave] || FIGURAS.pesa;
}

function svgFigura(idEjercicio, clase) {
  return `<svg class="${clase || 'figura'}" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${figuraDe(idEjercicio)}</svg>`;
}
