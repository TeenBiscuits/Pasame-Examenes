import type { Question } from "../../data/types";

export const questions: Question[] = [
	// ================================================================
	// Examen Enero 2026 (2026-01)
	// ================================================================

	// --- Ejercicio 1: Rendimiento ---
	{
		id: "2026-01_q1",
		examId: "2026-01",
		topic: "rendimiento",
		type: "multiple-text",
		points: 0.75,
		question: `El Intel Xeon 6980P es un procesador de última generación orientado para su uso en *data centers* y aplicaciones de inteligencia artificial. Cada núcleo de este procesador cuenta con **dos unidades** en punto flotante de 512 bits, que ejecutan instrucciones de punto flotante. Cada una de estas instrucciones efectúa 16 flops de doble precisión en un ciclo, o bien 32 flops de simple precisión en un ciclo. El procesador incluye 128 núcleos, y funciona a una frecuencia base de 2 GHz.

Contesta, **de forma razonada**, a las siguientes preguntas:`,
		textParts: [
			{
				text: "¿Cuál es el rendimiento máximo en GFLOPS alcanzable por cada núcleo trabajando con doble precisión? ¿Y por el procesador completo?",
			},
			{
				text: "Se utiliza uno de los núcleos del procesador para ejecutar un benchmark SPEC sobre números en punto flotante de doble precisión. El 40% del tiempo de ejecución se emplea en la ejecución de flops. Se obtiene un rendimiento de 32 GFLOPS. El programador decide sacrificar precisión a cambio de rendimiento, ejecutando una versión del código idéntico al original, pero que emplea las instrucciones de simple precisión de las unidades en punto flotante. ¿Qué rendimiento espera obtener de esta nueva versión?",
			},
			{
				text: "Por cada instrucción en punto flotante en doble precisión del programa, se ejecutan otras 2 operaciones de otros tipos para dar soporte al cómputo (incluyendo cargas, saltos, aritmética entera, etc.). ¿Cuál es el rendimiento en IPC (instrucciones por ciclo) del programa original en doble precisión? Observa que IPC es la inversa del CPI, y recuerda que cada instrucción en punto flotante efectúa 16 flops y esta versión del programa obtiene un rendimiento de 32 GFLOPS.",
			},
		],
		correctAnswer: [
			`$$GFLOPS_{core} = 2 \\text{ fp\\_units} \\times 16 \\text{ flops/ciclo/fp\\_unit} \\times 2 \\text{ GHz} = 64 \\text{ GFLOPS}$$
$$GFLOPS_{proc} = 128 \\text{ cores} \\times GFLOPS_{core} = 8192 \\text{ GFLOPS}$$`,
			`$$f_m = 40\\% = 0.4 = 2/5 \\quad Am = \\frac{32 \\text{ flops/ciclo}}{16 \\text{ flops/ciclo}} = 2$$
$$s = \\frac{1}{3/5 + \\left(\\frac{2}{5}\\right)/2} = \\frac{1}{3/5 + 1/5} = \\frac{1}{4/5} = \\frac{5}{4}$$
$$GFLOPS_{sp} = 32 \\times \\frac{5}{4} = 40 \\text{ GFLOPS}$$`,
			`$$\\frac{32\\ GFLOPS}{16\\ flops/inst} = 2\\ Ginst_{FP}/s$$
$$2\\ Ginst_{FP}/s \\times 3 = 6\\ Ginst/s\\ (\\text{instrucciones totales})$$
$$\\frac{6\\ Ginst/s}{2\\ GHz} = 3\\ inst/ciclo$$`,
		],
	},

	// --- Ejercicio 2: Memoria virtual ---
	{
		id: "2026-01_q2",
		examId: "2026-01",
		topic: "memoria-virtual",
		type: "multiple-text",
		points: 2,
		question: `Considera un computador con 16 MiB ($2^{24}$) de memoria física. Dispone de un sistema de memoria virtual paginado con direcciones de 26 bits que sigue un esquema de traducción en 2 niveles. El tamaño de página es de 256B y la tabla de páginas de primer nivel ocupa exactamente una página física. Cada entrada de la tabla de páginas ocupa 32 bits, comienza con un bit de residencia y termina con el número de página física; el resto son bits de control.

Para un proceso, la dirección virtual 0x13020A8 se traduce en la dirección física 0x8420A8. La tabla de páginas de nivel 1 está ubicada en la página física 0x14A7, y el RBTP$_2$ es 0xBD8000.

Contesta las siguientes cuestiones. Se debe mostrar el procedimiento.`,
		textParts: [
			{
				label: "a)",
				points: 0.2,
				text: "Indica cómo se divide y qué valor tiene cada campo de la dirección virtual y física.",
			},
			{
				label: "b)",
				points: 0.3,
				text: "Si todos los bits de control tienen valor 0, determina qué valor tienen las entradas de las tablas de páginas que permiten realizar dicha traducción.",
			},
			{
				label: "c)",
				points: 0.2,
				text: "Calcula la dirección física de la entrada correspondiente en la tabla de páginas de nivel 2.",
			},
			{
				label: "d)",
				points: 0.3,
				text: "Calcula cuánto ocupan las tablas de páginas necesarias para realizar únicamente esta traducción. Puedes expresar el resultado como operaciones con potencias de 2.",
			},
			{
				label: "e)",
				points: 0.4,
				text: "Si el sistema dispone de una caché L1 de datos, asociativa por conjuntos de 16 vías con líneas de 32 Bytes, ¿qué tamaño debe tener para que sea una caché con índices virtuales y etiquetas físicas?",
			},
			{
				label: "f)",
				points: 0.3,
				text: "Indica una ventaja y un inconveniente de incrementar el tamaño de página del sistema en función de los conceptos de **fragmentación** y **localidad**.",
			},
			{
				label: "g)",
				points: 0.3,
				text: "Describe brevemente qué ocurre cuando, durante una traducción, el bit de residencia en la tabla de páginas de nivel 2 está inactivo, desde que comienza hasta que finaliza la traducción.",
			},
		],
		correctAnswer: [
			`La $TP_1$ ocupa exactamente una página física: $2^8$ bytes. Cada entrada ocupa 4 bytes, por lo que tiene $2^8 / 4 = 2^6$ entradas.

Dirección virtual (26 bits):

| Campo | numPV$_1$ | numPV$_2$ | $\\Delta_p$ |
| --- | --- | --- | --- |
| Longitud | 6 bits | 12 bits | 8 bits |

Dirección física (24 bits):

| Campo | numPF | $\\Delta_p$ |
| --- | --- | --- |
| Longitud | 16 bits | 8 bits |

Valores para la traducción $0x13020A8 \\rightarrow 0x8420A8$:

| Campo | numPV$_1$ | numPV$_2$ | $\\Delta_p$ | numPF |
| --- | --- | --- | --- | --- |
| Valor | 0x13 | 0x020 | 0xA8 | 0x8420 |`,
			`El RBTP de la tabla de nivel 2 es 0xBD8000. El bit de residencia debe estar a 1 (bit más significativo de la entrada de 32 bits):

$$\\text{Entrada } TP_1 = 1 \\oplus 000\\dots0 \\oplus RBTP_2 = 0x80BD8000$$

$$\\text{Entrada } TP_2 = 1 \\oplus 000\\dots0 \\oplus numPF = 0x80008420$$`,
			`$$\\text{Dir} = RBTP_2 + numPV_2 \\times 4 \\text{ bytes/entrada}$$

$$0xBD8000 + 0x20 \\times 4 = 0xBD8080$$`,
			`$$TP_1: 2^6 \\text{ entradas} \\times 4 \\text{ B/entrada} = 2^8 \\text{ bytes}$$

$$TP_2: 2^{12} \\text{ entradas} \\times 4 \\text{ B/entrada} = 2^{14} \\text{ bytes}$$

$$\\text{Total}: (2^8 + 2^{14}) \\text{ bytes}$$`,
			`Al descomponer la dirección física para la caché, índice y desplazamiento deben ocupar como mucho los 8 bits de $\\Delta_p$. Con líneas de 32 Bytes y 16 vías ($2^4$):
$$2^x / 2^4 \\leq 2^8 \\rightarrow x - 4 \\leq 8 \\rightarrow x \\leq 12$$
Debe tener como máximo una capacidad de $2^{12}$ B = **4 KiB**.
Alternativamente: si el desplazamiento ocupa 5 bits, quedan 3 bits libres para el índice, por lo que la caché puede tener como máximo $2^3$ conjuntos de 16 vías:
$$2^3 \\text{ conjuntos} \\times 2^4 \\text{ líneas/conjunto} \\times 2^5 \\text{ bytes/línea} = 2^{12} \\text{ bytes}$$`,
			`- **Ventaja**: se mejora la localidad espacial, porque dentro de una página se almacenan más datos contiguos.
- **Inconveniente**: se incrementa la fragmentación interna porque aumenta la probabilidad de que parte de las páginas queden sin utilizar.`,
			`Al consultar la $TP_2$ se detecta que la página física buscada no está en memoria principal y se produce un **fallo de página**. El sistema operativo debe transferir los datos **desde el almacenamiento secundario** a una página física (*swap*). Se actualiza la tabla de páginas con la página física seleccionada y se reanuda la traducción.`,
		],
	},

	// --- Ejercicio 3: Buses y E/S ---
	{
		id: "2026-01_q3",
		examId: "2026-01",
		topic: "buses",
		type: "multiple-text",
		points: 0.75,
		question: `Tenemos una DMA que gestiona la transferencia de páginas entre el disco duro y la memoria de un computador. Las características del sistema son las siguientes:

- Las direcciones de memoria y las palabras son de 64 bits.
- El sistema de memoria y de bus soportan transacciones de bloques de hasta 32 palabras.
- Tiene un bus síncrono de 64 bits a 500 MHz, en el que tanto una transferencia de 64 bits como el envío de una dirección de memoria requieren 1 ciclo de reloj.
- En una transacción el tiempo de acceso a memoria para las 8 primeras palabras es de 62 ns, mientras que para cada grupo adicional de 8 palabras es de 40 ns.
- Las transferencias por el bus y los accesos a memoria pueden solaparse.
- La DMA funciona por ráfagas, tomando el control del bus en cada transacción y dejando 40 ciclos libres entre transacciones.
- El sistema de memoria virtual utiliza páginas de 4 KiB.

Contesta las siguientes cuestiones:`,
		textParts: [
			{
				text: "Número de ciclos necesarios para cada transacción.",
			},
			{
				text: "Número de transacciones para transferir una página completa desde el disco duro a la memoria.",
			},
			{
				text: "¿Cuál es la latencia para la transferencia de una página? Indica el valor exacto en ns.",
			},
			{
				text: "¿Cuál es el ancho de banda del sistema en la transmisión de una página? Calcula un valor aproximado en MB/s.",
			},
		],
		correctAnswer: [
			`$$T_{\\text{ciclo}} = \\frac{1}{f} = \\frac{1}{500 \\text{ MHz}} = 0.2 \\times 10^{-8} \\text{ s} = 2 \\text{ ns}$$

Para transferir las 32 palabras de una transacción:

- 1 ciclo para enviar la dirección.
- $62 \\text{ ns} / (2 \\text{ ns/ciclo}) = 31$ ciclos de acceso a memoria para las 8 primeras palabras.
- 8 ciclos para enviar los datos del grupo de 8 palabras (el bus es de 64 bits, 1 palabra por ciclo), que se solapan con el acceso a memoria del siguiente grupo: $40 \\text{ ns} / (2 \\text{ ns/ciclo}) = 20$ ciclos.

Cada grupo tiene 8 palabras, por lo que hay que repetir 4 veces para transferir las 32 palabras de la transacción:

$$1 + 31 + 3 \\times 20 + 8 = 100 \\text{ ciclos/transacción}$$`,
			`El sistema soporta bloques de 32 palabras. Por tanto, para transferir 4 KiB:

$$2^{12} \\text{ B} / (32 \\times 8 \\text{ B/transacción}) = 16 \\text{ transacciones}$$`,
			`Hay que esperar 40 ciclos entre cada transacción, y para 16 transacciones esto se repite 15 veces:

$$(16 \\text{ transacciones} \\times 100 \\text{ ciclos/tr} + 15 \\times 40) \\times 2 \\text{ ns/ciclo} = \\boxed{4400 \\text{ ns} = 4.4\\ \\mu\\text{s}}$$`,
			`$$\\text{El ancho de banda será: } 4 \\text{ KiB} / (4.4 \\times 10^{-6} \\text{ s}) \\simeq 0.9 \\times 10^{9} \\text{ B/s} = \\boxed{900 \\text{ MB/s}}$$`,
		],
	},

	// --- Ejercicio 4: RAID y almacenamiento ---
	{
		id: "2026-01_q4a",
		examId: "2026-01",
		topic: "raid",
		type: "mc",
		points: 0.1,
		question: `¿Cuál es la tecnología base de un disco duro (HDD)?`,
		options: [
			"A. Superficie magnetizable.",
			"B. Memoria flash.",
			"C. Memoria óptica.",
		],
		correctAnswer: "a",
		explanation:
			"Los discos duros (HDD) graban los datos en una superficie magnetizable sobre platos giratorios.",
	},
	{
		id: "2026-01_q4b",
		examId: "2026-01",
		topic: "raid",
		type: "mc",
		points: 0.1,
		question:
			"¿Cuál es una ventaja principal de los discos SSD frente a los HDD?",
		options: [
			"A. Mayor capacidad.",
			"B. Menor coste por GB.",
			"C. Mayor velocidad y ausencia de partes mecánicas.",
		],
		correctAnswer: "c",
		explanation:
			"Los SSD no tienen partes mecánicas, lo que les da mayor velocidad de acceso y mayor fiabilidad.",
	},
	{
		id: "2026-01_q4c",
		examId: "2026-01",
		topic: "raid",
		type: "mc",
		points: 0.1,
		question: "¿Qué significa RAID?",
		options: [
			"A. Redundant Array of Independent Disks.",
			"B. Random Access of Integrated Devices.",
			"C. Reliable Architecture for Input Data.",
		],
		correctAnswer: "a",
		explanation:
			"RAID significa Redundant Array of Independent Disks: un conjunto redundante de discos independientes.",
	},
	{
		id: "2026-01_q4d",
		examId: "2026-01",
		topic: "raid",
		type: "mc",
		points: 0.1,
		question: "¿Cómo se logra la redundancia en RAID 1?",
		options: [
			"A. Con códigos Hamming.",
			"B. Con paridad distribuida.",
			"C. Con duplicación completa de los datos en discos espejo.",
		],
		correctAnswer: "c",
		explanation:
			"RAID 1 (espejo) duplica completamente los datos en dos o más discos.",
	},
	{
		id: "2026-01_q4e",
		examId: "2026-01",
		topic: "raid",
		type: "mc",
		points: 0.1,
		question: "¿Qué nivel RAID permite recuperarse de dos fallos simultáneos?",
		options: ["A. RAID 3.", "B. RAID 6.", "C. RAID 5."],
		correctAnswer: "b",
		explanation:
			"RAID 6 usa doble paridad distribuida y soporta dos fallos simultáneos de discos.",
	},
];
