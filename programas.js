/* Programas de dos y tres días por semana que Brooks Kubik propone en
   Dinosaur Training, adaptados al equipo de la casa. Cada ejercicio lleva el
   id del catálogo (datos.js), las series tal como las da el libro y, si hubo
   que cambiar el equipo, una nota con el original. */

const PROGRAMAS = [
  /* ------------------------- dos días por semana ------------------------- */
  {
    id: 'basicos', frecuencia: 2,
    nombre: 'Los básicos, dos días',
    fuente: 'Capítulo 5 · pág. 47',
    intro: 'Tres meses solo con lo importante: banca, sentadilla y dominadas un día; press, peso muerto y curl el otro. Todo a 5 × 5 y peso a la barra cada vez que se pueda.',
    dias: [
      { nombre: 'Lunes', ej: [
        ['press_banca', '5 × 5: dos series de calentamiento y tres con todo el peso que puedas para 5.'],
        ['sent', '5 × 5, igual que la banca.'],
        ['dominadas', '5 × 5. Si salen las 5 fácil, cuélgate peso.'],
      ] },
      { nombre: 'Jueves', ej: [
        ['press_pie', '5 × 5: dos de calentamiento y tres pesadas.'],
        ['pm', '5 × 5, igual.'],
        ['curl', '5 × 5, igual.'],
      ] },
    ],
  },
  {
    id: 'simple', frecuencia: 2,
    nombre: '¡Mantenlo simple!',
    fuente: 'Capítulo 18 · pág. 139',
    intro: 'El programa que Kubik da para cualquiera: dos días por semana, con tres o cuatro días de descanso entre uno y otro (lunes y jueves, martes y viernes…). Cuatro series de cinco: tres subiendo y una que casi te mate.',
    dias: [
      { nombre: 'Día uno', ej: [
        ['sent', '4 × 5: tres series subiendo y una a muerte con tu máximo para 5.'],
        ['press_pie', '4 × 5, la misma progresión.'],
        ['remo', '4 × 5, la misma progresión. Mátate en la última.'],
        ['farmer_maletas', 'Una serie, lo más lejos posible, hasta que se te caigan de los dedos.', 'En el libro: mancuernas pesadas.'],
        ['sit_up', '2 series de 8 a 15 con un disco detrás de la cabeza.'],
        ['cuello_arnes', 'Opcional: 1 o 2 series. También vale curl o pantorrillas; no más de tres auxiliares.'],
      ] },
      { nombre: 'Día dos', ej: [
        ['pm', '4 × 5, como la sentadilla. Si prefieres, cargadas en triples.', 'También sirve con la barra hexagonal.'],
        ['press_banca', '4 × 5, ya sabes el modo. O press desde el suelo.'],
        ['log_carry', 'Abrazo de oso y a caminar lo más lejos que puedas.', 'En el libro: bolsa de arena de 45 a 65 kg.'],
        ['flexion_lateral', '2 series por lado, pesadas: es fuerza, no para afinar la cintura.'],
      ] },
    ],
  },
  {
    id: 'cuatro', frecuencia: 2,
    nombre: 'Fuerza básica: 4 sesiones en 2 semanas',
    fuente: 'Capítulo 17 · pág. 127',
    intro: 'Cuatro rutinas distintas, dos por semana: la primera de cada semana va a piernas, cadera y espalda baja; la segunda, al tren superior. Agarre y tronco todos los días. Para hombres avanzados.',
    dias: [
      { nombre: 'Sesión 1', ej: [
        ['sent_abajo', '5 simples subiendo a saltos grandes, hasta el 90 o 95 % de tu máximo.'],
        ['cuarto_sent', '3 × 3 subiendo: parte unos 50 kg bajo tu máximo para 3.'],
        ['pm_maletas', '5 × 5: cuatro subiendo y la última a fondo.', 'En el libro: mancuernas; vale barra o barra hexagonal. Con las maletas, busca más repeticiones.'],
        ['log_carry', 'Lo más lejos posible.', 'En el libro: bolsa de arena.'],
        ['curl_inv', '3 series de tantas como puedas.'],
        ['pinza', 'Lo más que aguantes con cada mano.'],
        ['sit_up', 'Una serie de 15 a 25 con un disco detrás de la cabeza.'],
      ] },
      { nombre: 'Sesión 2', ej: [
        ['cargada_press', '5 series de 5: dos subiendo y tres con el máximo.', 'En el libro: cargada y press con un par de mancuernas pesadas.'],
        ['remo', '4 × 6 subiendo el peso.'],
        ['press_banca_parcial', '4 simples subiendo y luego 3 simples con el máximo.'],
        ['log_press', 'Tantas como puedas.', 'En el libro: bolsa de arena.'],
        ['turca', 'Repeticiones en 1 o 2 minutos si es liviano; simples si es pesado.'],
        ['colgado', 'Una serie, colgado hasta caer.'],
      ] },
      { nombre: 'Sesión 3', ej: [
        ['pm_parcial', '6 × 3: cuatro subiendo y dos con el máximo.'],
        ['sent', '5 × 5: cuatro de calentamiento y una con el máximo.'],
        ['farmer_maletas', '5 viajes de 30 a 50 metros. Después no debería quedarte nada.'],
      ] },
      { nombre: 'Sesión 4', ej: [
        ['press_banca', '5 series de 5 o 6: dos subiendo y tres con el máximo.', 'En el libro: con mancuernas.'],
        ['dominadas_toalla', '5 series de tantas como salgan. Si pasas de 10, agrega peso.'],
        ['press_frente', 'Pesado, desde la altura de la frente hasta brazos extendidos.'],
        ['turca', 'Igual que en la sesión 2.'],
        ['elev_piernas', '2 series de tantas como puedas.'],
        ['flexion_lateral', 'Una serie por lado.'],
        ['sit_up', 'Una serie con un disco detrás de la cabeza.'],
        ['pinza', '3 sostenes por mano, intentando ganarle al anterior.'],
      ] },
    ],
  },
  {
    id: 'soporte2', frecuencia: 2,
    nombre: 'Inicio con la jaula, dos días',
    fuente: 'Capítulo 16 · pág. 119',
    intro: 'Para empezar con el trabajo desde abajo en la jaula: primero el levantamiento normal y después el desde abajo, liviano al principio. Rutina corta: a este nivel, hacer de más es un desastre.',
    dias: [
      { nombre: 'Lunes', ej: [
        ['sent', '5 × 5: cuatro series subiendo y una pesada.'],
        ['sent_abajo', '5 simples subiendo hasta un peso pesado, pero no máximo.'],
        ['curl', 'Igual que la sentadilla.', 'En el libro: barra gruesa de 5 cm; aquí, con toalla.'],
        ['pinza', '2 o 3 series.'],
        ['sosten_trap', '2 o 3 series.'],
        ['sit_up', 'Una serie de 15 a 25.', 'En el libro: con una mancuerna pesada.'],
      ] },
      { nombre: 'Jueves', ej: [
        ['pm_trap', '5 × 5, como la sentadilla. También vale peso muerto o cargadas.'],
        ['press_banca', '5 × 5, como la sentadilla.'],
        ['press_banca_abajo', '5 simples subiendo hasta un peso pesado, pero no máximo.'],
        ['dominadas', '4 series de 5 subiendo hasta tu máximo para 5. O remo con barra.'],
        ['colgado', '2 o 3 series.'],
        ['pinza', '2 o 3 series.'],
        ['elev_piernas', 'Una serie de 15 a 25, con peso en los pies si puedes.'],
      ] },
    ],
  },

  /* ------------------------- tres días por semana ------------------------- */
  {
    id: 'abreviado3', frecuencia: 3,
    nombre: 'Abreviado: un básico por día',
    fuente: 'Capítulo 6 · pág. 49',
    intro: 'Cada ejercicio básico una sola vez por semana y solo dos o tres por sesión. Series y repeticiones a tu gusto: 5 × 5, simples pesadas o una serie a muerte.',
    dias: [
      { nombre: 'Lunes', ej: [
        ['sent', '5 × 5, simples o una serie de 20: tú eliges.'],
        ['press_banca', '5 × 5 o simples.'],
      ] },
      { nombre: 'Miércoles', ej: [
        ['press_pie', '5 × 5 o simples.'],
        ['dominadas', 'Al máximo. En el libro, jalones.'],
        ['dips', 'Al máximo.'],
      ] },
      { nombre: 'Viernes', ej: [
        ['pm', '5 × 5 o simples. O cargadas.'],
        ['encog_trap', '5 × 5 pesado.'],
        ['log_clean', 'Simples, descansando lo justo.', 'En el libro: levantamiento de barriles.'],
      ] },
    ],
  },
  {
    id: 'soporte3', frecuencia: 3,
    nombre: 'Inicio con la jaula, tres días',
    fuente: 'Capítulo 16 · pág. 119',
    intro: 'La versión que Kubik prefiere: sentadilla el lunes, banca el miércoles y espalda el viernes, con el resto según el tiempo y la energía.',
    dias: [
      { nombre: 'Lunes', ej: [
        ['sent', 'Tres series de 5 subiendo y después 5-4-3-2-1.'],
        ['sent_abajo', '5 simples subiendo hasta un peso pesado, pero no máximo.'],
        ['curl', '5 simples subiendo hasta una carga pesada.', 'En el libro: barra gruesa de 5 o 7,5 cm; aquí, con toalla.'],
        ['pinza', 'Un ejercicio de agarre, 3 o 4 series.'],
        ['sit_up', 'Una serie de 15 a 25.'],
      ] },
      { nombre: 'Miércoles', ej: [
        ['press_banca', 'Tres series de 5 subiendo y después 5-4-3-2-1.'],
        ['press_banca_abajo', '5-4-3-2-1 hasta un peso pesado, pero no máximo.'],
        ['dominadas', '4 series de 5 subiendo el peso. O jalones.'],
        ['log_carry', '4 viajes lo más lejos posible, con 3 a 5 minutos de descanso.', 'En el libro: un saco.'],
      ] },
      { nombre: 'Viernes', ej: [
        ['pm_trap', '5 simples subiendo hasta un peso pesado, pero no máximo.'],
        ['log_press', '5 simples, con 2 o 3 minutos de descanso.', 'En el libro: barril o bolsa de arena.'],
        ['farmer_maletas', '4 viajes lo más lejos posible.'],
      ] },
    ],
  },
  {
    id: 'soporte3b', frecuencia: 3,
    nombre: 'Jaula avanzada, tres días',
    fuente: 'Capítulo 16 · pág. 120',
    intro: 'Después de 3 a 6 meses: el trabajo desde abajo va primero y entra el peso muerto parcial en lugar del completo.',
    dias: [
      { nombre: 'Lunes', ej: [
        ['sent_abajo', '5 simples subiendo hasta un peso pesado, pero no máximo.'],
        ['sent', '5 triples subiendo hasta tu máximo para 3.'],
        ['pinza', '4 series subiendo.'],
        ['sosten_trap', '4 series subiendo.'],
        ['curl_inv', '4 series subiendo.'],
        ['sit_up', 'Una serie de 15 a 25.'],
      ] },
      { nombre: 'Miércoles', ej: [
        ['press_banca_abajo', '5 simples, como la sentadilla desde abajo.'],
        ['press_banca', '5 triples, como la sentadilla.'],
        ['dominadas', '4 series de 5 subiendo. O jalones.'],
        ['colgado', '4 series.'],
        ['pinza', '4 series subiendo.'],
      ] },
      { nombre: 'Viernes', ej: [
        ['pm_parcial', '5 simples subiendo hasta un peso pesado, pero no máximo.'],
        ['press_pie', '5 series de 3 a 5 subiendo.'],
        ['curl', '4 × 5 con el mismo peso.', 'En el libro: con bolsa de arena.'],
        ['farmer_maletas', '4 viajes lo más lejos posible.'],
        ['log_carry', '2 veces lo más lejos posible.', 'En el libro: abrazo de oso con bolsa o barril.'],
      ] },
    ],
  },
  {
    id: 'atletas', frecuencia: 3,
    nombre: 'Para atletas: un día de cargas',
    fuente: 'Capítulo 16 · pág. 121',
    intro: 'Sentadilla un día, banca y peso muerto otro, y un día entero para cargar cosas pesadas e incómodas. MUY duro; Kubik lo recomienda para jugadores de fútbol americano y luchadores.',
    dias: [
      { nombre: 'Lunes', ej: [
        ['sent_abajo', '5 simples subiendo hasta un peso pesado, pero no máximo.'],
        ['sent', '4 series de 5 subiendo hasta tu máximo para 5.'],
        ['cuello_arnes', '4 series.'],
        ['pinza', '4 series subiendo.'],
        ['sosten_trap', '4 series subiendo.'],
      ] },
      { nombre: 'Miércoles', ej: [
        ['log_press', '5 simples, con el mismo peso o subiendo.', 'En el libro: bolsa de arena.'],
        ['log_hombro', '4 al hombro izquierdo y 4 al derecho, como simples.', 'En el libro: barril.'],
        ['curl', '2 series de 5 con tu máximo para 5.', 'En el libro: con bolsa de arena.'],
        ['log_carry', '2 veces por hombro o en abrazo de oso, lo más lejos posible.', 'En el libro: bolsa o barril, cuesta arriba si se puede.'],
      ] },
      { nombre: 'Viernes', ej: [
        ['pm_parcial', '5 simples subiendo hasta un peso pesado, pero no máximo.'],
        ['press_banca_abajo', '5 simples subiendo hasta un peso pesado, pero no máximo.'],
        ['press_banca', '4 series de 5 subiendo hasta tu máximo para 5.'],
        ['elev_piernas', 'Una serie de 15 a 25, con peso en los pies.'],
        ['pinza', '4 series subiendo.'],
        ['colgado', '4 series.'],
      ] },
    ],
  },
  {
    id: 'seis', frecuencia: 3,
    nombre: 'Seis sesiones en dos semanas',
    fuente: 'Capítulo 16 · pág. 122',
    intro: 'Seis entrenamientos cada dos semanas, distintos cada vez: así caben la sentadilla normal, desde abajo y en cuartos sin sobreentrenar.',
    dias: [
      { nombre: 'Lunes · semana 1', ej: [
        ['sent_abajo', '5 simples subiendo.'],
        ['cuarto_sent', '5 simples subiendo.'],
        ['curl', '4 simples subiendo.', 'En el libro: barra de 5 cm; aquí, con toalla.'],
        ['pinza', '5 series subiendo.'],
      ] },
      { nombre: 'Miércoles · semana 1', ej: [
        ['press_banca_abajo', '4 simples subiendo.'],
        ['press_banca_parcial', '4 simples subiendo.'],
        ['remo', '4 series de 5 subiendo. O dominadas.'],
        ['sit_up', 'Una serie de 15 a 25.', 'En el libro: con una mancuerna pesada en el pecho.'],
      ] },
      { nombre: 'Viernes · semana 1', ej: [
        ['pm_trap', 'Cuatro series de 5 subiendo y dos series de 5 con tu máximo.'],
        ['log_carry', '2 veces lo más lejos posible. O medio kilómetro, parando lo que haga falta.', 'En el libro: barril o bolsa pesada.'],
      ] },
      { nombre: 'Lunes · semana 2', ej: [
        ['sent', '5 × 5 subiendo.'],
        ['sosten_trap', '4 series subiendo.'],
        ['pinza', '4 series subiendo.'],
        ['elev_piernas', 'Una serie de 15 a 25, con peso en los pies.'],
      ] },
      { nombre: 'Miércoles · semana 2', ej: [
        ['press_pie', '5 simples subiendo, o 4 series de 5.'],
        ['pm_parcial', '5 simples subiendo. Después, 5 simples moviendo la barra solo los últimos centímetros.'],
        ['farmer_maletas', '4 viajes lo más lejos posible. O sostener algo pesado lo más que puedas, 4 veces.'],
      ] },
      { nombre: 'Viernes · semana 2', ej: [
        ['press_banca', '5 simples subiendo, o series de 5 o de 3.'],
        ['dominadas', '4 series de 5 subiendo. O jalones.'],
        ['cuello_arnes', '4 series.'],
        ['sit_up', 'Una serie de 15 a 25.'],
      ] },
    ],
  },
  {
    id: 'cocinado', frecuencia: 3,
    nombre: 'Cocinado lento: ciclo de dos semanas',
    fuente: 'Capítulo 16 · pág. 125',
    intro: 'El truco de William Boone y Paul Anderson: los parciales con el máximo, una vez por semana, y cada 5 o 6 semanas bajas los seguros 1,5 cm para alargar el recorrido.',
    dias: [
      { nombre: 'Lunes · semana 1', ej: [
        ['sent', '5 × 5 subiendo.'],
        ['cuarto_sent', '3 o 4 simples subiendo y luego 5 simples con el máximo.'],
        ['press_frente', '5 simples subiendo.', 'En el libro: ¼ de press militar en la jaula.'],
        ['farmer_maletas', '4 viajes lo más lejos posible.'],
      ] },
      { nombre: 'Miércoles · semana 1', ej: [
        ['press_banca_abajo', '5 simples subiendo.'],
        ['dominadas', '4 series de 5 subiendo. O remo con barra.'],
        ['pinza', '3 o 4 series.'],
        ['colgado', '3 o 4 series.'],
        ['curl_inv', '3 o 4 series.'],
        ['sit_up', 'Una serie de 15 a 25.'],
      ] },
      { nombre: 'Viernes · semana 1', ej: [
        ['pm_parcial', '5 simples subiendo. Alarga el recorrido cada 5 o 6 semanas.', 'En el libro: ¼ de peso muerto.'],
        ['log_hombro', '4 o 5 veces a cada hombro.', 'En el libro: barril.'],
        ['log_carry', '4 veces lo más lejos posible.', 'En el libro: bolsa, barril o yunque.'],
      ] },
      { nombre: 'Lunes · semana 2', ej: [
        ['sent_abajo', '5 simples subiendo.'],
        ['cuarto_sent', '5 simples subiendo.'],
        ['curl', '4 series de 5 o 4 a 5 simples subiendo.'],
        ['log_carry', '4 veces lo más lejos posible, alternando el hombro.', 'En el libro: bolsa o barril al hombro.'],
      ] },
      { nombre: 'Jueves · semana 2', ej: [
        ['press_banca', '5 × 5 subiendo.'],
        ['press_banca_parcial', '5 simples con el máximo.'],
        ['pm_parcial', 'Igual que el viernes de la semana 1.'],
        ['pinza', '4 series.'],
        ['sosten_trap', '4 series.'],
        ['sit_up', 'Una serie de 15 a 25.'],
      ] },
    ],
  },
];

const PROG = Object.fromEntries(PROGRAMAS.map(p => [p.id, p]));
