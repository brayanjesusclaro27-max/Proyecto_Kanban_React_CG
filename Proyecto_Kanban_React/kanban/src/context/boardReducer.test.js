import { describe, expect, it } from "vitest";
import { reducer } from "./boardReducer.js";

const base = [
  { id: 1, title: "A", status: "todo", priority: "alta" },
  { id: 2, title: "B", status: "doing", priority: "baja" },
];

describe("reducer del tablero", () => {
  it("set reemplaza toda la lista", () => {
    const nueva = [{ id: 9, title: "Z", status: "done", priority: "media" }];
    expect(reducer(base, { type: "set", tasks: nueva })).toEqual(nueva);
  });

  it("add agrega la tarea al final", () => {
    const task = { id: 3, title: "C", status: "todo", priority: "media" };
    const result = reducer(base, { type: "add", task });
    expect(result).toHaveLength(3);
    expect(result[2]).toEqual(task);
  });

  it("move cambia solo el estado de la tarea indicada", () => {
    const result = reducer(base, { type: "move", id: 1, status: "done" });
    expect(result[0].status).toBe("done");
    expect(result[1].status).toBe("doing");
  });

  it("edit cambia título y prioridad", () => {
    const result = reducer(base, {
      type: "edit", id: 2, title: "B2", priority: "alta",
    });
    expect(result[1]).toMatchObject({ title: "B2", priority: "alta" });
  });

  it("remove elimina la tarea por id", () => {
    const result = reducer(base, { type: "remove", id: 1 });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(2);
  });

  it("no modifica el estado original (inmutabilidad)", () => {
    const copia = structuredClone(base);
    reducer(base, { type: "remove", id: 1 });
    expect(base).toEqual(copia);
  });

  it("una acción desconocida devuelve el mismo estado", () => {
    expect(reducer(base, { type: "otra" })).toBe(base);
  });
});
