import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { COLUMNS, PRIORITIES } from "../columns.js";
import { useBoard } from "../context/BoardContext.jsx";

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, loading, error, moveTask, removeTask, editTask } = useBoard();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("media");
  const [saving, setSaving] = useState(false);

  if (loading) return <div className="loading-state"><span className="spinner" />Cargando tarea…</div>;
  const task = tasks.find((item) => item.id === Number(id));
  if (!task) return <section className="not-found panel"><span className="not-found-code">404</span><h1>Tarea no encontrada</h1><p>No existe una tarea con el identificador {id}.</p><Link className="button button-primary" to="/">Volver al tablero</Link></section>;

  function startEdit() {
    setTitle(task.title);
    setPriority(task.priority);
    setEditing(true);
  }

  async function handleSave(event) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle || saving) return;
    setSaving(true);
    const ok = await editTask(task.id, cleanTitle, priority);
    if (ok) setEditing(false);
    setSaving(false);
  }

  async function handleRemove() {
    if (window.confirm(`¿Eliminar la tarea "${task.title}"?`)) {
      const ok = await removeTask(task.id);
      if (ok) navigate("/");
    }
  }

  return (
    <section className="page-section detail-page">
      <Link className="back-link" to="/">← Volver al tablero</Link>
      {error && <div className="alert" role="alert">{error}</div>}
      <article className="detail-card panel">
        <div className="detail-card-top"><span className={`priority-label priority-label-${task.priority}`}><span className="priority-dot" /> Prioridad {task.priority}</span><span className="task-id">TAREA #{task.id}</span></div>
        {editing ? (
          <form className="edit-form" onSubmit={handleSave}>
            <label htmlFor="edit-title">Título</label>
            <input id="edit-title" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={150} required autoFocus />
            <label htmlFor="edit-priority">Prioridad</label>
            <select id="edit-priority" value={priority} onChange={(event) => setPriority(event.target.value)}>
              {PRIORITIES.map((item) => <option key={item} value={item}>{item[0].toUpperCase() + item.slice(1)}</option>)}
            </select>
            <div className="detail-actions"><button className="button button-primary" disabled={saving || !title.trim()}>{saving ? "Guardando…" : "Guardar cambios"}</button><button className="button button-secondary" type="button" onClick={() => setEditing(false)}>Cancelar</button></div>
          </form>
        ) : (
          <>
            <p className="eyebrow">DETALLE DE TAREA</p><h1 className="detail-title">{task.title}</h1>
            <p className="detail-description">Consulta y actualiza el estado de esta tarea. Los cambios se guardan en la base de datos.</p>
            <div className="detail-field"><label htmlFor="detail-status">Estado actual</label><select id="detail-status" value={task.status} onChange={(event) => moveTask(task.id, event.target.value)}>{COLUMNS.map((column) => <option key={column.id} value={column.id}>{column.title}</option>)}</select></div>
            <div className="detail-actions"><button className="button button-primary" onClick={startEdit}>Editar tarea</button><button className="button button-danger" onClick={handleRemove}>Eliminar tarea</button></div>
          </>
        )}
      </article>
    </section>
  );
}
