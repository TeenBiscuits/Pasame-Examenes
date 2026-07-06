import type { Question } from "../../data/types";
import type { Picture } from "vite-imagetools";
import { getImage } from "../../lib/image";
import type { ImageMap } from "../../lib/image";

const imageMap = import.meta.glob<{ default: Picture }>(
  "./assets/*.{png,jpeg,jpg}",
  {
    query: { w: "400;800;1200", format: "avif;webp;png", as: "picture" },
    eager: true,
  },
) as ImageMap;

void imageMap;
void getImage;

export const questions: Question[] = [
  // ================================================================
  // Exam Enero 2020
  // ================================================================

  // --- Tema 1 y 2: Introducción y Elementos Básicos de la OO ---
  {
    id: "2020_q1",
    exam: "2020-01",
    topic: "intro-y-objetos",
    type: "mc",
    points: 1,
    question: `Este trozo de código intenta formatear "HELLO WORLD" como H!E!L!L!O! !W!O!R!R!R. ¿Qué está mal en esta implementación?

\`\`\`java
String result;
StringBuilder sb = new StringBuilder("HELLO WORLD");
for (int i = 0; i <= sb.length(); i++) {
    result = result + sb.charAt(i) + ";";
}
\`\`\``,
    options: [
      "A. La variable result no ha sido inicializada.",
      "B. Sería más eficiente declarar result como un StringBuilder.",
      "C. La condición del for es errónea.",
      "D. Todas las anteriores.",
    ],
    correctAnswer: "d",
    explanation:
      "Todas las anteriores. No tiene sentido declarar result como un String inmutable que es constantemente modificado. Si no se inicializa la variable result, obtenemos un error de compilación. La condición debería ser estrictamente '<', ya que los índices van de 0 a length-1.",
  },
  {
    id: "2020_q2",
    exam: "2020-01",
    topic: "intro-y-objetos",
    type: "mc",
    points: 1,
    question: `Dados los siguientes ficheros Java:

\`\`\`java
// Foo.java
package pkgA;
public class Foo {
    int a = 5;
    protected int b = 6;
    public int c = 7;
}

// Bar.java
package pkgB;
import pkgA.*;
public class Bar {
    public static void main(String[] args) {
        Foo f = new Foo();
        System.out.println(" " + f.a); // Línea A
        System.out.println(" " + f.b); // Línea B
        System.out.println(" " + f.c); // Línea C
    }
}
\`\`\`

¿Cuál es el resultado de compilar ambos ficheros y ejecutar la clase Bar?`,
    options: [
      "A. Imprime por consola: 5 6 7",
      "B. Error de compilación en las líneas A, B y C.",
      "C. Error de compilación en las líneas A y B.",
      "D. Error de compilación únicamente en la línea A.",
    ],
    correctAnswer: "c",
    explanation:
      "El atributo a tiene visibilidad por defecto (package) y b visibilidad protected. Ninguno es visible desde otro paquete sin herencia. El atributo c tiene visibilidad pública y sí es visible.",
  },
  {
    id: "2020_q3",
    exam: "2020-01",
    topic: "intro-y-objetos",
    type: "mc",
    points: 1,
    question:
      "¿Tiene sentido definir en Java constructores con visibilidad por defecto (package)?",
    options: [
      "A. No, en Java los constructores no pueden llevar especificadores de visibilidad.",
      "B. No, en Java todos los constructores tienen que ser públicos.",
      "C. Sí, es lo que hacen el patrón Type Safe Enum y el patrón Singleton.",
      "D. Sí, si queremos que solo clases del mismo paquete que la clase del constructor puedan crear instancias de la misma.",
    ],
    correctAnswer: "d",
    explanation:
      "Los constructores sí llevan especificadores de visibilidad y no tienen por qué ser públicos. Los patrones Type Safe Enum o Singleton declaran constructores privados. Con visibilidad package, solo clases del mismo paquete pueden crear instancias.",
  },
  {
    id: "2020_q4",
    exam: "2020-01",
    topic: "intro-y-objetos",
    type: "mc",
    points: 1,
    question: `¿Cuál es el resultado de la compilación y ejecución del siguiente código?

\`\`\`java
class MiClase {
    @Override
    public boolean equals(MiClase obj) {
        return false;
    }
}
\`\`\``,
    options: [
      "A. Error de compilación, ya que @Override debe situarse en un comentario javadoc.",
      "B. Error de compilación al no sobrescribir correctamente el método equals.",
      "C. Error de ejecución al llamar a equals ya que habrá conflicto entre dos versiones incompatibles.",
      "D. El código compila y se ejecuta correctamente.",
    ],
    correctAnswer: "b",
    explanation:
      "Error de compilación: @Override indica sobrescritura, pero el método equals debería usar Object como parámetro, no MiClase, para sobrescribir correctamente al método equals de Object.",
  },
  {
    id: "2020_q5",
    exam: "2020-01",
    topic: "intro-y-objetos",
    type: "mc",
    points: 1,
    question: `La función allRowSums, dado un array bidimensional, suma el contenido de cada fila y retorna el resultado en un array. ¿Lo hemos hecho correctamente?

\`\`\`java
public class MatrixFunctions {
    public static int[] allRowSums(int[][] a) {
        int rows = a.length;
        int cols = a[0].length;
        int[] result = new int[rows];
        for (int i = 0; i < rows; i++) {
            result[i] = 0;
            for (int j = 0; j < cols; j++) {
                result[i] += a[i][j];
            }
        }
        return result;
    }
}
\`\`\``,
    options: [
      "A. Sí, el código es correcto.",
      "B. No, un método estático solo puede acceder a valores estáticos.",
      "C. No, el array result se inicializa de forma incorrecta.",
      "D. No, el código falla si la matriz a es irregular (ragged).",
    ],
    correctAnswer: "d",
    explanation:
      "No es correcto porque asume que todas las filas tienen el mismo número de columnas que la primera fila. Si el array es irregular (ragged), fallará. Rows, cols y result son variables locales no estáticas, y la inicialización de result es correcta.",
  },
  {
    id: "2020_q6",
    exam: "2020-01",
    topic: "intro-y-objetos",
    type: "mc",
    points: 1,
    question:
      "¿Cuál de las siguientes afirmaciones sobre la sentencia import es falsa?",
    options: [
      "A. El formato es import paquete.NombreClase;",
      "B. Un asterisco significa importar todas las clases del paquete: import paquete.*;",
      "C. Las sentencias import aparecen después de package (si existe) y antes de las definiciones de clases.",
      "D. La sentencia import es obligatoria siempre que queramos acceder a una clase de otro paquete.",
    ],
    correctAnswer: "d",
    explanation:
      "La sentencia import no es obligatoria. Si la clase es accesible (está en el CLASSPATH), se puede acceder usando el nombre completo (paquete.NombreClase) sin necesidad de import.",
  },
  {
    id: "2020_q7",
    exam: "2020-01",
    topic: "intro-y-objetos",
    type: "mc",
    points: 1,
    question: `¿Cuál es el resultado de compilar y ejecutar el siguiente código?

\`\`\`java
package myenums;
public enum Animals {
    DOG("woof"), CAT("meow"), FISH("burble");
    String sound;
    Animals(String s) { sound = s; }
}
class TestEnum {
    public static void main(String[] args) {
        System.out.println(Animals.DOG.sound + " " + Animals.FISH.sound);
    }
}
\`\`\``,
    options: [
      "A. Imprime woof burble",
      "B. Error de compilación en la línea de declaración del enum.",
      "C. Error de compilación en la línea del constructor.",
      "D. Error de compilación en la línea del println.",
    ],
    correctAnswer: "a",
    explanation:
      "El código es correcto. Los enumerados en Java pueden incluir constructores que inicialicen atributos. sound tiene visibilidad package y es visible desde TestEnum en el mismo paquete.",
  },

  // --- Tema 3: Propiedades Básicas de la OO ---
  {
    id: "2020_q8",
    exam: "2020-01",
    topic: "propiedades-oo",
    type: "mc",
    points: 1,
    question:
      "Dado un diagrama de clases con una clase abstracta B, indica cuál de las siguientes sentencias es falsa.",
    options: [
      "A. La clase abstracta B no puede ser nunca instanciada usando el operador new.",
      "B. El diagrama es incorrecto ya que la clase abstracta B debe contener al menos un método abstracto.",
      "C. La clase abstracta B no está obligada a implementar el método operaciónA().",
      "D. La clase abstracta B puede contener un método NO abstracto como operaciónB().",
    ],
    correctAnswer: "b",
    explanation:
      "B es falsa: una clase abstracta no tiene por qué tener métodos abstractos. Puede declararse abstracta simplemente para impedir su instanciación directa.",
  },
  {
    id: "2020_q9",
    exam: "2020-01",
    topic: "propiedades-oo",
    type: "mc",
    points: 1,
    question:
      "¿Cuál de las siguientes sentencias acerca de los interfaces Comparable y Comparator es falsa?",
    options: [
      "A. Comparable<T> incluye compareTo(T o) que compara usando el orden natural especificado en el propio objeto T.",
      "B. Comparator<T> incluye compare(T o1, T o2) para comparar dos objetos T.",
      "C. Collections.sort tiene dos versiones: orden natural y orden por Comparator.",
      "D. compare(T o1, T o2) devuelve +1, cero o -1 si o1 es menor, igual o mayor que o2.",
    ],
    correctAnswer: "d",
    explanation:
      "D es falsa. Primero, es al revés (-1 si o1 < o2, +1 si o1 > o2). Segundo, devuelve un valor negativo (no necesariamente -1), cero o positivo (no necesariamente +1).",
  },
  {
    id: "2020_q10",
    exam: "2020-01",
    topic: "propiedades-oo",
    type: "mc",
    points: 1,
    question: `Dado el siguiente código Java, señala cuál es la opción correcta:

\`\`\`java
class Base {}
class Sub1 extends Base {}
class Sub2 extends Base {}
public class Ejemplo {
    public static void main(String[] args) {
        Base b = new Sub2(); // Línea A
        Sub1 a = (Sub1) b;   // Línea B
    }
}
\`\`\``,
    options: [
      "A. Error de compilación en la línea A.",
      "B. Error de compilación en la línea B.",
      "C. Error en ejecución en la línea B.",
      "D. El código compila y se ejecuta sin problemas.",
    ],
    correctAnswer: "c",
    explanation:
      "Error en ejecución en la línea B: b contiene una instancia de Sub2 y se intenta convertir a Sub1 (clase hermana). El compilador no protesta porque hay un cast explícito y confía en el criterio del programador.",
  },
  {
    id: "2020_q11",
    exam: "2020-01",
    topic: "propiedades-oo",
    type: "mc",
    points: 1,
    question: `Dado el siguiente código, ¿qué ocurre exactamente en la línea identificada como "A"?

\`\`\`java
class Clase1 {
    public void metodo(String s) { System.out.println("Clase 1 " + s); }
}
class Clase2 extends Clase1 {
    public void metodo(String s) { System.out.println("Clase 2 " + s); }
    public static void main(String[] args) {
        Clase1 c1 = new Clase2();
        c1.metodo("Hola"); // LINEA A
    }
}
\`\`\``,
    options: [
      "A. Polimorfismo de inclusión",
      "B. Sobrescritura",
      "C. Sobrecarga",
      "D. Ligadura dinámica",
    ],
    correctAnswer: "d",
    explanation:
      "Ligadura dinámica: el compilador decide en tiempo de ejecución qué método ejecutar (Clase1 o Clase2) en base al objeto dinámico que alberga la referencia c1.",
  },
  {
    id: "2020_q13",
    exam: "2020-01",
    topic: "propiedades-oo",
    type: "mc",
    points: 1,
    question: `Dado el siguiente código Java, señala qué se imprime al ejecutar el método main:

\`\`\`java
class Superclase {
    public void go() { System.out.println("Superclase"); }
}
class Subclase extends Superclase {
    public void go() { System.out.println("Subclase"); }
}
class Sub2 extends Subclase {
    public void go() { System.out.println("Sub2"); }
}
class Test {
    public static void main(String[] args) {
        Superclase superclase = new Subclase();
        Subclase subclase = new Sub2();
        Sub2 sub2 = (Sub2) subclase;
        superclase.go();
        subclase.go();
        sub2.go();
    }
}
\`\`\``,
    options: [
      "A. Superclase - Subclase - Sub2",
      "B. Subclase - Sub2 - Sub2",
      "C. Error de compilación.",
      "D. Error de ejecución.",
    ],
    correctAnswer: "b",
    explanation:
      "La ligadura dinámica usa el tipo real del objeto creado, no el tipo declarado de la variable. superclase contiene Subclase → Subclase. subclase contiene Sub2 → Sub2. sub2 es Sub2 → Sub2.",
  },

  // --- Tema 4: UML ---
  {
    id: "2020_q14",
    exam: "2020-01",
    topic: "uml",
    type: "mc",
    points: 1,
    question: "En UML hay una relación de realización entre A y B cuando...",
    options: [
      "A. A hereda de la clase B.",
      "B. A implementa el interfaz B.",
      "C. A tiene un atributo de tipo B en su estado.",
      "D. A tiene un método al que se le pasa como parámetro un objeto de tipo B.",
    ],
    correctAnswer: "b",
    explanation:
      "La relación de realización en UML consiste en la implementación de interfaces.",
  },
  {
    id: "2020_q15",
    exam: "2020-01",
    topic: "uml",
    type: "mc",
    points: 1,
    question:
      "¿Cuál de las siguientes relaciones representa a una Composición UML?",
    image: getImage(imageMap, "2020-q15-composicion.jpeg"),
    options: [
      "A. La relación entre A1 y A2.",
      "B. La relación entre B1 y B2.",
      "C. La relación entre C1 y C2.",
      "D. La relación entre D1 y D2.",
      "E. La relación entre E1 y E2.",
      "F. La relación entre F1 y F2.",
      "G. La relación entre G1 y G2.",
    ],
    correctAnswer: "f",
    explanation:
      "La composición se representa como una línea continua con un rombo negro que va de la clase 'todo' a la clase 'partes'. Las partes solo pueden pertenecer a un todo y no tienen existencia propia independiente.",
  },
  {
    id: "2020_q16",
    exam: "2020-01",
    topic: "uml",
    type: "mc",
    points: 1,
    question: `Dado el siguiente código, indica cuál es la relación UML existente entre las clases A y B:

\`\`\`java
class B extends RuntimeException {
    public B(String message) { System.out.println(message); }
}
class A {
    public static void main(String[] args) { throw new B("Exception B"); }
}
\`\`\``,
    options: [
      "A. No existe ninguna relación.",
      "B. Dependencia.",
      "C. Asociación.",
      "D. Composición.",
    ],
    correctAnswer: "b",
    explanation:
      "A crea una instancia de B pero no la usa como atributo para definir su estado, por lo tanto es solo una dependencia.",
  },
  {
    id: "2020_q17",
    exam: "2020-01",
    topic: "uml",
    type: "mc",
    points: 1,
    question:
      "¿Cuál de las siguientes sentencias acerca de la multiplicidad UML es falsa?",
    options: [
      "A. La multiplicidad se representa como un intervalo limInf..limSup.",
      "B. Obligatoriamente siempre tiene que existir un límite inferior y otro superior, no se pueden simplificar en un solo valor.",
      "C. La multiplicidad sigue el estilo look-across, donde las multiplicidades se sitúan al lado de la clase que califican.",
      "D. En Java, multiplicidad 0..1 se representa con atributo simple. Multiplicidades mayores como arrays o colecciones.",
    ],
    correctAnswer: "b",
    explanation:
      "No es obligatorio tener siempre ambos límites. [5..5] es equivalente a [5] y [0..*] es equivalente a [*].",
  },
  {
    id: "2020_q18",
    exam: "2020-01",
    topic: "uml",
    type: "mc",
    points: 1,
    question:
      "Dado el siguiente diagrama UML de secuencia, ¿cuál de las siguientes sentencias es cierta?",
    image: getImage(imageMap, "2020-q18-secuencia.jpeg"),
    options: [
      "A. El diagrama no es correcto porque el mensaje síncrono calcular se ha representado con una flecha incorrecta.",
      "B. El diagrama no es correcto porque el operador del fragmento opt es incorrecto; debería ser alt.",
      "C. El diagrama no es correcto porque falta el mensaje de retorno de calcular().",
      "D. El diagrama es correcto.",
    ],
    correctAnswer: "d",
    explanation:
      "El diagrama es correcto. La flecha representa fielmente un mensaje síncrono. El fragmento alt es para varias alternativas; si solo hay un mensaje opcional se usa opt. Los retornos no tienen por qué representarse, sobre todo con mensajes síncronos.",
  },
  {
    id: "2020_q19",
    exam: "2020-01",
    topic: "uml",
    type: "mc",
    points: 1,
    question:
      "Dado el siguiente diagrama UML de secuencia, ¿cuál de las siguientes sentencias es falsa?",
    options: [
      "A. insertCard() y digit(i) son métodos de la clase Person mientras que givePin() y wrongPinTryAgain() son métodos de AccessControl.",
      "B. Los bucles loop(4) se corresponden con: for (int i = 0; i < 4; i++) { ... }.",
      "C. El bucle loop(0, 2) [wrongPin] se corresponde con: int i = 0; while (wrongPin() && i < 2) { ... i++ ... }.",
      "D. identification() es el método que inicia el proceso y es llamado por una clase distinta a Person y AccessControl.",
    ],
    correctAnswer: "a",
    explanation:
      "A es falsa: insertCard() y digit(i) son métodos de AccessControl, mientras que givePin() y wrongPinTryAgain() son métodos de Person. Es al revés.",
  },

  // --- Tema 5: Principios de Diseño ---
  {
    id: "2020_q12",
    exam: "2020-01",
    topic: "principios-diseno",
    type: "mc",
    points: 1,
    question: `Dado el siguiente código, ¿cómo deberíamos modificar el parámetro le del método agregarEmpleados para cumplir con el principio Get y Put?

\`\`\`java
class Empleado { /* ... */ }
class Dependiente extends Empleado { /* ... */ }
class Reponedor extends Empleado { /* ... */ }
class Mercado {
    private final List<Empleado> empleados = new ArrayList<>();
    public void agregarEmpleados(List<Empleado> le) {
        empleados.addAll(le);
    }
}
\`\`\``,
    options: [
      "A. Añadiendo <? extends Empleado>, al solo leer valores de la colección le.",
      "B. Añadiendo <? super Empleado>, ya que usamos los elementos para escribir en empleados.",
      "C. No utilizando comodines, ya que no se pueden usar cuando queremos leer y escribir.",
      "D. Utilizando ambos comodines, ya que queremos leer y escribir al mismo tiempo.",
    ],
    correctAnswer: "a",
    explanation:
      "En agregarEmpleados solo leemos de le mediante addAll, que recorre todos los elementos. El principio Get y Put dice: cuando solo se lee (get), usar <? extends T>. La escritura posterior es en empleados, una colección distinta.",
  },
  {
    id: "2020_q20",
    exam: "2020-01",
    topic: "principios-diseno",
    type: "mc",
    points: 1,
    question:
      "Cuando nos referimos al mal olor del software denominado Fragilidad hablamos de...",
    options: [
      "A. Un sistema en el que los cambios causan que se rompa en lugares sin relación conceptual con la parte cambiada.",
      "B. Un sistema en el que es difícil separar sus componentes para reutilizarlos en otros sistemas.",
      "C. Un sistema que es difícil de leer y comprender ya que no expresa correctamente sus intenciones.",
      "D. Un sistema en el cual el diseño contiene infraestructuras complejas que no añaden ningún beneficio directo.",
    ],
    correctAnswer: "a",
    explanation:
      "La Fragilidad provoca que los cambios en el sistema causen que el mismo se rompa en lugares que no tienen relación conceptual con la parte que fue cambiada.",
  },
  {
    id: "2020_q21",
    exam: "2020-01",
    topic: "principios-diseno",
    type: "mc",
    points: 1,
    question: "En el Principio Abierto-Cerrado... (señala la falsa)",
    options: [
      "A. Se fomenta el uso del polimorfismo y la ligadura dinámica, y se desaconseja el uso de condicionales basadas en instanceof.",
      "B. Se fomenta que el código de la superclase contenga referencias a las subclases.",
      "C. Un módulo abierto está disponible para ser extendido; por ejemplo, para añadir nuevos métodos.",
      "D. Un módulo cerrado tiene una interfaz estable, de forma que sus antiguas clases cliente sigan pudiendo utilizarlo.",
    ],
    correctAnswer: "b",
    explanation:
      "B es falsa. El código de la superclase no debe tener referencias a las subclases, ya que añadir una nueva subclase requeriría modificar el código existente, incumpliendo el principio Abierto-Cerrado.",
  },
  {
    id: "2020_q22",
    exam: "2020-01",
    topic: "principios-diseno",
    type: "mc",
    points: 1,
    question:
      "Una clase RectanguloAureo hereda de Rectangulo y sobrescribe setBase(...) y setAltura(...) de forma que modificar la base modifica la altura (y viceversa) para mantener la proporción áurea (φ ≈ 1.618). ¿Qué principio de diseño estamos incumpliendo?",
    options: [
      "A. Principio de Responsabilidad Única.",
      "B. Principio Abierto-Cerrado.",
      "C. Principio de Sustitución de Liskov.",
      "D. Principio de Mínimo Conocimiento.",
    ],
    correctAnswer: "c",
    explanation:
      "Incumple LSP. RectanguloAureo no es un subtipo de Rectangulo ya que altera las postcondiciones de setBase y setAltura introduciendo efectos laterales. Sería mejor una superclase común (ej. ParalelogramoRectangulo) y que ambas clases sean hermanas.",
  },
  {
    id: "2020_q23",
    exam: "2020-01",
    topic: "principios-diseno",
    type: "mc",
    points: 1,
    question: `Cuando encontramos un código como el siguiente, donde ObjectB y ObjectC no tienen ninguna relación con ObjectA, sabemos que estamos incumpliendo el Principio...

\`\`\`java
objectA.getObjectB().getObjectC().doSomething();
\`\`\``,
    options: [
      "A. Principio de Mínima Sorpresa.",
      "B. Principio de Sustitución de Liskov.",
      "C. Principio de Inversión de la Dependencia.",
      "D. Principio de Mínimo Conocimiento.",
    ],
    correctAnswer: "d",
    explanation:
      'El Principio de Mínimo Conocimiento o "Ley de Deméter" busca bajo acoplamiento. Dentro de un método solo se pueden mandar mensajes a: this, parámetros del método, atributos propios, elementos de colecciones propias, objetos creados dentro del método. La línea obtiene objetos extraños encadenando llamadas.',
  },
  {
    id: "2020_q24",
    exam: "2020-01",
    topic: "principios-diseno",
    type: "mc",
    points: 1,
    question: "Los principios KISS y YAGNI... señala la falsa",
    options: [
      "A. Son principios propios de las metodologías ágiles.",
      "B. Intentan que no caigamos en la sobreingeniería.",
      'C. KISS es un acrónimo de "Keep It Simple, Stupid".',
      'D. YAGNI es un acrónimo de "You Are Going Nowhere, Idiot".',
    ],
    correctAnswer: "d",
    explanation: 'D es falsa. YAGNI significa "You Aren\'t Gonna Need It".',
  },

  // --- Tema 6: Patrones de Diseño ---
  {
    id: "2020_q25",
    exam: "2020-01",
    topic: "patrones-diseno",
    type: "mc",
    points: 1,
    question:
      "Una agencia de noticias reúne noticias de distintas fuentes y las publica a los medios subscriptores. La agencia avisa tan pronto como un evento sucede, enviando titular y texto. Los subscriptores se dan de alta/baja constantemente. ¿Qué patrón es el más adecuado?",
    options: [
      "A. Inmutable",
      "B. Instancia Única",
      "C. Estrategia",
      "D. Estado",
      "E. Observador",
      "F. Adaptador",
      "G. Fachada",
      "H. Composición",
      "I. Iterador",
      "J. Método Factoría",
      "K. Constructor",
      "L. Método Plantilla",
    ],
    correctAnswer: "e",
    explanation:
      "El patrón Observador permite definir una dependencia 'uno a muchos' entre objetos de forma que cuando el objeto observado cambie de estado, todos sus dependientes sean notificados y actualizados automáticamente.",
  },
  {
    id: "2020_q26",
    exam: "2020-01",
    topic: "patrones-diseno",
    type: "mc",
    points: 1,
    question: `Estamos creando una clase que represente un color RGB y queremos hacerla inmutable. ¿Hemos implementado bien la inmutabilidad?

\`\`\`java
public final class RGBColor {
    private final int[] rgb = new int[3];
    public RGBColor(int red, int green, int blue) {
        rgb[0] = red; rgb[1] = green; rgb[2] = blue;
    }
    public int[] getRGB() { return rgb; }
    public RGBColor setRed(int red) { return new RGBColor(red, green, rgb[2]); }
    public RGBColor setGreen(int green) { return new RGBColor(rgb[0], green, rgb[2]); }
    public RGBColor setBlue(int blue) { return new RGBColor(rgb[0], rgb[1], blue); }
}
\`\`\``,
    options: [
      "A. Sí, ya que hemos hecho la clase final y sus atributos son privados y finales.",
      "B. No, el constructor es público, por lo que cualquiera puede crear objetos de esta clase.",
      "C. No, getRGB() devuelve una referencia a un elemento interno que es mutable (el array).",
      "D. No, hemos incluido métodos setters que están prohibidos en una clase inmutable.",
    ],
    correctAnswer: "c",
    explanation:
      "No hemos creado bien la inmutabilidad. Los arrays son mutables por naturaleza. getRGB() devuelve una referencia a un elemento interno mutable, permitiendo cambiar el estado desde fuera. Los setters no afectan a la inmutabilidad porque crean nuevas instancias en vez de modificar la actual.",
  },
  {
    id: "2020_q27",
    exam: "2020-01",
    topic: "patrones-diseno",
    type: "mc",
    points: 1,
    question:
      "¿Cuál de las siguientes sentencias acerca del patrón Estado es falsa?",
    options: [
      "A. El patrón Estado tiene la misma estructura de clases que Estrategia, aunque resuelven problemas diferentes.",
      "B. La clase Contexto delega en las clases de estado la ejecución de operaciones dependientes del estado.",
      "C. Es obligatorio que las clases de estado se implementen siempre como singletons.",
      "D. Es una solución más compleja y menos compacta (aunque más extensible) que usar condicionales.",
    ],
    correctAnswer: "c",
    explanation:
      "C es falsa. Los estados no tienen por qué ser singletons. Solo tiene sentido cuando se quiere evitar crear/destruir muchos objetos o compartirlos, algo no posible si los estados almacenan información en variables de instancia.",
  },
  {
    id: "2020_q28",
    exam: "2020-01",
    topic: "patrones-diseno",
    type: "mc",
    points: 1,
    question: "En una colección de objetos, ¿qué es un iterador fail-fast?",
    options: [
      "A. Un iterador de prueba que siempre lanza una excepción al intentar usarlo.",
      "B. Un iterador que lanza una excepción si se intenta leer la colección con más de un iterador simultáneo.",
      "C. Un iterador que lanza una excepción si en medio de la iteración se modifica el contenido de la colección por otra clase.",
      "D. Un iterador que crea una copia de la colección para evitar lanzar excepciones si la colección es modificada.",
    ],
    correctAnswer: "c",
    explanation:
      "Los iteradores fail-fast lanzan una excepción si la colección que recorren es modificada, incluso si la modificación no afectara a la iteración. Solo se permiten modificaciones hechas por el propio iterador. D describe un iterador fail-safe.",
  },
  {
    id: "2020_q29",
    exam: "2020-01",
    topic: "patrones-diseno",
    type: "mc",
    points: 1,
    question:
      "Las expresiones aritméticas se representan a través de grafos jerárquicos como el de la figura (correspondiente a 2 + (5 × √9)). Las constantes ocupan las hojas y los operadores los nodos. La operación evaluar() calcula el valor: evaluar una hoja devuelve su valor, evaluar un nodo realiza la operación sobre el resultado de evaluar sus hijos. ¿Qué patrón es el más adecuado para representar expresiones aritméticas de manera que sea fácil añadir nuevos operadores y operaciones?",
    image: getImage(imageMap, "2020-q29-arbol.jpeg"),
    options: [
      "A. Estrategia",
      "B. Estado",
      "C. Composición",
      "D. Método Plantilla",
    ],
    correctAnswer: "c",
    explanation:
      "El grafo que representa la expresión aritmética es un árbol. El patrón Composición es el más adecuado para representar estructuras de árbol y aplicar operaciones con comportamiento distinto en hojas y nodos.",
  },
  {
    id: "2020_q30",
    exam: "2020-01",
    topic: "patrones-diseno",
    type: "mc",
    points: 1,
    question: "¿Cuál de estos patrones de diseño usa elementos estáticos?",
    options: [
      "A. Inmutable. El método getInmutable() de la clase mutable es static.",
      "B. Instancia Única. El método getInstancia() es static.",
      "C. Composición. El método recursivo operación() es static.",
      "D. Método Plantilla. El método Plantilla() es static.",
    ],
    correctAnswer: "b",
    explanation:
      "Instancia Única (Singleton). El atributo instanciaÚnica y su getter son estáticos porque solo hay una instancia que nunca es instanciada desde fuera. En los demás patrones los métodos mencionados son no estáticos.",
  },

  // ================================================================
  // Exam Enero 2022
  // ================================================================

  // --- Tema 1 y 2: Introducción y Elementos Básicos de la OO ---
  {
    id: "2022_q1",
    exam: "2022-01",
    topic: "intro-y-objetos",
    type: "mc",
    points: 1,
    question: `Dada la función countChar() en la que pretendemos contar el número de veces que un determinado carácter aparece en un String. ¿Qué error hemos cometido en su implementación?

\`\`\`java
public static int countChar(String text, char c) {
    int sum = 0;
    for (int i = 0; i < text.length(); i++) {
        if (text.charAt(i) == c)
            sum++;
    }
    return sum;
}
\`\`\``,
    options: [
      "A. No comprobamos que text pueda ser null, lo que provocará NullPointerException.",
      "B. Comparamos caracteres con == cuando deberíamos usar .equals().",
      "C. El bucle lanza StringIndexOutOfBoundsException al salirse del rango.",
      "D. No hay ningún error y el código compila y funciona correctamente.",
    ],
    correctAnswer: "a",
    explanation:
      "Si text es null, text.length() lanzará NullPointerException. Los char se comparan correctamente con == (son tipos primitivos). El bucle usa i < text.length() que es correcto.",
  },
  {
    id: "2022_q2",
    exam: "2022-01",
    topic: "intro-y-objetos",
    type: "mc",
    points: 1,
    question: `Dada la clase Box que NO redefine equals, ¿cuál es el resultado de compilar y ejecutar?

\`\`\`java
public class Box {
    private int value;
    public Box(int value) { this.value = value; }
}
Box x = new Box(7);
Box y = new Box(7);
if (x == y) System.out.println("Identical");
else System.out.println("NOT Identical");
if (x.equals(y)) System.out.println("Equal");
else System.out.println("NOT Equal");
\`\`\``,
    options: [
      'A. Imprime "Identical" y "Equal"',
      'B. Imprime "NOT Identical" y "Equal"',
      'C. Imprime "Identical" y "NOT Equal"',
      'D. Imprime "NOT Identical" y "NOT Equal"',
    ],
    correctAnswer: "d",
    explanation:
      "x e y son objetos distintos (referencias diferentes) → == da false (NOT Identical). equals() no está sobreescrito, hereda el de Object que compara referencias → también false (NOT Equal).",
  },
  {
    id: "2022_q3",
    exam: "2022-01",
    topic: "intro-y-objetos",
    type: "mc",
    points: 1,
    question:
      "Comparado con la visibilidad public, protected y private de Java, el especificador de visibilidad por defecto (package) es...",
    options: [
      "A. Menos restrictivo que public.",
      "B. Más restrictivo que public, pero menos restrictivo que protected.",
      "C. Más restrictivo que protected, pero menos restrictivo que private.",
      "D. Más restrictivo que private.",
    ],
    correctAnswer: "c",
    explanation:
      "Jerarquía de visibilidad (de menos a más restrictiva): public > protected > package > private. Package es más restrictivo que protected (no visible en subclases de otros paquetes) pero menos que private.",
  },
  {
    id: "2022_q4",
    exam: "2022-01",
    topic: "intro-y-objetos",
    type: "mc",
    points: 1,
    question: `Dada el interfaz OperationInterface y el enumerado Operation, indica cuál de las siguientes sentencias es cierta:

\`\`\`java
interface OperationInterface {
    double calculate(double first, double second);
}
public enum Operation implements OperationInterface {
    PLUS { public double calculate(double x, double y){return x + y;} },
    MINUS { public double calculate(double x, double y){return x - y;} },
    TIMES { public double calculate(double x, double y){return x * y;} },
    DIVIDE { public double calculate(double x, double y){return x / y;} };
}
\`\`\``,
    options: [
      "A. No es correcto porque un enumerado no puede implementar interfaces.",
      "B. No es correcto porque un enumerado puede implementar interfaces pero solo si no incluyen métodos abstractos.",
      "C. No es correcto, solo debería haber una única implementación de calculate con un switch.",
      "D. El código es correcto.",
    ],
    correctAnswer: "d",
    explanation:
      "El código es correcto. Los enumerados en Java pueden implementar interfaces, y cada constante puede proporcionar su propia implementación de los métodos abstractos del interfaz.",
  },
  {
    id: "2022_q5",
    exam: "2022-01",
    topic: "intro-y-objetos",
    type: "mc",
    points: 1,
    question: `Dado el registro de Java definido a continuación, señala la falsa:

\`\`\`java
public record Box(int value) { }
\`\`\``,
    options: [
      "A. Box incluye un constructor público Box(int value).",
      "B. Box incluye implementaciones para equals y hashCode basados en value.",
      "C. Box incluye un método getValue() y un método setValue(int value) sobre value.",
      "D. Box incluye una implementación de toString() que devuelve una representación en String de todos los atributos.",
    ],
    correctAnswer: "c",
    explanation:
      "C es falsa. Los records en Java son inmutables. Generan automáticamente un método de acceso value() (no getValue()) pero NO generan setters. Los campos de un record son final.",
  },

  // --- Tema 3: Propiedades Básicas de la OO ---
  {
    id: "2022_q6",
    exam: "2022-01",
    topic: "propiedades-oo",
    type: "mc",
    points: 1,
    question:
      "¿Cuál de las siguientes sentencias sobre clases abstractas es cierta?",
    options: [
      "A. Una clase abstracta debe tener definido al menos un método abstracto.",
      "B. Una clase abstracta puede contener métodos NO abstractos.",
      "C. Una clase abstracta no puede tener constructores porque no se pueden crear instancias con new.",
      "D. Una clase abstracta puede tener atributos, pero serán implícitamente public, static y final (constantes).",
    ],
    correctAnswer: "b",
    explanation:
      "B es cierta. Una clase abstracta puede tener métodos concretos (no abstractos). No necesita tener métodos abstractos. Puede tener constructores (llamados desde subclases). Los atributos no son implícitamente estáticos ni finales.",
  },
  {
    id: "2022_q7",
    exam: "2022-01",
    topic: "propiedades-oo",
    type: "mc",
    points: 1,
    question:
      "¿Cuál de estas afirmaciones sobre la sobrecarga paramétrica es falsa?",
    options: [
      "A. Es muy usada en constructores para ofrecer distintas maneras de crear objetos.",
      "B. Es posible sobrecargar métodos heredados de superclases.",
      "C. Se considera un tipo de polimorfismo aparente (ad hoc).",
      "D. Sobrecargar un método requiere el uso de la anotación @Overload para que compile.",
    ],
    correctAnswer: "d",
    explanation:
      "D es falsa. No existe la anotación @Overload en Java. La sobrecarga no requiere ninguna anotación especial; el compilador distingue métodos sobrecargados por su firma (nombre + parámetros).",
  },
  {
    id: "2022_q8",
    exam: "2022-01",
    topic: "propiedades-oo",
    type: "mc",
    points: 1,
    question: "¿Soporta Java duck typing (tipado del pato)?",
    options: [
      "A. Sí, porque Java es un lenguaje con tipado dinámico.",
      "B. Sí, a través del uso de clases abstractas.",
      "C. Depende del número en concreto, a veces sí y a veces no.",
      "D. No, porque Java es un lenguaje con tipado estático.",
    ],
    correctAnswer: "d",
    explanation:
      "Java no soporta duck typing porque es un lenguaje con tipado estático. El duck typing ('si camina como pato y suena como pato, es un pato') es propio de lenguajes dinámicos donde el tipo se determina por los métodos disponibles en tiempo de ejecución.",
  },
  {
    id: "2022_q9",
    exam: "2022-01",
    topic: "propiedades-oo",
    type: "mc",
    points: 1,
    question: `comparable es un interfaz del API de Java. La clase SomeClass alberga un parámetro de tipo T genérico e implementa Comparable para usar compareTo. ¿Cómo modificarías la línea 1 para que implemente correctamente Comparable?

\`\`\`java
public interface Comparable<T> {
    public int compareTo(T o);
}
public class SomeClass { // línea 1
    public T value;
    @Override
    public int compareTo(T o) { /* ... */ }
}
\`\`\``,
    options: [
      "A. public class SomeClass implements Comparable",
      "B. public class SomeClass<T> implements Comparable",
      "C. public class SomeClass implements Comparable<T>",
      "D. public class SomeClass<T> implements Comparable<T>",
    ],
    correctAnswer: "d",
    explanation:
      "La clase usa T sin declararlo. Debe declarar el parámetro de tipo <T> y pasarlo al interfaz Comparable<T>. La opción D es correcta: SomeClass<T> implements Comparable<T>.",
  },
  {
    id: "2022_q10",
    exam: "2022-01",
    topic: "propiedades-oo",
    type: "mc",
    points: 1,
    question: `Dado el siguiente código, ¿cuál es el resultado de compilarlo y ejecutarlo?

\`\`\`java
interface Flyable { void fly(); }
abstract class Bird implements Flyable {
    public void fly() { System.out.println("Default fly"); }
}
class Chicken extends Bird {
    public void fly() { System.out.print("Cannot fly"); };
}
class BirdsFarm {
    public static void main(String[] args) {
        Bird b = new Chicken();
        Flyable f = b;
        f.fly();
    }
}
\`\`\``,
    options: [
      'A. Muestra "Default fly".',
      'B. Muestra "Cannot fly".',
      "C. Error de compilación: no podemos meter un Chicken en una variable Flyable.",
      "D. Error de ejecución: fly() está sin implementar y lanza excepción.",
    ],
    correctAnswer: "b",
    explanation:
      'Muestra "Cannot fly". La ligadura dinámica usa el tipo real del objeto (Chicken), no el tipo de la variable (Flyable). Chicken sobrescribe fly(), por lo que se ejecuta su versión.',
  },

  // --- Tema 4: UML ---
  {
    id: "2022_q11",
    exam: "2022-01",
    topic: "uml",
    type: "mc",
    points: 1,
    question:
      "En UML, cuando el nombre de un método aparece subrayado, significa que ese método es...",
    options: ["A. público", "B. estático", "C. final", "D. abstracto"],
    correctAnswer: "b",
    explanation:
      "En UML, el subrayado indica que un elemento es estático (pertenece a la clase, no a las instancias). Para métodos abstractos se usa cursiva.",
  },
  {
    id: "2022_q12",
    exam: "2022-01",
    topic: "propiedades-oo",
    type: "mc",
    points: 1,
    question:
      'En la asignatura hemos visto tres cosas llamadas "Composición". Indica la falsa.',
    options: [
      "A. La composición orientada a objetos que define relaciones TIENE_UN cuando un objeto contiene otros objetos.",
      "B. La composición UML que define relaciones todo-parte con pertenencia fuerte.",
      "C. El principio de composición que indica que es mejor tener un objeto compuesto de otros objetos pequeños y no un objeto compuesto de otro objeto grande.",
      "D. El patrón composición que se utiliza para componer objetos en estructuras de árbol que representan jerarquías todo-parte.",
    ],
    correctAnswer: "c",
    explanation:
      "C es falsa. El principio es 'Favorecer composición sobre herencia' (Composition over Inheritance), que indica que es mejor componer objetos delegando comportamiento que heredar de una gran jerarquía de clases. No se trata del tamaño de los objetos.",
  },
  {
    id: "2022_q13",
    exam: "2022-01",
    topic: "uml",
    type: "mc",
    points: 1,
    question:
      "Dado el siguiente diagrama de secuencia, ¿cuál de las siguientes afirmaciones es falsa?",
    image: getImage(imageMap, "2022-q13-secuencia.jpeg"),
    options: [
      "A. La caja KeyUser representa a un objeto asociado a una línea discontinua que representa su línea de vida.",
      "B. El fragmento con el operador ref indica interacciones definidas en otro lugar.",
      "C. El fragmento con el operador opt indica una interacción opcional que solo ocurre si la guardia es cierta.",
      "D. setPrivateKey() y setForeignKey() son operaciones definidas en la clase KeyUser.",
    ],
    correctAnswer: "d",
    explanation:
      "D es falsa. setPrivateKey() y setForeignKey() son probablemente métodos de otra clase (Gatekeeper), no de KeyUser. KeyUser recibe estos mensajes como destino.",
  },
  {
    id: "2022_q14",
    exam: "2022-01",
    topic: "uml",
    type: "mc",
    points: 1,
    question:
      "¿Cuál es la implementación correcta del siguiente diagrama de clases UML?",
    image: getImage(imageMap, "2022-q14-clases.jpeg"),
    options: ["A.", "B.", "C.", "D."],
    correctAnswer: "a",
    explanation:
      "La implementación correcta corresponde a la opción A, que implementa fielmente las relaciones mostradas en el diagrama de clases.",
    explanationImage: getImage(imageMap, "2022-q14-opciones.jpeg"),
  },
  {
    id: "2022_q15",
    exam: "2022-01",
    topic: "uml",
    type: "mc",
    points: 1,
    question:
      "Dado el siguiente diagrama de estados de una calculadora, indica cuál de las siguientes afirmaciones es falsa:",
    image: getImage(imageMap, "2022-q15-estados.jpeg"),
    options: [
      "A. Cuando se inicia la calculadora, esta está en el estado Off.",
      "B. En cualquier momento y estado, si ocurre el evento Off button la calculadora pasará al estado Off.",
      "C. Si la calculadora está en Off y sucede Clear-On button, pasará al estado Entering Operand.",
      "D. Transitaremos del estado Entering Operand al estado Equals entered si ocurre cualquiera de: Equals button, read operand o execute operation.",
    ],
    correctAnswer: "d",
    explanation:
      "D es falsa. No se transita al estado Equals entered con read operand ni execute operation. La transición a Equals entered solo ocurre con Equals button. Read operand y execute operation llevan a otros estados.",
  },

  // --- Tema 5: Principios de Diseño ---
  {
    id: "2022_q16",
    exam: "2022-01",
    topic: "principios-diseno",
    type: "mc",
    points: 1,
    question:
      "El Principio de Responsabilidad Única indica que... (señala la falsa)",
    options: [
      "A. Cada objeto debe tener una responsabilidad única enteramente encapsulada en la clase.",
      "B. La clase deberá tener solo una razón para cambiar.",
      "C. El objetivo es crear clases con baja cohesión.",
      "D. Hay que evitar las clases Dios que lo hacen todo en un programa.",
    ],
    correctAnswer: "c",
    explanation:
      "C es falsa. El SRP busca clases con ALTA cohesión, no baja. Una clase con una única responsabilidad tiene alta cohesión interna.",
  },
  {
    id: "2022_q17",
    exam: "2022-01",
    topic: "principios-diseno",
    type: "mc",
    points: 1,
    question:
      "¿Qué principio SOLID incumplen las nuevas clases selladas (sealed classes) de Java?",
    options: [
      "A. Principio de Responsabilidad Única.",
      "B. Principio Abierto-Cerrado.",
      "C. Principio de Sustitución de Liskov.",
      "D. Principio de Inversión de la Dependencia.",
      "E. Principio de Segregación de Interfaces.",
    ],
    correctAnswer: "b",
    explanation:
      "Incumplen el Principio Abierto-Cerrado (OCP). Las sealed classes restringen qué clases pueden extenderlas, limitando la extensibilidad. El OCP dice que las clases deben estar abiertas a extensión pero cerradas a modificación.",
  },
  {
    id: "2022_q18",
    exam: "2022-01",
    topic: "principios-diseno",
    type: "mc",
    points: 1,
    question: `En el siguiente código, a Client se le inyecta una dependencia mediante Service (que es un interfaz implementado por distintas clases). ¿Qué principio SOLID estamos siguiendo?

\`\`\`java
public class Client {
    private Service service;
    Client(Service service) { this.service = service; }
    public void setService(Service service) { this.service = service; }
    public String greet() { return "Hello " + service.getName(); }
}
\`\`\``,
    options: [
      "A. Principio de Responsabilidad Única.",
      "B. Principio Abierto-Cerrado.",
      "C. Principio de Sustitución de Liskov.",
      "D. Principio de Inversión de la Dependencia.",
      "E. Principio de Segregación de Interfaces.",
    ],
    correctAnswer: "d",
    explanation:
      "Principio de Inversión de la Dependencia (DIP). Client depende de la abstracción Service (interfaz), no de implementaciones concretas. La dependencia se inyecta desde fuera (constructor/setter injection).",
  },
  {
    id: "2022_q19",
    exam: "2022-01",
    topic: "principios-diseno",
    type: "mc",
    points: 1,
    question:
      '"Una precondición solo puede sustituirse por otra precondición más débil y una postcondición solo puede sustituirse por otra postcondición más fuerte". Esta afirmación corresponde al...',
    options: [
      "A. Principio de Subcontratación.",
      "B. Principio de Inversión de la Dependencia.",
      "C. Principio de Responsabilidad Única.",
      "D. Principio Abierto-Cerrado.",
    ],
    correctAnswer: "a",
    explanation:
      "Principio de Subcontratación (Design by Contract). Es una extensión del LSP que formaliza que las subclases deben aceptar precondiciones más débiles (requieren menos) y garantizar postcondiciones más fuertes (ofrecen más).",
  },
  {
    id: "2022_q20",
    exam: "2022-01",
    topic: "principios-diseno",
    type: "mc",
    points: 1,
    question: `Dadas las clases Person y ManageClient, ¿qué principio de diseño está incumpliendo ManageClient en clientFullName()?

\`\`\`java
public class Person {
    public String name;
    public String middleName;
    public String surname;
}
public class ManageClient {
    private final Person person;
    public ManageClient(Person person) { this.person = person; }
    public String clientFullName() {
        return person.name + " " + person.middleName + " " + person.surname;
    }
}
\`\`\``,
    options: [
      "A. Principio de Sustitución de Liskov",
      "B. Principio Abierto-Cerrado",
      "C. Principio de Hollywood",
      "D. Principio Tell, Don't Ask",
    ],
    correctAnswer: "d",
    explanation:
      "Tell, Don't Ask. ManageClient accede directamente a los campos de Person para construir el nombre, en lugar de decirle a Person que se lo dé. Debería delegar en un método como person.getFullName(). Person debería encapsular sus datos.",
  },

  // --- Tema 6: Patrones de Diseño ---
  {
    id: "2022_q21",
    exam: "2022-01",
    topic: "patrones-diseno",
    type: "mc",
    points: 1,
    question:
      "La librería Abstract Window Toolkit (AWT) de Java tiene la siguiente estructura. ¿Qué patrón de diseño representa?",
    image: getImage(imageMap, "2022-q21-awt.jpeg"),
    options: [
      "A. Inmutable",
      "B. Instancia Única",
      "C. Estrategia",
      "D. Estado",
      "E. Composición",
      "F. Iterador",
      "G. Observador",
      "H. Adaptador",
      "I. Fachada",
      "J. Método Factoría",
      "K. Constructor",
      "L. Método Plantilla",
    ],
    correctAnswer: "e",
    explanation:
      "La librería AWT utiliza el patrón Composición. Los componentes gráficos (Container, Panel, Button, etc.) forman una jerarquía de árbol donde un Container puede contener otros componentes (incluyendo otros contenedores), siguiendo el patrón Composite.",
  },
  {
    id: "2022_q22",
    exam: "2022-01",
    topic: "patrones-diseno",
    type: "mc",
    points: 1,
    question: "En el push model del patrón Observador... (señala la falsa)",
    options: [
      "A. El sujeto manda a los observadores información detallada acerca de lo que ha cambiado.",
      "B. La comunicación es más eficiente ya que no se fuerza a descubrir a los observadores qué ha cambiado.",
      "C. Sujeto y observadores no son tan independientes como en el modelo pull.",
      "D. Es más fácil integrar nuevos observadores con necesidades completamente diferentes que en el modelo pull.",
    ],
    correctAnswer: "d",
    explanation:
      "D es falsa. En el modelo push, el sujeto envía datos concretos, lo que lo hace más acoplado a las necesidades de los observadores existentes. Integrar nuevos observadores con necesidades diferentes es más difícil porque el sujeto no sabe qué datos necesitarán.",
  },
  {
    id: "2022_q23",
    exam: "2022-01",
    topic: "patrones-diseno",
    type: "mc",
    points: 1,
    question:
      "¿Cuál de las siguientes frases describe correctamente el funcionamiento del patrón Iterator?",
    options: [
      "A. Proporciona un modo de acceder secuencialmente a los elementos de un objeto agregado sin exponer su representación interna.",
      "B. Permite a un objeto modificar su conducta al cambiar su estado interno.",
      "C. Permite definir una dependencia 'uno a muchos' entre objetos para notificar cambios.",
      "D. Provee de un interfaz unificado para un conjunto de clases en un subsistema.",
    ],
    correctAnswer: "a",
    explanation:
      "A describe el patrón Iterator. B es Estado, C es Observador, y D es Fachada.",
  },
  {
    id: "2022_q24",
    exam: "2022-01",
    topic: "principios-diseno",
    type: "mc",
    points: 1,
    question: `Dado el siguiente código, ¿qué principio de diseño estamos incumpliendo?

\`\`\`java
public class SongList {
    private List<Song> songs = new ArrayList<>();
    private int playingSong;
    public void insertSong(int index, Song song) {
        if (index < 0 || index >= songs.size())
            throw new IllegalArgumentException();
        songs.add(index, song);
    }
    public void removeSong(int index) {
        if (index < 0 || index >= songs.size())
            throw new IllegalArgumentException();
        songs.remove(index);
    }
    public void selectPlayingSong(int index) {
        if (index < 0 || index >= songs.size())
            throw new IllegalArgumentException();
        playingSong = index;
    }
}
\`\`\``,
    options: [
      "A. DRY",
      "B. KISS",
      "C. YAGNI",
      "D. No incumple ningún principio de Diseño.",
    ],
    correctAnswer: "a",
    explanation:
      "Incumple DRY (Don't Repeat Yourself). La comprobación de límites del índice se repite en los tres métodos. Debería extraerse a un método privado como validateIndex(int index).",
  },
  {
    id: "2022_q25",
    exam: "2022-01",
    topic: "patrones-diseno",
    type: "mc",
    points: 1,
    question:
      "Dados los siguientes códigos referentes a patrones de diseño, indica cuál representa el patrón Constructor.",
    options: [
      "A. public enum Number {ACE, TWO, THREE, ...} / public enum Suit {SPADES, HEARTS, ...} / public record Card(Number number, Suit suit) {}",
      "B. public final class Integer extends Number { private int value; ... }",
      "C. for(Enumeration e = collection.getEnumeration(); e.hasMoreElements(); ) ...",
      'D. CurrencyConverter cc1 = CurrencyConverter.incomingCurrency("USD").outgoingCurrency("EUR").build(); cc1.convert(50.00);',
    ],
    correctAnswer: "d",
    explanation:
      "D muestra el patrón Constructor (Builder). Se usa un encadenamiento de métodos (incomingCurrency, outgoingCurrency) que configuran el objeto paso a paso, y build() crea la instancia final. Esto es característico del patrón Builder con fluent API.",
  },
];

void questions;
