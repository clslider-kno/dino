/* Cómo se ejecuta cada ejercicio: una secuencia de fotos, cada una con lo
   que hay que hacer en ese momento. Las fotos son de free-exercise-db
   (dominio público) y viven en assets/ejecucion. Cuando la foto muestra otro
   equipo (mancuernas, bolsa de arena…), el texto dice cómo hacerlo con el de
   la casa. */

const EJECUCION = {
  /* ---------- piernas ---------- */
  sent_abajo: [
    ['Barbell_Full_Squat-1', 'Pon los seguros a la altura de tu sentadilla paralela y deja la barra apoyada en ellos. Métete debajo, barra en la espalda alta, y quédate abajo, en cuclillas.'],
    ['Barbell_Full_Squat-0', 'Desde cero, sin rebote, empuja con todo el pie hasta quedar de pie. Vuelve a dejar la barra en los seguros, suelta un segundo y repite.'],
  ],
  sent: [
    ['Barbell_Squat-0', 'Barra en la espalda alta, pies al ancho de los hombros y puntas un poco afuera. Aire adentro y abdomen duro.'],
    ['Barbell_Squat-1', 'Baja con la cadera atrás y las rodillas siguiendo la línea de los pies, hasta que el muslo quede paralelo al suelo. Sube empujando con todo el pie.'],
  ],
  sent_frontal: [
    ['Front_Squat_Clean_Grip-0', 'Barra apoyada sobre los hombros, delante del cuello, y codos bien altos.'],
    ['Front_Squat_Clean_Grip-1', 'Baja con el tronco derecho y los codos arriba hasta la paralela. Si los codos caen, la barra se va adelante.'],
  ],
  cuarto_sent: [
    ['Barbell_Squat-0', 'Seguros un poco por encima de la mitad del recorrido. Barra en la espalda, de pie, bien firme.'],
    ['Jerk_Dip_Squat-1', 'Baja solo un cuarto, hasta rozar los seguros (la foto muestra el recorrido con la barra adelante), y sube. Recorrido corto, peso grande.'],
  ],
  zancadas_maletas: [
    ['Dumbbell_Lunges-0', 'Una maleta en cada mano, de pie, tronco derecho.'],
    ['Dumbbell_Lunges-1', 'Da un paso largo adelante y baja hasta que la rodilla de atrás casi toque el suelo. Empuja con el pie de adelante para volver y cambia de pierna.'],
  ],
  talones: [
    ['Standing_Barbell_Calf_Raise-0', 'Barra en la espalda dentro de la jaula y las puntas sobre un disco, talones en el aire.'],
    ['Standing_Barbell_Calf_Raise-1', 'Sube en puntillas lo más alto que puedas, sostén un segundo y baja lento hasta estirar.'],
  ],

  /* ---------- peso muerto y espalda baja ---------- */
  pm_trap: [
    ['Trap_Bar_Deadlift-0', 'Párate al centro de la barra hexagonal, agáchate y toma las manillas. Espalda plana, pecho arriba, brazos estirados.'],
    ['Trap_Bar_Deadlift-1', 'Empuja el suelo con las piernas hasta quedar de pie, con la cadera adelante. Baja controlado por el mismo camino.'],
  ],
  pm: [
    ['Barbell_Deadlift-0', 'Barra sobre la mitad del pie. Agáchate, toma la barra justo afuera de las piernas, espalda plana y hombros sobre la barra.'],
    ['Barbell_Deadlift-1', 'Tira con las piernas y la cadera, la barra pegada a las piernas, hasta quedar derecho. Baja la barra por el mismo camino.'],
  ],
  pm_parcial: [
    ['Rack_Pulls-0', 'Seguros a la altura de la rodilla y la barra apoyada en ellos. Tómala con la espalda plana y la cadera atrás.'],
    ['Rack_Pulls-1', 'Tira hasta quedar derecho, con los hombros atrás. Devuelve la barra a los seguros, controlada.'],
  ],
  pm_maletas: [
    ['Farmers_Walk-0', 'Una maleta a cada lado de los pies. Agáchate con la espalda plana y toma las dos manillas (en la foto, con manillas de granjero).'],
    ['Dumbbell_Shrug-0', 'Sube con las piernas hasta quedar derecho, con las maletas colgando a los lados. Bájalas al suelo controlado.'],
  ],
  pm_rumano: [
    ['Romanian_Deadlift-1', 'De pie con la barra en las manos, rodillas apenas dobladas.'],
    ['Romanian_Deadlift-0', 'Lleva la cadera atrás y deja que la barra baje pegada a las piernas, espalda plana, hasta sentir los isquios. Vuelve empujando la cadera adelante.'],
  ],
  buenos_dias: [
    ['Good_Morning-0', 'Barra liviana en la espalda alta, rodillas apenas dobladas.'],
    ['Good_Morning-1', 'Inclínate llevando la cadera atrás, espalda plana, hasta que el tronco quede casi horizontal. Sube con los glúteos.'],
  ],

  /* ---------- empujes ---------- */
  press_pie: [
    ['Standing_Military_Press-0', 'De pie, barra sobre la parte alta del pecho, manos un poco más anchas que los hombros. Glúteos y abdomen duros.'],
    ['Standing_Military_Press-1', 'Empuja la barra hacia arriba, metiendo la cabeza cuando pase la cara, hasta estirar los brazos. Baja al pecho controlado.'],
  ],
  press_frente: [
    ['Standing_Military_Press-0', 'Seguros de la jaula a la altura de la frente y la barra apoyada en ellos. Párate debajo, tómala y aprieta todo el cuerpo.'],
    ['Standing_Military_Press-1', 'Empuja desde los seguros hasta estirar los brazos. Bájala de nuevo a los seguros y repite.'],
  ],
  cargada_press: [
    ['Clean-0', 'Barra en el suelo sobre la mitad del pie. Agáchate como para un peso muerto, agarre al ancho de los hombros.'],
    ['Clean-1', 'Tira fuerte con las piernas y, cuando la barra pase las rodillas, salta y encoge los hombros.'],
    ['Front_Squat_Clean_Grip-0', 'Mete los codos rápido por debajo y recibe la barra sobre los hombros, delante del cuello.'],
    ['Standing_Military_Press-1', 'Desde ahí, haz el press hasta estirar los brazos. Bájala a los hombros, luego a la cadera y al suelo.'],
  ],
  push_press: [
    ['Push_Press-0', 'Barra sobre los hombros, delante del cuello, codos un poco adelante.'],
    ['Jerk_Dip_Squat-1', 'Dobla un poco las rodillas, con el tronco derecho.'],
    ['Standing_Military_Press-1', 'Estira las piernas de golpe y aprovecha el impulso para llevar la barra arriba con los brazos.'],
  ],
  press_banca: [
    ['Barbell_Bench_Press_-_Medium_Grip-0', 'Acostado en el banco, ojos bajo la barra, pies firmes en el suelo. Agarre un poco más ancho que los hombros; saca la barra con los brazos estirados.'],
    ['Barbell_Bench_Press_-_Medium_Grip-1', 'Bájala controlada hasta tocar la parte baja del pecho, con los codos a unos 45°. Empuja hasta estirar los brazos.'],
  ],
  press_banca_abajo: [
    ['Pin_Presses-0', 'Seguros de la jaula a 2 o 3 cm del pecho y la barra apoyada en ellos. Acuéstate debajo y tómala.'],
    ['Pin_Presses-1', 'Empuja desde cero, sin rebote, hasta estirar los brazos. Vuelve a dejarla en los seguros y repite.'],
  ],
  press_banca_parcial: [
    ['Board_Press-0', 'Seguros a unos 10 cm por debajo de los brazos estirados (en la foto, con tablas sobre el pecho). Barra pesada.'],
    ['Board_Press-1', 'Baja solo hasta tocar los seguros y empuja hasta estirar los brazos. Es la parte final del press: trabaja los tríceps.'],
  ],
  press_cerrado: [
    ['Close-Grip_Barbell_Bench_Press-0', 'Igual que la banca, pero con las manos al ancho de los hombros. Baja la barra al pecho con los codos pegados al cuerpo.'],
    ['Close-Grip_Barbell_Bench_Press-1', 'Empuja hasta estirar los brazos, sin abrir los codos.'],
  ],
  floor_press: [
    ['Floor_Press-0', 'Acostado en el suelo dentro de la jaula, piernas estiradas o dobladas. Barra arriba con los brazos estirados (en la foto, con pesas rusas).'],
    ['Floor_Press-1', 'Baja hasta que los codos toquen el suelo, pausa un segundo y empuja.'],
  ],
  fondos_anillas: [
    ['Ring_Dips-1', 'Arriba en las anillas con los brazos estirados y las anillas pegadas al cuerpo.'],
    ['Ring_Dips-0', 'Baja hasta que los hombros queden bajo los codos, sin que las anillas se abran, y empuja hasta arriba.'],
  ],
  remo_anillas: [
    ['Inverted_Row_with_Straps-0', 'Anillas a la altura de la cintura. Cuélgate debajo con el cuerpo derecho y los talones en el suelo (en la foto, con correas).'],
    ['Inverted_Row_with_Straps-1', 'Tira hasta que el pecho llegue a las anillas, codos atrás. Baja controlado.'],
  ],
  dips: [
    ['Dips_-_Chest_Version-0', 'Arriba en las barras de fondos, brazos estirados.'],
    ['Dips_-_Chest_Version-1', 'Baja inclinando un poco el tronco adelante hasta que los hombros queden a la altura de los codos. Empuja hasta arriba.'],
  ],

  /* ---------- tirones ---------- */
  dominadas: [
    ['Pullups-0', 'Cuélgate con las palmas hacia adelante, manos algo más anchas que los hombros, brazos estirados.'],
    ['Pullups-1', 'Tira llevando los codos hacia abajo hasta que el mentón pase la barra. Baja hasta estirar del todo.'],
  ],
  dominadas_toalla: [
    ['Pullups-0', 'Pasa dos toallas por la barra y cuélgate tomando una en cada mano. El agarre grueso hace todo más difícil.'],
    ['Pullups-1', 'Tira hasta que las manos lleguen a la altura de la cara y baja hasta estirar del todo.'],
  ],
  dominadas_supinas: [
    ['Chin-Up-0', 'Cuélgate con las palmas hacia ti, manos al ancho de los hombros.'],
    ['Chin-Up-1', 'Tira hasta que el mentón pase la barra. Baja lento hasta estirar los brazos.'],
  ],
  remo: [
    ['Bent_Over_Barbell_Row-0', 'De pie, rodillas algo dobladas, tronco inclinado y espalda plana. La barra cuelga con los brazos estirados.'],
    ['Bent_Over_Barbell_Row-1', 'Tira la barra hacia la parte baja del abdomen, codos atrás, sin levantar el tronco. Baja estirando los brazos.'],
  ],
  remo_cuello: [
    ['Upright_Barbell_Row-1', 'De pie, barra delante de los muslos, agarre al ancho de los hombros.'],
    ['Upright_Barbell_Row-0', 'Sube la barra pegada al cuerpo, con los codos por delante y más altos que las manos, hasta el pecho. Baja controlado.'],
  ],
  remo_cuello_polea: [
    ['Upright_Cable_Row-1', 'Polea baja con la barra corta. De pie frente a la polea, barra delante de los muslos.'],
    ['Upright_Cable_Row-0', 'Sube la barra pegada al cuerpo, codos por delante y arriba, hasta el pecho. Baja controlado.'],
  ],
  encog_trap: [
    ['Trap_Bar_Deadlift-1', 'De pie dentro de la barra hexagonal con los brazos estirados y el peso colgando.'],
    ['Barbell_Shrug-1', 'Sube los hombros hacia las orejas, sin doblar los codos. Sostén un segundo arriba y baja (en la foto, con barra recta).'],
  ],
  encog_maletas: [
    ['Dumbbell_Shrug-0', 'Una maleta en cada mano, brazos estirados.'],
    ['Dumbbell_Shrug-1', 'Sube los hombros hacia las orejas, sostén un segundo y baja.'],
  ],

  /* ---------- tronco de 80 kg ---------- */
  log_press: [
    ['Log_Lift-0', 'Tronco en el suelo delante de ti. Agáchate y tómalo por debajo o por las manillas, espalda plana.'],
    ['Log_Lift-1', 'Llévalo hasta los muslos y apóyalo contra el cuerpo. Desde ahí, empuja con la cadera y rueda el tronco hasta el pecho.'],
    ['Front_Squat_Clean_Grip-0', 'Con el tronco sobre el pecho, codos altos (en la foto, con barra).'],
    ['Standing_Military_Press-1', 'Dobla un poco las rodillas y empuja el tronco hasta estirar los brazos. Bájalo al pecho y luego al suelo.'],
  ],
  log_clean: [
    ['Log_Lift-0', 'Tronco en el suelo. Agáchate, espalda plana, y tómalo firme.'],
    ['Log_Lift-1', 'Súbelo a los muslos apoyándolo contra el cuerpo.'],
    ['Front_Squat_Clean_Grip-0', 'Empuja con la cadera y rueda el tronco hasta el pecho, con los codos altos (en la foto, con barra). Bájalo y repite.'],
  ],
  log_hombro: [
    ['Sandbag_Load-0', 'Tronco en el suelo. Agáchate y abrázalo por un extremo o por el medio (en la foto, una bolsa de arena).'],
    ['Sandbag_Load-1', 'Levántalo con las piernas y súbelo a un hombro. Bájalo y repite al otro hombro.'],
  ],
  log_sent: [
    ['Zercher_Squats-0', 'Tronco abrazado contra el pecho, en los pliegues de los codos (en la foto, con barra).'],
    ['Zercher_Squats-1', 'Baja hasta la paralela con el tronco derecho y sube. El tronco quiere irse adelante: no lo dejes.'],
  ],
  log_carry: [
    ['Keg_Load-0', 'Agáchate y abraza el tronco por el medio, contra el pecho (en la foto, un barril).'],
    ['Keg_Load-1', 'Levántalo y camina con pasos cortos, sin soltarlo, lo más lejos que puedas.'],
  ],

  /* ---------- agarre ---------- */
  farmer_maletas: [
    ['Farmers_Walk-0', 'Una maleta a cada lado. Agáchate con la espalda plana y tómalas.'],
    ['Farmers_Walk-1', 'Párate y camina con pasos cortos y rápidos, hombros atrás, hasta la distancia o hasta que se te abran las manos.'],
  ],
  farmer_trap: [
    ['Trap_Bar_Deadlift-0', 'Dentro de la barra hexagonal, agáchate y toma las manillas.'],
    ['Farmers_Walk-1', 'Levántala y camina con pasos cortos, sin que la barra choque con las piernas (en la foto, con manillas de granjero).'],
  ],
  maleta_una: [
    ['One-Arm_Side_Deadlift-0', 'Una sola maleta al costado. Agáchate con la espalda derecha y tómala con una mano.'],
    ['One-Arm_Side_Deadlift-1', 'Párate sin inclinarte hacia la maleta: el abdomen del otro lado hace la fuerza. Camina así y luego cambia de mano.'],
  ],
  colgado: [
    ['Pullups-0', 'Cuélgate de la barra de dominadas con los brazos estirados y los hombros activos. Aguanta hasta caer.'],
    ['One_Handed_Hang-1', 'Cuando eso sea fácil, hazlo con una mano o con toallas.'],
  ],
  sosten_maletas: [
    ['Dumbbell_Shrug-0', 'Levanta las dos maletas y quédate de pie, brazos estirados. Aguanta todo lo que puedas.'],
  ],
  sosten_trap: [
    ['Trap_Bar_Deadlift-0', 'Carga la barra hexagonal con más peso del que usas en el peso muerto. Tómala.'],
    ['Trap_Bar_Deadlift-1', 'Levántala y quédate de pie, quieto, todo el tiempo que aguanten las manos.'],
  ],
  pinza: [
    ['Plate_Pinch-0', 'Dos discos juntos con el lado liso hacia afuera. Tómalos pellizcando entre el pulgar y los dedos.'],
    ['Plate_Pinch-1', 'Levántalos y aguanta de pie todo lo que puedas. Cambia de mano.'],
  ],
  curl: [
    ['Barbell_Curl-0', 'De pie, barra con las palmas hacia adelante y una toalla envuelta donde van las manos.'],
    ['Barbell_Curl-1', 'Sube la barra doblando los codos, sin moverlos ni balancear el cuerpo. Baja lento.'],
  ],
  curl_inv: [
    ['Reverse_Barbell_Curl-0', 'Barra con las palmas hacia abajo, brazos estirados.'],
    ['Reverse_Barbell_Curl-1', 'Sube doblando los codos, con las muñecas firmes. Baja lento.'],
  ],

  /* ---------- abdomen y cuello ---------- */
  elev_piernas: [
    ['Hanging_Leg_Raise-0', 'Cuélgate de la barra de dominadas sin balancearte.'],
    ['Hanging_Leg_Raise-1', 'Sube las rodillas (o las piernas estiradas, más difícil) hasta la altura de la cadera o más. Baja lento.'],
  ],
  sit_up: [
    ['Sit-Up-0', 'Acostado con las rodillas dobladas y los pies sujetos. Disco sobre el pecho o detrás de la cabeza.'],
    ['Sit-Up-1', 'Sube el tronco hasta quedar sentado y baja controlado.'],
  ],
  flexion_lateral: [
    ['Dumbbell_Side_Bend-0', 'De pie, disco o maleta en una mano y la otra en la cintura.'],
    ['Dumbbell_Side_Bend-1', 'Inclínate hacia el lado del peso y vuelve a subir con el costado contrario. Termina un lado y cambia.'],
  ],
  giro_barra: [
    ['Landmine_180s-0', 'Una punta de la barra en una esquina, protegida con una toalla, y un disco en la otra. Tómala con las dos manos, brazos estirados delante del pecho.'],
    ['Landmine_180s-1', 'Llévala hacia una cadera girando el tronco y pivoteando el pie de atrás; vuelve arriba y baja al otro lado.'],
  ],
  rueda: [
    ['Ab_Roller-0', 'De rodillas sobre algo blando, la rueda bajo los hombros y la cadera metida.'],
    ['Ab_Roller-1', 'Rueda adelante hasta donde puedas sin arquear la cintura y vuelve tirando con el abdomen.'],
  ],
  rueda_pie: [
    ['Barbell_Ab_Rollout-0', 'De pie, piernas estiradas, manos en la rueda (en la foto, con una barra con discos: es igual).'],
    ['Barbell_Ab_Rollout-1', 'Rueda hasta quedar casi en el suelo, cuerpo derecho como una tabla, y vuelve con el abdomen.'],
  ],
  turca: [
    ['Kettlebell_Turkish_Get-Up_Squat_style-0', 'Acostado con el disco arriba en una mano, brazo estirado. La rodilla del mismo lado doblada.'],
    ['Kettlebell_Turkish_Get-Up_Squat_style-1', 'Apóyate en el codo y luego en la mano libre hasta quedar sentado, siempre mirando el disco.'],
    ['Kettlebell_Turkish_Get-Up_Lunge_style-1', 'Levanta la cadera, lleva la pierna de abajo atrás hasta quedar arrodillado, y párate. Deshaz los pasos para volver al suelo.'],
  ],
  cuello_arnes: [
    ['Seated_Head_Harness_Neck_Resistance-0', 'Sentado, arnés en la cabeza con el disco colgando entre las piernas, manos en las rodillas. Deja que el cuello baje.'],
    ['Seated_Head_Harness_Neck_Resistance-1', 'Sube la cabeza hasta mirar al frente, lento y sin tirones, y vuelve a bajar.'],
  ],
  cuello_arnes_sosten: [
    ['Seated_Head_Harness_Neck_Resistance-1', 'Con más peso que en la extensión, sube la cabeza hasta mirar al frente y quédate quieto todo lo que aguantes.'],
  ],
  cuello_disco: [
    ['Lying_Face_Up_Plate_Neck_Resistance-0', 'Acostado de espalda en el banco con la cabeza afuera y un disco chico sobre la frente, con una toalla. Deja la cabeza atrás.'],
    ['Lying_Face_Up_Plate_Neck_Resistance-1', 'Lleva el mentón al pecho, lento, y vuelve.'],
  ],

  /* ---------- poleas ---------- */
  jalon_larga: [
    ['Wide-Grip_Lat_Pulldown-0', 'Polea alta con la barra larga. Agarre ancho, brazos estirados.'],
    ['Wide-Grip_Lat_Pulldown-1', 'Tira la barra hasta la parte alta del pecho, codos hacia abajo y atrás. Sube controlado.'],
  ],
  jalon_cerrado: [
    ['V-Bar_Pulldown-1', 'Polea alta con el agarre cerrado, brazos estirados.'],
    ['V-Bar_Pulldown-0', 'Tira hasta el pecho llevando los codos pegados al cuerpo. Sube controlado.'],
  ],
  remo_cerrado: [
    ['Seated_Cable_Rows-0', 'Sentado frente a la polea baja con el agarre cerrado, pies apoyados y espalda recta.'],
    ['Seated_Cable_Rows-1', 'Tira hacia el ombligo con el pecho arriba y los codos pegados. Estira los brazos controlado.'],
  ],
  remo_v: [
    ['Seated_Cable_Rows-0', 'Sentado frente a la polea baja con el agarre en V, manos enfrentadas, pies apoyados y espalda recta.'],
    ['Seated_Cable_Rows-1', 'Tira hasta el abdomen con el pecho arriba y los codos pegados. Estira los brazos controlado.'],
  ],
  jalon_v: [
    ['V-Bar_Pulldown-1', 'Polea alta con el agarre en V, manos enfrentadas y brazos estirados.'],
    ['V-Bar_Pulldown-0', 'Inclínate un poco atrás y tira hasta la parte alta del pecho, codos hacia abajo. Sube controlado.'],
  ],
  triceps_v: [
    ['Triceps_Pushdown_-_V-Bar_Attachment-0', 'Frente a la polea alta con el agarre en V, codos pegados al cuerpo y antebrazos horizontales.'],
    ['Triceps_Pushdown_-_V-Bar_Attachment-1', 'Empuja hasta estirar los brazos del todo sin mover los codos. Sube lento.'],
  ],
  remo_larga: [
    ['Elevated_Cable_Rows-0', 'Sentado frente a la polea baja con la barra larga, brazos estirados (en la foto, con agarre cerrado).'],
    ['Elevated_Cable_Rows-1', 'Tira la barra hacia la parte baja del pecho, codos afuera y atrás. Vuelve controlado.'],
  ],
  curl_cuerda: [
    ['Cable_Hammer_Curls_-_Rope_Attachment-0', 'De pie frente a la polea baja con la cuerda, brazos estirados.'],
    ['Cable_Hammer_Curls_-_Rope_Attachment-1', 'Sube doblando los codos sin moverlos y aprieta arriba. Baja lento.'],
  ],
  curl_martillo_cuerda: [
    ['Cable_Hammer_Curls_-_Rope_Attachment-0', 'Una cuerda en cada mano, pulgares hacia arriba, brazos estirados.'],
    ['Cable_Hammer_Curls_-_Rope_Attachment-1', 'Sube con los pulgares arriba hasta los hombros y baja lento.'],
  ],
  curl_polea: [
    ['Standing_Biceps_Cable_Curl-0', 'Polea baja con la barra corta, palmas hacia adelante.'],
    ['Standing_Biceps_Cable_Curl-1', 'Sube doblando los codos, sin moverlos. Baja lento.'],
  ],
  triceps_cuerda: [
    ['Triceps_Pushdown_-_Rope_Attachment-0', 'Polea alta con la cuerda. Codos pegados al cuerpo y doblados.'],
    ['Triceps_Pushdown_-_Rope_Attachment-1', 'Empuja hacia abajo hasta estirar los brazos y abre la cuerda al final. Vuelve sin mover los codos.'],
  ],
  triceps_barra: [
    ['Triceps_Pushdown-0', 'Polea alta con la barra corta, codos pegados y doblados.'],
    ['Triceps_Pushdown-1', 'Empuja hasta estirar los brazos y vuelve sin mover los codos.'],
  ],
  face_pull: [
    ['Face_Pull-0', 'Polea alta con la cuerda a la altura de la cara, brazos estirados.'],
    ['Face_Pull-1', 'Tira hacia la cara abriendo la cuerda, codos altos y afuera. Vuelve lento.'],
  ],
  crunch_polea: [
    ['Cable_Crunch-0', 'De rodillas frente a la polea alta, cuerda junto a la cabeza.'],
    ['Cable_Crunch-1', 'Enróllate llevando los codos hacia las rodillas con el abdomen, no con los brazos. Sube lento.'],
  ],
  pull_through: [
    ['Pull_Through-0', 'De espaldas a la polea baja, cuerda entre las piernas. Cadera atrás y espalda plana.'],
    ['Pull_Through-1', 'Empuja la cadera adelante apretando los glúteos hasta quedar derecho. Vuelve controlado.'],
  ],

  /* ---------- tobillera ---------- */
  patada_gluteo: [
    ['One-Legged_Cable_Kickback-0', 'Frente a la polea baja, la tobillera puesta y agarrado de la jaula.'],
    ['One-Legged_Cable_Kickback-1', 'Lleva la pierna atrás apretando el glúteo, sin arquear la cintura. Vuelve lento.'],
  ],
  curl_femoral_pie: [
    ['Standing_Leg_Curl-0', 'Frente a la polea baja con la tobillera, agarrado de la jaula y la rodilla apuntando al suelo (en la foto, en máquina).'],
    ['Standing_Leg_Curl-1', 'Dobla la pierna llevando el talón hacia el glúteo, sin mover el muslo. Baja controlado.'],
  ],
  abduccion_polea: [
    ['Cable_Hip_Adduction-1', 'De costado a la polea, con la tobillera en la pierna de afuera (en la foto, la aducción: la polea está al otro lado).'],
    ['Cable_Hip_Adduction-0', 'Lleva la pierna hacia el lado, lejos de la polea, con el tronco derecho. Vuelve lento.'],
  ],
  aduccion_polea: [
    ['Cable_Hip_Adduction-0', 'De costado a la polea, con la tobillera en la pierna más cercana y la pierna abierta hacia la polea.'],
    ['Cable_Hip_Adduction-1', 'Crúzala por delante de la otra pierna con el tronco derecho. Vuelve lento.'],
  ],
  elev_rodilla_polea: [
    ['Hip_Flexion_with_Band-0', 'De espaldas a la polea baja, con la tobillera puesta (en la foto, con banda: es igual).'],
    ['Hip_Flexion_with_Band-1', 'Sube la rodilla hasta la altura de la cadera sin echar el tronco atrás. Baja lento.'],
  ],

  /* ---------- banda de resistencia ---------- */
  pallof: [
    ['Pallof_Press-0', 'De costado a la jaula, la banda atada a la altura del pecho y tensa, manos juntas en el pecho (en la foto, con polea: es igual).'],
    ['Pallof_Press-1', 'Estira los brazos al frente sin dejar que la banda te gire. Aguanta 2 segundos y vuelve. Después, el otro lado.'],
  ],
  pull_apart: [
    ['Band_Pull_Apart-0', 'Banda tomada al ancho de los hombros, brazos estirados al frente.'],
    ['Band_Pull_Apart-1', 'Ábrela hasta tocarte el pecho, juntando los omóplatos. Vuelve lento.'],
  ],
  dominadas_banda: [
    ['Band_Assisted_Pull-Up-0', 'La banda enlazada en la barra y una rodilla (o los pies) dentro. Cuélgate con los brazos estirados.'],
    ['Band_Assisted_Pull-Up-1', 'Sube hasta pasar el mentón por la barra, como en una dominada normal. Baja controlado.'],
  ],
  pm_bandas: [
    ['Deadlift_with_Bands-0', 'La banda pisada por el medio y sus puntas pasadas sobre la barra, cerca de los discos. Posición de peso muerto.'],
    ['Deadlift_with_Bands-1', 'Tira como siempre: la banda se tensa arriba, así que termina el tirón con fuerza, apretando los glúteos.'],
  ],

  /* ---------- otros ---------- */
  cuerda: [
    ['Rope_Jumping-0', 'Cuerda detrás, codos pegados al cuerpo y las manos a la altura de la cadera.'],
    ['Rope_Jumping-1', 'Gira con las muñecas y salta bajito, en puntillas, lo justo para que pase la cuerda.'],
  ],
  thruster: [
    ['Front_Squat_Clean_Grip-0', 'Barra sobre los hombros, delante del cuello, codos altos.'],
    ['Front_Squat_Clean_Grip-1', 'Baja en sentadilla frontal hasta la paralela.'],
    ['Standing_Military_Press-1', 'Sube con fuerza y, sin parar, usa ese impulso para llevar la barra arriba hasta estirar los brazos. Bájala a los hombros y enlaza la siguiente.'],
  ],
  cargada: [
    ['Power_Clean-0', 'Barra en el suelo, agarre al ancho de los hombros, espalda plana.'],
    ['Clean-1', 'Tira fuerte con las piernas; cuando la barra pase las rodillas, salta y encoge los hombros.'],
    ['Power_Clean-1', 'Mete los codos rápido y recibe la barra sobre los hombros en un cuarto de sentadilla. Ponte de pie.'],
  ],
  arranque: [
    ['Power_Snatch-0', 'Barra en el suelo con agarre ancho (las manos casi en los discos), espalda plana.'],
    ['Power_Snatch-1', 'Tira con las piernas y, al pasar las caderas, salta y lleva los codos arriba.'],
    ['Overhead_Squat-0', 'Recibe la barra arriba con los brazos bloqueados, en un cuarto de sentadilla, y ponte de pie.'],
  ],
  ohs: [
    ['Overhead_Squat-0', 'Barra arriba con agarre ancho y los brazos bloqueados, como al final de un arranque.'],
    ['Overhead_Squat-1', 'Baja en sentadilla con el pecho alto y la barra sobre la mitad del pie. Sube sin que se vaya adelante.'],
  ],
  hspu: [
    ['Handstand_Push-Ups-0', 'Parado de manos con los talones apoyados en la pared, brazos estirados.'],
    ['Handstand_Push-Ups-1', 'Baja hasta que la cabeza toque un cojín en el suelo y empuja hasta estirar los brazos.'],
  ],
  muscle_up: [
    ['Muscle_Up-0', 'Cuélgate con agarre falso: las muñecas por encima de las anillas, no colgando de los dedos.'],
    ['Kipping_Muscle_Up-0', 'Tira explosivo llevando las anillas hacia el pecho bajo, con los codos pegados.'],
    ['Ring_Dips-0', 'Pasa el pecho por encima de las anillas, rápido: quedas abajo de un fondo.'],
    ['Ring_Dips-1', 'Empuja hasta estirar los brazos. En la barra es igual, pero el pecho pasa por encima de la barra.'],
  ],
  correr: [
    ['Trail_Running_Walking-0', 'Paso corto y liviano, brazos relajados.'],
    ['Trail_Running_Walking-1', 'En los WOD se corre fuerte pero parejo: que te quede aire para lo que viene.'],
  ],
  swing_disco: [
    ['One-Arm_Kettlebell_Swings-1', 'Disco tomado por los costados entre las piernas, cadera atrás y espalda plana (en la foto, con pesa rusa).'],
    ['One-Arm_Kettlebell_Swings-0', 'Golpe de cadera: el disco sube solo hasta la altura de los ojos. Déjalo caer y repite.'],
  ],
  salto_cajon: [
    ['Front_Box_Jump-0', 'Frente al cajón o al banco firme, brazos atrás y rodillas dobladas.'],
    ['Front_Box_Jump-1', 'Salta con los dos pies, cae suave arriba y estírate del todo. Baja caminando.'],
  ],
  pistol: [
    ['Kettlebell_Pistol_Squat-0', 'De pie en una pierna, la otra estirada adelante.'],
    ['Kettlebell_Pistol_Squat-1', 'Baja hasta abajo con el talón apoyado y sube sin tocar el suelo con la otra pierna.'],
  ],
  flexiones: [
    ['Pushups-0', 'Manos en el suelo algo más anchas que los hombros y el cuerpo derecho como una tabla, apoyado en las puntas de los pies.'],
    ['Pushups-1', 'Baja hasta que el pecho casi toque el suelo, codos a unos 45°, y empuja hasta estirar los brazos.'],
  ],
  sentadilla_libre: [
    ['Bodyweight_Squat-0', 'De pie, pies al ancho de los hombros, manos detrás de la cabeza o adelante.'],
    ['Bodyweight_Squat-1', 'Baja con la cadera atrás hasta la paralela, pecho arriba, y sube empujando con todo el pie.'],
  ],
  saltos_estrella: [
    ['Star_Jump-0', 'Agáchate un poco con los brazos abajo.'],
    ['Star_Jump-1', 'Salta abriendo brazos y piernas como una estrella y cae suave con todo junto. Si quieres algo más liviano, haz saltos de tijera.'],
  ],
  escaladores: [
    ['Mountain_Climbers-0', 'En plancha con los brazos estirados y una rodilla adelante, bajo el pecho.'],
    ['Mountain_Climbers-1', 'Cambia de pierna rápido, como si corrieras en el suelo. Cada cambio cuenta como una.'],
  ],
  burpees: [
    ['Bodyweight_Squat-1', 'De pie, agáchate y apoya las manos en el suelo.'],
    ['Pushups-0', 'Lanza los pies atrás hasta quedar en plancha.'],
    ['Pushups-1', 'Haz una flexión, con el pecho hasta el suelo.'],
    ['Freehand_Jump_Squat-1', 'Trae los pies hacia las manos, párate y salta con los brazos arriba.'],
  ],
};
