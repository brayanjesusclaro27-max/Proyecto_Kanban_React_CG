import { useMemo, useState } from "react";
import Column from "../components/Column.jsx";
import TaskForm from "../components/TaskForm.jsx";
import { COLUMNS } from "../columns.js";
import { useBoard } from "../context/BoardContext.jsx";

export default function Board() {
  const { tasks, loading, error, refreshTasks } = useBoard();
  const [query, setQuery] = useState("");
  const filteredTasks = useMemo(
    () => tasks.filter((task) => task.title.toLowerCase().includes(query.toLowerCase().trim())),
    [tasks, query]
  );

  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">TU ESPACIO DE PRODUCTIVIDAD</p>
          <h1>Convierte tus planes<br /><span>en progreso.</span></h1>
          <p className="hero-copy">Organiza tareas, prioriza lo importante y sigue cada avance en un solo lugar.</p>
        </div>
        <div className="hero-stats">
          <div><strong>{tasks.length}</strong><span>Tareas totales</span></div>
          <div><strong>{tasks.filter((task) => task.status === "done").length}</strong><span>Completadas</span></div>
        </div>
      </section>
      <div className="workspace">
        <aside className="sidebar">
          <TaskForm />
          <div className="tip-card">
            <span className="tip-icon">✦</span>
            <h3>Un paso a la vez</h3>
            <p>Divide el trabajo en tareas pequeñas y mueve cada tarjeta a medida que avances.</p>
          </div>
        </aside>
        <section className="board-area">
          <div className="board-toolbar">
            <div>
              <p className="eyebrow">VISTA GENERAL</p>
              <h2>Tablero de tareas</h2>
            </div>
            <div className="search-wrap">
              <span aria-hidden="true">⌕</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar tareas…" aria-label="Buscar tareas" />
              {query && <button onClick={() => setQuery("")} aria-label="Limpiar búsqueda">×</button>}
            </div>
          </div>
          {error && <div className="alert" role="alert"><span>{error}</span><button onClick={refreshTasks}>Reintentar</button></div>}
          {loading ? (
            <div className="loading-state"><span className="spinner" />Cargando tareas desde la base de datos…</div>
          ) : (
            <div className="board">
              {COLUMNS.map((column) => (
                <Column key={column.id} column={column} tasks={filteredTasks.filter((task) => task.status === column.id)} />
              ))}
            </div>
          )}
          {!loading && query && filteredTasks.length === 0 && <p className="no-results">No hay tareas que coincidan con “{query}”.</p>}
        </section>
      </div>
    </>
  );
}
