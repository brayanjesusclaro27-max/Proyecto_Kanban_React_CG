import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";

const app = express();
const PORT = Number(process.env.PORT ?? 3001);
const allowedOrigin = process.env.CORS_ORIGIN ?? "https://proyecto-kanban-react-cg.vercel.app/";

app.use(cors({ origin: allowedOrigin }));
app.use(express.json({ limit: "20kb" }));

const pool = mysql.createPool({
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? "root",
  password: process.env.DB_PASSWORD ?? "",
  database: process.env.DB_NAME ?? "kanban_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const STATUS = ["todo", "doing", "done"];
const PRIORITY = ["alta", "media", "baja"];

const handle = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error del servidor. Revisa la terminal de la API." });
  }
};

function validId(id) {
  return /^\d+$/.test(String(id)) && Number(id) > 0;
}

app.get("/api/health", handle(async (_req, res) => {
  await pool.query("SELECT 1");
  res.json({ status: "ok", database: "connected" });
}));

app.get("/api/tasks", handle(async (_req, res) => {
  const [rows] = await pool.query(
    "SELECT id, title, status, priority, created_at FROM tasks ORDER BY id"
  );
  res.json(rows);
}));

app.post("/api/tasks", handle(async (req, res) => {
  const { title, priority = "media" } = req.body ?? {};
  if (typeof title !== "string" || !title.trim()) {
    return res.status(400).json({ error: "El título es obligatorio" });
  }
  if (title.trim().length > 150) {
    return res.status(400).json({ error: "El título no puede superar 150 caracteres" });
  }
  if (!PRIORITY.includes(priority)) {
    return res.status(400).json({ error: "Prioridad no válida" });
  }
  const [result] = await pool.query(
    "INSERT INTO tasks (title, priority) VALUES (?, ?)",
    [title.trim(), priority]
  );
  res.status(201).json({
    id: result.insertId,
    title: title.trim(),
    status: "todo",
    priority,
  });
}));

app.patch("/api/tasks/:id", handle(async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ error: "Identificador no válido" });
  const { status } = req.body ?? {};
  if (!STATUS.includes(status)) return res.status(400).json({ error: "Estado no válido" });
  const [result] = await pool.query(
    "UPDATE tasks SET status = ? WHERE id = ?",
    [status, req.params.id]
  );
  if (result.affectedRows === 0) {
    const [rows] = await pool.query("SELECT id FROM tasks WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: "Tarea no encontrada" });
  }
  res.json({ id: Number(req.params.id), status });
}));

app.put("/api/tasks/:id", handle(async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ error: "Identificador no válido" });
  const { title, priority } = req.body ?? {};
  if (typeof title !== "string" || !title.trim()) {
    return res.status(400).json({ error: "El título es obligatorio" });
  }
  if (title.trim().length > 150) {
    return res.status(400).json({ error: "El título no puede superar 150 caracteres" });
  }
  if (!PRIORITY.includes(priority)) return res.status(400).json({ error: "Prioridad no válida" });
  const [result] = await pool.query(
    "UPDATE tasks SET title = ?, priority = ? WHERE id = ?",
    [title.trim(), priority, req.params.id]
  );
  if (result.affectedRows === 0) {
    const [rows] = await pool.query("SELECT id FROM tasks WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: "Tarea no encontrada" });
  }
  res.json({ id: Number(req.params.id), title: title.trim(), priority });
}));

app.delete("/api/tasks/:id", handle(async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ error: "Identificador no válido" });
  const [result] = await pool.query("DELETE FROM tasks WHERE id = ?", [req.params.id]);
  if (result.affectedRows === 0) return res.status(404).json({ error: "Tarea no encontrada" });
  res.status(204).end();
}));

app.use((_req, res) => res.status(404).json({ error: "Ruta de API no encontrada" }));

const server = app.listen(PORT, () => {
  console.log(`API en http://localhost:${PORT}`);
  console.log(`Origen permitido para CORS: ${allowedOrigin}`);
});

async function shutdown() {
  console.log("Cerrando API…");
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
