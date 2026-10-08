/* CrossFit: biblioteca de WOD conocidos, con la adaptación al equipo de la
   casa, el temporizador ya configurado y las marcas de cada vez. Se carga
   después de reloj.js (usa el temporizador y la ejecución). */

const NOMBRE_TIPO = { tiempo: 'Por tiempo', amrap: 'AMRAP', emom: 'EMOM', tabata: 'Tábata', intervalos: 'Intervalos', max: 'Máximo' };

const cf = { grupo: 'todos', equipo: false, buscar: '', wod: null, resultado: '' };

const conEquipo = w => w.mov.every(([, m]) => !MOV[m].falta);

function etiquetaTipo(w) {
  if (w.tipo === 'amrap' || w.tipo === 'emom') return `${NOMBRE_TIPO[w.tipo]} ${w.min} min`;
  if (w.tipo === 'tiempo') return `Por tiempo · ~${w.min} min`;
  return NOMBRE_TIPO[w.tipo];
}

/* Las veces que se hizo un WOD, la más reciente primero. */
function marcasDe(id) {
  return datos.sesiones.filter(s => s.wod && s.wod.id === id).sort((a, b) => b.fecha - a.fecha);
}

/* El WOD de hoy: el mismo todo el día, distinto cada día, y que se pueda
   hacer con el equipo de la casa. */
function wodDeHoy() {
  const lista = WODS.filter(conEquipo);
  const dia = Math.floor((Date.now() - new Date().getTimezoneOffset() * 60e3) / DIA);
  return lista[(dia * 7919) % lista.length];
}

function pintarCrossfit() {
  const hoy = wodDeHoy();
  const q = normal(cf.buscar.trim());
  const pasa = w => (cf.grupo === 'todos' || w.grupo === cf.grupo)
    && (!cf.equipo || conEquipo(w))
    && (!q || normal(w.nombre + ' ' + w.mov.map(([, m]) => MOV[m].nombre).join(' ')).includes(q));

  let h = `<h2>CrossFit</h2>
    <p class="intro">Los WOD más conocidos, con la forma de hacerlos con tu equipo, el temporizador listo y tus marcas de cada vez.</p>
    <button class="boton-grande" data-wod="${hoy.id}">
      <span><strong>WOD de hoy: ${esc(hoy.nombre)}</strong><small>${esc(hoy.formato)} · ${esc(hoy.mov.map(([, m]) => MOV[m].nombre).join(', '))}</small></span>
      ${ICONOS.flecha}
    </button>
    <div class="selector separado">${[['todos', 'Todos'], ...GRUPOS_WOD.map(g => [g.id, g.nombre])].map(([id, n]) =>
      `<button data-grupo-cf="${id}" class="${cf.grupo === id ? 'activo' : ''}">${n}</button>`).join('')}</div>
    <div class="cf-filtros">
      <input type="search" id="cf-buscar" placeholder="Buscar: Fran, dominadas, thruster…" value="${esc(cf.buscar)}">
      <label class="b-check"><input type="checkbox" id="cf-equipo" ${cf.equipo ? 'checked' : ''}> Solo los que salen con mi equipo sin cambiar nada</label>
    </div>`;

  let algo = false;
  for (const g of GRUPOS_WOD) {
    const lista = WODS.filter(w => w.grupo === g.id && pasa(w));
    if (!lista.length) continue;
    algo = true;
    h += `<div class="semana-sep">${esc(g.nombre)} · ${lista.length}</div>`;
    if (cf.grupo === g.id) h += `<p class="intro" style="font-size:14px;margin-top:-4px">${esc(g.intro)}</p>`;
    for (const w of lista) {
      const m = marcasDe(w.id)[0];
      h += `<article class="sesion programa" data-wod="${w.id}">
          <div class="arriba"><span class="cuando">${esc(w.nombre)}</span><span class="hace">${esc(etiquetaTipo(w))}</span></div>
          <p class="intro" style="margin:2px 0 8px;font-size:14.5px">${esc(w.mov.map(([c, mv]) => `${c} ${MOV[mv].nombre.toLowerCase()}`).join(' · '))}</p>
          <div class="chips">
            ${conEquipo(w) ? '<span class="chip p">✓ con tu equipo</span>' : '<span class="chip">adaptado a tu equipo</span>'}
            ${m ? `<span class="chip">Tu marca: ${esc(m.wod.resultado || 'hecho')}</span>` : ''}
          </div>
        </article>`;
    }
  }
  if (!algo) h += '<p class="intro separado">Ningún WOD con ese filtro.</p>';

  $('#v-crossfit').innerHTML = h;
  document.querySelectorAll('[data-wod]').forEach(b => b.addEventListener('click', () => abrirWod(b.dataset.wod)));
  document.querySelectorAll('[data-grupo-cf]').forEach(b => b.addEventListener('click', () => { cf.grupo = b.dataset.grupoCf; pintarCrossfit(); }));
  $('#cf-equipo').addEventListener('change', e => { cf.equipo = e.target.checked; pintarCrossfit(); });
  const buscar = $('#cf-buscar');
  buscar.addEventListener('input', () => {
    cf.buscar = buscar.value;
    const pos = buscar.selectionStart;
    pintarCrossfit();
    const nuevo = $('#cf-buscar');
    nuevo.focus();
    nuevo.setSelectionRange(pos, pos);
  });
}

function abrirWod(id) {
  cf.wod = id;
  cf.resultado = '';
  $('#hoja').hidden = false;
  document.body.style.overflow = 'hidden';
  pintarWod();
  $('#hoja').scrollTop = 0;
}

function pintarWod() {
  const w = WOD[cf.wod];
  const grupo = GRUPOS_WOD.find(g => g.id === w.grupo);
  const ids = [...new Set(w.mov.map(([, m]) => MOV[m].ej))];
  const est = estadoAhora();
  const inv = musculosDeSesion({ ejercicios: ids }, datos.propios);
  const cansados = Object.keys(inv).filter(m => inv[m] === 'p' && est[m] && !est[m].listo);
  const marcas = marcasDe(w.id);
  const faltan = w.mov.filter(([, m]) => MOV[m].falta);

  let h = `
    <div class="hoja-arriba">
      <h3 style="margin:0">${esc(grupo.nombre)}</h3>
      <button class="cerrar" id="b-cerrar" aria-label="Cerrar">${ICONOS.cerrar}</button>
    </div>
    <div class="titulo-rutina">${esc(w.nombre)}</div>
    <div class="chips" style="margin-bottom:10px"><span class="chip p">${esc(etiquetaTipo(w))}</span>
      ${conEquipo(w) ? '<span class="chip">✓ con tu equipo</span>' : '<span class="chip">adaptado a tu equipo</span>'}</div>
    <p class="cf-formato">${esc(w.formato)}</p>`;
  if (cansados.length) {
    h += `<div class="nota" style="margin-bottom:10px">Todavía descansan: <strong>${cansados.map(m =>
      `${esc(MUS[m].corto)} (${fmtFaltan(est[m].faltanHoras)})`).join(', ')}</strong>. Si puedes, elige otro WOD o baja la carga.</div>`;
  }
  h += w.mov.map(([cant, m, carga], i) => {
    const mv = MOV[m];
    return `
      <div class="ejercicio cf-mov" style="--i:${i}">
        <span class="num cf-cant">${esc(cant)}</span>
        <div>
          <h4>${esc(mv.nombre)}</h4>
          ${carga ? `<span class="equipo">RX: ${esc(carga)}</span>` : ''}
          ${mv.falta ? `<p class="cf-cambio">↻ ${esc(mv.falta)}</p>` : ''}
          ${botonEjecucion(mv.ej)}
        </div>
      </div>`;
  }).join('');
  if (w.nota) h += `<p class="intro kubik separado">${esc(w.nota)}</p>`;
  if (w.escalado) h += `<div class="nota separado"><strong>Escalado:</strong> ${esc(w.escalado)}</div>`;
  if (faltan.length) h += `<div class="nota separado"><strong>Con tu equipo:</strong> ${faltan.map(([, m]) => esc(MOV[m].falta)).join(' ')}</div>`;
  h += `
    <h3>Tus marcas</h3>
    ${marcas.length ? `<div class="cf-marcas">${marcas.slice(0, 8).map(s =>
      `<div><span>${esc(fmtCuando(s.fecha))}</span><b>${esc(s.wod.resultado || 'hecho')}</b></div>`).join('')}</div>`
      : '<p class="b-nota">Todavía no lo has hecho.</p>'}
    <div class="campo separado">
      <label for="cf-resultado">Tu resultado de hoy (opcional)</label>
      <input type="text" id="cf-resultado" placeholder="${w.tipo === 'amrap' ? 'Ej.: 18 rondas + 7' : w.tipo === 'tiempo' ? 'Ej.: 6:32' : 'Ej.: 245 repeticiones'}" value="${esc(cf.resultado)}">
    </div>
    <div style="height:80px"></div>`;

  $('#hoja-cuerpo').innerHTML = h;
  $('#b-cerrar').addEventListener('click', cerrarHoja);
  $('#cf-resultado').addEventListener('input', e => { cf.resultado = e.target.value; });

  let barra = document.querySelector('.barra-inferior');
  if (!barra) {
    barra = document.createElement('div');
    barra.className = 'barra-inferior';
    document.body.appendChild(barra);
  }
  barra.innerHTML = `<div class="dentro">
      <button class="boton sobrio" id="b-cf-reloj">Temporizador</button>
      <button class="boton principal" id="b-cf-hecho">Lo hice</button>
    </div>`;
  $('#b-cf-reloj').addEventListener('click', () => relojParaWod(w));
  $('#b-cf-hecho').addEventListener('click', () => {
    const resultado = cf.resultado.trim();
    nuevoBorrador(ids);
    borrador.wod = { id: w.id, resultado };
    borrador.nota = `${w.nombre}${resultado ? ': ' + resultado : ''}`;
    cerrarHoja();
    mostrar('registrar');
    avisar('Revisa y guarda. Tu marca queda en el WOD.');
  });
}

/* El temporizador, ya preparado para el formato del WOD. */
function relojParaWod(w) {
  if (reloj.corriendo || reloj.pausado) detenerReloj();
  if (w.reloj) Object.assign(reloj, w.reloj);
  else if (w.tipo === 'amrap') Object.assign(reloj, { modo: 'cuenta', cuenta: w.min * 60 });
  else if (w.tipo === 'emom') Object.assign(reloj, { modo: 'tabata', prep: 10, trabajo: 60, descanso: 0, rondas: w.min });
  else if (w.tipo === 'tabata') Object.assign(reloj, { modo: 'tabata', prep: 10, trabajo: 20, descanso: 10, rondas: 8 });
  else Object.assign(reloj, { modo: 'crono' });
  guardarReloj();
  abrirReloj();
}
