import type { Question } from "../../data/types";

export const questions: Question[] = [
  // ================================================================
  // Exam 2022-01
  // ================================================================

  {
    id: "2022-01_q1",
    examId: "2022-01",
    topic: "funciones-elementales",
    type: "mc",
    points: 0.5,
    question: "La función inversa de $f(x) = \\ln \\left(\\sqrt[5]{x + 6}\\right)$ es",
    options: [
      "A. $f^{-1}(x) = e^{x / 5} - 6$",
      "B. $f^{-1}(x) = e^{x / 5} + 6$",
      "C. $f^{-1}(x) = e^{5x} - 6$",
      "D. $f^{-1}(x) = e^{5x} + 6$",
    ],
    correctAnswer: "c",
  },
  {
    id: "2022-01_q2",
    examId: "2022-01",
    topic: "limites-continuidad",
    type: "mc",
    points: 0.5,
    question: "El resultado de calcular $\\lim_{t\\to 0^{+}}(2t)^{\\sin t}$ es",
    options: ["A. 1", "B. 0", "C. ∞", "D. Ninguna de las restantes"],
    correctAnswer: "a",
  },
  {
    id: "2022-01_q3",
    examId: "2022-01",
    topic: "metodos-numericos",
    type: "mc",
    points: 0.5,
    question:
      "Si se usa el método de dicotomía para aproximar una raíz de la función $f(x) = e^{x} - x^{2}$ en el intervalo $[-2, 0]$, los dos primeros iterantes son:",
    options: [
      "A. $x_{1} = -1\\mathrm{y}x_{2} = -\\frac{3}{2}$",
      "B. $x_{1} = -\\frac{1}{2}\\mathrm{y}x_{2} = -\\frac{1}{4}.$",
      "C. $x_{1} = -\\frac{1}{2}\\mathrm{y}x_{2} = -\\frac{3}{4}.$",
      "D. $x_{1} = -1\\mathrm{y}x_{2} = -\\frac{1}{2}$",
    ],
    correctAnswer: "d",
  },
  {
    id: "2022-01_q4",
    examId: "2022-01",
    topic: "metodos-numericos",
    type: "mc",
    points: 0.5,
    question:
      "El valor en $x = 2$ del polinomio que interpola a la función $f(x) = \\sqrt{1 + 8x}$ en los puntos $x_0 = 0, x_1 = 1, x_2 = 3$ es:",
    options: ["A. $\\sqrt{17}$", "B. 1", "C. $\\frac{13}{3}$", "D. 4"],
    correctAnswer: "c",
  },
  {
    id: "2022-01_q5",
    examId: "2022-01",
    topic: "limites-continuidad",
    type: "mc",
    points: 0.5,
    question:
      "La función $f(x)=\\left\\{\\begin{array}{ll}e^{1/x}&\\text{si}\\quad x<0,\\\\ x^{2}+1&\\text{si}\\quad x\\in[0,1],\\\\ \\frac{x^{3}}{(x-1)^{2}}&\\text{si}\\quad x>1,\\end{array}\\right.$",
    options: [
      "A. tiene asíntota horizontal si $x \\rightarrow -\\infty$ y asíntota oblicua si $x \\rightarrow +\\infty$",
      "B. no tiene asíntota horizontal si $x \\rightarrow -\\infty$ pero sí asíntota oblicua si $x \\rightarrow +\\infty$",
      "C. tiene una asíntota horizontal si $x \\rightarrow -\\infty$ pero no tiene asíntota si $x \\rightarrow +\\infty$",
      "D. ninguna de las restantes respuestas es correcta.",
    ],
    correctAnswer: "a",
  },
  {
    id: "2022-01_q6",
    examId: "2022-01",
    topic: "limites-continuidad",
    type: "mc",
    points: 0.5,
    question:
      "Sea $f(x)=\\left\\{\\begin{array}{ll}-\\frac{x+1}{x},&x<0\\\\ a,&x=0.\\\\ \\frac{x+1}{x},&x>0\\end{array}\\right.$ Calcula a para que f sea continua en x=0.",
    options: [
      "A. a = 0",
      "B. $f$ es discontinua para todo $a$",
      "C. a = 1",
      "D. $f$ es continua para todo $a$",
    ],
    correctAnswer: "b",
  },
  {
    id: "2022-01_q7",
    examId: "2022-01",
    topic: "metodos-numericos",
    type: "mc",
    points: 0.5,
    question:
      "Si se aplica el método de Newton-Raphson para resolver la ecuación $e^{2x} = x + 6$ partiendo de $x_{0} = 1$, entonces:",
    options: [
      "A. $x_{1} = \\frac{e^{2} + 6}{2e^{2} + 1}$.",
      "B. $x_{1} = \\frac{3e^{2} - 8}{2e^{2} - 1}$.",
      "C. $x_{1} = \\frac{e^{2} + 6}{2e^{2} - 1}$.",
      "D. $x_{1} = -\\frac{e^{2} + 6}{e^{2} - 7}$.",
    ],
    correctAnswer: "c",
  },
  {
    id: "2022-01_q8",
    examId: "2022-01",
    topic: "derivadas",
    type: "mc",
    points: 0.5,
    question: `Dada la función

$$
f (x) = \\left\\{ \\begin{array}{l l} - x ^ {2} + b x + 1 & \\text { si } x \\leq 2 \\ - 2 x + a & \\text { si } x > 2 \\end{array} \\right.
$$

El valor de a para que se cumpla el teorema del valor medio en $[0, 4]$ debe ser`,
    options: ["A. a = 3", "B. a = 4", "C. a = 5", "D. a = 6"],
    correctAnswer: "a",
  },
  {
    id: "2022-01_q9",
    examId: "2022-01",
    topic: "limites-continuidad",
    type: "mc",
    points: 0.5,
    question:
      "Un juego de pago nos cuesta $\\frac{1}{4}$ € por partida las primeras 100 partidas y, a partir de ahí, $\\frac{1}{6}$ €. ¿Cuánto tendremos que pagar si jugamos $x$ partidas?",
    options: [
      "A. $c(x) = \\left\\{ \\begin{array}{ll}4x, & \\text{si } x\\leq 100\\\\ 4x + 6x, & \\text{si } x > 100 \\end{array} \\right.$",
      "B. $c(x) = \\left\\{ \\begin{array}{ll}\\frac{x}{4}, & \\text{si } x\\leq 100\\\\ \\frac{100}{4} +\\frac{x - 100}{6}, & \\text{si } x > 100 \\end{array} \\right.$",
      "C. $c(x) = \\left\\{ \\begin{array}{ll}\\frac{x}{4}, & \\text{si } x\\leq 100\\\\ \\frac{x}{6}, & \\text{si } x > 100 \\end{array} \\right.$",
      "D. $c(x) = \\left\\{ \\begin{array}{ll}\\frac{x}{4}, & \\text{si } x\\leq 100\\\\ \\frac{100}{4} +\\frac{x}{6}, & \\text{si } x > 100 \\end{array} \\right.$",
    ],
    correctAnswer: "b",
  },
  {
    id: "2022-01_q10",
    examId: "2022-01",
    topic: "derivadas",
    type: "mc",
    points: 0.5,
    question:
      "La aproximación de $\\sqrt[4]{2^3}$ empleando el polinomio de Taylor de grado 2 de $f(x) = x^{\\frac{3}{4}}$ centrado en 1 es",
    options: [
      "A. $\\frac{53}{32}$",
      "B. $\\frac{25}{16}$",
      "C. $\\frac{31}{16}$",
      "D. $\\frac{7}{4}$",
    ],
    correctAnswer: "a",
  },
  {
    id: "2022-01_q11",
    examId: "2022-01",
    topic: "aplicaciones-derivada",
    type: "mc",
    points: 0.5,
    question: "La función $g(x) = e^{-x^2}(x^2 + 1)$",
    options: [
      "A. Tiene un punto de inflexión en 0",
      "B. Tiene un punto de inflexión en $\\frac{\\sqrt{3}}{2}$",
      "C. Es cóncava en todo $\\mathbb{R}$",
      "D. Tiene dos puntos de inflexión",
    ],
    correctAnswer: "d",
  },
  {
    id: "2022-01_q12",
    examId: "2022-01",
    topic: "aplicaciones-derivada",
    type: "mc",
    points: 0.5,
    question: "El área máxima de un triángulo rectángulo cuya hipotenusa mida 1 es",
    options: ["A. $\\frac{1}{2}$", "B. $\\frac{1}{4}$", "C. 1", "D. 2"],
    correctAnswer: "b",
  },
  {
    id: "2022-01_q13",
    examId: "2022-01",
    topic: "aplicaciones-integral",
    type: "mc",
    points: 0.5,
    question:
      "El área, $A$, entre el eje $OX$ y la gráfica de $f(x) = \\frac{1}{\\sqrt{x-1}}$ en el intervalo $(1, 2)$ es",
    options: [
      "A. $A = +\\infty$",
      "B. $A = 1$",
      "C. $A = \\frac{1}{2}$",
      "D. $A = 2$",
    ],
    correctAnswer: "d",
  },
  {
    id: "2022-01_q14",
    examId: "2022-01",
    topic: "integracion-numerica",
    type: "mc",
    points: 0.5,
    question: `Queremos aproximar la carga en un circuito, $q(t) = \\int_{3}^{11} i(t)dt$, utilizando las mediciones de $i(t)$ que figuran en la siguiente tabla:

| t | 3 | 5 | 7 | 9 | 11 |
|---| --- | --- | --- | --- | --- |
| i | 8 | 6 | 4 | 10 | 2 |

Los resultados, con trapecio compuesto, $q_{\\text{trap}}$, y punto medio compuesto, $q_{\\text{pmed}}$, son`,
    options: [
      "A. $q_{\\mathrm{trap}} = 100, q_{\\mathrm{pmed}} = 32$",
      "B. $q_{\\mathrm{trap}} = 50, q_{\\mathrm{pmed}} = 64$",
      "C. $q_{\\mathrm{trap}} = 100, q_{\\mathrm{pmed}} = 16$",
      "D. $q_{\\mathrm{trap}} = 100, q_{\\mathrm{pmed}} = 64$",
    ],
    correctAnswer: "b",
  },
  {
    id: "2022-01_q15",
    examId: "2022-01",
    topic: "ecuaciones-diferenciales",
    type: "mc",
    points: 0.5,
    question: `La cantidad de un material radiactivo, $X(t)$, va disminuyendo con el tiempo. Podemos modelizar este fenómeno con la EDO: $\\frac{dX}{dt} = -kX$. Calcula $k$ para una muestra de radón que inicialmente pesaba 100 gr y del que, 100 años después, sólo quedan 99 gr.

Nota: Medimos el tiempo en años y la masa en gramos.`,
    options: [
      "A. $k = -\\frac{\\ln \\frac{99}{100}}{100}$",
      "B. $k = 100$",
      "C. $k = -\\ln \\frac{99}{100}$",
      "D. $k = \\frac{\\ln \\frac{99}{100}}{100}$",
    ],
    correctAnswer: "a",
  },
  {
    id: "2022-01_q16",
    examId: "2022-01",
    topic: "ecuaciones-diferenciales",
    type: "mc",
    points: 0.5,
    question:
      "La solución del problema de valor inicial $\\frac{dy}{dx} = \\frac{x + xy^2}{2y}$, con $y(0) = 1$ es",
    options: [
      "A. $y = \\sqrt{e^{\\frac{x^2}{2}} - 1}$",
      "B. $y = \\sqrt{2e^{x^2} - 1}$",
      "C. $y = \\sqrt{2e^{\\frac{x^2}{2}} - 1}$",
      "D. $y = \\sqrt{e^{\\frac{x^2}{2}} + 1}$",
    ],
    correctAnswer: "c",
  },
  {
    id: "2022-01_q17",
    examId: "2022-01",
    topic: "aplicaciones-integral",
    type: "mc",
    points: 0.5,
    question:
      "El volumen, $V$, del sólido de revolución generado por la rotación alrededor del eje $X$ de la región encerrada entre las gráficas de $y = \\sqrt{x}$ e $y = x^2$ es",
    options: [
      "A. $V = \\frac{9\\pi}{70}$",
      "B. $V = \\frac{7\\pi}{15}$",
      "C. $V = \\frac{\\pi}{3}$",
      "D. $V = \\frac{3\\pi}{10}$",
    ],
    correctAnswer: "d",
  },
  {
    id: "2022-01_q18",
    examId: "2022-01",
    topic: "aplicaciones-integral",
    type: "mc",
    points: 0.5,
    question:
      "El área de cada sección perpendicular para un cuerpo 3D es $A(x) = \\tan(x)$, para $x \\in [0, \\pi/3]$. Entonces el volumen de dicha figura es:",
    options: [
      "A. $-\\pi \\ln(0.5)$",
      "B. $-\\ln(0.5)$",
      "C. $\\pi \\ln(0.5\\sqrt{3})$",
      "D. $\\ln(0.5\\sqrt{3})$",
    ],
    correctAnswer: "b",
  },
  {
    id: "2022-01_q19",
    examId: "2022-01",
    topic: "integral-definida",
    type: "mc",
    points: 0.5,
    question:
      "Dada $f(x) = \\sin(x)$ y la partición $P = \\{-\\pi, -\\pi/6, \\pi/6, \\pi, 2\\pi\\}$ entonces:",
    options: [
      "A. $L(f, P) = -2\\pi$",
      "B. $L(f, P) = \\frac{5\\pi}{6}$",
      "C. $L(f, P) = -\\frac{7\\pi}{12}$",
      "D. Ninguna de las restantes",
    ],
    correctAnswer: "a",
  },
  {
    id: "2022-01_q20",
    examId: "2022-01",
    topic: "integral-definida",
    type: "mc",
    points: 0.5,
    question:
      "Sea $F(x) = \\int_{-\\frac{\\pi}{2}}^{x} t \\cos(t)dt$, $x \\in \\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$. El mínimo absoluto de $F$ se alcanza en",
    options: [
      "A. $F$ no tiene mínimo absoluto",
      "B. $x = -\\frac{\\pi}{2}$",
      "C. $x = \\frac{\\pi}{4}$",
      "D. $x = 0$",
    ],
    correctAnswer: "d",
  },

  // ================================================================
  // Exam 2022-07
  // ================================================================

  {
    id: "2022-07_q1",
    examId: "2022-07",
    topic: "limites-continuidad",
    type: "mc",
    points: 0.5,
    question: `Si sabemos que

$$\\lim_{x\\to +\\infty}\\frac{f(x)}{x} = -2\\mathrm{y}\\lim_{x\\to +\\infty}(f(x) + 2x) = 3$$

entonces`,
    options: [
      "A. $y = -2x + 3$ es una asíntota oblicua de $f$ cuando $x \\to +\\infty$",
      "B. $y = -2x$ es una asíntota horizontal de $f$ cuando $x \\to +\\infty$",
      "C. $y = 2x - 3$ es una asíntota oblicua de $f$ cuando $x \\to +\\infty$",
      "D. $x = 3$ es una asíntota vertical de $f$",
    ],
    correctAnswer: "a",
  },
  {
    id: "2022-07_q2",
    examId: "2022-07",
    topic: "limites-continuidad",
    type: "mc",
    points: 0.5,
    question: `La función

$$f(x) = \\left\\{ \\begin{array}{ll} x^3 - 3x^2 + 3x - 1 & \\text{si} \\quad x \\leq 1, \\ \\arctan(x - 1) & \\text{si} \\quad x > 1. \\end{array} \\right.$$

`,
    options: [
      "A. no es continua en $x = 1$ pero sí en $x = 0$",
      "B. es continua en $x = 1$ pero no en $x = 0$",
      "C. es continua en $x = 1$",
      "D. no es continua en $x = 0$",
    ],
    correctAnswer: "c",
  },
  {
    id: "2022-07_q3",
    examId: "2022-07",
    topic: "funciones-elementales",
    type: "mc",
    points: 0.5,
    question:
      "Si $f(x) = x^2 + 1$ y $g(x) = e^{x + 2}$, entonces",
    options: [
      "A. $(f \\circ g)(x) = e^{x^2 + 1}$",
      "B. $(f \\circ g)(x) = e^{x^2 + 3}$",
      "C. $(f \\circ g)(x) = e^{2x + 4} + 1$",
      "D. $(f \\circ g)(x) = 2e^{x + 2} + 1$",
    ],
    correctAnswer: "c",
  },
  {
    id: "2022-07_q4",
    examId: "2022-07",
    topic: "metodos-numericos",
    type: "mc",
    points: 0.5,
    question: `Sea $p_2$ el polinomio de interpolación de Lagrange para los nodos $x_0 = 0$, $x_1 = 2$ y $x_2 = 6$, relativo a los valores $y_0 = -2$, $y_1 = 0$ e $y_2 = 4$. Entonces`,
    options: [
      "A. $p_2(1) = 1$",
      "B. $p_2(1) = -1$",
      "C. $p_2(1) = 0$",
      "D. $p_2(1) = 3$",
    ],
    correctAnswer: "b",
  },
  {
    id: "2022-07_q5",
    examId: "2022-07",
    topic: "metodos-numericos",
    type: "mc",
    points: 0.5,
    question:
      "Para aproximar el valor de $\\sqrt{10}$ aplicamos el método de Newton-Raphson a la función $f(x) = x^2 - 10$ tomando como punto de partida $x_0 = 3$. Entonces",
    options: [
      "A. $x_1 = \\frac{19}{6}$",
      "B. $x_1 = 3$",
      "C. $x_1 = \\sqrt{10}$",
      "D. $x_1 = \\frac{17}{6}$",
    ],
    correctAnswer: "a",
  },
  {
    id: "2022-07_q6",
    examId: "2022-07",
    topic: "derivadas",
    type: "mc",
    points: 0.5,
    question: `Consideramos la función $f(x) = a \\ln \\left( \\frac{x^2}{x + 1} \\right)$. El valor de $a$ que hace que la recta tangente a $f$ en $x_0 = 3$ sea paralela a $y = x$ es`,
    options: [
      "A. $a = 2$",
      "B. $a = \\frac{12}{5}$",
      "C. $a = 6$",
      "D. $a = 8$",
    ],
    correctAnswer: "b",
  },
  {
    id: "2022-07_q7",
    examId: "2022-07",
    topic: "funciones-elementales",
    type: "mc",
    points: 0.5,
    question: "El dominio de la función $f(x) = \\sqrt{-x \\ln x}$ es:",
    options: [
      "A. $\\operatorname{Dom} f = (0, 1]$",
      "B. $\\operatorname{Dom} f = (0, \\infty)$",
      "C. $\\operatorname{Dom} f = (0, 1)$",
      "D. $\\operatorname{Dom} f = (-\\infty, 0)$",
    ],
    correctAnswer: "a",
  },
  {
    id: "2022-07_q8",
    examId: "2022-07",
    topic: "derivadas",
    type: "mc",
    points: 0.5,
    question: `Si aproximamos el valor de $24^{\\frac{3}{2}}$ mediante el polinomio de Taylor de grado 2 para la función $f(x) = x^{\\frac{3}{2}}$ centrado en el punto $x_0 = 25$, el resultado será`,
    options: [
      "A. $\\frac{5303}{40}$",
      "B. $\\frac{235}{2}$",
      "C. $125$",
      "D. $\\frac{4703}{40}$",
    ],
    correctAnswer: "d",
  },
  {
    id: "2022-07_q9",
    examId: "2022-07",
    topic: "limites-continuidad",
    type: "mc",
    points: 0.5,
    question: "Si $L = \\lim_{x \\to 0} \\frac{\\cos^2 x - 1}{1 + 2x - e^{2x}}$, entonces",
    options: [
      "A. $L = 1$",
      "B. $L = \\frac{1}{2}$",
      "C. $L = 0$",
      "D. $L = -\\frac{1}{2}$",
    ],
    correctAnswer: "b",
  },
  {
    id: "2022-07_q10",
    examId: "2022-07",
    topic: "aplicaciones-derivada",
    type: "mc",
    points: 0.5,
    question: "La función $f(x) = \\cos(x)$ es",
    options: [
      "A. convexa en $[0, \\pi / 2]$ y cóncava en $[\\pi / 2, \\pi]$",
      "B. convexa en $[0, \\pi]$",
      "C. cóncava en $[0, \\pi]$",
      "D. cóncava en $[0, \\pi / 2]$ y convexa en $[\\pi / 2, \\pi]$",
    ],
    correctAnswer: "d",
  },
  {
    id: "2022-07_q11",
    examId: "2022-07",
    topic: "integral-definida",
    type: "mc",
    points: 0.5,
    question: `La función $F(x) = \\int_{-\\frac{\\pi}{2}}^{x} t \\cos(t) dt$, $x \\in \\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$, alcanza su mínimo absoluto en`,
    options: [
      "A. $x = 0$",
      "B. $x = -\\frac{\\pi}{2}$",
      "C. $x = \\frac{\\pi}{4}$",
      "D. $F$ no tiene mínimo absoluto",
    ],
    correctAnswer: "a",
  },
  {
    id: "2022-07_q12",
    examId: "2022-07",
    topic: "derivadas",
    type: "mc",
    points: 0.5,
    question: "Si $t^3 \\cos y - 2ty^3 + \\sqrt{t} = 0$, entonces",
    options: [
      "A. $y' = \\frac{3t^2 \\cos y - 2y^3}{t^3 \\sin y + 6ty^2}$",
      "B. $y' = \\frac{3t^2 \\cos y - 2y^3 + 0.5t^{-0.5}}{6ty^2}$",
      "C. $y' = \\frac{3t^2 \\cos y - 2y^3 + 0.5t^{-0.5}}{t^3 \\sin y}$",
      "D. $y' = \\frac{3t^2 \\cos y - 2y^3 + 0.5t^{-0.5}}{t^3 \\sin y + 6ty^2}$",
    ],
    correctAnswer: "d",
  },
  {
    id: "2022-07_q13",
    examId: "2022-07",
    topic: "aplicaciones-derivada",
    type: "mc",
    points: 0.5,
    question:
      "Consideramos la función $f(x) = |\\cos x|$, $x \\in [-\\pi/2, 3\\pi/2]$. Sus extremos absolutos son",
    options: [
      "A. $\\pi$ mínimo absoluto y $0$ máximo absoluto",
      "B. $-\\pi /2,\\pi /2,3\\pi /2$ mínimos absolutos y $0$, $\\pi$ máximos absolutos",
      "C. $-\\pi /2,\\pi /2$ mínimos absolutos y $0$, $3\\pi /2,\\pi$ máximos absolutos",
      "D. $-\\pi /2,\\pi /2$ mínimos absolutos y $0$ máximo absoluto",
    ],
    correctAnswer: "b",
  },
  {
    id: "2022-07_q14",
    examId: "2022-07",
    topic: "aplicaciones-integral",
    type: "mc",
    points: 0.5,
    question:
      "El área, $A$, limitada por las gráficas de $f(x) = -x$ y $g(x) = -x^3$ en $[0, 2]$ es:",
    options: [
      "A. $A = 5/2$",
      "B. $A = 1/2$",
      "C. $A = 3/2$",
      "D. $A = 2$",
    ],
    correctAnswer: "a",
  },
  {
    id: "2022-07_q15",
    examId: "2022-07",
    topic: "integracion-numerica",
    type: "mc",
    points: 0.5,
    question: `El resultado de aproximar la integral $\\int_0^2 (x - \\operatorname{sen}(\\pi x)) \\, \\mathrm{d}x$ mediante la fórmula de trapecio compuesto usando 4 subintervalos es`,
    options: ["A. 1", "B. 4", "C. 2", "D. 0"],
    correctAnswer: "c",
  },
  {
    id: "2022-07_q16",
    examId: "2022-07",
    topic: "aplicaciones-integral",
    type: "mc",
    points: 0.5,
    question: `Consideramos la región limitada por las gráficas de $f(x) = \\sqrt{x}$ y $g(x) = x^3$ en el primer cuadrante. Si la hacemos girar alrededor del eje OX genera una figura cuyo volumen es`,
    options: [
      "A. $V = 25\\pi/126$",
      "B. $V = 2\\pi/35$",
      "C. $V = \\pi/144$",
      "D. $V = 5\\pi/14$",
    ],
    correctAnswer: "d",
  },
  {
    id: "2022-07_q17",
    examId: "2022-07",
    topic: "aplicaciones-integral",
    type: "mc",
    points: 0.5,
    question: `El índice de Gini para medir la desigualdad en un país viene dado por

$\\mathrm{iGini} = 2 \\int_0^1 (x - L(x)) \\, dx$. Entonces, para un país donde $L(x) = x^{3/2}$,

`,
    options: [
      "A. $\\mathrm{iGini} = 1/5$",
      "B. $\\mathrm{iGini} = 1/10$",
      "C. $\\mathrm{iGini} = 2/5$",
      "D. $\\mathrm{iGini} = 2/3$",
    ],
    correctAnswer: "a",
  },
  {
    id: "2022-07_q18",
    examId: "2022-07",
    topic: "aplicaciones-integral",
    type: "mc",
    points: 0.5,
    question:
      "El área bajo el grafo de la función $v$ dada por $v(t) = 2^t$, $t \\in (-\\infty, 1]$ vale",
    options: [
      "A. $\\infty$",
      "B. $\\frac{2}{3}$",
      "C. $\\frac{2}{\\ln(2)}$",
      "D. $2 \\ln(2)$",
    ],
    correctAnswer: "c",
  },
  {
    id: "2022-07_q19",
    examId: "2022-07",
    topic: "ecuaciones-diferenciales",
    type: "mc",
    points: 0.5,
    question: `La Ley de Enfriamiento de Newton dice que un sólido se enfría a una velocidad proporcional a la diferencia entre su temperatura y la ambiente: $\\frac{dT}{dt} = -k(T - T_0)$. Si estamos a $20^\\circ$ y un café pasa de 90 a $70^\\circ$ en 5 minutos, ¿cuál es su cte. de enfriamiento, $k$?`,
    options: [
      "A. $k = \\ln(20)$",
      "B. $k = -\\frac{\\ln(5/7)}{5}$",
      "C. $k = 1$",
      "D. $k = \\frac{\\ln(70)}{5}$",
    ],
    correctAnswer: "b",
  },
  {
    id: "2022-07_q20",
    examId: "2022-07",
    topic: "ecuaciones-diferenciales",
    type: "mc",
    points: 0.5,
    question: "La solución general de la EDO $(1 + e^x) \\frac{dy}{dx} + e^x y = 0$ es",
    options: [
      "A. $y = 0$",
      "B. $y = \\frac{C}{1 + e^x}$",
      "C. $y = C$",
      "D. $y = Ce^x$",
    ],
    correctAnswer: "b",
  },

  // ================================================================
  // Exam 2023-01
  // ================================================================

  {
    id: "2023-01_q1",
    examId: "2023-01",
    topic: "funciones-elementales",
    type: "mc",
    points: 0.5,
    question:
      "Un número $c$ no racional verificando $\\pi/6 < c < \\sqrt{3}$ es",
    options: [
      "A. $c = e/6$",
      "C. $c = e/3$",
      "B. $c = i$",
      "D. $c = 2\\sqrt{2}$",
    ],
    correctAnswer: "c",
    explanation:
      "Como $2e > \\pi$, se tiene que $\\frac{2e}{6} > \\frac{\\pi}{6}$, es decir, $\\frac{e}{3} > \\frac{\\pi}{6}$. Por otro lado, $e < 3$ implica $e^2 < 9$, de donde $\\frac{e^2}{9} < 1 < 3$ y por tanto $\\frac{e}{3} < \\sqrt{3}$. Así, $c = \\frac{e}{3}$ verifica $\\pi/6 < c < \\sqrt{3}$.",
  },
  {
    id: "2023-01_q2",
    examId: "2023-01",
    topic: "limites-continuidad",
    type: "mc",
    points: 0.5,
    question: "$\\lim_{x\\to -\\infty}\\frac{\\cos(x)}{x^2 + 1} =$",
    options: ["A. 0", "C. $+\\infty$", "B. No existe", "D. 1"],
    correctAnswer: "a",
    explanation:
      "El numerador $\\cos(x)$ está acotado entre $-1$ y $1$, mientras que el denominador $x^2 + 1$ tiende a $+\\infty$ cuando $x \\to -\\infty$. Por tanto, $$\\lim_{x\\to -\\infty}\\frac{\\cos(x)}{x^2 + 1} = \\frac{[\\text{acotado}]}{+\\infty} = 0.$$",
  },
  {
    id: "2023-01_q3",
    examId: "2023-01",
    topic: "funciones-elementales",
    type: "mc",
    points: 0.5,
    question: "Si $f(x) = \\exp(-|x|)$, entonces",
    options: [
      "A. $y = 0$ es una asíntota horizontal por ambos lados",
      "C. $f$ es derivable en todo número real",
      "B. $f$ no es acotada",
      "D. $f$ no es integrable en $[-1, 1]$",
    ],
    correctAnswer: "a",
    explanation: `Cuando $x \\to -\\infty$ y cuando $x \\to +\\infty$:

$$
\\lim_{x\\to -\\infty} e^{-|x|} = \\lim_{x\\to -\\infty} \\frac{1}{e^{|x|}} = \\frac{1}{+\\infty} = 0, \\qquad \\lim_{x\\to +\\infty} e^{-|x|} = \\lim_{x\\to +\\infty} \\frac{1}{e^{|x|}} = 0.
$$

Así que $y = 0$ es una asíntota horizontal por ambos lados.`,
  },
  {
    id: "2023-01_q4",
    examId: "2023-01",
    topic: "funciones-elementales",
    type: "mc",
    points: 0.5,
    question: "Si $f(x) = \\ln x^2$ y $g(x) = e^{x + 2}$, entonces",
    options: [
      "A. $(f\\circ g)(x) = x$",
      "C. $(f\\circ g)(x) = 2x + 4$",
      "B. $(f\\circ g)(x) = (x + 2)^{2}$",
      "D. $(f\\circ g)(x) = x + 2$",
    ],
    correctAnswer: "c",
    explanation:
      "$$(f \\circ g)(x) = f(g(x)) = f(e^{x+2}) = \\ln\\left(e^{x+2}\\right)^2 = \\ln\\left(e^{2x+4}\\right) = 2x + 4.$$",
  },
  {
    id: "2023-01_q5",
    examId: "2023-01",
    topic: "metodos-numericos",
    type: "mc",
    points: 0.5,
    question:
      "Sea $p_{2}$ el polinomio de interpolación de Lagrange para los nodos $x_{0} = -1$, $x_{1} = 0$ y $x_{2} = 2$, relativo a los valores $y_{0} = 5$, $y_{1} = 1$ e $y_{2} = -1$. Entonces",
    options: [
      "A. $p_2(1) = 2$",
      "C. $p_2(1) = 0$",
      "B. $p_2(1) = 5$",
      "D. $p_2(1) = -1$",
    ],
    correctAnswer: "d",
    explanation:
      "Diferencias divididas: $\\frac{1-5}{0-(-1)} = -4$, $\\frac{-1-1}{2-0} = -1$ y la de segundo orden $\\frac{-1-(-4)}{2-(-1)} = 1$. Entonces $$p_2(x) = 5 - 4(x+1) + 1\\cdot (x+1)x,$$ y evaluando en $x = 1$: $$p_2(1) = 5 - 4\\cdot 2 + 1\\cdot 2\\cdot 1 = 5 - 8 + 2 = -1.$$",
  },
  {
    id: "2023-01_q6",
    examId: "2023-01",
    topic: "derivadas",
    type: "mc",
    points: 0.5,
    question:
      "La función $f(x) = \\begin{cases} bx^{2} + ax, & 0 \\leq x \\leq 2 \\\\ -2 + \\sqrt{x - 1}, & 2 < x \\leq 5 \\end{cases}$, es derivable en [0, 5]. Entonces:",
    options: [
      "A. $a = \\frac{1}{2}, b = \\frac{-1}{2}$",
      "C. $a = \\frac{-3}{2}, b = \\frac{1}{2}$",
      "B. $a = \\frac{-1}{2}, b = 0$",
      "D. $a = \\frac{-5}{2}, b = \\frac{3}{2}$",
    ],
    correctAnswer: "c",
    explanation:
      "Continuidad en $x = 2$: $\\lim_{x\\to 2^-} f(x) = 4b + 2a$ y $\\lim_{x\\to 2^+} f(x) = -2 + \\sqrt{1} = -1$, luego $4b + 2a = -1$. Derivabilidad: la derivada por la izquierda es $4b + a$ y la de la derecha es $\\frac{1}{2\\sqrt{2 - 1}} = \\frac{1}{2}$, luego $4b + a = \\frac{1}{2}$. Restando ambas ecuaciones: $a = -\\frac{3}{2}$ y, sustituyendo, $b = \\frac{1}{2}$.",
  },
  {
    id: "2023-01_q7",
    examId: "2023-01",
    topic: "aplicaciones-derivada",
    type: "mc",
    points: 0.5,
    question:
      "Dado el punto $(1,2)$, determinar el segmento con extremos en los ejes que pasa por el punto, de forma que el triángulo de vértices el origen de coordenadas y los extremos del segmento tenga área mínima. El área de dicho triángulo es:",
    options: ["A. 1", "B. 2", "C. 3", "D. 4"],
    correctAnswer: "d",
    explanation:
      "Si la recta corta al eje $OY$ en $y = n$, como pasa por $(1, 2)$ su ecuación es $y = (2-n)x + n$; corta al eje $OX$ en $x = \\frac{n}{n-2}$. El área del triángulo es $$S(n) = \\frac{1}{2}n\\cdot \\frac{n}{n-2} = \\frac{n^2}{2(n-2)}, \\qquad S'(n) = \\frac{n^2 - 4n}{2(n-2)^2}.$$ Igualando $S'(n) = 0$: $n = 0$ (absurdo) o $n = 4$. El mínimo está en $n = 4$, con área $S(4) = \\frac{16}{2\\cdot 2} = 4$.",
  },
  {
    id: "2023-01_q8",
    examId: "2023-01",
    topic: "aplicaciones-derivada",
    type: "mc",
    points: 0.5,
    question:
      "La ecuación de la tangente a la gráfica de $f(x) = 2x^{3} - 6x^{2} + 4$ en su punto de inflexión es:",
    options: [
      "A. $y = -6x + 2$",
      "C. $y = -6x + 6$",
      "B. $y = -6x + 4$",
      "D. $y = -6x + 8$",
    ],
    correctAnswer: "c",
    explanation:
      "Buscamos el punto de inflexión anulando la segunda derivada: $f'(x) = 6x^2 - 12x$, $f''(x) = 12x - 12 = 0 \\Rightarrow x = 1$. La tangente pasa por $f(1) = 2 - 6 + 4 = 0$ con pendiente $f'(1) = 6 - 12 = -6$: $$y = -6(x - 1) + 0 = -6x + 6.$$",
  },
  {
    id: "2023-01_q9",
    examId: "2023-01",
    topic: "aplicaciones-derivada",
    type: "mc",
    points: 0.5,
    question: "La función $y = \\frac{x}{x^{2} + 1}$ tiene",
    options: [
      "A. Dos intervalos de convexidad y uno de concavidad",
      "B. Dos intervalos de concavidad y uno de convexidad",
      "C. Dos intervalos de concavidad y dos de convexidad",
      "D. Ninguna de las anteriores",
    ],
    correctAnswer: "c",
    explanation: `Derivando:

$$
f'(x) = \\frac{1 - x^2}{(1 + x^2)^2}, \\qquad f''(x) = \\frac{2x(x^4 - 2x^2 - 3)}{(1 + x^2)^4}.
$$

Las raíces de $f''$ son $x = 0$ y las de la bicuadrática $x^4 - 2x^2 - 3 = 0$: con $z = x^2$, $z^2 - 2z - 3 = 0 \\Rightarrow z = 3$ (el valor $z = -1$ no da raíces reales), es decir, $x = \\pm\\sqrt{3}$. Estudiando el signo de $f''$ en los cuatro subintervalos: $f$ es cóncava en $(-\\infty, -\\sqrt{3})$, convexa en $(-\\sqrt{3}, 0)$, cóncava en $(0, \\sqrt{3})$ y convexa en $(\\sqrt{3}, +\\infty)$.`,
  },
  {
    id: "2023-01_q10",
    examId: "2023-01",
    topic: "metodos-numericos",
    type: "mc",
    points: 0.5,
    question:
      "Se aplica el método de Newton para aproximar el inverso del número $a$. Para ello es necesario resolver $\\frac{1}{x} - a = 0$. La sucesión que se obtiene es:",
    options: [
      "A. $x_{k+1} = x_k(2 + ax_k)$",
      "C. $x_{k+1} = x_k(2 + x_k)$",
      "B. $x_{k+1} = x_k(2 - x_k)$",
      "D. $x_{k+1} = x_k(2 - ax_k)$",
    ],
    correctAnswer: "d",
    explanation:
      "Aplicamos Newton a $f(x) = \\frac{1}{x} - a$, con $f'(x) = -\\frac{1}{x^2}$: $$x_{k+1} = x_k - \\frac{f(x_k)}{f'(x_k)} = x_k - \\frac{\\frac{1}{x_k} - a}{-\\frac{1}{x_k^2}} = x_k + x_k^2\\left(\\frac{1}{x_k} - a\\right) = 2x_k - ax_k^2 = x_k(2 - ax_k).$$",
  },
  {
    id: "2023-01_q11",
    examId: "2023-01",
    topic: "derivadas",
    type: "mc",
    points: 0.5,
    question:
      "Si el polinomio de Taylor de grado cinco de una función $f$ centrado en $x_0 = 3$ es $P(x) = 3 + 8(x - 3)^2 + 5(x - 3)^3 + 2(x - 3)^4 - 2(x - 3)^5$, entonces",
    options: [
      "A. $f$ tiene un máximo en $x = 3$",
      "C. $f$ tiene un mínimo en $x = 3$",
      "B. $f$ no posee un extremo en $x = 3$",
      "D. $f''(3) = 8$",
    ],
    correctAnswer: "c",
    explanation:
      "De la forma del polinomio de Taylor deducimos $f(3) = 3$, $f'(3) = 0$ y $\\frac{f''(3)}{2!} = 8 \\Rightarrow f''(3) = 16 > 0$. Primera derivada nula y segunda positiva implican que $f$ tiene un mínimo relativo en $x = 3$.",
  },
  {
    id: "2023-01_q12",
    examId: "2023-01",
    topic: "integral-definida",
    type: "mc",
    points: 0.5,
    question:
      "¿Cuál de las siguientes funciones es una primitiva de $f(x) = \\frac{5}{6x^2 + 1}$?",
    options: [
      "A. $\\frac{5}{\\sqrt{6}} \\arctan(\\sqrt{6x}) + C$",
      "C. $\\frac{5}{\\sqrt{6}} \\arctan(x\\sqrt{6}) + C$",
      "B. $\\frac{5}{6} \\arctan(x\\sqrt{6}) + C$",
      "D. $\\frac{5}{\\sqrt{6}} \\arctan(6x) + C$",
    ],
    correctAnswer: "c",
    explanation:
      "Con el cambio $u = x\\sqrt{6}$, de modo que $du = \\sqrt{6}\\,dx$ y $6x^2 + 1 = u^2 + 1$: $$\\int \\frac{5}{6x^2 + 1}\\,dx = \\frac{5}{\\sqrt{6}} \\int \\frac{du}{1 + u^2} = \\frac{5}{\\sqrt{6}} \\arctan(x\\sqrt{6}) + C.$$",
  },
  {
    id: "2023-01_q13",
    examId: "2023-01",
    topic: "integral-definida",
    type: "mc",
    points: 0.5,
    question:
      "Sea la función $f(x) = |\\log_2(x)|$. Consideramos la partición $P = \\left\\{\\frac{1}{4}, \\frac{1}{2}, 1, 8\\right\\}$. Elige la opción correcta:",
    options: [
      "A. $L(f, P) = 1, U(f, P) = \\frac{85}{4}$",
      "C. $L(f, P) = -1, U(f, P) = \\frac{85}{4}$",
      "B. $L(f, P) = -\\frac{1}{4}, U(f, P) = 22$",
      "D. $L(f, P) = \\frac{1}{4}, U(f, P) = 22$",
    ],
    correctAnswer: "d",
    explanation:
      "Reescribimos la partición como $P = \\{2^{-2}, 2^{-1}, 2^0, 2^3\\}$. La función $f$ es decreciente en $(0, 1]$ y creciente en $(1, +\\infty)$, con valores $f(\\frac{1}{4}) = 2$, $f(\\frac{1}{2}) = 1$, $f(1) = 0$ y $f(8) = 3$. Por tanto: $$L(f,P) = \\left(\\frac{1}{2} - \\frac{1}{4}\\right)1 + \\left(1 - \\frac{1}{2}\\right)0 + (8 - 1)0 = \\frac{1}{4},$$ $$U(f,P) = \\left(\\frac{1}{2} - \\frac{1}{4}\\right)2 + \\left(1 - \\frac{1}{2}\\right)1 + (8 - 1)3 = \\frac{1}{2} + \\frac{1}{2} + 21 = 22.$$",
  },
  {
    id: "2023-01_q14",
    examId: "2023-01",
    topic: "integral-definida",
    type: "mc",
    points: 0.5,
    question:
      "Sea $F(x) = \\int_{3x}^{x^2} \\frac{1}{t^3 + 1} dt$, entonces",
    options: [
      "A. $F'(x) = \\frac{1}{x^3 + 1}$",
      "C. $F'(x) = -\\frac{1}{x^3 + 1}$",
      "B. $F'(x) = \\frac{2x}{x^6 + 1} - \\frac{3}{27x^3 + 1}$",
      "D. $F'(x) = \\frac{2}{x^5} + 2x - \\frac{1}{9x^3} - 3$",
    ],
    correctAnswer: "b",
    explanation:
      "Aplicando el teorema fundamental del cálculo con límites dependientes de $x$: $$F'(x) = f(x^2)\\cdot 2x - f(3x)\\cdot 3 = \\frac{1}{x^6 + 1}\\cdot 2x - \\frac{1}{27x^3 + 1}\\cdot 3 = \\frac{2x}{x^6 + 1} - \\frac{3}{27x^3 + 1}.$$",
  },
  {
    id: "2023-01_q15",
    examId: "2023-01",
    topic: "integral-definida",
    type: "mc",
    points: 0.5,
    question: "Sea $I = \\int_0^2 \\sqrt{2x^2 + 1} \\, x \\, dx$, entonces",
    options: [
      "A. $I = \\frac{14}{3}$",
      "C. $I = \\frac{1}{4} \\int_1^9 \\sqrt{u} \\, du$",
      "B. $I = \\frac{11}{3}$",
      "D. $I = \\frac{1}{4} \\int_0^2 \\sqrt{u} \\, du$",
    ],
    correctAnswer: "c",
    explanation:
      "Con el cambio $u = 2x^2 + 1$ tenemos $du = 4x\\,dx$, es decir, $x\\,dx = \\frac{du}{4}$. Los límites se transforman en $x = 0 \\Rightarrow u = 1$ y $x = 2 \\Rightarrow u = 9$: $$I = \\int_0^2 x\\sqrt{2x^2 + 1}\\,dx = \\frac{1}{4}\\int_1^9 \\sqrt{u}\\,du.$$",
  },
  {
    id: "2023-01_q16",
    examId: "2023-01",
    topic: "aplicaciones-integral",
    type: "mc",
    points: 0.5,
    question:
      "El área, $A$, entre las funciones $f(x) = \\frac{1}{x^2}$ y $g(x) = \\frac{-1}{1 + x^2}$ en el intervalo $[1, +\\infty)$ es",
    options: [
      "A. $A = +\\infty$",
      "C. $A = 1 - \\frac{\\pi}{4}$",
      "B. $A = 1 + \\frac{\\pi}{4}$",
      "D. $A = 1 + \\frac{\\pi}{2}$",
    ],
    correctAnswer: "b",
    explanation:
      "$f$ es positiva y $g$ negativa en todo el intervalo, así que $$A = \\int_1^{+\\infty}\\left(\\frac{1}{x^2} + \\frac{1}{1 + x^2}\\right)dx = \\lim_{M\\to +\\infty}\\left[-\\frac{1}{x}\\right]_1^M + \\left[\\arctan(x)\\right]_1^M = \\left(0 + 1\\right) + \\left(\\frac{\\pi}{2} - \\frac{\\pi}{4}\\right) = 1 + \\frac{\\pi}{4}.$$",
  },
  {
    id: "2023-01_q17",
    examId: "2023-01",
    topic: "aplicaciones-integral",
    type: "mc",
    points: 0.5,
    question:
      "El obelisco Millenium tiene una altura de 50 metros, secciones cuadradas, una base inferior de 4 metros y acaba en punta. Su volumen, V, en m³, es",
    options: [
      "A. $V = \\frac{200}{3}\\pi$",
      "C. $V = \\frac{400}{3}\\pi$",
      "B. $V = \\frac{400}{3}$",
      "D. $V = \\frac{800}{3}$",
    ],
    correctAnswer: "d",
    explanation:
      "El lado de la sección cuadrada decrece linealmente desde $4$ m en la base hasta $0$ en la punta: $l(x) = 4 - \\frac{2}{25}x$. El área de cada sección es $A(x) = l(x)^2$, luego $$V = \\int_0^{50} A(x)\\,dx = \\int_0^{50}\\left(4 - \\frac{2x}{25}\\right)^2 dx = \\left[-\\frac{25}{6}\\left(4 - \\frac{2x}{25}\\right)^3\\right]_0^{50} = \\frac{25}{6}\\cdot 64 = \\frac{800}{3}\\,\\text{m}^3.$$",
  },
  {
    id: "2023-01_q18",
    examId: "2023-01",
    topic: "integracion-numerica",
    type: "mc",
    points: 0.5,
    question:
      "Queremos aproximar el volumen que genera $f(x) = e^x$ al girar alrededor del eje OX en el intervalo $I = [0, 4]$. Si utilizamos una fórmula de punto medio compuesta con dos subintervalos, obtenemos",
    options: [
      "A. $\\pi \\left(e^2 + e^6\\right)$",
      "C. $2\\pi \\left(e^2 + e^6\\right)$",
      "B. $\\pi \\left(\\frac{e^8}{2} - \\frac{1}{2}\\right)$",
      "D. $2\\pi \\left(e + e^3\\right)$",
    ],
    correctAnswer: "c",
    explanation:
      "El volumen es $V = \\pi\\int_0^4 e^{2x}\\,dx$. Con la fórmula del punto medio compuesta con dos subintervalos de amplitud $2$ y puntos medios $x = 1$ y $x = 3$: $$V \\approx \\pi\\left(2e^{2\\cdot 1} + 2e^{2\\cdot 3}\\right) = 2\\pi\\left(e^2 + e^6\\right).$$",
  },
  {
    id: "2023-01_q19",
    examId: "2023-01",
    topic: "ecuaciones-diferenciales",
    type: "mc",
    points: 0.5,
    question:
      "La solución del problema de Cauchy $\\begin{cases} \\frac{dx}{dt} + xt = (t + 1)e^t \\\\ x(0) = 2 \\end{cases}$, es",
    options: [
      "A. $x(t) = e^{-\\frac{t^2}{2}} + e^t$",
      "C. $x(t) = -e^{-\\frac{t^2}{2}} + e^t$",
      "B. $x(t) = 2e^t$",
      "D. $x(t) = 2e^{\\frac{t^2}{2}}$",
    ],
    correctAnswer: "a",
    explanation: `Es una EDO lineal. El factor integrante es $\\mu(t) = e^{\\int t\\,dt} = e^{t^2/2}$. Multiplicando toda la ecuación:

$$
e^{t^2/2}x' + te^{t^2/2}x = (t+1)e^t e^{t^2/2} \\Rightarrow \\left(e^{t^2/2}x\\right)' = (t+1)e^{t + t^2/2}
$$

$$
\\Rightarrow e^{t^2/2}x = e^{t + t^2/2} + C \\Rightarrow x(t) = e^t + Ce^{-t^2/2}.
$$

Con la condición $x(0) = 2$: $2 = 1 + C \\Rightarrow C = 1$, luego $x(t) = e^t + e^{-t^2/2}$.`,
  },
  {
    id: "2023-01_q20",
    examId: "2023-01",
    topic: "ecuaciones-diferenciales",
    type: "mc",
    points: 0.5,
    question:
      "¿Qué funciones $g$ son tales que $(3x^2 + 1)g'(x) = 3xg(x)$?",
    options: [
      "A. $g(x) = \\sqrt{3x^2 + 1} + C$",
      "C. $g(x) = x^3 + x + C$",
      "B. $g(x) = C(3x^2 + 1)^2$",
      "D. $g(x) = C\\sqrt{3x^2 + 1}$",
    ],
    correctAnswer: "d",
    explanation:
      "Es una EDO de variables separables: $$\\frac{1}{y}\\,dy = \\frac{3x}{3x^2 + 1}\\,dx \\Rightarrow \\ln|y| = \\frac{1}{2}\\int \\frac{6x}{3x^2 + 1}\\,dx = \\frac{1}{2}\\ln|3x^2 + 1| + C,$$ y despejando, $y(x) = K\\sqrt{3x^2 + 1}$. Comprobación: $g'(x) = \\frac{3Kx}{\\sqrt{3x^2+1}}$, luego $(3x^2 + 1)g'(x) = 3Kx\\sqrt{3x^2 + 1} = 3xg(x)$.",
  },
  // ================================================================
  // Exam 2023-07
  // ================================================================

  {
    id: "2023-07_q1",
    examId: "2023-07",
    topic: "derivadas",
    type: "mc",
    points: 0.5,
    question:
      "Dada la función $ f(x) = \\begin{cases} x^{2} + ax + b & x < 1 \\\\ cx & x \\geq 1 \\end{cases} $ . Determinar a, b, c para que f sea derivable en todo su dominio, sabiendo que $ f(0) = f(4) $ .",
    options: [
      "A. $a = \\frac{-9}{4}, b = 4, c = 1$",
      "B. $a = \\frac{-7}{4}, b = 1, c = \\frac{1}{4}$",
      "C. $a = \\frac{-5}{4}, b = 2, c = \\frac{1}{2}$",
      "D. $a = \\frac{-3}{4}, b = \\frac{1}{2}, c = \\frac{1}{8}$",
    ],
    correctAnswer: "b",
  },
  {
    id: "2023-07_q2",
    examId: "2023-07",
    topic: "limites-continuidad",
    type: "mc",
    points: 0.5,
    question:
      "La función $ f(x) = \\left\\{ \\begin{array}{ll} k & \\text{si } x \\leq \\pi/4 \\\\ \\arctan(4x/\\pi) & \\text{si } x > \\pi/4 \\end{array} \\right. $",
    options: [
      "A. es continua en $x = \\pi /4$ si $k = 0$",
      "B. es continua en $x = \\pi /4$ si $k = \\pi /4$",
      "C. es continua en $x = \\pi /4$ si $k = 1$",
      "D. no es continua en $x = \\pi /4$ para cualquier valor de $k$",
    ],
    correctAnswer: "b",
  },
  {
    id: "2023-07_q3",
    examId: "2023-07",
    topic: "funciones-elementales",
    type: "mc",
    points: 0.5,
    question: "Resolviendo $ 5x^{2}-8x+5=0 $ obtenemos",
    options: [
      "A. $ x = 4 \\pm 3i $",
      "B. $ x = (4 \\pm 3i)/5 $",
      "C. $(4\\pm 3i) / 10$",
      "D. No tiene raíces complejas",
    ],
    correctAnswer: "b",
  },
  {
    id: "2023-07_q4",
    examId: "2023-07",
    topic: "aplicaciones-derivada",
    type: "mc",
    points: 0.5,
    question:
      "Halla $a, b$ y $c$ en la función $f(x) = ax^3 + bx^2 + cx + d$ sabiendo que el punto $P(0, 4)$ es un máximo y el punto $Q(2, 0)$ un mínimo.",
    options: [
      "A. $a = 1, b = -2, c = 1$",
      "B. $a = 1, b = -3, c = 0$",
      "C. $a = -1, b = -3, c = 0$",
      "D. $a = 1, b = -3, c = 1$",
    ],
    correctAnswer: "b",
  },
  {
    id: "2023-07_q5",
    examId: "2023-07",
    topic: "aplicaciones-derivada",
    type: "mc",
    points: 0.5,
    question:
      "La función $ y = (x^{2} + 3x + 1)/(x^{2} + 1) $ tiene",
    options: [
      "A. Dos máximos y un mínimo",
      "B. Dos mínimos y un máximo",
      "C. Dos máximos y dos mínimos",
      "D. Ninguna de las anteriores",
    ],
    correctAnswer: "d",
  },
  {
    id: "2023-07_q6",
    examId: "2023-07",
    topic: "metodos-numericos",
    type: "mc",
    points: 0.5,
    question:
      "La función $ y = x^{4}/2 + x^{3}/3 + x^{2}/2 - x $ tiene un extremo relativo. Si se aproxima dicho extremo mediante el método de Newton-Raphson, la sucesión que obtenemos es:",
    options: [
      "A. $x_{n + 1} = \\frac{4x_n^3 + x_n^2 + 1}{6x_n^2 + 2x_n + 1}$",
      "B. $x_{n + 1} = \\frac{4x_n^3 + 2x_n^2 + 1}{6x_n^2 + 2x_n + 1}$",
      "C. $x_{n + 1} = \\frac{4x_n^3 + x_n^2 + 2}{6x_n^2 + 2x_n + 1}$",
      "D. $x_{n + 1} = \\frac{2x_n^3 + x_n^2 + 1}{6x_n^2 + 2x_n + 1}$",
    ],
    correctAnswer: "a",
  },
  {
    id: "2023-07_q7",
    examId: "2023-07",
    topic: "metodos-numericos",
    type: "mc",
    points: 0.5,
    question:
      "Al aproximar la solución de la ecuación $ e^{-x} - ex = 0 $ mediante una iteración del método de Newton-Raphson arrancando de $ x_{0} = 0 $ se obtiene",
    options: [
      "A. $x_{1} = \\frac{-1}{1 + e}$",
      "B. $x_{1} = \\frac{1}{-1 + e}$",
      "C. $x_{1} = \\frac{1}{1 + e}$",
      "D. $x_{1} = \\frac{1}{1 - e}$",
    ],
    correctAnswer: "c",
  },
  {
    id: "2023-07_q8",
    examId: "2023-07",
    topic: "derivadas",
    type: "mc",
    points: 0.5,
    question:
      "La aproximación de ln 3 empleando el polinomio de Taylor de grado 3, centrado en $ x_0 = 0 $, para la función $ f(x) = \\ln \\left( \\frac{1 + x}{1 - x} \\right) $ es",
    options: [
      "A. $\\frac{13}{12}$",
      "B. $\\frac{11}{12}$",
      "C. $\\frac{12}{13}$",
      "D. $\\frac{12}{11}$",
    ],
    correctAnswer: "a",
  },
  {
    id: "2023-07_q9",
    examId: "2023-07",
    topic: "limites-continuidad",
    type: "mc",
    points: 0.5,
    question:
      "La función $f(x) = \\frac{5 \\cos(x) + x^2}{x - 3}$ tiene",
    options: [
      "A. Asintota vertical en $x = 0$",
      "B. $y = x$ asintota si $x\\to +\\infty$",
      "C. $y = x + 3$ asintota si $x\\to +\\infty$",
      "D. No tiene asintotas",
    ],
    correctAnswer: "c",
  },
  {
    id: "2023-07_q10",
    examId: "2023-07",
    topic: "funciones-elementales",
    type: "mc",
    points: 0.5,
    question:
      "La inversa de la función $f(x) = 3 \\left( \\ln \\left( \\frac{2}{x} \\right) + \\ln \\left( x^2 + x \\right) \\right)$, en su dominio, es",
    options: [
      "A. No existe",
      "B. $f^{-1}(x) = \\sqrt{\\frac{1}{3} e^x} - 1$",
      "C. $f^{-1}(x) = \\frac{1}{2} e^{\\frac{x}{3}} - 1$",
      "D. $f^{-1}(x) = e^{2(x + 1)}$",
    ],
    correctAnswer: "c",
  },
  {
    id: "2023-07_q11",
    examId: "2023-07",
    topic: "aplicaciones-derivada",
    type: "mc",
    points: 0.5,
    question: "La función $f(x) = x + \\arctan(x)$ es",
    options: [
      "A. Convexa en $(-1, 1)$",
      "B. Convexa en $(0, +\\infty)$",
      "C. Cóncava en $(-\\infty, 0)$",
      "D. Cóncava en $(0, +\\infty)$",
    ],
    correctAnswer: "d",
  },
  {
    id: "2023-07_q12",
    examId: "2023-07",
    topic: "derivadas",
    type: "mc",
    points: 0.5,
    question:
      "Si $P(x) = 7 + 3(x - 2) - 4(x - 2)^2 - 8(x - 2)^3 + 5(x - 2)^4$ es el polinomio de Taylor de grado cuatro de una función, entonces:",
    options: [
      "A. La recta tangente a dicha función en el punto $x = 2$ es $y = 3x + 7$",
      "B. La recta tangente a dicha función en el punto $x = 2$ es $y = 3x + 1$",
      "C. La recta tangente a dicha función en el punto $x = -2$ es $y = 3x + 13$",
      "D. La recta tangente a dicha función en el punto $x = -2$ es $y = 3x + 1$",
    ],
    correctAnswer: "b",
  },
  {
    id: "2023-07_q13",
    examId: "2023-07",
    topic: "integral-definida",
    type: "mc",
    points: 0.5,
    question:
      "¿Cuál de las siguientes funciones es una primitiva de $f(x) = \\ln(x)$?",
    options: [
      "A. $x(\\ln (x) - 1)$",
      "B. $\\frac{1}{x}$",
      "C. $|x^{-1}|$",
      "D. $x(\\ln (x) + 1)$",
    ],
    correctAnswer: "a",
  },
  {
    id: "2023-07_q14",
    examId: "2023-07",
    topic: "integral-definida",
    type: "mc",
    points: 0.5,
    question:
      "Sea la función $f(x) = \\arctan(x)$. Consideramos la partición $P = \\left\\{ -\\sqrt{3}, -\\frac{1}{\\sqrt{3}}, 0, 1 \\right\\}$. Elige la opción correcta:",
    options: [
      "A. $L(f,P) = \\frac{\\sqrt{3}}{2}\\pi ,\\quad U(f,P) = \\sqrt{3}\\pi$",
      "B. $L(f,P) = -\\frac{\\pi}{2},\\quad U(f,P) = \\frac{\\pi}{2}$",
      "C. $L(f,P) = -\\frac{\\pi}{2},\\quad U(f,P) = \\frac{\\pi}{4}$",
      "D. $L(f,P) = -\\frac{5\\pi\\sqrt{3}}{18},\\quad U(f,P) = \\left(\\frac{1}{4} -\\frac{1}{3\\sqrt{3}}\\right)\\pi$",
    ],
    correctAnswer: "d",
  },
  {
    id: "2023-07_q15",
    examId: "2023-07",
    topic: "integral-definida",
    type: "mc",
    points: 0.5,
    question:
      "La recta tangente a la función $F(x) = \\int_0^{x^2} (t + 1) \\, dt$ en el punto $x = 0$ es",
    options: [
      "A. $y = x$",
      "B. $y = 2x^{3} + 2x$",
      "C. No existe",
      "D. $y = 0$",
    ],
    correctAnswer: "d",
  },
  {
    id: "2023-07_q16",
    examId: "2023-07",
    topic: "integral-definida",
    type: "mc",
    points: 0.5,
    question:
      "Sea $I = \\int_0^{\\frac{\\pi}{2}} \\tan(x) \\, dx$. Entonces",
    options: [
      "A. $I = +\\infty$ (integral divergente)",
      "C. $I = \\ln \\left( \\frac{\\pi}{2} \\right)$",
      "B. $I = 1$",
      "D. $I = \\frac{\\pi}{2}$",
    ],
    correctAnswer: "a",
  },
  {
    id: "2023-07_q17",
    examId: "2023-07",
    topic: "integracion-numerica",
    type: "mc",
    points: 0.5,
    question:
      "Si aproximamos $\\int_1^3 \\ln(x) \\, dx$ mediante la fórmula de Simpson, obtenemos",
    options: [
      "A. $2\\ln (2)$",
      "B. $\\frac{1}{3} (4\\ln (2) + \\ln (3))$",
      "C. $3\\ln (3)$",
      "D. $(\\ln (1) + \\ln (3))$",
    ],
    correctAnswer: "b",
  },
  {
    id: "2023-07_q18",
    examId: "2023-07",
    topic: "aplicaciones-integral",
    type: "mc",
    points: 0.5,
    question:
      "El área comprendida entre las curvas $y = x$ e $y = x^2$ en el intervalo $[0, 2]$ es",
    options: [
      "A. $\\frac{2}{3}$",
      "B. 1",
      "C. $\\frac{1}{2}$",
      "D. $\\frac{1}{6}$",
    ],
    correctAnswer: "b",
  },
  {
    id: "2023-07_q19",
    examId: "2023-07",
    topic: "ecuaciones-diferenciales",
    type: "mc",
    points: 0.5,
    question:
      "Una solución de la EDO: $dx + e^{3x} dy = 0$, es",
    options: [
      "A. $y = \\frac{1}{3} e^{-3x} + \\frac{1}{2}$",
      "B. 1",
      "C. $\\frac{1}{2}$",
      "D. $\\frac{1}{6}$",
    ],
    correctAnswer: "a",
  },
  {
    id: "2023-07_q20",
    examId: "2023-07",
    topic: "ecuaciones-diferenciales",
    type: "mc",
    points: 0.5,
    question:
      "La solución de la EDO $xy' + 2y = x^2$, con condición inicial $y(1) = \\frac{9}{4}$, es",
    options: [
      "A. $y = \\frac{9}{4x^2}$",
      "B. $y = \\frac{x^2}{4} +\\frac{C}{x^2}$",
      "C. $y = \\frac{x^2}{4}$",
      "D. $y = \\frac{x^2}{4} +\\frac{2}{x^2}$",
    ],
    correctAnswer: "d",
  },

  // ================================================================
  // Exam 2024-01
  // ================================================================

  {
    id: "2024-01_q1",
    examId: "2024-01",
    topic: "limites-continuidad",
    type: "mc",
    points: 0.5,
    question:
      "La función $ f(x) = \\left\\{ \\begin{array}{ll} \\arctan(x), & x \\in [0,1] \\\\ x^{2} + k, & x \\in (1,2] \\end{array} \\right. $ , es continua en x = 1",
    options: [
      "A. para k = 0",
      "B. para $ k = \\frac{\\pi}{4} - 1 $",
      "C. para $ k = \\frac{\\pi}{2} - 1 $",
      "D. nunca puede ser continua en x = 1",
    ],
    correctAnswer: "b",
  },
  {
    id: "2024-01_q2",
    examId: "2024-01",
    topic: "funciones-elementales",
    type: "mc",
    points: 0.5,
    question:
      "Si $ g(x) = \\sqrt{5 - x} $ y $ f = g \\circ g $, entonces",
    options: [
      "A. $\\operatorname{Dom}(f) = [-20, 5], \\operatorname{Im}(f) = [0, \\sqrt{5}]$",
      "B. $\\operatorname{Dom}(f) = \\mathbb{R}, \\operatorname{Im}(f) = [0, \\sqrt{5}]$",
      "C. $\\operatorname{Dom}(f) = [-20, 5], \\operatorname{Im}(f) = \\mathbb{R}$",
      "D. $\\operatorname{Dom}(f) = \\mathbb{R}, \\operatorname{Im}(f) = \\mathbb{R}$",
    ],
    correctAnswer: "a",
  },
  {
    id: "2024-01_q3",
    examId: "2024-01",
    topic: "funciones-elementales",
    type: "mc",
    points: 0.5,
    question:
      "Sean $ f(x) = \\frac{x^2}{x^2 - 1} $ y $ g(x) = x \\cdot f(x) $, entonces",
    options: [
      "A. $f$ y $g$ tienen las mismas asíntotas",
      "B. $f$ tiene asíntotas oblicuas y $g$ asíntotas horizontales",
      "C. $f$ tiene asíntotas horizontales y $g$ asíntotas oblicuas",
      "D. $f$ y $g$ tienen solamente asíntotas verticales",
    ],
    correctAnswer: "c",
  },
  {
    id: "2024-01_q4",
    examId: "2024-01",
    topic: "funciones-elementales",
    type: "mc",
    points: 0.5,
    question:
      "Sean $a \\in \\mathbb{R}$ y $f(x) = \\ln \\left(2x + \\sqrt{4x^2 + a^2}\\right)$. Entonces $f$ es impar si",
    options: [
      "A. a = 0",
      "B. $a^2 = 2$",
      "C. $a = \\pm 2$",
      "D. $a^2 = 1$",
    ],
    correctAnswer: "d",
  },
  {
    id: "2024-01_q5",
    examId: "2024-01",
    topic: "metodos-numericos",
    type: "mc",
    points: 0.5,
    question:
      "Aproximamos una raíz de $ h(x) = |x + 2| - 3 $ mediante el algoritmo de dicotomía. Está asegurada la convergencia",
    options: [
      "A. en $ [-1, 10] $",
      "B. en $ [-3, -1] $",
      "C. en [2, 3]",
      "D. en ningún intervalo $[a, b]$",
    ],
    correctAnswer: "a",
  },
  {
    id: "2024-01_q6",
    examId: "2024-01",
    topic: "limites-continuidad",
    type: "mc",
    points: 0.5,
    question:
      "Sea $ f(x) = \\begin{cases} x^2, & x \\leq 0 \\\\ x \\sin \\frac{1}{x}, & x > 0 \\end{cases} $. Entonces:",
    options: [
      "A. $f$ tiene una discontinuidad esencial en $x = 0$",
      "B. $f$ es continua en $\\mathbb{R}$",
      "C. $f$ tiene una discontinuidad evitable en $x = 0$",
      "D. $ \\nexists\\lim_{x\\to0^{+}}f(x) $",
    ],
    correctAnswer: "b",
  },
  {
    id: "2024-01_q7",
    examId: "2024-01",
    topic: "metodos-numericos",
    type: "mc",
    points: 0.5,
    question:
      "El polinomio de interpolación de Lagrange que pasa por los puntos $ (-2,3) $ , $ (1,2) $ , $ (0,1) $ , $ (-1,3) $ , $ (-2,1) $ es:",
    options: [
      "A. $p(x) = 3x^{3} + x + 1$",
      "B. No existe",
      "C. $p(x) = x^{3} + 1$",
      "D. $p(x) = 3x^{4} + x + 1$",
    ],
    correctAnswer: "b",
  },
  {
    id: "2024-01_q8",
    examId: "2024-01",
    topic: "aplicaciones-derivada",
    type: "mc",
    points: 0.5,
    question:
      "Los puntos (o el punto) en la curva de $ f(x) = x\\sqrt{1 - x^{2}} $ , $ x \\in [-1, 1] $ donde la recta tangente es horizontal son",
    options: [
      "A. $ (0,0) $",
      "B. $\\left(-\\frac{1}{\\sqrt{2}},\\frac{1}{2}\\right)\\mathrm{y}\\left(\\frac{1}{\\sqrt{2}}, - \\frac{1}{2}\\right)$",
      "C. $\\left(\\frac{1}{2},\\frac{\\sqrt{3}}{4}\\right)$",
      "D. $\\left(-\\frac{1}{\\sqrt{2}}, - \\frac{1}{2}\\right)\\mathrm{y}\\left(\\frac{1}{\\sqrt{2}},\\frac{1}{2}\\right)$",
    ],
    correctAnswer: "d",
  },
  {
    id: "2024-01_q9",
    examId: "2024-01",
    topic: "derivadas",
    type: "mc",
    points: 0.5,
    question:
      "El polinomio de Taylor de grado n que aproxima $ f(x) = \\frac{1}{1-x} $ con $ x_{0} = 0 $ es",
    options: [
      "A. $\\sum_{i=0}^{n} \\frac{x^i}{i!}$",
      "B. $\\sum_{i=0}^{n} x^i$",
      "C. $\\sum_{i=1}^{n} \\frac{x^i}{i!}$",
      "D. 0",
    ],
    correctAnswer: "b",
  },
  {
    id: "2024-01_q10",
    examId: "2024-01",
    topic: "metodos-numericos",
    type: "mc",
    points: 0.5,
    question:
      "Una escultura consta de una columna cilíndrica de altura 1m y radio $r$ y de una semi-esfera, colocada sobre la columna, también de radio $r$. El volumen total es de 1m$^3$. Si aproximamos $r$ con el método de Newton-Raphson, tomando $r_0 = 1$, entonces",
    options: [
      "A. $r_1 = \\frac{1+7\\pi}{12\\pi}$",
      "B. $r_1 = \\frac{3+7\\pi}{12\\pi}$",
      "C. $r_1 = \\frac{5+7\\pi}{12\\pi}$",
      "D. $r_1 = \\frac{7+7\\pi}{12\\pi}$",
    ],
    correctAnswer: "b",
  },
  {
    id: "2024-01_q11",
    examId: "2024-01",
    topic: "aplicaciones-derivada",
    type: "mc",
    points: 0.5,
    question:
      "Una granjera dispone de 24 m de tela metálica. Con ella quiere construir un corral rectangular, aprovechando como uno de los lados un muro de piedra, suficientemente largo, ya existente. La superficie máxima de este corral, $S$, será",
    options: [
      "A. $S = 72 \\text{ m}^2$",
      "B. $S = 144 \\text{ m}^2$",
      "C. $S = 12 \\text{ m}^2$",
      "D. $S = 36 \\text{ m}^2$",
    ],
    correctAnswer: "a",
  },
  {
    id: "2024-01_q12",
    examId: "2024-01",
    topic: "derivadas",
    type: "mc",
    points: 0.5,
    question:
      "Consideramos la función $f(x) = (\\arctan(x))^{\\ln(x)}$. Su derivada es",
    options: [
      "A. $f'(x) = f(x) \\left( \\frac{\\ln(\\arctan(x))}{x} + \\frac{\\ln(x)}{\\arctan(x)} \\right)$",
      "B. $f'(x) = f(x) \\left( \\frac{\\arctan(x)}{x} + \\frac{\\ln(x)}{(1+x^2)\\arctan(x)} \\right)$",
      "C. $f'(x) = f(x) \\left( \\frac{\\ln(\\arctan(x))}{x} + \\frac{\\ln(x)}{(1+x^2)\\arctan(x)} \\right)$",
      "D. $f'(x) = \\ln(x) (\\arctan(x))^{\\ln(x)-1}$",
    ],
    correctAnswer: "c",
  },
  {
    id: "2024-01_q13",
    examId: "2024-01",
    topic: "derivadas",
    type: "mc",
    points: 0.5,
    question:
      "Consideramos la función $f(x) = \\cos(x)$. Sea $P_2$ su polinomio de Taylor de orden 2 centrado en $x_0 = 0$. Entonces existe $\\xi \\in (0, 1)$ tal que",
    options: [
      "A. $f(1) = P_2(1) - \\sin(\\xi)$",
      "B. $f(1) = P_2(1) - \\frac{\\cos(\\xi)}{2}$",
      "C. $f(1) = P_2(1) + \\frac{\\sin(\\xi)}{6}$",
      "D. $f(1) = P_2(1) + \\frac{\\sin(\\xi)\\xi^3}{6}$",
    ],
    correctAnswer: "c",
  },
  {
    id: "2024-01_q14",
    examId: "2024-01",
    topic: "integral-definida",
    type: "mc",
    points: 0.5,
    question:
      "Sea la función $f(x) = \\begin{cases} -1, & x \\in [0, 1] \\\\ 1, & x \\in (1, 2] \\end{cases}$. Entonces, $F(x) = \\int_0^x f(t) dt$ es",
    options: [
      "A. $F(x) = \\begin{cases} -x, & x \\in [0, 1] \\\\ x, & x \\in (1, 2] \\end{cases}$",
      "B. $F(x) = \\begin{cases} -t, & x \\in [0, 1] \\\\ t-2, & x \\in (1, 2] \\end{cases}$",
      "C. $F(x) = \\begin{cases} -x, & x \\in [0, 1] \\\\ x-2, & x \\in (1, 2] \\end{cases}$",
      "D. $F(x) = \\begin{cases} x, & x \\in [0, 1] \\\\ x-2, & x \\in (1, 2] \\end{cases}$",
    ],
    correctAnswer: "c",
  },
  {
    id: "2024-01_q15",
    examId: "2024-01",
    topic: "integral-definida",
    type: "mc",
    points: 0.5,
    question:
      "La suma superior de Riemann que aproxima la integral $\\int_0^4 |x^2 - 5x + 6| dx$ para la partición $P = \\{0, 1, 2, 3, 4\\}$ es",
    options: [
      "A. $U(P, f) = 39/4$",
      "B. $U(P, f) = 41/4$",
      "C. $U(P, f) = 43/4$",
      "D. $U(P, f) = 45/4$",
    ],
    correctAnswer: "b",
  },
  {
    id: "2024-01_q16",
    examId: "2024-01",
    topic: "integracion-numerica",
    type: "mc",
    points: 0.5,
    question:
      "La tabla muestra la velocidad de un vehículo en distintos tiempos, $t$. Aproxima la distancia recorrida, $d = \\int_0^8 v(t) dt$, con Simpson compuesto.",
    options: ["A. 68", "B. 208/3", "C. 32", "D. 416/3"],
    correctAnswer: "b",
  },
  {
    id: "2024-01_q17",
    examId: "2024-01",
    topic: "integral-definida",
    type: "mc",
    points: 0.5,
    question:
      "Sea $I = \\int x^2 \\sqrt{x+3} dx$, si hacemos el cambio de variable $t^2 = x + 3$",
    options: [
      "A. $I = \\int 4t^4 dt$",
      "B. $I = \\int (t^2 - 3)^2 2t dt$",
      "C. $I = \\int (t^2 - 3)^2 2t^2 dt$",
      "D. $I = \\int (t+3) 2t^2 dt$",
    ],
    correctAnswer: "c",
  },
  {
    id: "2024-01_q18",
    examId: "2024-01",
    topic: "aplicaciones-integral",
    type: "mc",
    points: 0.5,
    question:
      "El área, $A$, entre las gráficas de $f(x) = \\frac{1}{\\sqrt{x}}$ y $g(x) = 1 - x$ en $I = (0, 1)$ es",
    options: [
      "A. $A = 1$",
      "B. $A = +\\infty$",
      "C. $A = 2$",
      "D. $A = \\frac{3}{2}$",
    ],
    correctAnswer: "d",
  },
  {
    id: "2024-01_q19",
    examId: "2024-01",
    topic: "ecuaciones-diferenciales",
    type: "mc",
    points: 0.5,
    question:
      "Un condensador eléctrico se descarga a través de una resistencia, perdiendo voltaje a un ritmo proporcional al voltaje restante. Representamos $v(t)$ como el voltaje en el instante $t$. Si $v(0) = 100\\text{V}$ y desciende a 50V en 3 segundos, entonces",
    options: [
      "A. $v(t) = 100e^{-\\frac{\\ln(2)}{3}t}$",
      "B. $v(t) = 100e^{-t}$",
      "C. $v(t) = e^{-\\frac{\\ln(2)}{3}t}$",
      "D. $v(t) = 100e^{-\\frac{\\ln(1/2)}{3}t}$",
    ],
    correctAnswer: "a",
  },
  {
    id: "2024-01_q20",
    examId: "2024-01",
    topic: "ecuaciones-diferenciales",
    type: "mc",
    points: 0.5,
    question:
      "La solución del problema de valor inicial $y' + \\frac{1}{x}y = \\frac{1}{x+x^3}$, $y(1) = 0$, cumple:",
    options: [
      "A. $y(\\sqrt{3}) = 0$",
      "B. $y(\\sqrt{3}) = \\frac{-\\pi}{4\\sqrt{3}}$",
      "C. $y(\\sqrt{3}) = \\frac{\\frac{\\pi}{3} - \\frac{\\pi}{4}}{\\sqrt{3}}$",
      "D. $y(\\sqrt{3}) = \\frac{\\pi}{3\\sqrt{3}}$",
    ],
    correctAnswer: "c",
  },

  // ================================================================
  // Exam 2024-07
  // ================================================================

  {
    id: "2024-07_q1",
    examId: "2024-07",
    topic: "limites-continuidad",
    type: "mc",
    points: 0.5,
    question: `La función $f(x) = \\left\\{ \\begin{array}{ll} \\tan(x), & x \\in \\left[0, \\frac{\\pi}{2}\\right) \\ \\cos(x) + k, & x \\in \\left[\\frac{\\pi}{2}, \\pi\\right] \\end{array} \\right.$ , es continua en $x = \\frac{\\pi}{2}$`,
    options: [
      "A. para k = 0",
      "B. para k = 1",
      "C. para $k = \\frac{\\pi}{2}$",
      "D. nunca puede ser continua en $x = \\frac{\\pi}{2}$",
    ],
    correctAnswer: "d",
  },
  {
    id: "2024-07_q2",
    examId: "2024-07",
    topic: "limites-continuidad",
    type: "mc",
    points: 0.5,
    question: "Sea $f(x) = \\frac{x}{|x|}$, $x \\neq 0$. Entonces",
    options: [
      "A. $\\lim_{x\\to0}f(x)=1$",
      "B. $\\lim_{x\\to0}f(x)=-1$",
      "C. $\\nexists\\lim_{x\\to0}f(x)$",
      "D. $\\lim_{x\\to0}f(x)=\\infty$",
    ],
    correctAnswer: "c",
  },
  {
    id: "2024-07_q3",
    examId: "2024-07",
    topic: "metodos-numericos",
    type: "mc",
    points: 0.5,
    question:
      "Queremos aproximar una raíz de $f(x) = \\frac{1}{2}x^{3} - 2x^{2} + 2$ en el intervalo [1, 4] mediante el método de dicotomía. Entonces",
    options: [
      "A. $x_{2} = \\frac{7}{4}$",
      "B. $x_{2} = \\frac{5}{2}$",
      "C. $x_{2}=\\frac{13}{4}$",
      "D. No es posible aplicar dicotomía",
    ],
    correctAnswer: "d",
  },
  {
    id: "2024-07_q4",
    examId: "2024-07",
    topic: "funciones-elementales",
    type: "mc",
    points: 0.5,
    question: "Sea $f(x) = \\frac{2^x}{1 + 2^x}$. Entonces",
    options: [
      "A. $f$ no es inyectiva en $\\operatorname{Dom}(f)$",
      "B. $f$ es inyectiva en $\\operatorname{Dom}(f)$ y $f^{-1}(x) = \\log \\frac{x}{1 - x}$",
      "C. $f$ es inyectiva en $\\operatorname{Dom}(f)$ y $f^{-1}(x) = \\log_{10}\\frac{x}{1 - x}$",
      "D. $f$ es inyectiva en $\\operatorname{Dom}(f)$ y $f^{-1}(x) = \\log_2\\frac{x}{1 - x}$",
    ],
    correctAnswer: "d",
  },
  {
    id: "2024-07_q5",
    examId: "2024-07",
    topic: "derivadas",
    type: "mc",
    points: 0.5,
    question:
      "Sea la función $y = y(x)$ definida de manera implícita por la ecuación $x^{2} - xy + y^{2} = 9$. Entonces",
    options: [
      "A. $y''(x) = \\frac{-54}{(2y - x)^{3}}$",
      "B. $y'(x) = \\frac{y + 2x}{2y - x}$",
      "C. $y'(x) = \\frac{y - 2x}{2y + x}$",
      "D. $y'(x) = \\frac{y}{2y - x}$",
    ],
    correctAnswer: "a",
  },
  {
    id: "2024-07_q6",
    examId: "2024-07",
    topic: "metodos-numericos",
    type: "mc",
    points: 0.5,
    question:
      "El polinomio de Lagrange lineal que interpola los puntos $(x_{1}, f(x_{1}))$ y $(x_{2}, f(x_{2}))$ es",
    options: [
      "A. $P(x) = \\frac{(x - x_2)}{(x_1 - x_2)} f(x_1) + \\frac{(x - x_1)}{(x_2 - x_1)} f(x_2)$",
      "B. $P(x) = \\frac{(x_1 - x_2)}{(x - x_2)} f(x_1) + \\frac{(x_2 - x_1)}{(x - x_1)} f(x_2)$",
      "C. $P(x) = \\frac{f(x_1) - f(x_2)}{(x_1 - x_2)} x + \\frac{x_1f(x_2) - x_2f(x_1)}{(x_1 - x_2)}$",
      "D. $P(x) = \\frac{x}{(x_1 - x_2)} f(x_1) + \\frac{x}{(x_2 - x_1)} f(x_2)$",
    ],
    correctAnswer: "a",
  },
  {
    id: "2024-07_q7",
    examId: "2024-07",
    topic: "limites-continuidad",
    type: "mc",
    points: 0.5,
    question:
      "Sea $L = \\lim_{x\\to \\infty}\\left(1 - \\frac{3}{x}\\right)^{2x}$. Entonces",
    options: [
      "A. $L = e^{-6}$",
      "B. $L = e^{6}$",
      "C. L = 6",
      "D. L = -6",
    ],
    correctAnswer: "a",
  },
  {
    id: "2024-07_q8",
    examId: "2024-07",
    topic: "aplicaciones-derivada",
    type: "mc",
    points: 0.5,
    question: `La función $f(x) = \\left\\{ \\begin{array}{ll} \\ln(x), & x \\in (0,1) \\ \\cos(x), & x \\in [1,\\pi] \\end{array} \\right.$`,
    options: [
      "A. alcanza el máximo absoluto en $x = \\frac{\\pi}{2}$",
      "C. no tiene máximo absoluto",
      "B. alcanza el mínimo absoluto en $x = \\pi$",
      "D. alcanza el máximo absoluto en x = 1",
    ],
    correctAnswer: "d",
  },
  {
    id: "2024-07_q9",
    examId: "2024-07",
    topic: "aplicaciones-derivada",
    type: "mc",
    points: 0.5,
    question:
      "La mayor superficie, S, entre todos los rectángulos situados en el primer cuadrante, que tienen dos lados sobre los ejes de coordenadas y un vértice sobre la recta $x + 2y = 4$, es",
    options: [
      "A. S = 2",
      "B. S = 4",
      "C. S = 0",
      "D. $S = \\frac{3}{2}$",
    ],
    correctAnswer: "a",
  },
  {
    id: "2024-07_q10",
    examId: "2024-07",
    topic: "derivadas",
    type: "mc",
    points: 0.5,
    question:
      "Queremos aproximar el valor de $e^{\\sqrt{1.5}}$. Para ello usamos la función $f(x) = e^{\\sqrt{x-1}}$ y su polinomio de Taylor de orden 1 centrado en $x_0 = 2$. El resultado es",
    options: [
      "A. $e^{\\sqrt{1.5}} \\approx e + \\frac{e}{4}$",
      "B. $e^{\\sqrt{1.5}} \\approx e + \\frac{e}{2}$",
      "C. $e^{\\sqrt{1.5}} \\approx e - \\frac{e}{4}$",
      "D. $e^{\\sqrt{1.5}} \\approx e$",
    ],
    correctAnswer: "a",
  },
  {
    id: "2024-07_q11",
    examId: "2024-07",
    topic: "integral-definida",
    type: "mc",
    points: 0.5,
    question:
      "La suma superior de Riemann para la función $f(x) = x^3 + x^2 + 1$ y la partición $P = \\{-2, -1, 0, 1\\}$, es",
    options: [
      "A. $U(P, f) = 5$",
      "B. $U(P, f) = 4 + \\frac{31}{27}$",
      "C. $U(P, f) = 2 + \\frac{31}{27}$",
      "D. $U(P, f) = 3$",
    ],
    correctAnswer: "b",
  },
  {
    id: "2024-07_q12",
    examId: "2024-07",
    topic: "metodos-numericos",
    type: "mc",
    points: 0.5,
    question: `El volumen de un casquete esférico de altura $h$ y radio 1 viene dado por

$$V(h) = \\pi \\frac{h^2}{3} (3 - h).$$

Aproxima, con una iteración del método de Newton-Raphson, tomando $h_0 = 1$, el valor de $h$ para que el volumen del casquete sea igual al volumen de la esfera con $r = \\frac{1}{2}$.`,
    options: [
      "A. $h_1 = \\frac{3}{2}$",
      "B. $h_1 = \\frac{1}{2}$",
      "C. $h_1 = 1$",
      "D. $h_1 = 0$",
    ],
    correctAnswer: "b",
  },
  {
    id: "2024-07_q13",
    examId: "2024-07",
    topic: "aplicaciones-derivada",
    type: "mc",
    points: 0.5,
    question:
      "Sea la función $f(x) = x^4 - 4ax^2 + b$, siendo $a$ y $b$ números reales. Para que $f$ sea convexa en todo su dominio debe cumplirse:",
    options: [
      "A. $a > 0$, $b$ cualquiera",
      "B. $a \\le 0$, $b$ cualquiera",
      "C. $a < -1$, $b < 3$",
      "D. Ninguna de las anteriores",
    ],
    correctAnswer: "b",
  },
  {
    id: "2024-07_q14",
    examId: "2024-07",
    topic: "integracion-numerica",
    type: "mc",
    points: 0.5,
    question: `La velocidad de un móvil en función del tiempo viene dada por

| Tiempo(s) | 2 | 5 | 7 | 9 |
| --- | --- | --- | --- | --- |
| Velocidad(m/s) | 12 | 16 | 24 | 15 |

Sabiendo que el espacio es la integral de la velocidad respecto al tiempo, emplear la regla del trapecio compuesta para calcular el espacio recorrido por el objeto entre los tiempos $t = 2$ y $t = 9$ segundos.`,
    options: ["A. 215", "B. 119", "C. 121", "D. 193"],
    correctAnswer: "c",
  },
  {
    id: "2024-07_q15",
    examId: "2024-07",
    topic: "integral-definida",
    type: "mc",
    points: 0.5,
    question:
      "Si $F(x) = \\int_1^{x^2} \\sqrt{t^2 + 3} \\, dt$, entonces $F'(2) =$",
    options: [
      "A. $4\\sqrt{19}$",
      "B. $2\\sqrt{19}$",
      "C. $4\\sqrt{7}$",
      "D. $2\\sqrt{7}$",
    ],
    correctAnswer: "a",
  },
  {
    id: "2024-07_q16",
    examId: "2024-07",
    topic: "aplicaciones-integral",
    type: "mc",
    points: 0.5,
    question:
      "Dada la función $y = \\sqrt{x} \\ln x$, consideramos la superficie limitada por dicha función y las rectas $x = 1$, $x = e$. Calcula el volumen de revolución generado al rotar esa superficie en torno al eje $OX$.",
    options: [
      "A. $V = \\frac{\\pi(1-e^2)}{4}$",
      "B. $V = \\frac{\\pi(e^2-1)}{4}$",
      "C. $V = \\frac{\\pi(e-1)}{4}$",
      "D. $V = \\frac{\\pi(e^2-1)}{2}$",
    ],
    correctAnswer: "b",
  },
  {
    id: "2024-07_q17",
    examId: "2024-07",
    topic: "integral-definida",
    type: "mc",
    points: 0.5,
    question: "Sea $I = \\int_2^4 \\frac{dx}{\\sqrt{x-2}}$. Entonces",
    options: [
      "A. $I = 2\\sqrt{2}$",
      "B. $I = \\infty$",
      "C. $I = \\sqrt{2}$",
      "D. $I = 0$",
    ],
    correctAnswer: "a",
  },
  {
    id: "2024-07_q18",
    examId: "2024-07",
    topic: "aplicaciones-integral",
    type: "mc",
    points: 0.5,
    question:
      "Las secciones de una figura por planos verticales son semicírculos de radio $\\sqrt{3-x^2}$, $x \\in [0, \\sqrt{3}]$. El volumen de dicha figura es",
    options: [
      "A. $V = 2\\pi^2\\sqrt{3}$",
      "B. $V = \\sqrt{3}$",
      "C. $V = 2\\pi\\sqrt{3}$",
      "D. $V = \\pi\\sqrt{3}$",
    ],
    correctAnswer: "d",
  },
  {
    id: "2024-07_q19",
    examId: "2024-07",
    topic: "ecuaciones-diferenciales",
    type: "mc",
    points: 0.5,
    question:
      "Un modelo de regularización homeostática se rige por la e.d.o. $\\frac{dy}{dx} = \\frac{1}{\\theta}\\frac{y}{x}$, con $\\theta$ una constante mayor que 1. La solución general de esta ecuación es",
    options: [
      "A. $y(x) = C\\theta x$, con C constante",
      "B. $y(x) = C e^{1/\\theta}$, con C constante",
      "C. $y(x) = C x^{1/\\theta}$, con C constante",
      "D. $y(x) = 2 x^{1/\\theta}$",
    ],
    correctAnswer: "c",
  },
  {
    id: "2024-07_q20",
    examId: "2024-07",
    topic: "ecuaciones-diferenciales",
    type: "mc",
    points: 0.5,
    question: "Sea $y' + 3y = e^{2t}$. La solución general de la e.d.o. es:",
    options: [
      "A. $y(x) = e^{2x}$",
      "B. $y(t) = \\frac{1}{5}e^{2t}$",
      "C. $y(t) = \\frac{1}{5}e^{2t} + e^{-3t} + C$",
      "D. $y(t) = \\frac{1}{5}e^{2t} + C e^{-3t}$",
    ],
    correctAnswer: "d",
  },

  // ================================================================
  // Exam 2025-01
  // ================================================================

  {
    id: "2025-01_q1",
    examId: "2025-01",
    topic: "metodos-numericos",
    type: "mc",
    points: 10/15,
    question:
      "Para aproximar la raíz de la ecuación $e^{x} - 3x = 0$ en el intervalo [0,1] mediante el método de bisección, ¿cuántas iteraciones debemos realizar para que la raíz obtenida tenga cuatro decimales significativos correctos?",
    options: ["A. 4", "B. 10", "C. 14", "D. El método de dicotomía no puede aplicarse en este caso."],
    correctAnswer: "c",
  },
  {
    id: "2025-01_q2",
    examId: "2025-01",
    topic: "metodos-numericos",
    type: "mc",
    points: 10/15,
    question:
      "Sabiendo que una función f tiene una raíz r en el intervalo $(0,2)$, y que además $f(0)=16$, $f(1)=1$ y $f(2)=4$, la estimación de r mediante el polinomio de interpolación de Lagrange de orden 2 es",
    options: ["A. $\\frac{4}{3}$", "B. $\\frac{5}{3}$", "C. 16", "D. $\\frac{13}{8}$"],
    correctAnswer: "a",
  },
  {
    id: "2025-01_q3",
    examId: "2025-01",
    topic: "limites-continuidad",
    type: "mc",
    points: 10/15,
    question: `Sea la función

$$
f (x) = \\left\\{ \\begin{array}{l l} x ^ {2} + \\ln (2 - x) & \\text { si } x <   1 \\\\ K & \\text { si } x = 1 \\\\ \\ln (x - 1) & \\text { si } x > 1 \\end{array} \\right.
$$

¿Qué valor debe tomar K para que f sea continua en x = 1?`,
    options: [
      "A. La función será discontinua para cualquier valor de K",
      "B. K = 1",
      "C. K = 0",
      "D. $K = \\ln (2)$",
    ],
    correctAnswer: "a",
  },
  {
    id: "2025-01_q4",
    examId: "2025-01",
    topic: "funciones-elementales",
    type: "mc",
    points: 10/15,
    question: "¿Cuál de las siguientes funciones tiene inversa en R?",
    options: [
      "A. $f(x) = x^{3} + x - 1$",
      "B. $f(x) = x^{3} - x + 1$",
      "C. $f(x) = \\sin x$",
      "D. Ninguna de las otras",
    ],
    correctAnswer: "a",
  },
  {
    id: "2025-01_q5",
    examId: "2025-01",
    topic: "derivadas",
    type: "mc",
    points: 10/15,
    question: `La curva con ecuación implícita:

$$
x ^ {3} + 2 y ^ {3} = 3 x y,
$$

define tres posibles valores de y para cada $x \\in (0,1)$. La aproximación de $y(1/2)$ utilizando el polinomio de Taylor de primer orden para la función y centrado en $x_{0} = 1$ y considerando el mayor de los 3 posibles valores de y en $x_{0}$, es`,
    options: ["A. $\\frac{1}{2}$", "B. 1", "C. $\\frac{3}{2}$", "D. 2"],
    correctAnswer: "b",
  },
  {
    id: "2025-01_q6",
    examId: "2025-01",
    topic: "derivadas",
    type: "mc",
    points: 10/15,
    question:
      "Consideramos $P_{2}$, el polinomio de Taylor de orden 2 centrado en $x_{0}=1$, para la función $f(x)=x\\ln(x)$. Entonces",
    options: [
      "A. $\\left|f\\left(\\frac{1}{2}\\right)-P_{2}\\left(\\frac{1}{2}\\right)\\right|\\leq\\frac{1}{48}\\frac{1}{\\xi^{2}}(x-1)^{3},\\quad\\xi\\in\\left(0,\\frac{1}{2}\\right)$",
      "B. $\\left|f\\left(\\frac{1}{2}\\right)-P_{2}\\left(\\frac{1}{2}\\right)\\right|\\leq\\frac{1}{8}\\frac{1}{\\xi^{2}},\\quad\\xi\\in\\left(0,\\frac{1}{2}\\right)$",
      "C. $\\left|f\\left(\\frac{1}{2}\\right)-P_{2}\\left(\\frac{1}{2}\\right)\\right|\\leq\\frac{1}{48}\\frac{1}{\\xi^{2}},\\quad\\xi\\in\\left(0,\\frac{1}{2}\\right)$",
      "D. $\\left|f\\left(\\frac{1}{2}\\right)-P_{2}\\left(\\frac{1}{2}\\right)\\right|\\leq\\frac{1}{48}\\frac{1}{\\xi^{3}},\\quad\\xi\\in\\left(0,\\frac{1}{2}\\right)$",
    ],
    correctAnswer: "c",
  },
  {
    id: "2025-01_q7",
    examId: "2025-01",
    topic: "metodos-numericos",
    type: "mc",
    points: 10/15,
    question:
      "Buscamos el punto en el que la función $f(x) = e^x$ se corta con su polinomio de Taylor de orden uno centrado en $a = 0$. Si utilizamos el método de Newton para aproximar ese punto, empezando en $x_0 = 1$, el resultado de la primera iteración será",
    options: [
      "A. $x_1 = \\frac{e - 1}{e}$",
      "C. $x_1 = \\frac{e - 2}{e - 1}$",
      "B. $x_1 = \\frac{e + 1}{e - 1}$",
      "D. $x_1 = \\frac{1}{e - 1}$",
    ],
    correctAnswer: "d",
  },
  {
    id: "2025-01_q8",
    examId: "2025-01",
    topic: "aplicaciones-derivada",
    type: "mc",
    points: 10/15,
    question:
      "Se quiere construir un prisma de base cuadrada y volumen constante, V m$^3$ (V > 0). La arista del cuadrado, $x$, que minimiza la cantidad de material necesario para construir este prisma es",
    options: [
      "A. $x = \\sqrt[3]{V} \\text{ m}$",
      "C. $x = \\frac{V}{2} \\text{ m}$",
      "B. $x = \\sqrt{V} \\text{ m}$",
      "D. $x = 0 \\text{ m}$",
    ],
    correctAnswer: "a",
  },
  {
    id: "2025-01_q9",
    examId: "2025-01",
    topic: "limites-continuidad",
    type: "mc",
    points: 10/15,
    question: "Sea $f(x) = \\arcsin(1 - x^2)$. Entonces",
    options: [
      "A. $f \\in \\mathcal{C}^\\infty(\\mathbb{R})$",
      "C. $f \\in \\mathcal{C}^0([-\\sqrt{2}, \\sqrt{2}])$",
      "B. $f \\in \\mathcal{C}^\\infty([-\\sqrt{2}, \\sqrt{2}])$",
      "D. $f \\in \\mathcal{C}^1([-1, 1])$",
    ],
    correctAnswer: "c",
  },
  {
    id: "2025-01_q10",
    examId: "2025-01",
    topic: "integral-definida",
    type: "mc",
    points: 10/15,
    question:
      "Calcula la suma inferior de Riemann para la función $f(x) = -x^3 + 3x - 2$ en el intervalo $[-3, 3]$, utilizando la partición $P = \\{-3, 0, 2, 3\\}$",
    options: ["A. $-42$", "C. $40$", "B. $-40$", "D. $42$"],
    correctAnswer: "b",
  },
  {
    id: "2025-01_q11",
    examId: "2025-01",
    topic: "aplicaciones-integral",
    type: "mc",
    points: 10/15,
    question:
      "Para calcular el volumen que genera la curva $y = \\sin(x)$ al girar alrededor del eje $OX$ en el intervalo $[0, \\frac{\\pi}{2}]$ hay que resolver una integral. Si aproximamos dicha integral mediante el método de Simpson simple, el volumen obtenido es",
    options: [
      "A. $\\frac{\\pi^2}{8}$",
      "C. $\\frac{\\pi^2}{3}$",
      "B. $\\frac{\\pi^2}{4}$",
      "D. $\\frac{\\pi^2}{2}$",
    ],
    correctAnswer: "b",
  },
  {
    id: "2025-01_q12",
    examId: "2025-01",
    topic: "derivadas",
    type: "mc",
    points: 10/15,
    question: `Sea $F$ la función definida mediante la integral

$$F(x) = \\int_0^x e^t \\cos(t) \\, dt.$$

El polinomio de Taylor de orden 2 para $F$ centrado en $x_0 = 0$ es`,
    options: [
      "A. $P_2(x) = -x + \\frac{1}{2}x^2$",
      "C. $P_2(x) = -x - \\frac{1}{2}x^2$",
      "B. $P_2(x) = x - \\frac{1}{2}x^2$",
      "D. $P_2(x) = x + \\frac{1}{2}x^2$",
    ],
    correctAnswer: "d",
  },
  {
    id: "2025-01_q13",
    examId: "2025-01",
    topic: "aplicaciones-integral",
    type: "mc",
    points: 10/15,
    question:
      "El volumen de un sólido cuya base es la región limitada por $y = x^2 - 1$ e $y = 0$, y cuyas secciones perpendiculares al eje OX son semicírculos es:",
    options: [
      "A. $\\frac{1}{15}\\pi$",
      "C. $\\frac{3}{15}\\pi$",
      "B. $\\frac{2}{15}\\pi$",
      "D. $\\frac{4}{15}\\pi$",
    ],
    correctAnswer: "b",
  },
  {
    id: "2025-01_q14",
    examId: "2025-01",
    topic: "ecuaciones-diferenciales",
    type: "mc",
    points: 10/15,
    question:
      "En el río Eo, la tasa de crecimiento de la población de truchas es directamente proporcional al número de truchas presentes. Si la población de truchas del Eo se duplica en 50 años, ¿cuánto tardará en triplicarse?",
    options: [
      "A. $10 \\frac{\\ln(3)}{\\ln(2)}$ años",
      "C. $\\frac{\\ln(3)}{\\ln(2)}$ años",
      "B. $5 \\frac{\\ln(3)}{\\ln(2)}$ años",
      "D. $50 \\frac{\\ln(3)}{\\ln(2)}$ años",
    ],
    correctAnswer: "d",
  },
  {
    id: "2025-01_q15",
    examId: "2025-01",
    topic: "ecuaciones-diferenciales",
    type: "mc",
    points: 10/15,
    question: `Consideramos el siguiente problema de Cauchy:

$$\\begin{cases} y' + \\frac{1}{x}y = x \\sin(x) \\\\ y\\left(\\frac{\\pi}{2}\\right) = 2 \\end{cases}$$

Entonces, el valor de la solución en $x = \\frac{3\\pi}{2}$ es`,
    options: ["A. $-2$", "C. $-1$", "B. $-3$", "D. $0$"],
    correctAnswer: "a",
  },

  // ================================================================
  // Exam 2025-07
  // ================================================================

  {
    id: "2025-07_q1",
    examId: "2025-07",
    topic: "metodos-numericos",
    type: "mc",
    points: 10/15,
    question: `Si aplicamos el método de dicotomía en $[0, 1]$ para aproximar una solución de la ecuación $\\sqrt{x^2 + 1} - 2x = 0$, resulta`,
    options: [
      "A. $x_{1} = 0.5, x_{2} = 0.25$",
      "B. $x_{1} = 0.5, x_{2} = 0.75$",
      "C. $x_{1} = 0.25, x_{2} = 0.75$",
      "D. No verifica las hipótesis del teorema de Bolzano",
    ],
    correctAnswer: "b",
  },
  {
    id: "2025-07_q2",
    examId: "2025-07",
    topic: "metodos-numericos",
    type: "mc",
    points: 10/15,
    question: `Sea $L_{2}$ el polinomio de Lagrange que interpola a la función $f(x) = x\\sin (x)$ en los puntos $x_0 = 0$, $x_{1} = \\frac{\\pi}{6}$ y $x_{2} = \\pi$. Entonces`,
    options: [
      "A. $L_{2}\\left(\\frac{\\pi}{4}\\right) = \\frac{\\sqrt{2}}{2}$",
      "B. $L_{2}\\left(\\frac{\\pi}{4}\\right) = \\frac{\\sqrt{2}}{8}\\pi$",
      "C. $L_{2}\\left(\\frac{\\pi}{4}\\right) = \\frac{15}{96}\\pi$",
      "D. $L_{2}\\left(\\frac{\\pi}{4}\\right) = \\frac{9}{80}\\pi$",
    ],
    correctAnswer: "d",
  },
  {
    id: "2025-07_q3",
    examId: "2025-07",
    topic: "limites-continuidad",
    type: "mc",
    points: 10/15,
    question: `La función $f(x) = \\left\\{ \\begin{array}{ll} \\arctan (x), & x \\in [0,1] \\\\ x^2 + k, & x \\in (1,2] \\end{array} \\right. $, es continua en $x = 1$`,
    options: [
      "A. para $k = 0$",
      "B. para $k = \\frac{\\pi}{2} - 1$",
      "C. para $k = \\frac{\\pi}{4} - 1$",
      "D. nunca puede ser continua en $x = 1$",
    ],
    correctAnswer: "c",
  },
  {
    id: "2025-07_q4",
    examId: "2025-07",
    topic: "derivadas",
    type: "mc",
    points: 10/15,
    question: `Sabiendo que $f^{-1}(5) = 2$ y que $f'(2) = 4$, y suponiendo que $f^{-1}$ es derivable, entonces podemos afirmar que`,
    options: [
      "A. $\\left(f^{-1}\\right)'(5) = \\frac{1}{4}$",
      "B. Con esta información no se puede calcular $\\left(f^{-1}\\right)'(5)$",
      "C. $\\left(f^{-1}\\right)'(5) = 0$",
      "D. $\\left(f^{-1}\\right)'(5) = -\\frac{1}{4}$",
    ],
    correctAnswer: "a",
  },
  {
    id: "2025-07_q5",
    examId: "2025-07",
    topic: "limites-continuidad",
    type: "mc",
    points: 10/15,
    question: `Sea $l = \\lim_{x\\to \\frac{\\pi}{2}}(\\sin x)^{\\tan^2 x}$. Entonces`,
    options: [
      "A. $l = \\sqrt{e}$",
      "B. $l = e^{-1}$",
      "C. $l = \\frac{1}{\\sqrt{e}}$",
      "D. $l = -\\frac{1}{2}$",
    ],
    correctAnswer: "c",
  },
  {
    id: "2025-07_q6",
    examId: "2025-07",
    topic: "aplicaciones-derivada",
    type: "mc",
    points: 10/15,
    question: `Sea $f$ la función dada por $f(x) = \\sqrt{x^2 - 1}$ en $[-3, -1]$. Entonces, sus extremos absolutos son:`,
    options: [
      "A. 0 y -1",
      "B. -2 solamente",
      "C. -3 y -1",
      "D. no tiene",
    ],
    correctAnswer: "c",
  },
  {
    id: "2025-07_q7",
    examId: "2025-07",
    topic: "metodos-numericos",
    type: "mc",
    points: 10/15,
    question: `La fórmula iterativa de Newton-Raphson para encontrar la raíz r-ésima de un número positivo a, es`,
    options: [
      "A. $x_{n + 1} = x_n + \\frac{x_n^r - a}{rx_n^{r - 1}}$",
      "B. $x_{n + 1} = \\frac{1}{r}\\left(x_n(r - 1) + \\frac{a}{x_n^{r - 1}}\\right)$",
      "C. $x_{n + 1} = x_n - \\frac{rx_n^{r - 1}}{x_n^r - a}$",
      "D. $x_{n + 1} = \\sqrt[r]{x_n}$",
    ],
    correctAnswer: "b",
  },
  {
    id: "2025-07_q8",
    examId: "2025-07",
    topic: "derivadas",
    type: "mc",
    points: 10/15,
    question: `Sea $F$ la función definida mediante la integral

$$F(x) = \\int_{x}^{x^2} e^t \\, dt.$$

Determina su polinomio de Taylor de orden 2 centrado en $x_0 = 0$.`,
    options: [
      "A. $P_2(x) = -x + \\frac{1}{2}x^2$",
      "B. $P_2(x) = x + \\frac{1}{2}x^2$",
      "C. $P_2(x) = -x - \\frac{1}{2}x^2$",
      "D. $P_2(x) = x - \\frac{1}{2}x^2$",
    ],
    correctAnswer: "a",
  },
  {
    id: "2025-07_q9",
    examId: "2025-07",
    topic: "aplicaciones-derivada",
    type: "mc",
    points: 10/15,
    question: `Para una función $f$ sabemos que $f'(x) = \\arctan(x) - x$. Entonces`,
    options: [
      "A. $f$ es convexa en $(0, \\infty)$",
      "B. $f$ es convexa en $(-\\infty, 0)$",
      "C. $f$ es convexa en todo $\\mathbb{R}$",
      "D. $f$ no es convexa nunca",
    ],
    correctAnswer: "d",
  },
  {
    id: "2025-07_q10",
    examId: "2025-07",
    topic: "aplicaciones-integral",
    type: "mc",
    points: 10/15,
    question: `Consideramos las funciones dadas por $f(x) = -x^2$ y $g(x) = -(x - 2)^2$. El área encerrada por $f$, $g$ y el eje OX se calcula mediante:`,
    options: [
      "A. $\\int_{0}^{1} -x^2 \\, dx + \\int_{1}^{2} -(x - 2)^2 \\, dx$",
      "B. $\\int_{0}^{2} |x^2 - (x - 2)^2| \\, dx$",
      "C. $\\int_{0}^{2} (x^2 - (x - 2)^2) \\, dx$",
      "D. $\\int_{0}^{1} x^2 \\, dx + \\int_{1}^{2} (x - 2)^2 \\, dx$",
    ],
    correctAnswer: "d",
  },
  {
    id: "2025-07_q11",
    examId: "2025-07",
    topic: "aplicaciones-integral",
    type: "mc",
    points: 10/15,
    question: `Si $f(x) = \\tan(x)$, $x \\in [0, \\pi/2]$ entonces el área limitada por el grafo de f y el eje OX es`,
    options: [
      "A. $\\infty$",
      "B. $\\pi$",
      "C. $\\left(\\frac{\\pi}{4}\\right)^2$",
      "D. 1",
    ],
    correctAnswer: "a",
  },
  {
    id: "2025-07_q12",
    examId: "2025-07",
    topic: "aplicaciones-integral",
    type: "mc",
    points: 10/15,
    question: `Consideramos la región, en el primer cuadrante, acotada por las curvas

$$x = 1, \\quad x = e, \\quad y = 0, \\quad y = \\ln(x).$$

Si giramos esta región alrededor del eje $X$ el volumen resultante será`,
    options: [
      "A. $\\pi(e - 2)$",
      "B. $\\pi e$",
      "C. $\\infty$",
      "D. $\\pi$",
    ],
    correctAnswer: "a",
  },
  {
    id: "2025-07_q13",
    examId: "2025-07",
    topic: "integracion-numerica",
    type: "mc",
    points: 10/15,
    question: `En una pista un automóvil circula a 20 m/s. Desactiva la transmisión y la distancia, en metros, que recorre hasta llegar a la velocidad $a$ viene dada por $F_a = \\int_{a}^{20} \\frac{300x}{x^2 + 140} \\, dx$. Aproxima mediante trapecio compuesto, con $h = 10$, la distancia que recorre hasta detenerse.`,
    options: [
      "A. $\\frac{3000}{27}$ m",
      "B. $5 \\left(\\frac{50}{2} + \\frac{100}{9}\\right)$ m",
      "C. $5 \\left(\\frac{25}{2} + \\frac{300}{27}\\right)$ m",
      "D. 250 m",
    ],
    correctAnswer: "b",
  },
  {
    id: "2025-07_q14",
    examId: "2025-07",
    topic: "ecuaciones-diferenciales",
    type: "mc",
    points: 10/15,
    question: `Sea $y$ la solución del siguiente problema de valor inicial:

$$\\left\\{ \\begin{array}{rcl} y' & = & \\frac{xe^x}{y^2} \\\\ y(1) & = & 3 \\end{array} \\right.$$

Entonces:`,
    options: [
      "A. $y(0) = 0$",
      "B. $y(0) = 3$",
      "C. $y(0) = \\sqrt[3]{24}$",
      "D. $y(0) = 24$",
    ],
    correctAnswer: "c",
  },
  {
    id: "2025-07_q15",
    examId: "2025-07",
    topic: "ecuaciones-diferenciales",
    type: "mc",
    points: 10/15,
    question: `Dejamos una sartén al fuego. Cuando nos acordamos de ella, su temperatura alcanza los 100° C. Apagamos el fuego y 1 minuto después está a 90° C. Sabiendo que la temperatura en la cocina es de 20° C, calcula la constante $k$ de la sartén según la Ley de Enfriamiento de Newton:

$$T' = -k(T - T_a).$$`,
    options: [
      "A. $k = 1$",
      "B. $k = \\ln\\left(\\frac{10}{9}\\right)$",
      "C. $k = \\ln\\left(\\frac{9}{10}\\right)$",
      "D. $k = \\ln\\left(\\frac{8}{7}\\right)$",
    ],
    correctAnswer: "d",
  },
];

void questions;
