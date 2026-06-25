import type { Question } from "../../data/types";

export const questions: Question[] = [
  {
    id: "q1",
    exam: "examen_recopilatorio",
    topic: "general",
    type: "mc",
    points: 1,
    question: "Suponga una aplicaci\u00f3n instalada siguiendo una arquitectura en 4 capas (capa 1: m\u00e1quina con el navegador; capa 2: m\u00e1quina con un servidor en el que est\u00e1 instalada una aplicaci\u00f3n web, internamente estructurada en una capa Interfaz Web de Usuario y una capa Acceso a Servicios, implementadas ambas con tecnolog\u00edas .NET; capa 3: m\u00e1quina con un servidor de aplicaciones en el que est\u00e1 instalado un servicio web, internamente estructurado en una capa Servicios y una capa Modelo, implementadas ambas con tecnolog\u00edas Java; capa 4: m\u00e1quina con la base de datos). Indicar cu\u00e1l de las siguientes afirmaciones es correcta:",
    options: ["a) No es posible que el software instalado en las capas 2 y 3 est\u00e9 implementado con diferentes tecnolog\u00edas, por tanto, la arquitectura descrita no es v\u00e1lida.", "b) Para optimizar la arquitectura, se podr\u00eda instalar y ejecutar la capa Interfaz Web de Usuario en el servidor de aplicaciones de la capa 3, donde se ejecuta la capa Modelo, haciendo innecesarias las capas Servicios y Acceso a Servicios.", "c) Si se cambia la base de datos instalada en la capa 4, habr\u00eda que realizar las modificaciones pertinentes en el c\u00f3digo y reinstalar el software de las capas 2 y 3.", "d) Ninguna de las anteriores."],
    correctAnswer: "d", // Placeholder
  },
  {
    id: "q2",
    exam: "examen_recopilatorio",
    topic: "general",
    type: "mc",
    points: 1,
    question: "Indique qu\u00e9 APIs o frameworks se han empleado en la asignatura para el desarrollo de la capa Servicios:",
    options: ["a) Servlets y Apache Thrift.", "b) JDBC y HTTPClient.", "c) JDBC y Servlets.", "d) Apache Thrift y HTTPClient."],
    correctAnswer: "a", // Placeholder
  },
  {
    id: "q3",
    exam: "examen_recopilatorio",
    topic: "general",
    type: "mc",
    points: 1,
    question: "Indique qu\u00e9 afirmaci\u00f3n relativa a la capa Modelo de los ejemplos de la asignatura y de su pr\u00e1ctica es correcta:",
    options: ["a) Para su compilaci\u00f3n requiere un driver JDBC espec\u00edfico a MySQL.", "b) Para su ejecuci\u00f3n requiere un driver JDBC espec\u00edfico a MySQL.", "c) Todas las anteriores.", "d) Ninguna de las anteriores."],
    correctAnswer: "b", // Placeholder
  },
  {
    id: "q4",
    exam: "examen_recopilatorio",
    topic: "general",
    type: "mc",
    points: 1,
    question: "Considere las dos siguientes estrategias de implementaci\u00f3n con respecto a los m\u00e9todos de los servicios de la capa Modelo. La capa Modelo est\u00e1 instalada dentro de un servidor de aplicaciones y es invocada por una capa Servicios REST. En la estrategia 2, la variable `dataSource` hace referencia a una instancia de una clase proporcionada por el servidor de aplicaciones que implementa la interfaz `DataSource` y utiliza la estrategia pool de conexiones. Indique la respuesta correcta.\n\n**Estrategia 1**\n```java\npublic void <<m\u00e9todo>> () {\n    try (Connection connection = DriverManager.getConnection(url, user, password)) {\n        << Implementar l\u00f3gica de negocio usando \"connection\". >>\n    } catch (SQLException e) {\n        throw new RuntimeException(e);\n    }\n}\n```\n\n**Estrategia 2**\n```java\npublic void <<m\u00e9todo>> () {\n    try (Connection connection = dataSource.getConnection()) {\n        << Implementar l\u00f3gica de negocio usando \"connection\". >>\n    } catch (SQLException e) {\n        throw new RuntimeException(e);\n    }\n}\n```",
    options: ["a) La estrategia 1 conduce a un tiempo menor de ejecuci\u00f3n.", "b) La estrategia 2 conduce a un tiempo menor de ejecuci\u00f3n.", "c) El m\u00e9todo `getConnection` del `dataSource` (estrategia 2) lanzar\u00e1 siempre una excepci\u00f3n si no queda ninguna conexi\u00f3n libre en el pool.", "d) La b) y la c) son correctas."],
    correctAnswer: "b", // Placeholder
  },
  {
    id: "q5",
    exam: "examen_recopilatorio",
    topic: "general",
    type: "mc",
    points: 1,
    question: "Analice el siguiente fragmento de c\u00f3digo e indique la afirmaci\u00f3n correcta:\n```java\ntry {\n    connection = dataSource.getConnection();\n    connection.setAutoCommit(false); // (1)\n    \n    Product product = productDao.find(connection, productId);\n    product.setStock(product.getStock() + increment);\n    productDao.update(connection, product);\n    \n    connection.commit();\n} catch (Exception e) {\n    connection.rollback(); // (2)\n}\n```",
    options: ["a) La l\u00ednea (1) evita problemas de concurrencia con otras transacciones.", "b) La l\u00ednea (2) garantiza que todas las sentencias SQL se ejecutar\u00e1n dentro de la misma transacci\u00f3n.", "c) Todas las anteriores.", "d) Ninguna de las anteriores."],
    correctAnswer: "d", // Placeholder
  },
  {
    id: "q6",
    exam: "examen_recopilatorio",
    topic: "general",
    type: "mc",
    points: 1,
    question: "Indique la afirmaci\u00f3n correcta de acuerdo al enfoque de desarrollo estudiado en la asignatura:",
    options: ["a) Las operaciones de los DAOs de su pr\u00e1ctica reciben la conexi\u00f3n para poder agrupar de manera sencilla varias operaciones de un mismo o distintos DAOs en una \u00fanica transacci\u00f3n.", "b) El uso de DAOs simplifica la implementaci\u00f3n de los m\u00e9todos de los servicios de la capa Modelo.", "c) Todas las anteriores.", "d) Ninguna de las anteriores."],
    correctAnswer: "c", // Placeholder
  },
  {
    id: "q7",
    exam: "examen_recopilatorio",
    topic: "general",
    type: "mc",
    points: 1,
    question: "Se est\u00e1 dise\u00f1ando una aplicaci\u00f3n bancaria que incluye, entre otros, un caso de uso para realizar una transferencia entre dos cuentas (no se permite la transferencia si la cuenta origen no tiene suficiente saldo). La interfaz gr\u00e1fica incluye un formulario en el que el usuario tiene que introducir el identificador de la cuenta origen (Long), el identificador de la cuenta destino (Long) y la cantidad de dinero a transferir (BigDecimal). Analice el DAO de la entidad Account (cuenta) que figura a continuaci\u00f3n e indique la respuesta correcta en base al enfoque de desarrollo estudiado en la asignatura:\n\n```java\npublic interface SqlAccountDao {\n    public Account find(Connection connection, Long accountId)\n        throws InstanceNotFoundException;\n    public void update(Connection connection, Account account)\n        throws InstanceNotFoundException;\n    public void transfer(Long sourceAccountId, Long targetAccountId,\n        BigDecimal amount);\n}\n```",
    options: ["a) La operaci\u00f3n `transfer` del DAO debe implementarse en t\u00e9rminos de `find` (para recuperar la cuenta origen y la cuenta destino) y `update` (para minorar el balance de la cuenta origen y aumentar el balance de la cuenta destino).", "b) En la operaci\u00f3n `transfer` del DAO falta el par\u00e1metro `Connection`, as\u00ed como especificar excepciones para el caso en el que la cuenta origen no tenga suficiente saldo o que alguna cuenta no exista.", "c) Todas las anteriores.", "d) Ninguna de las anteriores."],
    correctAnswer: "b", // Placeholder
  },
  {
    id: "q8",
    exam: "examen_recopilatorio",
    topic: "general",
    type: "mc",
    points: 1,
    question: "\u00bfQu\u00e9 puede decir con respecto a este c\u00f3digo?\n```java\npublic ... buyMovie(Long movieId, ...) throws ... {\n    ...\n    try (Connection connection = ...) {\n        ...\n        Movie movie = movieDao.find(connection, movieId);\n        Sale sale = saleDao.create(connection, new Sale(...));\n        ...\n    } catch (...) {\n        ...\n    }\n}\n```",
    options: ["a) Corresponde a la capa L\u00f3gica de Negocio.", "b) Corresponde a la capa Acceso a Datos.", "c) Corresponde a la capa Servicios Thrift.", "d) Corresponde a la capa Acceso a Servicios."],
    correctAnswer: "a", // Placeholder
  },
  {
    id: "q9",
    exam: "examen_recopilatorio",
    topic: "general",
    type: "mc",
    points: 1,
    question: "En base al enfoque aconsejado en la asignatura para la realizaci\u00f3n de pruebas de integraci\u00f3n, indique la afirmaci\u00f3n correcta:",
    options: ["a) Durante la ejecuci\u00f3n de las pruebas se utiliza el `DataSource` proporcionado por Jetty, al que se accede por JNDI.", "b) Durante la ejecuci\u00f3n de las pruebas se utiliza el `DataSource` proporcionado por Tomcat, al que se accede por JNDI.", "c) Durante la ejecuci\u00f3n de las pruebas es posible utilizar el `DataSource` proporcionado por Jetty o por Tomcat, a los que se accede por JNDI, dependiendo del valor de una propiedad del fichero de configuraci\u00f3n `ConfigurationParameters.properties` presente en `src/test/resources`.", "d) Ninguna de las anteriores."],
    correctAnswer: "d", // Placeholder
  },
  {
    id: "q10",
    exam: "examen_recopilatorio",
    topic: "general",
    type: "mc",
    points: 1,
    question: "Dado el siguiente fragmento de c\u00f3digo correspondiente a un m\u00e9todo de una clase de pruebas de integraci\u00f3n de la capa Modelo, implementada con JUnit 5, indique qu\u00e9 afirmaci\u00f3n es correcta:\n```java\n@Test\npublic void testRemoveElement() throws InputValidationException, InstanceNotFoundException {\n    // Fragmento de c\u00f3digo 1\n    ...\n    assertThrows(ElementNotRemovableException.class, () -> {\n        // Fragmento de c\u00f3digo 2\n        ...\n    });\n    // Fragmento de c\u00f3digo 3\n    ...\n}\n```",
    options: ["a) Se corresponde con un test que se ejecutar\u00e1 correctamente si durante la ejecuci\u00f3n del fragmento de c\u00f3digo 2 se lanza la excepci\u00f3n `ElementNotRemovableException` y NO es capturada por el c\u00f3digo de ese fragmento.", "b) Se corresponde con un test que se ejecutar\u00e1 correctamente si durante su ejecuci\u00f3n se lanza cualquiera de las excepciones declaradas en su cl\u00e1usula `throws` y NO es capturada por el c\u00f3digo del m\u00e9todo.", "c) Todas las anteriores.", "d) Ninguna de las anteriores."],
    correctAnswer: "a", // Placeholder
  },
  {
    id: "q11",
    exam: "examen_recopilatorio",
    topic: "general",
    type: "mc",
    points: 1,
    question: "Asumiendo las convenciones de nombrado utilizadas en la asignatura, \u00bfqu\u00e9 puede decir con respecto al m\u00e9todo `toClientMovieDto`?\n```java\nprivate static ClientMovieDto toClientMovieDto(JsonNode movieNode)\n    throws ParsingException {\n    if (movieNode.getNodeType() != JsonNodeType.OBJECT) {\n        throw new ParsingException(\"Unrecognized JSON (object expected)\");\n    } else {\n        ObjectNode movieObject = (ObjectNode) movieNode;\n        JsonNode movieIdNode = movieObject.get(\"movieId\");\n        Long movieId = (movieIdNode != null) ? movieIdNode.longValue() : null;\n        ...\n        return new ClientMovieDto(movieId, ...);\n    }\n}\n```",
    options: ["a) Convierte un DTO (Data Transfer Object) utilizado en la capa Servicios, a un objeto de la capa Modelo.", "b) Convierte un \u00e1rbol Jackson (recibe su nodo ra\u00edz) a un DTO utilizado en la capa Acceso a Servicios.", "c) Convierte un DTO (Data Transfer Object) utilizado en la capa Acceso a Servicios, a un \u00e1rbol Jackson (devuelve el nodo ra\u00edz del \u00e1rbol).", "d) Convierte un \u00e1rbol Jackson (recibe su nodo ra\u00edz) a un DTO utilizado en la capa Modelo."],
    correctAnswer: "b", // Placeholder
  },
  {
    id: "q12",
    exam: "examen_recopilatorio",
    topic: "general",
    type: "mc",
    points: 1,
    question: "Suponga que est\u00e1 dise\u00f1ando un Servicio Web seg\u00fan el enfoque REST estudiado en la asignatura y ya existe una funcionalidad que permite dar de alta un libro en un repositorio. Suponga que ahora desea modelar una funcionalidad que permite reemplazar la representaci\u00f3n de un libro en el repositorio. \u00bfQu\u00e9 opci\u00f3n escoger\u00eda?",
    options: ["a) El servicio permitir\u00e1 reemplazar la representaci\u00f3n de un libro invocando el URL del recurso individual libro (e.g. `http://www.servicename.com/books/123`) con el m\u00e9todo POST e incluyendo los nuevos datos del libro en un documento JSON incluido en el cuerpo de la petici\u00f3n.", "b) El servicio permitir\u00e1 reemplazar la representaci\u00f3n de un libro invocando el URL del recurso colecci\u00f3n libros (e.g. `http://www.servicename.com/books/`) con el m\u00e9todo POST e incluyendo el identificador y los nuevos datos del libro en un documento JSON incluido en el cuerpo de la petici\u00f3n.", "c) El servicio permitir\u00e1 reemplazar la representaci\u00f3n de un libro invocando el URL del recurso individual libro (e.g. `http://www.servicename.com/books/123`) con el m\u00e9todo PUT e incluyendo los nuevos datos del libro en un documento JSON incluido en el cuerpo de la petici\u00f3n.", "d) El servicio permitir\u00e1 reemplazar la representaci\u00f3n de un libro invocando el URL del recurso colecci\u00f3n libros (e.g. `http://www.servicename.com/books/`) con el m\u00e9todo PUT e incluyendo el identificador y los nuevos datos del libro en un documento JSON incluido en el cuerpo de la petici\u00f3n."],
    correctAnswer: "c", // Placeholder
  },
  {
    id: "q13",
    exam: "examen_recopilatorio",
    topic: "general",
    type: "mc",
    points: 1,
    question: "Suponga que est\u00e1 dise\u00f1ando un Servicio Web seg\u00fan el enfoque REST. Teniendo en cuenta las convenciones seguidas en la asignatura, \u00bfqu\u00e9 opci\u00f3n le parece m\u00e1s adecuada para la respuesta a una petici\u00f3n que falle debido a que la base de datos no est\u00e1 accesible en ese momento?",
    options: ["a) En la respuesta HTTP se indicar\u00e1 el c\u00f3digo de respuesta `200 OK` para indicar que el servidor entendi\u00f3 correctamente la petici\u00f3n y que el fallo es por causas ajenas a \u00e9l.", "b) En la respuesta HTTP se indicar\u00e1 el c\u00f3digo de respuesta `400 Bad Request` para indicar que la petici\u00f3n es incorrecta.", "c) En la respuesta HTTP se indicar\u00e1 el c\u00f3digo de respuesta `500 Internal Error` para indicar que la petici\u00f3n fall\u00f3 debido a un error interno.", "d) En la respuesta HTTP se indicar\u00e1 el c\u00f3digo `404 Not Found` para indicar que no se encontr\u00f3 la base de datos."],
    correctAnswer: "c", // Placeholder
  },
  {
    id: "q14",
    exam: "examen_recopilatorio",
    topic: "general",
    type: "mc",
    points: 1,
    question: "En el contexto de Servicios Web REST, suponga un intermediario gen\u00e9rico capaz de reintentar peticiones a servicios web REST que han devuelto c\u00f3digos de respuesta de error. Considerando las convenciones vistas en la asignatura y que 500 es un error temporal, diga qu\u00e9 afirmaci\u00f3n es correcta:",
    options: ["a) El intermediario NO reintentar\u00e1 una petici\u00f3n `POST http://www.servicename.com/books/1234` que ha devuelto el c\u00f3digo de respuesta `500 Internal Error`.", "b) El intermediario NO reintentar\u00e1 una petici\u00f3n `GET http://www.servicename.com/books/1234` que ha devuelto el c\u00f3digo de respuesta `500 Internal Error`.", "c) El intermediario NO reintentar\u00e1 una petici\u00f3n `PUT http://www.servicename.com/books/1234` que ha devuelto el c\u00f3digo de respuesta `500 Internal Error`.", "d) El intermediario NO reintentar\u00e1 una petici\u00f3n `DELETE http://www.servicename.com/books/1234` que ha devuelto el c\u00f3digo de respuesta `500 Internal Error`."],
    correctAnswer: "a", // Placeholder
  },
  {
    id: "q15",
    exam: "examen_recopilatorio",
    topic: "general",
    type: "mc",
    points: 1,
    question: "Considere el siguiente fragmento de c\u00f3digo e indique la respuesta correcta (asuma que `validateStatusCode` es el m\u00e9todo que se utiliza en los ejemplos de la asignatura con el mismo nombre):\n```java\nClassicHttpResponse response = (ClassicHttpResponse)\n    Request.delete(getEndpointAddress() + \"resources/\" + resourceId).\n        execute().returnResponse();\n\nvalidateStatusCode(HttpStatus.SC_NO_CONTENT, response);\n```",
    options: ["a) Es un fragmento de un m\u00e9todo de la capa Acceso a Servicios de una aplicaci\u00f3n cliente que realiza una petici\u00f3n HTTP DELETE incluyendo el identificador del recurso a eliminar en el cuerpo de la petici\u00f3n y espera recibir una respuesta HTTP que no devuelva ning\u00fan c\u00f3digo de estado (`HttpStatus.SC_NO_CONTENT`).", "b) Es un fragmento de un m\u00e9todo de la capa Acceso a Servicios de una aplicaci\u00f3n cliente que realiza una petici\u00f3n HTTP DELETE que no incluye nada en su cuerpo y espera recibir una respuesta HTTP que tampoco incluya nada en su cuerpo (`HttpStatus.SC_NO_CONTENT`).", "c) Es un fragmento de un Servlet de la capa Servicios REST que procesa una petici\u00f3n DELETE y env\u00eda un c\u00f3digo de respuesta 204 (`HttpStatus.SC_NO_CONTENT`) para indicar que no devuelve nada en el cuerpo de la respuesta.", "d) Es un fragmento de un Servlet de la capa Servicios REST que procesa una petici\u00f3n DELETE cuyo cuerpo debe estar vac\u00edo (`HttpStatus.SC_NO_CONTENT`) para que se procese correctamente."],
    correctAnswer: "b", // Placeholder
  },
  {
    id: "q16",
    exam: "examen_recopilatorio",
    topic: "general",
    type: "mc",
    points: 1,
    question: "Asumiendo que utilizamos la clase `es.udc.ws.util.servlet.RestHttpServletTemplate` del subproyecto de utilidades de los ejemplos de la asignatura (`ws-util`), indique la afirmaci\u00f3n INCORRECTA:",
    options: ["a) Si queremos implementar un servlet que responda a peticiones GET y POST, tendremos que crear una clase que herede de `RestHttpServletTemplate` y redefinir los m\u00e9todos `processGet` y `processPost`.", "b) Los servlets que heredan de `RestHttpServletTemplate` no tienen que preocuparse de tratar las excepciones del m\u00f3dulo `ws-util` (`InstanceNotFoundException`, `InputValidationException` y `ParsingException`) al procesar cualquier petici\u00f3n.", "c) No hay que declarar en el fichero `web.xml` los servlets que heredan de `RestHttpServletTemplate`, puesto que ya est\u00e1 declarada su superclase.", "d) Si un servlet hereda de `RestHttpServletTemplate` y no se desea que procese peticiones DELETE, no es necesario redefinir el m\u00e9todo `processDelete`, puesto que la implementaci\u00f3n por defecto de `processDelete` en `RestHttpServletTemplate` devuelve un c\u00f3digo de respuesta indicando que esa operaci\u00f3n no est\u00e1 implementada."],
    correctAnswer: "c", // Placeholder
  },
  {
    id: "q17",
    exam: "examen_recopilatorio",
    topic: "general",
    type: "mc",
    points: 1,
    question: "En el modelo de programaci\u00f3n RPC (Remote Procedure Call), indique cu\u00e1l de las siguientes afirmaciones es correcta:",
    options: ["a) El programador de la aplicaci\u00f3n servidora modela su funcionalidad a trav\u00e9s de un conjunto de operaciones est\u00e1ndar (operaciones que no son ad hoc).", "b) Las aplicaciones cliente y servidora tienen que escribirse en el mismo lenguaje de programaci\u00f3n.", "c) En cuanto a rendimiento, la invocaci\u00f3n de una operaci\u00f3n remota es similar a la invocaci\u00f3n de un m\u00e9todo de una librer\u00eda local.", "d) Cambios en la implementaci\u00f3n del servidor no obligan a regenerar el stub si no cambia nada en la interfaz del servicio."],
    correctAnswer: "d", // Placeholder
  },
  {
    id: "q18",
    exam: "examen_recopilatorio",
    topic: "general",
    type: "mc",
    points: 1,
    question: "Considere el siguiente fichero de definici\u00f3n de Apache Thrift, en el que se pretende declarar un servicio con una operaci\u00f3n, e indique la afirmaci\u00f3n correcta:\n```thrift\nnamespace java es.udc.ws.movies.thrift\n\nstruct ThriftMovieDto {\n    1: i64 movieId\n    2: string title\n}\n\nstruct ThriftInputValidationException {\n    1: string message\n}\n\nThriftMovieDto addMovie(1: ThriftMovieDto movieDto)\n    throws (1: ThriftInputValidationException e)\n```",
    options: ["a) La operaci\u00f3n `addMovie` debe definirse dentro de un servicio (usando la palabra reservada `service`).", "b) El par\u00e1metro de la operaci\u00f3n `addMovie` no puede ser de tipo `ThriftMovieDto`.", "c) El tipo `ThriftInputValidationException` debe definirse con la palabra reservada `exception` (en lugar de `struct`).", "d) La a) y la c) son correctas."],
    correctAnswer: "d", // Placeholder
  },
];