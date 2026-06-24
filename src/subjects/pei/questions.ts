import type { Question } from "../../data/types";

export const questions: Question[] = [
  // ================================================================
  // PANDAS Y DATOS ESTRUCTURADOS
  // ================================================================

  // --- Pandas: Clasificación de baloncesto ---
  {
    id: "rec_q1",
    exam: "recopilacion",
    topic: "pandas",
    type: "text",
    points: 0.5,
    question: `Se han cargado los datos de una clasificación de baloncesto en un DataFrame de Pandas con columnas: Equipo, PJ, PG, PP, PF, PC. Responde a las siguientes preguntas utilizando Pandas:

1. Calcula el total de puntos anotados.
2. Muestra la diferencia entre puntos a favor y puntos en contra.
3. Muestra aquellos equipos cuya diferencia de puntos sea positiva.
4. Calcula la media de puntos anotados agrupados por partidos ganados.`,
    correctAnswer: `1. \`df['PF'].sum()\`
2. \`df['PF'] - df['PC']\`
3. \`df[df['PF'] > df['PC']]\`
4. \`df.groupby('PG')['PF'].mean()\``,
    explanation:
      "Usar los métodos de Pandas: `sum()` para totales, operaciones vectoriales para diferencias, filtrado booleano para seleccionar filas, y `groupby()` + `mean()` para agregaciones.",
  },

  // --- Pandas: Librería ---
  {
    id: "rec_q2",
    exam: "recopilacion",
    topic: "pandas",
    type: "text",
    points: 0.5,
    question: `Un DataFrame \`df\` contiene datos de ventas de una librería con columnas: Fecha, Libro, Categoría, Unidades, Precio Unitario. Escribe comandos Pandas para:

1. ¿Cuántos libros se han vendido en total?
2. ¿Qué libros se vendieron el 1 de junio de 2024 y pertenecen a la categoría "Ficción"?
3. Calcula el número total de unidades vendidas por categoría.
4. Añade una nueva columna llamada Ingresos que contenga el ingreso generado por cada fila (unidades × precio).`,
    correctAnswer: `1. \`df['Unidades'].sum()\`
2. \`df[(df['Fecha'] == '2024-06-01') & (df['Categoría'] == 'Ficción')]['Libro']\`
3. \`df.groupby('Categoría')['Unidades'].sum()\`
4. \`df['Ingresos'] = df['Unidades'] * df['Precio Unitario']\``,
    explanation:
      "Filtrado con condiciones booleanas combinadas con `&`, agrupación con `groupby()`, y creación de nuevas columnas con asignación directa.",
  },

  // --- Pandas: Cafetería con índice jerárquico ---
  {
    id: "rec_q3",
    exam: "recopilacion",
    topic: "pandas",
    type: "text",
    points: 0.5,
    question: `Un DataFrame de Pandas representa los ingresos de caja de una cafetería con columnas: Nfactura, Nlinea, Producto, Cantidad, Precio unitario. El índice jerárquico está compuesto por (Nfactura, Nlinea).

1. Escribe una sentencia Python que calcule la suma total de ingresos desde su apertura.
2. Escribe una sentencia que calcule la suma total de ingresos de una factura determinada (número almacenado en la variable \`nfact\`).
3. Se dispone de un segundo DataFrame \`df_fechas\` con columnas Fecha y Nfactura (índice = Nfactura). Escribe sentencias que calculen la suma total de ingresos durante un mes determinado.`,
    correctAnswer: `1. \`(df['Cantidad'] * df['Precio unitario']).sum()\`
2. \`(df.loc[nfact]['Cantidad'] * df.loc[nfact]['Precio unitario']).sum()\`
3. \`df_merged = df.join(df_fechas, on='Nfactura'); df_merged[df_merged['Fecha'].str.startswith('2016/02')]['Cantidad'].mul(df_merged['Precio unitario']).sum()\``,
    explanation:
      "Con índice jerárquico se usa `.loc[nfact]` para acceder a una factura. Para unir DataFrames se usa `join()` o `merge()`. El filtrado por mes se hace con operaciones sobre strings de fecha.",
  },

  // --- Pandas: Tabla desde archivo de texto ---
  {
    id: "rec_q4",
    exam: "recopilacion",
    topic: "pandas",
    type: "text",
    points: 1.0,
    question: `Partiendo de un archivo con una tabla de clasificación de baloncesto en formato texto, y trabajando con Pandas:

1. Construye un DataFrame que contenga los datos de la tabla.
2. Escribe una sentencia que muestre los equipos que anotaron más puntos de los que recibieron.
3. Escribe una sentencia que calcule la media de puntos anotados de los equipos de la competición.
4. Escribe una sentencia que calcule la media de puntos anotados de los equipos agrupados por número de victorias.`,
    correctAnswer: `1. \`df = pd.read_csv('archivo.txt', delim_whitespace=True)\` o \`pd.read_table()\`
2. \`df[df['PF'] > df['PC']]\`
3. \`df['PF'].mean()\`
4. \`df.groupby('PG')['PF'].mean()\``,
    explanation:
      "`read_csv` con `delim_whitespace=True` para archivos de ancho fijo o separados por espacios. Filtrado booleano y `groupby().mean()` para agregaciones.",
  },

  // --- JSON: Clasificación de baloncesto ---
  {
    id: "rec_q5",
    exam: "recopilacion",
    topic: "pandas",
    type: "text",
    points: 0.75,
    question: `Escribe un documento JSON que almacene la información de la clasificación de dos equipos de una liga de baloncesto con los campos: posición, nombre, partidos jugados, ganados, perdidos, puntos a favor, puntos en contra, puntos totales y diferencia de puntos.`,
    correctAnswer: `\`\`\`json
{
  "clasificacion": [
    {
      "posicion": 1,
      "nombre": "COVIRÁN GRANADA",
      "pj": 10,
      "pg": 12,
      "pp": 5,
      "pf": 1400,
      "pc": 1347,
      "pts": 30,
      "diff": 0
    },
    {
      "posicion": 2,
      "nombre": "RÍO BREOGÁN",
      "pj": 10,
      "pg": 12,
      "pp": 5,
      "pf": 1400,
      "pc": 1341,
      "pts": 30,
      "diff": 1
    }
  ]
}
\`\`\``,
    explanation:
      "JSON es una representación estructurada clave-valor. Los arrays se representan con `[]` y los objetos con `{}`. Cada equipo es un objeto dentro del array de clasificación.",
  },

  // --- JSON: Messi y Ronaldo ---
  {
    id: "rec_q6",
    exam: "recopilacion",
    topic: "pandas",
    type: "text",
    points: 0.75,
    question: `Escribe un fichero JSON que guarde de forma estructurada la siguiente información:

- Lionel Messi nació en el año 1987 en Rosario. Jugó en el FC Barcelona C (8 partidos, 5 goles), FC Barcelona B (22 partidos, 6 goles) y FC Barcelona (315 partidos, 286 goles).
- Cristiano Ronaldo nació en el año 1985 en Funchal. Jugó en el Sporting de Lisboa (25 partidos, 3 goles), Manchester United (196 partidos, 84 goles) y Real Madrid (200 partidos, 225 goles).`,
    correctAnswer: `\`\`\`json
{
  "jugadores": [
    {
      "nombre": "Lionel Messi",
      "nacimiento": { "año": 1987, "lugar": "Rosario" },
      "equipos": [
        { "club": "FC Barcelona C", "partidos": 8, "goles": 5 },
        { "club": "FC Barcelona B", "partidos": 22, "goles": 6 },
        { "club": "FC Barcelona", "partidos": 315, "goles": 286 }
      ]
    },
    {
      "nombre": "Cristiano Ronaldo",
      "nacimiento": { "año": 1985, "lugar": "Funchal" },
      "equipos": [
        { "club": "Sporting de Lisboa", "partidos": 25, "goles": 3 },
        { "club": "Manchester United", "partidos": 196, "goles": 84 },
        { "club": "Real Madrid", "partidos": 200, "goles": 225 }
      ]
    }
  ]
}
\`\`\``,
    explanation:
      "Estructura jerárquica con arrays anidados. Cada jugador contiene un objeto de nacimiento y un array de equipos. Cada equipo es un objeto con club, partidos y goles.",
  },

  // --- Python dict: Messi y Ronaldo ---
  {
    id: "rec_q7",
    exam: "recopilacion",
    topic: "pandas",
    type: "text",
    points: 0.75,
    repeated: true,
    question: `Escribe un fichero estructurado en Python, utilizando diccionarios, que guarde la siguiente información:

- Lionel Messi nació en 1987 en Rosario. Jugó en FC Barcelona C (8 partidos, 5 goles), FC Barcelona B (22 partidos, 6 goles) y FC Barcelona (315 partidos, 268 goles).
- Cristiano Ronaldo nació en 1985 en Funchal. Jugó en Sporting de Lisboa (25 partidos, 3 goles), Manchester United (196 partidos, 84 goles) y Real Madrid (200 partidos, 225 goles).`,
    correctAnswer: `\`\`\`python
jugadores = [
    {
        "nombre": "Lionel Messi",
        "nacimiento": {"año": 1987, "lugar": "Rosario"},
        "equipos": [
            {"club": "FC Barcelona C", "partidos": 8, "goles": 5},
            {"club": "FC Barcelona B", "partidos": 22, "goles": 6},
            {"club": "FC Barcelona", "partidos": 315, "goles": 268},
        ]
    },
    {
        "nombre": "Cristiano Ronaldo",
        "nacimiento": {"año": 1985, "lugar": "Funchal"},
        "equipos": [
            {"club": "Sporting de Lisboa", "partidos": 25, "goles": 3},
            {"club": "Manchester United", "partidos": 196, "goles": 84},
            {"club": "Real Madrid", "partidos": 200, "goles": 225},
        ]
    }
]
\`\`\``,
    explanation:
      "Variante del ejercicio anterior usando diccionarios de Python en lugar de JSON. La estructura es idéntica: listas de diccionarios anidados.",
  },

  // --- API / Diccionario anidado ---
  {
    id: "rec_q8",
    exam: "recopilacion",
    topic: "pandas",
    type: "text",
    points: 0.75,
    question: `Una API educativa devuelve información de un curso con estudiantes y sus calificaciones. Escribe el comando \`print\` en Python que imprima la primera calificación del primer estudiante.

\`\`\`python
curso = {
  "nombre": "4º ESO",
  "profesor": "Pedro Sánchez",
  "estudiantes": [
    {
      "nombre": "Santiago Abascal",
      "edad": 16,
      "calificaciones": [
        {
          "asignatura": "Matemáticas",
          "nota": 2.5,
          "fecha": "15-03-2025"
        }
      ]
    }
  ]
}
\`\`\``,
    correctAnswer:
      "`print(curso['estudiantes'][0]['calificaciones'][0])` o `print(curso['estudiantes'][0]['calificaciones'][0]['nota'])` para solo la nota.",
    explanation:
      "Para acceder a datos anidados en diccionarios/listas, se encadenan los índices: primero el diccionario con clave 'estudiantes', luego índice [0] del array, luego clave 'calificaciones', índice [0] del array anidado.",
  },

  // ================================================================
  // POO EN PYTHON
  // ================================================================

  // --- Coche + Radar ---
  {
    id: "rec_q9",
    exam: "recopilacion",
    topic: "poo",
    type: "text",
    points: 0.75,
    question: `Dado el siguiente código y su salida, escribe la clase o clases Python que implementan dicho comportamiento:

\`\`\`
>> coche1 = Coche("Manolo", 100)
>> coche1 = coche1 + 40
>> print(coche1)
El coche de Manolo circula a 140 kms/hora
>> radar = Radar(120, 10)
>> multa1 = radar.evaluate(coche1)
Multa al coche de Manolo de 200 euros
>> print(multa1.coche)
El coche de Manolo circula a 140 kms/hora
>> print(multa1.importe)
"Importe 200 euros"
\`\`\`

El segundo argumento del Radar es el importe de la multa por cada km/hora que exceda la velocidad límite.`,
    correctAnswer: `\`\`\`python
class Coche:
    def __init__(self, dueño, velocidad):
        self.dueño = dueño
        self.velocidad = velocidad

    def __add__(self, incremento):
        return Coche(self.dueño, self.velocidad + incremento)

    def __str__(self):
        return f"El coche de {self.dueño} circula a {self.velocidad} kms/hora"

class Multa:
    def __init__(self, coche, importe):
        self.coche = coche
        self.importe = importe

class Radar:
    def __init__(self, limite, tarifa):
        self.limite = limite
        self.tarifa = tarifa

    def evaluate(self, coche):
        exceso = max(0, coche.velocidad - self.limite)
        importe = exceso * self.tarifa
        print(f"Multa al coche de {coche.dueño} de {importe} euros")
        return Multa(coche, importe)
\`\`\``,
    explanation:
      "`__add__` permite usar el operador `+` entre objetos. `__str__` define la representación con `print()`. `Radar.evaluate()` calcula el exceso de velocidad y el importe de la multa.",
  },

  // --- Playlist ---
  {
    id: "rec_q10",
    exam: "recopilacion",
    topic: "poo",
    type: "text",
    points: 0.75,
    question: `A través de métodos mágicos de Python, implementa una clase \`Playlist\` que implemente el siguiente comportamiento:

\`\`\`
>>> playlist = Playlist()
>>> playlist[0].name = "Apt."
>>> playlist[0].artist = "Rosé & Bruno Mars"
>>> playlist[1].name = "Dynamite"
>>> playlist[1].artist = "BTS"
>>> print(len(playlist))
2
>>> print(playlist[0].name)
Apt.
>>> print(playlist[1].name)
Dynamite
\`\`\``,
    correctAnswer: `\`\`\`python
class Song:
    def __init__(self):
        self.name = ""
        self.artist = ""

class Playlist:
    def __init__(self):
        self.songs = []

    def __getitem__(self, index):
        if index >= len(self.songs):
            self.songs.append(Song())
        return self.songs[index]

    def __len__(self):
        return len(self.songs)
\`\`\``,
    explanation:
      "`__getitem__` permite la indexación con `[]`. Si el índice no existe, se crea una nueva canción. `__len__` permite usar `len()` sobre la playlist. Se necesita una clase auxiliar Song.",
  },

  // --- Puente ---
  {
    id: "rec_q11",
    exam: "recopilacion",
    topic: "poo",
    type: "text",
    points: 0.75,
    question: `Escribe una clase \`Puente\` en Python que implemente el siguiente comportamiento:

\`\`\`
>> puente1 = Puente("Pasaje", 100)
>> puente2 = Puente("Rande", 200)
>> puente1 = puente1 + puente2
>> print(puente1)
"El Puente Pasaje tiene 300 metros de longitud"
\`\`\``,
    correctAnswer: `\`\`\`python
class Puente:
    def __init__(self, nombre, longitud):
        self.nombre = nombre
        self.longitud = longitud

    def __add__(self, otro):
        return Puente(self.nombre, self.longitud + otro.longitud)

    def __str__(self):
        return f"El Puente {self.nombre} tiene {self.longitud} metros de longitud"
\`\`\``,
    explanation:
      "`__add__` suma las longitudes de dos puentes y mantiene el nombre del primero. `__str__` formatea la salida con la longitud acumulada.",
  },

  // --- MailServer ---
  {
    id: "rec_q12",
    exam: "recopilacion",
    topic: "poo",
    type: "text",
    points: 0.5,
    question: `Escribe una clase \`MailServer\` en Python que implemente el siguiente comportamiento:

\`\`\`
>> s1 = MailServer()
>> s1.send("diego@udc.es", "Saludos", "Hola")
>> s1.list()
Se han enviado los siguientes correos:
Correo enviado a diego@udc.es
Asunto: Saludos
Cuerpo: Hola
>> s1.send("gabriel@udc.es", "Saludos", "Adios")
>> s1.list()
Se han enviado los siguientes correos:
Correo enviado a diego@udc.es
Asunto: Saludos
Cuerpo: Hola

Correo enviado a gabriel@udc.es
Asunto: Saludos
Cuerpo: Adios
>> s1.send("diego@udc.es", "Más saludos", "Hola hola")
>> s1.detail("diego@udc.es")
Se han enviado los siguientes correos a diego@udc.es:
Correo enviado a diego@udc.es
Asunto: Saludos
Cuerpo: Hola
Correo enviado a diego@udc.es
Asunto: Más saludos
Cuerpo: Hola hola
\`\`\`

Nota: La clase no tiene que enviar correos, solo almacenar y mostrar la información.`,
    correctAnswer: `\`\`\`python
class MailServer:
    def __init__(self):
        self.emails = []

    def send(self, to, subject, body):
        self.emails.append({"to": to, "subject": subject, "body": body})

    def list(self):
        print("Se han enviado los siguientes correos:")
        for email in self.emails:
            print(f"Correo enviado a {email['to']}")
            print(f"Asunto: {email['subject']}")
            print(f"Cuerpo: {email['body']}")
            print()

    def detail(self, recipient):
        print(f"Se han enviado los siguientes correos a {recipient}:")
        for email in self.emails:
            if email['to'] == recipient:
                print(f"Correo enviado a {email['to']}")
                print(f"Asunto: {email['subject']}")
                print(f"Cuerpo: {email['body']}")
\`\`\``,
    explanation:
      "La clase almacena los correos en una lista de diccionarios. `list()` muestra todos los correos. `detail()` filtra por destinatario.",
  },

  // --- Movimiento / Gasto / Ingreso ---
  {
    id: "rec_q13",
    exam: "recopilacion",
    topic: "poo",
    type: "text",
    points: 0.5,
    question: `Usando métodos estáticos y herencia, escribe las clases \`Movimiento\`, \`Gasto\` e \`Ingreso\` en Python que implementen el siguiente comportamiento:

\`\`\`
>> ingreso1 = Ingreso(1000)
>> gasto1 = Gasto(100)
>> ingreso2 = Ingreso(200)
>> print("El saldo es " + str(Movimiento.getSaldo()))
El saldo es 1100 euros
\`\`\``,
    correctAnswer: `\`\`\`python
class Movimiento:
    _saldo = 0

    def __init__(self, cantidad):
        self.cantidad = cantidad

    @staticmethod
    def getSaldo():
        return Movimiento._saldo

class Ingreso(Movimiento):
    def __init__(self, cantidad):
        super().__init__(cantidad)
        Movimiento._saldo += cantidad

class Gasto(Movimiento):
    def __init__(self, cantidad):
        super().__init__(cantidad)
        Movimiento._saldo -= cantidad
\`\`\``,
    explanation:
      "`Movimiento` es la clase base con un atributo de clase `_saldo` y un método estático `getSaldo()`. `Ingreso` suma al saldo en `__init__`, `Gasto` resta.",
  },

  // --- Ranking ---
  {
    id: "rec_q14",
    exam: "recopilacion",
    topic: "poo",
    type: "text",
    points: 0.5,
    question: `Usando métodos dunder, escribe la clase \`Ranking\` en Python que implemente el siguiente comportamiento:

\`\`\`
>> r = Ranking()
>> r[1] = "Amancio Ortega"
>> r[2] = "Carlos Slim"
>> r[3] = "Bill Gates"
>> print(r[1])
Amancio Ortega
>> print(r)
1: Amancio Ortega
2: Carlos Slim
3: Bill Gates
\`\`\``,
    correctAnswer: `\`\`\`python
class Ranking:
    def __init__(self):
        self._items = {}

    def __setitem__(self, key, value):
        self._items[key] = value

    def __getitem__(self, key):
        return self._items[key]

    def __str__(self):
        return "\\n".join(f"{k}: {v}" for k, v in sorted(self._items.items()))
\`\`\``,
    explanation:
      "`__getitem__` permite acceder con `[]`, `__setitem__` permite asignar con `[]`, `__str__` formatea la salida ordenada por clave.",
  },

  // --- Person (contador estático) ---
  {
    id: "rec_q15",
    exam: "recopilacion",
    topic: "poo",
    type: "text",
    points: 0.5,
    question: `Implementa en Python el siguiente comportamiento:

\`\`\`
>> person1 = Person()
>> print(person1)
There is one person
>> person2 = Person()
>> print(person2)
There are two people
\`\`\``,
    correctAnswer: `\`\`\`python
class Person:
    count = 0

    def __init__(self):
        Person.count += 1

    def __str__(self):
        return f"There {'is' if Person.count == 1 else 'are'} {'one' if Person.count == 1 else 'two'} {'person' if Person.count == 1 else 'people'}"
\`\`\``,
    explanation:
      "Usa un atributo de clase `count` que se incrementa en cada `__init__`. `__str__` muestra el mensaje adaptado al número de instancias.",
  },

  // --- Date con propiedades ---
  {
    id: "rec_q16",
    exam: "recopilacion",
    topic: "poo",
    type: "text",
    points: 0.75,
    question: `Escribe el código adecuado para que el siguiente programa en Python funcione. Usa propiedades:

\`\`\`
>>> date = Date()
>>> date.day = 1
>>> date.month = 2
>>> date.year = 2003
>>> print(date.date)
"1/2/2003"
\`\`\``,
    correctAnswer: `\`\`\`python
class Date:
    def __init__(self):
        self._day = 1
        self._month = 1
        self._year = 2000

    @property
    def day(self):
        return self._day

    @day.setter
    def day(self, value):
        self._day = value

    @property
    def month(self):
        return self._month

    @month.setter
    def month(self, value):
        self._month = value

    @property
    def year(self):
        return self._year

    @year.setter
    def year(self, value):
        self._year = value

    @property
    def date(self):
        return f"{self._day}/{self._month}/{self._year}"
\`\`\``,
    explanation:
      "Se usa el decorador `@property` para los getters y `@name.setter` para los setters. La propiedad calculada `date` devuelve la fecha formateada.",
  },

  // ================================================================
  // SCRIPTING Y REGEX
  // ================================================================

  // --- Script emulando find ---
  {
    id: "rec_q17",
    exam: "recopilacion",
    topic: "scripting",
    type: "text",
    points: 0.75,
    question: `Programa un script que emule el comportamiento del comando \`find\`. Debe recibir como argumento un directorio de búsqueda, que procesará recursivamente. Su comportamiento por defecto será imprimir una línea con la ruta de cada fichero regular que encuentre. También debe aceptar la opción \`-regex\`, que aceptará expresiones regulares básicas y filtrará la salida mostrando únicamente los ficheros cuya ruta se empareje con el patrón. No está permitido usar el comando \`find\`.`,
    correctAnswer: `\`\`\`python
import os
import re
import sys

def find_emulator(root_dir, pattern=None):
    for dirpath, dirnames, filenames in os.walk(root_dir):
        for filename in filenames:
            full_path = os.path.join(dirpath, filename)
            if pattern is None or re.search(pattern, full_path):
                print(full_path)

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("directory")
    parser.add_argument("-regex", type=str, default=None)
    args = parser.parse_args()
    find_emulator(args.directory, args.regex)
\`\`\``,
    explanation:
      "`os.walk()` recorre recursivamente el directorio. Si se pasa `-regex`, se filtra con `re.search()`. `sys.argv` o `argparse` para procesar argumentos.",
  },

  // --- CSV suma de filas ---
  {
    id: "rec_q18",
    exam: "recopilacion",
    topic: "scripting",
    type: "text",
    points: 0.75,
    question: `Escribe un script de shell que lea por entrada estándar una matriz en formato CSV (valores numéricos separados por comas) y devuelva la suma de los valores de cada fila.

Ejemplo:
\`\`\`
$ cat f.txt
1.09,7.18,5.03,4.99,3.36
0.38,1.61,3.50,9.00,3.83
8.56,7.13,6.33,5.01,6.51

$ ./script.sh < f.txt
21.65
18.32
33.54
\`\`\``,
    correctAnswer: `\`\`\`bash
#!/bin/bash
while IFS=',' read -r -a fields; do
    sum=0
    for val in "\${fields[@]}"; do
        sum=$(echo "$sum + $val" | bc -l)
    done
    echo $sum
done
\`\`\``,
    explanation:
      "`IFS=','` separa la entrada por comas. `read -a` carga en un array. Se suma cada valor con `bc -l` que soporta decimales.",
  },

  // --- Reproductor de audio aleatorio ---
  {
    id: "rec_q19",
    exam: "recopilacion",
    topic: "scripting",
    type: "text",
    points: 0.5,
    question: `Escribe un script de shell que reproduzca ficheros de audio aleatorios mediante \`mplayer\`. Debe recibir un único parámetro: una ruta al directorio que contiene los ficheros de audio. Escoge un fichero aleatoriamente, lo reproduce y, tras terminar, escoge otro (se permiten repeticiones) hasta que se detenga la ejecución mediante una señal externa.`,
    correctAnswer: `\`\`\`bash
#!/bin/bash
dir="$1"
while true; do
    file=$(ls "$dir" | shuf -n 1)
    mplayer "$dir/$file"
done
\`\`\``,
    explanation:
      "Bucle infinito con `while true`. `shuf -n 1` elige un archivo aleatorio. `mplayer` reproduce el archivo y el bucle continúa al terminar.",
  },

  // --- CSV suma de columnas ---
  {
    id: "rec_q20",
    exam: "recopilacion",
    topic: "scripting",
    type: "text",
    points: 0.75,
    question: `Escribe un script de shell que lea por entrada estándar una matriz en formato CSV y devuelva la suma de los valores de cada columna.

Ejemplo:
\`\`\`
$ cat f.txt
1.09,7.18,5.03,4.99,3.36
0.38,1.61,3.50,9.00,3.83
8.56,7.13,6.33,5.01,6.51

$ ./script.sh < f.txt
22.56 26.13 21.19 30.63 22.77
\`\`\``,
    correctAnswer: `\`\`\`bash
#!/bin/bash
awk -F',' '{
    for (i=1; i<=NF; i++) {
        sum[i] += $i
    }
}
END {
    for (i=1; i<=NF; i++) {
        printf "%.2f ", sum[i]
    }
    printf "\\n"
}'
\`\`\``,
    explanation:
      "AWK es ideal para procesar datos tabulares. `-F','` establece la coma como separador. Se acumulan sumas por columna en un array y se imprimen al final.",
  },

  // --- /etc/passwd parsing ---
  {
    id: "rec_q21",
    exam: "recopilacion",
    topic: "scripting",
    type: "text",
    points: 0.75,
    question: `Escribe un script de shell que procese \`/etc/passwd\` y extraiga el nombre de usuario y su shell de cada línea.`,
    correctAnswer: `\`\`\`bash
#!/bin/bash
awk -F':' '{print $1, $7}' /etc/passwd
\`\`\``,
    explanation:
      "`/etc/passwd` tiene campos separados por `:`. El campo 1 es el nombre de usuario y el campo 7 es la shell. AWK con `-F':'` extrae fácilmente.",
  },

  // --- Contador de substrings en Python ---
  {
    id: "rec_q22",
    exam: "recopilacion",
    topic: "scripting",
    type: "text",
    points: 0.5,
    question: `Escribe un código Python que reciba por línea de comandos un string y una lista de palabras separadas por espacios, y devuelva el número de palabras que contienen dicho string.

Ejemplo:
\`\`\`
$ python script.py man manuel manolo paco amamantar
3
\`\`\``,
    correctAnswer: `\`\`\`python
import sys

if len(sys.argv) < 3:
    sys.exit(1)

substring = sys.argv[1]
words = sys.argv[2:]
count = sum(1 for w in words if substring in w)
print(count)
\`\`\``,
    explanation:
      "`sys.argv[1]` es el substring a buscar, `sys.argv[2:]` son las palabras. Se cuenta con `sum()` y una expresión generadora que comprueba `substring in w`.",
  },

  // --- Redirección de stderr ---
  {
    id: "rec_q23",
    exam: "recopilacion",
    topic: "scripting",
    type: "mc",
    points: 0.25,
    question:
      "Se desea que la salida de errores de una sesión interactiva del shell se redirija al fichero `session-errors.txt`. ¿Qué comando se debe ejecutar?",
    options: [
      "A. `exec 2> session-errors.txt`",
      "B. `exec 1> session-errors.txt`",
      "C. `exec 2>&1 session-errors.txt`",
      "D. `exec > session-errors.txt 2>&1`",
    ],
    correctAnswer: "a",
    explanation:
      "`exec 2> file` redirige el descriptor de archivo 2 (stderr) a un fichero de forma permanente para la sesión actual.",
  },

  // --- Recuperar stderr ---
  {
    id: "rec_q24",
    exam: "recopilacion",
    topic: "scripting",
    type: "mc",
    points: 0.25,
    question:
      "Tras redirigir la salida de errores de la sesión interactiva del shell a un fichero, se desea recuperar la salida de errores por pantalla. ¿Qué comando se debe ejecutar?",
    options: [
      "A. `exec 2>/dev/tty`",
      "B. `exec 2>&1`",
      "C. `exec 2> /dev/stdout`",
      "D. `exec 2> /dev/pts/0`",
    ],
    correctAnswer: "a",
    explanation:
      "`exec 2>/dev/tty` redirige stderr de vuelta al terminal. `/dev/tty` siempre apunta al terminal actual, independientemente de redirecciones previas.",
  },

  // --- Comillas simples vs dobles en shell ---
  {
    id: "rec_q25",
    exam: "recopilacion",
    topic: "scripting",
    type: "text",
    points: 0.25,
    question:
      "Explica brevemente la diferencia funcional entre el uso de entrecomillado simple (`'`) y entrecomillado doble (`\"`) en un script de shell.",
    correctAnswer:
      "Las comillas simples (`'`) preservan el valor literal de todos los caracteres: no se expanden variables ni se interpretan caracteres especiales. Las comillas dobles (`\"`) permiten la expansión de variables (`$VAR`) y la sustitución de comandos (`$(cmd)`), pero suprimen el globbing y la separación de palabras.",
    explanation:
      "Con comillas simples: `echo '$HOME'` imprime literalmente `$HOME`. Con comillas dobles: `echo \"$HOME\"` imprime el valor de la variable HOME.",
  },

  // --- Tipado en AWK ---
  {
    id: "rec_q26",
    exam: "recopilacion",
    topic: "scripting",
    type: "text",
    points: 0.25,
    question: `Describe el sistema de tipado en AWK. ¿Qué tipos puede tener una variable? ¿Qué ocurre cuando se operan dos variables de tipos diferentes? Ilústralo con un ejemplo.`,
    correctAnswer: `AWK tiene tipado dinámico. Las variables pueden ser de tipo numérico o string, y se convierten automáticamente según el contexto.

- Si se usa una variable en una operación aritmética, se trata como número (0 si no es convertible).
- Si se usa en una operación de cadena, se trata como string.

Ejemplo: \`awk 'BEGIN { a = "5"; b = 3; print a + b }'\` → imprime 8 (conversión a número). \`awk 'BEGIN { a = 5; b = 3; print a b }'\` → imprime "53" (concatenación de strings).`,
    explanation:
      "El tipado es dinámico y coercitivo: AWK convierte automáticamente según el contexto de la operación (aritmética → número, concatenación → string).",
  },

  // --- Procesos > 10 minutos (ps) ---
  {
    id: "rec_q27",
    exam: "recopilacion",
    topic: "scripting",
    type: "text",
    points: 1.0,
    question: `Escribe un script de shell que muestre todos los comandos que llevan en ejecución más de 10 minutos. El formato de salida de \`ps axv\` es:

\`\`\`
  PID TTY  STAT TIME  MAJFL TRS    DRS    RSS   %MEM COMMAND
  112 ?    Ss   18:44 991   0      174076 19192 0.2  systemd-journald
  276 tty7 Ss+  701:59 223  0      294376 234476 2.8 vt7 -nolisten tcp
  321 ?    Ss   0:07  4     415    3872   1660  0.0  dbus-daemon
 5296 pts/1 Ss+  0:25  0     587    7148   3892  0.0  /bin/zsh
\`\`\`

El campo TIME tiene formato \`hh:mm\`. La salida debe mostrar PID, TIME y COMMAND.`,
    correctAnswer: `\`\`\`bash
#!/bin/bash
ps axv | awk 'NR>1 {
    split($4, t, ":")
    minutes = t[1] * 60 + t[2]
    if (minutes > 10) {
        printf "%-8s %-8s %s\\n", $1, $4, $10
    }
}'
\`\`\``,
    explanation:
      '`NR>1` salta la cabecera. `split($4, t, ":")` divide TIME en horas y minutos. Se convierte a minutos totales y se filtra > 10. Los campos son: $1=PID, $4=TIME, $10=COMMAND.',
  },

  // --- Regex para notación científica ---
  {
    id: "rec_q28",
    exam: "recopilacion",
    topic: "scripting",
    type: "text",
    points: 0.5,
    question: `Escribe una expresión regular en el formato que prefieras que reconozca números en notación científica: empiezan con una parte entera opcional (si no figura se asume que es cero), un punto y una parte fraccionaria, y opcionalmente una letra "e" (mayúscula o minúscula) y un número entero (positivo o negativo) indicando el exponente.

Ejemplos válidos: \`.783e-45\`, \`3.14e10\`, \`0.5E+2\``,
    correctAnswer:
      "`^\\d*\\.\\d+([eE][+-]?\\d+)?$`\n\nDesglose:\n- `\\d*` — parte entera opcional (0 o más dígitos)\n- `\\.` — punto decimal obligatorio\n- `\\d+` — parte fraccionaria (1 o más dígitos)\n- `([eE][+-]?\\d+)?` — exponente opcional: 'e' o 'E', signo opcional, dígitos",
    explanation:
      "La regex debe aceptar `.783e-45` (sin parte entera), `3.14e10` (con entera y exponente sin signo), y rechazar formatos no científicos como `42` (sin punto decimal).",
  },

  // --- Monitor de conexiones SSH ---
  {
    id: "rec_q29",
    exam: "recopilacion",
    topic: "scripting",
    type: "text",
    points: 1.0,
    question: `Implementa un script de shell que monitorice el número de conexiones SSH activas a un servidor. Si el número de conexiones excede un umbral (definido en la variable de entorno \`SSH_THRESHOLD\`), el script deberá registrar un mensaje de advertencia en un fichero \`ssh_alerts.log\`, incluyendo la marca de tiempo y el número de conexiones.

- Usa \`ss\` para monitorizar (busca conexiones entrantes: puerto local \`ssh\`)
- Usa \`date -Iseconds\` para la marca de tiempo
- El script debe ser robusto a \`SSH_THRESHOLD\` no definido o mal formado
- El script se ejecuta una única vez (sin bucle)

Ejemplo de salida:
\`\`\`
2025-06-05T10:53:48+02:00 - WARNING: 17 conexiones (umbral = 15)
\`\`\``,
    correctAnswer: `\`\`\`bash
#!/bin/bash

THRESHOLD=\${SSH_THRESHOLD:-10}

# Validate threshold is a number
if ! [[ "$THRESHOLD" =~ ^[0-9]+$ ]]; then
    echo "SSH_THRESHOLD inválido: $THRESHOLD" >&2
    exit 1
fi

# Count incoming SSH connections (port :ssh in Local Address:Port)
count=$(ss -t state established | grep -c ':ssh[[:space:]]')

if [ "$count" -gt "$THRESHOLD" ]; then
    timestamp=$(date -Iseconds)
    echo "$timestamp - WARNING: $count conexiones (umbral = $THRESHOLD)" >> ssh_alerts.log
fi
\`\`\``,
    explanation:
      "`${SSH_THRESHOLD:-10}` usa valor por defecto si no está definida. Validación con regex `^[0-9]+$`. `ss -t state established` lista conexiones TCP establecidas. `grep -c` cuenta las que tienen puerto ssh como local.",
  },

  // --- Script mata-procesos por memoria ---
  {
    id: "rec_q30",
    exam: "recopilacion",
    topic: "scripting",
    type: "text",
    points: 1.0,
    question: `Escribe un programa en bash que, al superarse un límite de memoria, mate el proceso que consuma más memoria. En pseudocódigo:

\`\`\`
Mientras (Verdadero) Hacer
  Si (memoria_ocupada > LIMITE_MEMORIA) Entonces
    matar(SIGKILL, pid_con_más_memoria)
  Fin Si
  dormir(TIEMPO_ESPERA)
Fin Mientras
\`\`\`

Usa \`free -m\` para obtener la memoria y \`ps aux --sort=-%mem\` para los procesos.`,
    correctAnswer: `\`\`\`bash
#!/bin/bash

LIMITE_MEMORIA=80
TIEMPO_ESPERA=5

while true; do
    memoria_usada=$(free -m | awk 'NR==2{print $3}')

    if [ "$memoria_usada" -gt "$LIMITE_MEMORIA" ]; then
        pid_max=$(ps aux --sort=-%mem | awk 'NR==2{print $2}')
        kill -SIGKILL "$pid_max"
    fi

    sleep "$TIEMPO_ESPERA"
done
\`\`\``,
    explanation:
      "`free -m | awk 'NR==2{print $3}'` obtiene la memoria usada en MB de la segunda línea. `ps aux --sort=-%mem` ordena por uso de memoria descendente. `NR==2` toma el proceso que más consume (primero tras la cabecera). `kill -SIGKILL` lo mata.",
  },

  // --- Filtrar equipos por diferencia de puntos ---
  {
    id: "rec_q31",
    exam: "recopilacion",
    topic: "scripting",
    type: "text",
    points: 1.0,
    question: `Escribe un script de shell que reciba como entrada una tabla de clasificación en formato texto y tenga como salida los nombres de los equipos que anotaron más puntos de los que recibieron.

Ejemplo de entrada:
\`\`\`
1 COVIRÁN GRANADA 10 12 5 1400 1347 30 0
2 RÍO BREOGÁN 10 12 5 1400 1341 30 1
3 TAU CASTELLÓ 10 12 4 1401 1400 30 0
4 LEYMA CORUÑA 10 12 4 1400 1400 30 1
5 LIBERBANK OVIEDO 10 9 9 1400 1400 27 2
\`\`\`

Salida esperada:
\`\`\`
COVIRÁN GRANADA
RÍO BREOGÁN
TAU CASTELLÓ
LEYMA CORUÑA
\`\`\``,
    correctAnswer: `\`\`\`bash
#!/bin/bash
while read -r linea; do
    campos=($linea)
    pf=\${campos[5]}  # Puntos a favor (columna 6, índice 5)
    pc=\${campos[6]}  # Puntos en contra (columna 7, índice 6)
    if [ "$pf" -gt "$pc" ]; then
        echo "\${campos[@]:1:3}"  # Nombre del equipo (columnas 2-4)
    fi
done
\`\`\``,
    explanation:
      "Se lee línea por línea, se divide en campos con `read -r`. Se comparan las columnas de puntos a favor (6) y en contra (7). Si PF > PC, se imprime el nombre del equipo.",
  },

  // ================================================================
  // DJANGO, APIs E INTEGRACIÓN
  // ================================================================

  // --- Django request handling ---
  {
    id: "rec_q32",
    exam: "recopilacion",
    topic: "django-apis",
    type: "text",
    points: 0.5,
    question:
      "Dibuja un esquema, lo más detallado posible, donde se muestre cómo se atiende la petición de una determinada URL en Django. Incluye también un breve texto explicativo.",
    correctAnswer: `Flujo de una petición en Django:

1. **Navegador** → envía petición HTTP al servidor
2. **urls.py** → el dispatcher de URLs compara la URL solicitada con los patrones definidos y la dirige a la vista correspondiente
3. **views.py** → la vista procesa la lógica de negocio: consulta modelos si es necesario, procesa formularios, etc.
4. **models.py** → si la vista necesita datos, consulta la BD a través del ORM de Django
5. **template** → la vista renderiza una plantilla HTML con los datos obtenidos
6. **Respuesta HTTP** → se devuelve al navegador`,
    explanation:
      "El patrón MVT de Django: URL dispatcher → View → Model (opcional) → Template → Response. Las URLs se mapean en `urlpatterns` usando `path()` o `re_path()`.",
  },

  // --- Django URLs ---
  {
    id: "rec_q33",
    exam: "recopilacion",
    topic: "django-apis",
    type: "text",
    points: 0.5,
    question: `Completa el siguiente fragmento del \`urls.py\` de una aplicación Django:

URLs:
- new: \`/news\`
- get: \`/news/<id>\`
- delete: \`/news/<id>/delete\`
- edit: \`/news/<id>/edit\`

Fragmento a completar:
\`\`\`python
from django.urls import path
from . import views

urlpatterns = [
    path('/news', views.news, name='news'),
    path('/news/<int:id>', views.get, name='get'),
    ...
]
\`\`\``,
    correctAnswer: `\`\`\`python
from django.urls import path
from . import views

urlpatterns = [
    path('news/', views.news, name='news'),
    path('news/<int:id>/', views.get, name='get'),
    path('news/<int:id>/delete/', views.delete, name='delete'),
    path('news/<int:id>/edit/', views.edit, name='edit'),
]
\`\`\``,
    explanation:
      "Los patrones de URL en Django no llevan `/` al inicio. Se añaden las rutas `delete/` y `edit/` como sufijos del patrón con `<int:id>`. Cada ruta se asocia a una vista y tiene un nombre único.",
  },

  // --- Django URL completa ---
  {
    id: "rec_q34",
    exam: "recopilacion",
    topic: "django-apis",
    type: "text",
    points: 0.5,
    question: `Dado el siguiente archivo \`urls.py\` de Django, escribe la URL completa que permitiría ver el perfil del usuario con ID 25:

\`\`\`python
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('usuarios/', views.lista_usuarios, name='usuarios'),
    path('usuarios/<int:user_id>/', views.perfil_usuario, name='perfil'),
    path('usuarios/<int:user_id>/editar/', views.editar_usuario, name='editar'),
]
\`\`\`

Asume que el proyecto Django se ejecuta en \`http://localhost:8000/\`.`,
    correctAnswer: "`http://localhost:8000/usuarios/25/`",
    explanation:
      "El patrón `'usuarios/<int:user_id>/'` captura un entero en la URL. Sustituyendo `<int:user_id>` por 25, la URL completa es `http://localhost:8000/usuarios/25/`.",
  },

  // --- MVT: diferencias modelo, vista, plantilla ---
  {
    id: "rec_q35",
    exam: "recopilacion",
    topic: "django-apis",
    type: "text",
    points: 0.5,
    question:
      "Diferencia modelo, vista y plantilla del patrón MVT de Django. Explica los roles que tienen cada uno durante una petición.",
    correctAnswer: `- **Modelo (Model)**: Define la estructura de datos y la lógica de negocio. Se encarga de la interacción con la base de datos a través del ORM. Representa las tablas y sus relaciones.
- **Vista (View)**: Contiene la lógica de la aplicación. Recibe la petición HTTP, procesa los datos (consultando modelos si es necesario) y devuelve una respuesta HTTP (normalmente renderizando una plantilla).
- **Plantilla (Template)**: Define la presentación. Es un archivo HTML con sintaxis de Django Templates que permite mostrar datos dinámicos pasados desde la vista.`,
    explanation:
      "MVT es similar a MVC pero con roles redistribuidos: el Modelo = Modelo, la Vista = Controlador, y la Plantilla = Vista. Django maneja el enrutamiento URL → Vista automáticamente.",
  },

  // --- OAuth: conceptos ---
  {
    id: "rec_q36",
    exam: "recopilacion",
    topic: "django-apis",
    type: "text",
    points: 0.5,
    question: `Define los siguientes conceptos en el contexto de OAuth:

a. Usuario
b. Cliente
c. Proveedor del servicio
d. Credenciales temporales
e. Credenciales cliente
f. Credenciales token`,
    correctAnswer: `a. **Usuario**: Persona que posee los recursos protegidos y autoriza al cliente a acceder a ellos.
b. **Cliente**: Aplicación que solicita acceso a los recursos protegidos en nombre del usuario.
c. **Proveedor del servicio**: Servidor que aloja los recursos protegidos y gestiona la autenticación/autorización.
d. **Credenciales temporales** (Request Token): Clave temporal obtenida en el primer paso del flujo OAuth, antes de la autorización del usuario.
e. **Credenciales cliente** (Consumer Key/Secret): Identifican de forma única a la aplicación cliente ante el proveedor.
f. **Credenciales token** (Access Token): Token obtenido tras la autorización del usuario, permite al cliente acceder a los recursos protegidos.`,
    explanation:
      "OAuth es un protocolo de autorización con 4 roles: Resource Owner (Usuario), Client (Aplicación), Resource Server y Authorization Server (ambos parte del Proveedor). Las credenciales cliente son permanentes; los tokens son temporales.",
  },

  // --- OAuth: roles en escenario concreto ---
  {
    id: "rec_q37",
    exam: "recopilacion",
    topic: "django-apis",
    type: "text",
    points: 0.5,
    question: `Una aplicación web llamada \`analyzemytwitter.com\` proporciona a sus usuarios un análisis estadístico de su actividad en Twitter. El usuario debe autorizar a la aplicación para que acceda a su cuenta. Identifica qué participantes se corresponden con los roles de: Proveedor de servicio, Recursos protegidos, Cliente y Usuario.`,
    correctAnswer: `- **Usuario**: La persona que usa analyzemytwitter.com
- **Recursos protegidos**: Los tweets del usuario
- **Proveedor de servicio**: Twitter
- **Cliente**: analyzemytwitter.com`,
    explanation:
      "El usuario es el dueño de los tweets (recursos protegidos). Twitter es el proveedor que aloja y protege los recursos. analyzemytwitter.com es el cliente que solicita acceso en nombre del usuario.",
  },

  // --- OAuth: quién recibe qué credenciales ---
  {
    id: "rec_q38",
    exam: "recopilacion",
    topic: "django-apis",
    type: "matching",
    points: 0.5,
    question:
      "Indica qué credenciales recibe cada parte en el protocolo OAuth. Asigna a cada rol las credenciales que le corresponden.",
    correctAnswer: {
      Cliente: "A",
      "Proveedor del servicio": "B",
      "Recursos protegidos": "C",
    },
    explanation:
      "A (Credenciales del cliente + Request Token + Access Token): El cliente posee sus propias credenciales y obtiene los tokens durante el flujo.\nB (Credenciales del cliente): El proveedor conoce las credenciales del cliente registradas.\nC (Access Token): El servidor de recursos solo necesita validar el Access Token para autorizar el acceso.",
  },

  // --- Dibuja flujo de datos Django ---
  {
    id: "rec_q39",
    exam: "recopilacion",
    topic: "django-apis",
    type: "text",
    points: 0.5,
    question: "Dibuja el flujo de datos de una aplicación Django.",
    correctAnswer:
      "Flujo de datos en Django MVT:\n\n" +
      "1. **Petición HTTP** → el navegador/cliente envía una solicitud\n" +
      "2. **Middleware** → procesamiento previo (sesiones, autenticación, etc.)\n" +
      "3. **URL Dispatcher** → `urls.py` enruta la petición a la vista correcta\n" +
      "4. **Vista** → `views.py` recibe la request y ejecuta la lógica:\n" +
      "   - Lee datos de la request (GET, POST, parámetros)\n" +
      "   - Consulta/modifica la BD a través de `models.py`\n" +
      "   - Procesa formularios, valida datos\n" +
      "5. **Contexto** → la vista prepara un diccionario de datos para la plantilla\n" +
      "6. **Plantilla** → `templates/*.html` renderiza el HTML con los datos del contexto\n" +
      "7. **Respuesta HTTP** → se devuelve al cliente pasando de nuevo por middleware\n\n" +
      "```\n" +
      "Cliente → WSGI → Middleware → URLconf → Vista → Modelo/BD → Plantilla → Response\n" +
      "```",
    explanation:
      "El flujo sigue el patrón MVT: URL routing → View logic → Model (ORM) → Template rendering → HTTP Response. El middleware envuelve todo el ciclo request-response.",
  },

  // --- REST: definición del acrónimo ---
  {
    id: "rec_q40",
    exam: "recopilacion",
    topic: "django-apis",
    type: "mc",
    points: 0.25,
    question: "¿Qué significa el acrónimo REST?",
    options: [
      "A. Representational State Transfer",
      "B. Representational Standard Transfer",
      "C. Representational Standard Transmission",
      "D. Representational Server Transfer",
    ],
    correctAnswer: "a",
    explanation:
      "REST = Representational State Transfer. Es un estilo arquitectónico para APIs que usa HTTP y recursos identificados por URLs.",
  },

  // --- API de Twitter: claves ---
  {
    id: "rec_q41",
    exam: "recopilacion",
    topic: "django-apis",
    type: "mc",
    points: 0.25,
    question:
      "En el API de Twitter, ¿qué par de claves identifican a la aplicación ante el servidor?",
    options: [
      "A. CONSUMER_KEY – CONSUMER_SECRET",
      "B. CLIENT_KEY – CLIENT_SECRET",
      "C. ACCESS_KEY – ACCESS_SECRET",
      "D. APPLICATION_KEY – APPLICATION_SECRET",
    ],
    correctAnswer: "a",
    explanation:
      "En OAuth 1.0a (Twitter API clásica), las credenciales del cliente se llaman Consumer Key y Consumer Secret. Identifican de forma única a la aplicación registrada.",
  },

  // --- Django: crear proyecto ---
  {
    id: "rec_q42",
    exam: "recopilacion",
    topic: "django-apis",
    type: "mc",
    points: 0.25,
    question:
      "¿Qué comando se utiliza para crear un nuevo proyecto llamado *miproyecto* en Django?",
    options: [
      "A. `django-admin initproject miproyecto`",
      "B. `django-admin startproject miproyecto`",
      "C. `./manage.py startapp miproyecto`",
      "D. `./manage.py initproject miproyecto`",
    ],
    correctAnswer: "b",
    explanation:
      "`django-admin startproject nombre` crea un nuevo proyecto Django. `startapp` es para crear aplicaciones dentro de un proyecto existente.",
  },

  // ================================================================
  // CONCEPTOS Y TEST
  // ================================================================

  // --- Python: print a+b donde a=string, b=int ---
  {
    id: "rec_q43",
    exam: "recopilacion",
    topic: "conceptos",
    type: "mc",
    points: 0.25,
    question: `Dado el siguiente código en Python:

\`\`\`python
a = "Somos "
b = 2
\`\`\`

¿Qué resultado producirá el comando \`print(a + b)\`?`,
    options: [
      'A. Imprimirá por pantalla "Somos 2"',
      'B. Imprimirá por pantalla "Somos +2"',
      "C. Dará un error",
      'D. Imprimirá por pantalla "Somos NULL"',
    ],
    correctAnswer: "c",
    explanation:
      "En Python no se puede concatenar un string con un entero directamente. `a + b` lanza un `TypeError`. Para que funcione habría que convertir: `a + str(b)`.",
  },

  // --- Python: método para print ---
  {
    id: "rec_q44",
    exam: "recopilacion",
    topic: "conceptos",
    type: "mc",
    points: 0.25,
    question:
      "¿Qué método hay que redefinir en una clase para cambiar el comportamiento del comando `print(s)` donde `s` es un objeto de dicha clase?",
    options: [
      "A. `__print__`",
      "B. `__string__`",
      "C. `__repr__`",
      "D. `__char__`",
    ],
    correctAnswer: "c",
    explanation:
      "`print()` llama a `__str__()` si existe, y si no, usa `__repr__()`. Si solo se redefine un método, `__repr__()` es usado por `print()` como fallback. La respuesta más correcta en este contexto es `__repr__`, ya que es el que siempre se usa como base.",
  },

  // --- Lenguajes de primera generación ---
  {
    id: "rec_q45",
    exam: "recopilacion",
    topic: "conceptos",
    type: "mc",
    points: 0.125,
    question:
      '¿Qué tipo de lenguajes se clasifican como lenguajes de programación "de primera generación"?',
    options: [
      "A. Lenguajes ensambladores",
      "B. Lenguajes de alto nivel como C o Java",
      "C. Lenguajes máquina (código binario)",
      "D. Lenguajes visuales y de scripting",
    ],
    correctAnswer: "c",
    explanation:
      "Los lenguajes de 1ª generación (1GL) son los lenguajes máquina, compuestos por instrucciones en código binario directamente ejecutables por el procesador.",
  },

  // --- Diferencia compilados vs interpretados ---
  {
    id: "rec_q46",
    exam: "recopilacion",
    topic: "conceptos",
    type: "text",
    points: 0.5,
    question:
      "Explica de la forma más detallada posible las diferencias entre lenguajes compilados y lenguajes interpretados.",
    correctAnswer: `**Lenguajes compilados** (C, C++, Rust, Go):
- El código fuente se traduce completamente a código máquina antes de la ejecución
- El compilador genera un archivo ejecutable independiente
- La detección de errores se realiza en tiempo de compilación
- Mayor rendimiento en ejecución (optimizaciones del compilador)
- El ejecutable es específico de la plataforma

**Lenguajes interpretados** (Python, JavaScript, Ruby):
- El código se ejecuta línea por línea mediante un intérprete en tiempo de ejecución
- No se genera un ejecutable independiente
- Los errores se detectan en tiempo de ejecución
- Menor rendimiento en ejecución
- Mayor portabilidad (el intérprete abstrae la plataforma)

**Lenguajes híbridos** (Java, C#): compilación a bytecode + interpretación/compilación JIT en una máquina virtual.`,
    explanation:
      "La diferencia fundamental es el momento de la traducción: antes de la ejecución (compilados) vs durante la ejecución (interpretados). Esto afecta al rendimiento, detección de errores y portabilidad.",
  },

  // --- Fase de comprobación de tipos en compilación ---
  {
    id: "rec_q47",
    exam: "recopilacion",
    topic: "conceptos",
    type: "mc",
    points: 0.125,
    question:
      "¿Durante qué fase del proceso de compilación se comprueba que el tipo de las variables se corresponde con el esperado?",
    options: [
      "A. Análisis léxico",
      "B. Análisis sintáctico",
      "C. Análisis semántico",
      "D. Optimización de código",
    ],
    correctAnswer: "c",
    explanation:
      "En la fase de análisis semántico se verifica la coherencia del programa: comprobación de tipos, ámbito de variables, compatibilidad de operaciones, etc.",
  },

  // --- Operador shell: pipe vs redirección ---
  {
    id: "rec_q48",
    exam: "recopilacion",
    topic: "conceptos",
    type: "mc",
    points: 0.125,
    question: `Considera el comando del shell:

\`\`\`
$ ./program1 opciones1 ■ ./program2 opciones2
\`\`\`

¿Qué operador debemos emplear en lugar de ■ para que la salida de program1 se use como entrada de program2?`,
    options: [
      "A. `>` (redirección)",
      "B. `|` (pipe)",
      "C. `&` (background)",
      "D. `;` (separador)",
    ],
    correctAnswer: "b",
    explanation:
      "El operador `|` (pipe) conecta la salida estándar de un comando con la entrada estándar del siguiente. `>` redirige a un archivo, no a otro comando.",
  },

  // --- SWIG: compilación de proyecto Python con C/C++ ---
  {
    id: "rec_q49",
    exam: "recopilacion",
    topic: "conceptos",
    type: "text",
    points: 0.5,
    question:
      "Explica a grandes rasgos qué pasos son necesarios para compilar un proyecto Python que utilice una librería escrita en C o C++ a través de SWIG, qué ficheros intervienen en el proceso y qué tipo de contenido tiene cada uno.",
    correctAnswer: `**Pasos para integrar C/C++ con Python usando SWIG:**

1. **Código C/C++ original** (\`milib.c\` / \`milib.h\`): implementa la funcionalidad.
2. **Archivo de interfaz SWIG** (\`milib.i\`): describe qué funciones/clases exportar a Python. Contiene declaraciones SWIG y directivas \`%module\`.
3. **Generación del wrapper** (\`milib_wrap.c\`): ejecutar \`swig -python milib.i\` genera código C de puente entre Python y la librería.
4. **Compilación**: compilar \`milib.c\` y \`milib_wrap.c\` en una biblioteca compartida (\`_milib.so\` en Linux/Mac, \`_milib.pyd\` en Windows).
5. **Archivo Python** (\`milib.py\`): también generado por SWIG, proporciona la interfaz Python que carga el módulo nativo.

Resultado: se importa en Python como \`import milib\`.`,
    explanation:
      "SWIG (Simplified Wrapper and Interface Generator) automatiza la creación de wrappers. El archivo `.i` define la interfaz. SWIG genera el código C de puente y el módulo Python. El resultado es una biblioteca compartida importable desde Python.",
  },

  // --- Compilados vs interpretados (MC) ---
  {
    id: "rec_q50",
    exam: "recopilacion",
    topic: "conceptos",
    type: "mc",
    points: 0.5,
    question:
      "¿Cuál es la diferencia fundamental entre los lenguajes compilados y los lenguajes interpretados?",
    options: [
      "A. Los compilados usan memoria dinámica y los interpretados no.",
      "B. Los compilados traducen el código antes de ejecutarlo; los interpretados lo ejecutan instrucción por instrucción.",
      "C. Los interpretados no tienen sistema de tipos.",
      "D. Los compilados son siempre más rápidos que los interpretados.",
    ],
    correctAnswer: "b",
    explanation:
      "La diferencia fundamental es cuándo se traduce el código: antes de la ejecución (compilados, todo de una vez) vs durante la ejecución (interpretados, instrucción a instrucción).",
  },

  // --- map / split / combine emails ---
  {
    id: "rec_q51",
    exam: "recopilacion",
    topic: "django-apis",
    type: "text",
    points: 0.75,
    question: `Usando las funciones \`map\`, \`split\` y \`combine\` (o equivalente en Python), realiza operaciones sobre una lista de direcciones de correo electrónico para extraer los dominios únicos.

Ejemplo:
\`\`\`
emails = ["diego@udc.es", "gabriel@udc.es", "admin@gmail.com"]
\`\`\`

Debe devolver: \`["udc.es", "gmail.com"]\``,
    correctAnswer: `\`\`\`python
emails = ["diego@udc.es", "gabriel@udc.es", "admin@gmail.com"]

# Extraer dominios únicos
dominios = set(map(lambda e: e.split("@")[1], emails))
print(list(dominios))
\`\`\`

O con list comprehension:
\`\`\`python
dominios = list({email.split("@")[1] for email in emails})
\`\`\``,
    explanation:
      "`map()` aplica una función a cada elemento. `split('@')[1]` extrae el dominio. `set()` elimina duplicados para obtener dominios únicos.",
  },

  // --- Test: puntuación del examen tipo test ---
  {
    id: "rec_q52",
    exam: "recopilacion",
    topic: "conceptos",
    type: "text",
    points: 0.5,
    question: `Un examen tipo test tiene las siguientes reglas de puntuación:
- Cada respuesta correcta suma 0.2 puntos
- Cada respuesta incorrecta resta 0.05 puntos
- Las preguntas sin responder no afectan a la nota
- La puntuación global nunca será inferior a 0 puntos

Si un estudiante responde 15 preguntas correctamente, 5 incorrectamente y deja 10 sin responder sobre un total de 30, ¿cuál es su puntuación final?`,
    correctAnswer:
      "Puntuación = (15 × 0.2) + (5 × (−0.05)) + (10 × 0) = 3.0 − 0.25 = 2.75 puntos.",
    explanation:
      "Solo las preguntas respondidas afectan. Correctas suman 0.2, incorrectas restan 0.05. Sin responder no afectan. La nota nunca es negativa (aunque aquí no aplica porque es positiva).",
  },

  // --- Diferencia entre modelo, vista y template en Django (diagrama) ---
  {
    id: "rec_q53",
    exam: "recopilacion",
    topic: "django-apis",
    type: "text",
    points: 0.5,
    repeated: true,
    question:
      "Dibuja en un diagrama cómo se maneja una petición Django, especificando qué papel juega en dicho proceso el fichero `urls.py`, las vistas, las templates y el modelo.",
    correctAnswer: `Diagrama del flujo MVT en Django:

\`\`\`
[Cliente] --HTTP Request--> [urls.py: URL Dispatcher]
                                  |
                                  v
                           [views.py: Vista]
                            /              \\
                           v                v
                    [models.py: ORM]   [template.html]
                           \\              /
                            v            v
                         [Respuesta HTTP]
                                  |
                                  v
                            [Cliente]
\`\`\`

- **urls.py**: enruta la URL solicitada a la vista correspondiente
- **Vista (views.py)**: procesa la lógica, consulta modelos si es necesario
- **Modelo (models.py)**: abstrae el acceso a la base de datos
- **Template**: renderiza el HTML con los datos del contexto`,
    explanation:
      "El patrón MVT separa responsabilidades: enrutamiento (URLconf), lógica de negocio (vistas), acceso a datos (modelos) y presentación (templates).",
  },

  // --- Petición Django: roles detallados ---
  {
    id: "rec_q54",
    exam: "recopilacion",
    topic: "django-apis",
    type: "text",
    points: 0.5,
    repeated: true,
    question:
      "Explica a grandes rasgos cómo se maneja una petición en Django, especificando el papel del fichero `urls.py`, las vistas, las templates y el modelo. Incluye un diagrama de flujo.",
    correctAnswer: `**Flujo de una petición Django:**

\`\`\`
Cliente → WSGI/ASGI → Middleware → URL Router (urls.py) → Vista (views.py)
                                                          ↙           ↘
                                                     Modelo (BD)    Template
                                                         ↘           ↙
                                                      HttpResponse → Cliente
\`\`\`

1. **URL Router (urls.py)**: analiza la URL de la petición y la compara con los patrones definidos en \`urlpatterns\`. Cuando encuentra coincidencia, llama a la función vista asociada.

2. **Vista (views.py)**: función o clase que recibe un objeto \`HttpRequest\` y debe devolver un \`HttpResponse\`. Aquí se implementa la lógica: validar datos, consultar modelos, procesar formularios.

3. **Modelo (models.py)**: define la estructura de datos mediante clases Python que Django mapea a tablas SQL. La vista usa el ORM para consultar/guardar datos sin escribir SQL.

4. **Template**: archivo HTML con etiquetas de Django Template Language (DTL) que la vista renderiza con un contexto (diccionario de variables).`,
    explanation:
      "Django sigue el patrón MVT (Model-View-Template), análogo a MVC. La URL se resuelve en urls.py, la vista procesa la lógica usando modelos, y renderiza la respuesta con templates.",
  },
];
