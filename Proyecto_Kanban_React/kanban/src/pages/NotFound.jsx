import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="not-found panel">
      <span className="not-found-code">404</span>
      <h1>Esta página se perdió.</h1>
      <p>La dirección que escribiste no corresponde a una página de Kanban.</p>
      <Link className="button button-primary" to="/">Regresar al tablero</Link>
    </section>
  );
}
