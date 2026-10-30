import { COLUMNS, PRIORITIES } from "../columns.js";
import { useBoard } from "../context/BoardContext.jsx";

const PRIORITY_NAMES = { alta: "Alta", media: "Media", baja: "Baja" };

export default function Stats() {
  const { tasks, loading } = useBoard();
  if (loading) return <div className="loading-state"><span className="spinner" />Calculando estadísticas…</div>;

  const total = tasks.length;
  const done = tasks.filter((task) => task.status === "done").length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <section className="page-section">
      <div className="page-heading">
        <p className="eyebrow">DATOS EN TIEMPO REAL</p>
        <h1>Estadísticas</h1>
        <p>Un resumen del estado actual de tu trabajo.</p>
      </div>
      <div className="stats-grid">
        <article className="stat-card stat-total"><span>Total de tareas</span><strong>{total}</strong><small>Registradas en el tablero</small></article>
        <article className="stat-card stat-done"><span>Completadas</span><strong>{done}</strong><small>{pct}% del trabajo total</small></article>
        <article className="stat-card stat-progress"><span>En progreso</span><strong>{tasks.filter((task) => task.status === "doing").length}</strong><small>Tareas activas</small></article>
      </div>
      <div className="stats-panels">
        <section className="panel analytics-panel">
          <h2>Progreso general</h2>
          <div className="progress-meta"><span>Completado</span><strong>{pct}%</strong></div>
          <div className="progress-track"><div style={{ width: `${pct}%` }} /></div>
          <p className="muted">{done} de {total} tareas completadas.</p>
        </section>
        <section className="panel analytics-panel">
          <h2>Tareas por estado</h2>
          {COLUMNS.map((column) => {
            const count = tasks.filter((task) => task.status === column.id).length;
            return <div className="metric-row" key={column.id}><span>{column.title}</span><div className="metric-track"><div style={{ width: `${total ? count / total * 100 : 0}%` }} /></div><strong>{count}</strong></div>;
          })}
        </section>
        <section className="panel analytics-panel">
          <h2>Tareas por prioridad</h2>
          {PRIORITIES.map((priority) => {
            const count = tasks.filter((task) => task.priority === priority).length;
            return <div className="metric-row" key={priority}><span>{PRIORITY_NAMES[priority]}</span><div className={`metric-track priority-track priority-track-${priority}`}><div style={{ width: `${total ? count / total * 100 : 0}%` }} /></div><strong>{count}</strong></div>;
          })}
        </section>
      </div>
    </section>
  );
}
