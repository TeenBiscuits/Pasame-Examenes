import type { Question } from "../../data/types";

export const questions: Question[] = [
	{
		id: "q1",
		examId: "recopilacion_012026",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			"Suponga una aplicaci\u00f3n instalada siguiendo una arquitectura en 4 capas (capa 1: m\u00e1quina con el navegador; capa 2: m\u00e1quina con un servidor en el que est\u00e1 instalada una aplicaci\u00f3n web, internamente estructurada en una capa Interfaz Web de Usuario y una capa Acceso a Servicios, implementadas ambas con tecnolog\u00edas .NET; capa 3: m\u00e1quina con un servidor de aplicaciones en el que est\u00e1 instalado un servicio web, internamente estructurado en una capa Servicios y una capa Modelo, implementadas ambas con tecnolog\u00edas Java; capa 4: m\u00e1quina con la base de datos). Indicar cu\u00e1l de las siguientes afirmaciones es correcta:",
		options: [
			"a) No es posible que el software instalado en las capas 2 y 3 est\u00e9 implementado con diferentes tecnolog\u00edas, por tanto, la arquitectura descrita no es v\u00e1lida.",
			"b) Para optimizar la arquitectura, se podr\u00eda instalar y ejecutar la capa Interfaz Web de Usuario en el servidor de aplicaciones de la capa 3, donde se ejecuta la capa Modelo, haciendo innecesarias las capas Servicios y Acceso a Servicios.",
			"c) Si se cambia la base de datos instalada en la capa 4, habr\u00eda que realizar las modificaciones pertinentes en el c\u00f3digo y reinstalar el software de las capas 2 y 3.",
			"d) Ninguna de las anteriores.",
		],
		correctAnswer: "d",
	},
	{
		id: "q2",
		examId: "recopilacion_012026",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			"Indique qu\u00e9 APIs o frameworks se han empleado en la asignatura para el desarrollo de la capa Servicios:",
		options: [
			"a) Servlets y Apache Thrift.",
			"b) JDBC y HTTPClient.",
			"c) JDBC y Servlets.",
			"d) Apache Thrift y HTTPClient.",
		],
		correctAnswer: "a",
	},
	{
		id: "q3",
		examId: "recopilacion_012026",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			"Indique qu\u00e9 afirmaci\u00f3n relativa a la capa Modelo de los ejemplos de la asignatura y de su pr\u00e1ctica es correcta:",
		options: [
			"a) Para su compilaci\u00f3n requiere un driver JDBC espec\u00edfico a MySQL.",
			"b) Para su ejecuci\u00f3n requiere un driver JDBC espec\u00edfico a MySQL.",
			"c) Todas las anteriores.",
			"d) Ninguna de las anteriores.",
		],
		correctAnswer: "b",
	},
	{
		id: "q4",
		examId: "recopilacion_012026",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			'Considere las dos siguientes estrategias de implementaci\u00f3n con respecto a los m\u00e9todos de los servicios de la capa Modelo. La capa Modelo est\u00e1 instalada dentro de un servidor de aplicaciones y es invocada por una capa Servicios REST. En la estrategia 2, la variable `dataSource` hace referencia a una instancia de una clase proporcionada por el servidor de aplicaciones que implementa la interfaz `DataSource` y utiliza la estrategia pool de conexiones. Indique la respuesta correcta.\n\n**Estrategia 1**\n```java\npublic void <<m\u00e9todo>> () {\n    try (Connection connection = DriverManager.getConnection(url, user, password)) {\n        << Implementar l\u00f3gica de negocio usando "connection". >>\n    } catch (SQLException e) {\n        throw new RuntimeException(e);\n    }\n}\n```\n\n**Estrategia 2**\n```java\npublic void <<m\u00e9todo>> () {\n    try (Connection connection = dataSource.getConnection()) {\n        << Implementar l\u00f3gica de negocio usando "connection". >>\n    } catch (SQLException e) {\n        throw new RuntimeException(e);\n    }\n}\n```',
		options: [
			"a) La estrategia 1 conduce a un tiempo menor de ejecuci\u00f3n.",
			"b) La estrategia 2 conduce a un tiempo menor de ejecuci\u00f3n.",
			"c) El m\u00e9todo `getConnection` del `dataSource` (estrategia 2) lanzar\u00e1 siempre una excepci\u00f3n si no queda ninguna conexi\u00f3n libre en el pool.",
			"d) La b) y la c) son correctas.",
		],
		correctAnswer: "b",
	},
	{
		id: "q5",
		examId: "recopilacion_012026",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			"Analice el siguiente fragmento de c\u00f3digo e indique la afirmaci\u00f3n correcta:\n```java\ntry {\n    connection = dataSource.getConnection();\n    connection.setAutoCommit(false); // (1)\n    \n    Product product = productDao.find(connection, productId);\n    product.setStock(product.getStock() + increment);\n    productDao.update(connection, product);\n    \n    connection.commit();\n} catch (Exception e) {\n    connection.rollback(); // (2)\n}\n```",
		options: [
			"a) La l\u00ednea (1) evita problemas de concurrencia con otras transacciones.",
			"b) La l\u00ednea (2) garantiza que todas las sentencias SQL se ejecutar\u00e1n dentro de la misma transacci\u00f3n.",
			"c) Todas las anteriores.",
			"d) Ninguna de las anteriores.",
		],
		correctAnswer: "d",
	},
	{
		id: "q6",
		examId: "recopilacion_012026",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			"Indique la afirmaci\u00f3n correcta de acuerdo al enfoque de desarrollo estudiado en la asignatura:",
		options: [
			"a) Las operaciones de los DAOs de su pr\u00e1ctica reciben la conexi\u00f3n para poder agrupar de manera sencilla varias operaciones de un mismo o distintos DAOs en una \u00fanica transacci\u00f3n.",
			"b) El uso de DAOs simplifica la implementaci\u00f3n de los m\u00e9todos de los servicios de la capa Modelo.",
			"c) Todas las anteriores.",
			"d) Ninguna de las anteriores.",
		],
		correctAnswer: "c",
	},
	{
		id: "q7",
		examId: "recopilacion_012026",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			"Se est\u00e1 dise\u00f1ando una aplicaci\u00f3n bancaria que incluye, entre otros, un caso de uso para realizar una transferencia entre dos cuentas (no se permite la transferencia si la cuenta origen no tiene suficiente saldo). La interfaz gr\u00e1fica incluye un formulario en el que el usuario tiene que introducir el identificador de la cuenta origen (Long), el identificador de la cuenta destino (Long) y la cantidad de dinero a transferir (BigDecimal). Analice el DAO de la entidad Account (cuenta) que figura a continuaci\u00f3n e indique la respuesta correcta en base al enfoque de desarrollo estudiado en la asignatura:\n\n```java\npublic interface SqlAccountDao {\n    public Account find(Connection connection, Long accountId)\n        throws InstanceNotFoundException;\n    public void update(Connection connection, Account account)\n        throws InstanceNotFoundException;\n    public void transfer(Long sourceAccountId, Long targetAccountId,\n        BigDecimal amount);\n}\n```",
		options: [
			"a) La operaci\u00f3n `transfer` del DAO debe implementarse en t\u00e9rminos de `find` (para recuperar la cuenta origen y la cuenta destino) y `update` (para minorar el balance de la cuenta origen y aumentar el balance de la cuenta destino).",
			"b) En la operaci\u00f3n `transfer` del DAO falta el par\u00e1metro `Connection`, as\u00ed como especificar excepciones para el caso en el que la cuenta origen no tenga suficiente saldo o que alguna cuenta no exista.",
			"c) Todas las anteriores.",
			"d) Ninguna de las anteriores.",
		],
		correctAnswer: "d",
	},
	{
		id: "q8",
		examId: "recopilacion_012026",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			"\u00bfQu\u00e9 puede decir con respecto a este c\u00f3digo?\n```java\npublic ... buyMovie(Long movieId, ...) throws ... {\n    ...\n    try (Connection connection = ...) {\n        ...\n        Movie movie = movieDao.find(connection, movieId);\n        Sale sale = saleDao.create(connection, new Sale(...));\n        ...\n    } catch (...) {\n        ...\n    }\n}\n```",
		options: [
			"a) Corresponde a la capa L\u00f3gica de Negocio.",
			"b) Corresponde a la capa Acceso a Datos.",
			"c) Corresponde a la capa Servicios Thrift.",
			"d) Corresponde a la capa Acceso a Servicios.",
		],
		correctAnswer: "a",
	},
	{
		id: "q9",
		repeated: true,
		examId: "recopilacion_012026",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			"En base al enfoque aconsejado en la asignatura para la realizaci\u00f3n de pruebas de integraci\u00f3n, indique la afirmaci\u00f3n correcta:",
		options: [
			"a) Durante la ejecuci\u00f3n de las pruebas se utiliza el `DataSource` proporcionado por Jetty, al que se accede por JNDI.",
			"b) Durante la ejecuci\u00f3n de las pruebas se utiliza el `DataSource` proporcionado por Tomcat, al que se accede por JNDI.",
			"c) Durante la ejecuci\u00f3n de las pruebas es posible utilizar el `DataSource` proporcionado por Jetty o por Tomcat, a los que se accede por JNDI, dependiendo del valor de una propiedad del fichero de configuraci\u00f3n `ConfigurationParameters.properties` presente en `src/test/resources`.",
			"d) Ninguna de las anteriores.",
		],
		correctAnswer: "d",
	},
	{
		id: "q10",
		examId: "recopilacion_012026",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			"Dado el siguiente fragmento de c\u00f3digo correspondiente a un m\u00e9todo de una clase de pruebas de integraci\u00f3n de la capa Modelo, implementada con JUnit 5, indique qu\u00e9 afirmaci\u00f3n es correcta:\n```java\n@Test\npublic void testRemoveElement() throws InputValidationException, InstanceNotFoundException {\n    // Fragmento de c\u00f3digo 1\n    ...\n    assertThrows(ElementNotRemovableException.class, () -> {\n        // Fragmento de c\u00f3digo 2\n        ...\n    });\n    // Fragmento de c\u00f3digo 3\n    ...\n}\n```",
		options: [
			"a) Se corresponde con un test que se ejecutar\u00e1 correctamente si durante la ejecuci\u00f3n del fragmento de c\u00f3digo 2 se lanza la excepci\u00f3n `ElementNotRemovableException` y NO es capturada por el c\u00f3digo de ese fragmento.",
			"b) Se corresponde con un test que se ejecutar\u00e1 correctamente si durante su ejecuci\u00f3n se lanza cualquiera de las excepciones declaradas en su cl\u00e1usula `throws` y NO es capturada por el c\u00f3digo del m\u00e9todo.",
			"c) Todas las anteriores.",
			"d) Ninguna de las anteriores.",
		],
		correctAnswer: "a",
	},
	{
		id: "q11",
		examId: "recopilacion_012026",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			'Asumiendo las convenciones de nombrado utilizadas en la asignatura, \u00bfqu\u00e9 puede decir con respecto al m\u00e9todo `toClientMovieDto`?\n```java\nprivate static ClientMovieDto toClientMovieDto(JsonNode movieNode)\n    throws ParsingException {\n    if (movieNode.getNodeType() != JsonNodeType.OBJECT) {\n        throw new ParsingException("Unrecognized JSON (object expected)");\n    } else {\n        ObjectNode movieObject = (ObjectNode) movieNode;\n        JsonNode movieIdNode = movieObject.get("movieId");\n        Long movieId = (movieIdNode != null) ? movieIdNode.longValue() : null;\n        ...\n        return new ClientMovieDto(movieId, ...);\n    }\n}\n```',
		options: [
			"a) Convierte un DTO (Data Transfer Object) utilizado en la capa Servicios, a un objeto de la capa Modelo.",
			"b) Convierte un \u00e1rbol Jackson (recibe su nodo ra\u00edz) a un DTO utilizado en la capa Acceso a Servicios.",
			"c) Convierte un DTO (Data Transfer Object) utilizado en la capa Acceso a Servicios, a un \u00e1rbol Jackson (devuelve el nodo ra\u00edz del \u00e1rbol).",
			"d) Convierte un \u00e1rbol Jackson (recibe su nodo ra\u00edz) a un DTO utilizado en la capa Modelo.",
		],
		correctAnswer: "b",
	},
	{
		id: "q12",
		repeated: true,
		examId: "recopilacion_012026",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			"Suponga que est\u00e1 dise\u00f1ando un Servicio Web seg\u00fan el enfoque REST estudiado en la asignatura y ya existe una funcionalidad que permite dar de alta un libro en un repositorio. Suponga que ahora desea modelar una funcionalidad que permite reemplazar la representaci\u00f3n de un libro en el repositorio. \u00bfQu\u00e9 opci\u00f3n escoger\u00eda?",
		options: [
			"a) El servicio permitir\u00e1 reemplazar la representaci\u00f3n de un libro invocando el URL del recurso individual libro (e.g. `http://www.servicename.com/books/123`) con el m\u00e9todo POST e incluyendo los nuevos datos del libro en un documento JSON incluido en el cuerpo de la petici\u00f3n.",
			"b) El servicio permitir\u00e1 reemplazar la representaci\u00f3n de un libro invocando el URL del recurso colecci\u00f3n libros (e.g. `http://www.servicename.com/books/`) con el m\u00e9todo POST e incluyendo el identificador y los nuevos datos del libro en un documento JSON incluido en el cuerpo de la petici\u00f3n.",
			"c) El servicio permitir\u00e1 reemplazar la representaci\u00f3n de un libro invocando el URL del recurso individual libro (e.g. `http://www.servicename.com/books/123`) con el m\u00e9todo PUT e incluyendo los nuevos datos del libro en un documento JSON incluido en el cuerpo de la petici\u00f3n.",
			"d) El servicio permitir\u00e1 reemplazar la representaci\u00f3n de un libro invocando el URL del recurso colecci\u00f3n libros (e.g. `http://www.servicename.com/books/`) con el m\u00e9todo PUT e incluyendo el identificador y los nuevos datos del libro en un documento JSON incluido en el cuerpo de la petici\u00f3n.",
		],
		correctAnswer: "c",
	},
	{
		id: "q13",
		repeated: true,
		examId: "recopilacion_012026",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			"Suponga que est\u00e1 dise\u00f1ando un Servicio Web seg\u00fan el enfoque REST. Teniendo en cuenta las convenciones seguidas en la asignatura, \u00bfqu\u00e9 opci\u00f3n le parece m\u00e1s adecuada para la respuesta a una petici\u00f3n que falle debido a que la base de datos no est\u00e1 accesible en ese momento?",
		options: [
			"a) En la respuesta HTTP se indicar\u00e1 el c\u00f3digo de respuesta `200 OK` para indicar que el servidor entendi\u00f3 correctamente la petici\u00f3n y que el fallo es por causas ajenas a \u00e9l.",
			"b) En la respuesta HTTP se indicar\u00e1 el c\u00f3digo de respuesta `400 Bad Request` para indicar que la petici\u00f3n es incorrecta.",
			"c) En la respuesta HTTP se indicar\u00e1 el c\u00f3digo de respuesta `500 Internal Error` para indicar que la petici\u00f3n fall\u00f3 debido a un error interno.",
			"d) En la respuesta HTTP se indicar\u00e1 el c\u00f3digo `404 Not Found` para indicar que no se encontr\u00f3 la base de datos.",
		],
		correctAnswer: "c",
	},
	{
		id: "q14",
		examId: "recopilacion_012026",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			"En el contexto de Servicios Web REST, suponga un intermediario gen\u00e9rico capaz de reintentar peticiones a servicios web REST que han devuelto c\u00f3digos de respuesta de error. Considerando las convenciones vistas en la asignatura y que 500 es un error temporal, diga qu\u00e9 afirmaci\u00f3n es correcta:",
		options: [
			"a) El intermediario NO reintentar\u00e1 una petici\u00f3n `POST http://www.servicename.com/books/1234` que ha devuelto el c\u00f3digo de respuesta `500 Internal Error`.",
			"b) El intermediario NO reintentar\u00e1 una petici\u00f3n `GET http://www.servicename.com/books/1234` que ha devuelto el c\u00f3digo de respuesta `500 Internal Error`.",
			"c) El intermediario NO reintentar\u00e1 una petici\u00f3n `PUT http://www.servicename.com/books/1234` que ha devuelto el c\u00f3digo de respuesta `500 Internal Error`.",
			"d) El intermediario NO reintentar\u00e1 una petici\u00f3n `DELETE http://www.servicename.com/books/1234` que ha devuelto el c\u00f3digo de respuesta `500 Internal Error`.",
		],
		correctAnswer: "a",
	},
	{
		id: "q15",
		examId: "recopilacion_012026",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			'Considere el siguiente fragmento de c\u00f3digo e indique la respuesta correcta (asuma que `validateStatusCode` es el m\u00e9todo que se utiliza en los ejemplos de la asignatura con el mismo nombre):\n```java\nClassicHttpResponse response = (ClassicHttpResponse)\n    Request.delete(getEndpointAddress() + "resources/" + resourceId).\n        execute().returnResponse();\n\nvalidateStatusCode(HttpStatus.SC_NO_CONTENT, response);\n```',
		options: [
			"a) Es un fragmento de un m\u00e9todo de la capa Acceso a Servicios de una aplicaci\u00f3n cliente que realiza una petici\u00f3n HTTP DELETE incluyendo el identificador del recurso a eliminar en el cuerpo de la petici\u00f3n y espera recibir una respuesta HTTP que no devuelva ning\u00fan c\u00f3digo de estado (`HttpStatus.SC_NO_CONTENT`).",
			"b) Es un fragmento de un m\u00e9todo de la capa Acceso a Servicios de una aplicaci\u00f3n cliente que realiza una petici\u00f3n HTTP DELETE que no incluye nada en su cuerpo y espera recibir una respuesta HTTP que tampoco incluya nada en su cuerpo (`HttpStatus.SC_NO_CONTENT`).",
			"c) Es un fragmento de un Servlet de la capa Servicios REST que procesa una petici\u00f3n DELETE y env\u00eda un c\u00f3digo de respuesta 204 (`HttpStatus.SC_NO_CONTENT`) para indicar que no devuelve nada en el cuerpo de la respuesta.",
			"d) Es un fragmento de un Servlet de la capa Servicios REST que procesa una petici\u00f3n DELETE cuyo cuerpo debe estar vac\u00edo (`HttpStatus.SC_NO_CONTENT`) para que se procese correctamente.",
		],
		correctAnswer: "b",
	},
	{
		id: "q16",
		examId: "recopilacion_012026",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			"Asumiendo que utilizamos la clase `es.udc.ws.util.servlet.RestHttpServletTemplate` del subproyecto de utilidades de los ejemplos de la asignatura (`ws-util`), indique la afirmaci\u00f3n INCORRECTA:",
		options: [
			"a) Si queremos implementar un servlet que responda a peticiones GET y POST, tendremos que crear una clase que herede de `RestHttpServletTemplate` y redefinir los m\u00e9todos `processGet` y `processPost`.",
			"b) Los servlets que heredan de `RestHttpServletTemplate` no tienen que preocuparse de tratar las excepciones del m\u00f3dulo `ws-util` (`InstanceNotFoundException`, `InputValidationException` y `ParsingException`) al procesar cualquier petici\u00f3n.",
			"c) No hay que declarar en el fichero `web.xml` los servlets que heredan de `RestHttpServletTemplate`, puesto que ya est\u00e1 declarada su superclase.",
			"d) Si un servlet hereda de `RestHttpServletTemplate` y no se desea que procese peticiones DELETE, no es necesario redefinir el m\u00e9todo `processDelete`, puesto que la implementaci\u00f3n por defecto de `processDelete` en `RestHttpServletTemplate` devuelve un c\u00f3digo de respuesta indicando que esa operaci\u00f3n no est\u00e1 implementada.",
		],
		correctAnswer: "c",
	},
	{
		id: "q17",
		examId: "recopilacion_012026",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			"En el modelo de programaci\u00f3n RPC (Remote Procedure Call), indique cu\u00e1l de las siguientes afirmaciones es correcta:",
		options: [
			"a) El programador de la aplicaci\u00f3n servidora modela su funcionalidad a trav\u00e9s de un conjunto de operaciones est\u00e1ndar (operaciones que no son ad hoc).",
			"b) Las aplicaciones cliente y servidora tienen que escribirse en el mismo lenguaje de programaci\u00f3n.",
			"c) En cuanto a rendimiento, la invocaci\u00f3n de una operaci\u00f3n remota es similar a la invocaci\u00f3n de un m\u00e9todo de una librer\u00eda local.",
			"d) Cambios en la implementaci\u00f3n del servidor no obligan a regenerar el stub si no cambia nada en la interfaz del servicio.",
		],
		correctAnswer: "d",
	},
	{
		id: "q18",
		repeated: true,
		examId: "recopilacion_012026",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			"Considere el siguiente fichero de definici\u00f3n de Apache Thrift, en el que se pretende declarar un servicio con una operaci\u00f3n, e indique la afirmaci\u00f3n correcta:\n```thrift\nnamespace java es.udc.ws.movies.thrift\n\nstruct ThriftMovieDto {\n    1: i64 movieId\n    2: string title\n}\n\nstruct ThriftInputValidationException {\n    1: string message\n}\n\nThriftMovieDto addMovie(1: ThriftMovieDto movieDto)\n    throws (1: ThriftInputValidationException e)\n```",
		options: [
			"a) La operaci\u00f3n `addMovie` debe definirse dentro de un servicio (usando la palabra reservada `service`).",
			"b) El par\u00e1metro de la operaci\u00f3n `addMovie` no puede ser de tipo `ThriftMovieDto`.",
			"c) El tipo `ThriftInputValidationException` debe definirse con la palabra reservada `exception` (en lugar de `struct`).",
			"d) La a) y la c) son correctas.",
		],
		correctAnswer: "d",
	},

	// Fuente: ExamenesISD/examen_test_ISD_corregido_polo_GOAT_transcritoPorPapa.pdf
	// Enunciados y código contrastados con imagenes_isd_corregido_polo_GOAT.pdf.
	// Se conservan 31 preguntas completas; las fotos repetidas no se duplican.
	{
		id: "recopilatorio_q1",
		examId: "recopilatorio",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			'Considere un servicio web REST en el que al hacer una petición GET sobre el URL http://www.acme.com/restws/books obtenemos en el cuerpo de la respuesta el siguiente fragmento XML. Indique qué afirmación es correcta:\n\n```xml\n<?xml version="1.0" encoding="UTF-8"?>\n<books xmlns="http://www.acme.com/restws/books"\n       xmlns:atom="http://www.w3.org/2005/Atom">\n  <book>\n    <id>1234</id>\n    <title>Veinte años después</title>\n    <author>Alejandro Dumas</author>\n    <atom:link rel="self" href="http://www.acme.com/restws/books/1234"/>\n  </book>\n  <book>\n    <id>1235</id>\n    <title>Winds of Winter</title>\n    <author>George R. R. Martin</author>\n    <atom:link rel="self" href="http://www.acme.com/restws/books/1235"/>\n  </book>\n</books>\n```',
		options: [
			"a) La representación es incorrecta ya que proporciona información de más de un libro",
			"b) La representación es correcta, pero aunque se añadan más libros en el futuro, la respuesta a esta petición debe ser siempre la misma, ya que las representaciones de los recursos no pueden cambiar",
			"c) La respuesta es la representación de un recurso colección que enlaza a la representación de los recursos que componen la colección",
			"d) La respuesta es la representación de un recurso individual",
		],
		correctAnswer: "c",
		explanation:
			"La respuesta representa la colección de libros e incluye enlaces a los recursos individuales. Su representación puede cambiar cuando cambia la colección.",
	},
	{
		id: "recopilatorio_q2",
		examId: "recopilatorio",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			"En el contexto de servicios web REST, suponga un intermediario genérico de caché. Asuma respuestas sin restricciones de almacenamiento y sin instrucciones explícitas de frescura, de modo que la caché utiliza las reglas de caché heurística de HTTP. Indique qué afirmación es correcta:",
		options: [
			"a) El intermediario cacheará una petición de la forma GET /books/1234 que ha devuelto un código de respuesta 500 Internal Error",
			"b) El intermediario cacheará una petición GET /books/1234 que ha devuelto el código de respuesta 200 OK",
			"c) El intermediario cacheará una petición GET /books/1234 que ha devuelto el código de respuesta 400 Bad Request",
			"d) b) y c) son correctas",
		],
		correctAnswer: "b",
		explanation:
			"Una respuesta 200 a GET puede almacenarse y reutilizarse mediante frescura heurística. Los códigos 400 y 500 no son cacheables heurísticamente. No basta con distinguir entre errores permanentes y temporales. Véase [RFC 9111, sección 4.2.2](https://www.rfc-editor.org/rfc/rfc9111.html#section-4.2.2).",
	},
	{
		id: "recopilatorio_q3",
		examId: "recopilatorio",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			"Suponga que está diseñando un servicio web REST y que desea modelar una funcionalidad que permite modificar elementos, por ejemplo libros, en un repositorio. ¿Qué operación escogería?",
		options: [
			"a) El servicio asignará un URL único a cada libro y permitirá modificarlo invocando su URL con el método PUT y pasando en el cuerpo la nueva representación",
			"b) El servicio permitirá modificar el libro invocando el URL http://www.servicename.com/updateBook con el método POST e incluyendo como parámetro el identificador del libro",
			"c) El servicio expondrá una operación llamada updateBook que podrá ser invocada remotamente, y que recibirá como parámetro el identificador del libro a borrar",
			"d) Ninguna de las anteriores",
		],
		correctAnswer: "a",
		explanation:
			"PUT sobre el URL del recurso individual permite reemplazar su representación por la enviada en el cuerpo.",
		repeated: true,
	},
	{
		id: "recopilatorio_q4",
		examId: "recopilatorio",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			"Suponga que está diseñando un servicio web según el enfoque REST. Según las convenciones de la asignatura, ¿qué opción es más adecuada para responder a una petición que falla porque la base de datos no está accesible en ese momento?",
		options: [
			"a) En la cabecera HTTP se indicará el código de respuesta 200 OK para indicar que el servidor entendió correctamente la petición y que el fallo es por causas ajenas a él. En el cuerpo de la respuesta se incluirá en XML información sobre el error",
			"b) En la cabecera HTTP se indicará el código de respuesta 500 Internal Error para indicar que la petición falló y que el cliente puede reintentarla. En el cuerpo de la respuesta se puede incluir en XML información adicional sobre el error",
			"c) En la cabecera HTTP se indicará el código de respuesta 400 Bad Request. En el cuerpo de la respuesta se puede incluir en XML información adicional sobre el error",
			"d) Ninguna de las anteriores",
		],
		correctAnswer: "b",
		explanation:
			"Entre las opciones propuestas, 500 identifica un fallo interno del servidor. El cuerpo puede describir el error. Que el cliente pueda reintentar no significa que deba repetir automáticamente cualquier operación, especialmente si no es idempotente.",
		repeated: true,
	},
	{
		id: "recopilatorio_q5",
		examId: "recopilatorio",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			'Considere el siguiente fragmento de código, que utiliza la API de Apache Commons HttpClient mostrada en el material. Indique la respuesta correcta:\n\n```java\nPostMethod method = new PostMethod("http://example.org/resource");\nmethod.addParameter("param1", "val1");\nmethod.addParameter("param2", "val2");\ntry {\n    // Enviar petición.\n    HttpClient client = new HttpClient();\n    int statusCode = client.executeMethod(method);\n    // ...\n} finally {\n    method.releaseConnection();\n}\n```',
		options: [
			"a) Es un fragmento de un servlet que procesa una petición POST",
			"b) Es incorrecto porque una petición POST no puede llevar parámetros",
			"c) Es incorrecto porque una petición POST tiene que llevar los parámetros en el URL",
			"d) Ninguna de las anteriores",
		],
		correctAnswer: "d",
		explanation:
			"Es código cliente que envía una petición POST con parámetros de formulario en el cuerpo. No es un servlet y POST sí admite esos parámetros.",
	},
	{
		id: "recopilatorio_q6",
		examId: "recopilatorio",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			"Considere el siguiente fragmento de código e indique la respuesta correcta:\n\n```java\nprotected void doDelete(HttpServletRequest req, HttpServletResponse resp)\n        throws ServletException {\n    String requestURI = req.getRequestURI();\n    int idx = requestURI.lastIndexOf('/');\n    // ...\n}\n```",
		options: [
			"a) Es un fragmento de un servlet que procesa una petición POST",
			"b) Es un fragmento del cliente de un servicio web REST preparándose para invocar un determinado URI",
			"c) Es un fragmento de un servlet que procesa una petición DELETE",
			"d) Ninguna de las anteriores",
		],
		correctAnswer: "c",
		explanation:
			"doDelete es el método de HttpServlet que procesa peticiones HTTP DELETE en el servidor.",
	},
	{
		id: "recopilatorio_q7",
		examId: "recopilatorio",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			"Según el enfoque aconsejado en la asignatura para las pruebas de integración, indique la afirmación correcta:",
		options: [
			"a) Un caso de prueba puede asumir que existen en BD datos creados por otros casos de prueba",
			"b) Un caso de prueba debe crear los datos que precise y eliminarlos al finalizar",
			"c) Con el fin de validar un caso de prueba puede ser necesario añadir nuevos casos de uso al modelo",
			"d) Todas las anteriores",
		],
		correctAnswer: "b",
		explanation:
			"Cada prueba prepara los datos que necesita y los elimina al finalizar. Así evita depender del orden o del resultado de otras pruebas. No se añaden casos de uso al modelo solo para facilitar las pruebas.",
	},
	{
		id: "recopilatorio_q8",
		examId: "recopilatorio",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			"Indique cuál de las siguientes afirmaciones relativas a JUnit 4 NO es correcta:",
		options: [
			"a) Utiliza la anotación @BeforeClass para definir los métodos a ejecutar antes de la ejecución de cada uno de los casos de prueba contenidos en una clase",
			"b) Es un framework para escribir pruebas de unidad o de integración automatizadas en Java",
			"c) Utiliza la anotación @Test para marcar un método como caso de prueba",
		],
		correctAnswer: "a",
		explanation:
			"En JUnit 4, @BeforeClass se ejecuta una vez antes de las pruebas de la clase; @Before se ejecuta antes de cada prueba. @BeforeAll pertenece a JUnit 5. Véase la [documentación de JUnit 4](https://junit.org/junit4/javadoc/4.13.2/org/junit/BeforeClass.html).",
	},
	{
		id: "recopilatorio_q9",
		examId: "recopilatorio",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			"Considere la capa Modelo de una aplicación diseñada según el método estudiado en la asignatura, con factorías de DAOs configurables por nombre de clase. Se desea soportar una nueva base de datos que dispone de un mecanismo de generación de identificadores diferente. Indique la afirmación correcta:",
		options: [
			"a) Es necesario proporcionar una nueva clase de implementación de la interfaz de cada DAO que precise generar identificadores",
			"b) Es necesario modificar la factoría de cada DAO que precise generar identificadores",
			"c) Es necesario proporcionar una nueva clase de implementación de la interfaz de cada servicio (del modelo) que precise generar identificadores",
			"d) La a) y la b)",
		],
		correctAnswer: "a",
		explanation:
			"Se proporciona la implementación de cada DAO que necesite adaptar la generación de claves. La factoría configurable selecciona la implementación sin modificar su código. La interfaz de los servicios del modelo no depende de ese mecanismo.",
	},
	{
		id: "recopilatorio_q10",
		examId: "recopilatorio",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			"Analice el siguiente fragmento de la interfaz del DAO correspondiente a la entidad Product. Indique la afirmación correcta según el enfoque de desarrollo estudiado en clase:\n\n```java\npublic interface SqlProductDao {\n    public Product create(Product product);\n    public void update(Product product) throws InstanceNotFoundException;\n    // ...\n}\n```",
		options: [
			"a) Falta incluir un parámetro de tipo Connection en todos los métodos",
			"b) Falta declarar que los dos primeros métodos pueden levantar la excepción InputValidationException",
			"c) Todas las anteriores",
			"d) Ninguna de las anteriores",
		],
		correctAnswer: "a",
		explanation:
			"Los métodos de los DAOs reciben la conexión para que la lógica de negocio pueda agrupar sus operaciones en una transacción. La validación de entrada corresponde a la lógica de negocio.",
	},
	{
		id: "recopilatorio_q11",
		examId: "recopilatorio",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			"Considere las capas Modelo y Servicios de su práctica. La capa Servicios puede recibir peticiones concurrentes de múltiples clientes. Indique la afirmación correcta sobre los métodos de los servicios locales de la capa Modelo:",
		options: [
			"a) La ejecución de cada método debe crear una nueva instancia de cada DAO que deba usar",
			"b) La ejecución de cada método debe crear una nueva instancia del DataSource que permita acceder a la BD",
			"c) Todas las anteriores",
			"d) Ninguna de las anteriores",
		],
		correctAnswer: "d",
		explanation:
			"No hace falta crear un DAO o un DataSource por invocación si sus implementaciones permiten el uso concurrente. Los DAOs no deben guardar en campos el estado de una petición; cada operación utiliza su propia conexión.",
	},
	{
		id: "recopilatorio_q12",
		examId: "recopilatorio",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			"Considere una capa Modelo que debe crear instancias de entidades generando automáticamente sus claves. Indique la afirmación correcta:",
		options: [
			"a) Solo es posible emplear claves numéricas, que pueden ser generadas por la base de datos o por la propia aplicación",
			"b) Solo es posible emplear claves numéricas, que deben ser generadas por la base de datos",
			"c) Si la base de datos proporciona secuencias, puede lanzarse una consulta para que la base de datos genere una clave numérica y posteriormente realizar la inserción",
			"d) La b) y la c)",
		],
		correctAnswer: "c",
		explanation:
			"Las claves no tienen que ser numéricas. Cuando el gestor ofrece secuencias, se puede obtener primero el valor de una secuencia y utilizarlo después al insertar la entidad.",
	},
	{
		id: "recopilatorio_q13",
		examId: "recopilatorio",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			"Indique cuál de las siguientes afirmaciones sobre procesamiento XML es correcta:",
		options: [
			"a) Los parsers XML de tipo “streaming” no construyen un árbol en memoria, sino que procesan secuencialmente el documento en bloques",
			"b) Los parsers XML de tipo DOM son adecuados en aplicaciones servidoras que reciben peticiones que involucran parsear/generar documentos XML grandes",
			"c) Todas las anteriores",
			"d) Ninguna de las anteriores",
		],
		correctAnswer: "a",
		explanation:
			"El procesamiento streaming recorre el documento sin construir su árbol completo en memoria. DOM conserva ese árbol, por lo que puede consumir mucha memoria con documentos grandes y muchas peticiones simultáneas.",
	},
	{
		id: "recopilatorio_q14",
		examId: "recopilatorio",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			"En cuanto a la validación de documentos XML, indique la afirmación correcta:",
		options: [
			"a) Es una buena práctica que una aplicación cliente valide los documentos XML que recibe de un servidor contra su copia local del esquema, porque así aumenta su resistencia a los cambios",
			"b) El que una aplicación servidora valide los documentos XML que recibe de los clientes mejora su rendimiento",
			"c) Todas las anteriores",
			"d) Ninguna de las anteriores",
		],
		correctAnswer: "d",
		explanation:
			"Validar contra una copia local estricta del esquema puede rechazar extensiones compatibles del servidor, como elementos adicionales. La validación puede detectar errores, pero añade trabajo y no mejora por sí misma el rendimiento.",
	},
	{
		id: "recopilatorio_q15",
		examId: "recopilatorio",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			"Considere estas dos estrategias para implementar métodos de los servicios de la capa Modelo, instalada en un servidor de aplicaciones e invocada por servicios web. La conexión se obtiene de un pool de tamaño limitado. Suponga peticiones sucesivas suficientes para agotar el pool si las conexiones no se devuelven. Indique la respuesta correcta.\n\n```java\n// Estrategia 1\npublic void metodo() {\n    try (Connection connection = dataSource.getConnection()) {\n        // Implementar lógica de negocio usando connection.\n    } catch (SQLException e) {\n        throw new RuntimeException(e);\n    }\n}\n\n// Estrategia 2\npublic void metodo() {\n    try {\n        Connection connection = dataSource.getConnection();\n        // Implementar lógica de negocio usando connection.\n    } catch (SQLException e) {\n        throw new RuntimeException(e);\n    }\n}\n```",
		options: [
			"a) Con la estrategia 2 es posible atender más peticiones (del mismo o distintos clientes)",
			"b) Con la estrategia 1 es posible atender más peticiones (del mismo o distintos clientes)",
			"c) Con la estrategia 2 la conexión nunca se cerrará",
			"d) Ninguna de las anteriores",
		],
		correctAnswer: "b",
		explanation:
			"La estrategia 1 devuelve la conexión al pool al salir del try, también si hay una excepción. La segunda no la libera explícitamente y puede agotar el pool. No debe confiarse en el recolector de basura para devolver conexiones.",
	},
	{
		id: "recopilatorio_q16",
		examId: "recopilatorio",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			"Considere DriverManager y un DataSource que utiliza un pool de conexiones ya inicializado. Indique la afirmación correcta:",
		options: [
			"a) DriverManager es capaz de devolver una conexión a la base de datos en menos tiempo",
			"b) Una vez obtenida una conexión a la base de datos (desprecie este tiempo), si se lanza una consulta sobre la conexión, es más rápida su ejecución si se ha obtenido de un DataSource de ese tipo",
			"c) El método close de una Connection obtenida mediante DriverManager cierra la conexión a la base de datos",
			"d) La b) y la c)",
		],
		correctAnswer: "c",
		explanation:
			"Connection.close cierra una conexión física obtenida directamente mediante DriverManager. En un pool, cerrar la conexión lógica normalmente la devuelve al pool. Una consulta no se ejecuta más rápido solo por haber obtenido su conexión de un pool. El original atribuía por error close a DriverManager; el método pertenece a Connection.",
	},
	{
		id: "recopilatorio_q17",
		examId: "recopilatorio",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			"Considere las entidades Product y Category de una tienda web. Un producto tiene un identificador generado automáticamente y un nombre. Una categoría tiene un identificador generado automáticamente, categoryId, y un nombre. Un producto solo puede estar clasificado en una categoría, y una categoría puede contener diversos productos. Utilizando el método de modelado de entidades estudiado en la asignatura, indique la afirmación correcta:",
		options: [
			"a) La entidad Product contiene el atributo categoryId",
			"b) La entidad Category contiene un atributo colección con los identificadores de todos los productos que pertenecen a una determinada categoría",
			"c) Todas las anteriores",
			"d) Ninguna de las anteriores",
		],
		correctAnswer: "a",
		explanation:
			"En este modelo, Product contiene categoryId para representar la categoría a la que pertenece. No se mantiene además una colección de identificadores de productos dentro de Category.",
	},
	{
		id: "recopilatorio_q18",
		examId: "recopilatorio",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			"Indique cuál de las siguientes características NO es un requisito que deban cumplir las aplicaciones empresariales:",
		options: [
			"a) Capacidad de soportar más usuarios o más carga al aumentar los recursos disponibles",
			"b) Tolerancia a fallos mediante replicación de recursos",
			"c) Transaccionalidad",
			"d) Todos los usuarios deben acceder a la misma funcionalidad",
		],
		correctAnswer: "d",
		explanation:
			"Los permisos y funciones pueden variar según el rol del usuario. La escalabilidad, la disponibilidad y el soporte transaccional son requisitos habituales de las aplicaciones empresariales.",
	},
	{
		id: "recopilatorio_q19",
		examId: "recopilatorio",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			"Indique cuál de las siguientes afirmaciones sobre el despliegue de aplicaciones por capas es correcta:",
		options: [
			"a) En una arquitectura en dos capas físicas, con la interfaz y el modelo en el cliente y la base de datos en la segunda capa, los cambios en la implementación del modelo requieren recompilar la aplicación para reinstalarla en las máquinas cliente",
			"b) En una arquitectura en tres capas físicas con navegadores como clientes, con la interfaz y el modelo en la segunda capa y la base de datos en la tercera, los cambios en la interfaz o en el modelo solo requieren reinstalar la aplicación en la máquina de la segunda capa",
			"c) Las dos anteriores",
			"d) Ninguna de las anteriores",
		],
		correctAnswer: "c",
		explanation:
			"Si el modelo se instala en los clientes, sus cambios deben desplegarse en ellos. Con una aplicación web centralizada, los cambios en la interfaz web y el modelo se despliegan en el servidor.",
	},
	{
		id: "recopilatorio_q20",
		examId: "recopilatorio",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			"Indique cuál de las siguientes afirmaciones es correcta cuando hablamos de los costes del diseño de aplicaciones por capas:",
		options: [
			"a) Normalmente el software es más complejo",
			"b) En ciertos casos, una capa podría hacer su función de forma más óptima si supiese cómo funciona otra capa",
			"c) Todas las anteriores",
			"d) Ninguna de las anteriores",
		],
		correctAnswer: "c",
		explanation:
			"Separar capas introduce interfaces y estructura adicional. También puede impedir optimizaciones que necesitarían conocer los detalles internos de otra capa.",
	},
	{
		id: "recopilatorio_q21",
		examId: "recopilatorio",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			"En una arquitectura típica de diseño por capas de aplicaciones empresariales, indique la respuesta correcta:",
		options: [
			"a) Hay una clara separación entre las capas modelo e interfaz",
			"b) La capa modelo suele subdividirse en dos capas: capa de acceso a datos y capa lógica de negocio",
			"c) La capa modelo constituye la capa de acceso a los datos, mientras que la capa de interfaz implementa la lógica de negocio usando la capa modelo",
			"d) La a) y b) son correctas",
		],
		correctAnswer: "d",
		explanation:
			"La interfaz de usuario se separa del modelo. El modelo incluye la lógica de negocio y el acceso a datos; la interfaz no debe asumir la lógica de negocio.",
	},
	{
		id: "recopilatorio_q22",
		examId: "recopilatorio",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			"Suponga que administra la infraestructura software de una empresa y se decide cambiar el gestor de base de datos, por ejemplo de MySQL a Oracle. Como administrador del servidor de aplicaciones, ¿qué tareas necesita realizar entre las propuestas?",
		options: [
			"a) Reemplazar el driver JDBC anterior por el nuevo",
			"b) Actualizar la configuración de los DataSources que haya definidos",
			"c) JDBC define un protocolo estándar de comunicación con un gestor de base de datos relacional, y en consecuencia, no es necesario realizar ninguna tarea de administración en el servidor de aplicaciones",
			"d) La a) y la b) son correctas",
		],
		correctAnswer: "d",
		explanation:
			"Es necesario disponer del driver del nuevo gestor y actualizar la configuración de los DataSources. JDBC estandariza una API Java, no un protocolo de red común a todos los gestores.",
	},
	{
		id: "recopilatorio_q23",
		examId: "recopilatorio",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			"Está diseñando la capa Modelo de una aplicación bancaria que incluye una transferencia entre cuentas. La interfaz gráfica solicita el identificador de la cuenta origen, el de la cuenta destino y la cantidad a transferir. ¿Qué interfaz del modelo considera más correcta?\n\n```java\n// Opción 1\npublic interface BankService {\n    public void transfer(Long sourceAccountId, Long targetAccountId,\n            BigDecimal amount) throws /* ... */;\n    // ...\n}\n\n// Opción 2\npublic interface BankService {\n    // El cliente invoca primero withdraw y después add.\n    public void withdraw(Long sourceAccountId, BigDecimal amount)\n            throws /* ... */;\n    public void add(Long targetAccountId, BigDecimal amount)\n            throws /* ... */;\n    // ...\n}\n```",
		options: [
			"a) La opción 1",
			"b) La opción 2",
			"c) Ambas igualmente correctas",
			"d) Ninguna es correcta",
		],
		correctAnswer: "a",
		explanation:
			"Una única operación transfer permite ejecutar el débito y el abono en una misma transacción. Con dos llamadas del cliente, el débito podría quedar confirmado aunque el abono falle.",
	},
	{
		id: "recopilatorio_q24",
		examId: "recopilatorio",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			"Analice el siguiente fragmento de la interfaz de un servicio de una hipotética capa Modelo, siendo Product una entidad. Indique la afirmación correcta según el enfoque de desarrollo estudiado en la asignatura:\n\n```java\npublic interface CatalogService {\n    Product findProduct(Long productId)\n        throws InstanceNotFoundException, SQLException;\n}\n```",
		options: [
			"a) La operación findProduct no debería devolver una entidad (debería devolver un DTO)",
			"b) La operación findProduct no debería devolver SQLException",
			"c) La operación findProduct debería recibir la conexión a la BD",
			"d) La a) y b) son correctas",
		],
		correctAnswer: "b",
		explanation:
			"La interfaz del servicio no debe exponer SQLException, un detalle de persistencia. La lógica de negocio obtiene la conexión y puede devolver entidades del modelo; no necesita recibir la conexión como parámetro.",
	},
	{
		id: "recopilatorio_q25",
		examId: "recopilatorio",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			"Considere la implementación de un método transaccional de un servicio de la capa Modelo, según el enfoque estudiado en la asignatura, que distingue entre errores de negocio sin cambios que deshacer y errores que obligan a deshacer la transacción. Indique la afirmación correcta:",
		options: [
			"a) Por defecto, el modo autocommit de la conexión a la BD está deshabilitado",
			"b) Debe usarse un nivel de aislamiento apropiado para evitar problemas de concurrencia con otras transacciones",
			"c) Si no se produce ninguna excepción, debe terminarse con commit, y en otro caso, siempre con rollback",
			"d) La b) y la c)",
		],
		correctAnswer: "b",
		explanation:
			"Las conexiones nuevas tienen autocommit activado por defecto. Desactivarlo no resuelve por sí solo los problemas de concurrencia: hace falta un aislamiento apropiado. No toda excepción de negocio exige rollback si no deja cambios que deban deshacerse.",
	},
	{
		id: "recopilatorio_q26",
		examId: "recopilatorio",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			"Según la arquitectura estudiada en la asignatura, indique cuál de las siguientes afirmaciones sobre RPC es correcta:",
		options: [
			"a) En el modelo RPC, la implementación del servicio remoto delega en operaciones de la capa modelo de la aplicación",
			"b) La aplicación cliente se implementa en términos de las operaciones de una librería local llamada “stub”",
			"c) Las 2 anteriores",
			"d) Ninguna de las anteriores",
		],
		correctAnswer: "c",
		explanation:
			"El cliente utiliza un stub local para efectuar las llamadas remotas. En el servidor, la implementación del servicio delega las operaciones de negocio en el modelo.",
	},
	{
		id: "recopilatorio_q27",
		examId: "recopilatorio",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			'Dada la siguiente declaración al principio de un documento XML, indique cuál de las afirmaciones es correcta:\n\n```xml\n<?xml version="1.0" encoding="UTF-8"?>\n```',
		options: [
			"a) El atributo version indica la versión del documento XML (su valor debe incrementarse cada vez que se haga un cambio en el documento)",
			"b) El atributo encoding indica la codificación de caracteres del documento",
			"c) Todas las anteriores",
			"d) Ninguna de las anteriores",
		],
		correctAnswer: "b",
		explanation:
			"encoding declara la codificación de caracteres. version indica la versión de la especificación XML, no el número de revisión del documento.",
	},
	{
		id: "recopilatorio_q28",
		examId: "recopilatorio",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			"Una aplicación que parsee un documento XML con un parser XML conforme a la especificación...",
		options: [
			"a) Siempre comprueba que esté bien formado",
			"b) Si el documento incluye referencias a los esquemas, la aplicación puede utilizarlos para comprobar que el documento es válido",
			"c) Las dos anteriores",
			"d) Ninguna de las anteriores",
		],
		correctAnswer: "c",
		explanation:
			"El parser comprueba que el documento esté bien formado. La validación contra un esquema es una comprobación adicional que puede habilitarse; referenciar esquemas no obliga a validarlo.",
	},
	{
		id: "recopilatorio_q29",
		examId: "recopilatorio",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			'Dado el siguiente documento XML, indique cuál de las afirmaciones es correcta:\n\n```xml\n<?xml version="1.0" encoding="UTF-8"?>\n<movies xmlns="http://ws.udc.es/movies/xml"\n        xmlns:review="http://reviews.example.com"\n        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n        xsi:schemaLocation="http://ws.udc.es/movies/xml\n                            http://www.udc.es/Movies/Movies.xsd\n                            http://reviews.example.com\n                            http://www.example.com/Reviews.xsd">\n  <movie>\n    <movieId>3</movieId>\n    <title>Dark Knight Rises Again</title>\n    <runtime>103</runtime>\n    <review:title>Batman returns in style</review:title>\n    <review:description>Christopher Nolan serves yet another thrilling Batman movie</review:description>\n    <review:rating>4 stars</review:rating>\n  </movie>\n</movies>\n```',
		options: [
			"a) El elemento title pertenece al espacio de nombres http://ws.udc.es/movies/xml",
			"b) El atributo xsi:schemaLocation pertenece al espacio de nombres xsi",
			"c) El elemento review:title pertenece al espacio de nombres http://www.example.com/Reviews.xsd",
			"d) Todas las anteriores",
		],
		correctAnswer: "a",
		explanation:
			"title pertenece al espacio de nombres por defecto. xsi es un prefijo asociado al URI de XML Schema Instance. review:title pertenece a http://reviews.example.com, no al URL del fichero XSD.",
	},
	{
		id: "recopilatorio_q30",
		examId: "recopilatorio",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			"Según el enfoque aconsejado en la asignatura para las pruebas de integración de la capa Modelo, indique la afirmación correcta:",
		options: [
			"a) Durante la ejecución de las pruebas se utiliza el DataSource proporcionado por Jetty, al que se accede por JNDI",
			"b) Durante la ejecución de las pruebas se utiliza el DataSource proporcionado por Tomcat, al que se accede por JNDI",
			"c) Durante la ejecución de las pruebas es posible utilizar el DataSource proporcionado por Jetty o por Tomcat, al que se accede por JNDI, dependiendo de una propiedad de ConfigurationParameters.properties situado en src/test/resources",
			"d) Ninguna de las anteriores",
		],
		correctAnswer: "d",
		explanation:
			"Las pruebas del modelo preparan su DataSource sin depender del contenedor de servlets ni de su registro JNDI.",
		repeated: true,
	},
	{
		id: "recopilatorio_q31",
		examId: "recopilatorio",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			"Con respecto al desarrollo de aplicaciones web, indique la respuesta correcta:",
		options: [
			"a) La preferencia de generar HTML mediante un sistema de plantillas, en lugar de hacerlo directamente desde el código Java, obedece a un motivo de eficiencia (los sistemas de plantillas tienen un tiempo de ejecución menor)",
			"b) Cuando las respuestas a las peticiones AJAX devuelven datos estructurados (es decir, datos y no un fragmento HTML), han de emplear XML",
			"c) Con respecto a la API de Servlets, los frameworks Web Java sólo incorporan un sistema de plantillas",
			"d) La capa interfaz de usuario no tiene porque desarrollarse en la misma tecnología que la capa modelo",
		],
		correctAnswer: "d",
		explanation:
			"La interfaz y el modelo pueden utilizar tecnologías distintas. Las plantillas ayudan a separar presentación y código; AJAX puede intercambiar JSON y otros formatos, y un framework web puede aportar más funciones que las plantillas.",
	},

	// Fuente: ExamenesISD/Preguntas-examen-clase_conRespuestasDePapa.pdf (preguntas 1–10).
	{
		id: "recopilatorio_clase_q1",
		examId: "recopilatorio",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			"Indique qué desventaja tiene una arquitectura con 2 capas con clientes de escritorio (capa 1: Interfaz gráfica de escritorio y capa Modelo; capa 2: servidor de Base de Datos) frente a una arquitectura con 3 capas, también con clientes de escritorio (capa 1: Interfaz gráfica de escritorio y capa Acceso al Servicio; capa 2: capa Servicios y capa Modelo; capa 3: servidor de Base de Datos):",
		options: [
			"a) Es menos eficiente porque hay invocaciones remotas.",
			"b) No permite cambiar la Base de Datos utilizada sin modificar la capa Interfaz gráfica de escritorio.",
			"c) No permite hacer cambios en la capa Modelo sin necesidad de reinstalar nada en las máquinas cliente, mientras que la arquitectura en 3 capas sí lo permite.",
			"d) No permite hacer cambios en la capa Interfaz gráfica de escritorio sin necesidad de reinstalar nada en las máquinas cliente, mientras que la arquitectura en 3 capas sí lo permite.",
		],
		correctAnswer: "c",
		explanation:
			"En dos capas el modelo se instala en las máquinas cliente, de modo que cambiarlo obliga a desplegarlo en ellas. En tres capas el modelo se actualiza en el servidor. Cambiar la interfaz de escritorio sigue requiriendo actualizar los clientes en ambas arquitecturas.",
	},
	{
		id: "recopilatorio_clase_q2",
		examId: "recopilatorio",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			"Indique en qué capas ha utilizado el API JDBC durante el desarrollo de su práctica:",
		options: [
			"a) En la capa Lógica de Negocio.",
			"b) En la capa Acceso a Datos.",
			"c) En la capa Servicios.",
			"d) a) y b) son correctas.",
		],
		correctAnswer: "d",
		explanation:
			"La lógica de negocio usa Connection para gestionar las transacciones, y el acceso a datos usa JDBC para ejecutar las consultas y actualizaciones. La capa Servicios no accede directamente a la base de datos.",
	},
	{
		id: "recopilatorio_clase_q3",
		examId: "recopilatorio",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			"¿Qué puede decir con respecto a este código?\n\n```java\n@Override\npublic /* ... */ create(Connection connection, /* ... */) {\n    String queryString = /* ... */;\n    try (PreparedStatement preparedStatement = connection.prepareStatement(\n            queryString, Statement.RETURN_GENERATED_KEYS)) {\n        // ...\n        return /* ... */;\n    } catch (/* ... */) {\n        // ...\n    }\n}\n```",
		options: [
			"a) Corresponde a la capa Acceso a Datos.",
			"b) Corresponde a la capa Lógica de Negocio.",
			"c) Corresponde a la capa Servicios REST.",
			"d) Corresponde a la capa Acceso a Servicios.",
		],
		correctAnswer: "a",
		explanation:
			"El uso de Connection, PreparedStatement y claves generadas para insertar una entidad corresponde a la capa Acceso a Datos.",
	},
	{
		id: "recopilatorio_clase_q4",
		examId: "recopilatorio",
		topic: "general",
		type: "mc",
		points: 1,
		question: "Indique la afirmación correcta:",
		options: [
			"a) Cuando la conexión a la base de datos se obtiene a partir de un DataSource, la implementación de un caso de uso en la capa Modelo no necesita invocar a Connection.close, ni implícitamente (try-with-resources) ni explícitamente.",
			"b) Cuando se invoca a close sobre una conexión que se obtuvo de un pool de conexiones, la conexión contra la base de datos no se cierra.",
			"c) Una vez obtenida una conexión a la base de datos (desprecie este tiempo), si se lanza una consulta, es más rápida su ejecución si la conexión se obtuvo de una invocación a DriverManager.getConnection que si se obtuvo mediante la invocación del método getConnection de un DataSource.",
			"d) Todas las implementaciones de DataSource tienen la obligación de usar la estrategia de pool de conexiones.",
		],
		correctAnswer: "b",
		explanation:
			"Al cerrar una conexión lógica de un pool se devuelve al pool para reutilizarla. La aplicación debe cerrarla igualmente, por ejemplo mediante try-with-resources. DataSource no exige que toda implementación use pooling.",
	},
	{
		id: "recopilatorio_clase_q5",
		examId: "recopilatorio",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			"En base al enfoque aconsejado en la asignatura para la realización de pruebas de integración, suponiendo que un caso de prueba necesite insertar datos en la Base de Datos antes de invocar al caso de uso a probar (e.g. para probar un caso de uso que haga una búsqueda es necesario que en la Base de Datos haya datos sobre los que poder hacer la búsqueda), indique cómo debe crearlos:",
		options: [
			"a) Siempre debe utilizar los DAOs que ofrezcan las operaciones pertinentes.",
			"b) Si existen servicios de la capa Modelo que ofrezcan métodos adecuados para crear esos datos, debe utilizarlos.",
			"c) Debe ejecutar un script SQL que tenga las sentencias necesarias para insertar los datos.",
			"d) Debe ejecutar directamente las sentencias SQL necesarias, haciendo uso del API JDBC.",
		],
		correctAnswer: "b",
		explanation:
			"Se preparan los datos mediante los servicios del modelo cuando ofrecen operaciones adecuadas, para ejercitar su comportamiento y evitar acoplar la prueba a SQL o detalles de los DAOs.",
	},
	{
		id: "recopilatorio_clase_q6",
		examId: "recopilatorio",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			'Dado el siguiente documento JSON, indique cuál de las afirmaciones es correcta:\n\n```json\n[{ "title": "Learning Java", "formats": ["PDF", "EPUB"], "price": 1 }]\n```',
		options: [
			"a) Se trata de un array que tiene un único elemento de tipo objeto, y ese objeto tiene a su vez tres campos cuyos valores son de tipo string, array y número.",
			"b) Se trata de un array que tiene un único elemento de tipo objeto, y ese objeto tiene dos campos cuyos valores son de tipo string y un campo cuyo valor es de tipo número.",
			"c) Se trata de un objeto que tiene tres campos cuyos valores son de tipo string, array y número.",
			"d) Se trata de un objeto que tiene dos campos cuyos valores son de tipo string y un campo cuyo valor es de tipo número.",
		],
		correctAnswer: "a",
		explanation:
			"El valor raíz es un array con un objeto. Los campos title, formats y price contienen respectivamente una cadena, un array y un número.",
	},
	{
		id: "recopilatorio_clase_q7",
		examId: "recopilatorio",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			"Suponga que está diseñando un Servicio Web según el enfoque REST y que desea modelar una funcionalidad que permite a un usuario inscribirse en una carrera de running. Como datos de entrada, es necesario proporcionar el identificador de usuario, el identificador de la carrera y la tarjeta bancaria con la que se realizará el pago de la inscripción. Ya existe un recurso colección con el URL /carreras que representa a las carreras a las que se puede inscribir un usuario. ¿Qué opción de diseño escogería de acuerdo al enfoque estudiado en la asignatura?",
		options: [
			"a) El servicio permitirá inscribirse en una carrera con el identificador 5 haciendo una petición POST al URL /carreras/5 pasando los datos de entrada como parámetros de la petición.",
			"b) El servicio permitirá inscribirse en una carrera con el identificador 5 haciendo una petición PUT al URL /carreras/5/inscribir, pasando el resto de datos de entrada como parámetros de la petición.",
			"c) Las dos anteriores son válidas.",
			"d) El servicio permitirá inscribirse en una carrera haciendo una petición POST al URL /inscripciones pasando los datos de entrada como parámetros de la petición.",
		],
		correctAnswer: "d",
		explanation:
			"La inscripción se representa como un nuevo recurso de la colección /inscripciones y se crea mediante POST. Los datos identifican al usuario, la carrera y el medio de pago.",
	},
	{
		id: "recopilatorio_clase_q8",
		examId: "recopilatorio",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			"En el contexto de Servicios Web REST, suponga un intermediario genérico de cache. Asumiendo que ninguna respuesta enviada por el servicio indica explícitamente que no se puede cachear, diga que afirmación es correcta teniendo en cuenta las convenciones seguidas en la asignatura: Asuma que no hay instrucciones explícitas de frescura ni otras directivas que autoricen almacenar las respuestas.",
		options: [
			"a) Sería correcto que el intermediario cachease la respuesta a una petición GET /books/1234 que ha devuelto un código de respuesta 500 Internal Error.",
			"b) Sería correcto que el intermediario cachease la respuesta a una petición POST /books/ que ha devuelto un código de respuesta 500 Internal Error.",
			"c) Todas las anteriores.",
			"d) Ninguna de las anteriores.",
		],
		correctAnswer: "d",
		explanation:
			"El enunciado no aporta frescura explícita que permita almacenar un 500. Un 500 no es cacheable heurísticamente; la ausencia de una prohibición no basta para almacenarlo. Véase [RFC 9111](https://www.rfc-editor.org/rfc/rfc9111.html#section-3).",
	},
	{
		id: "recopilatorio_clase_q9",
		examId: "recopilatorio",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			"Dado el siguiente fragmento de un fichero de definición de la interfaz de un servicio Apache Thrift, indique qué afirmación NO es correcta:\n\n```thrift\nstruct Instance {\n  1: i64 instanceId\n  2: string description\n}\n```",
		options: [
			"a) Se corresponde con la declaración de un tipo definido por el usuario, que podrá utilizarse como tipo de los argumentos que recibe una función.",
			"b) Se corresponde con la declaración de un tipo definido por el usuario, llamado Instance, que tiene un campo de tipo entero de 64 bits y otro de tipo cadena.",
			"c) Se corresponde con la declaración de un tipo definido por el usuario, que podrá utilizarse como tipo de las excepciones que puede lanzar una función.",
			'd) Si se utiliza el compilador del IDL de Apache Thrift a Java, para este tipo definido por el usuario se generará una clase cuyo nombre será "Instance".',
		],
		correctAnswer: "c",
		explanation:
			"Un struct declara un tipo de datos, no una excepción de Thrift. Para declarar tipos utilizables en la cláusula throws se utiliza exception.",
		repeated: true,
	},
	{
		id: "recopilatorio_clase_q10",
		examId: "recopilatorio",
		topic: "general",
		type: "mc",
		points: 1,
		question:
			"Analice el siguiente fragmento de una clase de pruebas de integración de la capa Modelo, implementada con JUnit 5:\n\n```java\nprivate static ProductService productService = null;\n\n@BeforeAll\npublic static void init() {\n    // ...\n    productService = ProductServiceFactory.getService();\n}\n\nprivate void removeProduct(Long productId) {\n    productService.removeProduct(productId);\n}\n\n@Test\npublic void testCreateProductAndFindProduct()\n        throws InputValidationException, InstanceNotFoundException {\n    Product newProduct = getValidProduct();\n    Product createdProduct = productService.createProduct(newProduct);\n    try {\n        Product foundProduct =\n            productService.findProduct(createdProduct.getProductId());\n        assertEquals(/* ... */);\n        // ...\n        assertEquals(createdProduct, foundProduct);\n    } finally {\n        removeProduct(createdProduct.getProductId());\n    }\n}\n```\n\nEl método privado removeProduct se utiliza desde los casos de prueba que necesitan borrar productos creados por ellos. ProductService.removeProduct lanza la excepción comprobada InstanceNotFoundException si no existe el producto. Indique qué afirmación es correcta según el enfoque aconsejado en la asignatura para las pruebas de integración.",
		options: [
			"a) En la implementación del método privado removeProduct de la clase de pruebas debería declararse la excepción InstanceNotFoundException en la cláusula throws.",
			"b) En la implementación del método privado removeProduct de la clase de pruebas debería capturarse la excepción InstanceNotFoundException y relanzarse como una RuntimeException.",
			"c) En la implementación del método privado removeProduct de la clase de pruebas debería capturarse la excepción InstanceNotFoundException y continuar con la ejecución sin realizar ninguna acción en el bloque catch.",
			"d) La implementación del método privado removeProduct de la clase de pruebas es correcta tal y como está en el enunciado, y los casos de prueba desde los que se llame deben declarar la excepción InstanceNotFoundException en su cláusula throws (como se hace, por ejemplo, en el caso de prueba testCreateProductAndFindProduct mostrado en el enunciado).",
		],
		correctAnswer: "b",
		explanation:
			"El método auxiliar debe capturar InstanceNotFoundException y convertirla en un fallo inesperado mediante RuntimeException, según el enfoque de la asignatura. Así los casos de prueba no tienen que declarar una excepción de limpieza. Ignorarla ocultaría un fallo, y el código original no compila si no la captura o declara.",
	},
];
