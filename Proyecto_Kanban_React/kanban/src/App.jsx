import { useEffect } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import Board from "./pages/Board.jsx";
import Stats from "./pages/Stats.jsx";
import TaskDetail from "./pages/TaskDetail.jsx";
import NotFound from "./pages/NotFound.jsx";
import { useBoard } from "./context/BoardContext.jsx";

export default function App() {
  const { tasks } = useBoard();

  useEffect(() => {
    document.title = `Kanban (${tasks.length} tareas)`;
  }, [tasks]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink to="/" className="brand" aria-label="Kanban, inicio"><span className="brand-symbol"><i /><i /><i /></span><span>kanban<span className="brand-period">.</span></span></NavLink>
        <nav aria-label="Navegación principal">
          <NavLink to="/" end>Tablero</NavLink>
          <NavLink to="/stats">Estadísticas</NavLink>
        </nav>
        <div className="topbar-right"><span className="online-dot" /> <span>Espacio de trabajo</span></div>
      </header>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Board />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/tarea/:id" element={<TaskDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="footer"><span>kanban<span className="brand-period">.</span></span><span>Organiza mejor. Avanza cada día.</span></footer>
    </div>
  );
}
