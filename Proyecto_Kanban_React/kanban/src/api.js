const API = `${import.meta.env.VITE_API_URL ?? "http://localhost:3001"}/api/tasks`;
const JSON_HEADERS = { "Content-Type": "application/json" };

async function request(url, options = {}) {
  let response;
  try {
    response = await fetch(url, options);
  } catch {
    throw new Error("No se pudo conectar con la API. Verifica que kanban-api esté encendida.");
  }

  if (!response.ok) {
    let message = "Error en la solicitud";
    try {
      const data = await response.json();
      if (data?.error) message = data.error;
    } catch {
      // Algunas respuestas, como 204, no tienen JSON.
    }
    throw new Error(message);
  }

  if (response.status === 204) return null;
  return response.json();
}

export const getTasks = () => request(API);
export const createTask = (title, priority) =>
  request(API, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ title, priority }),
  });
export const moveTask = (id, status) =>
  request(`${API}/${id}`, {
    method: "PATCH",
    headers: JSON_HEADERS,
    body: JSON.stringify({ status }),
  });
export const updateTask = (id, title, priority) =>
  request(`${API}/${id}`, {
    method: "PUT",
    headers: JSON_HEADERS,
    body: JSON.stringify({ title, priority }),
  });
export const deleteTask = (id) =>
  request(`${API}/${id}`, { method: "DELETE" });
