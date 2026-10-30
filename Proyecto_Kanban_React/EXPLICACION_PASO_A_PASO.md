# Explicación detallada del proyecto final

## Qué se construyó
Se integraron los contenidos de las guías 1 a 6 en una aplicación Kanban. La interfaz está hecha con React y Vite; React se encarga de dibujar la pantalla mediante componentes. La API usa Node.js y Express para recibir solicitudes HTTP. MySQL almacena las tareas de manera persistente.

## Clase 1 — Fundamentos de React
Se organizó la interfaz en componentes:
- `TaskCard.jsx`: representa una tarea.
- `Column.jsx`: representa una columna y dibuja las tarjetas que contiene.
- `TaskForm.jsx`: formulario para crear una tarea.
- `columns.js`: lista única de estados permitidos para las columnas.

Los componentes reciben datos por `props` cuando corresponde. JSX combina estructura visual con expresiones JavaScript. `map()` permite crear tarjetas y opciones a partir de arreglos, y `key` ayuda a React a identificar cada elemento de una lista.

## Clase 2 — Estado y eventos
Los formularios y controles responden a eventos como `onSubmit`, `onChange` y `onClick`. Los campos son controlados por React. En lugar de modificar objetos directamente, el proyecto crea un nuevo arreglo al aplicar cambios; esto se llama inmutabilidad.

## Clase 3 — Efectos, hook personalizado y búsqueda
- `useEffect` se usa para cargar datos desde la API y actualizar el título de la pestaña cuando cambia la cantidad de tareas.
- `useMemo` conserva el resultado del filtro mientras no cambien las tareas o la consulta de búsqueda.
- `useLocalStorage` se incluye como ejemplo reutilizable de la guía 3. En la versión final las tareas viven en MySQL, así que no se usa como fuente principal de las tareas: usar dos fuentes de verdad produciría inconsistencias.

## Clase 4 — Context, useReducer y MySQL
`BoardContext.jsx` es el punto común desde el que las páginas y componentes consultan las tareas y llaman a operaciones. `useReducer` centraliza los cambios de estado. Las acciones (`set`, `add`, `move`, `edit`, `remove`) se procesan en `boardReducer.js`.

El reducer es una función pura: recibe un estado y una acción, devuelve un nuevo estado y no realiza llamadas HTTP ni modifica directamente el arreglo original. Las llamadas a la API están en `api.js` y en el contexto, no dentro del reducer.

La base de datos se define en `kanban-api/database.sql`. La tabla `tasks` tiene:
- `id`: identificador autoincremental.
- `title`: título obligatorio.
- `status`: `todo`, `doing` o `done`.
- `priority`: `alta`, `media` o `baja`.
- `created_at`: fecha de creación.

El navegador no se conecta directamente a MySQL. La ruta es:
`React (5173) → fetch/HTTP → Express (3001) → consultas parametrizadas → MySQL (3306)`.

## Clase 5 — Rutas y organización
React Router muestra una pantalla según la URL:
- `/`: tablero.
- `/stats`: estadísticas.
- `/tarea/:id`: detalle.
- `*`: pantalla 404.

`Link` y `NavLink` navegan sin recargar la página. `useParams` obtiene el ID de la URL. Las páginas completas están en `src/pages` y las piezas reutilizables en `src/components`.

Las estadísticas se calculan a partir de las tareas existentes; no se guardan por separado, así que se actualizan al cambiar las tareas.

## Clase 6 — Edición, entorno, pruebas y despliegue
La edición usa `PUT /api/tasks/:id` y cambia el título y la prioridad. Cambiar el estado usa `PATCH`; eliminar usa `DELETE`; crear usa `POST`; consultar usa `GET`.

Los valores configurables están en `.env`. La API lee `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `PORT` y `CORS_ORIGIN`. El frontend usa `VITE_API_URL`, que es una dirección pública, no un secreto. Los `.env` reales están ignorados por Git.

Vitest comprueba siete comportamientos del reducer: reemplazar lista, agregar, mover, editar, eliminar, conservar la inmutabilidad y devolver el mismo estado ante una acción desconocida.

## Cómo fluye una acción: ejemplo de crear una tarea
1. El usuario escribe un título y elige prioridad en `TaskForm`.
2. Al enviar, el formulario valida que el título no esté vacío.
3. `BoardContext` llama a `api.createTask`.
4. `api.js` envía un `POST /api/tasks` con JSON.
5. Express valida los datos y ejecuta un `INSERT` parametrizado.
6. MySQL crea la fila y genera el ID.
7. La API devuelve la tarea creada.
8. El contexto despacha la acción `add`.
9. El reducer crea el nuevo estado y React vuelve a dibujar el tablero.

Si falla la API, el contexto muestra el error y no actualiza la lista como si el cambio se hubiera guardado. Esto evita que la pantalla afirme algo que la base de datos no confirmó.

## Endpoints de la API
| Método | Ruta | Función |
|---|---|---|
| GET | `/api/tasks` | Listar tareas |
| POST | `/api/tasks` | Crear tarea |
| PATCH | `/api/tasks/:id` | Cambiar estado |
| PUT | `/api/tasks/:id` | Cambiar título y prioridad |
| DELETE | `/api/tasks/:id` | Eliminar tarea |

La API valida título, estado y prioridad. Usa `?` como marcador de los valores SQL; esto evita concatenar directamente datos enviados por el usuario y reduce el riesgo de inyección SQL.

## Guion breve para sustentar
“Mi proyecto es un tablero Kanban desarrollado con React. Lo dividí en componentes reutilizables y páginas con React Router. El estado global se administra con Context y useReducer. La información no se queda solo en el navegador: React llama a una API REST hecha con Express, y esta consulta MySQL. Puedo crear, buscar, mover, editar y eliminar tareas, consultar estadísticas y abrir el detalle de cada tarea. También agregué validaciones, variables de entorno y pruebas automáticas para comprobar que el reducer no altere el estado original. Para ejecutarlo localmente necesito XAMPP, la API y React encendidos.”

## Lista de comprobación para la entrega
- [ ] La base `kanban_db` y la tabla `tasks` existen en phpMyAdmin.
- [ ] `http://localhost:3001/api/tasks` devuelve JSON.
- [ ] El tablero carga las tareas.
- [ ] Crear, mover, editar y eliminar funcionan.
- [ ] La búsqueda filtra por título.
- [ ] Las estadísticas se actualizan.
- [ ] El detalle y la ruta 404 funcionan.
- [ ] `npm test` pasa las siete pruebas.
- [ ] `npm run build` termina sin errores.
- [ ] No se subieron archivos `.env`.
