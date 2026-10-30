import { useState } from "react";
import { PRIORITIES } from "../columns.js";
import { useBoard } from "../context/BoardContext.jsx";

export default function TaskForm() {
  const { addTask } = useBoard();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("media");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle || saving) return;
    setSaving(true);
    const ok = await addTask(cleanTitle, priority);
    if (ok) setTitle("");
    setSaving(false);
  }

  return (
    <form className="task-form panel" onSubmit={handleSubmit}>
      <div className="form-heading">
        <div>
          <p className="eyebrow">ORGANIZA TU TRABAJO</p>
          <h2>Nueva tarea</h2>
        </div>
        <span className="plus-mark" aria-hidden="true">+</span>
      </div>
      <label htmlFor="task-title">Título de la tarea</label>
      <input
        id="task-title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Ej. Diseñar la pantalla de inicio"
        maxLength={150}
        required
      />
      <label htmlFor="task-priority">Prioridad</label>
      <select id="task-priority" value={priority} onChange={(event) => setPriority(event.target.value)}>
        {PRIORITIES.map((item) => <option key={item} value={item}>{item[0].toUpperCase() + item.slice(1)}</option>)}
      </select>
      <button className="button button-primary" disabled={saving || !title.trim()}>
        {saving ? "Guardando…" : "Agregar tarea"}
      </button>
    </form>
  );
}
