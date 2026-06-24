import type { Question } from "../../data/types";

export const questions: Question[] = [
  // Total: 130 questions
  {
    id: "daypo-modulo-i_q1",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    repeated: true,
    question: "Para la siguiente imagen...",
    options: [
      "A. Es un pulso rectangular",
      "B. Vale 1 dentro del rango -T/2<t<T/2",
      "C. Vale 0 fuera del rango -T/2<t<T/2",
      "D. Todos los anteriores",
    ],
    correctAnswer: "d",
  },

  {
    id: "daypo-modulo-i_q2",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    repeated: true,
    question: "Para la siguiente imagen...",
    options: [
      "A. Es una señal escalón unidad",
      "B. Se puede representar u(t) en función de un pulso (pt)",
      "C. Tiene duración infinita",
      "D. a) y c)",
    ],
    correctAnswer: "d",
    explanation:
      "Lo que se puede representar es un pulso p(t) en función de u(t), no al revés",
  },

  {
    id: "daypo-modulo-i_q3",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question:
      "Cómo se representa un pulso cuadrado en función de uno escalón unidad?",
    options: [
      "A. p(t) = u(t) - u(t-T)",
      "B. p(t) = u(t) + u(t-T)",
      "C. p(t) = u(t) * u(t-T)",
      "D. p(t) = u(t-T) - u(T)",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-i_q4",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "Un tren de pulsos...",
    options: [
      "A. Suma las versiones desplazadas del pulso base con amplitud Ak",
      "B. Es un tipo especial de pulso sinusoidal",
      "C. Es un tipo especial de pulso cuadrado",
      "D. Suma las versiones desplazadas del pulso escalón unidad con amplitud Ak",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-i_q5",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "Esto es un....",
    options: [
      "A. Tren de pulsos",
      "B. Un pulso cuadrado desplazado",
      "C. Un pulso cuadrado convolucionado",
      "D. Un pulso cuadrado rasterizado",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-i_q6",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    repeated: true,
    question: "¿Qué es esto?",
    options: [
      "A. Esto es un pulso unidad δ(t), o delta Dirac. Es el límite de una función pulso rectangular. Afecta aritméticamente a otros pulsos",
      "B. Esto es un pulso unitario δ(t). No es una señal convencional, sino un pulso de energía que no afecta a otros pulsos",
      "C. Esto es un pulso sumatorio δ(t). Sirve como vector para otros pulsos a nivel espacial con respecto al tiempo",
      "D. Ninguna de las anteriores",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-i_q7",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    repeated: true,
    question: "¿Qué es esto?",
    options: [
      "A. Esto son dos señales sinusoidales.",
      "B. Esto es una señal sinusoidal",
      "C. Esto es una señal cosenoidal",
      "D. Esto son dos señales continuas",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-i_q8",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "Cómo se representa una señal sinusoidal",
    options: [
      "A. x(t) = Acos(2πft + φ)",
      "B. x(t) = Asin(2πft + φ)",
      "C. x(t) = cos(2πft + φ)",
      "D. x(t) = -Asin(2πft + φ)",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-i_q9",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "El periodo fundamental de una señal sinusoidal...",
    options: [
      "A. Es la duración de un ciclo",
      "B. Es la separación entre mínimos o máximos",
      "C. Se mide en segundos",
      "D. Todas las respuestas son correctas",
    ],
    correctAnswer: "d",
  },

  {
    id: "daypo-modulo-i_q10",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "Qué es la frecuencia en una señal sinusoidal",
    options: [
      "A. Es el inverso del periodo fundamental",
      "B. Es el número de ciclos por unidad de tiempo",
      "C. Se mide en segundos",
      "D. a) y b)",
    ],
    correctAnswer: "d",
  },

  {
    id: "daypo-modulo-i_q11",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "Qué es la frecuencia angular",
    options: [
      "A. Permite simplificar la representación trigonométrica de una señal sinusoidal",
      "B. ω = 2πf",
      "C. Todas las anteriores",
      "D. Ninguna de las anteriores",
    ],
    correctAnswer: "d",
  },

  {
    id: "daypo-modulo-i_q12",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    repeated: true,
    question: "Qué es esto?",
    options: [
      "A. Es una señal sinc.",
      "B. Es una señal fork",
      "C. Es una señal cosc",
      "D. Es una señal R o de persistencia",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-i_q13",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "La energía de una senoidal es siempre...",
    options: [
      "A. 0",
      "B. Inf",
      "C. Depende del valor de la amplitud de la señal senoidal",
      "D. No es posible calcular la potencia con la energía",
    ],
    correctAnswer: "b",
  },

  {
    id: "daypo-modulo-i_q14",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "La potencia media de n periodos es...",
    options: ["A. independiente de n", "B. dependiente de n", "C. 0", "D. Inf"],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-i_q15",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "La potencia media de una señal periódica es...",
    options: [
      "A. la potencia media de un periodo",
      "B. equivalente a la potencia total de la señal periódica",
      "C. 0",
      "D. Inf",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-i_q16",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "Qué es la atenuación de señal?",
    options: [
      "A. La pérdida de potencia que se produce en el medio de transmisión por la separación entre el transmisor y el receptor",
      "B. Se expresa en W/s",
      "C. La pérdida de dB por kilómetro en medios guiados",
      "D. a) y c)",
    ],
    correctAnswer: "d",
    explanation: "La unidad es W, no W/s. W = J/s",
  },

  {
    id: "daypo-modulo-i_q17",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    repeated: true,
    question: "Escoja la opción falsa",
    options: [
      "A. La atenuación de la señal en medios guiados se mide en dB/km",
      "B. La separación entre emisor y receptor es uno de los parámetros que afectan a la atenuación",
      "C. Las condiciones atmosféricas no afectan a la atenuación de la señal",
      "D. La atenuación se mide como la diferencia entre la señal output y la señal input",
    ],
    correctAnswer: "c",
  },

  {
    id: "daypo-modulo-i_q18",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "Qué es dBm?",
    options: [
      "A. El decibelio-miliVatio, toma como referencia 1mW",
      "B. Es decibelio-metro, calcula la atenuación por metro",
      "C. Es decibelio-miliJulio, toma como referencia 1mJ",
      "D. Ninguna de las anteriores",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-i_q19",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "Un retardo de transmisión",
    options: [
      "A. Está relacionado con el flujo de datos capaz de admitir la línea y los equipos de transmisión. Está relacionado con la tecnología empleada",
      "B. Está relacionado con la distancia entre nodos. Es decir, el tiempo que tarda el viaje de los datos.",
      "C. Es la diferencia en atenuación entre la señal del emisor y el receptor",
      "D. Ninguna de las anteriores",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-i_q20",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "Un retardo de propagación",
    options: [
      "A. Está relacionado con el flujo de datos capaz de admitir la línea y los equipos de transmisión. Está relacionado con la tecnología empleada",
      "B. Está relacionado con la distancia entre nodos. Es decir, el tiempo que tarda el viaje de los datos.",
      "C. Es la diferencia en atenuación entre la señal del emisor y el receptor",
      "D. Ninguna de las anteriores",
    ],
    correctAnswer: "b",
  },

  {
    id: "daypo-modulo-i_q21",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    repeated: true,
    question: "ISI",
    options: [
      "A. Interferencia Inter-Simbólica, común en las comunicaciones inalámbricas.",
      "B. Interferencia Simbólica Interna, común en la propagación de trayectos múltiples",
      "C. Interferencia por Solapamiento de Impulsos, común en intervalos de tiempo asignados",
      "D. Ninguna de las anteriores",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-i_q22",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    repeated: true,
    question: "ISI",
    options: [
      "A. Común en comunicaciones inalámbricas, donde un símbolo interfiere con símbolos posteriores. Normalmente causada por propagación de trayectos múltiples o respuestas no lineales del canal",
      "B. Común en comunicaciones alámbricas de cobre, donde un símbolo interfiere con símbolos posteriores. Normalmente causada por propagación de trayectos múltiples o respuestas no lineales del canal",
      "C. Fenómeno poco común en conexiones inalámbricas, donde un símbolo interfiere con símbolos posteriores. Normalmente causada por propagación de trayectos múltiples o respuestas no lineales del canal",
      "D. Ninguna de las anteriores",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-i_q23",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    repeated: true,
    question: "Qué es esto?",
    options: [
      "A. Ejemplo de ISI",
      "B. Ejemplo de convolución",
      "C. Ejemplo de atenuación",
      "D. Ejemplo de malversación de datos",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-i_q24",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "Qué ocasiona esto?",
    options: [
      "A. ISI",
      "B. Convolución",
      "C. Atenuación",
      "D. Pérdida de datos",
    ],
    correctAnswer: "b",
  },

  {
    id: "daypo-modulo-i_q25",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "LTI",
    options: [
      "A. Salida del Sistema, necesitamos la respuesta del impulso",
      "B. Salida del Sistema, NO necesitamos la respuesta del impulso",
      "C. Se calcula como x(t) = h(t) * s(t)",
      "D. a) y c)",
    ],
    correctAnswer: "d",
  },

  {
    id: "daypo-modulo-i_q26",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "En cuanto a la suma, la propiedad de convolución dice que es",
    options: [
      "A. Distributiva",
      "B. Multiplicativa",
      "C. Aditiva",
      "D. Todas las anteriores",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-i_q27",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    repeated: true,
    question: "Escoja la opción falsa",
    options: [
      "A. Para hacer la convolución de un pulso unidad, debemos reescribirlo en función de 𝜏",
      "B. El punto 𝜏 sustituye al punto central del pulso unidad",
      "C. No se puede hacer convolución de un pulso unidad porque no tiene área",
      "D. La convolución de un pulso unidad con respecto a un pulso cuadrado, ambos con la misma amplitud, siempre da el pulso cuadrado",
    ],
    correctAnswer: "c",
  },

  {
    id: "daypo-modulo-i_q28",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    repeated: true,
    question: "Escoja la opción falsa",
    options: [
      "A. La convolución de un pulso unidad con respecto a t-t0 tiene el mismo efecto que uno con respecto a 0",
      "B. La convolución de un pulso unidad con respecto a t-t0 para un pulso cuadrado lo desplaza",
      "C. b) y d)",
      "D. La convolución de un pulso unidad t-t0 con respecto a un pulso cuadrado, ambos con la misma amplitud, siempre da el pulso cuadrado con desplazamiento",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-i_q29",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    repeated: true,
    question: "Escoja la opción falsa",
    options: [
      "A. El resultado integral de la convolución de dos pulsos cuadrados idénticos con el mismo comienzo, siempre dará un pulso triangular",
      "B. El resultado integral de la convolución de dos pulsos cuadrados, uno de menor tamaño que el otro, siempre dará un trapecio",
      "C. La convolución entre dos pulsos cuadrados inversos de distintas amplitudes en valor absoluto siempre dará un trapecio de sentido equivalente al pulso cuadrado de menor amplitud",
      "D. La convolución de un pulso cuadrado y un pulso unidad es posible y siempre da un trapecio",
    ],
    correctAnswer: "d",
  },

  {
    id: "daypo-modulo-i_q30",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question:
      "En el modelo del sistema PAM, de qué se encarga la fuente de información?",
    options: [
      "A. Genera bit binarios",
      "B. Asigna una forma de onda a cada bit",
      "C. Introduce distorsiones a la señal (atenuación, retardos, limitación de banda, ruido...)",
      "D. Detecta la señal entrante",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-i_q31",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "En el modelo del sistema PAM, de qué se encarga el modulador?",
    options: [
      "A. Genera bit binarios",
      "B. Asigna una forma de onda a cada bit",
      "C. Introduce distorsiones a la señal (atenuación, retardos, limitación de banda, ruido...)",
      "D. Detecta la señal entrante",
    ],
    correctAnswer: "b",
  },

  {
    id: "daypo-modulo-i_q32",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "En el modelo del sistema PAM, de qué se encarga el canal?",
    options: [
      "A. Genera bit binarios",
      "B. Asigna una forma de onda a cada bit",
      "C. Introduce distorsiones a la señal (atenuación, retardos, limitación de banda, ruido...)",
      "D. Detecta la señal entrante",
    ],
    correctAnswer: "c",
  },

  {
    id: "daypo-modulo-i_q33",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "En el modelo del sistema PAM, de qué se encarga el detector?",
    options: [
      "A. Genera bit binarios",
      "B. Asigna una forma de onda a cada bit",
      "C. Introduce distorsiones a la señal (atenuación, retardos, limitación de banda, ruido...)",
      "D. Detecta la señal entrante",
    ],
    correctAnswer: "d",
  },

  {
    id: "daypo-modulo-i_q34",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "Que es el PAM",
    options: [
      "A. Es un modulador digital de M = 2^b señales, que se obtienen cambiando la amplitud de una forma de onda",
      "B. Es Pulse Amplitude Modulation",
      "C. Un sistema donde se asigna una onda a partir de unos bits de la fuente de información",
      "D. Todas las respuestas son correctas",
    ],
    correctAnswer: "d",
  },

  {
    id: "daypo-modulo-i_q35",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    repeated: true,
    question: "Qué es esto?",
    options: [
      "A. Un tren de pulsos",
      "B. El resultado de la señal modulada 2-PAM del mensaje 01101",
      "C. a) y b)",
      "D. Ninguna de las anteriores",
    ],
    correctAnswer: "c",
  },

  {
    id: "daypo-modulo-i_q36",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "En una 4-PAM",
    options: [
      "A. Tenemos 2 bits de entrada (2^2 bytes, 2 bits)",
      "B. Tenemos 4 formas de onda, 3p(t), p(t), -p(t), -3p(t)",
      "C. Cada símbolo representa 2 bits",
      "D. b) y c)",
    ],
    correctAnswer: "c",
  },

  {
    id: "daypo-modulo-i_q37",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "Al aumentar M, en un sistema PAM cualquiera...",
    options: [
      "A. Las señales serán más parecidas entre sí",
      "B. El sistema será más sensible al ruido",
      "C. El sistema será menos sensible al ruido",
      "D. a) y b)",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-i_q38",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "Qué es el ruido?",
    options: [
      "A. Señal de naturaleza aleatoria que modifica la señal recibida",
      "B. Señal de naturaleza aleatoria que modifica la señal transmitida",
      "C. Señal natural que distorsiona solamente en amplitudes grandes",
      "D. Agitación de las moléculas de aire que ocasiona distorsión en la señal auditiva",
    ],
    correctAnswer: "b",
  },

  {
    id: "daypo-modulo-i_q39",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "Seleccione la opción falsa",
    options: [
      "A. El ruido grande puede ocasionar tanta distorsión que ocasione confusión entre símbolos, causando errores de transmisión",
      "B. Siempre va a existir ruido en una señal transmitida, por poco que sea",
      "C. Si se aumenta la potencia de la señal recibida, podemos reducir el suelo de ruido",
      "D. Existen distintos tipos de ruido según lo que afecten (ruido térmico, impulsivo...)",
    ],
    correctAnswer: "c",
    explanation: "Al aumentar la potencia, aumenta el ruido",
  },

  {
    id: "daypo-modulo-i_q40",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "AWGN",
    options: [
      "A. Tipo de ruido blanco gaussiano",
      "B. Tipo de ruido aleatorio de distribución normal",
      "C. Tipo de ruido que se le suma a la señal",
      "D. Todas las opciones son correctas",
    ],
    correctAnswer: "d",
  },

  {
    id: "daypo-modulo-i_q41",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "SNR",
    options: [
      "A. Signal to Noise Ratio. Se mide en W",
      "B. Signal to Noise Ratio. No tiene dimensiones, pero se puede expresar en dB",
      "C. Mide la calidad de la señal recibida. A mayor valor, menor distorsión",
      "D. b) y c)",
    ],
    correctAnswer: "d",
  },

  {
    id: "daypo-modulo-i_q42",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "Eb/No",
    options: [
      "A. En canales AWGN, No está relacionado con la desviación típica del ruido",
      "B. Se expresa en dBm",
      "C. Eb es la energía de bit, donde SOLAMENTE en 4-PAM coincide con la energía de pulso",
      "D. a) y c)",
    ],
    correctAnswer: "d",
    explanation:
      "Se expresa en dB. Es solamente en 2-PAM donde la energía de pulso coincide con la energía de bit",
  },

  {
    id: "daypo-modulo-i_q43",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "Filtro lineal",
    options: [
      "A. El mejor filtro lineal para detectar una señal conocida en ruido blanco es la misma pero con la señal invertida en el tiempo",
      "B. El resultado del filtro adaptado según el filtro lineal siempre dará un triángulo",
      "C. A menor Eb/No, más difícil es hacer coincidir la señal recibida con la modulada",
      "D. Todas las opciones son correctas",
    ],
    correctAnswer: "d",
  },

  {
    id: "daypo-modulo-i_q44",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    repeated: true,
    question: "Transformada de Fourier",
    options: [
      "A. Permite representar una señal en el dominio de la frecuencia",
      "B. Se expresa normalmente como X(w), que equivale a la frecuencia de x(t)",
      "C. Una vez se representa la señal a través de la transformada de Fourier, no se puede volver a la original x(t)",
      "D. Todas las opciones son correctas",
    ],
    correctAnswer: "a",
    explanation:
      "X(w) es el espectro de x(t), y sí se puede volver, con la transformada de fourier inversa (no coña)",
  },

  {
    id: "daypo-modulo-i_q45",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    repeated: true,
    question: "Transformada de Fourier",
    options: [
      "A. Transforma una señal del dominio del tiempo al dominio de la frecuencia",
      "B. Se puede expresar en rad/s si hablamos de X(w) o en Hz si es X(f)",
      "C. a) y b)",
      "D. Ninguna de las opciones son correctas",
    ],
    correctAnswer: "c",
  },

  {
    id: "daypo-modulo-i_q46",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "La transformada de Fourier sobre un pulso rectangular da una...",
    options: [
      "A. Señal sinc",
      "B. Señal sinusoidal",
      "C. Señal triangular",
      "D. Ninguna de las opciones son correctas",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-i_q47",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    repeated: true,
    question: "Qué es esto?",
    options: [
      "A. Resultado de ver a Fourier en acción",
      "B. Resultado de ver a Fourier Inverso en acción",
      "C. Resultado de ver a Parseval en acción",
      "D. Resultado de ver a Parseval Inverso en acción",
    ],
    correctAnswer: "a",
    explanation:
      "Fijaos en las unidades. Si no fuese por eso, podría ser la inversa de fourier",
  },

  {
    id: "daypo-modulo-i_q48",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    repeated: true,
    question: "Qué es esto?",
    options: [
      "A. La relación de Parseval",
      "B. La transformada de Fourier",
      "C. La transformada de Parseval",
      "D. Ninguna de las anteriores",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-i_q49",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "La propiedad de linealidad dice...",
    options: [
      "A. Cualquier constante que multiplique a una señal en el dominio del tiempo también lo hará (de la misma manera) en el dominio de la frecuencia",
      "B. Cualquier constante que multiplique a una señal en el dominio del tiempo también lo hará (NO de la misma manera) en el dominio de la frecuencia",
      "C. Cualquier constante que multiplique a una señal en el dominio del tiempo también NO lo hará en el dominio de la frecuencia",
      "D. Cualquier constante que multiplique a una señal en el dominio del tiempo es despreciable en el dominio de la frecuencia",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-i_q50",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "La propiedad de escalado en el tiempo...",
    options: [
      "A. Transforma una señal x(t) en otra señal x(at) donde a es un numero real positivo",
      "B. Cuando |a| > 1, la señal se comprime en el tiempo",
      "C. Al alagar una señal, aumenta en expansión de tiempo",
      "D. Todas son verdaderas",
    ],
    correctAnswer: "d",
  },

  {
    id: "daypo-modulo-i_q51",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    repeated: true,
    question: "Qué es esto?",
    options: [
      "A. Ejemplo de la propiedad de escalado en tiempo para señales en el dominio del tiempo",
      "B. Ejemplo de la propiedad de escalado en tiempo para señales en el dominio de la frecuencia",
      "C. Ejemplo de la propiedad de linealidad",
      "D. Ninguna es verdadera",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-i_q52",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "La propiedad de escalado en el tiempo con respecto a la TF...",
    options: [
      "A. Cuando |a| > 1, la señal se comprime en el tiempo y en frecuencia",
      "B. Cuando |a| > 1, la señal se comprime en el tiempo pero se expande en frecuencia",
      "C. Cuando |a| > 1, la señal se comprime en el tiempo y no tiene transcendencia en frecuencia",
      "D. Ninguna de las anteriores",
    ],
    correctAnswer: "b",
  },

  {
    id: "daypo-modulo-i_q53",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question:
      "En cuanto a la velocidad de transmisión para 2-PAM con duración Ts...",
    options: [
      "A. Si Ts aumenta, menor será vs y el BW",
      "B. Si Ts aumenta, mayor será vs y el BW",
      "C. Si Ts aumenta, menor será vs y mayor el BW",
      "D. Si Ts aumenta, mayor será vs y menor el BW",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-i_q54",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "La propiedad de desplazamiento en tiempo...",
    options: [
      "A. Si aplicamos un retardo, se desfasa la señal en el tiempo",
      "B. Sí afecta a la frecuencia",
      "C. Si aplicamos un retardo, se desfasa la señal en el tiempo y en frecuencia",
      "D. b) y la c)",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-i_q55",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "La multiplicación de señales de TF...",
    options: [
      "A. La propiedad de modulación es la dual de la de convolución",
      "B. Multiplicar señales es equivalente a sumarlas en el dominio de la frecuencia",
      "C. Multiplicar señales es equivalente a sumarlas en el dominio del tiempo",
      "D. a) y la b)",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-i_q56",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "Un filtro h(t), o H(w) en TF...",
    options: [
      "A. Con respecto al dominio del tiempo, devuelve y(t) = x(t) * h(t)",
      "B. Con respecto a TF, devuelve Y(w)=H(W)X(W)",
      "C. Un filtro no puede aplicarse en dos dominios",
      "D. a) y la b)",
    ],
    correctAnswer: "d",
  },

  {
    id: "daypo-modulo-i_q57",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "Los pulsos rectangulares...",
    options: [
      "A. Son inadecuados para transmitir datos por canales de banda limitada debido a que el espectro en forma sinc no permite el paso de todas sus frecuencias",
      "B. El canal deforma los pulsos rectangulares y las amplitudes observadas son distintas a las amplitudes transmitidas",
      "C. Son adecuados para transmitir datos por canales de banda limitada debido a que el espectro en forma sinc permite el paso de todas sus frecuencias",
      "D. a) y b)",
    ],
    correctAnswer: "d",
  },

  {
    id: "daypo-modulo-i_q58",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "Mapeado de Gray",
    options: [
      "A. La asignación de bits a símbolos adyacentes difiere solo en un bit",
      "B. Permite mapear en modulación con constelación real y compleja",
      "C. a) y b)",
      "D. Ninguna de las anteriores",
    ],
    correctAnswer: "c",
  },

  {
    id: "daypo-modulo-i_q59",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question:
      "El BW mínimo de una señal PAM para un canal con frecuencia de corte K...",
    options: [
      "A. Debe tener una velocidad de símbolo inferior o igual a dos veces la frecuencia de corte",
      "B. No depende de la velocidad de símbolo pero sí de la de bit",
      "C. Debe tener una velocidad de símbolo superior a la frecuencia de corte K",
      "D. Ninguna de las anteriores",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-i_q60",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "En la modulación ASK",
    options: [
      "A. La información se transporta en una dimensión de la señal cambiando la amplitud",
      "B. Es un sistema de modulación donde se lanzan preguntas en forma de BITS y se devuelve una onda final",
      "C. Es un sistema de modulación donde se transporta una señal TF gracias a un desfase de señal",
      "D. La información se transporta en en la fase de la señal transmitida",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-i_q61",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    repeated: true,
    question: "Qué es esto?",
    options: [
      "A. Tren de pulsos 4ASK con pulsos rectangulares",
      "B. Tren de pulsos 4PAM con pulsos rectangulares",
      "C. Tren de pulsos 4PSK con pulsos rectangulares",
      "D. Tren de pulsos 12PAM con pulsos rectangulares",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-i_q62",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "En la modulación PSK",
    options: [
      "A. La información se transporta en una dimensión de la señal cambiando la amplitud",
      "B. Es un sistema de modulación donde se lanzan preguntas en forma de BITS y se devuelve una onda final",
      "C. Es un sistema de modulación donde se transporta una señal TF gracias a un desfase de señal",
      "D. La información se transporta en en la fase de la señal transmitida",
    ],
    correctAnswer: "d",
  },

  {
    id: "daypo-modulo-i_q63",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "En la modulación QAM",
    options: [
      "A. La información se transporta en una dimensión de la señal cambiando la amplitud",
      "B. Es un sistema de modulación donde se lanzan preguntas en forma de BITS y se devuelve una onda final",
      "C. La información se transporta en las dos dimensiones de la señal",
      "D. La información se transporta en en la fase de la señal transmitida",
    ],
    correctAnswer: "c",
  },

  {
    id: "daypo-modulo-i_q64",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "Una modulación 16QAM",
    options: [
      "A. Tiene 4 bits por símbolo",
      "B. Existen 8 modos por dominio",
      "C. a) y b)",
      "D. Ninguna de las anteriores",
    ],
    correctAnswer: "c",
  },

  {
    id: "daypo-modulo-i_q65",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    repeated: true,
    question: "La codificación de un canal",
    options: [
      "A. Implica añadir redundancia a la fuente para combatir los errores introducidos por el canal",
      "B. Implica quitar redundancia en la fuente para combatir los errores introducidos por el canal",
      "C. Permite crear mensajes más privados a partir de una codificación especial",
      "D. Ninguna de las anteriores",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-i_q66",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    repeated: true,
    question: "La codificación de un canal",
    options: [
      "A. Añade redundancia transmitiendo N bits por cada K bits, siendo K<N",
      "B. La tasa de codificación es R = K/N",
      "C. El canal alterará algunos bits transmitidos de modo que el vector de bits recibido puede ser distintos al transmitido",
      "D. Todas las anteriores",
    ],
    correctAnswer: "d",
  },

  {
    id: "daypo-modulo-i_q67",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "BSC",
    options: [
      "A. Canal binario simétrico, altera el bit transmitido con probabilidad de p. Eso quiere decir que hay un 50% de probabilidades de haber recibido el bit correcto",
      "B. Canal binario simétrico, altera el bit transmitido con probabilidad de p.",
      "C. Byte-Secure Channel, es un canal de transporte seguro de bits que reduce la tasa de ruido",
      "D. Bytes-Secure Concurrency, es un método de codificación que repite el bit enviado por probabilidad del mismo",
    ],
    correctAnswer: "b",
  },

  {
    id: "daypo-modulo-i_q68",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "La codificación repetitiva",
    options: [
      "A. Consiste en añadir un bit del mensaje recibido si existe cierta repetición (marcado por un umbral)",
      "B. Consiste en reemplazar un bit del mensaje recibido si existe cierta repetición (marcado por un umbral)",
      "C. Consiste en eliminar un bit del mensaje recibido si existe cierta repetición (marcado por un umbral)",
      "D. Mala codificación cuándo el canal no tiene errores, porque aumenta el tiempo de transmisión",
    ],
    correctAnswer: "b",
  },

  {
    id: "daypo-modulo-i_q69",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "Un código binario de longitud n y cardinalidad 2^k",
    options: [
      "A. Es una colección de 2^k-1 elementos",
      "B. n es la longitud del bloque",
      "C. La tasa de codificación será r = k/n + 1",
      "D. Ninguna de las anteriores",
    ],
    correctAnswer: "b",
    explanation:
      "Es una colección de 2^k elementos y La tasa de codificación será r = k/n. Por ejemplo, un 3-repetición será, con k=1 y n =3 -> 1/3",
  },

  {
    id: "daypo-modulo-i_q70",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "El peso de hamming de una palabra, w(u)...",
    options: [
      "A. Número de bits distintos de 0 de una palabra u",
      "B. Número de bits 0 de una palabra u",
      "C. Distancia mínima entre cualesquiera dos palabras de un código",
      "D. Ninguna de las anteriores",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-i_q71",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    repeated: true,
    question: "La decodificación...",
    options: [
      "A. Dada una palabra recibida, escogemos como transmitida aquella palabra código más próxima en distancia de hamming",
      "B. Dada una palabra recibida, escogemos como transmitida aquella palabra código inversa en peso de hamming",
      "C. Introduce más errores en la palabra transmitida",
      "D. Ninguna de las anteriores",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-i_q72",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    repeated: true,
    question: "La decodificación...",
    options: [
      "A. Dada una palabra recibida, escogemos como transmitida aquella palabra código más próxima en distancia de hamming",
      "B. Dada una palabra recibida, escogemos como transmitida aquella palabra código inversa en peso de hamming",
      "C. Introduce más errores en la palabra transmitida",
      "D. a) y c)",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-i_q73",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "Los errores (d) que puede detectar un código Hamming son...",
    options: [
      "A. d = d(min) - 1",
      "B. d = (d(min) - 1 / 2)",
      "C. d = d(min) - 2",
      "D. d = (d(min) - 2 / 2)",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-i_q74",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "Los errores (d) que puede corregir un código Hamming son...",
    options: [
      "A. d = d(min) - 1",
      "B. d = (d(min) - 1 / 2)",
      "C. d = d(min) - 2",
      "D. d = (d(min) - 2 / 2)",
    ],
    correctAnswer: "b",
  },

  {
    id: "daypo-modulo-i_q75",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "Un código con distancia mínima 5, podrá",
    options: [
      "A. detectar 4 errores",
      "B. corregir 2 errores",
      "C. detectar 2 errores",
      "D. a) y b)",
    ],
    correctAnswer: "d",
  },

  {
    id: "daypo-modulo-i_q76",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "Escoja la opción verdadera",
    options: [
      "A. Un código binario es lineal si es abierto respecto a la suma de n-tuplas",
      "B. Todo código binario lineal incluye la palabra 1",
      "C. La distancia mínima de un código lineal es igual al peso mínimo de las palabras no nulas",
      "D. Un código lineal es un subespacio vectorial del espacio vectorial {0,1}^k, de dimensión k",
    ],
    correctAnswer: "c",
    explanation:
      "Un código binario es lineal si es cerrado respecto a la suma de n-tuplas.",
  },

  {
    id: "daypo-modulo-i_q77",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    repeated: true,
    question: "Escoja la opción falsa",
    options: [
      "A. Para cada palabra código de peso de Hamming pH",
      "B. Si existen pH columnas de H que suman 0, entonces existe una palabra código con peso de Hamming pH.",
      "C. Con respecto al código Hamming, Pueden corregir cualquier patrón de error de 2 bits si dmin=1",
      "D. La distancia mínima (= palabra con menor peso de",
    ],
    correctAnswer: "c",
  },

  {
    id: "daypo-modulo-i_q78",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "Un standard array",
    options: [
      "A. Tabla que a cada síndrome le hace corresponder el patrón de error con menos peso que lo produce",
      `B. Tabla que permite la decodificación óptima mediante el uso de errores "e" transmitidos por el canal "c"`,
      "C. Tabla que permite generar la matriz paridad de un código hamming",
      "D. Tabla que permite generar la matriz generadora de la matriz paridad de un código hamming",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-i_q79",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "Si c' ∈ {0,1}^n",
    options: [
      "A. s' ∈ {0,1}^n-k",
      "B. Un mismo síndome es producido por 2^k patrones de error",
      "C. s' = c'H^T",
      "D. Todas las anteriores",
    ],
    correctAnswer: "d",
  },

  {
    id: "daypo-modulo-i_q80",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "Para la decodificación óptima mediante síndrome",
    options: [
      "A. Calculamos síndrome, buscamos en el standard array qué patrón de peso mínimo le corresponde, sumamos ese patrón de error a la palabra recibida para obtener la transmitida",
      "B. Buscamos en el standard array qué síndrome usar, sumamos ese síndrome a la palabra recibida para obtener la transmitida",
      "C. Traducimos la matriz paridad para obtener el standard array, sacamos el síndrome necesario, sumamos a la palabra recibida para obtener la transmitida",
      "D. Decodificamos la matriz paridad, obtenemos la matriz generadora, obtenemos el standard array, sacamos el síndrome necesario, sumamos a la palabra recibida para obtener la transmitida",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-i_q81",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "Es la regla de codificación por síndrome óptima?",
    options: [
      "A. Sí, ya que la probabilidad de un patrón de error es mayor que la de cualquier otro con mayor peso",
      "B. Sí, ya que el uso de síndromes en este contexto es infalible, independientemente del standard array",
      "C. No, porque seguimos usando la tabla de standard array lo cual añade recursos innecesarios",
      "D. No, porque el uso de síndromes aumenta el tiempo de ejecución del codificador",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-i_q82",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "Con 3 bits de mensaje, tenemos",
    options: [
      "A. 8 síndromes",
      "B. 7 síndromes",
      "C. Depende del código de Hamming",
      "D. Tendremos 7 u 8 síndromes, dependiendo del standard array",
    ],
    correctAnswer: "b",
    explanation: "2^3 - 1",
  },

  {
    id: "daypo-modulo-i_q83",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "Un código perfecto es",
    options: [
      "A. el que no tiene errores de codificación. En teoría son posibles, aunque en la práctica no",
      "B. el que corrige todos los patrones de hasta t errores y ninguno de más errores",
      "C. son los que alcanzan el sphere packing bound",
      "D. b) y c)",
    ],
    correctAnswer: "d",
  },

  {
    id: "daypo-modulo-i_q84",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "Elige la opción correcta",
    options: [
      "A. Si permitimos que el código de Hamming sea NO sistemático, el valor en decimal del síndrome nos indica la posición del bit en error",
      "B. Si permitimos que el código de Hamming SEA sistemático, el valor en decimal del síndrome nos indica la posición del bit en error",
      "C. No es posible hacer de un código Hamming que este sea sistemático, porque rompe con el sistema de generación del mismo",
      "D. Ninguna de las anteriores",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-i_q85",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question:
      "Elige la opción correcta con respecto al Hamming extendido, dmin = 4",
    options: [
      "A. Puede detectar si hubo exactamente 1 o 2 errores",
      "B. La capacidad de corrección sigue siendo 1 error",
      "C. Independientemente del dmin, estos son usados en las memorias ECC de servidores, donde se denomina SECDED",
      "D. Todas las anteriores",
    ],
    correctAnswer: "d",
  },

  {
    id: "daypo-modulo-i_q86",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "Teorema de codificación de canal",
    options: [
      "A. Dado un canal de comunicación, existe una tasa máxima [bit] denominada capacidad C, a la cual la información puede ser transmitida fiablemente",
      "B. Muestra que la probabilidad de error tiende a cero cuando el tamaño de palabra código tiende a infinito",
      "C. Si transmitimos una tasa R=k/n, si R<C (capacidad) entonces los mensajes de la fuente pueden ser reconstruidos fielmente",
      "D. Todas las anteriores",
    ],
    correctAnswer: "d",
  },

  {
    id: "daypo-modulo-i_q87",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    repeated: true,
    question: "Escoja la opción falsa",
    options: [
      "A. Cualquier código escogido de forma aleatoria NO permite alcanzar la capacidad del canal",
      "B. Los códigos Turbo y LDPC alcanzan la capacidad del canal porque usan una estructura pseudoaleatoria y tamaño de bloque muy grande",
      "C. Los códigos LDPC son simplemente códigos con matriz H de control de paridad dispersa (pocos 1s y muchos 0s)",
      "D. Turbo se usa en LTE, LDPC en 802.11. Ambos contemplan el uso de código convolucionales como transmisión",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-i_q88",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    repeated: true,
    question: "Escoja la opción falsa",
    options: [
      "A. Las palabras de un código convolucional se generan no sólo a partir de los bits de información actuales sino también con la información anterior en el tiempo",
      "B. Un codificador convolucional es un sistema con memoria",
      "C. Los códigos convolucionales no alcanzan la capacidad del canal",
      "D. Todas las opciones son falsas",
    ],
    correctAnswer: "d",
  },

  {
    id: "daypo-modulo-i_q89",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "Con respecto a IEE 802.11",
    options: [
      "A. Los canales 2.4GHz tienen mayor distancia de propagación y mayor solapamiento que los de 5GHz",
      "B. Los canales de 5GHz tienen menos distancia y tienen solapamiento de canales",
      "C. Los canales de 5GHz tienen menor distancia de propagación y NO tienen solapamiento de canales",
      "D. a) y c)",
    ],
    correctAnswer: "d",
  },

  {
    id: "daypo-modulo-i_q90",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "Los canales de 5GHz",
    options: [
      "A. Tienen 25 canales de 20 MHz sin solapamiento",
      "B. Tienen 12 canales de 20 MHz sin solapamiento",
      "C. Tienen 6 canales de 20 MHz sin solapamiento",
      "D. Tienen 2 canales de 20 MHz con solapamiento",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-i_q91",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "Los canales de 2.4GHz",
    options: [
      "A. Tienen 3 canales de 20 MHz sin solapamiento",
      "B. Tienen 1 canales de 40 MHz con solapamiento",
      "C. Tienen 6 canales de 80 MHz con solapamiento",
      "D. Tienen 2 canales de 160 MHz con solapamiento",
    ],
    correctAnswer: "a",
    explanation: "Tienen 1 canales de 40 MHz SIN solapamiento",
  },

  {
    id: "daypo-modulo-i_q92",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "En los canales 6GHz",
    options: [
      "A. La UE ocupa el espectro de 5925MHz a 6426MHz",
      "B. No existen",
      "C. Solamente están en uso en USA y ocupan el espectro de 5925Mhz a 7125MHz",
      "D. Ocupan un rango de 160MHz",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-i_q93",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "El modelo OFDM de IEEE 802.11",
    options: [
      "A. Nace de poder tener selectividad de frecuencia del canal",
      "B. En lugar de transmitir una señal de banda ancha, transmitimos una superposición de portadoras de banda estrecha cada una siendo afectada por el canal de modo independiente",
      "C. Nace de poder quitar la selectividad de frecuencia del canal",
      "D. a) y b)",
    ],
    correctAnswer: "d",
  },

  {
    id: "daypo-modulo-i_q94",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "Con respecto a la modulación en IEEE 802.11",
    options: [
      "A. Cada una tiene una eficiencia espectral ƞ [bit/s/Hz]",
      "B. No tiene una tasa de codificación R = k / n como vimos anteriormente",
      "C. Si usamos un MCS (Modulation and Coding Scheme) con ƞ y R sobre un canal, tendremos el ancho de banda del canal",
      "D. a) y c)",
    ],
    correctAnswer: "a",
    explanation:
      "Si usamos un MCS (Modulation and Coding Scheme) con ƞ y R sobre un canal, tendremos la tasa resultante vb=BRƞ.",
  },

  {
    id: "daypo-modulo-i_q95",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "Para un B = 20 MHZ, un 16QAM, R = 1/2",
    options: [
      "A. vb = 40Mb/s",
      "B. vb = 120Mb/s",
      "C. vb = 80Mb/s",
      "D. vb = 20Mb/s",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-i_q96",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "Para un B = 160 MHZ, un 1024QAM, R = 3/4",
    options: [
      "A. vb = 40Mb/s",
      "B. vb = 120Mb/s",
      "C. vb = 80Mb/s",
      "D. vb = 20Mb/s",
    ],
    correctAnswer: "b",
  },

  {
    id: "daypo-modulo-i_q97",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "MIMO",
    options: [
      "A. Esquema que resulta en el número de flujos espaciales igual al mínimo de las anteras usadas",
      "B. Tasa resultante del producto de un MCS con un flujo espacial S",
      "C. a) y b)",
      "D. Recomendación IEEE 802.11 para la codificación de mensajes en el espectro MCS",
    ],
    correctAnswer: "c",
  },

  {
    id: "daypo-modulo-i_q98",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "MIMO 4x4",
    options: [
      "A. Usa 8 antenas Tx, 4 flujos espaciales",
      "B. Usa 4 antenas Tx y 4 antenas Rx, 8 flujos espaciales",
      "C. Usa 4 antenas Tx y 4 antenas Rx, 4 flujos espaciales",
      "D. Usa 8 antenas Tx, 8 flujos espaciales",
    ],
    correctAnswer: "c",
  },

  {
    id: "daypo-modulo-i_q99",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "Con respecto a MIMO",
    options: [
      "A. Cada flujo espacial depende del resto",
      "B. Cada flujo espacial es independiente del resto",
      "C. Usa antenas Tx solamente, y en casos especiales Rx",
      "D. b) y c)",
    ],
    correctAnswer: "b",
  },

  {
    id: "daypo-modulo-i_q100",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "Con respecto OFDM",
    options: [
      "A. La velocidad máxima teórica del símbolo es x(max) = B [simb/s]",
      "B. La velocidad real del símbolo depende de la cantidad de subportadoras de datos, la duración del símbolo y el intervalo entre símbolos",
      "C. La eficiencia entre e=x/xmax es mayor en 802.11a que en 802.11n/ac",
      "D. a) y b)",
    ],
    correctAnswer: "d",
  },

  {
    id: "daypo-modulo-i_q101",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "CSMA/CD",
    options: [
      "A. Envía el mensaje tan pronto como el medio esté libre",
      "B. Debe escuchar el medio para saber si hay alguna colisión",
      "C. CD es posible cuando el medio de transmisión es un cable o inalámbrico",
      "D. a) y b)",
    ],
    correctAnswer: "d",
  },

  {
    id: "daypo-modulo-i_q102",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "El problema del nodo oculto (A B C)",
    options: [
      "A. A envía a B, C envía a B (detecta el entorno como libre, fallando CS), lo que ocasiona una colisión en B que NO es detectada por A, fallando CD. Por lo tanto, A está oculto para C y viceversa",
      "B. B envía a A, C quiere enviar a otro lado, C detecta que el medio está ocupado y espera innecesariamente, haciendo que C esté oculto para A y viceversa",
      "C. Ninguno de los casos anteriores",
      "D. No ocurre el problema del modo oculto con nodos equidistantes",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-i_q103",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "El problema del nodo expuesto (A B C)",
    options: [
      "A. A envía a B, C envía a B (detecta el entorno como libre, fallando CS), lo que ocasiona una colisión en B que NO es detectada por A, fallando CD. Por lo tanto, A está oculto para C y viceversa",
      "B. B envía a A, C quiere enviar a otro lado, C detecta que el medio está ocupado y espera innecesariamente, haciendo que C esté oculto para A y viceversa",
      "C. Ninguno de los casos anteriores",
      "D. No ocurre el problema del modo expuesto con nodos equidistantes",
    ],
    correctAnswer: "b",
  },

  {
    id: "daypo-modulo-i_q104",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "En medios inalámbricos",
    options: [
      "A. La potencia de la señal disminuye logaritmicamente con la distancia",
      "B. El emisor podría aplicar CS y CD, pero las colisiones ocurren en el receptor",
      "C. El emisor podría aplicar CS y CD, pero las colisiones ocurren en el medio",
      "D. a) y b)",
    ],
    correctAnswer: "b",
  },

  {
    id: "daypo-modulo-i_q105",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "En radios half-duplex",
    options: [
      "A. No es posible CD",
      "B. No es posible CS",
      "C. No es posible CD ni CS",
      "D. Es posible CD",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-i_q106",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "Señala el protocolo no incluido en MAC inalámbrico",
    options: [
      "A. CSMA/CA",
      "B. MACA (RTC/CTS/",
      "C. IEEE 802.11 DCF",
      "D. CSMA/CD",
    ],
    correctAnswer: "d",
  },

  {
    id: "daypo-modulo-i_q107",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "CSMA/CA",
    options: [
      "A. Si el canal libre, esperar y enviar",
      "B. Si el canal ocupado, esperar hasta que esté libre y enviar",
      "C. Si el canal ocupado, esperar hasta que esté libre y luego esperar de nuevo un número aleatorio de tiempo",
      "D. b) y c)",
    ],
    correctAnswer: "c",
  },

  {
    id: "daypo-modulo-i_q108",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "El back off de CSMA/CA",
    options: [
      "A. Es el tiempo entre un intervalo [0,CW] que espera antes de enviar el mensaje una vez se ha detectado el medio libre",
      "B. Es el tiempo entre un intervalo [0,CW] que espera antes de enviar el mensaje una vez se ha detectado el medio ocupado",
      "C. Es el tiempo entre un intervalo [0,CW] que espera antes de enviar el mensaje",
      "D. Cuando llega a CW, se transmite el mensaje",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-i_q109",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "CSMA/CA, indique la falsa",
    options: [
      "A. Un CW grande implica grandes intervalos de espera, lo que aumenta el overhead",
      "B. En CSMA/CA “puro” no se detectan las colisiones",
      "C. Un CW grande implica un grande número de colisiones",
      "D. Un CW grande implica pequeños intervalos de espera, lo que disminuyendo el overhead",
    ],
    correctAnswer: "c",
  },

  {
    id: "daypo-modulo-i_q110",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "802.11 DCF",
    options: [
      "A. Usa ACKs para unicast que permite la detección manual de colisiones a nivel físico",
      "B. Usa ACKs para unicast que permite la detección manual de colisiones a nivel virtual",
      "C. Usa ACKs para unicast que permite la detección automático de colisiones a nivel virtual",
      "D. Usa un CSMA/CA puro",
    ],
    correctAnswer: "c",
  },

  {
    id: "daypo-modulo-i_q111",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "MACA",
    options: [
      "A. Si recibe un CTS, puede enviar el paquete",
      "B. Si recibe un RTS, se solicita el acceso",
      "C. Los paquetes de señalización contienen la dirección del emisor y receptor, así como el tamaño de paquete de datos a enviar",
      "D. Todas las opciones",
    ],
    correctAnswer: "d",
  },

  {
    id: "daypo-modulo-i_q112",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    repeated: true,
    question: "MACA, indique la verdadera",
    options: [
      "A. Evita el problema del nodo oculto",
      "B. Evita el problema del nodo expuesto",
      "C. Evita el problema del nodo oculto y del nodo expuesto",
      "D. No evita estos problemas, pero disminuye su aparición",
    ],
    correctAnswer: "c",
  },

  {
    id: "daypo-modulo-i_q113",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    repeated: true,
    question: "MACA, indique la verdadera",
    options: [
      "A. Solo puede existir colisiones RTS en el caso de nodo oculto",
      "B. Solo puede existir colisiones CTS en el caso de nodo oculto",
      "C. Solo puede existir colisiones RTS en el caso de nodo oculto",
      "D. Solo puede existir colisiones CTS en el caso de nodo oculto",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-i_q114",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "IEEE 802.11 DCF, escoja la falsa",
    options: [
      "A. Usa CSMA/CA para broadcast y CSMA/CA + ACK para unicast",
      "B. Usa un método de espera exponencial binario, donde CW se dobla por cada intento de retransmisión y se resetea después de transmitirse",
      "C. Usa RTS/CTS de manera opcional",
      "D. CS se lleva a cabo virtualmente pero NO físicamente",
    ],
    correctAnswer: "d",
  },

  {
    id: "daypo-modulo-i_q115",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "802.11 MAC, escoja la falsa",
    options: [
      "A. Prioriza las tramas a través de distintos espaciados",
      "B. DIFS es el espacio libre entre datos y RTS",
      "C. El slot de tiempo es la diferencia entre el inicio del tiempo de contención y el final del DIFS",
      "D. PIFS es el tiempo de máxima prioridad, usado para los ACK y CTS",
    ],
    correctAnswer: "d",
    explanation:
      "SIFS es el tiempo de máxima prioridad, usado para los ACK y CTS. El PIFS es el punto de coordinación",
  },

  {
    id: "daypo-modulo-i_q116",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "802.11 DCF Unicast, escoja la verdadera",
    options: [
      "A. El ACK se envía justo al final del SIFS sin contención",
      "B. El ACK se envía justo al final del SIFS con contención",
      "C. El CTS se envía justo al final del SIFS con contención",
      "D. El CTS se envía justo al final del SIFS sin contención",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-i_q117",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "802.11 DCF Unicast, escoja la falsa",
    options: [
      "A. Después del ACK, existe un tiempo DIFS antes de la ventana de contención",
      "B. El tiempo de espera es el tiempo entre que se envía un dato y el otro",
      "C. El SIFS es el tiempo entre el ACK y la ventana de contención",
      "D. Los paquetes se retransmiten de manera automática en caso de errores de transmisión",
    ],
    correctAnswer: "c",
  },

  {
    id: "daypo-modulo-i_q118",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "802.11 DCF CSMA/CA con RTS/CTS, escoja la falsa",
    options: [
      "A. RTS/CTS es opcional",
      "B. El threshold es el tamaño del paquete para RTS/CTS",
      "C. NAC es el mecanismo que usa para sensado virtual",
      "D. El threshold es el espacio entre envíos de paquete, condicionado por el tamaño del ACK enviado",
    ],
    correctAnswer: "d",
  },

  {
    id: "daypo-modulo-i_q119",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "NAV, escoja la falsa",
    options: [
      "A. Los paquetes RTC/CTS incluyen el campo duration, indicando la duración de la secuencia de transmisión",
      "B. Cuando se usa fragmentación, los paquetes DATA/ACK, menos los últimos en secuencia, también incluyen el campo Duration",
      "C. El esquema RTS/CTS usa SIFS-only para reservar el medio",
      "D. Las colisiones solamente ocurren fuera de la transmisión de RTS",
    ],
    correctAnswer: "d",
  },

  {
    id: "daypo-modulo-i_q120",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "Ventajas del RTS/CTS en el 802.11 DCF, seleccione la correcta",
    options: [
      "A. Disminuye el intervalo de tiempo que la trama de datos está siendo enviada, lo que reduce la tasa de colisiones",
      "B. Aumenta el intervalo de tiempo que la trama de datos está siendo enviada, lo que reduce la tasa de colisiones",
      "C. Evita la posibilidad de colisiones durante el envío de datos",
      "D. Ninguna de las ventajas especificadas son de RTS/CTS",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-i_q121",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "802.11 DCF Fragmentación, seleccione la falsa",
    options: [
      "A. Se usa para disminuir la probabilidad de tramas erróneas",
      "B. Se usa para reducir el tamaño de las trama",
      "C. Se envían los fragmentos seguidos espaciados por SIFS",
      "D. El fragmento inicial enviado es el que contiene la duración NAV",
    ],
    correctAnswer: "d",
  },

  {
    id: "daypo-modulo-i_q122",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "802.11e, seleccione la falsa",
    options: [
      "A. Soporta QoS",
      "B. Sustituye PCF y DCF con HCF, un modelo híbrido que consiste en HCCA y EDCA",
      "C. Usa múltiples ACK para múltiples grupos de tramas",
      "D. Un nodo puede apropiarse del canal durante un intervalo de tiempo si lo desea, TXOP",
    ],
    correctAnswer: "c",
  },

  {
    id: "daypo-modulo-i_q123",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question: "QoS, escoja la falsa",
    options: [
      "A. Tiene 4 categorías de acceso llamadas ACs",
      "B. Voice Data tiene más prioridad que Video Data",
      "C. Video Data tiene más prioridad que Best Effort",
      "D. Best Effort tiene menos prioridad que Background Data",
    ],
    correctAnswer: "d",
  },

  {
    id: "daypo-modulo-i_q124",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    repeated: true,
    question: "EDCF, escoja la verdadera",
    options: [
      "A. AIFS más corto para paquetes de mayor prioridad",
      "B. SIFS más corto para paquetes de mayor prioridad",
      "C. AIFS más largo para paquetes de mayor prioridad",
      "D. TC más largo para paquetes de mayor prioridad",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-i_q125",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    repeated: true,
    question: "EDCF, escoja la falsa",
    options: [
      "A. Voice tiene mínima latencia",
      "B. Vídeo tiene la máxima velocidad",
      "C. Best Effort tiene la misma prioridad que DCF",
      "D. Background tiene la misma prioridad que DCF",
    ],
    correctAnswer: "d",
  },

  {
    id: "daypo-modulo-i_q126",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    repeated: true,
    question: "EDCF, escoja la verdadera",
    options: [
      "A. El tiempo máximo de espera y de voz y video son el mismo",
      "B. El tiempo máximo de espera y de voz es menor que el de vídeo",
      "C. El tiempo máximo de espera y de vídeo es menor que el de voz",
      "D. Ninguna de las anteriores",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-i_q127",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    repeated: true,
    question: "EDCF, escoja la verdadera",
    options: [
      "A. El tiempo máximo de espera y de voz y video son el mismo",
      "B. El tiempo máximo de espera y de voz es menor que el de vídeo",
      "C. El tiempo máximo de espera y de vídeo es menor que el de voz",
      "D. Ninguna de las opciones",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-i_q128",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    question:
      "Estando el canal ocupado, si un nodo quiere transmitir un paquete de voz y el resto solo paquetes de vídeo, ¿será el paquete de voz el primero en ser transmitido cuando el canal quede libre?",
    options: [
      "A. Depende. Aunque CW(max,voz) < CWmax,vídeo), el número aleatorio que se genera para el paquete de vídeo puede ser menor que para el paquete de voz",
      "B. Sí, porque CW(max,voz) < CW(max,vídeo), el número aleatorio que se genera para el paquete de voz es menor que para el paquete de vídeo",
      "C. No, porque CW(max,voz) < CW(max,vídeo), el número aleatorio que se genera para el paquete de vídeo es menor que para el paquete de voz",
      "D. No, porque CW(max,voz) > CW(max,vídeo), el número aleatorio que se genera para el paquete de vídeo es menor que para el paquete de voz",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-i_q129",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    repeated: true,
    question: "EDCF, escoja la falsa",
    options: [
      "A. Tiene mayor throughput de vídeo",
      "B. Tiene menor throughput de datos",
      "C. No tiene casi ningún dropping de video",
      "D. Tiene el mismo throughput de datos y vídeos",
    ],
    correctAnswer: "d",
  },

  {
    id: "daypo-modulo-i_q130",
    exam: "daypo-modulo-i",
    topic: "modulo-i",
    type: "mc",
    points: 1,
    repeated: true,
    question: "EDCF, escoja la verdadera",
    options: [
      "A. Tiene un retardo y jitter de la voz y vídeo significativamente reducido",
      "B. Tiene un retardo y jitter de la voz significativamente reducido",
      "C. Tiene un retardo y jitter de la voz y vídeo significativamente superior a DCF",
      "D. Tiene un retardo y jitter de la vídeo significativamente reducido",
    ],
    correctAnswer: "d",
  },
  // Total: 109 questions
  {
    id: "daypo-modulo-ii_q1",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "En cuanto a subsistemas de cableado estructurado, tenemos:",
    options: [
      "A. Horizontal, Vertical, Campus, Usuario",
      "B. Par trenzado, Cable de Pares, Fibra óptica",
      "C. Categoría 5e, Categoría 6, Categoría 6A, Categoría 7",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-ii_q2",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question:
      "En cuanto a medios de transmisión de cableado estructurado, tenemos:",
    options: [
      "A. Horizontal, Vertical, Campus, Usuario",
      "B. Par trenzado, Cable de Pares, Fibra óptica",
      "C. Categoría 5e, Categoría 6, Categoría 6A, Categoría 7",
    ],
    correctAnswer: "b",
  },

  {
    id: "daypo-modulo-ii_q3",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    repeated: true,
    question: "Par Trenzado, escoja la falsa",
    options: [
      "A. Formado por dos hilos conductores recubiertos de aislante entrelazados de manera helicoidal",
      "B. Un cable puede tener varios pares trenzados entre sí, siendo habitual tener 4 pares",
      "C. Aunque sea una práctica común, presenta un problema y es el del aumento de la interferencia eléctrica por diafonía",
    ],
    correctAnswer: "c",
    explanation:
      "De hecho lo reduce, y aumenta el aislamiento del ruido exterior.",
  },

  {
    id: "daypo-modulo-ii_q4",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    repeated: true,
    question: "Par Trenzado, escoja la falsa",
    options: [
      "A. Los cables de apantallamiento interno son UTP",
      "B. Los cables con pantalla interna son los FTP",
      "C. Ningún cable puede tener pantalla interna y estar en par trenzado",
    ],
    correctAnswer: "c",
  },

  {
    id: "daypo-modulo-ii_q5",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "PoE, escoja la falsa",
    options: [
      "A. Permite transmisión de corriente eléctrica por el mismo cable que la transmisión de datos",
      "B. Presenta dos secciones internas dentro del cable, una para datos y otra para corriente eléctrica",
      "C. Usan Cat 6A o superior para la disipación térmica",
    ],
    correctAnswer: "b",
  },

  {
    id: "daypo-modulo-ii_q6",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    repeated: true,
    question: "Fibra óptica, escoja la opción verdadera",
    options: [
      "A. El tipo de cable es de cristal, pero nunca de plástico",
      "B. Tiene un gran ancho de banda, de 400 GHz",
      "C. El tipo de señal es digital óptica bidireccional",
    ],
    correctAnswer: "b",
    explanation:
      "La señal digital es unidireccional. Otras cosas de interés es que tiene una S/N excelente, con una atenuación baja, de 1-8 db/km",
  },

  {
    id: "daypo-modulo-ii_q7",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    repeated: true,
    question: "Fibra óptica, escoja la opción verdadera",
    options: [
      "A. La distancia entre repetidores debe ser de 100km monomodo",
      "B. La instalación es relativamente sencilla en la actualidad",
      "C. Se usa para aplicaciones de transmisiones de alta seguridad en cortas distancias",
    ],
    correctAnswer: "a",
    explanation:
      "Pensemos que se usa para movidas de larga distancia y taliscuá",
  },

  {
    id: "daypo-modulo-ii_q8",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question:
      "La diferencia entre la fibra óptica monomodo y la multimodo es que... escoja la falsa",
    options: [
      "A. La monomodo produce una única trayectoria recta para la luz, lo que disminuye la dispersión",
      "B. La multimodo permite varias trayectorias de luz, lo que aumenta la dispersión y pérdida de señal",
      "C. La multimodo suele usarse, debido a su baja pérdida de señal, en contextos de redes LAN",
    ],
    correctAnswer: "c",
    explanation:
      "Ese sería el caso de la monomodo. Pensemos siempre que la monomodo se usa para movidas a largas distancias y la multimodo, como tiene pérdidas, para cortas",
  },

  {
    id: "daypo-modulo-ii_q9",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question:
      "La distancia máxima sin repetidores que viaja un haz de luz en una monomodo es de",
    options: ["A. 100km", "B. 1000km", "C. 10km"],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-ii_q10",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question:
      "La distancia máxima sin repetidores que viajan varios haces de luz en una multimodo es de",
    options: ["A. 550mts - 2km", "B. 2km", "C. 1km"],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-ii_q11",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "La fibra monomodo usa ... para generar el haz de luz",
    options: [
      "A. LED",
      "B. Laser",
      "C. LED o Laser, dependiendo la instalación",
    ],
    correctAnswer: "b",
  },

  {
    id: "daypo-modulo-ii_q12",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "La fibra multimodo usa ... para generar el haz de luz",
    options: [
      "A. LED",
      "B. Laser",
      "C. LED o Laser, dependiendo la instalación",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-ii_q13",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "La arquitectura sobre el cableado estructurado recomendada es",
    options: [
      "A. Topología de árbol o estrella, un rack HDA en cada planta con un rack principal con acceso exterior MDA",
      "B. Topología de bus, un rack HDA en cada planta con un rack principal con acceso exterior MDA",
      "C. Topología de estrella, un rack HDA en la planta de servidores con un rack principal con acceso exterior MDA",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-ii_q14",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question:
      "Para la arquitectura de cableado estructurado, se recomiendan los siguientes subsistemas... señale la opción incorrecta",
    options: [
      "A. Cableado horizontal, HDA hasta puestos de usuario TP",
      "B. Cableado vertical, HDA-MDA",
      "C. Cableado de campus, MDA-HDA",
    ],
    correctAnswer: "c",
    explanation:
      "Ojo, en campus, longitudes grandes. Deben conectar los exteriores, MDA-MDA",
  },

  {
    id: "daypo-modulo-ii_q15",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question:
      "El espacio entre RACKS por donde puede transitar las personas se denominda",
    options: ["A. Pasillo caliente", "B. Pasillo frío", "C. Pasillo caminable"],
    correctAnswer: "b",
    explanation:
      "Pasillo caliente se refiere a la zona entre racks donde existen las conexiones.",
  },

  {
    id: "daypo-modulo-ii_q16",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "Respecto al cableado estructural en un CPD",
    options: [
      "A. MDA - HDA - ZDA - EDA",
      "B. HDA - MDA - ZDA - EDA",
      "C. EDA - MDA - ZDA - HDA",
    ],
    correctAnswer: "a",
    explanation:
      "Para acordarnos. MDA es Main, HDA es Horizontal, ZDA es Zone y EDA es equipment. Un árbol perfecto.",
  },

  {
    id: "daypo-modulo-ii_q17",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "Qué racks son los que se conectarían a HDA y a ZDA?",
    options: [
      "A. Los terminales a HDA, los centrales (no todos) a ZDA",
      "B. Los centrales a HDA, los terminales (no todos) a ZDA",
      "C. Los terminales centrales a HDA, los centrales (no todos) a ZDA",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-ii_q18",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question:
      "En cuanto al modelo de red jerárquico, seleccione la opción verdadera",
    options: [
      "A. Núcleo (Campus), Distribución (Vertical), Acceso (Horizontal)",
      "B. Núcleo (Server), Distribución (Horizontal), Acceso (Vertical)",
      "C. Campus (Server), Distribución (Horizontal), Acceso (Vertical)",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-ii_q19",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question:
      "En los modelos de red corporativa, tenemos... seleccione la incorrecta",
    options: [
      "A. Un área de campus, que tiene un núcleo, distribución, acceso y data center",
      "B. Un área de frontera corporativa dedicada a las comunicaciones",
      "C. Un área de proveedor de servicios, que gestiona el acceso remoto a VPN",
    ],
    correctAnswer: "c",
    explanation:
      "El proveedor de servicios es ISP, mientras que también existe una zona de acceso remoto para VPN",
  },

  {
    id: "daypo-modulo-ii_q20",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    repeated: true,
    question: "La capa de acceso...",
    options: [
      "A. Selecciona al usuario final acceso a internet y está formada por switches de capa 2",
      "B. Proporciona todo el BW al user, además de ofrecer seguridad de puerto MAC y PoE",
      "C. Todas las anteriores",
    ],
    correctAnswer: "c",
  },

  {
    id: "daypo-modulo-ii_q21",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    repeated: true,
    question: "La capa de acceso...",
    options: [
      "A. Selecciona al usuario final acceso a internet y está formada por switches de capa 2",
      "B. Proporciona todo el BW al user, además de ofrecer seguridad de puerto MAC y PoE",
      "C. Todas las respuestas son correctas",
    ],
    correctAnswer: "c",
  },

  {
    id: "daypo-modulo-ii_q22",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "La capa de distribución/agregación... seleccione la incorrecta",
    options: [
      "A. Centraliza la conectividad de red y aisla el nucleo de la capa de acceso",
      "B. Es la capa donde se definen dominios LAN y la seguridad del servidor",
      "C. Balancea la redundancia, enrutamiento entre VLANs y conectividad en ACLs",
    ],
    correctAnswer: "b",
  },

  {
    id: "daypo-modulo-ii_q23",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "La capa de núcleo...",
    options: [
      "A. Es la parte central de la red que conmuta paquetes de datos a alta velocidad, baja tolerancia a fallos y alta disponibilidad",
      "B. Tiene alta latencia porque realiza manipulación de paquetes de CPU",
      "C. Ninguna de las anteriores",
    ],
    correctAnswer: "a",
    explanation:
      "Muy poca latencia! trata datos que tienen que estar ready muy rápido",
  },

  {
    id: "daypo-modulo-ii_q24",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "Los tipos de acceso a una red de almacenamiento son",
    options: [
      "A. DAS, NAS, SAN",
      "B. UTP, TCP, ACK",
      "C. Fibre Channel, FCoE, iSCSI",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-ii_q25",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "Existen dos modos de transferencia fundamentales",
    options: [
      "A. Modo bloque, Modo fichero",
      "B. Modo prioritario, Modo no prioritario",
      "C. Modo NAS, modo DAS",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-ii_q26",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "La transferencia en modo fichero es de tipo",
    options: ["A. NAS", "B. DAS", "C. SAN"],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-ii_q27",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "La transferencia en modo bloque es de tipo",
    options: ["A. NAS", "B. DAS-SAN", "C. SAN"],
    correctAnswer: "b",
  },

  {
    id: "daypo-modulo-ii_q28",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "El acceso modo fichero implica",
    options: [
      "A. Mayores necesidades de proceso y un nivel superior de abstracción",
      "B. Baja latencia",
      "C. Dificultad de implementación con diversos SO",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-ii_q29",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "El acceso modo bloque implica",
    options: [
      "A. Mayor rapidez y menor latencia",
      "B. Menor complejidad de configuración",
      "C. Mayor necesidad de abstracción",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-ii_q30",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "La controladora...",
    options: [
      "A. SO de la cabina con procesadores específicos y memoria caché NVRAM, conectadas en HA mediante DAS o SAN",
      "B. Chasis para alojar discos SATA, SAS, SSD o NVMe, entre otros",
      "C. Ninguna de las anteriores",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-ii_q31",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "La bandeja de discos o enclosures...",
    options: [
      "A. SO de la cabina con procesadores específicos y memoria caché NVRAM, conectadas en HA mediante DAS o SAN",
      "B. Chasis para alojar discos SATA, SAS, SSD o NVMe, entre otros",
      "C. Ninguna de las anteriores",
    ],
    correctAnswer: "b",
  },

  {
    id: "daypo-modulo-ii_q32",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "La agregado...",
    options: [
      "A. Conjunto de discos físicos dentro de las bandejas de discos gestionados por un controlador con el fin de aislar cargas de trabajo",
      "B. Representación lógica del almacenamiento o contenedor de datos, con un sistema de archivos en caso de NAS o un conjunto de LUNs en caso de SAN. Facilita la administración común y el crecimiento dinámico.",
      "C. Conjunto de bloques dentro de un volumen con un identificador único (WWPN) que puede servirse al host por FC o SCSI en formato THIN o THICK.",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-ii_q33",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "La volumen...",
    options: [
      "A. Conjunto de discos físicos dentro de las bandejas de discos gestionados por un controlador con el fin de aislar cargas de trabajo",
      "B. Representación lógica del almacenamiento o contenedor de datos, con un sistema de archivos en caso de NAS o un conjunto de LUNs en caso de SAN. Facilita la administración común y el crecimiento dinámico.",
      "C. Conjunto de bloques dentro de un volumen con un identificador único (WWPN) que puede servirse al host por FC o SCSI en formato THIN o THICK.",
    ],
    correctAnswer: "b",
  },

  {
    id: "daypo-modulo-ii_q34",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "La LUN (Logical Unit Number)...",
    options: [
      "A. Conjunto de discos físicos dentro de las bandejas de discos gestionados por un controlador con el fin de aislar cargas de trabajo",
      "B. Representación lógica del almacenamiento o contenedor de datos, con un sistema de archivos en caso de NAS o un conjunto de LUNs en caso de SAN. Facilita la administración común y el crecimiento dinámico.",
      "C. Conjunto de bloques dentro de un volumen con un identificador único (WWPN) que puede servirse al host por FC o SCSI en formato THIN o THICK.",
    ],
    correctAnswer: "c",
  },

  {
    id: "daypo-modulo-ii_q35",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question:
      "Un disco puede acceder de forma local o discos externos mediante conexiones SAS o SATA. Este tipo de conexión...",
    options: [
      "A. Tipo Bloque y se denomina DAS",
      "B. Tipo Fichero y se denomina SAN",
      "C. Tipo Direct y se denomina NAS",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-ii_q36",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "DAS",
    options: [
      "A. Presenta cuello de botella, no tiene HA y no usa vMotion",
      "B. Menor coste de producción que el resto, gestión sencilla, menor rendimiento que NAS y menor fiablidad",
      "C. Permite varios servidores a la vez",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-ii_q37",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    repeated: true,
    question: "NAS",
    options: [
      "A. Presenta cuello de botella, no tiene HA y no usa vMotion",
      "B. Menor coste de producción que el resto, gestión sencilla, menor rendimiento que NAS y menor fiablidad",
      "C. Permite varios servidores a la vez",
    ],
    correctAnswer: "b",
  },

  {
    id: "daypo-modulo-ii_q38",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    repeated: true,
    question: "SAN",
    options: [
      "A. Presenta cuello de botella, no tiene HA y no usa vMotion",
      "B. Menor coste de producción que el resto, gestión sencilla, menor rendimiento que NAS y menor fiablidad",
      "C. Permite varios servidores a la vez",
    ],
    correctAnswer: "c",
  },

  {
    id: "daypo-modulo-ii_q39",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    repeated: true,
    question: "NAS",
    options: [
      "A. Usa TCP/IP",
      "B. Presenta una conexión dedicada a entornos",
      "C. Todas las opciones son correctas",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-ii_q40",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    repeated: true,
    question: "NAS",
    options: [
      "A. Usa protocolo NFS",
      "B. Usa protocolo IEE802.32",
      "C. Usa protocolo NSS",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-ii_q41",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    repeated: true,
    question: "SAN",
    options: [
      "A. Minimiza el tiempo de respuesta y latencia, con rutas redundantes gracias al HA y presenta zonificación",
      "B. Un host se conecta a SAN mediante conmutadores FC/iSCSI a matrices de almacenamiento",
      "C. Todas las anteriores",
    ],
    correctAnswer: "c",
  },

  {
    id: "daypo-modulo-ii_q42",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "Las interfaces SAN",
    options: [
      "A. Tienen un Host Bus Adaptors, que permite interconectar un servidor a una red SAN",
      "B. Existen de fibra óptica o de cobre",
      "C. Todas las anteriores",
    ],
    correctAnswer: "c",
  },

  {
    id: "daypo-modulo-ii_q43",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question:
      "En cuanto a la arquitectura del canal de fibra, seleccione la falsa",
    options: [
      "A. Soporta operaciones en modo bloque con direccionamiento de 24 bits",
      "B. Disponible de forma bidireccional, de 128 GB",
      "C. Está dividido en 6 niveles fundamentales. FCO, FC1, FC2, FC3, FC4, FC5",
    ],
    correctAnswer: "c",
    explanation: "5 niveles",
  },

  {
    id: "daypo-modulo-ii_q44",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "FCO",
    options: [
      "A. Capa de interfaz física, donde se especifican los tipos de cableado y características de conectores",
      "B. Capa de protocolo de transmisión donde se definen los mecanismos de codificación y acceso al medio",
      "C. Capa de protocolo de señalización, donde se convierten bloques de códigos en tramas, QoS y control de flujo",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-ii_q45",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "FC1",
    options: [
      "A. Capa de interfaz física, donde se especifican los tipos de cableado y características de conectores",
      "B. Capa de protocolo de transmisión donde se definen los mecanismos de codificación y acceso al medio",
      "C. Capa de protocolo de señalización, donde se convierten bloques de códigos en tramas, QoS y control de flujo",
    ],
    correctAnswer: "b",
  },

  {
    id: "daypo-modulo-ii_q46",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "FC3",
    options: [
      "A. Capa de servicios comunes, cifrado y comprensión de datos",
      "B. Capa de mapeo de protocolos, diferentes a fibre channel",
      "C. Capa de protocolo de transmisión, donde se definen mecanismos de codificación y acceso al medio",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-ii_q47",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "FC4",
    options: [
      "A. Capa de servicios comunes, cifrado y comprensión de datos",
      "B. Capa de mapeo de protocolos, diferentes a fibre channel",
      "C. Capa de protocolo de transmisión, donde se definen mecanismos de codificación y acceso al medio",
    ],
    correctAnswer: "b",
  },

  {
    id: "daypo-modulo-ii_q48",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "Topologías de Fibre Channel, seleccione la incorrecta",
    options: [
      "A. FC-P2P, conexión directa entre dos equipos, la forma más segura",
      "B. FC-AL, loop, equipos en un anillo, todos comparten BW pero un fallo puede romper todo el conjunto",
      "C. FC-SW, o fabric, permite a los dispositivos conectarse en bus, lo que permite BW completo a cada uno y protege contra daños",
    ],
    correctAnswer: "c",
    explanation: "Lo hace mediante conmutadores",
  },

  {
    id: "daypo-modulo-ii_q49",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "El zoning",
    options: [
      "A. Permite segmentar los puertos del switch para que se aíslen puertos entre sí formando grupos, garantizando integridad de datos",
      "B. Permite agregar puertos entre sí, para redirigir el tráfico web a un puerto protegido",
      "C. Es una de las técnicas implementadas por algoritmos de tolerancia a fallos",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-ii_q50",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "Trunking",
    options: [
      "A. Agregación de puertos, permitido en FC",
      "B. Agregación de puertos, NO permitido en FC",
      "C. Segmentación de switches, permitido en FC",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-ii_q51",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "FCoE, o Fibre Channel over Ethernet",
    options: [
      "A. Permite la transmisión de protocolo FC sobre redes Ethernet 10GB-100GB",
      "B. Sustituye capas FC0 y FC1",
      "C. Todas las anteriores",
    ],
    correctAnswer: "c",
  },

  {
    id: "daypo-modulo-ii_q52",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "SCSI, Small Computer System Interface, seleccione la incorrecta",
    options: [
      "A. Define cómo transferir datos a nivel de bloque",
      "B. Presenta una topología de anillo, con un iniciador, targets y terminador de anillo",
      "C. El iniciador direcciona unidades lógicas LUN",
    ],
    correctAnswer: "b",
    explanation: "Tipo bus",
  },

  {
    id: "daypo-modulo-ii_q53",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question:
      "iSCSI, IP Small Computer System Interface, seleccione la incorrecta",
    options: [
      "A. Permite al host utilizar un iniciador  para conectarse a nivel de bloque al target",
      "B. Se usa en entornos de almacenamiento corporativo, reemplazando a FC",
      "C. El fallo que tiene es que no permite la migración de discos a través de WAN",
    ],
    correctAnswer: "c",
    explanation: "Sí que lo hace",
  },

  {
    id: "daypo-modulo-ii_q54",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question:
      "SDS, Almacenamiento definido por software, seleccione la incorrecta",
    options: [
      "A. Permite una abstracción de los recursos de almacenamiento local en un solo pool virtual, facilitando el uso de HA, balanceo y seguridad",
      "B. Adapta los requisitos de almacenamiento de forma más granular que LUN de SAN",
      "C. Se puede integrar fácilmente discos locales DAS y SAN, pero con SAN y recursos Cloud este protocolo no es el más óptimo",
    ],
    correctAnswer: "c",
  },

  {
    id: "daypo-modulo-ii_q55",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "El almacenamiento basado en objetos...",
    options: [
      "A. Los datos se almacenan en objetos, que se dividen en chunks y se distribuyen en discos virtuales con sus metadatos",
      "B. Permite la localización de réplicas de los segmentos del objeto a través del datastore",
      "C. Lo default es que cada objeto se administra de forma grupal, lo que incluye una configuración RAID específica para cada grupo de objetos",
    ],
    correctAnswer: "c",
    explanation:
      "Se administran de manera individual, aunque las directivas puedan actualizarse en cualquier momento al ser dinámicas",
  },

  {
    id: "daypo-modulo-ii_q56",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question:
      "En cuanto al aprovisonamiento de la virtualización de almacenamiento, existen distintos Tier de protección. Indique la opción falsa",
    options: [
      "A. Tier 1, de alto rendimiento (RAID 10 y SAS) para máquinas exigentes",
      "B. Tier 2, rendimiento medio en RAID 5 y SAS",
      "C. Tier 3, de alto rendimiento (RAID 10 y SAS) para máquinas exigentes",
    ],
    correctAnswer: "c",
    explanation: "Tier 3 es el de bajo rendimiento, RAID5 y SATA",
  },

  {
    id: "daypo-modulo-ii_q57",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "Los discos SAS o SATA son",
    options: ["A. All-flash", "B. Híbridos", "C. Sólidos"],
    correctAnswer: "b",
  },

  {
    id: "daypo-modulo-ii_q58",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question:
      "En cuanto al cluster de almacenamiento, seleccione la incorrecta",
    options: [
      "A. La agrupación de host con sus grupos de discos",
      "B. Cada cluster de almacenamiento se comporta como un único almacén de datos",
      "C. El sistema de almacenamiento no puede ofrecer funcionalidades o servicios, será ofrecido por un driver",
    ],
    correctAnswer: "c",
  },

  {
    id: "daypo-modulo-ii_q59",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "Los dominios de fallo",
    options: [
      "A. El testigo almacena metadatos y permite el desempate en caso de fallos",
      "B. Son habitualmente rack, fila, CPD",
      "C. La accesibilidad de un objeto debe ser superior al 75% para poder ser usado",
    ],
    correctAnswer: "c",
    explanation: "50%",
  },

  {
    id: "daypo-modulo-ii_q60",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question:
      "Seleccione la opción incorrecta respecto a los clústeres extendidos entre dos localizaciones",
    options: [
      "A. Es posible una configuración de dos sitios replicados ACTIVO/ACTIVO, pero necesitan de un nodo testigo con metadatos",
      "B. Es necesaria una conexión con gran BW y baja latencia entre los sitios replicados ACTIVO/ACTIVO y entre ellos la conexión con el nodo testigo con baja latencia",
      "C. Cada objeto tiene una copia en ambos sitios replicados, así como metadatos en el testigo. Los tres sitios estarán en el mismo dominio de fallos",
    ],
    correctAnswer: "c",
    explanation:
      "Cada uno estará en uno distinto, no por estar replicados ahora son la misma cocacola del desierto pero yo te digo tu te crees la última cocacola del desierto pero más allá hay un jugo de naranja que me va a hacer mejor a mí que una coca cola oiste pue",
  },

  {
    id: "daypo-modulo-ii_q61",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "En caso de disaster recovery, escoger la falsa",
    options: [
      "A. RPO, Recovery Point Objective, volumen de datos en riesgo de pérdida que asume la organización. Mayor frecuencia, menor pérdida",
      "B. RTO, Recovery Time Objective, tiempo entre que transcurre un desastre y se recupera el sistema",
      "C. Los sistemas esenciales deben tener un RPO < 15 minutos, mientras que los sistemas esenciales menor que 2 horas",
    ],
    correctAnswer: "c",
    explanation: "Sistemas esenciales, máxima prioridad, RTO<15 mins",
  },

  {
    id: "daypo-modulo-ii_q62",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "La virtualización de red, seleccione la falsa",
    options: [
      "A. Optimiza los recursos hardware, con equipamiento menos costoso",
      "B. Ha supuesto una explosión del número de elementos a conectar y de la complejidad de conexiones",
      "C. Se nutre de tecnologías previas para el despliegue de red en forma inmediata",
    ],
    correctAnswer: "c",
  },

  {
    id: "daypo-modulo-ii_q63",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question:
      "Estos son los modelos complementarios a la virtualización de red",
    options: ["A. NFV, SDN", "B. NFV", "C. Ninguna de las anteriores"],
    correctAnswer: "a",
    explanation:
      "NFV es Virtualización de Funciones de Red. Virtualiza servicios de red como firewalls, enrutadores y balanceadores, entre otros. Se ejecuta a nivel de hardware",
  },

  {
    id: "daypo-modulo-ii_q64",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "SDN",
    options: [
      "A. Tienen como objetivo simplificar la creación y administración de redes, separando el control de los datos, abstrayéndolos",
      "B. Es el protocolo convencional de networking, es un sistema de conexión cableada y conmutada",
      "C. Ninguna de las anteriores",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-ii_q65",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question:
      "Si queremos usar un complemento a la virtualización de red para un Data Center, usaríamos",
    options: ["A. SDN", "B. NFV", "C. Ninguna de las anteriores"],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-ii_q66",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "SDN, seleccione la falsa",
    options: [
      "A. El controlador tiene 3 API. Northbound API, Eastbound API y Southbound API",
      "B. Northbound API ofrece servicios para implementar la capa lógica de negocio sobre la red",
      "C. Southbound API permite la conexión con equipos de red para cambios en tiempo real de tráfico, generalmente basado en openFlow",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-ii_q67",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question:
      "Con respecto a las características principales de SDN, seleccione la falsa",
    options: [
      "A. Conmutación, Enrutamiento, Balanceo de Carga, VRF",
      "B. Firewall distribuido, microsegmentación, integración y convivencia de redes tradicionales",
      "C. Ninguna de las opciones son falsas",
    ],
    correctAnswer: "c",
  },

  {
    id: "daypo-modulo-ii_q68",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "SDN, escoja la falsa",
    options: [
      "A. Tiene alta flexibilidad en cuanto al despliegue de servicios, y ofrece una ampliación de la vida útil de equipos",
      "B. Presenta una gran innovación para la creación de nuevos tipos de protocolos, con una configuración y gestión de redes sencilla",
      "C. Independencia del controlador para escalado y seguridad",
    ],
    correctAnswer: "c",
    explanation: "Obviamente depende del controlador, es el pivote",
  },

  {
    id: "daypo-modulo-ii_q69",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "Cuales de estos NO es un controlador de OSINT",
    options: ["A. OpenDaylight", "B. ONOS", "C. OpenVPN"],
    correctAnswer: "c",
  },

  {
    id: "daypo-modulo-ii_q70",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "TCAM, seleccione la incorrecta",
    options: [
      "A. Aumenta la velocidad de búsqueda de rutas, clasificación de paquetes y reenvío de ACLs",
      "B. Se diferencia con las RAM en que pueden recuperar datos en función del contenido, no de la dirección en la que se encuentra",
      "C. La lógica de control y servicios del controlador no hacen uso del TCAM para las reglas y acciones a implementar",
    ],
    correctAnswer: "c",
  },

  {
    id: "daypo-modulo-ii_q71",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "OpenFlow, seleccione la incorrecta",
    options: [
      "A. Protocolo de SDN que permite la programación remota del plano de control.",
      "B. Permite añadir funciones de red virtualizadas NFV",
      "C. Es un protocolo cerrado que permite gestionar el tráfico web por el switch según el modelo SSL",
    ],
    correctAnswer: "c",
    explanation:
      "OpenFlow es un protocolo abierto que permite gestionar las tablas de flujos de switch y routers multipropietario.",
  },

  {
    id: "daypo-modulo-ii_q72",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "Openflow",
    options: [
      "A. El procesamiento pipeline permite evaluar los paquetes en tablas y ejecutar múltiples acciones en distintos vSwitch",
      "B. Se realizan acciones de envío y procesamiento de paquete, encargándose el protocolo MAC del reenvío y encapsulado",
      "C. Las reglas solamente tienen en cuenta el puerto de entrada, IP ports y ethernet address, lo cual lo hace un protocolo liviano",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-ii_q73",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "OVS, OpenVSwitch, seleccione la incorrecta",
    options: [
      "A. Proporciona un switch de software con funcionalidades avanzadas que puede ser controlado por openflow",
      "B. Permite reenviar tráfico entre diferentes VMs y con la red física",
      "C. Permite reenviar el tráfico entre diferentes VMs pero no con la red física",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-ii_q74",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "NFV, Network Functions Virtualization",
    options: [
      "A. Servicios virtualizados",
      "B. Máquinas virtuales",
      "C. NO están asociados a la infraestructura VM",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-ii_q75",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "SFC, seleccione la falsa",
    options: [
      "A. Cadena de servicios complejos. Se encadenan múltiples NFVs en un orden específico para un determinado tráfico",
      "B. Simplifican el despliegue, la escalabilidad y reduce CAPEX y OPEX",
      "C. Tiene un ROI (Retorno de la Inversión) más lento debido al número de SFC",
    ],
    correctAnswer: "c",
  },

  {
    id: "daypo-modulo-ii_q76",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "Qué elemento NO es un NFV",
    options: ["A. Cisco One", "B. HP", "C. AWS"],
    correctAnswer: "c",
  },

  {
    id: "daypo-modulo-ii_q77",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "OpenNebula, seleccione la incorrecta",
    options: [
      "A. Es un IaaS",
      "B. Tiene un sistema de administración centralizada.",
      "C. El nivel de seguridad que usa solo es ACLs y Zonas",
    ],
    correctAnswer: "c",
    explanation: "Usa esos + VDC y Federaciones. Es tocho",
  },

  {
    id: "daypo-modulo-ii_q78",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "El modelo jerárquico de una CPD, seleccione el incorrecto",
    options: [
      "A. La responsabilidad es vertical (empleado -> manager...), comunicación directa",
      "B. Permite áreas de responsabilidad",
      "C. El modelo organizacional usado por las grandes empresas",
    ],
    correctAnswer: "c",
    explanation: "Usado por PYMES, no es un modelo complejo",
  },

  {
    id: "daypo-modulo-ii_q79",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    repeated: true,
    question: "El modelo funcional de una CPD, escoja la incorrecta",
    options: [
      "A. La actividad de la empresa se divide en funciones",
      "B. El supervisor ampara varios sectores",
      "C. Es el modelo organizacional de las multinacionales",
    ],
    correctAnswer: "b",
    explanation: "El supervisor trabaja exclusivamente en su especialidad",
  },

  {
    id: "daypo-modulo-ii_q80",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    repeated: true,
    question: "El modelo funcional de una CPD, escoja la incorrecta",
    options: [
      "A. Cada empleado tiene más de un supervisor -> confusión",
      "B. Es más dificil de coordinar debido al número de áreas",
      "C. Al haber tanta especialización, mejora la referencia del concepto general de la organización",
    ],
    correctAnswer: "c",
  },

  {
    id: "daypo-modulo-ii_q81",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    repeated: true,
    question: "El modelo mixto de una CPD, escoja la incorrecta",
    options: [
      "A. Cada empleado tiene varios supervisores según la especialización",
      "B. Fomenta la especialización funcional",
      "C. Usa un gabinete de asesoramiento que se usa solamente si es necesario",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-ii_q82",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    repeated: true,
    question: "El modelo mixto de una CPD, escoja la incorrecta",
    options: [
      "A. La toma de decisiones se ralentiza debido a la consulta de asesores",
      "B. El staff no interfiere en las cuestiones de control administrativo",
      "C. El empleo de gabinetes incrementa los costes",
    ],
    correctAnswer: "b",
  },

  {
    id: "daypo-modulo-ii_q83",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    repeated: true,
    question: "El modelo colegial de una CPD, escoja la incorrecta",
    options: [
      "A. Es más fácil coordinar cualquier nivel de la estructura",
      "B. Es más lento en la toma de decisiones",
      "C. Es el medio usado en los colegios",
    ],
    correctAnswer: "c",
  },

  {
    id: "daypo-modulo-ii_q84",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    repeated: true,
    question: "El modelo colegial de una CPD, escoja la incorrecta",
    options: [
      "A. La efectividad de los comités se dificulta por el número de componentes",
      "B. Posibilita la adopción de acuerdos en los criterios respecto a los planes de acción y objetivos organizacionales",
      "C. La adopción colegiada facilita la toma de decisiones y la iniciativa",
    ],
    correctAnswer: "c",
  },

  {
    id: "daypo-modulo-ii_q85",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    repeated: true,
    question: "El modelo matricial de una CPD, escoja la incorrecta",
    options: [
      "A. La asistencia técnica está garantizada por la dirección funcional",
      "B. Se crea una cadena dual de mando",
      "C. Sencillez para definir los criterios para clasificar las divisiones",
    ],
    correctAnswer: "c",
  },

  {
    id: "daypo-modulo-ii_q86",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    repeated: true,
    question: "El modelo matricial de una CPD, escoja la incorrecta",
    options: [
      "A. Permite reagrupación dinámica del personal",
      "B. Combina ventajas de la descentralización y de la especialización",
      "C. Es preferido por los profesionales cambiar dinámicamente de supervisor que tener una dirección funcional fija",
    ],
    correctAnswer: "c",
  },

  {
    id: "daypo-modulo-ii_q87",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "CDP centralizado puede ser... escoja el incorrecto",
    options: [
      "A. Dependiente de dirección, que gestiona los servicios prestados por la a través de la dirección",
      "B. Dependiente de un departamento, que gestiona los servicios prestados por la a través del departamento que lo gestiona",
      "C. Independiente, que no presenta ninguna estructura rígida, sino dinámica",
    ],
    correctAnswer: "c",
  },

  {
    id: "daypo-modulo-ii_q88",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "¿Y entonces cual es la ubicación más adecuada para el CPD?",
    options: [
      "A. Staff, que dependa de la dirección general",
      "B. Director de producción, que dependa de la dirección general",
      "C. Como gestor de sistemas, que dependa de la dirección general",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-ii_q89",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "El organigrama funcional del CPD",
    options: [
      "A. El CPD se estructura en tantos departamentos como fases engloba un sistema de información",
      "B. El CPD se estructura por proyectos, de forma que en cada momento se organizan los equipos",
      "C. El CPD se estructura basándose en el esquema de organización funcional sobre el que superpone la organización por proyectos cuando sea necesarias",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-ii_q90",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "El organigrama por proyectos del CPD",
    options: [
      "A. El CPD se estructura en tantos departamentos como fases engloba un sistema de información",
      "B. El CPD se estructura por proyectos, de forma que en cada momento se organizan los equipos",
      "C. El CPD se estructura basándose en el esquema de organización funcional sobre el que superpone la organización por proyectos cuando sea necesarias",
    ],
    correctAnswer: "b",
  },

  {
    id: "daypo-modulo-ii_q91",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "El organigrama mixto del CPD",
    options: [
      "A. El CPD se estructura en tantos departamentos como fases engloba un sistema de información",
      "B. El CPD se estructura por proyectos, de forma que en cada momento se organizan los equipos",
      "C. El CPD se estructura basándose en el esquema de organización funcional sobre el que superpone la organización por proyectos cuando sea necesarias",
    ],
    correctAnswer: "c",
  },

  {
    id: "daypo-modulo-ii_q92",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "ITIL",
    options: [
      "A. Biblioteca de infraestructura de TIC",
      "B. Guía completa disponible para la gestión de servicios de TIC",
      "C. a) y b)",
    ],
    correctAnswer: "c",
  },

  {
    id: "daypo-modulo-ii_q93",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "El éxito de ITIl se debe también a.... escoja la incorrecta",
    options: [
      "A. VENDOR-NEUTRAL. No se basa en una plataforma particular o en un tipo de industria, sino en procesos",
      "B. NON-PRESCRIPTIVE. Se puede adaptar a todos los tamaños de proveedores",
      "C. BEST-DEFENCE. Permite incluir servicios verificados como seguros a nivel de infraestructura",
    ],
    correctAnswer: "c",
    explanation:
      "El que falta es BEST-PRACTICA. Representa las experiencias de aprendizaje y tendencias de los mejores proveedores de servicios del mundo",
  },

  {
    id: "daypo-modulo-ii_q94",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "El Cabinet Office",
    options: [
      "A. Colabora con el Grupo APM y el TSO",
      "B. Mantiene la propiedad intelectual relativas a ITIL",
      "C. a) y b)",
    ],
    correctAnswer: "c",
  },

  {
    id: "daypo-modulo-ii_q95",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "Con respecto a ITIL, un Servicio TI",
    options: [
      "A. Se divide en Supporting Services y Customer-Facing",
      "B. El servicio de soporte no se utiliza directamente en el negocio",
      "C. a) y b)",
    ],
    correctAnswer: "c",
  },

  {
    id: "daypo-modulo-ii_q96",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "Los servicios visibles por el cliente",
    options: [
      "A. Se divide en cliente interno (proceso de negocio o unidad de organización) y cliente externo (el servicio proporcionado hacia afuera)",
      "B. Proporcionan los resultados básicos que desea el cliente, el valor que éste busca y por el que está dispuesto a pagar",
      "C. a) y b)",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-ii_q97",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "Los servicios Core por el cliente",
    options: [
      "A. Pertenecen a los servicios TI",
      "B. Proporcionan los resultados básicos que desea el cliente, el valor que éste busca y por el que está dispuesto a pagar",
      "C. a) y b)",
    ],
    correctAnswer: "c",
  },

  {
    id: "daypo-modulo-ii_q98",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "Los servicios Enabling por el cliente",
    options: [
      "A. Son necesarios para prestar servicios core. Pueden ser visibles o no para el cliente pero no son servicios que se le",
      "B. No son esenciales para prestar",
      "C. a) y b)",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-ii_q99",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "Los servicios Enhancing por el cliente",
    options: [
      "A. Proporcionan los resultados básicos que",
      "B. No son esenciales para prestar",
      "C. a) y b)",
    ],
    correctAnswer: "b",
  },

  {
    id: "daypo-modulo-ii_q100",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "El servicio Wifi de una habitación de hotel es un",
    options: [
      "A. SE (Servicio Cliente Externo)",
      "B. SS (Servicio de Soporte)",
      "C. SI (Servicio Cliente Interno)",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-ii_q101",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question:
      "Servicio de backup de datos de una empresa de fabricación de automóviles",
    options: [
      "A. SE (Servicio Cliente Externo)",
      "B. SS (Servicio de Soporte)",
      "C. SI (Servicio Cliente Interno)",
    ],
    correctAnswer: "b",
  },

  {
    id: "daypo-modulo-ii_q102",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question:
      "Servicio de compra a través de Internet de unos grandes almacenes",
    options: [
      "A. SE (Servicio Cliente Externo)",
      "B. SS (Servicio de Soporte)",
      "C. SI (Servicio Cliente Interno)",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-ii_q103",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question:
      "Servicio de desarrollo del software de gestión de tickets/facturas de una cadena de restaurantes",
    options: [
      "A. SE (Servicio Cliente Externo)",
      "B. SS (Servicio de Soporte)",
      "C. SI (Servicio Cliente Interno)",
    ],
    correctAnswer: "c",
  },

  {
    id: "daypo-modulo-ii_q104",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question:
      "Servicio de impresión de planos para los alumnos de una Escuela Universitaria",
    options: [
      "A. SE (Servicio Cliente Externo)",
      "B. SS (Servicio de Soporte)",
      "C. SI (Servicio Cliente Interno)",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-ii_q105",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "Seleccione la opción incorrecta",
    options: [
      "A. La virtualización es más lenta que la emulación",
      "B. La emulación es más lenta que la virtualización",
      "C. El acceso remoto a una máquina provee una interfaz remota sobre la red",
    ],
    correctAnswer: "a",
  },

  {
    id: "daypo-modulo-ii_q106",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question:
      "Seleccione la opción incorrecta con respecto a la virtualización",
    options: [
      "A. La virtualización permite consolidar múltiples servidores separados en VMs en una única máquina",
      "B. Convierte el hardware a software",
      "C. Es más complejo de modificar que si no tuviésemos la capa extra de software VM",
    ],
    correctAnswer: "c",
  },

  {
    id: "daypo-modulo-ii_q107",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "El hypervisor, escoja la incorrecta",
    options: [
      "A. Es el que implementa y gestiona el software de virtualización",
      "B. Los hypervisores de tipo 2 son ideales para soluciones para servidores",
      "C. Los hypervisores de tipo 1 completamente reemplaza el SO en la máquina física",
    ],
    correctAnswer: "b",
    explanation: "NO son ideales",
  },

  {
    id: "daypo-modulo-ii_q108",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "En cuanto a la virtualización, escoja la incorrecta",
    options: [
      "A. En un entorno físico, el SO asume el control de todas las CPU físicas del sistema",
      "B. La virtualización de la CPU enfatiza la eficiencia y corre directamente en las CPU físicas disponibles",
      "C. No se puede virtualizar una CPU",
    ],
    correctAnswer: "c",
  },

  {
    id: "daypo-modulo-ii_q109",
    exam: "daypo-modulo-ii",
    topic: "modulo-ii",
    type: "mc",
    points: 1,
    question: "En cuanto a la RAM, escoja la incorrecta",
    options: [
      "A. El hypervisor puede asignar memoria RAM física de manera inteligente",
      "B. La RAM está diseñada para tareas de read and write",
      "C. La optimización viene de usar una máquina virtual encima del hardware físico de la RAM, denominado memoria virtual",
    ],
    correctAnswer: "c",
  },
  {
    id: "2024-07_q1",
    exam: "2024-07",
    topic: "modulo-ii",
    type: "mc",
    points: 0.5,
    question:
      "¿Cuál es la distancia máxima recomendada para un enlace de fibra óptica monomodo?",
    options: ["A. 500 metros", "B. 50 kilómetros", "C. 2 kilómetros"],
    correctAnswer: "b",
    explanation:
      "La fibra monomodo está diseñada para largas distancias. Sin repetidores puede alcanzar 50-100 km.",
  },
  {
    id: "2024-07_q2",
    exam: "2024-07",
    topic: "modulo-ii",
    type: "mc",
    points: 0.5,
    question: "¿Cuál es el principal beneficio de una SAN sobre una NAS?",
    options: [
      "A. Mayor facilidad de instalación",
      "B. Mayor rendimiento y escalabilidad",
      "C. Mayor compatibilidad con redes TCP/IP",
    ],
    correctAnswer: "b",
    explanation:
      "SAN ofrece acceso a nivel de bloque con mayor rendimiento y escalabilidad que NAS (acceso a nivel de fichero).",
  },
  {
    id: "2024-07_q3",
    exam: "2024-07",
    topic: "modulo-ii",
    type: "mc",
    points: 0.5,
    question:
      "En una red SAN, ¿qué protocolo se utiliza comúnmente para la transferencia de datos?",
    options: ["A. FTP", "B. HTTP", "C. Fibre Channel"],
    correctAnswer: "c",
    explanation:
      "Fibre Channel es el protocolo estándar para SAN, proporcionando acceso a nivel de bloque con alta velocidad.",
  },
  {
    id: "2024-07_q4",
    exam: "2024-07",
    topic: "modulo-ii",
    type: "mc",
    points: 0.5,
    question:
      "¿Cuál es una característica clave de las redes definidas por software (SDN)?",
    options: [
      "A. La dependencia de hardware propietario",
      "B. La separación del plano de control y el plano de datos",
      "C. La falta de flexibilidad en la gestión de la red",
    ],
    correctAnswer: "b",
    explanation:
      "SDN separa el plano de control (controlador) del plano de datos (switches), permitiendo programabilidad centralizada.",
  },
  {
    id: "2024-07_q5",
    exam: "2024-07",
    topic: "modulo-ii",
    type: "mc",
    points: 0.5,
    question:
      "¿Qué componente de una SDN se encarga de tomar decisiones sobre el flujo de tráfico?",
    options: ["A. El controlador SDN", "B. El switch SDN", "C. El firewall"],
    correctAnswer: "a",
    explanation:
      "El controlador SDN es el cerebro que decide las rutas y políticas de tráfico, comunicándose con los switches vía OpenFlow.",
  },
  {
    id: "2024-07_q6",
    exam: "2024-07",
    topic: "modulo-ii",
    type: "mc",
    points: 0.5,
    question:
      "¿Cuál es la ventaja de utilizar cableado estructurado en una red corporativa?",
    options: [
      "A. Menor costo de instalación",
      "B. Facilidad de gestión y escalabilidad",
      "C. Mayor velocidad de conexión",
    ],
    correctAnswer: "b",
    explanation:
      "El cableado estructurado facilita la gestión, mantenimiento y escalabilidad de la red mediante una organización jerárquica (MDA-HDA-ZDA-EDA).",
  },
  {
    id: "2024-07_q7",
    exam: "2024-07",
    topic: "modulo-ii",
    type: "mc",
    points: 0.5,
    question:
      "¿Qué tipo de almacenamiento es típicamente utilizado en una SAN?",
    options: [
      "A. Almacenamiento en bloques",
      "B. Almacenamiento en archivos",
      "C. Almacenamiento en objetos",
    ],
    correctAnswer: "a",
    explanation:
      "SAN trabaja a nivel de bloque (Block I/O), a diferencia de NAS que trabaja a nivel de fichero.",
  },
  {
    id: "2024-07_q8",
    exam: "2024-07",
    topic: "modulo-ii",
    type: "mc",
    points: 0.5,
    question:
      "¿Cuál es uno de los desafíos de implementar SDN en una red existente?",
    options: [
      "A. Compatibilidad con el hardware existente",
      "B. Mayor costo de implementación",
      "C. Falta de personal capacitado",
    ],
    correctAnswer: "a",
    explanation:
      "La compatibilidad con hardware existente es un desafío clave, ya que SDN requiere switches que soporten OpenFlow.",
  },
  {
    id: "2024-07_q9",
    exam: "2024-07",
    topic: "modulo-ii",
    type: "mc",
    points: 0.5,
    question: "¿Qué ventaja ofrece SDN en la gestión de la red?",
    options: [
      "A. Mayor dependencia de hardware específico",
      "B. Capacidad para automatizar configuraciones de red",
      "C. Reducción de la seguridad en la red",
    ],
    correctAnswer: "b",
    explanation:
      "SDN permite automatizar configuraciones y políticas de red desde un controlador centralizado.",
  },
  {
    id: "2024-07_q10",
    exam: "2024-07",
    topic: "modulo-ii",
    type: "mc",
    points: 0.5,
    question:
      "¿Cuál es la función principal de un patch panel en un sistema de cableado estructurado?",
    options: [
      "A. Actuar como un switch de red",
      "B. Facilitar la organización y gestión de cables",
      "C. Proporcionar conectividad inalámbrica",
    ],
    correctAnswer: "b",
    explanation:
      "El patch panel organiza y centraliza las conexiones de cableado, facilitando cambios y gestión.",
  },
  {
    id: "2024-07_q11",
    exam: "2024-07",
    topic: "modulo-ii",
    type: "mc",
    points: 0.5,
    question:
      "En relación al CPD, indica cuál de las siguientes afirmaciones es correcta:",
    options: [
      "A. En el organigrama funcional o departamental de un CPD, éste se estructura por proyectos, de forma que en cada momento se organizan los equipos, las funciones y el personal en función de los distintos proyectos activos, enfocados a un área concreta de la organización.",
      "B. Entre otras tareas, el director del CPD es el encargado de proponer estrategias y políticas de proceso de datos así como establecer políticas de personal específicas de su departamento.",
      "C. Ninguna de las respuestas anteriores es correcta.",
    ],
    correctAnswer: "b",
    explanation:
      "El director del CPD propone estrategias y políticas. El organigrama funcional se estructura por departamentos/funciones, no por proyectos (eso es el organigrama por proyectos).",
  },
  {
    id: "2024-07_q12",
    exam: "2024-07",
    topic: "modulo-ii",
    type: "mc",
    points: 0.5,
    repeated: true,
    question: "En el estándar ITIL, es falso que:",
    options: [
      "A. El núcleo central de la Gestión de Servicios TI es la transformación de recursos en servicios con valor, explotando para ello las capacidades de la organización.",
      "B. Es mucho más complejo adquirir recursos en comparación con capacidades, debido a que éstos tienen un coste superior a las mismas.",
      "C. Los servicios Core son servicios que proporcionan los resultados básicos que desea el cliente, el valor que éste busca y por el que está dispuesto a pagar.",
    ],
    correctAnswer: "b",
    explanation:
      "Es FALSO que sea más complejo adquirir recursos: los recursos son más fáciles de adquirir que las capacidades, que se desarrollan con el tiempo.",
  },
  {
    id: "2024-07_q13",
    exam: "2024-07",
    topic: "modulo-ii",
    type: "mc",
    points: 0.5,
    repeated: true,
    question: "En el estándar ITIL, es falso que:",
    options: [
      "A. Una función es un equipo o grupo de personas que junto con las herramientas y otros recursos llevan a cabo uno o más procesos o actividades.",
      "B. Un cliente externo trabaja en la misma organización que el proveedor TI. Su pago se registra como una transacción interna y nunca es un ingreso real.",
      "C. La garantía es la funcionalidad que ofrece un producto o servicio para satisfacer una necesidad particular.",
    ],
    correctAnswer: "b",
    explanation:
      "Un cliente externo NO trabaja en la misma organización. Esa descripción corresponde a un cliente interno. La funcionalidad es la utilidad, no la garantía.",
  },
  {
    id: "2024-07_q14",
    exam: "2024-07",
    topic: "modulo-ii",
    type: "mc",
    points: 0.5,
    repeated: true,
    question: "En el estándar ITIL, es falso que:",
    options: [
      "A. El valor de un servicio puede considerarse como el nivel o grado en que éste cumple las expectativas de los clientes.",
      "B. Los recursos se consideran los activos intangibles de una organización.",
      "C. Un servicio al cliente interno es un servicio IT que apoya directamente a un proceso de negocio gestionado por otro departamento o unidad de la organización.",
    ],
    correctAnswer: "b",
    explanation:
      "Los recursos son activos TANGIBLES (hardware, software, personal). Las capacidades son los activos intangibles (conocimiento, experiencia).",
  },
  {
    id: "2024-07_q15",
    exam: "2024-07",
    topic: "modulo-ii",
    type: "mc",
    points: 0.5,
    question: "¿Qué tipo de hipervisor es el sistema operativo Vmware ESXi?",
    options: [
      "A. Hipervisor tipo 1",
      "B. Hipervisor tipo 2",
      "C. No es un hipervisor",
    ],
    correctAnswer: "a",
    explanation:
      "VMware ESXi es un hipervisor tipo 1 (bare-metal), que se ejecuta directamente sobre el hardware sin necesidad de un SO intermedio.",
  },
  {
    id: "2024-07_q16",
    exam: "2024-07",
    topic: "modulo-ii",
    type: "mc",
    points: 0.5,
    question:
      "¿Cuál de las siguientes no es una técnica de liberación de memoria?",
    options: [
      "A. Compresión de memoria",
      "B. Compartición transparente de páginas (TPS)",
      "C. Descarte aleatorio de páginas de memoria",
    ],
    correctAnswer: "c",
    explanation:
      "El descarte aleatorio de páginas no es una técnica real de VMware. Las técnicas son: TPS, compresión de memoria y ballooning.",
  },
  {
    id: "2024-07_q17",
    exam: "2024-07",
    topic: "modulo-ii",
    type: "mc",
    points: 0.5,
    question: "¿Cuál de las siguientes afirmaciones es verdadera?",
    options: [
      "A. Si queremos conseguir que una máquina virtual no tenga caída de servicio (Zero downtime) ante la caída física del nodo ESXi en el que se está ejecutando debemos configurar la máquina en Fault Tolerance.",
      "B. Con la alta disponibilidad en VMware (HA) nunca vamos a perder el servicio que se presta a través de una máquina virtual, incluso aunque se rompa el host ESXi.",
      "C. Si una máquina virtual está configurada con alta disponibilidad en VMware (HA) está siendo ejecutada en dos nodos de virtualización simultáneamente.",
    ],
    correctAnswer: "a",
    explanation:
      "Fault Tolerance (FT) mantiene una copia exacta en otro host para zero downtime. HA reinicia la VM (hay caída). HA no ejecuta en dos nodos simultáneamente (eso es FT).",
  },
  {
    id: "2024-07_q18",
    exam: "2024-07",
    topic: "modulo-ii",
    type: "mc",
    points: 0.5,
    question:
      "Si realizamos un snapshot (foto de estado) de una máquina virtual, ¿afectamos al rendimiento de la misma?",
    options: [
      "A. No, simplemente guardamos su estado por si queremos volver a ese punto.",
      "B. Sí, ya que es necesario incurrir en alguna penalización debido a las lecturas y escrituras extra.",
      "C. Depende, de si guardamos la memoria o no. Si guardamos la memoria sí que afectamos al performance, pero si no la guardamos entonces no afectamos.",
    ],
    correctAnswer: "b",
    explanation:
      "Los snapshots siempre afectan al rendimiento por el I/O extra que generan, independientemente de si se guarda la memoria o no.",
  },
  {
    id: "2024-07_q19",
    exam: "2024-07",
    topic: "modulo-ii",
    type: "mc",
    points: 0.5,
    question:
      "Si tenemos un host de virtualización ESXi con 8 GB de RAM, ¿cuál de las siguientes configuraciones de máquinas virtuales no podríamos tener?",
    options: [
      "A. 4 máquinas virtuales, cada una de ellas configurada con 2 GB de RAM.",
      "B. 3 máquinas virtuales, 2 de ellas configuradas con 4 GB de RAM y la otra con 2 GB de RAM.",
      "C. 1 máquina virtual configurada con 10 GB de RAM.",
    ],
    correctAnswer: "c",
    explanation:
      "No se puede asignar a una VM más RAM de la que tiene el host físico (10 GB > 8 GB).",
  },
  {
    id: "2024-07_q20",
    exam: "2024-07",
    topic: "modulo-ii",
    type: "mc",
    points: 0.5,
    question:
      "¿Cuál de las siguientes sentencias con respecto al almacenamiento en VMware es falsa?",
    options: [
      "A. Los VMDKs pueden ser thick o thin.",
      "B. Los datastores únicamente pueden ser volúmenes VMFS.",
      "C. El almacenamiento SAN debe ser formateado con VMFS para trabajar con él.",
    ],
    correctAnswer: "b",
    explanation:
      "ES FALSO que los datastores solo puedan ser VMFS: también pueden ser NFS (para NAS).",
  },
];
