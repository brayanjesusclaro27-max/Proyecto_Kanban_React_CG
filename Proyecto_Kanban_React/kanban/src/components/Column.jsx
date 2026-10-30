import TaskCard from "./TaskCard.jsx";

const COLUMN_MARKS = { todo: "○", doing: "◷", done: "✓" };

export default function Column({ column, tasks }) {
  return (
    <section className={`board-column column-${column.id}`}>
      <header className="column-header">
        <div className="column-title">
          <span className="column-mark">{COLUMN_MARKS[column.id]}</span>
          <h2>{column.title}</h2>
        </div>
        <span className="count-badge">{tasks.length}</span>
      </header>
      <div className="column-content">
        {tasks.length === 0 ? (
          <div className="empty-column">No hay tareas todavía</div>
        ) : tasks.map((task) => <TaskCard key={task.id} task={task} />)}
      </div>
    </section>
  );
}
