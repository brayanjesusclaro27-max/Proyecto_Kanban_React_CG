import { Link } from "react-router-dom";
import { COLUMNS } from "../columns.js";
import { useBoard } from "../context/BoardContext.jsx";

export default function TaskCard({ task }) {
  const { moveTask, removeTask } = useBoard();

  return (
    <article className={`task-card priority-${task.priority}`}>
      <div className="task-card-top">
        <span className={`priority-label priority-label-${task.priority}`}>
          <span className="priority-dot" /> Prioridad {task.priority}
        </span>
        <span className="task-id">#{task.id}</span>
      </div>
      <h3><Link to={`/tarea/${task.id}`}>{task.title}</Link></h3>
      <div className="task-card-actions">
        <label className="sr-only" htmlFor={`status-${task.id}`}>Estado de {task.title}</label>
        <select
          id={`status-${task.id}`}
          value={task.status}
          onChange={(event) => moveTask(task.id, event.target.value)}
          aria-label={`Cambiar estado de ${task.title}`}
        >
          {COLUMNS.map((column) => <option key={column.id} value={column.id}>{column.title}</option>)}
        </select>
        <button className="icon-button" title={`Eliminar ${task.title}`} aria-label={`Eliminar ${task.title}`} onClick={() => {
          if (window.confirm(`¿Eliminar la tarea "${task.title}"?`)) removeTask(task.id);
        }}>×</button>
      </div>
    </article>
  );
}
